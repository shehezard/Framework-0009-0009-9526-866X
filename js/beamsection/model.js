/* global uiframework, structuralmaterials, common, DIMENSIONLABELLOCATION, $APPCODE, $SETTINGS, REBARSET, ASTM, METRIC, IMPERIAL, UNIT, DIGITS, DIGITSYMBOL, DISPLAYUNIT, CODE */

var model = function (settingsevent) {
    this.Initialize = function () {
        this.InitializeSettings();

        //Load Sections
        this.LoadSettings();
    };

    this.InitializeSettings = function () {
        this.settings = new modelsettings(settingsevent);
        this.settings.Initialize(true);
    };

    this.LoadSettings = function () {
        common.LoadSettings($APPCODE + ".settings", this.settings);

        //Rebar
        switch (this.settings.rebarset.value.value) {
            case 0:
                this.settings.rebarset.value.rebar = ASTM;
                break;

            case 1:
                this.settings.rebarset.value.rebar = METRIC;
                break;

            case 2:
                this.settings.rebarset.value.rebar = IMPERIAL;
                break;
        }

        //Initialize Unit Settings
        common.unit.Initialize(this.settings.unit.value);
    };

    this.SaveSettings = function () {
        common.SaveSettings($APPCODE + ".settings", this.settings);
    };

    this.Initialize();
};

var modelsettings = function (event) {
    this.event = event;

    this.Initialize = function () {
        this.settings = new uiframework.PropertyCategory("General");
        this.unit = new uiframework.PropertyEnum("Unit Standard", UNIT.SI, UNIT);
        this.unit.height = 136;
        this.designcode = new uiframework.PropertyEnum("Design Code", CODE.ACI318_14, CODE);
        this.designcode.height = 183;

        this.formatting = new uiframework.PropertyCategory("Number Format");
        this.nodigits = new uiframework.PropertyEnum("Decimal Places", DIGITS.TWO, DIGITS);
        this.digitsymbol = new uiframework.PropertyEnum("Number Separator", DIGITSYMBOL.COMMA, DIGITSYMBOL);
        this.digitsymbol.height = 191;
        this.showexponent = new uiframework.PropertyBoolean("Show Exponent", false);

        //this.others = new uiframework.PropertyCategory("Others");
        this.displayunit = new uiframework.PropertyEnum("Unit Location", DISPLAYUNIT.LEFT, DISPLAYUNIT);
        this.displayunit.visible = false;

        this.rebaroptions = new uiframework.PropertyCategory("Rebar");
        this.rebarset = new uiframework.PropertyEnum("Rebar Set", REBARSET.Metric, REBARSET);
        this.rebarset.height = 191;
        this.rebarset.updateevent = this.event;

        switch (this.rebarset.value.value) {
            case REBARSET.ASTM.value:
                this.smallestbar = new uiframework.PropertyEnum("Smallest Bar", ASTM.No3, ASTM);
                this.largestbar = new uiframework.PropertyEnum("Largest Bar", ASTM.No11, ASTM);
                this.hangarbarenum = ASTM;
                this.hangarbarenumvalue = ASTM.No4;
                break;
            case REBARSET.Metric.value:
                this.smallestbar = new uiframework.PropertyEnum("Smallest Bar", METRIC.d8, METRIC);
                this.largestbar = new uiframework.PropertyEnum("Largest Bar", METRIC.d28, METRIC);
                this.hangarbarenum = METRIC;
                this.hangarbarenumvalue = METRIC.d12;
                break;
            case REBARSET.Imperial.value:
                this.smallestbar = new uiframework.PropertyEnum("Smallest Bar", IMPERIAL.d1_4, IMPERIAL);
                this.largestbar = new uiframework.PropertyEnum("Largest Bar", IMPERIAL.d11_8, IMPERIAL);
                this.hangarbarenum = IMPERIAL;
                this.hangarbarenumvalue = IMPERIAL.d1_2;
                break;
        }

        this.minbars = new uiframework.PropertyInteger("Minimum Bars", 2);
        this.maxbars = new uiframework.PropertyInteger("Maximum Bars", 20);
        this.minbarspacing = new uiframework.PropertyDouble("Minimum Bar Spacing", 20, common.unit.length);
        this.maxmixbars = new uiframework.PropertyBoolean("Show Mixed Bars", false);
        this.maxmixbars.visible = false;
        this.distributelongbars = new uiframework.PropertyBoolean("Distribute Longitudinal Bars", false);

        this.stirrupoptions = new uiframework.PropertyCategory("Stirrup");
        this.minstirrupspacing = new uiframework.PropertyDouble("Minimum Stirrup Spacing", 20.0, common.unit.length);
        this.maxstirrupspacing = new uiframework.PropertyDouble("Maximum Stirrup Spacing", 400.0, common.unit.length);
        this.maxexcessarea = new uiframework.PropertyInteger("Maximum Excess Area", 20); //Percentage "%"
        this.maxexcessarea.ispercentage = true;

        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.minbarspacing, 1);
            common.RoundDimension(this.minstirrupspacing, 1);
            common.RoundDimension(this.maxstirrupspacing, 1);
        }

//        this.momentoptions = new uiframework.PropertyCategory("Moment Design");
//        this.hangarbar = new uiframework.PropertyBoolean("Provide Hangar Bars", true);
//        this.hangarbarsize = new uiframework.PropertyEnum("Hangar Bar Size", this.hangarbarenumvalue, this.hangarbarenum);
//        this.percentagebalsteel = new uiframework.PropertyInteger("Percentage of 'Balanced Steel'", 75); //Percentage "%"
//        this.percentagebalsteel.ispercentage = true;

//        this.shearoptions = new uiframework.PropertyCategory("Shear/Torsion Design");
//        this.concarea = new uiframework.PropertyEnum("Concrete Shear Area", AREASHEAR.WEB, AREASHEAR);
//        this.concarea.height = 145;


//        this.torsionstirrupoptions = new uiframework.PropertyCategory("Stirrups for Torsion");
//        this.torswebstirrups = new uiframework.PropertyBoolean("In the Web", true);
//        this.torstopflangestirrups = new uiframework.PropertyBoolean("In the Top Flange", false);
//        this.torsbotflangestirrups = new uiframework.PropertyBoolean("In the Bottom Flange", false);
    };

    this.Update = function () {
        switch (this.rebarset.value.value) {
            case REBARSET.ASTM.value:
                this.smallestbar.value = ASTM.No3;
                this.smallestbar.enums = ASTM;

                this.largestbar.value = ASTM.No11;
                this.largestbar.enums = ASTM;

                this.hangarbarsize.value = ASTM.No4;
                this.hangarbarsize.enums = ASTM;
                break;
            case REBARSET.Metric.value:
                this.smallestbar.value = METRIC.d8;
                this.smallestbar.enums = METRIC;

                this.largestbar.value = METRIC.d28;
                this.largestbar.enums = METRIC;

                this.hangarbarsize.value = METRIC.d12;
                this.hangarbarsize.enums = METRIC;
                break;
            case REBARSET.Imperial.value:
                this.smallestbar.value = IMPERIAL.d1_4;
                this.smallestbar.enums = IMPERIAL;

                this.largestbar.value = IMPERIAL.d11_8;
                this.largestbar.enums = IMPERIAL;

                this.hangarbarsize.value = IMPERIAL.d1_2;
                this.hangarbarsize.enums = IMPERIAL;
                break;
        }

        this.smallestbar.UpdateText();
        this.largestbar.UpdateText();
        this.hangarbarsize.UpdateText();
    };

    this.Format = function (value) {
        return common.FormatNumber(value, this);
    };
};