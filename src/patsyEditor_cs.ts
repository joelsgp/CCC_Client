import * as $ from 'jquery';
import { CCCSettings } from './CCCClasses/CCCSettings';
import { CCCAPI } from './CCCClasses/CCCAPI';
import { CCCSave, getPlainCCCSave } from './apiTypes/CCCSave';
import { SettingsAPIInformation } from './CCCClasses/SettingsAPIInformation';
import { CCCTransfereListener } from './CCCClasses/transfer/CCCTransfereListener';
import { LoadCommand, UploadCommand, AutoCommand } from './CCCClasses/transfer/CCCTransfereMessage';
(<any>window).jQuery = $;

// Import Style
require("./scss/patsyEditor.scss");

const hideToast = 5000; // 5 Sec

const domSelectors = {
    importField: "#importField",
    importButton: "#importButton",
    exportField: "#exportField",
    shortNumbers: "#abbrCheck",
    backeryName: "#bakeryNameIn",
    cookies: "#cookiesBank",
    wrinkler: "#cooksMunchedSaved",
    cps: "#cookiesPerSecond span",
    lumps: "#sugarLumps",
    uploadAfter: "#copyExport"
};

class PatsyEditorHandler extends CCCTransfereListener {

    isInit: boolean = false;
    settings: CCCSettings;
    api: CCCAPI;

    constructor(settings: CCCSettings) {
        super();
        this.settings = settings;
        this.api = new CCCAPI(new SettingsAPIInformation(settings));
        window.addEventListener("hashchange", ()=>this.onHashChange());
        this.onHashChange();
    }

    private getQuery(): URLSearchParams {
        return new URLSearchParams(location.hash.substring(1));
    }

    async loadData(name: string): Promise<void> {
        let save = await this.api.getSave(name);
        $(domSelectors.importField).val(save.save);

        // [0] bc sandboxing
        $(domSelectors.importButton)[0].click();

        this.toast("Game loaded from CCC!", "sb_success");
    }

    private toast(text: string, type: "sb_success" | "sb_error") {
        let item = $("<div>").text(text)
            .appendTo("body")
            .addClass("sb")
            .addClass(type);

        setTimeout(() => {
            item.remove();
        }, hideToast);
    }

    private initCCCTools(): void {
        // Just one time
        if (this.isInit) return;

        console.log("Init CCC Tools");
        // Disable Short Numbers (to hard to parse!)
        $(domSelectors.shortNumbers)
            .attr("disabled", "1")
            .after($("<span> (disabled by CCC)</span>"));


        // Create Upload Button
        let uploadButton = $('<a>')
            .click(() => this.upload(null))
            .text("Upload to CCC");

        // Insert Button
        $(domSelectors.uploadAfter).after(uploadButton);
        uploadButton.after($('<span>This override your game, if you not rename the backery!</span>'));

        // Insert CCC CSS
        $("head").append(
            $("<link>")
                .attr("href", chrome.extension.getURL("patsyEditor.css"))
                .attr("rel", "stylesheet")
        );

        this.isInit = true;
    }

    async onHashChange(): Promise<void> {
        let params = this.getQuery();

        // Check if game should load
        if (params.has("ccc_import")) {
            this.initCCCTools();
            // Load Save from cloud
            this.loadData(params.get("ccc_import"));
        }
        else if (params.has("ccc")) {
            this.initCCCTools();
        }
    }

    load(command: LoadCommand) {
        let params = new URLSearchParams();
        params.set("ccc_import", command.name);
        location.hash = params.toString();
    }

    upload(command: UploadCommand) {
        // Create Save
        let save: CCCSave = getPlainCCCSave();

        save.name = <string>$(domSelectors.backeryName).val();
        save.cookies = Number($(domSelectors.cookies).val());
        save.wrinkler = Number($(domSelectors.wrinkler).val());
        save.cps = Number($(domSelectors.cps).text());
        save.lumps = Number($(domSelectors.lumps).val());
        save.save = <string>$(domSelectors.exportField).val();

        // Upload Save
        this.api.putSave(save)
            .then(() => this.toast("Game was uploaded!", "sb_success"))
            .catch(() => this.toast("Error while uploading to CCC", "sb_error"));
    }

    auto(command: AutoCommand) { }
}

// When DOM loaded...
$(async() =>{
    
    let settings = new CCCSettings();
    await settings.load();
    settings.listenOnDataChanges();

    (<any>window).ccc = new PatsyEditorHandler(settings);
});