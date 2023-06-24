/* global common */

var rebarInputKeys = {
    Clear: { name: "clear", symbol: "C" },
    Back: { name: "back", symbol: "<" },
    Plus: { name: "plus", symbol: "+" },
    Point: { name: "point", symbol: "." },
    At: { name: "at", symbol: "@" },
    Dash: { name: "dash", symbol: "-" },
    Num: { name: "num", symbol: "0-9" },
    Sym: { name: "sym", symbol: "#d" }
};

var rebarScope = {};

var rebarInput = {};

rebarInput.tokens = [];
rebarInput.value = 0;

rebarInput.process = function (tag, value, mode) {
    if (tag === rebarInputKeys.Clear) {
        rebarInput.tokens = [];
        return true;
    }

    rebarInput.ifNewInstance();

    var ctoken = rebarInput.tokens.length > 0 ? rebarInput.tokens[rebarInput.tokens.length - 1] : {};
    var ctokenprevious = rebarInput.tokens.length > 0 ? rebarInput.tokens[rebarInput.tokens.length - 2] : {};
    var ntoken = {};

    switch (mode) {
        case REBARMODE.Area:

            switch (tag) {

                case rebarInputKeys.Back:

                    if (Object.keys(ctoken).length === 0)
                        break;
                    if (ctoken === rebarInputKeys.Plus.symbol) {
                        rebarInput.tokens.pop();
                        break;
                    }

                    if (ctoken.uiValue) {
                        ctoken.uiValue = ctoken.uiValue.slice(0, -1);
                        ctoken.value = Number(ctoken.uiValue) / common.unit.area.value.value;
                        if (ctoken.uiValue.length === 0)
                            rebarInput.tokens.pop();
                        else
                            rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                    }

                    break;

                case rebarInputKeys.Plus:

                    if (ctoken.uiValue.substring(ctoken.uiValue.length - 1, ctoken.uiValue.length) === rebarInputKeys.Point.symbol)
                        rebarInput.tokens[rebarInput.tokens.length - 1].uiValue += "0";
                    if (ctoken !== rebarInputKeys.Plus.symbol)
                        rebarInput.tokens.push(rebarInputKeys.Plus.symbol);

                    break;

                case rebarInputKeys.Point:

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol) {
                        ntoken = {};
                        ntoken.uiValue = "0" + rebarInputKeys.Point.symbol;
                        ntoken.value = 0;
                        rebarInput.tokens.push(ntoken);
                        break;
                    }
                    if (!ctoken.uiValue.includes(rebarInputKeys.Point.symbol))
                        rebarInput.tokens[rebarInput.tokens.length - 1].uiValue += rebarInputKeys.Point.symbol;

                    break;

                case rebarInputKeys.Num:

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol) {
                        ntoken = {};
                        ntoken.uiValue = value;
                        ntoken.value = Number(ntoken.uiValue) / common.unit.area.value.value;
                        rebarInput.tokens.push(ntoken);
                        break;
                    }

                    if (ctoken.uiValue === "0")
                        ctoken.uiValue = "";

                    rebarInput.tokens[rebarInput.tokens.length - 1].uiValue += value;
                    rebarInput.tokens[rebarInput.tokens.length - 1].value = Number(rebarInput.tokens[rebarInput.tokens.length - 1].uiValue) / common.unit.area.value.value;

                    break;

                case rebarInputKeys.At:
                //Do nothing. Symbol @ not used in Rebar Mode Area
                case rebarInputKeys.Dash:
                //Do nothing. Symbol - not used in Rebar Mode Area
                case rebarInputKeys.Sym:
                    //Do nothing. No bar symbol inputs in Rebar Mode Area
                    break;
            }

            break;

        case REBARMODE.Bars:

            var token = {};

            switch (tag) {

                case rebarInputKeys.Back:

                    // if (ctoken === rebarInputKeys.Plus.symbol) {
                    //     rebarInput.tokens.pop();
                    //     break;
                    // }

                    if (ctoken.sbar) {
                        delete rebarInput.tokens[rebarInput.tokens.length - 1].sbar;
                        break;
                    }

                    // if (ctoken.dash) {
                    //     delete rebarInput.tokens[rebarInput.tokens.length - 1].dash;
                    //     break;
                    // }

                    if (ctoken.nbar) {
                        ctoken.nbar = ctoken.nbar.slice(0, -1);
                        if (ctoken.nbar.length === 0) {
                            delete rebarInput.tokens[rebarInput.tokens.length - 1].nbar;
                            delete rebarInput.tokens[rebarInput.tokens.length - 1].dash;
                            rebarInput.tokens.pop();

                            if (ctokenprevious === rebarInputKeys.Plus.symbol) {
                                rebarInput.tokens.pop();
                            }
                        } else {
                            rebarInput.tokens[rebarInput.tokens.length - 1].nbar = ctoken.nbar;
                            delete rebarInput.tokens[rebarInput.tokens.length - 1].dash;
                        }
                    }

                    break;

                case rebarInputKeys.Plus:

                    if (Object.keys(ctoken).length === 0) {
                        break;
                    }

                    if (ctoken.sbar) {
                        rebarInput.tokens.push(rebarInputKeys.Plus.symbol);
                    }

                    break;

                case rebarInputKeys.Num:

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol) {
                        token.nbar = value;
                        rebarInput.tokens.push(token);
                        break;
                    }

                    if (ctoken.sbar) {
                        rebarInput.tokens.push(rebarInputKeys.Plus.symbol);
                        token.nbar = value;
                        rebarInput.tokens.push(token);
                        break;
                    }

                    if (ctoken.nbar)
                        ctoken.nbar += value;
                    else
                        ctoken.nbar = value;


                    rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;

                    break;

                case rebarInputKeys.Dash:

                    if (Object.keys(ctoken).length === 0) {
                        token.nbar = rebarScope.defnbar ? rebarScope.defnbar : "1";
                        token.dash = rebarInputKeys.Dash.symbol;
                        rebarInput.tokens.push(token);
                        break;
                    }

                    if (!ctoken.dash) {
                        ctoken.dash = rebarInputKeys.Dash.symbol;
                        rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                        break;
                    }

                    break;

                case rebarInputKeys.Sym:

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol) {
                        token.nbar = rebarScope.defnbar ? rebarScope.defnbar : "1";
                        token.dash = rebarInputKeys.Dash.symbol;
                        token.sbar = value;
                        rebarInput.tokens.push(token);
                        break;
                    }

                    if (!ctoken.sbar) {
                        ctoken.sbar = value;
                        ctoken.dash = rebarInputKeys.Dash.symbol;
                        rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                        break;
                    }

                    if (ctoken.sbar) {
                        if (!ctoken.nbar) {
                            ctoken.nbar = rebarScope.defnbar ? rebarScope.defnbar : "1";
                            ctoken.dash = rebarInputKeys.Dash.symbol;
                            rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                        }
                        rebarInput.tokens.push(rebarInputKeys.Plus.symbol);

                        token.nbar = rebarScope.defnbar ? rebarScope.defnbar : "1";
                        token.dash = rebarInputKeys.Dash.symbol;
                        token.sbar = value;

                        rebarInput.tokens.push(token);

                    }

                    break;

                case rebarInputKeys.Point:
                //Do nothing. Symbol . not used in Rebar Mode Bars
                case rebarInputKeys.At:
                    //Do nothing. Symbol @ not used in Rebar Mode Bars
                    break;
            }

            break;

        case REBARMODE.Spacing:

            var token = {};

            switch (tag) {

                case rebarInputKeys.Back:

                    // if (ctoken === rebarInputKeys.Plus.symbol) {
                    //     rebarInput.tokens.pop();
                    //     break;
                    // }

                    if (ctoken.spbar && ctoken.spbar.uiValue) {
                        ctoken.spbar.uiValue = ctoken.spbar.uiValue.slice(0, -1);
                        ctoken.spbar.value = Number(ctoken.spbar.uiValue) / common.unit.length.value.value;
                        if (ctoken.spbar.uiValue.length === 0)
                            delete rebarInput.tokens[rebarInput.tokens.length - 1].spbar;
                        else
                            rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                        break;
                    }

                    // if (ctoken.ats) {
                    //     delete rebarInput.tokens[rebarInput.tokens.length - 1].ats;
                    //     break;
                    // }

                    if (ctoken.szbar) {
                        delete rebarInput.tokens[rebarInput.tokens.length - 1].ats;
                        delete rebarInput.tokens[rebarInput.tokens.length - 1].szbar;
                        rebarInput.tokens.pop();

                        if (ctokenprevious === rebarInputKeys.Plus.symbol) {
                            rebarInput.tokens.pop();
                        }

                        break;
                    }

                case rebarInputKeys.Plus:

                    if (Object.keys(ctoken).length === 0 || !ctoken.spbar || !ctoken.spbar.uiValue || common.IsZero(ctoken.spbar.value)) {
                        break;
                    }

                    if (ctoken.szbar) {

                        if (ctoken.spbar.uiValue.substring(ctoken.spbar.uiValue.length - 1, ctoken.spbar.uiValue.length) === rebarInputKeys.Point.symbol)
                            rebarInput.tokens[rebarInput.tokens.length - 1].spbar.uiValue += "0";

                        rebarInput.tokens.push(rebarInputKeys.Plus.symbol);
                    }

                    break;

                case rebarInputKeys.Num:
                    // if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol) {
                    //     token.nbar = rebarScope.defnbar ? rebarScope.defnbar : "1";
                    //     token.dash = rebarInputKeys.Dash.symbol;
                    //     token.sbar = value;
                    //     rebarInput.tokens.push(token);
                    //     break;
                    // }

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol || !ctoken.szbar) {
                        token.szbar = rebarScope.defszbar ? rebarScope.defszbar : "#3";
                        token.ats = rebarInputKeys.At.symbol;
                        token.spbar = { uiValue: value };
                        token.spbar.value = Number(token.spbar.uiValue) / common.unit.length.value.value;
                        rebarInput.tokens.push(token);
                        break;
                    }

                    if (ctoken.szbar) {

                        if (!ctoken.ats)
                            ctoken.ats = rebarInputKeys.At.symbol;

                        if (!ctoken.spbar)
                            ctoken.spbar = {};

                        if (ctoken.spbar.uiValue)
                            ctoken.spbar.uiValue += value;
                        else
                            ctoken.spbar.uiValue = value;

                        ctoken.spbar.value = Number(ctoken.spbar.uiValue) / common.unit.length.value.value;

                        rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;

                        break;
                    }

                case rebarInputKeys.Dash:

                    //Do nothing. Symbol - not used in Rebar Mode Spacing

                    break;

                case rebarInputKeys.Sym:

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol) {
                        token.szbar = value;
                        rebarInput.tokens.push(token);
                        break;
                    }

                    if (ctoken.szbar && ctoken.spbar && ctoken.spbar.value && Number(ctoken.spbar.value) !== 0) {
                        token.szbar = value;
                        rebarInput.tokens.push(rebarInputKeys.Plus.symbol);
                        rebarInput.tokens.push(token);
                        break;
                    }

                    if (ctoken.szbar) {
                        ctoken.szbar = value;
                        rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                        break;
                    }

                    break;

                case rebarInputKeys.Point:

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol || !ctoken.szbar) {
                        break;
                    }

                    if (ctoken.szbar) {

                        if (!ctoken.ats)
                            ctoken.ats = rebarInputKeys.At.symbol;
                        if (!ctoken.spbar.uiValue) {
                            ctoken.spbar.uiValue = "0" + rebarInputKeys.Point.symbol;
                            ctoken.spbar.value = 0;
                            rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                            break;
                        }
                        if (!ctoken.spbar.uiValue.includes(rebarInputKeys.Point.symbol))
                            rebarInput.tokens[rebarInput.tokens.length - 1].spbar.uiValue += rebarInputKeys.Point.symbol;

                        break;
                    }

                case rebarInputKeys.At:

                    if (Object.keys(ctoken).length === 0 || ctoken === rebarInputKeys.Plus.symbol || !ctoken.szbar) {
                        break;
                    }

                    if (!ctoken.ats) {
                        ctoken.ats = rebarInputKeys.At.symbol;
                        rebarInput.tokens[rebarInput.tokens.length - 1] = ctoken;
                        break;
                    }

                    break;
            }

            break;
    }

    return true;
};

