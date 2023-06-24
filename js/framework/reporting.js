/* global jfmcontrols, , $SETTING, $SETTINGS */

var reportcounter = 0;

var reporting = function () {
    this.items = [];

    this.Add = function (item) {
        this.items.push(item);
        return item;
    };

    this.Dispose = function () {

    };

    this.Load = function (parent) {
        reportcounter++;
        var id = "report-viewer-" + reportcounter;

        var o = "<div class='report-background'><div id='" + id + "' class='report-viewer'></div></div>";
        parent.append(o);

        id = "#" + id;
        var object = $(id);

        for (var i = 0; i < this.items.length; i++)
            this.items[i].Generate(object);
    };
};

reporting.prototype.Paragraph = function (text, style) {
    this.text = text;
    this.style = style;

    this.Dispose = function () {

    };
    
    this.Load = function (parent) {
        var o = "<p class='" + this.style.name + "'>" + this.text + "</p>";
        parent.append(o);
    };
};

reporting.prototype.Image = function (image) {
    this.image = image;

    this.Load = function (parent) {
        var o = "<img src='" + this.image + "'/>";
        parent.append(o);
    };
};

reporting.prototype.List = function () {
    this.items = [];

    this.Add = function (item) {
        this.items.push(item);
        return item;
    };

    this.Load = function (parent) {
        reportcounter++;
        var id = "report-list-" + reportcounter;

        var o = "<table id='" + id + "' class='report-list'></table>";
        parent.append(o);

        id = "#" + id;
        var object = $(id);

        for (var i = 0; i < this.items.length; i++)
            this.items[i].Generate(object);

    };
};

reporting.prototype.ListItem = function (caption, capstyle, text, txtstyle) {
    this.caption = caption;
    this.captionstyle = capstyle;
    this.text = text;
    this.textstyle = txtstyle;

    this.Load = function (parent) {
        var o = "<tr><td class='" + this.captionstyle.name + "'>" + this.caption + "</td><td class='list-equal'>=</td>" + "<td class='" + this.textstyle.name + "'>" + this.text + "</td></tr>";
        parent.append(o);
    };
};

reporting.prototype.Table = function () {
    this.items = [];

    this.Add = function (item) {
        this.items.push(item);
        return item;
    };

    this.Load = function (parent) {
        reportcounter++;
        var id = "report-table-" + reportcounter;

        var o = "<table id='" + id + "' class='report-table'></table>";
        parent.append(o);

        id = "#" + id;
        var object = $(id);

        for (var i = 0; i < this.items.length; i++)
            this.items[i].Generate(object);

    };
};

reporting.prototype.TableRow = function () {
    this.items = [];

    this.Add = function (item) {
        this.items.push(item);
        return item;
    };

    this.Load = function (parent) {
        reportcounter++;
        var id = "report-table-row-" + reportcounter;

        var o = "<tr id='" + id + "' class='report-table-row'></tr>";
        parent.append(o);

        id = "#" + id;
        var object = $(id);

        for (var i = 0; i < this.items.length; i++)
            this.items[i].Generate(object);

    };
};

reporting.prototype.TableCell = function (text, style) {
    this.text = text;
    this.style = style;

    this.Load = function (parent) {
        var o = "<td class='" + this.style.name + "'>" + this.text + "</td>";
        parent.append(o);
    };
};

reporting.FormatString = function (strng, args) {
    var str = strng;
    var regex = new RegExp("{-?[0-9]+}", "g");

    return str.replace(regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;

        if (intVal >= 0) {
            replace = args[intVal];

        } else if (intVal === -1) {
            replace = "{";

        } else if (intVal === -2) {
            replace = "}";

        } else {
            replace = "";
        }

        if (isNaN(replace) === false) {
            //Apply string formating here
            replace = $SETTINGS.Format(replace);
        }

        return replace;
    });
};

var REPORTINGSTYLE = {
    NORMAL: {name: "normal", value: 0},
    BOLD: {name: "bold", value: 1},
    HEADER1: {name: "property-category", value: 1},
    HEADER2: {name: "header2", value: 1},
    TABLECAPTION: {name: "table-caption", value: 2},
    TABLEHEADER: {name: "table-header", value: 3},
    TABLETEXT: {name: "table-text", value: 4},
    LISTHEADER: {name: "list-header", value: 5},
    LISTITEM: {name: "list-text", value: 6}
};