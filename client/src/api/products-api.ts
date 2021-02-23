import { apiEndpoint } from '../config'
import { Product } from '../types/Product';
import { CreateProductRequest } from '../types/CreateProductRequest';
import Axios from 'axios'
import { UpdateProductRequest } from '../types/UpdateProductRequest';

export async function getProducts(idToken: string): Promise<Product[]> {
  console.log('Fetching products')

  const response = await Axios.get(`${apiEndpoint}/products`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Products:', response.data)
  return response.data.items
}

export async function createProduct(
  idToken: string,
  newProduct: CreateProductRequest
): Promise<Product> {
  const response = await Axios.post(`${apiEndpoint}/products`,  JSON.stringify(newProduct), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchProduct(
  idToken: string,
  todoId: string,
  updatedProduct: UpdateProductRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/products/${todoId}`, JSON.stringify(updatedProduct), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteProduct(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/products/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/products/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
