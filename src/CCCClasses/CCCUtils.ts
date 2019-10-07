import * as bootstrap from "bootstrap";
import $ from "jquery";
import Constants from "../utils/Constants";

export function scrollTo(item: JQuery) : void {
    $("html, body").animate({
        scrollTop: item.offset().top
    }, 500);
}

export function getCurrentTabURL() : Promise<string> {
	return new Promise((resolve, reject)=>{
		chrome.tabs.query({
			"active": true,
			"lastFocusedWindow": true
		}, (tabs)=>{
			if (tabs && tabs.length > 0) {
				resolve(tabs[0].url);
			}
			else {
				reject(chrome.runtime.lastError);
			}
		});
	});
}

export async function isCookieClickerPage() : Promise<boolean> {
	let url = await getCurrentTabURL();
	return url.indexOf("cookieclicker") != -1
}

export function getEditorUrl(savename: string) : string {
	return Constants.EditorUrl+encodeURIComponent(savename);
}