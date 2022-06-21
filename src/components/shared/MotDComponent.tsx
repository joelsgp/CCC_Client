import React from 'react';

import { DefaultComponentProps } from '../DefaultComponentProps';

interface MotDStates {
    motd: string;
}

export class MotDComponent extends React.Component<DefaultComponentProps, MotDStates> {

    constructor(props: DefaultComponentProps) {
        super(props);
        this.state = {
            motd: ""
        };

        this.props.env.api.onMotD = this.setMotD.bind(this);
    }

    public setMotD(motd: string) : void {
        this.setState({ motd });
    }

    render(): JSX.Element {
        return <div className="text-center motd-area">{this.state.motd}</div>;
    }
}