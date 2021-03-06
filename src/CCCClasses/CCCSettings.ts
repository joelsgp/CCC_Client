import { StringKeyObject } from "./CCCEnv";
import { EventHandler } from "./EventHandler";

interface CCCSettingEntrys {
    [key: string]: {
        source: "sync" | "local",
        default: string,
        userChangeable: boolean
    };
}

type storageItem = { [key: string]: any };

let settings: CCCSettingEntrys = {
    token: {
        source: "local",
        default: "",
        userChangeable: false
    },
    url: {
        source: "local",
        default: "https://cc.timia2109.com/v2.php",
        userChangeable: false
    },
    browserlabel: {
        source: "local",
        default: "",
        userChangeable: true
    },
    addons: {
        source: "sync",
        default: "[]",
        userChangeable: true
    },
    attrMode: {
        source: "sync",
        default: "0",
        userChangeable: true
    },
    sorter: {
        source: "sync",
        default: "0",
        userChangeable: false
    }
};

export class CCCSettings extends EventHandler {
    private cLocalStorage: ChromeStorageWrapper;
    private cSyncStorage: ChromeStorageWrapper;

    private settings: Map<string, string>;
    private changes: Map<string, string>;
    private onChromeChangesListener: (data: any) => any;

    constructor() {
        super();
        this.cLocalStorage = new ChromeStorageWrapper(chrome.storage.local);
        this.cSyncStorage = new ChromeStorageWrapper(chrome.storage.sync);

        this.settings = new Map();
        this.changes = new Map();
        this.onChromeChangesListener = (data)=>this.onChromeValueChange(data);
    }

    listenOnDataChanges(listen: boolean = true): void {
        if (listen) {
            chrome.storage.onChanged.addListener(this.onChromeChangesListener);
        }
        else {
            chrome.storage.onChanged.removeListener(this.onChromeChangesListener);
        }
    }

    set(name: string, val: string): void {
        this.settings.set(name, val);
        this.changes.set(name, val);
        this.notify("change", this);
    }

    get(name: string): string {
        return this.settings.get(name);
    }

    restore(name: string) : string {
        let defaultVal = settings[name].default;
        this.set(name, defaultVal);
        this.notify("change", this);
        return defaultVal;
    }

    private onChromeValueChange(changes: StringKeyObject) {
        for (var i in changes) {
            this.set(i, changes[i].newValue);
            this.changes.delete(i);
        }
    }

    private getLocalKeys(): string[] {
        let locals = [];

        for (let key in settings) {
            if (settings[key].source == "local") {
                locals.push(key);
            }
        }

        return locals;
    }

    private getSyncKeys(): string[] {
        let locals = [];

        for (let key in settings) {
            if (settings[key].source == "sync") {
                locals.push(key);
            }
        }

        return locals;
    }

    async save() : Promise<boolean> {
        if (this.changes.size == 0) { return; }
        let localEntrys = {};
        let syncEntrys = {};

        this.changes.forEach((v,k) => {
            if (settings[k].source == "local") {
                localEntrys[k] = v;
            }
            else {
                syncEntrys[k] = v;
            }
        });

        await Promise.all([
            this.cLocalStorage.set(localEntrys),
            this.cSyncStorage.set(syncEntrys)
        ]);
        return true;
    }

    async load(): Promise<boolean> {
        let [local, remote] = await Promise.all([
            this.cLocalStorage.get(this.getLocalKeys()),
            this.cSyncStorage.get(this.getSyncKeys())
        ]);

        this.import(local);
        this.import(remote);

        // Default Werte
        for (let key in settings) {
            if (!this.settings.has(key)) {
                this.settings.set(key, settings[key].default);
            }
        }

        return true;
    }

    private import(items: storageItem) {
        for (let key in items) {
            this.settings.set(key, items[key]);
        }
    }

    getAllSettings(): Map<string, string> {
        return this.settings;
    }
}

class ChromeStorageWrapper {
    private storage: chrome.storage.StorageArea;

    constructor(storage: chrome.storage.StorageArea) {
        this.storage = storage;
    }

    get(keys: string | string[] | Object | null): Promise<storageItem> {
        return new Promise((resolve) => {
            this.storage.get(keys, (items) => {
                resolve(items);
            })
        });
    }

    set(items: Object): Promise<undefined> {
        return new Promise((resolve) =>
            this.storage.set(items, () => resolve)
        );
    };
}