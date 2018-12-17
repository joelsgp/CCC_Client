import { EventHandler } from "../EventHandler";
import * as $ from "jquery";
import Axios from "axios";

export abstract class RouteEntry extends EventHandler {
    name: string;
    icon: string;

    constructor(name: string, icon: string) {
        super();
        this.name = name;
        this.icon = icon;
    }

    abstract getNode(): JQuery;
    abstract getRouteName(): string;
    abstract open(): Promise<JQuery> | null;

    notifyOpen(): void {
        this.notify("open");
    }
}

export class ExternalRouteEntry extends RouteEntry {
    uri: string;

    constructor(name: string, icon: string, uri: string) {
        super(name, icon);
        this.uri = uri;
    }

    getRouteName(): string {
        return this.uri;
    }

    getNode(): JQuery {
        /*<li class="nav-item" title="News">
			<a class="nav-link" href="https://timia2109.com/category/ccc/" target="_blank">
				<i class="fas fa-newspaper"></i>
			</a>
		</li>*/
        let node = $('<li class="nav-item">');
        node.attr("title", this.name);

        let a = $('<a class="nav-link">');
        a.attr("href", this.getRouteName())
            .attr("target", "_blank")
            .appendTo(node)
            .append(
                $("<i>")
                    .attr("class", this.icon)
            );

        return node;
    }

    open() : null {return null;}
}

export class InternalRouteEntry extends RouteEntry {

    filename: string;

    constructor(name: string, icon: string, filename: string) {
        super(name, icon);
        this.filename = filename;
    }

    getRouteName(): string {
        return "#" + this.filename;
    }

    getNode(): JQuery {
        /*<li class="nav-item" title="Help">
			<a class="nav-link" href="#help">
				<i class="fas fa-question-circle"></i>
			</a>
        </li>*/
        let node = $('<li class="nav-item">');
        node.attr("title", this.name);

        let a = $('<a class="nav-link">');
        a.attr("href", this.getRouteName())
            .appendTo(node)
            .append(
                $("<i>")
                    .attr("class", this.icon)
            );

        return node;
    }

    async open(): Promise<JQuery> | null {
        // ./popup_pages/XXX.html
        let html = await Axios.get("/popup_pages/" + this.filename + ".html");
        let dom = $(html.data);
        return dom;
    }
}

export class SmallRouter {

    private fallback: string;
    private container: JQuery;
    private menu: JQuery;
    private routes: Map<string, RouteEntry>;

    constructor(container: JQuery, menu: JQuery) {
        this.container = container;
        this.menu = menu;
        this.routes = new Map();
        this.fallback = "#home";

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
                this.container.html("");
                this.container.append(dom);

                routeEntry.notifyOpen();
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
    }

    open(routename: string) {
        location.hash = routename;
    }
}