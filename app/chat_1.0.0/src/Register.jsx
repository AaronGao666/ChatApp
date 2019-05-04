import React, {Component} from "react";
import "./Login.css";
import "./Login";
import Login from "./Login";


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

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            formErrors: {
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            },
            register: true
        };
    }


    handleSubmit = e => {
        e.preventDefault();

        if (formValid(this.state)) {
            const {firstName, lastName, email, password} = this.state;
            fetch('/register', {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    firstName, lastName, email, password
                })
            }).then(response => {

                if (response.ok) {

                    return response.json();
                } else if (response.status === 409) {
                    this.setState({
                        formErrors: {
                            ...this.state.formErrors,
                            email: "Email address already exists!"
                        }
                    });
                }
                return Promise.reject()
            }).then(data => {
                this.props.setCurrentUser({
                    email: data.email,
                    name: data.name
                });
                this.props.showChatPage(data.token);
            })
        }
    };
/**
 * I feel like you could pull out of a lot of this handleChange logic into a separate, pure JS file, that the various components pull in as needed. They'd still have a bit, but it would be less repetitive.
 * */
    handleChange = e => {
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = {...this.state.formErrors};
//This can be const, as you never reassign formErrors itself.
        switch (name) {
            case "firstName":
                formErrors.firstName =
                    value.length < 3 ? "minimum 3 characaters required" : "";
                break;
            case "lastName":
                formErrors.lastName =
                    value.length < 3 ? "minimum 3 characaters required" : "";
                break;
            case "email":
                formErrors.email = emailRegex.test(value)
                    ? ""
                    : "invalid email address";
                break;
            case "password":
                formErrors.password =
                    value.length < 6 ? "minimum 6 characaters required" : "";
                break;
            default:
                break;
        }

        this.setState({formErrors, [name]: value});
    };

    changePage = () => {
        this.setState({register: false});
    };
/**
 1。Truthiness
 2。 You repeat this a lot. That's a sign you could make it a function that is more descriptive.
 className={classIfError('firstName')} . (one example)
 */


    /**
     * Bad news: htmlFor requires an id - you're using it wrong here.

     Good news: You don't need htmlFor if you wrap the <input> tag IN the <label> tag. so move your </label> to be after the input tag and adjust your CSS.
     *
     */



    //getPage() would really benefit from being a separate component. - it's 80 lines of JSX and it's NOT in your render method, which is where someone would go to look for the output.
    getPage = () => {
        const {formErrors} = this.state;
        return <div className="wrapper">
            <div className="form-wrapper">
                <h1>Create Account</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="firstName">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            className={formErrors.firstName.length > 0 ? "error" : null}
                            placeholder="First Name"
                            type="text"
                            name="firstName"
                            onChange={this.handleChange}
                        />
                        {formErrors.firstName.length > 0 && (
                            <span className="errorMessage">{formErrors.firstName}</span>
                        )}
                    </div>
                    <div className="lastName">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            className={formErrors.lastName.length > 0 ? "error" : null}
                            placeholder="Last Name"
                            type="text"
                            name="lastName"
                            onChange={this.handleChange}
                        />
                        {formErrors.lastName.length > 0 && (
                            <span className="errorMessage">{formErrors.lastName}</span>
                        )}
                    </div>
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
                    <div className="createAccount">
                        <button type="submit"
                                disabled={!this.state.firstName || !this.state.lastName || !this.state.email || !this.state.password}>
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="redirect" onClick={this.changePage}>
                    Already Have an Account?
                </div>
            </div>
        </div>
    };

    render() {

        return (
            this.state.register ? this.getPage() :
                <Login showChatPage={this.props.showChatPage} setCurrentUser={this.props.setCurrentUser}/>
        );
    }
}

export default Register;