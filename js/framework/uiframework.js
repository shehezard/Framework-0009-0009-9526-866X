/* global UNITTYPE, common, DISPLAYUNIT, reporting, $NAVIGATION, METRIC, $SETTINGS, FONTSIZE, $APPLICATION, $MODEL, $VIEW, $SETTINGSDRAWER, COLORS, REBARMODE, $HEIGHT */

// Notes on naming convention:
// 1. Enum should be all uppercase
// 2. Name of function or class should start with capital letter
// 3. Variables should be all lowercase
// 4. Private variables should start with an underscore _.

var _counter = 1;
var _property = 1;
var _modal = 1;
var $NAVIGATION;    //For backbutton
var _toolbargridsize = 56;

var $ONSEARCH = false;


var ALIGNMENT = {
    LEFT: { value: 1 },
    MIDDLE: { value: 2 },
    RIGHT: { value: 3 }
};

var ORIENTATION = {
    HORIZONTAL: { value: 1 },
    VERTICAL: { value: 2 }
};

var POSITION = {
    RELATIVE: { name: "Relative", value: 1 },
    ABSOLUTE: { name: "Absolute", value: 2 },
    FIXED: { name: "Fixed", value: 3 }
};

var DRAWERLOCATION = {
    LEFT: { value: 1 },
    RIGHT: { value: 2 }
};

var DEVICE = {
    LANDSCAPEMOBILE: { value: 1 },
    PORTRAITMOBILE: { value: 2 },
    LANDSCAPETABLET: { value: 3 },
    PORTRAITTABLET: { value: 4 }
};

function ExternalAppCallBack() {
    if (uiframework.externalappevent)
        uiframework.externalappevent();
}

var uiframework = function () {
};

uiframework.device = DEVICE.PORTRAITMOBILE;

uiframework.mobile = false;
uiframework.settings;
uiframework.externalappevent;
uiframework.parentobject;
uiframework.parentform;

uiframework.onnumericpad = false;
uiframework.allowclick = true;

uiframework.forms = [];

uiframework.ViewBase = function (app, parent, sender, device) {
    this.app = app;
    this.device = device;
    this.parent = parent;
    this.sender = sender;

    this.Show = function (view) {
        switch (device) {
            case DEVICE.LANDSCAPEMOBILE:
                this.LandscapeMobile(parent, sender, view);
                break;

            case DEVICE.PORTRAITMOBILE:
                this.PortraitMobile(parent, sender, view);
                break;

            case DEVICE.LANDSCAPETABLET:
                this.LandscapeTablet(parent, sender, view);
                break;

            case DEVICE.PORTRAITTABLET:
                this.PortraitTablet(parent, sender, view);
                break;
        }
    };
};

uiframework.Resize = function (w, h) {
    if (!$ONSEARCH) {
        if (w > h) {
            if (window.innerWidth < 800)
                uiframework.device = DEVICE.LANDSCAPEMOBILE;
            else
                uiframework.device = DEVICE.LANDSCAPETABLET;
        } else {
            if (h < 850)
                uiframework.device = DEVICE.PORTRAITMOBILE;
            else
                uiframework.device = DEVICE.PORTRAITTABLET;
        }
    }
};

uiframework.ContentView = function (name, icon) {
    var self = this;

    this.maingrid = new uiframework.Grid();
    this.maingrid.orientation = ORIENTATION.VERTICAL;
    this.maingrid.left = common.left;
    this.maingrid.right = common.right;

    this.toptoolbar = new uiframework.Grid();
    this.toptoolbar.class += " toolbar-grid";
    this.toptoolbar.fixedsize = true;
    this.toptoolbar.size = _toolbargridsize + common.top;

    this.bottomtoolbar = new uiframework.Toolbar();
    this.bottomtoolbar.fixedsize = true;
    this.bottomtoolbar.size = 0;
    this.bottomtoolbar.class += " toolbar-bottom";

    this.contentgrid = new uiframework.Grid();
    this.contentgrid.class += " content-area";
    this.contentgrid.orientation = ORIENTATION.VERTICAL;

    this.menucontent;
    this.settingscontent;
    this.propsettings = [];
    this.settingsupdateevent;

    this.closesettingsevent;
    this.beforeshowsetting;

    this.toolbar;
    this.name = name;

    this.showmenu = true;
    this.showsetting = true;
    this.showbottomtoolbar = false;

    this.toolbar = new uiframework.Toolbar();
    this.toolbar.highlight = false;

    this.righttoolbar = [];

    if (icon === undefined)
        icon = "bars";

    this.icon = icon;

    this.Show = function () {
        this.maingrid.DisposeChildren();
        this.maingrid.Add(this.toptoolbar);
        this.maingrid.Add(this.contentgrid);

        this.maingrid.Add(this.bottomtoolbar);

        this.maingrid.Show();

        if (this.showsetting) {
            var setting = new uiframework.ToolbarAppButton("ellipsis-v");
            setting.id = "settings";
            setting.event = this.ShowSettings;
            setting.view = this;
            setting.alignment = ALIGNMENT.RIGHT;
            setting.data = "_SETTINGS_";
            this.toolbar.Add(setting);
        }

        for (var i = 0; i < this.righttoolbar.length; i++) {
            this.toolbar.Add(this.righttoolbar[i]);
        }

        if (this.showmenu) {
            this.appbutton = new uiframework.ToolbarMainButton(this.icon, this.name, undefined, this.righttoolbar);
            this.appbutton.icononly = true;
            this.appbutton.event = this.ShowMenu;
            this.appbutton.view = this;
            this.appbutton.data = "_MENU_";
            this.toolbar.Add(this.appbutton);
        }

        this.toolbar.Show(this.toptoolbar);
    };

    this.ShowBottomToolbar = function () {
        this.bottomtoolbar.object.css({ height: 56 });
        this.bottomtoolbar.size = 50;
    };

    this.HideBottomToolbar = function () {
        //Hide bottom toolbar
        this.bottomtoolbar.Dispose();
        this.bottomtoolbar.size = 0;
        this.bottomtoolbar.object.css({ height: 0 });

        if (this.Refresh)
            this.Refresh();
    };

    this.RefreshToolbar = function () {
        this.toolbar.Dispose();

        if (this.showsetting) {
            var setting = new uiframework.ToolbarAppButton("ellipsis-v");
            setting.id = "settings";
            setting.event = this.ShowSettings;
            setting.view = this;
            setting.alignment = ALIGNMENT.RIGHT;
            this.toolbar.Add(setting);
        }

        for (var i = 0; i < this.righttoolbar.length; i++) {
            this.toolbar.Add(this.righttoolbar[i]);
        }

        if (this.showmenu) {
            this.appbutton = new uiframework.ToolbarMainButton(this.icon, this.name, undefined, this.righttoolbar);
            this.appbutton.icononly = true;
            this.appbutton.event = this.ShowMenu;
            this.appbutton.view = this;
            this.toolbar.Add(this.appbutton);
        }

        this.toolbar.Show();
    };

    this.UpdatePosition = function () {
        this.toptoolbar.size = _toolbargridsize + common.top;
        this.maingrid.left = common.left;
        this.maingrid.right = common.right;
    };

    this.Dispose = function () {
        this.maingrid.Dispose();
        this.toptoolbar.Dispose();
        this.contentgrid.Dispose();
    };

    this.SetMenu = function (items) {
        this.menucontent = items;
    };

    this.SetSettings = function (items) {
        this.settingscontent = items;
    };

    this.BindSettings = function (settings) {
        this.propsettings.push(settings);
    };

    this.HideSettings = function () {
        var settings = $("#settings");
        settings.remove();
    };

    this.ShowMenu = function (parent, sender) {
        var view = parent.view;

        if (view.menu === undefined) {
            var drawer = new uiframework.Drawer("Application");
            drawer.closeevent = view.CloseMenu;
            drawer.datainfo = "menu";

            if (view.menucontent !== undefined)
                for (var i = 0; i < view.menucontent.length; i++)
                    drawer.Add(view.menucontent[i]);

            drawer.Show();

            drawer.view = view;
            view.menu = drawer;
            view.onmenu = true;

            uiframework.forms.push([view.CloseMenu, drawer]);

            if ($NAVIGATION !== undefined) {
                $NAVIGATION.PushView(view);
                $NAVIGATION.PushView(view);
            }
        }
    };

    this.ShowSettings = function (parent, sender) {
        var view = parent.view;

        if (view.settings === undefined) {
            if (self.beforeshowsetting)
                self.beforeshowsetting();

            var drawer = new uiframework.Drawer("Settings");

            drawer.closeevent = view.CloseSettings;
            drawer.location = DRAWERLOCATION.RIGHT;
            drawer.datainfo = "settings";

            var grid = new uiframework.Grid();
            grid.orientation = ORIENTATION.VERTICAL;
            //grid.fixedsize = true;
            //grid.size = _toolbargridsize;

            var contentgrid = new uiframework.Container();
            contentgrid.orientation = ORIENTATION.VERTICAL;

            var settingstoolbar = new uiframework.Toolbar();
            settingstoolbar.class += " toolbar-grid-settings";
            var reset = new uiframework.ToolbarButton("refresh", "", "Reset");
            reset.alignment = ALIGNMENT.RIGHT;
            reset.class += "-settings";
            reset.view = view;
            reset.drawer = drawer;

            //            $APPLICATION.drawer = drawer;
            //            $APPLICATION.parentview = view;
            //            $APPLICATION.form = this;

            var handle = true;

            reset.event = function (parent) {
                common.ShowMessage("Reset Settings", "Are you sure you want to reset the settings?", undefined, function () {
                    if (handle) {
                        this.Dispose();

                        common.unit = new commonunit(UNIT.US);

                        if ($MODEL.InitializeSettings)
                            $MODEL.InitializeSettings(reset);

                        if ($VIEW.propsettings)
                            $VIEW.propsettings = [];

                        if ($APPLICATION.InitializeSettings)
                            $APPLICATION.InitializeSettings();

                        if ($APPLICATION.SettingsUpdated)
                            $APPLICATION.SettingsUpdated(true);

                        drawer.Dispose();
                        //parent.drawer.Dispose();
                        parent.view.settings = undefined;
                        parent.view.ShowSettings({ view: parent.view });

                        handle = false;

                        if ($SETTINGS.unitchanged)
                            $SETTINGS.unitchanged();
                    }

                }, function () {
                    if (handle) {
                        drawer.Dispose();
                        //parent.drawer.Dispose();
                        parent.view.settings = undefined;
                        parent.view.ShowSettings({ view: parent.view });
                        this.Dispose();

                        handle = false;
                    }

                }, 300, 160, "Yes");
            };


            settingstoolbar.Add(reset);
            drawer.Add(settingstoolbar);
            grid.Add(contentgrid);

            drawer.Add(grid);

            if (view.settingscontent !== undefined)
                for (var i = 0; i < view.settingscontent.length; i++)
                    contentgrid.Add(view.settingscontent[i]);

            for (var i = 0; i < view.propsettings.length; i++)
                contentgrid.Bind(view.propsettings[i], view.settingsupdateevent);

            drawer.Show();

            drawer.view = view;
            view.settings = drawer;
            view.onmenu = false;

            uiframework.forms.push([view.CloseSettings, drawer]);

            if ($SETTINGS.UpdateCSS)
                $SETTINGS.UpdateCSS();

            if ($NAVIGATION) {
                $NAVIGATION.PushView(view);
                $NAVIGATION.PushView(view);
            }
        }
    };

    this.CloseMenu = function (parent, sender) {
        if (parent !== undefined) {
            parent.Dispose();
            parent.view.menu = undefined;

            uiframework.forms.pop();

        } else if (this.menu !== undefined) {
            this.menu.Dispose();
            this.menu = undefined;
        }
    };

    this.CloseSettings = function (parent, sender) {
        if (parent !== undefined) {
            parent.Dispose();
            parent.view.settings = undefined;

            uiframework.forms.pop();

        } else if (this.settings !== undefined) {
            this.settings.Dispose();
            this.settings = undefined;
        }

        if (parent !== undefined && parent.view.closesettingsevent !== undefined)
            parent.view.closesettingsevent();
    };

    this.Resize = function (x, y, w, h) {
        this.maingrid.Resize(x, y, w, h);
    };
};

uiframework.Base = function () {
    this.id;
    this.class;
    this.object;
    this.position = POSITION.RELATIVE;
    this.parent;
    this.items = [];
    this.data;
    this.visible = true;

    this.Bind = function (properties, event) {
        for (var name in properties)
            if (properties[name] && properties[name].Load) {
                if (event !== undefined && !(properties[name] instanceof uiframework.PropertyCategory))
                    if (properties[name].visible)
                        properties[name].event = event;

                this.items.push(properties[name]);
            }
    };

    this.Show = function (parent) {
        if (parent === undefined && this.parent === undefined) {
            parent = $("body");

            this.parent = parent;
            this.id = "container" + _counter++;

        } else if (parent === undefined && this.parent !== undefined) {
            parent = this.parent;

        } else if (parent.append === undefined && parent.object !== undefined) {
            parent.DisposeChildren();
            parent.Add(this);
            parent = parent.object;

            this.parent = parent;
            this.id = "container" + _counter++;

        } else {
            this.parent = parent;
            this.id = "container" + _counter++;
        }

        this.Load();
        return true;
    };

    this.Dispose = function () {
        if (this.object !== undefined) {
            this.object.unbind();
            this.object.remove();
        }

        for (var i = 0; i < this.items.length; i++)
            this.items[i].Dispose();

        this.items = [];
    };

    this.DisposeChildren = function () {
        for (var i = 0; i < this.items.length; i++)
            this.items[i].Dispose();

        this.items = [];

        if (this.object !== undefined)
            this.object.empty();
    };

    this.DisposeObject = function () {
        if (this.object !== undefined) {
            this.object.unbind();
            this.object.remove();
        }
    };

    this.GenerateContainer = function () {
        //Generate div container with id and class
        if (this.id === undefined) {
            if (this.data)
                this.id = this.data;
            else if (this.id === undefined)
                this.id = "container" + _counter++;
        }

        var _class = this.class;

        if (!this.visible)
            _class += " hidden";

        if (this.selected)
            return "<div id='" + this.id + "' class='" + _class + " selected'></div>";
        else
            return "<div id='" + this.id + "' class='" + _class + "'></div>";
    };

    this.Add = function (item) {
        this.items.push(item);
        item.container = this;
        return item;
    };

    this.Clear = function () {
        this.items = [];
    };

    this.Resize = function (x, y, w, h, r) {
        if (this.object !== undefined) {
            if (x === undefined)
                x = this.parent.position().left;

            if (y === undefined)
                y = this.parent.position().top;

            if (w === undefined)
                w = this.parent.width();

            if (h === undefined)
                h = this.parent.height();

            if (!r)
                this.object.css({ left: x, top: y, width: w, height: h });
        }
    };

    // this.ClickEventNumber = function (parent, sender, event, nocascade) {
    //     sender.bind("click", function (e) {
    //         if (nocascade)
    //             e.stopPropagation();

    //         event(parent, sender, e);
    //     });
    // };

    this.ClickEventNumber = function (parent, sender, event_, nocascade) {
        if (uiframework.mobile) {
            var trackingClick = false;
            var targetElement = null;
            var touchStartX = 0;
            var touchStartY = 0;
            var touchBoundary = 10;
            var onscroll = false;

            sender.unbind();

            sender.on("touchstart", function (event) {
                event.stopPropagation();

                trackingClick = true;
                targetElement = event.target;
                touchStartX = event.originalEvent.touches[0].pageX;
                touchStartY = event.originalEvent.touches[0].pageY;

                return true;
            });

            sender.on("touchmove", function (event) {
                event.stopPropagation();

                if (!trackingClick) {
                    return true;
                }

                // If the touch has moved, cancel the click tracking
                if (targetElement !== event.target ||
                    (Math.abs(event.originalEvent.changedTouches[0].pageX - touchStartX) > touchBoundary ||
                        (Math.abs(event.originalEvent.changedTouches[0].pageY - touchStartY) > touchBoundary))) {

                    trackingClick = false;
                    targetElement = null;
                }

                return true;
            });

            sender.on("touchend", function (event) {
                event.stopPropagation();

                if (trackingClick) {
                    trackingClick = false;

                    if (!onscroll) {
                        event_(parent, sender, event);
                    }
                }
            });

            sender.on("touchcancel", function (event) {
                event.stopPropagation();

                trackingClick = false;
                targetElement = null;
            });

            sender.click(function (e) {
                e.stopPropagation();
            });

        } else {
            sender.bind("click", function (e) {
                if (nocascade)
                    e.stopPropagation();

                event_(parent, sender, e);
            });
        }
    };

    this.SetLocation = function (x, y) {
        this.object.css({ left: x, top: y });
    };

    this.SetSize = function (width, height) {
        this.object.css({ width: width, height: height });
    };

    this.SetVisible = function (value) {
        if (value)
            this.object.removeClass("hidden");
        else
            this.object.addClass("hidden");
    };
};

