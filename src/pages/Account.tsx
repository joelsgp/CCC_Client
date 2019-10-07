import React, { useReducer } from 'react';
import { DefaultComponentProps } from '../components/DefaultComponentProps';
import { User } from '../apiTypes/User';
import { AFetchComponentStates, AFetchComponent } from '../components/AFetchComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPowerOff, faDownload } from '@fortawesome/pro-solid-svg-icons';
import { ButtonGroup, Button } from 'reactstrap';
import moment from 'moment';
import { BrowserLabelComponent } from '../components/account/BrowserLabelComponent';

interface AccountStates extends AFetchComponentStates {
    user?: User;
}


export class AccountComponent extends AFetchComponent<DefaultComponentProps, AccountStates> {
    constructor(props: DefaultComponentProps) {
        super(props);
        this.state = {
            dataLoaded: false
        };

    }

    protected async handleReload(): Promise<void> {
        this.setState({
            user: (await this.props.env.api.getUser()).user
        });
    }

    async onLogoutClick() {
        this.setState({ dataLoaded: false });
        try {
            await this.api.logout();
            this.props.env.logout();
        } catch (e) {
            this.props.env.errorResolver.resolveError(e);
        }
        this.setState({ dataLoaded: true });
    }

    async onExportClick() {
        this.setState({ dataLoaded: false });
        try {
            let result = await this.api.exportData();
            window.open(result.url, "_blank");
        } catch (e) {
            this.props.env.errorResolver.resolveError(e);
        }
        this.setState({ dataLoaded: true });
    }

    renderFull(): JSX.Element {
        let user = this.state.user as User;

        return <>
            <div className="text-center">
                <FontAwesomeIcon icon={faUser} size="5x" />
                <h2>{user.name}</h2>
                <ButtonGroup>
                    <Button color="danger" onClick={this.onLogoutClick.bind(this)}>
                        <FontAwesomeIcon icon={faPowerOff} />
                        Logout
                </Button>
                    <Button color="primary" onClick={this.onExportClick.bind(this)}>
                        <FontAwesomeIcon icon={faDownload} />
                        Export Data
                </Button>
                </ButtonGroup>
                <hr />
                Account created on <strong>{moment(user.create * 1000).format("LLL")}</strong> <br />
                Logged in on <strong>{user.tokens}</strong> devices <br />
                <strong>{user.games}</strong> saved games
            </div>
            <div>
                <div className="accordion">
                    <BrowserLabelComponent env={this.props.env} />
                </div>
            </div>
        </>;
    }
}