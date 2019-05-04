import React from 'react';

class AddGroupModal extends React.Component {

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
        fetch('/joingroup', {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(request)
        }).then(response => {
            if (response.status === 404) {
                this.setState({formError: "Group does not exists!"})
            } else if (response.status === 400) {
                this.setState({formError: "please enter a group's name"})
            } else if (response.ok) {
                this.setState({formError: ""});
                this.props.close();
            }
        })
    }

    render() {

        return (
            <form className="join-group-modal" onSubmit={this.handleSubmit}>
                <input className="search-for" placeholder="Enter Group's Name" ref="theInput"/>
                <button className="send-request">Send Request</button>
                {this.state.formError.length > 0 && (
                    <span className="errorMessage">{this.state.formError}</span>
                )}
            </form>
        );
    }
}


export default AddGroupModal;