import * as $ from 'jquery';
import { CCCSettings } from './CCCClasses/CCCSettings';
import { CCCAPI } from './CCCClasses/CCCAPI';
import { CCCAPIInformation, HeaderMap } from './CCCClasses/CCCAPIInformation';
import { CCCSave, getPlainCCCSave } from './apiTypes/CCCSave';
(<any>window).jQuery = $;

let editorDomIds = {
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

class EditorAPIInfo implements CCCAPIInformation {
    settings: CCCSettings;

    constructor(settings: CCCSettings) {
        this.settings = settings;
    }

    get token(): string {
        return this.settings.get("token");
    }

    get baseUrl(): string {
        return this.settings.get("url");
    }

    getApiHeaders(): HeaderMap {
        return {};
    }
}

let initialized = false;

let settings = new CCCSettings();
settings.listenOnDataChanges();

let api = new CCCAPI(new EditorAPIInfo(settings));

function getQuery() : URLSearchParams {
    return new URLSearchParams( location.hash.substring(1) );
}

function upload() : void {
    // Create Save
    let save: CCCSave = getPlainCCCSave();

    save.name = <string> $(editorDomIds.backeryName).val();
    save.cookies = Number( $(editorDomIds.cookies).val() );
    save.wrinkler = Number( $(editorDomIds.wrinkler).val() );
    save.cps = Number( $(editorDomIds.cps).text() );
    save.lumps = Number( $(editorDomIds.lumps).val() );
    save.save = <string> $(editorDomIds.exportField).val();

    // Upload Save
    api.putSave(save)
    .then(()=>alert("Game was uploaded!"))
    .catch(()=>alert("Error while uploading to CCC"));
}

async function load(name: string) : Promise<void> {
    let save = await api.getSave(name);
    $(editorDomIds.importField).val( save.save );

    // [0] bc sandboxing
    $(editorDomIds.importButton)[0].click();
}

function initCCCTools() : void {
    // Just one time
    if (initialized) return;

    console.log("Init CCC Tools");
    // Disable Short Numbers (to hard to parse!)
    $(editorDomIds.shortNumbers)
        .attr("disabled", "1")
        .after($("<span> (disabled by CCC)</span>"));


    // Create Upload Button
    let uploadButton = $('<a>')
        .click(()=>upload())
        .text("Upload to CCC");

    // Insert Button
    $(editorDomIds.uploadAfter).after(uploadButton);
    uploadButton.after($('<span>This override your game, if you not rename the backery!</span>'));
    
    initialized = true;
}

async function prepare() : Promise<void> {
    let params = getQuery();
    await settings.load();

    // Check if game should load
    if (params.has("ccc_import")) {
        initCCCTools();
        // Load Save from cloud
        load(params.get("ccc_import"));
    }
    else if (params.has("ccc")) {
        initCCCTools();
    }
}

// When DOM loaded...
$(()=>prepare());
window.addEventListener("hashchange", prepare);