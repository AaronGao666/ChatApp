import React from 'react';

class AddButtons extends React.Component {

    render() {
        return <div className="add-buttons">
            <button className="add-friend" onClick={this.props.openModalHandler}>Add Friend</button>
            <button className="join-group" onClick={this.props.openModalHandler}>Join Group</button>
        </div>
    }
}

export default AddButtons;