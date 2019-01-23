import { CCCAPIInformation, HeaderMap } from "./CCCAPIInformation";
import { CCCSettings } from "./CCCSettings";

export class SettingsAPIInformation implements CCCAPIInformation {
    private settings: CCCSettings;

    constructor(settings: CCCSettings) {
        this.settings = settings;
    }

    get token(): string {
        return this.settings.get("token");
    }

    get baseUrl(): string {
        return this.settings.get("url");
    }

    getApiHeaders(): HeaderMap {
        let data = {
            "X-Browser": SettingsAPIInformation.getBrowser(),
            "X-Pluginv": SettingsAPIInformation.getVersion()
        };

        if (this.settings.get("browserlabel") != "") {
            data["X-Browser-Label"] = this.settings.get("browserlabel");
        }

        return data;
    }

    static getBrowser() : "C" | "F" | "O" | "0" {
        // Browser detection
        var browserName = navigator.userAgent;
        if (navigator.userAgent.match(/Opera|OPR\//))
            return 'O';
        else if (browserName.indexOf("Chrome") != -1)
            return "C";
        else if (browserName.indexOf("Firefox") != -1)
            return "F";
        else
            return "0";
    }

    static getVersion() : string {
        return chrome.runtime.getManifest().version;
    }
}