uiframework.Grid = function () {
    uiframework.Base.call(this);

    this.class = "grid";
    this.fixedsize = false;
    this.size = 100;
    this.orientation = ORIENTATION.HORIZONTAL;

    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            if (this.object === undefined)
                this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Load each of the items
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] !== undefined && this.items[i].Load)
                    this.items[i].Load(this.object);
            }
        }
    };

    this.Resize = function (x, y, w, h, r) {
        if (this.object === undefined || !h)
            return;

        if (this.object.hasClass("fullscreen")) {
            return;
        }

        this.object.css({ display: "" });

        if (w !== 0) {
            if (!r) {
                w = w - this.left - this.right;
                this.object.css({ left: x + this.left, top: y + this.top, width: w, height: h - this.top - this.bottom });
            } else
                this.object.removeAttr('style');
        } else
            this.object.css({ display: "none" });

        var fixedsize = 0;
        var notfixedcount = 0;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].fixedsize && this.items[i].position === POSITION.RELATIVE)
                fixedsize += this.items[i].size;
            else {
                notfixedcount++;
            }
        }

        var s = 0;
        x = 0;
        y = 0;

        var noresize;

        if (this.items.length === 1)
            noresize = true;

        if (this.orientation === ORIENTATION.HORIZONTAL) {
            if (notfixedcount !== 0)
                s = (w - fixedsize) / notfixedcount;

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].fixedsize && this.items[i].position === POSITION.RELATIVE) {
                    this.items[i].Resize(x, y, this.items[i].size, h, noresize);
                    x += this.items[i].size;

                } else if (this.items[i].position === POSITION.RELATIVE) {
                    this.items[i].Resize(x, y, s, h, noresize);
                    x += s;
                }
            }

        } else {
            if (notfixedcount !== 0)
                s = (h - fixedsize) / notfixedcount;

            var lastindex = this.items.length - 1;

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].fixedsize && this.items[i].position === POSITION.RELATIVE) {
                    this.items[i].Resize(x, y, w, this.items[i].size, noresize);
                    y += this.items[i].size;
                } else if (this.items[i].position === POSITION.RELATIVE) {
                    this.items[i].Resize(x, y, w, s, noresize);
                    y += s;
                }
            }
        }
    };

    this.Refresh = function () {
        var p = this.object.position();
        var w = this.object.width();
        var h = this.object.height();

        this.Resize(p.left, p.top, w, h);
    };
};

uiframework.Separator = function () {
    uiframework.Grid.call(this);

    this.class += " separator";
    this.fixedsize = true;
    this.size = 1;
};

uiframework.Form = function (text) {
    uiframework.Base.call(this);

    var self = this;

    //Always set the class
    this.class = "form";

    //Class properties
    this.text = text;
    this.modalid = "";

    //Settings
    this.showheader = true;
    this.showclose = true;
    this.showfooter = true;
    this.showok = true;
    this.showcancel = false;

    this.oktext = "OK";
    this.canceltext = "Cancel";

    this.modal = true;
    this.fixedsize = false;

    //Dimensions
    this.width = 375;
    this.height = 667;

    //Object references
    this.header;
    this.body;
    this.footer;
    this.closebutton;

    //Events
    this.closeevent;
    this.okevent;
    this.ondispose;

    this.Load = function () {
        //Generate div container with id and class
        var content = "";

        if (this.parent.append !== undefined) {
            //Add background if modal
            if (this.modal) {
                this.modalid = _modal++;
                content = "<div id='modal" + this.modalid + "' class='modal'></div>";
            }

            //Add form container
            content += this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            var hasheader = "";
            var hasfooter = "";

            //Header
            if (this.showheader) {
                var header = "<h1 id='" + this.id + "_header' class='form-header'><div class='header-text'>" + this.text + "</div>";

                if (this.showclose) {
                    header += "<div id='" + this.id + "_close' class='toolbar-item'><div class='drawer-close'><i class='fa fa-times-circle-o btn-close'></div></div>";
                }

                header += "</h1>";
                object.append(header);

                if (this.showclose) {
                    //Reference is always needed
                    this.closebutton = $("#" + this.id + "_close");
                    this.ClickEventNumber(this, this.closebutton, this.Close);
                }
            } else {
                hasheader = " no-header";
            }

            if (!this.showfooter)
                hasfooter = " no-footer";

            //Body
            var body = "<div id='" + this.id + "_body' class='form-body" + hasheader + hasfooter + "'></div>";
            object.append(body);

            this.body = $("#" + this.id + "_body");

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].Load)
                    this.items[i].Load(this.body);
                else if (this.items[i].Show)
                    this.items[i].Show(this.body);
            }

            //Footer
            if (this.showfooter) {
                var footer = "<div id='" + this.id + "_footer' class='form-footer'>";

                if (this.showok)
                    footer += "<div id='" + this.id + "_ok' class='button button-ok'>" + this.oktext + "</div>";

                if (this.showcancel)
                    footer += "<div id='" + this.id + "_cancel' class='button button-cancel'>" + this.canceltext + "</div>";

                //                if (this.showclose)
                //                    footer += "<div id='" + this.id + "_cancel' class='button button-cancel'>Close</div>";

                footer += "</div>";
                object.append(footer);

                if (this.showok) {
                    //Reference is always needed
                    this.okbutton = $("#" + this.id + "_ok");
                    this.ClickEventNumber(this, this.okbutton, this.OK);
                }

                if (this.showcancel) {
                    this.cancelbutton = $("#" + this.id + "_cancel");
                    this.ClickEventNumber(this, this.cancelbutton, this.Close);
                }

                //                if (this.showclose) {
                //                    this.cancelbutton = $("#" + this.id + "_cancel");
                //                    this.ClickEventNumber(this, this.cancelbutton, this.Close);
                //                }
            }

            if (this.modal) {
                var modal = $("#modal" + this.modalid);
                this.ClickEventNumber(this, modal, this.Close);

                this.CenterPosition();
            }

            this.Resize(0, 0);

            if ($NAVIGATION !== undefined) {
                $NAVIGATION.PushView(this);
                $NAVIGATION.PushView(this);
            }
            if ($SETTINGS.UpdateCSS)
                $SETTINGS.UpdateCSS();

            uiframework.forms.push([this.Dispose, this]);
        }
    };

    this.Dispose = function (sender) {
        if (sender) {
            var modal = $("#modal" + sender.modalid);
            modal.remove();

            for (var i = 0; i < sender.items.length; i++)
                sender.items[i].Dispose(sender.body);

            sender.items = [];

            if (sender.object !== undefined) {
                sender.object.unbind();
                sender.object.remove();
            }

        } else {
            var modal = $("#modal" + this.modalid);
            modal.remove();

            for (var i = 0; i < this.items.length; i++)
                this.items[i].Dispose(this.body);

            this.items = [];

            if (this.object !== undefined) {
                this.object.unbind();
                this.object.remove();
            }
        }

        if (self.ondispose)
            self.ondispose();

        uiframework.forms.pop();
    };

    this.CenterPosition = function () {
        var w = $(window).width();
        var h = $(window).height();

        var width = this.width;
        var height = this.height;

        var top = (h - height) / 2;
        if (top < 0)
            top = 0;

        if (height > h)
            height = h;

        this.object.css({ left: (w - width) / 2, top: top, height: height, width: width });
    };

    this.DockLeft = function (width) {
        var top = 56;
        var height = $HEIGHT - top;
        this.Resize(0, top, width, height);
    };

    this.DockRight = function (width) {
        var top = 56 + common.top;
        var h = $HEIGHT - top;
        var w = window.innerWidth - width;
        this.Resize(w, top, width, h);
    };

    this.DockFullScreen = function () {
        var top = 56 + common.top;
        var width = window.innerWidth;
        var height = $HEIGHT - top;
        this.Resize(0, _toolbargridsize + common.top, width, height);
    };

    this.SetText = function () {

    };

    this.OK = function (parent, sender) {
        if (parent.okevent !== undefined)
            parent.okevent(parent, sender);

        parent.Close();
    };

    this.Close = function (parent, sender) {
        uiframework.onnumericpad = false;
        uiframework.allowclick = true;

        if (self.closeevent !== undefined)
            self.closeevent(self, sender);

        self.Dispose();

        if ($NAVIGATION !== undefined) {
            $NAVIGATION.stack.pop();
            $NAVIGATION.stack.pop();
        }
    };
};

uiframework.LoginForm = function () {
    uiframework.Base.call(this);

    //Always set the class
    this.class = "form form-login";

    //Settings
    this.modal = true;

    //Dimensions
    this.width = 375;
    this.height = 400;

    //Object references
    this.header;
    this.body;
    this.footer;
    this.closebutton;

    //Events
    this.closeevent;
    this.okevent;

    this.Load = function () {
        //Generate div container with id and class
        var content = "";

        if (this.parent.append !== undefined) {
            //Add background if modal
            content = "<div id='loginmodal' class='login-background'></div>";

            //Add form container
            content += this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Header
            var header = "<h1 id='" + this.id + "_header' class='form-header'></h1>";
            object.append(header);

            if (!this.showfooter)
                hasfooter = " no-footer";

            //Body
            var body = "<div id='" + this.id + "_body' class='form-body'></div>";
            object.append(body);

            this.body = $("#" + this.id + "_body");

            for (var i = 0; i < this.items.length; i++) {
                this.items[i].Load(this.body);
            }

            //Footer
            var footer = "<div id='" + this.id + "_footer' class='form-footer'>";
            footer += "<div id='" + this.id + "_ok' class='button button-ok'>OK</div>";
            footer += "<div id='" + this.id + "_cancel' class='button button-cancel'>Cancel</div>";

            footer += "<div class='forgot'><span>Forgot your password?</span></div>";
            footer += "<div class='create-account'>Don't have an account? <span>Create Account</span></div>";

            footer += "</div>";
            object.append(footer);

            //Reference is always needed
            this.okbutton = $("#" + this.id + "_ok");
            this.ClickEventNumber(this, this.okbutton, this.OK);

            this.cancelbutton = $("#" + this.id + "_cancel");
            this.ClickEventNumber(this, this.cancelbutton, this.Close);

            var forget = $("#" + this.id + " .forgot");
            this.ClickEventNumber(this, forget, this.ForgotPassword);

            var create = $("#" + this.id + " .create-account");
            this.ClickEventNumber(this, create, this.CreateAccount);

            var modal = $("#modal" + this.modalid);
            this.ClickEventNumber(this, modal, this.Close);

            this.CenterPosition();
            this.Resize(0, 0);

            if ($NAVIGATION !== undefined) {
                $NAVIGATION.PushView(this);
                $NAVIGATION.PushView(this);
            }
        }
    };

    this.Dispose = function () {
        $("#loginmodal").unbind();
        $("#loginmodal").remove();

        for (var i = 0; i < this.items.length; i++)
            this.items[i].Dispose(this.body);

        this.items = [];

        if (this.object !== undefined) {
            this.object.unbind();
            this.object.remove();
        }
    };

    this.CenterPosition = function () {
        var w = $(window).width();
        var h = $(window).height();

        var width = this.width;
        var height = this.height;

        this.object.css({ left: (w - width) / 2, top: (h - height) / 2, width: width, height: height });
    };

    this.DockLeft = function (width) {
        var top = 56;
        var height = $HEIGHT - top;
        this.Resize(0, top, width, height);
    };

    this.DockRight = function (width) {
        var top = 56;
        var h = $HEIGHT - top;
        var w = window.innerWidth - width;
        this.Resize(w, top, width, h);
    };

    this.SetText = function () {

    };

    this.OK = function (parent, sender) {
        if (parent.okevent !== undefined)
            parent.okevent(parent, sender);
    };

    this.Close = function (parent, sender) {
        if (parent.closeevent !== undefined)
            parent.closeevent(parent, sender);

        $("#loginmodal").unbind();
        $("#loginmodal").remove();

        parent.Dispose();

        if ($NAVIGATION !== undefined) {
            $NAVIGATION.stack.pop();
            $NAVIGATION.stack.pop();
        }
    };

    this.ForgotPassword = function () {
        window.open("https://cloud.america.com/user/password");
    };

    this.CreateAccount = function () {
        window.open("https://cloud.america.com/user/register");
    };
};

uiframework.Container = function () {
    uiframework.Base.call(this);

    this.class = "container";
    this.scrollevent;

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        //Generate div container with id and class
        if (this.parent.append !== undefined) {
            this.parent.empty();

            //Add form container
            var content = this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Body
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].Load)
                    this.items[i].Load(this.object);
                else if (this.items[i].Refresh)
                    this.items[i].Show(this.object);
            }

            var _this = this;

            if (this.scrollevent) {
                object.scroll(function () {
                    _this.scrollevent();
                });
            }


            this.Resize(0, 0);
        }
    };

    this.Resize = function () {
    };
};

uiframework.HorizontalContainer = function () {
    uiframework.Container.call(this);

    this.class = " horizontal-container";

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        //Generate div container with id and class
        if (this.parent.append !== undefined) {
            //Add form container
            var content = this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Body
            var tdid;
            var ids = [];
            var count = 0;
            var stop = false;

            content = "<table><tr>";

            for (var i = 0; i < this.items.length; i++) {
                tdid = this.id + "-cell-" + i;
                content += "<td id='" + tdid + "'></td>";
                ids.push(tdid);
            }

            content += "</tr></table>";
            this.object.append(content);

            count = 0;

            for (var i = 0; i < this.items.length; i++) {
                object = $("#" + ids[count]);
                this.items[i].Load(object);
                count++;
            }

            this.Resize(0, 0);
        }
    };

    this.Resize = function (x, y) {
        if (this.object !== undefined) {
            if (x === undefined)
                x = this.parent.position().left;

            if (y === undefined)
                y = this.parent.position().top;

            this.object.css({ left: x, top: y });
        }
    };
};

uiframework.ReportContainer = function () {
    uiframework.Container.call(this);

    this.class += " report-container";

    this.Resize = function (x, y, w, h) {
        if (this.object !== undefined) {
            if (x === undefined)
                x = this.parent.position().left;

            if (y === undefined)
                y = this.parent.position().top;

            if (h === undefined)
                h = this.parent.height();

            this.object.css({ left: x, top: y, height: h });
        }
    };
};

uiframework.ThumbnailContainer = function () {
    uiframework.Base.call(this);

    this.class = "thumbnail-container";
    this.columns = 2;

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        //Generate div container with id and class
        if (this.parent.append !== undefined) {
            //Add form container
            var content = this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Body
            var tdid;
            var ids = [];
            var count = 0;
            var stop = false;

            content = "<table>";

            for (var i = 0; i < this.items.length; i++) {
                content += "<tr>";

                for (var c = 0; c < this.columns; c++) {
                    if (count < this.items.length) {
                        tdid = this.id + "-cell-" + count;
                        content += "<td id='" + tdid + "'></td>";
                        ids.push(tdid);
                    } else {
                        stop = true;
                        break;
                    }

                    count++;
                }
                content += "</tr>";

                if (stop)
                    break;
            }

            content += "</table>";
            this.object.append(content);

            count = 0;

            for (var i = 0; i < this.items.length; i++) {
                object = $("#" + ids[count]);
                this.items[i].Load(object);
                count++;
            }

            this.Resize(0, 0);
        }
    };

    this.Resize = function (x, y, w, h) {
        if (this.object !== undefined) {
            if (x === undefined)
                x = this.parent.position().left;

            if (y === undefined)
                y = this.parent.position().top;

            if (w === undefined)
                w = this.parent.width();

            this.object.css({ left: x, top: y, width: w });
        }
    };
};

uiframework.iFrame = function (url) {
    uiframework.Base.call(this);

    this.class = "iframe";
    this.url = url;

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        //Generate div container with id and class
        if (this.parent.append !== undefined) {
            //Add form container
            if (this.id === undefined)
                this.id = "container" + _counter++;

            content = "<iframe id='" + this.id + "' class='" + this.class + "' src='" + this.url + "'></iframe>";

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            this.Resize(0, 0, 375, 667);
        }
    };
};

uiframework.GeneralHTML = function (text) {
    uiframework.Base.call(this);

    this.class = "html";
    this.text = text;

    this.Load = function (parent) {
        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (parent !== undefined)
            this.parent = parent;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);
            object.html(this.text);

            //Set the object
            this.object = object;
        }
    };
};

uiframework.Button = function (text) {
    uiframework.Base.call(this);

    var self = this;

    this.class = "button";
    this.text = text;

    this.Load = function (parent) {
        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (parent !== undefined)
            this.parent = parent;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);
            object.text(this.text);

            //Set the object
            this.object = object;

            if (this.event) {
                object.click(function () {
                    if (self.event)
                        self.event();
                });
            }
        }
    };
};

uiframework.FloatingButton = function (icon) {
    uiframework.Base.call(this);

    this.class = "button floating";
    this.icon = icon;

    this.Load = function () {
        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);
            var content = "<i class='fa fa-" + this.icon + "'></i>";

            object.text(content);

            //Set the object
            this.object = object;
        }
    };
};

uiframework.Toolbar = function () {
    uiframework.Base.call(this);

    this.class = "toolbar";
    this.highlight = true;

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

            //Load each of the items
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].Load(this.object);
            }
        }
    };

    this.Resize = function (x, y, w, h) {
    };
};

uiframework.ContainerToolbar = function () {
    uiframework.Toolbar.call(this);

    this.class += " container-header";
};

