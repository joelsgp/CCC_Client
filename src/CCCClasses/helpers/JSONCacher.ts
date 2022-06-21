import { StringKeyObject } from "../CCCEnv";

export class JSONCacher {

    private key: string;
    public fallback: StringKeyObject;

    constructor(key: string) {
        this.key = key;
        this.fallback = undefined;
    }

    public get(): StringKeyObject {
        let entry = sessionStorage.getItem(this.key);
        if (entry != undefined) {
            return JSON.parse( entry );
        }
        else {
            return this.fallback;
        }
    }

    public set(obj: StringKeyObject): void {
        sessionStorage.setItem(this.key, JSON.stringify(obj));
    }
}