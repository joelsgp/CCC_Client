import { InternalRouteEntry } from "../RouteEntrys/InternalRouteEntry";
import { CCCEnv } from "../CCCEnv";
import { getLoadingSpinner, getAlert, scrollTo } from "../CCCUtils";
import { Validator } from "../Validator";
import moment = require("moment");
import { GetGameAttrModes } from "../helpers/GameAttrModes";
import * as $ from "jquery";

export class Account extends InternalRouteEntry {
    constructor() {
        super("Account and Settings", "fas fa-user", "account");
    }

    private addModEntryContainer(val: string = null): void {
        let node = $("#templateLoadMod").clone();
        node.removeAttr("hidden");
        $("button", node).click(() => node.remove());
        $("input", node).val(val);
        $("#modsEntrysContainer").append(node);
    }

    async afterDomLoad(env: CCCEnv) {

        // Wenn auf logout gelickt wird
        var logout = async function () {
            $(this).prepend(getLoadingSpinner("logout"));

            try {
                await env.api.logout();
                env.logout();
            } catch (e) {
                env.errorResolver.resolveError(e);
            }
        };

        // Wenn auf Export Data geklickt wird
        var exportDataClick = async function () {
            var load = getLoadingSpinner("export");
            $(this).prepend(load);

            try {
                let result = await env.api.exportData();
                getLoadingSpinner("export").remove();
                window.open(result.url, "_blank");
            } catch (e) {
                env.errorResolver.resolveError(e);
            }
        }

        // Wenn Mods gespeichert werden soll
        var onSaveModsClick = function () {
            let mods = [];

            $(".modUrl").each(function () {
                if ((<string>$(this).val()).trim().length > 0) {
                    mods.push($(this).val());
                }
            });

            env.settings.set("addons", JSON.stringify(mods));
            env.settings.save();

            env.alert("alert-success", "Save!", "Your mods are saved! Please reload CC");
        };

        // Wenn Passwor geändert werden soll
        var changePassword = async function (e) {
            e.preventDefault();

            let oldPass = <string>$("#oldPass").val(),
                newPass = <string>$("#newPass").val();

            var hint;
            let validator = new Validator();
            if ((hint = validator.validatePassword(newPass)) !== null) {
                env.alert(
                    "alert-danger",
                    "Password not accepted",
                    hint
                );
            }
            else {

                try {
                    await env.api.changePassword(oldPass, newPass);
                    env.alert(
                        "alert-success",
                        "Password changed",
                        "Everything ok!"
                    );
                } catch (e) {
                    env.errorResolver.resolveError(e);
                }
            }
        };

        // On Delete Profile Click
        var deleteUser = async function (e) {
            e.preventDefault();

            var pass = <string>$("#pass").val();

            try {
                await env.api.deleteUser(pass);
                env.plainLogout();
                env.router.open("#goodbye");
            } catch (e) {
                env.errorResolver.resolveError(e);
            }
        };

        // On Browserlabel Click
        var saveBrowserLabel = async function (e) {
            var name = <string>$("#inpBrowserLabel").val();
            if (name.length > 32) {
                env.alert(
                    "alert-danger",
                    "Error",
                    "Max. 32 chars are allowed"
                );
                return;
            }

            env.settings.set("browserlabel", name);
            env.settings.save();
            env.alert("alert-success", "Save!", "Browserlabel was saved!");
        };


        var onAttrBoxChecked = function () {
            if (this.checked) {
                env.settings.set("attrMode", this.value);
                env.settings.save();
                env.alert("alert-success", "Save!", ":)");
            }
        }

        // Load UserData from Cloud
        try {
            let userdata = await env.api.getUser();
            $("#username").text(userdata.user.name);
            $("#create").text(moment(userdata.user.create * 1000).format("LLL"));
            $("#tokens").text(userdata.user.tokens);
            $("#games").text(userdata.user.games);
            $("#beforeLoad").attr("hidden", 1);
            $("#afterLoad").removeAttr("hidden");
        } catch (e) {
            env.errorResolver.resolveError(e);
        }

        // Define click events
        $("#passwordChange").on("submit", changePassword);
        $("#deleteAccForm").on("submit", deleteUser);
        $("#logout").click(logout);
        $("#exportData").click(exportDataClick);
        $("#accSaveBrowserLabel").click(saveBrowserLabel);
        $("#accModsSaveBtn").click(onSaveModsClick);
        $("#addModBtn").click(() => this.addModEntryContainer());

        // Load AttrModes
        let attrModes = GetGameAttrModes();
        let attrMT = $("#accGIM .card-body");
        for (let i = 0; i < attrModes.length; i++) {
            let inp = $('<input type="radio" name="inpAttrMode">')
                .attr("value", i);
            attrMT.append(inp)
                .append(attrModes[i].desc)
                .append("<br>");
        }
        $('input:radio[name="inpAttrMode"]').change(onAttrBoxChecked);

        // Load existing data
        $("#inpBrowserLabel").val(env.settings.get("browserlabel"));
        $('[name="inpAttrMode"][value="' + env.settings.get("attrMode") + '"]').prop("checked", true);

        // Load Mods
        let mods = JSON.parse(env.settings.get("addons"));
        for (let mod of mods) {
            this.addModEntryContainer(mod);
        }
    }
}