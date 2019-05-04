import React from 'react';

class FriendRequestsModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
        Object.values(this.props.requests).map((request) => {
            this.state[request.email] = "display"
        });
    }
//wouldn't all of these services make more sense in a separate JS file where they can be imported into multiple components?
    acceptRequest(requester) {
        fetch('/acceptrequest', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Token': this.props.token.token,
                'User': this.props.currentUser.email,
                'Requester': requester
            }
        }).then(() => {
            this.setState({[requester]: "accepted"})
        })
    }

    declineRequest(requester) {
        fetch('/declinerequest', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Token': this.props.token.token,
                'User': this.props.currentUser.email,
                'Requester': requester
            }
        }).then(() => {
            this.setState({[requester]: "declined"})
        })
    }

    getOperationPanel(requester) {

        if (this.state[requester] === 'accepted') {
            return <div>
                Accepted
            </div>
        } else if (this.state[requester] === 'declined') {
            return <div>
                Declined
            </div>
        } else {
            return <div>
                <button className="accept-request" onClick={e => {
                    e.preventDefault();
                    this.acceptRequest(requester)
                }}>Accept
                </button>
                <button className="decline-request" onClick={e => {
                    e.preventDefault();
                    this.declineRequest(requester)
                }}>Decline
                </button>
            </div>
        }
    }

    render() {
        return (
            <div className="request-list-wrapper">
                <ul className="request-list">

                    {
                        Object.values(this.props.requests).map((request) => {
                                return (
                                    <li key={JSON.stringify(request)} className="request">
                                        <span>{request.name + "(" + request.email + ")"}</span>
                                        {this.getOperationPanel(request.email)}
                                    </li>
                                )
                            }
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default FriendRequestsModal;