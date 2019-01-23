import { StringKeyObject } from "../CCCEnv";

export type CCCTransfereCommand = LoadCommand|UploadCommand|AutoCommand;

export type LoadCommand = {
    cccCommand: "load",
    name: string
};

export type UploadCommand = {
    cccCommand: "upload";
};

export type AutoCommand = {
    cccCommand: "auto",
    interval: number
};

export class CCCTransfereMessage {
    command: CCCTransfereCommand;

    constructor(command: CCCTransfereCommand) {
        this.command = command;
    }

    sendToTab(): void {
        chrome.tabs.executeScript(null, {
            "code": `window.postMessage('${this.getJson()}','*')`
        });
    }

    sendDirect() : void {
        window.postMessage(this.getJson(), '*');
    }

    private getJson() {
        return JSON.stringify(this.command);
    }
}