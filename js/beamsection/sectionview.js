/* global DEVICE, uiframework, ORIENTATION, $CONTENT, $VIEW, $APPLICATION, $MODEL, REPORTINGSTYLE, jqMath, common, APICallType, $SERVER, $CANVAS, $CANVASGRID, $SETTINGS, uicanvas2dgraphics, BEAMDESIGNOPTION */
var $SECTIONVIEW;
var $ACTIVEPORTRAITVIEW;

var $CURRENTTABINDEX;
var $RIGHTGRID;
var $PROPERTYGRID;
var $CANVASGRID;
var $REPORTCONTAINER;
var $CURRENTSECTIONID;

var $DESIGN;

var sectionview = function (app, parent, sender, device) {
    uiframework.ViewBase.call(this, app, parent, sender, device);

    $CURRENTVIEW = this;
    $SECTIONVIEW = this;

    this.LandscapeMobile = function () {
        this.LandscapeTablet();
    };

    this.LandscapeTablet = function () {
        $VIEW.bottomtoolbar.DisposeChildren();
        $VIEW.HideBottomToolbar();

        //Remove content
        $CONTENT.DisposeChildren();

        //Change orientation
        $CONTENT.orientation = ORIENTATION.HORIZONTAL;

        //Add left grid
        var leftgrid = new uiframework.Grid();
        leftgrid.class += " canvasgrid";

        this.ShowCanvas(leftgrid);
        $CONTENT.Add(leftgrid);

        $CANVASGRID = leftgrid;

        var separator = new uiframework.Separator();
        $CONTENT.Add(separator);

        //Add right grid
        $RIGHTGRID = new uiframework.Grid();
        $RIGHTGRID.orientation = ORIENTATION.VERTICAL;

        if (uiframework.device === DEVICE.LANDSCAPETABLET) {
            $RIGHTGRID.fixedsize = true;
            $RIGHTGRID.size = 420;
        }

        //Toolbar
        var toolbargrid = new uiframework.Toolbar();
        toolbargrid.class += " toolbar-property";
        toolbargrid.fixedsize = true;
        toolbargrid.size = 60;

        var toolbar = new uiframework.ToolbarButton("circle-o", "Section");
        toolbar.event = $CURRENTVIEW.ShowSection;
        if (!$CURRENTTABINDEX || $CURRENTTABINDEX === 0)
            toolbar.class += " highlight";
        toolbargrid.Add(toolbar);

        toolbar = new uiframework.ToolbarButton("tasks", "Properties");
        toolbar.event = $CURRENTVIEW.ShowProperties;
        if ($CURRENTTABINDEX === 1)
            toolbar.class += " highlight";
        toolbargrid.Add(toolbar);

        toolbar = new uiframework.ToolbarButton("play-circle", "Design");
        toolbar.event = $CURRENTVIEW.ShowDesignResult;
        if ($CURRENTTABINDEX === 3)
            toolbar.class += " highlight";
        toolbargrid.Add(toolbar);

        toolbar = new uiframework.ToolbarButton("file-text-o", "Report");
        toolbar.event = $CURRENTVIEW.ShowReport;
        if ($CURRENTTABINDEX === 2)
            toolbar.class += " highlight";
        toolbargrid.Add(toolbar);

        //toolbar = new uiframework.ToolbarButton("share-alt", "Share");
        //toolbar.event = $SECTIONVIEW.Share;
        //toolbargrid.Add(toolbar);

        $RIGHTGRID.Add(toolbargrid);
        $RIGHTGRID.Add(new uiframework.Separator());

        //Properties
        var propertygrid = new uiframework.Grid();
        $PROPERTYGRID = new uiframework.Container();
        $PROPERTYGRID.Bind($MODEL.sections, $SECTIONVIEW.Update);
        propertygrid.Add($PROPERTYGRID);

        $RIGHTGRID.Add(propertygrid);
        $CONTENT.Add($RIGHTGRID);

        //Show back button
        this.ShowBackButton();

        //Display content
        $CONTENT.Show();

        $SECTIONVIEW.LoadTab();

        if ($SETTINGS.UpdateCSS)
            $SETTINGS.UpdateCSS();

        //Resize
        $APPLICATION.Refresh();
        $CANVAS.ZoomAll();

        if ($APPLICATION.externalapp) {
            var toolbar = new uiframework.ToolbarButton(undefined, "OK", "");
            toolbar.class += " external top";
            toolbar.highlight = false;
            toolbar.toggle = true;
            toolbar.event = $CURRENTVIEW.SendToParent;
            toolbar.Show();
        }


    };

    this.PortraitMobile = function () {
        //Change orientation
        $CONTENT.orientation = ORIENTATION.VERTICAL;
        $MODEL.sections.section.showlocalaxis = false;
        $MODEL.sections.section.UpdateMesh();
        //Show section
        if ($ACTIVEPORTRAITVIEW)
            $ACTIVEPORTRAITVIEW();
        else {
            this.LoadTab();
        }

        //Show bottom toolbar
        this.ShowBottomToolbar();

        //Show back button
        this.ShowBackButton();

        //Resize
        $APPLICATION.Refresh();
        $CANVAS.ZoomAll();
    };

    this.PortraitTablet = function () {
        $SECTIONVIEW.PortraitMobile();
    };

    this.Update = function (parent, sender) {
        if (parent.name === "Design Option") {
            $PROPERTYGRID.DisposeChildren();

            var section = $MODEL.sections;
            section.UpdateProperties();

            if (section.designoption.value === BEAMDESIGNOPTION.INVESTIGATE)
                section.showrebars = true;
            else
                section.showrebars = false;

            section.showlocalaxis = false;
            section.UpdateMesh();

            $MODEL.sections.section.showlocalaxis = false;
            $MODEL.sections.section.UpdateMesh();

            $CANVAS.Render();

            $PROPERTYGRID.Bind(section, $CURRENTVIEW.Update);
            $PROPERTYGRID.Show();
        } else {
            var section = $MODEL.sections;
            section.UpdateProperties();

            if (section.designoption.value === BEAMDESIGNOPTION.INVESTIGATE)
                section.showrebars = true;
            else
                section.showrebars = false;

            section.UpdateMesh();

            $MODEL.sections.section.showlocalaxis = false;
            $MODEL.sections.section.UpdateMesh();
            $CANVAS.Render();

            $APPLICATION.RefreshCanvas();
        }

        $DESIGN = undefined;
    };

    this.LoadTab = function () {
        if ($CURRENTTABINDEX === 1)
            $SECTIONVIEW.ShowProperties();
        else if ($CURRENTTABINDEX === 2)
            $SECTIONVIEW.ShowReport();
        else if ($CURRENTTABINDEX === 3)
            $SECTIONVIEW.ShowDesignResult();
        else
            $SECTIONVIEW.ShowSection();
    };

    this.ShowCanvas = function (container) {
        var canvasgrid = new uiframework.Grid();
        canvasgrid.class += " canvasgrid";

        $CANVASGRID = canvasgrid;

        $CANVAS = new uicanvas2d();
        $CANVAS.hasborder = false;
        $CANVAS.settings.SHOWRULER = false;

        $MODEL.sections.section.showlocalaxis = false;
        $MODEL.sections.section.UpdateMesh();

        $CANVAS.model = new uicanvas2dmodel();
        $CANVAS.model.Add($MODEL.sections);

        canvasgrid.Add($CANVAS);
        container.Add(canvasgrid);
    };

    this.ShowDimensions = function (container) {
        var grid = new uiframework.Grid();

        var con = new uiframework.Container();
        con.Bind($MODEL.sections, $SECTIONVIEW.Update);

        $PROPERTYGRID = con;

        grid.Add(con);
        container.Add(grid);
    };

    this.SendToParent = function () {
        var object = {};
        var $ACTIVEOBJECT = $APPLICATION.currentsection;
        var beamprop;// = $MODEL.stressplot;

        var name = $APPLICATION.name.split("<br/>").join(" ");

        //Get Section Properties
        object = {
            name: name,
            id: $ACTIVEOBJECT.id,
            w: $ACTIVEOBJECT.w,
            h: $ACTIVEOBJECT.h,
            x0: $ACTIVEOBJECT.x0,
            y0: $ACTIVEOBJECT.y0,
            x: $ACTIVEOBJECT.x,
            y: $ACTIVEOBJECT.y,
            totalwidth: $ACTIVEOBJECT.totalwidth,
            totalheight: $ACTIVEOBJECT.totalheight
        };

        if ($ACTIVEOBJECT.tw)
            object.tw = $ACTIVEOBJECT.tw;

        if ($ACTIVEOBJECT.tw1)
            object.tw1 = $ACTIVEOBJECT.tw1;

        if ($ACTIVEOBJECT.tw2)
            object.tw2 = $ACTIVEOBJECT.tw2;

        if ($ACTIVEOBJECT.tf)
            object.tf = $ACTIVEOBJECT.tf;

        if ($ACTIVEOBJECT.tf1)
            object.tf1 = $ACTIVEOBJECT.tf1;

        if ($ACTIVEOBJECT.tf2)
            object.tf2 = $ACTIVEOBJECT.tf2;

        if ($ACTIVEOBJECT.lf1)
            object.lf1 = $ACTIVEOBJECT.lf1;

        if ($ACTIVEOBJECT.lf2)
            object.lf2 = $ACTIVEOBJECT.lf2;

        if ($ACTIVEOBJECT.wf)
            object.wf = $ACTIVEOBJECT.wf;

        if ($ACTIVEOBJECT.wt)
            object.wt = $ACTIVEOBJECT.wt;

        if ($ACTIVEOBJECT.wb)
            object.wb = $ACTIVEOBJECT.wb;

        if ($ACTIVEOBJECT.wp)
            object.wp = $ACTIVEOBJECT.wp;

        if ($ACTIVEOBJECT.wBot)
            object.wBot = $ACTIVEOBJECT.wBot;

        if ($ACTIVEOBJECT.wTop)
            object.wTop = $ACTIVEOBJECT.wTop;

        if ($ACTIVEOBJECT.wbot)
            object.wbot = $ACTIVEOBJECT.wbot;

        if ($ACTIVEOBJECT.wtop)
            object.wtop = $ACTIVEOBJECT.wtop;

        if ($ACTIVEOBJECT.tfBot)
            object.tfBot = $ACTIVEOBJECT.tfBot;

        if ($ACTIVEOBJECT.tfTop)
            object.tfTop = $ACTIVEOBJECT.tfTop;

        if ($ACTIVEOBJECT.g)
            object.g = $ACTIVEOBJECT.g;

        if ($ACTIVEOBJECT.a)
            object.a = $ACTIVEOBJECT.a;

        if ($ACTIVEOBJECT.aoffset)
            object.aoffset = $ACTIVEOBJECT.aoffset;

        if ($ACTIVEOBJECT.n)
            object.n = $ACTIVEOBJECT.n;

        if ($ACTIVEOBJECT.r)
            object.r = $ACTIVEOBJECT.r;

        if ($ACTIVEOBJECT.t)
            object.t = $ACTIVEOBJECT.t;

        if ($ACTIVEOBJECT.theta)
            object.theta = $ACTIVEOBJECT.theta;

        //Get Stress Properties
        for (var y in beamprop) {
            if (beamprop[y].value !== undefined)
                object[y] = beamprop[y].value;
        }

        window.parent.data = JSON.stringify(object);
        window.parent.ExternalAppCallBack();
    };

    this.ShowBackButton = function () {
        var button = $VIEW.appbutton;
        button.SetText($APPLICATION.sectionname);
        button.SetIcon("chevron-left");
        button.event = $APPLICATION.ShowMainView;
    };

    this.ShowBottomToolbar = function () {
        if (uiframework.device !== DEVICE.LANDSCAPETABLET) {
            $VIEW.bottomtoolbar.DisposeChildren();
            $VIEW.ShowBottomToolbar();

            var toolbar = new uiframework.ToolbarButton("circle-o", "Section", "Update Dimension");
            toolbar.event = $SECTIONVIEW.ShowSection;
            if (!$CURRENTTABINDEX || $CURRENTTABINDEX === 0)
                toolbar.class += " highlight";
            toolbar.data = "section";
            $VIEW.bottomtoolbar.Add(toolbar);

            toolbar = new uiframework.ToolbarButton("tasks", "Properties", "Section Properties");
            toolbar.event = $SECTIONVIEW.ShowProperties;
            if ($CURRENTTABINDEX === 1)
                toolbar.class += " highlight";
            toolbar.data = "property";
            $VIEW.bottomtoolbar.Add(toolbar);

            toolbar = new uiframework.ToolbarButton("play-circle", "Design", "Design");
            toolbar.event = $SECTIONVIEW.ShowDesignResult;
            if ($CURRENTTABINDEX === 3)
                toolbar.class += " highlight";
            toolbar.data = "design";
            $VIEW.bottomtoolbar.Add(toolbar);

            if ($APPLICATION.externalapp) {
                toolbar = new uiframework.ToolbarButton(undefined, "OK", "");
                toolbar.class += " external";
                toolbar.highlight = false;
                toolbar.toggle = true;
                toolbar.event = $CURRENTVIEW.SendToParent;
                $VIEW.bottomtoolbar.Add(toolbar);
            } else {
                toolbar = new uiframework.ToolbarButton("file-text-o", "Report", "View Report");
                toolbar.event = $SECTIONVIEW.ShowReport;
                if ($CURRENTTABINDEX === 2)
                    toolbar.class += " highlight";
                toolbar.data = "report";
                $VIEW.bottomtoolbar.Add(toolbar);
            }

            this.LoadTab();

            $VIEW.bottomtoolbar.Show();

            if ($APPLICATION.externalapp)
                $VIEW.bottomtoolbar.object.addClass("external");
            else
                $VIEW.bottomtoolbar.object.removeClass("external");

            $VIEW.Resize();
        }
    };

    this.ShowSection = function () {
        common.HideLoadingCursor();
        common.ShowLoadingCursor(true);

        $CURRENTTABINDEX = 0;

        var canvastoolbar = new uiframework.Toolbar();
        canvastoolbar.highlight = false;

        //        var button = new uiframework.ToolbarButton("refresh", "");
        //        button.event = function () {
        //            $APPLICATION.Refresh();
        //            $MODEL.sections.section.Reset();
        //
        //            $APPLICATION.SetSectionDefaultValues($MODEL.sections.section);
        //            $MODEL.sections.Calculate();
        //            $MODEL.sections.section.UpdateMesh();
        //
        //            $SECTIONVIEW.LoadTab();
        //
        //            $CANVAS.ZoomAll();
        //        };
        //        canvastoolbar.Add(button);

        var button = new uiframework.ToolbarButton("frame/zoomall.png", "");
        button.event = function () {
            $APPLICATION.Refresh();
            $CANVAS.ZoomAll();
        };
        canvastoolbar.Add(button);

        $ACTIVEPORTRAITVIEW = $SECTIONVIEW.ShowSection;

        if ($SECTIONVIEW.device === DEVICE.PORTRAITMOBILE || $SECTIONVIEW.device === DEVICE.PORTRAITTABLET) {

            //Remove content
            $CONTENT.DisposeChildren();

            $MODEL.sections.section.showlocalaxis = false;
            $MODEL.sections.section.UpdateMesh();

            //Show canvas
            $SECTIONVIEW.ShowCanvas($CONTENT);

            $CONTENT.Add(new uiframework.Separator());

            //Show dimension property grid
            $SECTIONVIEW.ShowDimensions($CONTENT);

            //Show content
            $CONTENT.Show();

            if ($CANVASGRID) {
                canvastoolbar.Load($CANVASGRID.object);
                $CANVASGRID.Show();
            }

            //Resize
            $APPLICATION.Refresh();

            $CANVAS.model = new uicanvas2dmodel();
            $CANVAS.model.Add($MODEL.sections);

            $CANVAS.ZoomAll();

            $SECTIONIMAGE = $CANVAS.GetImageURL();

        } else {
            $CANVASGRID.DisposeChildren();

            $CANVAS = new uicanvas2d();
            $CANVAS.hasborder = false;
            $CANVAS.settings.SHOWRULER = false;

            $CANVAS.model = new uicanvas2dmodel();
            $CANVAS.model.Add($MODEL.sections);
            $CANVASGRID.Add($CANVAS);

            if ($CANVASGRID) {
                canvastoolbar.Load($CANVASGRID.object);
                $CANVASGRID.Show();
            }

            //Resize right grid
            $RIGHTGRID.size = 420;

            //Remove content
            $PROPERTYGRID.DisposeChildren();

            //Display properties
            $PROPERTYGRID.Bind($MODEL.sections, $SECTIONVIEW.Update);

            //Show content
            $PROPERTYGRID.Show();

            //Resize
            $APPLICATION.Refresh();

            $CANVAS.ZoomAll();
            $SECTIONIMAGE = $CANVAS.GetImageURL();
        }

        common.HideLoadingCursor();
    };

    this.ShowProperties = function () {
        common.HideLoadingCursor();
        common.ShowLoadingCursor(true);

        $SECTIONVIEW.ClearSectionProperties();
        $CURRENTTABINDEX = 1;

        var canvastoolbar = new uiframework.Toolbar();
        canvastoolbar.highlight = false;

        var button = new uiframework.ToolbarButton("frame/zoomall.png", "");
        button.event = function () {
            $APPLICATION.Refresh();
            $CANVAS.ZoomAll();
        };
        canvastoolbar.Add(button);

        $ACTIVEPORTRAITVIEW = $SECTIONVIEW.ShowProperties;

        if ($SECTIONVIEW.device === DEVICE.PORTRAITMOBILE || $SECTIONVIEW.device === DEVICE.PORTRAITTABLET) {

            //Remove content
            $CONTENT.DisposeChildren();

            var container = new uiframework.Container();

            $SECTIONVIEW.CalculateSectionProperties();
            container.Bind($MODEL.sections.properties);

            $CONTENT.Add(container);

            $PROPERTYGRID = container;

            //Show content
            $CONTENT.Show();

            //Resize
            $APPLICATION.Refresh();

            var points = $MODEL.sections.section.GetMesh();
            var mesh = JSON.stringify({ "mesh": points, "type": "section" });

            APICall(APICallType.POST, $SERVER, function (data) {
                if (data.status === 404) {
                    $SECTIONVIEW.PropertiesNotComputed();
                } else {
                    $SECTIONVIEW.UpdateSectionProperties(data);
                }
            }, mesh);
        } else {
            $CANVASGRID.DisposeChildren();

            $CANVAS = new uicanvas2d();
            $CANVAS.hasborder = false;
            $CANVAS.settings.SHOWRULER = false;

            $CANVAS.model = new uicanvas2dmodel();
            $CANVAS.model.Add($MODEL.sections);
            $CANVASGRID.Add($CANVAS);

            if ($CANVASGRID) {
                canvastoolbar.Load($CANVASGRID.object);
                $CANVASGRID.Show();
            }

            //Resize right grid
            $RIGHTGRID.size = 420;

            //Remove content
            $PROPERTYGRID.DisposeChildren();

            //Display properties
            $SECTIONVIEW.CalculateSectionProperties();
            $PROPERTYGRID.Bind($MODEL.sections.properties);

            //Show content
            $PROPERTYGRID.Show();

            //Resize
            $APPLICATION.Refresh();

            $CANVAS.ZoomAll();
            $SECTIONIMAGE = $CANVAS.GetImageURL();

            var points = $MODEL.sections.section.GetMesh();
            var mesh = JSON.stringify({ "mesh": points, "type": "section" });

            APICall(APICallType.POST, $SERVER, function (data) {
                if (data.status === 404) {
                    $SECTIONVIEW.PropertiesNotComputed();
                } else {
                    $SECTIONVIEW.UpdateSectionProperties(data);
                }
            }, mesh);
        }

        common.HideLoadingCursor();
    };

    this.ShowDesignResult = function () {
        common.HideLoadingCursor();
        common.ShowLoadingCursor(true);

        $SECTIONVIEW.ClearSectionProperties();
        $SECTIONVIEW.CalculateSectionProperties();
        $CURRENTTABINDEX = 3;

        var points = $MODEL.sections.section.GetMesh();
        var mesh = JSON.stringify({ "mesh": points, "type": "section" });

        APICall(APICallType.POST, $SERVER, function (data) {
            var canvastoolbar = new uiframework.Toolbar();
            canvastoolbar.highlight = false;

            var button = new uiframework.ToolbarButton("frame/zoomall.png", "");
            button.event = function () {
                $APPLICATION.Refresh();
                $CANVAS.ZoomAll();
            };
            canvastoolbar.Add(button);

            $ACTIVEPORTRAITVIEW = $SECTIONVIEW.ShowDesignResult;

            if ($SECTIONVIEW.device === DEVICE.PORTRAITMOBILE || $SECTIONVIEW.device === DEVICE.PORTRAITTABLET) {

                //Remove content
                $CONTENT.DisposeChildren();

                var container = new uiframework.Container();
                $CONTENT.Add(container);

                $PROPERTYGRID = container;
                $SECTIONVIEW.LoadDesignResults($PROPERTYGRID);

                //Show content
                $CONTENT.Show();

                //Resize
                $APPLICATION.Refresh();
                $CANVAS.ZoomAll();

            } else {
                $CANVASGRID.DisposeChildren();

                $CANVAS = new uicanvas2d();
                $CANVAS.hasborder = false;
                $CANVAS.settings.SHOWRULER = false;

                $CANVAS.model = new uicanvas2dmodel();
                $CANVAS.model.Add($MODEL.sections);
                $CANVASGRID.Add($CANVAS);

                if ($CANVASGRID) {
                    canvastoolbar.Load($CANVASGRID.object);
                    $CANVASGRID.Show();
                }

                //Resize right grid
                $RIGHTGRID.size = 420;

                //Remove content
                $PROPERTYGRID.DisposeChildren();
                $SECTIONVIEW.LoadDesignResults($PROPERTYGRID);

                $PROPERTYGRID.Show();

                //Resize
                $APPLICATION.Refresh();

                $CANVAS.ZoomAll();
            }

            common.HideLoadingCursor();
        }, mesh);
    };

    this.LoadDesignResults = function (container) {
        //Display properties
        var design;

        if ($DESIGN) {
            design = $DESIGN;
        } else {
            if ($MODEL.sections.designoption.value === BEAMDESIGNOPTION.DESIGN)
                design = DesignBeam($MODEL.sections);
            else {
                $SECTIONVIEW.CalculateSectionProperties();
                design = InvestigateBeam($MODEL.sections);
            }

            $DESIGN = design;
        }

        $MODEL.sections.showrebars = true;
        $MODEL.sections.UpdateMesh();

        $MODEL.sections.section.showlocalaxis = false;
        $MODEL.sections.section.UpdateMesh();

        if (container)
            container.Bind(design, $CURRENTVIEW.UpdateRebars);
    };

    this.UpdateRebars = function (parent) {
        var section = $MODEL.sections;

        switch (parent.location) {
            case "bottom":
                section.botbar.nobars = parent.value.value.nbar;
                section.botbar.barsize = GetRebarSize(parent.value.value.sbar);
                break;

            case "top":
                section.topbar.nobars = parent.value.value.nbar;
                section.topbar.barsize = GetRebarSize(parent.value.value.sbar);
                break;

            case "web":
                section.webbar.nobars = parent.value.value.nbar;
                section.webbar.barsize = GetRebarSize(parent.value.value.sbar);
                break;
        }

        section.UpdateMesh();

        $MODEL.sections.section.showlocalaxis = false;
        $MODEL.sections.section.UpdateMesh();

        $CANVAS.Render();
    };

    this.CalculateSectionProperties = function () {
        var properties;

        if ($MODEL.sections instanceof uicanvas2dgraphics.RCRectangle) {
            var section = new sectionrectangle($MODEL.sections);
            section.Calculate();
            properties = section;

            $MODEL.sections.properties = properties;

        } else if ($MODEL.sections instanceof uicanvas2dgraphics.RCTee) {
            var section = new sectiontee($MODEL.sections);
            section.Calculate();
            properties = section;

            $MODEL.sections.properties = properties;

        } else if ($MODEL.sections instanceof uicanvas2dgraphics.RCAngle) {
            var section = new sectionangletop($MODEL.sections);
            section.Calculate();
            properties = section;

            $MODEL.sections.properties = properties;
        }

        if ($MODEL.sections.properties.sheararea22_.remarks !== "")
            $MODEL.sections.properties.sheararea22_.remarks = "Computing...";

        if ($MODEL.sections.properties.sheararea33_.remarks !== "")
            $MODEL.sections.properties.sheararea33_.remarks = "Computing...";

        if ($MODEL.sections.properties.torsionalJ_.remarks !== "")
            $MODEL.sections.properties.torsionalJ_.remarks = "Computing...";

        if ($MODEL.sections.properties.z2_.remarks !== "")
            $MODEL.sections.properties.z2_.remarks = "Computing...";

        if ($MODEL.sections.properties.z3_.remarks !== "")
            $MODEL.sections.properties.z3_.remarks = "Computing...";

        return properties;
    };

    this.PropertiesNotComputed = function () {
        if ($MODEL.sections.sheararea22_.value === 0)
            $MODEL.sections.sheararea22_.remarks = "Not Computed";

        if ($MODEL.sections.sheararea33_.value === 0)
            $MODEL.sections.sheararea33_.remarks = "Not Computed";

        if ($MODEL.sections.torsionalJ_.value === 0)
            $MODEL.sections.torsionalJ_.remarks = "Not Computed";

        $MODEL.sections.z2_.remarks = "Not Computed";
        $MODEL.sections.z3_.remarks = "Not Computed";

        $MODEL.sections.sheararea22_.Refresh();
        $MODEL.sections.sheararea33_.Refresh();
        $MODEL.sections.torsionalJ_.Refresh();
        $MODEL.sections.z2_.Refresh();
        $MODEL.sections.z3_.Refresh();

        //        $PROPERTYGRID.DisposeChildren();
        //        $PROPERTYGRID.Bind($MODEL.sections);
        //        //Show content
        //        $PROPERTYGRID.Show();
        //Resize
        $APPLICATION.Refresh();

    };

    this.ClearSectionProperties = function () {
        if ($MODEL.sections.sheararea22_) {
            $MODEL.sections.sheararea22_.value = 0;
            $MODEL.sections.sheararea22_.remarks = "Not Computed";

            $MODEL.sections.sheararea33_.value = 0;
            $MODEL.sections.sheararea33_.remarks = "Not Computed";

            $MODEL.sections.torsionalJ_.value = 0;
            $MODEL.sections.torsionalJ_.remarks = "Not Computed";

            $MODEL.sections.z2_.value = 0;
            $MODEL.sections.z2_.remarks = "Not Computed";

            $MODEL.sections.z3_.value = 0;
            $MODEL.sections.z3_.remarks = "Not Computed";
        }
    };

    this.UpdateSectionProperties = function (data, hide) {
        if (data.SAx && data.SAx !== -1 && common.IsZero($MODEL.sections.properties.sheararea22_.value)) {
            $MODEL.sections.properties.sheararea22_.value = data.SAx;
            $MODEL.sections.properties.sheararea22_.remarks = "";

        } else if ($MODEL.sections.properties.sheararea22_ && $MODEL.sections.properties.sheararea22_.value === 0)
            $MODEL.sections.properties.sheararea22_.remarks = "Not Computed";

        if (data.SAy && data.SAy !== -1 && common.IsZero($MODEL.sections.properties.sheararea33_.value)) {
            $MODEL.sections.properties.sheararea33_.value = data.SAy;
            $MODEL.sections.properties.sheararea33_.remarks = "";

        } else if ($MODEL.sections.properties.sheararea33_ && $MODEL.sections.properties.sheararea33_.value === 0)
            $MODEL.sections.properties.sheararea33_.remarks = "Not Computed";

        if (data.TorJ && data.TorJ !== -1 && common.IsZero($MODEL.sections.properties.torsionalJ_.value)) {
            $MODEL.sections.properties.torsionalJ_.value = data.TorJ;
            $MODEL.sections.properties.torsionalJ_.remarks = "";

        } else if ($MODEL.sections.properties.torsionalJ_ && $MODEL.sections.properties.torsionalJ_.value === 0)
            $MODEL.sections.properties.torsionalJ_.remarks = "Not Computed";

        if (data.PlasticZy && data.PlasticZy !== -1 && common.IsZero($MODEL.sections.properties.z2_.value)) {
            $MODEL.sections.properties.z2_.value = data.PlasticZx;
            $MODEL.sections.properties.z2_.remarks = "";

        } else if ($MODEL.sections.properties.z2_ && $MODEL.sections.properties.z2_.value === 0)
            $MODEL.sections.properties.z2_.remarks = "Not Computed";

        if (data.PlasticZx && data.PlasticZx !== -1 && common.IsZero($MODEL.sections.properties.z3_.value)) {
            $MODEL.sections.properties.z3_.value = data.PlasticZy;
            $MODEL.sections.properties.z3_.remarks = "";

        } else if ($MODEL.sections.properties.z3_ && $MODEL.sections.properties.z3_.value === 0)
            $MODEL.sections.properties.z3_.remarks = "Not Computed";

        if ($CURRENTTABINDEX === 1) {
            if (!hide) {
                //                $PROPERTYGRID.DisposeChildren();
                //                $PROPERTYGRID.Bind($MODEL.sections.properties);
                //
                //                //Show content
                //                $PROPERTYGRID.Show();

                if ($MODEL.sections.sheararea22_)
                    $MODEL.sections.sheararea22_.Refresh();

                if ($MODEL.sections.sheararea33_)
                    $MODEL.sections.sheararea33_.Refresh();

                if ($MODEL.sections.torsionalJ_)
                    $MODEL.sections.torsionalJ_.Refresh();

                if ($MODEL.sections.z2_)
                    $MODEL.sections.z2_.Refresh();

                if ($MODEL.sections.z3_)
                    $MODEL.sections.z3_.Refresh();
            }
        }

        //Resize
        $APPLICATION.Refresh();
    };

    this.ShowReport = function () {
        common.HideLoadingCursor();
        common.ShowLoadingCursor(true);

        var maxWidth = 0;
        var gridWidth = 0;
        var propcatOffset = 0;

        $SECTIONVIEW.ClearSectionProperties();
        $CURRENTTABINDEX = 2;

        var canvastoolbar = new uiframework.Toolbar();
        canvastoolbar.highlight = false;

        var button = new uiframework.ToolbarButton("frame/zoomall.png", "");
        button.event = function () {
            $APPLICATION.Refresh();
            $CANVAS.ZoomAll();
        };
        canvastoolbar.Add(button);
        $ACTIVEPORTRAITVIEW = $SECTIONVIEW.ShowReport;

        if ($SECTIONVIEW.device === DEVICE.PORTRAITMOBILE || $SECTIONVIEW.device === DEVICE.PORTRAITTABLET) {

            //Remove content
            $CONTENT.DisposeChildren();

            //Show report
            $CONTENT.Add($SECTIONVIEW.GenerateReport());

            //Show content
            $CONTENT.Show();

            //Resize
            $APPLICATION.Refresh();

            var reportcontainer = $($CONTENT.object);
            jqMath.parseMath(reportcontainer[0]);

            gridWidth = window.outerWidth;

        } else {
            $CANVASGRID.DisposeChildren();

            $CANVAS = new uicanvas2d();
            $CANVAS.hasborder = false;
            $CANVAS.settings.SHOWRULER = false;

            $CANVAS.model = new uicanvas2dmodel();
            $CANVAS.model.Add($MODEL.sections);
            $CANVASGRID.Add($CANVAS);

            if ($CANVASGRID) {
                canvastoolbar.Load($CANVASGRID.object);
                $CANVASGRID.Show();
            }

            //Resize right grid
            var w = window.innerWidth;

            if (w > 1000)
                $RIGHTGRID.size = 700;
            else
                $RIGHTGRID.size = w;

            //Remove content
            $PROPERTYGRID.DisposeChildren();

            //Display properties
            $PROPERTYGRID.Add($SECTIONVIEW.GenerateReport());

            //Show content
            $PROPERTYGRID.Show();

            //Resize
            $APPLICATION.Refresh();

            var reportcontainer = $($CONTENT.object);
            jqMath.parseMath(reportcontainer[0]);

            $CANVAS.ZoomAll();
            $SECTIONIMAGE = $CANVAS.GetImageURL();

            gridWidth = window.outerWidth / 2;
        }

        $('mrow').each(function () {
            var itemWidth = $(this).outerWidth(true);
            maxWidth = Math.max(maxWidth, itemWidth);
        });

        if (maxWidth >= gridWidth) {
            propcatOffset = 15;
            $(".report-container .property-category").css('width', maxWidth + propcatOffset);
        }

        common.HideLoadingCursor();
    };

    this.GenerateReport = function () {
        var design;

        if ($DESIGN) {
            design = $DESIGN;

        } else {
            if ($MODEL.sections.designoption.value === BEAMDESIGNOPTION.DESIGN)
                design = DesignBeam($MODEL.sections);
            else {
                $SECTIONVIEW.CalculateSectionProperties();
                design = InvestigateBeam($MODEL.sections);
            }

            $DESIGN = design;
        }

        var container = new uiframework.ReportContainer();
        $REPORTCONTAINER = container;

        $SECTIONVIEW.UpdateReports(design, $REPORTCONTAINER);

        return container;
    };

    this.UpdateReports = function (design, container) {
        var properties = design;
        var report = new reporting();

        for (var name in properties)
            if (properties[name] !== undefined && properties[name].Load !== undefined) {
                if (properties[name].visible) {
                    if (properties[name] instanceof uiframework.PropertyCategory)
                        container.Add(new report.Paragraph(properties[name].name, REPORTINGSTYLE.HEADER1));

                    else if (properties[name] instanceof uiframework.PropertyDouble) {
                        properties[name].GenerateEquation();
                        container.Add(new report.Paragraph(properties[name].name, REPORTINGSTYLE.BOLD));

                        if (properties[name].equations.length !== 0) {
                            for (var i = 0; i < properties[name].equations.length; i++) {
                                container.Add(new report.Paragraph(properties[name].equations[i], REPORTINGSTYLE.TABLETEXT));
                            }
                        } else {
                            if (properties[name].remarks === "")
                                container.Add(new report.Paragraph(properties[name].name + " = " + properties[name].value, REPORTINGSTYLE.TABLETEXT));
                            else
                                container.Add(new report.Paragraph(properties[name].remarks, REPORTINGSTYLE.TABLETEXT));
                        }
                    }
                }
            }
    };

    this.Share = function () {
        //Calculate section
        $CANVAS.ZoomAll();
        $SECTIONIMAGE = $CANVAS.GetImageURL();

        $SECTIONVIEW.GenerateReport();
        $MODEL.sections.Calculate();

        common.GeneratePDFReport($MODEL.sections);
    };
};