uiframework.ToolbarButton = function (icon, text, bottom) {
    uiframework.Base.call(this);

    this.class = "toolbar-button";
    this.icon = icon;
    this.event;
    this.highlight = true;
    this.toggle = false;
    this.iconon = icon;
    this.iconoff = icon;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    this.bottom = bottom;

    this.alignment = ALIGNMENT.LEFT;

    this.Load = function (parent) {
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var _class = this.class;

        switch (this.alignment) {
            case ALIGNMENT.LEFT:
                this.class += " align-left";
                break;

            case ALIGNMENT.MIDDLE:
                this.class += " align-middle";
                break;

            case ALIGNMENT.RIGHT:
                this.class += " align-right";
                break;
        }

        var content = this.GenerateContainer();

        this.class = _class;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            if (this.icon !== undefined && this.icon !== "") {
                if (this.icon.indexOf(".png") !== -1 || this.icon.indexOf(".jpg") !== -1 || this.icon.indexOf(".svg") !== -1)
                    icon = "<img id='" + this.id + "_icon' src='icons/" + this.icon + "'/>";
                else
                    icon = "<i id='" + this.id + "_icon' class='fa fa-" + this.icon + "'></i>";
            }

            if (this.text) {
                var caption = "<span class='top'>" + this.text + "</span>";

                var text = "<span id='" + this.id + "_text'>" + caption + "</span>";

                object.append(icon + text);
            } else
                object.append(icon);

            //Set the object
            this.object = object;
            this.iconobject = $("#" + this.id + "_icon");
            this.textobject = $("#" + this.id + "_text");

            this.ClickEventNumber(this, this.object, function (parent, sender) {
                if (parent.toggle) {
                    if (parent.iconobject.hasClass("fa-" + parent.iconon)) {
                        parent.iconobject.removeClass("fa-" + parent.iconon);
                        parent.iconobject.addClass("fa-" + parent.iconoff);
                    } else {
                        parent.iconobject.removeClass("fa-" + parent.iconoff);
                        parent.iconobject.addClass("fa-" + parent.iconon);
                    }
                }

                var ishighlighted = parent.object.hasClass("highlight");

                if (!ishighlighted) {
                    if (parent.highlight && parent.container && parent.container.highlight) {
                        parent.class = parent.class.replace(" highlight", "");
                        parent.class = parent.class.replace(" even", "");
                        parent.class = parent.class.replace(" odd", "");
                        parent.class = parent.class.replace(" appname", "");
                        parent.container.object.children("." + parent.class).removeClass("highlight");
                        parent.object.addClass("highlight");
                    }

                    if (parent.event !== undefined)
                        parent.event(parent, sender);

                    if ($SETTINGS && $SETTINGS.UpdateCSS)
                        $SETTINGS.UpdateCSS();
                }
            }, true);

            if ($SETTINGS && $SETTINGS.UpdateCSS)
                $SETTINGS.UpdateCSS();

        }

    };

    this.Highlight = function () {
        if (this.highlight && this.container && this.container.highlight) {
            this.class = this.class.replace(" highlight", "");
            this.class = this.class.replace(" even", "");
            this.class = this.class.replace(" odd", "");
            this.container.object.children("." + this.class).removeClass("highlight");
            this.object.addClass("highlight");
        }
    };

    this.SetText = function (text) {
        this.textobject.text(text);
    };

    this.SetIcon = function (icon) {
        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + icon);
    };

    this.Reset = function () {
        this.textobject.text(this.text);

        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + this.icon);

        this.event = this.eventbackup;
    };
};

uiframework.ToolbarText = function (text) {
    uiframework.Base.call(this);

    this.class = "toolbar-text";

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    this.alignment = ALIGNMENT.LEFT;

    this.Load = function (parent) {
        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var _class = this.class;

        switch (this.alignment) {
            case ALIGNMENT.LEFT:
                this.class += " align-left";
                break;

            case ALIGNMENT.MIDDLE:
                this.class += " align-middle";
                break;

            case ALIGNMENT.RIGHT:
                this.class += " align-right";
                break;
        }

        var content = this.GenerateContainer();

        this.class = _class;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var caption = "<span class='top'>" + this.text + "</span>";
            var text = "<span id='" + this.id + "_text'>" + caption + "</span>";

            object.append(text);

            //Set the object
            this.object = object;
        }
    };

    this.SetText = function (text) {
        this.textobject.text(text);
    };

    this.SetIcon = function (icon) {
        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + icon);
    };

    this.Reset = function () {
        this.textobject.text(this.text);

        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + this.icon);

        this.event = this.eventbackup;
    };
};

uiframework.ToolbarSeparator = function () {
    uiframework.Base.call(this);

    this.class = "toolbar-separator";

    this.Load = function (parent) {
        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (parent !== undefined)
            this.parent = parent;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);
            object.html("");

            //Set the object
            this.object = object;
        }
    };
};

uiframework.ToolbarAppButton = function (icon, text) {
    uiframework.ToolbarButton.call(this);

    this.class = "toolbar-button appname";

    this.icon = icon;
    this.icononly = true;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";
};

uiframework.ToolbarMainButton = function (icon, text, bottom, items) {
    uiframework.Base.call(this);

    this.class = "toolbar-button appname";
    this.icon = icon;
    this.event;
    this.rightitems = items;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    this.bottom = bottom;
    this.icononly = false;

    this.alignment = ALIGNMENT.LEFT;

    this.Load = function (parent) {
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var _class = this.class;

        switch (this.alignment) {
            case ALIGNMENT.LEFT:
                this.class += " align-left";
                break;

            case ALIGNMENT.MIDDLE:
                this.class += " align-middle";
                break;

            case ALIGNMENT.RIGHT:
                this.class += " align-right";
                break;
        }

        var content = this.GenerateContainer();

        this.class = _class;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            var text;

            if (this.icon !== undefined && this.icon !== "")
                icon = "<i id='" + this.id + "_icon' class='fa fa-" + this.icon + "'></i>";

            if (this.text.indexOf(".png") !== -1 || this.text.indexOf(".jpg") !== -1) {
                text = "<span id='" + this.id + "_text'><img src='" + this.text + "'/></span>";

            } else {
                var caption = "<span class='top'>" + this.text + "</span>";

                if (this.bottom !== undefined)
                    caption += "<span class='bottom'>" + this.bottom + "</span>";

                if (this.rightitems && this.rightitems.length !== 0)
                    var size = 100 + this.rightitems.length * 50;
                else
                    var size = 100;

                text = "<span id='" + this.id + "_text' style='width: calc(100% - " + size + "px)'>" + caption + "</span>";
            }

            object.append(icon + text);

            //Set the object
            this.object = object;
            this.iconobject = $("#" + this.id + "_icon");
            this.iconobject.original = true;
            this.textobject = $("#" + this.id + "_text");

            if (this.icononly) {
                this.ClickEventNumber(this, this.iconobject, function (parent, sender) {
                    if (!parent.original) {
                        if ($NAVIGATION !== undefined) {
                            $NAVIGATION.stack.pop();
                            $NAVIGATION.stack.pop();
                        }
                    }

                    if (parent.event !== undefined)
                        parent.event(parent, sender);
                });
            } else {
                this.ClickEventNumber(this, this.object, function (parent, sender) {
                    if (!parent.iconobject.original) {
                        if ($NAVIGATION !== undefined) {
                            $NAVIGATION.stack.pop();
                            $NAVIGATION.stack.pop();
                        }
                    }

                    if (parent.event !== undefined)
                        parent.event(parent, sender);
                });
            }
        }
    };

    this.SetText = function (text) {
        text = text.replace("<br/>", " ");

        if (text.indexOf(".png") !== -1 || text.indexOf(".jpg") !== -1)
            this.textobject.html("<img src='" + text + "'/>");
        else
            this.textobject.html(text);
    };

    this.SetIcon = function (icon) {
        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + icon);
        this.iconobject.original = false;
    };

    this.Reset = function () {
        this.SetText(this.text);
        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + this.icon);
        this.iconobject.original = true;

        this.event = this.eventbackup;
    };
};

uiframework.ToolbarSearch = function (text) {
    uiframework.Base.call(this);

    var self = this;

    this.class = "toolbar-search";
    this.event;
    this.showcancel = false;
    this.loaded = false;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    this.Load = function (parent) {
        this.loaded = true;
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var _class = this.class;
        var content = this.GenerateContainer();

        this.class = _class;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);
            var showcancel = "";

            if (this.showcancel)
                showcancel = " show-cancel";

            var text = "<div id='" + this.id + "_text' class='toolbar-search-input" + showcancel + "'><input class='toolbar-input' type='text' placeholder='Search' value='" + this.text + "'/></div>";

            if (this.showcancel)
                text += "<div id='global-search-cancel' class='button'>Cancel</div>";

            object.append(text);

            var reference = this;

            //Set the object
            this.object = object;
            this.textobject = $("#" + this.id + "_text .toolbar-input");
            this.inputobject = $("#" + this.id + "_text");

            var cancel = $("#global-search-cancel");

            this.ClickEventNumber(this, cancel, function (parent, sender) {
                if (parent.cancelevent)
                    parent.cancelevent();

                parent.Dispose();
            });

            this.textobject.focus(function () {
                $ONSEARCH = true;
            });

            this.textobject.blur(function () {
                $ONSEARCH = false;
            });

            this.textobject.keypress(function (e) {
                if (e.which === 13) {
                    var val = $(this).val();

                    if (reference.event)
                        reference.event(reference.parent, reference, val);
                }
            });

            this.textobject.on("change paste keyup", function () {
                var val = $(this).val();

                if (val.trim() !== "") {
                    var x = reference.inputobject.children(".fa");

                    if (x.length === 0) {
                        reference.inputobject.append("<i class='fa fa-times'></i>");

                        x = reference.inputobject.children(".fa");

                        reference.ClickEventNumber(this, x, function (parent, sender) {
                            if (x.length !== 0)
                                x.remove();

                            reference.textobject.val("");
                            val = "";

                            if (reference.event)
                                reference.event(reference.parent, reference, val);
                        });
                    }

                } else {
                    var x = reference.inputobject.children(".fa");

                    if (x.length !== 0)
                        x.remove();
                }

                $ONSEARCH = reference.loaded;
                reference.loaded = false;
            });
        }
    };

    this.SetText = function (text) {
        self.textobject.val(text);

        if (!text)
            self.inputobject.children(".fa").remove();
    }
};

uiframework.GlobalSearch = function (text) {
    uiframework.ToolbarSearch.call(this);

    this.class += " global-search";
};

uiframework.Drawer = function (text) {
    uiframework.Base.call(this);

    this.class = "drawer drawer-hide";
    this.location = DRAWERLOCATION.LEFT;
    this.modalid = "";
    this.text = text;
    this.animate = false;

    if (uiframework.mobile)
        this.size = 320;
    else
        this.size = 340;

    this.Load = function () {
        if (this.parent.append !== undefined) {
            //Disable background scrolling
            $('.grid > .container').css('overflow-y', 'hidden');

            if (this.animate) {
                if (this.location === DRAWERLOCATION.LEFT)
                    this.class = "drawer drawer-hide";
                else
                    this.class = "drawer drawer-hide-right";

            } else {
                if (this.location === DRAWERLOCATION.LEFT)
                    this.class = "drawer";
                else
                    this.class = "drawer slide-right-show";
            }

            this.modalid = _modal++;

            var content = "<div id='modal" + this.modalid + "' class='modal'></div>";
            content += this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);
            content = "<div class='drawer-header'>" + this.text + "<div data-attribute='" + this.datainfo + "-close' class='drawer-close'><i class='fa fa-times-circle-o btn-close'></i></div></div><div class='container'></div>";
            object.append(content);

            //Set the object
            this.object = object;

            var container = $("#" + this.id + " .container");

            //Load each of the items
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].Show(container);
            }

            var modal = $("#modal" + this.modalid);
            modal.addClass("opacity-show");

            var close = $("#" + this.id + " .drawer-close");

            this.ClickEventNumber(this, modal, this.Close);
            this.ClickEventNumber(this, close, this.Close);

            this.Resize();
            this.Display();
        }
    };

    this.Resize = function () {
        var top = 56;

        if (window.innerWidth < 380)
            this.size = window.innerWidth;
        else
            this.size = 340;

        if (this.location === DRAWERLOCATION.LEFT)
            this.object.css({ left: common.left, top: top + common.top, bottom: 0, width: this.size });
        else
            this.object.css({ right: common.right, top: top + common.top, bottom: 0, width: this.size });
    };

    this.Display = function () {
        var parent = this;

        var timer = setTimeout(function () {
            if (parent.location === DRAWERLOCATION.LEFT)
                parent.object.addClass("slide-left-show");
            else
                parent.object.addClass("slide-right-show");

            clearTimeout(timer);
        }, 1);
    };

    this.Dispose = function () {
        var parent = this;

        //Allow background scrolling
        $('.grid > .container').css('overflow-y', 'scroll');

        if (parent.location === DRAWERLOCATION.LEFT) {
            if (parent.object !== undefined) {
                if (this.animate) {
                    parent.object.removeClass("slide-left-show");
                    parent.object.addClass("slide-left-hide");

                    var timer = setTimeout(function () {
                        if (parent.object !== undefined) {
                            parent.object.unbind();
                            parent.object.remove();
                        }

                        for (var i = 0; i < parent.items.length; i++)
                            parent.items[i].Dispose();

                        parent.items = [];

                        $("#modal" + parent.modalid).remove();

                        clearTimeout(timer);
                    }, 250);

                } else {
                    if (parent.object !== undefined) {
                        parent.object.unbind();
                        parent.object.remove();
                    }

                    for (var i = 0; i < parent.items.length; i++)
                        parent.items[i].Dispose();

                    parent.items = [];

                    $("#modal" + parent.modalid).remove();
                }
            }
        } else {
            if (parent.object !== undefined) {
                parent.object.unbind();
                parent.object.remove();
            }

            for (var i = 0; i < parent.items.length; i++)
                parent.items[i].Dispose();

            parent.items = [];

            $("#modal" + parent.modalid).remove();
        }
    };

    this.Close = function (parent, sender) {
        //Allow background scrolling
        $('.grid > .container').css('overflow-y', 'scroll');

        var modal = $("#modal" + parent.modalid);

        if ($NAVIGATION !== undefined) {
            $NAVIGATION.stack.pop();
            $NAVIGATION.stack.pop();
        }

        if (this.animate) {
            if (parent.location === DRAWERLOCATION.LEFT) {
                parent.object.removeClass("slide-left-show");
                parent.object.addClass("slide-left-hide");
            } else {
                parent.object.removeClass("slide-right-show");
                parent.object.addClass("slide-right-hide");
            }

            modal.removeClass("opacity-show");
            modal.addClass("opacity-hide");

            var timer = setTimeout(function () {
                if (parent.location === DRAWERLOCATION.LEFT)
                    parent.object.removeClass("slide-left-hide");
                else
                    parent.object.removeClass("slide-right-hide");

                if (parent.closeevent !== undefined)
                    parent.closeevent(parent, sender);

                if (parent.object !== undefined) {
                    parent.object.unbind();
                    parent.object.remove();
                }

                for (var i = 0; i < parent.items.length; i++)
                    parent.items[i].Dispose();

                parent.items = [];

                clearTimeout(timer);
            }, 250);

        } else {
            if (parent.location === DRAWERLOCATION.LEFT)
                parent.object.removeClass("slide-left-hide");
            else
                parent.object.removeClass("slide-right-hide");

            if (parent.closeevent !== undefined)
                parent.closeevent(parent, sender);

            if (parent.object !== undefined) {
                parent.object.unbind();
                parent.object.remove();
            }

            for (var i = 0; i < parent.items.length; i++)
                parent.items[i].Dispose();

            parent.items = [];
        }
    };
};

uiframework.ListButton = function (icon, text) {
    uiframework.ToolbarButton.call(this);

    this.class = "list-button";
    this.icon = icon;
    this.event;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";
};

uiframework.FlowList = function (text) {
    uiframework.Base.call(this);

    this.class = "flow-list collapse";
    this.class_ = "flow-list";
    this.expand = false;
    this.highlight = true;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    this.Load = function (parent) {
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;
        var _class = this.class;

        switch (this.alignment) {
            case ALIGNMENT.LEFT:
                this.class += " align-left";
                break;

            case ALIGNMENT.MIDDLE:
                this.class += " align-middle";
                break;

            case ALIGNMENT.RIGHT:
                this.class += " align-right";
                break;
        }

        var content = this.GenerateContainer();
        this.class = _class;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            if (this.icon !== undefined && this.icon !== "")
                icon = "<i id='" + this.id + "_icon' class='fa fa-" + this.icon + "'></i>";

            if (this.text) {
                var text = "<div id='" + this.id + "_text' class='flow-list-label'>" + this.text + "</div>";

                if (this.items[0] !== undefined && this.items[0].items !== undefined && this.items[0].items.length !== 0)
                    text += "<i id='" + this.id + "_expand' class='flow-list-expand fa fa-angle-down'></i>";

                object.append(icon + text);
            } else
                object.append(icon);

            //Set the object
            this.object = object;
            this.expandobject = $("#" + this.id + "_expand");

            //Load each of the items
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] !== undefined && this.items[i].items !== undefined && this.items[i].items.length !== 0)
                    this.items[i].Load(this.object);
            }

            this.ClickEventNumber(this, this.object, function (parent, sender) {
                if (parent.expand) {
                    parent.expand = false;
                    parent.object.addClass("collapse");
                    parent.expandobject.removeClass("fa-angle-up");
                    parent.expandobject.addClass("fa-angle-down");

                } else {
                    parent.expand = true;
                    parent.object.removeClass("collapse");
                    parent.expandobject.removeClass("fa-angle-down");
                    parent.expandobject.addClass("fa-angle-up");
                }

                if (parent.highlight && parent.container && parent.container.highlight) {
                    parent.class = parent.class.replace(" highlight", "");
                    parent.class = parent.class.replace(" even", "");
                    parent.class = parent.class.replace(" odd", "");
                    parent.class = parent.class.replace(" collapse", "");
                    parent.container.object.children("." + parent.class).removeClass("highlight");
                    parent.object.addClass("highlight");
                }

                if (parent.event !== undefined)
                    parent.event(parent, sender);
            }, true);
        }
    };

    this.Highlight = function () {
        if (this.highlight && this.container && this.container.highlight) {
            this.class = this.class.replace(" highlight", "");
            this.class = this.class.replace(" even", "");
            this.class = this.class.replace(" odd", "");
            this.container.object.children("." + this.class_).removeClass("highlight");
            this.object.addClass("highlight");
        }
    };
};

