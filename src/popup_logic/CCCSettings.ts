import { CCCAPI } from "./CCCAPI";

interface CCCSettingEntry {
    name: string;
    source: "chrome" | "local";
    default?: string;
}

class CCCSettings {
    private givenSettings: Array<CCCSettingEntry>;
    private settings: Map<string, string>;
    private changes: Map<string, string>;
    private api: CCCAPI;

    constructor(api: CCCAPI) {
        this.api = api;
        this.settings = new Map();
        this.changes = new Map();

        // Define Settings (Typehelp)
        this.givenSettings = [
            {
                "name": "attrMode",
                "source": "local",
                "default": "0"
            },
            {
                "name": "sorter",
                "source": "local",
                "default": "0"
            }
        ];
    }

    set(name: string, val: string) {
        this.settings.set(name, val);
        this.changes.set(name, val);
    }

    get(name: string) {
        return this.settings.get(name);
    }

    save() {
        // TODO: Save to Local and Cloud
    }

    load() {
        // TODO: Load from local and Cloud
    }
}