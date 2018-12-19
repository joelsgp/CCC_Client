import { InternalRouteEntry } from "../RouteEntrys/InternalRouteEntry";
import { CCCEnv } from "../CCCEnv";

export class Help extends InternalRouteEntry {
    constructor() {
        super("Help", "fas fa-question-circle", "help");
    }

    afterDomLoad(env: CCCEnv) {
        // Nothing todo
    }
}