rebarInput.stringValue = function (mode, wid) {

    rebarInput.value = 0;

    var stringified = "<div>";

    switch (mode) {
        case REBARMODE.Area:

            var placeholder = "2500mm²";

            switch ($SETTINGS.unit.value.value) {
                case UNIT.US.value:
                    placeholder = "4in²";
                    break;

                case UNIT.SI.value:
                    placeholder = "2500mm²";
                    break;
            }

            if (rebarInput.tokens.length === 0)
                return "<div class='bar-count'>" + placeholder + "</div>";

            for (var i in rebarInput.tokens) {

                if (rebarInput.tokens[i] === rebarInputKeys.Plus.symbol) {
                    stringified += "</div><div class='operator'>" + rebarInput.tokens[i] + "</div><div>";
                } else {
                    stringified += rebarInput.tokens[i].uiValue + common.unit.area.value.name;
                }

                //Calculate Value
                if (rebarInput.tokens[i] !== rebarInputKeys.Plus.symbol) {
                    rebarInput.value += rebarInput.tokens[i].value;

                }

            }

            break;

        case REBARMODE.Bars:
            var barsize = "#3";

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

            if (rebarInput.tokens.length === 0)
                return "<div class='bar-count'>4-</div><div class='bar-size'>" + barsize + "</div>";

            var handle = false;
            var output = "";
            var sbar = "";

            for (var i = 0; i < rebarInput.tokens.length; i++) {
                if (rebarInput.tokens[i] !== "+" && !rebarInput.tokens[i].sbar) {
                    handle = true;
                    break;
                }
            }

            if (handle) {
                for (var i = 0; i < rebarInput.tokens.length; i++) {
                    if (rebarInput.tokens[i] !== "+") {
                        if (rebarInput.tokens[i].sbar) {
                            sbar = rebarInput.tokens[i].sbar.equation ? basicFraction(rebarInput.tokens[i].sbar.equation) : rebarInput.tokens[i].sbar.name;
                            output += rebarInput.tokens[i].nbar + "-" + sbar;
                        } else
                            output += rebarInput.tokens[i].nbar + "-<div class='bar-size'>" + barsize + "</div>";

                        if (i !== rebarInput.tokens.length - 1)
                            output += "<div class='operator'>+</div>";
                    }
                }

                return output;
            }

            for (i in rebarInput.tokens) {
                if (rebarInput.tokens[i] === rebarInputKeys.Plus.symbol) {
                    stringified += "</div><div class='operator'>" + rebarInput.tokens[i] + "</div><div>";
                    continue;
                }

                if (rebarInput.tokens[i].nbar)
                    stringified += rebarInput.tokens[i].nbar;

                if (rebarInput.tokens[i].dash)
                    stringified += rebarInput.tokens[i].dash;

                if (rebarInput.tokens[i].sbar) {
                    if (!rebarInput.tokens[i].nbar)
                        stringified += rebarScope.defnbar ? rebarScope.defnbar : "1";
                    ;
                    if (!rebarInput.tokens[i].dash)
                        stringified += rebarInputKeys.Dash.symbol;
                    stringified += rebarInput.tokens[i].sbar.equation ? basicFraction(rebarInput.tokens[i].sbar.equation) : rebarInput.tokens[i].sbar.name;
                }

                //Calculate Value
                if (rebarInput.tokens[i].nbar && rebarInput.tokens[i].sbar) {
                    var dia = Number(rebarInput.tokens[i].sbar.value);
                    rebarInput.value += Number(rebarInput.tokens[i].nbar) * rebarAreaFromDia(dia);
                }
            }

            stringified += "<div class='operator light'>+</div>";

            break;

        case REBARMODE.Spacing:
            var barsize = "#3";
            var barspacing = "@125mm";

            switch ($SETTINGS.rebarset.value.value) {
                case REBARSET.ASTM.value:
                    barsize = "#3";
                    break;

                case REBARSET.Metric.value:
                    barsize = "d10";
                    break;

                case REBARSET.Imperial.value:
                    barsize = "d⅜";
                    break;

                case REBARSET.Canadian.value:
                    barsize = "10M";
                    break;

                case REBARSET.Australian.value:
                    barsize = "N12";
                    break;
            }

            switch ($SETTINGS.unit.value.value) {
                case UNIT.US.value:
                    barspacing = "@5in";
                    break;

                case UNIT.SI.value:
                    barspacing = "@125mm";
                    break;
            }

            if (rebarInput.tokens.length === 0)
                return "<div class='bar-size'>" + barsize + "</div><div class='bar-count'>" + barspacing + "</div>";

            var handle = false;
            var output = "";
            var szbar = "";

            for (var i = 0; i < rebarInput.tokens.length; i++) {
                if (rebarInput.tokens[i] !== "+" && !rebarInput.tokens[i].spbar) {
                    handle = true;
                    break;
                }
            }

            if (handle) {
                for (var i = 0; i < rebarInput.tokens.length; i++) {
                    if (rebarInput.tokens[i] !== "+") {
                        szbar = rebarInput.tokens[i].szbar.equation ? basicFraction(rebarInput.tokens[i].szbar.equation) : rebarInput.tokens[i].szbar.name
                        if (rebarInput.tokens[i].spbar) {
                            output += szbar + rebarInput.tokens[i].ats + rebarInput.tokens[i].spbar.uiValue + common.unit.length.value.name;
                        } else
                            output += szbar + "<div class='bar-count'>" + barspacing + "</div>";

                        if (i !== rebarInput.tokens.length - 1)
                            output += "<div class='operator'>+</div>";
                    }
                }

                return output;
            }

            for (i in rebarInput.tokens) {
                if (rebarInput.tokens[i] === rebarInputKeys.Plus.symbol) {
                    stringified += "</div><div class='operator'>" + rebarInput.tokens[i] + "</div><div>";
                    continue;
                }

                if (rebarInput.tokens[i].szbar)
                    stringified += rebarInput.tokens[i].szbar.equation ? basicFraction(rebarInput.tokens[i].szbar.equation) : rebarInput.tokens[i].szbar.name;
                if (rebarInput.tokens[i].ats)
                    stringified += rebarInput.tokens[i].ats;
                if (rebarInput.tokens[i].spbar && rebarInput.tokens[i].spbar.uiValue)
                    stringified += rebarInput.tokens[i].spbar.uiValue + common.unit.length.value.name;

                //Calculate Value
                if (rebarInput.tokens[i].spbar && rebarInput.tokens[i].spbar.value && rebarInput.tokens[i].szbar) {
                    var dia = Number(rebarInput.tokens[i].szbar.value);
                    rebarInput.value += (Number(wid) / Number(rebarInput.tokens[i].spbar.value)) * rebarAreaFromDia(dia);
                    rebarInput.valueInt = Math.floor(rebarInput.value);

                }

            }

            stringified += "<div class='operator light'>+</div>";

            break;
    }

    stringified += "</div>";

    return stringified;
};

