import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import bg from './images/bg.png'
import Auth from './auth/Auth'
import { EditProduct } from './components/EditProduct'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Products } from './components/Products'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>






                  <Segment style={{ padding: '2em 0em' }} vertical>


                      <Grid container stackable   >

                          <Grid.Row columns={!this.props.auth.isAuthenticated() ? 2 : 1} >


                              {!this.props.auth.isAuthenticated() &&

                              <Grid.Column style={{padding: 50}}>
                                  <img src={bg} style={{width: '100%', borderRadius: 16}}/>

                              </Grid.Column>

                              }

                              <Grid.Column style={{padding:50}}>
                                  <Router history={this.props.history}>
                                      {/*{this.generateMenu()}*/}

                                      {this.generateCurrentPage()}
                                  </Router>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                  </Segment>







      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {

    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Products {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/products/:productId/edit"
          exact
          render={props => {
            return <EditProduct {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
