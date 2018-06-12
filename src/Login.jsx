import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            userName: '',
            password: '',
            redirect: false,
            isError: false,
            isLoading: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.setState({isLoading: true});
        const form = document.forms.login;
        const logInObj = {
            userName: form.userName.value,
            password: form.password.value
        }
        
      //  server request below
      fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
       body: JSON.stringify(logInObj),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.props.setInStorage('MERN_Vote', { token: json.token, name: json.name, password: json.password, username: json.username});
          this.props.setSignInInfo(
                json.name,
                json.username,
                json.password,
                json.token,
                true
                );
                setTimeout(() => {
                    this.setState({isLoading: false});
                     this.setState({redirect: true});
                }, 300)
        } else {
            this.setState({isError: json.error});
            this.setState({isLoading: false});
            console.log(json.message)
        }
      });
  
    }
         
    render() {
        
        const isError = this.stateisError;
        const redirect = this.state.redirect;
        const isLoading = this.state.isLoading;
        
        if (isLoading) {
            return (
                    <div className = {'loaderBackground'}>
                        <div className="loader">
                        </div>
                   </div>
                    )

        } else if (isError) {
            return <div> Error Logging in, please try again. </div>
        }
        else if (redirect) {
            return <Redirect to = '/' />;
        }
        
        return (
        <div className = {'mainBlockBackground'}>    
        <div className = {'signUpDiv'}>
            <form name = 'login' onSubmit = {this.handleSubmit} autoComplete = 'on'>
            <legend>Log In</legend>
            <hr />
            <p>
            <label htmlFor = 'userName'>Username</label>
            <input required type = 'text' name = 'userName'  placeholder = 'Username' onChange = {this.handleChange} autoComplete = 'username' />
            </p>
            <p>
            <label htmlFor = 'password'>Password</label>
            <input required type = 'password' name = 'password'  placeholder = '******' onChange = {this.handleChange} autoComplete = 'current-password'  />
            </p>
            <p>
            <input type = 'submit' className = {'submitBtn'} />
            </p>
            </form>
        </div>
        </div>
        )
    }
}