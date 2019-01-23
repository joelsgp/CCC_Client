import { CCCSettings } from "./CCCClasses/CCCSettings";
import { CCCAPI } from "./CCCClasses/CCCAPI";
import { SettingsAPIInformation } from "./CCCClasses/SettingsAPIInformation";
import { CCCSave } from "./apiTypes/CCCSave";
import { CCCTransfereMessage } from "./CCCClasses/transfer/CCCTransfereMessage";

function openDoc(docName: string) {
    let url = chrome.runtime.getURL("docs/index.html?f="+docName+"&hideMenu=1");
    chrome.tabs.create({ url }, function (tab) {
        console.log("[CCC] Install / Update action: "+ url);
    });
}

chrome.runtime.onInstalled.addListener((details) => {
    // Wenn die App neu insterliert wurde
    if (details.reason == "install") {
        openDoc("install");
    }
    // Wenn ein Update erfolgt ist
    else if (details.reason == "update") {
        openDoc("changelog");
    }
});

let ctxIdToGame = new Map<string, string>();
let contextPages = <string[]> require('./LoadContextMenu.json');

function onMenuItemClick(data: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab): void {
    if (ctxIdToGame.has( data.menuItemId )) {
        new CCCTransfereMessage({
            cccCommand: "load",
            name: ctxIdToGame.get(data.menuItemId)
        }).sendToTab();
    }
}

async function createContextMenu() : Promise<void> {
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

createContextMenu();