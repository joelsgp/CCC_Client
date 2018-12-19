import { ClickRouteEntry } from "../RouteEntrys/ClickRouteEntry";
import { CCCEnv } from "../CCCEnv";

export class SaveButton extends ClickRouteEntry {

    constructor(env: CCCEnv) {
        super("Save Game", "fas fa-cloud-upload-alt", env);
    }

    open(): null {
        this.env.callOnCC(
            "upload"
        );
        return null;
    }

}

export class SaveRepeatButton extends ClickRouteEntry {
    constructor(env: CCCEnv) {
        super("Save every 5 mins", "fas fa-redo", env);
    }

    open(): null {
        this.env.callOnCC(
            "auto", 
            {
                interval: 300000
            }
        );
        return null;
    }
}