uiframework.FormTable = function (text) {
    uiframework.Base.call(this);

    this.class = "form-table";
    this.rows = [];
    this.event;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";


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

            //table
            content += "<table>";

            for (var i = 0; i < this.rows.length; i++) {
                if (typeof this.rows[i] === 'uiframework.FormTableHeader' || i === 0) {
                    content += "<tr>";
                    for (var j = 0; j < this.rows[i].text.length; j++) {
                        content += "<td id='" + i + "-" + j + "' class='form-table-header'>" + this.rows[i].text[j] + "</td>";
                    }
                    content += "</tr>";
                } else {
                    content += "<tr>";
                    for (var j = 0; j < this.rows[i].text.length; j++) {
                        content += "<td id='" + i + "-" + j + "' class='form-table-row'>" + this.rows[i].text[j] + "</td>";
                    }
                    content += "</tr>";
                }
            }

            content += "</table>";

            object.append(content);

        }
    };
};

uiframework.FormTableHeader = function (text) {
    uiframework.Base.call(this);

    this.class = "form-table-header";
    this.event;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";
};

uiframework.FormTableRow = function (text) {
    uiframework.Base.call(this);

    this.class = "form-table-row";
    this.event;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";
};

uiframework.ListUser = function (icon, text, isimage) {
    uiframework.Base.call(this);

    this.class = "list-user";
    this.icon = icon;
    this.event;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    if (isimage === undefined)
        this.isimage = false;
    else
        this.isimage = isimage;

    if (this.isimage)
        this.class += " back-image";

    this.Load = function (parent) {
        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            var iconerr = "if(this.src!=\"icons/default.png\")this.src=\"icons/default.png\";";

            if (this.icon !== undefined && this.icon !== "")
                if (!this.isimage)
                    icon = "<i id='" + this.id + "_icon' class='fa fa-" + this.icon + "'></i>";
                else
                    icon = "<div class='drawer-image'><img id='" + this.id + "_icon' src='icons/" + this.icon + "' onerror='" + iconerr + "'/></div>";

            var caption = "<span class='top'>" + this.text + "</span>";
            var text = "<span id='" + this.id + "_text'>" + caption + "</span>";

            if (this.isimage) {
                object.append(icon + text);
            } else {
                var background = "<div class='user-circle-1'><div class='user-circle-2'><div class='user-circle-3'></div></div></div>";
                object.append(icon + text + background);
            }
        }
    };
};

uiframework.ListThumbnail = function (icon, text, isimage) {
    uiframework.Base.call(this);

    this.class = "list-thumbnail";
    this.icon = icon;
    this.event;
    this.showtext = true;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    if (isimage === undefined)
        this.isimage = false;
    else
        this.isimage = isimage;

    this.alignment = ALIGNMENT.LEFT;

    this.Load = function (parent) {
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var _class = this.class;

        switch (this.alignment) {
            case ALIGNMENT.LEFT:
                this.class += " align-left";
                break;

            case ALIGNMENT.MIDDLE:
                this.class += " align-middle";
                break;

            case ALIGNMENT.RIGHT:
                this.class += " align-right";
                break;
        }

        var content = this.GenerateContainer();

        this.class = _class;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            var iconerr = "if(this.src!=\"icons/default.png\")this.src=\"icons/default.png\";";

            if (this.icon !== undefined && this.icon !== "")
                if (!this.isimage)
                    icon = "<i id='" + this.id + "_icon' class='fa fa-" + this.icon + "'></i>";
                else
                    icon = "<div class='thumbnail-image'><img id='" + this.id + "_icon' src='icons/" + this.icon + "' onerror='" + iconerr + "'/></div>";

            if (this.showtext) {
                var text = "<span id='" + this.id + "_text'>" + this.text + "</span>";
                object.append(icon + text);
            } else {
                object.append(icon);
            }

            //Set the object
            this.object = object;
            this.iconobject = $("#" + this.id + "_icon");
            this.textobject = $("#" + this.id + "_text");

            this.ClickEventNumber(this, this.object, function (parent, sender) {
                if (parent.event !== undefined)
                    parent.event(parent, sender);
            });
        }
    };

    this.SetText = function (text) {
        this.textobject.text(text);
    };

    this.SetIcon = function (icon) {
        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + icon);
    };

    this.Reset = function () {
        this.textobject.text(this.text);

        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + this.icon);

        this.event = this.eventbackup;
    };
};

uiframework.DetailThumbnail = function (icon, text, isimage, details) {
    uiframework.Base.call(this);

    this.class = "detail-thumbnail";
    this.icon = icon;
    this.event;
    this.details = details;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    if (isimage === undefined)
        this.isimage = false;
    else
        this.isimage = isimage;

    this.Load = function (parent) {
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            //var iconerr = "if(this.src!=\"icons/default.png\")this.src=\"icons/default.png\";";

            icon += "<div class='text' id='" + this.id + "_text'>" + this.text + "</div>";
            icon += "<div class='thumbnail-image'><img id='" + this.id + "_icon' src='icons/" + this.icon + "'/></div>";
            icon += "<div class='detail'>" + this.details + "</div>";

            object.append(icon);

            //Set the object
            this.object = object;

            this.ClickEventNumber(this, this.object, function (parent, sender) {
                if (parent.event !== undefined)
                    parent.event(parent, sender);
            });
        }
    };
};

uiframework.ActivityThumbnail = function (icon, text, subjecttitle, isimage) {
    uiframework.Base.call(this);

    this.class = "activity-thumbnail";
    this.icon = icon;
    this.event;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    if (subjecttitle !== undefined)
        this.subjecttitle = subjecttitle;
    else
        this.subjecttitle = "";

    if (isimage === undefined)
        this.isimage = false;
    else
        this.isimage = isimage;

    this.Load = function (parent) {
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            var iconerr = "if(this.src!=\"icons/default.png\")this.src=\"icons/default.png\";";

            icon += "<div class='thumbnail-image'><img id='" + this.id + "_icon' src='icons/" + this.icon + "' onerror='" + iconerr + "'/></div>";
            icon += "<div class='text' id='" + this.id + "_text'>" + this.text + "</div>";
            if (this.subjecttitle !== "")
                icon += "<div class='subject-title' id='" + this.id + "_text'>" + this.subjecttitle + "</div>";

            object.append(icon);

            //Set the object
            this.object = object;

            this.ClickEventNumber(this, this.object, function (parent, sender) {
                if (parent.event !== undefined)
                    parent.event(parent, sender);
            });
        }
    };
};

uiframework.AppThumbnail = function (icon, text, isimage) {
    uiframework.Base.call(this);

    this.class = "list-thumbnail app-thumbnail";
    this.icon = icon;
    this.event;

    if (text !== undefined)
        this.text = text;
    else
        this.text = "";

    if (isimage === undefined)
        this.isimage = false;
    else
        this.isimage = isimage;

    this.alignment = ALIGNMENT.LEFT;

    this.Load = function (parent) {
        this.eventbackup = this.event;

        if (this.parent === undefined)
            this.parent = parent;

        //Generate div container with id and class
        var _class = this.class;

        switch (this.alignment) {
            case ALIGNMENT.LEFT:
                this.class += " align-left";
                break;

            case ALIGNMENT.MIDDLE:
                this.class += " align-middle";
                break;

            case ALIGNMENT.RIGHT:
                this.class += " align-right";
                break;
        }

        var content = this.GenerateContainer();

        this.class = _class;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            var icon = "";
            if (this.icon !== undefined && this.icon !== "")
                if (!this.isimage)
                    icon = "<i id='" + this.id + "_icon' class='fa fa-" + this.icon + "'></i>";
                else
                    icon = "<div class='thumbnail-image'><img id='" + this.id + "_icon' src='icons/" + this.icon + "'/></div>";

            var text = "<span id='" + this.id + "_text'>" + this.text + "</span>";
            object.append(icon + text);

            //Set the object
            this.object = object;
            this.iconobject = $("#" + this.id + "_icon");
            this.textobject = $("#" + this.id + "_text");

            this.ClickEventNumber(this, this.object, function (parent, sender) {
                if (parent.event !== undefined)
                    parent.event(parent, sender);
            });
        }
    };

    this.SetText = function (text) {
        this.textobject.text(text);
    };

    this.SetIcon = function (icon) {
        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + icon);
    };

    this.Reset = function () {
        this.textobject.text(this.text);

        this.iconobject.removeClass();
        this.iconobject.addClass("fa fa-" + this.icon);

        this.event = this.eventbackup;
    };
};

uiframework.DetailedList = function (top, bottom, listobject, icon, image) {
    uiframework.Base.call(this);

    this.class = "property-detail";

    //Set name
    this.listobject = listobject;
    this.event;
    this.icon = icon;
    this.image = image;

    this.top = top;
    this.bottom = bottom;
    this.selected;

    this.Load = function (parent) {
        var id = "container" + _counter++;

        var icon = "";
        var hasicon = "";

        if (this.icon !== undefined && this.icon !== "") {
            icon = "<i class='fa fa-" + this.icon + "'></i>";
            hasicon = " detail-icon";
        } else if (this.image !== undefined && this.image !== "") {
            icon = "<img src='" + this.image + "'/>";
            hasicon = " detail-image";
        }

        var content;

        if (this.selected)
            content = "<div id='" + id + "' class='detail-list-item detail-list-item-selected pointer" + hasicon + "'>" + icon;
        else
            content = "<div id='" + id + "' class='detail-list-item pointer" + hasicon + "'>" + icon;

        content += "<div class='detail-top'>" + this.top + "</div><div class='detail-bottom'>" + this.bottom + "</div></div>";

        parent.append(content);

        var object = $("#" + id);

        this.parent = parent;
        this.object = object;
        this.topobject = $("#" + id + " .detail-top");
        this.bottomobject = $("#" + id + " .detail-bottom");

        this.ClickEventNumber(this, object, this.Selected);
    };

    this.Selected = function (parent, sender) {
        var child = $(parent.parent).children();

        child.removeClass("detail-list-item-selected");
        $(parent.object).addClass("detail-list-item-selected");

        if (parent.event !== undefined)
            parent.event(parent, sender);
    };
};

uiframework.NumericPad = function (value, min, max) {
    uiframework.Base.call(this);

    var self = this;

    this.class = "numericpad";
    this.value = value.toString();
    this.event;
    this.okevent;
    this.showok = false;
    this.start = true;
    this.showperiod = true;
    this.shownegative = false;
    this.min = min;
    this.max = max;
    this.tokens = [];
    this.unit;

    this.operatorpressed = false;

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

            //Numberic pad
            if (this.unit)
                content = "<div id='numericpad' class='numericpad-value'><div class='value'>" + this.value + "</div><div class='unit'>" + this.unit + "</div></div>";
            else
                content = "<div id='numericpad' class='numericpad-value'><div class='value'>" + this.value + "</div></div>";

            content += "<table>";

            content += "<tr><td id='num-7'>7</td><td id='num-8'>8</td><td id='num-9'>9</td><td id='num-back' class='special-key'><i class='fa fa-chevron-left'></i></td></tr>";
            content += "<tr><td id='num-4'>4</td><td id='num-5'>5</td><td id='num-6'>6</td><td id='num-clear' class='special-key'>C</td></tr>";

            if (this.shownegative)
                content += "<tr><td id='num-1'>1</td><td id='num-2'>2</td><td id='num-3'>3</td><td id='num-neg' class='special-key'>±</td></tr>";
            else
                content += "<tr><td id='num-1'>1</td><td id='num-2'>2</td><td id='num-3'>3</td><td class='empty-key'></td></tr>";

            var period;

            if (this.showperiod)
                period = "<td id='num-point'>.</td>";
            else
                period = "<td class='empty-key'></td>";

            if (this.showok)
                content += "<tr><td id='num-0'>0</td>" + period + "<td class='empty-key'></td><td id='num-ok' class='special-key button-ok'>OK</td></tr>";
            else
                content += "<tr><td id='num-0'>0</td>" + period + "<td class='empty-key'></td><td class='empty-key'></td></tr>";

            content += "</table>";

            if (this.min !== undefined) {
                var min = this.min;
                var max = this.max;

                if (this.showperiod) {
                    min = uiframework.settings.Format(this.min);
                    max = uiframework.settings.Format(this.max);
                }

                content += "<div class='limit'>" + min + " - " + max + "</div>";
            }

            object.append(content);

            var numbers;
            this.numpadobject = $("#numericpad .value");

            for (var i = 0; i < 10; i++) {
                numbers = $("#num-" + i);

                this.ClickEventNumber(this, numbers, function (parent, sender) {
                    var value = sender.html();

                    if (parent.start || parent.value === "0") {
                        parent.start = false;
                        parent.value = value;
                    } else
                        parent.value += value;

                    parent.numpadobject.text(parent.value);

                    if (parent.event !== undefined)
                        parent.event(Number(parent.value));

                    self.Refresh();
                });
            }

            numbers = $("#num-back");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                var value = parent.value.toString();
                parent.value = value.substring(0, value.length - 1);
                parent.start = false;

                if (parent.value === "" || parent.value === "-")
                    parent.value = "0";

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Number(parent.value));

                self.Refresh();
            });

            numbers = $("#num-point");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                if (parent.start) {
                    parent.value = "0.";
                    parent.start = false;
                } else
                    parent.value += ".";

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Number(parent.value));

                self.Refresh();
            });

            numbers = $("#num-clear");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                parent.value = "0";

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Number(parent.value));

                self.Refresh();
            });

            numbers = $("#num-ok");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                parent.numpadobject.text(parent.value);

                if (parent.okevent !== undefined)
                    parent.okevent(parent, sender);

                uiframework.onnumericpad = false;

                self.Refresh();
            });

            numbers = $("#num-neg");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                var value = parseFloat(parent.value);

                if (value > 0) {
                    parent.value = -Math.abs(parent.value);
                } else {
                    parent.value = Math.abs(parent.value);
                }

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Number(parent.value));

                self.Refresh();
            });
        }
    };

    this.Refresh = function () {
        var input = $("#numericpad");
        input.empty();

        if (self.unit)
            input.append("<div class='value'>" + self.value + "</div><div class='unit'>" + self.unit + "</div>");
        else
            input.append("<div class='value'>" + self.value + "</div>");
    };
};

