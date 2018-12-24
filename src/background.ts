
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