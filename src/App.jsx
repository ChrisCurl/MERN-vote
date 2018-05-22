// import React from 'react';
// import ReactDOM from 'react-dom';
// import {Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom';
// removed cdn links from index.html and import here before production push

// https://github.com/jaredhanson/passport-facebook#readme
// https://github.com/AndreiCalazans/voting-app/tree/master/app/components

// react routing video  https://www.youtube.com/watch?v=3B588JwyT18 https://reacttraining.com/react-router/web/api/Route/route-props

// authentication https://forum.freecodecamp.org/t/add-authentication-for-react-app/76002
const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

import Navbar from './Navbar.jsx';
import MainBlock from './MainBlock.jsx';
import NewPoll from './NewPoll.jsx';
import PollResult from './PollResult.jsx';
import PageNotFound from './PageNotFound';
// new stuff


class MainApp extends React.Component {
  
  constructor(){
        super()
        this.state = {
            polls: [],
        }
        this.loadData = this.loadData.bind(this);
    }

  componentDidMount() {
    this.loadData();
  }
  
  loadData() {
        fetch('/polls').then(response => 
             response.json()).then(data => {
                 let tempPolls = [];
                 data.polls.forEach(item => tempPolls.push(item));
                    console.log(`Got ${data.polls.length} polls from the server`);
                    this.setState({polls: tempPolls});
             })

    }
    
  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path = '/' render = {(props) => <MainBlock {...props} polls = {this.state.polls} />} />
              <Route path = '/pollFound/:pollId' render = {(props) => <PollResult {...props} polls = {this.state.polls} loadData = {this.loadData} /> } />
              <Route path = '/newPoll' render = {(props) => <NewPoll {...props} loadData = {this.loadData} /> }/>
              <Route component = {PageNotFound} />
            </Switch>
            <Route component = {Navbar} />
          </div>
      </Router>
      )
  }
}

ReactDOM.render(<MainApp />, document.getElementById('app') );

    // https://www.reddit.com/r/FreeCodeCamp/comments/4nzpyk/my_voting_app_feedback_appreciated/
    