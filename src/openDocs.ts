export const baseUri = "https://wiki.timia2109.com/en/CookieClickerCloud/";

type DocTarget = "Changelog" | "Welcome" | "FAQ";

export function openDocs(target: DocTarget) {
    let url = getUri(target);
    chrome.tabs.create({ url }, function (tab) {
        console.log("[CCC] Install / Update action: " + url);
    });
}

export function getUri(target: DocTarget) {
    return baseUri + target;
}