uiframework.CalculatorPad = function (value, min, max) {
    uiframework.Base.call(this);

    var self = this;

    this.class = "numericpad";
    this.value = value.toString();
    this.event;
    this.okevent;
    this.showok = false;
    this.start = true;
    this.showperiod = true;
    this.shownegative = false;
    this.min = min;
    this.max = max;
    this.tokens = [];
    this.unit;
    this.numpointactive = false;

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

            //Numberic pad
            if (this.unit)
                content = "<div id='numericpad' class='numericpad-value'><div class='value'>" + this.value + "</div><div class='unit'>" + this.unit + "</div></div>";
            else
                content = "<div id='numericpad' class='numericpad-value'><div class='value'>" + this.value + "</div></div>";

            content += "<table>";

            content += "<tr><td id='num-7'>7</td><td id='num-8'>8</td><td id='num-9'>9</td><td id='num-divide' class='operator-key'>÷</td></tr>";
            content += "<tr><td id='num-4'>4</td><td id='num-5'>5</td><td id='num-6'>6</td><td id='num-multiply' class='operator-key'>×</td></tr>";
            content += "<tr><td id='num-1'>1</td><td id='num-2'>2</td><td id='num-3'>3</td><td id='num-subtract' class='operator-key'>-</td></tr>";
            content += "<tr><td id='num-0'>0</td><td id='num-point'>.</td><td id='num-back' class='special-key'><i class='fa fa-chevron-left'></i></td><td id='num-add' class='operator-key'>+</td></tr>";

            content += "</table>";

            if (this.min !== undefined) {
                var min = this.min;
                var max = this.max;

                if (this.showperiod) {
                    min = uiframework.settings.Format(this.min);
                    max = uiframework.settings.Format(this.max);
                }

                content += "<div class='limit'>" + min + " - " + max + "</div>";
            }

            object.append(content);

            var numbers;
            this.numpadobject = $("#numericpad .value");

            for (var i = 0; i < 10; i++) {
                numbers = $("#num-" + i);

                this.ClickEventNumber(this, numbers, function (parent, sender) {
                    var value = sender.html().toString();

                    if (parent.start || parent.value === "0") {
                        parent.start = false;
                        parent.value = value;
                    } else
                        parent.value += value;

                    parent.numpadobject.text(parent.value);

                    if (parent.event !== undefined)
                        parent.event(Evaluate(parent.value));

                    self.Refresh();
                });
            }

            numbers = $("#num-back");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                var value = parent.value.toString();

                parent.value = value.substring(0, value.length - 1);
                parent.start = false;

                if (parent.value === "" || parent.value === "-") {
                    parent.value = "0";
                    parent.start = true;
                }

                var mapping = parent.value.replace(/[-+×÷]/g, " ").split(" ");

                var lastitem = mapping[mapping.length - 1];

                if (lastitem === "") {
                    parent.numpointactive = false;
                } else {
                    lastitem = parseFloat(lastitem);

                    if (Number.isInteger(lastitem)) {
                        parent.numpointactive = false;
                    } else {
                        parent.numpointactive = true;
                    }
                }

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Evaluate(parent.value));

                self.Refresh();
            });

            var timer;

            numbers.on("touchstart", function (event) {
                timer = setTimeout(function () {
                    if (timer) {
                        self.value = "0";
                        self.numpadobject.text(self.value);

                        if (self.event !== undefined)
                            self.event(Evaluate(self.value));

                        self.Refresh();
                    }
                }, 750);
            }).on("touchend", function (event) {
                if (timer) {
                    timer = undefined;
                    clearTimeout(timer);
                }
            });

            numbers = $("#num-point");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                if (typeof parent.value === "number")
                    parent.value = parent.value.toString();

                var lastchar = parent.value[parent.value.length - 1];

                if (!parent.numpointactive) {
                    if (!parent.start) {
                        if (lastchar === "+" || lastchar === "-" || lastchar === "÷" || lastchar === "×") {
                            parent.value += "0.";
                        } else if (lastchar === ".") {

                        } else {
                            parent.value += ".";
                        }
                    } else {
                        parent.value = "0.";
                    }
                }

                parent.start = false;
                parent.numpointactive = true;

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Evaluate(parent.value));

                self.Refresh();
            });

            numbers = $("#num-clear");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                parent.value = "0";

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Evaluate(parent.value));

                self.Refresh();
            });

            numbers = $("#num-subtract");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                if (typeof parent.value === "number")
                    parent.value = parent.value.toString();

                var lastchar = parent.value[parent.value.length - 1];

                if (!parent.start) {
                    if (lastchar === "+" || lastchar === "-" || lastchar === "÷" || lastchar === "×" || lastchar === ".") {
                        parent.value = parent.value.slice(0, -1) + "-";
                    } else {
                        parent.value += "-";
                    }
                } else {
                    parent.value = "-";
                }

                parent.start = false;
                parent.numpointactive = false;

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Evaluate(parent.value));

                self.Refresh();
            });

            numbers = $("#num-add");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                if (typeof parent.value === "number")
                    parent.value = parent.value.toString();

                var lastchar = parent.value[parent.value.length - 1];

                if (!parent.start) {
                    if (lastchar === "+" || lastchar === "-" || lastchar === "÷" || lastchar === "×" || lastchar === ".") {
                        if (parent.value.length !== 1)
                            parent.value = parent.value.slice(0, -1) + "+";
                    } else {
                        parent.value += "+";
                    }

                    parent.start = false;
                    parent.numpointactive = false;
                }

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Evaluate(parent.value));

                self.Refresh();
            });

            numbers = $("#num-multiply");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                if (typeof parent.value === "number")
                    parent.value = parent.value.toString();

                var lastchar = parent.value[parent.value.length - 1];

                if (!parent.start) {
                    if (lastchar === "+" || lastchar === "-" || lastchar === "÷" || lastchar === "×" || lastchar === ".") {
                        if (parent.value.length !== 1)
                            parent.value = parent.value.slice(0, -1) + "×";
                    } else {
                        parent.value += "×";
                    }

                    parent.start = false;
                    parent.numpointactive = false;
                }

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Evaluate(parent.value));

                self.Refresh();
            });

            numbers = $("#num-divide");

            this.ClickEventNumber(this, numbers, function (parent, sender) {
                if (typeof parent.value === "number")
                    parent.value = parent.value.toString();

                var lastchar = parent.value[parent.value.length - 1];

                if (!parent.start) {
                    if (lastchar === "+" || lastchar === "-" || lastchar === "÷" || lastchar === "×" || lastchar === ".") {
                        if (parent.value.length !== 1)
                            parent.value = parent.value.slice(0, -1) + "÷";
                    } else {
                        parent.value += "÷";
                    }

                    parent.start = false;
                    parent.numpointactive = false;
                }

                parent.numpadobject.text(parent.value);

                if (parent.event !== undefined)
                    parent.event(Evaluate(parent.value));

                self.Refresh();
            });
        }
    };

    this.Refresh = function () {
        var input = $("#numericpad");
        input.empty();

        if (self.unit)
            input.append("<div class='value'>" + self.value + "</div><div class='unit'>" + self.unit + "</div>");
        else
            input.append("<div class='value'>" + self.value + "</div>");
    };

    function Evaluate(expression) {
        var lastchar = expression[expression.length - 1];

        if (lastchar === "+" || lastchar === "-" || lastchar === "÷" || lastchar === "×" || lastchar === ".") {
            expression = expression.slice(0, -1);
        }

        expression = expression.replace(/÷/g, "/");
        expression = expression.replace(/×/g, "*");

        if (expression === "" || expression === "0")
            parent.value = 0;
        else
            parent.value = math.eval(expression);

        return parent.value
    }
};

uiframework.ColorPad = function (value) {
    uiframework.Base.call(this);

    this.class = "colorpad";
    this.value = value.toString();
    this.event;
    this.okevent;
    this.showok = false;
    this.start = true;
    this.showperiod = true;

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

            var color = "";


            content = "<div id='" + this.id + "' class='colorpad'>";
            var counter = 0;

            for (var key in COLORS) {
                counter++;
                content += "<div id='" + this.id + "_" + counter + "'class='input-colorpad' style='background-color:" + COLORS[key].name + "; color:" + COLORS[key].name + "'>" + counter + "</div>";
            }

            content += "</div>";

            object.append(content);

            var numbers;
            this.numpadobject = $(".input-colorpad");

            this.ClickEventNumber(this, this.numpadobject, function (parent, sender, e) {
                var color = $(e.target).css("background-color");

                if (parent.okevent !== undefined)
                    parent.okevent(parent, sender, color);
            });
        }
    };
};

uiframework.Property = function () {
    this.class = "property";
    this.name;
    this.value;
    this.readonly = false;
    this.visible = true;
    this.events = [];
    this.reportable = true;
    this.onchangeevent;

    this.Show = function (parent) {
        this.Load(parent);
    };

    this.Load = function (parent) {
        if (parent === undefined) {
            if (!this.parent)
                parent = $("body");
            else
                parent = this.parent;
        }

        this.id = "container" + _counter++;

        var content;

        if (this.readonly) {
            if (this.visible)
                content = "<div id='" + this.id + "' class='" + this.class + " property-readonly'></div>";
            else
                content = "<div id='" + this.id + "' class='" + this.class + " property-readonly hidden'></div>";
        } else {
            if (this.visible)
                content = "<div id='" + this.id + "' class='" + this.class + "'></div>";
            else
                content = "<div id='" + this.id + "' class='" + this.class + " hidden'></div>";
        }

        parent.append(content);

        var object = $("#" + this.id);

        this.parent = parent;
        this.object = object;
        this.Generate(parent, object);
    };

    this.Dispose = function (parent) {
        if (this.object !== undefined) {
            this.object.unbind();
            this.object.remove();
        }

        var events = [];

        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i][0] !== parent)
                events.push(this.events[i]);
        }

        this.events = events;
    };

    this.SetValue = function (value) {
        this.value = value;
        this.DispatchEvents(value);
    };

    this.DispatchEvents = function (value) {
    };

    this.ClickEventNumber = function (parent, sender, event_, nocascade) {
        if (uiframework.mobile) {
            var trackingClick = false;
            var targetElement = null;
            var touchStartX = 0;
            var touchStartY = 0;
            var touchBoundary = 10;

            sender.unbind();

            sender.on("touchstart", function (event) {
                event.stopPropagation();

                trackingClick = true;
                targetElement = event.target;
                touchStartX = event.originalEvent.touches[0].pageX;
                touchStartY = event.originalEvent.touches[0].pageY;

                return true;
            });

            sender.on("touchmove", function (event) {
                event.stopPropagation();

                if (!trackingClick) {
                    return true;
                }

                // If the touch has moved, cancel the click tracking
                if (targetElement !== event.target ||
                    (Math.abs(event.originalEvent.changedTouches[0].pageX - touchStartX) > touchBoundary ||
                        (Math.abs(event.originalEvent.changedTouches[0].pageY - touchStartY) > touchBoundary))) {

                    trackingClick = false;
                    targetElement = null;
                }

                return true;
            });

            sender.on("touchend", function (event) {
                event.stopPropagation();

                if (trackingClick) {
                    trackingClick = false;

                    event_(parent, sender, event);
                }
            });

            sender.on("touchcancel", function (event) {
                event.stopPropagation();

                trackingClick = false;
                targetElement = null;
            });

            sender.click(function (e) {
                e.stopPropagation();
            });

        } else {
            sender.bind("click", function (e) {
                if (nocascade)
                    e.stopPropagation();

                event_(parent, sender, e);
            });
        }
    };

    //    this.ClickEventNumber = function (parent, sender, event_, nocascade) {
    //        sender.bind("click", function (e) {
    //            if (!uiframework.onnumericpad) {
    //                if (uiframework.allowclick) {
    //                    if (nocascade)
    //                        e.stopPropagation();
    //
    //                    event_(parent, sender, e);
    //
    //                } else
    //                    uiframework.allowclick = true;
    //            }
    //        });
    //
    //    };

    this.SetVisible = function (value) {
        if (value)
            $("#" + this.id).removeClass("hidden");
        else
            $("#" + this.id).addClass("hidden");

        this.visible = value;
    };
};

uiframework.PropertyContainer = function () {
    uiframework.Base.call(this);

    this.class = "property-container";

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        //Generate div container with id and class
        if (this.parent.append !== undefined) {
            //Add form container
            var content = this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Body
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].Load(this.object);
            }
        }
    };

    this.Resize = function () {
    };
};

uiframework.PropertyCategory = function (name, lefticon, righticon) {
    uiframework.Property.call(this);

    //Set name
    this.name = name;
    this.lefticon = lefticon;
    this.righticon = righticon;

    this.Load = function (parent) {
        this.Generate(parent);
    };

    this.Generate = function (parent) {
        var content;

        if (this.lefticon !== undefined) {
            if (this.visible)
                content = "<div class='property-category'><i class='left-icon fa fa-" + this.lefticon + "'></i>" + this.name;
            else
                content = "<div class='property-category hidden'><i class='left-icon fa fa-" + this.lefticon + "'></i>" + this.name;
        } else {
            if (this.visible)
                content = "<div class='property-category'>" + this.name;
            else
                content = "<div class='property-category hidden'>" + this.name;
        }

        if (this.righticon !== undefined)
            content += "<i class='right-icon fa fa-" + this.righticon + "'>" + "</div>";
        else
            content += "</div>";

        parent.append(content);

        var object = $(parent).children(" .property-category");

        if (this.event !== undefined)
            this.ClickEventNumber(this, object, this.event);
    };

    this.GenerateReport = function (pdf, status) {
        status.y += 20;

        pdf.setFontSize(14);
        pdf.setFontType('bold');
        pdf.text(status.x, status.y, this.name);

        pdf.setDrawColor(100, 100, 100);
        pdf.line(status.x, status.y + 10, status.x + status.w, status.y + 10);

        status.y += 35;
    };
};

