import { CCCSettings } from "./CCCClasses/CCCSettings";

/**
 * Background Page on CC. Runs in CCC Thread, with access to the CC DOM Tree
 */

type StringKeyObject = {
    [key: string]: any;
}

// CCC Bannerlink
var bannerNode = document.createElement("div");
bannerNode.innerHTML = '<a href="https://timia2109.com/category/ccc/" target="_blank">CCC</a>';
bannerNode.id = "CCC_banner_node";

let settings = new CCCSettings();

function injectFile(filename: string) : void {
    debugger;
    var url = chrome.extension.getURL(filename);
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.setAttribute('id','modscript_ccc');
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    debugger;
}

function refreshBannerNode() {
    // TODO: Bugfix!!
    for (let k in settings.getAllSettings()) {
        bannerNode.dataset[k] = settings.get(k);
    }
}

function onChromeValueChange(changes: StringKeyObject) {
    for (var i in changes) {
        bannerNode.dataset[i] = changes[i].newValue;
    }
}

function onModsLoad(chromed) {
    if (chromed.mods) {
        let mods : Array<string> = JSON.parse( chromed.mods );
        for (let mod of mods){
            // Create script for mod
            let idArr = mod.split('/');
            let id = idArr[idArr.length-1].split('.')[0];
            let modelm = document.createElement("script");
            modelm.type = "text/javascript";
            modelm.setAttribute("id", "modscript_"+id);
            modelm.src = mod;
            document.getElementsByTagName("head")[0].appendChild(modelm);
            console.log(`[CCC] Mod ${mod} loaded! Disable that mod on CCC if you got issues!`);
        }
    }
}

window.addEventListener("load", async function () {
    
    await settings.load();

    refreshBannerNode();
    injectFile("js/vendor.js");
    injectFile("js/inject_cc.js");

    // Wait for changes
    chrome.storage.onChanged.addListener(onChromeValueChange);

    // Insert Node
    document.getElementById("topBar").appendChild(bannerNode);

    // Load mods
    chrome.storage.local.get(["mods"], onModsLoad);
});