import { CCCAPI } from "./CCCAPI";
import { EventHandler } from "./EventHandler";
import { SmallRouter } from "./SmallRouter";
import { CookieColorParser } from "./CookieColorParser";
import { CCCAPIInformation, HeaderMap } from "./CCCAPIInformation";
import { CCCSettings } from "./CCCSettings";
import { IErrorResolver, ErrorResolver } from "./ErrorResolver";

export interface CCCEnvDom {
    menu: JQuery;
    container: JQuery;
    motd_area: JQuery;
}

export interface StringKeyObject {
    [key: string]: any;
}

export class CCCEnv extends EventHandler implements CCCAPIInformation {
    token: string | null;
    version: string;
    baseUrl: string = "https://cc.timia2109.com/v2.php";
    browser: "C" | "F" | "O" | "0" = "0";
    api: CCCAPI;
    router: SmallRouter;
    colorParser: CookieColorParser;
    settings: CCCSettings;
    errorResolver: IErrorResolver;
    domElements: CCCEnvDom;

    constructor(dom: CCCEnvDom) {
        super();
        this.domElements = dom;
        this.errorResolver = new ErrorResolver(this);
        this.token = null;
        this.api = new CCCAPI(this);
        this.api.onMotD = ()=>this.onMessageOfTheDay;
        this.router = new SmallRouter(dom.container, dom.menu, this);
        this.colorParser = new CookieColorParser();
        this.settings = new CCCSettings();
        this.setEnvVars();
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

    onMessageOfTheDay(motd: string) : void {
        this.domElements.motd_area.text(motd);
    }

    getApiHeaders() : HeaderMap {
        let headerMap = {
            "X-Pluginv": this.version,
            "X-Browser": this.browser
        };
        
        if (this.settings.get("browserlabel") != "") {
            headerMap["X-Browser-Label"] = this.settings.get("browserlabel");
        }

        return headerMap;
    }

    login(token: string) {
        chrome.storage.local.set({token: token});
        this.token = token;
    }

    plainLogout() : void {
        chrome.storage.local.remove([
            "token"
        ]);
        this.token = null;
    }

    logout() : void {
        this.plainLogout();
        this.router.open("login");
    }

    callOnCC(method: string, args: StringKeyObject = {}) {
        let taskDescriptor = {
            cccCommand: method
        };
        
        // Merge things
        Object.assign(taskDescriptor, args);

        let json = JSON.stringify(taskDescriptor);

        chrome.tabs.executeScript(null, {
            "code": `window.postMessage('${json}')`
        });
    }
}