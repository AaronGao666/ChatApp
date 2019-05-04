import React, {Component} from "react";
import "./Login.css";
import "./Register";
import Register from "./Register";


const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({formErrors, ...rest}) => {
    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            formErrors: {
                email: "",
                password: ""
            },
            login: true
        };
    }


    handleSubmit = e => {
        e.preventDefault();
        if (formValid(this.state)) {
            const {email, password} = this.state;
            fetch('/login', {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    email, password
                })
            }).then(response => {
                if (response.ok) {
                    this.props.setCurrentUser(email);
                    return response.json();
                } else if (response.status === 401) {
                    this.setState({
                        formErrors: {
                            email: "please check email address",
                            password: "please check password"
                        }
                    });
                } else if (response.status === 404) {
                    this.setState({
                        formErrors: {
                            email: "user does not exists",
                            password: ""
                        }
                    });
                } else if(response.status === 409){
                    this.setState({
                        formErrors: {
                            email: "user already logged in",
                            password: ""
                        }
                    });
                }
                return Promise.reject();
            }).then(data => {
                this.props.setCurrentUser({
                    email: data.email,
                    name: data.name
                });
                this.props.showChatPage(data.token);
            })
        }
    };

    handleChange = e => {
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = {...this.state.formErrors};
        if (name === 'email') {
            if (value.length > 100) {
                formErrors.email = "email address too long"
            } else if (!emailRegex.test(value)) {
                formErrors.email = "invalid email address"
            } else {
                formErrors.email = ""
            }
        } else if (name === 'password') {
            if (value.length > 100) {
                formErrors.password = "password too long"
            } else if (value.length < 6) {
                formErrors.password = "minimum 6 characters required"
            } else {
                formErrors.password = ""
            }
        }

        this.setState({formErrors, [name]: value});
    };

    changePage = () => {
        this.setState({login: false});
    };
//Why is this not another component?
    getPage = () => {
        const {formErrors} = this.state;
        return <div className="wrapper">
            <div className="form-wrapper">
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="email">
                        <label htmlFor="email">Email</label>
                        <input
                            className={formErrors.email.length > 0 ? "error" : null}
                            placeholder="Email"
                            type="email"
                            name="email"
                            onChange={this.handleChange}
                        />
                        {formErrors.email.length > 0 && (
                            <span className="errorMessage">{formErrors.email}</span>
                        )}
                    </div>
                    <div className="password">
                        <label htmlFor="password">Password</label>
                        <input
                            className={formErrors.password.length > 0 ? "error" : null}
                            placeholder="Password"
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                        />
                        {formErrors.password.length > 0 && (
                            <span className="errorMessage">{formErrors.password}</span>
                        )}
                    </div>
                    <div className="Login">
                        <button type="submit" disabled={!this.state.email || !this.state.password}>Login</button>
                    </div>
                </form>
                <div className="redirect" onClick={this.changePage}>
                    Doesn't Have an Account yet?
                </div>
            </div>
        </div>
    };

    render() {

        return (
            this.state.login ? this.getPage() :
                <Register showChatPage={this.props.showChatPage} setCurrentUser={this.props.setCurrentUser}/>
        );
    }
}

export default Login;