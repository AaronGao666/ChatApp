import React from 'react';

const activeStyle = {
    color: '#F2F5F8',
    backgroundColor: '#625F63',
    border: 'none'
};
const inactiveStyle = {
    backgroundColor: '#F2F5F8',
    color: '#625F63'
};

class Tabs extends React.Component {

    render() {
        return <div className="user-list-tabs">
            <div onClick={() => this.props.changeTab(true)}
                 style={this.props.userTabActive ? activeStyle : inactiveStyle}> Friends
            </div>
            <div onClick={() => this.props.changeTab(false)}
                 style={this.props.userTabActive ? inactiveStyle : activeStyle}> Groups
            </div>
        </div>
    }
}

export default Tabs;