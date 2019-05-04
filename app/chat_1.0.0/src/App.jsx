import React, {Component} from 'react';
import Login from './Login';
import Chat from './Chat';

class App extends Component {


    constructor(props) {

        super(props);
        this.state = {
            login: false,
            token: {
                token: "",
                tokenLife: ""
            },
            currentUser: {
                email: "",
                name: ""
            }
        };
        this.showChatPage = this.showChatPage.bind(this);
        this.showLoginPage = this.showLoginPage.bind(this);
        this.setCurrentUser = this.setCurrentUser.bind(this);
    }

    componentDidMount() {

        window.addEventListener("beforeunload", () => {
            fetch('/logout', {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({email: this.state.currentUser.email, token: this.state.token.token})
            });
        });
    }

    showChatPage(token) {

        this.setState({
            login: true,
            token: token
        })
    };

    showLoginPage() {

        this.setState({
            login: false,
            token: {
                token: "",
                tokenLife: ""
            },
            currentUser: {
                email: "",
                name: ""
            }
        })
    };


    setCurrentUser(user) {

        this.setState({
            currentUser: user
        })
    }


    render() {

        return (
            this.state.login ?
                <Chat showLoginPage={this.showLoginPage} token={this.state.token} currentUser={this.state.currentUser}/>
                : <Login showChatPage={this.showChatPage} setCurrentUser={this.setCurrentUser}/>
        );
    }
}

export default App;
