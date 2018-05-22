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
        
    }
    render() {
        return (
            <div className = {'navbar'}>
            <div className = {'navSpacing'}>
            <div className = {'leftLinks'}>
            <a href = '/' className = {'links'}>Home </a>
            <Link to = '/newPoll' className = {'links'}>  New Poll</Link>
            </div>
            
            <div className = {'rightLinks'}>
            <a className = {'links'} href = '#'>Sign Up</a>
            <a href = '#' className = {'links'}>Login</a>
            </div>
            </div>
            </div>
            )
    }
    
}

