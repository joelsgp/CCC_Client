import * as $ from "jquery";
import { CCCSave } from "../../apiTypes/CCCSave";
import { CookieColor } from "./CookieColorParser";
import { CCCEnv } from "../CCCEnv";
import moment = require("moment");

export abstract class AttrMode {
    name: string;
    desc: string;

    abstract createElements(target: JQuery, save: CCCSave, cookiesObj: CookieColor, env: CCCEnv): void;
}

class TableAttrMode extends AttrMode {

    constructor() {
        super();
        this.name = "Table";
        this.desc = "Show all Attributes in a table (classic mode)";
    }

    createElements(target: JQuery<HTMLElement>, save: CCCSave, cookiesObj: CookieColor, env: CCCEnv): void {
        let table = $('<table class="table table-sm infoTable">');
        var createListItem = function (title, item) {
            var badge = $("<span>")
                .addClass("badge")
                .addClass("badge-info")
                .text(item);

            $("<tr>")
                .append(
                    $("<td>")
                        .text(title)
                )
                .append(
                    $("<td>").append(badge)
                )
                .appendTo(table);
        };

        createListItem("Cookies", cookiesObj.value);

        if (save.cps > 0) {
            let cpsObj = env.colorParser.parse(save.cps);
            createListItem("CpS", cpsObj.value);
        }

        if (save.wrinkler > 0) {
            var wrinklerObj = env.colorParser.parse(save.wrinkler);
            createListItem("Wrinkler", wrinklerObj.value);
        }

        if (save.lumps > 0) {
            var lumpsObj = env.colorParser.parse(save.lumps);
            createListItem("Sugar Lumps", lumpsObj.value);
        }

        if (save.browserlabel) {
            createListItem("Computer", save.browserlabel);
        }

        createListItem("Last update", moment(save.time * 1000).format("LLL"));

        target.html("");
        target.append(table);
    }

}

class SlimAttrMode extends AttrMode {

    constructor() {
        super();
        this.name = "Slim";
        this.desc = "Show all Attributes as Small Badges";
    }

    createElements(target: JQuery, save: CCCSave, cookiesObj: CookieColor, env: CCCEnv): void {
        let badge = (text) => {
            target.append(
                $("<span>")
                    .addClass("badge")
                    .addClass("badge-info")
                    .text(text)
            );
        }

        badge(cookiesObj.value + " cookies");

        if (save.cps > 0) {
            let cpsObj = env.colorParser.parse(save.cps);
            badge(cpsObj.value + " CpS");
        }

        if (save.wrinkler > 0) {
            var wrinklerObj = env.colorParser.parse(save.wrinkler);
            badge(wrinklerObj.value + " cookies in Wrinkler");
        }

        if (save.lumps > 0) {
            var lumpsObj = env.colorParser.parse(save.lumps);
            badge(lumpsObj.value + " sugar lumps");
        }

        if (save.browserlabel) {
            badge("Computer: " + save.browserlabel);
        }

        badge("Last update on " + moment(save.time * 1000).format("LLL"));
    }
}

let attrModes = [
    new TableAttrMode(),
    new SlimAttrMode()
];

export function GetGameAttrModes(): AttrMode[] {
    return attrModes;
}

export function getCurrentAttrMode(env: CCCEnv) : AttrMode {
    return GetGameAttrModes()[
        Number(env.settings.get("attrMode"))
    ];
}