import React from 'react';

class SelfInfo extends React.Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {

        fetch('/logout', {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({email: this.props.currentUser.email, token: this.props.token.token})//@todo 获取用户名和email来登出
        }).then(response => {
            if (response.ok) {
                this.props.showLoginPage();
            } else {
                console.error('logout failed');//@todo error handle
            }

        });
    }


    getNameTag() {
        return <div className="user-self-name">
            {this.props.currentUser.name}
        </div>
    }
//Instead of having so many bits of component as functions, try making them into sub components. You're treating them the same anyway in your render method, why not get all the advantages of declarative JSX?
    getButtons() {
        return <div className="self-info-buttons">
            <button className="log-out-button" onClick={this.logOut}> Logout</button>
            <button className="edit-info-button"> Edit Info</button>
        </div>
    }


    render() {

        return (

            <div className="self-info">
                {this.props.nameTagToggled ? this.getButtons() : this.getNameTag()}
            </div>

        );

    }
}

export default SelfInfo;