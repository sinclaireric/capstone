import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import logo from '../images/logo.png'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Label, Menu, Table,
  Icon,
    Modal,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createProduct, deleteProduct, getProducts, patchProduct } from '../api/products-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'
import {Link} from "react-router-dom";
import {number} from "prop-types";

interface productsProps {
  auth: Auth
  history: History
}

interface productsState {
  products: Product[]
  newProductName: string
  loadingproducts: boolean
  open:boolean
  salePrice:number
  suplyPrice:number
}

export class Products extends React.PureComponent<productsProps, productsState> {
  state: productsState = {
    products: [],
    newProductName: '',
    loadingproducts: true,
    open:false,
    salePrice:0,
    suplyPrice:0
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductName: event.target.value })
  }


  handleSalePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ salePrice: parseInt(event.target.value) })
  }

  handleSuplyPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ suplyPrice: parseInt(event.target.value) })
  }

  onEditButtonClick = (ProductId: string) => {
    this.props.history.push(`/products/${ProductId}/edit`)
  }

  onProductCreate = async () => {
    try {
      const newProduct = await createProduct(this.props.auth.getIdToken(), {
        name: this.state.newProductName,
        saleprice:this.state.salePrice,
        suplyprice:this.state.suplyPrice
      })
      console.log(newProduct)
      this.setState({
        products: [...this.state.products, newProduct],
        newProductName: '',
        open:false
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


  setOpen = (i:boolean) => {

    this.setState ({
      open:i
    })

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
        <div style={{marginTop:-60}}>

          <Menu style={{border:0,boxShadow:'none',alignItems:'center'}}>
            <Menu.Item name="home">
              <Link to="/"><img src={logo} height={60} width={50}  />  </Link>
            </Menu.Item>

            <Menu.Menu position="right">

              <h4 onClick={()=>this.props.auth.logout()} style={{color:'red',cursor:'pointer'}}> log out </h4>
            </Menu.Menu>
          </Menu>



          {this.renderCreateProductInput()}

          {this.renderproducts()}





          <Modal
              onClose={() => this.setOpen(false)}
              onOpen={() => this.setOpen(true)}
              open={this.state.open}
              size={"tiny"}
          >
            <Modal.Header>Add a product</Modal.Header>
            <Modal.Content >
              <Modal.Description style={{padding:40}}>



                <Input

                    fluid
                    label={"name"}
                    actionPosition="left"
                    placeholder="To change the world..."
                    onChange={this.handleNameChange}
                />

                <Input
                    style={{marginTop:30, marginBottom:30}}
                    fluid
                    label={"sale price"}
                    placeholder="To change the world..."
                    onChange={this.handleSalePriceChange}
                />


                <Input

                    fluid
                    label={"suply price"}
                    placeholder="To change the world..."
                    onChange={this.handleSuplyPriceChange}
                />


              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => this.setOpen(false)}>
                Cancel
              </Button>
              <Button
                  content="Add product"
                  labelPosition='right'
                  icon='checkmark'
                  onClick={this.onProductCreate}
                  positive
              />
            </Modal.Actions>
          </Modal>


        </div>
    )
  }




  renderCreateProductInput() {
    return (
        <Grid.Row columns={2}>

          <Grid.Column width={8}>
            <Header as="h1">Products</Header>
          </Grid.Column>

          <Grid.Column width={8}>
            <Button size={"large"} onClick={() => this.setOpen(true)} icon='checkmark' positive>Add a new product</Button>
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

<React.Fragment>


        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Sale price</Table.HeaderCell>
              <Table.HeaderCell>Supply Price</Table.HeaderCell>
              <Table.HeaderCell>Created at</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>

            {this.state.products.map((product, pos) =>


              <Table.Row>
                <Table.Cell>
                  {product.attachmentUrl && (
                      <Image src={product.attachmentUrl} size="small" wrapped  height={70} width={70} />
                  )}

                </Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.saleprice}</Table.Cell>
                <Table.Cell>{product.suplyprice}</Table.Cell>
                <Table.Cell> {dateFormat(product.createdAt, 'yyyy-mm-dd')}</Table.Cell>

                <Table.Cell style={{display:'block'}}>

                  <div style={{display:'flex',flexDirection:'column'}}>
                  <Button size={"small"} style={{marginBottom:15}} positive onClick={()=>this.onEditButtonClick(product.productId)} > EDIT </Button>


                  <Button size={"small"} negative  onClick={()=>this.onProductDelete(product.productId)} > DELETE </Button>

                  </div>
                </Table.Cell>

              </Table.Row>



            )}






          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='6'>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron left' />
                  </Menu.Item>
                  <Menu.Item as='a'>1</Menu.Item>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron right' />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

</React.Fragment>








    )
  }


}