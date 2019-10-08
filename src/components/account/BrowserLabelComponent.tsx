import React from "react";
import { SettingsComponent, SettingsStates } from "./SettingsComponent";
import { DefaultComponentProps } from "../DefaultComponentProps";
import { IconDefinition, faTag } from "@fortawesome/pro-solid-svg-icons";
import { CCCSettings } from "../../CCCClasses/CCCSettings";

interface BrowserLabelStates extends SettingsStates {
    value: string;
}

export class BrowserLabelComponent extends SettingsComponent<DefaultComponentProps, BrowserLabelStates> {
    
    state = {
        collapsed: false,
        value: this.props.env.settings.get("browserlabel")
    }

    icon: IconDefinition = faTag;
    title: string = "Browserlabel";

    protected save(settings: CCCSettings) {
        settings.set("browserlabel", this.state.value);
        settings.save();
    }

    onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let value = event.target.value;
        this.setState({
            value
        });
    }

    renderInner(): JSX.Element {
        return <>
            The Browserlabel helps you, to identify from which computer the save was uploaded.
            <br />
            You can set any name.
            <br />
            <input type="text" maxLength={32} className="form-control" value={this.state.value} onChange={this.onValueChange.bind(this)} />
        </>;
    }

}