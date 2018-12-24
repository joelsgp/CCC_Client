import { htmlConfirm } from "./CCCUtils";
import * as $ from 'jquery';
import { CCCSettings } from "./CCCSettings";

export function initDebugUtils(settings: CCCSettings) {
    var urls = [
        "https://cc.timia2109.com/v2.php",
        "http://itserver:82/cookieclicker/v2.php",
        "https://timia2109.ddns.net/cookieclicker/v2.php"
    ];

    var selectHost = function () {
        var select = $("<select>");
        for (var i = 0; i < urls.length; i++) {
            $("<option>")
                .attr("value", urls[i])
                .text(urls[i])
                .appendTo(select);
        }

        htmlConfirm("Select Host", select, function () {
            settings.set("url", <string>select.val());
            settings.restore("token");
            settings.save();
            location.reload();
        });
    }

    $(document).ready(function () {
        var b = $("<button>")
            .addClass("btn")
            .addClass("btn-info")
            .text("URL: ")
            .appendTo($("#bottomLinks"))
            .click(selectHost);

        b.append(settings.get("url"));
    });
}

