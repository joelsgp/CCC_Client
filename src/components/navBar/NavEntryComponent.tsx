import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from 'react';
import { Tooltip } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface NavEntryProps {
    icon: IconDefinition;
    title: string;
    itemId: string;
    hidden?: boolean;
}

interface NavEntryStates {
    tooltipOpen: boolean;
}

export abstract class NavEntryComponent<Props extends NavEntryProps = NavEntryProps> extends React.Component<Props, NavEntryStates> {

    constructor(props: Props) {        
        super(props);
        this.state = {
            tooltipOpen: false
        };

        this.toggle = this.toggle.bind(this);
    }

    protected abstract renderInner(children: JSX.Element) : JSX.Element;

    public toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render(): JSX.Element {
        let id = this.props.itemId as string;

        return <>
            <li className="nav-item" id={id} hidden={this.props.hidden}>
                {this.renderInner(
                    <FontAwesomeIcon icon={this.props.icon} />
                )}
            </li>
            <Tooltip placement="top" isOpen={this.state.tooltipOpen} toggle={this.toggle} target={id} >
                {this.props.title}
            </Tooltip>
        </>;
    }
}