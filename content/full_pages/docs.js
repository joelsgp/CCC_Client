function loadContent(html) {
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

    $("a", content).each(function () {
        $(this).attr("target", "_blank");
    });
}

var mdExtFA = {
    type: "lang",
    regex: /i\{(.+)\}/gm,
    replace: function (d) {
        var clazz = d.substring(2, d.length - 1);
        return '<i class="' + clazz + '"></i>';
    }
};

$(document).ready(function () {
    var converter = new showdown.Converter({ extensions: [mdExtFA] });
    var url = new URL(location.href);
    var file = url.searchParams.get("f") + ".md";
    $.ajax({
        url: file,
        dataType: "text",
        contentType: "plain/text"
    })
        .done(function (d) {
            loadContent(converter.makeHtml(d));
        });
});