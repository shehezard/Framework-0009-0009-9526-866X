/* global uiframework, common, $SETTINGS, UNITTYPEINERTIA, UNITTYPEAREA, UNITTYPELENGTH */

var sectionproperties = function () {
    this.cat1 = new uiframework.PropertyCategory("Basic Properties");
    this.area_ = new uiframework.PropertyDouble("Area, A", 0, common.unit.area);

    this.area_.readonly = true;

    this.sheararea22_ = new uiframework.PropertyDouble("Shear Area, SA<sub>2</sub>", 0, common.unit.area);
    this.sheararea22_.readonly = true;
    this.sheararea22_.shortname = "SA_2";

    this.sheararea33_ = new uiframework.PropertyDouble("Shear Area, SA<sub>3</sub>", 0, common.unit.area);
    this.sheararea33_.readonly = true;
    this.sheararea33_.shortname = "SA_3";

    this.inertia22_ = new uiframework.PropertyDouble("Inertia, I<sub>22</sub>", 0, common.unit.inertia);
    this.inertia22_.readonly = true;

    this.inertia33_ = new uiframework.PropertyDouble("Inertia, I<sub>33</sub>", 0, common.unit.inertia);
    this.inertia33_.readonly = true;

    this.inertia23_ = new uiframework.PropertyDouble("Inertia, I<sub>23</sub>", 0, common.unit.inertia);
    this.inertia23_.readonly = true;

    this.torsionalJ_ = new uiframework.PropertyDouble("Torsional, J", 0, common.unit.inertia);
    this.torsionalJ_.readonly = true;
    this.torsionalJ_.shortname = "J";

    this.cat2 = new uiframework.PropertyCategory("Section Bounds");
    this.x0_ = new uiframework.PropertyDouble("Centroid, x<sub>0</sub>", 0, common.unit.length);
    this.x0_.readonly = true;

    this.y0_ = new uiframework.PropertyDouble("Centroid, y<sub>0</sub>", 0, common.unit.length);
    this.y0_.readonly = true;

    this.totalwidth_ = new uiframework.PropertyDouble("Total Width, W<sub>total</sub>", 0, common.unit.length);
    this.totalwidth_.readonly = true;

    this.totalheight_ = new uiframework.PropertyDouble("Total Height, H<sub>total</sub>", 0, common.unit.length);
    this.totalheight_.readonly = true;

    this.cat3 = new uiframework.PropertyCategory("Additional Properties");
    this.r2_ = new uiframework.PropertyDouble("Radius of Gyration, R<sub>2</sub>", 0, common.unit.length);
    this.r2_.readonly = true;

    this.r3_ = new uiframework.PropertyDouble("Radius of Gyration, R<sub>3</sub>", 0, common.unit.length);
    this.r3_.readonly = true;

    this.s2l_ = new uiframework.PropertyDouble("<span>Section Modulus,</span> <span>S<sub>2-Left</sub></span>", 0, common.unit.sectionmodulus);
    this.s2l_.readonly = true;

    this.s2r_ = new uiframework.PropertyDouble("<span>Section Modulus,</span> <span> S<sub>2-Right</sub></span>", 0, common.unit.sectionmodulus);
    this.s2r_.readonly = true;

    this.s3t_ = new uiframework.PropertyDouble("<span>Section Modulus,</span> <span> S<sub>3-Top</sub></span>", 0, common.unit.sectionmodulus);
    this.s3t_.readonly = true;

    this.s3b_ = new uiframework.PropertyDouble("<span>Section Modulus,</span> <span> S<sub>3-Bottom</sub></span>", 0, common.unit.sectionmodulus);
    this.s3b_.readonly = true;

    this.z2_ = new uiframework.PropertyDouble("Plastic Modulus, Z<sub>2</sub>", 0, common.unit.sectionmodulus);
    this.z2_.readonly = true;
    this.z2_.shortname = "Z_2";

    this.z3_ = new uiframework.PropertyDouble("Plastic Modulus, Z<sub>3</sub>", 0, common.unit.sectionmodulus);
    this.z3_.readonly = true;
    this.z3_.shortname = "Z_3";

    this.cat4 = new uiframework.PropertyCategory("Principal Properties");
    this.ang_ = new uiframework.PropertyDouble("Principal Angle, θ", 0, common.unit.angle);
    this.ang_.readonly = true;

    this.ip1_ = new uiframework.PropertyDouble("Principal Moment of Inertia, I<sub>p1</sub>", 0, common.unit.inertia);
    this.ip1_.readonly = true;

    this.ip2_ = new uiframework.PropertyDouble("Principal Moment of Inertia, I<sub>p2</sub>", 0, common.unit.inertia);
    this.ip2_.readonly = true;

    this.Calculate = function () {
        this.area_.equationlist = [];
        this.sheararea22_.equationlist = [];
        this.sheararea33_.equationlist = [];
        this.inertia22_.equationlist = [];
        this.inertia33_.equationlist = [];
        this.inertia23_.equationlist = [];
        this.torsionalJ_.equationlist = [];
        this.x0_.equationlist = [];
        this.y0_.equationlist = [];
        this.totalwidth_.equationlist = [];
        this.totalheight_.equationlist = [];
        this.r2_.equationlist = [];
        this.r3_.equationlist = [];
        this.s2l_.equationlist = [];
        this.s2r_.equationlist = [];
        this.s3t_.equationlist = [];
        this.s3b_.equationlist = [];
        this.ang_.equationlist = [];
        this.ip1_.equationlist = [];
        this.ip2_.equationlist = [];

        this.UpdateDimension();
        this.CalculateArea();
        this.CalculateCentroid();
        this.CalculateShearArea();
        this.CalculateMomentofInertia();
        this.CalculateTorsion();
        this.CalculateCentroid();
        this.CalculateSectionModulus();
        this.CalculateRadiusofGyration();
        this.CalculatePrincipalProperties();


        if (common.IsZero(this.sheararea22_.value))
            this.sheararea22_.remarks = "Not Computed";
        else
            this.sheararea22_.remarks = "";

        if (common.IsZero(this.sheararea33_.value))
            this.sheararea33_.remarks = "Not Computed";
        else
            this.sheararea33_.remarks = "";

        if (common.IsZero(this.torsionalJ_.value))
            this.torsionalJ_.remarks = "Not Computed";
        else
            this.torsionalJ_.remarks = "";

        if (common.IsZero(this.torsionalJ_.value))
            this.torsionalJ_.remarks = "Not Computed";
        else
            this.torsionalJ_.remarks = "";

        if (common.IsZero(this.z2_.value))
            this.z2_.remarks = "Not Computed";
        else
            this.z2_.remarks = "";

        if (common.IsZero(this.z3_.value))
            this.z3_.remarks = "Not Computed";
        else
            this.z3_.remarks = "";

        if (this.section.x0 !== undefined) {
            this.section.x0.value = this.x0_.value;
        }

        if (this.section.y0 !== undefined) {
            this.section.y0.value = this.y0_.value;
        }

        if (this.section.section !== undefined && this.section.section.x0 !== undefined) {
            this.section.section.x0.value = this.x0_.value;
        }

        if (this.section.section !== undefined && this.section.section.y0 !== undefined) {
            this.section.section.y0.value = this.y0_.value;
        }

    };

    this.UpdateDimension = function () {
    };

    this.CalculateArea = function () {
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateMomentofInertia = function () {
    };

    this.CalculateTorsion = function () {
    };

    this.CalculateCentroid = function () {
    };

    this.CalculateSectionModulus = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        this.s2l = Math.abs(this.inertia22 / this.x0);
        this.s2r = Math.abs(this.inertia22 / (this.totalwidth - this.x0));
        this.s3t = Math.abs(this.inertia33 / (this.totalheight - this.y0));
        this.s3b = Math.abs(this.inertia33 / this.y0);

        this.s2l_.value = this.s2l;
        this.s2r_.value = this.s2r;
        this.s3t_.value = this.s3t;
        this.s3b_.value = this.s3b;

        this.s2l_.symbol = "S_{2-Left}";
        this.s2l_.equation = "{{0}} / {{1}}";
        this.s2l_.nameparam = ["I_22", "x_0"];
        this.s2l_.valueparam = [this.inertia22_.GetValue(), this.x0_.GetValue()];

        this.s2r_.symbol = "S_{2-Right}";
        this.s2r_.equation = "{{0}} / {{1} - {2}}";
        this.s2r_.nameparam = ["I_22", "W_{total}", "x_0"];
        this.s2r_.valueparam = [this.inertia22_.GetValue(), this.totalwidth_.GetValue(), this.x0_.GetValue()];

        this.s3t_.symbol = "S_{3-Top}";
        this.s3t_.equation = "{{0}} / {{1} - {2}}";
        this.s3t_.nameparam = ["I_33", "H_{total}", "y_0"];
        this.s3t_.valueparam = [this.inertia33_.GetValue(), this.totalheight_.GetValue(), this.y0_.GetValue()];

        this.s3b_.symbol = "S_{3-Bottom}";
        this.s3b_.equation = "{{0}} / {{1}}";
        this.s3b_.nameparam = ["I_33", "y_0"];
        this.s3b_.valueparam = [this.inertia33_.GetValue(), this.y0_.GetValue()];
    }; //this.totalwidth given a value

    this.CalculateRadiusofGyration = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        if (common.IsZero(this.area))
            this.CalculateArea();

        this.r2 = Math.sqrt(this.inertia22 / this.area);
        this.r3 = Math.sqrt(this.inertia33 / this.area);

        this.r2_.value = this.r2;
        this.r3_.value = this.r3;

        this.r2_.symbol = "R_2";
        this.r2_.equation = "√{{{0}} / {{1}}}";
        this.r2_.nameparam = ["I_22", "A"];
        this.r2_.valueparam = [this.inertia22_.GetValue(), this.area_.GetValue()];

        this.r3_.symbol = "R_3";
        this.r3_.equation = "√{{{0}} / {{1}}}";
        this.r3_.nameparam = ["I_33", "A"];
        this.r3_.valueparam = [this.inertia33_.GetValue(), this.area_.GetValue()];
    };

    this.CalculatePrincipalProperties = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        if (common.IsZero(this.inertia23))
            this.ang = 0;
        else if (this.inertia22 >= this.inertia33)
            this.ang = Math.abs(((1 / 2) * Math.atan(-(2 * this.inertia23) / (this.inertia22 - this.inertia33))) * (180 / Math.PI) - 90);
        else
            this.ang = Math.abs(((1 / 2) * Math.atan(-(2 * this.inertia23) / (this.inertia22 - this.inertia33))) * (180 / Math.PI));

        this.ip1 = (this.inertia33 + this.inertia22) / 2 + Math.sqrt((Math.pow((this.inertia22 - this.inertia33) / 2, 2)) + Math.pow(this.inertia23, 2));
        this.ip2 = (this.inertia33 + this.inertia22) / 2 - Math.sqrt((Math.pow((this.inertia22 - this.inertia33) / 2, 2)) + Math.pow(this.inertia23, 2));

        this.ang_.value = this.ang;
        this.ip1_.value = this.ip1;
        this.ip2_.value = this.ip2;

        this.ang_.symbol = "θ";

        if (common.IsZero(this.inertia23))
            this.ang_.equation = "{1 / 2} {tan^(-1)({-2*{0}}/{{2}-{1}})}";
        else if (this.inertia22 >= this.inertia33)
            this.ang_.equation = "{1 / 2} {tan^(-1)({-2*{0}}/{{2}-{1}})} - 90°";
        else
            this.ang_.equation = "{1 / 2} {tan^(-1)({-2*{0}}/{{2}-{1}})}";

        this.ang_.nameparam = ["I_23", "I_33", "I_22"];
        this.ang_.valueparam = [this.inertia23_.GetValue(), this.inertia33_.GetValue(), this.inertia22_.GetValue()];

        this.ip1_.symbol = "I_{p1}";
        this.ip1_.equation = "{{0} + {1}}/2 + √{({{0}-{1}}/2)^2 + {2}^2}";
        this.ip1_.nameparam = ["I_33", "I_22", "I_23"];
        this.ip1_.valueparam = [this.inertia33_.GetValue(), this.inertia22_.GetValue(), this.inertia23_.GetValue()];

        this.ip2_.symbol = "I_{p2}";
        this.ip2_.equation = "{{0} + {1}}/2 - √{({{0}-{1}}/2)^2 + {2}^2}";
        this.ip2_.nameparam = ["I_33", "I_22", "I_23"];
        this.ip2_.valueparam = [this.inertia33_.GetValue(), this.inertia22_.GetValue(), this.inertia23_.GetValue()];
    };
};

