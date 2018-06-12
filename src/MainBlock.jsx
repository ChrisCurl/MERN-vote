import React from 'react';
 import {Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom';

// const Router = window.ReactRouterDOM.BrowserRouter;
// const Route =  window.ReactRouterDOM.Route;
// const Link =  window.ReactRouterDOM.Link;
// const Prompt =  window.ReactRouterDOM.Prompt;
// const Switch = window.ReactRouterDOM.Switch;
// const Redirect = window.ReactRouterDOM.Redirect;


export default class MainBlock extends React.Component {
    
    render() {
    // show recent polls from all users
    let polls = this.props.polls.slice().map(item => 
          ( <div key = {item.question}>   
            <Link key = {item._id} to = {'/pollFound?poll=' + item._id} className = {'pollLink'}> 
                <span className = {'qFont'}>Q: </span>{item.question}
                <br />
                <span className = {'postedByFont'}>{'Posted by ' +item.author}</span>
            </Link>
          </div>));
          
    // show about section
    let about;
    if (this.props.showAboutState === true) {
        about = (
              <div className = {'aboutMeDiv'}>
                <p>
                  <button onClick = {() => {this.props.showAboutFunc()}} className = {'close-thick'}> ✖ </button>
                </p>
                  <img src ="https://i.imgur.com/eowkrI6.jpg" />
                  
                    <p>
                        Hello! I'm Chris Curl. I'm from Richmond, VA and I'm a lifelong lover of technology.
                        In the summer of 2017 I challenged myself to learn about software development. In this self-study, 
                        I have had what I consider to be an intellectually fulfilling and personally rewarding experience. 
                        I am currently employed in IT support but would like to transfer into development in the near future.
                        Feel free to <a href = 'mailto:christopher.curl@gmail.com'>contact me</a> if you would like to chat, or if you have suggestions on how to mprove this website.
                    </p>
                    <p>
                        Thanks for stopping by, and I hope you enjoy MERN Vote :)
                    </p>
                        <a href = 'https://github.com/ChrisCurl'><i className="fab fa-github" target = '_blank'></i></a>
                </div>
            )
    }

    // show recent polls from user if logged in
        let myPollsArea;
        let myPolls = [];
        
        if (this.props.showAbout && !this.props.userIsLoggedIn) {
            return (
                <div onClick = {() => this.props.showAboutFunc()}>
                about me
                </div>
                )
        }
        
        if (this.props.userIsLoggedIn) {
            myPolls = this.props.polls.slice().map(item => { 
            if (item.author === this.props.username) {  
            return  <div key = {'userPoll' + item._id}>
                        <Link key = {item._id} to = {'/pollFound?poll=' + item._id} className = {'pollLink'}> 
                          <span className = {'qFont'}>Q: </span>{item.question}
                            <br />
                            <span className = {'postedByFont'}>{'Posted by ' +item.author}</span>
                        </Link> 
                    </div>
            }
            
            if (myPolls.length == 0) {
                myPolls = <p>No Polls</p>
            }
                                                         })
                                                         
            myPollsArea = ( 
                <div className = {'mainBlock'}>
                    <div className = {'myPollsTitleArea'}> 
                        <span className = {'myPollTitleMargin'}>My Polls</span>
                    </div>
                    {myPolls}
                </div>)
            }
      
        return (
            <div className = {'mainBlockBackground'}>
                <div className = {'mainBlock'}>
                    <div className = {'titleArea'}>
                        <span className = {'mernTitle '}>
                        Mern Vote
                        </span>
                        <h3>
                        Create custom polls with live results.
                        </h3>
                    </div>
                    {polls}
                </div>
                <div>
                    {about}
                    {myPollsArea}
                </div>
            </div>
            )
    }
}