rebarInput.applyUnitChange = function (mode) {

    switch (mode) {
        case REBARMODE.Area:

            for (var i in rebarInput.tokens) {
                if (rebarInput.tokens[i].value) {
                    rebarInput.tokens[i].uiValue = rebarInput.tokens[i].value * common.unit.area.value.value;
                    rebarInput.tokens[i].uiValue = uiframework.settings.Format(rebarInput.tokens[i].uiValue);
                    rebarInput.tokens[i].uiValue = rebarInput.tokens[i].uiValue.replace(",", "").replace(" ", "");
                }

            }

            break;

        case REBARMODE.Bars:
            //Nothing to convert

            break;

        case REBARMODE.Spacing:

            for (i in rebarInput.tokens) {
                if (rebarInput.tokens[i].spbar && rebarInput.tokens[i].spbar.value) {
                    rebarInput.tokens[i].spbar.uiValue = rebarInput.tokens[i].spbar.value * common.unit.length.value.value;
                    rebarInput.tokens[i].spbar.uiValue = uiframework.settings.Format(rebarInput.tokens[i].spbar.uiValue);
                    //rebarInput.tokens[i].uiValue = rebarInput.tokens[i].uiValue.replace(",", "").replace(" ", "");

                }

            }

            break;
    }

};

rebarInput.ifNewInstance = function () {
    if (rebarInput.isNewInstance) {
        rebarInput.tokens = [];
    }
    rebarInput.isNewInstance = false;
};

