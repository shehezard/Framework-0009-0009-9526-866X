/* global uiframework, common, UNITTYPELENGTH, UNITTYPEMOMENT, UNITTYPESTRESSPR, UNITTYPEFORWT, UNITTYPEAREA, BEAMDESIGNOPTION, uicanvas2dgraphics, $SETTINGS, RCRectangle, CODE, mixnbars, maxnbars, excess, minspacing, minbars, set, maxbars, width, width, numeral, REBARMODE */
/*DONE:
 * 1. ACI 318 [US Units]
 * 2. BS 8110 [SI Units]
 */
/*TODO's:
 * 1. Eurocode [SI Units]
 * 2. Check TODO's
 * 3. [Reporting] Need solution for unit conversion : SOLUTION === Reporting in building code units (limitation) && Final results in base units
 * 4. [BS 8110] Bug in US units
 */

var DesignBeam = function (section) {
    var design;

    if (section instanceof uicanvas2dgraphics.RCRectangle) {
        switch ($SETTINGS.designcode.value.value) {
            case CODE.ACI318_14.value:
                design = new sectionrectangleACI318_14(section);
                design.Calculate();
                break;

            case CODE.ACI318_11.value:
                design = new sectionrectangleACI318_11(section);
                design.Calculate();
                break;

            //            case CODE.EC2_2004.value:
            //                break;

            case CODE.BS8110_97.value:
                design = new sectionrectangleBS8110_97(section);
                design.Calculate();
                break;
        }
    } else {
        switch ($SETTINGS.designcode.value.value) {
            case CODE.ACI318_14.value:
                design = new sectionflangedACI318_11(section);
                design.Calculate();
                break;

            case CODE.ACI318_11.value:
                design = new sectionflangedACI318_14(section);
                design.Calculate();
                break;

            //            case CODE.EC2_2004.value:
            //                break;

            case CODE.BS8110_97.value:
                design = new sectionflangedBS8110_97(section);
                design.Calculate();
                break;
        }
    }

    return design;
};

var sectionrcdesign = function () {
    this.Format = function (value) {
        value = numeral(value).format("0.0000");
        return value;
    };

    this.remarks_ = new uiframework.PropertyDouble("Remarks", 0);
    this.remarks_.showindesign = false;

    this.cat1 = new uiframework.PropertyCategory("Design Actions");

    this.moment_ = new uiframework.PropertyDouble("Moment, M<sub>u</sub>", 0, common.unit.moment);
    this.moment_.readonly = true;

    this.shear_ = new uiframework.PropertyDouble("Shear, V<sub>u</sub>", 0, common.unit.force);
    this.shear_.readonly = true;

    this.torsion_ = new uiframework.PropertyDouble("Torsion, T<sub>u</sub>", 0, common.unit.moment);
    this.torsion_.readonly = true;

    this.cat2 = new uiframework.PropertyCategory("Flexural");
    this.cat2.reportable = false;

    this.asbot_ = new uiframework.PropertyDouble("Required Bottom Steel, A<sub>s,bot</sub>", 0, common.unit.area);
    this.asbot_.readonly = true;
    this.asbot_.reportable = false;

    this.asbotprov_ = new uiframework.PropertyBarList("Provided Bottom Steel, A<sub>s,bot</sub>", 0, undefined, common.unit.area, REBARMODE.Bars);
    this.asbotprov_.location = "bottom";

    this.astop_ = new uiframework.PropertyDouble("Required Top Steel, A<sub>s,top</sub>", 0, common.unit.area);
    this.astop_.readonly = true;
    this.astop_.reportable = false;

    this.astopprov_ = new uiframework.PropertyBarList("Provided Top Steel, A<sub>s,top</sub>", 0, undefined, common.unit.area, REBARMODE.Bars);
    this.astopprov_.location = "top";

    this.asweb_ = new uiframework.PropertyDouble("Required Web Steel, A<sub>s,web</sub>", 0, common.unit.area);
    this.asweb_.readonly = true;
    this.asweb_.reportable = false;

    this.aswebprov_ = new uiframework.PropertyBarList("Provided Web Steel, A<sub>s,web</sub>", 0, undefined, common.unit.area, REBARMODE.Bars);
    this.aswebprov_.location = "web";

    this.cat3 = new uiframework.PropertyCategory("Shear/Torsion");
    this.cat3.reportable = false;
    this.avsreq_ = new uiframework.PropertyDouble("Required Shear Reinforcement per unit spacing, A<sub>v,req/s</sub>", 0, common.unit.unitarea);
    this.avsreq_.readonly = true;
    this.avsreq_.reportable = false;
    this.avsreq_.customformat = this.Format;

    this.atsreq_ = new uiframework.PropertyDouble("Required Torsion Reinforcement per unit spacing, A<sub>t,req/s</sub>", 0, common.unit.unitarea);
    this.atsreq_.readonly = true;
    this.atsreq_.reportable = false;
    this.atsreq_.customformat = this.Format;

    this.avtsreq_ = new uiframework.PropertyDouble("Required Shear + Torsion Reinforcement per unit spacing, A<sub>v+t,req/s</sub>", 0, common.unit.unitarea);
    this.avtsreq_.readonly = true;
    this.avtsreq_.reportable = false;
    this.avtsreq_.customformat = this.Format;

    this.avtsreqprov_ = new uiframework.PropertyBarList("Provided Stirrups, A<sub>v+t,req/s</sub>", 0, undefined, common.unit.unitarea, REBARMODE.Spacing);
    this.avtsreqprov_.propertyname = "avs";
    this.avtsreqprov_.location = "stirrup";
    this.avtsreqprov_.customformat = this.Format;

    this.alreq_ = new uiframework.PropertyDouble("Required Longitudinal Torsion Steel, A<sub>l,req</sub>", 0, common.unit.area);
    this.alreq_.readonly = true;
    this.alreq_.reportable = false;

    this.Calculate = function (event) {
        this.moment_.equationlist = [];
        this.shear_.equationlist = [];
        this.torsion_.equationlist = [];
        this.asbot_.equationlist = [];
        this.asbotprov_.equationlist = [];
        this.astop_.equationlist = [];
        this.astopprov_.equationlist = [];
        this.asweb_.equationlist = [];
        this.aswebprov_.equationlist = [];
        this.avsreq_.equationlist = [];
        this.atsreq_.equationlist = [];
        this.avtsreq_.equationlist = [];
        this.alreq_.equationlist = [];

        this.UpdateDimension();
        this.CalculateFlexure();
        this.CalculateShear();
        this.CalculateTorsion();

        this.asbotprov_.event = event;
        this.astopprov_.event = event;
        this.aswebprov_.event = event;

        this.UpdateSectionRebar();
    };

    this.Investigate = function () {
    };

    this.UpdateDimension = function () {
    };

    this.CalculateFlexure = function () {
    };

    this.CalculateShear = function () {
    };

    this.CalculateTorsion = function () {
    };

    this.UpdateSectionRebar = function () {
    };


};

