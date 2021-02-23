import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import {createProduct} from "../../func/productsfunc";
import { CreateProductRequest } from '../../requests/CreateProductRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newProduct: CreateProductRequest = JSON.parse(event.body)



    if (!newProduct.name) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'name of product item is empty'
            })
        };
    }



    const newproductItem = await createProduct(event, newProduct);

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newproductItem
        })
    };





}
