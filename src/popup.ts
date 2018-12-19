import * as moment from 'moment';
import * as $ from 'jquery';
(<any>window).jQuery = $;
import "bootstrap";
import { CCCEnv } from './CCCClasses/CCCEnv';
import { isCookieClickerPage } from './CCCClasses/CCCUtils';
import { Home } from './CCCClasses/subpages/Home';
import { SaveButton, SaveRepeatButton } from './CCCClasses/subpages/SaveButtons';
import { Login } from './CCCClasses/subpages/Login';

$(async function () {
    let env = new CCCEnv({
        container: $("#pageContainer"),
        menu: $("#iconMenu"),
        motd_area: $(".motd-area")
    });

    // Write Version
    $("#version").text(env.version);

    // Scared of Firefox
    try {
        // Check if CC
        if (await isCookieClickerPage() == false) {
            // Abort plugin, open CC
            window.open("http://orteil.dashnet.org/cookieclicker/", "_blank");
        }
    } catch (e) {
        console.log(e);
    }

    // Load Settings
    await env.settings.load();

    // Set moment lang
    let locale = window.navigator.language;
    locale = locale.substring(0, locale.indexOf("-"));
    moment.locale(locale);

    // Since here everything is ready and initialized for the subpages
    // Add Routes & Menu Entrys
    env.router.addRoutes([
        new Home(),
        new Login(),
        new SaveButton(env),
        new SaveRepeatButton(env)
    ]);

    if (env.settings.get("token") == "") {
        env.router.open("login");
    }
    else {
        env.token = env.settings.get("token");
        env.router.open("home");
    }

});
