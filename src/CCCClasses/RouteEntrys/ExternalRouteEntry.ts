import { RouteEntry } from "./RouteEntry";
import { CCCEnv } from "../CCCEnv";
import * as $ from "jquery";

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

    // No Logic
    open() : null {return null;}
    afterDomLoad(env: CCCEnv): void {}
}