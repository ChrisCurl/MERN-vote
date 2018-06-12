import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, Link, Redirect, BrowserRouter as Router } from 'react-router-dom';

import Navbar from './Navbar.jsx';
import MainBlock from './MainBlock.jsx';
import NewPoll from './NewPoll.jsx';
import PollResult from './PollResult.jsx';
import PageNotFound from './PageNotFound';
import SignUp from './Sign-up';
import Login from './Login';
import Logout  from './Logout';


class MainApp extends React.Component {
  
  constructor(){
        super()
        this.state = {
          polls: [],
          signInName: '',
          signInUsername: '',
          signInPassword: '',
          token: '',
          userIsLoggedIn: false,
          showAbout: false
        }
        this.loadData = this.loadData.bind(this);
        this.setSignInInfo = this.setSignInInfo.bind(this);
        this.setInStorage = this.setInStorage.bind(this);
        this.removeFromStorage = this.removeFromStorage.bind(this);
        this.showAbout = this.showAbout.bind(this);
  }

  componentDidMount() {
    // get polls from server
    this.loadData();
    // check user local storage for log in information
    this.validateSession();
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
    
  validateSession() {
    //get info from local storage and validate session token on server
    const obj = this.getFromStorage('MERN_Vote');
    if (obj) {
      fetch(`/sessionCheck?token=${obj.token}`)
      .then(res => res.json())
      .then(json => {
        if (json.sessionIsValid) {
            this.setState({signInName: obj.name, signInUsername: obj.username, signInPassword: obj.password, token: obj.token, userIsLoggedIn: true});
        } else {
          this.removeFromStorage('MERN_Vote');
          console.log('Session expired: Please log in again')
        }
      })
    }
  }
    
  getFromStorage(appName) {
    //get session from local storage
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
    //save user data to local storage
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
    //executed when user logs out
    localStorage.removeItem(tokenName);
  }
    
  setSignInInfo(name, username, password, token, userIsLoggedIn) {
    // Once user is validated, info is passed down to child components for various app functions.
    this.setState({
      signInName: name,
      signInUsername: username,
      signInPassword: password,
      token: token,
      userIsLoggedIn: userIsLoggedIn
    });
  }
  
  showAbout() {
    this.setState({showAbout: !this.state.showAbout})
  }
    
  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path = '/' render = {(props) => <MainBlock {...props} polls = {this.state.polls} username = {this.state.signInUsername} userIsLoggedIn = {this.state.userIsLoggedIn} showAboutFunc = {this.showAbout} showAboutState = {this.state.showAbout} />} />
              <Route path = '/pollFound' render = {(props) => <PollResult {...props} token = {this.state.token} polls = {this.state.polls}
              username = {this.state.signInUsername} loadData = {this.loadData} userIsLoggedIn = {this.state.userIsLoggedIn} showAboutFunc = {this.showAbout} /> } />
              <Route path = '/newPoll' render = {(props) => <NewPoll {...props}  loadData = {this.loadData} username = {this.state.signInUsername} token = {this.state.token} />}  />
              <Route path = '/sign-up' component = {SignUp}/>
              <Route path = '/log-in' render = {(props) => <Login {...props} setSignInInfo = {this.setSignInInfo} setInStorage = {this.setInStorage} />} />
              <Route path = '/log-out' render = {(props) => <Logout {...props} getFromStorage = {this.getFromStorage} setSignInInfo = {this.setSignInInfo} removeFromStorage = {this.removeFromStorage} />}/>
              <Route component = {PageNotFound} />
            </Switch>
            <Route render = {(props) => <Navbar {...props} signInName = {this.state.signInName} userIsLoggedIn = {this.state.userIsLoggedIn} showAboutFunc = {this.showAbout} showAboutState = {this.state.showAbout} />} />
          </div>
      </Router>
      )
  }
}

ReactDOM.render(<MainApp />, document.getElementById('app') );

    // https://www.reddit.com/r/FreeCodeCamp/comments/4nzpyk/my_voting_app_feedback_appreciated/
    
