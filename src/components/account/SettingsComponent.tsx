import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { Card, CardHeader, Button, CardBody, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CCCSettings } from '../../CCCClasses/CCCSettings';

export interface SettingsStates {
    collapsed: boolean;
}

export abstract class SettingsComponent<P extends DefaultComponentProps, S extends SettingsStates> extends React.Component<P, S> {

    constructor(props: P) {
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    abstract icon: IconDefinition;
    abstract title: string;

    protected abstract renderInner(): JSX.Element;
    protected abstract save(settings: CCCSettings): any;

    componentWillUnmount() {
        this.save(this.props.env.settings);
    }

    toggle() {
        this.setState(state => ({ collapsed: !state.collapsed }));
    }

    render(): JSX.Element {
        return <Card>
            <CardHeader>
                <h2 className="mb-0">
                    <button className="btn btn-link" onClick={this.toggle}>
                        <FontAwesomeIcon icon={this.icon} />
                        {this.title}
                    </button>
                </h2>
            </CardHeader>
            <Collapse isOpen={this.state.collapsed}>
                <CardBody >
                    {this.renderInner()}
                </CardBody>
            </Collapse>
        </Card>;
    }

}