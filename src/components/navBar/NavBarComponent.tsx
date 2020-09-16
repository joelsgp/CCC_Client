import React from 'react';
import { SettingsAPIInformation } from '../../CCCClasses/SettingsAPIInformation';
import { faHome, faQuestionCircle, faNewspaper, faUser, faCloudUploadAlt, faRedo, faCookie } from '@fortawesome/free-solid-svg-icons';
import { UrlNavEntryComponent } from './UrlNavEntryComponent';
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { ActionNavEntryComponent } from './ActionNavEntryComponent';
import { callSaveFunction, callRepeatSaveFunction } from '../../utils/SaveHelpers';
import Constants from '../../utils/Constants';
import { DefaultComponentProps } from '../DefaultComponentProps';
import ILoginStateChangedListener from '../../utils/ILoginStateChangedListener';
import { Badge } from 'reactstrap';

interface NavBarState {
    loggedIn: boolean;
}

export class NavBarComponent extends React.Component<DefaultComponentProps, NavBarState> implements ILoginStateChangedListener {
    
    constructor(props: DefaultComponentProps) {
        super(props);
        props.env.loginStateListener.push(this);

        this.state = {
            loggedIn: this.props.env.isLogin
        };
    }

    loginStateChanged(isLogin: boolean) {
        this.setState({
            loggedIn: isLogin
        });
    }

    render(): JSX.Element {
        if (!this.state.loggedIn) {
            return <NavHeaderComponent />
        }

        return <>
            <NavHeaderComponent />
            <ul className="nav cccmenu" id="iconMenu">
                <UrlNavEntryComponent icon={faHome} title="Home" href="#/" itemId="nav-home" />
                <UrlNavEntryComponent icon={faQuestionCircle} title="Help" href="#/help" itemId="nav-help" />
                <UrlNavEntryComponent icon={faDiscord} title="Discord Community" href="https://discord.gg/Ww6b3d5" blank itemId="nav-discord" />
                <UrlNavEntryComponent icon={faNewspaper} title="News" href="https://cc.timia2109.com" blank itemId="nav-news" />
                <UrlNavEntryComponent icon={faUser} title="Account and Settings" href="#/account" itemId="nav-account" />
                <ActionNavEntryComponent icon={faCloudUploadAlt} title="Upload Game" onClick={callSaveFunction} itemId="nav-save" />
                <ActionNavEntryComponent icon={faRedo} title="Upload Game every 5 mins" onClick={callRepeatSaveFunction} itemId="nav-repeatsave" />
                <UrlNavEntryComponent icon={faCookie} title="Open CookieClicker" href={Constants.CookieClickerUrl} blank hidden={SettingsAPIInformation.getBrowser() !== "F"} itemId="nav-openCC" />
            </ul>
        </>;
    }
}

function NavHeaderComponent(): JSX.Element {
    return <div className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#/">
            <img src="imgs/Logo48.png" width="30" height="30" className="d-inline-block align-top mr-1" alt="" />
            Cookie Clicker Cloud 
            <Badge className="ml-1" color="primary">{SettingsAPIInformation.getVersion()}</Badge>
        </a>
    </div>;
}