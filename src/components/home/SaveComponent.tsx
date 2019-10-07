import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { CCCSave } from '../../apiTypes/CCCSave';
import { CardBody, ButtonGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt, faEdit, faTrash, faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { getEditorUrl } from '../../CCCClasses/CCCUtils';
import { CCCTransfereMessage } from '../../CCCClasses/transfer/CCCTransfereMessage';
import { AttrMode } from './GameAttrModes';

export interface SaveProps extends DefaultComponentProps {
    save: CCCSave;
    attrMode: AttrMode;
}

interface SaveStates {
    deleteModalIsOpen: boolean;
}

export class SaveComponent extends React.Component<SaveProps, SaveStates> {

    constructor(props: SaveProps) {
        super(props);

        this.state = {
            deleteModalIsOpen: false
        };

        this.onLoadSaveClick = this.onLoadSaveClick.bind(this);
        this.onDeleteAction = this.onDeleteAction.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    }

    public toggleDeleteModal() {
        this.setState({
            deleteModalIsOpen: !this.state.deleteModalIsOpen
        });
    }

    private onLoadSaveClick() {
        try {
            new CCCTransfereMessage({
                cccCommand: "load",
                name: this.props.save.name
            }).sendToTab();
        } catch (e) {
            this.props.env.errorResolver.resolveError(e);
        }
    }

    public async onDeleteAction() {
        await this.props.env.api.deleteSave(this.props.save.name);
        this.props.env.api.triggerRefresh();
        this.toggleDeleteModal();
    }

    render(): JSX.Element {
        let save = this.props.save;
        let colorObject = this.props.env.colorParser.parse(save.cookies);
        let editorUrl = getEditorUrl(save.name);

        return <div className="card text-center saveCard" style={{
            backgroundColor: colorObject.background,
            color: colorObject.textcolor
        }} key={save.name}>
            <CardBody>
                <h5 className="card-title">{save.name}</h5>
                {this.props.attrMode.getJSX(save, colorObject, this.props.env)}
                <ButtonGroup>
                    <Button color="primary" onClick={this.onLoadSaveClick}>
                        <FontAwesomeIcon icon={faCloudDownloadAlt} />
                        Load
                    </Button>
                    <a className="btn btn-primary" target="_blank" href={editorUrl}>
                        <FontAwesomeIcon icon={faEdit} />
                        Edit
                    </a>
                    <Button color="danger" onClick={this.toggleDeleteModal}>
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </Button>
                </ButtonGroup>
            </CardBody>
            {this.getDeleteModal()}
        </div>;
    }

    private getDeleteModal(): JSX.Element {
        return <Modal isOpen={this.state.deleteModalIsOpen} toggle={this.toggleDeleteModal}>
            <ModalHeader toggle={this.toggleDeleteModal}>
                Delete save {this.props.save.name}?
            </ModalHeader>
            <ModalBody>
                Are you sure to delete this save?
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={this.onDeleteAction}>
                    <FontAwesomeIcon icon={faCheck} />
                    Delete
                </Button>
                <Button color="primary" onClick={this.toggleDeleteModal}>
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>;
    }
}