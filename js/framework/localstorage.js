/* global $APPCODE */

var localstorage = function () {
    this.SaveUser = function (data) {
        localStorage.setItem($APPCODE + ".user", JSON.stringify(data));
    };

    this.OpenUser = function () {
        var user = localStorage.getItem($APPCODE + ".user");

        if (user && user !== "undefined")
            return JSON.parse(user);
    };

    this.ClearUser = function () {
        localStorage.removeItem($APPCODE + ".user");
    };

    this.SaveData = function (data, name) {
        localStorage.setItem($APPCODE + "." + name, JSON.stringify(data));
    };

    this.OpenData = function (name) {
        var user = localStorage.getItem($APPCODE + "." + name);

        if (user && user !== "undefined")
            return JSON.parse(user);
    };
};