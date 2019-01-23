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
        return {};
    }
}