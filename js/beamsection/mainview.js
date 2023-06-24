/* global uiframework, DEVICE, $APPLICATION, $CONTENT, $VIEW, ORIENTATION, _counter */

var mainview = function (app, parent, sender, device) {
    uiframework.ViewBase.call(this, app, parent, sender, device);

    $CURRENTVIEW = this;

    this.LandscapeMobile = function () {
        this.PortraitMobile();
    };

    this.LandscapeTablet = function () {
        this.PortraitMobile();
    };

    this.PortraitMobile = function () {
        $VIEW.HideBottomToolbar();

        //Remove content
        $CONTENT.DisposeChildren();

        //Change orientation
        $CONTENT.orientation = ORIENTATION.VERTICAL;

        //Show list
        $CONTENT.Add(this.GenerateContent());

        //Reset app button
        $CURRENTVIEW.ResetAppButton();

        //Display content
        $CONTENT.Show();

        //Resize
        $APPLICATION.Refresh();
    };

    this.PortraitTablet = function () {
        this.PortraitMobile();
    };

    this.ResetAppButton = function () {
        var button = $VIEW.appbutton;
        button.Reset();
    };

    this.GenerateContent = function () {
        var container = new uiframework.Container();
        container.class += " beam-background";

        var view = new mainviewdetail($APPLICATION.sections);
        container.Add(view);
        return container;
    };
};

var mainviewdetail = function (sections) {
    uiframework.Base.call(this);

    this.class = "beam-view";
    this.sections = sections;

    this.Load = function (parent) {
        if (parent !== undefined)
            this.parent = parent;

        var content = this.GenerateContainer();

        //Append to parent, push to HTML DOM, for further processing.
        this.parent.append(content);

        var object = $("#" + this.id);
        var output = "";

        for (var i = 0; i < this.sections.length; i++) {
            output += "<div id='" + this.id + "-" + i + "' class='beam-view-section'><img src='icons/beamsection/" + this.sections[i][2] + "'><div class='beam-view-text'>" + this.sections[i][0] + "</div></div>";
        }

        object.append(output);

        var reference = this;

        $("#" + this.id + "-0").click(function () {
            $APPLICATION.UpdateType(reference.sections[0][0]);
        });

        $("#" + this.id + "-1").click(function () {
            $APPLICATION.UpdateType(reference.sections[1][0]);
        });

        $("#" + this.id + "-2").click(function () {
            $APPLICATION.UpdateType(reference.sections[2][0]);
        });
    };
};