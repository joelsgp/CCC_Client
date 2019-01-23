import { ClickRouteEntry } from "../RouteEntrys/ClickRouteEntry";
import { CCCEnv } from "../CCCEnv";
import { CCCTransfereMessage } from "../transfer/CCCTransfereMessage";

export class SaveButton extends ClickRouteEntry {

    constructor(env: CCCEnv) {
        super("Save Game", "fas fa-cloud-upload-alt", env);
    }

    open(): null {
        new CCCTransfereMessage({
            cccCommand: "upload"
        }).sendToTab();
        return null;
    }

}

export class SaveRepeatButton extends ClickRouteEntry {
    constructor(env: CCCEnv) {
        super("Save every 5 mins", "fas fa-redo", env);
    }

    open(): null {
        new CCCTransfereMessage({
            cccCommand: "auto",
            interval: 300000
        }).sendToTab();
        return null;
    }
}