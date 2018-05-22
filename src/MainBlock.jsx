// import {Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom';
const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

export default class MainBlock extends React.Component {
    
    render() {
       
      let polls = this.props.polls.slice().map(item => 
         <Link key = {item._id} to = {'/pollFound/' + item._id}> {item.question} </Link>
      );

      
        return (
           
            <div className = {'mainBlockBackground'}>
            <div className = {'mainBlock mainDiv'}>
            <h1>
            Mern Vote
            </h1>
            <h3>
            Create custom polls with live results.
            </h3>
            {polls}
            </div>
            <div className = {'logInArea mainDiv'}>
            Log in Area
            </div>
            </div>
            
           
        
            )
    }
}


//  <Route path = '/pollFound/:pollIDd' component = {PollResult} />

// <Route component = {PollResult} />