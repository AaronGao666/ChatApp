import React from 'react';
import './Chat.css';
import UserListPanel from './Components/UserListPanel';
import MessageList from './Components/MessageList';
import Outgoing from './Components/Outgoing';
import SelfInfo from './Components/SelfInfo';
import ChatTitle from './Components/ChatTitle';

import Modal from './Modal';


class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Why are some of these capitalized? Generally you only want to capitalize Component names and (JS) Class names.
            Users: {},
            Groups: {},
            Messages: [],
            nameTagToggled: false,
            currentChatWith: {
                email: "",
                name: "",
                type: ""
            },
            Modal: {
                showing: false,
                window: null, // add-friend, join-group, create-group, friend-requests
            },
            friendRequests: {},
            errorMessage: null
        };

        this.fetchGroupList = this.fetchGroupList.bind(this);
        this.fetchMessageList = this.fetchMessageList.bind(this);
        this.fetchFriendList = this.fetchFriendList.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.setCurrentChatWith = this.setCurrentChatWith.bind(this);
        this.closeModalHandler = this.closeModalHandler.bind(this);
        this.openModalHandler = this.openModalHandler.bind(this);

        this.MessageComponent = React.createRef();

        this.fetchFriendList();
        this.fetchMessageList();
        this.fetchGroupList();
        this.fetchRequestList();

    }


    componentDidMount() {

        this.MessageInterval = setInterval(this.fetchMessageList.bind(this), 5000);
        this.GroupInterval = setInterval(this.fetchGroupList.bind(this), 5000);
        this.FriendInterval = setInterval(this.fetchFriendList.bind(this), 5000);
        this.RequestInterval = setInterval(this.fetchRequestList.bind(this), 5000);
    }

    componentWillUnmount() {

        clearInterval(this.MessageInterval);
        clearInterval(this.GroupInterval);
        clearInterval(this.FriendInterval);
        clearInterval(this.RequestInterval);
    }


    getChatTitle() {

        if (this.state.currentChatWith === null || this.state.currentChatWith === undefined || this.state.currentChatWith.name.length === 0) {
            return 'Select Friend To Start Chatting'
        } else {
            return this.state.currentChatWith.name
        }
    }


    fetchRequestList() {
        if (!this.props.currentUser.email || this.props.currentUser.email.length === 0) return;
        fetch('/friendrequests', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': this.props.token.token,
                'User': this.props.currentUser.email,
            }
        }).catch(() => {
            this.errorHandle('network');
            return Promise.reject();
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                this.errorHandle('token');
                return Promise.reject();
            }
        }).then(requests => {
            if (Object.entries(requests).length === 0 && requests.constructor === Object) return;
            this.setState({
                Modal: {
                    showing: true,
                    window: "friend-requests"
                },
                friendRequests: requests
            })
        })
    }


    fetchFriendList() {

        if (!this.props.currentUser.email || this.props.currentUser.email.length === 0) return;
        fetch('/friendlist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': this.props.token.token,
                'User': this.props.currentUser.email,
            }
        }).catch(() => {
            this.errorHandle('network');
            return Promise.reject();
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                this.errorHandle('token');
                return Promise.reject();
            }
        }).then(users => {
            this.setState({Users: users})
        })
    }

    fetchGroupList() {

        if (!this.props.currentUser.email || this.props.currentUser.email.length === 0) return;
        fetch('/grouplist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': this.props.token.token,
                'User': this.props.currentUser.email,
            }
        }).catch(() => {
            this.errorHandle('network');
            return Promise.reject();
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                this.errorHandle('token');
                return Promise.reject();
            }
        }).then(groups => {
            this.setState({Groups: groups})
        })
    }

    /**
     * You should be careful with non-standard headers, in case you collide with headers someone else defines. Best to check against the info here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
     * */
    fetchMessageList() {

        //this large if could be moved to another function, hasActiveChat() or something, that makes this code read as what is happening rather than HOW it is happening.
        if (!this.props.currentUser.email || this.props.currentUser.email.length === 0 || !this.state.currentChatWith.email || this.state.currentChatWith.email.length === 0) return;
        fetch('/messagelist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': this.props.token.token,
                'User': this.props.currentUser.email,
                'ChatWith': this.state.currentChatWith.email,
                'Type': this.state.currentChatWith.type
            }
        }).catch(() => {
            this.errorHandle('network');
            return Promise.reject();
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                this.errorHandle('token');
                return Promise.reject();
                //You reject here, but nothing ever checks for these error messages (and you aren't sending info on the rejection, so they wouldn't know much anyway.
            }
        }).then(messages => {
            this.setState({Messages: messages});
        }).then(() => this.scrollToBottom())
    }

    scrollToBottom() {
        this.MessageComponent.current.scrollToBottom();
    }


    //This is a clever way to get around passing back error data. I generally prefer to pass back error data so my caller can decide what to (including showing generic messages like you do here) because my caller knows what is going on, while this code doesn't.
    //type can be network or token
    errorHandle = (type) => {
        if (type === 'network') {
            this.setState({errorMessage: "Network Error, Please check and try later"});
            setTimeout(() => {
                this.props.showLoginPage()
            }, 5000);
        } else if (type === 'token') {
            this.setState({errorMessage: "Token expired, you will be logged out"});
            setTimeout(() => {
                this.props.showLoginPage()
            }, 5000);
        }
    };


    postMessage(text) {

        if (!text || !this.state.currentChatWith.email || this.state.currentChatWith.email.length === 0) return;
        const message = {
            sender: this.props.currentUser.email,
            text: text,
            chatwith: this.state.currentChatWith.email,
            token: this.props.token.token,
            type: this.state.currentChatWith.type
        };

        fetch('/messagelist', {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(message)
        }).then(response => {
            if (response.ok) {
                this.fetchMessageList()
            } else {
                this.errorHandle('token');
                return Promise.reject();
            }
        }).catch(() => {
            this.errorHandle('network')
        });
    }


    setCurrentChatWith(target) {

        this.setState({currentChatWith: target},
            () => this.fetchMessageList()
        )
    }

