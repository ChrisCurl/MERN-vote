//https://gvpy.herokuapp.com/users/login

export default class NewPoll extends React.Component {
     constructor(){
        super()
      //  this.createPoll = this.createPoll.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.createPoll = this.createPoll.bind(this);
      this.parseOptions = this.parseOptions.bind(this);
    }
    
     createPoll(newPoll) {
        fetch('newPoll', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newPoll),
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedPoll => {
                   // this.props.addNewPoll(updatedPoll);
                   this.props.loadData();
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
           });
       form.question.value = '';
       form.options.value = '';
    }
    
    render() {
        return (
            <div className = {'newPoll'} onSubmit = {this.handleSubmit}>
            <form name = 'newPoll'>
            <label>Question</label>
            <input name = 'question'/>
            <label>Options</label>
            <input name = 'options' placeholder = 'seperate by a comma'/>
            <button>Sumbit</button>
            </form>
            </div>
            )
    }
}


