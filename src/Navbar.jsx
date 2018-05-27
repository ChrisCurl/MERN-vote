// import {Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom';
const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;


export default class Navbar extends React.Component {
     constructor(){
        super();
        this.state = {
             signInUsername: '',
         }
    }
    
    componentDidMount() {
     //   this.setState({signInUsername: this.props.signInUsername})
    }
    
    render() {
        let welcomeMessage = '';
        if (this.props.signInName) {
            welcomeMessage = (<p className = {'links'}>Welcome {this.props.signInName}</p>)
        }
        let login;
        this.props.userIsLoggedIn ? login = (<Link className = {'links'} to = '/log-out'> Logout</Link>)
        : login = (<div><Link className = {'links'} to = '/sign-up'>Sign Up /</Link>   
                    <Link className = {'links'} to = '/log-in'> Login</Link> </div>)
        
        return (
            <div className = {'navbar'}>
            <div className = {'navSpacing'}>
            <div className = {'leftLinks'}>
            <a href = '/' className = {'links'}>Home /</a>
            <Link to = '/newPoll' className = {'links'}>  New Poll</Link>
            </div>
            {welcomeMessage}
            <div className = {'rightLinks'}>
            
            {login}
            </div>
            </div>
            </div>
            )
    }
    
}

