import * as moment from 'moment';
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import { CCCEnv } from './CCCClasses/CCCEnv';
import { isCookieClickerPage } from './CCCClasses/CCCUtils';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom";
import { NavBarComponent } from './components/navBar/NavBarComponent';
import { MotDComponent } from './components/shared/MotDComponent';
import { HomeComponent } from './pages/Home';
import { ErrorComponent } from './components/shared/ErrorComponent';
import Constants from './utils/Constants';
import { DefaultComponentProps } from './components/DefaultComponentProps';
import { ChangeServerComponent } from './components/shared/ChangeServerComponent';
import { LoginPageComponent } from './pages/LoginPage';
import { HelpComponent } from './pages/Help';
import { Container } from 'reactstrap';
import { AccountComponent } from './pages/Account';

class Popup extends React.Component<DefaultComponentProps> {

    render(): JSX.Element {
        return <>
            <NavBarComponent env={this.props.env} />
            <ErrorComponent env={this.props.env} />
            <Container>
                <Router>
                    <Switch>
                        <Route path="/help">
                            <HelpComponent />
                        </Route>
                        <Route path="/account">
                            <AccountComponent env={this.props.env} />
                        </Route>
                        <Route path="/login">
                            <LoginPageComponent env={this.props.env} />
                        </Route>
                        <Route path="/" exact>
                            <HomeComponent env={this.props.env} />
                        </Route>
                    </Switch>
                </Router>
            </Container>
            <MotDComponent env={this.props.env} />
            <div className="text-center">
                CCC is an extension / servce by 
                <a href="https://timia2109.com" target="_blank" className="ml-1">
                    Tim Ittermann (@timia2109)
                </a>
                <br />
                Cookie Clicker is a game by 
		        <a href="http://orteil.dashnet.org/" target="_blank" className="ml-1">
                    Orteil
		        </a>
            </div>
            <ChangeServerComponent env={this.props.env} />
        </>;
    }
}

async function initialize() {
    // Precheck things
    try {
        // Check if CC
        if (await isCookieClickerPage() == false) {
            // Abort plugin, open CC
            window.open(Constants.CookieClickerUrl, "_blank");
        }
    } catch (e) {
        console.log(e);
    }

    // Moment locale
    let locale = window.navigator.language;
    locale = locale.substring(0, locale.indexOf("-"));
    moment.locale(locale);

    // Init CCC Enviroment
    let env = new CCCEnv();
    await env.settings.load();

    // Open Login
    if (!env.isLogin) {
        env.open("#/login");
    }

    ReactDOM.render(<Popup env={env} />, document.getElementById("root"));
}

initialize();