uiframework.PropertyDouble = function (name, value, unit, min, max) {
    uiframework.Property.call(this);

    var self = this;

    this.name = name;
    this.value = value;
    this.equation;
    this.parameters;
    this.equations = [];
    this.equationlist = [];
    this.showequation = true;
    this.showindesign = true;
    this.ispercentage = false;
    this.remarks = "";
    this.remarklist = [];
    this.allownegative = false;
    this.min = min;
    this.max = max;
    this.roundlimit = true;
    this.showrange = false;
    this.data = name;
    this.editortitle;

    this.customformat;
    this.convert = true;

    if (unit !== undefined)
        this.unit = unit;

    this.SetValue = function (value) {
        this.value = value;

        if (this.convert) {
            if (this.min !== undefined && value < this.min)
                this.value = this.min;

            if (this.max !== undefined && value > this.max)
                this.value = this.max;
        } else {
            var min = this.min / this.unit.value.value;
            var max = this.max / this.unit.value.value;

            if (min !== undefined && value < min)
                this.value = min;

            if (max !== undefined && value > max)
                this.value = max;
        }

        this.DispatchEvents(value);

        if (this.event !== undefined)
            this.event(this, this);

        if (this.postevent !== undefined)
            this.postevent();

    };

    this.DisplayValue = function (report, server) {
        var value = this.value;
        if (this.unit !== undefined) {
            value *= this.unit.value.value;

            if (uiframework.settings !== undefined) {
                if (this.customformat)
                    value = this.customformat(value);
                else
                    value = uiframework.settings.Format(value);
            }

            if (report && this.unit.value.symbol)
                value += " " + this.unit.value.symbol;
            else if (server)
                value += " \\it\\" + this.unit.value.name;
            else
                value += " " + this.unit.value.name;

        }

        return value;
    };

    this.GetValue = function () {
        var value = this.value;

        if (this.unit !== undefined && common.useunitfactor)
            value *= this.unit.value.value;

        return value;
    };

    this.Refresh = function () {
        self._object_.empty();
        self.Generate(self._parent_, self._object_);
    };

    this.Generate = function (parent, object) {
        self._parent_ = parent;
        self._object_ = object;

        var content;

        if (!this.showindesign)
            return;

        var id = "container" + _counter++;

        if (this.unit !== undefined)
            content = "<div class='property-name has-unit'>" + this.name;
        else
            content = "<div class='property-name'>" + this.name;

        var value = this.value;

        if (uiframework.settings === undefined) {
            console.log("ERROR: No settings defined for uiframework.");
            console.log("ERROR: Add in app.Initialize - uiframework.settings = this.model.settings;");
        }

        var leftunit = "";
        var rightunit = "";

        if (this.unit !== undefined && this.unit.value !== undefined) {
            value *= this.unit.value.value;

            if (uiframework.settings !== undefined) {
                if (this.customformat)
                    value = this.customformat(value);
                else
                    value = uiframework.settings.Format(value);
            } else
                value + "<span class='error'>E</span>";

            if (uiframework.settings === undefined || (!uiframework.settings.displayunit || uiframework.settings.displayunit.value.value === DISPLAYUNIT.LEFT.value)) {
                if (this.unit.value.name === "")
                    leftunit = "<div id='property_unit_left_" + id + "' class='property-unit-left' id='" + this.data + "_name'>&nbsp;</div>";
                else
                    leftunit = "<div id='property_unit_left_" + id + "' class='property-unit-left' id='" + this.data + "_name'>" + this.unit.value.name + "</div>";
            } else if (uiframework.settings !== undefined || (!uiframework.settings.displayunit || uiframework.settings.displayunit.value.value === DISPLAYUNIT.RIGHT.value))
                rightunit = "<div id='property_unit_right_" + id + "' class='property-unit-right' id='" + this.data + "_name'>" + this.unit.value.name + "</div>";

        } else {
            if (uiframework.settings !== undefined) {
                if (this.customformat)
                    value = this.customformat(value);
                else
                    value = uiframework.settings.Format(value);
            } else
                value += "<span class='error'>E</span>";
        }

        if (this.ispercentage)
            value += "%";

        content += leftunit;
        content += "</div>";

        if (this.readonly) {
            if (this.unit !== undefined) {
                if (rightunit !== "")
                    content += "<div class='property-value property-readonly property-has-unit property-has-right-unit'>" + value + rightunit + "</div>";
                else {
                    if (this.remarks === undefined || this.remarks === "")
                        content += "<div class='property-value property-readonly property-has-unit' id='" + id + "'>" + value + "</div>";
                    else {
                        if (Array.isArray(this.remarklist) && this.remarklist.length > 1) {
                            content += "<div class='property-value property-readonly property-has-unit property-remarks'>" + this.remarks + " <i id='" + this.id + "-remarklist' class='combobox-editor pointer fa fa-bars'></i></div>";
                        } else {
                            content += "<div class='property-value property-readonly property-has-unit property-remarks'>" + this.remarks + "</div>";
                        }

                    }
                }
            } else
                content += "<div class='property-value property-readonly'>" + value + "</div>";
        } else {
            if (this.unit !== undefined) {
                if (rightunit !== "")
                    content += "<div class='property-value property-input property-has-unit property-has-right-unit' id='" + this.data + "_value'><span id='" + id + "'>" + value + "</span>" + rightunit + "</div>";
                else
                    content += "<div class='property-value property-input property-has-unit' id='" + this.data + "_value'><span id='" + id + "'>" + value + "</span></div>";
            } else
                content += "<div class='property-value property-input' id ='" + this.data + "_value'><span id='" + id + "'>" + value + "</span></div>";

        }

        object.append(content);

        var input = $("#" + this.id + " .property-input");
        //range = $("#" + this.id + " .range");

        var contentobject = $("#" + id);

        this.object = contentobject;
        //this.range = range;
        this.contentid = id;

        this.events.push([parent, function (object, value) {
            object.val(value);
        }, contentobject]);

        this.ClickEventNumber(this, input, this.ShowEditor);

        this.unitleft = $("#property_unit_left_" + id);
        this.unitright = $("#property_unit_right_" + id);

        var remarklistbutton = $("#" + this.id + "-remarklist");
        remarklistbutton.click(this.remarklist, function (e) {
            var remarklist = e.data;
            var form = new uiframework.Form("Remarks");
            form.showclose = false;
            form.showfooter = false;
            form.height = 46 + (46 * remarklist.length);

            var list;
            for (var remark in remarklist) {
                remark = remarklist[remark];
                list = new uiframework.PropertyListItem(remark, false, false);
                form.Add(list);
            }

            form.Show();
            form.CenterPosition();
            form.closeevent = function () {
                this.Dispose();
            };
        });

    };

    this.GenerateEquation = function () {
        var prefix = "";
        this.equations = [];

        if (this.equation !== undefined) {
            prefix = "$$" + this.symbol + " = ";

            if (this.showequation) {
                this.equations.push(prefix + reporting.FormatString(this.equation, this.nameparam) + "$$");
                this.equations.push(prefix + reporting.FormatString(this.equation, this.valueparam) + "$$");
            }
            this.equations.push(reporting.FormatString('$${0}=\\text"{1}"$$', [this.symbol, this.DisplayValue(true)]));
        }

        var eq = this.equationlist;

        if (this.remarklist.length > 0) {
            for (var i = 0; i < this.remarklist.length; i++) {
                this.equations.push(reporting.FormatString("• {0}", [this.remarklist[i]]));
            }
        }

        if (eq.length !== 0) {

            for (var i = 0; i < eq.length; i++) {
                prefix = "$$" + eq[i].symbol + " = ";

                if (this.showequation) {
                    this.equations.push(prefix + reporting.FormatString(eq[i].equation, eq[i].nameparam) + "$$");
                    this.equations.push(prefix + reporting.FormatString(eq[i].equation, eq[i].valueparam) + "$$");
                }
                //this.equations.push(reporting.FormatString("$${0}={1}{2}$$", [eq[i].symbol, eq[i].value, this.unit.value.name]));
                if (eq[i].value === undefined || isNaN(eq[i].value)) {
                    if (eq[i].value.length > 0) {
                        var rem = eq[i].value.replace(" ", "\\it\\");
                        while (rem.indexOf(" ") !== - 1)
                            rem = rem.replace(" ", "\\it\\");

                        this.equations.push(reporting.FormatString("$${0}=\\it\\{1}$$", [eq[i].symbol, rem]));
                    } else
                        this.equations.push(reporting.FormatString("$${0}={1}$$", [eq[i].symbol, "\\it\\Unable \\it\\to \\it\\compute"]));
                } else {
                    if (eq[i].DisplayValue && eq[i].unit.value)
                        this.equations.push(reporting.FormatString("$${0}={1}$$", [eq[i].symbol, uiframework.settings.Format(eq[i].value) + '\\ \\text"' + eq[i].unit.value.name + '"']));
                    else
                        this.equations.push(reporting.FormatString("$${0}={1}$$", [eq[i].symbol, eq[i].value]));
                }

            }
        } else if (this.equations.length === 0) {
            if (this.remarks === undefined || this.remarks === "") {
                if (this.shortname) {
                    this.equations.push("$$" + this.shortname + " = " + this.DisplayValue(true, true) + "$$"); // Commented : cause an issue in spacing between values and units
                    //this.equations.push(this.shortname + " = " + this.DisplayValue(true));
                } else
                    this.equations.push(this.name + " = " + this.DisplayValue(true));
            } else {
                if (this.shortname) {
                    this.equations.push("$" + this.shortname + "$ = " + this.remarks);
                } else
                    this.equations.push(this.name + " = " + this.remarks);
            }


        }
    };

    this.ShowEditor = function (parent, sender) {
        var form;

        if (self.editortitle)
            form = new uiframework.Form(self.editortitle);
        else {
            if (parent.unit)
                form = new uiframework.Form(self.name + " (" + parent.unit.value.name + ")");
            else
                form = new uiframework.Form("Input " + self.name);
        }

        form.showclose = true;
        form.showfooter = false;
        form.showheader = true;

        form.height = 322;
        form.width = 320;

        form.source = parent;

        var update = function (parent, sender) {
            var source = parent.form.source;
            var input = $("#" + source.contentid);
            var value = parseFloat(this.value);

            if (value < this.min)
                value = this.min;

            if (value > this.max)
                value = this.max;

            var textvalue = uiframework.settings.Format(value);

            if (source.ispercentage)
                textvalue += "%";

            input.text(textvalue);

            if (source.unit !== undefined)
                value /= source.unit.value.value;

            source.SetValue(value);

            parent.form.Dispose();
        };

        var numpad;

        if (parent.unit && parent.unit.value.value !== 1) {
            var min = parent.min;
            var max = parent.max;

            if (min !== undefined && max !== undefined) {
                if (self.convert) {
                    //Convert to display unit
                    if ($SETTINGS.digitsymbol.value.value === 2) {
                        if (min)
                            min = parent.min * parent.unit.value.value;

                        if (max)
                            max = parent.max * parent.unit.value.value;
                    } else {
                        if (min)
                            min = common.FormatNumber(parent.min * parent.unit.value.value, $SETTINGS);

                        if (max)
                            max = common.FormatNumber(parent.max * parent.unit.value.value, $SETTINGS);
                    }
                } else {
                    //No conversion
                    if ($SETTINGS.digitsymbol.value.value === 2) {
                        if (min)
                            min = parent.min;

                        if (max)
                            max = parent.max;
                    } else {
                        if (min)
                            min = common.FormatNumber(parent.min, $SETTINGS);

                        if (max)
                            max = common.FormatNumber(parent.max, $SETTINGS);
                    }
                }

                if (min.indexOf && min.indexOf(",") !== -1)
                    min = min.split(",").join("");

                if (max.indexOf && max.indexOf(",") !== -1)
                    max = max.split(",").join("");

                var value = common.Round(parseFloat(parent.GetValue()), $SETTINGS.nodigits.value.id);
                numpad = new uiframework.NumericPad(parseFloat(value), parseFloat(min), parseFloat(max));

            } else {
                var value = parseFloat(parent.GetValue());
                var limit = 1 / Math.pow(10, $SETTINGS.nodigits.value.id);

                if (value > limit)
                    value = common.Round(parseFloat(parent.GetValue()), $SETTINGS.nodigits.value.id);

                numpad = new uiframework.NumericPad(parseFloat(value));
            }

        } else {
            var min = parent.min;
            var max = parent.max;

            var value = parseFloat(parent.GetValue());
            var limit = 1 / Math.pow(10, $SETTINGS.nodigits.value.id);

            if (value > limit)
                value = common.Round(parseFloat(parent.GetValue()), $SETTINGS.nodigits.value.id);

            if (min !== undefined && max !== undefined)
                numpad = new uiframework.NumericPad(parseFloat(value), parseFloat(min), parseFloat(max));
            else
                numpad = new uiframework.NumericPad(parseFloat(value));
        }

        numpad.showok = true;
        numpad.okevent = update;
        numpad.form = form;

        if (parent.allownegative)
            numpad.shownegative = true;

        form.Add(numpad);

        uiframework.onnumericpad = true;
        uiframework.allowclick = false;

        form.Show();
        form.CenterPosition();

        return form;
    };

    this.GenerateReport = function (pdf, status) {
        pdf.setFontSize(12);
        pdf.setFontType('normal');

        var equation;
        var split;

        this.name = this.name.split("<sub>").join("");
        this.name = this.name.split("</sub>").join("");

        this.name = this.name.split("<span>").join("");
        this.name = this.name.split("</span>").join("");
        this.name = this.name.split("θ").join("");

        equation = this.name + " = " + this.DisplayValue();
        equation = equation.split("²").join("^2");
        equation = equation.split("³").join("^3");
        equation = equation.split("⁴").join("^4");

        pdf.text(status.x, status.y, equation);
        status.y += 25;

        //        var equation;
        //        var split;
        //
        //        if (this.equations.length !== 0) {
        //            for (var i = 0; i < this.equations.length; i++) {
        //                equation = this.equations[i];
        //                equation = equation.split("$$").join("");
        //                equation = equation.split("{").join("(");
        //                equation = equation.split("}").join(")");
        //                equation = equation.split("_").join("");
        //
        //                pdf.text(status.x, status.y, equation);
        //                status.y += 25;
        //            }
        //        } else {
        //            if (this.remarks === undefined || this.remarks === "") {
        //                equation = this.name + " = " + this.DisplayValue();
        //                pdf.text(status.x, status.y, equation);
        //                status.y += 25;
        //            } else {
        //                equation = this.name + " = " + this.remarks;
        //                pdf.text(status.x, status.y, equation);
        //                status.y += 25;
        //            }
        //        }
    };

    this.UpdateText = function () {
        if (this.object !== undefined) {
            var factor = 1;
            if (this.unit)
                factor = this.unit.value.value;

            var value = uiframework.settings.Format(this.value * factor);
            if (this.ispercentage)
                value += "%";

            this.object.text(value);
        }

        var min;
        if (this.unit)
            min = this.min * this.unit.value.value;
        else
            min = this.min;

        min = uiframework.settings.Format(min);

        var max;
        if (this.unit)
            max = this.max * this.unit.value.value;
        else
            max = this.max;

        //        max = uiframework.settings.Format(max);
        //
        //        if (this.range !== undefined)
        //            this.range.text(min + " - " + max);

        this.UpdateUnitText();
    };

    this.UpdateUnitText = function () {
        if (this.unit !== undefined) {
            if (this.unitleft !== undefined) {
                this.unitleft.text(this.unit.value.name);
            }
            if (this.unitright !== undefined) {
                this.unitright.text(this.unit.value.name);
            }
        }
    };

    this.UpdateToDefault = function () {
        if (this.defaultvalues === null)
            return;

        var isDefault = false;

        for (var defaultvalue in this.defaultvalues) {
            defaultvalue = this.defaultvalues[defaultvalue];
            if (defaultvalue.value === this.value) {
                isDefault = true;
                break;
            }
        }

        if (isDefault) {
            for (var defaultvalue in this.defaultvalues) {
                defaultvalue = this.defaultvalues[defaultvalue];
                if (defaultvalue.type === this.unit.value) {
                    this.value = defaultvalue.value;
                    break;
                }
            }
        }

    };
};

uiframework.PropertyRebar = function (name, nobars, barsize, spacing, mode) {
    uiframework.Property.call(this);

    this.name = name;
    this.nobars = nobars;
    this.barsize = barsize;
    this.spacing = spacing;
    this.rebarmode = mode;

    this.Area = function () {
        switch (this.rebarmode) {
            case REBARMODE.Bars:
                return this.nobars * Math.PI * this.barsize.value * this.barsize.value / 4;
            case REBARMODE.Spacing:
                if (this.spacing !== 0)
                    return Math.PI * this.barsize.value * this.barsize.value / (2 * this.spacing);
                else
                    return 0;
        }
    };

    this.Generate = function (parent, object) {
        var content;

        content = "<div class='property-name'>" + this.name + "</div>";

        switch (this.rebarmode) {
            case REBARMODE.Bars:

                if (this.nobars !== 0 && this.barsize) {
                    content += "<div class='property-value property-input'><span>" + this.nobars + " " + this.barsize.name + "</span></div>";
                } else {
                    content += "<div class='property-value property-input'><span>No Bars</span></div>";
                }

                break;
            case REBARMODE.Spacing:

                if (this.spacing !== 0) {
                    var spacing = this.spacing * common.unit.length.value.value;
                    content += "<div class='property-value property-input'><span>" + this.barsize.name + "@" + uiframework.settings.Format(spacing) + "</span></div>";
                } else {
                    content += "<div class='property-value property-input'><span>No Bars</span></div>";
                }

                break;
        }

        object.append(content);

        var input = $("#" + this.id + " .property-input");
        this.nobarsdiv = input;

        this.ClickEventNumber(this, input, this.ShowEditor);

    };

    this.UpdateText = function () {

        switch (this.rebarmode) {
            case REBARMODE.Bars:
                if (this.nobars !== 0) {
                    this.nobarsdiv.text(this.nobars + " " + this.barsize.name);
                } else {
                    this.nobarsdiv.text("No Bars");
                }
                break;
            case REBARMODE.Spacing:
                if (this.spacing !== 0) {
                    var spacing = this.spacing * common.unit.length.value.value;
                    this.nobarsdiv.text(this.barsize.name + "@" + uiframework.settings.Format(spacing));
                } else {
                    this.nobarsdiv.text("No Bars");
                }
                break;
        }

        if (this.event !== undefined)
            this.event(this, this);

    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Input " + name);
        form.class += " rebar";
        form.showclose = true;
        form.showfooter = false;
        form.showheader = true;
        form.source = parent;
        form.height = 418;
        form.width = 310;

        var update = function (parent, sender) {

            var value = parent.rebarpad.getValue();

            if (value) {
                var source = parent.rebarpad.form.source;
                source.barsize = value.barsize;
                source.nobars = Number(value.nobars);
                source.spacing = Number(value.spacing);
                source.UpdateText();
            }

            parent.rebarpad.form.Dispose();
        };


        var rebarpad = new rebarminiview();
        form.Add(rebarpad.newview());
        rebarpad.setRebarMode(parent.rebarmode);
        form.Show();
        form.CenterPosition();

        rebarpad.form = form;
        rebarpad.setOkEvent(update);
        rebarpad.setRebarSet($SETTINGS.rebarset);
        rebarpad.setRebarMode(parent.rebarmode);
        rebarpad.setValue(parent.barsize, parent.nobars, parent.spacing * common.unit.length.value.value);
        rebarpad.setAsNewInstance();

        var left = form.object.css("left");
        var top = form.object.css("top");

        for (var i = 0; i < form.items.length; i++) {
            if (form.items[i].Resize)
                form.items[i].Resize(left, top, form.width, form.height);
        }

        return form;
    };

};

uiframework.PropertyInteger = function (name, value, unit, min, max) {
    uiframework.Property.call(this);

    this.name = name;
    this.value = value;
    this.ispercentage = false;
    this.min = min;
    this.max = max;

    if (unit !== undefined)
        this.unit = unit;

    this.SetValue = function (value) {
        this.value = value;

        if (value < this.min)
            this.value = this.min;

        if (value > this.max)
            this.value = this.max;

        this.DispatchEvents(value);

        if (this.event !== undefined)
            this.event(this, this);

        if (this.postevent !== undefined)
            this.postevent();
    };

    this.DisplayValue = function () {
        var value = this.value;

        if (this.unit !== undefined) {
            value *= unit.value.value;
            value = parseInt(value);

            value += " " + unit.value.name;
        }

        return value;
    };

    this.GetValue = function () {
        var value = this.value;

        if (this.unit !== undefined)
            value *= unit.value.value;

        return value;
    };



    this.Generate = function (parent, object) {
        var content;

        if (this.unit !== undefined)
            content = "<div class='property-name has-unit'>" + this.name;
        else
            content = "<div class='property-name'>" + this.name;

        var value = this.value;

        if (uiframework.settings === undefined) {
            console.log("ERROR: No settings defined for uiframework.");
            console.log("ERROR: Add in app.Initialize - uiframework.settings = this.model.settings;");
        }

        var leftunit = "";
        var rightunit = "";

        if (this.unit !== undefined && unit.value !== undefined) {
            value *= unit.value.value;
            value = parseInt(value);

            if (uiframework.settings === undefined || uiframework.settings.displayunit.value.value === DISPLAYUNIT.LEFT.value)
                leftunit = "<div id='property_unit_left_" + id + "' class='property-unit-left' id='" + this.name + "_name'>" + unit.value.name + "</div>";
            else if (uiframework.settings !== undefined || uiframework.settings.displayunit.value.value === DISPLAYUNIT.RIGHT.value)
                rightunit = "<div id='property_unit_right_" + id + "' class='property-unit-right' id='" + this.name + "_name'>" + unit.value.name + "</div>";
        }

        content += leftunit;
        content += "</div>";

        var id = "container" + _counter++;

        if (this.ispercentage)
            value += "%";

        if (this.readonly) {
            if (this.unit !== undefined) {
                if (rightunit !== "")
                    content += "<div class='property-value property-readonly property-has-unit property-has-right-unit'>" + value + rightunit + "</div>";
                else
                    content += "<div class='property-value property-readonly property-has-unit'>" + value + "</div>";
            } else
                content += "<div class='property-value property-readonly'>" + value + "</div>";
        } else {
            if (this.unit !== undefined) {
                if (rightunit !== "")
                    content += "<div class='property-value property-input property-has-unit property-has-right-unit'><span id='" + id + "'>" + value + "</span>" + rightunit + "</div>";
                //content += "<div class='property-value property-input property-has-unit property-has-right-unit' id='" + this.name + "_value'><span id='" + id + "'>" + value + "</span>" + rightunit + "</div>";
                else
                    content += "<div class='property-value property-input property-has-unit'><span id='" + id + "'>" + value + "</span></div>";
            } else
                content += "<div class='property-value property-input'><span id='" + id + "'>" + value + "</span></div>";
        }

        object.append(content);

        var input = $("#" + this.id + " .property-input");

        var contentobject = $("span#" + id);
        this.contentid = id;
        this.contentobject = contentobject;

        this.events.push([parent, function (object, value) {
            object.val(value);
        }, contentobject]);

        this.ClickEventNumber(this, input, this.ShowEditor);

    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Input " + name);
        form.showclose = true;
        form.showfooter = false;
        form.showheader = true;

        form.height = 320;
        form.width = 320;

        form.source = parent;

        var update = function (parent, sender) {
            var source = parent.form.source;
            var input = $("#" + source.contentid);

            if (this.value < this.min)
                this.value = this.min;

            if (this.value > this.max)
                this.value = this.max;

            var value = parseInt(this.value);

            if (source.unit !== undefined)
                value /= source.unit.value.value;

            source.SetValue(parseInt(value));

            value = parseInt(this.value);

            if (source.ispercentage)
                value += "%";

            input.text(value);
            parent.form.Dispose();
        };

        var numpad = new uiframework.NumericPad(parent.GetValue(), parent.min, parent.max);
        numpad.showok = true;
        numpad.okevent = update;
        numpad.form = form;
        numpad.showperiod = false;

        form.Add(numpad);

        uiframework.onnumericpad = true;
        uiframework.allowclick = false;

        form.Show();
        form.CenterPosition();

        return form;
    };

    this.UpdateText = function () {
        if (this.contentobject !== undefined) {
            var factor = 1;
            if (this.unit)
                factor = this.unit.value.value;

            var value = parseInt(uiframework.settings.Format(this.value * factor));
            if (this.ispercentage)
                value += "%";

            this.contentobject.text(value);
        }

        var min;
        if (this.unit)
            min = this.min * this.unit.value.value;
        else
            min = this.min;

        min = uiframework.settings.Format(min);

        var max;
        if (this.unit)
            max = this.max * this.unit.value.value;
        else
            max = this.max;
    };
};

