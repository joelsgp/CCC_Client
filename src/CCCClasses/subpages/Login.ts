import { InternalRouteEntry } from "../RouteEntrys/InternalRouteEntry";
import { CCCEnv } from "../CCCEnv";
import { getLoadingSpinner } from "../CCCUtils";
import * as $ from "jquery";

export class Login extends InternalRouteEntry {
    constructor() {
        super("Login", "fa-home", "login");
        this.visible = false;
    }

    afterDomLoad(env: CCCEnv) {
        var saveToken = function (token) {
            env.login(token);
            $(".loginOnly").removeAttr("hidden");
            env.router.open("home");
        };
    
        var grapValues = function (form) {
            return {
                user: (<string>$(".user", form).val()).toLowerCase(),
                pass: $(".pass", form).val()
            };
        };
    
        var failMessage = function (errObj) {
            getLoadingSpinner("login").remove();
            env.errorResolver.resolveError(errObj);
        };
    
        var requestResponse = function (d) {
            getLoadingSpinner("login").remove();
            if (d.token)
                saveToken(d.token);
        };
    
        var loginSubmit = async function (e) {
            $(".alert").remove();
            var form = $("#formLogin");
            var credentials = grapValues(form);
    
            $("button", form).prepend(getLoadingSpinner("login"));
            e.preventDefault();
    
            try {
                let token = await env.api.login(credentials.user, <string>credentials.pass);
                requestResponse(token);
            }
            catch (e) {
                failMessage(e);
            }
        };
    
        var registerSubmit = async function (e) {
            $(".alert").remove();
            var form = $("#formRegister");
            var credentials = grapValues(form);
    
            $("button", form).prepend(getLoadingSpinner("login"));
            e.preventDefault();
    
            try {
                let token = await env.api.register(credentials.user, <string>credentials.pass);
                requestResponse(token);
            }
            catch (e) {
                failMessage(e);
            }
        };
    
        $("#formLogin").on("submit", loginSubmit);
        $("#formRegister").on("submit", registerSubmit);
        $(".loginOnly").attr("hidden", 1);
    }
}