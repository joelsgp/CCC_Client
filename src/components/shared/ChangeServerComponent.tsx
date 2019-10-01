import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { Button, ModalHeader, ModalBody } from 'reactstrap';
import { ConfirmComponent } from './ConfirmComponent';

let urls = [
    "https://cc.timia2109.com/v2.php",
    "http://itserver:82/cookieclicker/v2.php",
    "https://timia2109.ddns.net/cookieclicker/v2.php"
];

interface ChangeServerStates {
    isOpen: boolean;
    selectedUrl: string;
}

export class ChangeServerComponent extends React.Component<DefaultComponentProps, ChangeServerStates> {
    constructor(props: DefaultComponentProps) {
        super(props);
        this.state = {
            isOpen: false,
            selectedUrl: this.props.env.settings.get("url")
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onAccept() {
        let settings = this.props.env.settings;
        settings.set("url", this.state.selectedUrl);
        settings.restore("token");
        settings.save();
        location.reload();
    }

    onUrlChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            selectedUrl: event.target.value
        });
    }

    render(): JSX.Element {
        if (!localStorage.debug) {
            return <></>;
        }

        return <>
            <hr/>
            <Button color="info" onClick={this.toggle}>
                URL: {this.state.selectedUrl}
            </Button>
            <ConfirmComponent toggle={this.toggle.bind(this)} onAccept={this.onAccept.bind(this)} open={this.state.isOpen}>
                <ModalHeader toggle={this.toggle.bind(this)}>
                    Change Server URL
                </ModalHeader>
                <ModalBody>
                    <select value={this.state.selectedUrl} onChange={this.onUrlChange.bind(this)}>
                        {urls.map(u => <option>{u}</option>)}
                    </select>
                </ModalBody>
            </ConfirmComponent>
        </>;
    }
}