uiframework.PropertyRange = function (name, valuestart, valueend, unit) {
    uiframework.Property.call(this);

    this.name = name;
    this.valuestart = valuestart;
    this.valueend = valueend;

    if (unit !== undefined)
        this.unit = unit;
    else
        this.unit = UNITTYPE.UNITLESS;

    this.Generate = function (parent, object) {
        var content;
        content = "<div class='property-name'>" + this.name + "</div>";
        content += "<div class='property-value'><input value='" + this.valuestart + " - " + this.valueend + "'/></div>";

        object.append(content);

        var reference = this;

        var input = $("#" + this.id + " input");

        this.events.push([parent, function (object, value) {
            object.val(value);
        }, input]);

        object.on('change keyup paste', function (e) {
            var input = $(this).find("input");
            var inputvalue = input.val().toString();

            if (inputvalue.substring(input.length, 1) !== ".") {
                var value = parseFloat(inputvalue);

                if (inputvalue === "") {
                    reference.value = 0;
                } else {
                    if (value !== 0 && !value)
                        reference.input.val(reference.value);
                    else if (reference.value !== value) {
                        reference.SetValue(value);
                    }
                }
            }
        });
    };
};

uiframework.PropertyEnum = function (name, value, enums) {
    uiframework.Property.call(this);

    this.name = name;
    this.enums = enums;
    this.value = value;
    this.height = 280;

    this.SetValue = function (value) {
        if (this.enums !== undefined) {
            var list = this.GetEnum();
            for (var c = 0; c < list.length; c++) {
                if (list[c].name === value) {
                    this.value = list[c];
                    break;
                }
            }
        } else
            this.value = value;

        this.DispatchEvents(this.value.name);
    };

    this.GetEnum = function () {
        var list = [];

        for (var name in this.enums) {
            if (this.enums[name].name === undefined)
                this.enums[name].name = name;

            list.push(this.enums[name]);
        }

        return list;
    };

    this.Generate = function (parent, object) {
        var id = "container" + _counter++;

        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.readonly) {
            if (value.name)
                content += "<div class='property-value property-combobox property-readonly'>" + value.name + "</div>";
            else
                content += "<div class='property-value property-combobox property-readonly'>" + value + "</div>";
        } else
            content += "<div class='property-value property-combobox'><span id='" + id + "'>" + this.value.name + "</span><i class='combobox-editor pointer fa fa-bars'></i></div>";

        object.append(content);

        var input = $("#" + this.id + " .combobox-editor");
        var span = $("#" + this.id + " span");

        var contentobject = $("#" + id);

        this.inputobject = input;
        this.object = contentobject;
        this.contentid = id;

        this.events.push([parent, function (object, value) {
            object.text(value);
        }, contentobject]);

        this.ClickEventNumber(this, input, this.ShowEditor);
        this.ClickEventNumber(this, span, this.ShowEditor);
    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Select " + parent.name);
        form.showclose = true;
        form.showfooter = false;
        form.height = parent.height;
        form.source = parent;

        var enums = parent.GetEnum();
        var senderevent;

        if (sender)
            senderevent = sender.event;

        var select = function (parent, sender) {
            var input = $("#" + parent.form.source.contentid);
            input.text(parent.name);

            parent.form.source.SetValue(parent.name);

            if (parent.form.source.event !== undefined)
                parent.form.source.event(parent.form.source);

            var updateevent = parent.form.source.updateevent;
            parent.form.Dispose();

            if (senderevent)
                senderevent();

            if ($NAVIGATION !== undefined) {
                $NAVIGATION.stack.pop();
                $NAVIGATION.stack.pop();
            }

            if (updateevent)
                updateevent();
        };

        var list;

        for (var c = 0; c < enums.length; c++) {
            list = new uiframework.PropertyListItem(enums[c].name, enums[c].name === parent.value.name);
            list.event = select;
            list.form = form;
            form.Add(list);
        }

        form.width = 300;
        form.Show();
        form.CenterPosition();

        return form;
    };

    this.UpdateText = function () {
        if (this.object !== undefined)
            this.object.text(this.value.name);
    };

    this.Update = function (_enum) {
        this.name = _enum.name;
        this.enums = _enum.enums;
        this.value = _enum.value;
    };
};

uiframework.PropertyCombobox = function (name, value, enums) {
    uiframework.Property.call(this);

    var self = this;

    this.value = value;
    this.name = name;
    this.enums = enums;
    this.onchange;

    if (value.name.value)
        this.text = value.name.value;
    else
        this.text = value.name;

    this.height = 280;

    this.SetValue = function (value) {
        if (value.name.value)
            this.text = value.name.value;
        else
            this.text = value.name;

        this.value = value;

        this.DispatchEvents(this.text.name);
    };

    this.GetEnum = function () {
        var list = [];

        for (var name in this.enums) {
            if (this.enums[name].name === undefined)
                this.enums[name].name = name;

            list.push(this.enums[name]);
        }

        return list;
    };

    this.Generate = function (parent, object) {
        var id = "container" + _counter++;

        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.readonly)
            content += "<div class='property-value property-readonly'>" + value + "</div>";
        else
            content += "<div class='property-value property-combobox'><span id='" + id + "'>" + this.text + "</span><i class='combobox-editor pointer fa fa-bars'></i></div>";

        object.append(content);

        var input = $("#" + this.id + " .combobox-editor");
        var span = $("#" + this.id + " span");

        var contentobject = $("#" + id);

        this.inputobject = input;
        this.object = contentobject;
        this.contentid = id;

        this.events.push([parent, function (object, value) {
            object.text(value);
        }, contentobject]);

        this.ClickEventNumber(this, input, this.ShowEditor);
        this.ClickEventNumber(this, span, this.ShowEditor);
    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Select " + parent.name);
        form.showclose = true;
        form.showfooter = false;
        form.height = parent.height;
        form.source = parent;

        var enums = parent.GetEnum();
        var senderevent;

        if (sender)
            senderevent = sender.event;

        var select = function (parent, sender) {
            var input = $("#" + parent.form.source.contentid);

            if (sender.object.name !== input[0].textContent) {
                input.text(parent.name);

                parent.form.source.SetValue(sender.object);

                if (self.onchange)
                    self.onchange(sender.object);

                if (parent.form.source.event !== undefined)
                    parent.form.source.event(parent.form.source);

                var updateevent = parent.form.source.updateevent;
                parent.form.Dispose();

                if (senderevent)
                    senderevent();

                if ($NAVIGATION !== undefined) {
                    $NAVIGATION.stack.pop();
                    $NAVIGATION.stack.pop();
                }

                if (updateevent)
                    updateevent();
            } else {
                parent.form.Dispose();
            }
        };

        var list;

        for (var c = 0; c < enums.length; c++) {
            if (enums[c].name.value)
                list = new uiframework.PropertyListItem(enums[c].name.value, enums[c].name.value === parent.value);
            else
                list = new uiframework.PropertyListItem(enums[c].name, enums[c].name === parent.value);

            list.listobject = enums[c];
            list.event = select;
            list.form = form;
            form.Add(list);
        }

        form.width = 300;
        form.Show();
        form.CenterPosition();

        return form;
    };

    this.UpdateText = function () {
        if (this.object !== undefined)
            this.object.text(this.text);
    };
};

uiframework.PropertyBarList = function (name, value, list, unit, mode) {
    uiframework.Property.call(this);

    var self = this;

    this.name = name;
    this.list = list;
    this.value = value;
    this.unit = unit;
    this.rebarmode = mode;
    this.propertyname;

    this.Generate = function (parent, object) {
        var id = "container" + _counter++;

        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        var area = this.value.area;
        var displayvalue = "";

        if (this.value.value) {
            switch (this.rebarmode) {
                case REBARMODE.Bars:
                    displayvalue = this.value.value.nbar + this.value.value.sbar;
                    break;
                case REBARMODE.Spacing:
                    displayvalue = this.value.value.szbar + "@" + uiframework.settings.Format(this.value.value.spbar);
                    area = uiframework.settings.Format(area / this.value.value.spbar);
                    break;
            }
        }

        if (this.unit !== undefined && unit.value !== undefined) {
            area *= unit.value.value;

            if (uiframework.settings !== undefined)
                area = uiframework.settings.Format(area);
        } else {
            if (uiframework.settings !== undefined)
                area = uiframework.settings.Format(area);
        }

        if (this.readonly) {
            if (displayvalue)
                content += "<div class='property-value property-readonly'>" + displayvalue + "</div>";
            else
                content += "<div class='property-value property-readonly'><div class='property-value property-readonly property-has-unit property-remarks'>Not Required</div></div>";
        } else {
            if (displayvalue)
                content += "<div class='property-value property-combobox'><span id='" + id + "'>" + displayvalue + "<span class='property-remarks'>" + area + "</span></span><i class='combobox-editor pointer fa fa-bars'></i></div>";
            else
                content += "<div class='property-value property-readonly property-remarks'>Not Required</div>";
        }

        object.append(content);

        var input = $("#" + this.id + " .combobox-editor");

        var contentobject = $("#" + id);

        this.object = contentobject;
        this.contentid = id;

        this.events.push([parent, function (object, value) {
            object.text(value);
        }, contentobject]);

        this.ClickEventNumber(this, input, this.ShowEditor);
    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Select");
        form.showclose = false;
        form.showfooter = false;
        form.height = 300;
        form.source = parent;

        var enums = parent.list;
        var senderevent = sender.event;

        var select = function (parent, sender) {
            var source = parent.form.source;
            var input = $("#" + source.contentid);
            var area;

            if (self.propertyname) {
                area = parent.value[self.propertyname];

                if (area === undefined) {
                    area = parent.value.area;
                    console.error(self.propertyname + " doesn't exists!");
                }
            } else
                area = parent.value.area;

            if (source.unit !== undefined && unit.value !== undefined) {
                area *= source.unit.value.value;

                if (uiframework.settings !== undefined)
                    area = uiframework.settings.Format(area);
            } else {
                if (uiframework.settings !== undefined)
                    area = uiframework.settings.Format(area);
            }

            input.html(parent.name + "<span class='property-remarks'>" + area + "</span>");

            parent.form.source.SetValue(parent.value);

            if (parent.form.source.event !== undefined)
                parent.form.source.event(parent.form.source);

            var updateevent = parent.form.source.updateevent;
            parent.form.Dispose();

            if (senderevent)
                senderevent();

            if ($NAVIGATION !== undefined) {
                $NAVIGATION.stack.pop();
                $NAVIGATION.stack.pop();
            }

            if (updateevent)
                updateevent();
        };

        var list;
        var name;
        var current = parent.value.value.nbar + parent.value.value.sbar;

        switch (parent.rebarmode) {
            case REBARMODE.Bars:

                for (var c = 0; c < enums.length; c++) {
                    if (enums[c].value.nbar) {
                        name = enums[c].value.nbar + enums[c].value.sbar;
                        list = new uiframework.PropertyListItem(name, name === current);
                        list.event = select;
                        list.form = form;
                        list.value = enums[c];
                        form.Add(list);
                    } else {
                        name = enums[c].value[0].nbar + enums[c].value[0].sbar + " & " + enums[c].value[1].nbar + enums[c].value[1].sbar;
                        list = new uiframework.PropertyListItem(name, name === current);
                        list.event = select;
                        list.form = form;
                        list.value = enums[c];
                        form.Add(list);
                    }
                }

                break;
            case REBARMODE.Spacing:

                for (var c = 0; c < enums.length; c++) {
                    name = enums[c].value.szbar + "@" + uiframework.settings.Format(enums[c].value.spbar);
                    list = new uiframework.PropertyListItem(name, name === current);
                    list.event = select;
                    list.form = form;
                    list.value = enums[c];
                    form.Add(list);
                }

                break;
        }

        form.width = 300;
        form.Show();
        form.CenterPosition();

        return form;
    };

    this.UpdateText = function () {
        if (this.object !== undefined)
            this.object.text(this.value.name);
    };

    this.Update = function (_enum) {
        this.name = _enum.name;
        this.enums = _enum.enums;
        this.value = _enum.value;
    };
};

uiframework.PropertyPropertyDouble = function (name, value) {
    uiframework.Property.call(this);

    this.name = name;
    this.value = value;

    this.Generate = function (parent, object) {
        var id = "container" + _counter++;

        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.value !== undefined)
            content += "<div class='property-value property-combobox'><span id='" + id + "'>" + this.value.name + "</span><i class='combobox-editor pointer fa fa-bars'></i></div>";

        object.append(content);

        var input = $("#" + this.id + " .property-combobox");

        var contentobject = $("#" + id);
        this.contentid = id;

        this.events.push([parent, function (object, value) {
            object.text(value);
        }, contentobject]);

        this.ClickEventNumber(this, input, this.ShowEditor);
    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Select Property");
        form.showclose = true;
        form.showfooter = false;
        form.height = 300;
        form.source = parent;

        var select = function (parent, sender) {
            var input = $("#" + parent.form.source.contentid);
            input.html(parent.name);

            parent.form.source.SetValue(parent.source);

            if (parent.form.source.event !== undefined)
                parent.form.source.event(parent.name);

            parent.form.Dispose();
        };

        var list;

        for (var name in parent.list)
            if (parent.list[name] !== undefined && parent.list[name].Load !== undefined) {
                if (parent.list[name].visible && (parent.list[name] instanceof uiframework.PropertyDouble)) {
                    list = new uiframework.PropertyListItem(parent.list[name].name, parent.list[name].name === parent.value.name);
                    list.event = select;
                    list.form = form;
                    list.source = parent.list[name];
                    form.Add(list);
                }
            }

        form.width = 300;
        form.Show();
        form.CenterPosition();

        return form;
    };

    this.Update = function (_enum) {
        this.name = _enum.name;
        this.enums = _enum.enums;
        this.value = _enum.value;
    };
};

uiframework.PropertyListItem = function (name, selected, hasicon) {
    uiframework.Property.call(this);

    //Set name
    this.name = name;
    this.event;
    this.listobject;

    if (selected === undefined && !selected)
        this.selected = false;
    else
        this.selected = selected;

    this.Generate = function (parent, object) {
        var icon;
        var selected = "";

        if (this.selected) {
            icon = "dot-circle-o";
            selected = " property-list-item-selected";
        } else
            icon = "circle-o";

        var id = "container" + _counter++;

        var content = "";
        if (hasicon) {
            content += "<div id='" + id + "' class='property-list-item pointer" + selected + "'>" + this.name + "<i class='pointer fa fa-" + icon + "'></i></div>";
        } else {
            content += "<div id='" + id + "' class='property-list-item pointer" + selected + "'>" + this.name + "</div>";
        }

        object.append(content);

        var object = $("#" + id);
        this.ClickEventNumber(this, object, this.Selected);
    };
    this.Selected = function (parent, sender) {
        if (parent.event !== undefined) {
            sender.object = parent.listobject;
            parent.event(parent, sender);
        }
    };
};

uiframework.PropertyBoolean = function (name, value) {
    uiframework.Property.call(this);

    //Set name
    this.name = name;

    //Set value
    if (value)
        this.value = true;
    else
        this.value = false;

    this.Generate = function (parent, object) {
        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.value)
            content += "<div class='property-value'><div class='control control-switch'><div class='on'></div></div></div>";
        else
            content += "<div class='property-value'><div class='control control-switch'><div class='off'></div></div></div>";

        object.append(content);

        this.object = $("#" + this.id + " .control-switch");

        this.events.push([parent, function (object, value) {
            object.val(value);
        }, this.object]);

        this.ClickEventNumber(this, this.object, this.UpdateProperty);
    };

    this.UpdateProperty = function (parent, sender) {
        parent.value = !parent.value;

        if (parent.value)
            parent.object.html("<div class='on'>");
        else
            parent.object.html("<div class='off'>");

        if (parent.event !== undefined)
            parent.event(parent, sender);

        if (parent.onchangeevent !== undefined)
            parent.onchangeevent();

        if (parent.postevent !== undefined)
            parent.postevent();
    };
};