var sectionangle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "ANGLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.w * this.tf;
        this.area2 = (this.h - this.tf) * this.tw;

        this.area = this.area1 + this.area2;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({2} - {1}) * {3}";
        list.nameparam = ["w", "t_f", "h", "t_w"];
        list.valueparam = [this._w, this._tf, this._h, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1}";
        list.nameparam = ["A_1", "A_2"];
        list.valueparam = [this._area1, this._area2];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.w / 2;
        this.x2 = this.tw / 2;

        this.y1 = this.tf / 2;
        this.y2 = (this.h + this.tf) / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2) / this.area;

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_w"];
        list.valueparam = [this._tw];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_f"];
        list.valueparam = [this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0} + {1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (this.tf * Math.pow(this.w, 3)) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = ((this.h - this.tf) * Math.pow(this.tw, 3)) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);

        var temp3a = (this.w * Math.pow(this.tf, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = (this.tw * Math.pow(this.h - this.tf, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);

        this.inertia22 = temp2a + temp2b;
        this.inertia33 = temp3a + temp3b;
        this.inertia23 = this.area1 * (this.x0 - this.x1) * (this.y0 - this.y1) + this.area2 * (this.x0 - this.x2) * (this.y0 - this.y2);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = (this.inertia23);

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tf, this._w, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tf, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1}";
        list.nameparam = ["I_{2a}", "I_{2b}"];
        list.valueparam = [temp2a, temp2b];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._w, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1}";
        list.nameparam = ["I_{3a}", "I_{3b}"];
        list.valueparam = [temp3a, temp3b];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        var k1 = this.h * Math.pow(this.tw, 3) * (1 / 3 - (0.21 * (this.tw / this.h)) * (1 - (Math.pow(this.tw, 4) / (12 * Math.pow(this.h, 4)))));
        var k2 = (Math.pow(this.tf, 3) * (this.w - this.tw)) * (1 / 3 - (0.105 * (this.tf / (this.w - this.tw))) * (1 - (Math.pow(this.tf, 4) / (192 * Math.pow(this.w - this.tw, 4)))));
        var alpha = 0.07 * (this.tf / this.tw);
        var D = 2 * ((this.tw + this.tf) - Math.sqrt(2 * this.tw * this.tf));

        this.torsionalJ = k1 + k2 + alpha * Math.pow(D, 4);

        this.torsionalJ_.value = this.torsionalJ;

        k1 = common.Convert(k1, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        k2 = common.Convert(k2, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        D = common.Convert(D, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        this.torsionalJ_.equationlist = [];

        var list = new uiframework.PropertyDouble("k1", 0, common.unit.inertia);
        list.symbol = "k_1";
        list.equation = "{0} * {1}^3 * [{1 / 3} - 0.21({{1}} / {{0}})(1 - {{1}^4 / {12 * {0}^4}})]";
        list.nameparam = ["h", "t_w"];
        list.valueparam = [this._h, this._tw];
        list.value = k1;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("k2", 0, common.unit.inertia);
        list.symbol = "k_2";
        list.equation = "({1} - {2}) * {0}^3 * [{1 / 3} - 0.105({{0}} / {{1} - {2}})(1 - {{0}^4} / {192 * ({1} - {2})^4})]";
        list.nameparam = ["t_f", "w", "t_w"];
        list.valueparam = [this._tf, this._w, this._tw];
        list.value = k2;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("alpha", 0, common.unit.inertia);
        list.symbol = "α";
        list.equation = "0.07({{0}} / {{1}})";
        list.nameparam = ["t_f", "t_w"];
        list.valueparam = [this._tf, this._tw];
        list.value = alpha;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("D", 0, common.unit.inertia);
        list.symbol = "D";
        list.equation = "2[({0} + {1}) - √{2 * {0} * {1}}]";
        list.nameparam = ["t_w", "t_f"];
        list.valueparam = [this._tw, this._tf];
        list.value = D;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("J", 0, common.unit.inertia);
        list.symbol = "J";
        list.equation = "{0} + {1} + {2} * {3}^4";
        list.nameparam = ["k_1", "k_2", "α", "D"];
        list.valueparam = [k1, k2, alpha, D];
        list.value = this.torsionalJ_.GetValue();
        this.torsionalJ_.equationlist.push(list);
    };

}; //(x, y, w, h, tw, tf)

var sectionangletop = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "ANGLETOP";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.tw = this.section.tf.value;
        this.tf = this.section.tw.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.w * this.tf;
        this.area2 = (this.h - this.tf) * this.tw;

        this.area = this.area1 + this.area2;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({2} - {1}) * {3}";
        list.nameparam = ["w", "t_f", "h", "t_w"];
        list.valueparam = [this._w, this._tf, this._h, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1}";
        list.nameparam = ["A_1", "A_2"];
        list.valueparam = [this._area1, this._area2];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.w / 2;
        this.x2 = this.tw / 2;

        this.y1 = this.h - this.tf / 2;
        this.y2 = (this.h - this.tf) / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_w"];
        list.valueparam = [this._tw];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0} - {1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (this.tf * Math.pow(this.w, 3)) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = ((this.h - this.tf) * Math.pow(this.tw, 3)) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);

        var temp3a = (this.w * Math.pow(this.tf, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = (this.tw * Math.pow(this.h - this.tf, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);

        this.inertia22 = temp2a + temp2b;
        this.inertia33 = temp3a + temp3b;
        this.inertia23 = this.area1 * (this.x0 - this.x1) * (this.y0 - this.y1) + this.area2 * (this.x0 - this.x2) * (this.y0 - this.y2);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = (this.inertia23);

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tf, this._w, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tf, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1}";
        list.nameparam = ["I_{2a}", "I_{2b}"];
        list.valueparam = [temp2a, temp2b];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._w, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1}";
        list.nameparam = ["I_{3a}", "I_{3b}"];
        list.valueparam = [temp3a, temp3b];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        var k1 = this.h * Math.pow(this.tw, 3) * (1 / 3 - (0.21 * (this.tw / this.h)) * (1 - (Math.pow(this.tw, 4) / (12 * Math.pow(this.h, 4)))));
        var k2 = (Math.pow(this.tf, 3) * (this.w - this.tw)) * (1 / 3 - (0.105 * (this.tf / (this.w - this.tw))) * (1 - (Math.pow(this.tf, 4) / (192 * Math.pow(this.w - this.tw, 4)))));
        var alpha = 0.07 * (this.tf / this.tw);
        var D = 2 * ((this.tw + this.tf) - Math.sqrt(2 * this.tw * this.tf));

        this.torsionalJ = k1 + k2 + alpha * Math.pow(D, 4);

        this.torsionalJ_.value = this.torsionalJ;

        k1 = common.Convert(k1, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        k2 = common.Convert(k2, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        D = common.Convert(D, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        this.torsionalJ_.equationlist = [];

        var list = new uiframework.PropertyDouble("k1", 0, common.unit.inertia);
        list.symbol = "k_1";
        list.equation = "{0} * {1}^3 * [{1 / 3} - 0.21({{1}} / {{0}})(1 - {{{1}}^4 / {12 * {0}^4}})]";
        list.nameparam = ["h", "t_w"];
        list.valueparam = [this._h, this._tw];
        list.value = k1;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("k2", 0, common.unit.inertia);
        list.symbol = "k_2";
        list.equation = "({1} - {2}) * {0}^3 * [{1 / 3} - 0.105({{0}} / {{1} - {2}})(1 - {{0}^4} / {192 * ({1} - {2})^4})]";
        list.nameparam = ["t_f", "w", "t_w"];
        list.valueparam = [this._tf, this._w, this._tw];
        list.value = k2;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("alpha", 0, common.unit.inertia);
        list.symbol = "α";
        list.equation = "0.07({{0}} / {{1}})";
        list.nameparam = ["t_f", "t_w"];
        list.valueparam = [this._tf, this._tw];
        list.value = alpha;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("D", 0, common.unit.inertia);
        list.symbol = "D";
        list.equation = "2[({0} + {1}) - √{2 * {0} * {1}}]";
        list.nameparam = ["t_w", "t_f"];
        list.valueparam = [this._tw, this._tf];
        list.value = D;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("J", 0, common.unit.inertia);
        list.symbol = "J";
        list.equation = "{0} + {1} + {2} * {3}^4";
        list.nameparam = ["k_1", "k_2", "α", "D"];
        list.valueparam = [k1, k2, alpha, D];
        list.value = this.torsionalJ_.GetValue();
        this.torsionalJ_.equationlist.push(list);
    };

}; //(x, y, w, h, tw, tf)

var sectionIbeam = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "IBEAM";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.w * this.tf;
        this.area2 = (this.h - 2 * this.tf) * this.tw;
        this.area3 = this.w * this.tf;

        this.area = this.area1 + this.area2 + this.area3;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({2} - 2 * {1}) * {3}";
        list.nameparam = ["w", "t_f", "h", "t_w"];
        list.valueparam = [this._w, this._tf, this._h, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["A_1", "A_2", "A_3"];
        list.valueparam = [this._area1, this._area2, this._area3];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.w1 = this.w;

        this.x1 = this.w1 / 2;
        this.x2 = this.w1 / 2;
        this.x3 = this.w1 / 2;

        this.y1 = this.tf / 2;
        this.y2 = this.h / 2;
        this.y3 = this.h - this.tf / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_f"];
        list.valueparam = [this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["h"];
        list.valueparam = [this._w];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (this.tf * Math.pow(this.w, 3)) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = ((this.h - 2 * this.tf) * Math.pow(this.tw, 3)) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = (this.tf * Math.pow(this.w, 3)) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);

        var temp3a = (this.w * Math.pow(this.tf, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = (this.tw * Math.pow(this.h - 2 * this.tf, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = (this.w * Math.pow(this.tf, 3)) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);

        this.inertia22 = temp2a + temp2b + temp2c;
        this.inertia33 = temp3a + temp3b + temp3c;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tf, this._w, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - 2 * {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tf, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_3", "x_0", "x_3"];
        list.valueparam = [this._tf, this._w, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}"];
        list.valueparam = [temp2a, temp2b, temp2c];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._w, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - 2 * {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_3", "y_0", "y_3"];
        list.valueparam = [this._w, this._tf, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}"];
        list.valueparam = [temp3a, temp3b, temp3c];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        this.hw = this.h - this.tf - this.tf;

        var k1 = this.w * Math.pow(this.tf, 3) * (1 / 3 - (0.21 * (this.tf / this.w)) * (1 - (Math.pow(this.tf, 4) / (12 * Math.pow(this.w1, 4)))));
        var k2 = (Math.pow(this.tw, 3) * this.hw) / 3;
        var alpha = 0.15 * (this.tw / this.tf);
        var D = (Math.pow(this.tf, 2) + Math.pow(this.tw, 2) / 4) / this.tf;

        this.torsionalJ = 2 * k1 + k2 + 2 * alpha * Math.pow(D, 4);

        this.torsionalJ_.value = this.torsionalJ;
        this.torsionalJ_.equationlist = [];

        k1 = common.Convert(k1, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        k2 = common.Convert(k2, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        D = common.Convert(D, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("k1", 0, common.unit.inertia);
        list.symbol = "k_1";
        list.equation = "{0} * {1}^3 * [{1 / 3} - 0.21({{1}} / {{0}})(1 - {{{1}}^4 / {12 * {0}^4}})]";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = k1;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("k2", 0, common.unit.inertia);
        list.symbol = "k_2";
        list.equation = "{({1} - 2 * {2}) * {0}^3} / 3";
        list.nameparam = ["t_w", "h", "t_f"];
        list.valueparam = [this._tw, this._h, this._tf];
        list.value = k2;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("alpha", 0, common.unit.inertia);
        list.symbol = "α";
        list.equation = "0.15({{1}} / {{0}})";
        list.nameparam = ["t_f", "t_w"];
        list.valueparam = [this._tf, this._tw];
        list.value = alpha;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("D", 0, common.unit.inertia);
        list.symbol = "D";
        list.equation = "{{0}^2 + {{{1}}^2 / 4}} / {{0}}";
        list.nameparam = ["t_f", "t_w"];
        list.valueparam = [this._tf, this._tw];
        list.value = D;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("J", 0, common.unit.inertia);
        list.symbol = "J";
        list.equation = "2 * {0} + {1} + 2 * {2} * {3}^4";
        list.nameparam = ["k_1", "k_2", "α", "D"];
        list.valueparam = [k1, k2, alpha, D];
        list.value = this.torsionalJ_.GetValue();
        this.torsionalJ_.equationlist.push(list);
    };
}; //(x, y, w, h, tw, tf)

var sectionchannel = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "CHANNEL";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.w * this.tf;
        this.area2 = (this.h - 2 * this.tf) * this.tw;
        this.area3 = this.w * this.tf;

        this.area = this.area1 + this.area2 + this.area3;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({2} - 2 * {1}) * {3}";
        list.nameparam = ["w", "t_f", "h", "t_w"];
        list.valueparam = [this._w, this._tf, this._h, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["A_1", "A_2", "A_3"];
        list.valueparam = [this._area1, this._area2, this._area3];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.w / 2;
        this.x2 = this.tw / 2;
        this.x3 = this.w / 2;

        this.y1 = this.tf / 2;
        this.y2 = this.h / 2;
        this.y3 = this.h - this.tf / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_w"];
        list.valueparam = [this._tw];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_f"];
        list.valueparam = [this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["h"];
        list.valueparam = [this._w];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (this.tf * Math.pow(this.w, 3)) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = ((this.h - 2 * this.tf) * Math.pow(this.tw, 3)) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = (this.tf * Math.pow(this.w, 3)) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);

        var temp3a = (this.w * Math.pow(this.tf, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = (this.tw * Math.pow(this.h - 2 * this.tf, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = (this.w * Math.pow(this.tf, 3)) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);

        this.inertia22 = temp2a + temp2b + temp2c;
        this.inertia33 = temp3a + temp3b + temp3c;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tf, this._w, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - 2 * {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tf, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_3", "x_0", "x_3"];
        list.valueparam = [this._tf, this._w, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}"];
        list.valueparam = [temp2a, temp2b, temp2c];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._w, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - 2 * {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_3", "y_0", "y_3"];
        list.valueparam = [this._w, this._tf, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}"];
        list.valueparam = [temp3a, temp3b, temp3c];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        var k1 = this.w * Math.pow(this.tf, 3) * (1 / 3 - (0.21 * (this.tf / this.w)) * (1 - (Math.pow(this.tf, 4) / (12 * Math.pow(this.w, 4)))));
        var k2 = (Math.pow(this.tw, 3) * (this.h - 2 * this.tf)) / 3;
        var alpha = 0.15 * (this.tw / this.tf);
        var D = 2 * ((this.tw + this.tf) - Math.sqrt(2 * this.tw * this.tf));

        this.torsionalJ = 2 * k1 + k2 + 2 * alpha * Math.pow(D, 4);

        this.torsionalJ_.value = this.torsionalJ;

        k1 = common.Convert(k1, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        k2 = common.Convert(k2, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        D = common.Convert(D, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        this.torsionalJ_.equationlist = [];

        var list = new uiframework.PropertyDouble("k1", 0, common.unit.inertia);
        list.symbol = "k_1";
        //list.equation = "{0} * {1}^3 * [{1 / 3} - 0.21({{1}} / {{[0]})(1 - {{{1}}^4 / {12 * {0}^4}})]";
        list.equation = "{0} * {1}^3 * [{1 / 3} - 0.21({{1}} / {{0}})(1 - {{{1}}^4 / {12 * {0}^4}})]";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = k1;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("k2", 0, common.unit.inertia);
        list.symbol = "k_2";
        list.equation = "{({1} - 2 * {2}) * {0}^3} / 3";
        list.nameparam = ["t_w", "h", "t_f"];
        list.valueparam = [this._tw, this._h, this._tf];
        list.value = k2;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("alpha", 0, common.unit.inertia);
        list.symbol = "α";
        list.equation = "0.15({{1}} / {{0}})";
        list.nameparam = ["t_f", "t_w"];
        list.valueparam = [this._tf, this._tw];
        list.value = alpha;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("D", 0, common.unit.inertia);
        list.symbol = "D";
        list.equation = "2[({0} + {1}) - √{(2 * {0} * {1})}]";
        list.nameparam = ["t_w", "t_f"];
        list.valueparam = [this._tw, this._tf];
        list.value = D;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("J", 0, common.unit.inertia);
        list.symbol = "J";
        list.equation = "2 * {0} + {1} + 2 * {2} * {3}^4";
        list.nameparam = ["k_1", "k_2", "α", "D"];
        list.valueparam = [k1, k2, alpha, D];
        list.value = this.torsionalJ_.GetValue();
        this.torsionalJ_.equationlist.push(list);
    };
}; //(x, y, w, h, tw, tf)

var sectiontee = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "TEE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = (this.h - this.tf) * this.tw;
        this.area2 = this.w * this.tf;

        this.area = this.area1 + this.area2;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "({2} - {1}) * {3}";
        list.nameparam = ["w", "t_f", "h", "t_w"];
        list.valueparam = [this._w, this._tf, this._h, this._tw];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1}";
        list.nameparam = ["A_1", "A_2"];
        list.valueparam = [this._area1, this._area2];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.w / 2;
        this.x2 = this.w / 2;

        this.y1 = (this.h - this.tf) / 2;
        this.y2 = this.h - this.tf / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0} - {1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = ((this.h - this.tf) * Math.pow(this.tw, 3)) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = (this.tf * Math.pow(this.w, 3)) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);

        var temp3a = (this.tw * Math.pow(this.h - this.tf, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = (this.w * Math.pow(this.tf, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);

        this.inertia22 = temp2a + temp2b;
        this.inertia33 = temp3a + temp3b;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{({0} - {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_1", "x_0", "x_1"];
        list.valueparam = [this._h, this._tf, this._tw, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._tf, this._w, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1}";
        list.nameparam = ["I_{2a}", "I_{2b}"];
        list.valueparam = [temp2a, temp2b];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * ({1} - {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._tw, this._h, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._w, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1}";
        list.nameparam = ["I_{3a}", "I_{3b}"];
        list.valueparam = [temp3a, temp3b];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        var k1 = this.w * Math.pow(this.tf, 3) * (1 / 3 - (0.21 * (this.tf / this.w)) * (1 - (Math.pow(this.tf, 4) / (12 * Math.pow(this.w, 4)))));
        var k2 = Math.pow(this.tw, 3) * (this.h - this.tf) * (1 / 3 - (0.105 * (this.tw / (this.h - this.tf))) * (1 - (Math.pow(this.tw, 4) / (192 * Math.pow(this.h - this.tf, 4)))));
        var alpha = 0.07 * (this.tw / this.tf);
        var D = (Math.pow(this.tf, 2) + Math.pow(this.tw, 2) / 4) / this.tf;

        this.torsionalJ = k1 + k2 + alpha * Math.pow(D, 4);
        //Not sure :: var torsional = 1.12 / 3 * ((Math.pow(tw, 3) * this.hw) + (Math.pow(tf, 3) * w));

        this.torsionalJ_.value = this.torsionalJ;

        k1 = common.Convert(k1, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        k2 = common.Convert(k2, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        D = common.Convert(D, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        this.torsionalJ_.equationlist = [];

        var list = new uiframework.PropertyDouble("k1", 0, common.unit.inertia);
        list.symbol = "k_1";
        list.equation = "{0} * {1}^3 * [{1 / 3} - 0.21({{1}} / {{0}})(1 - {{{1}}^4 / {12 * {0}^4}})]";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._w, this._tf];
        list.value = k1;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("k2", 0, common.unit.inertia);
        list.symbol = "k_2";
        list.equation = "({1} - {2}) * {0}^3 * [{1 / 3} - 0.105({{0}} / {{1} - {2}})(1 - {{0}^4} / {192 * ({1} - {2})^4})]";
        list.nameparam = ["t_w", "h", "t_f"];
        list.valueparam = [this._tw, this._h, this._tf];
        list.value = k2;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("alpha", 0, common.unit.inertia);
        list.symbol = "α";
        list.equation = "0.07({{0}} / {{1}})";
        list.nameparam = ["t_w", "t_f"];
        list.valueparam = [this._tw, this._tf];
        list.value = alpha;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("D", 0, common.unit.inertia);
        list.symbol = "D";
        list.equation = "{{0}^2 + {{{1}}^2 / 4}} / {{0}}";
        list.nameparam = ["t_f", "t_w"];
        list.valueparam = [this._tf, this._tw];
        list.value = D;
        this.torsionalJ_.equationlist.push(list);

        list = new uiframework.PropertyDouble("J", 0, common.unit.inertia);
        list.symbol = "J";
        list.equation = "{0} + {1} + {2} * {3}^4";
        list.nameparam = ["k_1", "k_2", "α", "D"];
        list.valueparam = [k1, k2, alpha, D];
        list.value = this.torsionalJ_.GetValue();
        this.torsionalJ_.equationlist.push(list);
    };
}; //(x, y, w, h, tw, tf)

var sectionUtee = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "UTEE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;
        this.lf1 = this.section.lf1.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();
        this._lf1 = this.section.lf1.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.lf1 * this.tf;
        this.area2 = this.tw * this.h;
        this.area3 = (this.w - this.lf1 - this.tw) * this.tf;

        this.area = this.area1 + this.area2 + this.area3;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["l_{f1}", "t_f"];
        list.valueparam = [this._lf1, this._tf];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "{0} * {1}";
        list.nameparam = ["h", "t_w"];
        list.valueparam = [this._h, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "({0} - {1} - {2}) * {3}";
        list.nameparam = ["w", "l_{f1}", "t_w", "t_f"];
        list.valueparam = [this._w, this._lf1, this._tw, this._tf];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["A_1", "A_2", "A_3"];
        list.valueparam = [this._area1, this._area2, this._area3];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.lf1 / 2;
        this.x2 = this.lf1 + this.tw / 2;
        this.x3 = (this.w + this.lf1 + this.tw) / 2;

        this.y1 = this.h - this.tf / 2;
        this.y2 = this.h / 2;
        this.y3 = this.h - this.tf / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["l_{f1}"];
        list.valueparam = [this._lf1];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{0} + {{1}} / 2";
        list.nameparam = ["l_{f1}", "t_w"];
        list.valueparam = [this._lf1, this._tw];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{{2} + {0} + {1}} / 2";
        list.nameparam = ["l_{f1}", "t_w", "w"];
        list.valueparam = [this._lf1, this._tw, this._w];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{0} - {{2}} / 2";
        list.nameparam = ["h", "l_{f2}", "t_f"];
        list.valueparam = [this._h, this.lf2, this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["h"];
        list.valueparam = [this._h];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{0} - {{2}} / 2";
        list.nameparam = ["h", "l_{f2}", "t_f"];
        list.valueparam = [this._h, this.lf2, this._tf];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = this.tf * Math.pow(this.lf1, 3) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = this.h * Math.pow(this.tw, 3) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = this.tf * Math.pow(this.w - this.lf1 - this.tw, 3) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);

        var temp3a = this.lf1 * Math.pow(this.tf, 3) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = this.tw * Math.pow(this.h, 3) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = (this.w - this.lf1 - this.tw) * Math.pow(this.tf, 3) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);

        this.inertia22 = temp2a + temp2b + temp2c;
        this.inertia33 = temp3a + temp3b + temp3c;
        this.inertia23 = this.area1 * (this.x0 - this.x1) * (this.y0 - this.y1) + this.area2 * (this.x0 - this.x2) * (this.y0 - this.y2) + this.area3 * (this.x0 - this.x3) * (this.y0 - this.y3);                           //Inertia I23

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "l_{f1}", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tf, this._lf1, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["h", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{{0} * ({1} - {2} - {3})^3} / 12 + {4} * ({5} - {6})^2";
        list.nameparam = ["t_f", "w", "l_{f1}", "t_w", "A_3", "x_0", "x_3"];
        list.valueparam = [this._tf, this._w, this._lf1, this._tw, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}"];
        list.valueparam = [temp2a, temp2b, temp2c];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["l_{f1}", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._lf1, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_w", "h", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{({0} - {1} - {2}) * {3}^3} / 12 + {4} * ({5} - {6})^2";
        list.nameparam = ["w", "l_{f1}", "t_w", "t_f", "A_3", "y_0", "y_3"];
        list.valueparam = [this._w, this._lf1, this._tw, this._tf, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}"];
        list.valueparam = [temp3a, temp3b, temp3c];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
        //To do: Calculate shear area's
    };

    this.CalculateTorsion = function () {
        //To do: Calculate torsion
    };
}; //(x, y, w, h, tw, lf1, lf2, lf3)

var sectiontube = function (section) {
    sectionproperties.call(this);

    this.section = section;

    if ((this.section.t !== undefined))
        this.id = "TUBE";
    else
        this.id = "UTUBE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;


        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();

        if ((this.section.t !== undefined)) {
            this.t = this.section.t.value;

            this.tw1 = this.t;
            this.tw2 = this.t;
            this.tf1 = this.t;
            this.tf2 = this.t;

            this._t = this.section.t.GetValue();

            this._tw1 = this._t;
            this._tw2 = this._t;
            this._tf1 = this._t;
            this._tf2 = this._t;
        } else {
            this.tw1 = this.section.tw1.value;
            this.tw2 = this.section.tw2.value;
            this.tf1 = this.section.tf1.value;
            this.tf2 = this.section.tf2.value;

            this._tw1 = this.section.tw1.GetValue();
            this._tw2 = this.section.tw2.GetValue();
            this._tf1 = this.section.tf1.GetValue();
            this._tf2 = this.section.tf2.GetValue();
        }

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.h * this.tw1;
        this.area2 = this.tf2 * (this.w - this.tw1);
        this.area3 = (this.h - this.tf1 - this.tf2) * this.tw2;
        this.area4 = this.tf1 * (this.w - this.tw1);

        this.area = this.area1 + this.area2 + this.area3 + this.area4;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area4 = common.Convert(this.area4, UNITTYPEAREA.SQMM, common.unit.area.value);

        if ((this.section.t !== undefined)) {
            var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
            list.symbol = "A_1";
            list.equation = "{0} * {1}";
            list.nameparam = ["w", "h"];
            list.valueparam = [this._w, this._h];
            list.value = this._w * this._h;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
            list.symbol = "A_2";
            list.equation = "({0} - 2 * {2}) * ({1} - 2 * {2})";
            list.nameparam = ["w", "h", "t"];
            list.valueparam = [this._w, this._h, this._t];
            list.value = (this._w - 2 * this._t) * (this._h - 2 * this._t);
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A", 0, common.unit.area);
            list.symbol = "A";
            list.equation = "{0} - {1}";
            list.nameparam = ["A_1", "A_2"];
            list.valueparam = [this._w * this._h, (this._w - 2 * this._t) * (this._h - 2 * this._t)];
            list.value = this.area_.GetValue();
            this.area_.equationlist.push(list);
        } else {
            var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
            list.symbol = "A_1";
            list.equation = "{0} * {1}";
            list.nameparam = ["h", "t_{w1}"];
            list.valueparam = [this._h, this._tw1];
            list.value = this._area1;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
            list.symbol = "A_2";
            list.equation = "{0} * ({1} - {2})";
            list.nameparam = ["t_{f2}", "w", "t_{w1}"];
            list.valueparam = [this._tf2, this._w, this._tw1];
            list.value = this._area2;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
            list.symbol = "A_3";
            list.equation = "({0} - {1} - {2}) * {3}";
            list.nameparam = ["h", "t_{f1}", "t_{f2}", "t_{w1}"];
            list.valueparam = [this._h, this._tf1, this._tf2, this._tw2];
            list.value = this._area3;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A4", 0, common.unit.area);
            list.symbol = "A_4";
            list.equation = "{0} * ({1} - {2})";
            list.nameparam = ["t_{f1}", "w", "t_{w1}"];
            list.valueparam = [this._tf1, this._w, this._tw1];
            list.value = this._area4;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A", 0, common.unit.area);
            list.symbol = "A";
            list.equation = "{0} + {1} + {2} + {3}";
            list.nameparam = ["A_1", "A_2", "A_3", "A_4"];
            list.valueparam = [this._area1, this._area2, this._area3, this._area4];
            list.value = this.area_.GetValue();
            this.area_.equationlist.push(list);
        }
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.tw1 / 2;
        this.x2 = (this.w + this.tw1) / 2;
        this.x3 = this.w - this.tw2 / 2;
        this.x4 = (this.w + this.tw1) / 2;

        this.y1 = this.h / 2;
        this.y2 = this.tf2 / 2;
        this.y3 = (this.h - this.tf1 + this.tf2) / 2;
        this.y4 = this.h - this.tf1 / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3 + this.area4 * this.x4) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3 + this.area4 * this.y4) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x4 = common.Convert(this.x4, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y4 = common.Convert(this.y4, UNITTYPELENGTH.MM, common.unit.length.value);

        if ((this.section.t !== undefined)) {
            var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
            list.symbol = "x_1";
            list.equation = "{{0}} / 2";
            list.nameparam = ["w"];
            list.valueparam = [this._w];
            list.value = this._w / 2;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
            list.symbol = "x_2";
            list.equation = "{{0}} / 2";
            list.nameparam = ["w"];
            list.valueparam = [this._w];
            list.value = this._w / 2;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
            list.symbol = "x_0";
            list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
            list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A"];
            list.valueparam = [this._w * this._h, this._w / 2, (this._w - 2 * this._t) * (this._h - 2 * this._t), this._w / 2, this.area_.GetValue()];
            list.value = this.x0_.GetValue();
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
            list.symbol = "y_1";
            list.equation = "{{0}} / 2";
            list.nameparam = ["h"];
            list.valueparam = [this._h];
            list.value = this._h / 2;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
            list.symbol = "y_2";
            list.equation = "{{0}} / 2";
            list.nameparam = ["h"];
            list.valueparam = [this._h];
            list.value = this._h / 2;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
            list.symbol = "y_0";
            list.equation = "{{0} * {1} + {2} * {3}} / {{4}}";
            list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A"];
            list.valueparam = [this._w * this._h, this._h / 2, (this._w - 2 * this._t) * (this._h - 2 * this._t), this._h / 2, this.area_.GetValue()];
            list.value = this.y0_.GetValue();
            this.y0_.equationlist.push(list);
        } else {
            var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
            list.symbol = "x_1";
            list.equation = "{{0}} / 2";
            list.nameparam = ["t_{w1}"];
            list.valueparam = [this._tw1];
            list.value = this._x1;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
            list.symbol = "x_2";
            list.equation = "{{0} + {1}} / 2";
            list.nameparam = ["w", "t_{w1}"];
            list.valueparam = [this._w, this._tw1];
            list.value = this._x2;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
            list.symbol = "x_3";
            list.equation = "{0} - {{1}} / 2";
            list.nameparam = ["w", "t_{w2}"];
            list.valueparam = [this._w, this._tw2];
            list.value = this._x3;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x4", 0, common.unit.length);
            list.symbol = "x_4";
            list.equation = "{{0} + {1}} / 2";
            list.nameparam = ["w", "t_{w1}"];
            list.valueparam = [this._w, this._tw1];
            list.value = this._x4;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
            list.symbol = "x_0";
            list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7}} / {{8}}";
            list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A_4", "x_4", "A"];
            list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this._area4, this._x4, this.area_.GetValue()];
            list.value = this.x0_.GetValue();
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
            list.symbol = "y_1";
            list.equation = "{{0}} / 2";
            list.nameparam = ["h"];
            list.valueparam = [this._h];
            list.value = this._y1;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
            list.symbol = "y_2";
            list.equation = "{{0}} / 2";
            list.nameparam = ["t_{f2}"];
            list.valueparam = [this._tf2];
            list.value = this._y2;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
            list.symbol = "y_3";
            list.equation = "{{0} - {1} + {2}}/ 2";
            list.nameparam = ["h", "t_{f1}", "t_{f2}"];
            list.valueparam = [this._h, this._tf1, this._tf2];
            list.value = this._y3;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y4", 0, common.unit.length);
            list.symbol = "y_4";
            list.equation = "{0} - {{1}} / 2";
            list.nameparam = ["h", "t_{f1}"];
            list.valueparam = [this._h, this._tf1];
            list.value = this._y4;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
            list.symbol = "y_0";
            list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7}} / {{8}}";
            list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A_4", "y_4", "A"];
            list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this._area4, this._y4, this.area_.GetValue()];
            list.value = this.y0_.GetValue();
            this.y0_.equationlist.push(list);
        }
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = this.h * Math.pow(this.tw1, 3) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = this.tf2 * Math.pow(this.w - this.tw1, 3) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = (this.h - this.tf1 - this.tf2) * Math.pow(this.tw2, 3) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);
        var temp2d = this.tf1 * Math.pow(this.w - this.tw1, 3) / 12 + this.area4 * Math.pow(this.x0 - this.x4, 2);

        var temp3a = (this.tw1 * Math.pow(this.h, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = ((this.w - this.tw1) * Math.pow(this.tf2, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = (this.tw2 * Math.pow(this.h - this.tf1 - this.tf2, 3)) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);
        var temp3d = ((this.w - this.tw1) * Math.pow(this.tf1, 3)) / 12 + this.area4 * Math.pow(this.y0 - this.y4, 2);

        this.inertia22 = temp2a + temp2b + temp2c + temp2d;
        this.inertia33 = temp3a + temp3b + temp3c + temp3d;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0) + this.area4 * (this.x4 - this.x0) * (this.y4 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2d = common.Convert(temp2d, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3d = common.Convert(temp3d, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        if ((this.section.t !== undefined)) {
            var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
            list.symbol = "I_{2a}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["h", "w"];
            list.valueparam = [this._h, this._w];
            list.value = this._h * Math.pow(this._w, 3) / 12;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
            list.symbol = "I_{2b}";
            list.equation = "{({0} - 2 * {2}) * ({1} - 2 * {2})^3} / 12";
            list.nameparam = ["h", "w", "{t}"];
            list.valueparam = [this._h, this._w, this._t];
            list.value = (this._h - 2 * this._t) * Math.pow(this._w - 2 * this._t, 3) / 12;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
            list.symbol = "I_{22}";
            list.equation = "{0} - {1}";
            list.nameparam = ["I_{2a}", "I_{2b}"];
            list.valueparam = [this._h * Math.pow(this._w, 3) / 12, (this._h - 2 * this._t) * Math.pow(this._w - 2 * this._t, 3) / 12];
            list.value = this.inertia22_.GetValue();
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
            list.symbol = "I_{3a}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["w", "h"];
            list.valueparam = [this._h, this._w];
            list.value = this._w * Math.pow(this._h, 3) / 12;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
            list.symbol = "I_{3b}";
            list.equation = "{({0} - 2 * {2}) * ({1} - 2 * {2})^3} / 12";
            list.nameparam = ["w", "h", "{t}"];
            list.valueparam = [this._h, this._w, this._t];
            list.value = (this._w - 2 * this._t) * Math.pow(this._h - 2 * this._t, 3) / 12;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
            list.symbol = "I_{33}";
            list.equation = "{0} - {1}";
            list.nameparam = ["I_{3a}", "I_{3b}"];
            list.valueparam = [this._w * Math.pow(this._h, 3) / 12, (this._w - 2 * this._t) * Math.pow(this._h - 2 * this._t, 3) / 12];
            list.value = this.inertia33_.GetValue();
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
            list.symbol = "I_{23}";
            list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9})";
            list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0"];
            list.valueparam = [this._w * this._h, this._w / 2, this.x0_.GetValue(), this._h / 2, this.y0_.GetValue(), (this._w - 2 * this._t) * (this._h - 2 * this._t), this._w / 2, this.x0_.GetValue(), this._h / 2, this.y0_.GetValue()];
            list.value = this.inertia23_.GetValue();
            this.inertia23_.equationlist.push(list);
        } else {
            var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
            list.symbol = "I_{2a}";
            list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
            list.nameparam = ["h", "t_{w1}", "A_1", "x_0", "x_1"];
            list.valueparam = [this._h, this._tw1, this._area1, this.x0_.GetValue(), this._x1];
            list.value = temp2a;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
            list.symbol = "I_{2b}";
            list.equation = "{{0} * ({1} - {2})^3} / 12 + {3} * ({4} - {5})^2";
            list.nameparam = ["t_{f2}", "w", "t_{w1}", "A_2", "x_0", "x_2"];
            list.valueparam = [this._tf2, this._w, this._tw1, this._area2, this.x0_.GetValue(), this._x2];
            list.value = temp2b;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
            list.symbol = "I_{2c}";
            list.equation = "{({0} - {1} - {2}) * {3}^3} / 12 + {4} * ({5} - {6})^2";
            list.nameparam = ["h", "t_{f1}", "t_{f2}", "t_{w2}", "A_3", "x_0", "x_3"];
            list.valueparam = [this._h, this._tf1, this._tf2, this._tw1, this._area3, this.x0_.GetValue(), this._x3];
            list.value = temp2c;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2d", 0, common.unit.inertia);
            list.symbol = "I_{2d}";
            list.equation = "{{0} * ({1} - {2})^3} / 12 + {3} * ({4} - {5})^2";
            list.nameparam = ["t_{f1}", "w", "t_{w1}", "A_4", "x_0", "x_4"];
            list.valueparam = [this._tf1, this._w, this._tw1, this._area4, this.x0_.GetValue(), this._x4];
            list.value = temp2d;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
            list.symbol = "I_{22}";
            list.equation = "{0} + {1} + {2} + {3}";
            list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}", "I_{2d}"];
            list.valueparam = [temp2a, temp2b, temp2c, temp2d];
            list.value = this.inertia22_.GetValue();
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
            list.symbol = "I_{3a}";
            list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
            list.nameparam = ["t_{w1}", "h", "A_1", "y_0", "y_1"];
            list.valueparam = [this._tw1, this._h, this._area1, this.y0_.GetValue(), this._y1];
            list.value = temp3a;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
            list.symbol = "I_{3b}";
            list.equation = "{({0} - {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
            list.nameparam = ["w", "t_{w1}", "t_{f2}", "A_2", "y_0", "y_2"];
            list.valueparam = [this._w, this._tw1, this._tf2, this._area2, this.y0_.GetValue(), this._y2];
            list.value = temp3b;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
            list.symbol = "I_{3c}";
            list.equation = "{{0} * ({1} - {2} - {3})^3} / 12 + {4} * ({5} - {6})^2";
            list.nameparam = ["t_{w2}", "h", "t_{f1}", "t_{f2}", "A_3", "y_0", "y_3"];
            list.valueparam = [this._tw2, this._h, this._tf1, this._tf2, this._area3, this.y0_.GetValue(), this._y3];
            list.value = temp3c;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3d", 0, common.unit.inertia);
            list.symbol = "I_{3d}";
            list.equation = "{({0} - {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
            list.nameparam = ["w", "t_{w1}", "t_{f1}", "A_4", "y_0", "y_4"];
            list.valueparam = [this._w, this._tw1, this._tf1, this._area4, this.y0_.GetValue(), this._y4];
            list.value = temp3d;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
            list.symbol = "I_{33}";
            list.equation = "{0} + {1} + {2} + {3}";
            list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}", "I_{3d}"];
            list.valueparam = [temp3a, temp3b, temp3c, temp3d];
            list.value = this.inertia33_.GetValue();
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
            list.symbol = "I_{23}";
            list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14}) + {15}({16} - {17})({18} - {19})";
            list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0", "A_4", "x_4", "x_0", "y_4", "y_0"];
            list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue(), this._area4, this._x4, this.x0_.GetValue(), this._y4, this.y0_.GetValue()];
            list.value = this.inertia23_.GetValue();
            this.inertia23_.equationlist.push(list);
        }
    };

    this.CalculateShearArea = function () {
        //To do: Calculate shear area's
    };

    this.CalculateTorsion = function () {
        //To do: Calculate torsion
        //this.torsionalJ.value = (this.h * Math.pow(this.w, 3)) * (1 / 3 - 0.21 * (this.w / this.h) * (1 - (Math.pow(this.w, 4) / (12 * Math.pow(this.h, 4)))));
    };
}; //(x, y, w, h, tw1, tw2, tf1, tf2)

var sectionUIbeam = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "UIBEAM";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.wTop = this.section.wtop.value;
        this.wBot = this.section.wbot.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tfTop = this.section.tft.value;
        this.tfBot = this.section.tfb.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._wTop = this.section.wtop.GetValue();
        this._wBot = this.section.wbot.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tfTop = this.section.tft.GetValue();
        this._tfBot = this.section.tfb.GetValue();

        this.totalwidth = Math.max(this.wTop, this.wBot);
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";

        if (this.totalwidth === this.wTop) {
            this.totalwidth_.nameparam = ["w_t"];
        } else {
            this.totalwidth_.nameparam = ["w_b"];
        }

        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.wBot * this.tfBot;
        this.area2 = (this.h - this.tfTop - this.tfBot) * this.tw;
        this.area3 = this.wTop * this.tfTop;

        this.area = this.area1 + this.area2 + this.area3;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_b", "t_{fb}"];
        list.valueparam = [this._wBot, this._tfBot];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({0} - {1} - {2}) * {3}";
        list.nameparam = ["h", "t_{ft}", "t_{fb}", "t_w"];
        list.valueparam = [this._h, this._tfTop, this._tfBot, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_t", "t_{ft}"];
        list.valueparam = [this._wTop, this._tfTop];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["A_1", "A_2", "A_3"];
        list.valueparam = [this._area1, this._area2, this._area3];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.w = Math.max(this.wTop, this.wBot);

        this.x1 = this.w / 2;
        this.x2 = this.w / 2;
        this.x3 = this.w / 2;

        this.y1 = this.tfBot / 2;
        this.y2 = (this.h - this.tfTop + this.tfBot) / 2;
        this.y3 = this.h - this.tfTop / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);

        this._w = common.Convert(this.w, UNITTYPELENGTH.MM, common.unit.length.value);

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w"];
        list.valueparam = [this._w];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_{fb}"];
        list.valueparam = [this._tfBot];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0} - {1} + {2}} / 2";
        list.nameparam = ["h", "t_{ft}", "t_{fb}"];
        list.valueparam = [this._h, this._tfTop, this._tfBot];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_{ft}"];
        list.valueparam = [this._h, this._tfTop];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = this.tfBot * Math.pow(this.wBot, 3) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = (this.h - this.tfTop - this.tfBot) * Math.pow(this.tw, 3) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = this.tfTop * Math.pow(this.wTop, 3) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);

        var temp3a = this.wBot * Math.pow(this.tfBot, 3) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = this.tw * Math.pow(this.h - this.tfTop - this.tfBot, 3) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = this.wTop * Math.pow(this.tfTop, 3) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);

        this.inertia22 = temp2a + temp2b + temp2c;
        this.inertia33 = temp3a + temp3b + temp3c;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_{fb}", "w_b", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tfBot, this._wBot, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - {1} - {2}) * {3}^3} / 12 + {4} * ({5} - {6})^2";
        list.nameparam = ["h", "t_{ft}", "t_{fb}", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tfTop, this._tfBot, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_{ft}", "w_t", "A_3", "x_0", "x_3"];
        list.valueparam = [this._tfTop, this._wTop, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}"];
        list.valueparam = [temp2a, temp2b, temp2c];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_b", "t_{fb}", "A_1", "y_0", "y_1"];
        list.valueparam = [this._wBot, this._tfBot, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - {2} - {3})^3} / 12 + {4} * ({5} - {6})^2";
        list.nameparam = ["t_w", "h", "t_{ft}", "t_{fb}", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tfTop, this._tfBot, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_t", "t_{ft}", "A_3", "y_0", "y_3"];
        list.valueparam = [this._wTop, this._tfTop, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}"];
        list.valueparam = [temp3a, temp3b, temp3c];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
        //TO DO
    };

    this.CalculateTorsion = function () {
        //TO DO
    };
}; // (x, y, wTop, wBot, h, tw, tfTop, tfBot)

var sectionUchannel = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "UCHANNEL";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.wTop = this.section.wtop.value;
        this.wBot = this.section.wbot.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tfTop = this.section.tft.value;
        this.tfBot = this.section.tfb.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._wTop = this.section.wtop.GetValue();
        this._wBot = this.section.wbot.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tfTop = this.section.tft.GetValue();
        this._tfBot = this.section.tfb.GetValue();

        this.totalwidth = Math.max(this.wTop, this.wBot);
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";

        if (this.totalwidth === this.wTop) {
            this.totalwidth_.nameparam = ["w_t"];
        } else {
            this.totalwidth_.nameparam = ["w_b"];
        }

        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.hw = this.h - this.tfTop - this.tfBot;

        this.area1 = this.wBot * this.tfBot;
        this.area2 = this.hw * this.tw;
        this.area3 = this.wTop * this.tfTop;

        this.area = this.area1 + this.area2 + this.area3;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_b", "t_{fb}"];
        list.valueparam = [this._wBot, this._tfBot];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({0} - {1} - {2}) * {3}";
        list.nameparam = ["h", "t_{ft}", "t_{fb}", "t_w"];
        list.valueparam = [this._h, this._tfTop, this._tfBot, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_t", "t_{ft}"];
        list.valueparam = [this._wTop, this._tfTop];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["A_1", "A_2", "A_3"];
        list.valueparam = [this._area1, this._area2, this._area3];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.wBot / 2;
        this.x2 = this.tw / 2;
        this.x3 = this.wTop / 2;

        this.y1 = this.tfBot / 2;
        this.y2 = this.hw / 2 + this.tfBot;
        this.y3 = this.h - this.tfTop / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w_b"];
        list.valueparam = [this._wBot];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_w"];
        list.valueparam = [this._tw];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w_t"];
        list.valueparam = [this._wTop];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_{fb}"];
        list.valueparam = [this._tfBot];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0} - {1} + {2}} / 2";
        list.nameparam = ["h", "t_{ft}", "t_{fb}"];
        list.valueparam = [this._h, this._tfTop, this._tfBot];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_{ft}"];
        list.valueparam = [this._h, this._tfTop];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        if (common.IsZero(this.hw))
            this.hw = this.h - this.tfTop - this.tfBot;

        var temp2a = this.tfBot * Math.pow(this.wBot, 3) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = this.hw * Math.pow(this.tw, 3) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = this.tfTop * Math.pow(this.wTop, 3) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);

        var temp3a = this.wBot * Math.pow(this.tfBot, 3) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = this.tw * Math.pow(this.hw, 3) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = this.wTop * Math.pow(this.tfTop, 3) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);

        this.inertia22 = temp2a + temp2b + temp2c;
        this.inertia33 = temp3a + temp3b + temp3c;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0);                           //Inertia I23

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_{fb}", "w_b", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tfBot, this._wBot, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - {1} - {2}) * {3}^3} / 12 + {4} * ({5} - {6})^2";
        list.nameparam = ["h", "t_{ft}", "t_{fb}", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tfTop, this._tfBot, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_{ft}", "w_t", "A_3", "x_0", "x_3"];
        list.valueparam = [this._tfTop, this._wTop, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}"];
        list.valueparam = [temp2a, temp2b, temp2c];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_b", "t_{fb}", "A_1", "y_0", "y_1"];
        list.valueparam = [this._wBot, this._tfBot, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - {2} - {3})^3} / 12 + {4} * ({5} - {6})^2";
        list.nameparam = ["t_w", "h", "t_{ft}", "t_{fb}", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tfTop, this._tfBot, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_t", "t_{ft}", "A_3", "y_0", "y_3"];
        list.valueparam = [this._wTop, this._tfTop, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}"];
        list.valueparam = [temp3a, temp3b, temp3c];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
        //TODO
    };

    this.CalculateTorsion = function () {
        //TODO
    };
}; //(x, y, wTop, wBot, h, tw, tfTop, tfBot)

var sectionbuiltupangle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "BUILTANGLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.wf = this.section.wf.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;
        this.g = this.section.gap.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._wf = this.section.wf.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();
        this._g = this.section.gap.GetValue();

        this.totalwidth = this.wf * 2 + this.g;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0} * 2 + {1}";
        this.totalwidth_.nameparam = ["w_f", "g"];
        this.totalwidth_.valueparam = [this._wf, this._g];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.wf * this.tf;
        this.area2 = (this.h - this.tf) * this.tw;
        this.area3 = this.wf * this.tf;
        this.area4 = (this.h - this.tf) * this.tw;

        this.area = this.area1 + this.area2 + this.area3 + this.area4;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area4 = common.Convert(this.area4, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_f", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({0} - {1}) * {2}";
        list.nameparam = ["h", "t_f", "t_w"];
        list.valueparam = [this._h, this._tf, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_f", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A4", 0, common.unit.area);
        list.symbol = "A_4";
        list.equation = "({0} - {1}) * {2}";
        list.nameparam = ["h", "t_f", "t_w"];
        list.valueparam = [this._h, this._tf, this._tw];
        list.value = this._area4;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2} + {3}";
        list.nameparam = ["A_1", "A_2", "A_3", "A_4"];
        list.valueparam = [this._area1, this._area2, this._area3, this._area4];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.wf / 2;
        this.x2 = this.wf - this.tw / 2;
        this.x3 = (3 / 2) * this.wf + this.g;
        this.x4 = this.wf + this.g + this.tw / 2;

        this.y1 = this.tf / 2;
        this.y2 = (this.h + this.tf) / 2;
        this.y3 = this.tf / 2;
        this.y4 = (this.h + this.tf) / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3 + this.area4 * this.x4) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3 + this.area4 * this.y4) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x4 = common.Convert(this.x4, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y4 = common.Convert(this.y4, UNITTYPELENGTH.MM, common.unit.length.value);

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w_f"];
        list.valueparam = [this._wf];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["w_f", "t_w"];
        list.valueparam = [this._wf, this._tw];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{3 / 2} * {0} + {1}";
        list.nameparam = ["w_f", "g"];
        list.valueparam = [this._wf, this._g];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x4", 0, common.unit.length);
        list.symbol = "x_4";
        list.equation = "{0} + {1} + {{2}} / 2";
        list.nameparam = ["w_f", "g", "t_w"];
        list.valueparam = [this._wf, this._g, this._tw];
        list.value = this._x4;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7}} / {{8}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A_4", "x_4", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this._area4, this._x4, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_f"];
        list.valueparam = [this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0} + {1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_f"];
        list.valueparam = [this._tf];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y4", 0, common.unit.length);
        list.symbol = "y_4";
        list.equation = "{{0} + {1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y4;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7}} / {{8}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A_4", "x_4", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this._area4, this._y4, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (this.tf * Math.pow(this.wf, 3)) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = ((this.h - this.tf) * Math.pow(this.tw, 3)) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = (this.tf * Math.pow(this.wf, 3)) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);
        var temp2d = ((this.h - this.tf) * Math.pow(this.tw, 3)) / 12 + this.area4 * Math.pow(this.x0 - this.x4, 2);

        var temp3a = ((this.wf) * Math.pow(this.tf, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = ((this.tw) * Math.pow(this.h - this.tf, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = ((this.wf) * Math.pow(this.tf, 3)) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);
        var temp3d = ((this.tw) * Math.pow(this.h - this.tf, 3)) / 12 + this.area4 * Math.pow(this.y0 - this.y4, 2);

        this.inertia22 = temp2a + temp2b + temp2c + temp2d;
        this.inertia33 = temp3a + temp3b + temp3c + temp3d;
        this.inertia23 = 0; //this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0) + this.area4 * (this.x4 - this.x0) * (this.y4 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2d = common.Convert(temp2d, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3d = common.Convert(temp3d, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w_f", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tf, this._wf, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tf, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w_f", "A_3", "x_0", "x_3"];
        list.valueparam = [this._tf, this._wf, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2d", 0, common.unit.inertia);
        list.symbol = "I_{2d}";
        list.equation = "{({0} - {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_4", "x_0", "x_4"];
        list.valueparam = [this._h, this._tf, this._tw, this._area4, this.x0_.GetValue(), this._x4];
        list.value = temp2d;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2} + {3}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}", "I_{2d}"];
        list.valueparam = [temp2a, temp2b, temp2c, temp2d];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_f", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._wf, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_f", "t_f", "A_3", "y_0", "y_3"];
        list.valueparam = [this._wf, this._tf, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3d", 0, common.unit.inertia);
        list.symbol = "I_{3d}";
        list.equation = "{{0} * ({1} - {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_4", "y_0", "y_4"];
        list.valueparam = [this._tw, this._h, this._tf, this._area4, this.y0_.GetValue(), this._y4];
        list.value = temp3d;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2} + {3}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}", "I_{3d}"];
        list.valueparam = [temp3a, temp3b, temp3c, temp3d];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14}) + {15}({16} - {17})({18} - {19})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0", "A_4", "x_4", "x_0", "y_4", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue(), this._area4, this._x4, this.x0_.GetValue(), this._y4, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        //TODO
    };
}; //(x, y, wf, h, tw, tf)

