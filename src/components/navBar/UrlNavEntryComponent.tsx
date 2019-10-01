import React from 'react';
import { NavEntryProps, NavEntryComponent } from './NavEntryComponent';


export interface UrlNavEntryProps extends NavEntryProps {
    href: string;
    blank?: boolean;
}

export class UrlNavEntryComponent extends NavEntryComponent<UrlNavEntryProps> {

    constructor(props: UrlNavEntryProps) {
        super(props);
    }

    protected renderInner(children: JSX.Element): JSX.Element {
        return <a className="nav-link" href={this.props.href} target={this.props.blank ? "_blank" : undefined}>
            {children}
        </a>;
    }
}