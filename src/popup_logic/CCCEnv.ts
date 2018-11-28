import { CCCAPI } from "./CCCAPI";

export class CCCEnv {
    version: string;
    url: string = "https://cc.timia2109.com/v2.php";
    browser: "C"|"F"|"O"|"0" = "0";
    api: CCCAPI;

    constructor() {
        this.api = new CCCAPI(this);
    }
}