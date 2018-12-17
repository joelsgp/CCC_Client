import { CCCAPI } from "./CCCAPI";
import { EventHandler } from "../EventHandler";
import { SmallRouter } from "./SmallRouter";
import { CookieColorParser } from "./CookieColorParser";

export interface CCCEnvDom {
    menu: JQuery;
    container: JQuery;
}

export class CCCEnv extends EventHandler {
    version: string;
    url: string = "https://cc.timia2109.com/v2.php";
    browser: "C" | "F" | "O" | "0" = "0";
    api: CCCAPI;
    router: SmallRouter;
    colorParser: CookieColorParser;

    constructor(dom: CCCEnvDom) {
        super();
        this.api = new CCCAPI(this);
        this.router = new SmallRouter(dom.container, dom.menu);
        this.colorParser = new CookieColorParser();
    }

    private setEnvVars(): void {
        this.version = chrome.runtime.getManifest().version;

        // Browser detection
        var browserName = navigator.userAgent;
        if (navigator.userAgent.match(/Opera|OPR\//))
            this.browser = 'O';
        else if (browserName.indexOf("Chrome") != -1)
            this.browser = "C";
        else if (browserName.indexOf("Firefox") != -1)
            this.browser = "F";
        else
            this.browser = "0";
    }

    login(token: string) {
        chrome.storage.local.set({token: token});
        this.api.token = token;
    }

    plainLogout() : void {
        chrome.storage.local.remove([
            "token"
        ]);
        this.api.token = null;
    }

    logout() : void {
        this.plainLogout();
        this.router.open("login");
    }
}