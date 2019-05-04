import React from 'react';
import AddFriendModal from './Components/AddFriendModal';
import AddGroupModal from './Components/AddGroupModal';
import FriendRequestsModal from './Components/FriendRequestsModal';

import './Modal.css';


class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.getBody = this.getBody.bind(this);
    }


    getHead(type) {

        switch (type) {
            // case "create-group": return "Create a Group";@todo
            case "join-group":
                return "Join a Group";
            case "friend-requests":
                return "My Friend Requests";
            default:
            case "add-friend":
                return "Add a Friend";
        }
    }

    getBody(type) {

        switch (type) {
            // case "create-group": return "Create a Group"; @todo
            case "join-group":
                return <AddGroupModal currentUser={this.props.currentUser} token={this.props.token}
                                      close={this.props.close}/>;
            case "friend-requests":
                return <FriendRequestsModal currentUser={this.props.currentUser} token={this.props.token}
                                            requests={this.props.requests} close={this.props.close}/>;
            default:
            case "add-friend":
                return <AddFriendModal currentUser={this.props.currentUser} token={this.props.token}
                                       close={this.props.close}/>;
        }
    }

    render() {
        return (
            <div className="modal-wrapper"
                 style={{
                     transform: this.props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                     opacity: this.props.show ? '1' : '0'
                 }}>
                <div className="modal-header">
                    <h3>{this.getHead(this.props.type)}</h3>
                    <span className="close-modal-btn" onClick={this.props.close}>×</span>
                </div>
                <div className="modal-body">
                    {this.getBody(this.props.type)}
                </div>
            </div>
        );
    }
}


export default Modal;