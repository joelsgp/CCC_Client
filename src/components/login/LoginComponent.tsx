import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn } from '@fortawesome/pro-solid-svg-icons';
import { LoadingComponent } from '../shared/LoadingComponent';

interface LoginStates {
    username: string;
    password: string;
    processWork: boolean;
}

export class LoginComponent extends React.Component<DefaultComponentProps, LoginStates> {
    
    state = {
        username: "",
        password: "",
        processWork: false,
    };

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        let target = event.target;
        let field = target.name as "username" | "password";
        let value = target.value;

        let nState : LoginStates = this.state;
        nState[field] = value;

        this.setState(nState);
    }

    async handleLogin() {
        this.setState({processWork: true});
        try {
            let login = await this.props.env.api.login(this.state.username, this.state.password);
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
            <h2>Login</h2>
            <small>Login to use CCC</small>
            <FormGroup>
                <Label>Username</Label>
                <Input placeholder="Enter Username" value={this.state.username} onChange={this.handleChange.bind(this)} name="username" />
            </FormGroup>
            <FormGroup>
                <Label>Password</Label>
                <Input placeholder="Password" value={this.state.password} onChange={this.handleChange.bind(this)} type="password" name="password" />
            </FormGroup>
            <Button color="primary" onClick={this.handleLogin.bind(this)}>
                <FontAwesomeIcon icon={faSignIn} />
                Login
            </Button> 
        </>;
    }
}