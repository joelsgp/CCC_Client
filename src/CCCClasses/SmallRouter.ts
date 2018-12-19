import * as $ from "jquery";
import { RouteEntry } from "./RouteEntrys/RouteEntry";
import { CCCEnv } from "./CCCEnv";

export class SmallRouter {

    private fallback: string;
    private container: JQuery;
    private menu: JQuery;
    private routes: Map<string, RouteEntry>;
    private env: CCCEnv;

    constructor(container: JQuery, menu: JQuery, env: CCCEnv) {
        this.container = container;
        this.menu = menu;
        this.routes = new Map();
        this.fallback = "#home";
        this.env = env;

        // Register handler
        $(window).on("hashchange", $.proxy(this.onRouteChange, this));
    }

    /*_setRefreshFunction(callback) {
        this.onRefresh = callback;
    }*/

    onPageFail() {
        this.container.html("<h1>Page can't loaded. Thats a huge error...</h1>");
    }

    /*    refresh() {
            if (onRefresh !== null) {
                onRefresh();
            }
        }*/

    async onRouteChange() {
        var hash = location.hash;
        //Remove -xxxxx
        var indexPoint = hash.indexOf("-");
        if (indexPoint != -1) {
            hash = hash.substring(0, indexPoint);
        }

        if (this.routes.has(hash)) {
            $(".nav-item", this.menu).removeClass("active");
            $("[href='" + hash + "']", this.menu).parent().addClass("active");

            let routeEntry = this.routes.get(hash);

            try {
                let dom = await routeEntry.open();
                if (dom != null) {
                    this.container.html("");
                    this.container.append(dom);

                    routeEntry.afterDomLoad(this.env);
                }
            } catch (e) {
                this.onPageFail();
            }
        }
        else {
            this.open(this.fallback);
        }
    }

    addRoute(route: RouteEntry) {
        this.routes.set(route.getRouteName(), route);
        if (route.visible) {
            this.menu.append(route.getNode());
        }
    }

    addRoutes(routes: RouteEntry[]) {
        routes.forEach((e) => this.addRoute(e));
    }

    open(routename: string) {
        location.hash = routename;
    }
}