import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {generateUploadUrl} from "../../func/todosfunc";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    const signedUrl = await generateUploadUrl(event);

    return {
        statusCode: 202,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl: signedUrl
        })
    };




}
