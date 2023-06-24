/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global stack, $PREVIOUSVIEW, $MAINVIEW */

var navigationHelper = function () {
    this.stack = [];

    this.PushView = function (view) {
        this.stack.push(view);
    };

    this.PopView = function () {
        var viewa = this.stack.pop();
        var view = this.stack.pop();

        if (view === undefined) {
            var strconfirm = confirm("Are you sure you want to exit?");

            if (strconfirm === true)
                navigator.app.exitApp();
            else
                this.stack.push(viewa);
            
            return;
        } else {
            if (view.CloseMenu !== undefined && view.onmenu)
                view.CloseMenu();

            else if (view.CloseSettings !== undefined)
                view.CloseSettings();

            else if (view.Dispose !== undefined)
                view.Dispose();

            else
                view();
        }
    };
};



