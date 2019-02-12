import { InternalRouteEntry } from "../RouteEntrys/InternalRouteEntry";
import { CCCEnv, StringKeyObject } from "../CCCEnv";
import { confirm, getLoadingSpinner, getEditorUrl } from "../CCCUtils";
import { getCurrentAttrMode } from "../helpers/GameAttrModes";
import * as $ from "jquery";
import { getComparators } from "../helpers/CCCSaveSorter";
import { CCCTransfereMessage } from "../transfer/CCCTransfereMessage";
import { JSONCacher } from "../helpers/JSONCacher";
import { CCCSave } from "../../apiTypes/CCCSave";

export class Home extends InternalRouteEntry {

    private cache: JSONCacher;
    private env: CCCEnv;

    constructor() {
        super("Home", "fas fa-home", "home");
        this.cache = new JSONCacher("savesCache");
        this.cache.fallback = { saves: [] };
    }

    private getSelectedSorter(): number {
        return Number(this.env.settings.get("sorter"));
    }

    private setSelectedSorter(sorter: number): void {
        this.env.settings.set("sorter", sorter.toString());
        this.showSaveData(this.cache.get());
    }

    private selectSorterButton(event: JQuery.Event): void {
        this.setSelectedSorter(Number($(event.target).attr("data-sorter")));
    }

    private buildSortButtons() {
        let target = $("#bodySorterButton");
        target.html("");
        let comps = getComparators();
        for (let i = 0; i < comps.length; i++) {
            let button = $('<button class="dropdown-item">');
            button.attr("data-sorter", i)
                .text(comps[i].label)
                .click((e) => {
                    this.selectSorterButton(e);
                })
                .appendTo(target);
        }
    }

    private onLoadClick(event: JQuery.Event) {
        var savename = $($(event.target).closest(".card")).attr("savename");

        try {
            new CCCTransfereMessage({
                cccCommand: "load",
                name: savename
            }).sendToTab();
        } catch (e) {
            this.env.errorResolver.resolveError(e);
        }
    }

    private onDeleteClick(event: JQuery.Event) {
        var card = $($(event.target).closest(".card"));
        var savename = card.attr("savename");
        confirm("Delete", "Are you sure?", async () => {
            debugger;
            await this.env.api.deleteSave(savename);
            this.loadSaves();
        }, () => { });
    }

    private createSaveCard(save: CCCSave) {
        let colorObj = this.env.colorParser.parse(save.cookies);

        let card = $("#saveCard").clone(true, true);
        card.removeAttr("hidden")
            .removeAttr("id")
            .attr("savename", save.name)
            .css("color", colorObj.textcolor)
            .css("background-color", colorObj.background);

        $(".card-title", card).text(this.env.colorParser.backeryName(save.name));

        let target = $(".card-text", card);
        getCurrentAttrMode(this.env).createElements(target, save, colorObj, this.env);

        $("#savePanel").append(card);
        $(".btnLoad", card).click((e) => { this.onLoadClick(e) });
        $(".btnEdit", card).attr("href", getEditorUrl(save.name));
        $(".btnDelete", card).click((e) => { this.onDeleteClick(e) });
    }

    private showSaveData(d: StringKeyObject) {
        $("#savePanel").html(null);
        d.games.sort(
            getComparators()[this.getSelectedSorter()].compare
        );
        for (var i = 0; i < d.games.length; i++) {
            this.createSaveCard(d.games[i]);
        }
    }

    private onSavesResult(d: StringKeyObject) {
        this.showSaveData(d);
        this.cache.set(d);
    }

    private async loadSaves() {
        try {
            let saves = await this.env.api.getSaves();
            this.onSavesResult(saves);
        } catch (e) {
            this.env.errorResolver.resolveError(e);
        }
    }

    async afterDomLoad(env: CCCEnv): Promise<any> {
        this.env = env;

        this.buildSortButtons();
        $("#savePanel").append(getLoadingSpinner("saves").addClass("fa-5x"));
        this.loadSaves();
    }
}