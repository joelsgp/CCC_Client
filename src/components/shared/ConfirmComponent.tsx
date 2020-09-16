import React from 'react';
import { Modal, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

export interface ConfirmProps {
    onAccept: () => any;
    onDeny?: () => any;
    open: boolean;
    toggle: () => any;
}

export class ConfirmComponent extends React.Component<ConfirmProps, {}> {
    render(): JSX.Element {
        return <Modal isOpen={this.props.open} toggle={this.props.toggle}>
            {this.props.children}
            <ModalFooter>
                <Button class="primary" onClick={this.props.onAccept}>
                    <FontAwesomeIcon icon={faCheck} />
                    Accept
                </Button>
                <Button class="danger" onClick={this.props.onDeny ? this.props.onDeny : this.props.toggle}>
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>;
    }
}