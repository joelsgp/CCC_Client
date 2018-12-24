import { InternalRouteEntry } from "../RouteEntrys/InternalRouteEntry";
import { CCCEnv } from "../CCCEnv";
import { confirm, getLoadingSpinner } from "../CCCUtils";
import moment = require("moment");
import { GetGameAttrModes, getCurrentAttrMode } from "../helpers/GameAttrModes";
import * as $ from "jquery";
import { getComparators } from "../helpers/CCCSaveSorter";

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

        let selectedSorter = {
            get: function (): number {
                return Number(env.settings.get("sorter"));
            },
            set: function (v: number) {
                env.settings.set("sorter", v.toString());
                showSaveData(cache.load());
            }
        };

        let useSortButton = function () {
            selectedSorter.set(Number($(this).attr("data-sorter")));
        };

        let buildSortButtons = function () {
            let target = $("#bodySorterButton");
            target.html("");
            let comps = getComparators();
            for (let i = 0; i < comps.length; i++) {
                let button = $('<button class="dropdown-item">');
                button.attr("data-sorter", i)
                    .text(comps[i].label)
                    .click(useSortButton)
                    .appendTo(target);
            }
        };

        var onLoadClick = async function () {
            var savename = $($(this).closest(".card")).attr("savename");

            try {
                env.callOnCC("load", { name: savename });
            } catch (e) {
                env.errorResolver.resolveError(e);
            }
        };

        var onDeleteClick = function () {
            var card = $($(this).closest(".card"));
            var savename = card.attr("savename");
            confirm("Delete", "Are you sure?", async () => {
                debugger;
                await env.api.deleteSave(savename);
                loadSaves();
            }, () => { });
        };

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
            getCurrentAttrMode(env).createElements(target, save, colorObj, env);

            $("#savePanel").append(card);
            $(".btnLoad", card).click(onLoadClick);
            $(".btnDelete", card).click(onDeleteClick);
        };

        var showSaveData = function (d) {
            $("#savePanel").html(null);
            d.games.sort(
                getComparators()[ selectedSorter.get() ].compare
            );
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