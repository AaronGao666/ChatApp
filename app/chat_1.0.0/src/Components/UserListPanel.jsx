import React from 'react';
import Tabs from './Tabs';
import AddButtons from './AddButtons';

class UserListPanel extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            userTabActive: true
        };
        this.changeTab = this.changeTab.bind(this);
    }


    changeTab(val) {
        this.setState({userTabActive: val})
    }


    getFriendList(users) {

        return <div className="user-list-wrap">
            <ul className="user-list">

                {
                    Object.values(users).map((user) => {
                            return (
                                <li key={JSON.stringify(user)} className="user" onClick={e => {
                                    e.preventDefault();
                                    this.props.setCurrentChatWith({
                                        email: user.email,
                                        name: user.name,
                                        type: 'person'
                                    });
                                }}>
                                    <span>{user.name}</span>
                                    <span hidden>{user.email}</span>
                                </li>
                            )
                        }
                    )
                }
            </ul>
        </div>
    }

    getGroupList(groups) {

        return <div className="group-list-wrap">
            <ul className="group-list">

                {
                    Object.values(groups).map((group) => {
                            return (
                                <li key={JSON.stringify(group)} className="group" onClick={e => {
                                    e.preventDefault();
                                    this.props.setCurrentChatWith({
                                        email: group,
                                        name: group,
                                        type: 'group'
                                    });
                                }}>
                                    <span>{group}</span>
                                </li>
                            )
                        }
                    )
                }
            </ul>
        </div>
    }

    render() {
        return <div className="user-list-panel">
            <Tabs changeTab={this.changeTab} userTabActive={this.state.userTabActive}/>
            {this.state.userTabActive ? this.getFriendList(this.props.users) : this.getGroupList(this.props.groups)}
            <AddButtons openModalHandler={this.props.openModalHandler}/>
        </div>
    }

}


export default UserListPanel;