// import React from 'react';
// import ReactDOM from 'react-dom';
// import {Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom';
// removed cdn links from index.html and import here before production push

// https://github.com/jaredhanson/passport-facebook#readme
// https://github.com/AndreiCalazans/voting-app/tree/master/app/components

// react routing video  https://www.youtube.com/watch?v=3B588JwyT18 https://reacttraining.com/react-router/web/api/Route/route-props
// auth https://medium.com/@Keithweaver_/building-a-log-in-system-for-a-mern-stack-39411e9513bd

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
import SignUp from './Sign-up';
import Login from './Log-in';
import Logout  from './Logout';
// new stuff


class MainApp extends React.Component {
  
  constructor(){
        super()
        this.state = {
          polls: [],
          signInName: '',
          signInUsername: '',
          signInPassword: '',
          token: '',
          userIsLoggedIn: false
        }
        this.loadData = this.loadData.bind(this);
        this.setSignInInfo = this.setSignInInfo.bind(this);
        this.setInStorage = this.setInStorage.bind(this);
        this.removeFromStorage = this.removeFromStorage.bind(this);
  }

  componentDidMount() {
    this.loadData();
    const obj = this.getFromStorage('MERN_Vote');
    this.getFromStorage('MERN_Vote') && this.setState({signInName: obj.name, signInUsername: obj.username, signInPassword: obj.password, token: obj.token, userIsLoggedIn: true});
    // const obj = this.getFromStorage('MERN_Vote');
    // if (obj) {
    //   this.setState({
    //       signInName: obj.name,
    //       signInUsername: obj.username,
    //       signInPassword: obj.password,
    //       token: obj.token,
    //       userIsLoggedIn: true
    //   });
    // }
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
    
  getFromStorage(appName) {
    try {
      const values = localStorage.getItem(appName);
      if (values) {
        return JSON.parse(values);
      }
    } catch (err) {
      return null;
    }
  }
  
  setInStorage(tokenName, tokenObj) {
    if (!tokenObj) {
      console.error('Token is missing');
    }
    try {
      localStorage.setItem(tokenName, JSON.stringify(tokenObj));
    } catch (err) {
      console.error(err);
    }
  }
  
  removeFromStorage(tokenName) {
    localStorage.removeItem(tokenName);
  }
    
  setSignInInfo(name, username, password, token, userIsLoggedIn) {
    this.setState({
      signInName: name,
      signInUsername: username,
      signInPassword: password,
      token: token,
      userIsLoggedIn: userIsLoggedIn
    });
  }
    
  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path = '/' render = {(props) => <MainBlock {...props} polls = {this.state.polls} />} />
              <Route path = '/pollFound/:pollId' render = {(props) => <PollResult {...props} polls = {this.state.polls} loadData = {this.loadData} /> } />
              <Route path = '/newPoll' render = {(props) => <NewPoll {...props} loadData = {this.loadData} /> }/>
              <Route path = '/sign-up' component = {SignUp}/>
              <Route path = '/log-in' render = {(props) => <Login {...props} setSignInInfo = {this.setSignInInfo} setInStorage = {this.setInStorage} />} />
              <Route path = '/log-out' render = {(props) => <Logout {...props} getFromStorage = {this.getFromStorage} setSignInInfo = {this.setSignInInfo} removeFromStorage = {this.removeFromStorage} />}/>
              <Route component = {PageNotFound} />
            </Switch>
            <Route render = {(props) => <Navbar {...props} signInName = {this.state.signInName} userIsLoggedIn = {this.state.userIsLoggedIn} />} />
          </div>
      </Router>
      )
  }
}

ReactDOM.render(<MainApp />, document.getElementById('app') );

    // https://www.reddit.com/r/FreeCodeCamp/comments/4nzpyk/my_voting_app_feedback_appreciated/
    
