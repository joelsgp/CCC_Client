import { InternalRouteEntry } from "../RouteEntrys/InternalRouteEntry";
import { CCCEnv } from "../CCCEnv";
import { confirm, getLoadingSpinner } from "../CCCUtils";
import moment = require("moment");
import { GetGameAttrModes } from "../GameAttrModes";
import * as $ from "jquery";

export class Home extends InternalRouteEntry {

    constructor() {
        super("Home", "fas fa-home", "home");
    }

    async afterDomLoad(env: CCCEnv): Promise<any> {

        let cache = {
            save: function (data) {
                sessionStorage.setItem("savesCache", JSON.stringify(data));
            },
            load: function () {
                let cache;
                if ((cache = sessionStorage.getItem("savesCache")) != undefined) {
                    return JSON.parse(cache);
                }
                else {
                    // Return empty saves (when offline...)
                    return {
                        saves: []
                    };
                }
            }
        };

        let sorters = [
            {
                label: "Time",
                handler: (a, b) => b.time - a.time,
            },
            {
                label: "Cookies",
                handler: (a, b) => b.time - a.time
            },
            {
                label: "Lumps",
                handler: (a, b) => b.lumps - a.time
            },
            {
                label: "CpS",
                handler: (a, b) => b.cps - a.cps
            },
            {
                label: "Name",
                handler: (a, b) => a.name.localeCompare(b.name)
            },
            {
                label: "Browserlabel",
                handler: (a, b) => {
                    if (!a.browserlabel) { return -1; }
                    if (!b.browserlabel) { return 1; }
                    a.browserlabel.localeCompare(b.browserlabel)
                }
            }
        ];

        let selectedSorter = {
            get: function (): number {
                return Number(env.settings.get("sorter"));
            },
            set: function (v: number) {
                env.settings.set("sorter", v.toString());
                showSaveData(cache.load());
            },
            getSortHandler: function () {
                return sorters[selectedSorter.get()].handler;
            }
        };

        let useSortButton = function () {
            selectedSorter.set(Number($(this).attr("data-sorter")));
        };

        let buildSortButtons = function () {
            let target = $("#bodySorterButton");
            target.html("");
            for (let i = 0; i < sorters.length; i++) {
                let button = $('<button class="dropdown-item">');
                button.attr("data-sorter", i)
                    .text(sorters[i].label)
                    .click(useSortButton)
                    .appendTo(target);
            }
        };

        var onLoadClick = async function () {
            var savename = $($(this).closest(".card")).attr("savename");

            try {
                let saveGame = await env.api.getSave(savename);
                env.callOnCC("load", { statBase: saveGame.save });
            } catch (e) {
                env.errorResolver.resolveError(e);
            }
        };

        var onDeleteClick = function () {
            var card = $($(this).closest(".card"));
            var savename = card.attr("savename");
            confirm("Delete", "Are you sure?", async () => {
                await env.api.deleteSave(savename);
                loadSaves();
            }, () => { });
        };

        // Name of Handler: HandlerCallback(targetBody, save, cookiesObj)
        var attrShowHandler = {
            Table: function (target, save, cookiesObj) {
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

                target.html(table);
            },
            Slim: function (target, save, cookiesObj) {
                let badge = function (text) {
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

        var createSaveCard = function (save) {
            var colorObj = env.colorParser.parse(save.cookies);

            var card = $("#saveCard").clone(true, true);
            card.removeAttr("hidden")
                .removeAttr("id")
                .attr("savename", save.name)
                .css("color", colorObj.textcolor)
                .css("background-color", colorObj.background);

            $(".card-title", card).text(env.colorParser.backeryName(save.name));

            let target = $(".card-text", card);
            attrShowHandler[GetGameAttrModes()[selectedSorter.get()].name](target, save, colorObj);

            $("#savePanel").append(card);
            $(".btnLoad", card).click(onLoadClick);
            $(".btnDelete", card).click(onDeleteClick);
        };

        var showSaveData = function (d) {
            $("#savePanel").html(null);
            d.games.sort(selectedSorter.getSortHandler());
            for (var i = 0; i < d.games.length; i++) {
                createSaveCard(d.games[i]);
            }
        }

        var onSavesResult = function (d) {
            showSaveData(d);
            cache.save(d);
        };

        var loadSaves = async function () {
            try {
                let saves = await env.api.getSaves();
                onSavesResult(saves);
            } catch (e) {
                env.errorResolver.resolveError(e);
            }
        };

        buildSortButtons();
        $("#savePanel").append(getLoadingSpinner("saves").addClass("fa-5x"));
        loadSaves();
    }
}