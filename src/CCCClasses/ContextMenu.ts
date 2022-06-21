import { CCCTransfereMessage } from "./transfer/CCCTransfereMessage";
import { CCCSettings } from "./CCCSettings";
import { CCCAPI } from "./CCCAPI";
import { SettingsAPIInformation } from "./SettingsAPIInformation";
import { CCCSave } from "../apiTypes/CCCSave";

let ctxIdToGame = new Map<string, string>();
let contextPages = <string[]> require('../LoadContextMenu.json');

function onMenuItemClick(data: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab): void {
    if (ctxIdToGame.has( data.menuItemId )) {
        new CCCTransfereMessage({
            cccCommand: "load",
            name: ctxIdToGame.get(data.menuItemId)
        }).sendToTab();
    }
}

export async function createContextMenu() : Promise<void> {
    let settings = new CCCSettings();
    await settings.load();
    settings.listenOnDataChanges();

    let api = new CCCAPI( new SettingsAPIInformation(settings) );

    const masterId = "CCC_quickload_ctxmenu";
    chrome.contextMenus.create({
        id: masterId,
        title: "Quick Load",
        contexts: ["all"],
        documentUrlPatterns: contextPages,
    });

    let idCounter = 0;

    let saves = <CCCSave[]> (await api.getSaves()).games;
    for (let save of saves) {
        let idName = masterId+"_"+(idCounter++);
        ctxIdToGame.set(idName, save.name);

        chrome.contextMenus.create({
            parentId: masterId,
            title: save.name,
            contexts: ["all"],
            id: idName
        });
    }

    chrome.contextMenus.onClicked.addListener(onMenuItemClick);
}