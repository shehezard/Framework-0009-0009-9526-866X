/* global uiframework, ORIENTATION, structuralmaterials, pipepipematerials, pipematerials, uicanvas2dgraphics, DEVICE, common, $APPLICATION, $APPLICATION, $NAVIGATION, $CANVAS, UNIT, $CURRENTSECTIONVIEW, BEAMDESIGNOPTION, $SECTIONVIEW, CODE, localstorage */
/* NOTE:
 * 1. If BS CODE is complete, then de-comment self.UpdateForBSCode();
 */
var $APPLICATION;   //Instance of App
var $VIEW;          //The entire interface
var $MODEL;         //Model
var $CONTENT;       //Content area
var $SETTINGS;      //Application settings
var $CURRENTVIEW;   //Current view
var $ACTIVEVIEW;
var $LOGINFORM;
var $CURRENTUNIT;
var $CURRENTCODE;
var $CURRENTVIEWINDEX = 0;

var $VERSION = "1.0.0";
var $SERVER = "http://52.163.221.246:8082";

var app = function () {
    var self = this;

    this.maingrid;
    this.model;
    this.width = 0;
    this.height = 0;
    this.sections;

    this.activeview;
    this.currentsection;
    this.sectionname;

    this.Initialize = function () {
        $APPCODE = "beamsection";
        $REPORTTITLE = "RC Beam";

        this.InitializeModel();
        this.InitializeView();
        this.InitializeSettings();
        this.InitializeMenu();
        this.InitializeContent();
        this.InitializeSections();
        this.ShowView();
        //this.ShowMainView();

        if ($APPLICATION.externalapp && window.parent.$SHAREDDATA) {
            var data = window.parent.$SHAREDDATA;
            var section;
            var name;
            var framedata;

            if (data.data)
                framedata = data.data;

            data.onload();

            for (var i = 0; i < this.sections.length; i++) {
                if (data.shape === this.sections[i][0]) {
                    name = this.sections[i][0];
                    section = this.sections[i][1];
                    break;
                }
            }

            if (section) {
                //Set dimensions
                var s = section;
                var ss = section.section;

                if (data.w) {
                    s.w.value = data.w;
                    if (ss.w)
                        ss.w.value = data.w;
                }

                if (data.h) {
                    s.h.value = data.h;
                    if (ss.h)
                        ss.h.value = data.h;
                }

                if (data.mu) {
                    s.mu.value = data.h;
                    if (ss.mu)
                        ss.mu.value = data.h;
                }

                if (data.vu) {
                    s.vu.value = data.vu;
                    if (ss.vu)
                        ss.vu.value = data.vu;
                }

                if (data.tu) {
                    s.tu.value = data.tu;
                    if (ss.tu)
                        ss.tu.value = data.tu;
                }

                if (data.cc) {
                    s.cc.value = data.cc;
                    if (ss.cc)
                        ss.cc.value = data.cc;
                }

                if (data.fy) {
                    s.fy.value = data.fy;
                    if (ss.fy)
                        ss.fy.value = data.fy;
                }

                if (data.fys) {
                    s.fys.value = data.fys;
                    if (ss.fys)
                        ss.fys.value = data.fys;
                }

                if (data.fc) {
                    s.fc.value = data.fc;
                    if (ss.fc)
                        ss.fc.value = data.fc;
                }

                if (framedata) {
                    let results = framedata.results;
                    let load, station;
                    let m3 = Number.MIN_SAFE_INTEGER;
                    let v2 = Number.MIN_SAFE_INTEGER;
                    let t = Number.MIN_SAFE_INTEGER;

                    for (let loadcase in results) {
                        load = results[loadcase];

                        for (let stn in load) {
                            station = load[stn];

                            if (m3 < Math.abs(station.moment3.value))
                                m3 = Math.abs(station.moment3.value);

                            if (v2 < Math.abs(station.shear2.value))
                                v2 = Math.abs(station.shear2.value);

                            if (t < Math.abs(station.torsion.value))
                                t = Math.abs(station.torsion.value);
                        }
                    }

                    section.mu.value = m3 / 1000000;
                    section.vu.value = v2 / 1000;
                    section.tu.value = t / 1000000;
                }

                $CURRENTSECTIONVIEW = 0;

                $APPLICATION.currentsection = section;
                $APPLICATION.sectionname = name;
                $APPLICATION.name = name.replace("<br/>", " ");
                $MODEL.sections = $APPLICATION.currentsection;

                $APPLICATION.currentsection.section.UpdateMesh();
                section = $APPLICATION.currentsection.section;

                section.save = true;
                $APPLICATION.ShowSectionView(parent);
            }

        } else
            this.ShowMainView();

        if (this.canvas !== undefined)
            this.canvas.ZoomAll();

        var storage = new localstorage();
        var disclaimer = storage.OpenData("disclaimer");

        if (!disclaimer) {
            this.ShowAbout();
            storage.SaveData(1, "disclaimer");
        }
    };

    this.InitializeModel = function () {
        $MODEL = new model(this.SettingsRequireUpdate);
        $MODEL.event = this.ShowDetails;
    };

    this.InitializeView = function () {
        $VIEW = new uiframework.ContentView("RC Beam");
        $VIEW.settingsupdateevent = this.SettingsUpdated;
    };

    this.InitializeSettings = function () {
        var settings = $MODEL.settings;

        uiframework.settings = settings;
        $SETTINGS = settings;
        common.unit.Initialize($SETTINGS.unit.value);

        $CURRENTUNIT = $SETTINGS.unit.value;
        $CURRENTCODE = $SETTINGS.designcode.value.name;

        $VIEW.BindSettings($SETTINGS);
    };

    this.InitializeMenu = function () {
        var items = [];
        var button;

        button = new uiframework.ListUser("clone", "RC Beam");
        items.push(button);

        button = new uiframework.ListButton("info-circle", "About");
        button.event = this.ShowAbout;
        items.push(button);

        $VIEW.SetMenu(items);
    };

    this.InitializeContent = function () {
        $CONTENT = new uiframework.Grid();
        $CONTENT.orientation = ORIENTATION.VERTICAL;
        $VIEW.contentgrid.Add($CONTENT);
    };

    this.InitializeSections = function () {
        this.sections = [
            ["Rectangle", new uicanvas2dgraphics.RCRectangle(0, 0, 300, 450), "rectangle.png"],
            ["Tee", new uicanvas2dgraphics.RCTee(0, 0, 600, 450, 300, 150), "tee.png"],
            ["Inverted L", new uicanvas2dgraphics.RCAngle(0, 0, 450, 450, 300, 150), "angle.png"]
        ];

        $MODEL.sections = this.sections[0][1];
        this.sectionname = this.sections[0][0];

        //        self.UpdateForBSCode();

        $APPLICATION.SetAllSectionsDefaultValues();
        $APPLICATION.UpdateSection();
        $MODEL.sections.section.UpdateMesh();
    };

    this.ShowView = function () {
        $VIEW.Show();
        this.Refresh();
    };

    this.ShowMainView = function (parent, sender) {
        $ACTIVEPORTRAITVIEW = undefined;
        $CURRENTVIEWINDEX = 0;
        $CURRENTTABINDEX = 0;

        var view = new mainview($APPLICATION, parent, sender, uiframework.device);
        view.Show();

        $NAVIGATION.PushView($APPLICATION.ShowMainView);
        $PREVIOUSVIEW = $APPLICATION.ShowMainView;

        $ACTIVEVIEW = $APPLICATION.ShowMainView;
    };

    this.ShowSectionView = function (parent, sender) {
        $CURRENTVIEWINDEX = 1;
        var view = new sectionview($APPLICATION, parent, sender, uiframework.device);
        view.Show();

        $NAVIGATION.PushView($APPLICATION.ShowSectionView);
        $APPLICATION.activeview = $APPLICATION.ShowSectionView;
        $ACTIVEVIEW = $APPLICATION.ShowSectionView;
    };

    this.ShowPropertyView = function (parent, sender) {
        $CURRENTVIEWINDEX = 1;
        var view = new sectionview($APPLICATION, parent, sender, uiframework.device);
        view.Show();

        $NAVIGATION.PushView($APPLICATION.ShowPropertyView);
        $APPLICATION.activeview = $APPLICATION.ShowPropertyView;
        $ACTIVEVIEW = $APPLICATION.ShowPropertyView;
    };

    this.ShowDesignView = function (parent, sender) {
        $CURRENTVIEWINDEX = 1;
        var view = new sectionview($APPLICATION, parent, sender, uiframework.device);
        view.Show();

        $NAVIGATION.PushView($APPLICATION.ShowDesignView);
        $APPLICATION.activeview = $APPLICATION.ShowDesignView;
        $ACTIVEVIEW = $APPLICATION.ShowDesignView;
    };

    this.ShowReportView = function (parent, sender) {
        $CURRENTVIEWINDEX = 1;
        var view = new sectionview($APPLICATION, parent, sender, uiframework.device);
        view.Show();

        $NAVIGATION.PushView($APPLICATION.ShowReportView);
        $APPLICATION.activeview = $APPLICATION.ShowReportView;
        $ACTIVEVIEW = $APPLICATION.ShowReportView;
    };

    this.UpdateType = function (parent, sender) {
        $CURRENTSECTIONVIEW = 0;

        if (sender)
            $CURRENTSECTIONID = sender.selector.replace("#", "");

        for (var i = 0; i < $APPLICATION.sections.length; i++) {
            if (parent === $APPLICATION.sections[i][0]) {
                $MODEL.sections = $APPLICATION.sections[i][1];
                $APPLICATION.sectionname = $APPLICATION.sections[i][0];
                $MODEL.sections.section.UpdateMesh();
            }
        }

        var section = $MODEL.sections.section;

        if (!section.save)
            $APPLICATION.SetSectionDefaultValues(section);

        section.save = true;

        $APPLICATION.ShowSectionView(parent, sender);
        $VIEW.CloseMenu();
    };

    this.SettingsUpdated = function (parent, sender) {
        if ($SETTINGS.UpdateCSS)
            $SETTINGS.UpdateCSS();

        if ($CURRENTTABINDEX === 0)
            $DESIGN = undefined;

        $MODEL.SaveSettings();

        if ($CURRENTUNIT !== $SETTINGS.unit.value) {
            $CURRENTUNIT = $SETTINGS.unit.value;
            common.unit.Initialize($SETTINGS.unit.value);

            $APPLICATION.SetAllSectionsDefaultValues();
        }

        if ($CURRENTCODE !== $SETTINGS.designcode.value.name) {
            $CURRENTCODE = $SETTINGS.designcode.value.name;
        }

        $APPLICATION.UpdateSection();

        $MODEL.sections.UpdateMesh();
        //$MODEL.sections.section.UpdateMesh();

        $ACTIVEVIEW();
    };

    this.SettingsRequireUpdate = function () {
        $SETTINGS.Update();
    };

    this.SetAllSectionsDefaultValues = function () {
        for (var i = 0; i < this.sections.length; i++) {
            section = this.sections[i][1];
            $APPLICATION.SetSectionDefaultValues(section);
        }
    };

    this.SetSectionDefaultValues = function (section) {
        var factor;
        switch ($CURRENTUNIT.value) {
            case UNIT.US.value:
                factor = 1;
                common.RoundUp(section.h, factor);
                common.RoundUp(section.w, factor);
                this.RoundDimension(section.t, factor);
                this.RoundDimension(section.wt, factor);
                this.RoundDimension(section.wb, factor);
                this.RoundDimension(section.tw, factor);
                this.RoundDimension(section.tf, factor);

                this.RoundDimension(section.r, factor);
                this.RoundDimension(section.alength, factor);
                this.RoundDimension(section.aoffset, factor);
                this.RoundDimension(section.lf1, factor);
                this.RoundDimension(section.lf2, factor);

                this.RoundDimension(section.wtop, factor);
                this.RoundDimension(section.wbot, factor);
                this.RoundDimension(section.tft, factor);
                this.RoundDimension(section.tfb, factor);

                this.RoundDimension(section.tw1, factor);
                this.RoundDimension(section.tw2, factor);
                this.RoundDimension(section.tf1, factor);
                this.RoundDimension(section.tf2, factor);

                this.RoundDimension(section.wf, factor);
                this.RoundDimension(section.gap, factor);
                this.RoundDimension(section.tp, factor);
                this.RoundDimension(section.wp, factor);
                break;

            default:
                factor = 1;
                common.RoundUp(section.h, factor);
                common.RoundUp(section.w, factor);
                this.RoundDimension(section.t, factor);
                this.RoundDimension(section.wt, factor);
                this.RoundDimension(section.wb, factor);
                this.RoundDimension(section.tw, factor);
                this.RoundDimension(section.tf, factor);

                this.RoundDimension(section.r, factor);
                this.RoundDimension(section.alength, factor);
                this.RoundDimension(section.aoffset, factor);
                this.RoundDimension(section.lf1, factor);
                this.RoundDimension(section.lf2, factor);

                this.RoundDimension(section.wtop, factor);
                this.RoundDimension(section.wbot, factor);
                this.RoundDimension(section.tft, factor);
                this.RoundDimension(section.tfb, factor);

                this.RoundDimension(section.tw1, factor);
                this.RoundDimension(section.tw2, factor);
                this.RoundDimension(section.tf1, factor);
                this.RoundDimension(section.tf2, factor);

                this.RoundDimension(section.wf, factor);
                this.RoundDimension(section.gap, factor);
                this.RoundDimension(section.tp, factor);
                this.RoundDimension(section.wp, factor);
                break;
        }
    };

    this.RoundSectionDefaultValues = function (section, factor) {
        this.RoundDimension(section.h, factor);
        this.RoundDimension(section.w, factor);
        this.RoundDimension(section.t, factor / 10);
        this.RoundDimension(section.wt, factor / 10);
        this.RoundDimension(section.wb, factor / 10);
        this.RoundDimension(section.tw, factor / 10);
        this.RoundDimension(section.tf, factor / 10);

        this.RoundDimension(section.r, factor);
        this.RoundDimension(section.alength, factor);
        this.RoundDimension(section.aoffset, factor / 10);
        this.RoundDimension(section.lf1, factor / 10);
        this.RoundDimension(section.lf2, factor / 10);

        this.RoundDimension(section.wtop, factor);
        this.RoundDimension(section.wbot, factor);
        this.RoundDimension(section.tft, factor / 10);
        this.RoundDimension(section.tfb, factor / 10);

        this.RoundDimension(section.tw1, factor / 10);
        this.RoundDimension(section.tw2, factor / 10);
        this.RoundDimension(section.tf1, factor / 10);
        this.RoundDimension(section.tf2, factor / 10);

        this.RoundDimension(section.wf, factor);
        this.RoundDimension(section.gap, factor / 50);
        this.RoundDimension(section.tp, factor / 10);
        this.RoundDimension(section.wp, factor);
    };

    this.RoundDimension = function (dimension, factor) {
        if (dimension) {
            d = dimension.GetValue();
            d = common.RoundByFactor(d, factor);
            dimension.value = d / dimension.unit.value.value;
        }
    };

    this.UpdateSection = function () {
        for (var i = 0; i < $APPLICATION.sections.length; i++)
            common.UpdateSection($APPLICATION.sections[i][1].section, $SETTINGS);

        common.UpdateSection($MODEL.sections.section, $SETTINGS);
    };

    this.UpdateForBSCode = function () {
        var visible = (CODE.BS8110_97.value === $SETTINGS.designcode.value.value);
        $MODEL.sections.R.visible = visible;

        for (var i = 0; i < $APPLICATION.sections.length; i++)
            $APPLICATION.sections[i][1].R.visible = visible;

        if ($ACTIVEVIEW)
            $ACTIVEVIEW();
    };

    this.RefreshCanvas = function () {
        //        $SECTIONVIEW.LoadDesignResults();
        $CANVAS.ZoomAll();
    };

    this.Refresh = function () {
        this.Resize(0, 0, window.innerWidth, window.innerHeight);
    };

    this.RefreshView = function () {
        $ACTIVEVIEW();
    };

    this.Resize = function (x, y, w, h) {
        $VIEW.Resize(x, y, w, h);
    };

    this.ShowLogin = function () {
        $VIEW.CloseMenu();

        if ($LOGINFORM)
            $LOGINFORM.Dispose();

        $LOGINFORM = common.ShowLogin(function () {
            $APPLICATION.InitializeMenu();
        });
    };

    this.ShowAbout = function () {
        var text = "<p>RC Beam is an app for the design of RC beam cross-sections subjected to bending moment, shear force, and torsion.</p>";
        text += "<p>Version: " + $VERSION + "</p>";
        common.ShowAbout("About", text, true, false, undefined, 300);
    };
};

