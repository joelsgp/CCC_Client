import React from 'react';
import { SettingsComponent, SettingsStates } from './SettingsComponent';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { IconDefinition, faKey, faSave, faSync } from '@fortawesome/pro-solid-svg-icons';
import { FormGroup, Label, Input, FormFeedback, Button, Alert } from 'reactstrap';
import { CCCSettings } from '../../CCCClasses/CCCSettings';
import { Validator } from '../../CCCClasses/Validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChangePasswordStates extends SettingsStates {
    message?: string;
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
    oldPasswordError?: string;
    newPasswordError?: string;
    repeatPasswordError?: string;
    pendingAction: boolean;
}

export class ChangePasswordComponent extends SettingsComponent<DefaultComponentProps, ChangePasswordStates> {

    icon: IconDefinition = faKey;
    title: string = "Change Password";
    private validator: Validator = new Validator();

    constructor(props: DefaultComponentProps) {
        super(props);

        this.state = {
            collapsed: false,
            oldPassword: "",
            newPassword: "",
            repeatNewPassword: "",
            pendingAction: false
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.upload = this.upload.bind(this);
    }

    protected onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let target = event.target;
        let name = target.name as "oldPassword" | "newPassword" | "repeatNewPassword";
        let value = target.value;

        let n = {};
        n[name] = value;

        if (name == "newPassword") {
            let passwordError = this.validator.validatePassword(value);
            if (passwordError.length == 0) {
                passwordError = undefined;
            }
            n["newPasswordError"] = passwordError;
        }
        else if (name == "repeatNewPassword") {
            let p = undefined;
            if (this.state.newPassword !== value) {
                p = "Passwords dosn't match!";
            }
            n["repeatPasswordError"] = p;
        }

        this.setState(n);
    }

    private async upload() {
        this.setState({
            oldPasswordError: undefined,
            pendingAction: true
        });

        if (this.state.newPasswordError == undefined && this.state.repeatPasswordError == undefined) {
            try {
                await this.props.env.api.changePassword(
                    this.state.oldPassword,
                    this.state.newPassword
                );
                this.setState({
                    message: "Password changed!"
                });
            }
            catch (e) {
                this.setState({
                    oldPasswordError: "Error. Check if the password is correct"
                });
            }
        }

        this.setState({
            pendingAction: false
        });
    }

    protected renderInner(): JSX.Element {
        return <>
            <Alert hidden={this.state.message === undefined} color="success">
                {this.state.message}
            </Alert>
            <FormGroup>
                <Label>Old Password</Label>
                <Input type="password" value={this.state.oldPassword} onChange={this.onValueChange} name="oldPassword" invalid={this.state.oldPasswordError !== undefined} />
                <FormFeedback>{this.state.oldPasswordError}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label>New Password</Label>
                <Input type="password" value={this.state.newPassword} onChange={this.onValueChange} name="newPassword" invalid={this.state.newPasswordError !== undefined} />
                <FormFeedback>{this.state.newPasswordError}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label>Repeat New Password</Label>
                <Input type="password" value={this.state.repeatNewPassword} onChange={this.onValueChange} name="repeatNewPassword" invalid={this.state.repeatPasswordError !== undefined} />
                <FormFeedback>{this.state.repeatPasswordError}</FormFeedback>
            </FormGroup>
            <Button color="success" onClick={this.upload} disabled={this.state.pendingAction}>
                <FontAwesomeIcon icon={this.state.pendingAction ? faSync : faSave} spin={this.state.pendingAction} />
                Save
            </Button>
        </>;
    }

    protected save(settings: CCCSettings) { }
}