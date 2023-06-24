/* global uiframework, common, UNITTYPELENGTH, UNITTYPEMOMENT, UNITTYPESTRESSPR, UNITTYPEFORWT, UNITTYPEAREA, BEAMDESIGNOPTION, uicanvas2dgraphics, RCRectangle, $SETTINGS, CODE, UNITTYPEINERTIA, numeral */
/*DONE:
 * 1. ACI 318 [US Units]
 */
/*
 * TODO:
 * 1. BS 8110-97, Eurocode
 * 2. Check remarks list
 * 3. Add reporting equations into equationlist
 */

var InvestigateBeam = function (section) {
    var investigate;

    if (section instanceof uicanvas2dgraphics.RCRectangle) {
        switch ($SETTINGS.designcode.value.value) {
            case CODE.ACI318_14.value:
                investigate = new sectionrectangleACI318_14(section);
                investigate.Calculate();
                break;

            case CODE.ACI318_11.value:
                investigate = new sectionrectangleACI318_11(section);
                investigate.Calculate();
                break;

            case CODE.BS8110_97.value:
                investigate = new sectionrectangleBS8110_97(section);
                investigate.Calculate();
                break;

            //    case CODE.EC2_2004.value:
            //        break;
        }
    } else {
        switch ($SETTINGS.designcode.value.value) {
            case CODE.ACI318_14.value:
                investigate = new sectionflangedACI318_11(section);
                investigate.Calculate();
                break;

            case CODE.ACI318_11.value:
                investigate = new sectionflangedACI318_14(section);
                investigate.Calculate();
                break;

            //    case CODE.BS8110_97.value:
            //        break;

            //    case CODE.EC2_2004.value:
            //        break;
        }
    }

    return investigate;
};

var sectionrcinvestigate = function () {
    this.Format = function (value) {
        value = numeral(value).format("0.0000");
        return value;
    };

    this.remarks_ = new uiframework.PropertyDouble("Remarks", 0);
    this.remarks_.showindesign = false;

    this.cat1 = new uiframework.PropertyCategory("Provided Rebar");

    this.astop_ = new uiframework.PropertyDouble("Top Steel, As<sub>top</sub>", 0, common.unit.area);
    this.astop_.readonly = true;

    this.asbot_ = new uiframework.PropertyDouble("Bottom Steel, As<sub>bot</sub>", 0, common.unit.area);
    this.asbot_.readonly = true;

    this.asweb_ = new uiframework.PropertyDouble("Web Steel, As<sub>web</sub>", 0, common.unit.area);
    this.asweb_.readonly = true;

    this.avsprov_ = new uiframework.PropertyDouble("Shear Reinforcement per Unit Spacing, A<sub>v</sub> / s", 0, common.unit.length);
    this.avsprov_.readonly = true;
    this.avsprov_.customformat = this.Format;

    this.atsprov_ = new uiframework.PropertyDouble("Torsion Reinforcement per Unit Spacing, A<sub>t</sub> / s", 0, common.unit.length);
    this.atsprov_.readonly = true;
    this.atsprov_.customformat = this.Format;

    this.avtsprov_ = new uiframework.PropertyDouble("Shear + Torsion Reinforcement per Unit Spacing, A<sub>v+t</sub> / s", 0, common.unit.length);
    this.avtsprov_.readonly = true;
    this.avtsprov_.customformat = this.Format;

    this.cat2 = new uiframework.PropertyCategory("Flexural Capacity");
    this.momentcap_ = new uiframework.PropertyDouble("Nominal Moment, ØM<sub>n</sub>", 0, common.unit.moment);
    this.momentcap_.readonly = true;

    this.momentcr_ = new uiframework.PropertyDouble("Cracking Moment, ØM<sub>cr</sub>", 0, common.unit.moment);
    this.momentcr_.readonly = true;

    this.nadepth_ = new uiframework.PropertyDouble("Neutral Axis Depth, NA<sub>Depth</sub>", 0, common.unit.length);
    this.nadepth_.readonly = true;

    this.cat3 = new uiframework.PropertyCategory("Shear/Torsion Capacity");
    this.shearcap_ = new uiframework.PropertyDouble("Nominal Shear, ØV<sub>n</sub>", 0, common.unit.force);
    this.shearcap_.readonly = true;

    this.shearvc_ = new uiframework.PropertyDouble("Concrete Shear, ØV<sub>c</sub>", 0, common.unit.force);
    this.shearvc_.readonly = true;

    this.torsioncap_ = new uiframework.PropertyDouble("Nominal Torsion, ØT<sub>n</sub>", 0, common.unit.moment);
    this.torsioncap_.readonly = true;

    this.torsionconccap_ = new uiframework.PropertyDouble("Concrete Torsion, ØT<sub>c</sub>", 0, common.unit.moment);
    this.torsionconccap_.readonly = true;

    this.alreq_ = new uiframework.PropertyDouble("Required Longitudinal Torsion Steel, Al<sub>req</sub>", 0, common.unit.area);
    this.alreq_.readonly = true;

    this.Calculate = function () {
        this.UpdateDimension();
        this.CalculateShearCap();
        this.CalculateTorsionCap();
        this.CalculateFlexureCap();
    };

    this.UpdateDimension = function () {
    };

    this.CalculateFlexureCap = function () {
    };

    this.CalculateShearCap = function () {
    };

    this.CalculateTorsionCap = function () {
    };
};

