import { CCCAPI } from "./CCCAPI";
import { EventHandler } from "./EventHandler";
import { CookieColorParser } from "./helpers/CookieColorParser";
import { CCCSettings } from "./CCCSettings";
import { ErrorResponse } from '../apiTypes/PlainResponse';
import { SettingsAPIInformation } from "./SettingsAPIInformation";
import ILoginStateChangedListener from "../utils/ILoginStateChangedListener";

export interface StringKeyObject {
    [key: string]: any;
}

export interface IErrorResolver {
    resolveError(error: ErrorResponse) : void;
}

export class CCCEnv extends EventHandler {
    api: CCCAPI;
    colorParser: CookieColorParser;
    settings: CCCSettings;
    errorResolver?: IErrorResolver;
    loginStateListener: ILoginStateChangedListener[];

    constructor() {
        super();
        this.settings = new CCCSettings();

        this.api = new CCCAPI( new SettingsAPIInformation(this.settings) );
        this.api.onUrlChange = (url) => {
            this.settings.set("url", url);
            this.settings.save();
        };

        this.loginStateListener = [];
        this.colorParser = new CookieColorParser();
    }

    get isLogin(): boolean {
        return this.settings.get("token") !== "";
    }

    open(url: string) : void {
        location.hash = url;
    }

    login(token: string) {
        this.settings.set("token", token);
        this.settings.save();
        this.loginStateListener.forEach(l => l.loginStateChanged(this.isLogin));
        this.open("#/");
    }

    plainLogout() : void {
        this.settings.restore("token");
        this.settings.save();
    }

    logout() : void {
        this.plainLogout();
        this.open("#login");
        this.loginStateListener.forEach(l => l.loginStateChanged(this.isLogin));
    }
}