var rebarAreaFromDia = function (dia) {
    return dia * dia * Math.PI / 4;
};

var percentdifference = function (rval, tval) {
    return (tval - rval) * 100 / rval;
};

var rebarEquivalentBars = function (area, set, minbars, maxbars, maxnbars, mixnbars, excess, minnbars, minspace, width) {

    if (common.IsZero(area))
        return;

    var areas = [];
    var bars = [];
    bars.push("#d");

    var results = [];
    var result = {};

    var areaplusexcess = area + area * excess / 100;

    if (!minnbars || minnbars === undefined || minnbars <= 0)
        minnbars = 1;

    if (true) {//Always true now that mixnbars was converted to boolean. Before: if (mixnbars >= 1) {

        areas = [];
        areas.push(0);

        for (n = minnbars; n <= maxnbars; n++) {

            for (var i in set) {
                if (set[i].value >= minbars.value && set[i].value <= maxbars.value) {

                    var narea = rebarAreaFromDia(set[i].value) * n;
                    var nlength = set[i].value * n;
                    var nspace = width / n;

                    var accepted = true;

                    accepted &= narea >= area; //Area filter
                    accepted &= nlength <= width; //Length filter
                    accepted &= nspace >= set[i].value;

                    if (excess >= 0)  //TODO: CHECK
                        accepted &= narea <= areaplusexcess; //Excess Area filter

                    accepted &= bars.indexOf(set[i].name) < 0; //Duplicate size filter

                    if (minspace && width) { //Spacing filter
                        accepted &= n * set[i].value + (n - 1) * minspace <= width;
                    }

                    if (accepted) {

                        areas.push(narea);
                        bars.push(set[i].name);

                        result = {};
                        result.value = {};
                        result.value.nbar = n;
                        result.value.sbar = set[i].name;
                        result.value.type = set[i];
                        result.area = narea;
                        result.perdiff = percentdifference(area, narea);

                        results.push(result);
                    }

                }
            }

        }

    }

    if (mixnbars) {//(mixnbars >= 2) {

        areas = [];
        areas.push(0);

        var values = [];
        var value1, value2;
        var taccept;

        for (n = minnbars; n <= maxnbars; n++) {

            for (var ix in set) {
                if (set[ix].value >= minbars.value && set[ix].value <= maxbars.value) {

                    for (m = minnbars; m <= n - 1; m++) {

                        if (!rebarNSymmetry(n, m))
                            continue; //If not symmetrical, no need to proceed

                        for (var iy in set) {
                            if (set[iy].value >= minbars.value && set[iy].value <= maxbars.value && set[ix].value !== set[iy].value) {

                                if ((set[ix].value > set[iy].value && n % 2 === 0) || (set[ix].value < set[iy].value && m % 2 === 0)) {

                                    var nmarea = rebarAreaFromDia(set[ix].value) * n + rebarAreaFromDia(set[iy].value) * m;
                                    var nmlength = set[ix].value * n + set[iy].value * m;
                                    var nmspace = width / (n + m);

                                    var accepted = true;

                                    accepted &= nmarea >= area; //Area filter
                                    accepted &= nmlength <= width; //Width filter
                                    accepted &= nmspace >= set[ix].value;
                                    accepted &= nmspace >= set[iy].value;

                                    if (excess >= 0)  //TODO: CHECK
                                        accepted &= nmarea <= areaplusexcess; //Excess Area filter

                                    result = {};
                                    result.value = [{}, {}];
                                    result.value[0].nbar = n;
                                    result.value[0].sbar = set[ix].name;
                                    result.value[0].type = set[ix];
                                    result.value[1].nbar = m;
                                    result.value[1].sbar = set[iy].name;
                                    result.value[1].type = set[iy];
                                    result.area = nmarea;
                                    result.perdiff = percentdifference(area, nmarea);


                                    value1 = n + "-" + set[ix].name + "-" + m + "-" + set[iy].name; 
                                    value2 = m + "-" + set[iy].name + "-" + n + "-" + set[ix].name; 

                                    accepted &= !values[value1];

                                    if (!accepted)
                                        accepted &= !values[value2];

                                    //accepted &= !rebarIsIn(results, result); //Duplicate filter

                                    if (accepted) {
                                        values[value1] = 1;
                                        values[value2] = 1;

                                        results.push(result);
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }

        // var startTime, endTime;
        // startTime = new Date();

        results = filterResults2(results);

        // endTime = new Date();
        // var timeDiff = endTime - startTime; //in ms
        // // strip the ms
        // timeDiff /= 1000;
      
        // // get seconds 
        // var seconds = timeDiff;
        // console.log(seconds + " seconds");
    }

    return results;

};

var filterResults = function (array) {

    var newresults = [];

    var newarray = [];

    for (var i in array) {
        if (!(array[i].value instanceof Array)) {
            newresults.push(array[i]);
            continue;
        }

        var found = false;
        for (var j in newarray) {

            var isin = false;

            isin |= (array[i].value[0].sbar === newarray[j].value[0].sbar && array[i].value[1].sbar === newarray[j].value[1].sbar);
            isin |= (array[i].value[0].sbar === newarray[j].value[1].sbar && array[i].value[1].sbar === newarray[j].value[0].sbar);

            if (isin && array[i].perdiff <= newarray[j].perdiff) {
                newarray[j] = array[i];
            }

            found |= isin;
        }

        if (!found)
            newarray.push(array[i]);

    }

    for (var i in array) {
        if (!(array[i].value instanceof Array)) {
            continue;
        }

        for (var j in newarray) {

            if (array[i].value[0].sbar === newarray[j].value[0].sbar &&
                array[i].value[1].sbar === newarray[j].value[1].sbar &&
                array[i].value[0].nbar === newarray[j].value[0].nbar &&
                array[i].value[1].nbar === newarray[j].value[1].nbar) {
                newresults.push(array[i]);
            }

        }

    }

    return newresults;
};

var filterResults2 = function (array) {

    var newresults = [];

    var newarray = [];

    for (let i = 0; i < array.length; i++) {
        if (!(array[i].value instanceof Array)) {
            newresults.push(array[i]);
            continue;
        }

        var found = false;
        for (let j = 0; j < newarray.length; j++) {

            var isin = false;

            isin |= (array[i].value[0].sbar === newarray[j].value[0].sbar && array[i].value[1].sbar === newarray[j].value[1].sbar);
            isin |= (array[i].value[0].sbar === newarray[j].value[1].sbar && array[i].value[1].sbar === newarray[j].value[0].sbar);

            if (isin && array[i].perdiff <= newarray[j].perdiff) {
                newarray[j] = array[i];
            }

            found |= isin;
        }

        if (!found)
            newarray.push(array[i]);

    }

    for (let i = 0; i < array.length; i++) {
        if (!(array[i].value instanceof Array)) {
            continue;
        }

        for (let j = 0; j < newarray.length; j++) {

            if (array[i].value[0].sbar === newarray[j].value[0].sbar &&
                array[i].value[1].sbar === newarray[j].value[1].sbar &&
                array[i].value[0].nbar === newarray[j].value[0].nbar &&
                array[i].value[1].nbar === newarray[j].value[1].nbar) {
                newresults.push(array[i]);
            }

        }

    }

    return newresults;
};


var rebarIsIn = function (array, item) {

    for (var i in array) {

        if (!(array[i].value instanceof Array))
            continue;

        var equal = false;

        equal = (array[i].value[0].nbar === item.value[0].nbar) && (array[i].value[0].sbar === item.value[0].sbar);
        equal &= (array[i].value[1].nbar === item.value[1].nbar) && (array[i].value[1].sbar === item.value[1].sbar);

        if (equal)
            return equal;

        equal = (array[i].value[0].nbar === item.value[1].nbar) && (array[i].value[0].sbar === item.value[1].sbar);
        equal &= (array[i].value[1].nbar === item.value[0].nbar) && (array[i].value[1].sbar === item.value[0].sbar);

        if (equal)
            return equal;

    }

    return false;
};

var rebarNSymmetry = function (n, m) {
    var n_iseven = n % 2 === 0;
    var m_iseven = m % 2 === 0;

    var symmetry = true;

    symmetry = (n === m - 1 || m === n - 1);
    symmetry = (n_iseven && !m_iseven) || (!n_iseven && m_iseven);

    return symmetry;
};

var rebarEquivalentSpac = function (area, set, minbars, maxbars, minspace, maxspace, width, excess) {

    if (common.IsZero(area))
        return;

    var areas = [];
    areas.push(0);
    var bars = [];
    bars.push("#d");

    var results = [];
    var result = {};

    var areaplusexcess = area + area * excess / 100;
    var n = 0;
    var i = 0;

    for (n = 2; n <= (width / maxbars.value); n++) {
        for (i in set) {
            if (set[i].value >= minbars.value && set[i].value <= maxbars.value) {

                var spacing = width / n;
                var narea = rebarAreaFromDia(set[i].value) * n;

                var accepted = true;

                accepted &= spacing >= minspace && spacing <= maxspace;
                accepted &= narea >= area; //Area filter

                if (excess > 0)
                    accepted &= narea <= areaplusexcess; //Excess Area filter
                accepted &= areas.indexOf(narea) < 0;
                accepted &= bars.indexOf(set[i].name) < 0;

                if (accepted) {
                    areas.push(narea);
                    bars.push(set[i].name);
                    result = {};
                    result.value = {};
                    result.value.szbar = set[i].name;
                    result.value.spbar = spacing;
                    result.value.type = set[i];
                    result.area = narea;
                    result.perdiff = percentdifference(area, narea);
                    result.avs = result.area / spacing;
                    results.push(result);
                }
            }
        }
    }

    return results;
};

var basicFraction = function (str) {
    var strsplit = str.split(" ");
    if (strsplit.length > 1) {
        var frac = strsplit[1].split("/");
        if (frac.length > 1) {
            return strsplit[0] + "<span class='fraction'><sup>" + frac[0] + "</sup>/<sub>" + frac[1] + "</sub></span>";
        }
    }
    return str;
};