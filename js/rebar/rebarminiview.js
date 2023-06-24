/* global REBARSET, uiframework, rebarInput, REBARMODE, rebarInputKeys, rebarScope, $SETTINGS, ASTM, METRIC, IMPERIAL */

var rebarvalue = {};
var rebarminiviewsettings = {};

var rebarminiviewsettingsupdate = function () {
    rebarminiviewsettings.rebarset = $SETTINGS.rebarset;
    rebarminiviewsettings.minnbars = $SETTINGS.minbars.value;
    rebarminiviewsettings.maxnbars = $SETTINGS.maxbars.value;
    rebarminiviewsettings.mixnbars = $SETTINGS.maxmixbars.value;
    rebarminiviewsettings.smallestbar = $SETTINGS.smallestbar.value;
    rebarminiviewsettings.largestbar = $SETTINGS.largestbar.value;
    rebarminiviewsettings.minspace = $SETTINGS.minstirrupspacing.value;
    rebarminiviewsettings.maxspace = $SETTINGS.maxstirrupspacing.value;
    rebarminiviewsettings.excess = $SETTINGS.maxexcessarea.value;
    rebarminiviewsettings.width = 1000;
    rebarminiviewsettings.modeInput = REBARMODE.Spacing;
    rebarScope.defnbar = rebarminiviewsettings.minnbars.toString();

    switch ($SETTINGS.rebarset.value.value) {
        case REBARSET.ASTM.value:
            barsize = "#3";
            break;

        case REBARSET.Metric.value:
            barsize = "d10";
            break;

        case REBARSET.Imperial.value:
            barsize = REBARSET.Imperial.rebar.d3_8.equation ? basicFraction(REBARSET.Imperial.rebar.d3_8.equation) : REBARSET.Imperial.rebar.d3_8.name;
            break;

        case REBARSET.Canadian.value:
            barsize = "10M";
            break;

        case REBARSET.Australian.value:
            barsize = "N12";
            break;
    }

    rebarScope.defszbar = barsize;
};

var rebarminiview = function () {
    this.newview = function () {
        rebarminiviewsettingsupdate();

        var grid = new uiframework.Grid();

        this.rebarmininumpadviewObj = new rebarmininumpadview();
        this.rebarmininumpadviewObj.changeValueEvent = this.valueChanged;

        grid.Add(this.rebarmininumpadviewObj);

        return grid;
    };

    this.setOkEvent = function (okevent) {
        this.rebarmininumpadviewObj.okevent = okevent;
        this.rebarmininumpadviewObj.rebarpad = this;
        this.rebarmininumpadviewObj.changeValue(rebarInputKeys.Clear, "C");
    };

    this.setAsNewInstance = function () {
        rebarInput.isNewInstance = true;
    };

    this.setRebarMode = function (rebarmode) {
        rebarminiviewsettings.modeInput = rebarmode;
    };

    this.setRebarSet = function (rebarset) {
        this.rebarmininumpadviewObj.changeRebarSet(rebarset);
    };

    this.setValue = function (barsize, nobars, spacing) {
        rebarvalue = {};
        rebarvalue.barsize = barsize;
        rebarvalue.nobars = nobars;
        rebarvalue.spacing = spacing;

        switch (rebarminiviewsettings.modeInput) {
            case REBARMODE.Bars:

                if (!nobars || nobars <= 0 || !barsize) {
                    this.rebarmininumpadviewObj.changeValue(rebarInputKeys.Clear, "C");
                } else {
                    this.rebarmininumpadviewObj.changeValue(rebarInputKeys.Num, nobars);
                    this.rebarmininumpadviewObj.changeValue(rebarInputKeys.Sym, barsize);
                }

                break;

            case REBARMODE.Spacing:

                if (!spacing || spacing <= 0 || !barsize) {
                    this.rebarmininumpadviewObj.changeValue(rebarInputKeys.Clear, "C");
                } else {
                    this.rebarmininumpadviewObj.changeValue(rebarInputKeys.Sym, barsize);
                    this.rebarmininumpadviewObj.changeValue(rebarInputKeys.Num, spacing);
                }

                break;
        }
    };

    this.getValue = function () {
        return rebarvalue;
    };

    this.valueChanged = function (newValue) {
        switch (rebarminiviewsettings.modeInput) {
            case REBARMODE.Bars:

                if (rebarInput.tokens.length > 0) {
                    rebarvalue.barsize = rebarInput.tokens[0].sbar ? rebarInput.tokens[0].sbar : rebarvalue.barsize;
                    rebarvalue.nobars = rebarInput.tokens[0].nbar ? rebarInput.tokens[0].nbar : rebarvalue.nobars;
                } else {
                    rebarvalue.nobars = 0;
                }

                break;

            case REBARMODE.Spacing:

                if (rebarInput.tokens.length > 0) {
                    rebarvalue.barsize = rebarInput.tokens[0].szbar ? rebarInput.tokens[0].szbar : rebarvalue.barsize;
                    rebarvalue.spacing = rebarInput.tokens[0].spbar ? rebarInput.tokens[0].spbar.value : rebarvalue.spacing;
                } else {
                    rebarvalue.spacing = 0;
                }

                break;
        }
    };
};