var sectionbuiltupw = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "BUILTW";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.wf = this.section.wf.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;
        this.wp = this.section.wp.value;
        this.tp = this.section.tp.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._wf = this.section.wf.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();
        this._wp = this.section.wp.GetValue();
        this._tp = this.section.tp.GetValue();

        this.totalwidth = Math.max(this.wp, this.wf);
        this.totalheight = this.h + 2 * this.tp;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        if (this.totalwidth === this.wp) {
            this.widthString = ["w_p"];
        } else {
            this.widthString = ["w_f"];
        }

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{{0}}";
        this.totalwidth_.nameparam = this.widthString;
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0} + {1} * 2";
        this.totalheight_.nameparam = ["h", "t_p"];
        this.totalheight_.valueparam = [this._h, this._tp];
    };

    this.CalculateArea = function () {
        this.area1 = this.wp * this.tp;
        this.area2 = this.wf * this.tf;
        this.area3 = (this.h - 2 * this.tf) * this.tw;
        this.area4 = this.area2;
        this.area5 = this.area1;

        this.area = this.area1 + this.area2 + this.area3 + this.area4 + this.area5;

        this.area_.value = this.area;

        this.area_.equationlist = [];

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area4 = common.Convert(this.area4, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area5 = common.Convert(this.area5, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_p", "t_p"];
        list.valueparam = [this._wp, this._tp];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_f", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "({0} - 2 * {1}) * {2}";
        list.nameparam = ["h", "t_f", "t_w"];
        list.valueparam = [this._h, this._tf, this._tw];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A4", 0, common.unit.area);
        list.symbol = "A_4";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_f", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area4;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A5", 0, common.unit.area);
        list.symbol = "A_5";
        list.equation = "{0} * {1}";
        list.nameparam = ["w_p", "t_p"];
        list.valueparam = [this._wp, this._tp];
        list.value = this._area5;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2} + {3} + {4}";
        list.nameparam = ["A_1", "A_2", "A_3", "A_4", "A_5"];
        list.valueparam = [this._area1, this._area2, this._area3, this._area4, this._area5];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.totalwidth / 2;
        this.x2 = this.totalwidth / 2;
        this.x3 = this.totalwidth / 2;
        this.x4 = this.totalwidth / 2;
        this.x5 = this.totalwidth / 2;

        this.y1 = this.tp / 2;
        this.y2 = this.tf / 2 + this.tp;
        this.y3 = this.totalheight / 2;
        this.y4 = this.totalheight - this.tp - this.tf / 2;
        this.y5 = this.totalheight - this.tp / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3 + this.area4 * this.x4 + this.area5 * this.x5) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3 + this.area4 * this.y4 + this.area5 * this.y5) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x4 = common.Convert(this.x4, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x5 = common.Convert(this.x5, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y4 = common.Convert(this.y4, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y5 = common.Convert(this.y5, UNITTYPELENGTH.MM, common.unit.length.value);

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = this.widthString;
        list.valueparam = [this.totalwidth_.GetValue()];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{{0}} / 2";
        list.nameparam = this.widthString;
        list.valueparam = [this.totalwidth_.GetValue()];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{{0}} / 2";
        list.nameparam = this.widthString;
        list.valueparam = [this.totalwidth_.GetValue()];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x4", 0, common.unit.length);
        list.symbol = "x_4";
        list.equation = "{{0}} / 2";
        list.nameparam = this.widthString;
        list.valueparam = [this.totalwidth_.GetValue()];
        list.value = this._x4;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x5", 0, common.unit.length);
        list.symbol = "x_5";
        list.equation = "{{0}} / 2";
        list.nameparam = this.widthString;
        list.valueparam = [this.totalwidth_.GetValue()];
        list.value = this._x5;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7} + {8} * {9}} / {{10}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A_4", "x_4", "A_5", "x_5", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this._area4, this._x4, this._area5, this._x5, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_p"];
        list.valueparam = [this._tp];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0}} / 2 + {1}";
        list.nameparam = ["t_f", "t_p"];
        list.valueparam = [this._tf, this._tp];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{{0}} / 2";
        list.nameparam = ["h_t"];
        list.valueparam = [this.totalheight_.GetValue()];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y4", 0, common.unit.length);
        list.symbol = "y_4";
        list.equation = "{0}  - {1} - {{2}} / 2";
        list.nameparam = ["h_t", "t_p", "t_f"];
        list.valueparam = [this.totalheight_.GetValue(), this._tp, this._tf];
        list.value = this._y4;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y5", 0, common.unit.length);
        list.symbol = "y_5";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h_t", "t_p"];
        list.valueparam = [this.totalheight_.GetValue(), this._tp];
        list.value = this._y5;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7} + {8} * {9}} / {{10}}";
        list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A_4", "y_4", "A_5", "y_5", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this._area4, this._y4, this._area5, this._y5, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (1 / 12) * this.tp * Math.pow(this.wp, 3) + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = (1 / 12) * this.tf * Math.pow(this.wf, 3) + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = (1 / 12) * (this.h - 2 * this.tf) * Math.pow(this.tw, 3) + this.area3 * Math.pow(this.x0 - this.x3, 2);
        var temp2d = (1 / 12) * this.tf * Math.pow(this.wf, 3) + this.area4 * Math.pow(this.x0 - this.x4, 2);
        var temp2e = (1 / 12) * this.tp * Math.pow(this.wp, 3) + this.area5 * Math.pow(this.x0 - this.x5, 2);

        var temp3a = (1 / 12) * this.wp * Math.pow(this.tp, 3) + this.area1 * Math.pow(Math.abs(this.y0 - this.y1), 2);
        var temp3b = (1 / 12) * this.wf * Math.pow(this.tf, 3) + this.area2 * Math.pow(Math.abs(this.y0 - this.y2), 2);
        var temp3c = (1 / 12) * this.tw * Math.pow((this.h - 2 * this.tf), 3) + this.area3 * Math.pow(Math.abs(this.y0 - this.y3), 2);
        var temp3d = (1 / 12) * this.wf * Math.pow(this.tf, 3) + this.area4 * Math.pow(Math.abs(this.y0 - this.y4), 2);
        var temp3e = (1 / 12) * this.wp * Math.pow(this.tp, 3) + this.area5 * Math.pow(Math.abs(this.y0 - this.y5), 2);

        this.inertia22 = temp2a + temp2b + temp2c + temp2d + temp2e;
        this.inertia33 = temp3a + temp3b + temp3c + temp3d + temp3e;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0) + this.area4 * (this.x4 - this.x0) * (this.y4 - this.y0) + this.area5 * (this.x5 - this.x0) * (this.y5 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2d = common.Convert(temp2d, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2e = common.Convert(temp2e, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3d = common.Convert(temp3d, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3e = common.Convert(temp3e, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_p", "w_p", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tp, this._wp, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w_f", "A_2", "x_0", "x_2"];
        list.valueparam = [this._tf, this._tf, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{({0} - 2 * {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_3", "x_0", "x_3"];
        list.valueparam = [this._h, this._tf, this._tw, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2d", 0, common.unit.inertia);
        list.symbol = "I_{2d}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w_f", "A_4", "x_0", "x_4"];
        list.valueparam = [this._tf, this._tf, this._area4, this.x0_.GetValue(), this._x4];
        list.value = temp2d;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2e", 0, common.unit.inertia);
        list.symbol = "I_{2e}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_p", "w_p", "A_5", "x_0", "x_5"];
        list.valueparam = [this._tp, this._wp, this._area5, this.x0_.GetValue(), this._x5];
        list.value = temp2e;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2} + {3} + {4}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}", "I_{2d}", "I_{2e}"];
        list.valueparam = [temp2a, temp2b, temp2c, temp2d, temp2e];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_p", "t_p", "A_1", "y_0", "y_1"];
        list.valueparam = [this._wp, this._tp, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_f", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._wf, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{{0} * ({1} - 2 * {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_3", "y_0", "y_3"];
        list.valueparam = [this._tw, this._h, this._tf, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3d", 0, common.unit.inertia);
        list.symbol = "I_{3d}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_f", "t_f", "A_4", "y_0", "y_4"];
        list.valueparam = [this._wf, this._tf, this._area4, this.y0_.GetValue(), this._y4];
        list.value = temp3d;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3e", 0, common.unit.inertia);
        list.symbol = "I_{3e}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w_p", "t_p", "A_5", "y_0", "y_5"];
        list.valueparam = [this._wp, this._tp, this._area5, this.y0_.GetValue(), this._y5];
        list.value = temp3e;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2} + {3} + {4}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}", "I_{3d}", "I_{3e}"];
        list.valueparam = [temp3a, temp3b, temp3c, temp3d, temp3e];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14}) + {15}({16} - {17})({18} - {19}) + {20}({21} - {22})({23} - {24})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0", "A_4", "x_4", "x_0", "y_4", "y_0", "A_5", "x_5", "x_0", "y_5", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue(), this._area4, this._x4, this.x0_.GetValue(), this._y4, this.y0_.GetValue(), this._area5, this._x5, this.x0_.GetValue(), this._y5, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
        //TO DO
    };

    this.CalculateTorsion = function () {
        //TO DO
    };
}; //(x, y, wf, h, tw, tf, wp, tp)

