import React from 'react';
 import {Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom';


//using stateless functional component
const Navbar = (props) => {
    
    let about;
    
    if (props.showAboutState === false && props.signInName.length < 1 && props.location.pathname === '/') {
        about = (
            <p className = {'links'}>
               <a className = {'link'} onClick = {() => props.showAboutFunc()}> About </a>
            </p>
        )
    }
    
    let welcomeMessage;
        if (props.signInName.length > 1) {
            welcomeMessage = (<p className = {'links'}>Welcome {props.signInName}</p>)
        }
        let login, newPoll;
        if (props.userIsLoggedIn) { 
            login = (<Link className = {'links'} to = '/log-out'> Logout</Link>);
             newPoll = (<Link to = '/newPoll' className = {'links'}>/  New Poll</Link>);
        } else {
            login = (<div><Link className = {'links'} to = '/sign-up'>Sign Up /</Link>   
                    <Link className = {'links'} to = '/log-in'> Login</Link> </div>);
        }
        
           return (
            <div className = {'navbar'}>
                <div className = {'navSpacing'}>
                    <div className = {'leftLinks'}>
                        <a href = '/' className = {'links'}>Home </a>
                        {newPoll}
                    </div>
                     {about}
                     {welcomeMessage}
                    <div className = {'rightLinks'}>
                        {login}
                    </div>
                </div>
            </div>
            )
}

export default  Navbar;
