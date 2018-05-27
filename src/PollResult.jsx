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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updatePoll = this.updatePoll.bind(this);
    }
   
  static getDerivedStateFromProps(nextProps, prevState) {
        const poll = nextProps.match.params.pollId;
        let pollShown = nextProps.polls.find(item => {
        return item._id === poll;
        });
        let tempOptions = [];
        let tempValues = [];
        let tempQuestions = [];
        let tempAnswers = [];
        for (let key in pollShown.options) {
            tempOptions.push(<label key = {key} >{key}<input type = 'radio' name = 'updatedValue' value = {key} /></label>);
            tempValues.push(<li key = {key}>{key}: {pollShown.options[key]}</li>);
            tempQuestions.push(key);
            tempAnswers.push(pollShown.options[key]);
                                           }
      return({pollShown: pollShown,
              options: tempOptions,
              answers: tempAnswers,
              questions: tempQuestions,
              values: tempValues
             });
  }
   
  createUpdatedPoll(newVal) {
      let newPoll = this.state.pollShown;
      for (let key in newPoll.options) {
          key === newVal && newPoll.options[newVal] ++
      }
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

  handleSubmit(event) {
      event.preventDefault();
      let updatedValue = document.forms.updatedPoll.updatedValue.value;
      let newPoll = this.createUpdatedPoll(updatedValue);
      this.updatePoll(newPoll);
    }

  render() {
      
        return (
        <div className = 'pollResult'>
            <div className = 'pollInfo'>
                {this.state.pollShown.question}
                <hr />
                Choose one.
                <form name = 'updatedPoll' onSubmit = {this.handleSubmit}>
                    {this.state.options}
                    <input type = 'submit' />
                </form>
                {this.state.values}
            </div>
            <div className = 'pollInfo'>
            <Chart questions = {this.state.questions} answers = {this.state.answers} />
            </div>
        </div>
        )
    }
    
 }
 

//             <Chart questions = {this.state.questions} answers = {this.state.answers}/>

