const Redirect = window.ReactRouterDOM.Redirect;
const Link =  window.ReactRouterDOM.Link;


export default class SignUp extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            userName: '',
            password: '',
            passwordConfirm: '',
            redirect: false,
            isLoading: false,
            duplicateUser: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.retrySignUp = this.retrySignUp.bind(this);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.setState({isLoading: true});
        let newUserObj = {
            name: this.state.name,
            userName: this.state.userName,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        }
        // server request below
        fetch('/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUserObj)
        }).then(response => {
            if (response.ok) {
                response.json().then(newUserResponse => {
                    if (newUserResponse.message === 'Error: Account already exists.'){
                        this.setState({duplicateUser: true});
                    } else {
                        this.setState({isLoading: false});
                        this.setState({redirect: true});
                    }
                })
            } else {
                response.json().then(error => {
                    alert("failed to create new user" + error)
                });
            }
        }).catch(err => {
            alert('error communicating to back end' + err);
        });
    }
    
    retrySignUp() {
        this.setState({duplicateUser: false, isLoading: false});
    }
    
    handleChange(event) {
        switch (event.target.name) {
            case 'name':
                this.setState({name: event.target.value});
                break;
            case 'userName':
                this.setState({userName: event.target.value});
                break;
            case 'password':
                this.setState({password: event.target.value});
                break;
            case 'passwordConfirm':
                this.setState({passwordConfirm: event.target.value});
                break;
            default: 
                break;
        }
    }
    
    render() {
        
        const duplicateUser = this.state.duplicateUser;
        const redirect = this.state.redirect;
        const loading = this.state.isLoading;
        
        if (duplicateUser) {
            return (
                <div>
                <p>User already exists, select a new username.</p>
                <Link to = '/sign-up' onClick = {this.retrySignUp}>Sign Up</Link>
                </div>
                )
        }
        if (loading) {
            return (
                <div>
                <p>
                Loading...
                </p>
                </div>
                )
        }
        if (redirect) {
            return <Redirect to='/' />;
        }
        
        return (
        <div>
            <form name = 'signup' onSubmit = {this.handleSubmit} autoComplete = 'on'>
            <legend>Sign Up</legend>
            <p>
            <label htmlFor = 'name'>Name</label>
            <input required type = 'text' name = 'name' placeholder = 'First and Last' onChange = {this.handleChange} />
            </p>
            <p>
            <label htmlFor = 'userName'>Username</label>
            <input required type = 'text' name = 'userName'  placeholder = 'Username' onChange = {this.handleChange}  />
            </p>
            <p>
            <label htmlFor = 'password'>Password</label>
            <input required type = 'password' name = 'password'  placeholder = '******' onChange = {this.handleChange} autoComplete = 'new password'  />
            </p>
            <p>
            <label htmlFor = 'passwordConfirm'>Confirm Password</label>
            <input required type = 'password' name = 'passwordConfirm'  placeholder = '******' onChange = {this.handleChange} autoComplete = 'new password'  />
            </p>
            <p>
            <input type = 'submit' />
            </p>
            </form>
        </div>
        )
    }
}