var sectionbuiltupchannel = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "BUILTCHANNEL";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.wf = this.section.wf.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;
        this.g = this.section.gap.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._wf = this.section.wf.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();
        this._g = this.section.gap.GetValue();

        this.totalwidth = this.wf * 2 + this.g;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0} * 2 + {1}";
        this.totalwidth_.nameparam = ["w_f", "g"];
        this.totalwidth_.valueparam = [this._wf, this._g];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.wf * this.tf;
        this.area2 = (this.h - 2 * this.tf) * this.tw;
        this.area3 = this.area1;
        this.area4 = this.area1;
        this.area5 = this.area2;
        this.area6 = this.area1;

        this.area = this.area1 + this.area2 + this.area3 + this.area4 + this.area5 + this.area6;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area4 = common.Convert(this.area4, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area5 = common.Convert(this.area5, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area6 = common.Convert(this.area6, UNITTYPEAREA.SQMM, common.unit.area.value);

        var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
        list.symbol = "A_1";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area1;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
        list.symbol = "A_2";
        list.equation = "({0} - 2 * {1}) * {2}";
        list.nameparam = ["h", "t_f", "t_w"];
        list.valueparam = [this._h, this._tf, this._tw];
        list.value = this._area2;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
        list.symbol = "A_3";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area3;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A4", 0, common.unit.area);
        list.symbol = "A_4";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area4;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A5", 0, common.unit.area);
        list.symbol = "A_5";
        list.equation = "({0} - 2 * {1}) * {2}";
        list.nameparam = ["h", "t_f", "t_w"];
        list.valueparam = [this._h, this._tf, this._tw];
        list.value = this._area5;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A6", 0, common.unit.area);
        list.symbol = "A_6";
        list.equation = "{0} * {1}";
        list.nameparam = ["w", "t_f"];
        list.valueparam = [this._wf, this._tf];
        list.value = this._area6;
        this.area_.equationlist.push(list);

        list = new uiframework.PropertyDouble("A", 0, common.unit.area);
        list.symbol = "A";
        list.equation = "{0} + {1} + {2} + {3} + {4} + {5}";
        list.nameparam = ["A_1", "A_2", "A_3", "A_4", "A_5", "A_6"];
        list.valueparam = [this._area1, this._area2, this._area3, this._area4, this._area5, this._area6];
        list.value = this.area_.GetValue();
        this.area_.equationlist.push(list);
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.wf / 2;
        this.x2 = this.wf - this.tw / 2;
        this.x3 = this.wf / 2;
        this.x4 = (3 / 2) * this.wf + this.g;
        this.x5 = this.wf + this.g + this.tw / 2;
        this.x6 = (3 / 2) * this.wf + this.g;

        this.y1 = this.tf / 2;
        this.y2 = this.h / 2;
        this.y3 = this.h - this.tf / 2;
        this.y4 = this.tf / 2;
        this.y5 = this.h / 2;
        this.y6 = this.h - this.tf / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3 + this.area4 * this.x4 + this.area5 * this.x5 + this.area6 * this.x6) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3 + this.area4 * this.y4 + this.area5 * this.y5 + this.area6 * this.y6) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x4 = common.Convert(this.x4, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x5 = common.Convert(this.x5, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x6 = common.Convert(this.x6, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y4 = common.Convert(this.y4, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y5 = common.Convert(this.y5, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y6 = common.Convert(this.y6, UNITTYPELENGTH.MM, common.unit.length.value);

        var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
        list.symbol = "x_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w_f"];
        list.valueparam = [this._wf];
        list.value = this._x1;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
        list.symbol = "x_2";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["w_f", "t_w"];
        list.valueparam = [this._wf, this._tw];
        list.value = this._x2;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
        list.symbol = "x_3";
        list.equation = "{{0}} / 2";
        list.nameparam = ["w_f"];
        list.valueparam = [this._wf];
        list.value = this._x3;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x4", 0, common.unit.length);
        list.symbol = "x_4";
        list.equation = "{3 / 2} * {0}  + {1}";
        list.nameparam = ["w_f", "g"];
        list.valueparam = [this._wf, this._g];
        list.value = this._x4;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x5", 0, common.unit.length);
        list.symbol = "x_5";
        list.equation = "{0} + {1} + {{2}} / 2";
        list.nameparam = ["w_f", "g", "t_w"];
        list.valueparam = [this._wf, this._g, this._tw];
        list.value = this._x5;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x6", 0, common.unit.length);
        list.symbol = "x_6";
        list.equation = "{3 / 2} * {0}  + {1}";
        list.nameparam = ["w_f", "g"];
        list.valueparam = [this._wf, this._g];
        list.value = this._x6;
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
        list.symbol = "x_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7} + {8} * {9} + {10} * {11}} / {{12}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A_4", "x_4", "A_5", "x_5", "A_6", "x_6", "A"];
        list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this._area4, this._x4, this._area5, this._x5, this._area6, this._x6, this.area_.GetValue()];
        list.value = this.x0_.GetValue();
        this.x0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
        list.symbol = "y_1";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_f"];
        list.valueparam = [this._tf];
        list.value = this._y1;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
        list.symbol = "y_2";
        list.equation = "{{0}} / 2";
        list.nameparam = ["h"];
        list.valueparam = [this._h];
        list.value = this._y2;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
        list.symbol = "y_3";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y3;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y4", 0, common.unit.length);
        list.symbol = "y_4";
        list.equation = "{{0}} / 2";
        list.nameparam = ["t_f"];
        list.valueparam = [this._tf];
        list.value = this._y4;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y5", 0, common.unit.length);
        list.symbol = "y_5";
        list.equation = "{{0}} / 2";
        list.nameparam = ["h"];
        list.valueparam = [this._h];
        list.value = this._y5;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y6", 0, common.unit.length);
        list.symbol = "y_6";
        list.equation = "{0} - {{1}} / 2";
        list.nameparam = ["h", "t_f"];
        list.valueparam = [this._h, this._tf];
        list.value = this._y6;
        this.y0_.equationlist.push(list);

        list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
        list.symbol = "y_0";
        list.equation = "{{0} * {1} + {2} * {3} + {4} * {5} + {6} * {7} + {8} * {9} + {10} * {11}} / {{12}}";
        list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A_4", "x_4", "A_5", "x_5", "A_6", "x_6", "A"];
        list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this._area4, this._y4, this._area5, this._y5, this._area6, this._y6, this.area_.GetValue()];
        list.value = this.y0_.GetValue();
        this.y0_.equationlist.push(list);
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (this.tf * Math.pow(this.wf, 3)) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = ((this.h - 2 * this.tf) * Math.pow(this.tw, 3)) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = (this.tf * Math.pow(this.wf, 3)) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);
        var temp2d = (this.tf * Math.pow(this.wf, 3)) / 12 + this.area4 * Math.pow(this.x0 - this.x4, 2);
        var temp2e = ((this.h - 2 * this.tf) * Math.pow(this.tw, 3)) / 12 + this.area5 * Math.pow(this.x0 - this.x5, 2);
        var temp2f = (this.tf * Math.pow(this.wf, 3)) / 12 + this.area6 * Math.pow(this.x0 - this.x6, 2);

        var temp3a = ((this.wf) * Math.pow(this.tf, 3)) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = ((this.tw) * Math.pow(this.h - 2 * this.tf, 3)) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = ((this.wf) * Math.pow(this.tf, 3)) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);
        var temp3d = ((this.wf) * Math.pow(this.tf, 3)) / 12 + this.area4 * Math.pow(this.y0 - this.y4, 2);
        var temp3e = ((this.tw) * Math.pow(this.h - 2 * this.tf, 3)) / 12 + this.area5 * Math.pow(this.y0 - this.y5, 2);
        var temp3f = ((this.wf) * Math.pow(this.tf, 3)) / 12 + this.area6 * Math.pow(this.y0 - this.y6, 2);

        this.inertia22 = temp2a + temp2b + temp2c + temp2d + temp2e + temp2f;
        this.inertia33 = temp3a + temp3b + temp3c + temp3d + temp3e + temp3f;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0) + this.area4 * (this.x4 - this.x0) * (this.y4 - this.y0) + this.area5 * (this.x5 - this.x0) * (this.y5 - this.y0) + this.area6 * (this.x6 - this.x0) * (this.y6 - this.y0);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2d = common.Convert(temp2d, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2e = common.Convert(temp2e, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2f = common.Convert(temp2f, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3d = common.Convert(temp3d, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3e = common.Convert(temp3e, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3f = common.Convert(temp3f, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
        list.symbol = "I_{2a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w_f", "A_1", "x_0", "x_1"];
        list.valueparam = [this._tf, this._wf, this._area1, this.x0_.GetValue(), this._x1];
        list.value = temp2a;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
        list.symbol = "I_{2b}";
        list.equation = "{({0} - 2 * {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_2", "x_0", "x_2"];
        list.valueparam = [this._h, this._tf, this._tw, this._area2, this.x0_.GetValue(), this._x2];
        list.value = temp2b;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
        list.symbol = "I_{2c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_3", "x_0", "x_3"];
        list.valueparam = [this._tf, this._wf, this._area3, this.x0_.GetValue(), this._x3];
        list.value = temp2c;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2d", 0, common.unit.inertia);
        list.symbol = "I_{2d}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w_f", "A_4", "x_0", "x_4"];
        list.valueparam = [this._tf, this._wf, this._area4, this.x0_.GetValue(), this._x4];
        list.value = temp2d;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2e", 0, common.unit.inertia);
        list.symbol = "I_{2e}";
        list.equation = "{({0} - 2 * {1}) * {2}^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["h", "t_f", "t_w", "A_5", "x_0", "x_5"];
        list.valueparam = [this._h, this._tf, this._tw, this._area5, this.x0_.GetValue(), this._x5];
        list.value = temp2e;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp2f", 0, common.unit.inertia);
        list.symbol = "I_{2f}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["t_f", "w", "A_6", "x_0", "x_6"];
        list.valueparam = [this._tf, this._wf, this._area6, this.x0_.GetValue(), this._x6];
        list.value = temp2f;
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
        list.symbol = "I_{22}";
        list.equation = "{0} + {1} + {2} + {3} + {4} + {5}";
        list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}", "I_{2d}", "I_{2e}", "I_{2f}"];
        list.valueparam = [temp2a, temp2b, temp2c, temp2d, temp2e, temp2f];
        list.value = this.inertia22_.GetValue();
        this.inertia22_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
        list.symbol = "I_{3a}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_1", "y_0", "y_1"];
        list.valueparam = [this._wf, this._tf, this._area1, this.y0_.GetValue(), this._y1];
        list.value = temp3a;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
        list.symbol = "I_{3b}";
        list.equation = "{{0} * ({1} - 2 * {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_2", "y_0", "y_2"];
        list.valueparam = [this._tw, this._h, this._tf, this._area2, this.y0_.GetValue(), this._y2];
        list.value = temp3b;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
        list.symbol = "I_{3c}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_3", "y_0", "y_3"];
        list.valueparam = [this._wf, this._tf, this._area3, this.y0_.GetValue(), this._y3];
        list.value = temp3c;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3d", 0, common.unit.inertia);
        list.symbol = "I_{3d}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_4", "y_0", "y_4"];
        list.valueparam = [this._wf, this._tf, this._area4, this.y0_.GetValue(), this._y4];
        list.value = temp3d;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3e", 0, common.unit.inertia);
        list.symbol = "I_{3e}";
        list.equation = "{{0} * ({1} - 2 * {2})^3} / 12 + {3} * ({4} - {5})^2";
        list.nameparam = ["t_w", "h", "t_f", "A_5", "y_0", "y_5"];
        list.valueparam = [this._tw, this._h, this._tf, this._area5, this.y0_.GetValue(), this._y5];
        list.value = temp3e;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("temp3f", 0, common.unit.inertia);
        list.symbol = "I_{3f}";
        list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
        list.nameparam = ["w", "t_f", "A_6", "y_0", "y_6"];
        list.valueparam = [this._wf, this._tf, this._area6, this.y0_.GetValue(), this._y6];
        list.value = temp3f;
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
        list.symbol = "I_{33}";
        list.equation = "{0} + {1} + {2} + {3} + {4} + {5}";
        list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}", "I_{3d}", "I_{3e}", "I_{3f}"];
        list.valueparam = [temp3a, temp3b, temp3c, temp3d, temp3e, temp3f];
        list.value = this.inertia33_.GetValue();
        this.inertia33_.equationlist.push(list);

        list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
        list.symbol = "I_{23}";
        list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14} +               {15}({16} - {17})({18} - {19}) + {20}({21} - {22})({23} - {24}) + {25}({26} - {27})({28} - {29})";
        list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0", "A_4", "x_4", "x_0", "y_4", "y_0", "A_5", "x_5", "x_0", "y_5", "y_0", "A_6", "x_6", "x_0", "y_6", "y_0"];
        list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue(), this._area4, this._x4, this.x0_.GetValue(), this._y4, this.y0_.GetValue(), this._area5, this._x5, this.x0_.GetValue(), this._y5, this.y0_.GetValue(), this._area6, this._x6, this.x0_.GetValue(), this._y6, this.y0_.GetValue()];
        list.value = this.inertia23_.GetValue();
        this.inertia23_.equationlist.push(list);
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        //TODO
    };
}; //(x, y, wf, h, tw, tf)

