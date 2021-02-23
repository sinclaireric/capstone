import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { deleteProduct } from "../../func/productsfunc";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {



    if (!(await deleteProduct(event))) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'Product item does not exist'
            })
        };
    }

    return {
        statusCode: 202,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({})
    };








}
