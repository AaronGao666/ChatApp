import React from 'react';

class ChatTitle extends React.Component {

    render() {

        return (
            <div className="chat-title">
                {this.props.title}
            </div>
        );
    }
}

export default ChatTitle;