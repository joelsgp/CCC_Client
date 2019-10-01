import { CCCTransfereMessage } from "../CCCClasses/transfer/CCCTransfereMessage";

export function callSaveFunction(): void {
    new CCCTransfereMessage({
        cccCommand: "upload"
    }).sendToTab();
}

export function callRepeatSaveFunction(): void {
    new CCCTransfereMessage({
        cccCommand: "auto",
        interval: 300000
    }).sendToTab();
}