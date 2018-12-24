import { RouteEntry } from "./RouteEntry";
import { CCCEnv } from "../CCCEnv";
import * as $ from "jquery";

export abstract class ClickRouteEntry extends RouteEntry {
    protected env: CCCEnv;

    constructor(name: string, icon: string, env: CCCEnv) {
        super(name, icon);
        this.env = env;
    }

    getRouteName(): string {
        return "#dummy";
    }

    getNode(): JQuery {
        /*<li class="nav-item cccAction" title="Save Game">
			<span class="nav-link" id="menuSave">
				<i class="fas fa-cloud-upload"></i>
			</span>
		</li>*/
        let node = $('<li class="nav-item cccAction">');
        node.attr("title", this.name);

        $('<span class="nav-link">')
            .click(()=>{this.open()})
            .appendTo(node)
            .append(
                $("<i>")
                    .attr("class", this.icon)
            );

        return node;
    }

    afterDomLoad(env: CCCEnv) {}
}