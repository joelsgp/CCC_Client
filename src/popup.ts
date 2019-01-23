import * as moment from 'moment';
import * as $ from 'jquery';
(<any>window).jQuery = $;
import "bootstrap";
import { CCCEnv } from './CCCClasses/CCCEnv';
import { isCookieClickerPage } from './CCCClasses/CCCUtils';
import { Home } from './CCCClasses/subpages/Home';
import { SaveButton, SaveRepeatButton } from './CCCClasses/subpages/SaveButtons';
import { Login } from './CCCClasses/subpages/Login';
import { Help } from './CCCClasses/subpages/Help';
import { ExternalRouteEntry } from './CCCClasses/RouteEntrys/ExternalRouteEntry';
import { Account } from './CCCClasses/subpages/Account';
import { initDebugUtils } from './CCCClasses/Debug.dev';
import { initFA } from './CCCClasses/fontawesome';
import { SettingsAPIInformation } from './CCCClasses/SettingsAPIInformation';

// Import Style
require("./scss/style.scss");

$(async function () {
    initFA();

    let env = new CCCEnv({
        container: $("#pageContainer"),
        menu: $("#iconMenu"),
        motd_area: $(".motd-area")
    });

    // Write Version
    $("#version").text(SettingsAPIInformation.getVersion());

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
        // Default entrys
        new Home(),
        new Help(),
        new ExternalRouteEntry("Discord Community", "fab fa-discord", "https://discord.gg/Ww6b3d5"),
        new ExternalRouteEntry("News", "fas fa-newspaper", "https://cc.timia2109.com"),
        new Account(),

        // Click Items
        new SaveButton(env),
        new SaveRepeatButton(env),

        // Invisible Items
        new Login(),
    ]);

    // Firefox gets an open CC Button
    if (SettingsAPIInformation.getBrowser() == "F") {
        env.router.addRoute(
            new ExternalRouteEntry("Open CookieClicker", "fas fa-cookie", "http://orteil.dashnet.org/cookieclicker/")
        );
    }

    if (env.settings.get("token") == "") {
        env.router.open("login");
    }
    else {
        env.router.open("home");
    }

    if (localStorage.debug) {
        initDebugUtils(env.settings);
    }

    // Init Popovers
    // Menu init
	$("[title]", $("#iconMenu")).each(function(){
		var $this = $(this);
		$this.data("toggle", "tooltip")
			.data("placement", "top")
			.tooltip();
	});
});
