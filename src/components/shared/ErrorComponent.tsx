import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { IErrorResolver, CCCEnv } from '../../CCCClasses/CCCEnv';
import { ErrorResponse } from '../../apiTypes/PlainResponse';
import { Alert } from 'reactstrap';
import moment from 'moment';

interface ErrorStates {
    errorTexts: (JSX.Element | string)[];
}

type ErrorInfoObject = {
    text: string,
    dontHide?: boolean,
    redirect?: string,
    action?: (error: ErrorResponse, env: CCCEnv) => void | JSX.Element | string;
}

interface ErrorUIElement {
    [key: string]: string | ErrorInfoObject;
}

let errors: ErrorUIElement = {
    "unexpected_resp": "Unexpected response. Please try it again later",
    "connection": "Error by connection. Are you online?",
    "unknown": "I don't know what's going on...",
    "url": "Wrong URL parameters",
    "save": "Error by saving your game",
    "credentials": "Wrong username or wrong password",
    "username": "Your username is invalid.",
    "token": {
        text: "Your token is invalid. STOP! You shouldn't see that message...",
        action: (error, env) => env.logout()
    },
    "logout": "I can't logout. Try again!",
    "register": "Error while creating your account...",
    "user_404": "Username is unknown",
    "login_required": {
        text: "You need to login. You also shouldn't see that!",
        redirect: "#login"
    },
    "missing_parameter": "Parameters are missing. Why do you see that?",
    "username_taken": "This username is already used",
    "game_404": "Game 404",
    "maintenance": {
        text: "The server is in maintenance mode. Please wait until i finish the work.",
        dontHide: true,
        action: (error, env) => {
            let from = error.from as number;
            let to = error.to as number;

            return <p>
                The maintenance is planned from
                <b>{moment(from * 1000).format("LLL")}</b>
                until
                <b>{moment(to * 1000).format("LLL")}</b>
            </p>;
        }
    }
};

export class ErrorComponent extends React.Component<DefaultComponentProps, ErrorStates> implements IErrorResolver {

    constructor(props: DefaultComponentProps) {
        super(props);

        this.state = {
            errorTexts: []
        }

        this.props.env.errorResolver = this;
    }

    resolveError(error?: ErrorResponse): void {
        if (!error || error.error == undefined) {
            error = {
                ok: false,
                error: "unknown"
            };
        }

        let errorInformation = errors[error.error as string];
        let useOut: string | JSX.Element | undefined;
        let hide = true;

        if (typeof errorInformation == "string") {
            useOut = errorInformation;
        }
        else {
            if (errorInformation.dontHide) {
                hide = false;
            }

            if (errorInformation.action) {
                let response = errorInformation.action(error, this.props.env);
                if (response) {
                    useOut = response;
                }
            }
            else if (errorInformation.redirect) {
                this.props.env.open(errorInformation.redirect);
            }
        }

        if (useOut) {
            this.state.errorTexts.push(useOut);
            this.setState({
                errorTexts: this.state.errorTexts
            });

            if (hide) {
                setTimeout(() => {
                    let errorTexts = this.state.errorTexts.filter(e => e !== useOut);
                    this.setState({ errorTexts });
                }, 5000);
            }
        }

    }

    render(): JSX.Element {
        return <>
            {
                this.state.errorTexts.map(e => <Alert color="danger">
                    <strong>Error</strong>
                    {e}
                </Alert>)
            }
        </>;
    }
}