//couldn't you have made another class that specifically defined this behavior and added it to all those buttons (in addition to the className they already had.
    handleClickInside(e) {

        if (e.target.className === 'user-self-name' || e.target.className === 'log-out-button' || e.target.className === 'edit-info-button') {
            this.setState({nameTagToggled: true})
        } else {
            this.setState({nameTagToggled: false})
        }
    }


    openModalHandler = (e) => {

        this.setState({
            Modal: {
                showing: true,
                window: e.target.className
            }
        });
    };

    closeModalHandler = () => {

        this.setState({
            Modal: {
                showing: false,
                window: null
            }
        });
    };


    render() {

        return (
            <div onClick={e => this.handleClickInside(e)}>

                <div className="chat-app">
                    <SelfInfo showLoginPage={this.props.showLoginPage} nameTagToggled={this.state.nameTagToggled}
                              currentUser={this.props.currentUser} token={this.props.token}/>
                    <ChatTitle title={this.getChatTitle()}/>
                    <UserListPanel users={this.state.Users} groups={this.state.Groups}
                                   openModalHandler={this.openModalHandler}
                                   setCurrentChatWith={this.setCurrentChatWith}/>
                    <MessageList messages={this.state.Messages} ref={this.MessageComponent}
                                 errorMessage={this.state.errorMessage}/>
                    <Outgoing postMessage={this.postMessage} currentChatWith={this.state.currentChatWith}/>
                    {this.state.Modal.showing ?
                        <div onClick={this.closeModalHandler} className="back-drop"></div>
                        : null
                    }
                    <Modal
                        className="modal"
                        show={this.state.Modal.showing}
                        close={this.closeModalHandler}
                        type={this.state.Modal.window}
                        currentUser={this.props.currentUser}
                        token={this.props.token}
                        requests={this.state.friendRequests}
                    />
                </div>
                <div className="overlay"></div>
            </div>
        );
    }
}


export default Chat;