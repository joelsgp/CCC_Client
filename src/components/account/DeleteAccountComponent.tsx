import React from "react";
import { SettingsStates, SettingsComponent } from "./SettingsComponent";
import { DefaultComponentProps } from "../DefaultComponentProps";
import { IconDefinition, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CCCSettings } from "../../CCCClasses/CCCSettings";
import { FormGroup, Label, Input, FormFeedback, Button } from "reactstrap";

interface DeleteAccountStates extends SettingsStates {
    password: string;
    passwordError?: string;
    pendingAction: boolean;
}

export class DeleteAccountComponent extends SettingsComponent<DefaultComponentProps, DeleteAccountStates> {

    icon: IconDefinition = faTrash;
    title: string = "Delete Account";

    constructor(p: DefaultComponentProps) {
        super(p);

        this.state = {
            password: "",
            pendingAction: false,
            collapsed: false
        };

        this.delete = this.delete.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
    }

    private async delete() {
        this.setState({
            passwordError: undefined,
            pendingAction: true
        });

        try {
            await this.props.env.api.deleteUser(this.state.password);
            this.props.env.plainLogout();
            this.props.env.open("#/goodbye");
        } catch (e) {
            this.setState({
                passwordError: "Error on Delete. Check your Password"
            });
        }

        this.setState({
            pendingAction: false
        });
    }

    private onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let value = event.target.value;

        this.setState(s => {
            return {
                password: value,
                passwordError: undefined
            };
        })
    }

    protected renderInner(): JSX.Element {
        return <>
            <strong>
                This will delete your account. You cannot undo!
            </strong>
            <FormGroup>
                <Label>Password</Label>
                <Input type="password" value={this.state.password} onChange={this.onValueChange} invalid={this.state.passwordError !== undefined} />
                <FormFeedback>{this.state.passwordError}</FormFeedback>
            </FormGroup>
            <Button color="danger" onClick={this.delete}>
                Delete Account!
            </Button>
        </>;
    }

    protected save(settings: CCCSettings) { }

}