var sectioncircle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "CIRCLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.r = this.section.r.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._r = this.section.r.GetValue();

        this.d = this.r * 2;

        this.totalwidth = this.d;
        this.totalheight = this.d;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0} * 2";
        this.totalwidth_.nameparam = ["R"];
        this.totalwidth_.valueparam = [this._r];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0} * 2";
        this.totalheight_.nameparam = ["R"];
        this.totalheight_.valueparam = [this._r];
    };

    this.CalculateArea = function () {
        this.area = Math.PI * (Math.pow(this.d, 2) / 4);

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "π * {0}^2";
        this.area_.nameparam = ["R"];
        this.area_.valueparam = [this._r];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.d / 2;
        this.y0 = this.d / 2;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{0}";
        this.x0_.nameparam = ["R"];
        this.x0_.valueparam = [this._r];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{0}";
        this.y0_.nameparam = ["R"];
        this.y0_.valueparam = [this._r];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = Math.PI * (Math.pow(this.d, 4)) / 64;    //Inertia I2
        this.inertia33 = Math.PI * (Math.pow(this.d, 4)) / 64;    //Inertia I3
        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{π * {0}^4} / 4";
        this.inertia22_.nameparam = ["R"];
        this.inertia22_.valueparam = [this._r];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{π * {0}^4} / 4";
        this.inertia33_.nameparam = ["R"];
        this.inertia33_.valueparam = [this._r];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateShearArea = function () {
        this.sheararea22 = 0.9 * this.area;            //Shear Area A2
        this.sheararea33 = 0.9 * this.area;         //Shear Area A3

        this.sheararea22_.value = this.sheararea22;
        this.sheararea33_.value = this.sheararea33;

        this.sheararea22_.symbol = "SA_2";
        this.sheararea22_.equation = "0.9 * {0}";
        this.sheararea22_.nameparam = ["A"];
        this.sheararea22_.valueparam = [this.area];

        this.sheararea33_.symbol = "SA_3";
        this.sheararea33_.equation = "0.9 * {0}";
        this.sheararea33_.nameparam = ["A"];
        this.sheararea33_.valueparam = [this.area];
    };

    this.CalculateTorsion = function () {
//        this.torsionalJ = (Math.PI * (Math.pow(this.d, 4))) / 32;
        this.torsionalJ = (Math.PI * (Math.pow(this.r, 4))) / 2;

        this.torsionalJ_.value = this.torsionalJ;

        this.torsionalJ_.symbol = "J";
        this.torsionalJ_.equation = "{π * {0}^4} / 2";
        this.torsionalJ_.nameparam = ["R"];
        this.torsionalJ_.valueparam = [this._r];
    };
}; //(x, y, r)

var sectionhollowcircle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "HOLLOWCIRCLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.r = this.section.r.value;
        this.t = this.section.t.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._r = this.section.r.GetValue();
        this._t = this.section.t.GetValue();

        this.innerd = (this.r - this.t) * 2;

        this.d = this.r * 2;

        this.totalwidth = this.d;
        this.totalheight = this.d;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0} * 2";
        this.totalwidth_.nameparam = ["R"];
        this.totalwidth_.valueparam = [this._r];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0} * 2";
        this.totalheight_.nameparam = ["R"];
        this.totalheight_.valueparam = [this._r];
    };

    this.CalculateArea = function () {
        this.area = Math.PI * (Math.pow(this.d, 2)) / 4 - Math.PI * (Math.pow(this.innerd, 2)) / 4;

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "π * {0}^2 - π * ({0} - {1})^2";
        this.area_.nameparam = ["R", "t"];
        this.area_.valueparam = [this._r, this._t];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.d / 2;
        this.y0 = this.d / 2;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{0}";
        this.x0_.nameparam = ["R"];
        this.x0_.valueparam = [this._r];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{0}";
        this.y0_.nameparam = ["R"];
        this.y0_.valueparam = [this._r];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = Math.PI * (Math.pow(this.d, 4)) / 64 - Math.PI * (Math.pow(this.innerd, 4)) / 64;    //Inertia I2
        this.inertia33 = Math.PI * (Math.pow(this.d, 4)) / 64 - Math.PI * (Math.pow(this.innerd, 4)) / 64;    //Inertia I3
        this.inertia23 = 0;                           //Inertia I23

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{π * {0}^4} / 4 - {π * ({0} - {1})^4} / 4";
        this.inertia22_.nameparam = ["R", "t"];
        this.inertia22_.valueparam = [this._r, this._t];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{π * {0}^4} / 4 - {π * ({0} - {1})^4} / 4";
        this.inertia33_.nameparam = ["R", "t"];
        this.inertia33_.valueparam = [this._r, this._t];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateShearArea = function () {
        //var sheararea2 = 0.9 * (Math.pow(d, 4)) / 4;
        //var sheararea3 = 0.9 * (Math.pow(d, 4)) / 4;
    };

    this.CalculateTorsion = function () {
        this.torsionalJ = (Math.PI * (Math.pow(this.d, 4))) / 32 - (Math.PI * (Math.pow(this.innerd, 4))) / 32;

        this.torsionalJ_.value = this.torsionalJ;

        this.torsionalJ_.symbol = "J";
        this.torsionalJ_.equation = "{π * {0}^4} / 2 - {π * ({0} - {1})^4} / 2";
        this.torsionalJ_.nameparam = ["R", "t"];
        this.torsionalJ_.valueparam = [this._r, this._t];
    };
}; //(x, y, r, innerd)