var sectionACI318 = function () { //US Units
    sectionrcdesign.call(this);

    this.UpdateDimension = function () {
        this.x = common.Convert(this.section.x.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        this.y = common.Convert(this.section.y.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        this.b = common.Convert(this.section.w.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH); //Assign bf = b in T, L-sections

        if (this.section.tw !== undefined)
            this.bw = common.Convert(this.section.tw.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);

        if (this.section.tf !== undefined)
            this.ds = common.Convert(this.section.tf.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);

        this.h = common.Convert(this.section.h.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        this.cc = common.Convert(this.section.cc.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        this.fy = common.Convert(this.section.fy.value, UNITTYPESTRESSPR.MPA, UNITTYPESTRESSPR.LBSQIN);
        this.fys = common.Convert(this.section.fys.value, UNITTYPESTRESSPR.MPA, UNITTYPESTRESSPR.LBSQIN);
        this.fc = common.Convert(this.section.fc.value, UNITTYPESTRESSPR.MPA, UNITTYPESTRESSPR.LBSQIN);
        this.es = common.Convert(this.section.es.value, UNITTYPESTRESSPR.MPA, UNITTYPESTRESSPR.LBSQIN); //200000MPa = 29000000 in US
        this.mu = common.Convert(this.section.mu.value, UNITTYPEMOMENT.KNM, UNITTYPEMOMENT.LBIN);            //Input is in kN-m to lb-in
        this.vu = common.Convert(Math.abs(this.section.vu.value), UNITTYPEFORWT.KN, UNITTYPEFORWT.LBF);      //Input is in kN to lb
        this.tu = common.Convert(Math.abs(this.section.tu.value), UNITTYPEMOMENT.KNM, UNITTYPEMOMENT.LBIN);  //Input is in kN-m to lb-in
        this.Pu = 0; //this.section.Pu.value; //Pu active if value for tu !== 0

        if (this.section.stirrup.barsize)
            this.dstirrup = common.Convert(this.section.stirrup.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        else
            this.dstirrup = 0;

        if (this.section.designoption.value === BEAMDESIGNOPTION.INVESTIGATE && this.section.botbar) {
            if (this.mu < 0)
                this.drftens = common.Convert(this.section.topbar.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
            else
                this.drftens = common.Convert(this.section.botbar.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        } else {
            this.drftens = 0;
        }

        if (this.section.designoption.value === BEAMDESIGNOPTION.INVESTIGATE && this.section.topbar) {
            if (this.mu < 0)
                this.drfcomp = common.Convert(this.section.botbar.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
            else
                this.drfcomp = common.Convert(this.section.topbar.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        } else {
            this.drfcomp = 0;
        }

        this.phi = 0.9;
        this.lambda = 1.0;
        this.theta = (Math.PI / 180) * 45;
        this.ecmax = 0.003;
        this.esmin = 0.005;

        this.moment_.value = this.section.mu.value;
        this.shear_.value = this.section.vu.value;
        this.torsion_.value = this.section.tu.value;
    };

    this.UpdateSectionRebar = function () {
        if (this.asbotprov_.value.value) {
            this.section.botbar.nobars = this.asbotprov_.value.value.nbar;
            this.section.botbar.barsize = GetRebarSize(this.asbotprov_.value.value.sbar);
        }

        if (this.astopprov_.value.value) {
            this.section.topbar.nobars = this.astopprov_.value.value.nbar;
            this.section.topbar.barsize = GetRebarSize(this.astopprov_.value.value.sbar);
        }

        if (this.aswebprov_.value.value) {
            this.section.webbar.nobars = this.aswebprov_.value.value.nbar;
            this.section.webbar.barsize = GetRebarSize(this.aswebprov_.value.value.sbar);
        }
    };
};
var sectionBS8110 = function () { //SI Units
    sectionrcdesign.call(this);

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.b = this.section.w.value; //Assign bf = b in T, L-sections

        if (this.section.tw !== undefined)
            this.bw = this.section.tw.value;

        if (this.section.tf !== undefined)
            this.ds = this.section.tf.value;

        this.h = this.section.h.value;
        this.cc = this.section.cc.value;
        this.fy = this.section.fy.value;
        this.fys = this.section.fys.value;
        this.fc = this.section.fc.value;
        this.es = this.section.es.value; //200000MPa = 29000000 in US
        this.mu = common.Convert(this.section.mu.value, UNITTYPEMOMENT.KNM, UNITTYPEMOMENT.NMM);            //Input is in kN-m
        this.vu = common.Convert(Math.abs(this.section.vu.value), UNITTYPEFORWT.KN, UNITTYPEFORWT.N);      //Input is in kN
        this.tu = common.Convert(Math.abs(this.section.tu.value), UNITTYPEMOMENT.KNM, UNITTYPEMOMENT.NMM);  //Input is in kN-m
        this.Pu = 0; //this.section.Pu.value; //Pu active if value for tu !== 0
        this.R = this.section.R.value;

        if (this.section.stirrup.barsize)
            this.dstirrup = this.section.stirrup.barsize.value;
        else
            this.dstirrup = 0;

        if (this.section.designoption.value === BEAMDESIGNOPTION.INVESTIGATE && this.section.botbar) {
            if (this.mu < 0)
                this.drftens = this.section.topbar.barsize.value;
            else
                this.drftens = this.section.botbar.barsize.value;
        } else {
            this.drftens = 0;
        }

        if (this.section.designoption.value === BEAMDESIGNOPTION.INVESTIGATE && this.section.topbar) {
            if (this.mu < 0)
                this.drfcomp = this.section.botbar.barsize.value;
            else
                this.drfcomp = this.section.topbar.barsize.value;
        } else {
            this.drfcomp = 0;
        }

        this.phi = 0.9;
        this.lambda = 1.0;
        this.theta = (Math.PI / 180) * 45;
        this.ecmax = 0.003;
        this.esmin = 0.005;

        this.moment_.value = this.section.mu.value;
        this.shear_.value = this.section.vu.value;
        this.torsion_.value = this.section.tu.value;
    };

    this.UpdateSectionRebar = function () {
        if (this.asbotprov_.value.value) {
            this.section.botbar.nobars = this.asbotprov_.value.value.nbar;
            this.section.botbar.barsize = GetRebarSize(this.asbotprov_.value.value.sbar);
        }

        if (this.astopprov_.value.value) {
            this.section.topbar.nobars = this.astopprov_.value.value.nbar;
            this.section.topbar.barsize = GetRebarSize(this.astopprov_.value.value.sbar);
        }

        if (this.aswebprov_.value.value) {
            this.section.webbar.nobars = this.aswebprov_.value.value.nbar;
            this.section.webbar.barsize = GetRebarSize(this.aswebprov_.value.value.sbar);
        }
    };
};

var sectionrectangleACI318_11 = function (section) { //US Units
    sectionACI318.call(this);

    this.section = section;

    this.CalculateFlexure = function () {
        var msg = "Please note that the ACI 318 design code equations are in US Units";
        this.remarks_.remarklist.push(msg);

        this.Asreq = 0;
        this.Asdashreq = 0;
        this.Asweb = 0;

        this.DepthEff(0);

        this.DepthEquiCompBlock();

        this.Cmax();
        this.Beta1();
        this.MaxDepthEquiCompBlock();

        this.CalcFlexRF();

        this.CheckLimitsFlexRF();

        //        //CALCULATE TENSILE SPACING REQUIREMENTS [Smax]
        //        this.fs =  2 * this.fy / 3;	
        //        this.smax = Math.min(15 * (40000 / this.fs) - 2.5 * this.cc, 12 * 40000 / this.fs);

        this.CheckSkinRF();

        if (this.mu < 0) {
            this.astop_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
            this.asbot_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
        } else {
            this.asbot_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
            this.astop_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
        }

        this.asweb_.value = common.Convert(this.Asweb, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
    };

    this.CalculateShear = function () {
        this.Avsreq = 0;

        //        if (this.vu !== 0) {
        this.phi = 0.75;

        this.DepthEff(1);

        this.ShearCapConc();

        this.CalcShearRF();
        //        }

        this.avsreq_.value = common.Convert(this.Avsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);
    };

    this.CalculateTorsion = function () {
        this.Atsreq = 0;
        this.Avtsreq = this.Avsreq;
        this.Alreq = 0;

        //        if (this.tu !== 0) {
        this.phi = 0.75;

        this.DepthEff(2);

        this.SecPropsConc();
        this.TorsionThreshold();

        if (this.tu <= (this.phi * this.Tth)) {
            this.Avtsreq = this.Avsreq; // + 2 * this.Atsreq;
            //Display message: "Torsion stirrups not required"
            this.remarks_.remarklist.push("Torsion stirrups not required");
            this.atsreq_.remarks = "Not Required";
        } else {
            this.CalcTorsionRF();
        }
        //        }

        if (common.IsZero(this.Asdashreq)) {
            if (this.mu < 0) {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.asbot_.remarks = "Not Required";
            } else {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.astop_.remarks = "Not Required";
            }
        }

        var bars;
        var spacing;

        var set = $SETTINGS.smallestbar.enums;
        var minbars = $SETTINGS.smallestbar.value;
        var maxbars = $SETTINGS.largestbar.value;
        var maxnbars = $SETTINGS.maxbars.value;
        var mixnbars = $SETTINGS.maxmixbars.value;
        var excess = 0; //$SETTINGS.maxexcessarea.value;
        var minbarspacing = $SETTINGS.minbarspacing.value;
        var minstirrupspacing = $SETTINGS.minstirrupspacing.value;
        var maxstirrupspacing = $SETTINGS.maxstirrupspacing.value;
        var width = this.section.w.value - this.section.cc.value * 2;

        this.atsreq_.value = common.Convert(this.Atsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);
        this.avsreq_.value = common.Convert(this.Avsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM); //RE-UPDATE
        this.avtsreq_.value = common.Convert(this.Avtsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);

        this.alreq_.value = common.Convert(this.Alreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);

        if (this.mu < 0) {
            this.astop_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
            this.asbot_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
        } else {
            this.asbot_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
            this.astop_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
        }

        this.asweb_.value = common.Convert(this.Asweb, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE

        bars = rebarEquivalentBars(this.asbot_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minbarspacing, width);
        if (bars && bars.length !== 0) {
            this.asbotprov_.value = bars[0];
            this.asbotprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.astop_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minbarspacing, width);
        if (bars && bars.length !== 0) {
            this.astopprov_.value = bars[0];
            this.astopprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.asweb_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 1, minbarspacing, width);
        if (bars && bars.length !== 0) {
            this.aswebprov_.value = bars[0];
            this.aswebprov_.list = bars;
        }

        spacing = rebarEquivalentSpac(this.avtsreq_.value, set, minbars, maxbars, minstirrupspacing, maxstirrupspacing, width, excess);
        if (spacing && spacing.length !== 0) {
            this.avtsreqprov_.value = spacing[0];
            this.avtsreqprov_.list = spacing;
        }
    };

    //--------------------------------------------------------------------------//

    this.DepthEff = function (procedure) {
        this.d = this.h - this.cc - this.dstirrup - (this.drftens / 2);

        var list = {};
        list.symbol = "d";
        list.equation = "{0} - {1} - {2} - {3} / 2";
        list.nameparam = ["h", "c_c", "d_{stirrup}", "d_{rf,tens}"];
        list.valueparam = [this.h, this.cc, this.dstirrup, this.drftens];
        list.value = this.d;

        switch (procedure) {
            case 0: //coming from Flexure
                this.moment_.equationlist.push(list);
                break;
            case 1: //coming from Shear
                this.shear_.equationlist.push(list);
                break;
            case 2: //coming from Torsion
                this.torsion_.equationlist.push(list);
                break;
            default:
                break;
        }
    };
    this.DepthCompRF = function () {
        this.ddash = this.cc + this.dstirrup + (this.drfcomp / 2);

        var list = {};
        list.symbol = "d'";
        list.equation = "{0} + {1} + {2} / 2";
        list.nameparam = ["c_c", "d_{stirrup}", "d_{rfcomp}"];
        list.valueparam = [this.cc, this.dstirrup, this.drfcomp];
        list.value = this.ddash;
        this.moment_.equationlist.push(list);
    };
    this.DepthEquiCompBlock = function () {
        this.a = this.d - Math.sqrt(Math.pow(this.d, 2) - (2 * Math.abs(this.mu) / (0.85 * this.phi * this.fc * this.b)));

        var list = {};
        list.symbol = "a";
        list.equation = "{0} - √{{1}^2 - ({2 * {|{2}|}} / {0.85 * {3} * {4} * {5}})}";
        list.nameparam = ["d", "d", "M_u", "Φ", "f'_c", "b"];
        list.valueparam = [this.d, this.d, this.mu, this.phi, this.fc, this.b];
        list.value = this.a;
        this.moment_.equationlist.push(list);
    };

    this.SecPropsConc = function () {
        this.Ag = this.b * this.h;
        this.Acp = this.b * this.h;
        this.pcp = 2 * this.b + 2 * this.h;

        var list = {};
        list.symbol = "A_g";
        list.equation = "{0} * {1}";
        list.nameparam = ["b", "h"];
        list.valueparam = [this.b, this.h];
        list.value = this.Ag;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "A_c_p";
        list.equation = "{0} * {1}";
        list.nameparam = ["b", "h"];
        list.valueparam = [this.b, this.h];
        list.value = this.Acp;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "P_c_p";
        list.equation = "2 * {0} + 2 * {1}";
        list.nameparam = ["b", "h"];
        list.valueparam = [this.b, this.h];
        list.value = this.pcp;
        this.torsion_.equationlist.push(list);
    };
    this.SecPropsEffConc = function () {
        this.Aoh = (this.b - 2 * this.cc) * (this.h - 2 * this.cc);
        this.Ao = 0.85 * this.Aoh;
        this.ph = 2 * (this.b - 2 * this.cc) + 2 * (this.h - 2 * this.cc);

        var list = {};
        list.symbol = "A_{oh}";
        list.equation = "{({0} - 2 * {1})} * {({2} - 2 * {3})}";
        list.nameparam = ["b", "c", "h", "c"];
        list.valueparam = [this.b, this.cc, this.h, this.cc];
        list.value = this.Aoh;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "A_o";
        list.equation = "0.85 * {0}";
        list.nameparam = ["A_{oh}"];
        list.valueparam = [this.Aoh];
        list.value = this.Ao;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "P_h";
        list.equation = "{2 {({0} - 2 * {1})}} + {2{({2} - 2 * {3})}}";
        list.nameparam = ["b", "c", "h", "c"];
        list.valueparam = [this.b, this.cc, this.h, this.cc];
        list.value = this.ph;
        this.torsion_.equationlist.push(list);
    };

    this.Cmax = function () {
        this.cmax = this.ecmax * this.d / (this.ecmax + this.esmin);

        var list = {};
        list.symbol = "c_{max}";
        list.equation = "{{0}} / {{1} + {2}} {3}";
        list.nameparam = ["e_{cmax}", "e_{cmax}", "e_{smin}", "d"];
        list.valueparam = [this.ecmax, this.ecmax, this.esmin, this.d];
        list.value = this.cmax;
        this.moment_.equationlist.push(list);
    };
    this.Beta1 = function () {
        this.beta1 = 0.85 - 0.05 * ((this.fc - 4000) / 1000);
        if (this.beta1 <= 0.65)
            this.beta1 = 0.65;
        else if (this.beta1 >= 0.85)
            this.beta1 = 0.85;

        var list = {};
        list.symbol = "β_1";
        list.equation = "0.85 - 0.05 {({{0}-4000} / 1000)}";
        list.nameparam = ["f_c'"];
        list.valueparam = [this.fc];
        list.value = this.beta1;
        this.moment_.equationlist.push(list);
    };
    this.MaxDepthEquiCompBlock = function () {
        this.amax = this.beta1 * this.cmax;

        var list = {};
        list.symbol = "a_{max}";
        list.equation = "{0} * {1}";
        list.nameparam = ["β_1", "c_{max}"];
        list.valueparam = [this.beta1, this.cmax];
        list.value = this.amax;
        this.moment_.equationlist.push(list);
    };

    this.StressCompRF = function () {
        this.fsdash = this.es * this.ecmax * ((this.cmax - this.ddash) / this.cmax);

        var list = {};
        list.symbol = "f_s'";
        list.equation = "{0} * {1} {({{2} - {3}} / {4})}";
        list.nameparam = ["E_s", "ε_{cmax}", "c_{max}", "d'", "c_{max}"];
        list.valueparam = [this.es, this.ecmax, this.cmax, this.ddash, this.cmax];
        list.value = this.fsdash;
        this.moment_.equationlist.push(list);
    };
    this.CompForceFlex = function () {
        this.C = 0.85 * this.fc * this.b * this.amax;

        var list = {};
        list.symbol = "C";
        list.equation = "0.85 * {0} * {1} * {2}";
        list.nameparam = ["f_c'", "b", "a_{max}"];
        list.valueparam = [this.fc, this.b, this.amax];
        list.value = this.C;
        this.moment_.equationlist.push(list);
    };
    this.TorsionThreshold = function () {
        this.Tth = this.lambda * Math.sqrt(this.fc) * (Math.pow(this.Acp, 2) / this.pcp) * Math.sqrt(1 + (this.Pu / (4 * this.Ag * this.lambda * Math.sqrt(this.fc))));

        var list = {};
        list.symbol = "T_{th}";
        list.equation = "{0} {√{1}} {({2} / {3})} √{1 + {4} / {4 * {5} * {6} {√{7} }}";
        list.nameparam = ["λ", "f_c'", "A_{cp}^2", "P_{cp}", "P_u", "A_g", "λ", "f_c'"];
        list.valueparam = [this.lambda, this.fc, this.Acp, this.pcp, this.Pu, this.Ag, this.lambda, this.fc];
        list.value = this.Tth;
        this.torsion_.equationlist.push(list);
    };

    this.CalcFlexRF = function () {
        if (this.a <= this.amax) {
            this.ReqSteelTensFlex();
        } else {
            this.DepthCompRF();
            this.CompForceFlex();
            this.MomentResistConc();
            this.mus = this.mu - this.muc;

            //            list = {};
            //            list.symbol = "M_u_s";
            //            list.equation = "{0} - {1}";
            //            list.nameparam = ["M_u", "M_u_c"];
            //            list.valueparam = [this.mu, this.mus];
            //            list.value = this.mus;
            //            this.moment_.equationlist.push(list);

            this.SteelBalCompConc();
            this.SteelBalCompRF();
            this.Asreq = this.As1 + this.As2;

            //            list = {};
            //            list.symbol = "A_s";
            //            list.equation = "{0} + {1}";
            //            list.nameparam = ["A_s_1", "A_s_2"];
            //            list.valueparam = [this.As1, this.As2];
            //            list.value = this.Asreq;
            //            this.moment_.equationlist.push(list);

            this.StressCompRF();

            if (this.fsdash >= this.fy)
                this.fsdash = this.fy;

            this.ReqSteelCompFlex();
        }
    };
    this.CalcShearRF = function () {
        //CALCULATE SHEAR RF [Av/s]
        if (this.vu <= (0.5 * this.phi * this.Vc)) {
            this.Avsreq = 0;
            //Display message: "Shear stirrups not required"
            this.remarks_.remarklist.push("Shear stirrups not required");
            this.avsreq_.remarks = "Not Required";
        } else {
            this.ShearMaxConc();

            if (this.vu > (this.phi * this.Vmax)) {
                //Display error message: "Increase concrete section"
                var msg = "Increase concrete section";
                this.remarks_.remarklist.push(msg);
                this.avsreq_.remarks = msg;
            } else {
                this.ReqSteelShear();
                this.CheckLimitsShearRF();
            }
        }
    };
    this.CalcTorsionRF = function () {
        this.SecPropsEffConc();

        //this.Vc = 2 * this.lambda * Math.sqrt(this.fc) * this.b * this. d;

        this.CheckLimitsTorsionSection();

        if (this.torsionCheckLeft > (this.phi * this.torsionCheckRight)) {
            //Display error message: "Increase concrete section"
            var msg = "Increase concrete section";
            this.remarks_.remarklist.push(msg);
            this.atsreq_.remarks = msg;

            this.alreq_.remarks = msg;

            this.Avtsreq = this.Avsreq + 2 * this.Atsreq;
        } else {
            this.ReqSteelTorsionAl();
            this.ReqSteelTorsionAts();
            this.Avtsreq = this.Avsreq + 2 * this.Atsreq;

            this.CheckLimitsTorsionRF();

            //this.storsion = Math.min(this.ph / 8, 12); //12 inches

            if ($SETTINGS.distributelongbars.value) {
                this.Asreq += 0.5 * this.Alreq;
                this.Asdashreq += 0.5 * this.Alreq;
                /* Combine the longitudinal reinforcement required for torsion
                 * with that which is required for flexure
                 * 
                 * To achieve a uniform distribution of reinforcement
                 * around the perimeter of the section, assign approximately
                 * 1/4 of Alreq to each face
                 */
            }
        }
    };

    this.CheckLimitsFlexRF = function () {
        this.Asmin = Math.min(4 * this.Asreq / 3, Math.max(3 * Math.sqrt(this.fc) * this.b * this.d / this.fy, 200 * this.b * this.d / this.fy));
        this.Asmax = 0.04 * this.b * this.d;

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.Asreq <= this.Asmin)
            this.Asreq = this.Asmin;

        if (this.Asreq > this.Asmax) {
            //Display error message: "Section too small to hold tension r/f"
            if (this.mu < 0) {
                var msg = "Section too small to hold tension r/f";
                this.remarks_.remarklist.push(msg);
                this.astop_.remarks = msg;
            } else {
                var msg = "Section too small to hold tension r/f";
                this.remarks_.remarklist.push(msg);
                this.asbot_.remarks = msg;
            }
        }

        if (this.Asdashreq > this.Asmax) {  //if ((this.a > this.amax) && (this.Asdashreq > this.Asmax)) {
            //Display error message: "Section too small to hold compression r/f"
            if (this.mu < 0) {
                var msg = "Section too small to hold compression r/f";
                this.remarks_.remarklist.push(msg);
                this.asbot_.remarks = msg;
            } else {
                var msg = "Section too small to hold compression r/f";
                this.remarks_.remarklist.push(msg);
                this.astop_.remarks = msg;
            }
        }
    };
    this.CheckLimitsShearRF = function () {
        //CHECK MINIMUM RF REQUIREMENT [Av/s,min]
        this.Avsmin = Math.max(0.75 * Math.sqrt(this.fc) * this.b / this.fys, 50 * this.b / this.fys);

        if (this.Avsreq <= this.Avsmin)
            this.Avsreq = this.Avsmin;
    };
    this.CheckLimitsTorsionRF = function () {
        this.Almin1 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - this.Atsreq * this.ph * this.fys / this.fy;
        this.Almin2 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - (25 * this.b / this.fys) * this.ph * this.fys / this.fy;

        this.Almin = Math.min(this.Almin1, this.Almin2);

        if (this.Alreq <= this.Almin)
            this.Alreq = this.Almin;

        this.Avtsmin = Math.max(0.75 * Math.sqrt(this.fc) * this.b / this.fys, 50 * this.b / this.fys);

        if (this.Avtsreq <= this.Avtsmin) {
            this.Avsreq += (this.Avtsmin - this.Avtsreq); //Add excess to shear ONLY
            this.Avtsreq = this.Avtsmin;
        }
    };
    this.CheckLimitsTorsionSection = function () {
        this.torsionCheckLeft = Math.sqrt(Math.pow(this.vu / (this.b * this.d), 2) + Math.pow(this.tu * this.ph / (1.7 * Math.pow(this.Aoh, 2)), 2));
        this.torsionCheckRight = this.Vc / (this.b * this.d) + 8 * Math.sqrt(this.fc);
    };
    this.CheckSkinRF = function () {
        if (this.h >= 36) { //***36 inches
            this.fs = 2 * this.fy / 3;
            this.sskinmax = Math.min(15 * (40000 / this.fs) - 2.5 * this.cc, 12 * 40000 / this.fs);
            //Skin reinforcment distributed on both side faces for a distance of h/2 from the tension face (ACI 9.7.2.3)
            //Use bar size between No.3 and No.5, or welded wire reinforcement with a minimum area of 0.1 in^2 per foot of depth (ACI 9.7.2.3)
            //**For SI UNITS: Bar size 10 to 16: 210 mm^2 per meter of depth
            this.Asweb = (0.1 / 12) * this.h / 2; //ACI R9.7.2.3
            //this.Asweb_.value = this.Asweb;
        } else {
            //Display message: "Skin reinforcement not required"
            this.remarks_.remarklist.push("Skin r/f  not required");
            this.asweb_.remarks = "Not Required";
        }
    };

    this.MomentResistConc = function () {
        this.muc = this.phi * this.C * (this.d - (this.amax / 2));

        var list = {};
        list.symbol = "M_{uc}";
        list.equation = "{0} * {1} {({{2} - {3} / 2})}";
        list.nameparam = ["Φ", "C", "d", "a_{max}"];
        list.valueparam = [this.phi, this.C, this.d, this.amax];
        list.value = this.muc;
        this.moment_.equationlist.push(list);
    };

    this.ShearCapConc = function () {
        this.Vc = 2 * this.lambda * Math.sqrt(this.fc) * this.b * this.d;

        var list = {};
        list.symbol = "V_c";
        list.equation = "2 * {0} {√{1}} * {2} * {3}";
        list.nameparam = ["λ", "f_c'", "b", "d"];
        list.valueparam = [this.lambda, this.fc, this.b, this.d];
        list.value = this.Vc;
        this.shear_.equationlist.push(list);
    };
    this.ShearMaxConc = function () {
        this.Vmax = this.Vc + 8 * Math.sqrt(this.fc) * this.b * this.d;

        var list = {};
        list.symbol = "V_{max}";
        list.equation = "{0} + 8 {√{1}} * {2} * {3}";
        list.nameparam = ["V_c", "f'_c", "b", "d"];
        list.valueparam = [this.Vc, this.fc, this.b, this.d];
        list.value = this.Vmax;
        this.shear_.equationlist.push(list);
    };

    this.SteelBalCompConc = function () {
        this.As1 = this.muc / (this.phi * this.fy * (this.d - (this.amax / 2)));

        var list = {};
        list.symbol = "A_{s1}";
        list.equation = "{{0}} / {{1} * {2} {({3} - {{4}} / 2)}}";
        list.nameparam = ["M_{uc}", "Φ", "f_y", "d", "a_{max}"];
        list.valueparam = [this.muc, this.phi, this.fy, this.d, this.amax];
        list.value = this.As1;
        this.moment_.equationlist.push(list);
    };
    this.SteelBalCompRF = function () {
        this.As2 = this.mus / (this.phi * this.fy * (this.d - this.ddash));

        var list = {};
        list.symbol = "A_{s2}";
        list.equation = "{{0}} / {{1} * {2} {({3} - {4})}}";
        list.nameparam = ["M_{us}", "Φ", "f_y", "d", "d'"];
        list.valueparam = [this.mus, this.phi, this.fy, this.d, this.ddash];
        list.value = this.As2;
        this.moment_.equationlist.push(list);
    };

    this.ReqSteelTensFlex = function () {
        this.Asreq = this.mu / (this.phi * this.fy * (this.d - this.a / 2));

        var list = {};
        list.symbol = "A_s";
        list.equation = "{0} / {{1} * {2} {({3} - {{4} / 2})}}";
        list.nameparam = ["M_u", "Φ", "f_y", "d", "a"];
        list.valueparam = [this.mu, this.phi, this.fy, this.d, this.a];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelCompFlex = function () {
        this.Asdashreq = this.mus / (this.phi * (this.fsdash - 0.85 * this.fc) * (this.d - this.ddash));

        var list = {};
        list.symbol = "A_s'";
        list.equation = "{{0}} / {{1} {({2} - 0.85 * {3})} {({4} - {5})}}";
        list.nameparam = ["M_{us}", "Φ", "f'_s", "f'_c", "d", "d'"];
        list.valueparam = [this.mus, this.phi, this.fsdash, this.fc, this.d, this.ddash];
        list.value = this.Asdashreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelShear = function () {
        this.Avsreq = (this.vu - (this.phi * this.Vc)) / (this.phi * this.fys * this.d);

        var list = {};
        list.symbol = "A_v / s";
        list.equation = "{({0} - {{1} * {2}})} / {{3} * {4} * {5}}";
        list.nameparam = ["V_u", "ϕ", "V_c", "ϕ", "f_{ys}", "d"];
        list.valueparam = [this.vu, this.phi, this.Vc, this.phi, this.fys, this.d];
        list.value = this.Avsreq;
        this.shear_.equationlist.push(list);
    };
    this.ReqSteelTorsionAl = function () {
        this.Alreq = this.tu * this.ph / (2 * this.phi * this.Ao * this.fy * Math.tan(this.theta));

        var list = {};
        list.symbol = "A_l";
        list.equation = "{{0} * {1}} / { 2*{2} * {3} * {4} * {5}}";
        list.nameparam = ["T_u", "P_h", "ϕ", "A_o", "f_y", "tanθ"];
        list.valueparam = [this.tu, this.ph, this.phi, this.Ao, this.fy, this.theta];
        list.value = this.Alreq;
        this.torsion_.equationlist.push(list);
    };
    this.ReqSteelTorsionAts = function () {
        this.Atsreq = this.tu * Math.tan(this.theta) / (2 * this.phi * this.Ao * this.fys);

        var list = {};
        list.symbol = "A_t / s";
        list.equation = "{{0} * {1}} / {2 * {2} * {3} * {4}}";
        list.nameparam = ["T_u", "tanθ", "θ", "A_o", "f_{ys}"];
        list.valueparam = [this.tu, this.theta, this.phi, this.Ao, this.fys];
        list.value = this.Atsreq;
        this.torsion_.equationlist.push(list);
    };
};
var sectionflangedACI318_11 = function (section) { //US Units
    sectionACI318.call(this);

    this.section = section;

    this.CalculateFlexure = function () {
        var msg = "Please note that the ACI 318 design code equations are in US Units";
        this.remarks_.remarklist.push(msg);

        this.Asreq = 0;
        this.Asdashreq = 0;
        this.Asweb = 0;
        this.bf = this.b;
        this.btemp = this.b;

        if (this.mu < 0) {
            //TREATED AS RECTANGULAR BEAM: b = bw
            this.b = this.bw;
            this.DepthEff(0);
            this.DepthEquiCompBlock();

            this.Cmax();
            this.Beta1();
            this.MaxDepthEquiCompBlock();

            //CALCULATE RF [As, As']
            this.CalcFlexRF();
        } else {
            this.DepthEff(0);
            this.DepthEquiCompBlock(); //b = bf = w

            this.Cmax();
            this.Beta1();
            this.MaxDepthEquiCompBlock();

            if (this.a <= this.ds) {
                //CALCULATE RF [As, As'] b = bf = w
                this.CalcFlexRF();
            } else {
                this.CompForceFlangeFlex();
                this.SteelBalCompConcFlange();
                this.MomentResistConcFlange();
                this.muw = this.mu - this.muf;

                this.DepthEquiCompBlockWeb();

                this.CalcFlexRFSecFlange();
            }
        }

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        this.CheckLimitsFlexRF();

        //CHECK SKIN RF REQUIREMENTS [Sskinmax]
        this.CheckSkinRF();

        if (this.mu < 0) {
            this.astop_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
            this.asbot_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
        } else {
            this.asbot_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
            this.astop_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
        }

        this.asweb_.value = common.Convert(this.Asweb, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
    };

    this.CalculateShear = function () {
        this.Avsreq = 0;

        //        if (this.vu !== 0) {
        this.phi = 0.75;

        this.DepthEff(1);
        this.ShearCapConc();

        this.CalcShearRF();
        //        }

        this.avsreq_.value = common.Convert(this.Avsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);
    };

    this.CalculateTorsion = function () {
        /* NOTE:
         * For torsion design of T & L sections, it is assumed that placing torsion reinforcement
         * in the flange area is inefficient. With this assumption, the flange is ignored for torsion
         * reinforcement calculations
         */

        this.Atsreq = 0;
        this.Avtsreq = 0;
        this.Alreq = 0;

        //        if (this.tu !== 0) {
        this.phi = 0.75;

        this.DepthEff(2);
        this.SecPropsConc();
        this.TorsionThreshold();

        if (this.tu <= (this.phi * this.Tth)) {
            this.Atsreq = 0;
            this.Avtsreq = this.Avsreq; // + 2 * this.Atsreq;
            //Display message: "Torsion stirrups not required"
            this.remarks_.remarklist.push("Torsion stirrups not required");
            this.atsreq_.remarks = "Not Required";
        } else {
            this.CalcTorsionRF();
        }
        //        }

        if (common.IsZero(this.Asdashreq)) {
            if (this.mu < 0) {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.asbot_.remarks = "Not Required";
            } else {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.astop_.remarks = "Not Required";
            }
        }

        var bars;

        var set = $SETTINGS.smallestbar.enums;
        var minbars = $SETTINGS.smallestbar.value;
        var maxbars = $SETTINGS.largestbar.value;
        var maxnbars = $SETTINGS.maxbars.value;
        var mixnbars = $SETTINGS.maxmixbars.value;
        var excess = 0; //$SETTINGS.maxexcessarea.value;
        var minspacing = $SETTINGS.minstirrupspacing.value;
        var width = this.section.w.value - this.section.cc.value * 2;

        this.atsreq_.value = common.Convert(this.Atsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);
        this.avsreq_.value = common.Convert(this.Avsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM); //RE-UPDATE
        this.avtsreq_.value = common.Convert(this.Avtsreq, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);

        this.alreq_.value = common.Convert(this.Alreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);

        if (this.mu < 0) {
            this.astop_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
            this.asbot_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
        } else {
            this.asbot_.value = common.Convert(this.Asreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
            this.astop_.value = common.Convert(this.Asdashreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE
        }

        this.asweb_.value = common.Convert(this.Asweb, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM); //RE-UPDATE

        bars = rebarEquivalentBars(this.asbot_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minspacing, width);
        if (bars && bars.length !== 0) {
            this.asbotprov_.value = bars[0];
            this.asbotprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.astop_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minspacing, width);
        if (bars && bars.length !== 0) {
            this.astopprov_.value = bars[0];
            this.astopprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.asweb_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 1, minspacing, width);
        if (bars && bars.length !== 0) {
            this.aswebprov_.value = bars[0];
            this.aswebprov_.list = bars;
        }
    };

    //--------------------------------------------------------------------------//

    this.DepthEff = function (procedure) {
        this.d = this.h - this.cc - this.dstirrup - (this.drftens / 2);

        var list = {};
        list.symbol = "d";
        list.equation = "{0} - {1} - {2} - {3} / 2";
        list.nameparam = ["h", "c_c", "d_{stirrup}", "d_{rf,tens}"];
        list.valueparam = [this.h, this.cc, this.dstirrup, this.drftens];
        list.value = this.d;

        switch (procedure) {
            case 0: //coming from Flexure
                this.moment_.equationlist.push(list);
                break;
            case 1: //coming from Shear
                this.shear_.equationlist.push(list);
                break;
            case 2: //coming from Torsion
                this.torsion_.equationlist.push(list);
                break;
            default:
                break;
        }
    };
    this.DepthCompRF = function () {
        this.ddash = this.cc + this.dstirrup + (this.drfcomp / 2);

        var list = {};
        list.symbol = "d'";
        list.equation = "{0} + {1} + {2} / 2";
        list.nameparam = ["c_c", "d_{stirrup}", "d_{rfcomp}"];
        list.valueparam = [this.cc, this.dstirrup, this.drfcomp];
        list.value = this.ddash;
        this.moment_.equationlist.push(list);
    };
    this.DepthEquiCompBlock = function () {
        this.a = this.d - Math.sqrt(Math.pow(this.d, 2) - (2 * Math.abs(this.mu) / (0.85 * this.phi * this.fc * this.b)));

        var list = {};
        list.symbol = "a";
        list.equation = "{0} - √{{1}^2 - ({2 * {|{2}|}} / {0.85 * {3} * {4} * {5}})}";
        list.nameparam = ["d", "d", "M_u", "Φ", "f'_c", "b"];
        list.valueparam = [this.d, this.d, this.mu, this.phi, this.fc, this.b];
        list.value = this.a;
        this.moment_.equationlist.push(list);
    };
    this.DepthEquiCompBlockWeb = function () {
        this.a1 = this.d - Math.sqrt(Math.pow(this.d, 2) - (2 * this.muw / (0.85 * this.phi * this.fc * this.bw)));

        var list = {};
        list.symbol = "a_1";
        list.equation = "{0} - {√ { {1} - {2 * {2}} / {0.85 * {3} * {4} * {5}} }";
        list.nameparam = ["d", "d^2", "M_{uw}", "Φ", "f'_c", "b_w"];
        list.valueparam = [this.d, this.d, this.muw, this.phi, this.fc, this.bw];
        list.value = this.a1;
        this.moment_.equationlist.push(list);
    };

    this.SecPropsConc = function () {
        this.Ag = this.bw * this.h + (this.bf - this.bw) * this.ds;
        this.Acp = this.bw * this.h + (this.bf - this.bw) * this.ds;
        this.pcp = 2 * this.bf + 2 * this.h;

        var list = {};
        list.symbol = "A_g";
        list.equation = "{0} * {1} + {( {2} - {3} )} {4}";
        list.nameparam = ["b_w", "h", "b_f", "b_w", "d_s"];
        list.valueparam = [this.bw, this.h, this.bf, this.bw, this.ds];
        list.value = this.Ag;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "A_c_p";
        list.equation = "{0} * {1} + {( {2} - {3} )} {4}";
        list.nameparam = ["b_w", "h", "b_f", "b_w", "d_s"];
        list.valueparam = [this.bw, this.h, this.bf, this.bw, this.ds];
        list.value = this.Acp;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "P_c_p";
        list.equation = "2 * {0} + 2 * {1}";
        list.nameparam = ["b_f", "h"];
        list.valueparam = [this.bf, this.h];
        list.value = this.pcp;
        this.torsion_.equationlist.push(list);
    };
    this.SecPropsEffConc = function () {
        this.Aoh = (this.bw - 2 * this.cc) * (this.h - 2 * this.cc);
        this.Ao = 0.85 * this.Aoh;
        this.ph = 2 * (this.bw - 2 * this.cc) + 2 * (this.h - 2 * this.cc);

        var list = {};
        list.symbol = "A_{oh}";
        list.equation = "{({0} - 2 * {1})} * {({2} - 2 * {3})}";
        list.nameparam = ["b_w", "c_c", "h", "c_c"];
        list.valueparam = [this.bw, this.cc, this.h, this.cc];
        list.value = this.Aoh;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "A_o";
        list.equation = "0.85 * {0}";
        list.nameparam = ["A_{oh}"];
        list.valueparam = [this.Aoh];
        list.value = this.Ao;
        this.torsion_.equationlist.push(list);

        list = {};
        list.symbol = "P_h";
        list.equation = "{2 {({0} - 2 * {1})}} + {2{({2} - 2 * {3})}}";
        list.nameparam = ["b_w", "c_c", "h", "c_c"];
        list.valueparam = [this.bw, this.cc, this.h, this.cc];
        list.value = this.ph;
        this.torsion_.equationlist.push(list);
    };

    this.Cmax = function () {
        this.cmax = this.ecmax * this.d / (this.ecmax + this.esmin);

        var list = {};
        list.symbol = "c_{max}";
        list.equation = "{{0}} / {{1} + {2}} {3}";
        list.nameparam = ["e_{cmax}", "e_{cmax}", "e_{smin}", "d"];
        list.valueparam = [this.ecmax, this.ecmax, this.esmin, this.d];
        list.value = this.cmax;
        this.moment_.equationlist.push(list);
    };
    this.Beta1 = function () {
        this.beta1 = 0.85 - 0.05 * ((this.fc - 4000) / 1000);
        if (this.beta1 <= 0.65)
            this.beta1 = 0.65;
        else if (this.beta1 >= 0.85)
            this.beta1 = 0.85;

        var list = {};
        list.symbol = "β_1";
        list.equation = "0.85 - 0.05 {({{0}-4000} / 1000)}";
        list.nameparam = ["f'c"];
        list.valueparam = [this.fc];
        list.value = this.beta1;
        this.moment_.equationlist.push(list);
    };
    this.MaxDepthEquiCompBlock = function () {
        this.amax = this.beta1 * this.cmax;

        var list = {};
        list.symbol = "a_{max}";
        list.equation = "{0} * {1}";
        list.nameparam = ["β_1", "c_{max}"];
        list.valueparam = [this.beta1, this.cmax];
        list.value = this.amax;
        this.moment_.equationlist.push(list);
    };

    this.StressCompRF = function () {
        this.fsdash = this.es * this.ecmax * ((this.cmax - this.ddash) / this.cmax);

        var list = {};
        list.symbol = "f_s'";
        list.equation = "{0} * {1} {({{2} - {3}} / {4})}";
        list.nameparam = ["E_s", "ε_{cmax}", "c_{max}", "d'", "c_{max}"];
        list.valueparam = [this.es, this.ecmax, this.cmax, this.ddash, this.cmax];
        list.value = this.fsdash;
        this.moment_.equationlist.push(list);
    };
    this.CompForceFlex = function () {
        this.C = 0.85 * this.fc * this.b * this.amax;

        var list = {};
        list.symbol = "C";
        list.equation = "0.85 * {0} * {1} * {2}";
        list.nameparam = ["f'_c", "b", "a_{max}"];
        list.valueparam = [this.fc, this.b, this.amax];
        list.value = this.C;
        this.moment_.equationlist.push(list);
    };
    this.TorsionThreshold = function () {
        this.Tth = this.lambda * Math.sqrt(this.fc) * (Math.pow(this.Acp, 2) / this.pcp) * Math.sqrt(1 + (this.Pu / (4 * this.Ag * this.lambda * Math.sqrt(this.fc))));

        var list = {};
        list.symbol = "T_{th}";
        list.equation = "{0} {√{1}} {({2} / {3})} √{1 + {4} / {4 * {5} * {6} {√{7} }}";
        list.nameparam = ["λ", "f'_c", "A_{cp}^2", "P_{cp}", "P_u", "A_g", "λ", "f'_c"];
        list.valueparam = [this.lambda, this.fc, this.Acp, this.pcp, this.Pu, this.Ag, this.lambda, this.fc];
        list.value = this.Tth;
        this.torsion_.equationlist.push(list);
    };

    this.CalcFlexRF = function () {
        if (this.a <= this.amax) {
            this.ReqSteelTensFlex();
        } else {
            this.DepthCompRF();
            this.CompForceFlex();
            this.MomentResistConc();
            this.mus = this.mu - this.muc;

            this.SteelBalCompConc();
            this.SteelBalCompRF();
            this.Asreq = this.As1 + this.As2;

            this.StressCompRF();

            if (this.fsdash >= this.fy)
                this.fsdash = this.fy;

            this.ReqSteelCompFlex();
        }
    };
    this.CalcFlexRFSecFlange = function () {
        //CALCULATE RF [As, As'] b = bf = w
        if (this.a1 <= this.amax) {
            this.SteelBalCompConcWeb();
            this.Asreq = this.As1 + this.As2;
        } else {
            this.DepthCompRF();
            this.CompForceWebFlex();
            this.MomentResistConcWeb();
            this.mus = this.muw - this.muc;

            this.SteelBalCompConcWeb();
            this.SteelBalCompRFWeb();
            this.Asreq = this.As1 + this.As2 + this.As3;

            this.StressCompRF();

            if (this.fsdash >= this.fy)
                this.fsdash = this.fy;

            this.ReqSteelCompFlex();

            this.a = this.a1;
        }
    };
    this.CalcShearRF = function () {
        //CALCULATE SHEAR RF [Av/s]
        if (this.vu <= (0.5 * this.phi * this.Vc)) {
            this.Avsreq = 0;
            //Display message: "Shear stirrups not required"
            this.remarks_.remarklist.push("Shear stirrups not required");
            this.avsreq_.remarks = "Not Required";
        } else {
            this.ShearMaxConc();

            if (this.vu > (this.phi * this.Vmax)) {
                //Display error message: "Increase concrete section"
                var msg = "Increase concrete section";
                this.remarks_.remarklist.push(msg);
                this.avsreq_.remarks = msg;
            } else {
                this.ReqSteelShear();
                this.CheckLimitsShearRF();
            }
        }
    };
    this.CalcTorsionRF = function () {
        this.SecPropsEffConc();

        //this.Vc = 2 * this.lambda * Math.sqrt(this.fc) * this.b * this. d;

        this.CheckLimitsTorsionSection();

        if (this.torsionCheckLeft > (this.phi * this.torsionCheckRight)) {
            //Display error message: "Increase concrete section"
            var msg = "Increase concrete section";
            this.remarks_.remarklist.push(msg);
            this.atsreq_.remarks = msg;

            this.alreq_.remarks = msg;

            this.Avtsreq = this.Avsreq + 2 * this.Atsreq;
        } else {
            this.ReqSteelTorsionAl();
            this.ReqSteelTorsionAts();
            this.Avtsreq = this.Avsreq + 2 * this.Atsreq;

            this.CheckLimitsTorsionRF();

            //this.storsion = Math.min(this.ph / 8, 12); //12 inches

            if ($SETTINGS.distributelongbars.value) {
                this.Asreq += 0.5 * this.Alreq;
                this.Asdashreq += 0.5 * this.Alreq;
                /* Combine the longitudinal reinforcement required for torsion
                 * with that which is required for flexure
                 * 
                 * To achieve a uniform distribution of reinforcement
                 * around the perimeter of the section, assign approximately
                 * 1/4 of Alreq to each face
                 */
            }
        }
    };

    this.CheckLimitsFlexRF = function () {
        if (this.mu < 0)
            this.Asmin = Math.min(4 * this.Asreq / 3, Math.max(3 * Math.sqrt(this.fc) * (Math.min(this.bf, 2 * this.bw)) * this.d / this.fy, 200 * (Math.min(this.bf, 2 * this.bw)) * this.d / fy));
        else
            this.Asmin = Math.min(4 * this.Asreq / 3, Math.max(3 * Math.sqrt(this.fc) * this.bw * this.d / this.fy, 200 * this.bw * this.d / this.fy));

        this.Asmax = 0.04 * this.bw * this.d;

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.Asreq <= this.Asmin)
            this.Asreq = this.Asmin;

        if (this.Asreq > this.Asmax) {
            //Display error message: "Section too small to hold tension r/f"
            if (this.mu < 0) {
                var msg = "Section too small to hold tension r/f";
                this.remarks_.remarklist.push(msg);
                this.astop_.remarks = msg;
            } else {
                var msg = "Section too small to hold tension r/f";
                this.remarks_.remarklist.push(msg);
                this.asbot_.remarks = msg;
            }
        }

        if (this.Asdashreq > this.Asmax) { //if ((this.a > this.amax) && (this.Asdashreq > this.Asmax)) {
            //Display error message: "Section too small to hold compression r/f"
            if (this.mu < 0) {
                var msg = "Section too small to hold compression r/f";
                this.remarks_.remarklist.push(msg);
                this.asbot_.remarks = msg;
            } else {
                var msg = "Section too small to hold compression r/f";
                this.remarks_.remarklist.push(msg);
                this.astop_.remarks = msg;
            }
        }
    };
    this.CheckLimitsShearRF = function () {
        //CHECK MINIMUM RF REQUIREMENT [Av/s,min]
        this.Avsmin = Math.max(0.75 * Math.sqrt(this.fc) * this.bw / this.fys, 50 * this.bw / this.fys);

        //CHECK MINIMUM RF REQUIREMENT [Av/s,min]
        if (this.Avsreq <= this.Avsmin)
            this.Avsreq = this.Avsmin;

        //        //CALCULATE STIRRUP SPACING REQUIREMENTS [s]
        //        this.Vs = (this.vu / this.phi) - this.Vc;
        //
        //        if(this.Vs < (4 * Math.sqrt(this.fc) * this.b * this.d))
        //            this.s = this.d / 2;
        //
        //        this.s = this.d / 4;
    };
    this.CheckLimitsTorsionRF = function () {
        this.Almin1 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - this.Atsreq * this.ph * this.fys / this.fy;
        this.Almin2 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - (25 * this.bw / this.fys) * this.ph * this.fys / this.fy;

        this.Almin = Math.min(this.Almin1, this.Almin2);

        if (this.Alreq <= this.Almin)
            this.Alreq = this.Almin;

        this.Avtsmin = Math.max(0.75 * Math.sqrt(this.fc) * this.bw / this.fys, 50 * this.bw / this.fys);

        if (this.Avtsreq <= this.Avtsmin) {
            this.Avsreq += (this.Avtsmin - this.Avtsreq); //Add excess to shear ONLY
            this.Avtsreq = this.Avtsmin;
        }
    };
    this.CheckLimitsTorsionSection = function () {
        this.torsionCheckLeft = Math.sqrt(Math.pow(this.vu / (this.bw * this.d), 2) + Math.pow(this.tu * this.ph / (1.7 * Math.pow(this.Aoh, 2)), 2));
        this.torsionCheckRight = this.Vc / (this.bw * this.d) + 8 * Math.sqrt(this.fc);
    };
    this.CheckSkinRF = function () {
        if (this.h >= 36) { //***36 inches
            this.fs = 2 * this.fy / 3;
            this.sskinmax = Math.min(15 * (40000 / this.fs) - 2.5 * this.cc, 12 * 40000 / this.fs);
            //Skin reinforcment distributed on both side faces for a distance of h/2 from the tension face (ACI 9.7.2.3)
            //Use bar size between No.3 and No.5, or welded wire reinforcement with a minimum area of 0.1 in^2 per foot of depth (ACI 9.7.2.3)
            //**For SI UNITS: Bar size 10 to 16: 210 mm^2 per meter of depth
            this.Asweb = (0.1 / 12) * this.h / 2; //ACI R9.7.2.3
            //this.Asweb_.value = this.Asweb;
        } else {
            //Display message: "Skin reinforcement not required"
            this.remarks_.remarklist.push("Skin r/f  not required");
            this.asweb_.remarks = "Not Required";
        }
    };

    this.CompForceFlangeFlex = function () {
        this.Cf = 0.85 * this.fc * (this.bf - this.bw) * (Math.min(this.ds, this.amax));

        var list = {};
        list.symbol = "C_f";
        list.equation = "0.85 * {0} {({ {1} - {2} })} {(min({{3} {4}})})";
        list.nameparam = ["f'_c", "b_f", "b_w", "d_{s1},", "a_{max}"];
        list.valueparam = [this.fc, this.bf, this.bw, this.ds, this.amax];
        list.value = this.Cf;
        this.moment_.equationlist.push(list);
    };
    this.CompForceWebFlex = function () {
        this.Cw = 0.85 * this.fc * this.bw * this.amax;

        var list = {};
        list.symbol = "C_w";
        list.equation = "0.85 * {0} * {1} * {2}";
        list.nameparam = ["f'_c", "b_w", "a_{max}"];
        list.valueparam = [this.fc, this.bw, this.amax];
        list.value = this.Cw;
        this.moment_.equationlist.push(list);
    };

    this.MomentResistConc = function () {
        this.muc = this.phi * this.C * (this.d - (this.amax / 2));

        var list = {};
        list.symbol = "M_{uc}";
        list.equation = "{0} * {1} {({{2} - {3} / 2})}";
        list.nameparam = ["Φ", "C", "d", "a_{max}"];
        list.valueparam = [this.phi, this.C, this.d, this.amax];
        list.value = this.muc;
        this.moment_.equationlist.push(list);
    };
    this.MomentResistConcFlange = function () {
        this.muf = this.phi * this.Cf * (this.d - Math.min(this.ds, this.amax) / 2);

        var list = {};
        list.symbol = "M_{uf}";
        list.equation = "{0} * {1} {({ {2}} -{{min({3} * {4})} / 2 })";
        list.nameparam = ["ϕ", "C_f", "d", "d_s,", "a_{max}"];
        list.valueparam = [this.phi, this.Cf, this.d, this.ds, this.amax];
        list.value = this.muf;
        this.moment_.equationlist.push(list);
    };
    this.MomentResistConcWeb = function () {
        this.muc = this.phi * this.Cw * (this.d - (this.amax / 2));

        var list = {};
        list.symbol = "M_{uc}";
        list.equation = "{0} * {1} {( {2} - {{3} / 2)}}";
        list.nameparam = ["ϕ", "C_w", "d", "a_{max}"];
        list.valueparam = [this.phi, this.Cw, this.d, this.amax];
        list.value = this.muc;
        this.moment_.equationlist.push(list);
    };

    this.ShearCapConc = function () {
        this.Vc = 2 * this.lambda * Math.sqrt(this.fc) * this.bw * this.d;

        var list = {};
        list.symbol = "V_c";
        list.equation = "2 * {0} {√{1}} * {2} * {3}";
        list.nameparam = ["λ", "f'_c", "b", "d"];
        list.valueparam = [this.lambda, this.fc, this.b, this.d];
        list.value = this.Vc;
        this.shear_.equationlist.push(list);
    };
    this.ShearMaxConc = function () {
        this.Vmax = this.Vc + 8 * Math.sqrt(this.fc) * this.bw * this.d;

        var list = {};
        list.symbol = "V_{max}";
        list.equation = "{0} + 8 {√{1}} * {2} * {3}";
        list.nameparam = ["V_c", "f'_c", "bw", "d"];
        list.valueparam = [this.Vc, this.fc, this.b, this.d];
        list.value = this.Vmax;
        this.shear_.equationlist.push(list);
    };

    this.SteelBalCompConc = function () {
        this.As1 = this.muc / (this.phi * this.fy * (this.d - (this.amax / 2)));

        var list = {};
        list.symbol = "A_{s1}";
        list.equation = "{{0}} / {{1} * {2} {({3} - {{4}} / 2)}}";
        list.nameparam = ["M_{uc}", "Φ", "f_y", "d", "a_{max}"];
        list.valueparam = [this.muc, this.phi, this.fy, this.d, this.amax];
        list.value = this.As1;
        this.moment_.equationlist.push(list);
    };
    this.SteelBalCompRF = function () {
        this.As2 = this.mus / (this.phi * this.fy * (this.d - this.ddash));

        var list = {};
        list.symbol = "A_{s2}";
        list.equation = "{{0}} / {{1} * {2} {({3} - {4})}}";
        list.nameparam = ["M_{us}", "Φ", "f_y", "d", "d'"];
        list.valueparam = [this.mus, this.phi, this.fy, this.d, this.ddash];
        list.value = this.As2;
        this.moment_.equationlist.push(list);
    };
    this.SteelBalCompConcFlange = function () {
        this.As1 = this.Cf / this.fy;

        var list = {};
        list.symbol = "A_{s1}";
        list.equation = "{0} / {1}";
        list.nameparam = ["C_f", "f_y"];
        list.valueparam = [this.Cf, this.fy];
        list.value = this.As1;
        this.moment_.equationlist.push(list);
    };
    this.SteelBalCompConcWeb = function () {
        if (this.a1 <= this.amax) {
            this.As2 = this.muw / (this.phi * this.fy * (this.d - (this.a1 / 2)));

            var list = {};
            list.symbol = "A_{s2}";
            list.equation = "{0} / {{1} * {2} {( {3} - {4} / 2 )}}";
            list.nameparam = ["M_{uw}", "ϕ", "f_y", "d", "a_1"];
            list.valueparam = [this.muw, this.phi, this.fy, this.d, this.a1];
            list.value = this.As2;
            this.moment_.equationlist.push(list);
        } else {
            this.As2 = this.muc / (this.phi * this.fy * (this.d - (this.amax / 2)));

            var list = {};
            list.symbol = "A_{s2}";
            list.equation = "{0} / {{1} * {2} {( {3} - {4} / 2 )}}";
            list.nameparam = ["M_{uc}", "ϕ", "f_y", "d", "a_{max}"];
            list.valueparam = [this.muc, this.phi, this.fy, this.d, this.amax];
            list.value = this.As2;
            this.moment_.equationlist.push(list);
        }
    };
    this.SteelBalCompRFWeb = function () {
        this.As3 = this.mus / (this.phi * this.fy * (this.d - this.ddash));

        var list = {};
        list.symbol = "A_{s3}";
        list.equation = "{{0}} / {{1} * {2} {( {3} - {4} }) }";
        list.nameparam = ["M_{us}", "Φ", "f_y", "d", "d'"];
        list.valueparam = [this.mus, this.phi, this.fy, this.d, this.ddash];
        list.value = this.As3;
        this.moment_.equationlist.push(list);
    };

    this.ReqSteelTensFlex = function () {
        this.Asreq = this.mu / (this.phi * this.fy * (this.d - this.a / 2));

        var list = {};
        list.symbol = "A_s";
        list.equation = "{0} / {{1} * {2} {({3} - {{4} / 2})}}";
        list.nameparam = ["M_u", "Φ", "f_y", "d", "a"];
        list.valueparam = [this.mu, this.phi, this.fy, this.d, this.a];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelCompFlex = function () {
        this.Asdashreq = this.mus / (this.phi * (this.fsdash - 0.85 * this.fc) * (this.d - this.ddash));

        var list = {};
        list.symbol = "A'_s";
        list.equation = "{{0}} / {{1} {({2} - 0.85 * {3})} {({4} - {5})}}";
        list.nameparam = ["M_u_s", "Φ", "f'_s", "f'_c", "d", "d'"];
        list.valueparam = [this.mus, this.phi, this.fsdash, this.fc, this.d, this.ddash];
        list.value = this.Asdashreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelShear = function () {
        this.Avsreq = (this.vu - (this.phi * this.Vc)) / (this.phi * this.fys * this.d);

        var list = {};
        list.symbol = "A_v / s";
        list.equation = "{({0} - {{1} * {2}})} / {{3} * {4} * {5}}";
        list.nameparam = ["V_u", "ϕ", "V_c", "ϕ", "f_{ys}", "d"];
        list.valueparam = [this.vu, this.phi, this.Vc, this.phi, this.fys, this.d];
        list.value = this.Avsreq;
        this.shear_.equationlist.push(list);
    };
    this.ReqSteelTorsionAl = function () {
        this.Alreq = this.tu * this.ph / (2 * this.phi * this.Ao * this.fy * Math.tan(this.theta));
        //        this.Alreq = this.tu * this.ph / (2 * this.phi * this.Ao * this.fy * Math.tan(this.theta));

        var list = {};
        list.symbol = "A_l";
        list.equation = "{{0} * {1}} / { 2*{2} * {3} * {4} * {5}}";
        list.nameparam = ["T_u", "P_h", "ϕ", "A_o", "f_y", "tanθ"];
        list.valueparam = [this.tu, this.ph, this.phi, this.Ao, this.fy, this.theta];
        list.value = this.Alreq;
        this.torsion_.equationlist.push(list);
    };
    this.ReqSteelTorsionAts = function () {
        this.Atsreq = this.tu * Math.tan(this.theta) / (2 * this.phi * this.Ao * this.fys);

        var list = {};
        list.symbol = "A_t / s";
        list.equation = "{{0} * {1}} / {2 * {2} * {3} * {4}}";
        list.nameparam = ["T_u", "tanθ", "θ", "A_o", "f_{ys}"];
        list.valueparam = [this.tu, this.theta, this.phi, this.Ao, this.fys];
        list.value = this.Atsreq;
        this.torsion_.equationlist.push(list);
    };

}; //SAME FOR T, L-sections

var sectionrectangleACI318_14 = function (section) { //US Units
    sectionrectangleACI318_11.call(this);

    this.section = section;
};
var sectionflangedACI318_14 = function (section) { //US Units
    sectionflangedACI318_11.call(this);

    this.section = section;
};

var sectionrectangleBS8110_97 = function (section) { //SI Units
    sectionBS8110.call(this);

    this.section = section;

    this.CalculateFlexure = function () {
        var msg = "Please note that the BS 8110 design code equations are in SI Units";
        this.remarks_.remarklist.push(msg);

        this.Asreq = 0;
        this.Asdashreq = 0;
        this.Asweb = 0;

        //TODO: TEMP VALUES!!!
        //Flexure
        this.hagg = 10;
        this.nobars = 4;
        this.drfcornerbar = 6;

        //Shear
        this.gammaMconc = 1.5;
        this.gammaMsteel = 1.15;

        this.DepthEff(0); //coming from Flexure

        this.CheckMomentRedist();
        this.CalcLeverArm();

        if (this.K > this.Kdash)
            this.CalculateDoublyFlexure();
        else
            this.CalculateSinglyFlexure();

        this.CheckLimitsTenseFlexRF();
        this.CheckSpacing();
        this.CheckSkinRF();

        if (this.mu < 0) {
            this.astop_.value = this.Asreq;
            this.asbot_.value = this.Asdashreq;
        } else {
            this.asbot_.value = this.Asreq;
            this.astop_.value = this.Asdashreq;
        }

        this.asweb_.value = this.Asweb;
    };

    this.CalculateShear = function () {
        this.Avsreq = 0;

        this.DepthEff(1); //coming from Shear

        this.ShearConc();
        this.CheckLimitsShearRF();
        this.ShearCapConc();
        this.ReqSteelShear();

        this.avsreq_.value = this.Avsreq;
    };

    this.CalculateTorsion = function () {
        this.Atsreq = 0;
        this.Avtsreq = this.Avsreq;
        this.Alreq = 0;

        this.DepthEff(2); //coming from Torsion

        this.RectLinkDimension();
        this.TorsionalShearStress();
        this.TorsionThreshold();

        if (this.vt <= this.vtmin) {
            this.Avtsreq = this.Avsreq; // + 2 * this.Atsreq;
            //Display message: "Torsion stirrups not required"
            this.remarks_.remarklist.push("Torsion stirrups not required");
            this.atsreq_.remarks = "Not Required";

            if ((this.Avsreq + this.Atsreq) === 0) {
                var msg = "Not Required";
                //                this.remarks_.remarklist.push(msg);
                this.avtsreq_.remarks = msg;
            }

            if (this.Alreq === 0) {
                var msg = "Not Required";
                //                this.remarks_.remarklist.push(msg);
                this.alreq_.remarks = msg;
            }
        } else {
            this.CheckLimitsTorsionRF();
        }

        if (common.IsZero(this.Asdashreq)) {
            if (this.mu < 0) {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.asbot_.remarks = "Not Required";
            } else {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.astop_.remarks = "Not Required";
            }
        }

        var bars;
        var spacing;

        var set = $SETTINGS.smallestbar.enums;
        var minbars = $SETTINGS.smallestbar.value;
        var maxbars = $SETTINGS.largestbar.value;
        var maxnbars = $SETTINGS.maxbars.value;
        var mixnbars = $SETTINGS.maxmixbars.value;
        var excess = 0; //$SETTINGS.maxexcessarea.value;
        var minspacing = $SETTINGS.minstirrupspacing.value;
        var maxspacing = 400; //TODO: TEMPORARY VALUE!
        var width = this.section.w.value - this.section.cc.value * 2;

        this.atsreq_.value = this.Atsreq;
        this.avsreq_.value = this.Avsreq; //RE-UPDATE
        this.avtsreq_.value = this.Avtsreq;

        this.alreq_.value = this.Alreq;

        if (this.mu < 0) {
            this.astop_.value = this.Asreq; //RE-UPDATE
            this.asbot_.value = this.Asdashreq; //RE-UPDATE
        } else {
            this.asbot_.value = this.Asreq; //RE-UPDATE
            this.astop_.value = this.Asdashreq; //RE-UPDATE
        }

        this.asweb_.value = this.Asweb; //RE-UPDATE

        bars = rebarEquivalentBars(this.asbot_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minspacing, width);
        if (bars && bars.length !== 0) {
            this.asbotprov_.value = bars[0];
            this.asbotprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.astop_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minspacing, width);
        if (bars && bars.length !== 0) {
            this.astopprov_.value = bars[0];
            this.astopprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.asweb_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 1, minspacing, width);
        if (bars && bars.length !== 0) {
            this.aswebprov_.value = bars[0];
            this.aswebprov_.list = bars;
        }

        spacing = rebarEquivalentSpac(this.avtsreq_.value, set, minbars, maxbars, minspacing, maxspacing, width, excess);
        if (spacing && spacing.length !== 0) {
            this.avtsreqprov_.value = spacing[0];
            this.avtsreqprov_.list = spacing;
        }
    };

    //--------------------------------------------------------------------------//

    this.DepthEff = function (procedure) {
        this.d = this.h - this.cc - this.dstirrup - (this.drftens / 2);

        var list = {};
        list.symbol = "d";
        list.equation = "{0} - {1} - {2} - {{3}} / 2";
        list.nameparam = ["h", "c_c", "d_{stirrup}", "d_{rf,tens}"];
        list.valueparam = [this.h, this.cc, this.dstirrup, this.drftens];
        list.value = this.d;

        switch (procedure) {
            case 0: //coming from Flexure
                this.moment_.equationlist.push(list);
                break;
            case 1: //coming from Shear
                this.shear_.equationlist.push(list);
                break;
            case 2: //coming from Torsion
                this.torsion_.equationlist.push(list);
                break;
            default:
                break;
        }
    };
    this.DepthCompRF = function () {
        this.ddash = this.cc + this.dstirrup + (this.drfcomp / 2);

        var list = {};
        list.symbol = "d'";
        list.equation = "{0} + {1} + {{2}} / 2";
        list.nameparam = ["c_c", "d_{stirrup}", "d_{rf,comp}"];
        list.valueparam = [this.cc, this.dstirrup, this.drfcomp];
        list.value = this.ddash;
        this.moment_.equationlist.push(list);
    };
    this.RectLinkDimension = function () {
        if (this.b > this.h) {
            this.y1 = this.b - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2
            this.x1 = this.h - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2

            var list = {};
            list.symbol = "y1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["b", "c_c", "d_{stirrup}"];
            list.valueparam = [this.b, this.cc, this.dstirrup];
            list.value = this.y1;
            this.torsion_.equationlist.push(list);

            list = {};
            list.symbol = "x1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["h", "c_c", "d_{stirrup}"];
            list.valueparam = [this.h, this.cc, this.dstirrup];
            list.value = this.x1;
            this.torsion_.equationlist.push(list);
        } else {
            this.y1 = this.h - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2
            this.x1 = this.b - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2

            var list = {};
            list.symbol = "y1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["h", "c_c", "d_{stirrup}"];
            list.valueparam = [this.h, this.cc, this.dstirrup];
            list.value = this.y1;
            this.torsion_.equationlist.push(list);

            list = {};
            list.symbol = "x1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["b", "c_c", "d_{stirrup}"];
            list.valueparam = [this.b, this.cc, this.dstirrup];
            list.value = this.x1;
            this.torsion_.equationlist.push(list);
        }
    };

    this.CheckMomentRedist = function () {
        if (this.R > 30) {
            var msg = "Cannot redistribute more than 30%"; //BS 3.2.2.1(c)
            this.remarks_.remarklist.push(msg);
            this.asbot_.remarks = msg;
        } else {
            if (this.R <= 10) {
                this.R = 10;
                this.Kdash = 0.156; //BS 3.2.2.2

                var list = {}; //TODO: make it into single line eqn's
                list.symbol = "R";
                list.equation = "{0}";
                list.nameparam = ["10"];
                list.valueparam = [10];
                list.value = this.R;
                this.moment_.equationlist.push(list);

                list = {}; //TODO: make it into single line eqn's
                list.symbol = "K'";
                list.equation = "{0}";
                list.nameparam = ["0.156"];
                list.valueparam = [0.156];
                list.value = this.Kdash;
                this.moment_.equationlist.push(list);
            } else {
                this.betab = 1 - this.R / 100; // BS 3.2.2.1(b)
                this.Kdash = 0.402 * (this.betab - 0.4) - 0.18 * Math.pow(this.betab - 0.4, 2);

                var list = {};
                list.symbol = "β_b";
                list.equation = "1 - {{0}} / 100";
                list.nameparam = ["R"];
                list.valueparam = [this.R];
                list.value = this.betab;
                this.moment_.equationlist.push(list);

                list = {};
                list.symbol = "K'";
                list.equation = "0.402 * ({0} - 0.4) - 0.18 * ({0} - 0.4)^2";
                list.nameparam = ["β_b"];
                list.valueparam = [this.betab];
                list.value = this.Kdash;
                this.moment_.equationlist.push(list);
            }

            this.K = this.mu / (this.fc * this.b * Math.pow(this.d, 2));

            list = {};
            list.symbol = "K";
            list.equation = "{{0}} / {{1} * {2} * {3}^2}";
            list.nameparam = ["M_u", "f_c", "b", "d"];
            list.valueparam = [this.mu, this.fc, this.b, this.d];
            list.value = this.K;
            this.moment_.equationlist.push(list);
        }
    };
    this.CalcLeverArm = function () {
        this.z = this.d * (0.5 + Math.sqrt(0.25 - this.K / 0.9)); //BS 3.4.4.4

        if (this.z > 0.95 * this.d)
            this.z = 0.95 * this.d;

        if (this.z > 0.95 * this.d) {
            var list = {};
            list.symbol = "z";
            list.equation = "0.95 * {0}";
            list.nameparam = ["d"];
            list.valueparam = [this.d];
            list.value = this.z;

            this.moment_.equationlist.push(list);
        } else {
            var list = {};
            list.symbol = "z";
            list.equation = "{0} * {(0.5 + √{0.25 - {{1}} / 0.9})}";
            list.nameparam = ["d", "K"];
            list.valueparam = [this.d, this.K];
            list.value = this.z;

            this.moment_.equationlist.push(list);
        }
    };

    this.CheckLimitsTenseFlexRF = function () {
        this.Asmin = 0.0013 * this.b * this.h; //BS 3.12.5.3
        this.Asmax = 0.04 * this.b * this.h; //BS 3.12.6.1

        //CHECK MINIMUM TENSILE RF REQUIREMENTS [As,min]
        if (this.Asreq <= this.Asmin)
            this.Asreq = this.Asmin;

        //CHECK MAXIMUM TENSILE RF REQUIREMENTS [As,max]
        if (this.Asreq > this.Asmax) {
            //Display error message: "Section too small to hold tension r/f"
            var msg = "Section too small to hold tension r/f";
            this.remarks_.remarklist.push(msg);

            if (this.mu < 0) {
                this.astop_.remarks = msg;
            } else {
                this.asbot_.remarks = msg;
            }
        }
    };
    this.CheckLimitsCompFlexRF = function () {
        this.Asdashmin = 0.002 * this.b * this.h; //BS 3.12.5.3
        this.Asmax = 0.04 * this.b * this.h; //BS 3.12.6.1

        //CHECK MINIMUM COMPRESSIVE RF REQUIREMENTS [As',min]
        if (this.Asdashreq <= this.Asdashmin)
            this.Asdashreq = this.Asdashmin;

        //CHECK MAXIMUM COMPRESSIVE RF REQUIREMENTS [As',max]
        if (this.Asdashreq > this.Asmax) {  //if ((this.a > this.amax) && (this.Asdashreq > this.Asmax)) {
            //Display error message: "Section too small to hold compression r/f"
            var msg = "Section too small to hold compression r/f";

            if (this.mu < 0) {
                this.remarks_.remarklist.push(msg);
                this.asbot_.remarks = msg;
            } else {
                this.remarks_.remarklist.push(msg);
                this.astop_.remarks = msg;
            }
        }
    };
    this.CheckLimitsTorsionRF = function () {
        this.CombinedShearTorsionStress();

        // this.V = this.vu / (this.b * this.d); //BS 3.5.4.2

        if (this.y1 < 550) {
            if (this.vt > (this.vtu * (this.y1 / 550))) {
                //Display error message: "Increase concrete section"
                var msg = "Increase concrete section";
                this.remarks_.remarklist.push(msg);
                this.atsreq_.remarks = msg;
                this.alreq_.remarks = msg;

                this.Avtsreq = this.Avsreq + this.Atsreq; //BS 2.4.7 Part 2
            } else {
                this.CalcTorsionRF();
            }
        } else {
            if ((this.V + this.vt) > this.vtu) {
                //Display error message: "Increase concrete section"
                var msg = "Increase concrete section";
                this.remarks_.remarklist.push(msg);
                this.atsreq_.remarks = msg;
                this.alreq_.remarks = msg;

                this.Avtsreq = this.Avsreq + this.Atsreq; //BS 2.4.7 Part 2
            } else {
                this.CalcTorsionRF();
            }
        }
    };
    this.CheckSpacing = function () {
        /* [TODO: On graphics side]
         * If more than 1 row of rebar:
         * Bars should be vertically in line (BS 3.12.11.1(a))
         * Vertical distance >= (2 / 3) * h_agg (BS 3.12.11.1(b))
         * 
         * NOTE: 
         *      When bar size exceeds (this.hagg + 5):
         *      A spacing less than bar size or equivalent bar size should be avoided
         */

        //MINIMUM SPACING
        this.s1 = this.hagg + 5; //5 mm

        //MAXIMUM SPACING
        this.drftotal = 0;

        //TODO: Connect to rebar selector
        //        for (var i = 0; i < drf_anylistofbars.length; i++) {
        //            if ((drf_anylistofbars / drf_largest) >= 0.45) {
        //                this.drftotal += drf_anylistofbars;
        //            }
        //
        //            //Else ignore bars (BS 3.12.11.2.2)
        //        }

        this.s2 = (this.b - 2 * this.cc - 2 * this.dstirrup - this.drftotal) / this.nobars; //Clear horizontal distance between bars in tension
        //this.s2max = Math.max(47000 / this.fs, 300);
        this.s2max = Math.max(70000 * this.betab / this.fy, 300); // BS 3.12.11.2.3

        if (this.s2 > this.s2max)
            this.s2 = this.s2max;

        this.s3 = Math.sqrt(2 * Math.pow(this.cc + this.dstirrup + this.drfcornerbar, 2)) - this.drfcornerbar / 2; //Clear distance from the corner of a beam

        if (this.s3 <= this.s2 / 2)
            this.s3 = this.s2 / 2;
    };
    this.CheckSkinRF = function () {
        if (this.h >= 750) { //***750 mm
            this.btemp = this.b;

            //Skin reinforcment should be provided on both side faces of the beam for a distance 2h/3 fron tension face (BS 3.12.11.2.6)            
            this.sskinmax = 250; //BS 3.12.11.2.6

            if (this.btemp >= 500) //BS 3.12.5.4
                this.btemp = 500;

            this.sb = 160; //TODO: TEMP VAL! DO NOT KNOW YET!
            //            this.s1;

            this.drfskinbar = Math.sqrt(this.sb * this.btemp / this.fy);
            // Minumum size of bars in side faces of beams to control cracking should not be less than [this.drfskinbar] (BS 3.12.5.4)

            this.Asweb = Math.PI * Math.pow(this.drfskinbar / 2, 2);

            var list = {};
            list.symbol = "d_{rf,skin}";
            list.equation = "√{{{0} * {1}} / {2}}";
            list.nameparam = ["s_b", "b", "f_y"];
            list.valueparam = [this.sb, this.b, this.fy];
            list.value = this.drfskinbar;
            this.moment_.equationlist.push(list);

            list = {};
            list.symbol = "A_{s,web}";
            list.equation = "π * ({0} / 2)^2";
            list.nameparam = ["d_{rf,skin}"];
            list.valueparam = [this.drfskinbar];
            list.value = this.Asweb;
            this.moment_.equationlist.push(list);
        } else {
            //Display message: "Skin reinforcement not required"
            this.remarks_.remarklist.push("Skin r/f not required");
            this.asweb_.remarks = "Not Required";
        }
    };
    this.CheckLimitsShearRF = function () {
        this.Avsminratio = 0.15;
        this.Avsmaxratio = 3;

        this.Avsratio = 100 * this.Asreq / (this.b * this.d);
        this.depthratio = Math.pow(400 / this.d, 0.25);

        //CHECK MIN,MAX RF REQUIREMENT [Av/s,min]
        if (this.Avsratio < this.Avsminratio) {
            this.Avsratio = this.Avsminratio;

            var list = {};
            list.symbol = "A_{s,ratio}";
            list.equation = "A_s,min_{ratio}";
            list.nameparam = ["A_s,min_{ratio}"];
            list.valueparam = [this.Avsminratio];
            list.value = this.Avsratio;
            this.shear_.equationlist.push(list);
        } else if (this.Avsratio > this.Avsmaxratio) {
            this.Avsratio = this.Avsmaxratio;

            var list = {};
            list.symbol = "A_{s,ratio}";
            list.equation = "A_s,max_{ratio}";
            list.nameparam = ["A_s,max_{ratio}"];
            list.valueparam = [this.Avsmaxratio];
            list.value = this.Avsratio;
            this.shear_.equationlist.push(list);
        } else {
            var list = {};
            list.symbol = "A_{s,ratio}";
            list.equation = "{100 * {0}} / {{1} * {2}}";
            list.nameparam = ["A_s", "b", "d"];
            list.valueparam = [this.Asreq, this.b, this.d];
            list.value = this.Avsratio;
            this.shear_.equationlist.push(list);
        }

        if (this.depthratio < 1) {
            this.depthratio = 1;

            list = {};
            list.symbol = "d_{ratio}";
            list.equation = "1";
            list.nameparam = ["1"];
            list.valueparam = [1];
            list.value = this.depthratio;
            this.shear_.equationlist.push(list);
        } else {
            list = {};
            list.symbol = "d_{ratio}";
            list.equation = "(400 / {0})^{1/4}";
            list.nameparam = ["d"];
            list.valueparam = [this.d];
            list.value = this.depthratio;
            this.shear_.equationlist.push(list);
        }
    };

    this.CalculateSinglyFlexure = function () {
        this.ReqSteelSinglyTensFlex();

        //        if (this.asbot_.value < this.astop_.value) {
        //            this.momentcap_.value = -this.phiMn;
        //        } else {
        //            this.momentcap_.value = this.phiMn;
        //        }

        //        if (isNaN(this.momentcap_.value)) {
        //            this.momentcap_.remarks = "Not Computed";
        //        } else {
        //            var list = {};
        //            list.symbol = "ØM_n";
        //            list.value = this.momentcap_.value;
        //            this.momentcap_.equationlist.push(list);
        //            this.momentcap_.showequation = false;
        //        }
    };
    this.CalculateDoublyFlexure = function () {
        this.DepthCompRF();

        this.ReqSteelCompFlex();
        this.CheckLimitsCompFlexRF();

        this.ReqSteelDoublyTensFlex();

        //        if (this.asbot < this.astop) {
        //            this.momentcap_.value = -this.phiMn;
        //        } else {
        //            this.momentcap_.value = this.phiMn;
        //        }

        //        if (isNaN(this.momentcap_.value)) {
        //            this.momentcap_.remarks = "Not Computed";
        //        }
    };
    this.CalcTorsionRF = function () {
        this.ReqSteelTorsionAts();
        this.ReqSteelTorsionAl();

        this.Avtsreq = this.Avsreq + this.Atsreq; //BS 2.4.7 Part 2

        this.storsion = Math.min(this.x1, this.y1 / 2, 200); //200 mm BS 2.4.8 Part 2

        if ($SETTINGS.distributelongbars.value) { //BS 2.4.9 Part 2
            this.Asreq += 0.5 * this.Alreq; //TODO: GRAPHICS SIDE: ADD TO CORNERBARS ONLY!
            this.Asdashreq += 0.5 * this.Alreq;  //TODO: GRAPHICS SIDE: ADD TO CORNERBARS ONLY!
            //                    this.Asweb += 0.5 * this.Alreq;

            /* Combine the longitudinal reinforcement required for torsion
             * with that which is required for flexure
             * 
             * To achieve a uniform distribution of reinforcement
             * around the perimeter of the section, assign approximately
             * 1/4 of Alreq to each face
             */
        }

        var list = {};
        list.symbol = "A_{vt} / s";
        list.equation = "{0} + {1}";
        list.nameparam = ["A_{v} / s", "A_{t} / s"];
        list.valueparam = [this.Avsreq, this.Atsreq];
        list.value = this.Avtsreq;
        this.torsion_.equationlist.push(list);
    };

    this.ReqSteelSinglyTensFlex = function () {
        this.Asreq = this.mu / (0.87 * this.fy * this.z);

        var list = {};
        list.symbol = "A_s";
        list.equation = "{{0}} / {0.87 * {1} * {2}}";
        list.nameparam = ["M_u", "f_y", "z"];
        list.valueparam = [this.mu, this.fy, this.z];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelDoublyTensFlex = function () {
        this.Asreq = ((this.Kdash * this.fc * this.b * Math.pow(this.d, 2)) / (0.87 * this.fy * this.z)) + this.Asdashreq;

        var list = {};
        list.symbol = "A_s";
        list.equation = "{{0} * {1} * {2} * {3}} / {0.87 * {4} * {5}} + {6}";
        list.nameparam = ["K'", "f_c", "b", "d", "f_y", "z", "A_s'"];
        list.valueparam = [this.Kdash, this.fc, this.b, this.d, this.fy, this.z, this.Asdashreq];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelCompFlex = function () {
        this.Asdashreq = ((this.K - this.Kdash) * this.fc * this.b * Math.pow(this.d, 2)) / (0.87 * this.fy * (this.d - this.ddash)); //BS 3.4.4.4

        var list = {};
        list.symbol = "A_s'";
        list.equation = "{({0} - {1}) * {2} * {3} * {4}^2} / {0.87 * {5} * ({6} - {7})}";
        list.nameparam = ["K", "K'", "f_c", "b", "d", "f_y", "d", "d'"];
        list.valueparam = [this.K, this.Kdash, this.fc, this.b, this.d, this.fy, this.d, this.ddash];
        list.value = this.Asdashreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelShear = function () {
        if (this.V < this.Vc / 2) {
            this.Avsreq = 0;

            this.remarks_.remarklist.push("Shear stirrups not required");
            this.avsreq_.remarks = "Not Required";
        } else if (this.V < this.Vc + 0.4) {
            this.Avsreq = 0.4 * this.b / (0.87 * this.fys);
            //            this.sv = 0.75 * this.d;

            var list = {};
            list.symbol = "A_v / s";
            list.equation = "{0.4 * {0}} / {0.87 * {1}}";
            list.nameparam = ["b", "f_{ys}"];
            list.valueparam = [this.b, this.fys];
            list.value = this.Avsreq;
            this.shear_.equationlist.push(list);
        } else {
            this.Avsreq = this.b * (this.V - this.Vc) / (0.87 * this.fys);
            //            this.sv = 0.75 * this.d;

            var list = {};
            list.symbol = "A_v / s";
            list.equation = "{{0} * ({1} - {2})} / {0.87 * {3}}";
            list.nameparam = ["b", "V", "V_c", "f_{ys}"];
            list.valueparam = [this.b, this.V, this.Vc, this.fys];
            list.value = this.Avsreq;
            this.shear_.equationlist.push(list);
        }
    };
    this.ReqSteelTorsionAts = function () {
        this.Atsreq = this.tu / (0.8 * this.x1 * this.y1 * 0.87 * this.fys); //BS 2.4.7 Part 2

        var list = {};
        list.symbol = "A_t / s";
        list.equation = "{{0}} / {0.8 * {1} * {2} * 0.87 * {3}}";
        list.nameparam = ["T_u", "x_1", "y_1", "f_{ys}"];
        list.valueparam = [this.tu, this.x1, this.y1, this.fys];
        list.value = this.Atsreq;
        this.torsion_.equationlist.push(list);
    };
    this.ReqSteelTorsionAl = function () {
        this.Alreq = this.Atsreq * (this.fys / this.fy) * (this.x1 + this.y1); //BS 2.4.7 Part 2

        var list = {};
        list.symbol = "A_l";
        list.equation = "{0} * ({1} / {2}) * ({3} + {4})";
        list.nameparam = ["(A_t / s)", "f_{ys}", "f_y", "x_1", "y_1"];
        list.valueparam = [this.Atsreq, this.fys, this.fy, this.x1, this.y1];
        list.value = this.Alreq;
        this.torsion_.equationlist.push(list);
    };

    this.ShearConc = function () {
        this.V = this.vu / (this.b * this.d); //BS 3.5.4.2

        var list = {};
        list.symbol = "V_s";
        list.equation = "{{0}} / {{1} * {2}}";
        list.nameparam = ["V_u", "b", "d"];
        list.valueparam = [this.vu, this.b, this.d];
        list.value = this.V;
        this.shear_.equationlist.push(list);
    };
    this.ShearCapConc = function () {
        this.Vc = (0.79 / this.gammaMconc) * Math.pow(this.fc / 25, 0.333333333) * Math.pow(this.Avsratio, 0.333333333) * this.depthratio;  //BS 3.4.5.4

        var list = {};
        list.symbol = "V_c";
        list.equation = "(0.79 / {0}) * {({{1}} / 25)^{1/3} * ({2})^{1/3} * {3}";
        list.nameparam = ["γ_{m,concrete}", "f'_c", "A_{s,ratio}", "d_{ratio}"];
        list.valueparam = [this.gammaMconc, this.fc, this.Avsratio, this.depthratio];
        list.value = this.Vc;
        this.shear_.equationlist.push(list);
    };

    this.TorsionalShearStress = function () {
        if (this.b > this.h) {
            this.hmax = this.b;
            this.hmin = this.h;
        } else {
            this.hmax = this.h;
            this.hmin = this.b;
        }

        this.vt = (2 * this.tu) / (Math.pow(this.hmin, 2) * (this.hmax - this.hmin / 3)); //BS 2.4.4.1 Part 2

        var list = {};
        list.symbol = "V_t";
        list.equation = "{2 * {0}} / {({1})^2 * ({2} - {{3}} / 3)}";
        list.nameparam = ["T_u", "h_{min}", "h_{max}", "h_{min}"];
        list.valueparam = [this.tu, this.hmin, this.hmax, this.hmin];
        list.value = this.vt;
        this.torsion_.equationlist.push(list);
    };
    this.TorsionThreshold = function () {
        this.vtmin = Math.min(0.067 * this.gammaMconc * this.fc, 0.4);

        var list = {};
        list.symbol = "V_{t,min}";
        list.equation = "min(0.067 * {0} * {1}, 0.4)";
        list.nameparam = ["γ_{m,concrete}", "f_c"];
        list.valueparam = [this.gammaMconc, this.fc];
        list.value = this.vtmin;
        this.torsion_.equationlist.push(list);
    };
    this.CombinedShearTorsionStress = function () {
        this.vtu = Math.min(0.8 * this.gammaMconc * this.fc, 5); //BS 2.4.6 Part 2

        var list = {};
        list.symbol = "V_{t_u}";
        list.equation = "min(0.8 * {0} * {1}, 5)";
        list.nameparam = ["γ_{m,concrete}", "f_c"];
        list.valueparam = [this.gammaMconc, this.fc];
        list.value = this.vtu;
        this.torsion_.equationlist.push(list);
    };
};
var sectionflangedBS8110_97 = function (section) { //SI Units
    sectionBS8110.call(this);

    this.section = section;

    this.CalculateFlexure = function () {
        var msg = "Please note that the BS 8110 design code equations are in SI Units";
        this.remarks_.remarklist.push(msg);

        this.Asreq = 0;
        this.Asdashreq = 0;
        this.Asweb = 0;
        this.K = 0;
        this.bf = this.b;
        this.btemp = this.b;

        //TODO: TEMP VALUES!!!
        //Flexure
        this.hagg = 10;
        this.nobars = 4;
        this.drfcornerbar = 6;

        //Shear
        this.gammaMconc = 1.5;
        this.gammaMsteel = 1.15;

        if (this.mu < 0) {
            //Use b = bw: DESIGN AS RECTANGULAR
            this.b = this.bw;
            this.DepthEff(0); //coming from Flexure

            this.CheckMomentRedist();
            this.RedistFactorRect();
            //            this.K = this.Krect;
            this.CalcLeverArm(this.Krect, "K_{rect}");

            if (this.Krect > this.Kdash)
                this.CalculateDoublyFlexure();
            else
                this.CalculateSinglyFlexure();

            //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
            this.CheckLimitsTenseFlexRFRect();

        } else {
            this.DepthEff(0); //coming from Flexure

            this.RedistFactorFlange();
            //            this.K = this.Kf;
            this.CalcLeverArm(this.Kf, "K_{flange}");
            this.NeutralAxisDepth();
            this.DepthEquiCompBlock();

            if (this.a <= this.ds) {
                //Use b = bf: DESIGN AS RECTANGULAR
                this.b = this.bf;

                this.CheckMomentRedist();
                this.RedistFactorRect();
                //                this.K = this.Krect;
                this.CalcLeverArm(this.Krect, "K_{rect}");

                if (this.Krect > this.Kdash)
                    this.CalculateDoublyFlexure();
                else
                    this.CalculateSinglyFlexure();

                //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
                this.CheckLimitsTenseFlexRFRect();
            } else {
                this.BetaF();
                this.MomentResistSection();
                this.CheckMomentRedist();

                if ((this.mu <= this.mr) && (this.ds <= 0.45 * this.d) && (this.Kf <= this.Kdash)) {
                    this.ReqSteelTensFlexWeb();
                } else {
                    //Check comp r/f
                    this.MomentResistFlange();
                    this.MomentResistWeb();
                    this.RedistFactorWeb();

                    if (this.Kw <= this.Kdash) {
                        //Singly r/f design
                        //                        this.K = this.Kw;
                        this.CalcLeverArm(this.Kw, "K_{web}");
                        this.NeutralAxisDepth();
                        this.ReqSteelTensFlexWebSingly();
                    } else {
                        //Doubly r/f design
                        this.DepthCompRF();
                        this.UltimateMomentResistWeb();

                        if ((this.ddash / this.d) <= 0.5 * (1 - (this.fy / 800))) {
                            this.fsdash = 0.87 * this.fy;

                            var list = {};
                            list.symbol = "f_s'";
                            list.equation = "0.87 * {0}";
                            list.nameparam = ["f_y"];
                            list.valueparam = [this.fy];
                            list.value = this.fsdash;

                            this.moment_.equationlist.push(list);
                        } else {
                            this.fsdash = this.es * this.ecmax * (1 - ((2 * this.ddash) / this.d));

                            var list = {};
                            list.symbol = "f_s'";
                            list.equation = "{0} * {1} * (1 - {2 * {2}} / {3})";
                            list.nameparam = ["E_s", "e_{c,max}", "d'", "d"];
                            list.valueparam = [this.es, this.ecmax, this.ddash, this.d];
                            list.value = this.fsdash;

                            this.moment_.equationlist.push(list);
                        }

                        this.ReqSteelCompFlexFlange();

                        //                        this.K = this.Kdash;
                        this.CalcLeverArm(this.Kdash, "K'");

                        this.ReqSteelTensFlexWebDoubly();

                        this.CheckLimitsCompFlexRF();
                    }
                }
            }

            //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
            this.CheckLimitsTenseFlexRF();
        }

        //CHECK SKIN RF REQUIREMENTS [Sskinmax]
        this.CheckSpacing();
        this.CheckSkinRF();

        if (this.mu < 0) {
            this.astop_.value = this.Asreq;
            this.asbot_.value = this.Asdashreq;
        } else {
            this.asbot_.value = this.Asreq;
            this.astop_.value = this.Asdashreq;
        }

        this.asweb_.value = this.Asweb;
    };

    this.CalculateShear = function () {
        this.Avsreq = 0;

        this.DepthEff(1); //coming from Shear

        this.ShearConc();
        this.CheckLimitsShearRF();
        this.ShearCapConc();
        this.ReqSteelShear();

        this.avsreq_.value = this.Avsreq;
    };

    this.CalculateTorsion = function () {
        this.Atsreq = 0;
        this.Avtsreq = this.Avsreq;
        this.Alreq = 0;

        this.DepthEff(2); //coming from Torsion

        this.RectLinkDimension();
        this.TorsionalShearStress();
        this.TorsionThreshold();

        if (this.vt <= this.vtmin) {
            this.Avtsreq = this.Avsreq; // + 2 * this.Atsreq;
            //Display message: "Torsion stirrups not required"
            this.remarks_.remarklist.push("Torsion stirrups not required");
            this.atsreq_.remarks = "Not Required";

            if ((this.Avsreq + this.Atsreq) === 0) {
                var msg = "Not Required";
                //                this.remarks_.remarklist.push(msg);
                this.avtsreq_.remarks = msg;
            }

            if (this.Alreq === 0) {
                var msg = "Not Required";
                //                this.remarks_.remarklist.push(msg);
                this.alreq_.remarks = msg;
            }
        } else {
            this.CheckLimitsTorsionRF();
        }

        if (common.IsZero(this.Asdashreq)) {
            if (this.mu < 0) {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.asbot_.remarks = "Not Required";
            } else {
                this.remarks_.remarklist.push("Compression r/f not required");
                this.astop_.remarks = "Not Required";
            }
        }

        var bars;
        var spacing;

        var set = $SETTINGS.smallestbar.enums;
        var minbars = $SETTINGS.smallestbar.value;
        var maxbars = $SETTINGS.largestbar.value;
        var maxnbars = $SETTINGS.maxbars.value;
        var mixnbars = $SETTINGS.maxmixbars.value;
        var excess = 0; //$SETTINGS.maxexcessarea.value;
        var minspacing = $SETTINGS.minstirrupspacing.value;
        var maxspacing = 400; //TODO: TEMPORARY VALUE!
        var width = this.section.w.value - this.section.cc.value * 2;

        this.atsreq_.value = this.Atsreq;
        this.avsreq_.value = this.Avsreq; //RE-UPDATE
        this.avtsreq_.value = this.Avtsreq;

        this.alreq_.value = this.Alreq;

        if (this.mu < 0) {
            this.astop_.value = this.Asreq; //RE-UPDATE
            this.asbot_.value = this.Asdashreq; //RE-UPDATE
        } else {
            this.asbot_.value = this.Asreq; //RE-UPDATE
            this.astop_.value = this.Asdashreq; //RE-UPDATE
        }

        this.asweb_.value = this.Asweb; //RE-UPDATE

        bars = rebarEquivalentBars(this.asbot_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minspacing, width);
        if (bars && bars.length !== 0) {
            this.asbotprov_.value = bars[0];
            this.asbotprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.astop_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 2, minspacing, width);
        if (bars && bars.length !== 0) {
            this.astopprov_.value = bars[0];
            this.astopprov_.list = bars;
        }

        bars = rebarEquivalentBars(this.asweb_.value, set, minbars, maxbars, maxnbars, mixnbars, excess, 1, minspacing, width);
        if (bars && bars.length !== 0) {
            this.aswebprov_.value = bars[0];
            this.aswebprov_.list = bars;
        }

        spacing = rebarEquivalentSpac(this.avtsreq_.value, set, minbars, maxbars, minspacing, maxspacing, width, excess);
        if (spacing && spacing.length !== 0) {
            this.avtsreqprov_.value = spacing[0];
            this.avtsreqprov_.list = spacing;
        }
    };

    //--------------------------------------------------------------------------//

    //FLEXURE BS CODE
    this.DepthEff = function (procedure) {
        this.d = this.h - this.cc - this.dstirrup - (this.drftens / 2);

        var list = {};
        list.symbol = "d";
        list.equation = "{0} - {1} - {2} - {{3}} / 2";
        list.nameparam = ["h", "c_c", "d_{stirrup}", "d_{rf,tens}"];
        list.valueparam = [this.h, this.cc, this.dstirrup, this.drftens];
        list.value = this.d;

        switch (procedure) {
            case 0: //coming from Flexure
                this.moment_.equationlist.push(list);
                break;
            case 1: //coming from Shear
                this.shear_.equationlist.push(list);
                break;
            case 2: //coming from Torsion
                this.torsion_.equationlist.push(list);
                break;
            default:
                break;
        }
    };
    this.DepthCompRF = function () {
        this.ddash = this.cc + this.dstirrup + (this.drfcomp / 2);

        var list = {};
        list.symbol = "d'";
        list.equation = "{0} + {1} + {{2}} / 2";
        list.nameparam = ["c_c", "d_{stirrup}", "d_{rf,comp}"];
        list.valueparam = [this.cc, this.dstirrup, this.drfcomp];
        list.value = this.ddash;

        this.moment_.equationlist.push(list);
    };
    this.RectLinkDimension = function () {
        if (this.bw > this.h) {
            this.y1 = this.bw - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2
            this.x1 = this.h - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2

            var list = {};
            list.symbol = "y1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["b_w", "c_c", "d_{stirrup}"];
            list.valueparam = [this.bw, this.cc, this.dstirrup];
            list.value = this.y1;
            this.torsion_.equationlist.push(list);

            list = {};
            list.symbol = "x1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["h", "c_c", "d_{stirrup}"];
            list.valueparam = [this.h, this.cc, this.dstirrup];
            list.value = this.x1;
            this.torsion_.equationlist.push(list);
        } else {
            this.y1 = this.h - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2
            this.x1 = this.bw - 2 * (this.cc - this.dstirrup / 2); //BS 2.4.2 - Part 2

            var list = {};
            list.symbol = "y1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["h", "c_c", "d_{stirrup}"];
            list.valueparam = [this.h, this.cc, this.dstirrup];
            list.value = this.y1;
            this.torsion_.equationlist.push(list);

            list = {};
            list.symbol = "x1";
            list.equation = "{0} - 2 * ({1} - {{2}} / 2)";
            list.nameparam = ["b_w", "c_c", "d_{stirrup}"];
            list.valueparam = [this.bw, this.cc, this.dstirrup];
            list.value = this.x1;
            this.torsion_.equationlist.push(list);
        }
    };

    this.CheckMomentRedist = function () {
        if (this.R > 30) {
            var msg = "Cannot redistribute more than 30%"; //BS 3.2.2.1(c)
            this.remarks_.remarklist.push(msg);
            this.asbot_.remarks = msg;
        } else {
            if (this.R <= 10) {
                this.R = 10;
                this.Kdash = 0.156; //BS 3.2.2.2

                var list = {}; //TODO: make it into single line eqn's
                list.symbol = "R";
                list.equation = "{0}";
                list.nameparam = ["10"];
                list.valueparam = [10];
                list.value = this.R;
                this.moment_.equationlist.push(list);

                list = {}; //TODO: make it into single line eqn's
                list.symbol = "K'";
                list.equation = "{0}";
                list.nameparam = ["0.156"];
                list.valueparam = [0.156];
                list.value = this.Kdash;
                this.moment_.equationlist.push(list);
            } else {
                this.betab = 1 - this.R / 100; // BS 3.2.2.1(b)
                this.Kdash = 0.402 * (this.betab - 0.4) - 0.18 * Math.pow(this.betab - 0.4, 2);

                var list = {};
                list.symbol = "β_b";
                list.equation = "1 - {{0}} / 100";
                list.nameparam = ["R"];
                list.valueparam = [this.R];
                list.value = this.betab;
                this.moment_.equationlist.push(list);

                list = {};
                list.symbol = "K'";
                list.equation = "0.402 * ({0} - 0.4) - 0.18 * ({0} - 0.4)^2";
                list.nameparam = ["β_b"];
                list.valueparam = [this.betab];
                list.value = this.Kdash;
                this.moment_.equationlist.push(list);
            }
        }
    };
    this.RedistFactorFlange = function () {
        this.Kf = this.mu / (this.fc * this.bf * Math.pow(this.d, 2));

        var list = {};
        list.symbol = "K_{flange}";
        list.equation = "{{0}} / {{1} * {2} * {3}^2}";
        list.nameparam = ["M_u", "f_c", "bf", "d"];
        list.valueparam = [this.mu, this.fc, this.bf, this.d];
        list.value = this.Kf;
        this.moment_.equationlist.push(list);
    };
    this.RedistFactorWeb = function () {
        this.Kw = this.mw / (this.fc * this.bw * Math.pow(this.d, 2));

        var list = {};
        list.symbol = "K_{web}";
        list.equation = "{{0}} / {{1} * {2} * {3}^2}";
        list.nameparam = ["M_w", "f_c", "bf", "d"];
        list.valueparam = [this.mw, this.fc, this.bw, this.d];
        list.value = this.Kw;
        this.moment_.equationlist.push(list);
    };
    this.RedistFactorRect = function () {
        this.Krect = this.mu / (this.fc * this.b * Math.pow(this.d, 2));

        var list = {};
        list.symbol = "K_{rect}";
        list.equation = "{{0}} / {{1} * {2} * {3}^2}";
        list.nameparam = ["M_u", "f_c", "b", "d"];
        list.valueparam = [this.mu, this.fc, this.b, this.d];
        list.value = this.Krect;
        this.moment_.equationlist.push(list);
    };

    this.CalcLeverArm = function (K, string) {
        this.z = this.d * (0.5 + Math.sqrt(0.25 - K / 0.9)); //BS 3.4.4.4

        if (this.z > 0.95 * this.d)
            this.z = 0.95 * this.d;

        if (this.z > 0.95 * this.d) {
            var list = {};
            list.symbol = "z";
            list.equation = "0.95 * {0}";
            list.nameparam = ["d"];
            list.valueparam = [this.d];
            list.value = this.z;
            this.moment_.equationlist.push(list);
        } else {
            var list = {};
            list.symbol = "z";
            list.equation = "{0} * {(0.5 + √{0.25 - {{1}} / 0.9})}";
            list.nameparam = ["d", string];
            list.valueparam = [this.d, K];
            list.value = this.z;
            this.moment_.equationlist.push(list);
        }
    };
    this.NeutralAxisDepth = function () {
        this.x = (this.d - this.z) / 0.45;

        var list = {};
        list.symbol = "x_{NA}";
        list.equation = "{{0} - {1}} / 0.45";
        list.nameparam = ["d", "z"];
        list.valueparam = [this.d, this.z];
        list.value = this.x;
        this.moment_.equationlist.push(list);
    };
    this.DepthEquiCompBlock = function () {
        this.a = 0.9 * this.x;

        var list = {};
        list.symbol = "a";
        list.equation = "0.9 * {0}";
        list.nameparam = ["x_{NA}"];
        list.valueparam = [this.x];
        list.value = this.a;
        this.moment_.equationlist.push(list);
    };
    this.BetaF = function () {
        this.betaF = (0.45 * (this.ds / this.d) * (1 - (this.bw / this.bf)) * (1 - (this.ds / (2 * this.d)))) + 0.15 * (this.bw / this.bf);

        var list = {};
        list.symbol = "β_f";
        list.equation = "(0.45 * ({0} / {1}) * (1 - {{2} / {3}}) * (1 - {{{4}} / {2 * {5}}})) + 0.15 * ({{6}} / {7})";
        list.nameparam = ["d_s", "d", "b_w", "b_f", "d_s", "d", "b_w", "b_f"];
        list.valueparam = [this.ds, this.d, this.bw, this.bf, this.ds, this.d, this.bw, this.bf];
        list.value = this.betaF;
        this.moment_.equationlist.push(list);
    };

    this.MomentResistSection = function () {
        this.mr = this.betaF * this.fc * this.bf * Math.pow(this.d, 2);

        var list = {};
        list.symbol = "M_R";
        list.equation = "{0} * {1} * {2} * {3}^2";
        list.nameparam = ["β_f", "f_c", "b_f", "d"];
        list.valueparam = [this.betaF, this.fc, this.bf, this.d];
        list.value = this.mr;
        this.moment_.equationlist.push(list);
    };
    this.MomentResistFlange = function () {
        this.mf = (0.67 * this.fc / this.gammaMconc) * (this.bf - this.bw) * this.ds * (this.d - 0.5 * this.ds);

        var list = {};
        list.symbol = "M_f";
        list.equation = "({0.67 * {0}} / {1}) * ({2} - {3}) * {4} * ({5} - 0.5 * {6})";
        list.nameparam = ["f_c", "γ_{m,concrete}", "b_f", "b_w", "d_s", "d", "d_s"];
        list.valueparam = [this.fc, this.gammaMconc, this.bf, this.bw, this.ds, this.d, this.ds];
        list.value = this.mf;
        this.moment_.equationlist.push(list);
    };
    this.MomentResistWeb = function () {
        this.mw = this.mu - this.mf;

        var list = {};
        list.symbol = "M_w";
        list.equation = "{0} - {1}";
        list.nameparam = ["M_u", "M_f"];
        list.valueparam = [this.mu, this.mf];
        list.value = this.mw;
        this.moment_.equationlist.push(list);
    };
    this.UltimateMomentResistWeb = function () {
        this.muw = this.Kdash * this.fc * this.bw * Math.pow(this.d, 2);

        var list = {};
        list.symbol = "M_{uw}";
        list.equation = "{0} * {1} * {2} * {3}^2";
        list.nameparam = ["K'", "f_c", "b_w", "d"];
        list.valueparam = [this.Kdash, this.fc, this.bw, this.d];
        list.value = this.muw;
        this.moment_.equationlist.push(list);
    };

    this.CalculateSinglyFlexure = function () {
        this.ReqSteelTensFlexRectSingly();

        //        if (this.asbot_.value < this.astop_.value) {
        //            this.momentcap_.value = -this.phiMn;
        //        } else {
        //            this.momentcap_.value = this.phiMn;
        //        }

        //        if (isNaN(this.momentcap_.value)) {
        //            this.momentcap_.remarks = "Not Computed";
        //        } else {
        //            var list = {};
        //            list.symbol = "ØM_n";
        //            list.value = this.momentcap_.value;
        //            this.momentcap_.equationlist.push(list);
        //            this.momentcap_.showequation = false;
        //        }
    };
    this.CalculateDoublyFlexure = function () {
        this.DepthCompRF();

        this.ReqSteelCompFlexRect();
        this.CheckLimitsCompFlexRFRect();

        this.ReqSteelTensFlexRectDoubly();

        //        if (this.asbot < this.astop) {
        //            this.momentcap_.value = -this.phiMn;
        //        } else {
        //            this.momentcap_.value = this.phiMn;
        //        }

        //        if (isNaN(this.momentcap_.value)) {
        //            this.momentcap_.remarks = "Not Computed";
        //        }
    };

    this.ReqSteelTensFlexWeb = function () {
        this.Asreq = (this.mu + 0.1 * this.fc * this.bw * this.d * (0.45 * this.d - this.ds)) / (0.87 * this.fy * (this.d - 0.5 * this.ds));

        var list = {};
        list.symbol = "A_s";
        list.equation = "{{0} + 0.1 * {1} * {2} * {3} * (0.45 * {4} - {5})} / {0.87 * {6} * ({7} - 0.5 * {8})}";
        list.nameparam = ["M_u", "f_c", "b_w", "d", "d", "d_s", "f_y", "d", "d_s"];
        list.valueparam = [this.mu, this.fc, this.bw, this.d, this.d, this.ds, this.fy, this.d, this.ds];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelTensFlexWebSingly = function () {
        this.Asreq = (this.mf / (0.87 * this.fy * (this.d - 0.5 * this.ds))) + (this.mu / (0.87 * this.fy * this.z));

        var list = {};
        list.symbol = "A_s";
        list.equation = "({{0}} / {0.87 * {1} * ({2} - 0.5 * {3})}) + ({{4}} / {0.87 * {5} * {6}})";
        list.nameparam = ["M_f", "f_y", "d", "d_s", "M_u", "f_y", "z"];
        list.valueparam = [this.mf, this.fy, this.d, this.ds, this.mu, this.fy, this.z];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelTensFlexWebDoubly = function () {
        this.Asreq = (this.mf / (0.87 * this.fy * (this.d - 0.5 * this.ds))) + (this.muw / (0.87 * this.fy * this.z)) + this.Asdashreq;

        var list = {};
        list.symbol = "A_s";
        list.equation = "({{0}} / {0.87 * {1} * ({2} - 0.5 * {3})}) + ({{4}} / {0.87 * {5} * {6}}) + {7}";
        list.nameparam = ["M_f", "f_y", "d", "d_s", "M_{uw}", "f_y", "z", "A_s'"];
        list.valueparam = [this.mf, this.fy, this.d, this.ds, this.muw, this.fy, this.z, this.Asdashreq];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelCompFlexFlange = function () {
        this.Asdashreq = (this.mw - this.muw) / ((this.fsdash - (0.67 * this.fc / this.gammaMconc)) * (this.d - this.ddash));

        var list = {};
        list.symbol = "A_s'";
        list.equation = "{{0} - {1}} / {({2} - {0.67 * {3} / {4}}) * ({5} - {6})}";
        list.nameparam = ["M_w", "M_{uw}", "f_s'", "f_c", "γ_{m,concrete}", "d", "d'"];
        list.valueparam = [this.mw, this.muw, this.fsdash, this.fc, this.gammaMconc, this.d, this.ddash];
        list.value = this.Asdashreq;
        this.moment_.equationlist.push(list);
    };

    this.ReqSteelTensFlexRectSingly = function () {
        this.Asreq = this.mu / (0.87 * this.fy * this.z);

        var list = {};
        list.symbol = "A_s";
        list.equation = "{{0}} / {0.87 * {1} * {2}}";
        list.nameparam = ["M_u", "f_y", "z"];
        list.valueparam = [this.mu, this.fy, this.z];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelTensFlexRectDoubly = function () {
        this.Asreq = ((this.Kdash * this.fc * this.b * Math.pow(this.d, 2)) / (0.87 * this.fy * this.z)) + this.Asdashreq;

        var list = {};
        list.symbol = "A_s";
        list.equation = "({{0} * {1} * {2} * {3}^2} / {0.87 * {4} * {5}}) + {6}";
        list.nameparam = ["K'", "f_c", "b", "d", "f_y", "z", "A_s'"];
        list.valueparam = [this.Kdash, this.fc, this.b, this.d, this.fy, this.z, this.Asdashreq];
        list.value = this.Asreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelCompFlexRect = function () {
        this.Asdashreq = ((this.K - this.Kdash) * this.fc * this.b * Math.pow(this.d, 2)) / (0.87 * this.fy * (this.d - this.ddash)); //BS 3.4.4.4

        var list = {};
        list.symbol = "A_s'";
        list.equation = "{({0} - {1}) * {2} * {3} * {4}^2} / {0.87 * {5} * ({6} - {7})}";
        list.nameparam = ["K", "K'", "f_c", "b", "d", "f_y", "d", "d'"];
        list.valueparam = [this.K, this.Kdash, this.fc, this.b, this.d, this.fy, this.d, this.ddash];
        list.value = this.Asdashreq;
        this.moment_.equationlist.push(list);
    };
    this.ReqSteelTorsionAts = function () {
        this.Atsreq = this.tu / (0.8 * this.x1 * this.y1 * 0.87 * this.fys); //BS 2.4.7 Part 2

        var list = {};
        list.symbol = "A_t / s";
        list.equation = "{{0}} / {0.8 * {1} * {2} * 0.87 * {3}}";
        list.nameparam = ["T_u", "x_1", "y_1", "f_{ys}"];
        list.valueparam = [this.tu, this.x1, this.y1, this.fys];
        list.value = this.Atsreq;
        this.torsion_.equationlist.push(list);
    };
    this.ReqSteelTorsionAl = function () {
        this.Alreq = this.Atsreq * (this.fys / this.fy) * (this.x1 + this.y1); //BS 2.4.7 Part 2

        var list = {};
        list.symbol = "A_l";
        list.equation = "{0} * ({1} / {2}) * ({3} + {4})";
        list.nameparam = ["(A_t / s)", "f_{ys}", "f_y", "x_1", "y_1"];
        list.valueparam = [this.Atsreq, this.fys, this.fy, this.x1, this.y1];
        list.value = this.Alreq;
        this.torsion_.equationlist.push(list);
    };

    //SHEAR BS CODE
    this.ShearConc = function () {
        this.V = this.vu / (this.bw * this.d); //BS 3.5.4.2

        var list = {};
        list.symbol = "V_s";
        list.equation = "{{0}} / {{1} * {2}}";
        list.nameparam = ["V_u", "b_w", "d"];
        list.valueparam = [this.vu, this.bw, this.d];
        list.value = this.V;

        this.shear_.equationlist.push(list);
    };
    this.ShearCapConc = function () {
        this.Vc = (0.79 / this.gammaMconc) * Math.pow(this.fc / 25, 0.333333333) * Math.pow(this.Avsratio, 0.333333333) * this.depthratio;  //BS 3.4.5.4

        var list = {};
        list.symbol = "V_c";
        list.equation = "(0.79 / {0}) * {({{1}} / 25)^{1/3} * ({2})^{1/3} * {3}";
        list.nameparam = ["γ_{m,concrete}", "f'_c", "A_{s,ratio}", "d_{ratio}"];
        list.valueparam = [this.gammaMconc, this.fc, this.Avsratio, this.depthratio];
        list.value = this.Vc;
        this.shear_.equationlist.push(list);
    };
    this.ReqSteelShear = function () {
        if (this.V < this.Vc / 2) {
            this.Avsreq = 0;

            this.remarks_.remarklist.push("Shear stirrups not required");
            this.avsreq_.remarks = "Not Required";
        } else if (this.V < this.Vc + 0.4) {
            this.Avsreq = 0.4 * this.bw / (0.87 * this.fys);
            //            this.sv = 0.75 * this.d;

            var list = {};
            list.symbol = "A_v / s";
            list.equation = "{0.4 * {0}} / {0.87 * {1}}";
            list.nameparam = ["b_w", "f_{ys}"];
            list.valueparam = [this.bw, this.fys];
            list.value = this.Avsreq;
            this.shear_.equationlist.push(list);
        } else {
            this.Avsreq = this.bw * (this.V - this.Vc) / (0.87 * this.fys);
            //            this.sv = 0.75 * this.d;

            var list = {};
            list.symbol = "A_v / s";
            list.equation = "{{0} * ({1} - {2})} / {0.87 * {3}}";
            list.nameparam = ["b_w", "V", "V_c", "f_{ys}"];
            list.valueparam = [this.bw, this.V, this.Vc, this.fys];
            list.value = this.Avsreq;
            this.shear_.equationlist.push(list);
        }
    };

    //R/F CHECKS
    this.CheckLimitsTenseFlexRF = function () { //TODO: Check r/f limits flowchart again. => If mu is (-)tive then it's designed as rectangular
        if (this.mu > 0) {
            //Check aspect ratio
            if ((this.bw / this.bf) >= 0.4) {
                this.CheckMinTensRFType1();
            } else {
                this.CheckMinTensRFType2();
            }
        } else {
            //Check section type
            if (this.section instanceof uicanvas2dgraphics.RCTee) { //If T Section then true
                this.CheckMinTensRFType3();
            } else {
                this.CheckMinTensRFType4();
            }
        }

        this.CheckMaxTenseRF();
    };
    this.CheckLimitsTenseFlexRFRect = function () {
        this.Asmin = 0.0013 * this.b * this.h; //BS 3.12.5.3
        this.Asmax = 0.04 * this.b * this.h; //BS 3.12.6.1

        //CHECK MINIMUM TENSILE RF REQUIREMENTS [As,min]
        if (this.Asreq <= this.Asmin)
            this.Asreq = this.Asmin;

        //CHECK MAXIMUM TENSILE RF REQUIREMENTS [As,max]
        if (this.Asreq > this.Asmax) {
            //Display error message: "Section too small to hold tension r/f"
            var msg = "Section too small to hold tension r/f";
            this.remarks_.remarklist.push(msg);

            if (this.mu < 0) {
                this.astop_.remarks = msg;
            } else {
                this.asbot_.remarks = msg;
            }
        }
    };
    this.CheckLimitsCompFlexRF = function () {
        if (this.mu > 0) {
            //Min comp r/f check type 1
            this.CheckMinCompRFType1();
        } else {
            //Min comp r/f check type 2
            this.CheckMinCompRFType2();
        }

        this.CheckMaxCompRF();
    };
    this.CheckLimitsCompFlexRFRect = function () {
        this.Asdashmin = 0.002 * this.b * this.h; //BS 3.12.5.3
        this.Asmax = 0.04 * this.b * this.h; //BS 3.12.6.1

        //CHECK MINIMUM COMPRESSIVE RF REQUIREMENTS [As',min]
        if (this.Asdashreq <= this.Asdashmin)
            this.Asdashreq = this.Asdashmin;

        //CHECK MAXIMUM COMPRESSIVE RF REQUIREMENTS [As',max]
        if (this.Asdashreq > this.Asmax) {  //if ((this.a > this.amax) && (this.Asdashreq > this.Asmax)) {
            //Display error message: "Section too small to hold compression r/f"
            var msg = "Section too small to hold compression r/f";

            if (this.mu < 0) {
                this.remarks_.remarklist.push(msg);
                this.asbot_.remarks = msg;
            } else {
                this.remarks_.remarklist.push(msg);
                this.astop_.remarks = msg;
            }
        }
    };
    this.CheckLimitsShearRF = function () {
        this.Avsminratio = 0.15;
        this.Avsmaxratio = 3;

        this.Avsratio = 100 * this.Asreq / (this.bw * this.d);
        this.depthratio = Math.pow(400 / this.d, 0.25);

        //CHECK MIN,MAX RF REQUIREMENT [Av/s,min]
        if (this.Avsratio < this.Avsminratio) {
            this.Avsratio = this.Avsminratio;

            var list = {};
            list.symbol = "A_{s,ratio}";
            list.equation = "A_s,min_{ratio}";
            list.nameparam = ["A_s,min_{ratio}"];
            list.valueparam = [this.Avsminratio];
            list.value = this.Avsratio;

            this.shear_.equationlist.push(list);
        } else if (this.Avsratio > this.Avsmaxratio) {
            this.Avsratio = this.Avsmaxratio;

            var list = {};
            list.symbol = "A_{s,ratio}";
            list.equation = "A_s,max_{ratio}";
            list.nameparam = ["A_s,max_{ratio}"];
            list.valueparam = [this.Avsmaxratio];
            list.value = this.Avsratio;

            this.shear_.equationlist.push(list);
        } else {
            var list = {};
            list.symbol = "A_{s,ratio}";
            list.equation = "{100 * {0}} / {{1} * {2}}";
            list.nameparam = ["A_s", "b_w", "d"];
            list.valueparam = [this.Asreq, this.bw, this.d];
            list.value = this.Avsratio;

            this.shear_.equationlist.push(list);
        }

        if (this.depthratio < 1) {
            this.depthratio = 1;

            list = {};
            list.symbol = "d_{ratio}";
            list.equation = "1";
            list.nameparam = ["1"];
            list.valueparam = [1];
            list.value = this.depthratio;
            this.shear_.equationlist.push(list);
        } else {
            list = {};
            list.symbol = "d_{ratio}";
            list.equation = "(400 / {0})^{1/4}";
            list.nameparam = ["d"];
            list.valueparam = [this.d];
            list.value = this.depthratio;
            this.shear_.equationlist.push(list);
        }
    };
    this.CheckLimitsTorsionRF = function () {
        this.CombinedShearTorsionStress();

        // this.V = this.vu / (this.b * this.d); //BS 3.5.4.2

        if (this.y1 < 550) {
            if (this.vt > (this.vtu * (this.y1 / 550))) {
                //Display error message: "Increase concrete section"
                var msg = "Increase concrete section";
                this.remarks_.remarklist.push(msg);
                this.atsreq_.remarks = msg;
                this.alreq_.remarks = msg;

                this.Avtsreq = this.Avsreq + this.Atsreq; //BS 2.4.7 Part 2
            } else {
                this.CalcTorsionRF();
            }
        } else {
            if ((this.V + this.vt) > this.vtu) {
                //Display error message: "Increase concrete section"
                var msg = "Increase concrete section";
                this.remarks_.remarklist.push(msg);
                this.atsreq_.remarks = msg;
                this.alreq_.remarks = msg;

                this.Avtsreq = this.Avsreq + this.Atsreq; //BS 2.4.7 Part 2
            } else {
                this.CalcTorsionRF();
            }
        }
    };
    this.CheckSkinRF = function () {
        if (this.h >= 750) { //***750 mm
            this.btemp = this.bw;

            //Skin reinforcment should be provided on both side faces of the beam for a distance 2h/3 fron tension face (BS 3.12.11.2.6)            
            this.sskinmax = 250; //BS 3.12.11.2.6

            if (this.btemp >= 500) //BS 3.12.5.4
                this.btemp = 500;

            this.sb = 160; //TODO: TEMP VAL! DO NOT KNOW YET!
            //            this.s1;

            this.drfskinbar = Math.sqrt(this.sb * this.btemp / this.fy);
            // Minumum size of bars in side faces of beams to control cracking should not be less than [this.drfskinbar] (BS 3.12.5.4)

            this.Asweb = Math.PI * Math.pow(this.drfskinbar / 2, 2);

            var list = {};
            list.symbol = "d_{rf,skin}";
            list.equation = "√{{{0} * {1}} / {2}}";
            list.nameparam = ["s_b", "b_w", "f_y"];
            list.valueparam = [this.sb, this.btemp, this.fy];
            list.value = this.drfskinbar;
            this.moment_.equationlist.push(list);

            list = {};
            list.symbol = "A_{s,web}";
            list.equation = "π * ({0} / 2)^2";
            list.nameparam = ["d_{rf,skin}"];
            list.valueparam = [this.drfskinbar];
            list.value = this.Asweb;
            this.moment_.equationlist.push(list);
        } else {
            //Display message: "Skin reinforcement not required"
            this.remarks_.remarklist.push("Skin r/f not required");
            this.asweb_.remarks = "Not Required";
        }
    };

    this.CheckMinTensRFType1 = function () {
        //CHECK MINIMUM TENSILE RF REQUIREMENTS [As,min] //BS 3.12.5.3
        if (this.Asreq <= (0.0013 * this.bw * this.h))
            this.Asreq = 0.0013 * this.bw * this.h;
    };
    this.CheckMinTensRFType2 = function () {
        //CHECK MINIMUM TENSILE RF REQUIREMENTS [As,min] //BS 3.12.5.3
        if (this.Asreq <= (0.0018 * this.bw * this.h))
            this.Asreq = 0.0018 * this.bw * this.h;
    };
    this.CheckMinTensRFType3 = function () {
        //CHECK MINIMUM TENSILE RF REQUIREMENTS [As,min] //BS 3.12.5.3
        if (this.Asreq <= (0.0026 * this.bw * this.h))
            this.Asreq = 0.0026 * this.bw * this.h;
    };
    this.CheckMinTensRFType4 = function () {
        //CHECK MINIMUM TENSILE RF REQUIREMENTS [As,min] //BS 3.12.5.3
        if (this.Asreq <= (0.002 * this.bw * this.h))
            this.Asreq = 0.002 * this.bw * this.h;
    };

    this.CheckMinCompRFType1 = function () {
        //CHECK MINIMUM COMPRESSIVE RF REQUIREMENTS [As',min] //BS 3.12.5.3
        if (this.Asdashreq <= (0.004 * this.bf * this.ds))
            this.Asdashreq = 0.004 * this.bf * this.ds;
    };
    this.CheckMinCompRFType2 = function () {
        //CHECK MINIMUM COMPRESSIVE RF REQUIREMENTS [As',min] //BS 3.12.5.3
        if (this.Asdashreq <= (0.002 * this.bw * this.h))
            this.Asdashreq = 0.002 * this.bw * this.h;
    };

    this.CheckMaxTenseRF = function () {
        this.Asmax = 0.04 * (((this.h - this.ds) * this.bw) + (this.bf * this.ds)); //BS 3.12.6.1

        //CHECK MAXIMUM TENSILE RF REQUIREMENTS [As,max]
        if (this.Asreq > this.Asmax) {
            //Display error message: "Section too small to hold tension r/f"
            var msg = "Section too small to hold tension r/f";
            this.remarks_.remarklist.push(msg);

            if (this.mu < 0) {
                this.astop_.remarks = msg;
            } else {
                this.asbot_.remarks = msg;
            }
        }
    };
    this.CheckMaxCompRF = function () {
        this.Asmax = 0.04 * (((this.h - this.ds) * this.bw) + (this.bf * this.ds)); //BS 3.12.6.1

        //CHECK MAXIMUM COMPRESSIVE RF REQUIREMENTS [As',max]
        if (this.Asdashreq > this.Asmax) {
            //Display error message: "Section too small to hold compression r/f"
            var msg = "Section too small to hold compression r/f";

            if (this.mu < 0) {
                this.remarks_.remarklist.push(msg);
                this.asbot_.remarks = msg;
            } else {
                this.remarks_.remarklist.push(msg);
                this.astop_.remarks = msg;
            }
        }
    };

    this.TorsionalShearStress = function () {
        if (this.bw > this.h) {
            this.hmax = this.bw;
            this.hmin = this.h;
        } else {
            this.hmax = this.h;
            this.hmin = this.bw;
        }

        this.vt = (2 * this.tu) / (Math.pow(this.hmin, 2) * (this.hmax - this.hmin / 3)); //BS 2.4.4.1 Part 2

        var list = {};
        list.symbol = "V_t";
        list.equation = "{2 * {0}} / {({1})^2 * ({2} - {{3}} / 3)}";
        list.nameparam = ["T_u", "h_{min}", "h_{max}", "h_{min}"];
        list.valueparam = [this.tu, this.hmin, this.hmax, this.hmin];
        list.value = this.vt;
        this.torsion_.equationlist.push(list);
    };
    this.TorsionThreshold = function () {
        this.vtmin = Math.min(0.067 * this.gammaMconc * this.fc, 0.4);

        var list = {};
        list.symbol = "V_{t,min}";
        list.equation = "min(0.067 * {0} * {1}, 0.4)";
        list.nameparam = ["γ_{m,concrete}", "f_c"];
        list.valueparam = [this.gammaMconc, this.fc];
        list.value = this.vtmin;
        this.torsion_.equationlist.push(list);
    };
    this.CombinedShearTorsionStress = function () {
        this.vtu = Math.min(0.8 * this.gammaMconc * this.fc, 5); //BS 2.4.6 Part 2

        var list = {};
        list.symbol = "V_{t_u}";
        list.equation = "min(0.8 * {0} * {1}, 5)";
        list.nameparam = ["γ_{m,concrete}", "f_c"];
        list.valueparam = [this.gammaMconc, this.fc];
        list.value = this.vtu;
        this.torsion_.equationlist.push(list);
    };

    this.CalcTorsionRF = function () {
        this.ReqSteelTorsionAts();
        this.ReqSteelTorsionAl();

        this.Avtsreq = this.Avsreq + this.Atsreq; //BS 2.4.7 Part 2

        this.storsion = Math.min(this.x1, this.y1 / 2, 200); //200 mm BS 2.4.8 Part 2

        if ($SETTINGS.distributelongbars.value) { //BS 2.4.9 Part 2
            this.Asreq += 0.5 * this.Alreq; //TODO: GRAPHICS SIDE: ADD TO CORNERBARS ONLY!
            this.Asdashreq += 0.5 * this.Alreq;  //TODO: GRAPHICS SIDE: ADD TO CORNERBARS ONLY!
            //                    this.Asweb += 0.5 * this.Alreq;

            /* Combine the longitudinal reinforcement required for torsion
             * with that which is required for flexure
             * 
             * To achieve a uniform distribution of reinforcement
             * around the perimeter of the section, assign approximately
             * 1/4 of Alreq to each face
             */
        }

        var list = {};
        list.symbol = "A_{vt} / s";
        list.equation = "{0} + {1}";
        list.nameparam = ["A_{v} / s", "A_{t} / s"];
        list.valueparam = [this.Avsreq, this.Atsreq];
        list.value = this.Avtsreq;
        this.torsion_.equationlist.push(list);
    };
    this.CheckSpacing = function () {
        /* [TODO: On graphics side]
         * If more than 1 row of rebar:
         * Bars should be vertically in line (BS 3.12.11.1(a))
         * Vertical distance >= (2 / 3) * h_agg (BS 3.12.11.1(b))
         * 
         * NOTE: 
         *      When bar size exceeds (this.hagg + 5):
         *      A spacing less than bar size or equivalent bar size should be avoided
         */

        //MINIMUM SPACING
        this.s1 = this.hagg + 5; //5 mm

        //MAXIMUM SPACING
        this.drftotal = 0;

        //TODO: Connect to rebar selector
        //        for (var i = 0; i < drf_anylistofbars.length; i++) {
        //            if ((drf_anylistofbars / drf_largest) >= 0.45) {
        //                this.drftotal += drf_anylistofbars;
        //            }
        //
        //            //Else ignore bars (BS 3.12.11.2.2)
        //        }

        this.s2 = (this.b - 2 * this.cc - 2 * this.dstirrup - this.drftotal) / this.nobars; //Clear horizontal distance between bars in tension
        //this.s2max = Math.max(47000 / this.fs, 300);
        this.s2max = Math.max(70000 * this.betab / this.fy, 300); // BS 3.12.11.2.3

        if (this.s2 > this.s2max)
            this.s2 = this.s2max;

        this.s3 = Math.sqrt(2 * Math.pow(this.cc + this.dstirrup + this.drfcornerbar, 2)) - this.drfcornerbar / 2; //Clear distance from the corner of a beam

        if (this.s3 <= this.s2 / 2)
            this.s3 = this.s2 / 2;
    };
};