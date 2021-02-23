import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {updateProduct} from "../../func/productsfunc";
import { UpdateProductRequest } from '../../requests/UpdateProductRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedProduct: UpdateProductRequest = JSON.parse(event.body)



    const updated = await updateProduct(event, updatedProduct);
    if (!updated) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'Product item does not exist'
            })
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({})
    }

}
