import { RouteEntry } from "./RouteEntry";
import Axios from "axios";
import * as $ from "jquery";

export abstract class InternalRouteEntry extends RouteEntry {
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