uiframework.PropertyExpandCollapse = function (expandname, collapsename, value) {
    uiframework.Property.call(this);

    this.class = "property-expand-collapse";

    //Set name
    this.expandname = expandname;
    this.collapsename = collapsename;

    //Set value
    if (value) {
        this.value = true;
    } else {
        this.value = false;
    }

    this.Generate = function (parent, object) {
        var content;


        if (this.value)
            content = "<div class='property-name'><i class='fa fa-plus'></i> <strong>" + this.expandname + "</strong></div>";
        else
            content = "<div class='property-name'><i class='fa fa-minus'></i> <strong>" + this.collapsename + "</strong></div>";

        object.append(content);

        this.object = $("#" + this.id + " .property-name");

        this.events.push([parent, function (object, value) {
            object.val(value);
        }, this.object]);

        this.ClickEventNumber(this, this.object, this.UpdateProperty);
    };

    this.UpdateProperty = function (parent, sender) {
        parent.value = !parent.value;

        if (parent.value) {
            parent.object.html("<i class='fa fa-plus'></i> <strong>" + parent.expandname + "</strong>");
        } else {
            parent.object.html("<i class='fa fa-minus'></i> <strong>" + parent.collapsename + "</strong>");
        }

        if (parent.event !== undefined)
            parent.event();
    };
};

uiframework.PropertyString = function (name, value, type) {
    uiframework.Property.call(this);

    this.name = name;
    this.value = value;

    if (type)
        this.type = type;
    else
        this.type = "text";

    this.Generate = function (parent, object) {
        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.readonly)
            content += "<div class='property-value property-readonly'>" + this.value + "</div>";
        else
            content += "<div class='property-value property-input'><input type='" + this.type + "' value='" + this.value + "'/></div>";

        object.append(content);

        var reference = this;

        var input = $("#" + this.id + " input");
        reference.input = input;

        var _input = object.find("input");

        _input.on('change paste', function (e) {
            var inputvalue = this.value;
            reference.SetValue(inputvalue);

            if (reference.selfevent)
                reference.selfevent();
        });
    };

    this.GenerateReport = function (pdf, status) {
        pdf.setFontSize(12);
        pdf.setFontType('normal');
        pdf.text(status.x, status.y, this.name);
        pdf.text(status.x + 200, status.y, this.value.toString());
        status.y += 25;
    };

    this.UpdateText = function () {
        if (this.object !== undefined) {
            this.object.empty();
            this.Generate(undefined, this.object);
        }
    };
};

uiframework.PropertyButton = function (name, bottom, value) {
    uiframework.Property.call(this);

    //Set name
    this.name = name;
    this.bottom = bottom;
    this.event;
    this.class += " property-button";
    this.value = value;

    this.Generate = function (parent, object) {
        var content;
        content = "<div class='property-name has-unit'>" + this.name + "<div class='property-unit-left'>" + this.bottom + "</div></div>";
        content += "<div class='property-value'><div class='control control-button'>" + this.value + "</div></div>";

        object.append(content);

        this.object = $("#" + this.id + " .control-button");

        this.events.push([parent, function (object, value) {
            object.val(value);
        }, this.object]);

        this.ClickEventNumber(this, this.object, this.event);
    };
};

uiframework.PropertyColor = function (name, value, atribclass, atrib) {
    uiframework.Property.call(this);

    this.name = name;
    this.value = value;
    this.atribclass = atribclass;
    this.atrib = atrib;

    this.Generate = function (parent, object) {
        var content;

        var id = "container" + _counter++;

        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.readonly)
            content += "<div class='property-value property-readonly'>" + this.value + "</div>";
        else
            content += "<div class='property-value'><div id='" + id + "' class='property-color' style='background-color:" + this.value + "'></div></div>";

        object.append(content);

        var reference = this;
        var input = $("#" + this.id + " .property-color");

        this.contentid = id;

        this.ClickEventNumber(this, input, this.ShowEditor);
    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Select " + name);
        form.showclose = true;
        form.showfooter = false;
        form.showheader = true;

        form.height = 400;
        form.width = 420;

        form.source = parent;

        var update = function (parent, sender, color) {
            var source = parent.form.source;
            var input = $("#" + source.contentid);

            var value = color;

            source.SetValue(value);

            $(input).css("background-color", value);

            if (source.event !== undefined)
                source.event(source);

            var updateevent = source.updateevent;
            parent.form.Dispose();

            if (updateevent)
                updateevent();
        };

        var numpad = new uiframework.ColorPad(parent.value);
        numpad.showok = true;
        numpad.okevent = update;
        numpad.form = form;

        form.Add(numpad);

        if (form.Show()) {
            var width = window.innerWidth;
            var height = $HEIGHT;

            if (width > 420) {
                width = 420;

                if (height > 400)
                    height = 400;

                form.SetSize(width, height);
                form.CenterPosition();

            } else {
                form.DockRight(window.innerWidth);
            }
        }

        //form.CenterPosition();

        return form;
    };

    this.GenerateReport = function (pdf, status) {
        pdf.setFontSize(12);
        pdf.setFontType('normal');
        pdf.text(status.x, status.y, this.name);
        pdf.text(status.x + 200, status.y, this.value.toString());
        status.y += 25;
    };

    this.SetValue = function (value) {
        this.value = value;
        if (this.atribclass !== undefined) {
            var res = this.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(this.atrib, value);
            }
        }
        this.DispatchEvents(value);
    };

    this.Update = function (_enum) {
        this.name = _enum.name;
        this.enums = _enum.enums;
        this.value = _enum.value;
    };
};

uiframework.PropertyColorRange = function (name, value) {
    uiframework.Property.call(this);

    this.class += " property-range";
    this.name = name;
    this.value = value;

    this.Generate = function (parent, object) {
        var content;
        content = "<div class='property-value'><div class='property-color-range' style='background-color:" + this.value + "'></div></div>";
        content += "<div class='property-name'>" + this.name + "</div>";

        object.append(content);
    };
};

uiframework.PropertyFontSize = function (name) {
    uiframework.Property.call(this);

    this.name = name;
    this.enums = FONTSIZE;
    this.value = FONTSIZE.MEDIUM;

    this.SetValue = function (value) {
        if (this.enums !== undefined) {
            var list = this.GetEnum();
            for (var c = 0; c < list.length; c++) {
                if (list[c].name === value) {
                    this.value = list[c];
                    break;
                }
            }
        } else
            this.value = value;

        this.DispatchEvents(this.value.name);
    };

    this.GetEnum = function () {
        var list = [];

        for (var name in this.enums) {
            if (this.enums[name].name === undefined)
                this.enums[name].name = name;

            list.push(this.enums[name]);
        }

        return list;
    };

    this.Generate = function (parent, object) {
        var id = "container" + _counter++;

        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.readonly)
            content += "<div class='property-value property-readonly'>" + value + "</div>";
        else
            content += "<div class='property-value property-combobox'><span id='" + id + "'>" + this.value.name + "</span><i class='combobox-editor pointer fa fa-bars'></i></div>";

        object.append(content);

        var input = $("#" + this.id + " .combobox-editor");

        var contentobject = $("#" + id);

        this.object = contentobject;
        this.contentid = id;

        this.events.push([parent, function (object, value) {
            object.text(value);
        }, contentobject]);

        this.ClickEventNumber(this, input, this.ShowEditor);
    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Select " + parent.name);
        form.showclose = false;
        form.showfooter = false;
        form.height = 300;
        form.source = parent;

        var enums = parent.GetEnum();
        var senderevent = sender.event;

        var select = function (parent, sender) {
            var input = $("#" + parent.form.source.contentid);
            input.text(parent.name);

            parent.form.source.SetValue(parent.name);

            if (parent.form.source.event !== undefined)
                parent.form.source.event(parent.form.source);

            var updateevent = parent.form.source.updateevent;
            parent.form.Dispose();

            if (senderevent)
                senderevent();

            if ($NAVIGATION !== undefined) {
                $NAVIGATION.stack.pop();
                $NAVIGATION.stack.pop();
            }

            $SETTINGS.UpdateCSS();

            if (updateevent)
                updateevent();
        };

        var list;

        for (var c = 0; c < enums.length; c++) {
            list = new uiframework.PropertyListItem(enums[c].name, enums[c].name === parent.value.name);
            list.event = select;
            list.form = form;
            form.Add(list);
        }

        form.width = 300;
        form.Show();
        form.CenterPosition();

        return form;
    };

    this.UpdateText = function () {
        if (this.object !== undefined)
            this.object.text(this.value.name);
    };

    this.Update = function (_enum) {
        this.name = _enum.name;
        this.enums = _enum.enums;
        this.value = _enum.value;
    };
};

uiframework.Tree = function (items) {
    uiframework.Base.call(this);

    this.class = "tree";
    this.items = items;
    this.event;

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        //Generate div container with id and class
        if (this.parent.append !== undefined) {
            //Add form container
            var content = this.GenerateContainer();

            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Body
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].parentobject = this;
                this.items[i].Load(this.object, this.event);
            }
        }
    };

    this.ClearSelection = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].ClearSelection();
        }
    };
};

uiframework.TreeNode = function (text, object, details) {
    uiframework.Base.call(this);

    this.text = text;
    this.class = "treenode";
    this.collapsed = true;
    this.nodeobject = object;
    this.details = details;

    this.Load = function (parent, event) {
        if (parent !== undefined)
            this.parent = parent;

        if (event && !this.event)
            this.event = event;

        //Generate div container with id and class
        if (this.parent.append !== undefined) {
            //Add form container
            var content = this.GenerateContainer();

            if (this.collapsed && this.items.length > 0)
                this.class = "treenode treenode-collapsed";
            else
                this.class = "treenode";

            //plus-square-o
            content = "";

            if (!this.object) {
                if (this.items.length === 0)
                    content = "<div id='" + this.id + "' class='" + this.class + "'>";
                else
                    content = "<div id='" + this.id + "' class='" + this.class + "'>";
            }

            if (this.items.length === 0)
                content += "<div class='treenode-arrow'></div><div class='treenode-content'><i class='checkbox fa fa-square-o'></i>" + this.text;
            else {
                if (this.collapsed)
                    content += "<div class='treenode-arrow'></div><div class='treenode-content'><i class='checkbox fa fa-plus-square-o'></i>" + this.text;
                else
                    content += "<div class='treenode-arrow'></div><div class='treenode-content'><i class='checkbox fa fa-minus-square-o'></i>" + this.text;
            }

            if (this.items.length === 0) {
                if (this.details !== undefined)
                    content += "<div class='treenode-detail'>" + this.details + "</div>";
            } else {
                if (this.text === "Materials" || this.text === "Sections") {
                    if (this.items.length === 1)
                        content += "<div class='treenode-count'>" + this.details + "</div>";
                    else if (this.items.length === 2)
                        content += "<div class='treenode-count'>1 Item</div>";
                    else
                        content += "<div class='treenode-count'>" + (this.items.length - 1) + " Items</div>";
                } else {
                    if (this.items.length === 1)
                        content += "<div class='treenode-count'>" + this.items.length + " Item</div>";
                    else if (this.items.length > 1)
                        content += "<div class='treenode-count'>" + this.items.length + " Items</div>";
                }
            }


            content += "</div>";

            if (!this.object)
                content += "</div>";

            if (this.object) {
                this.object.append(content);
            } else {
                //Append to parent, push to HTML DOM, for further processing.
                this.parent.append(content);
            }

            //This line is always needed for internal references.
            //Get the object using jQuery

            //Set the object
            var bindevent = false;

            if (!this.object) {
                var object = $("#" + this.id);
                this.object = object;
                bindevent = true;
            }

            this.icon = $("#" + this.id + " .checkbox");

            //Body
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].parentobject = this;
                this.items[i].Load(this.object, this.event);
            }

            var reference = this;

            if (bindevent)
                this.object.bind("click", function (e) {
                    e.stopPropagation();

                    var collapsed = reference.collapsed;

                    reference.ClearSelection();

                    if (reference.parentobject && reference.parentobject.ClearSelection)
                        reference.parentobject.ClearSelection();

                    if (reference.items.length === 0) {
                        if (collapsed) {
                            reference.collapsed = false;
                            reference.icon.attr("class", "fa fa-check-square-o");
                        } else {
                            reference.collapsed = true;
                            reference.icon.attr("class", "fa fa-square-o");
                        }
                    } else if (collapsed) {
                        reference.icon.attr("class", "fa fa-minus-square-o");
                        reference.collapsed = false;

                        reference.object.attr("class", "treenode");
                    } else {
                        reference.icon.attr("class", "fa fa-plus-square-o");
                        reference.collapsed = true;
                        reference.object.attr("class", "treenode treenode-collapsed");
                    }

                    //                if (reference.parentobject !== undefined && reference.parentobject.event !== undefined && reference.event !== "") {
                    //                    if (reference.nodeobject !== undefined) {
                    //
                    //                        reference.selected = [];
                    //
                    //                        reference.nodeobject.selected = !reference.collapsed;
                    //                        reference.selected.push(reference.nodeobject);
                    //                        reference.parentobject.event(reference);
                    //                    }
                    //                }

                    if (reference.event && reference.nodeobject) {
                        reference.nodeobject.selected = !reference.collapsed;
                        reference.event(reference.nodeobject, reference);
                    }
                });
        }
    };

    this.ClearSelection = function () {
        if (this.items.length === 0) {
            if (this.icon)
                this.icon.attr("class", "fa fa-square-o");

            this.collapsed = true;

            if (this.nodeobject)
                this.nodeobject.selected = false;
        }

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].ClearSelection)
                this.items[i].ClearSelection();
        }
    };
};

uiframework.FlowContainer = function () {
    uiframework.Base.call(this);

    this.class = "flowcontainer";

    this.Load = function (parent) {
        //Generate div container with id and class
        var content = this.GenerateContainer();

        if (parent !== undefined)
            this.parent = parent;

        if (this.parent.append !== undefined) {
            //Append to parent, push to HTML DOM, for further processing.
            this.parent.append(content);

            //This line is always needed for internal references.
            //Get the object using jQuery
            var object = $("#" + this.id);

            //Set the object
            this.object = object;

            //Body
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].Load(this.object);
            }
        }
    };

    this.Resize = function (x, y, w, h) {
    };
};

uiframework.AppContainer = function (name, value, url) {
    uiframework.Property.call(this);

    var _this = this;

    this.class += " app-container";
    this.name = name;
    this.value = value;
    this.url = url;

    this.height = 667;
    this.width = 375;

    this.Generate = function (parent, object) {
        var id = "container" + _counter++;

        var content;
        content = "<div class='property-name'>" + this.name + "</div>";

        if (this.readonly)
            content += "<div class='property-value property-readonly'>" + this.value + "</div>";
        else
            content += "<div class='property-value property-combobox'><span id='" + id + "'>" + this.value + "</span><i class='combobox-editor pointer fa fa-bars'></i></div>";

        object.append(content);

        var input = $("#" + this.id + " .combobox-editor");
        var span = $("#" + this.id + " span");

        var contentobject = $("#" + id);

        this.inputobject = input;
        this.object = contentobject;
        this.contentid = id;

        this.events.push([parent, function (object, value) {
            object.text(value);
        }, contentobject]);
        this.ClickEventNumber(this, input, this.ShowEditor);
        this.ClickEventNumber(this, span, this.ShowEditor);
    };

    this.ShowEditor = function (parent, sender) {
        var form = new uiframework.Form("Select Section");
        form.showheader = false;
        form.showclose = false;
        form.showfooter = false;
        form.source = parent;

        form.height = _this.height;
        form.width = _this.width;

        form.ondispose = function () {
            $SHAREDDATA = undefined;
        };

        _this.iframe = new uiframework.iFrame(_this.url + ".html");

        form.Add(_this.iframe);

        form.Show();
        form.CenterPosition();

        for (var i = 0; i < form.items.length; i++) {
            form.items[i].Resize(0, 0, form.width, form.body.height());
        }

        uiframework.externalappevent = _this.ExternalAppCallBack;
        uiframework.parentobject = _this;
        uiframework.parentform = form;

        return form;
    };

    this.ExternalAppCallBack = function () {
        var data = JSON.parse(window.data);

        uiframework.parentobject.value = data.name;
        uiframework.parentobject.UpdateText();

        if (_this.selfevent)
            _this.selfevent(data);

        uiframework.parentform.Dispose();
    };

    this.UpdateText = function () {
        if (this.object !== undefined)
            this.object.text(this.value);
    };
};

uiframework.Events = function () {
    var list = [];

    this.Subscribe = function (event, func) {
        //Add event if it doesn't exists yet
        if (!list[event])
            list[event] = [];

        //Get existing subscribers
        var subscribers = list[event];

        if (subscribers) {
            var subscribe = true;

            //Check if it is a duplicate subscriber
            for (var i = 0; i < subscribers.length; i++)
                if (subscribers[i] === func) {
                    subscribe = false;
                    break;
                }

            //Add subscriber
            if (subscribe)
                subscribers.push(func);
        }
    };

    this.Fire = function (event, response) {
        var subscribers = list[event];

        //Call all subscribers
        if (subscribers) {
            for (var i = 0; i < subscribers.length; i++)
                if (subscribers[i]) {
                    subscribers[i](response);
                    break;
                }
        }
    };
};