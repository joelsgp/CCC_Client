import { CCCAPI } from "./CCCAPI";
import { EventHandler } from "./EventHandler";
import { SmallRouter } from "./SmallRouter";
import { CookieColorParser } from "./helpers/CookieColorParser";
import { CCCAPIInformation, HeaderMap } from "./CCCAPIInformation";
import { CCCSettings } from "./CCCSettings";
import { IErrorResolver, ErrorResolver } from "./helpers/ErrorResolver";
import { scrollTo, getAlert, AlertTypes } from "./CCCUtils";
import * as $ from "jquery";
import { SettingsAPIInformation } from "./SettingsAPIInformation";

export interface CCCEnvDom {
    menu: JQuery;
    container: JQuery;
    motd_area: JQuery;
}

export interface StringKeyObject {
    [key: string]: any;
}

export class CCCEnv extends EventHandler {
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
        this.settings = new CCCSettings();
        
        this.api = new CCCAPI( new SettingsAPIInformation(this.settings) );
        this.api.onMotD = (m)=>this.onMessageOfTheDay(m);
        this.api.onUrlChange = (url) => {
            this.settings.set("url", url);
            this.settings.save();
        };

        this.router = new SmallRouter(dom.container, dom.menu, this);
        this.colorParser = new CookieColorParser();
    }

    onMessageOfTheDay(motd: string) : void {
        this.domElements.motd_area.text(motd);
    }

    login(token: string) {
        this.settings.set("token", token);
        this.settings.save();
    }

    plainLogout() : void {
        this.settings.restore("token");
        this.settings.save();
    }

    logout() : void {
        this.plainLogout();
        this.router.open("login");
    }

    alert(alertClass: AlertTypes, headText: string, bodyText: string, removeAfter: number = 5000) : void {
        let alert = getAlert(alertClass, headText, bodyText);
        $("#pageContainer").prepend(alert);
        scrollTo(alert);

        if (removeAfter != -1) {
            setTimeout(()=>alert.remove, removeAfter);
        }
    }
}