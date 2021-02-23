import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Label, Menu, Table,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createProduct, deleteProduct, getProducts, patchProduct } from '../api/products-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'

interface productsProps {
  auth: Auth
  history: History
}

interface productsState {
  products: Product[]
  newProductName: string
  loadingproducts: boolean
}

export class Products extends React.PureComponent<productsProps, productsState> {
  state: productsState = {
    products: [],
    newProductName: '',
    loadingproducts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductName: event.target.value })
  }

  onEditButtonClick = (ProductId: string) => {
    this.props.history.push(`/products/${ProductId}/edit`)
  }

  onProductCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newProduct = await createProduct(this.props.auth.getIdToken(), {
        name: this.state.newProductName,
      })
      console.log(newProduct)
      this.setState({
        products: [...this.state.products, newProduct],
        newProductName: ''
      })
    } catch {
      alert('Product creation failed')
    }
  }

  onProductDelete = async (ProductId: string) => {
    try {
      await deleteProduct(this.props.auth.getIdToken(), ProductId)
      this.setState({
        products: this.state.products.filter(Product => Product.productId != ProductId)
      })
    } catch {
      alert('Product deletion failed')
    }
  }



  async componentDidMount() {
    try {
      const products = await getProducts(this.props.auth.getIdToken())
      this.setState({
        products,
        loadingproducts: false
      })
    } catch (e) {
      alert(`Failed to fetch products: ${e.message}`)
    }
  }

  render() {
    return (
        <div>
          <Header as="h1">Products</Header>

          {this.renderCreateProductInput()}

          {this.renderproducts()}
        </div>
    )
  }

  renderCreateProductInput() {
    return (
        <Grid.Row>
          <Grid.Column width={16}>
            <Input
                action={{
                  color: 'teal',
                  labelPosition: 'left',
                  icon: 'add',
                  content: 'New task',
                  onClick: this.onProductCreate
                }}
                fluid
                actionPosition="left"
                placeholder="To change the world..."
                onChange={this.handleNameChange}
            />
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>
    )
  }

  renderproducts() {
    if (this.state.loadingproducts) {
      return this.renderLoading()
    }

    return this.renderproductsList()
  }

  renderLoading() {
    return (
        <Grid.Row>
          <Loader indeterminate active inline="centered">
            Loading Products
          </Loader>
        </Grid.Row>
    )
  }

  renderproductsList() {
    return (



        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Sale price</Table.HeaderCell>
              <Table.HeaderCell>Supply Price</Table.HeaderCell>
              <Table.HeaderCell>Created at</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>

            {this.state.products.map((product, pos) =>


              <Table.Row>
                <Table.Cell>
                  {product.attachmentUrl && (
                      <Image src={product.attachmentUrl} size="small" wrapped />
                  )}

                </Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.saleprice}</Table.Cell>
                <Table.Cell>{product.suplyprice}</Table.Cell>
                <Table.Cell> {product.createdAt}</Table.Cell>
              </Table.Row>



            )}






          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='3'>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron left' />
                  </Menu.Item>
                  <Menu.Item as='a'>1</Menu.Item>
                  <Menu.Item as='a'>2</Menu.Item>
                  <Menu.Item as='a'>3</Menu.Item>
                  <Menu.Item as='a'>4</Menu.Item>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron right' />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>










    )
  }


}