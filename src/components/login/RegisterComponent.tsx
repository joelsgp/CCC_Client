import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../shared/LoadingComponent';
import { Validator } from '../../CCCClasses/Validator';

interface RegisterStates {
    username: string;
    password: string;
    repeatPassword: string;
    processWork: boolean;
    repeatPasswordError: string;
    usernameError: string,
    passwordError: string
}

export class RegisterComponent extends React.Component<DefaultComponentProps, RegisterStates> {

    private validator: Validator = new Validator();

    state = {
        username: "",
        password: "",
        repeatPassword: "",
        processWork: false,
        passwordError: "",
        repeatPasswordError: "",
        usernameError: ""
    };

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        let target = event.target;
        let field = target.name as "username" | "password" | "repeatPassword";
        let value = target.value;

        let nState : RegisterStates = this.state;
        nState[field] = value;

        if (field == "password" || field == "repeatPassword") {
            if (nState.password !== nState.repeatPassword) {
                nState.repeatPasswordError = "Passwords don't match";
            }
            else {
                nState.repeatPasswordError = "";
            }
        }
        if (field == "password") {
            nState.passwordError = this.validator.validatePassword(value);
        }
        else if (field == "username") {
            nState.usernameError = this.validator.validateUsername(value);
        }

        this.setState(nState);
    }

    get isValid(): boolean {
        return this.state.usernameError.length == 0
            && this.state.passwordError.length == 0
            && this.state.repeatPasswordError.length == 0;
    }

    async handleRegister() {
        this.setState({processWork: true});
        try {
            let login = await this.props.env.api.register(this.state.username, this.state.password);
            if (login.token) {
                this.props.env.login(login.token);
            }
        } catch (e) {
            this.props.env.errorResolver.resolveError(e);
        }
        this.setState({processWork: false});
    }

    render(): JSX.Element {
        if (this.state.processWork) {
            return <LoadingComponent />
        }
        
        return <>
            <h2>Register</h2>
            <small>
                Your Username should not contain spaces and should be less then 32 characters
                <br />
                Your password has to be at least 8 characters long.
                <br />
                Remember your Password. You can't restore it. Use a Password Manager like <a href="https://keepass.info/" target="_blank">KeePass</a>. It's free!
                <br />
                To get more information open the FAQ
            </small>
            <FormGroup>
                <Label>Username</Label>
                <Input placehoder="Enter Username" value={this.state.username} onChange={this.handleChange.bind(this)} name="username" invalid={this.state.usernameError.length > 0} />
                <FormFeedback>{this.state.usernameError}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label>Password</Label>
                <Input placeholder="Password" value={this.state.password} onChange={this.handleChange.bind(this)} type="password" name="password" invalid={this.state.passwordError.length > 0} />
                <FormFeedback>{this.state.passwordError}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label>Repeat Password</Label>
                <Input placeholder="Password" invalid={this.state.repeatPasswordError.length > 0} value={this.state.repeatPassword} onChange={this.handleChange.bind(this)} type="password" name="repeatPassword" />
                <FormFeedback>{this.state.repeatPasswordError}</FormFeedback>
            </FormGroup>
            <Button color="primary" onClick={this.handleRegister.bind(this)} disabled={!this.isValid}>
                <FontAwesomeIcon icon={faPlusSquare} />
                Register
            </Button> 
        </>;
    }
}