var sectionACI318 = function () { //US Units
    sectionrcinvestigate.call(this);

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
        this.es = common.Convert(this.section.es.value, UNITTYPESTRESSPR.MPA, UNITTYPESTRESSPR.LBSQIN); //200000MPa = 29000000 psi in US
        this.Pu = 0; //this.section.Pu.value; //Pu active if value for tu !== 0

        this.i33 = common.Convert(this.section.properties.inertia33_.value, UNITTYPEINERTIA.MM, UNITTYPEINERTIA.IN);
        this.y0 = common.Convert(this.section.properties.y0_.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);

        if (!common.IsZero(this.section.stirrup.spacing))// TODO: this.section.stirrup.barsize?
            this.dstirrup = common.Convert(this.section.stirrup.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        else
            this.dstirrup = 0;

        if (!common.IsZero(this.section.botbar.nobars))
            this.drfbot = common.Convert(this.section.botbar.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        else
            this.drfbot = 0;

        if (!common.IsZero(this.section.topbar.nobars))
            this.drftop = common.Convert(this.section.topbar.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        else
            this.section.drftop = 0;

        if (!common.IsZero(this.section.webbar.nobars))
            this.drfweb = common.Convert(this.section.webbar.barsize.value, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);
        else
            this.section.drfweb = 0;

        //TODO: Get from rebar selector? [astop, asbot, asweb]
        this.asbot = this.section.botbar.Area();
        this.astop = this.section.topbar.Area();
        this.asweb = this.section.webbar.Area();

        if (this.asbot < this.astop) {
            this.Asprov = common.Convert(this.astop, UNITTYPEAREA.SQMM, UNITTYPEAREA.SQIN);
            this.Asdashprov = common.Convert(this.asbot, UNITTYPEAREA.SQMM, UNITTYPEAREA.SQIN);
            this.drftens = this.drftop;
            this.drfcomp = this.drfbot;

            this.reduceTension = "Reduce top bars (Tension r/f)";
            this.increaseTension = "Increase top bars (Tension r/f)";
            this.reduceCompression = "Reduce bottom bars (Compression r/f)";
            this.increaseCompression = "Increase bottom bars (Compression r/f)";
            this.addCompression = "Add bottom bars (Compression r/f)";

            this.rfConsideration = "Top bars are assumed to be in tension since";

        } else {
            this.Asprov = common.Convert(this.asbot, UNITTYPEAREA.SQMM, UNITTYPEAREA.SQIN);
            this.Asdashprov = common.Convert(this.astop, UNITTYPEAREA.SQMM, UNITTYPEAREA.SQIN);
            this.drftens = this.drfbot;
            this.drfcomp = this.drftop;

            this.reduceTension = "Reduce bottom bars (Tension r/f)";
            this.increaseTension = "Increase bottom bars (Tension r/f)";
            this.reduceCompression = "Reduce top bars (Compression r/f)";
            this.increaseCompression = "Increase top bars (Compression r/f)";
            this.addCompression = "Add top bars (Compression r/f)";

            this.rfConsideration = "Bottom bars are assumed to be in tension since";
        }

        this.doublyBeam = false;
        
        if (!common.IsZero(this.section.botbar.nobars) && !common.IsZero(this.section.topbar.nobars))
            this.doublyBeam = true;

        this.avts = this.section.stirrup.Area();

        this.Asweb = common.Convert(this.asweb, UNITTYPEAREA.SQMM, UNITTYPEAREA.SQIN);
        this.Avtsprov = common.Convert(this.avts, UNITTYPELENGTH.MM, UNITTYPELENGTH.INCH);

        this.phi = 0.75;
        this.lambda = 1.0;
        this.theta = (Math.PI / 180) * 45;
        this.ecmax = 0.003;
        this.esmin = 0.005;

        this.asbot_.value = this.asbot;
        this.astop_.value = this.astop;
        this.asweb_.value = this.asweb;
        this.avtsprov_.value = this.avts;

        var list = {};
        list.symbol = "Bars";
        if (common.IsZero(this.section.botbar.nobars))
            list.value = "No Bars";
        else
            list.value = this.section.botbar.nobars + "-" + this.section.botbar.barsize.name;
        this.asbot_.equationlist.push(list);

        list = {};
        list.symbol = "As_{bot}";
        list.value = this.asbot;
        this.asbot_.equationlist.push(list);
        this.asbot_.showequation = false;

        list = {};
        list.symbol = "Bars";
        if (common.IsZero(this.section.topbar.nobars))
            list.value = "No Bars";
        else
            list.value = this.section.topbar.nobars + "-" + this.section.topbar.barsize.name;
        this.astop_.equationlist.push(list);

        list = {};
        list.symbol = "As_{top}";
        list.value = this.astop;
        this.astop_.equationlist.push(list);
        this.astop_.showequation = false;

        list = {};
        list.symbol = "Bars";
        if (common.IsZero(this.section.webbar.nobars))
            list.value = "No Bars";
        else
            list.value = this.section.webbar.nobars + "-" + this.section.webbar.barsize.name;
        this.asweb_.equationlist.push(list);

        list = {};
        list.symbol = "As_{web}";
        list.value = this.asweb;
        this.asweb_.equationlist.push(list);
        this.asweb_.showequation = false;


        if (common.IsZero(this.asbot_.value)) {
            this.asbot_.remarks = "No Bars";
        }

        if (common.IsZero(this.astop_.value)) {
            this.astop_.remarks = "No Bars";
        }

        if (common.IsZero(this.asweb_.value)) {
            this.asweb_.remarks = "No Bars";
        }

        if (common.IsZero(this.avtsprov_.value)) {
            this.avtsprov_.remarks = "No Bars";
        }
    };
};
var sectionBS8110 = function () { //SI Units
    sectionrcinvestigate.call(this);

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
        this.Pu = 0; //this.section.Pu.value; //Pu active if value for tu !== 0
        this.R = this.section.R.value;

        this.i33 = this.section.properties.inertia33_.value;
        this.y0 = this.section.properties.y0_.value;

        if (!common.IsZero(this.section.stirrup.spacing)) //TODO: this.section.stirrup.barsize??
            this.dstirrup = this.section.stirrup.barsize.value;
        else
            this.dstirrup = 0;

        if (!common.IsZero(this.section.botbar.nobars))
            this.drfbot = this.section.botbar.barsize.value;
        else
            this.drfbot = 0;

        if (!common.IsZero(this.section.topbar.nobars))
            this.drftop = this.section.topbar.barsize.value;
        else
            this.section.drftop = 0;

        if (!common.IsZero(this.section.webbar.nobars))
            this.drfweb = this.section.webbar.barsize.value;
        else
            this.section.drfweb = 0;

        //TODO: Get from rebar selector? [astop, asbot, asweb]
        this.asbot = this.section.botbar.Area();
        this.astop = this.section.topbar.Area();
        this.asweb = this.section.webbar.Area();

        if (this.asbot < this.astop) {
            this.Asprov = this.astop;
            this.Asdashprov = this.asbot;
            this.drftens = this.drftop;
            this.drfcomp = this.drfbot;

            this.reduceTension = "Reduce top bars (Tension r/f)";
            this.increaseTension = "Increase top bars (Tension r/f)";
            this.reduceCompression = "Reduce bottom bars (Compression r/f)";
            this.increaseCompression = "Increase bottom bars (Compression r/f)";
            this.addCompression = "Add bottom bars (Compression r/f)";

            this.rfConsideration = "Top bars are assumed to be in tension since";
        } else {
            this.Asprov = this.asbot;
            this.Asdashprov = this.astop;
            this.drftens = this.drfbot;
            this.drfcomp = this.drftop;

            this.reduceTension = "Reduce bottom bars (Tension r/f)";
            this.increaseTension = "Increase bottom bars (Tension r/f)";
            this.reduceCompression = "Reduce top bars (Compression r/f)";
            this.increaseCompression = "Increase top bars (Compression r/f)";
            this.addCompression = "Add top bars (Compression r/f)";

            this.rfConsideration = "Bottom bars are assumed to be in tension since";
        }

        this.doublyBeam = false;
        if (!common.IsZero(this.section.botbar.nobars) && !common.IsZero(this.section.topbar.nobars))
            this.doublyBeam = true;

        this.avts = this.section.stirrup.Area();

        this.Asweb = this.asweb;
        this.Avtsprov = this.avts;

        this.phi = 0.9;
        this.lambda = 1.0;
        this.theta = (Math.PI / 180) * 45;
        this.ecmax = 0.003;
        this.esmin = 0.005;

        this.asbot_.value = this.asbot;
        this.astop_.value = this.astop;
        this.asweb_.value = this.asweb;
        this.avtsprov_.value = this.avts;

        var list = {};
        list.symbol = "Bars";
        if (common.IsZero(this.section.botbar.nobars))
            list.value = "No Bars";
        else
            list.value = this.section.botbar.nobars + "-" + this.section.botbar.barsize.name;
        this.asbot_.equationlist.push(list);

        list = {};
        list.symbol = "As_{bot}";
        list.value = this.asbot;
        this.asbot_.equationlist.push(list);
        this.asbot_.showequation = false;

        list = {};
        list.symbol = "Bars";
        if (common.IsZero(this.section.topbar.nobars))
            list.value = "No Bars";
        else
            list.value = this.section.topbar.nobars + "-" + this.section.topbar.barsize.name;
        this.astop_.equationlist.push(list);

        list = {};
        list.symbol = "As_{top}";
        list.value = this.astop;
        this.astop_.equationlist.push(list);
        this.astop_.showequation = false;

        list = {};
        list.symbol = "Bars";
        if (common.IsZero(this.section.webbar.nobars))
            list.value = "No Bars";
        else
            list.value = this.section.webbar.nobars + "-" + this.section.webbar.barsize.name;
        this.asweb_.equationlist.push(list);

        list = {};
        list.symbol = "As_{web}";
        list.value = this.asweb;
        this.asweb_.equationlist.push(list);
        this.asweb_.showequation = false;

        if (common.IsZero(this.asbot_.value)) {
            this.asbot_.remarks = "No Bars";
        }

        if (common.IsZero(this.astop_.value)) {
            this.astop_.remarks = "No Bars";
        }

        if (common.IsZero(this.asweb_.value)) {
            this.asweb_.remarks = "No Bars";
        }

        if (common.IsZero(this.avtsprov_.value)) {
            this.avtsprov_.remarks = "No Bars";
        }
    };
};

var sectionrectangleACI318_11 = function (section) {
    sectionACI318.call(this);

    this.section = section;

    this.CalculateShearCap = function () {
        //    var msg = "Please note that the ACI 318 design code equations are in US Units";
        //    this.remarks_.remarklist.push(msg);
        this.remarks_.remarklist.push(this.rfConsideration);

        this.phi = 0.75;

        if (this.section.considertors.value)
            this.Avsprov = this.Avtsprov / 3;
        else
            this.Avsprov = this.Avtsprov;

        this.DepthEff();

        this.CalcShearCap();

        this.shearcap_.value = common.Convert(this.phiVn, UNITTYPEFORWT.LBF, UNITTYPEFORWT.KN);
        this.avsprov_.value = common.Convert(this.Avsprov, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);

        var list = {};
        list.symbol = "ØV_n";
        list.value = this.shearcap_.value;
        this.shearcap_.equationlist.push(list);
        this.shearcap_.showequation = false;

        this.shearvc_.value = this.phi * common.Convert(this.Vc, UNITTYPEFORWT.LBF, UNITTYPEFORWT.KN);

        list = {};
        list.symbol = "ØV_c";
        list.value = this.shearvc_.value;
        this.shearvc_.equationlist.push(list);
        this.shearvc_.showequation = false;

        //    list = {};
        //    list.symbol = "Stirrups";
        //    list.value = this.section.stirrup.barsize.name + "@" + this.section.stirrup.spacing;
        //    this.stirrups_.equationlist.push(list);
        //    this.stirrups_.showequation = false;
        //    this.stirrups_.showindesign = false;

        list = {};
        list.symbol = "A_v/s";
        list.value = this.avsprov_.value;
        this.avsprov_.equationlist.push(list);
        this.avsprov_.showequation = false;

        if (isNaN(this.shearcap_.value) && (!this.shearcap_.remarks)) {
            this.shearcap_.remarks = "Not Computed";
        }
    };

    this.CalculateTorsionCap = function () {
        this.phi = 0.75;
        this.Atsprov = 0;

        if (this.section.considertors.value)
            this.Atsprov = this.Avtsprov / 3;
        else {
            this.remarks_.remarklist.push("Torsion not considered");
            this.atsprov_.remarks = "Not Considered";
        }

        this.Alreq = 0;

        this.DepthEff();

        this.SecPropsConc();
        this.SecPropsEffConc();

        this.ShearCapConc();

        this.CalcTorsionCap();

        this.torsioncap_.value = common.Convert(this.phiTn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        this.torsionconccap_.value = common.Convert(this.phi * this.Tth, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        this.alreq_.value = common.Convert(this.Alreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
        this.atsprov_.value = common.Convert(this.Atsprov, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);

        var list = {};
        list.symbol = "ØT_n";
        list.value = this.torsioncap_.value;
        this.torsioncap_.equationlist.push(list);
        this.torsioncap_.showequation = false;

        list = {};
        list.symbol = "ØT_c";
        list.value = this.torsionconccap_.value;
        this.torsionconccap_.equationlist.push(list);
        this.torsionconccap_.showequation = false;

        list = {};
        list.symbol = "Al_{req}";
        list.value = this.alreq_.value;
        this.alreq_.equationlist.push(list);
        this.alreq_.showequation = false;

        list = {};
        list.symbol = "A_{v+t}/s";
        list.value = this.avtsprov_.value;
        this.avtsprov_.equationlist.push(list);
        this.avtsprov_.showequation = false;

        list = {};
        list.symbol = "A_t/s";
        list.value = this.atsprov_.value;
        this.atsprov_.equationlist.push(list);
        this.atsprov_.showequation = false;

        if (isNaN(this.torsioncap_.value) && (!this.torsioncap_.remarks)) {
            this.torsioncap_.remarks = "Not Computed";
        }
    };

    this.CalculateFlexureCap = function () {
        if (this.doublyBeam)
            this.CalculateDoublyFlexure();
        else
            this.CalculateSinglyFlexure();

        this.NADepth();
        this.CrackingMoment();

        this.nadepth_.value = common.Convert(this.kd, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);
        //    this.nadepth_.value = common.Convert(this.c, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);        
        this.momentcr_.value = common.Convert(this.Mcr, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);

        var list = {};
        list.symbol = "ØM_{cr}";
        list.value = this.momentcr_.value;
        this.momentcr_.equationlist.push(list);
        this.momentcr_.showequation = false;

        //    list = {};
        //    list.symbol = "ØM_{ub}";
        //    list.value = this.momentub_.value;
        //    this.momentub_.equationlist.push(list);
        //    this.momentub_.showequation = false;

        if (isNaN(this.nadepth_.value) && (!this.nadepth_.remarks)) {
            this.nadepth_.remarks = "Not Computed";
        } else {
            list = {};
            list.symbol = "NA_{Depth}";
            list.value = this.nadepth_.value;
            this.nadepth_.equationlist.push(list);
            this.nadepth_.showequation = false;
        }
    };

    this.CalculateSinglyFlexure = function () {
        if (this.section.considertors.value && $SETTINGS.distributelongbars.value) {
            this.Asprov -= this.Alreq / 2;
            this.Asdashprov -= this.Alreq / 2;

            this.rhodash = this.Asdashprov / (this.b * this.d);
        }

        this.rho = this.Asprov / (this.b * this.d);

        this.DepthEff();
        this.Beta1();

        this.CalcSinglyFlexCap();

        this.CheckSkinRF();

        if (this.asbot_.value < this.astop_.value) {
            this.momentcap_.value = common.Convert(-this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        } else {
            this.momentcap_.value = common.Convert(this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        }

        if (isNaN(this.momentcap_.value) && (!this.momentcap_.remarks)) {
            this.momentcap_.remarks = "Not Computed";
        }
    };
    this.CalculateDoublyFlexure = function () {
        if (this.section.considertors.value && $SETTINGS.distributelongbars.value) {
            this.Asprov -= this.Alreq / 2;
            this.Asdashprov -= this.Alreq / 2;
        }

        this.rho = this.Asprov / (this.b * this.d);
        this.rhodash = this.Asdashprov / (this.b * this.d);

        this.DepthEff();
        this.DepthCompRF();
        this.Beta1();

        this.CalcDoublyFlexCap();

        this.CheckSkinRF();

        if (this.asbot < this.astop) {
            this.momentcap_.value = common.Convert(-this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        } else {
            this.momentcap_.value = common.Convert(this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        }

        if (isNaN(this.momentcap_.value) && (!this.momentcap_.remarks)) {
            this.momentcap_.remarks = "Not Computed";
        }
    };

    // --------------------------------------------------------------------------//

    this.DepthEff = function () {
        this.d = this.h - this.cc - this.dstirrup - (this.drftens / 2);

        //    var list = {};
        //    list.symbol = "d";
        //    list.equation = "{0} - {1} - {2} - {3} / 2";
        //    list.nameparam = ["h", "c_c", "d_{stirrup}", "d_{rf,tens}"];
        //    list.valueparam = [this.h, this.cc, this.dstirrup, this.drftens];
        //    list.value = this.d;

        //    this.momentcap_.equationlist.push(list);
    };
    this.DepthCompRF = function () {
        this.ddash = this.cc + this.dstirrup + (this.drfcomp / 2);
    };
    this.DepthEquiCompBlockSingly = function () {
        this.a = this.Asprov * this.fy / (0.85 * this.fc * this.b);
    };
    this.DepthEquiCompBlockDoubly = function () {
        this.a = (this.Asprov * this.fy - this.Asdashprov * this.fsdash) / (0.85 * this.fc * this.b);
    };

    this.SecPropsConc = function () {
        this.Ag = this.b * this.h;
        this.Acp = this.b * this.h;
        this.pcp = 2 * this.b + 2 * this.h;
    };
    this.SecPropsEffConc = function () {
        this.Aoh = (this.b - 2 * this.cc) * (this.h - 2 * this.cc);
        this.Ao = 0.85 * this.Aoh;
        this.ph = 2 * (this.b - 2 * this.cc) + 2 * (this.h - 2 * this.cc);
    };

    this.DistCompFiberNA = function () {
        this.c = this.a / this.beta1;
    };
    this.NADepth = function () {
        this.ec = 57000 * Math.sqrt(this.fc);
        this.n = this.es / this.ec;
        this.r = (this.n - 1) * this.Asdashprov / (this.n * this.Asprov);
        this.B = this.b / (this.n * this.Asprov);

        if (this.ddash === undefined)
            this.ddash = 0;

        this.kd = (Math.sqrt(2 * this.B * this.d * (1 + (this.r * this.ddash) / this.d) + Math.pow(1 + this.r, 2)) - (1 + this.r)) / this.B;
    };
    this.Beta1 = function () {
        this.beta1 = 0.85 - 0.05 * ((this.fc - 4000) / 1000);

        if (this.beta1 <= 0.65)
            this.beta1 = 0.65;
        else if (this.beta1 >= 0.85)
            this.beta1 = 0.85;
    };
    this.Phi = function () {
        this.phi = 0.65 + (250 / 3) * (this.epsT - 0.002);

        if (this.phi <= 0.65)
            this.phi = 0.65;
        else if (this.phi >= 0.9)
            this.phi = 0.9;
    };
    this.NetTensStrain = function () {
        this.epsT = 0.003 * ((this.d - this.c) / this.c);
    };

    this.TorsionThreshold = function () {
        this.Tth = this.lambda * Math.sqrt(this.fc) * (Math.pow(this.Acp, 2) / this.pcp) * Math.sqrt(1 + (this.Pu / (4 * this.Ag * this.lambda * Math.sqrt(this.fc))));
    };

    this.CalcSinglyFlexCap = function () {
        this.CheckLimitsSinglyFlexRF();

        this.ReqCapTensSinglyFlex();
    };
    this.CalcDoublyFlexCap = function () {
        this.CheckLimitsDoublyFlexRF();

        this.ReqCapTensDoublyFlex();
    };
    this.CalcShearCap = function () {
        this.ReqCapShearVs();

        this.ShearCapConc();
        this.ShearMaxConc();

        this.phiVn = this.phi * (this.Vc + this.Vs);

        if (this.phiVn > (this.phi * this.Vmax)) {
            //Display error message: "Reduce bar size / legs" OR "Increase stirrup spacing"
            this.remarks_.remarklist.push("Increase stirrup spacing");
            this.shearcap_.remarks = "Increase stirrup spacing";
        }
    };
    this.CalcTorsionCap = function () {
        this.phiTn = 0;

        if (this.section.considertors.value) {
            this.ReqCapTorsionTn();
            this.ReqSteelTorsionAl();
            this.CheckLimitsTorsionRF();
        }

        this.TorsionThreshold();

        if (this.phiTn <= (this.phi * this.Tth))
            this.phiTn = this.phi * this.Tth;

        this.CheckLimitsTorsionSection();

        //    if (this.torsionCheckLeft > (this.phi * this.torsionCheckRight))
        //        //Display error message: "Reduce stirrup bar size" OR "Increase stirrup spacing"
        //        this.Tcr = 0;
        //    else
        this.Tcr = 4 * this.Tth;
    };

    this.CheckLimitsSinglyFlexRF = function () {
        this.rhomin = Math.max(3 * Math.sqrt(this.fc) / this.fy, 200 / this.fy);

        this.rhob = 0.85 * this.beta1 * (this.fc / this.fy) * (87000 / (87000 + this.fy));
        this.rhomax = 0.75 * this.rhob;

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.rho < this.rhomin) {
            //Display message: "Increase tension r/f"
            this.remarks_.remarklist.push(this.increaseTension);
            this.momentcap_.remarks = this.increaseTension;
        }

        if (this.rho > this.rhomax) {
            //Display message: "Reduce tension r/f"
            this.remarks_.remarklist.push(this.reduceTension);
            this.momentcap_.remarks = this.reduceTension;
        }

        if (this.rhodash && this.rhodash < 0) {
            //Display message: "Add compression r/f"
            this.remarks_.remarklist.push(this.addCompression);
            this.momentcap_.remarks = this.addCompression;
        }

        this.DepthEquiCompBlockSingly();
        this.DistCompFiberNA();
        this.NetTensStrain();

        if (this.epsT > 0.005) {
            // Display message: "Reduce tension r/f" OR "Increase section depth"            
            //    var msg = "Reduce tension r/f";
            //    this.remarks_.remarklist.push(msg);
            //    this.momentcap_.remarks = msg;
        } else {
            this.phi = 0.9;
        }
    };
    this.CheckLimitsDoublyFlexRF = function () {
        this.rhomin = Math.max(3 * Math.sqrt(this.fc) / this.fy, 200 / this.fy);

        this.rhob = 0.85 * this.beta1 * (this.fc / this.fy) * (87000 / (87000 + this.fy));
        this.rhomax = 0.75 * this.rhob;

        this.K = 0.85 * this.beta1 * (this.fc / this.fy) * (this.ddash / this.d) * (87000 / (87000 - this.fy));

        if (this.rhodash < 0) {
            this.remarks_.remarklist.push(this.increaseCompression);
            this.momentcap_.remarks = this.increaseCompression;
        }

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.rho < this.rhomin) {
            this.remarks_.remarklist.push(this.increaseTension);
            this.momentcap_.remarks = this.increaseTension;
        }

        if ((this.rho - this.rhodash) >= this.K) {
            this.fsdash = this.fy;
            this.c = (this.Asprov - this.Asdashprov) * this.fy / (0.85 * this.beta1 * this.fc * this.b);
        } else {
            this.A1 = 0.85 * this.beta1 * this.fc * this.b;
            this.A2 = this.Asdashprov * (87000 - 0.85 * this.fc) - this.Asprov * this.fy;
            this.A3 = -87000 * this.Asdashprov * this.ddash;

            this.c = (-this.A2 + Math.sqrt(Math.pow(this.A2, 2) - 4 * this.A1 * this.A3)) / (2 * this.A1);
            this.cneg = (-this.A2 - Math.sqrt(Math.pow(this.A2, 2) - 4 * this.A1 * this.A3)) / (2 * this.A1);

            this.fsdash = 87000 * ((this.c - this.ddash) / this.c);
        }

        if ((this.rho - this.rhodash * (this.fsdash / this.fy)) > this.rhomax) {
            this.remarks_.remarklist.push(this.reduceTension);
            this.momentcap_.remarks = this.reduceTension;
        } else {
            this.DepthEquiCompBlockDoubly();
            this.NetTensStrain();

            this.Phi();
        }
    };

    this.CheckLimitsTorsionRF = function () {
        this.Almin1 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - this.Atsprov * this.ph * this.fys / this.fy;
        this.Almin2 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - (25 * this.b / this.fys) * this.ph * this.fys / this.fy;

        this.Almin = Math.min(this.Almin1, this.Almin2);

        if (this.Alreq <= this.Almin)
            this.Alreq = this.Almin;
    };
    this.CheckLimitsTorsionSection = function () {
        this.torsionCheckLeft = Math.sqrt(Math.pow(this.phiVn / (this.b * this.d), 2) + Math.pow(this.phiTn * this.ph / (1.7 * Math.pow(this.Aoh, 2)), 2));
        this.torsionCheckRight = (this.Vc / (this.b * this.d) + 8 * Math.sqrt(this.fc));
    };
    this.CheckSkinRF = function () {
        if (this.h >= 36) { //***36 inches
            this.fs = 2 * this.fy / 3;

            this.Aswebreq = 0.1 * this.h / 2; //ACI R9.7.2.3

            if (this.Asweb < this.Aswebreq) {
                //Display message: "Increase web r/f"
                this.remarks_.remarklist.push("Increase web r/f");
                this.asweb_.remarks = "Increase web r/f";
            }
        } else {
            //Display message: "Skin reinforcement not required"
            //    this.asweb_.remarklist.push("No Bars");
            //    this.asweb_.remarks = "No Bars";
        }
    };

    this.ShearCapConc = function () {
        this.Vc = 2 * this.lambda * Math.sqrt(this.fc) * this.b * this.d;
    };
    this.ShearMaxConc = function () {
        this.Vmax = this.Vc + 8 * Math.sqrt(this.fc) * this.b * this.d;
    };

    this.ReqCapTensSinglyFlex = function () {
        this.phiMn = this.phi * this.Asprov * this.fy * (this.d - this.a / 2);
    };
    this.ReqCapTensDoublyFlex = function () {
        this.phiMn = this.phi * ((this.Asprov * this.fy - this.Asdashprov * this.fsdash) * (this.d - this.a / 2) + this.Asdashprov * this.fsdash * (this.d - this.ddash));
    };
    this.CrackingMoment = function () {
        this.fr = 7.5 * Math.sqrt(this.fc); //ACI 318-11 9.5.2.3, ACI 318-14 19.2.3.1

        this.Mcr = this.fr * this.i33 / this.y0; //Get I33, y0 from sectionproperties
    };
    this.ReqCapShearVs = function () {
        this.Vs = this.Avsprov * this.fys * this.d;
    };
    this.ReqCapTorsionTn = function () {
        this.phiTn = this.phi * this.Atsprov * 2 * this.Ao * this.fys / (Math.tan(this.theta));
    };
    this.ReqSteelTorsionAl = function () {
        this.Alreq = (this.Atsprov * this.ph * (this.fys / this.fy)) / (Math.pow(Math.tan(this.theta), 2));
    };
};
var sectionflangedACI318_11 = function (section) { //SAME FOR T, L-sections
    sectionACI318.call(this);

    this.section = section;

    this.CalculateShearCap = function () {
        //    var msg = "Please note that the ACI 318 design code equations are in US Units";
        //    this.remarks_.remarklist.push(msg);
        this.remarks_.remarklist.push(this.rfConsideration);

        this.phi = 0.75;

        if (this.section.considertors.value)
            this.Avsprov = this.Avtsprov / 3;
        else
            this.Avsprov = this.Avtsprov;

        this.DepthEff();

        this.CalcShearCap();

        this.shearcap_.value = common.Convert(this.phiVn, UNITTYPEFORWT.LBF, UNITTYPEFORWT.KN);
        this.avsprov_.value = common.Convert(this.Avsprov, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);

        var list = {};
        list.symbol = "ØV_n";
        list.value = this.shearcap_.value;
        this.shearcap_.equationlist.push(list);
        this.shearcap_.showequation = false;

        this.shearvc_.value = this.phi * common.Convert(this.Vc, UNITTYPEFORWT.LBF, UNITTYPEFORWT.KN);

        list = {};
        list.symbol = "ØV_c";
        list.value = this.shearvc_.value;
        this.shearvc_.equationlist.push(list);
        this.shearvc_.showequation = false;

        //    list = {};
        //    list.symbol = "Stirrups";
        //    list.value = this.section.stirrup.barsize.name + "@" + this.section.stirrup.spacing;
        //    this.stirrups_.equationlist.push(list);
        //    this.stirrups_.showequation = false;
        //    this.stirrups_.showindesign = false;

        list = {};
        list.symbol = "A_v/s";
        list.value = this.avsprov_.value;
        this.avsprov_.equationlist.push(list);
        this.avsprov_.showequation = false;

        if (isNaN(this.shearcap_.value) && (!this.shearcap_.remarks)) {
            this.shearcap_.remarks = "Not Computed";
        }
    };

    this.CalculateTorsionCap = function () {
        this.bf = this.b;
        this.phi = 0.75;
        this.Atsprov = 0;

        if (this.section.considertors.value)
            this.Atsprov = this.Avtsprov / 3;
        else {
            this.remarks_.remarklist.push("Torsion not considered");
            this.atsprov_.remarks = "Not Considered";
        }

        this.Alreq = 0;

        this.DepthEff();

        this.SecPropsConc();
        this.SecPropsEffConc();

        this.ShearCapConc();

        this.CalcTorsionCap();

        this.torsioncap_.value = common.Convert(this.phiTn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        this.torsionconccap_.value = common.Convert(this.phi * this.Tth, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        this.alreq_.value = common.Convert(this.Alreq, UNITTYPEAREA.SQIN, UNITTYPEAREA.SQMM);
        this.atsprov_.value = common.Convert(this.Atsprov, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);

        var list = {};
        list.symbol = "ØT_n";
        list.value = this.torsioncap_.value;
        this.torsioncap_.equationlist.push(list);
        this.torsioncap_.showequation = false;

        list = {};
        list.symbol = "ØT_c";
        list.value = this.torsionconccap_.value;
        this.torsionconccap_.equationlist.push(list);
        this.torsionconccap_.showequation = false;

        list = {};
        list.symbol = "Al_{req}";
        list.value = this.alreq_.value;
        this.alreq_.equationlist.push(list);
        this.alreq_.showequation = false;

        list = {};
        list.symbol = "A_{v+t}/s";
        list.value = this.avtsprov_.value;
        this.avtsprov_.equationlist.push(list);
        this.avtsprov_.showequation = false;

        list = {};
        list.symbol = "A_t/s";
        list.value = this.atsprov_.value;
        this.atsprov_.equationlist.push(list);
        this.atsprov_.showequation = false;

        if (isNaN(this.torsioncap_.value) && (!this.torsioncap_.remarks)) {
            this.torsioncap_.remarks = "Not Computed";
        }
    };

    this.CalculateFlexureCap = function () {
        if (this.doublyBeam)
            this.CalculateDoublyFlexure();
        else
            this.CalculateSinglyFlexure();

        this.NADepth();
        this.CrackingMoment();

        this.nadepth_.value = common.Convert(this.kd, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);
        //    this.nadepth_.value = common.Convert(this.c, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);        
        this.momentcr_.value = common.Convert(this.Mcr, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);

        var list = {};
        list.symbol = "ØM_{cr}";
        list.value = this.momentcr_.value;
        this.momentcr_.equationlist.push(list);
        this.momentcr_.showequation = false;

        //    list = {};
        //    list.symbol = "ØM_{ub}";
        //    list.value = this.momentub_.value;
        //    this.momentub_.equationlist.push(list);
        //    this.momentub_.showequation = false;

        if (isNaN(this.nadepth_.value) && (!this.nadepth_.remarks)) {
            this.nadepth_.remarks = "Not Computed";
        } else {
            list = {};
            list.symbol = "NA_{Depth}";
            list.value = this.nadepth_.value;
            this.nadepth_.equationlist.push(list);
            this.nadepth_.showequation = false;
        }
    };

    this.CalculateSinglyFlexure = function () {
        if (this.section.considertors.value && $SETTINGS.distributelongbars.value) {
            this.Asprov -= this.Alreq / 2;
            this.Asdashprov -= this.Alreq / 2;

            this.rhodash = this.Asdashprov / (this.bw * this.d);
        }

        this.rho = this.Asprov / (this.bw * this.d);

        this.DepthEff();
        this.Beta1();

        this.CalcSinglyFlexCap();

        this.CheckSkinRF();

        if (this.asbot_.value < this.astop_.value) {
            this.momentcap_.value = common.Convert(-this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        } else {
            this.momentcap_.value = common.Convert(this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        }

        if (isNaN(this.momentcap_.value) && (!this.momentcap_.remarks)) {
            this.momentcap_.remarks = "Not Computed";
        }
    };
    this.CalculateDoublyFlexure = function () {
        if (this.section.considertors.value && $SETTINGS.distributelongbars.value) {
            this.Asprov -= this.Alreq / 2;
            this.Asdashprov -= this.Alreq / 2;
        }

        this.rho = this.Asprov / (this.bw * this.d);
        this.rhodash = this.Asdashprov / (this.bw * this.d);

        this.DepthEff();
        this.DepthCompRF();
        this.Beta1();

        this.CalcDoublyFlexCap();

        this.CheckSkinRF();

        if (this.asbot_.value < this.astop_.value) {
            this.momentcap_.value = common.Convert(-this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        } else {
            this.momentcap_.value = common.Convert(this.phiMn, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM);
        }

        if (isNaN(this.momentcap_.value) && (!this.momentcap_.remarks)) {
            this.momentcap_.remarks = "Not Computed";
        }
    };

    //--------------------------------------------------------------------------//

    this.DepthEff = function () {
        this.d = this.h - this.cc - this.dstirrup - (this.drftens / 2);
    };
    this.DepthCompRF = function () {
        this.ddash = this.cc + this.dstirrup + (this.drfcomp / 2);
    };
    this.DepthEquiCompBlockSingly = function () {
        this.a = this.Asprov * this.fy / (0.85 * this.fc * this.bf);
    };
    this.DepthEquiCompBlockDoubly = function () {
        this.a = (this.Asprov * this.fy - this.Asdashprov * this.fsdash) / (0.85 * this.fc * this.bf);
    };
    this.DepthEquiCompBlockWebSingly = function () {
        this.a1 = ((this.Asprov - this.Asf) * this.fy) / (0.85 * this.fc * this.bw);
    };
    this.DepthEquiCompBlockWebDoubly = function () {
        this.a1 = ((this.Asprov - this.Asf) * this.fy - this.Asdashprov * this.fsdash) / (0.85 * this.fc * this.bw);
    };

    this.SecPropsConc = function () {
        this.Ag = this.bw * this.h + (this.bf - this.bw) * this.ds;
        this.Acp = this.bw * this.h + (this.bf - this.bw) * this.ds;
        this.pcp = 2 * this.bf + 2 * this.h;
    };
    this.SecPropsEffConc = function () {
        this.Aoh = (this.bw - 2 * this.cc) * (this.h - 2 * this.cc);
        this.Ao = 0.85 * this.Aoh;
        this.ph = 2 * (this.bw - 2 * this.cc) + 2 * (this.h - 2 * this.cc);
    };

    this.DistCompFiberNA = function () {
        this.c = this.a / this.beta1;
    };
    this.NADepth = function () {
        this.ec = 57000 * Math.sqrt(this.fc);
        this.n = this.es / this.ec;
        this.r = (this.n - 1) * this.Asdashprov / (this.n * this.Asprov);
        this.f = this.ds * (this.bf - this.bw) / (this.n * this.Asprov);
        this.C = this.bw / (this.n * this.Asprov);

        if (this.ddash === undefined)
            this.ddash = 0;

        this.kd = (Math.sqrt(this.C * (2 * this.d + this.ds * this.f + 2 * this.r * this.ddash) + Math.pow(this.f + this.r + 1, 2)) - (this.f + this.r + 1)) / this.C;
    };
    this.Beta1 = function () {
        this.beta1 = 0.85 - 0.05 * ((this.fc - 4000) / 1000);

        if (this.beta1 <= 0.65)
            this.beta1 = 0.65;
        else if (this.beta1 >= 0.85)
            this.beta1 = 0.85;
    };
    this.Phi = function () {
        this.phi = 0.65 + (250 / 3) * (this.epsT - 0.002);

        if (this.phi <= 0.65)
            this.phi = 0.65;
        else if (this.phi >= 0.9)
            this.phi = 0.9;
    };
    this.NetTensStrain = function () {
        this.epsT = 0.003 * ((this.d - this.c) / this.c);
    };

    this.TorsionThreshold = function () {
        this.Tth = this.lambda * Math.sqrt(this.fc) * (Math.pow(this.Acp, 2) / this.pcp) * Math.sqrt(1 + (this.Pu / (4 * this.Ag * this.lambda * Math.sqrt(this.fc))));
    };

    this.CalcSinglyFlexCap = function () {
        this.CheckLimitsSinglyFlexRF();

        if (this.a < this.ds) {
            this.ReqCapTensSinglyFlex();
        } else {
            this.SteelBalCompConcFlange();
            this.DepthEquiCompBlockWebSingly();
            this.ReqCapTensSinglyFlexFlanged();
        }
    };
    this.CalcDoublyFlexCap = function () {
        this.CheckLimitsDoublyFlexRF();

        if (this.a < this.ds) {
            this.ReqCapTensDoublyFlex();
        } else {
            this.SteelBalCompConcFlange();
            this.DepthEquiCompBlockWebDoubly();
            this.ReqCapTensDoublyFlexFlanged();
        }
    };
    this.CalcShearCap = function () {
        this.ReqCapShearVs();

        this.ShearCapConc();
        this.ShearMaxConc();

        this.phiVn = this.phi * (this.Vc + this.Vs);

        if (this.phiVn > (this.phi * this.Vmax)) {
            //Display error message: "Reduce bar size / legs" OR "Increase stirrup spacing"
            this.remarks_.remarklist.push("Increase stirrup spacing");
            this.shearcap_.remarks = "Increase stirrup spacing";
        }
    };
    this.CalcTorsionCap = function () {
        this.phiTn = 0;

        if (this.section.considertors.value) {
            this.ReqCapTorsionTn();
            this.ReqSteelTorsionAl();
            this.CheckLimitsTorsionRF();
        }

        this.TorsionThreshold();

        if (this.phiTn <= (this.phi * this.Tth))
            this.phiTn = this.phi * this.Tth;

        this.CheckLimitsTorsionSection();

        //    if (this.torsionCheckLeft > (this.phi * this.torsionCheckRight))
        //Display error message: "Reduce stirrup bar size" OR "Increase stirrup spacing"

        this.Tcr = 4 * this.Tth;
    };

    this.CheckLimitsSinglyFlexRF = function () {
        this.rhomin = Math.max(3 * Math.sqrt(this.fc) / this.fy, 200 / this.fy);

        this.rhob = 0.85 * this.beta1 * (this.fc / this.fy) * (87000 / (87000 + this.fy));
        this.rhof = 0.85 * (this.fc / this.fy) * (this.ds / this.bw * this.d) * (this.bf - this.bw);
        this.rhobf = (this.rhob + this.rhof) * (this.bw / this.bf);

        this.rhomax = 0.75 * this.rhobf;

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.rho < this.rhomin) {
            //Display message: "Increase tension r/f"
            this.remarks_.remarklist.push(this.increaseTension);
            this.momentcap_.remarks = this.increaseTension;
        }

        if (this.rho > this.rhomax) {
            //Display message: "Reduce tension r/f"
            this.remarks_.remarklist.push(this.reduceTension);
            this.momentcap_.remarks = this.reduceTension;
        }

        if (this.rhodash && this.rhodash < 0) {
            this.remarks_.remarklist.push(this.addCompression);
            this.momentcap_.remarks = this.addCompression;
        }

        this.DepthEquiCompBlockSingly();
        this.DistCompFiberNA();
        this.NetTensStrain();

        if (this.epsT > 0.005) {
            //Display message: "Reduce tension r/f" OR "Increase section depth"
            //    this.momentcap_.remarklist.push("Reduce tension r/f");
            //    this.momentcap_.remarks = "Reduce tension r/f";
            //    var msg = "Reduce tension r/f";
            //    this.remarks_.remarklist.push(msg);
            //    this.momentcap_.remarks = msg;
        } else {
            this.phi = 0.9;
        }
    };
    this.CheckLimitsDoublyFlexRF = function () {
        this.rhomin = Math.max(3 * Math.sqrt(this.fc) / this.fy, 200 / this.fy);

        this.rhob = 0.85 * this.beta1 * (this.fc / this.fy) * (87000 / (87000 + this.fy));
        this.rhof = 0.85 * (this.fc / this.fy) * (this.ds / this.bw * this.d) * (this.bf - this.bw);
        this.rhobf = (this.rhob + this.rhof) * (this.bw / this.bf);

        this.rhomax = 0.75 * this.rhobf;

        this.K = 0.85 * this.beta1 * (this.fc / this.fy) * (this.ddash / this.d) * (87000 / (87000 - this.fy));

        if (this.rhodash < 0) {
            this.remarks_.remarklist.push(this.increaseCompression);
            this.momentcap_.remarks = this.increaseCompression;
        }

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.rho < this.rhomin) {
            //Display message: "Increase tension r/f"
            this.remarks_.remarklist.push(this.increaseTension);
            this.momentcap_.remarks = this.increaseTension;
        }

        if ((this.rho - this.rhodash - this.rhof) >= this.K) {
            this.fsdash = this.fy;
            this.c = (this.Asprov - this.Asdashprov) * this.fy / (0.85 * this.beta1 * this.fc * this.bf);
        } else {
            this.A1 = 0.85 * this.beta1 * this.fc * this.bw;
            this.A2 = this.Asdashprov * (87000 - 0.85 * this.fc) - this.Asprov * this.fy;
            this.A3 = -87000 * this.Asdashprov * this.ddash;

            this.c = (-this.A2 + Math.sqrt(Math.pow(this.A2, 2) - 4 * this.A1 * this.A3)) / (2 * this.A1);
            this.cneg = (-this.A2 - Math.sqrt(Math.pow(this.A2, 2) - 4 * this.A1 * this.A3)) / (2 * this.A1);

            this.fsdash = 87000 * ((this.c - this.ddash) / this.c);
        }

        if ((this.rho - this.rhodash * (this.fsdash / this.fy) - this.rhof) > this.rhomax) {
            //Display message: "Reduce tension r/f"
            this.remarks_.remarklist.push(this.reduceTension);
            this.momentcap_.remarks = this.reduceTension;
        } else {
            this.DepthEquiCompBlockDoubly();
            this.NetTensStrain();

            this.Phi();
        }
    };

    this.CheckLimitsTorsionRF = function () {
        this.Almin1 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - this.Atsprov * this.ph * this.fys / this.fy;
        this.Almin2 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - (25 * this.bw / this.fys) * this.ph * this.fys / this.fy;

        this.Almin = Math.min(this.Almin1, this.Almin2);

        if (this.Alreq <= this.Almin)
            this.Alreq = this.Almin;
    };
    this.CheckLimitsTorsionSection = function () {
        this.torsionCheckLeft = Math.sqrt(Math.pow(this.phiVn / (this.bw * this.d), 2) + Math.pow(this.phiTn * this.ph / (1.7 * Math.pow(this.Aoh, 2)), 2));
        this.torsionCheckRight = (this.Vc / (this.bw * this.d) + 8 * Math.sqrt(this.fc));
    };
    this.CheckSkinRF = function () {
        if (this.h >= 36) { //***36 inches
            this.fs = 2 * this.fy / 3;

            this.Aswebreq = 0.1 * this.h / 2; //ACI R9.7.2.3

            if (this.Asweb < this.Aswebreq) {
                //Display message: "Increase web r/f"
                this.remarks_.remarklist.push("Increase web r/f");
                this.asweb_.remarks = "Increase web r/f";
            }
        } else {
            //Display message: "Skin reinforcement not required"
            //    this.asweb_.remarklist.push("Skin reinforcement not required");
            //    this.asweb_.remarks = "Skin reinforcement not required";
        }
    };

    this.ShearCapConc = function () {
        this.Vc = 2 * this.lambda * Math.sqrt(this.fc) * this.bw * this.d;
    };
    this.ShearMaxConc = function () {
        this.Vmax = this.Vc + 8 * Math.sqrt(this.fc) * this.bw * this.d;
    };

    this.SteelBalCompConcFlange = function () {
        this.Asf = 0.85 * this.fc * this.ds * (this.bf - this.bw) / this.fy;
    };

    this.ReqCapTensSinglyFlex = function () {
        this.phiMn = this.phi * this.Asprov * this.fy * (this.d - this.a / 2);
    };
    this.ReqCapTensSinglyFlexFlanged = function () {
        this.phiMn = this.phi * ((this.Asprov - this.Asf) * this.fy * (this.d - this.a1 / 2) + this.Asf * this.fy * (this.d - this.ds / 2));
    };
    this.ReqCapTensDoublyFlex = function () {
        this.phiMn = this.phi * ((this.Asprov * this.fy - this.Asdashprov * this.fsdash) * (this.d - this.a / 2) + this.Asdashprov * this.fsdash * (this.d - this.ddash));
    };
    this.ReqCapTensDoublyFlexFlanged = function () {
        this.Mn1 = ((this.Asprov - this.Asf) * this.fy - this.Asdashprov * this.fsdash) * (this.d - this.a1 / 2);
        this.Mn2 = this.Asf * this.fy * (this.d - this.ds / 2);
        this.Mn3 = this.Asdashprov * this.fsdash * (this.d - this.ddash);

        this.phiMn = this.phi * (this.Mn1 + this.Mn2 + this.Mn3);
    };
    this.CrackingMoment = function () {
        this.fr = 7.5 * Math.sqrt(this.fc); //ACI 318-11 9.5.2.3, ACI 318-14 19.2.3.1

        this.Mcr = this.fr * this.i33 / this.y0; //Get I33, y0 from sectionproperties
    };
    this.ReqCapShearVs = function () {
        this.Vs = this.Avsprov * this.fys * this.d;
    };
    this.ReqCapTorsionTn = function () {
        this.phiTn = this.phi * this.Atsprov * 2 * this.Ao * this.fys / (Math.tan(this.theta));
    };
    this.ReqSteelTorsionAl = function () {
        this.Alreq = (this.Atsprov * this.ph * (this.fys / this.fy)) / (Math.pow(Math.tan(this.theta), 2));
    };
};

var sectionrectangleACI318_14 = function (section) {
    sectionrectangleACI318_11.call(this);

    this.section = section;

    //--------------------------------------------------------------------------//

    this.Phi = function () {
        this.phi = 0.65 + 0.25 * ((this.epsT - this.epsTY) / (0.005 - this.epsTY));

        if (this.phi <= 0.65)
            this.phi = 0.65;
        else if (this.phi >= 0.9)
            this.phi = 0.9;
    };
    this.NetTensStrain = function () {
        this.epsT = 0.003 * ((this.d - this.c) / this.c);

        this.epsTY = this.fy / this.es;
    };
};
var sectionflangedACI318_14 = function (section) { //SAME FOR T, L-sections
    sectionflangedACI318_11.call(this);

    this.section = section;

    //--------------------------------------------------------------------------//

    this.Phi = function () {
        this.phi = 0.65 + 0.25 * ((this.epsT - this.epsTY) / (0.005 - this.epsTY));

        if (this.phi <= 0.65)
            this.phi = 0.65;
        else if (this.phi >= 0.9)
            this.phi = 0.9;
    };
    this.NetTensStrain = function () {
        this.epsT = 0.003 * ((this.d - this.c) / this.c);

        this.epsTY = this.fy / this.es;
    };
};

var sectionrectangleBS8110_97 = function (section) {
    sectionBS8110.call(this);

    this.section = section;

    this.CalculateShearCap = function () {
        //    var msg = "Please note that the ACI 318 design code equations are in US Units";
        //    this.remarks_.remarklist.push(msg);
        this.remarks_.remarklist.push(this.rfConsideration);

        this.phi = 0.9; // TODO: Check phi value
        this.gammaMconc = 1.5;
        this.gammaMsteel = 1.15;

        if (this.section.considertors.value)
            this.Avsprov = (2 * this.Avtsprov) / 3;
        else
            this.Avsprov = this.Avtsprov;

        this.DepthEff(1); //coming from Shear

        this.CalcShearCap();

        this.shearcap_.value = this.Vu;
        this.avsprov_.value = this.Avsprov;

        var list = {};
        list.symbol = "ØV_n";
        list.value = this.shearcap_.value;
        this.shearcap_.equationlist.push(list);
        this.shearcap_.showequation = false;

        this.shearvc_.value = this.Vc;

        list = {};
        list.symbol = "ØV_c";
        list.value = this.shearvc_.value;
        this.shearvc_.equationlist.push(list);
        this.shearvc_.showequation = false;

        //    list = {};
        //    list.symbol = "Stirrups";
        //    list.value = this.section.stirrup.barsize.name + "@" + this.section.stirrup.spacing;
        //    this.stirrups_.equationlist.push(list);
        //    this.stirrups_.showequation = false;
        //    this.stirrups_.showindesign = false;

        list = {};
        list.symbol = "A_v/s";
        list.value = this.avsprov_.value;
        this.avsprov_.equationlist.push(list);
        this.avsprov_.showequation = false;

        if (isNaN(this.shearcap_.value) && (!this.shearcap_.remarks)) {
            this.shearcap_.remarks = "Not Computed";
        }
    };

    this.CalculateTorsionCap = function () {
        this.phi = 0.9;
        
        this.Atsprov = 0;
        this.Alreq = 0;

        if (this.section.considertors.value)
            this.Atsprov = this.Avtsprov / 3;
        else {
            this.remarks_.remarklist.push("Torsion not considered");
            this.atsprov_.remarks = "Not Considered";
        }

        this.DepthEff(2); //coming from Torsion

        this.RectLinkDimension();
        
        this.CalcTorsionCap();

        this.torsioncap_.value = this.Tu;
//        this.torsionconccap_.value = common.Convert(this.phi * this.Tth, UNITTYPEMOMENT.LBIN, UNITTYPEMOMENT.KNM); //TODO: Get torsion concrete capacity
        this.alreq_.value = this.Alreq;
        this.atsprov_.value = this.Atsprov;

        var list = {};
        list.symbol = "T_u";
        list.value = this.torsioncap_.value;
        this.torsioncap_.equationlist.push(list);
        this.torsioncap_.showequation = false;

//        list = {};
//        list.symbol = "ØT_c";
//        list.value = this.torsionconccap_.value;
//        this.torsionconccap_.equationlist.push(list);
//        this.torsionconccap_.showequation = false;

        list = {};
        list.symbol = "Al_{req}";
        list.value = this.alreq_.value;
        this.alreq_.equationlist.push(list);
        this.alreq_.showequation = false;

        list = {};
        list.symbol = "A_{v+t}/s";
        list.value = this.avtsprov_.value;
        this.avtsprov_.equationlist.push(list);
        this.avtsprov_.showequation = false;

        list = {};
        list.symbol = "A_t/s";
        list.value = this.atsprov_.value;
        this.atsprov_.equationlist.push(list);
        this.atsprov_.showequation = false;

        if (isNaN(this.torsioncap_.value) && (!this.torsioncap_.remarks)) {
            this.torsioncap_.remarks = "Not Computed";
        }
    };

    this.CalculateFlexureCap = function () {
        if (this.doublyBeam)
            this.CalculateDoublyFlexure();
        else
            this.CalculateSinglyFlexure();

        this.NADepth(); //TODO: No need?
        this.CrackingMoment(); //TODO: Check for BS8110

        this.nadepth_.value = this.x;
        //    this.nadepth_.value = common.Convert(this.c, UNITTYPELENGTH.INCH, UNITTYPELENGTH.MM);        
        this.momentcr_.value = this.Mcr;

        var list = {};
        list.symbol = "ØM_{cr}";
        list.value = this.momentcr_.value;
        this.momentcr_.equationlist.push(list);
        this.momentcr_.showequation = false;

        //    list = {};
        //    list.symbol = "ØM_{ub}";
        //    list.value = this.momentub_.value;
        //    this.momentub_.equationlist.push(list);
        //    this.momentub_.showequation = false;

        if (isNaN(this.nadepth_.value) && (!this.nadepth_.remarks)) {
            this.nadepth_.remarks = "Not Computed";
        } else {
            list = {};
            list.symbol = "NA_{Depth}";
            list.value = this.nadepth_.value;
            this.nadepth_.equationlist.push(list);
            this.nadepth_.showequation = false;
        }
    };

    this.CalculateSinglyFlexure = function () {
        if (this.section.considertors.value && $SETTINGS.distributelongbars.value) {
            this.Asprov -= this.Alreq / 2;
            this.Asdashprov -= this.Alreq / 2;
        }
        
        this.DepthEff(0); //Coming from Flexure
        
        this.Fst = 0.87 * this.fy * this.Asprov;
        this.Fcc = 0.45 * this.fc * this.b * 0.9;
        
        this.x =  this.Fst / this.Fcc;
        
        this.betab = 1 - this.R / 100; // BS 3.2.2.1(b)
        
        if ((this.x / this.d) <= (this.betab - 0.4)) {
            //TODO: Get moment lever arm
            //Get moment
        } else {
            //TODO: Get fst
            //Get quadratic eqn to solve for x
            //Get moment lever arm
            //Get moment
        }
        
        if (this.asbot_.value < this.astop_.value) {
            this.momentcap_.value = -this.Mu;
        } else {
            this.momentcap_.value = this.Mu;
        }

        if (isNaN(this.momentcap_.value) && (!this.momentcap_.remarks)) {
            this.momentcap_.remarks = "Not Computed";
        }
    }; //EDITED
    this.CalculateDoublyFlexure = function () {
        if (this.section.considertors.value && $SETTINGS.distributelongbars.value) {
            this.Asprov -= this.Alreq / 2;
            this.Asdashprov -= this.Alreq / 2;
        }

        this.DepthEff(0); //coming from Flexure
        this.DepthCompRF();
        
        this.Fst = 0.87 * this.fy * this.Asprov;
        this.Fsc = 0.87 * this.fy * this.Asdashprov;
        this.Fcc = 0.45 * this.fc * this.b * 0.9;
        
        this.x =  (this.Fst - this.Fsc) / this.Fcc;
        
        this.betab = 1 - this.R / 100; // BS 3.2.2.1(b)
        
        if ((this.x / this.d) <= (this.betab - 0.4)) {
            this.TensionYielded = true;
        } else {
            this.TensionYielded = false;
            //Get fst
        }
        
        if ((this.ddash / this.d) <= 0.43 * (this.betab - 0.4)) {
            this.CompressionYielded = true;
        } else {
            this.CompressionYielded = false;
            //Get fsc
        }
        
        if (this.TensionYielded && this.CompressionYielded) {
            //Get moment lever arm
            //Get moments
        } else if (this.TensionYielded && !this.CompressionYielded) {
            //Case II Doubly function
            //Get moments
        } else if (!this.TensionYielded && this.CompressionYielded) {
            //Case III Doubly function
            //Get moments
        } else {
            //Case IV Doubly
            //Get moments
        }

        this.CheckSkinRF();

        if (this.asbot < this.astop) {
            this.momentcap_.value = -this.Mu;
        } else {
            this.momentcap_.value = this.Mu;
        }

        if (isNaN(this.momentcap_.value) && (!this.momentcap_.remarks)) {
            this.momentcap_.remarks = "Not Computed";
        }
    };

    // --------------------------------------------------------------------------//

    this.DepthEff = function (procedure) {
        this.d = this.h - this.cc - this.dstirrup - (this.drftens / 2);

        var list = {};
        list.symbol = "d";
        list.equation = "{0} - {1} - {2} - {{3}} / 2";
        list.nameparam = ["h", "c_c", "d_{stirrup}", "d_{rf,tens}"];
        list.valueparam = [this.h, this.cc, this.dstirrup, this.drftens];
        list.value = this.d;

//        switch (procedure) {
//            case 0: //coming from Flexure
//                this.moment_.equationlist.push(list);
//                break;
//            case 1: //coming from Shear
//                this.shear_.equationlist.push(list);
//                break;
//            case 2: //coming from Torsion
//                this.torsion_.equationlist.push(list);
//                break;
//            default:
//                break;
//        }
    }; //EDITED
    this.DepthCompRF = function () {
        this.ddash = this.cc + this.dstirrup + (this.drfcomp / 2);
    }; //EDITED
    this.DepthEquiCompBlockSingly = function () {
        this.a = this.Asprov * this.fy / (0.85 * this.fc * this.b);
    };
    this.DepthEquiCompBlockDoubly = function () {
        this.a = (this.Asprov * this.fy - this.Asdashprov * this.fsdash) / (0.85 * this.fc * this.b);
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
    }; //EDITED
    
    
    this.CheckMomentRedist = function () {
        if (this.R > 30) {
            var msg = "Cannot redistribute more than 30%"; //BS 3.2.2.1(c)
            this.remarks_.remarklist.push(msg);
            this.asbot_.remarks = msg;
        } else {
            if (this.R <= 10) {
                this.R = 10;

                var list = {}; //TODO: make it into single line eqn's
                list.symbol = "R";
                list.equation = "{0}";
                list.nameparam = ["10"];
                list.valueparam = [10];
                list.value = this.R;
                this.moment_.equationlist.push(list);
            } else {
                this.betab = 1 - this.R / 100; // BS 3.2.2.1(b)

                var list = {};
                list.symbol = "β_b";
                list.equation = "1 - {{0}} / 100";
                list.nameparam = ["R"];
                list.valueparam = [this.R];
                list.value = this.betab;
                this.moment_.equationlist.push(list);
            }
        }
    }; //EDITED
    
    
    
    
    
    
    
    
    

    this.SecPropsConc = function () {
        this.Ag = this.b * this.h;
        this.Acp = this.b * this.h;
        this.pcp = 2 * this.b + 2 * this.h;
    };
    this.SecPropsEffConc = function () {
        this.Aoh = (this.b - 2 * this.cc) * (this.h - 2 * this.cc);
        this.Ao = 0.85 * this.Aoh;
        this.ph = 2 * (this.b - 2 * this.cc) + 2 * (this.h - 2 * this.cc);
    };

    this.DistCompFiberNA = function () {
        this.c = this.a / this.beta1;
    };
    this.NADepth = function () {
        this.ec = 57000 * Math.sqrt(this.fc);
        this.n = this.es / this.ec;
        this.r = (this.n - 1) * this.Asdashprov / (this.n * this.Asprov);
        this.B = this.b / (this.n * this.Asprov);

        if (this.ddash === undefined)
            this.ddash = 0;

        this.kd = (Math.sqrt(2 * this.B * this.d * (1 + (this.r * this.ddash) / this.d) + Math.pow(1 + this.r, 2)) - (1 + this.r)) / this.B;
    };
    this.Beta1 = function () {
        this.beta1 = 0.85 - 0.05 * ((this.fc - 4000) / 1000);

        if (this.beta1 <= 0.65)
            this.beta1 = 0.65;
        else if (this.beta1 >= 0.85)
            this.beta1 = 0.85;
    };
    this.Phi = function () {
        this.phi = 0.65 + (250 / 3) * (this.epsT - 0.002);

        if (this.phi <= 0.65)
            this.phi = 0.65;
        else if (this.phi >= 0.9)
            this.phi = 0.9;
    };
    this.NetTensStrain = function () {
        this.epsT = 0.003 * ((this.d - this.c) / this.c);
    };

    this.TorsionThreshold = function () {
        this.Tth = this.lambda * Math.sqrt(this.fc) * (Math.pow(this.Acp, 2) / this.pcp) * Math.sqrt(1 + (this.Pu / (4 * this.Ag * this.lambda * Math.sqrt(this.fc))));
    };

    this.CalcSinglyFlexCap = function () {
        this.CheckLimitsSinglyFlexRF();

        this.ReqCapTensSinglyFlex();
    };
    this.CalcDoublyFlexCap = function () {
        this.CheckLimitsDoublyFlexRF();

        this.ReqCapTensDoublyFlex();
    };
    this.CalcShearCap = function () {
        this.Avsminratio = 0.15;
        this.Avsmaxratio = 3;
        
        this.Avsratio = 100 * this.Asprov / (this.b * this.d);
        this.depthratio = Math.pow(400 / this.d, 0.25);
        
        if (this.Avsratio < this.Avsminratio) {
            this.Avsratio = this.Avsminratio;
        } else if (this.Avsratio > this.Avsmaxratio) {
            this.Avsratio = this.Avsmaxratio;
        } else {
            //TODO: For reporting equations
        }

        if (this.depthratio < 1) {
            this.depthratio = 1;
        } else {
            //TODO: For reporting equations
        }
        
        this.vc = (0.79 / this.gammaMconc) * Math.pow(this.fc / 25, 0.333333333) * Math.pow(this.Avsratio, 0.333333333) * this.depthratio;
        
        this.v = this.Avsprov * (0.87 * this.fys / this.b) + this.vc;
        
        this.Vu = this.v * this.b * this.d;
        
        this.Vc = this.vc * this.b * this.d;
    }; //EDITED
    this.CalcTorsionCap = function () {
        this.Tu = 0;

        if (this.section.considertors.value) {
            this.ReqCapTorsionTn();
            this.ReqSteelTorsionAl();
//            this.CheckLimitsTorsionRF(); //TODO: Check if torsion limits are needed for Al,req
        }
    }; //EDITED

    this.CheckLimitsSinglyFlexRF = function () {
        this.rhomin = Math.max(3 * Math.sqrt(this.fc) / this.fy, 200 / this.fy);

        this.rhob = 0.85 * this.beta1 * (this.fc / this.fy) * (87000 / (87000 + this.fy));
        this.rhomax = 0.75 * this.rhob;

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.rho < this.rhomin) {
            //Display message: "Increase tension r/f"
            this.remarks_.remarklist.push(this.increaseTension);
            this.momentcap_.remarks = this.increaseTension;
        }

        if (this.rho > this.rhomax) {
            //Display message: "Reduce tension r/f"
            this.remarks_.remarklist.push(this.reduceTension);
            this.momentcap_.remarks = this.reduceTension;
        }

        if (this.rhodash && this.rhodash < 0) {
            //Display message: "Add compression r/f"
            this.remarks_.remarklist.push(this.addCompression);
            this.momentcap_.remarks = this.addCompression;
        }

        this.DepthEquiCompBlockSingly();
        this.DistCompFiberNA();
        this.NetTensStrain();

        if (this.epsT > 0.005) {
            // Display message: "Reduce tension r/f" OR "Increase section depth"            
            //    var msg = "Reduce tension r/f";
            //    this.remarks_.remarklist.push(msg);
            //    this.momentcap_.remarks = msg;
        } else {
            this.phi = 0.9;
        }
    };
    this.CheckLimitsDoublyFlexRF = function () {
        this.rhomin = Math.max(3 * Math.sqrt(this.fc) / this.fy, 200 / this.fy);

        this.rhob = 0.85 * this.beta1 * (this.fc / this.fy) * (87000 / (87000 + this.fy));
        this.rhomax = 0.75 * this.rhob;

        this.K = 0.85 * this.beta1 * (this.fc / this.fy) * (this.ddash / this.d) * (87000 / (87000 - this.fy));

        if (this.rhodash < 0) {
            this.remarks_.remarklist.push(this.increaseCompression);
            this.momentcap_.remarks = this.increaseCompression;
        }

        //CHECK MINIMUM, MAXIMUM RF REQUIREMENTS [As,min, As,max]
        if (this.rho < this.rhomin) {
            this.remarks_.remarklist.push(this.increaseTension);
            this.momentcap_.remarks = this.increaseTension;
        }

        if ((this.rho - this.rhodash) >= this.K) {
            this.fsdash = this.fy;
            this.c = (this.Asprov - this.Asdashprov) * this.fy / (0.85 * this.beta1 * this.fc * this.b);
        } else {
            this.A1 = 0.85 * this.beta1 * this.fc * this.b;
            this.A2 = this.Asdashprov * (87000 - 0.85 * this.fc) - this.Asprov * this.fy;
            this.A3 = -87000 * this.Asdashprov * this.ddash;

            this.c = (-this.A2 + Math.sqrt(Math.pow(this.A2, 2) - 4 * this.A1 * this.A3)) / (2 * this.A1);
            this.cneg = (-this.A2 - Math.sqrt(Math.pow(this.A2, 2) - 4 * this.A1 * this.A3)) / (2 * this.A1);

            this.fsdash = 87000 * ((this.c - this.ddash) / this.c);
        }

        if ((this.rho - this.rhodash * (this.fsdash / this.fy)) > this.rhomax) {
            this.remarks_.remarklist.push(this.reduceTension);
            this.momentcap_.remarks = this.reduceTension;
        } else {
            this.DepthEquiCompBlockDoubly();
            this.NetTensStrain();

            this.Phi();
        }
    };

    this.CheckLimitsTorsionRF = function () {
        this.Almin1 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - this.Atsprov * this.ph * this.fys / this.fy;
        this.Almin2 = 5 * Math.sqrt(this.fc) * this.Acp / this.fy - (25 * this.b / this.fys) * this.ph * this.fys / this.fy;

        this.Almin = Math.min(this.Almin1, this.Almin2);

        if (this.Alreq <= this.Almin)
            this.Alreq = this.Almin;
    };
    this.CheckLimitsTorsionSection = function () {
        this.torsionCheckLeft = Math.sqrt(Math.pow(this.phiVn / (this.b * this.d), 2) + Math.pow(this.phiTn * this.ph / (1.7 * Math.pow(this.Aoh, 2)), 2));
        this.torsionCheckRight = (this.Vc / (this.b * this.d) + 8 * Math.sqrt(this.fc));
    };
    this.CheckSkinRF = function () { //TODO: Change to BS8110
        if (this.h >= 36) { //***36 inches
            this.fs = 2 * this.fy / 3;

            this.Aswebreq = 0.1 * this.h / 2; //ACI R9.7.2.3

            if (this.Asweb < this.Aswebreq) {
                //Display message: "Increase web r/f"
                this.remarks_.remarklist.push("Increase web r/f");
                this.asweb_.remarks = "Increase web r/f";
            }
        } else {
            //Display message: "Skin reinforcement not required"
            //    this.asweb_.remarklist.push("No Bars");
            //    this.asweb_.remarks = "No Bars";
        }
    }; //EDITED

    this.ShearCapConc = function () {
        this.Vc = 2 * this.lambda * Math.sqrt(this.fc) * this.b * this.d;
    };
    this.ShearMaxConc = function () {
        this.Vmax = this.Vc + 8 * Math.sqrt(this.fc) * this.b * this.d;
    };

    this.ReqCapTensSinglyFlex = function () {
        this.phiMn = this.phi * this.Asprov * this.fy * (this.d - this.a / 2);
    };
    this.ReqCapTensDoublyFlex = function () {
        this.phiMn = this.phi * ((this.Asprov * this.fy - this.Asdashprov * this.fsdash) * (this.d - this.a / 2) + this.Asdashprov * this.fsdash * (this.d - this.ddash));
    };
    this.CrackingMoment = function () {
        this.fr = 7.5 * Math.sqrt(this.fc); //ACI 318-11 9.5.2.3, ACI 318-14 19.2.3.1

        this.Mcr = this.fr * this.i33 / this.y0; //Get I33, y0 from sectionproperties
    };
    this.ReqCapShearVs = function () {
        this.Vs = this.Avsprov * this.fys * this.d;
    };
    this.ReqCapTorsionTn = function () {
        this.Tu = this.Atsprov * (0.8 * this.x1 * this.y1 * 0.87 * this.fys);
    }; //EDITED
    this.ReqSteelTorsionAl = function () {
        this.Alreq = this.Atsprov * (this.fys / this.fy) * (this.x1 + this.y1);
    }; //EDITED
};