$(document).ready(function () {
    $NAVIGATION = new navigationHelper();
    $APPLICATION = new app();

    if (window.parent !== window && window.parent.ExternalAppCallBack) {
        $APPLICATION.externalapp = true;
    }

    var md = new MobileDetect(window.navigator.userAgent);
    if (md.tablet() !== null || md.phone() !== null || md.mobile() !== null)
        uiframework.mobile = true;

    if (!uiframework.mobile)
        $('head').append('<link rel="stylesheet" type="text/css" href="css/desktop.css"/>');

    $HEIGHT = window.innerHeight;

    uiframework.Resize(window.innerWidth, window.innerHeight);
    $APPLICATION.Initialize();

    document.addEventListener("backbutton", function (e) {
        e.preventDefault();

        try {
            $NAVIGATION.PopView();
        } catch (e) {
        }
    }, false);

    if (window.parent !== window && window.parent.ExternalAppCallBack) {
        InitializeExternalApp();
    }
});

document.addEventListener("deviceready", function () {
    if (window.plugins) {
        window.plugins.intent.getCordovaIntent(function (Intent) {

            //alert("getCordovaIntent" + JSON.stringify(Intent));
            if (typeof Intent.extras !== "undefined") {

                alert(Intent.extras.data);

            } else {
                alert("undefined:undefined");
            }

        }, function () {
            alert('Error');
        });
        window.plugins.intent.setNewIntentHandler(function (Intent) {
            // alert("setNewIntentHandler" + JSON.stringify(Intent));
            if (typeof Intent.extras !== "undefined") {
                //alert("getCordovaIntent" + JSON.stringify(Intent));
                alert(Intent.extras.data);
            } else {
                alert("undefined:undefined");
            }
        });
    }
}, false);

function InitializeExternalApp(arg) {
}

$(window).resize(function () {
    uiframework.Resize(window.innerWidth, window.innerHeight);
    $NAVIGATION = new navigationHelper();

    $HEIGHT = window.innerHeight;

    if ($APPLICATION !== undefined) {
        $APPLICATION.RefreshView();
    }
});