import * as $ from "jquery";
import "bootstrap";
import * as Showdown from "showdown";
import Axios from "axios";

function loadContent(html: string) {
    var content = $("#content");
    var menu = $("#menu");
    content.html(html);

    var hLoop = function () {
        var $this = $(this);
        var id = "h_" + (i++);
        $this.attr("id", id);

        $("<a>")
            .addClass("nav-link")
            .attr("href", "#" + id)
            .text($this.text())
            .appendTo(menu);

        // H3 Kinder
        var children = $this.nextAll();
        var customMenuArea = $('<nav class="nav nav-pills flex-column">');
        for (var j = 0; j < children.length; j++) {
            var child = $(children[j]);
            var tag = child.prop("tagName");
            if (tag == "H3") {
                child.attr("id", id + "_" + j);
                $('<a class="nav-link ml-3 my-1">')
                    .attr("href", "#" + id + "_" + j)
                    .text(child.text())
                    .appendTo(customMenuArea);
            }
            else if (tag == "H2") {
                break;
            }
        }
        customMenuArea.appendTo(menu);
    };

    var i = 0;
    $("h1", content).each(hLoop);
    $("h2", content).each(hLoop);

    $("a", content).attr("target", "_blank");
}

function showMenu(state: boolean) {
    if (state) {
        $("#menuContainer").removeAttr("hidden");
        $("#contentContainer")
            .addClass("col-sm-8");
    }
    else {
        $("#menuContainer").attr("hidden", 1);
        $("#contentContainer")
            .removeClass("col-sm-8");
    }
}

// Extention to Import FontAwesome things (with i{ICON})
var mdExtFA = {
    type: "lang",
    regex: /i\{(.+)\}/gm,
    replace: function (d) {
        var clazz = d.substring(2, d.length - 1);
        return '<i class="' + clazz + '"></i>';
    }
};

$(document).ready(async ()=> {
    var converter = new Showdown.Converter({ extensions: [mdExtFA] });
    var url = new URL(location.href);
    var file = url.searchParams.get("f") + ".md";
    
    if (url.searchParams.get("showMenu")) {
        showMenu( url.searchParams.get("showMenu") != "1" );
    }

    let content = await Axios.get(file);
    loadContent( converter.makeHtml(content.data) );
});