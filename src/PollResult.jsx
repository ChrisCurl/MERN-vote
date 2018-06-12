import Chart from './Chart';
import React from 'react';
import { Redirect } from 'react-router-dom';

export default class PollResult extends React.Component {
    constructor() {
        super()
        this.state = {
            pollShown: '',
            author: '',
            options: [],
            values: [],
            questions: [],
            answers: [],
            isLoading: true,
            error: '',
            Redirect: false,
            valueToBeUpdated: '',
            userWhoisVotingIP: '',
            userMayEdit: false,
            newOption: ''
            
        }
        this.createUpdatedPoll = this.createUpdatedPoll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updatePoll = this.updatePoll.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
   
   // new lifecycle method to replace componentWillMount and compnentDidReieveProps
    static getDerivedStateFromProps(nextProps, prevState) {
     if (nextProps.polls.length === 0) {
         return ({isLoading: true});
     } else {
        const pollStr = nextProps.location.search;
        const poll = nextProps.location.search.substr(pollStr.indexOf('=') + 1);
        let pollShown = nextProps.polls.find(item => {
        return item._id === poll;
        });
        let tempOptions = [];
        let tempValues = [];
        let tempQuestions = [];
        let tempAnswers = [];
        let userMayEdit = false;
        for (let key in pollShown.options) {
            tempOptions.push(<span  key = {key}><input required type = 'radio' name = 'updatedValue' value = {key} /><label> {key}  </label> <br /></span>);
          //  tempValues.push(<li key = {key}>{key}: {pollShown.options[key]}</li>);
            tempQuestions.push(key);
            tempAnswers.push(pollShown.options[key]);
                                          }
                                          
        if (nextProps.username === pollShown.author) {
            userMayEdit = true;
        }                                 
                                          
      return({pollShown: pollShown,
              options: tempOptions,
              answers: tempAnswers,
              questions: tempQuestions,
              values: tempValues,
              isLoading: false,
              userMayEdit: userMayEdit
             });
     }
     }
     
      componentDidMount() {
         this.determineWhoIsVoting();
     }
     
     
      determineWhoIsVoting() {
          //set username to IP address if not username is given, anonymous users can only vote once
        let address = '';
        fetch('https://api.ipdata.co/')
        .then(response => response.json())
        .then(json => {
            if (this.props.username.length === 0) {
                address = json.ip.replace(/\./g, '_');
                this.setState({userWhoisVotingIP: address})
            } else {
              //  this.setState({userWhoisVotingIP: this.props.username});
            }
        })
        
     }
     
      componentDidUpdate() {
            twttr.widgets.load(
            document.getElementById('twitBtn')    
            );
     }
    
      createUpdatedPoll(newVal) {
          // deep clone object
          let newPoll = JSON.parse(JSON.stringify(this.state.pollShown));
          for (let key in newPoll.options) {
              key === newVal &&newPoll.options[newVal] ++
          }
          newPoll.token = this.props.token;
          newPoll.userWhoisVotingIP = this.props.username;
          newPoll.userWhoisVotingIP = this.state.userWhoisVotingIP;
          newPoll.newOption = this.state.newOption;
          return newPoll;
          }
    
      updatePoll(updatedPoll){
          fetch('/updatePoll', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(updatedPoll)
          }).then(response => {
              if (response.ok) {
                  response.json().then(updatedPoll => {
                      if (updatedPoll.success) {
                          this.props.loadData();
                      } else {
                          this.errorDislay(updatedPoll.message);
                      }
                  })
              } else {
                  response.json().then(error => {
                      alert('failed to update issue ' + error)
                  });
              }
              }).catch(err => {
                  alert('error communicating to back end' + err);
          });
      } 
      
      handleSubmit(event) {
          event.preventDefault();
          let updatedValue = document.forms.updatedPoll.updatedValue.value;
          this.setState({valueToBeUpdated: updatedValue}, () => {
              let newPoll = this.createUpdatedPoll(updatedValue);
              this.updatePoll(newPoll);
          });
        }
        
      handleNewOption(event) {
          // collect new poll options before poll can be sent
          event.preventDefault();
          let val = document.forms.addNewOption.newOption.value;
          this.setState({newOption: val}, () => {
              let newPoll = this.createUpdatedPoll();
              newPoll.options[val] = 0;
              newPoll.isAddingOption = true;
              this.updatePoll(newPoll)
          });
      }
      
      errorDislay(res) {
          setTimeout(() => {
                this.setState({error: res})
                setTimeout(() => {
                    this.setState({error: ''})
                }, 2000)
          }, 0)
      }
        
      handleDelete() {
          fetch('/deletePoll/' , {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({token: this.props.token, question: this.state.pollShown.question})
          }).then(response => {
              response.json().then(deleteRes => {
                  if (deleteRes.success) {
                      this.props.loadData();
                      this.setState({Redirect: true})
                  } else {
                      this.errorDislay(deleteRes.message);
                  }
              })
          })
      }

   render() {
       
       
       let redirect = this.state.Redirect;
       if (redirect) {
         return  <Redirect to = '/' />
        }
        
       //show tweet button when user logged in
       let tweet = '';
       if (this.props.userIsLoggedIn) {
           tweet =  <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" id = 'twitBtn' className="twitter-share-button" 
            data-text = {this.state.pollshown} data-hashtags = 'MERN_Vote' data-show-count="false">Tweet</a>
       } else {
           tweet = ''
       }
       //end tweet stuff
       
       let newOption;
       let deleteBtn;
       
       if (this.state.userMayEdit) {
           deleteBtn = (
             <button onClick = {this.handleDelete} className = {'deleteBtn'}> Delete Poll </button>
               );
           newOption = (
            <div>
            <form name = 'addNewOption'>
                <label>Add a new Option</label>
                <input name = 'newOption' className = {'newOption'} />
                <input type = 'submit' onClick = {(e) => this.handleNewOption(e)}  />
                </form>
            </div> 
            );
       };
       
        if (this.state.isLoading) {
            return ( 
                <div className = {'mainBlockBackground'}> 
                   <h2> Component loading... </h2>
                </div>
            )
            } else {
               return (
                   <div className = {'mainBlockBackground'}>
                     <div className = 'pollResult'>
                        <div className = 'pollInfo'>
                           <p> <span className = {'pollTitleFont'}>  {this.state.pollShown.question}</span> 
                           <br />
                           <span className = {'postedByResultFont'}>  Posted by {this.state.pollShown.author} </span>
                           </p>
                            <hr />
                          <p className = {'text-muted'}> Choose one. </p>
                            <form name = 'updatedPoll' onSubmit = {this.handleSubmit}>
                                {this.state.options}
                                <button type = 'submit' className = {'submitBtnPollResult'}>Vote</button>
                            </form>
                              {this.state.error}
                              {this.state.values}
                              <br />
                              {deleteBtn}
                              <br />
                              <div>
                                {newOption}
                              </div>
                        </div>
                        <div className = {'chartInfo'}>
                       <p> <i className="fas fa-chart-pie"></i> Results </p>
                       {tweet}
                       <hr />
                      <Chart questions = {this.state.questions} answers = {this.state.answers}/>

                        </div>
                    </div>
                </div>   
         ); 
            }
     }
  }
 

          
