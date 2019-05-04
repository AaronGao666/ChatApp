import React from 'react';

class MessageList extends React.Component {

    scrollToBottom(){
        this.messagesEnd.scrollIntoView({behavior:"auto", block:"nearest"})
    }

    render() {

        return <div className="message-list-panel">
            <ol className="message-list">
                {
                    this.props.messages.map((message,index) => {

                            return (
                                <li key={index} className="message">
                                    <div className="username"> {message.sender}</div>
                                    <div className="time-stamp"> {new Date(message.timestamp).toString()}</div>
                                    <div className="message-text"><p> {message.text} </p></div>
                                </li>
                            )
                        }
                    )
                }
                {this.props.errorMessage ? <li className="error-message"> {this.props.errorMessage} </li> : ""}
            </ol>
            <div style={{ float:"left", clear: "both" }}
                 ref={(el) => { this.messagesEnd = el; }}>
            </div>
        </div>
    }
}

export default MessageList;