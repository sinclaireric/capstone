import 'source-map-support/register';
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const docClient = new XAWS.DynamoDB.DocumentClient();

import { getUserId } from '../lambda/utils';
import { CreateProductRequest } from '../requests/CreateProductRequest';
import { UpdateProductRequest } from '../requests/UpdateProductRequest';
import { ProductItem } from '../models/ProductItem';


export async function createProduct(event: APIGatewayProxyEvent,
                                 createProductRequest: CreateProductRequest): Promise<ProductItem> {
    const productId = uuid.v4();
    const userId = getUserId(event);
    const createdAt = new Date(Date.now()).toISOString();

    const productItem = {
        userId,
        productId,
        createdAt,
        attachmentUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${productId}`,
        ...createProductRequest
    };


    await docClient.put({
        TableName: process.env.PRODUCTS_TABLE,
        Item: productItem
    }).promise();



    return productItem;
}



export async function getProducts(event: APIGatewayProxyEvent) {


    const userId = getUserId(event);

    const result = await docClient.query({
        TableName: process.env.PRODUCTS_TABLE,
        IndexName: process.env.INDEX_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise();

    return result.Items



}

export async function updateProduct(event: APIGatewayProxyEvent,
                                 updateProductRequest: UpdateProductRequest) {


    const productId = event.pathParameters.productId;
    const userId = getUserId(event);





    try {


        await docClient.get({
            TableName: process.env.PRODUCTS_TABLE,
            Key: {
                productId,
                userId
            }
        }).promise();


        await docClient.update({
            TableName: process.env.PRODUCTS_TABLE,
            Key: {
                productId,
                userId
            },
            UpdateExpression: 'set #name = :n',
            ExpressionAttributeValues: {
                ':n': updateProductRequest.name
            },
            ExpressionAttributeNames: {
                '#name': 'name',
            }
        }).promise();

        return true


    } catch (e) {

        return false

    }


}

export async function deleteProduct(event: APIGatewayProxyEvent) {
    const productId = event.pathParameters.productId;
    const userId = getUserId(event);




    try {
        await docClient.get({
            TableName: process.env.PRODUCTS_TABLE,
            Key: {
                productId,
                userId
            }
        }).promise();


        await docClient.delete({
            TableName: process.env.PRODUCTS_TABLE,
            Key: {
                productId,
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
    const productId = event.pathParameters.productId;

    const s3  = new XAWS.S3({ signatureVersion: 'v4'})

    const createSignedUrlRequest = {
        Bucket: bucket,
        Key: productId,
        Expires: urlExpiration
    }

   return s3.getSignedUrl('putObject', createSignedUrlRequest);


}