var sectioncirclesector = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "CIRCLESECTOR";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.r = this.section.r.value;
        this.theta = this.section.a.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._r = this.section.r.GetValue();
        this._theta = this.section.a.GetValue();

        this.alpha = this.theta / 2;
        this.radians = (Math.PI / 180) * this.alpha;  //radians / 2

        if (this.theta >= 180) {
            this.totalwidth = 2 * this.r;
            this.totalheight = this.r - (this.r * Math.cos(this.radians));

            this.totalheight_.equation = "{0} - {0} * Cos({{1}}/2)";
            this.totalwidth_.equation = "2 * {0}";
        } else {
            this.totalwidth = 2 * this.r * Math.sin(this.radians);
            this.totalheight = this.r;

            this.totalheight_.equation = "{0}";
            this.totalwidth_.equation = "2 * {0} * Sin({{1}}/2)";
        }

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.nameparam = ["R", "θ"];
        this.totalwidth_.valueparam = [this._r, this._theta];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.nameparam = ["R", "θ"];
        this.totalheight_.valueparam = [this._r, this._theta];
    };

    this.CalculateArea = function () {
        this.area = Math.PI * Math.pow(this.r, 2) * (this.theta / 360);

        this.area_.value = this.area;

        if (this.theta === 90) {
            this.area_.symbol = "A";
            this.area_.equation = "{π * {0}^2} / 4";
            this.area_.nameparam = ["R"];
            this.area_.valueparam = [this._r];
        } else if (this.theta === 180) {
            this.area_.symbol = "A";
            this.area_.equation = "{π * {0}^2} / 2";
            this.area_.nameparam = ["R"];
            this.area_.valueparam = [this._r];
        } else {
            this.area_.symbol = "A";
            this.area_.equation = "π * {0}^2 * {{{1}} / 360}";
            this.area_.nameparam = ["R", "θ"];
            this.area_.valueparam = [this._r, this._theta];
        }
    };

    this.CalculateCentroid = function () {
        this.x0 = this.r; //As per outer circumferance method
        this.y0 = (2 * this.r * Math.sin(this.radians)) / (3 * (this.radians)) + this.r;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{0}";
        this.x0_.nameparam = ["R"];
        this.x0_.valueparam = [this._r];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{2 * {0} * Sin({{1}} / 2)} / {3({π / 180})({{1}} / 2)} + {0}";
        this.y0_.nameparam = ["R", "θ"];
        this.y0_.valueparam = [this._r, this._theta];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = (Math.pow(this.r, 4) / 4) * (this.radians - 0.5 * Math.sin(2 * this.radians));
        this.inertia33 = (Math.pow(this.r, 4) / 4) * (this.radians + 0.5 * Math.sin(2 * this.radians)) - ((4 / (9 * this.radians)) * Math.pow(this.r, 4) * Math.pow(Math.sin(this.radians), 2));
        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        if (this.theta === 180) {
            this.inertia22_.symbol = "I_{22}";
            this.inertia22_.equation = "(π * {{0}}^4 / 8)";
            this.inertia22_.nameparam = ["R", "θ"];
            this.inertia22_.valueparam = [this._r, this._theta];

            this.inertia33_.symbol = "I_{33}";
            this.inertia33_.equation = "(π * {{0}}^4 / 8) - ({4 * {0}^4} / {9(π / 2)})";
            this.inertia33_.nameparam = ["R", "θ"];
            this.inertia33_.valueparam = [this._r, this._theta];
        } else {
            this.inertia22_.symbol = "I_{22}";
            this.inertia22_.equation = "({{0}}^4 / 4)((π / 180)({{1}} / 2) - {1 / 2}Sin({1}))";
            this.inertia22_.nameparam = ["R", "θ"];
            this.inertia22_.valueparam = [this._r, this._theta];

            this.inertia33_.symbol = "I_{33}";
            this.inertia33_.equation = "({{0}}^4 / 4)((π / 180)({{1}} / 2) + {1 / 2}Sin({1})) - ({4 * {0}^4 * Sin^2({{1}} / 2)} / {9(π / 180)({{1}} / 2)})";
            this.inertia33_.nameparam = ["R", "θ"];
            this.inertia33_.valueparam = [this._r, this._theta];
        }

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateSectionModulus = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        if ((common.IsZero(this.totalwidth)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        this.s2l = Math.abs(this.inertia22 / Math.abs(this.totalwidth / 2));
        this.s2r = Math.abs(this.inertia22 / Math.abs(this.totalwidth / 2));
        this.s3t = Math.abs(this.inertia33 / Math.abs(2 * this.r - this.y0));
        this.s3b = Math.abs(this.inertia33 / Math.abs(this.totalheight - (2 * this.r - this.y0)));

        this.s2l_.value = this.s2l;
        this.s2r_.value = this.s2r;
        this.s3t_.value = this.s3t;
        this.s3b_.value = this.s3b;

        this.s2l_.symbol = "S_{2-Left}";
        this.s2l_.equation = "{{0}} / ({{1}} / 2)";
        this.s2l_.nameparam = ["I_{22}", "W_{total}"];
        this.s2l_.valueparam = [this.inertia22_.GetValue(), this.totalwidth_.GetValue()];

        this.s2r_.symbol = "S_{2-Right}";
        this.s2r_.equation = "{{0}} / ({{1}} / 2)";
        this.s2r_.nameparam = ["I_{22}", "W_{total}"];
        this.s2r_.valueparam = [this.inertia22_.GetValue(), this.totalwidth_.GetValue()];

        this.s3t_.symbol = "S_{3-Top}";
        this.s3t_.equation = "{{0}} / {2 * {1} - {2}}";
        this.s3t_.nameparam = ["I_{33}", "R", "y_0"];
        this.s3t_.valueparam = [this.inertia33_.GetValue(), this._r, this.y0_.GetValue()];

        this.s3b_.symbol = "S_{3-Bottom}";
        this.s3b_.equation = "{{0}} / {{1} - (2 * {2} - {3})}";
        this.s3b_.nameparam = ["I_{33}", "H_{total}", "R", "y_0"];
        this.s3b_.valueparam = [this.inertia33_.GetValue(), this.totalheight_.GetValue(), this._r, this.y0_.GetValue()];
    };

    this.CalculateShearArea = function () {
        //TODO
    };

    this.CalculateTorsion = function () {
        var alpha = this.radians * 2;
        var aspectratio = alpha / Math.PI;

        var C = 0.0034 - 0.0697 * aspectratio + 0.5825 * Math.pow(aspectratio, 2) - 0.295 * Math.pow(aspectratio, 3) + 0.0874 * Math.pow(aspectratio, 4) - 0.0111 * Math.pow(aspectratio, 5);

        this.torsionalJ = C * Math.pow(this.r, 4);

        this.torsionalJ_.value = this.torsionalJ;
        this.torsionalJ_.equationlist = [];

        if (aspectratio >= 0.1 && aspectratio <= 2) {
            var list = new uiframework.PropertyDouble("α", 0, common.unit.angle);
            list.symbol = "α";
            list.equation = "{{({π / 180}){0}} / π}";
            list.nameparam = ["θ"];
            list.valueparam = [this._theta];
            list.value = aspectratio;
            this.torsionalJ_.equationlist.push(list);

            list = new uiframework.PropertyDouble("C", 0, common.unit.unitless);
            list.symbol = "C";
            list.equation = "0.0034 - 0.0697({0}) + 0.5825({0})^2 - 0.295({0})^3 + 0.0874({0})^4 - 0.0111({0})^5";
            list.nameparam = ["α"];
            list.valueparam = [aspectratio];
            list.value = C;
            this.torsionalJ_.equationlist.push(list);

            list = new uiframework.PropertyDouble("J", 0, common.unit.inertia);
            list.symbol = "J";
            list.equation = "{{0} * {1}^4}";
            list.nameparam = ["C", "R"];
            list.valueparam = [C, this._r];
            list.value = this.torsionalJ_.GetValue();
            this.torsionalJ_.equationlist.push(list);
        } else {
            this.torsionalJ_.value = 0;
            this.torsionalJ_.equation = undefined;
        }
    };
}; //(x, y, r, theta)

var sectioncirclearc = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "CIRCLEARC";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.r = this.section.r.value;
        this.t = this.section.t.value;
        this.theta = this.section.a.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._r = this.section.r.GetValue();
        this._t = this.section.t.GetValue();
        this._theta = this.section.a.GetValue();

        this.alpha = this.theta / 2;
        this.radians = (Math.PI / 180) * this.alpha;  //radians / 2

        if (this.theta > 180) {
            this.totalwidth = 2 * this.r;
            this.totalheight = this.r - (this.r * Math.cos(this.radians));

            this.totalwidth_.equation = "2 * {0}";
            this.totalheight_.equation = "{0} - {0} * Cos({{1}}/2)";
        } else {
            this.totalwidth = 2 * this.r * Math.sin(this.radians);
            this.totalheight = (this.r - this.t) - ((this.r - this.t) * Math.cos(this.radians)) + this.t;

            this.totalwidth_.equation = "2 * {0} * Sin({{1}}/2)";
            this.totalheight_.equation = "({0} - {2}) - ({0} - {2}) * Cos({{1}}/2) + {{2}}";
        }

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.nameparam = ["R", "θ"];
        this.totalwidth_.valueparam = [this._r, this._theta];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.nameparam = ["R", "θ", "t"];
        this.totalheight_.valueparam = [this._r, this._theta, this._t];
    };

    this.CalculateArea = function () {
        this.area = (Math.PI * this.theta / 360) * (Math.pow(this.r, 2) - Math.pow(this.r - this.t, 2));

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "({0}^2 - ({1} - {2})^2) * ({{3}}/360)";
        this.area_.nameparam = ["R", "R", "t", "θ"];
        this.area_.valueparam = [this._r, this._r, this._t, this._theta];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.r; //As per outer circumferance method
        this.y0 = ((this.r - this.t / 2) * Math.sin(this.radians) / this.radians) + this.r;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{0}";
        this.x0_.nameparam = ["R"];
        this.x0_.valueparam = [this._r];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{({0} - {1} / 2) * Sin({{2}} / 2)} / {({π / 180})({{2}} / 2)} + {0}";
        this.y0_.nameparam = ["R", "t", "θ"];
        this.y0_.valueparam = [this._r, this._t, this._theta];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = ((Math.pow(this.r, 4) - Math.pow(this.r - this.t, 4)) / 4) * (this.radians - 0.5 * Math.sin(2 * this.radians));

        var temp3a = (1 / (this.radians * (Math.pow(this.r, 2) - Math.pow(this.r - this.t, 2)))) * (Math.pow((2 * Math.sin(this.radians) * (Math.pow(this.r, 3) - Math.pow(this.r - this.t, 3))) / 3, 2));
        this.inertia33 = ((Math.pow(this.r, 4) - Math.pow(this.r - this.t, 4)) / 4) * (this.radians + 0.5 * Math.sin(2 * this.radians)) - temp3a;

        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "({{{0}^4} - {({0} - {1})^4}} / 4)((π / 180)({{2}} / 2) - {1 / 2}Sin({2}))";
        this.inertia22_.nameparam = ["R", "t", "θ"];
        this.inertia22_.valueparam = [this._r, this._t, this._theta];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "({{{0}^4} - {({0} - {1})^4}} / 4)((π / 180)({{2}} / 2) + {1 / 2}Sin({2})) - ({1 / {(π / 180)({{2}} / 2) * ({{{0}^2} - {({0} - {1})^2}})}}({2 * Sin({{2}} / 2)({{{0}^3} - {({0} - {1})^3}})} / 3)^2)";
        this.inertia33_.nameparam = ["R", "t", "θ"];
        this.inertia33_.valueparam = [this._r, this._t, this._theta];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateSectionModulus = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        if ((common.IsZero(this.totalwidth)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        this.s2l = Math.abs(this.inertia22 / Math.abs(this.totalwidth / 2));
        this.s2r = Math.abs(this.inertia22 / Math.abs(this.totalwidth / 2));
        this.s3t = Math.abs(this.inertia33 / Math.abs(2 * this.r - this.y0));
        this.s3b = Math.abs(this.inertia33 / Math.abs(this.totalheight - (2 * this.r - this.y0)));

        this.s2l_.value = this.s2l;
        this.s2r_.value = this.s2r;
        this.s3t_.value = this.s3t;
        this.s3b_.value = this.s3b;

        this.s2l_.symbol = "S_{2-Left}";
        this.s2l_.equation = "{{0}} / ({{1}} / 2)";
        this.s2l_.nameparam = ["I_{22}", "W_{total}"];
        this.s2l_.valueparam = [this.inertia22_.GetValue(), this.totalwidth_.GetValue()];

        this.s2r_.symbol = "S_{2-Right}";
        this.s2r_.equation = "{{0}} / ({{1}} / 2)";
        this.s2r_.nameparam = ["I_{22}", "W_{total}"];
        this.s2r_.valueparam = [this.inertia22_.GetValue(), this.totalwidth_.GetValue()];

        this.s3t_.symbol = "S_{3-Top}";
        this.s3t_.equation = "{{0}} / {2 * {1} - {2}}";
        this.s3t_.nameparam = ["I_{33}", "R", "y_0"];
        this.s3t_.valueparam = [this.inertia33_.GetValue(), this._r, this.y0_.GetValue()];

        this.s3b_.symbol = "S_{3-Bottom}";
        this.s3b_.equation = "{{0}} / {{1} - (2 * {2} - {3})}";
        this.s3b_.nameparam = ["I_{33}", "H_{total}", "R", "y_0"];
        this.s3b_.valueparam = [this.inertia33_.GetValue(), this.totalheight_.GetValue(), this._r, this.y0_.GetValue()];
    };

    this.CalculateShearArea = function () {
        //TODO
    };

    this.CalculateTorsion = function () {
        //TODO
    };
}; //(x, y, r, t, theta)

var sectioncirclesegment = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "CIRCLESEGMENT";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.r = this.section.r.value;
        this.theta = this.section.a.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._r = this.section.r.GetValue();
        this._theta = this.section.a.GetValue();

        this.radians = (Math.PI / 180) * this.theta; //radians

        if (this.theta > 180) {
            this.totalwidth = 2 * this.r;
            this.totalwidth_.equation = "2 * {0}";
        } else {
            this.totalwidth = 2 * this.r * Math.sin(this.radians / 2);
            this.totalwidth_.equation = "2 * {0} * Sin({{1}}/2)";
        }

        this.totalheight = this.r - (this.r * Math.cos(this.radians / 2));

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.nameparam = ["R", "θ"];
        this.totalwidth_.valueparam = [this._r, this._theta];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0} - {0} * Cos({{1}}/2)";
        this.totalheight_.nameparam = ["R", "θ"];
        this.totalheight_.valueparam = [this._r, this._theta];
    };

    this.CalculateArea = function () {
        this.area = (Math.pow(this.r, 2) / 2) * (this.radians - Math.sin(this.radians));

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "({{0}}^2 / 2) * ({π * {1}} / 180 - Sin({1}))";
        this.area_.nameparam = ["R", "θ"];
        this.area_.valueparam = [this._r, this._theta];
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.radians))
            this.CalculateArea();

        this.x0 = this.r;
        this.y0 = (4 * this.r * Math.pow(Math.sin(this.radians / 2), 3)) / (3 * (this.radians - Math.sin(this.radians))) + this.r;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{0}";
        this.x0_.nameparam = ["R"];
        this.x0_.valueparam = [this._r];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{4 * {0} * Sin^3({{1}} / 2)} / {3(({π * {1}} / 180) - Sin({1}))} + {0}";
        this.y0_.nameparam = ["R", "θ"];
        this.y0_.valueparam = [this._r, this._theta];
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.area)) || (common.IsZero(this.radians)))
            this.CalculateArea();

        if (common.IsZero(this.y0))
            this.CalculateCentroid();

        this.inertia22 = (Math.pow(this.r, 4) / 24) * (3 * (this.radians - Math.sin(this.radians)) - 2 * Math.sin(this.radians) * Math.pow(Math.sin(this.radians / 2), 2));
        this.inertia33 = (Math.pow(this.r, 4) / 8) * (this.radians - Math.sin(this.radians) + 2 * Math.sin(this.radians) * Math.pow(Math.sin(this.radians / 2), 2)) - this.area * Math.pow((this.y0 - this.r), 2);
        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "({{0}}^4 / 24)(3({π * {1}} / 180 - Sin({1})) - 2 * Sin({1}) * Sin^2({{1}} / 2))";
        this.inertia22_.nameparam = ["R", "θ"];
        this.inertia22_.valueparam = [this._r, this._theta];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "({{0}}^4 / 8)({π * {1}} / 180 - Sin({1}) + 2 * Sin({1}) * Sin^2({{1}} / 2)) - {2}({3} - {0})^2";
        this.inertia33_.nameparam = ["R", "θ", "A", "y_0"];
        this.inertia33_.valueparam = [this._r, this._theta, this.area_.GetValue(), this.y0_.GetValue()];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateSectionModulus = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        if ((common.IsZero(this.totalwidth)) || (common.IsZero(this.y0)) || (common.IsZero(this.totalheight)))
            this.CalculateCentroid();

        this.s2l = Math.abs(this.inertia22 / Math.abs(this.totalwidth / 2));
        this.s2r = Math.abs(this.inertia22 / Math.abs(this.totalwidth / 2));
        this.s3t = Math.abs(this.inertia33 / Math.abs(2 * this.r - this.y0));
        this.s3b = Math.abs(this.inertia33 / Math.abs(this.totalheight - (2 * this.r - this.y0)));

        this.s2l_.value = this.s2l;
        this.s2r_.value = this.s2r;
        this.s3t_.value = this.s3t;
        this.s3b_.value = this.s3b;

        this.s2l_.symbol = "S_{2-Left}";
        this.s2l_.equation = "{{0}} / ({{1}} / 2)";
        this.s2l_.nameparam = ["I_{22}", "W_{total}"];
        this.s2l_.valueparam = [this.inertia22_.GetValue(), this.totalwidth_.GetValue()];

        this.s2r_.symbol = "S_{2-Right}";
        this.s2r_.equation = "{{0}} / ({{1}} / 2)";
        this.s2r_.nameparam = ["I_{22}", "W_{total}"];
        this.s2r_.valueparam = [this.inertia22_.GetValue(), this.totalwidth_.GetValue()];

        this.s3t_.symbol = "S_{3-Top}";
        this.s3t_.equation = "{{0}} / {2 * {1} - {2}}";
        this.s3t_.nameparam = ["I_{33}", "R", "y_0"];
        this.s3t_.valueparam = [this.inertia33_.GetValue(), this._r, this.y0_.GetValue()];

        this.s3b_.symbol = "S_{3-Bottom}";
        this.s3b_.equation = "{{0}} / {{1} - (2 * {2} - {3})}";
        this.s3b_.nameparam = ["I_{33}", "H_{total}", "R", "y_0"];
        this.s3b_.valueparam = [this.inertia33_.GetValue(), this.totalheight_.GetValue(), this._r, this.y0_.GetValue()];
    };

    this.CalculateShearArea = function () {
        //TODO
    };

    this.CalculateTorsion = function () {
        //TODO
    };
}; //(x, y, r, theta)