var rebarmininumpadview = function () {
    uiframework.Base.call(this);

    this.class = "numericpad rebar";
    this.changeValueEvent;

    this.changeValue = function (tag, value) {
        if (rebarInput.process(tag, value, rebarminiviewsettings.modeInput)) {
            this.numpadvalueobject.html(rebarInput.stringValue(rebarminiviewsettings.modeInput, rebarminiviewsettings.width));

            if (this.changeValueEvent !== undefined)
                this.changeValueEvent(rebarInput.value);
        }

    };

    this.changeRebarSet = function (newRebarSet) {
        rebarminiviewsettings.rebarset = newRebarSet;

        for (var i in REBARSET) {
            itemid = "input_bar_" + i.toLowerCase();
            itemobj = $("#" + itemid);

            if (rebarminiviewsettings.rebarset.value.value === REBARSET[i].value) {
                itemobj.css("display", "block");
                itemobj.css("z-index", "10000");
            } else {
                itemobj.css("display", "none");
                itemobj.css("z-index", "-1");
            }
        }
    };

    this.Load = function (parent) {
        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (this.parent === undefined)
            this.parent = parent;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Value
            content = "<div id='numpad_value' class='numpad-value-mini'>0</div>";

            //Input Bars
            var inputbarscontent = "";
            for (var i in REBARSET) {
                var items = REBARSET[i].rebar;

                inputbarscontent += "<div id='input_bar_" + i.toLowerCase() + "' class='input-bar-mini'><table><tr>";

                var itemid = "";

                var ncols = 0;

                for (var item in items) {
                    if (rebarminiviewsettings.smallestbar.value <= items[item].value && rebarminiviewsettings.largestbar.value >= items[item].value)
                        ncols++;
                }

                ncols = Math.ceil(Math.sqrt(ncols));

                var icols = 0;

                for (var item in items) {
                    if (!(rebarminiviewsettings.smallestbar.value <= items[item].value && rebarminiviewsettings.largestbar.value >= items[item].value))
                        continue;

                    itemid = "input_bar_" + i.toLowerCase() + "_" + item.toLowerCase();
                    itemtxt = items[item].equation ? basicFraction(items[item].equation) : items[item].name;
                    inputbarscontent += "<td id='" + itemid + "'>" + itemtxt + "</td>";

                    icols++;
                    if (icols >= ncols) {
                        icols = 0;
                        inputbarscontent += "</tr><tr>";
                    }
                }

                inputbarscontent += "</tr></table></div>";
            }

            content += "<div id='input_bars' class='input-bars-mini'>" + inputbarscontent + "</div>";

            //Input Keys
            content += "<div id='input_keys' class='input-keys-mini'><table>";
            content += "<tr><td id='rebar-num-7'>7</td><td id='rebar-num-8'>8</td><td id='rebar-num-9'>9</td><td id='rebar-num-" + rebarInputKeys.Clear.name + "' class='special-key'>" + rebarInputKeys.Clear.symbol + "</td></tr>";
            content += "<tr><td id='rebar-num-4'>4</td><td id='rebar-num-5'>5</td><td id='rebar-num-6'>6</td><td id='rebar-num-" + rebarInputKeys.At.name + "'>" + rebarInputKeys.At.symbol + "</tr>";
            content += "<tr><td id='rebar-num-1'>1</td><td id='rebar-num-2'>2</td><td id='rebar-num-3'>3</td><td id='rebar-num-" + rebarInputKeys.Plus.name + "'>" + rebarInputKeys.Plus.symbol + "</td></tr>";
            content += "<tr>";
            content += "<td id='rebar-num-0'>0</td><td id='rebar-num-" + rebarInputKeys.Point.name + "'>" + rebarInputKeys.Point.symbol + "</td>";
            content += "<td id='rebar-num-" + rebarInputKeys.Back.name + "' class='special-key'><i class='fa fa-chevron-left'></i></td>";
            content += "<td id='rebar-button-ok' class='special-key button-ok'>OK</td>";
            content += "</tr>";
            content += "</table></div>";

            object.append(content);

            var numbers;

            for (var i = 0; i < 10; i++) {
                numbers = $("#rebar-num-" + i);
                numbers.tag = rebarInputKeys.Num;

                this.ClickEventNumber(this, numbers, function (parent, sender) {
                    parent.changeValue(sender.tag, sender.html());
                });
            }

            for (var i in rebarInputKeys) {
                numbers = $("#rebar-num-" + rebarInputKeys[i].name);

                if (rebarInputKeys[i] === rebarInputKeys.At) {
                    if (rebarminiviewsettings.modeInput === REBARMODE.Spacing) {
                        numbers.removeClass('disabled-key');
                    } else {
                        numbers.addClass('disabled-key');
                        continue;
                    }
                }

                numbers.tag = rebarInputKeys[i];
                this.ClickEventNumber(this, numbers, function (parent, sender) {
                    parent.changeValue(sender.tag, sender.html());
                });
            }

            for (var i in REBARSET) {
                var items = {};
                switch (REBARSET[i]) {
                    case REBARSET.ASTM:
                        items = ASTM;
                        break;
                    case REBARSET.Metric:
                        items = METRIC;
                        break;
                    case REBARSET.Imperial:
                        items = IMPERIAL;
                        break;
                    case REBARSET.Canadian:
                        items = CANADIAN;
                        break;
                    case REBARSET.Australian:
                        items = AUSTRALIAN;
                        break;
                }

                var itemid = "";
                for (item in items) {
                    itemid = "input_bar_" + i.toLowerCase() + "_" + item.toLowerCase();
                    numbers = $("#" + itemid);
                    numbers.tag = rebarInputKeys.Sym;
                    numbers.value = items[item];

                    this.ClickEventNumber(this, numbers, function (parent, sender) {
                        parent.changeValue(sender.tag, sender.value);
                    });

                }
            }

            var buttonOk = $("#rebar-button-ok");

            this.ClickEventNumber(this, buttonOk, function (parent, sender) {
                uiframework.onnumericpad = false;
                uiframework.allowclick = false;
                
                if (parent.okevent !== undefined)
                    parent.okevent(parent, sender);
            });

            this.numpadvalueobject = $("#numpad_value");
            this.inputbarsobject = $("#input_bars");
            this.inputkeysobject = $("#input_keys");

        }
    };

};