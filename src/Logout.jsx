import React from 'react';
import { Redirect } from 'react-router-dom';

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
        const token = this.props.getFromStorage('MERN_Vote').token;
        fetch(`/logout?token=${token}`)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                this.props.setSignInInfo('', '', '', '', false); 
                this.props.removeFromStorage('MERN_Vote');
            setTimeout(() => {
             this.setState({redirect: true});
            }, 500)
            }
        })
    }

    render() {
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to='/' />;
        }
        
        
        return (
        <div className = {'loaderBackground'}>
            <div className = {'loader'}>
            </div>
        </div>
        )
    }
}