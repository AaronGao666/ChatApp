import React from 'react';


class Outgoing extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            emptyInput:true
        };
    }

    handleInputChange=(e)=> {
        e.preventDefault();
        if (e.target.value) {
            this.setState({emptyInput: false})
        } else {
            this.setState({emptyInput: true})
        }
    };


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.postMessage(this.refs.theInput.value);
        this.refs.theInput.value="";
        this.setState({emptyInput:true})
    };


    getForm = () => {
        return <form onSubmit={this.handleSubmit}>
            <input type="text" className="to-send"  placeholder="Enter Message To Send" ref="theInput" onChange={this.handleInputChange}/>
            <button type="submit" className="send-button"
                    disabled={this.state.emptyInput}>Send
            </button>
        </form>
    };
//(this.props.currentChatWith.email && this.props.currentChatWith.email.length > 0) is the same thing as this.props.currentChatWith.email
    render() {
        const haveChatWith = (this.props.currentChatWith.email && this.props.currentChatWith.email.length > 0);
        return (
            <div className="outgoing">
                {
                    haveChatWith ? this.getForm() :
                        <form>
                            <input className="to-send" disabled/>
                            <button className="send-button" disabled>Send</button>
                        </form>
                }
            </div>

        );

    }
}

export default Outgoing;