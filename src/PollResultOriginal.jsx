//import Chart from './Chart';

export default class PollResult extends React.Component {
    constructor() {
        super()
        this.state = {
            pollShown: 0,
            options: [],
            values: [],
            questions: [],
            answers: []
        }
        this.createUpdatedPoll = this.createUpdatedPoll.bind(this);
        this.createRenderElements = this.createRenderElements.bind(this);
        this.consoleFunc = this.consoleFunc.bind(this);
    }
    
   componentDidMount() {
       this.parsePollData();
   }
    
   componentDidUpdate() {
       // set state for chart component
   }   
   
   parsePollData() {
        const poll = this.props.match.params.pollId;
        let pollShown = this.props.polls.find(item => {
        return item._id === poll;
        });
        this.setState({pollShown: pollShown}, () => {this.createRenderElements()});
   }
   
   createRenderElements() {
        let tempOptions = [];
        let tempValues = [];
        let tempQuestions = [];
        let tempAnswers = [];
        for (var key in this.state.pollShown.options) {
        tempOptions.push(<label key = {key} >{key}<input type = 'radio' name = 'updatedValue' value = {key} /></label>);
        tempValues.push(<li key = {key}>{key}: {this.state.pollShown.options[key]}</li>);
        tempQuestions.push(key);
        tempAnswers.push(this.state.pollShown.options[key]);
    }
    this.setState({options: tempOptions});
    this.setState({answers: tempAnswers});
    this.setState({questions: tempQuestions});
    this.setState({values: tempValues});
   }
    
   createUpdatedPoll(newVal) {
    //   let newPoll = this.state.pollShown;
    //   for (let key in newPoll.options) {
    //       key === newVal && newPoll.options[newVal] ++
    //   }
    //   return newPoll;
    console.log(newVal)
      }
      
   updatePoll(updatedPoll){

       fetch('/updatePoll', {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(updatedPoll)
       }).then(response => {
           if (response.ok) {
               response.json().then(updatedPoll => {
                   this.props.loadData();
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
    
   handleSubmit(event){
       event.preventDefault();
       this.consoleFunc;
        let updatedValue = document.forms.updatedPoll.updatedValue.value;
       // let newPoll = this.createUpdatedPoll(updatedValue);
      // this.updatePoll();
        
        //create updated obj to send to server
    }
    
   render() {
        return (
        <div>
            <div>
                {this.state.pollShown.question}
                <hr />
                Choose one.
                <form name = 'updatedPoll' onSubmit = {this.handleSubmit}>
                    {this.state.options}
                    <input type = 'submit' />
                </form>
                {this.state.values}
            </div>
            <div>
            char goes here
            </div>
        </div>
        )
    }
    
}

//             <Chart questions = {this.state.questions} answers = {this.state.answers}/>
