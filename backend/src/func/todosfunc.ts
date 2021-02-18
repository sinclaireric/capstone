import 'source-map-support/register';
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()

import { getUserId } from '../lambda/utils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoItem } from '../models/TodoItem';


export async function createTodo(event: APIGatewayProxyEvent,
                                 createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4();
    const userId = getUserId(event);
    const createdAt = new Date(Date.now()).toISOString();

    const todoItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${todoId}`,
        ...createTodoRequest
    };


    await docClient.put({
        TableName: process.env.TODOS_TABLE,
        Item: todoItem
    }).promise();



    return todoItem;
}



export async function getTodos(event: APIGatewayProxyEvent) {


    const userId = getUserId(event);

    const result = await docClient.query({
        TableName: process.env.TODOS_TABLE,
        IndexName: process.env.INDEX_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise();

    return result.Items



}

export async function updateTodo(event: APIGatewayProxyEvent,
                                 updateTodoRequest: UpdateTodoRequest) {


    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);





    try {


        await docClient.get({
            TableName: process.env.TODOS_TABLE,
            Key: {
                todoId,
                userId
            }
        }).promise();


        await docClient.update({
            TableName: process.env.TODOS_TABLE,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
            ExpressionAttributeValues: {
                ':n': updateTodoRequest.name,
                ':due': updateTodoRequest.dueDate,
                ':d': updateTodoRequest.done
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            }
        }).promise();

        return true


    } catch (e) {

        return false

    }


}

export async function deleteTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);




    try {
        await docClient.get({
            TableName: process.env.TODOS_TABLE,
            Key: {
                todoId,
                userId
            }
        }).promise();


        await docClient.delete({
            TableName: process.env.TODOS_TABLE,
            Key: {
                todoId,
                userId
            }
        }).promise();

        return true

    }
    catch (e) {


        return false

    }


}




export async function generateUploadUrl(event: APIGatewayProxyEvent) {
    const bucket = process.env.S3_BUCKET;
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
    const todoId = event.pathParameters.todoId;

    const s3  = new AWS.S3({signatureVersion:'v4'})

    const createSignedUrlRequest = {
        Bucket: bucket,
        Key: todoId,
        Expires: urlExpiration
    }

   return s3.getSignedUrl('putObject', createSignedUrlRequest);


}