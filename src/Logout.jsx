const Redirect = window.ReactRouterDOM.Redirect;

export default class Logout extends React.Component {
    constructor() {
        super()
        this.state = {
            redirect: false
        }
    }
    
    componentDidMount() {
        this.logOut();
    }
    
    logOut() {
        const username = this.props.getFromStorage('MERN_Vote').username;
        fetch(`/logout?username=${username}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                this.props.setSignInInfo('', '', '', '', false); 
                this.props.removeFromStorage('MERN_Vote');
                this.setState({redirect: true});
            }
        })
    }

    render() {
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to='/' />;
        }
        
        
        return (
        <div>
            Logging out.
        </div>
        )
    }
}