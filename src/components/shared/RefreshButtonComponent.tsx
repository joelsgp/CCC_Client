import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/pro-solid-svg-icons';


export class RefreshButtonComponent extends React.Component<DefaultComponentProps, {}> {

    handleRefresh() {
        this.props.env.api.triggerRefresh();
    }

    render(): JSX.Element {
        return <Button color="primary" onClick={this.handleRefresh.bind(this)} className="mr-1">
            <FontAwesomeIcon icon={faSync} />
        </Button>;
    }
}