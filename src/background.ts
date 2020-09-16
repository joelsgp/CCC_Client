import { createContextMenu } from "./CCCClasses/ContextMenu";
import { openDocs } from "./openDocs";

chrome.runtime.onInstalled.addListener((details) => {
    // Wenn die App neu insterliert wurde
    if (details.reason == "install") {
        openDocs("Welcome");
    }
    // Wenn ein Update erfolgt ist
    else if (details.reason == "update") {
        openDocs("Changelog");
    }
});

createContextMenu();