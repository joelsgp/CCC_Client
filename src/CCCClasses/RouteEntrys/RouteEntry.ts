import { EventHandler } from "../EventHandler";
import { CCCEnv } from "../CCCEnv";
import * as JQuery from "jquery";

export abstract class RouteEntry extends EventHandler {
    name: string;
    icon: string;
    visible: boolean = true;

    constructor(name: string, icon: string) {
        super();
        this.name = name;
        this.icon = icon;
    }

    abstract getNode(): JQuery;
    abstract getRouteName(): string;
    abstract open(): Promise<JQuery> | null;
    abstract afterDomLoad(env: CCCEnv): any;
}