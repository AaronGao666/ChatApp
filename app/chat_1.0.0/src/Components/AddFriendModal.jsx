import React from 'react';

class AddFriendModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formError: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();

        const request = {
            sender: this.props.currentUser.email,
            target: this.refs.theInput.value,
            token: this.props.token.token
        };

        fetch('/addfriend', {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(request)
        }).then(response => {
            if (response.status === 404) {
                this.setState({formError: "User does not exists!"})
            } else if (response.status === 400) {
                this.setState({formError: "please enter a user's email!"})
            } else if (response.ok) {
                this.setState({formError: ""});
                this.props.close();
            }
        })

    }

    //Don't forget about truthiness: {this.state.formError && (<span>Etc</span>) }
    render() {

        return (
            <form className="add-friend-modal" onSubmit={this.handleSubmit}>
                <input className="search-for" placeholder="Enter User's Email" ref="theInput"/>
                <button className="send-request">Send Request</button>
                {this.state.formError.length > 0 && (
                    <span className="errorMessage">{this.state.formError}</span>
                )}
            </form>
        );
    }


}


export default AddFriendModal;