var sectionplus = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "PLUS";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.tw = this.section.tw.value;
        this.tf = this.section.tf.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._tw = this.section.tw.GetValue();
        this._tf = this.section.tf.GetValue();

        if (this.section.lf1 !== undefined) {
            this.lf1 = this.section.lf1.value;

            this._lf1 = this.section.lf1.GetValue();
        } else {
            this.lf1 = (this.w - this.tw) / 2;

            this._lf1 = common.Convert(this.lf1, UNITTYPELENGTH.MM, common.unit.length.value);
        }

        if (this.section.lf2 !== undefined) {
            this.lf2 = this.section.lf2.value;
            this.lf3 = this.h - this.lf2 - this.tf;

            this._lf2 = this.section.lf2.GetValue();
            this._lf3 = common.Convert(this.lf3, UNITTYPELENGTH.MM, common.unit.length.value);
        } else {
            this.lf2 = (this.h - this.tf) / 2;
            this.lf3 = this.lf2;

            this._lf2 = common.Convert(this.lf2, UNITTYPELENGTH.MM, common.unit.length.value);
            this._lf3 = this._lf2;
        }

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area1 = this.lf1 * (this.h - this.lf2 - this.lf3);
        this.area2 = this.tw * this.h;
        this.area3 = (this.w - this.lf1 - this.tw) * (this.h - this.lf2 - this.lf3);

        this.area = this.area1 + this.area2 + this.area3;

        this.area_.value = this.area;

        this._area1 = common.Convert(this.area1, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area2 = common.Convert(this.area2, UNITTYPEAREA.SQMM, common.unit.area.value);
        this._area3 = common.Convert(this.area3, UNITTYPEAREA.SQMM, common.unit.area.value);

        if ((this.section.lf1 !== undefined) || (this.section.lf2 !== undefined) || (this.section.lf3 !== undefined)) {
            var list = new uiframework.PropertyDouble("A1", 0, common.unit.area);
            list.symbol = "A_1";
            list.equation = "{0} * {1}";
            list.nameparam = ["l_{f1}", "t_f"];
            list.valueparam = [this._lf1, this._tf];
            list.value = this._area1;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A2", 0, common.unit.area);
            list.symbol = "A_2";
            list.equation = "{0} * {1}";
            list.nameparam = ["h", "t_w"];
            list.valueparam = [this._h, this._tw];
            list.value = this._area2;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A3", 0, common.unit.area);
            list.symbol = "A_3";
            list.equation = "({0} - {1} - {2}) * {3}";
            list.nameparam = ["w", "l_{f1}", "t_w", "t_f"];
            list.valueparam = [this._w, this._lf1, this._tw, this._tf];
            list.value = this._area3;
            this.area_.equationlist.push(list);

            list = new uiframework.PropertyDouble("A", 0, common.unit.area);
            list.symbol = "A";
            list.equation = "{0} + {1} + {2}";
            list.nameparam = ["A_1", "A_2", "A_3"];
            list.valueparam = [this._area1, this._area2, this._area3];
            list.value = this.area_.GetValue();
            this.area_.equationlist.push(list);
        } else {
            this.area_.symbol = "A";
            this.area_.equation = "{0} * {3} + ({1} - {3}) * {2}";
            this.area_.nameparam = ["w", "h", "tw", "tf"];
            this.area_.valueparam = [this._w, this._h, this._tw, this._tf];
        }
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x1 = this.lf1 / 2;
        this.x2 = this.lf1 + this.tw / 2;
        this.x3 = this.lf1 + this.tw + (this.w - this.lf1 - this.tw) / 2;

        this.y1 = this.lf3 + (this.h - this.lf2 - this.lf3) / 2;
        this.y2 = this.h / 2;
        this.y3 = this.lf3 + (this.h - this.lf2 - this.lf3) / 2;

        this.x0 = (this.area1 * this.x1 + this.area2 * this.x2 + this.area3 * this.x3) / this.area;
        this.y0 = (this.area1 * this.y1 + this.area2 * this.y2 + this.area3 * this.y3) / this.area;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.equationlist = [];
        this.y0_.equationlist = [];

        this._x1 = common.Convert(this.x1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x2 = common.Convert(this.x2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._x3 = common.Convert(this.x3, UNITTYPELENGTH.MM, common.unit.length.value);

        this._y1 = common.Convert(this.y1, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y2 = common.Convert(this.y2, UNITTYPELENGTH.MM, common.unit.length.value);
        this._y3 = common.Convert(this.y3, UNITTYPELENGTH.MM, common.unit.length.value);

        if ((this.section.lf1 !== undefined) || (this.section.lf2 !== undefined) || (this.section.lf3 !== undefined)) {
            var list = new uiframework.PropertyDouble("x1", 0, common.unit.length);
            list.symbol = "x_1";
            list.equation = "{{0}} / 2";
            list.nameparam = ["l_{f1}"];
            list.valueparam = [this._lf1];
            list.value = this._x1;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x2", 0, common.unit.length);
            list.symbol = "x_2";
            list.equation = "{0} + {{1}} / 2";
            list.nameparam = ["l_{f1}", "t_w"];
            list.valueparam = [this._lf1, this._tw];
            list.value = this._x2;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x3", 0, common.unit.length);
            list.symbol = "x_3";
            list.equation = "{{2} + {0} + {1}} / 2";
            list.nameparam = ["l_{f1}", "t_w", "w"];
            list.valueparam = [this._lf1, this._tw, this._w];
            list.value = this._x3;
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("x0", 0, common.unit.length);
            list.symbol = "x_0";
            list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
            list.nameparam = ["A_1", "x_1", "A_2", "x_2", "A_3", "x_3", "A"];
            list.valueparam = [this._area1, this._x1, this._area2, this._x2, this._area3, this._x3, this.area_.GetValue()];
            list.value = this.x0_.GetValue();
            this.x0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y1", 0, common.unit.length);
            list.symbol = "y_1";
            list.equation = "{0} - {1} - {{2}} / 2";
            list.nameparam = ["h", "l_{f2}", "t_f"];
            list.valueparam = [this._h, this._lf2, this._tf];
            list.value = this._y1;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y2", 0, common.unit.length);
            list.symbol = "y_2";
            list.equation = "{{0}} / 2";
            list.nameparam = ["h"];
            list.valueparam = [this._h];
            list.value = this._y2;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y3", 0, common.unit.length);
            list.symbol = "y_3";
            list.equation = "{0} - {1} - {{2}} / 2";
            list.nameparam = ["h", "l_{f2}", "t_f"];
            list.valueparam = [this._h, this._lf2, this._tf];
            list.value = this._y3;
            this.y0_.equationlist.push(list);

            list = new uiframework.PropertyDouble("y0", 0, common.unit.length);
            list.symbol = "y_0";
            list.equation = "{{0} * {1} + {2} * {3} + {4} * {5}} / {{6}}";
            list.nameparam = ["A_1", "y_1", "A_2", "y_2", "A_3", "y_3", "A"];
            list.valueparam = [this._area1, this._y1, this._area2, this._y2, this._area3, this._y3, this.area_.GetValue()];
            list.value = this.y0_.GetValue();
            this.y0_.equationlist.push(list);
        } else {
            this.x0_.symbol = "x_0";
            this.x0_.equation = "{{0}} / 2";
            this.x0_.nameparam = ["w"];
            this.x0_.valueparam = [this._w];

            this.y0_.symbol = "y_0";
            this.y0_.equation = "{{0}} / 2";
            this.y0_.nameparam = ["h"];
            this.y0_.valueparam = [this._h];
        }
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        var temp2a = (this.h - this.lf2 - this.lf3) * Math.pow(this.lf1, 3) / 12 + this.area1 * Math.pow(this.x0 - this.x1, 2);
        var temp2b = this.h * Math.pow(this.tw, 3) / 12 + this.area2 * Math.pow(this.x0 - this.x2, 2);
        var temp2c = (this.h - this.lf2 - this.lf3) * Math.pow(this.w - this.lf1 - this.tw, 3) / 12 + this.area3 * Math.pow(this.x0 - this.x3, 2);

        var temp3a = this.lf1 * Math.pow(this.h - this.lf2 - this.lf3, 3) / 12 + this.area1 * Math.pow(this.y0 - this.y1, 2);
        var temp3b = this.tw * Math.pow(this.h, 3) / 12 + this.area2 * Math.pow(this.y0 - this.y2, 2);
        var temp3c = (this.w - this.lf1 - this.tw) * Math.pow(this.h - this.lf2 - this.lf3, 3) / 12 + this.area3 * Math.pow(this.y0 - this.y3, 2);

        this.inertia22 = temp2a + temp2b + temp2c;
        this.inertia33 = temp3a + temp3b + temp3c;
        this.inertia23 = this.area1 * (this.x1 - this.x0) * (this.y1 - this.y0) + this.area2 * (this.x2 - this.x0) * (this.y2 - this.y0) + this.area3 * (this.x3 - this.x0) * (this.y3 - this.y0);                           //Inertia I23

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        temp2a = common.Convert(temp2a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2b = common.Convert(temp2b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp2c = common.Convert(temp2c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        temp3a = common.Convert(temp3a, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3b = common.Convert(temp3b, UNITTYPEINERTIA.MM, common.unit.inertia.value);
        temp3c = common.Convert(temp3c, UNITTYPEINERTIA.MM, common.unit.inertia.value);

        if ((this.section.lf1 !== undefined) || (this.section.lf2 !== undefined) || (this.section.lf3 !== undefined)) {
            var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
            list.symbol = "I_{2a}";
            list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
            list.nameparam = ["t_f", "l_{f1}", "A_1", "x_0", "x_1"];
            list.valueparam = [this._tf, this._lf1, this._area1, this.x0_.GetValue(), this._x1];
            list.value = temp2a;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
            list.symbol = "I_{2b}";
            list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
            list.nameparam = ["h", "t_w", "A_2", "x_0", "x_2"];
            list.valueparam = [this._h, this._tw, this._area2, this.x0_.GetValue(), this._x2];
            list.value = temp2b;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
            list.symbol = "I_{2c}";
            list.equation = "{{0} * ({1} - {2} - {3})^3} / 12 + {4} * ({5} - {6})^2";
            list.nameparam = ["t_f", "w", "l_{f1}", "t_w", "A_3", "x_0", "x_3"];
            list.valueparam = [this._tf, this._w, this._lf1, this._tw, this._area3, this.x0_.GetValue(), this._x3];
            list.value = temp2c;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
            list.symbol = "I_{22}";
            list.equation = "{0} + {1} + {2}";
            list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}"];
            list.valueparam = [temp2a, temp2b, temp2c];
            list.value = this.inertia22_.GetValue();
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
            list.symbol = "I_{3a}";
            list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
            list.nameparam = ["l_{f1}", "t_f", "A_1", "y_0", "y_1"];
            list.valueparam = [this._lf1, this._tf, this._area1, this.y0_.GetValue(), this._y1];
            list.value = temp3a;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
            list.symbol = "I_{3b}";
            list.equation = "{{0} * {1}^3} / 12 + {2} * ({3} - {4})^2";
            list.nameparam = ["t_w", "h", "A_2", "y_0", "y_2"];
            list.valueparam = [this._tw, this._h, this._area2, this.y0_.GetValue(), this._y2];
            list.value = temp3b;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
            list.symbol = "I_{3c}";
            list.equation = "{({0} - {1} - {2}) * {3}^3} / 12 + {4} * ({5} - {6})^2";
            list.nameparam = ["w", "l_{f1}", "t_w", "t_f", "A_3", "y_0", "y_3"];
            list.valueparam = [this._w, this._lf1, this._tw, this._tf, this._area3, this.y0_.GetValue(), this._y3];
            list.value = temp3c;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
            list.symbol = "I_{33}";
            list.equation = "{0} + {1} + {2}";
            list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}"];
            list.valueparam = [temp3a, temp3b, temp3c];
            list.value = this.inertia33_.GetValue();
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
            list.symbol = "I_{23}";
            list.equation = "{0}({1} - {2})({3} - {4}) + {5}({6} - {7})({8} - {9}) + {10}({11} - {12})({13} - {14})";
            list.nameparam = ["A_1", "x_1", "x_0", "y_1", "y_0", "A_2", "x_2", "x_0", "y_2", "y_0", "A_3", "x_3", "x_0", "y_3", "y_0"];
            list.valueparam = [this._area1, this._x1, this.x0_.GetValue(), this._y1, this.y0_.GetValue(), this._area2, this._x2, this.x0_.GetValue(), this._y2, this.y0_.GetValue(), this._area3, this._x3, this.x0_.GetValue(), this._y3, this.y0_.GetValue()];
            list.value = this.inertia23_.GetValue();
            this.inertia23_.equationlist.push(list);
        } else {
            var list = new uiframework.PropertyDouble("temp2a", 0, common.unit.inertia);
            list.symbol = "I_{2a}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["t_f", "w"];
            list.valueparam = [this._tf, this._w];
            list.value = this._tf * Math.pow(this._w, 3) / 12;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2b", 0, common.unit.inertia);
            list.symbol = "I_{2b}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["h", "t_w"];
            list.valueparam = [this._h, this._tw];
            list.value = this._h * Math.pow(this._tw, 3) / 12;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp2c", 0, common.unit.inertia);
            list.symbol = "I_{2c}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["t_f", "t_w"];
            list.valueparam = [this._tf, this._tw];
            list.value = this._tf * Math.pow(this._tw, 3) / 12;
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I22", 0, common.unit.inertia);
            list.symbol = "I_{22}";
            list.equation = "{0} + {1} - {2}";
            list.nameparam = ["I_{2a}", "I_{2b}", "I_{2c}"];
            list.valueparam = [this._tf * Math.pow(this._w, 3) / 12, this._h * Math.pow(this._tw, 3) / 12, this._tf * Math.pow(this._tw, 3) / 12];
            list.value = this.inertia22_.GetValue();
            this.inertia22_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3a", 0, common.unit.inertia);
            list.symbol = "I_{3a}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["w", "t_f"];
            list.valueparam = [this._w, this._tf];
            list.value = this._w * Math.pow(this._tf, 3) / 12;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3b", 0, common.unit.inertia);
            list.symbol = "I_{3b}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["t_w", "h"];
            list.valueparam = [this._tw, this._h];
            list.value = this._tw * Math.pow(this._h, 3) / 12;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("temp3c", 0, common.unit.inertia);
            list.symbol = "I_{3c}";
            list.equation = "{{0} * {1}^3} / 12";
            list.nameparam = ["t_w", "t_f"];
            list.valueparam = [this._tw, this._tf];
            list.value = this._tw * Math.pow(this._tf, 3) / 12;
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I33", 0, common.unit.inertia);
            list.symbol = "I_{33}";
            list.equation = "{0} + {1} - {2}";
            list.nameparam = ["I_{3a}", "I_{3b}", "I_{3c}"];
            list.valueparam = [this._w * Math.pow(this._tf, 3) / 12, this._tw * Math.pow(this._h, 3) / 12, this._tw * Math.pow(this._tf, 3) / 12];
            list.value = this.inertia33_.GetValue();
            this.inertia33_.equationlist.push(list);

            list = new uiframework.PropertyDouble("I23", 0, common.unit.inertia);
            list.symbol = "I_{23}";
            list.equation = "{0}";
            list.nameparam = ["I_23"];
            list.valueparam = [this.inertia23_.GetValue()];
            list.value = this.inertia23_.GetValue();
            this.inertia23_.equationlist.push(list);
        }
    };

    this.CalculateShearArea = function () {
        //TODO
    };

    this.CalculateTorsion = function () {
        //TODO
    };
}; //(x, y, w, h, tw, lf1, lf2, lf3)

var sectionregularpolygon = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "REGULARPOLYGON";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.r = this.section.r.value;
        this.n = this.section.n.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._r = this.section.r.GetValue();
        this._n = this.section.n.GetValue();

        this.d = this.r * 2;

        this.alpha = 0.5 * (Math.PI - (2 * Math.PI / this.n) * (this.n / 2 - 1));
        this.theta = 0.5 * (Math.PI - (2 * Math.PI / this.n) * Math.floor(this.n / 2));

        this.radians = (Math.PI / 180) * this.alpha;  //radians / 2

        this.alphaDegrees = this.alpha * (180 / Math.PI);
        this.thetaDegrees = this.theta * (180 / Math.PI);

        if (this.n % 2 !== 0) {
            //OddPolygon(polygon, r, sides, inertia2, interia3, alpha);
            this.totalwidth = this.d * Math.cos(this.theta);
            this.totalheight = this.d / 2 + (this.d / 2) * Math.cos(this.alpha);

            this.totalwidth_.equation = "2 * {0} * Cos({2})";
            this.totalheight_.equation = "{0} + {0} * Cos({1})";
        } else if (this.n % 4 === 0) {
            //EvenPolygon_Type2(polygon, r, inertia2, inertia3); //Sides with 8,12,16,20,...,n+4
            this.totalwidth = this.d;
            this.totalheight = this.d;

            this.totalwidth_.equation = "{0}";
            this.totalheight_.equation = "{0}";
        } else {
            //EvenPolygon_Type1(polygon, r, inertia2, interia3, alpha); //Sides with 6,10,14,18,...,n+4
            this.totalwidth = this.d * Math.cos(this.alpha);
            this.totalheight = this.d;

            this.totalwidth_.equation = "2 * {0} * Cos({1})";
            this.totalheight_.equation = "{0}";
        }

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.nameparam = ["R", "θ", "α"];
        this.totalwidth_.valueparam = [this._r, this.alphaDegrees, this.thetaDegrees];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.nameparam = ["R", "θ"];
        this.totalheight_.valueparam = [this._r, this.alphaDegrees];
    };

    this.CalculateArea = function () {
        this.area = (0.5) * (this.n) * (Math.pow(this.d / 2, 2)) * (Math.sin((2 * Math.PI) / this.n));

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "{1 / 2} * {1} * {0}^2 *  Sin({2π} / {{1}})";
        this.area_.nameparam = ["R", "n"];
        this.area_.valueparam = [this._r, this.n];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.d / 2;
        this.y0 = this.d / 2;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{0}";
        this.x0_.nameparam = ["R"];
        this.x0_.valueparam = [this._r];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{0}";
        this.y0_.nameparam = ["R"];
        this.y0_.valueparam = [this._r];
    };

    this.CalculateMomentofInertia = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        //this.inertia22.value = (1 / 48d) * this.area.value * (12 * Math.pow(this.r, 2) + Math.pow(2 * this.r * Math.sin(Math.PI / this.n), 2));
        this.inertia22 = (1 / 24) * this.area * (6 * Math.pow(this.d / 2, 2) - Math.pow(2 * (this.d / 2) * Math.sin(Math.PI / this.n), 2));
        this.inertia33 = (1 / 24) * this.area * (6 * Math.pow(this.d / 2, 2) - Math.pow(2 * (this.d / 2) * Math.sin(Math.PI / this.n), 2));
        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{{{0}} / 24}[6 * {1}^2 - (2 * {1} * Sin(π / {{2}}))^2]";
        this.inertia22_.nameparam = ["A", "R", "n"];
        this.inertia22_.valueparam = [this.area_.GetValue(), this._r, this.n];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{{{0}} / 24}[6 * {1}^2 - (2 * {1} * Sin(π / {{2}}))^2]";
        this.inertia33_.nameparam = ["A", "R", "n"];
        this.inertia33_.valueparam = [this.area_.GetValue(), this._r, this.n];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateSectionModulus = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        this.s3t = this.inertia33 / (this.d / 2);

        this.s3t_.symbol = "S_{3-Top}";
        this.s3t_.equation = "{{0}} / {{1}}";
        this.s3t_.nameparam = ["I_{33}", "R"];
        this.s3t_.valueparam = [this.inertia33_.GetValue(), this._r];

        if (this.n % 2 !== 0) {
            //OddPolygon(polygon, r, sides, inertia2, interia3, alpha);
            this.s2l = this.inertia22 / ((this.d / 2) * Math.cos(this.theta));
            this.s2r = this.inertia22 / ((this.d / 2) * Math.cos(this.theta));
            this.s3b = this.inertia33 / ((this.d / 2) * Math.cos(this.alpha));

            this.s2l_.symbol = "S_{2-Left}";
            this.s2l_.equation = "{{0}} / {{1} * Cos({2})}";
            this.s2l_.nameparam = ["I_{22}", "R", "α"];
            this.s2l_.valueparam = [this.inertia22_.GetValue(), this._r, this.thetaDegrees];

            this.s2r_.symbol = "S_{2-Right}";
            this.s2r_.equation = "{{0}} / {{1} * Cos({2})}";
            this.s2r_.nameparam = ["I_{22}", "R", "α"];
            this.s2r_.valueparam = [this.inertia22_.GetValue(), this._r, this.thetaDegrees];

            this.s3b_.symbol = "S_{3-Bottom}";
            this.s3b_.equation = "{{0}} / {{1} * Cos({2})}";
            this.s3b_.nameparam = ["I_{33}", "R", "θ"];
            this.s3b_.valueparam = [this.inertia33_.GetValue(), this._r, this.alphaDegrees];
        } else if (this.n % 4 === 0) {
            //EvenPolygon_Type2(polygon, r, inertia2, inertia3); //Sides with 8,12,16,20,...,n+4
            this.s2l = this.inertia22 / (this.d / 2);
            this.s2r = this.inertia22 / (this.d / 2);
            this.s3b = this.inertia33 / (this.d / 2);

            this.s2l_.symbol = "S_{2-Left}";
            this.s2l_.equation = "{{0}} / {{1}}";
            this.s2l_.nameparam = ["I_{22}", "R"];
            this.s2l_.valueparam = [this.inertia22_.GetValue(), this._r];

            this.s2r_.symbol = "S_{2-Right}";
            this.s2r_.equation = "{{0}} / {{1}}";
            this.s2r_.nameparam = ["I_{22}", "R"];
            this.s2r_.valueparam = [this.inertia22_.GetValue(), this._r];

            this.s3b_.symbol = "S_{3-Bottom}";
            this.s3b_.equation = "{{0}} / {{1}}";
            this.s3b_.nameparam = ["I_{33}", "R"];
            this.s3b_.valueparam = [this.inertia33_.GetValue(), this._r];
        } else {
            //EvenPolygon_Type1(polygon, r, inertia2, interia3, alpha); //Sides with 6,10,14,18,...,n+4
            this.s2l = this.inertia22 / ((this.d / 2) * Math.cos(this.alpha));
            this.s2r = this.inertia22 / ((this.d / 2) * Math.cos(this.alpha));
            this.s3b = this.inertia33 / (this.d / 2);

            this.s2l_.symbol = "S_{2-Left}";
            this.s2l_.equation = "{{0}} / {{1} * Cos({2})}";
            this.s2l_.nameparam = ["I_{22}", "R", "θ"];
            this.s2l_.valueparam = [this.inertia22_.GetValue(), this._r, this.alphaDegrees];

            this.s2r_.symbol = "S_{2-Right}";
            this.s2r_.equation = "{{0}} / {{1} * Cos({2})}";
            this.s2r_.nameparam = ["I_{22}", "R", "θ"];
            this.s2r_.valueparam = [this.inertia22_.GetValue(), this._r, this.alphaDegrees];

            this.s3b_.symbol = "S_{3-Bottom}";
            this.s3b_.equation = "{{0}} / {{1}}";
            this.s3b_.nameparam = ["I_{33}", "R"];
            this.s3b_.valueparam = [this.inertia33_.GetValue(), this._r];
        }

        this.s2l_.value = this.s2l;
        this.s2r_.value = this.s2r;
        this.s3t_.value = this.s3t;
        this.s3b_.value = this.s3b;
    };

    this.CalculateShearArea = function () {
        //TODO
    };

    this.CalculateTorsion = function () {
        //TODO
    };
}; //(x, y, r, n)

var sectionrectangle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "RECTANGLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area = this.w * this.h;
        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "{0} * {1}";
        this.area_.nameparam = ["w", "h"];
        this.area_.valueparam = [this._w, this._h];
    };

    this.CalculateShearArea = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.sheararea22 = 5 * this.area / 6;
        this.sheararea33 = 5 * this.area / 6;

        this.sheararea22_.value = this.sheararea22;
        this.sheararea33_.value = this.sheararea33;

        this.sheararea22_.symbol = "SA_2";
        this.sheararea22_.equation = "(5/6) * {0}";
        this.sheararea22_.nameparam = ["A"];
        this.sheararea22_.valueparam = [this.area_.GetValue()];

        this.sheararea33_.symbol = "SA_3";
        this.sheararea33_.equation = "(5/6) * {0}";
        this.sheararea33_.nameparam = ["A"];
        this.sheararea33_.valueparam = [this.area_.GetValue()];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = (this.h * Math.pow(this.w, 3)) / 12;
        this.inertia33 = (this.w * Math.pow(this.h, 3)) / 12;
        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_22";
        this.inertia22_.equation = "{{0} * {1}^3} / 12";
        this.inertia22_.nameparam = ["h", "w"];
        this.inertia22_.valueparam = [this._h, this._w];

        this.inertia33_.symbol = "I_33";
        this.inertia33_.equation = "{{1} * {0}^3} / 12";
        this.inertia33_.nameparam = ["h", "w"];
        this.inertia33_.valueparam = [this._h, this._w];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateTorsion = function () {
        var a = 0;
        var b = 0;

        if (this.w > this.h) {
            a = this.w / 2;
            b = this.h / 2;
        } else {
            a = this.h / 2;
            b = this.w / 2;
        }

        this.torsionalJ = (a * Math.pow(b, 3)) * (16 / 3.0 - 3.36 * (b / a) * (1 - (Math.pow(b, 4) / (12 * Math.pow(a, 4)))));

        this.torsionalJ_.value = this.torsionalJ;

        this.torsionalJ_.symbol = "J";
        this.torsionalJ_.equation = "{0} * {1}^3 [1/3 - 0.21 ({{1}}/{{0}}) (1 - {{{1}}^4 / {12 * {0}^4}})]";
        this.torsionalJ_.nameparam = ["h", "w"];
        this.torsionalJ_.valueparam = [this._h, this._w];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.w / 2;
        this.y0 = this.h / 2;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{{0}} / 2";
        this.x0_.nameparam = ["w"];
        this.x0_.valueparam = [this._w];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{{0}} / 2";
        this.y0_.nameparam = ["h"];
        this.y0_.valueparam = [this._h];
    };
}; //(x, y, w, h)

