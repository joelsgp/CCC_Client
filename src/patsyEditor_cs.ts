import * as $ from 'jquery';
import { CCCSettings } from './CCCClasses/CCCSettings';
import { CCCAPI } from './CCCClasses/CCCAPI';
import { CCCSave, getPlainCCCSave } from './apiTypes/CCCSave';
import { SettingsAPIInformation } from './CCCClasses/SettingsAPIInformation';
import { CCCTransfereListener } from './CCCClasses/transfer/CCCTransfereListener';
(<any>window).jQuery = $;

const hideToast = 5000; // 5 Sec

const editorDomIds = {
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

let initialized = false;

let settings = new CCCSettings();
settings.listenOnDataChanges();

let transfereListener = new CCCTransfereListener();
transfereListener.loadListener = (command)=>{
    let params = new URLSearchParams();
    params.set("ccc_import", command.name);

    location.hash = params.toString();
};
transfereListener.on();

let api = new CCCAPI(new SettingsAPIInformation(settings));

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
    .then(()=>toast("Game was uploaded!", "sb_success"))
    .catch(()=>toast("Error while uploading to CCC", "sb_error"));
}

async function load(name: string) : Promise<void> {
    let save = await api.getSave(name);
    $(editorDomIds.importField).val( save.save );

    // [0] bc sandboxing
    $(editorDomIds.importButton)[0].click();

    toast("Game loaded from CCC!", "sb_success");
}

function toast(text: string, type: "sb_success"|"sb_error") {
    let item = $("<div>").text(text)
        .appendTo("body")
        .addClass("sb")
        .addClass( type );
    
    setTimeout(()=>{
        item.remove();
    }, hideToast);
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

    // Insert CCC CSS
    $("head").append( 
        $("<link>")
            .attr("href", chrome.extension.getURL("patsyEditor.css"))
            .attr("rel", "stylesheet")
    );
    
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
window.addEventListener("message", (m)=>{
    console.log("CCC", m);
}, false);