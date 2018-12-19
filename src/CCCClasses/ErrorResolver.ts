import { ErrorResponse } from "../apiTypes/PlainResponse";
import { CCCEnv } from "./CCCEnv";
import { getAlert, scrollTo } from "./CCCUtils";
import moment = require("moment");
import * as $ from "jquery";

export interface IErrorResolver {
    resolveError(error: ErrorResponse) : void;
}

export class ErrorResolver implements IErrorResolver {
    private env: CCCEnv;

    constructor(env: CCCEnv) {
        this.env = env;
    }

    resolveError(error: ErrorResponse): void {
        console.log(error);
        if (!error || !error.error) {
            error = {
                ok: false,
                error: "unknown"
            };
        }
    
        // Actions on defined errors
        if (error.error == "token") {
            this.env.logout();
            return;
        }
        else if (error.error == "login_required") {
            this.env.router.open("login");
            return;
        }
    
        var alert = getAlert(
            "alert-danger",
            "Error",
            errors[error.error]
        );
    
        if (error.error == "maintenance") {
            var p = $("<p>")
                .append("The maintenance is planned from ")
                .append( 
                    $("<b>").text( moment(error.from * 1000).format("LLL") )
                )
                .append(" until ")
                .append(
                    $("<b>").text( moment(error.to * 1000).format("LLL") )
                );
            
            if (error.message) {
                p.append(" with the message ")
                    .append(
                        $("<b>").text(error.message)
                    );
            }
    
            $("#pageContainer").html("");
            $("#pageContainer").prepend(alert.append(p));
            return;
        }
    
        $("#pageContainer").prepend(alert);
    
        scrollTo(alert);
    }
}

interface ErrorTextObject {
    [key: string]: string;
}

let errors: ErrorTextObject;

errors = {
    "unexpected_resp": "Unexpected response. Please try it again later",
    "connection": "Error by connection. Are you online?",
    "unknown": "I don't know what's going on...",
    "url": "Wrong URL parameters",
    "save": "Error by saving your game",
    "credentials": "Wrong username or wrong password",
    "username": "Your username is invalid.",
    "token": "Your token is invalid. STOP! You shouldn't see that message...",
    "logout": "I can't logout. Try again!",
    "register": "Error while creating your account...",
    "user_404": "Username is unknown",
    "login_required": "You need to login. You also shouldn't see that!",
    "missing_parameter": "Parameters are missing. Why do you see that?",
    "username_taken": "This username is already used",
    "game_404": "Game 404",
    "maintenance": "The server is in maintenance mode. Please wait until i finish the work."
};