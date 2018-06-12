import React from 'react';
import { Redirect } from 'react-router-dom';

export default class NewPoll extends React.Component {
     constructor(){
        super()
        
        this.state = {
            redirect: false,
            error: ''
        }
      this.createPoll = this.createPoll.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.createPoll = this.createPoll.bind(this);
      this.parseOptions = this.parseOptions.bind(this);
    }
    
    createPoll(newPoll) {
        fetch('/api/newPoll', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newPoll),
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedPoll => {
                  if (updatedPoll.success) {
                      this.props.loadData();
                      this.setState({redirect: true})
                  } else {
                      this.setState({error: updatedPoll.message})
                  }
                });
            } else {
                response.json().then(error => {
                    alert('failed to add issue' + error)
                });
            }
        }).catch(err => {
            alert('error communicating to back end' + err);
        });
    }
    
    parseOptions(options) {
        let optionObj = {};
        options.split(',').map(item => {optionObj[item] = 0});
        return optionObj;
    }
    
    handleSubmit(event){
      event.preventDefault();
      let form = document.forms.newPoll;
      this.createPoll({
          question: form.question.value, 
          options: this.parseOptions(form.options.value), 
          author: this.props.username,
          token: this.props.token,
          date: new Date(),
          isNewPoll: true
          });
      form.question.value = '';
      form.options.value = '';
    }
    
    render() {
        const { redirect } = this.state;
        
        if (redirect) {
            return <Redirect to = '/' />
        }
        
        return (
                <div className = {'mainBlockBackground'}>
                    <div className = {'signUpDiv'}>
                        {this.state.error}
                            <form name = 'newPoll'  onSubmit = {this.handleSubmit}>
                                <p>
                                    <label htmlFor = 'question'>Question</label>
                                    <input name = 'question' required/>
                                </p>
                                <p>
                                    <label htmlFor = 'options' >Options</label>
                                    <input name = 'options' required placeholder = 'seperate by a comma'/>
                                </p>
                                <button className = {'submitBtn'}>Sumbit</button>
                            </form>
                    </div>
                </div>
            )
    }
}


