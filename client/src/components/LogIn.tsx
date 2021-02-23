import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import aut from '../images/auth.png'
import logo from '../images/logo.png'
interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div style={{display:'flex',alignItems:'center',height: '100%',justifyContent:'center',flexDirection:'column'}}>

          <img src={logo} width={90}   />

        <h1 style={{margin:0}}>  Sempos  </h1>

          <h3 style={{marginBottom:70}}>Manage products of your store easily</h3>

        <Button onClick={this.onLogin} size="huge" style={{ display:'flex',alignItems:'center', justifyContent:'center', backgroundColor:"#fff",border:"2px solid #eb5424"}} >
        Log in with <img src={aut} width={90} style={{marginLeft:10}} />
        </Button>
      </div>
    )
  }
}
