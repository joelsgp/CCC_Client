import { CCCSettings } from "./CCCClasses/CCCSettings";

/**
 * Background Page on CC. Runs in CCC Thread, with access to the CC DOM Tree
 */

type StringKeyObject = {
    [key: string]: any;
}

let scriptid = 0;

// CCC Bannerlink
var bannerNode = document.createElement("div");
bannerNode.innerHTML = '<a href="https://timia2109.com/category/ccc/" target="_blank">CCC</a>';
bannerNode.id = "CCC_banner_node";

let settings = new CCCSettings();

function injectFile(filename: string): void {
    var url = chrome.extension.getURL(filename);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.setAttribute('id', 'modscript_ccc_' + (scriptid++));
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function refreshBannerNode() {
    // TODO: Bugfix!!
    settings.getAllSettings().forEach((v, k) => {
        bannerNode.dataset[k] = v;
    });
}

function onChromeValueChange(changes: StringKeyObject) {
    for (var i in changes) {
        bannerNode.dataset[i] = changes[i].newValue;
    }
}

function loadMods(settings: CCCSettings) {
    let mods = JSON.parse(settings.get("addons"));
    for (let mod of mods) {
        // Create script for mod
        let idArr = mod.split('/');
        let id = idArr[idArr.length - 1].split('.')[0];
        let modelm = document.createElement("script");
        modelm.type = "text/javascript";
        modelm.setAttribute("id", "modscript_" + id);
        modelm.src = mod;
        document.getElementsByTagName("head")[0].appendChild(modelm);
        console.log(`[CCC] Mod ${mod} loaded! Disable that mod on CCC if you got issues!`);
    }
}

document.getElementById("versionNumber").addEventListener("DOMSubtreeModified", async function () {
    await settings.load();

    // Insert Node
    document.getElementById("topBar").appendChild(bannerNode);

    refreshBannerNode();
    injectFile("js/vendor.js");
    injectFile("js/inject_cc.js");

    // Wait for changes
    chrome.storage.onChanged.addListener(onChromeValueChange);

    // Load mods
    loadMods(settings);
});