var sectiontriangle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "TRIANGLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area = (this.w * this.h) / 2;

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "{1 / 2} * {0} * {1}";
        this.area_.nameparam = ["w", "h"];
        this.area_.valueparam = [this._w, this._h];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.w / 2;
        this.y0 = this.h / 3;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{{0}} / 2";
        this.x0_.nameparam = ["w"];
        this.x0_.valueparam = [this._w];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{{0}} / 3";
        this.y0_.nameparam = ["h"];
        this.y0_.valueparam = [this._h];
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        if (common.IsZero(this.area))
            this.CalculateArea();

        this.inertia22 = ((this.h * Math.pow(this.w, 3)) + (this.h * (this.w / 2) * Math.pow(this.w, 2)) + (this.h * Math.pow(this.w / 2, 2) * this.w)) / 12 - this.area * Math.pow(this.x0, 2);
        this.inertia33 = (this.w * Math.pow(this.h, 3)) / 36;
        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{{1} * {0}^3} / 36";
        this.inertia22_.nameparam = ["w", "h"];
        this.inertia22_.valueparam = [this._w, this._h];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{{0} * {1}^3} / 36";
        this.inertia33_.nameparam = ["w", "h"];
        this.inertia33_.valueparam = [this._w, this._h];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        var a = this.w;
        var b = this.h;
        var aspectratio = a / b;

        if (aspectratio > (2 / 3) && aspectratio <= Math.sqrt(3)) {
            this.torsionalJ = (Math.pow(a, 3) * Math.pow(b, 3)) / ((15 * Math.pow(a, 2)) + (20 * Math.pow(b, 2)));
            this.torsionalJ_.equation = "{{0}^3 * {1}^3} / {15{0}^2 + 20{1}^2}";
        } else if (aspectratio > Math.sqrt(3) && aspectratio < 2 * Math.sqrt(3)) {
            this.torsionalJ = 0.0915 * Math.pow(b, 4) * (aspectratio - 0.8592);
            this.torsionalJ_.equation = "0.0915 * {1}^4({{0} / {1}} - 0.8592)";
        } else {
            this.torsionalJ_.value = 0;
            this.torsionalJ_.equation = undefined;
        }

        if ((aspectratio > (2 / 3) && aspectratio <= Math.sqrt(3)) || (aspectratio > Math.sqrt(3) && aspectratio < 2 * Math.sqrt(3))) {
            this.torsionalJ_.value = this.torsionalJ;
            this.torsionalJ_.symbol = "J";
            this.torsionalJ_.nameparam = ["a", "b"];
            this.torsionalJ_.valueparam = [this._w, this._h];
        }
    };
}; //(x, y, w, h)

var sectionequitriangle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "EQUITRIANGLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.alength = this.section.alength.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._alength = this.section.alength.GetValue();

        this.theta = (Math.PI / 180) * 60;
        this.w = this.alength;
        this.h = Math.sin(this.theta) * this.alength;

        this._w = common.Convert(this.w, UNITTYPELENGTH.MM, common.unit.length.value);
        this._h = common.Convert(this.h, UNITTYPELENGTH.MM, common.unit.length.value);

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area = (this.w * this.h) / 2;

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "{1 / 2} * {0} * {1}";
        this.area_.nameparam = ["w", "h"];
        this.area_.valueparam = [this._w, this._h];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.w / 2;
        this.y0 = this.h / 3;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{{0}} / 2";
        this.x0_.nameparam = ["w"];
        this.x0_.valueparam = [this._w];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{{0}} / 3";
        this.y0_.nameparam = ["h"];
        this.y0_.valueparam = [this._h];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = ((this.h * Math.pow(this.w, 3)) - (this.h * (this.w / 2) * Math.pow(this.w, 2)) + (this.h * Math.pow(this.w / 2, 2) * this.w)) / 36;
        this.inertia33 = (this.w * Math.pow(this.h, 3)) / 36;
        this.inertia23 = 0;

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{{1} * {0}^3 - {1} * {{{0}} / 2} * {0}^2 + {1} * ({{0}} / 2)^2 * {0}} / 36";
        this.inertia22_.nameparam = ["w", "h"];
        this.inertia22_.valueparam = [this._w, this._h];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{{0} * {1}^3} / 36";
        this.inertia33_.nameparam = ["w", "h"];
        this.inertia33_.valueparam = [this._w, this._h];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        this.torsionalJ = 0.0216506350946 * Math.pow(this.alength, 4);

        this.torsionalJ_.value = this.torsionalJ;

        this.torsionalJ_.symbol = "J";
        this.torsionalJ_.equation = "{{0}^4 {√3}} / 80";
        this.torsionalJ_.nameparam = ["a"];
        this.torsionalJ_.valueparam = [this._alength];
    };
}; //(x, y, a)

var sectionrighttriangle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "RIGHTTRIANGLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area = (this.w * this.h) / 2;

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "{1 / 2} * {0} * {1}";
        this.area_.nameparam = ["w", "h"];
        this.area_.valueparam = [this._w, this._h];
    };

    this.CalculateCentroid = function () {
        this.x0 = this.w / 3;
        this.y0 = this.h / 3;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{{0}} / 3";
        this.x0_.nameparam = ["w"];
        this.x0_.valueparam = [this._w];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{{0}} / 3";
        this.y0_.nameparam = ["h"];
        this.y0_.valueparam = [this._h];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = (Math.pow(this.w, 3) * this.h) / 36;
        this.inertia33 = (this.w * Math.pow(this.h, 3)) / 36;
        this.inertia23 = (-1 / 72) * (Math.pow(this.w, 2) * Math.pow(this.h, 2));

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{{1} * {0}^3} / 36";
        this.inertia22_.nameparam = ["w", "h"];
        this.inertia22_.valueparam = [this._w, this._h];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{{0} * {1}^3} / 36";
        this.inertia33_.nameparam = ["w", "h"];
        this.inertia33_.valueparam = [this._w, this._h];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "-(1 / 72)({0}^2 * {1}^2)";
        this.inertia23_.nameparam = ["w", "h"];
        this.inertia23_.valueparam = [this._w, this._h];
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        var a = this.w;
        var b = this.h;
        var aspectratio = a / b;

        if (aspectratio > (2 / 3) && aspectratio <= Math.sqrt(3)) {
            this.torsionalJ = (Math.pow(a, 3) * Math.pow(b, 3)) / ((15 * Math.pow(a, 2)) + (20 * Math.pow(b, 2)));
            this.torsionalJ_.equation = "{{0}^3 * {1}^3} / {15{0}^2 + 20{1}^2}";
        } else if (aspectratio > Math.sqrt(3) && aspectratio < 2 * Math.sqrt(3)) {
            this.torsionalJ = 0.0915 * Math.pow(b, 4) * (aspectratio - 0.8592);
            this.torsionalJ_.equation = "0.0915 * {1}^4({{0} / {1}} - 0.8592)";
        } else {
            this.torsionalJ_.value = 0;
            this.torsionalJ_.equation = undefined;
        }

        if ((aspectratio > (2 / 3) && aspectratio <= Math.sqrt(3)) || (aspectratio > Math.sqrt(3) && aspectratio < 2 * Math.sqrt(3))) {
            this.torsionalJ_.value = this.torsionalJ;
            this.torsionalJ_.symbol = "J";
            this.torsionalJ_.nameparam = ["a", "b"];
            this.torsionalJ_.valueparam = [this._w, this._h];
        }
    };
}; //(x, y, w, h)

var sectionUtriangle = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "UTRIANGLE";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.w = this.section.w.value;
        this.h = this.section.h.value;
        this.aoffset = this.section.aoffset.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._w = this.section.w.GetValue();
        this._h = this.section.h.GetValue();
        this._aoffset = this.section.aoffset.GetValue();

        this.totalwidth = this.w;
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";
        this.totalwidth_.nameparam = ["w"];
        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area = (this.w * this.h) / 2;

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "{1 / 2} * {0} * {1}";
        this.area_.nameparam = ["w", "h"];
        this.area_.valueparam = [this._w, this._h];
    };

    this.CalculateCentroid = function () {
        this.x0 = (this.aoffset + this.w) / 3;
        this.y0 = this.h / 3;

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{{0} + {1}} / 3";
        this.x0_.nameparam = ["a", "w"];
        this.x0_.valueparam = [this._aoffset, this._w];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{{0}} / 3";
        this.y0_.nameparam = ["h"];
        this.y0_.valueparam = [this._h];
    };

    this.CalculateMomentofInertia = function () {
        this.inertia22 = ((this.h * Math.pow(this.w, 3)) - (this.h * (this.aoffset) * Math.pow(this.w, 2)) + (this.h * Math.pow(this.aoffset, 2) * this.w)) / 36;
        this.inertia33 = (this.w * Math.pow(this.h, 3)) / 36;
        this.inertia23 = (1 / 72) * (this.w * Math.pow(this.h, 2)) * (2 * this.aoffset - this.w);

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{{1} * {0}^3 - {1} * {2} * {0}^2 + {1} * {2}^2 * {0}} / 36";
        this.inertia22_.nameparam = ["w", "h", "a"];
        this.inertia22_.valueparam = [this._w, this._h, this._aoffset];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{{0} * {1}^3} / 36";
        this.inertia33_.nameparam = ["w", "h"];
        this.inertia33_.valueparam = [this._w, this._h];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "(1 / 72)({0} * {1}^2)(2 * {2} - {0})";
        this.inertia23_.nameparam = ["w", "h", "a"];
        this.inertia23_.valueparam = [this._w, this._h, this._aoffset];
    };

    this.CalculateShearArea = function () {
    };

    this.CalculateTorsion = function () {
        //TODO
    };

    this.CalculatePrincipalProperties = function () {
        if ((common.IsZero(this.inertia22)) || (common.IsZero(this.inertia33)))
            this.CalculateMomentofInertia();

        if (this.inertia22 >= this.inertia33)
            this.ang = ((1 / 2) * Math.atan(-(2 * this.inertia23) / (this.inertia22 - this.inertia33))) * (180 / Math.PI) + 90;
        else
            this.ang = ((1 / 2) * Math.atan(-(2 * this.inertia23) / (this.inertia22 - this.inertia33))) * (180 / Math.PI);

        this.ip1 = (this.inertia33 + this.inertia22) / 2 + Math.sqrt((Math.pow((this.inertia22 - this.inertia33) / 2, 2)) + Math.pow(this.inertia23, 2));
        this.ip2 = (this.inertia33 + this.inertia22) / 2 - Math.sqrt((Math.pow((this.inertia22 - this.inertia33) / 2, 2)) + Math.pow(this.inertia23, 2));

        this.ang_.value = this.ang;
        this.ip1_.value = this.ip1;
        this.ip2_.value = this.ip2;

        this.ang_.symbol = "θ";

        if (this.inertia22 >= this.inertia33)
            this.ang_.equation = "{1 / 2} {tan^(-1)({-2*{0}}/{{2}-{1}})} + 90°";
        else
            this.ang_.equation = "{1 / 2} {tan^(-1)({-2*{0}}/{{2}-{1}})}";

        this.ang_.nameparam = ["I_23", "I_33", "I_22"];
        this.ang_.valueparam = [this.inertia23_.GetValue(), this.inertia33_.GetValue(), this.inertia22_.GetValue()];

        this.ip1_.symbol = "I_{p1}";
        this.ip1_.equation = "{{0} + {1}}/2 + √{({{0}-{1}}/2)^2 + {2}^2}";
        this.ip1_.nameparam = ["I_33", "I_22", "I_23"];
        this.ip1_.valueparam = [this.inertia23_.GetValue(), this.inertia33_.GetValue(), this.inertia22_.GetValue()];

        this.ip2_.symbol = "I_{p2}";
        this.ip2_.equation = "{{0} + {1}}/2 - √{({{0}-{1}}/2)^2 + {2}^2}";
        this.ip2_.nameparam = ["I_33", "I_22", "I_23"];
        this.ip2_.valueparam = [this.inertia23_.GetValue(), this.inertia33_.GetValue(), this.inertia22_.GetValue()];
    };
}; //(x, y, w, h)

var sectiontrapezoid = function (section) {
    sectionproperties.call(this);

    this.section = section;
    this.id = "TRAPEZOID";

    this.UpdateDimension = function () {
        this.x = this.section.x.value;
        this.y = this.section.y.value;
        this.wbot = this.section.wbot.value;
        this.h = this.section.h.value;
        this.wtop = this.section.wtop.value;

        this._x = this.section.x.GetValue();
        this._y = this.section.y.GetValue();
        this._wbot = this.section.wbot.GetValue();
        this._h = this.section.h.GetValue();
        this._wtop = this.section.wtop.GetValue();

        this.totalwidth = Math.max(this.wbot, this.wtop);
        this.totalheight = this.h;

        this.totalwidth_.value = this.totalwidth;
        this.totalheight_.value = this.totalheight;

        this.totalwidth_.symbol = "W_{total}";
        this.totalwidth_.equation = "{0}";

        if (this.totalwidth === this.wbot) {
            this.totalwidth_.nameparam = ["w_b"];
        } else {
            this.totalwidth_.nameparam = ["w_t"];
        }

        this.totalwidth_.valueparam = [this.totalwidth_.GetValue()];

        this.totalheight_.symbol = "H_{total}";
        this.totalheight_.equation = "{0}";
        this.totalheight_.nameparam = ["h"];
        this.totalheight_.valueparam = [this.totalheight_.GetValue()];
    };

    this.CalculateArea = function () {
        this.area = 0.5 * (this.wbot + this.wtop) * this.h;

        this.area1 = 0.5 * this.h * Math.abs(this.wbot - this.wtop) * 0.5;
        this.area2 = this.h * Math.min(this.wbot, this.wtop);
        this.area3 = this.area1;

        this.area_.value = this.area;

        this.area_.symbol = "A";
        this.area_.equation = "{1 / 2} ({0} + {1}) * {2}";
        this.area_.nameparam = ["w_b", "w_t", "h"];
        this.area_.valueparam = [this._wbot, this._wtop, this._h];
    };

    this.CalculateCentroid = function () {
        if (common.IsZero(this.area))
            this.CalculateArea();

        this.x0 = this.totalwidth / 2;
        this.y0 = (this.h / 3) * ((this.wbot + 2 * this.wtop) / (this.wbot + this.wtop));

        this.x0_.value = this.x0;
        this.y0_.value = this.y0;

        this.x0_.symbol = "x_0";
        this.x0_.equation = "{{0}} / 2";

        if (this.totalwidth === this.wbot) {
            this.x0_.nameparam = ["w_b"];
        } else {
            this.x0_.nameparam = ["w_t"];
        }

        this.x0_.valueparam = [this.totalwidth_.GetValue()];

        this.y0_.symbol = "y_0";
        this.y0_.equation = "{{{0}} / 3}({{1} + 2 * {2}} / {{1} + {2}})";
        this.y0_.nameparam = ["h", "w_b", "w_t"];
        this.y0_.valueparam = [this._h, this._wbot, this._wtop];
    };

    this.CalculateMomentofInertia = function () {
        if ((common.IsZero(this.x0)) || (common.IsZero(this.y0)))
            this.CalculateCentroid();

        this.inertia22 = (this.h * (this.wtop + this.wbot) * (Math.pow(this.wtop, 2) + Math.pow(this.wbot, 2))) / 48;
        this.inertia33 = Math.pow(this.h, 3) * (Math.pow(this.wtop, 2) + (4 * this.wtop * this.wbot) + Math.pow(this.wbot, 2)) / (36 * (this.wtop + this.wbot));
        this.inertia23 = 0;
        //this.inertia23 = this.area1 * ((x1 - this.x0)) * ((y1 - this.y0)) + this.area2 * ((x2 - this.x0)) * ((y2 - this.y0)) + this.area3 * ((x3 - this.x0)) * ((y3 - this.y0));

        this.inertia22_.value = this.inertia22;
        this.inertia33_.value = this.inertia33;
        this.inertia23_.value = this.inertia23;

        this.inertia22_.symbol = "I_{22}";
        this.inertia22_.equation = "{{0} * ({1} + {2}) * ({1}^2 + {2}^2)} / 48";
        this.inertia22_.nameparam = ["h", "w_t", "w_b"];
        this.inertia22_.valueparam = [this._h, this._wtop, this._wbot];

        this.inertia33_.symbol = "I_{33}";
        this.inertia33_.equation = "{[{1}^2 + (4 * {1} * {2}) + {2}^2]{0}^3} / {36({2} + {1})}";
        this.inertia33_.nameparam = ["h", "w_t", "w_b"];
        this.inertia33_.valueparam = [this._h, this._wtop, this._wbot];

        this.inertia23_.symbol = "I_{23}";
        this.inertia23_.equation = "{0}";
        this.inertia23_.nameparam = ["I_23"];
        this.inertia23_.valueparam = [this.inertia23_.GetValue()];
    };

    this.CalculateShearArea = function () {
        //TODO
    };

    this.CalculateTorsion = function () {
    //    var b = this.h;
    //    var m = this.wbot;
    //    var n = this.wtop;

    //    var s = Math.abs((m - n) / b);
    //    var VL = 0.10504 - 0.1 * s + 0.0848 * Math.pow(s, 2) - 0.06746 * Math.pow(s, 3) + 0.0515 * Math.pow(s, 4);
    //    var VS = 0.10504 + 0.1 * s + 0.0848 * Math.pow(s, 2) + 0.06746 * Math.pow(s, 3) + 0.0515 * Math.pow(s, 4);

    //    this.torsionalJ = (b / 12) * (m + n) * (Math.pow(m, 2) + Math.pow(n, 2)) - VL * Math.pow(m, 4) - VS * Math.pow(n, 4);

    //    this.torsionalJ_.value = this.torsionalJ;
    //    this.torsionalJ_.equationlist = [];

    //    var list = new uiframework.PropertyDouble("s", 0, common.unit.unitless);
    //    list.symbol = "s";
    //    list.equation = "{|{{0} + {1}} / {2}|}";
    //    list.nameparam = ["w_{b}", "w_{t}", "h"];
    //    list.valueparam = [this._wbot, this._wtop, this._h];
    //    list.value = s;
    //    this.torsionalJ_.equationlist.push(list);

    //    list = new uiframework.PropertyDouble("VL", 0, common.unit.unitless);
    //    list.symbol = "V_L";
    //    list.equation = "0.10504 - 0.1({0}) + 0.0848({0})^2 - 0.06746({0})^3 + 0.0515({0})^4";
    //    list.nameparam = ["s"];
    //    list.valueparam = [s];
    //    list.value = VL;
    //    this.torsionalJ_.equationlist.push(list);
       
    //    list = new uiframework.PropertyDouble("VS", 0, common.unit.unitless);
    //    list.symbol = "V_S";
    //    list.equation = "0.10504 + 0.1({0}) + 0.0848({0})^2 + 0.06746({0})^3 + 0.0515({0})^4";
    //    list.nameparam = ["s"];
    //    list.valueparam = [s];
    //    list.value = VS;
    //    this.torsionalJ_.equationlist.push(list);

    //    list = new uiframework.PropertyDouble("J", 0, common.unit.inertia);
    //    list.symbol = "J";
    //    list.equation = "{{0} / 12} ({1} + {2})({1}^2 + {2}^2) - {3} * {1}^4 - {4} * {2}^4";
    //    list.nameparam = ["h", "w_b", "w_t", "V_L", "V_S", "s"];
    //    list.valueparam = [b, m, n, VL, VS, s];
    //    list.value = this.torsionalJ_.GetValue();
    //    this.torsionalJ_.equationlist.push(list);
    };
}; //(x, y, w, h, wtop)