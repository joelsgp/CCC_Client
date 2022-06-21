import React from 'react';
import { NavEntryProps, NavEntryComponent } from './NavEntryComponent';


export interface ActionNavEntryProps extends NavEntryProps {
    onClick: () => any;
}

export class ActionNavEntryComponent extends NavEntryComponent<ActionNavEntryProps> {

    constructor(props: ActionNavEntryProps) {
        super(props);
    }

    protected renderInner(children: JSX.Element): JSX.Element {
        return <span className="nav-link cccAction" onClick={this.props.onClick}>
            {children}
        </span>;
    }
}