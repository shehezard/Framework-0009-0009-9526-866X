/* global common, uiframework, $SETTINGS, BEAMDESIGNOPTION, METRIC, DIMENSIONLABELLOCATION, REBARMODE, $CANVAS, ASTM*/
/* NOTE:
 * 1. Do validation for RC sections (refer this.UpdateLimits)
 * 
 */
var uicanvas2dgraphics = {};

uicanvas2dgraphics.Base = function () {
    this.categorygeneral = new uiframework.PropertyCategory("General");
    this.categorygeneral.visible = false;

    this.name = new uiframework.PropertyString("Name", "");
    this.name.readonly = true;
    this.name.visible = false;

    this.property = new common.DrawProperties();
    //this.property.linecolor = "rgb(102, 153, 204)";

    this.selectedproperty = new common.DrawProperties();
    this.selectedproperty.linecolor = "#FF0";

    this.numberofpoints = 2;
    this.visible = true;
    this.selected = false;

    this.id = -1;

    this.GetProperty = function () {
        if (this.selected)
            return this.selectedproperty;
        else
            return this.property;
    };
};

uicanvas2dgraphics.Line = function (x1, y1, x2, y2) {
    uicanvas2dgraphics.Base.call(this);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.Clone = function () {
        return new uicanvas2dgraphics.Line(this.x1, this.y1, this.x2, this.y2);
    };

    this.Render = function (renderer) {
        renderer.DrawLine(this.x1, this.y1, this.x2, this.y2, this.GetProperty());
    };

    this.SelectByPoint = function (x, y) {
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2;
        var y2 = this.y2;

        var line = new common.Line2F(x1, y1, x2, y2);

        if (line.GetPointIntersection(new common.Point2F(x, y), 0.2) !== null) {
            return true;
        }

        return false;
    };

    this.SelectByRectangle = function (x1, y1, x2, y2) {
        return false;
    };

    this.UpdateGuide = function (x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    };

    this.UpdateBounds = function (inbounds) {
        if (this.x1 < inbounds.x1)
            inbounds.x1 = this.x1;

        if (this.x2 > inbounds.x2)
            inbounds.x2 = this.x2;

        if (this.y1 < inbounds.y1)
            inbounds.y1 = this.y1;

        if (this.y2 > inbounds.y2)
            inbounds.y2 = this.y2;
    };
};

uicanvas2dgraphics.Circle = function (x, y, radius) {
    uicanvas2dgraphics.Base.call(this);

    this.x = x;
    this.y = y;
    this.radius = radius;

    this.Render = function (renderer) {
        var ar = this.radius;
        var ax = this.x;
        var ay = this.y;

        renderer.DrawCircle(ax, ay, ar, this.GetProperty());
    };

    this.Bounds = function () {
        var x = this.x;
        var y = this.y;
        var r = this.radius;

        var x1 = x - r;
        var y1 = y - r;
        var x2 = x + r;
        var y2 = y + r;

        return new common.Bounds2F(x1, y1, x2, y2);
    };
};


uicanvas2dgraphics.Polyline = function (points) {
    uicanvas2dgraphics.Base.call(this);

    this.points = points;

    this.Render = function (renderer) {
        renderer.DrawPolyLine(this.points, this.GetProperty());
    };

    this.UpdateMesh = function () {

    };

    this.SelectByPoint = function (x, y) {
        return false;
    };

    this.Move = function (x, y, xo, yo) {
    };

    this.UpdateBounds = function (bounds) {
        for (var im = 0; im < this.points.length; im++) {
            if (bounds.x1 > this.points[im].x)
                bounds.x1 = this.points[im].x;

            if (bounds.y1 > this.points[im].y)
                bounds.y1 = this.points[im].y;

            if (bounds.x2 < this.points[im].x)
                bounds.x2 = this.points[im].x;

            if (bounds.y2 < this.points[im].y)
                bounds.y2 = this.points[im].y;
        }
    };
};

uicanvas2dgraphics.Polygon = function (points) {
    uicanvas2dgraphics.Base.call(this);

    this.points = points;

    this.Render = function (renderer) {
        renderer.DrawPolygon(this.points, this.GetProperty());
    };

    this.UpdateMesh = function () {

    };

    this.SelectByPoint = function (x, y) {
        return false;
    };

    this.Move = function (x, y, xo, yo) {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].x += x;
            this.points[i].y += y;
        }
        this.UpdateMesh();

        if (this.updateevent !== undefined && this.updateevent !== null)
            this.updateevent();
    };

    this.UpdateBounds = function (bounds) {
        for (var im = 0; im < this.points.length; im++) {
            if (bounds.x1 > this.points[im].x)
                bounds.x1 = this.points[im].x;

            if (bounds.y1 > this.points[im].y)
                bounds.y1 = this.points[im].y;

            if (bounds.x2 < this.points[im].x)
                bounds.x2 = this.points[im].x;

            if (bounds.y2 < this.points[im].y)
                bounds.y2 = this.points[im].y;
        }
    };
};

uicanvas2dgraphics.Text = function (text, x, y, angle, horzalign, vertalign, font) {
    uicanvas2dgraphics.Base.call(this);

    this.x = x;
    this.y = y;
    this.text = text;

    this.horzalign = horzalign;
    this.vertalign = vertalign;
    this.angle = angle;
    this.textproperty = new common.TextProperties();
    this.font = font;

    //normal 2.3000000000000003px sans-serif

    this.Render = function (renderer) {
        if (this.font)
            renderer.DrawText(this.text, this.x, this.y, this.font, renderer.settings.fontcolor, this.angle, this.horzalign, this.vertalign);
        else
            renderer.DrawText(this.text, this.x, this.y, renderer.font, renderer.settings.fontcolor, this.angle, this.horzalign, this.vertalign);

        //renderer.DrawText(this.text, this.x, this.y, renderer.font, renderer.settings.fontcolor, this.angle, this.horzalign, this.vertalign);
    };

    this.Bounds = function () {
        var x = this.x;
        var y = this.y;

        return new common.Bounds(x, y, x, y);
    };
};

uicanvas2dgraphics.Point2F = function (x, y, r) {
    this.x = x;
    this.y = y;
    this.w = 0;
    this.r = r;

    this.Rotate = function (cx, cy, angle) {
        var a = Math.PI * angle / 180;
        var x = this.x;
        var y = this.y;

        this.x = cx + Math.cos(a) * (x - cx) - Math.sin(a) * (y - cy);
        this.y = cy + Math.sin(a) * (x - cx) + Math.cos(a) * (y - cy);
    };

    this.Move = function (x, y) {
        this.x += x;
        this.y += y;
    };

    this.UpdateBounds = function (bound) {
        var x = this.x;
        var y = this.y;
        this.bound = bound;
        var big = 1000000000000;

        if ((x < -big) || (y < -big) || (y > big) || (x > big)) {
            return;
        }

        bound.MinX = Math.min(bound.MinX, x);
        bound.MinY = Math.min(bound.MinY, y);
        bound.MaxX = Math.max(bound.MaxX, x);
        bound.MaxY = Math.max(bound.MaxY, y);

        return bound;
    };

    this.CheckOnPoint = function (pt, tol) {
        if (this.DistanceFromPoint(pt) <= tol) {
            return true;
        } else {
            return false;
        }
    };

    this.DistanceFromPoint = function (pt, tol) {
        return Math.sqrt(Math.pow((this.x - pt.x), 2) + Math.pow((this.y - pt.y), 2));
    };
};

uicanvas2dgraphics.Point3F = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

uicanvas2dgraphics.Line3F = function (x1, y1, z1, x2, y2, z2) {
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;

    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this.Length = function () {
        return Math.sqrt((this.x1 - this.x2) * (this.x1 - this.x2) + (this.y1 - this.y2) * (this.y1 - this.y2) + (this.z1 - this.z2) + (this.z1 - this.z2));
    };

    this.GetPoint = function (le) {
        var x = this.x1 - this.x2;
        var y = this.y1 - this.y2;
        var z = this.z1 - this.z2;
        var ky;
        var kz;

        var x3;
        var y3;
        var z3;

        if (x === 0 && y === 0) {
            if (this.z1 < this.z2)
                return new uicanvas2dgraphics.Point3F(this.x1, this.y1, this.z1 + le);
            else
                return new uicanvas2dgraphics.Point3F(this.x1, this.y1, this.z1 - le);
        }

        if (x === 0 && z === 0) {
            if (this.y1 < this.y2)
                return new uicanvas2dgraphics.Point3F(this.x1, this.y1 + le, this.z1);
            else
                return new uicanvas2dgraphics.Point3F(this.x1, this.y1 - le, this.z1);
        }

        if (y === 0 && z === 0) {
            if (this.x1 < this.x2)
                return new uicanvas2dgraphics.Point3F(this.x1 + le, this.y1, this.z1);
            else
                return new uicanvas2dgraphics.Point3F(this.x1 - le, this.y1, this.z1);
        }

        if (z === 0) {
            var ky = Math.abs(x / y);

            if (this.y1 < this.y2) {
                if (le !== 0)
                    y3 = this.y1 + le / Math.sqrt(ky * ky + 1);
                else
                    y3 = this.y1;

                if (this.x1 < this.x2)
                    x3 = this.x1 + (y3 - this.y1) * ky;
                else
                    x3 = this.x1 - (y3 - this.y1) * ky;
            } else {
                if (le !== 0)
                    y3 = this.y1 - le / Math.sqrt(ky * ky + 1);
                else
                    y3 = this.y1;

                if (this.x1 < this.x2)
                    x3 = this.x1 + (this.y1 - y3) * ky;
                else
                    x3 = this.x1 - (this.y1 - y3) * ky;
            }

            return new uicanvas2dgraphics.Point3F(x3, y3, this.z1);
        }

        if (y === 0) {
            var kz = x / z;

            if (le !== 0)
                z3 = this.z1 - le / Math.sqrt(kz * kz + 1);
            else
                z3 = this.z1;

            x3 = this.x1 - (this.z1 - z3) * kz;

            return new uicanvas2dgraphics.Point3F(x3, this.y1, z3);
        }

        if (x === 0) {
            var kz = y / z;

            if (le !== 0)
                z3 = this.z1 - le / Math.sqrt(kz * kz + 1);
            else
                z3 = this.z1;

            y3 = this.y1 - (this.z1 - z3) * kz;

            return new uicanvas2dgraphics.Point3F(this.x1, y3, z3);
        }

        var l = this.Length();
        var fx = x / l;
        var fy = y / l;
        var fz = z / l;

        x3 = this.x1 - fx * le;
        y3 = this.y1 - fy * le;
        z3 = this.z1 - fz * le;

        return new uicanvas2dgraphics.Point3F(x3, y3, z3);
    };
};

uicanvas2dgraphics.HorzDimLine = function (x1, y1, x2, y2, offset, text, xo, yo) {
    uicanvas2dgraphics.Base.call(this);

    this.property.scale = false;
    this.property.linecolor = "#00F";
    this.property.fillcolor = "#00F";
    this.property.showfill = false;

    this.textcolor = "#000";
    this.dimensionfontsize = 12;

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.xo = xo;
    this.yo = yo;

    this.text = text;
    this.offset = offset;

    this.o1 = Math.abs(offset) * 0.25;
    this.o2 = this.o1;
    this.cr = Math.abs(offset) * 0.1;

    this.angle = new uiframework.PropertyDouble("Angle", 0, common.unit.angle, 5, 0, 360);
    this.x = new uiframework.PropertyDouble("Center, X", 0, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Center, Y", 0, common.unit.length, 0.1, 20000);

    this.Render = function (renderer) {
        renderer.DrawLine(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, this.property);
        renderer.DrawLine(this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y, this.property);
        renderer.DrawLine(this.points[4].x, this.points[4].y, this.points[5].x, this.points[5].y, this.property);

        renderer.DrawCircle(this.points[6].x, this.points[6].y, this.cr, this.property);
        renderer.DrawCircle(this.points[7].x, this.points[7].y, this.cr, this.property);

        var angle = this.angle.GetValue();

        var font = "normal " + this.dimensionfontsize + "px sans-serif";
        var position = "bottom";

        if ($SETTINGS.dimensionlabel) {
            if ($SETTINGS.dimensionlabel.value.value === DIMENSIONLABELLOCATION.OUTSIDE.value) {
                if (this.offset > 0)
                    position = "bottom";
                else
                    position = "top";
            } else {
                if (this.offset < 0)
                    position = "bottom";
                else
                    position = "top";
            }
        } else {
            if (this.offset > 0)
                position = "bottom";
            else
                position = "top";
        }

        renderer.DrawText(this.text, this.points[8].x, this.points[8].y, font, this.property.textcolor, Math.PI * (360 - angle) / 180, undefined, position);
    };

    this.UpdateMesh = function () {
        this.points = [];

        this.o1 = Math.abs(this.offset) * 0.25;
        this.o2 = this.o1;
        this.cr = Math.abs(this.offset) * 0.1;

        var dir = 0;
        var offset = Math.abs(this.offset);

        if (this.offset > 0)
            dir = 1;
        else
            dir = -1;

        offset = dir * offset;

        var x1 = this.x1;
        var x2 = this.x2;

        var y1 = this.y1;
        var y2 = this.y2;

        if (x1 > x2) {
            x1 = this.x2;
            x2 = this.x1;
        }

        var o1 = dir * this.o1;
        var o2 = dir * this.o2;

        this.points.push(new common.Point2F(x1 - this.o2, y1 + offset));
        this.points.push(new common.Point2F(x2 + this.o2, y2 + offset));

        this.points.push(new common.Point2F(x1, y1 + o1));
        this.points.push(new common.Point2F(x1, y2 + offset + o2));

        this.points.push(new common.Point2F(x2, y1 + o1));
        this.points.push(new common.Point2F(x2, y2 + offset + o2));

        this.points.push(new common.Point2F(x1, y1 + offset));
        this.points.push(new common.Point2F(x2, y1 + offset));

        this.points.push(new common.Point2F((x1 + x2) / 2, y2 + offset));

        var angle = this.angle.GetValue();
        var x = this.x.GetValue();
        var y = this.y.GetValue();

        if (angle !== 0)
            for (var i = 0; i < this.points.length; i++)
                this.points[i].Rotate(this.xo, this.yo, angle);

    };

    this.UpdateBounds = function (inbounds) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].x < inbounds.x1)
                inbounds.x1 = this.points[i].x;

            if (this.points[i].x > inbounds.x2)
                inbounds.x2 = this.points[i].x;

            if (this.points[i].y < inbounds.y1)
                inbounds.y1 = this.points[i].y;

            if (this.points[i].y > inbounds.y2)
                inbounds.y2 = this.points[i].y;
        }
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.VertDimLine = function (x1, y1, x2, y2, offset, text, xo, yo) {
    uicanvas2dgraphics.Base.call(this);

    this.property.scale = false;
    this.property.linecolor = "#00F";
    this.property.fillcolor = "#00F";
    this.property.showfill = false;

    this.textcolor = "#000";
    this.dimensionfontsize = 12;

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.xo = xo;
    this.yo = yo;

    this.text = text;
    this.offset = offset;

    this.sel = 0;
    this.id = 0;
    this.sid = -1;

    this.o1 = Math.abs(offset) * 0.25;
    this.o2 = this.o1;
    this.cr = Math.abs(offset) * 0.1;

    this.angle = new uiframework.PropertyDouble("Angle", 0, common.unit.angle, 5, 0, 360);
    this.x = new uiframework.PropertyDouble("Center, X", 0, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Center, Y", 0, common.unit.length, 0.1, 20000);

    this.Render = function (renderer) {
        renderer.DrawLine(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, this.property);
        renderer.DrawLine(this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y, this.property);
        renderer.DrawLine(this.points[4].x, this.points[4].y, this.points[5].x, this.points[5].y, this.property);

        renderer.DrawCircle(this.points[6].x, this.points[6].y, this.cr, this.property);
        renderer.DrawCircle(this.points[7].x, this.points[7].y, this.cr, this.property);

        var angle = 90;//this.angle.GetValue();

        var font = "normal " + this.dimensionfontsize + "px sans-serif";
        var position = "bottom";

        if ($SETTINGS.dimensionlabel) {
            if ($SETTINGS.dimensionlabel.value.value === DIMENSIONLABELLOCATION.OUTSIDE.value) {
                if (this.offset < 0)
                    position = "bottom";
                else
                    position = "top";
            } else {
                if (this.offset > 0)
                    position = "bottom";
                else
                    position = "top";
            }
        } else {
            if (this.offset < 0)
                position = "bottom";
            else
                position = "top";
        }

        renderer.DrawText(this.text, this.points[8].x, this.points[8].y, font, this.property.textcolor, Math.PI * (360 - angle) / 180, undefined, position);
    };

    this.UpdateMesh = function () {
        var dir = 1;
        var offset = Math.abs(this.offset);

        if (this.offset > 0)
            dir = 1;
        else
            dir = -1;

        offset = dir * offset;

        var x1 = this.x1;
        var y1 = this.y1;

        var x2 = this.x2;
        var y2 = this.y2;

        if (y1 > y2) {
            y1 = this.y2;
            y2 = this.y1;
        }

        var o1 = dir * this.o1;
        var o2 = dir * this.o2;
        var x;

        if (dir > 0) {
            x = Math.max(x1, x2);

        } else {
            x = Math.min(x1, x2);
        }

        this.points = [];

        //Top
        this.points[this.points.length] = new common.Point2F(x + offset, y1 - this.o2);
        this.points[this.points.length] = new common.Point2F(x + offset, y2 + this.o2);

        //Bottom
        this.points[this.points.length] = new common.Point2F(x + offset + o2, y1);
        this.points[this.points.length] = new common.Point2F(this.x1 + o2, y1);

        //Top
        this.points[this.points.length] = new common.Point2F(x + offset + o2, y2);
        this.points[this.points.length] = new common.Point2F(this.x2 + o2, y2);

        this.points[this.points.length] = new common.Point2F(x + offset, y1);
        this.points[this.points.length] = new common.Point2F(x + offset, y2);

        this.points[this.points.length] = new common.Point2F(x + offset, (y1 + y2) / 2);

        var angle = this.angle.GetValue();

        if (angle !== 0)
            for (var i = 0; i < this.points.length; i++)
                this.points[i].Rotate(this.xo, this.yo, angle);
    };

    this.UpdateBounds = function (inbounds) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].x < inbounds.x1)
                inbounds.x1 = this.points[i].x;

            if (this.points[i].x > inbounds.x2)
                inbounds.x2 = this.points[i].x;

            if (this.points[i].y < inbounds.y1)
                inbounds.y1 = this.points[i].y;

            if (this.points[i].y > inbounds.y2)
                inbounds.y2 = this.points[i].y;
        }
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.InclinedDimLine = function (x, y, r, a, offset, text) {
    uicanvas2dgraphics.Base.call(this);

    this.property.scale = false;
    this.property.linecolor = "#00F";
    this.property.fillcolor = "#00F";
    this.property.showfill = false;

    this.textcolor = "#000";
    this.dimensionfontsize = 12;

    this.x = x;
    this.y = y;
    this.r = r;
    this.a = a;

    this.text = text;
    this.offset = offset;

    this.sel = 0;
    this.id = 0;
    this.sid = -1;

    this.o1 = Math.abs(offset) * 0.25;
    this.o2 = this.o1;
    this.cr = Math.abs(offset) * 0.1;

    this.Render = function (renderer) {
        renderer.DrawLine(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, this.property);
        renderer.DrawLine(this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y, this.property);
        renderer.DrawLine(this.points[4].x, this.points[4].y, this.points[5].x, this.points[5].y, this.property);

        renderer.DrawCircle(this.points[6].x, this.points[6].y, this.cr, this.property);
        renderer.DrawCircle(this.points[7].x, this.points[7].y, this.cr, this.property);

        var angle = this.a;

        var font = "normal " + this.dimensionfontsize + "px sans-serif";
        var position = "bottom";

        if ($SETTINGS.dimensionlabel) {
            if ($SETTINGS.dimensionlabel.value.value === DIMENSIONLABELLOCATION.OUTSIDE.value) {
                if (this.offset === 0)
                    position = "top";

                else if (this.offset > 0)
                    position = "bottom";
                else
                    position = "top";
            } else {
                if (this.offset === 0)
                    position = "bottom";

                else if (this.offset < 0)
                    position = "bottom";
                else
                    position = "top";
            }
        } else {
            if (this.offset > 0)
                position = "bottom";
            else
                position = "top";
        }

        renderer.DrawText(this.text, this.points[8].x, this.points[8].y, font, this.property.textcolor, Math.PI * (360 - angle) / 180, undefined, position);
    };

    this.UpdateMesh = function () {
        var angle = this.a;
        var dir = 1;
        var offset = Math.abs(this.offset);

        if (this.offset > 0)
            dir = 1;
        else
            dir = -1;

        offset = dir * offset;

        var x1 = this.x;
        var y1 = this.y;

        var x2 = this.x + this.r;
        var y2 = this.y;

        var o1 = dir * this.o1;
        var o2 = dir * this.o2;

        this.points = [];
        this.points.push(new common.Point2F(x1 - this.o2, y1 + offset));
        this.points.push(new common.Point2F(x2 + this.o2, y2 + offset));

        this.points.push(new common.Point2F(x1, y1 + o1));
        this.points.push(new common.Point2F(x1, y2 + offset + o2));

        this.points.push(new common.Point2F(x2, y1 + o1));
        this.points.push(new common.Point2F(x2, y2 + offset + o2));

        this.points.push(new common.Point2F(x1, y1 + offset));
        this.points.push(new common.Point2F(x2, y1 + offset));

        this.points.push(new common.Point2F((x1 + x2) / 2, y2 + offset));

        if (angle !== 0)
            for (var i = 0; i < this.points.length; i++)
                this.points[i].Rotate(this.x, this.y, angle);
    };

    this.UpdateBounds = function (inbounds) {
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.InclinedDimLineLHS = function (x, y, r, a, offset, text) {
    uicanvas2dgraphics.Base.call(this);

    this.property.scale = false;
    this.property.linecolor = "#00F";
    this.property.fillcolor = "#00F";
    this.property.showfill = false;

    this.textcolor = "#000";
    this.dimensionfontsize = 12;

    this.x = x;
    this.y = y;
    this.r = r;
    this.a = a;

    this.text = text;
    this.offset = offset;

    this.sel = 0;
    this.id = 0;
    this.sid = -1;

    this.o1 = Math.abs(offset) * 0.25;
    this.o2 = this.o1;
    this.cr = Math.abs(offset) * 0.1;

    this.Render = function (renderer) {
        renderer.DrawLine(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, this.property);
        renderer.DrawLine(this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y, this.property);
        renderer.DrawLine(this.points[4].x, this.points[4].y, this.points[5].x, this.points[5].y, this.property);

        renderer.DrawCircle(this.points[6].x, this.points[6].y, this.cr, this.property);
        renderer.DrawCircle(this.points[7].x, this.points[7].y, this.cr, this.property);

        var angle = this.a;

        var font = "normal " + this.dimensionfontsize + "px sans-serif";
        var position = "bottom";

        if ($SETTINGS.dimensionlabel) {
            if ($SETTINGS.dimensionlabel.value.value === DIMENSIONLABELLOCATION.OUTSIDE.value) {
                if (this.offset === 0)
                    position = "bottom";

                else if (this.offset > 0)
                    position = "top";
                else
                    position = "bottom";
            } else {
                if (this.offset === 0)
                    position = "top";

                else if (this.offset < 0)
                    position = "top";
                else
                    position = "bottom";
            }
        } else {
            if (this.offset > 0)
                position = "top";
            else
                position = "bottom";
        }

        renderer.DrawText(this.text, this.points[8].x, this.points[8].y, font, this.property.textcolor, Math.PI * (180 - angle) / 180, undefined, position);
    };

    this.UpdateMesh = function () {
        var angle = this.a;
        var dir = 1;
        var offset = Math.abs(this.offset);

        if (this.offset > 0)
            dir = 1;
        else
            dir = -1;

        offset = dir * offset;

        var x1 = this.x;
        var y1 = this.y;

        var x2 = this.x + this.r;
        var y2 = this.y;

        var o1 = dir * this.o1;
        var o2 = dir * this.o2;

        this.points = [];
        this.points.push(new common.Point2F(x1 - this.o2, y1 + offset));
        this.points.push(new common.Point2F(x2 + this.o2, y2 + offset));

        this.points.push(new common.Point2F(x1, y1 + o1));
        this.points.push(new common.Point2F(x1, y2 + offset + o2));

        this.points.push(new common.Point2F(x2, y1 + o1));
        this.points.push(new common.Point2F(x2, y2 + offset + o2));

        this.points.push(new common.Point2F(x1, y1 + offset));
        this.points.push(new common.Point2F(x2, y1 + offset));

        this.points.push(new common.Point2F((x1 + x2) / 2, y2 + offset));

        if (angle !== 0)
            for (var i = 0; i < this.points.length; i++)
                this.points[i].Rotate(this.x, this.y, angle);
    };

    this.UpdateBounds = function (inbounds) {
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.AngularDimLine = function (x, y, r, sa, ea, offset, text) {
    uicanvas2dgraphics.Base.call(this);

    this.property.scale = false;
    this.property.linecolor = "#00F";
    this.property.fillcolor = "#00F";
    this.property.showfill = false;

    this.textcolor = "#000";
    this.dimensionfontsize = 12;

    this.x = x;
    this.y = y;
    this.r = r;
    this.sa = sa;
    this.ea = ea;
    this.text = text;
    this.offset = offset;

    this.o1 = Math.abs(offset) * 0.25;
    this.o2 = this.o1;
    this.cr = Math.abs(offset) * 0.1;

    this.angle = new uiframework.PropertyDouble("Angle", 0, common.unit.angle, 5, 0, 360);
    this.x = new uiframework.PropertyDouble("Center, X", 0, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Center, Y", 0, common.unit.length, 0.1, 20000);

    this.Render = function (renderer) {
        var sa = this.sa * Math.PI / 180;
        var ea = this.ea * Math.PI / 180;
        var offset = Math.abs(this.offset);
        var x = this.x.value;
        var y = this.y.value;

        var r = 0.2 * (this.r + offset);

        renderer.DrawLine(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, this.property);
        renderer.DrawLine(this.points[0].x, this.points[0].y, this.points[2].x, this.points[2].y, this.property);

        renderer.DrawArcDimLine(this.points[0].x, this.points[0].y, r, r, sa, ea, this.property);

        renderer.DrawLine(this.arrow[0][0].x, this.arrow[0][0].y, this.arrow[0][1].x, this.arrow[0][1].y, this.property);
        renderer.DrawLine(this.arrow[0][0].x, this.arrow[0][0].y, this.arrow[0][2].x, this.arrow[0][2].y, this.property);

        renderer.DrawLine(this.arrow[1][0].x, this.arrow[1][0].y, this.arrow[1][1].x, this.arrow[1][1].y, this.property);
        renderer.DrawLine(this.arrow[1][0].x, this.arrow[1][0].y, this.arrow[1][2].x, this.arrow[1][2].y, this.property);

        var font = "normal " + this.dimensionfontsize + "px sans-serif";
        renderer.DrawText(this.text, this.points[3].x, this.points[3].y, font, this.property.textcolor);
    };

    this.UpdateMesh = function () {
        var offset = Math.abs(this.offset);
        var off4 = offset / 6;

        var x = this.x.value;
        var y = this.y.value;
        var r = this.r + offset;
        var sa = this.sa * Math.PI / 180;
        var ea = this.ea * Math.PI / 180;
        var aa = (sa + ea) / 2;
        var pi = Math.PI;

        this.points = [];
        this.points.push(new common.Point2F(x, y));

        this.points.push(new common.Point2F(x + r * Math.cos(sa), y - r * Math.sin(sa)));
        this.points.push(new common.Point2F(x + r * Math.cos(ea), y - r * Math.sin(ea)));
        this.points.push(new common.Point2F(x + 0.25 * r * Math.cos(aa), y - 0.25 * r * Math.sin(aa)));

        this.points.push(new common.Point2F(x + 0.2 * r * Math.cos(sa), y - 0.2 * r * Math.sin(sa)));
        this.points.push(new common.Point2F(x + 0.2 * r * Math.cos(ea), y - 0.2 * r * Math.sin(ea)));

        var arrow = [];
        arrow.push(new common.Point2F(0, 0));
        arrow.push(new common.Point2F(-off4, off4));
        arrow.push(new common.Point2F(off4, off4));

        for (var i = 0; i < arrow.length; i++) {
            arrow[i].Rotate(0, 0, 180 - this.sa);
            arrow[i].Move(this.points[4].x, this.points[4].y);
        }

        this.arrow = [];
        this.arrow.push(arrow);

        arrow = [];
        arrow.push(new common.Point2F(0, 0));
        arrow.push(new common.Point2F(-off4, off4));
        arrow.push(new common.Point2F(off4, off4));

        for (var i = 0; i < arrow.length; i++) {
            arrow[i].Rotate(0, 0, 360 - this.ea);
            arrow[i].Move(this.points[5].x, this.points[5].y);
        }

        this.arrow.push(arrow);

        var angle = this.angle.value;
        var x = this.x.value;
        var y = this.y.value;

        if (angle !== 0)
            for (var i = 0; i < this.points.length; i++)
                this.points[i].Rotate(this.xo, this.yo, angle);
    };

    this.UpdateBounds = function (inbounds) {
    };

    this.UpdateMesh();
};


uicanvas2dgraphics.ShapeBase = function () {
    uicanvas2dgraphics.Base.call(this);

    this.property.scale = false;

    this.handleprop = new common.DrawProperties();
    this.handleprop.fillcolor = "#FFF";
    this.handleprop.scale = false;

    //Dimension lines
    this.linecolor = "#00F";
    this.textcolor = "#000000";

    this.linecoloraxisx = "#000000";
    this.linecoloraxisy = "#000000";
    this.linecoloraxiscircle = "#000000";

    this.linecoloraxis2 = "#000000";
    this.linecoloraxis3 = "#000000";
    this.canvastextcolor = "#000000";

    this.dimoffset = 100;
    this.dimensionfontsize = 16;

    this.x0 = new uiframework.PropertyDouble("Centroid, X", 0, common.unit.length);
    this.x0.visible = false;

    this.y0 = new uiframework.PropertyDouble("Centroid, Y", 0, common.unit.length);
    this.y0.visible = false;

    this.ShapeBase = function (x, y, w, h, tw, tf) {

        this.shapedimension = new uiframework.PropertyCategory("Dimensions");

        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length);
        this.y.visible = false;

        if (w !== undefined && w !== 0) {
            this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
            this.w.convert = false;
        }

        if (h !== undefined && h !== 0) {
            this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
            this.h.convert = false;
        }

        this.angle = new uiframework.PropertyDouble("Angle", 0, common.unit.angle, 5, 0, 360);
        this.angle.visible = false;

        if (tw !== undefined && tw !== 0) {
            this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
            this.tw.convert = false;
        }

        if (tf !== undefined && tf !== 0) {
            this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);
            this.tf.convert = false;
        }
    };

    this.Render = function (renderer) {
        renderer.DrawPolygon(this.points, this.property);

        if (this.objects !== undefined) {
            for (var i = 0; i < this.objects.length; i++)
                this.objects[i].Render(renderer);
        }
    };

    this.RenderSizingHandles = function (renderer) {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var angle = this.angle.value;

        var w1 = renderer.ToPointWidth(renderer.width) / 3;
        var h1 = renderer.ToPointWidth(renderer.height) / 3;

        if (h1 < w1)
            w1 = h1;

        this.handles = [];
        this.handles.push(new common.Point2F(x, y - h / 2));
        this.handles.push(new common.Point2F(x, y + h / 2));
        this.handles.push(new common.Point2F(x - w / 2, y));
        this.handles.push(new common.Point2F(x + w / 2, y));
        this.handles.push(new common.Point2F(x + w1, y));

        if (angle !== 0)
            for (var i = 0; i < this.handles.length; i++)
                this.handles[i].Rotate(x, y, angle);

        renderer.DrawLine(x, y, this.handles[4].x, this.handles[4].y, this.handleprop);

        for (var i = 0; i < this.handles.length; i++) {
            renderer.DrawCircle(this.handles[i].x, this.handles[i].y, 15, this.handleprop);
        }
    };

    this.SelectByPoint = function (x, y) {
        var polygon = new common.Polygon2F(this.points);
        if (polygon.IsInside(new common.Point2F(x, y)))
            return true;

        return false;
    };

    this.SelectByRectangle = function (x1, y1, x2, y2) {
        return false;
    };

    this.SelectByPoint = function (x, y) {
        this.sid = -1;

        if (this.handles !== undefined) {
            var sizinghandles = [];

            for (var i = 0; i < this.handles.length; i++) {
                sizinghandles.push(new uicanvas2dgraphics.Circle(this.handles[i].x, this.handles[i].y, 15));
            }

            for (var i = 0; i < sizinghandles.length; i++) {
                if (sizinghandles[i].SelectByPoint(x, y)) {
                    this.sid = i;
                    return true;
                }
            }
        }

        var polygon = new common.Polygon2F(this.points);
        if (polygon.IsInside(new common.Point2F(x, y)))
            return true;

        return false;
    };

    this.UpdateBounds = function (inbounds) {
        var bounds = this.Bounds();

        if (bounds.x1 < inbounds.x1)
            inbounds.x1 = bounds.x1;

        if (bounds.x2 > inbounds.x2)
            inbounds.x2 = bounds.x2;

        if (bounds.y1 < inbounds.y1)
            inbounds.y1 = bounds.y1;

        if (bounds.y2 > inbounds.y2)
            inbounds.y2 = bounds.y2;
    };

    this.Bounds = function () {
        return new common.Polygon2F(this.points).Bounds();
    };

    this.Rotate = function () {
        var angle = this.angle.value;
        var x = this.x.value;
        var y = this.y.value;

        if (angle !== 0)
            for (var i = 0; i < this.points.length; i++)
                this.points[i].Rotate(x, y, angle);
    };

    this.Move = function (dx, dy) {
        for (var i = 0; i < this.points.length; i++)
            this.points[i].Move(dx, dy);
    };

    this.FlipAlongX = function (x) {
        var dist;

        for (var i = 0; i < this.points.length; i++) {
            dist = Math.abs(this.points[i].x - x);

            if (this.points[i].x > x)
                this.points[i].x = x - dist;
            else
                this.points[i].x = x + dist;
        }
    };

    this.FlipAlongY = function (y) {
        var dist;

        for (var i = 0; i < this.points.length; i++) {
            dist = Math.abs(this.points[i].y - y);

            if (this.points[i].y > y)
                this.points[i].y = y - dist;
            else
                this.points[i].y = y + dist;
        }
    };

    this.SetLocalAxisLineColor = function (value) {
        this.linecoloraxis2 = value;
        this.linecoloraxis3 = value;
    };

    this.SetGlobalAxisLineColor = function (value) {
        this.linecoloraxisx = value;
        this.linecoloraxisy = value;
        this.linecoloraxiscircle = value;

    };

    this.SetLocalAxisTextColor = function (value) {

    };

    this.ExtractArea = function (indexes) {
        var area = {};
        area.Points = [];

        for (var i = 0; i < indexes.length; i++) {
            item = {};
            item.Stress = 0;
            item.X = this.points[indexes[i]].x;
            item.Y = this.points[indexes[i]].y;
            item.Z = 0;
            area.Points.push(item);
        }

        return area;
    };

};

uicanvas2dgraphics.SectionBase = function () {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.shape;
    this.dimensions;
    this.showdimlines = true;
    this.showunits = true;
    this.showdimsymbol = true;
    this.showdimvalue = true;
    this.showlocalaxis = true;

    this.Render = function (renderer) {

        if ($CANVAS)
            this.canvastextcolor = $CANVAS.settings.rulertext;

        this.shape.property = this.property;
        if (this.backobjects !== undefined) {
            for (var i = 0; i < this.backobjects.length; i++)
                this.backobjects[i].Render(renderer);
        }

        this.shape.Render(renderer);

        for (var i = 0; i < this.dimensions.length; i++)
            this.dimensions[i].Render(renderer);

        if (this.objects !== undefined) {
            for (var i = 0; i < this.objects.length; i++)
                this.objects[i].Render(renderer);
        }

    };

    this.Bounds = function () {
        var bounds = this.shape.Bounds();

        for (var i = 0; i < this.dimensions.length; i++)
            this.dimensions[i].UpdateBounds(bounds);

        return bounds;
    };

    this.ExtractArea = function (indexes) {
        var area = {};
        area.Points = [];

        for (var i = 0; i < indexes.length; i++) {
            item = {};
            item.Stress = 0;
            item.X = this.shape.points[indexes[i]].x;
            item.Y = this.shape.points[indexes[i]].y;
            item.Z = 0;
            area.Points.push(item);
        }

        return area;
    };

    this.UpdateLocalAxis = function (xx, yy) {

        this.objects = [];
        this.backobjects = [];

        if (this.showlocalaxis) {
            var x = Number(this.x.GetValue());
            var y = Number(this.y.GetValue());
            var w = 0;
            var h = 0;

            var handle = true;

            if (this.alength !== undefined) {
                var alength = this.alength.GetValue();
                var h = alength * Math.sin(((Math.PI / 180) * 60));

                w = Number(alength);
                h = Number(h);

            } else if (this.w !== undefined) {
                w = Number(this.w.GetValue());

                if (this.ht)
                    h = Number(this.ht.GetValue());
                else
                    h = Number(this.h.GetValue());

            } else if (this.r !== undefined) {
                w = Number(this.r.GetValue() * 2);
                h = Number(this.r.GetValue() * 2);

            } else if (this.a !== undefined) {
                w = Number(this.a.GetValue());
                h = Number(this.a.GetValue());

            } else {
                handle = false;
            }

            if (handle) {
                var xx0 = ((x - w) / 2) + xx;
                var yy0 = ((y - h) / 2) + yy;

                var len = Math.max(w, h) * 0.12;

                var tdpc = new common.DrawProperties();
                tdpc.thickness = 0.8;
                tdpc.linecolor = this.linecoloraxis2;
                tdpc.textcolor = this.canvastextcolor;
                tdpc.scale = false;

                var tdp2 = new common.DrawProperties();
                tdp2.thickness = 0.8;
                tdp2.fillcolor = this.linecoloraxis2;
                tdp2.linecolor = this.linecoloraxis2;
                tdp2.scale = false;

                var tdp3 = new common.DrawProperties();
                tdp3.thickness = 0.8;
                tdp3.fillcolor = this.linecoloraxis3;
                tdp3.linecolor = this.linecoloraxis3;
                tdp3.scale = false;

                this.objects.push(new uicanvas2dgraphics.Axis(xx0, yy0, len, tdpc, tdp2, tdp3, "3", "2"));


                //Global axis

                //Circle
                var tdpc = new common.DrawProperties();
                tdpc.thickness = 4;
                tdpc.linecolor = "#00F";
                tdpc.textcolor = "#00F";
                tdpc.scale = false;

                //Y
                var tdp2 = new common.DrawProperties();
                tdp2.thickness = 2;
                tdp2.fillcolor = "#F00";
                tdp2.linecolor = "#F00";
                tdp2.scale = false;

                //X
                var tdp3 = new common.DrawProperties();
                tdp3.thickness = 2;
                tdp3.fillcolor = "#080";
                tdp3.linecolor = "#080";
                tdp3.scale = false;

                this.objects.push(new uicanvas2dgraphics.Axis(-w / 2, -h / 2, len, tdpc, tdp2, tdp3, "X", "Y"));

                var font = "bold 12px sans-serif";
                var text0 = new uicanvas2dgraphics.Text("0", xx0, yy0, undefined, "right", "top");
                text0.font = font;

                this.objects.push(text0);
            }
        }

    };

    this.UpdateDimensions = function () {

    };

    this.UpdateLimits = function () {

    };

    this.UpdateSection = function () {
        this.UpdateLocalAxis(this.x0.GetValue(), this.y0.GetValue());
        this.UpdateDimensions();
        this.UpdateLimits();
    };

};

uicanvas2dgraphics.RCBase = function () {
    uicanvas2dgraphics.Base.call(this);

    this.section;
    this.rebars = [];
    this.ties = [];
    this.showrebars = false;

    this.InitializeInvestigate = function () {
        this.InitializeMaterials();
        this.InitializeDesignActions();
        this.InitializeRebars();
    };

    this.InitializeMaterials = function () {
        //Materials
        this.catmaterial = new uiframework.PropertyCategory("Material Properties");
        this.fy = new uiframework.PropertyDouble("Flexural Yield Strength, fy", 414, common.unit.stress);
        if (common.unit.stress.value.value !== 1) {
            common.RoundDimension(this.fy, 1000);
        }
        this.fys = new uiframework.PropertyDouble("Shear Yield Strength, fys", 276, common.unit.stress);
        if (common.unit.stress.value.value !== 1) {
            common.RoundDimension(this.fys, 1000);
        }
        this.fc = new uiframework.PropertyDouble("Concrete, fc", 20.7, common.unit.stress);
        if (common.unit.stress.value.value !== 1) {
            common.RoundDimension(this.fc, 1000);
        }
    };

    this.InitializeDesignActions = function () {
        //Design Actions
        //        this.catdesign = new uiframework.PropertyCategory("Design Actions");
        //        this.mu = new uiframework.PropertyDouble("Moment, Mu", 100, common.unit.moment);
        //        this.vu = new uiframework.PropertyDouble("Shear, Vu", 50, common.unit.force);
        //        this.tu = new uiframework.PropertyDouble("Torsion, Tu", 0, common.unit.moment);
        //        this.es = new uiframework.PropertyDouble("Modulus of Elasticity, Es", 200000, common.unit.stress);
        //        this.es.visible = false;

        //Testing
        this.catdesign = new uiframework.PropertyCategory("Design Actions");

        this.mu = new uiframework.PropertyDouble("Moment, Mu", 100, common.unit.moment, -10000, 10000);
        if (common.unit.moment.value.value !== 1) {
            common.RoundDimension(this.mu, 5);
        }
        this.mu.allownegative = true;

        this.vu = new uiframework.PropertyDouble("Shear, Vu", 50, common.unit.force, -10000, 10000);
        if (common.unit.force.value.value !== 1) {
            common.RoundDimension(this.vu, 5);
        }
        this.vu.allownegative = true;

        this.tu = new uiframework.PropertyDouble("Torsion, Tu", 10, common.unit.moment, -10000, 10000);
        if (common.unit.moment.value.value !== 1) {
            common.RoundDimension(this.tu, 5);
        }
        this.tu.allownegative = true;

        this.R = new uiframework.PropertyDouble("Moment Redistribution, R", 10, common.unit.unitless, 0, 100);
        this.R.visible = false;
        this.R.ispercentage = true;

        this.es = new uiframework.PropertyDouble("Modulus of Elasticity, Es", 200000, common.unit.stress);
        this.es.visible = false;
    };

    this.InitializeRebars = function () {
        //Rebars
        this.catrebars = new uiframework.PropertyCategory("Rebars");
        this.catrebars.visible = false;

        this.topbar = new uiframework.PropertyRebar("Top Bars", 0, METRIC.d16, 0, REBARMODE.Bars);
        this.topbar.visible = false;

        this.botbar = new uiframework.PropertyRebar("Bottom Bars", 2, METRIC.d16, 0, REBARMODE.Bars);
        this.botbar.visible = false;

        this.webbar = new uiframework.PropertyRebar("Web Bars", 0, METRIC.d16, 0, REBARMODE.Bars);
        this.webbar.visible = false;

        this.stirrup = new uiframework.PropertyRebar("Stirrup", 0, METRIC.d8, 100, REBARMODE.Spacing);
        this.stirrup.visible = false;

        this.considertors = new uiframework.PropertyBoolean("Consider Torsion", false);
        this.considertors.visible = false;
    };

    this.ShowRebars = function (visible) {
        this.catrebars.visible = visible;
        this.botbar.visible = visible;
        this.topbar.visible = visible;
        this.webbar.visible = visible;
        this.stirrup.visible = visible;
        this.considertors.visible = visible;
    };

    this.ShowDesignActions = function (visible) {
        this.catdesign.visible = visible;
        this.mu.visible = visible;
        this.vu.visible = visible;
        this.tu.visible = visible;
    };

    this.Render = function (renderer) {
        this.section.Render(renderer);

        for (var i = 0; i < this.rebars.length; i++) {
            this.rebars[i].Render(renderer);
        }

        for (var i = 0; i < this.ties.length; i++) {
            this.ties[i].Render(renderer);
        }
    };

    this.UpdateBounds = function (bounds) {
        this.section.UpdateBounds(bounds);
    };
};

uicanvas2dgraphics.RCColumnBase = function () {
    uicanvas2dgraphics.RCBase.call(this);

    var self = this;

    this.hidedesign;

    this.Initialize = function () {
        this.InitializeDimensions();
        this.InitializeDesignActions();
        this.InitializeRebars();
        this.InitializeMaterials();
    };

    this.InitializeDimensions = function () {
    };

    this.InitializeDesignActions = function () {
        if (this.hidedesign === undefined) {
            this.design = new uiframework.PropertyCategory("Design Actions");
            this.load = new uiframework.PropertyDouble("Load, Pu", 500, common.unit.force);
            this.momentx = new uiframework.PropertyDouble("Moment, Mux", 100, common.unit.moment);
            this.momenty = new uiframework.PropertyDouble("Moment, Muy", 50, common.unit.moment);
            this.momentr = new uiframework.PropertyDouble("Resultant Moment, Muxy", 111.8, common.unit.moment);
            this.momentc = new uiframework.PropertyDouble("Moment Capacity, ØMnxy", 141.6, common.unit.moment);

            if (common.unit.force.value.value !== 1) {
                common.RoundDimension(this.load, 10);
            }

            if (common.unit.moment.value.value !== 1) {
                common.RoundDimension(this.momentx, 10);
                common.RoundDimension(this.momenty, 10);
                common.RoundDimension(this.momentr, 10);
                common.RoundDimension(this.momentx, 10);
            }
        }
    };

    this.InitializeRebars = function () {
        this.rebar = new uiframework.PropertyCategory("Rebars");
        this.bar = new uiframework.PropertyEnum("Bar Size", ASTM.No5, ASTM);
        this.spacing = new uiframework.PropertyDouble("Spacing", 150, common.unit.length, 25, 1000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.spacing, 0.5);
        }
    };

    this.InitializeRebarsRect = function () {
        this.rebar = new uiframework.PropertyCategory("Rebars");
        this.corner = new uiframework.PropertyEnum("Corner Bar Size", ASTM.No5, ASTM);
        this.corner.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };

        this.middle = new uiframework.PropertyEnum("Middle Bar Size", ASTM.No5, ASTM);
        this.middle.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };

        this.count1 = new uiframework.PropertyInteger("Bar Count Along 2", 4);
        this.count2 = new uiframework.PropertyInteger("Bar Count Along 3", 4);
        this.minspacing = new uiframework.PropertyDouble("Minimum Bar Spacing", 150, common.unit.length, 25, 1000);
        this.minspacing.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.minspacing, 0.5);
        }
    };

    this.InitializeRebarsCircle = function () {
        this.rebar = new uiframework.PropertyCategory("Rebars");
        this.size = new uiframework.PropertyEnum("Bar Size", ASTM.No5, ASTM);
        this.count = new uiframework.PropertyInteger("Bar Count", 16);
        this.count.postevent = function () {
            self.UpdateBarCountLimit();
        };
    };
};

uicanvas2dgraphics.RebarBase = function () {
    uicanvas2dgraphics.Base.call(this);

    this.points = [];

    this.Render = function (renderer) {
        for (var i = 0; i < this.points.length; i++)
            renderer.DrawCircle(this.points[i].x, this.points[i].y, this.points[i].r, this.property);
    };

    this.GetBars = function () {
        var bars = [];
        var factor = common.unit.length.value.value;

        for (var i = 0; i < this.points.length; i++) {
            bars.push({
                Name: "",
                Point: { X: this.points[i].x / factor, Y: this.points[i].y / factor },
                Area: this.points[i].r * this.points[i].r * Math.PI / (factor * factor),
                Weight: 0
            });
        }

        return bars;
    };
};

uicanvas2dgraphics.TieBase = function () {
    uicanvas2dgraphics.Base.call(this);

    this.points = [];
    this.loop = false;

    this.Render = function (renderer) {
        if (this.loop) {
            for (var i = 0; i < this.points.length - 1; i++) {
                renderer.DrawLine(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y, this.property);
            }

            i = this.points.length - 1;
            renderer.DrawLine(this.points[0].x, this.points[0].y, this.points[i].x, this.points[i].y, this.property);
        } else {
            for (var i = 0; i < this.points.length - 1; i += 2) {
                renderer.DrawLine(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y, this.property);
            }
        }
    };
};

uicanvas2dgraphics.Angle = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionAngle = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.Initialize = function () {
        this.ShapeBase(x, y, w, h, tw, tf);
        this.UpdateMesh();
    };

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + tw;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yb, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, x1, yt, this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Angle(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Angle(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 6]);
        mesh.Area.push(area);

        area = shape.ExtractArea([3, 4, 5, 6]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue();
        this.tw.max = this.w.GetValue();
        this.tf.max = this.h.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarAngle = function (x, y, w, h, tw, tf, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tf = this.tf.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var cbs = this.bar.value * common.unit.length.value.value / 2;
        var mbs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);    //Corner
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + mbs, y - h / 2 + tf - cc - mbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y + h / 2 - cc - cbs);        //Corner
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y + h / 2 - cc - cbs);       //Corner
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y - h / 2 + tf - cc - cbs);  //Corner
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y - h / 2 + tf - cc - cbs);       //Corner
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y - h / 2 + cc + cbs);        //Corner
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y - h / 2 + cc + cbs);   //Corner
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);    //Corner

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, cbs, mbs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.AngleTop = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2);

        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y + h / 2);

        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);

        this.Rotate();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionAngleTop = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + tw;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }

            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yt, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x1, yb, -this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.AngleTop(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.AngleTop(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 6]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCAngle = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.RCBase.call(this);

    this.type = BEAMDESIGNOPTION.DESIGN;

    //Design Option
    this.catoptions = new uiframework.PropertyCategory("Options");
    this.designoption = new uiframework.PropertyEnum("Design Option", this.type, BEAMDESIGNOPTION);
    this.designoption.height = 145;

    this.InitializeDesignActions();
    this.InitializeRebars();

    this.cat1 = new uiframework.PropertyCategory("Dimensions");
    this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
    this.x.visible = false;

    this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
    this.y.visible = false;

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", 60, common.unit.length, 0.1, 20000);
    if (common.unit.length.value.value !== 1) {
        common.RoundDimension(this.cc, 0.5);
    }

    this.InitializeMaterials();

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.section = new uicanvas2dgraphics.SectionAngleTop(x, y, w, h, tw, tf);
        this.rebars = [];
        this.ties = [];

        if (this.showrebars || this.designoption.value.value === BEAMDESIGNOPTION.INVESTIGATE.value) {
            var topbar = this.topbar.nobars;
            var botbar = this.botbar.nobars;
            var webbar = this.webbar.nobars;
            var cover = this.cc.value;

            //Initialize Rebars
            var cx = x - w / 2 + tw / 2;

            var rebar = new uicanvas2dgraphics.RebarRectangleBeam(cx, y, tw, h, cover, botbar, topbar, webbar, 0);
            rebar.topbar.barsize = this.topbar.barsize;
            rebar.botbar.barsize = this.botbar.barsize;
            rebar.sidebar.barsize = this.webbar.barsize;
            rebar.UpdateMesh();

            this.rebars.push(rebar);

            //Initialize Ties
            this.ties.push(new uicanvas2dgraphics.TieRectangle(cx, y, tw, h, cover, this.topbar.barsize.value / 2, this.botbar.barsize.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnAngle = function (x, y, w, h, tw, tf, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);
        this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tf = this.tf.value;
        var tw = this.tw.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionAngle(x, y, w, h, tw, tf);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarAngle(x, y, w, h, tw, tf, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x - w / 2 + tw / 2, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y - h / 2 + tf / 2, w, tf, this.cc.value, this.bar.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.BeamSectionAngle = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 100, common.unit.moment, 0.1, 20000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 20000);
    this.lx = new uiframework.PropertyDouble("Length, Lx", 4000, common.unit.length, 0.1, 20000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 20000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 20000);
    this.ly = new uiframework.PropertyDouble("Length, Ly", 4000, common.unit.length, 0.1, 20000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 20000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 20000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + tw;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yb, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, x1, yt, this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Angle(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Angle(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 6]);
        mesh.Area.push(area);

        area = shape.ExtractArea([3, 4, 5, 6]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SteelSectionAngle = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.p = new uiframework.PropertyDouble("Maximum Axial Load, P", 100, common.unit.weight, 0.1, 20000);
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 0, common.unit.moment, 0.1, 20000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 20000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 20000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 20000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 20000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 20000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + tw;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yb, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, x1, yt, this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Angle(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Angle(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 6]);
        mesh.Area.push(area);

        area = shape.ExtractArea([3, 4, 5, 6]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.BuiltUpAngle = function (x, y, wf, h, tw, tf, g) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw, tf);

    this.wf = new uiframework.PropertyDouble("Width Flange, wf", wf, common.unit.length, 0.1, 20000);
    this.gap = new uiframework.PropertyDouble("Gap, g", g, common.unit.length, 0, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wf = this.wf.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var g = this.gap.value / 2;

        this.points = [];

        //Right Side
        x = this.x.value + g;
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1
        this.points[this.points.length] = new common.Point2F(x, y + h / 2); //2
        this.points[this.points.length] = new common.Point2F(x + tw, y + h / 2); //3
        this.points[this.points.length] = new common.Point2F(x + tw, y - h / 2 + tf); //4
        this.points[this.points.length] = new common.Point2F(x + wf, y - h / 2 + tf); //5
        this.points[this.points.length] = new common.Point2F(x + wf, y - h / 2); //6
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1

        //Left Side
        x = this.x.value - g;
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1
        this.points[this.points.length] = new common.Point2F(x, y + h / 2); //2
        this.points[this.points.length] = new common.Point2F(x - tw, y + h / 2); //3
        this.points[this.points.length] = new common.Point2F(x - tw, y - h / 2 + tf); //4
        this.points[this.points.length] = new common.Point2F(x - wf, y - h / 2 + tf); //5
        this.points[this.points.length] = new common.Point2F(x - wf, y - h / 2); //6
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionBuiltUpAngle = function (x, y, wf, h, tw, tf, g) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw, tf);

    this.wf = new uiframework.PropertyDouble("Width Flange, wf", wf, common.unit.length, 0.1, 20000);
    this.wf.convert = false;
    this.gap = new uiframework.PropertyDouble("Gap, g", g, common.unit.length, 0, 20000);
    this.gap.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var wf = this.wf.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();
            var g = this.gap.GetValue() / 2;
            var gv = this.gap.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - wf - g;
            var xr = x + wf + g;
            var x1 = x - tw - g;

            var w1 = wf * 2 + (g * 2);

            var symw = "";
            var symwf = "";
            var symh = "";
            var symtf = "";
            var symtw = "";
            var symg = "";

            if (this.showdimsymbol) {
                symw = "w";
                symwf = "wf";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
                symg = "g";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmax = Math.max(2 * wf, h);
            this.dimoffset = tmax * 0.1;

            var dh, dwf, dw, dtf, dtw, dg = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dwf = symwf + " = " + uiframework.settings.Format(wf) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w1) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dg = symg + " = " + uiframework.settings.Format(gv) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dwf = uiframework.settings.Format(wf) + unit;
                    dw = uiframework.settings.Format(w1) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dg = uiframework.settings.Format(gv) + unit;
                }

            } else {
                dh = symh;
                dwf = symwf;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
                dg = symg;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x - g, yb, -0.5 * this.dimoffset, dwf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y1, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yt, x - g, yt, this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x + g, yt, x - g, yt, 0.5 * this.dimoffset, dg, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {

        this.w = new uiframework.PropertyDouble("Width, w", this.wf.value * 2 + this.gap.value, common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wf = this.wf.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();
        var g = this.gap.GetValue();

        this.shape = new uicanvas2dgraphics.BuiltUpAngle(x, y, wf, h, tw, tf, g);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wf = this.wf.value;
        var h = this.h.value / 2;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var g = this.gap.value / 2;

        var mesh = {};
        mesh.Area = [];

        var area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - wf, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - wf, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g) * -1, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g) * -1, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - wf) * -1, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - wf) * -1, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y - h, 0));
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.wf.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue();
        this.tw.max = this.wf.GetValue();
        this.tf.max = this.h.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.g.SetValue(g);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.Channel = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionChannel = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + tw;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yb, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x1, yb, -this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Channel(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Channel(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        area = shape.ExtractArea([6, 7, 8, 9]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue() * 2;
        this.tw.max = this.w.GetValue();
        this.tf.max = this.h.GetValue() / 2;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnChannel = function (x, y, w, h, tw, tf, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);
        this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionChannel(x, y, w, h, tw, tf);

        //Initialize Rebars
        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarChannel(x, y, w, h, tw, tf, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x - w / 2 + tw / 2, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y + h / 2 - tf / 2, w, tf, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y - h / 2 + tf / 2, w, tf, this.cc.value, this.bar.value.value / 2));
        }

    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarChannel = function (x, y, w, h, tw, tf, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tf = this.tf.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var cbs = this.bar.value * common.unit.length.value.value / 2;
        var mbs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + mbs, y - h / 2 + tf - cc - mbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + mbs, y + h / 2 - tf + cc + mbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y + h / 2 - tf + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y + h / 2 - tf + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y - h / 2 + tf - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y - h / 2 + tf - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, cbs, mbs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.BeamSectionChannel = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 100, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.lx = new uiframework.PropertyDouble("Length, Lx", 4000, common.unit.length, 0.1, 20000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);
    this.ly = new uiframework.PropertyDouble("Length, Ly", 4000, common.unit.length, 0.1, 20000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + tw;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yb, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x1, yb, -this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Channel(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Channel(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        area = shape.ExtractArea([6, 7, 8, 9]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SteelSectionChannel = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.p = new uiframework.PropertyDouble("Maximum Axial Load, P", 100, common.unit.weight, 0.1, 10000);
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 0, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + tw;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yb, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x1, yb, -this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Channel(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Channel(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        area = shape.ExtractArea([6, 7, 8, 9]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.UChannel = function (x, y, wtop, wbot, h, tw, tft, tfb) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 0.1, 20000);
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 0.1, 20000);

    this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 0.1, 20000);
    this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 0.1, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wtop = this.wtop.value;
        var wbot = this.wbot.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tft = this.tft.value;
        var tfb = this.tfb.value;

        var wMax = Math.max(wtop, wbot);

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - wMax / 2, y - h / 2); // 1
        this.points[this.points.length] = new common.Point2F(x - wMax / 2, y + h / 2); // 2
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + tw, y + h / 2); // 3
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + wtop, y + h / 2); // 4
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + wtop, y + h / 2 - tft); // 5
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + tw, y + h / 2 - tft); // 6
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + tw, y - h / 2 + tfb); // 7
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + wbot, y - h / 2 + tfb); // 8
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + wbot, y - h / 2); // 9
        this.points[this.points.length] = new common.Point2F(x - wMax / 2 + tw, y - h / 2); // 10
        this.points[this.points.length] = new common.Point2F(x - wMax / 2, y - h / 2); // 1

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionUChannel = function (x, y, wtop, wbot, h, tw, tft, tfb) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 0.1, 20000);
    this.wtop.convert = false;
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 0.1, 20000);
    this.wbot.convert = false;


    this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 0.1, 20000);
    this.tft.convert = false;
    this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 0.1, 20000);
    this.tfb.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var wtop = this.wtop.GetValue();
            var wbot = this.wbot.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tft = this.tft.GetValue();
            var tfb = this.tfb.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tft;
            var y2 = yb + tfb;

            var w = Math.max(wtop, wbot);

            var xl = x - w / 2;
            //var xlt = x - wtop / 2;
            //var xlb = x - wbot / 2;
            var xr = x + w / 2;
            var xrt = x - w / 2 + wtop;
            var xrb = x - w / 2 + wbot;
            var x1 = xl + tw;

            var symwtop = "";
            var symwbot = "";
            var symh = "";
            var symtft = "";
            var symtfb = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symwtop = "wt";
                symwbot = "wb";
                symh = "h";
                symtft = "tft";
                symtfb = "tfb";
                symtw = "tw";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dwtop, dwbot, dtw, dtft, dtfb = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dwtop = symwtop + " = " + uiframework.settings.Format(wtop) + unit;
                    dwbot = symwbot + " = " + uiframework.settings.Format(wbot) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtft = symtft + " = " + uiframework.settings.Format(tft) + unit;
                    dtfb = symtfb + " = " + uiframework.settings.Format(tfb) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dwtop = uiframework.settings.Format(wtop) + unit;
                    dwbot = uiframework.settings.Format(wbot) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtft = uiframework.settings.Format(tft) + unit;
                    dtfb = uiframework.settings.Format(tfb) + unit;
                }
            } else {
                dh = symh;
                dwtop = symwtop;
                dwbot = symwbot;
                dtw = symtw;
                dtft = symtft;
                dtfb = symtfb;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xrt, yt, this.dimoffset, dwtop, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xrb, yb, -this.dimoffset, dwbot, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, y, x1, y, this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yt, this.dimoffset, dtft, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y2, this.dimoffset, dtfb, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {

        this.w = new uiframework.PropertyDouble("Width, w", Math.max(this.wtop.value, this.wbot.value), common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wtop = this.wtop.GetValue();
        var wbot = this.wbot.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tft = this.tft.GetValue();
        var tfb = this.tfb.GetValue();

        this.shape = new uicanvas2dgraphics.UChannel(x, y, wtop, wbot, h, tw, tft, tfb);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wtop = this.wtop.value;
        var wbot = this.wbot.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tft = this.tft.value;
        var tfb = this.tfb.value;
        var shape = new uicanvas2dgraphics.UChannel(x, y, wtop, wbot, h, tw, tft, tfb);
        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        area = shape.ExtractArea([6, 7, 8, 9]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.wtop.min = this.tw.GetValue();
        this.wbot.min = this.tw.GetValue();
        this.h.min = this.tft.GetValue() + this.tfb.GetValue();
        this.tw.max = Math.max(this.wtop.GetValue(), this.wbot.GetValue());
        this.tft.max = this.h.GetValue() - this.tfb.GetValue();
        this.tfb.max = this.h.GetValue() - this.tft.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wtop.SetValue(wtop);
        this.wbot.SetValue(wbot);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tft.SetValue(tft);
        this.tfb.SetValue(tfb);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnUChannel = function (x, y, wtop, wbot, h, tw, tft, tfb, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);

        this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 50, 20000);
        this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 50, 20000);

        this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 50, 20000);
        this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var wtop = this.wtop.value;
        var wbot = this.wbot.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tft = this.tft.value;
        var tfb = this.tfb.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionUChannel(x, y, wtop, wbot, h, tw, tft, tfb);

        //Initialize Rebars
        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarUChannel(x, y, wtop, wbot, h, tw, tft, tfb, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            var w = Math.max(wtop, wbot);
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x - w / 2 + tw / 2, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y + h / 2 - tft / 2, wtop, tft, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x - w / 2 + wbot / 2, y - h / 2 + tfb / 2, wbot, tfb, this.cc.value, this.bar.value.value / 2));
        }

    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wtop.SetValue(wtop);
        this.wbot.SetValue(wbot);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tft.SetValue(tft);
        this.tfb.SetValue(tfb);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarUChannel = function (x, y, wtop, wbot, h, tw, tft, tfb, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 0.1, 20000);
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 0.1, 20000);

    this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 0.1, 20000);
    this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.wtop.GetValue();
        var wtop = this.wtop.GetValue();
        var wbot = this.wbot.GetValue();
        var h = this.h.GetValue();
        var tft = this.tft.GetValue();
        var tfb = this.tfb.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var cbs = this.bar.value * common.unit.length.value.value / 2;
        var mbs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + mbs, y - h / 2 + tfb - cc - mbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + mbs, y + h / 2 - tft + cc + mbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y + h / 2 - tft + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y + h / 2 - tft + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y - h / 2 + tfb - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + wbot - cc - cbs, y - h / 2 + tfb - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + wbot - cc - cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + tw - cc - cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, cbs, mbs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wtop.SetValue(wtop);
        this.wbot.SetValue(wbot);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tft.SetValue(tft);
        this.tfb.SetValue(tfb);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.BuiltUpChannel = function (x, y, wf, h, tw, tf, g) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw, tf);

    this.wf = new uiframework.PropertyDouble("Width Flange, wf", wf, common.unit.length, 0.1, 20000);
    this.gap = new uiframework.PropertyDouble("Gap, g", g, common.unit.length, 0, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wf = this.wf.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var g = this.gap.value / 2;

        this.points = [];
        x = this.x.value + g;
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1
        this.points[this.points.length] = new common.Point2F(x, y + h / 2); //2
        this.points[this.points.length] = new common.Point2F(x + wf, y + h / 2); //3
        this.points[this.points.length] = new common.Point2F(x + wf, y + h / 2 - tf); //4
        this.points[this.points.length] = new common.Point2F(x + tw, y + h / 2 - tf); //5
        this.points[this.points.length] = new common.Point2F(x + tw, y - h / 2 + tf); //6
        this.points[this.points.length] = new common.Point2F(x + wf, y - h / 2 + tf); //7
        this.points[this.points.length] = new common.Point2F(x + wf, y - h / 2); //8
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1

        x = this.x.value - g;
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1
        this.points[this.points.length] = new common.Point2F(x, y + h / 2); //2
        this.points[this.points.length] = new common.Point2F(x - wf, y + h / 2); //3
        this.points[this.points.length] = new common.Point2F(x - wf, y + h / 2 - tf); //4
        this.points[this.points.length] = new common.Point2F(x - tw, y + h / 2 - tf); //5
        this.points[this.points.length] = new common.Point2F(x - tw, y - h / 2 + tf); //6
        this.points[this.points.length] = new common.Point2F(x - wf, y - h / 2 + tf); //7
        this.points[this.points.length] = new common.Point2F(x - wf, y - h / 2); //8
        this.points[this.points.length] = new common.Point2F(x, y - h / 2); //1

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionBuiltUpChannel = function (x, y, wf, h, tw, tf, g) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw, tf);

    this.wf = new uiframework.PropertyDouble("Width Flange, wf", wf, common.unit.length, 0.1, 20000);
    this.wf.convert = false;
    this.gap = new uiframework.PropertyDouble("Gap, g", g, common.unit.length, 0, 20000);
    this.gap.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var wf = this.wf.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();
            var g = this.gap.GetValue() / 2;
            var gv = this.gap.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yb + tf;

            var xl = x - wf - g;
            var xr = x + wf + g;
            var x1 = x - tw - g;

            var w1 = wf * 2 + (g * 2);

            var symw = "";
            var symwf = "";
            var symh = "";
            var symtf = "";
            var symtw = "";
            var symg = "";

            if (this.showdimsymbol) {
                symw = "w";
                symwf = "wf";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
                symg = "g";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmax = Math.max(2 * wf, h);
            this.dimoffset = tmax * 0.1;

            var dh, dwf, dw, dtf, dtw, dg = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dwf = symwf + " = " + uiframework.settings.Format(wf) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w1) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dg = symg + " = " + uiframework.settings.Format(gv) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dwf = uiframework.settings.Format(wf) + unit;
                    dw = uiframework.settings.Format(w1) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dg = uiframework.settings.Format(gv) + unit;
                }
            } else {
                dh = symh;
                dwf = symwf;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
                dg = symg;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x - g, yb, -0.5 * this.dimoffset, dwf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y1, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yt, x - g, yt, this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x + g, yt, x - g, yt, 0.5 * this.dimoffset, dg, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {

        this.w = new uiframework.PropertyDouble("Width, w", this.wf.value * 2 + this.gap.value, common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wf = this.wf.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();
        var g = this.gap.GetValue();

        this.shape = new uicanvas2dgraphics.BuiltUpChannel(x, y, wf, h, tw, tf, g);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wf = this.wf.value;
        var h = this.h.value / 2;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var g = this.gap.value / 2;

        var mesh = {};
        mesh.Area = [];

        var area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - wf, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - wf, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - wf, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - wf, y + h - tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y + h - tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - g - tw, y + h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g) * -1, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g) * -1, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - wf) * -1, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - wf) * -1, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y - h + tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - wf) * -1, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - wf) * -1, y + h - tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y + h - tf, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint((x - g - tw) * -1, y + h, 0));
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.wf.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue() * 2;
        this.tw.max = this.wf.GetValue();
        this.tf.max = this.h.GetValue() / 2;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wf.SetValue(wf);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.g.SetValue(g);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.IBeam = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2 + tf);
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y - h / 2 + tf);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionIBeam = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.name.value = "I-Beam";
    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;
            var y2 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtw = "tw";
                symtf = "tf";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dtw, dtf = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtw = symtw;
                dtf = symtf;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y2, this.dimoffset, dtf, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.IBeam(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.IBeam(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([10, 11, 8, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([0, 1, 6, 7]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue() * 2;
        this.tw.max = this.w.GetValue();
        this.tf.max = this.h.GetValue() / 2;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnIBeam = function (x, y, w, h, tw, tf, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);
        this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionIBeam(x, y, w, h, tw, tf);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarIBeam(x, y, w, h, tw, tf, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y - h / 2 + tf / 2, w, tf, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y + h / 2 - tf / 2, w, tf, this.cc.value, this.bar.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarIBeam = function (x, y, w, h, tw, tf, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tf = this.tf.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var cbs = this.bar.value * common.unit.length.value.value / 2;
        var mbs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + mbs, y - h / 2 + tf - cc - mbs);
        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + mbs, y - h / 2 + tf - cc - mbs);
        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + mbs, y + h / 2 - tf + cc + mbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + mbs, y + h / 2 - tf + cc + mbs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y + h / 2 - cc - cbs);

        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y + h / 2 - cc - cbs);

        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y + h / 2 - tf + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y + h / 2 - tf + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y - h / 2 + tf - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y - h / 2 + tf - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y - h / 2 + cc + cbs);

        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + cbs, y - h / 2 + cc + cbs);

        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + cbs, y - h / 2 + cc + cbs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, cbs, mbs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.BeamSectionIBeam = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 100, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.lx = new uiframework.PropertyDouble("Length, Lx", 4000, common.unit.length, 0.1, 20000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);
    this.ly = new uiframework.PropertyDouble("Length, Ly", 4000, common.unit.length, 0.1, 20000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;
            var y2 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtw = "tw";
                symtf = "tf";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dtw, dtf = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtw = symtw;
                dtf = symtf;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y2, this.dimoffset, dtf, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.IBeam(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.IBeam(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([10, 11, 8, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([0, 1, 6, 7]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SteelSectionIBeam = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.p = new uiframework.PropertyDouble("Maximum Axial Load, P", 100, common.unit.weight, 0.1, 10000);
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 0, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;
            var y2 = yb + tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtw = "tw";
                symtf = "tf";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dtw, dtf = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtw = symtw;
                dtf = symtf;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y2, this.dimoffset, dtf, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.IBeam(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.IBeam(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([10, 11, 8, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([0, 1, 6, 7]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.BuiltUpW = function (x, y, wf, h, tw, tf, wp, tp) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw, tf);

    this.wf = new uiframework.PropertyDouble("Width Flange, wf", wf, common.unit.length, 0.1, 20000);
    this.tp = new uiframework.PropertyDouble("Thickness Plate, tp", tp, common.unit.length, 0.1, 20000);
    this.wp = new uiframework.PropertyDouble("Width Plate, wp", wp, common.unit.length, 0.1, 20000);

    this.recttop;
    this.rectbot;

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wf = this.wf.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var wp = this.wp.value;
        var tp = this.tp.value;

        this.points = [];

        this.points[this.points.length] = new common.Point2F(x - wf / 2, y - h / 2); //1
        this.points[this.points.length] = new common.Point2F(x - wf / 2, y - h / 2 + tf); //2
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y - h / 2 + tf); //3
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y + h / 2 - tf); //4
        this.points[this.points.length] = new common.Point2F(x - wf / 2, y + h / 2 - tf); //5
        this.points[this.points.length] = new common.Point2F(x - wf / 2, y + h / 2); //6
        this.points[this.points.length] = new common.Point2F(x + wf / 2, y + h / 2); //7
        this.points[this.points.length] = new common.Point2F(x + wf / 2, y + h / 2 - tf); //8
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y + h / 2 - tf); //9
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y - h / 2 + tf); //10
        this.points[this.points.length] = new common.Point2F(x + wf / 2, y - h / 2 + tf); //11
        this.points[this.points.length] = new common.Point2F(x + wf / 2, y - h / 2); //12
        this.points[this.points.length] = new common.Point2F(x - wf / 2, y - h / 2); //1

        this.objects = [];

        this.recttop = new uicanvas2dgraphics.Rectangle(x, (h + tp) / 2, wp, tp);
        this.recttop.property.fillcolor = "rgba(0, 0, 255, 0.5)";
        this.objects.push(this.recttop);

        this.rectbot = new uicanvas2dgraphics.Rectangle(x, -(h + tp) / 2, wp, tp);
        this.rectbot.property.fillcolor = "rgba(0, 0, 255, 0.5)";
        this.objects.push(this.rectbot);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionBuiltUpW = function (x, y, wf, h, tw, tf, wp, tp) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw, tf);

    this.wf = new uiframework.PropertyDouble("Width Flange, wf", wf, common.unit.length, 0.1, 20000);
    this.wf.convert = false;

    this.tp = new uiframework.PropertyDouble("Thickness Plate, tp", tp, common.unit.length, 0.1, 20000);
    this.tp.convert = false;

    this.wp = new uiframework.PropertyDouble("Width Plate, wp", wp, common.unit.length, 0.1, 20000);
    this.wp.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var wf = this.wf.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();
            var wp = this.wp.GetValue();
            var tp = this.tp.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;
            var y2 = yb + tf;

            var w = Math.max(wf, wp);

            var xl = x - w / 2;
            var xr = x + w / 2;
            var xlf = x - wf / 2;
            var xlp = x - wp / 2;
            var xrf = x + wf / 2;
            var xrp = x + wp / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symwf = "";
            var symwp = "";
            var symh = "";
            var symht = "";
            var symtf = "";
            var symtp = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symwf = "wf";
                symwp = "wp";
                symh = "h";
                symht = "ht";
                symtf = "tf";
                symtp = "tp";
                symtw = "tw";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dht, dwf, dtw, dwp, dtf, dtp = "";

            this.ht = new uiframework.PropertyDouble("Width Plate, wp", this.h.value + 2 * this.tp.value, common.unit.length, 0.1, 20000);
            this.ht.visible = false;

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dht = symht + " = " + uiframework.settings.Format(h + 2 * tp) + unit;
                    dwf = symwf + " = " + uiframework.settings.Format(wf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dwp = symwp + " = " + uiframework.settings.Format(wp) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtp = symtp + " = " + uiframework.settings.Format(tp) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dht = uiframework.settings.Format(h + 2 * tp) + unit;
                    dwf = uiframework.settings.Format(wf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dwp = uiframework.settings.Format(wp) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtp = uiframework.settings.Format(tp) + unit;
                }
            } else {
                dh = symh;
                dht = symht;
                dwf = symwf;
                dtw = symtw;
                dwp = symwp;
                dtf = symtf;
                dtp = symtp;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb - tp, xl, yt + tp, -2 * this.dimoffset, dht, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xlf, yt + tp, xrf, yt + tp, this.dimoffset, dwf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, y, x2, y, - this.dimoffset / 2, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xlp, yb - tp, xrp, yb - tp, -this.dimoffset, dwp, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yt, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb - tp, xr, yb, this.dimoffset, dtp, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.w = new uiframework.PropertyDouble("Width, w", Math.max(this.wf.value, this.wp.value), common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wf = this.wf.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();
        var wp = this.wp.GetValue();
        var tp = this.tp.GetValue();

        this.shape = new uicanvas2dgraphics.BuiltUpW(x, y, wf, h, tw, tf, wp, tp);
        this.shape.recttop.property.fillcolor = common.LightenColor(this.property.fillcolor, -90);
        this.shape.recttop.property.linecolor = this.property.linecolor;
        this.shape.rectbot.property.fillcolor = common.LightenColor(this.property.fillcolor, -90);
        this.shape.rectbot.property.linecolor = this.property.linecolor;

        //        this.shape = new uicanvas2dgraphics.IBeam(x, y, wf, h, tw, tf, wp, tp);
        //        
        //        this.objects = [];
        //        
        //        var recttop = new uicanvas2dgraphics.Rectangle(x, (h + tp) / 2, wp, tp);
        //        recttop.property.fillcolor = "rgba(0, 0, 255, 0.5)";
        //        this.objects.push(recttop);
        //
        //        var rectbot = new uicanvas2dgraphics.Rectangle(x, -(h + tp) / 2, wp, tp);
        //        rectbot.property.fillcolor = "rgba(0, 0, 255, 0.5)";
        //        this.objects.push(rectbot);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wf = this.wf.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var wp = this.wp.value;
        var tp = this.tp.value;

        var shape = new uicanvas2dgraphics.BuiltUpW(x, y, wf, h, tw, tf, wp, tp);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 10, 11]);
        mesh.Area.push(area);

        var area = shape.ExtractArea([4, 5, 6, 7]);
        mesh.Area.push(area);

        var area = shape.ExtractArea([2, 3, 8, 9]);
        mesh.Area.push(area);

        wf = this.wf.value / 2;
        h = this.h.value / 2;
        wp = this.wp.value / 2;

        var area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - wp, y - h - tp, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - wp, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + wp, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + wp, y - h - tp, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - wp, (y - h - tp) * -1, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - wp, (y - h) * -1, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + wp, (y - h) * -1, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + wp, (y - h - tp) * -1, 0));
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.wf.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue() * 2;
        this.tw.max = this.wf.GetValue();
        this.tf.max = this.h.GetValue() / 2;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wf.SetValue(wf);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.wp.SetValue(wp);
        this.tp.SetValue(tp);
    };

    this.UpdateMesh();

    this.Bounds = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wf = this.wf.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();
        var wp = this.wp.GetValue();
        var tp = this.tp.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - wp / 2 - this.dimoffset;
        bounds.y1 = y - (h + tp) / 2 - this.dimoffset;
        bounds.x2 = x + wp / 2 + this.dimoffset;
        bounds.y2 = y + (h + tp) / 2 + this.dimoffset;
        return bounds;
    };
};

uicanvas2dgraphics.UIBeam = function (x, y, wtop, wbot, h, tw, tft, tfb) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 0.1, 20000);
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 0.1, 20000);

    this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 0.1, 20000);
    this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 0.1, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wtop = this.wtop.value;
        var wbot = this.wbot.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tft = this.tft.value;
        var tfb = this.tfb.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - wbot / 2, y - h / 2); //1
        this.points[this.points.length] = new common.Point2F(x - wbot / 2, y - h / 2 + tfb); //2
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y - h / 2 + tfb); //3
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y + h / 2 - tft); //4
        this.points[this.points.length] = new common.Point2F(x - wtop / 2, y + h / 2 - tft); //5
        this.points[this.points.length] = new common.Point2F(x - wtop / 2, y + h / 2); //6
        this.points[this.points.length] = new common.Point2F(x + wtop / 2, y + h / 2); //7
        this.points[this.points.length] = new common.Point2F(x + wtop / 2, y + h / 2 - tft); //8
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y + h / 2 - tft); //9
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y - h / 2 + tfb); //10
        this.points[this.points.length] = new common.Point2F(x + wbot / 2, y - h / 2 + tfb); //11
        this.points[this.points.length] = new common.Point2F(x + wbot / 2, y - h / 2); //12
        this.points[this.points.length] = new common.Point2F(x - wbot / 2, y - h / 2); //1

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionUIBeam = function (x, y, wtop, wbot, h, tw, tft, tfb) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, undefined, h, tw);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 0.1, 20000);
    this.wtop.convert = false;
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 0.1, 20000);
    this.wbot.convert = false;

    this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 0.1, 20000);
    this.tft.convert = false;
    this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 0.1, 20000);
    this.tfb.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var wtop = this.wtop.GetValue();
            var wbot = this.wbot.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tft = this.tft.GetValue();
            var tfb = this.tfb.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tft;
            var y2 = yb + tfb;

            var w = Math.max(wtop, wbot);

            var xl = x - w / 2;
            var xlt = x - wtop / 2;
            var xlb = x - wbot / 2;
            var xr = x + w / 2;
            var xrt = x + wtop / 2;
            var xrb = x + wbot / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symwtop = "";
            var symwbot = "";
            var symh = "";
            var symtft = "";
            var symtfb = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symtft = "tft";
                symtfb = "tfb";

                symwtop = "wt";
                symwbot = "wb";
                symh = "h";
                symtw = "tw";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dwbot, dwtop, dtw, dtft, dtfb = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dwbot = symwbot + " = " + uiframework.settings.Format(wbot) + unit;
                    dwtop = symwtop + " = " + uiframework.settings.Format(wtop) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtft = symtft + " = " + uiframework.settings.Format(tft) + unit;
                    dtfb = symtfb + " = " + uiframework.settings.Format(tfb) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dwbot = uiframework.settings.Format(wbot) + unit;
                    dwtop = uiframework.settings.Format(wtop) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtft = uiframework.settings.Format(tft) + unit;
                    dtfb = uiframework.settings.Format(tfb) + unit;
                }
            } else {
                dh = symh;
                dwbot = symwbot;
                dwtop = symwtop;
                dtw = symtw;
                dtft = symtft;
                dtfb = symtfb;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xlb, yb, xrb, yb, -this.dimoffset, dwbot, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xlt, yt, xrt, yt, this.dimoffset, dwtop, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, y, x2, y, this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yt, this.dimoffset, dtft, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y2, this.dimoffset, dtfb, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {

        this.w = new uiframework.PropertyDouble("Width, w", Math.max(this.wtop.value, this.wbot.value), common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wtop = this.wtop.GetValue();
        var wbot = this.wbot.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tft = this.tft.GetValue();
        var tfb = this.tfb.GetValue();

        this.shape = new uicanvas2dgraphics.UIBeam(x, y, wtop, wbot, h, tw, tft, tfb);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wtop = this.wtop.value;
        var wbot = this.wbot.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tft = this.tft.value;
        var tfb = this.tfb.value;
        var shape = new uicanvas2dgraphics.UIBeam(x, y, wtop, wbot, h, tw, tft, tfb);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 10, 11]);
        mesh.Area.push(area);

        area = shape.ExtractArea([4, 5, 6, 7]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 8, 9]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.wtop.min = this.tw.GetValue();
        this.wbot.min = this.tw.GetValue();
        this.h.min = this.tft.GetValue() + this.tfb.GetValue();
        this.tw.max = Math.max(this.wtop.GetValue(), this.wbot.GetValue());
        this.tft.max = this.h.GetValue() - this.tfb.GetValue();
        this.tfb.max = this.h.GetValue() - this.tft.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wtop.SetValue(wtop);
        this.wbot.SetValue(wbot);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tft.SetValue(tft);
        this.tfb.SetValue(tfb);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnUIBeam = function (x, y, wtop, wbot, h, tw, tft, tfb, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);

        this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 50, 20000);
        this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 50, 20000);

        this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 50, 20000);
        this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        //var w = this.w.value;
        var h = this.h.value;

        var wtop = this.wtop.value;
        var wbot = this.wbot.value;
        var tft = this.tft.value;
        var tfb = this.tfb.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionUIBeam(x, y, wtop, wbot, h, tw, tft, tfb);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarUIBeam(x, y, wtop, wbot, h, tw, tft, tfb, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y - h / 2 + tfb / 2, wbot, tfb, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y + h / 2 - tft / 2, wtop, tft, this.cc.value, this.bar.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wtop.SetValue(wtop);
        this.wbot.SetValue(wbot);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tft.SetValue(tft);
        this.tfb.SetValue(tfb);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarUIBeam = function (x, y, wtop, wbot, h, tw, tft, tfb, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wtop, common.unit.length, 0.1, 20000);
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wbot, common.unit.length, 0.1, 20000);

    this.tft = new uiframework.PropertyDouble("Flange Top, tft", tft, common.unit.length, 0.1, 20000);
    this.tfb = new uiframework.PropertyDouble("Flange Bottom, tfb", tfb, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wtop = this.wtop.GetValue();
        var wbot = this.wbot.GetValue();
        var h = this.h.GetValue();
        var tft = this.tft.GetValue();
        var tfb = this.tfb.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var cbs = this.bar.value * common.unit.length.value.value / 2;
        var mbs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - wbot / 2 + cc + cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x - wbot / 2 + cc + mbs, y - h / 2 + tfb - cc - mbs);
        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + mbs, y - h / 2 + tfb - cc - mbs);
        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + mbs, y + h / 2 - tft + cc + mbs);
        this.points[this.points.length] = new common.Point2F(x - wtop / 2 + cc + mbs, y + h / 2 - tft + cc + mbs);
        this.points[this.points.length] = new common.Point2F(x - wtop / 2 + cc + cbs, y + h / 2 - cc - cbs);

        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y + h / 2 - cc - cbs);

        this.points[this.points.length] = new common.Point2F(x + wtop / 2 - cc - cbs, y + h / 2 - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + wtop / 2 - cc - cbs, y + h / 2 - tft + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y + h / 2 - tft + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y - h / 2 + tfb - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + wbot / 2 - cc - cbs, y - h / 2 + tfb - cc - cbs);
        this.points[this.points.length] = new common.Point2F(x + wbot / 2 - cc - cbs, y - h / 2 + cc + cbs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - cbs, y - h / 2 + cc + cbs);

        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + cbs, y - h / 2 + cc + cbs);

        this.points[this.points.length] = new common.Point2F(x - wbot / 2 + cc + cbs, y - h / 2 + cc + cbs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, cbs, mbs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wtop.SetValue(wtop);
        this.wbot.SetValue(wbot);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tft.SetValue(tft);
        this.tfb.SetValue(tfb);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.Tee = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y + h / 2 - tf);
        this.points[this.points.length] = new common.Point2F(x + tw / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - tw / 2, y - h / 2);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionTee = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yt, xr, y1, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -1 * this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Tee(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Tee(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 6, 7]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue();
        this.tw.max = this.w.GetValue();
        this.tf.max = this.h.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCTee = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.RCBase.call(this);

    this.type = BEAMDESIGNOPTION.DESIGN;

    //Design Option
    this.catoptions = new uiframework.PropertyCategory("Options");
    //this.catoptions.visible = false;

    this.designoption = new uiframework.PropertyEnum("Design Option", this.type, BEAMDESIGNOPTION);
    this.designoption.height = 145;
    //this.designoption.visible = false;

    this.InitializeDesignActions();
    this.InitializeRebars();

    this.cat1 = new uiframework.PropertyCategory("Dimensions");
    this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
    this.x.visible = false;

    this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
    this.y.visible = false;

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", 60, common.unit.length, 0.1, 20000);
    if (common.unit.length.value.value !== 1) {
        common.RoundDimension(this.cc, 0.5);
    }

    this.InitializeMaterials();

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.section = new uicanvas2dgraphics.SectionTee(x, y, w, h, tw, tf);
        this.rebars = [];
        this.ties = [];

        if (this.showrebars || this.designoption.value.value === BEAMDESIGNOPTION.INVESTIGATE.value) {
            var topbar = this.topbar.nobars;
            var botbar = this.botbar.nobars;
            var webbar = this.webbar.nobars;
            var cover = this.cc.value;

            //Initialize Rebars
            var rebar = new uicanvas2dgraphics.RebarRectangleBeam(x, y, tw, h, cover, botbar, topbar, webbar, 0);
            rebar.topbar.barsize = this.topbar.barsize;
            rebar.botbar.barsize = this.botbar.barsize;
            rebar.sidebar.barsize = this.webbar.barsize;
            rebar.UpdateMesh();

            this.rebars.push(rebar);

            //Initialize Ties
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, tw, h, cover, this.topbar.barsize.value / 2, this.botbar.barsize.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnTee = function (x, y, w, h, tw, tf, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);
        this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 50, 20000);

        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionTee(x, y, w, h, tw, tf);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarTee(x, y, w, h, tw, tf, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y + h / 2 - tf / 2, w, tf, this.cc.value, this.bar.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarTee = function (x, y, w, h, tw, tf, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tf = this.tf.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var bs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + bs, y - h / 2 + cc + bs); // 1
        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + bs, y + h / 2 - tf + cc + bs); //2
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + bs, y + h / 2 - tf + cc + bs); //3
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + bs, y + h / 2 - cc - bs); //4

        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + bs, y + h / 2 - cc - bs); //4
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - bs, y + h / 2 - cc - bs); //4

        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 - cc - bs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 - tf + cc + bs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - bs, y + h / 2 - tf + cc + bs);
        this.points[this.points.length] = new common.Point2F(x + tw / 2 - cc - bs, y - h / 2 + cc + bs);
        this.points[this.points.length] = new common.Point2F(x - tw / 2 + cc + bs, y - h / 2 + cc + bs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, bs, bs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.BeamSectionTee = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 100, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.lx = new uiframework.PropertyDouble("Length, Lx", 4000, common.unit.length, 0.1, 20000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);
    this.ly = new uiframework.PropertyDouble("Length, Ly", 4000, common.unit.length, 0.1, 20000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yt, xr, y1, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -1 * this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Tee(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Tee(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 6, 7]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SteelSectionTee = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.p = new uiframework.PropertyDouble("Maximum Axial Load, P", 100, common.unit.weight, 0.1, 10000);
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 0, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = x - tw / 2;
            var x2 = x + tw / 2;

            var symw = "";
            var symh = "";
            var symtf = "";
            var symtw = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtf = "tf";
                symtw = "tw";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw, dtf, dtw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yt, xr, y1, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -1 * this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Tee(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Tee(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 6, 7]);
        mesh.Area.push(area);

        area = shape.ExtractArea([2, 3, 4, 5]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.UTee = function (x, y, w, h, tw, tf, lf1) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 0.1, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var lf1 = this.lf1.value;

        this.points = [];
        this.points.push(new common.Point2F(x - w / 2 + lf1, y - h / 2)); //1
        this.points.push(new common.Point2F(x - w / 2 + lf1, y + h / 2 - tf)); //2
        this.points.push(new common.Point2F(x - w / 2, y + h / 2 - tf)); //3
        this.points.push(new common.Point2F(x - w / 2, y + h / 2)); //4
        this.points.push(new common.Point2F(x - w / 2 + lf1, y + h / 2)); //6
        this.points.push(new common.Point2F(x - w / 2 + lf1 + tw, y + h / 2)); //7
        this.points.push(new common.Point2F(x + w / 2, y + h / 2)); //9
        this.points.push(new common.Point2F(x + w / 2, y + h / 2 - tf)); //10
        this.points.push(new common.Point2F(x - w / 2 + lf1 + tw, y + h / 2 - tf)); //11
        this.points.push(new common.Point2F(x - w / 2 + lf1 + tw, y - h / 2)); //12
        this.points.push(new common.Point2F(x - w / 2 + lf1, y - h / 2)); //1

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionUTee = function (x, y, w, h, tw, tf, lf1) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 0, 20000);
    this.lf1.convert = false;
    this.lf2 = new uiframework.PropertyDouble("Flange Length 2, lf2", 0, common.unit.length, 0.1, 20000);
    this.lf2.convert = false;
    this.lf2.visible = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();
            var lf1 = this.lf1.GetValue();
            var lf2 = this.lf2.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - lf2;
            var y2 = yt - lf2 - tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + lf1;
            var x2 = xl + lf1 + tw;

            var symw = "";
            var symh = "";
            var symtw = "";
            var symtf = "";
            var symlf1 = "";
            var symlf2 = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtw = "tw";
                symtf = "tf";
                symlf1 = "lf1";
                symlf2 = "lf2";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dtw, dlf1, dlf2, dtf = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dlf1 = symlf1 + " = " + uiframework.settings.Format(lf1) + unit;
                    dlf2 = symlf2 + " = " + uiframework.settings.Format(lf2) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dlf1 = uiframework.settings.Format(lf1) + unit;
                    dlf2 = uiframework.settings.Format(lf2) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
                dlf1 = symlf1;
                dlf2 = symlf2;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x1, yb, -this.dimoffset, dlf1, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -this.dimoffset, dtw, x, y));
            //            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yt, 0.5 * this.dimoffset, dlf2, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y2, xr, y1, this.dimoffset, dtf, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();
        var lf1 = this.lf1.GetValue();
        var lf2 = this.lf2.GetValue();

        this.shape = new uicanvas2dgraphics.UTee(x, y, w, h, tw, tf, lf1);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var lf1 = this.lf1.value;
        var lf2 = this.lf2.value;
        var shape = new uicanvas2dgraphics.UTee(x, y, w, h, tw, tf, lf1);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 4, 5, 9]);
        mesh.Area.push(area);

        area = shape.ExtractArea([1, 2, 3, 4]);
        mesh.Area.push(area);

        area = shape.ExtractArea([5, 6, 7, 8]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw.GetValue() + this.lf1.GetValue();
        this.h.min = this.tf.GetValue();
        this.tw.max = this.w.GetValue() - this.lf1.GetValue();
        this.tf.max = this.h.GetValue();
        this.lf1.max = this.w.GetValue() - this.tw.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.lf1.SetValue(lf1);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnUTee = function (x, y, w, h, tw, tf, lf1, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);
        this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 50, 20000);
        this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var lf1 = this.lf1.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionUTee(x, y, w, h, tw, tf, lf1);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarUTee(x, y, w, h, tw, tf, lf1, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x - w / 2 + lf1 + tw / 2, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y + h / 2 - tf / 2, w, tf, this.cc.value, this.bar.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.lf1.SetValue(lf1);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarUTee = function (x, y, w, h, tw, tf, lf1, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);
    this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tf = this.tf.GetValue();
        var lf1 = this.lf1.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var bs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y - h / 2 + cc + bs); // 1
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y + h / 2 - tf + cc + bs); //2
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + bs, y + h / 2 - tf + cc + bs); //3
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + bs, y + h / 2 - cc - bs); //4

        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y + h / 2 - cc - bs); //4
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + tw - cc - bs, y + h / 2 - cc - bs); //4

        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 - cc - bs);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 - tf + cc + bs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + tw - cc - bs, y + h / 2 - tf + cc + bs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + tw - cc - bs, y - h / 2 + cc + bs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y - h / 2 + cc + bs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, bs, bs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.lf1.SetValue(lf1);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};


uicanvas2dgraphics.Tube = function (x, y, w, h, t) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);

    this.Render = function (renderer) {
        renderer.DrawTube(this.x.value, this.y.value, this.w.value, this.h.value, this.t.value, this.t.value, this.t.value, this.t.value, this.property);
    };
};
uicanvas2dgraphics.SectionTube = function (x, y, w, h, t) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);
    this.t.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var t = this.t.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";
            var symt = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symt = "t";
            }

            var unit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dt = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dt = symt + " = " + uiframework.settings.Format(t) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dt = uiframework.settings.Format(t) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dt = symt;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xl + t, yb, -this.dimoffset, dt, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var t = this.t.GetValue();
        this.shape = new uicanvas2dgraphics.Tube(x, y, w, h, t);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value / 2;
        var h = this.h.value / 2;
        var t = this.t.value;

        var mesh = {};
        mesh.Area = [];

        var area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h - t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h - t, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h + t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h + t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h, 0));
        mesh.Area.push(area);

        return mesh;
    };

    this.Bounds = function () {
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - w / 2;
        bounds.y1 = y - h / 2;

        bounds.x2 = x + w / 2;
        bounds.y2 = y + h / 2;

        return bounds;
    };

    this.UpdateLimits = function () {
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        if (w < h) {
            this.w.min = this.t.GetValue() * 2;
            this.h.min = this.t.GetValue() * 2;
            this.t.max = w / 2;
        } else {
            this.w.min = this.t.GetValue() * 2;
            this.h.min = this.t.GetValue() * 2;
            this.t.max = h / 2;
        }

    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.t.SetValue(t);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnTube = function (x, y, w, h, t, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.w.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.h.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 50, 20000);
        this.t.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
        this.cc.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
    };

    this.InitializeRebars = function () {
        this.InitializeRebarsRect();
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var t = this.t.value;

        this.section = new uicanvas2dgraphics.SectionTube(x, y, w, h, t);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarRectangleColumn(x, y, w, h, this.cc, this.corner, this.middle, this.count1, this.count2);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, w, h, this.cc.value, this.corner.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.t.SetValue(t);
    };

    this.UpdateBarCount2Limit = function () {
        this.count1.min = 0;
        this.count1.max = Math.floor((this.w.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count1.SetValue(this.count1.value);
        this.count1.UpdateText();

        //this.count1.Show();
    };

    this.UpdateBarCount3Limit = function () {
        this.count2.min = 0;
        this.count2.max = Math.floor((this.h.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count2.SetValue(this.count2.value);
        this.count2.UpdateText();

        //this.count2.Show();
    };

    this.UpdateRebars = function (enums, value) {
        this.corner.enums = enums;
        this.corner.value = value;
        this.middle.enums = enums;
        this.middle.value = value;
    };

    this.Initialize();

    this.UpdateBarCount2Limit();
    this.UpdateBarCount3Limit();

    this.UpdateMesh();
};
uicanvas2dgraphics.BeamSectionTube = function (x, y, w, h, t) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 100, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.lx = new uiframework.PropertyDouble("Length, Lx", 4000, common.unit.length, 0.1, 20000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);
    this.ly = new uiframework.PropertyDouble("Length, Ly", 4000, common.unit.length, 0.1, 20000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var t = this.t.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";
            var symt = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symt = "t";
            }

            var unit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dt = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dt = symt + " = " + uiframework.settings.Format(t) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dt = uiframework.settings.Format(t) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dt = symt;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xl + t, yb, -this.dimoffset, dt, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var t = this.t.GetValue();
        this.shape = new uicanvas2dgraphics.Tube(x, y, w, h, t);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value / 2;
        var h = this.h.value / 2;
        var t = this.t.value;

        var mesh = {};
        mesh.Area = [];

        var area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h - t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h - t, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h + t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h + t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h, 0));
        mesh.Area.push(area);

        return mesh;
    };

    this.Bounds = function () {
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - w / 2;
        bounds.y1 = y - h / 2;

        bounds.x2 = x + w / 2;
        bounds.y2 = y + h / 2;

        return bounds;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.t.SetValue(t);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SteelSectionTube = function (x, y, w, h, t) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);

    this.cat1 = new uiframework.PropertyCategory("Loads");
    this.p = new uiframework.PropertyDouble("Maximum Axial Load, P", 100, common.unit.weight, 0.1, 10000);
    this.mx = new uiframework.PropertyDouble("Maximum Moment, Mx", 0, common.unit.moment, 0.1, 10000);
    this.vx = new uiframework.PropertyDouble("Maximum Shear, Vx", 0, common.unit.force, 0.1, 10000);
    this.my = new uiframework.PropertyDouble("Maximum Moment, My", 0, common.unit.moment, 0.1, 10000);
    this.vy = new uiframework.PropertyDouble("Maximum Shear, Vy", 0, common.unit.force, 0.1, 10000);

    this.cat2 = new uiframework.PropertyCategory("Material Strength");
    this.fy = new uiframework.PropertyDouble("Steel Yield Strength, Fy", 240, common.unit.stress, 0.1, 10000);
    this.fu = new uiframework.PropertyDouble("Steel Tensile, Fu", 400, common.unit.stress, 0.1, 10000);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var t = this.t.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";
            var symt = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symt = "t";
            }

            var unit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dt = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dt = symt + " = " + uiframework.settings.Format(t) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dt = uiframework.settings.Format(t) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dt = symt;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xl + t, yb, -this.dimoffset, dt, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var t = this.t.GetValue();
        this.shape = new uicanvas2dgraphics.Tube(x, y, w, h, t);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value / 2;
        var h = this.h.value / 2;
        var t = this.t.value;

        var mesh = {};
        mesh.Area = [];

        var area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h - t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y + h - t, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + t, y - h + t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h + t, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - t, y - h, 0));
        mesh.Area.push(area);

        return mesh;
    };

    this.Bounds = function () {
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - w / 2;
        bounds.y1 = y - h / 2;

        bounds.x2 = x + w / 2;
        bounds.y2 = y + h / 2;

        return bounds;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.t.SetValue(t);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.UTube = function (x, y, w, h, tw1, tw2, tf1, tf2) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.tw1 = new uiframework.PropertyDouble("Thickness Web 1, tw1", tw1, common.unit.length, 0.1, 20000);
    this.tw2 = new uiframework.PropertyDouble("Thickness Web 2, tw2", tw2, common.unit.length, 0.1, 20000);

    this.tf1 = new uiframework.PropertyDouble("Thickness Flange 1, tf1", tf1, common.unit.length, 0.1, 20000);
    this.tf2 = new uiframework.PropertyDouble("Thickness Flange 2, tf2", tf2, common.unit.length, 0.1, 20000);

    this.Render = function (renderer) {

        renderer.DrawTube(this.x.value, this.y.value, this.w.value, this.h.value, this.tw1.value, this.tw2.value, this.tf1.value, this.tf2.value, this.property);
    };

    //    this.UpdateMesh = function () {
    //        var x = this.x.value;
    //        var y = this.y.value;
    //        var w = this.w.value;
    //        var h = this.h.value;
    //        var tw1 = this.tw1.value;
    //        var tw2 = this.tw2.value;
    //        var tf1 = this.tf1.value;
    //        var tf2 = this.tf2.value;
    //
    //        var yt = y + h / 2;
    //        var yb = y - h / 2;
    //        var y1 = yb - tf1;
    //        var y2 = yt + tf2;
    //
    //        var xl = x - w / 2;
    //        var xr = x + w / 2;
    //        var x1 = xl + tw1;
    //        var x2 = xr - tw2;
    //        
    //        this.points = [];
    ////        this.points.push(new common.Point2F(xl, yb));
    ////        this.points.push(new common.Point2F(xl, yt));
    ////        this.points.push(new common.Point2F(xr, yt));
    ////        this.points.push(new common.Point2F(xr, yb));
    ////        this.points.push(new common.Point2F(xl, yb));
    ////        this.points.push(new common.Point2F(x1, y2));
    ////        this.points.push(new common.Point2F(x1, y1));
    ////        this.points.push(new common.Point2F(x2, y1));
    ////        this.points.push(new common.Point2F(x2, y2));
    ////        this.points.push(new common.Point2F(x1, y2));
    //
    //        this.points.push(new common.Point2F(xl, yb));
    //        this.points.push(new common.Point2F(xr, yb));
    //        this.points.push(new common.Point2F(xr, yt));
    //        this.points.push(new common.Point2F(xl, yt));
    //        this.points.push(new common.Point2F(x1, y2));
    //        this.points.push(new common.Point2F(x2, y2));
    //        this.points.push(new common.Point2F(x2, y1));
    //        this.points.push(new common.Point2F(x1, y1));
    //        this.points.push(new common.Point2F(x1, y2));
    //        this.points.push(new common.Point2F(xl, yt));
    //        
    //        
    //        
    //        
    //        
    //        
    //        
    //
    //        this.Rotate();
    //    };
    //
    //    this.UpdateMesh();
};
uicanvas2dgraphics.SectionUTube = function (x, y, w, h, tw1, tw2, tf1, tf2) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.tw1 = new uiframework.PropertyDouble("Thickness Web 1, tw1", tw1, common.unit.length, 0.1, 20000);
    this.tw1.convert = false;
    this.tw2 = new uiframework.PropertyDouble("Thickness Web 2, tw2", tw2, common.unit.length, 0.1, 20000);
    this.tw2.convert = false;

    this.tf1 = new uiframework.PropertyDouble("Thickness Flange 1, tf1", tf1, common.unit.length, 0.1, 20000);
    this.tf1.convert = false;
    this.tf2 = new uiframework.PropertyDouble("Thickness Flange 2, tf2", tf2, common.unit.length, 0.1, 20000);
    this.tf2.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw1 = this.tw1.GetValue();
            var tw2 = this.tw2.GetValue();
            var tf1 = this.tf1.GetValue();
            var tf2 = this.tf2.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = y + h / 2 - tf1;
            var y2 = y - h / 2 + tf2;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = x - w / 2 + tw1;
            var x2 = x + w / 2 - tw2;

            var symw = "";
            var symh = "";
            var symtw1 = "";
            var symtw2 = "";
            var symtf1 = "";
            var symtf2 = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtw1 = "tw1";
                symtw2 = "tw2";
                symtf1 = "tf1";
                symtf2 = "tf2";
            }

            var unit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dtw1, dtw2, dtf1, dtf2 = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtw1 = symtw1 + " = " + uiframework.settings.Format(tw1) + unit;
                    dtw2 = symtw2 + " = " + uiframework.settings.Format(tw2) + unit;
                    dtf1 = symtf1 + " = " + uiframework.settings.Format(tf1) + unit;
                    dtf2 = symtf2 + " = " + uiframework.settings.Format(tf2) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtw1 = uiframework.settings.Format(tw1) + unit;
                    dtw2 = uiframework.settings.Format(tw2) + unit;
                    dtf1 = uiframework.settings.Format(tf1) + unit;
                    dtf2 = uiframework.settings.Format(tf2) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtw1 = symtw1;
                dtw2 = symtw2;
                dtf1 = symtf1;
                dtf2 = symtf2;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x1, yb, -this.dimoffset, dtw1, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x2, yb, xr, yb, -this.dimoffset, dtw2, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yt, this.dimoffset, dtf1, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, yb, xr, y2, this.dimoffset, dtf2, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw1 = this.tw1.GetValue();
        var tw2 = this.tw2.GetValue();
        var tf1 = this.tf1.GetValue();
        var tf2 = this.tf2.GetValue();

        this.shape = new uicanvas2dgraphics.UTube(x, y, w, h, tw1, tw2, tf1, tf2);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value / 2;
        var h = this.h.value / 2;
        var tw1 = this.tw1.value;
        var tw2 = this.tw2.value;
        var tf1 = this.tf1.value;
        var tf2 = this.tf2.value;

        var mesh = {};
        mesh.Area = [];

        var area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + tw1, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + tw1, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - tw2, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - tw2, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w, y - h, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + tw1, y + h - tf1, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + tw1, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - tw2, y + h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - tw2, y + h - tf1, 0));
        mesh.Area.push(area);

        area = {};
        area.Points = [];
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + tw1, y - h, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x - w + tw1, y - h + tf2, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - tw2, y - h + tf2, 0));
        area.Points.push(uicanvas2dgraphics.GenerateMeshPoint(x + w - tw2, y - h, 0));
        mesh.Area.push(area);

        return mesh;
    };

    this.Bounds = function () {
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - w / 2;
        bounds.y1 = y - h / 2;

        bounds.x2 = x + w / 2;
        bounds.y2 = y + h / 2;    //y + h / 2;

        return bounds;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw1.GetValue() + this.tw2.GetValue();
        this.h.min = this.tf1.GetValue() + this.tf2.GetValue();
        this.tw1.max = this.w.GetValue() - this.tw2.GetValue();
        this.tw2.max = this.w.GetValue() - this.tw1.GetValue();
        this.tf1.max = this.h.GetValue() - this.tf2.GetValue();
        this.tf2.max = this.h.GetValue() - this.tf1.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw1.SetValue(tw1);
        this.tw2.SetValue(tw2);
        this.tf1.SetValue(tf1);
        this.tf2.SetValue(tf2);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnUTube = function (x, y, w, h, tw1, tw2, tf1, tf2, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.w.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.h.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };

        this.tw1 = new uiframework.PropertyDouble("Thickness Web 1, tw1", tw1, common.unit.length, 50, 20000);
        this.tw1.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.tw2 = new uiframework.PropertyDouble("Thickness Web 2, tw2", tw2, common.unit.length, 50, 20000);
        this.tw2.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };

        this.tf1 = new uiframework.PropertyDouble("Thickness Flange 1, tf1", tf1, common.unit.length, 50, 20000);
        this.tf1.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.tf2 = new uiframework.PropertyDouble("Thickness Flange 2, tf2", tf2, common.unit.length, 50, 20000);
        this.tf2.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
        this.cc.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
    };

    this.InitializeRebars = function () {
        this.InitializeRebarsRect();
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw1 = this.tw1.value;
        var tw2 = this.tw2.value;
        var tf1 = this.tf1.value;
        var tf2 = this.tf2.value;

        this.section = new uicanvas2dgraphics.SectionUTube(x, y, w, h, tw1, tw2, tf1, tf2);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarRectangleColumn(x, y, w, h, this.cc, this.corner, this.middle, this.count1, this.count2);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, w, h, this.cc.value, this.corner.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw1.SetValue(tw1);
        this.tw2.SetValue(tw2);
        this.tf1.SetValue(tf1);
        this.tf2.SetValue(tf2);
    };

    this.UpdateBarCount2Limit = function () {
        this.count1.min = 0;
        this.count1.max = Math.floor((this.w.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count1.SetValue(this.count1.value);
        this.count1.UpdateText();

        //this.count1.Show();
    };

    this.UpdateBarCount3Limit = function () {
        this.count2.min = 0;
        this.count2.max = Math.floor((this.h.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count2.SetValue(this.count2.value);
        this.count2.UpdateText();

        //this.count2.Show();
    };

    this.UpdateRebars = function (enums, value) {
        this.corner.enums = enums;
        this.corner.value = value;
        this.middle.enums = enums;
        this.middle.value = value;
    };

    this.Initialize();

    this.UpdateBarCount2Limit();
    this.UpdateBarCount3Limit();

    this.UpdateMesh();
};

uicanvas2dgraphics.Trapezoid = function (x, y, wb, wt, h) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, undefined, h);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wt, common.unit.length, 0.1, 20000);
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wb, common.unit.length, 0.1, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wb = this.wbot.value;
        var h = this.h.value;
        var wt = this.wtop.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - wb / 2, y - h / 2); //1
        this.points[this.points.length] = new common.Point2F(x - wt / 2, y + h / 2); //2
        this.points[this.points.length] = new common.Point2F(x + wt / 2, y + h / 2); //3
        this.points[this.points.length] = new common.Point2F(x + wb / 2, y - h / 2); //4
        this.points[this.points.length] = new common.Point2F(x - wb / 2, y - h / 2); //1

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionTrapezoid = function (x, y, wb, wt, h) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, undefined, h);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wt, common.unit.length, 0.1, 20000);
    this.wtop.convert = false;
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wb, common.unit.length, 0.1, 20000);
    this.wbot.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var wb = this.wbot.GetValue();
            var h = this.h.GetValue();
            var wt = this.wtop.GetValue();

            var symwb = "";
            var symh = "";
            var symwt = "";

            if (this.showdimsymbol) {
                symwb = "wb";
                symh = "h";
                symwt = "wt";
            }

            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var maxw = Math.max(wb, wt);
            var tmax = Math.max(maxw, h);
            this.dimoffset = tmax * 0.1;

            var dwb, dwt, dh = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dwb = symwb + " = " + uiframework.settings.Format(wb) + unit;
                    dwt = symwt + " = " + uiframework.settings.Format(wt) + unit;
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                } else {
                    dwb = uiframework.settings.Format(wb) + unit;
                    dwt = uiframework.settings.Format(wt) + unit;
                    dh = uiframework.settings.Format(h) + unit;
                }
            } else {
                dwb = symwb;
                dwt = symwt;
                dh = symh;
            }

            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x - wb / 2, y - h / 2, x + wb / 2, y - h / 2, -this.dimoffset, dwb, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x - wt / 2, y + h / 2, x + wt / 2, y + h / 2, this.dimoffset, dwt, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(x - maxw / 2, y - h / 2, x - maxw / 2, y + h / 2, -this.dimoffset, dh, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {

        this.w = new uiframework.PropertyDouble("Width, w", Math.max(this.wtop.value, this.wbot.value), common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var wt = this.wtop.GetValue();
        var wb = this.wbot.GetValue();
        var h = this.h.GetValue();

        this.shape = new uicanvas2dgraphics.Trapezoid(x, y, wb, wt, h);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var wb = this.wbot.value;
        var wt = this.wtop.value;
        var h = this.h.value;
        var shape = new uicanvas2dgraphics.Trapezoid(x, y, wb, wt, h);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2]);
        mesh.Area.push(area);

        area = shape.ExtractArea([0, 2, 3]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.wb.SetValue(wb);
        this.wt.SetValue(wt);
        this.h.SetValue(h);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnTrapezoid = function (x, y, wb, wt, h, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.h.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wb, common.unit.length, 50, 20000);
        this.wbot.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.wtop = new uiframework.PropertyDouble("Width Top, wt", wt, common.unit.length, 50, 20000);
        this.wtop.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
        this.cc.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
    };

    this.InitializeRebars = function () {
        this.InitializeRebarsRect();
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var wt = this.wtop.value;
        var wb = this.wbot.value;
        var h = this.h.value;

        this.section = new uicanvas2dgraphics.SectionTrapezoid(x, y, wb, wt, h);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarTrapezoidColumn(x, y, wb, wt, h, this.cc, this.corner, this.middle, this.count1, this.count2);
        this.rebars.push(rebar);

        //Initialize Ties
        //        if (hideties === undefined) {
        //        this.ties = [];
        //        this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, w, h, this.cc.value, this.corner.value.value / 2));
        //        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.wb.SetValue(wb);
        this.wt.SetValue(wt);
        this.h.SetValue(h);
    };

    this.UpdateBarCount2Limit = function () {
        this.count1.min = 0;
        this.count1.max = Math.floor((this.w.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count1.SetValue(this.count1.value);
        this.count1.UpdateText();

        //this.count1.Show();
    };

    this.UpdateBarCount3Limit = function () {
        this.count2.min = 0;
        this.count2.max = Math.floor((this.h.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count2.SetValue(this.count2.value);
        this.count2.UpdateText();

        //this.count2.Show();
    };

    this.UpdateRebars = function (enums, value) {
        this.corner.enums = enums;
        this.corner.value = value;
        this.middle.enums = enums;
        this.middle.value = value;
    };

    this.Initialize();

    this.UpdateBarCount2Limit();
    this.UpdateBarCount3Limit();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarTrapezoidColumn = function (x, y, wb, wt, h, cc, cb, mid, along2, along3) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.wtop = new uiframework.PropertyDouble("Width Top, wt", wt, common.unit.length, 0.1, 20000);
    this.wbot = new uiframework.PropertyDouble("Width Bottom, wb", wb, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);

    this.corner = cb;
    this.mid = mid;
    this.along2 = along2;
    this.along3 = along3;
    this.cc = cc;

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var awb = this.wbot.GetValue();
        var awt = this.wtop.GetValue();
        var ah = this.h.GetValue();
        var o = this.cc.GetValue();

        var cb = this.corner.value.value * common.unit.length.value.value / 2;
        var mid = this.mid.value.value * common.unit.length.value.value / 2;

        var along2no = this.along2.value;
        var along3no = this.along3.value;

        var wb = awb / 2 - o;
        var wt = awt / 2 - o;
        var h = ah / 2 - o;

        this.points = [];

        //        this.points = [];
        var point1 = new common.Point2F(x - wb / 2, y - h / 2); //1
        var point2 = new common.Point2F(x - wt / 2, y + h / 2); //2
        var point3 = new common.Point2F(x + wt / 2, y + h / 2); //3
        var point4 = new common.Point2F(x + wb / 2, y - h / 2); //4

        var line1 = new common.Line2F(point1.x, point1.y, point2.x, point2.y);
        var line2 = new common.Line2F(point2.x, point2.y, point3.x, point3.y);
        var line3 = new common.Line2F(point3.x, point3.y, point4.x, point4.y);
        var line4 = new common.Line2F(point1.x, point1.y, point4.x, point4.y);

        var l1a = line1.GetAngleRad();
        var ox = (o + cb) / Math.cos(l1a);

        line1.Move(ox, 0);
        line2.Move(0, -(o + cb));
        line3.Move(-ox, 0);
        line4.Move(0, o + cb);

        //Corner Bars
        var intersection = line1.GetLineIntersection(line4);
        this.points.push(new common.Point2F(intersection.x, intersection.y));
        intersection = line2.GetLineIntersection(line1);
        this.points.push(new common.Point2F(intersection.x, intersection.y));
        intersection = line3.GetLineIntersection(line2);
        this.points.push(new common.Point2F(intersection.x, intersection.y));
        intersection = line4.GetLineIntersection(line3);
        this.points.push(new common.Point2F(intersection.x, intersection.y));

        //Side
        //        for (i = 1; i <= along3no; i++) {
        //            var y = (ay - (h - mid) + 2 * i * (h - mid) / (along3no + 1));
        //            this.points[this.points.length] = new common.Point2F(ax - w + mid, y, mid);
        //            this.points[this.points.length] = new common.Point2F(ax + wt - mid, y, mid);
        //        }

        //Bottom
        //        for (i = 1; i <= along2no; i++) {
        //            var x = (ax - (w - mid) + 2 * i * (w - mid) / (along2no + 1));
        //            this.points[this.points.length] = new common.Point2F(x, ay - h + mid, mid);
        //            var x = (ax - (w - mid) + 2 * i * (w - mid) / (along2no + 1));
        //            this.points[this.points.length] = new common.Point2F(x, ay + h - mid, mid);
        //        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.wb.SetValue(wb);
        this.wt.SetValue(wt);
        this.h.SetValue(h);
        this.cc.SetValue(cc);
        this.cb.SetValue(cb);
        this.mid.SetValue(mid);
        this.along2.SetValue(along2);
        this.along3.SetValue(along3);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.Rectangle = function (x, y, w, h) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionRectangle = function (x, y, w, h) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.name.value = "Rectangle";

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        this.shape = new uicanvas2dgraphics.Rectangle(x, y, w, h);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var shape = new uicanvas2dgraphics.Rectangle(x, y, w, h);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2, 3]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.RCRectangle = function (x, y, w, h) {
    uicanvas2dgraphics.RCBase.call(this);

    this.type = BEAMDESIGNOPTION.DESIGN;

    //Design Option
    this.catoptions = new uiframework.PropertyCategory("Options");
    //this.catoptions.visible = false;

    this.designoption = new uiframework.PropertyEnum("Design Option", this.type, BEAMDESIGNOPTION);
    this.designoption.height = 145;
    //this.designoption.visible = false;

    this.InitializeDesignActions();
    this.InitializeRebars();

    this.cat1 = new uiframework.PropertyCategory("Dimensions");
    this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
    this.x.visible = false;

    this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
    this.y.visible = false;

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", 60, common.unit.length);
    if (common.unit.length.value.value !== 1) {
        common.RoundDimension(this.cc, 0.5);
    }

    this.InitializeMaterials();

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;

        this.section = new uicanvas2dgraphics.SectionRectangle(x, y, w, h);
        this.rebars = [];
        this.ties = [];

        if (this.showrebars || this.designoption.value.value === BEAMDESIGNOPTION.INVESTIGATE.value) {
            var topbar = this.topbar.nobars;
            var botbar = this.botbar.nobars;
            var webbar = this.webbar.nobars;
            var cover = this.cc.value;

            //Initialize Rebars
            var rebar = new uicanvas2dgraphics.RebarRectangleBeam(x, y, w, h, cover, botbar, topbar, webbar, 0);
            rebar.topbar.barsize = this.topbar.barsize;
            rebar.botbar.barsize = this.botbar.barsize;
            rebar.sidebar.barsize = this.webbar.barsize;
            rebar.UpdateMesh();

            this.rebars.push(rebar);

            //Initialize Ties
            if (this.botbar.barsize)
                this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, w, h, cover, this.topbar.barsize.value / 2, this.botbar.barsize.value / 2));
            else
                this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, w, h, cover, this.topbar.barsize.value / 2, 0));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnRectangle = function (x, y, w, h, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.w.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };

        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.h.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
        this.cc.postevent = function () {
            self.UpdateBarCount2Limit();
            self.UpdateBarCount3Limit();
        };
    };

    this.InitializeRebars = function () {
        this.InitializeRebarsRect();
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;

        this.section = new uicanvas2dgraphics.SectionRectangle(x, y, w, h);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarRectangleColumn(x, y, w, h, this.cc, this.corner, this.middle, this.count1, this.count2);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, w, h, this.cc.value, this.corner.value.value / 2));
        }

    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
    };

    this.UpdateBarCount2Limit = function () {
        this.count1.min = 0;
        this.count1.max = Math.floor((this.w.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count1.SetValue(this.count1.value);
        this.count1.UpdateText();

        //this.count1.Show();
    };

    this.UpdateBarCount3Limit = function () {
        this.count2.min = 0;
        this.count2.max = Math.floor((this.h.value - 2 * this.cc.value + this.minspacing.value) / (this.middle.value.value + this.minspacing.value));

        //To update min and max
        this.count2.SetValue(this.count2.value);
        this.count2.UpdateText();

        //this.count2.Show();
    };

    this.UpdateRebars = function (enums, value) {
        this.corner.enums = enums;
        this.corner.value = value;
        this.middle.enums = enums;
        this.middle.value = value;
    };

    this.Initialize();

    this.UpdateBarCount2Limit();
    this.UpdateBarCount3Limit();

    this.UpdateMesh();
};
uicanvas2dgraphics.RectangularFooting = function (x, y, w, h) {
    uicanvas2dgraphics.RCBase.call(this);

    this.catdesign = new uiframework.PropertyCategory("Design Actions");
    this.pu = new uiframework.PropertyDouble("Axial, Pu", 100, common.unit.force);
    this.mx = new uiframework.PropertyDouble("Moment, Mx", 50, common.unit.moment);
    this.my = new uiframework.PropertyDouble("Moment, My", 0, common.unit.moment);
    this.loadfactor = new uiframework.PropertyDouble("Load Factor", 1.45);

    this.catdimension = new uiframework.PropertyCategory("Dimensions");
    this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
    this.x.visible = false;
    this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
    this.y.visible = false;
    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.w.visible = false;
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.h.visible = false;

    this.colwidth = new uiframework.PropertyDouble("Column Width", 500, common.unit.length);
    this.colheight = new uiframework.PropertyDouble("Column Height", 500, common.unit.length);

    this.lx = new uiframework.PropertyDouble("Lx", 2000, common.unit.length);
    this.ly = new uiframework.PropertyDouble("Ly", 2000, common.unit.length);
    this.thicknessedge = new uiframework.PropertyDouble("Edge Thickness", 250, common.unit.length);
    this.thicknesscenter = new uiframework.PropertyDouble("Center Thickness", 350, common.unit.length);

    this.cc = new uiframework.PropertyDouble("Clear Cover", 50, common.unit.length);

    this.catlevel = new uiframework.PropertyCategory("Levels");
    this.hso = new uiframework.PropertyDouble("Hso", 1000, common.unit.length, 0.1, 20000);
    this.nsl = new uiframework.PropertyDouble("NSL", 20000, common.unit.length, 0.1, 20000);
    this.excl = new uiframework.PropertyDouble("Excavation Level", 99000, common.unit.length, 0.1, 20000);

    this.InitializeMaterials();
    this.fy.value = 410;
    this.fc.value = 21;
    this.fys.visible = false;
    this.soilallow = new uiframework.PropertyDouble("Soil Allow. Bearing Cap.", 150000, common.unit.stress);
    this.soildensity = new uiframework.PropertyDouble("Soil Density", 18000 / 9.80665, common.unit.density); // ([18000 N/m3] / 9.80665) kg/m3
    this.concdensity = new uiframework.PropertyDouble("Concrete Density", 24000 / 9.80665, common.unit.density); // ([24000 N/m3] / 9.80665) kg/m3

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;

        this.section = new uicanvas2dgraphics.SectionRectangle(x, y, w, h);
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.RebarRectangleBeam = function (x, y, w, h, o, bb, tb, sb) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length);

    this.w = new uiframework.PropertyDouble("Width, W", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, H", h, common.unit.length, 0.1, 20000);

    this.topbar = new uiframework.PropertyRebar("Top Bar, TB", tb, METRIC.d16);
    this.botbar = new uiframework.PropertyRebar("Bottom Bar, BB", bb, METRIC.d16);
    this.sidebar = new uiframework.PropertyRebar("Side Bar, SB", sb, METRIC.d16);
    this.offset = new uiframework.PropertyDouble("Offset", o, common.unit.length, .1, .1, .1);

    this.UpdateMesh = function () {
        var ax = this.x.GetValue();
        var ay = this.y.GetValue();
        var aw = this.w.GetValue();
        var ah = this.h.GetValue();
        var o = this.offset.GetValue();

        var tb = this.topbar.barsize.value * common.unit.length.value.value / 2;
        var bt = 0;

        if (this.botbar.barsize)
            bt = this.botbar.barsize.value * common.unit.length.value.value / 2;

        var sb = this.sidebar.barsize.value * common.unit.length.value.value / 2;

        var tbno = this.topbar.nobars - 2;
        var btno = this.botbar.nobars - 2;
        var sbno = this.sidebar.nobars;

        var w = aw / 2 - o;
        var h = ah / 2 - o;

        this.points = [];

        //Corner Bars
        this.points.push(new common.Point2F(ax - w + tb, ay + h - tb, tb));
        this.points.push(new common.Point2F(ax - w + bt, ay - h + bt, bt));
        this.points.push(new common.Point2F(ax + w - tb, ay + h - tb, tb));
        this.points.push(new common.Point2F(ax + w - bt, ay - h + bt, bt));

        //Side
        var level = 1;

        for (var i = 1; i <= sbno; i++) {
            var y = (ay - (h - sb) + 2 * level * (h - sb) / (Math.ceil(sbno / 2) + 1));

            if (i % 2 === 1) {
                //Left Web
                this.points[this.points.length] = new common.Point2F(ax - w + sb, y, sb);
            } else {
                //Right Web
                level++;
                this.points[this.points.length] = new common.Point2F(ax + w - sb, y, sb);
            }
        }

        //Bottom
        for (var i = 1; i <= btno; i++) {
            var x = (ax - (w - bt) + 2 * i * (w - bt) / (btno + 1));
            this.points[this.points.length] = new common.Point2F(x, ay - h + bt, bt);
        }

        //Top
        for (var i = 1; i <= tbno; i++) {
            var x = (ax - (w - tb) + 2 * i * (w - tb) / (tbno + 1));
            this.points[this.points.length] = new common.Point2F(x, ay + h - tb, tb);
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.o.SetValue(o);
        this.bb.SetValue(bb);
        this.tb.SetValue(tb);
        this.sb.SetValue(sb);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarRectangleColumn = function (x, y, w, h, cc, cb, mid, along2, along3) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length);

    this.w = new uiframework.PropertyDouble("Width, W", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, H", h, common.unit.length, 0.1, 20000);

    this.corner = cb;
    this.mid = mid;
    this.along2 = along2;
    this.along3 = along3;
    this.cc = cc;

    this.UpdateMesh = function () {
        var ax = this.x.GetValue();
        var ay = this.y.GetValue();
        var aw = this.w.GetValue();
        var ah = this.h.GetValue();
        var o = this.cc.GetValue();

        var cb = this.corner.value.value * common.unit.length.value.value / 2;
        var mid = this.mid.value.value * common.unit.length.value.value / 2;

        var along2no = this.along2.value;
        var along3no = this.along3.value;

        var w = aw / 2 - o;
        var h = ah / 2 - o;

        this.points = [];

        //Corner Bars
        this.points.push(new common.Point2F(ax - w + cb, ay + h - cb, cb));
        this.points.push(new common.Point2F(ax - w + cb, ay - h + cb, cb));
        this.points.push(new common.Point2F(ax + w - cb, ay + h - cb, cb));
        this.points.push(new common.Point2F(ax + w - cb, ay - h + cb, cb));

        //Side
        for (i = 1; i <= along3no; i++) {
            var y = (ay - (h - mid) + 2 * i * (h - mid) / (along3no + 1));
            this.points[this.points.length] = new common.Point2F(ax - w + mid, y, mid);
            this.points[this.points.length] = new common.Point2F(ax + w - mid, y, mid);
        }

        //Bottom
        for (i = 1; i <= along2no; i++) {
            var x = (ax - (w - mid) + 2 * i * (w - mid) / (along2no + 1));
            this.points[this.points.length] = new common.Point2F(x, ay - h + mid, mid);
            var x = (ax - (w - mid) + 2 * i * (w - mid) / (along2no + 1));
            this.points[this.points.length] = new common.Point2F(x, ay + h - mid, mid);
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.cc.SetValue(cc);
        this.cb.SetValue(cb);
        this.mid.SetValue(mid);
        this.along2.SetValue(along2);
        this.along3.SetValue(along3);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.TieRectangle = function (x, y, w, h, o, tb, bb) {
    uicanvas2dgraphics.TieBase.call(this);

    this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);

    this.w = new uiframework.PropertyDouble("Width, W", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, H", h, common.unit.length, 0.1, 20000);

    this.radiusrebarcorner = new uiframework.PropertyDouble("Top R Corner", tb, common.unit.length, 0.001, 0.1, 10);
    this.radiusrebarcornertop = new uiframework.PropertyDouble("Bottom R Corner", bb, common.unit.length, 0.001, 0.1, 10);
    this.offset = new uiframework.PropertyDouble("Offset", o, common.unit.length, .1, .1, .1);

    this.UpdateMesh = function () {
        var ax = this.x.GetValue();
        var ay = this.y.GetValue();
        var aw = this.w.GetValue();
        var ah = this.h.GetValue();

        var arbc = this.radiusrebarcorner.GetValue();
        var artc = arbc;

        if (this.radiusrebarcornertop.value !== undefined)
            artc = this.radiusrebarcornertop.GetValue();

        var aoffset = this.offset.GetValue();

        var w = aw / 2 - aoffset;
        var h = ah / 2 - aoffset;

        var x1 = ax - aw / 2 + aoffset;
        var x2 = ax + aw / 2 - aoffset;
        var y1 = ay - ah / 2 + aoffset;
        var y2 = ay + ah / 2 - aoffset;

        this.points = [];

        this.points[this.points.length] = new common.Point2F(ax - w, ay + h - arbc, arbc);
        this.points[this.points.length] = new common.Point2F(ax - w, ay - h + artc, artc);

        this.points[this.points.length] = new common.Point2F(ax - w + arbc, ay + h, arbc);
        this.points[this.points.length] = new common.Point2F(ax + w - arbc, ay + h, arbc);

        this.points[this.points.length] = new common.Point2F(ax + w, ay + h - arbc, arbc);
        this.points[this.points.length] = new common.Point2F(ax + w, ay - h + artc, artc);

        this.points[this.points.length] = new common.Point2F(ax + w - artc, ay - h, arbc);
        this.points[this.points.length] = new common.Point2F(ax - w + artc, ay - h, arbc);

        var r2 = (arbc / Math.sqrt(2));

        x1 = x1 + arbc;
        y1 = y2 - arbc;
        x2 = x1 - r2;
        y2 = y1 - r2;

        var x3 = x2 + 3 * (arbc) * Math.cos(0);
        var y3 = y2 - 3 * (arbc) * Math.sin(90);

        this.points[this.points.length] = new common.Point2F(x2, y2, arbc);
        this.points[this.points.length] = new common.Point2F(x3, y3, arbc);

        var x2 = x1 + r2;
        var y2 = y1 + r2;

        x3 = x2 + 3 * (arbc) * Math.cos(0);
        y3 = y2 - 3 * (arbc) * Math.sin(90);

        this.points[this.points.length] = new common.Point2F(x2, y2, arbc);
        this.points[this.points.length] = new common.Point2F(x3, y3, arbc);
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.o.SetValue(o);
        this.tb.SetValue(tb);
        this.bb.SetValue(bb);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.Plus = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;

        this.points = [];
        this.points.push(new common.Point2F(x - tw / 2, y - h / 2));
        this.points.push(new common.Point2F(x - tw / 2, y - tf / 2));
        this.points.push(new common.Point2F(x - w / 2, y - tf / 2));
        this.points.push(new common.Point2F(x - w / 2, y + tf / 2));
        this.points.push(new common.Point2F(x - tw / 2, y + tf / 2));
        this.points.push(new common.Point2F(x - tw / 2, y + h / 2));
        this.points.push(new common.Point2F(x + tw / 2, y + h / 2));
        this.points.push(new common.Point2F(x + tw / 2, y + tf / 2));
        this.points.push(new common.Point2F(x + w / 2, y + tf / 2));
        this.points.push(new common.Point2F(x + w / 2, y - tf / 2));
        this.points.push(new common.Point2F(x + tw / 2, y - tf / 2));
        this.points.push(new common.Point2F(x + tw / 2, y - h / 2));
        this.points.push(new common.Point2F(x - tw / 2, y - h / 2));

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionPlus = function (x, y, w, h, tw, tf) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();

            var symw = "";
            var symh = "";
            var symtw = "";
            var symtf = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtw = "tw";
                symtf = "tf";
            }
            var unit = "";

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dtw, dtf = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtw = symtw;
                dtf = symtf;
            }


            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(x - w / 2, y - h / 2, x - w / 2, y + h / 2, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x - w / 2, y + h / 2, x + w / 2, y + h / 2, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(x + w / 2, y - tf / 2, x + w / 2, y + tf / 2, this.dimoffset, dtf, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x - tw / 2, y - h / 2, x + tw / 2, y - h / 2, -this.dimoffset, dtw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();

        this.shape = new uicanvas2dgraphics.Plus(x, y, w, h, tw, tf);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var shape = new uicanvas2dgraphics.Plus(x, y, w, h, tw, tf);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 5, 6, 11]);
        mesh.Area.push(area);

        area = shape.ExtractArea([1, 2, 3, 4]);
        mesh.Area.push(area);

        area = shape.ExtractArea([7, 8, 9, 10]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw.GetValue();
        this.h.min = this.tf.GetValue();
        this.tw.max = this.w.GetValue();
        this.tf.max = this.h.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnPlus = function (x, y, w, h, tw, tf, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);
        this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionPlus(x, y, w, h, tw, tf);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarPlus(x, y, w, h, tw, tf, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, y, w, tf, this.cc.value, this.bar.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarPlus = function (x, y, w, h, tw, tf, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length);

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tf = this.tf.GetValue();
        var tw = this.tw.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var bs = this.bar.value * common.unit.length.value.value / 2;

        var x1 = x - w / 2 + cc + bs;
        var x2 = x - cc + bs;
        var x3 = x - (-cc + bs);
        var x4 = x - (-w / 2 + cc + bs);
        var y1 = y - h / 2 + cc + bs;
        var y2 = y - cc + bs;
        var y3 = y - (-cc + bs);
        var y4 = y - (-h / 2 + cc + bs);

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x2, y1); // 1
        this.points[this.points.length] = new common.Point2F(x2, y2); // 2
        this.points[this.points.length] = new common.Point2F(x1, y2); // 3
        this.points[this.points.length] = new common.Point2F(x1, y3); // 4
        this.points[this.points.length] = new common.Point2F(x2, y3); // 5
        this.points[this.points.length] = new common.Point2F(x2, y4); // 6
        this.points[this.points.length] = new common.Point2F(x3, y4); // 7
        this.points[this.points.length] = new common.Point2F(x3, y3); // 8
        this.points[this.points.length] = new common.Point2F(x4, y3); // 9
        this.points[this.points.length] = new common.Point2F(x4, y2); // 10
        this.points[this.points.length] = new common.Point2F(x3, y2); // 11
        this.points[this.points.length] = new common.Point2F(x3, y1); // 12
        this.points[this.points.length] = new common.Point2F(x2, y1); // 1

        //        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y + h / 2 - cc - bs); //4
        //
        //        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y + h / 2 - cc - bs);
        //        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y + h / 2 - cc - bs - lf2);
        //        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 - cc - bs - lf2);
        //        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 + cc + bs - lf2 - tf);
        //        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y + h / 2 + cc + bs - lf2 - tf);
        //        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y - h / 2 + cc + bs);
        //        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y - h / 2 + cc + bs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, bs, bs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.UPlus = function (x, y, w, h, tw, tf, lf1, lf2) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 0.1, 20000);
    this.lf2 = new uiframework.PropertyDouble("Flange Length 2, lf2", lf2, common.unit.length, 0.1, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var lf1 = this.lf1.value;
        var lf2 = this.lf2.value;

        this.points = [];
        this.points.push(new common.Point2F(x - w / 2 + lf1, y - h / 2)); //1
        this.points.push(new common.Point2F(x - w / 2 + lf1, y + h / 2 - tf - lf2)); //2
        this.points.push(new common.Point2F(x - w / 2, y + h / 2 - tf - lf2)); //3
        this.points.push(new common.Point2F(x - w / 2, y + h / 2 - lf2)); //4
        this.points.push(new common.Point2F(x - w / 2 + lf1, y + h / 2 - lf2)); //5
        this.points.push(new common.Point2F(x - w / 2 + lf1, y + h / 2)); //6
        this.points.push(new common.Point2F(x - w / 2 + lf1 + tw, y + h / 2)); //7
        this.points.push(new common.Point2F(x - w / 2 + lf1 + tw, y + h / 2 - lf2)); //8
        this.points.push(new common.Point2F(x + w / 2, y + h / 2 - lf2)); //9
        this.points.push(new common.Point2F(x + w / 2, y + h / 2 - lf2 - tf)); //10
        this.points.push(new common.Point2F(x - w / 2 + lf1 + tw, y + h / 2 - lf2 - tf)); //11
        this.points.push(new common.Point2F(x - w / 2 + lf1 + tw, y - h / 2)); //12
        this.points.push(new common.Point2F(x - w / 2 + lf1, y - h / 2)); //1

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionUPlus = function (x, y, w, h, tw, tf, lf1, lf2) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h, tw, tf);

    this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 0, 20000);
    this.lf1.convert = false;
    this.lf2 = new uiframework.PropertyDouble("Flange Length 2, lf2", lf2, common.unit.length, 0, 20000);
    this.lf2.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var tw = this.tw.GetValue();
            var tf = this.tf.GetValue();
            var lf1 = this.lf1.GetValue();
            var lf2 = this.lf2.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;
            var y1 = yt - lf2;
            var y2 = yt - lf2 - tf;

            var xl = x - w / 2;
            var xr = x + w / 2;
            var x1 = xl + lf1;
            var x2 = xl + lf1 + tw;

            var symw = "";
            var symh = "";
            var symtw = "";
            var symtf = "";
            var symlf1 = "";
            var symlf2 = "";

            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                symtw = "tw";
                symtf = "tf";
                symlf1 = "lf1";
                symlf2 = "lf2";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, dtw, dlf1, dlf2, dtf = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    dtw = symtw + " = " + uiframework.settings.Format(tw) + unit;
                    dtf = symtf + " = " + uiframework.settings.Format(tf) + unit;
                    dlf1 = symlf1 + " = " + uiframework.settings.Format(lf1) + unit;
                    dlf2 = symlf2 + " = " + uiframework.settings.Format(lf2) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    dtw = uiframework.settings.Format(tw) + unit;
                    dtf = uiframework.settings.Format(tf) + unit;
                    dlf1 = uiframework.settings.Format(lf1) + unit;
                    dlf2 = uiframework.settings.Format(lf2) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                dtf = symtf;
                dtw = symtw;
                dlf1 = symlf1;
                dlf2 = symlf2;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yb, xl, yt, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xr, yt, this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, x1, yb, -this.dimoffset, dlf1, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(x1, yb, x2, yb, -this.dimoffset, dtw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y1, xr, yt, this.dimoffset, dlf2, x, y));
            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xr, y2, xr, y1, this.dimoffset, dtf, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tw = this.tw.GetValue();
        var tf = this.tf.GetValue();
        var lf1 = this.lf1.GetValue();
        var lf2 = this.lf2.GetValue();

        this.shape = new uicanvas2dgraphics.UPlus(x, y, w, h, tw, tf, lf1, lf2);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var lf1 = this.lf1.value;
        var lf2 = this.lf2.value;
        var shape = new uicanvas2dgraphics.UPlus(x, y, w, h, tw, tf, lf1, lf2);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 5, 6, 11]);
        mesh.Area.push(area);

        var area = shape.ExtractArea([1, 2, 3, 4]);
        mesh.Area.push(area);

        var area = shape.ExtractArea([7, 8, 9, 10]);
        mesh.Area.push(area);

        return mesh;
    };

    this.UpdateLimits = function () {
        this.w.min = this.tw.GetValue() + this.lf1.GetValue();
        this.h.min = this.tf.GetValue() + this.lf2.GetValue();
        this.tw.max = this.w.GetValue() - this.lf1.GetValue();
        this.tf.max = this.h.GetValue() - this.lf2.GetValue();
        this.lf1.max = this.w.GetValue() - this.tw.GetValue();
        this.lf2.max = this.h.GetValue() - this.tf.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.lf1.SetValue(lf1);
        this.lf2.SetValue(lf2);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnUPlus = function (x, y, w, h, tw, tf, lf1, lf2, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 50, 20000);
        this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 50, 20000);
        this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 50, 20000);
        this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 50, 20000);

        this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 50, 20000);
        this.lf2 = new uiframework.PropertyDouble("Flange Length 2, lf2", lf2, common.unit.length, 50, 20000);
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var tw = this.tw.value;
        var tf = this.tf.value;
        var lf1 = this.lf1.value;
        var lf2 = this.lf2.value;
        var cc = this.cc.value;
        var spacing = this.spacing.value;

        this.section = new uicanvas2dgraphics.SectionUPlus(x, y, w, h, tw, tf, lf1, lf2);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarUPlus(x, y, w, h, tw, tf, lf1, lf2, cc, this.bar.value, spacing);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x - w / 2 + lf1 + tw / 2, y, tw, h, this.cc.value, this.bar.value.value / 2));
            this.ties.push(new uicanvas2dgraphics.TieRectangle(x, (y + h / 2 - tf / 2) - lf2, w, tf, this.cc.value, this.bar.value.value / 2));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.lf1.SetValue(lf1);
        this.lf2.SetValue(lf2);
    };

    this.UpdateRebars = function (enums, value) {
        this.bar.enums = enums;
        this.bar.value = value;
    };

    this.Initialize();

    this.UpdateMesh();
};
uicanvas2dgraphics.RebarUPlus = function (x, y, w, h, tw, tf, lf1, lf2, o, bs, spacing) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length);

    this.w = new uiframework.PropertyDouble("Width, w", w, common.unit.length, 0.1, 20000);
    this.h = new uiframework.PropertyDouble("Height, h", h, common.unit.length, 0.1, 20000);
    this.tw = new uiframework.PropertyDouble("Thickness Web, tw", tw, common.unit.length, 0.1, 20000);
    this.tf = new uiframework.PropertyDouble("Thickness Flange, tf", tf, common.unit.length, 0.1, 20000);

    this.lf1 = new uiframework.PropertyDouble("Flange Length 1, lf1", lf1, common.unit.length, 0.1, 20000);
    this.lf2 = new uiframework.PropertyDouble("Flange Length 2, lf2", lf2, common.unit.length, 0.1, 20000);

    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length);

    //this.corner = cbs;
    this.bar = bs;
    this.spacing = new uiframework.PropertyDouble("Spacing", spacing, common.unit.length, 25, 1000);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var tf = this.tf.GetValue();
        var tw = this.tw.GetValue();
        var lf1 = this.lf1.GetValue();
        var lf2 = this.lf2.GetValue();
        var spacing = this.spacing.GetValue();
        var cc = this.cc.GetValue();
        var bs = this.bar.value * common.unit.length.value.value / 2;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y - h / 2 + cc + bs); // 1
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y + h / 2 - tf + cc + bs - lf2); //2
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + bs, y + h / 2 - tf + cc + bs - lf2); //3
        this.points[this.points.length] = new common.Point2F(x - w / 2 + cc + bs, y + h / 2 - cc - bs - lf2); //4

        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y + h / 2 - cc - bs - lf2); //4
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y + h / 2 - cc - bs); //4

        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y + h / 2 - cc - bs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y + h / 2 - cc - bs - lf2);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 - cc - bs - lf2);
        this.points[this.points.length] = new common.Point2F(x + w / 2 - cc - bs, y + h / 2 + cc + bs - lf2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y + h / 2 + cc + bs - lf2 - tf);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 - cc - bs + tw, y - h / 2 + cc + bs);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + lf1 + cc + bs, y - h / 2 + cc + bs);

        var rebars = new uicanvas2dgraphics.PolylineRebar(this.points, bs, bs, spacing);
        this.points = rebars.points;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.tw.SetValue(tw);
        this.tf.SetValue(tf);
        this.lf1.SetValue(lf1);
        this.lf2.SetValue(lf2);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.spacing.SetValue(spacing);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.Triangle = function (x, y, w, h) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionTriangle = function (x, y, w, h) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";
            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        this.shape = new uicanvas2dgraphics.Triangle(x, y, w, h);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;

        var shape = new uicanvas2dgraphics.Triangle(x, y, w, h);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.UTriangle = function (x, y, w, h, aoffset) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.aoffset = new uiframework.PropertyDouble("Top Offset, a", aoffset, common.unit.length, 0.1, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var aoffset = this.aoffset.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2 + aoffset, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionUTriangle = function (x, y, w, h, aoffset) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.aoffset = new uiframework.PropertyDouble("Top Offset, a", aoffset, common.unit.length, 0, 20000);
    this.aoffset.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();
            var aoffset = this.aoffset.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";
            var syma = "";
            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
                syma = "a";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw, da = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                    da = syma + " = " + uiframework.settings.Format(aoffset) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                    da = uiframework.settings.Format(aoffset) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
                da = syma;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xl + aoffset, yt, this.dimoffset, da, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();
        var aoffset = this.aoffset.GetValue();

        this.shape = new uicanvas2dgraphics.UTriangle(x, y, w, h, aoffset);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var aoffset = this.aoffset.value;

        var shape = new uicanvas2dgraphics.UTriangle(x, y, w, h, aoffset);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
        this.aoffset.SetValue(aoffset);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.EquiTriangle = function (x, y, alength) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y);
    this.alength = new uiframework.PropertyDouble("Side Length, a", alength, common.unit.length, 0.1, 20000);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var alength = this.alength.value;
        var h = this.alength.value * Math.sin(((Math.PI / 180) * 60));

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - alength / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + alength / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - alength / 2, y - h / 2);

        this.w = new uiframework.PropertyDouble("W", alength, common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.h = new uiframework.PropertyDouble("H", h, common.unit.length, 0.1, 20000);
        this.h.visible = false;

        this.aheight = h;
        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionEquiTriangle = function (x, y, alength) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.alength = new uiframework.PropertyDouble("Side Length, a", alength, common.unit.length, 0.1, 20000);
    this.alength.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.alength.GetValue();
            var h = this.alength.GetValue() * Math.sin(((Math.PI / 180) * 60));

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";

            if (this.showdimsymbol) {
                symw = "a";
                symh = "h";
            }

            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmax = Math.max(w, h);
            this.dimoffset = tmax * 0.1;

            var dh, dw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var alength = this.alength.value;

        this.shape = new uicanvas2dgraphics.EquiTriangle(x, y, alength);

        this.w = new uiframework.PropertyDouble("W", alength, common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.h = new uiframework.PropertyDouble("H", this.shape.aheight, common.unit.length, 0.1, 20000);
        this.h.visible = false;
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var alength = this.alength.value;
        var shape = new uicanvas2dgraphics.EquiTriangle(x, y, alength);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.alength.SetValue(alength);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.RightTriangle = function (x, y, w, h) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;

        this.points = [];
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y + h / 2);
        this.points[this.points.length] = new common.Point2F(x + w / 2, y - h / 2);
        this.points[this.points.length] = new common.Point2F(x - w / 2, y - h / 2);

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionRightTriangle = function (x, y, w, h) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y, w, h);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var w = this.w.GetValue();
            var h = this.h.GetValue();

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symw = "";
            var symh = "";
            if (this.showdimsymbol) {
                symw = "w";
                symh = "h";
            }
            var unit = "";
            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
            }

            var tmin = Math.max(w, h);
            this.dimoffset = tmin * 0.1;

            var dh, dw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dh = symh + " = " + uiframework.settings.Format(h) + unit;
                    dw = symw + " = " + uiframework.settings.Format(w) + unit;
                } else {
                    dh = uiframework.settings.Format(h) + unit;
                    dw = uiframework.settings.Format(w) + unit;
                }
            } else {
                dh = symh;
                dw = symw;
            }

            this.dimensions.push(new uicanvas2dgraphics.VertDimLine(xl, yt, xl, yb, -this.dimoffset, dh, x, y));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yb, xr, yb, -this.dimoffset, dw, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var w = this.w.GetValue();
        var h = this.h.GetValue();

        this.shape = new uicanvas2dgraphics.RightTriangle(x, y, w, h);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var w = this.w.value;
        var h = this.h.value;
        var shape = new uicanvas2dgraphics.RightTriangle(x, y, w, h);

        var mesh = {};
        mesh.Area = [];

        var area = shape.ExtractArea([0, 1, 2]);
        mesh.Area.push(area);

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.w.SetValue(w);
        this.h.SetValue(h);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.RegularPolygon = function (x, y, r, n) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length);
    this.n = new uiframework.PropertyInteger("No. of Sides", n);

    this.UpdateMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var n = this.n.value;

        this.points = [];

        //http://slabode.exofire.net/circle_draw.shtml

        var theta = 2 * 3.1415926 / n;
        var tfactor = Math.tan(theta);//calculate the tangential factor 
        var rfactor = Math.cos(theta);//calculate the radial factor 

        var x1 = 0;
        var y1 = r;

        var tx;
        var ty;

        for (var i = 0; i < n; i++) {
            this.points.push(new common.Point2F(x1 + x, y1 + y));

            tx = -y1;
            ty = x1;

            //add the tangential vector 
            x1 += tx * tfactor;
            y1 += ty * tfactor;

            //correct using the radial factor 
            x1 *= rfactor;
            y1 *= rfactor;
        }

        this.Rotate();
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionRegularPolygon = function (x, y, r, n) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;
    this.n = new uiframework.PropertyInteger("No. of Sides", n, undefined, 3, 256);

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();
            var n = this.n.GetValue();

            var theta = 0.5 * (Math.PI - (2 * Math.PI / n) * (n / 2 - 1)) * 180 / Math.PI;
            var alpha = 0.5 * (Math.PI - (2 * Math.PI / n) * Math.floor(n / 2)) * 180 / Math.PI;

            var w = r * 2;
            var h = r * 2;

            var yt = y + h / 2;
            var yb = y - h / 2;

            var xl = x - w / 2;
            var xr = x + w / 2;

            var symr = "";
            var symt = "";
            var syma = "";

            if (this.showdimsymbol)
                symr = "R";
            symt = "θ";
            syma = "α";

            var unit = "";
            var aunit = "";

            if (this.showunits) {
                unit = common.unit.length.value.name;
                aunit = common.unit.angle.value.symbol;
            }

            this.dimoffset = r * 0.2;

            var calpha = alpha;
            var ctheta = theta;
            var cr = r;

            var dd, dt, da = "";

            if (this.showdimvalue)
                dd = symr + " = " + (r) + unit;
            else
                dd = symr;

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dd = symr + " = " + uiframework.settings.Format(cr) + unit;
                    da = syma + " = " + uiframework.settings.Format(calpha) + aunit;
                    dt = symt + " = " + uiframework.settings.Format(ctheta) + aunit;
                } else {
                    dd = uiframework.settings.Format(cr) + unit;
                    da = uiframework.settings.Format(calpha) + aunit;
                    dt = uiframework.settings.Format(ctheta) + aunit;
                }
            } else {
                dd = symr;
                da = syma;
                dt = symt;
            }

            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, yt, xl + r, yt, this.dimoffset, dd, unit, x, y));

            if (n % 4 !== 0) {
                if (n % 2 !== 0) {
                    if ((n + 1) % 4 === 0)
                        this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 0, alpha, 0.5 * this.dimoffset, da));
                    else
                        this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 360 - alpha, 360, 0.5 * this.dimoffset, da));

                    this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 90, 90 + theta, 0.5 * this.dimoffset, dt));
                } else {
                    this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 360 - theta, 360, 0.5 * this.dimoffset, dt));
                }
            }

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }

    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var n = this.n.GetValue();

        this.shape = new uicanvas2dgraphics.RegularPolygon(x, y, r, n);

        //this.objects = [];

        var circle = new uicanvas2dgraphics.Circle(x, y, r);
        circle.property.scale = false;
        circle.property.linecolor = "#CCC";
        circle.property.showfill = false;
        this.backobjects.push(circle);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var n = this.n.value;
        var shape = new uicanvas2dgraphics.RegularPolygon(x, y, r, n);

        var mesh = {};
        mesh.Area = [];

        for (var i = 0; i < n; i++) {
            var pt0 = uicanvas2dgraphics.GenerateMeshPoint(x, y, 0);
            var pt1;
            var pt2;
            if (i === n - 1) {
                pt1 = uicanvas2dgraphics.GenerateMeshPoint(shape.points[0].x, shape.points[0].y, 0);
                pt2 = uicanvas2dgraphics.GenerateMeshPoint(shape.points[i].x, shape.points[i].y, 0);
            } else {
                pt1 = uicanvas2dgraphics.GenerateMeshPoint(shape.points[i + 1].x, shape.points[i + 1].y, 0);
                pt2 = uicanvas2dgraphics.GenerateMeshPoint(shape.points[i].x, shape.points[i].y, 0);
            }
            var area = {};
            area.Points = [];

            area.Points.push(pt0);
            area.Points.push(pt1);
            area.Points.push(pt2);

            mesh.Area.push(area);
        }

        return mesh;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.n.SetValue(n);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.ShapeCircle = function (x, y, r) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length);

    this.Render = function (renderer) {
        //renderer.DrawCircle(this.x.value, this.y.value, this.r.value, this.property);
        this.polygon.property = this.property;
        this.polygon.Render(renderer);
    };

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();

        this.polygon = new uicanvas2dgraphics.RegularPolygon(x, y, r, 64);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.SectionCircle = function (x, y, r) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();

            var yt = y + r;
            var yb = y - r;

            var xl = x - r;
            var xr = x + r;

            var symr = "";

            if (this.showdimsymbol) {
                symr = "R";
            }

            var unit = "";
            this.dimoffset = 0;

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var dw = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dw = symr + " = " + uiframework.settings.Format(r) + unit;
                } else {
                    dw = uiframework.settings.Format(r) + unit;
                }
            } else {
                dw = symr;
            }

            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLine(x, y, r, 90 - 90 / 2, -this.dimoffset, dw));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {

        this.w = new uiframework.PropertyDouble("Width, w", this.r.value * 2, common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.h = new uiframework.PropertyDouble("Height, h", this.r.value * 2, common.unit.length, 0.1, 20000);
        this.h.visible = false;

        this.UpdateSection();

        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;

        this.shape = new uicanvas2dgraphics.ShapeCircle(x, y, r);
        this.shape.property = this.property;
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var n = 27; //For shear stress plot. IMPORTANT: Don't Change. //32;

        var points = [];

        var theta = 2 * 3.1415926 / n;
        var tfactor = Math.tan(theta);//calculate the tangential factor 
        var rfactor = Math.cos(theta);//calculate the radial factor 

        var x1 = 0;
        var y1 = r;

        var tx;
        var ty;

        for (var i = 0; i < n; i++) {
            points.push(new common.Point2F(x1 + x, y1 + y));

            tx = -y1;
            ty = x1;

            //add the tangential vector 
            x1 += tx * tfactor;
            y1 += ty * tfactor;

            //correct using the radial factor 
            x1 *= rfactor;
            y1 *= rfactor;
        }

        var mesh = {};
        mesh.Area = [];

        var pt0;
        var pt1;
        var pt2;
        var pt3;

        for (var i = 0; i < n; i++) {
            var pt0 = uicanvas2dgraphics.GenerateMeshPoint(x, y, 0);
            var pt1;
            var pt2;

            if (i === n - 1) {
                pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[0].x, points[0].y, 0);
                pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);

            } else {
                pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i + 1].x, points[i + 1].y, 0);
                pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
            }

            var area = {};
            area.Points = [];

            area.Points.push(pt0);
            area.Points.push(pt1);
            area.Points.push(pt2);

            mesh.Area.push(area);
        }

        return mesh;
    };

    this.Bounds = function () {
        var r = this.r.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - r;
        bounds.y1 = y - r;

        bounds.x2 = x + r;
        bounds.y2 = y + r;

        return bounds;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnCircle = function (x, y, r, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000, 0.1, 20000);
        this.y.visible = false;

        this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 50, 20000);
        this.r.postevent = function () {
            self.UpdateBarCountLimit();
        };
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
        this.cc.postevent = function () {
            self.UpdateBarCountLimit();
        };
    };

    this.InitializeRebars = function () {
        this.InitializeRebarsCircle();
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var cc = this.cc.value;

        this.section = new uicanvas2dgraphics.SectionCircle(x, y, r);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarCircle(x, y, r, cc, this.size.value.value, this.count.value);
        this.rebars.push(rebar);

        //Initialize Ties;
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieCircle(x, y, r, cc, this.size.value.value));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
    };

    this.UpdateBarCountLimit = function () {
        var smin = 25;
        this.count.min = 0;
        this.count.max = Math.floor((2 * Math.PI * (this.r.value - this.cc.value - (this.size.value.value / 2))) / (this.size.value.value + smin));

        if (this.count.value > this.count.max) {
            //To update min and max
            this.count.SetValue(this.count.value);
            this.count.UpdateText();
        }
    };

    this.UpdateRebars = function (enums, value) {
        this.size.enums = enums;
        this.size.value = value;
    };

    this.Initialize();

    this.UpdateBarCountLimit();
    this.UpdateMesh();
};
uicanvas2dgraphics.RebarCircle = function (x, y, r, o, bs, bc) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.r = new uiframework.PropertyDouble("Width, W", r, common.unit.length, 0.1, 20000);
    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);
    this.bar = new uiframework.PropertyRebar("Bars", bc, bs);

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var cc = this.cc.GetValue();
        var n = this.bar.nobars;
        var size = this.bar.barsize * common.unit.length.value.value / 2;

        this.points = [];

        var theta = 2 * 3.1415926 / n;
        var tfactor = Math.tan(theta);//calculate the tangential factor 
        var rfactor = Math.cos(theta);//calculate the radial factor 

        var x1 = 0;
        var y1 = r - cc - size;

        var tx;
        var ty;

        for (var i = 0; i < n; i++) {
            this.points.push(new common.Point2F(x1 + x, y1 + y, size));

            tx = -y1;
            ty = x1;

            //add the tangential vector 
            x1 += tx * tfactor;
            y1 += ty * tfactor;

            //correct using the radial factor 
            x1 *= rfactor;
            y1 *= rfactor;
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
        this.bc.SetValue(bc);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.TieCircle = function (x, y, r, o, bs) {
    uicanvas2dgraphics.TieBase.call(this);

    this.x = new uiframework.PropertyDouble("X", x, common.unit.length, 0.1, 20000);
    this.y = new uiframework.PropertyDouble("Y", y, common.unit.length, 0.1, 20000);

    this.r = new uiframework.PropertyDouble("Width, W", r, common.unit.length, 0.1, 20000);
    this.cc = new uiframework.PropertyDouble("Clear Cover", o, common.unit.length, 0.1, 20000);
    this.bs = bs;

    this.loop = true;

    this.UpdateMesh = function () {
        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var cc = this.cc.GetValue();
        var n = 32;

        this.points = [];

        var theta = 2 * 3.1415926 / n;
        var tfactor = Math.tan(theta);//calculate the tangential factor 
        var rfactor = Math.cos(theta);//calculate the radial factor 

        var x1 = 0;
        var y1 = r - cc;

        var tx;
        var ty;

        for (var i = 0; i < n; i++) {
            this.points.push(new common.Point2F(x1 + x, y1 + y));

            tx = -y1;
            ty = x1;

            //add the tangential vector 
            x1 += tx * tfactor;
            y1 += ty * tfactor;

            //correct using the radial factor 
            x1 *= rfactor;
            y1 *= rfactor;
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.o.SetValue(o);
        this.bs.SetValue(bs);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.Tendon = function (x, y, r) {
    uicanvas2dgraphics.ShapeCircle.call(this, x, y, r);

    this.x.visible = true;
    this.y.visible = true;
    this.r.visible = false;

    this.property.linecolor = "#333";
    this.property.fillcolor = "#777";

    this.force = new uiframework.PropertyDouble("Force", 0, common.unit.force);
    this.force.allownegative = true;

    this.Bounds = function () {
        return this.polygon.Bounds();
    };
};

uicanvas2dgraphics.QuarterCircle = function (x, y, r) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, r);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);

    this.property.thickness = 2;

    this.Render = function (renderer) {
        var sa = 225;
        var ea = 315;

        sa *= Math.PI / 180;
        ea *= Math.PI / 180;

        renderer.DrawSector(this.x.value, this.y.value, this.r.value, sa, ea, this.property);
    };
};
uicanvas2dgraphics.SectionQuarterCircle = function (x, y, r) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;
    this.a = new uiframework.PropertyDouble("Angle, θ", 90, common.unit.angle);
    this.a.convert = false;
    this.a.visible = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();
            var a = this.a.GetValue();

            var ah = Math.PI * ((180 - a) / 2) / 180;

            var yt = y + r;
            var yb = y - r;

            var xl = x - r;
            var xr = x;

            var symr = "";
            var syma = "";

            if (this.showdimsymbol) {
                symr = "R";
                syma = "θ";
            }

            this.dimoffset = r * 0.2;

            var unit = "";
            var aunit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
                aunit = " " + common.unit.angle.value.symbol;
            }

            var dw, da = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dw = symr + " = " + uiframework.settings.Format(r) + unit;
                    da = syma + " = " + uiframework.settings.Format(a) + aunit;
                } else {
                    dw = uiframework.settings.Format(r) + unit;
                    da = uiframework.settings.Format(a) + aunit;
                }
            } else {
                dw = symr;
                da = syma;
            }

            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLine(x, y, r, 90 - a / 2, -this.dimoffset, dw));
            this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 270 - a / 2, 270 + a / 2, 0.5 * this.dimoffset, da));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var a = this.a.GetValue();

        this.shape = new uicanvas2dgraphics.QuarterCircle(x, y, r, 270 - a / 2, 270 + a / 2);

        //this.objects = [];
        var circle = new uicanvas2dgraphics.Circle(x, y, r);
        circle.property.thickness = 2;
        circle.property.linecolor = "#CCC";
        circle.property.showfill = false;
        this.backobjects.push(circle);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var a = this.a.value;
        var n = 32;

        var points = [];

        var theta = 2 * 3.1415926 / n;
        var tfactor = Math.tan(theta);//calculate the tangential factor 
        var rfactor = Math.cos(theta);//calculate the radial factor 

        var x1 = 0;
        var y1 = r;

        var tx;
        var ty;

        for (var i = 0; i < n; i++) {
            points.push(new common.Point2F(x1 + x, y1 + y));

            tx = -y1;
            ty = x1;

            //add the tangential vector 
            x1 += tx * tfactor;
            y1 += ty * tfactor;

            //correct using the radial factor 
            x1 *= rfactor;
            y1 *= rfactor;
        }

        var mesh = {};
        mesh.Area = [];

        //var area = this.ExtractArea([0, 1, 2]);
        //mesh.Area.push(area);

        for (var i = 0; i < n; i++) {
            if (i < 4 || i >= 28) {
                var pt0 = uicanvas2dgraphics.GenerateMeshPoint(x, y, 0);
                var pt1;
                var pt2;
                if (i === n - 1) {
                    pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[0].x, points[0].y, 0);
                    pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
                } else {
                    pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i + 1].x, points[i + 1].y, 0);
                    pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
                }
                var area = {};
                area.Points = [];

                area.Points.push(pt0);
                area.Points.push(pt1);
                area.Points.push(pt2);

                mesh.Area.push(area);
            }

        }

        return mesh;
    };

    this.Bounds = function () {
        var r = this.r.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - r;
        bounds.y1 = y - r;

        bounds.x2 = x + r;
        bounds.y2 = y + r;

        return bounds;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.SemiCircle = function (x, y, r) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y, r);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);

    this.property.thickness = 2;

    this.Render = function (renderer) {
        var sa = 180;
        var ea = 0;

        sa *= Math.PI / 180;
        ea *= Math.PI / 180;

        renderer.DrawSector(this.x.value, this.y.value, this.r.value, sa, ea, this.property);
    };
};
uicanvas2dgraphics.SectionSemiCircle = function (x, y, r) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;
    this.a = new uiframework.PropertyDouble("Angle, θ", 180, common.unit.angle);
    this.a.convert = false;
    this.a.visible = false;


    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();
            var a = this.a.GetValue();

            var yt = y + r;
            var yb = y - r;

            var xl = x - r;
            var xr = x;

            var symr = "";
            var syma = "";

            if (this.showdimsymbol) {
                symr = "R";
                syma = "θ";
            }

            var unit = "";
            this.dimoffset = r * 0.2;

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var dw, da = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dw = symr + " = " + uiframework.settings.Format(r) + unit;
                    //da = syma + " = " + uiframework.settings.Format(a) + unit;
                } else {
                    dw = uiframework.settings.Format(r) + unit;
                    //da = uiframework.settings.Format(a) + unit;
                }
            } else {
                dw = symr;
                da = syma;
            }

            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLine(x, y, r, 90 - a / 2, -this.dimoffset, dw));
            //            this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 270 - a / 2, 270 + a / 2, this.dimoffset, da));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {

        this.w = new uiframework.PropertyDouble("Width, w", this.r.value * 2, common.unit.length, 0.1, 20000);
        this.w.visible = false;

        this.h = new uiframework.PropertyDouble("Height, h", this.r.value * 2, common.unit.length, 0.1, 20000);
        this.h.visible = false;

        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var a = this.a.GetValue();

        this.shape = new uicanvas2dgraphics.SemiCircle(x, y, r, 270 - a / 2, 270 + a / 2);

        //this.objects = [];
        var circle = new uicanvas2dgraphics.Circle(x, y, r);
        circle.property.thickness = 2;
        circle.property.linecolor = "#CCC";
        circle.property.showfill = false;
        this.backobjects.push(circle);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var a = this.a.value;
        var n = 32;

        var points = [];

        var theta = 2 * 3.1415926 / n;
        var tfactor = Math.tan(theta);//calculate the tangential factor 
        var rfactor = Math.cos(theta);//calculate the radial factor 

        var x1 = 0;
        var y1 = r;

        var tx;
        var ty;

        for (var i = 0; i < n; i++) {
            points.push(new common.Point2F(x1 + x, y1 + y));

            tx = -y1;
            ty = x1;

            //add the tangential vector 
            x1 += tx * tfactor;
            y1 += ty * tfactor;

            //correct using the radial factor 
            x1 *= rfactor;
            y1 *= rfactor;
        }

        points.push(points[0]);

        var mesh = {};
        mesh.Area = [];

        for (var i = 0; i < n; i++) {
            if (i < 8 || i >= 24) {
                var pt0 = uicanvas2dgraphics.GenerateMeshPoint(x, y, 0);
                var pt1;
                var pt2;
                if (i === n - 1) {
                    pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[0].x, points[0].y, 0);
                    pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
                } else {
                    pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i + 1].x, points[i + 1].y, 0);
                    pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
                }
                var area = {};
                area.Points = [];

                area.Points.push(pt0);
                area.Points.push(pt1);
                area.Points.push(pt2);

                mesh.Area.push(area);
            }

        }

        return mesh;
    };

    this.Bounds = function () {
        var r = this.r.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - r;
        bounds.y1 = y - r;

        bounds.x2 = x + r;
        bounds.y2 = y + r;

        return bounds;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.HollowCircle = function (x, y, r, t) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y);

    this.r = new uiframework.PropertyDouble("Outer Radius, R", r, common.unit.length, 0.1, 20000);
    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);

    this.property.thickness = 2;

    this.Render = function (renderer) {
        renderer.DrawPipe(this.x.value, this.y.value, this.r.value, (this.r.value - this.t.value), this.property);
    };
};
uicanvas2dgraphics.SectionHollowCircle = function (x, y, r, t) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);

    this.r = new uiframework.PropertyDouble("Outer Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;
    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);
    this.t.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();
            var t = this.t.GetValue();

            var yt = y + r;
            var yb = y - r;

            var xl = x - r;
            var xr = x + r;

            var symr = "";
            var symt = "";

            if (this.showdimsymbol) {
                symr = "R";
                symt = "t";
            }

            var unit = "";
            this.dimoffset = r * 0.2;

            if (this.showunits)
                unit = " " + common.unit.length.value.name;

            var dr, dt = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dr = symr + " = " + uiframework.settings.Format(r) + unit;
                    dt = symt + " = " + uiframework.settings.Format(t) + unit;
                } else {
                    dr = uiframework.settings.Format(r) + unit;
                    dt = uiframework.settings.Format(t) + unit;
                }
            } else {
                dr = symr;
                dt = symt;
            }

            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLine(x, y, r, 90 - 90 / 2, 0, dr));
            this.dimensions.push(new uicanvas2dgraphics.HorzDimLine(xl, y, xl + t, y, 0.5 * this.dimoffset, dt, x, y));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var t = this.t.GetValue();

        this.shape = new uicanvas2dgraphics.HollowCircle(x, y, r, t);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var t = this.t.value;
        var n = 32;

        var points = [];
        var points2 = [];

        var theta = 2 * 3.1415926 / n;
        var tfactor = Math.tan(theta);//calculate the tangential factor 
        var rfactor = Math.cos(theta);//calculate the radial factor 

        var x1 = 0;
        var x2 = 0;

        var y1 = r;
        var y2 = r - t;

        var tx;
        var ty;
        var tx2;
        var ty2;

        for (var i = 0; i < n; i++) {
            points.push(new common.Point2F(x1 + x, y1 + y));
            points2.push(new common.Point2F(x2 + x, y2 + y));

            //1
            tx = -y1;
            ty = x1;

            //add the tangential vector 
            x1 += tx * tfactor;
            y1 += ty * tfactor;

            //correct using the radial factor 
            x1 *= rfactor;
            y1 *= rfactor;

            //2
            tx2 = -y2;
            ty2 = x2;

            //add the tangential vector 
            x2 += tx2 * tfactor;
            y2 += ty2 * tfactor;

            //correct using the radial factor 
            x2 *= rfactor;
            y2 *= rfactor;
        }

        var mesh = {};
        mesh.Area = [];

        //var area = this.ExtractArea([0, 1, 2]);
        //mesh.Area.push(area);

        for (var i = 0; i < n; i++) {
            var pt0;
            var pt1;
            var pt2;
            var pt3;
            if (i === n - 1) {
                pt0 = uicanvas2dgraphics.GenerateMeshPoint(points2[i].x, points2[i].y, 0);
                pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
                pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[0].x, points[0].y, 0);
                pt3 = uicanvas2dgraphics.GenerateMeshPoint(points2[0].x, points2[0].y, 0);
            } else {
                pt0 = uicanvas2dgraphics.GenerateMeshPoint(points2[i + 1].x, points2[i + 1].y, 0);
                pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i + 1].x, points[i + 1].y, 0);
                pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
                pt3 = uicanvas2dgraphics.GenerateMeshPoint(points2[i].x, points2[i].y, 0);
            }
            var area = {};
            area.Points = [];

            area.Points.push(pt0);
            area.Points.push(pt1);
            area.Points.push(pt2);
            area.Points.push(pt3);

            mesh.Area.push(area);
        }

        return mesh;
    };

    this.Bounds = function () {
        var r = this.r.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - r;
        bounds.y1 = y - r;

        bounds.x2 = x + r;
        bounds.y2 = y + r;

        return bounds;
    };

    this.UpdateLimits = function () {
        this.r.min = this.t.GetValue();
        this.t.max = this.r.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.t.SetValue(t);
    };

    this.UpdateMesh();
};
uicanvas2dgraphics.RCColumnHollowCircle = function (x, y, r, t, hidedesign, hideties) {
    uicanvas2dgraphics.RCColumnBase.call(this);

    var self = this;
    this.hidedesign = hidedesign;

    this.InitializeDimensions = function () {
        //Design Option
        this.cat1 = new uiframework.PropertyCategory("Dimensions");
        this.x = new uiframework.PropertyDouble("Center, X", x, common.unit.length, 0.1, 20000);
        this.x.visible = false;

        this.y = new uiframework.PropertyDouble("Center, Y", y, common.unit.length, 0.1, 20000);
        this.y.visible = false;

        this.r = new uiframework.PropertyDouble("Outer Radius, R", r, common.unit.length, 50, 20000);
        this.r.postevent = function () {
            self.UpdateBarCountLimit();
        };
        this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 50, 20000);
        this.t.postevent = function () {
            self.UpdateBarCountLimit();
        };
        this.cc = new uiframework.PropertyDouble("Clear Cover", 40, common.unit.length, 0.1, 20000);
        if (common.unit.length.value.value !== 1) {
            common.RoundDimension(this.cc, 0.5);
        }
        this.cc.postevent = function () {
            self.UpdateBarCountLimit();
        };
    };

    this.InitializeRebars = function () {
        this.InitializeRebarsCircle();
    };

    this.UpdateProperties = function () {
        switch (this.designoption.value) {
            case BEAMDESIGNOPTION.DESIGN:
                this.ShowRebars(false);
                this.ShowDesignActions(true);
                break;

            default:
                this.ShowRebars(true);
                this.ShowDesignActions(false);
                break;
        }
    };

    this.UpdateMesh = function () {
        //Initialize Section
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var t = this.t.value;
        var cc = this.cc.value;

        this.section = new uicanvas2dgraphics.SectionHollowCircle(x, y, r, t);

        //Initialize Rebars
        this.rebars = [];
        var rebar = new uicanvas2dgraphics.RebarCircle(x, y, r, cc, this.size.value.value, this.count.value);
        this.rebars.push(rebar);

        //Initialize Ties
        if (hideties === undefined) {
            this.ties = [];
            this.ties.push(new uicanvas2dgraphics.TieCircle(x, y, r, cc, this.size.value.value));
        }
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.t.SetValue(t);
    };

    this.UpdateBarCountLimit = function () {
        var smin = 25;
        this.count.min = 0;
        this.count.max = Math.floor((2 * Math.PI * (this.r.value - this.cc.value - (this.size.value.value / 2))) / (this.size.value.value + smin));

        if (this.count.value > this.count.max) {
            //To update min and max
            this.count.SetValue(this.count.value);
            this.count.UpdateText();
        }
    };

    this.UpdateRebars = function (enums, value) {
        this.size.enums = enums;
        this.size.value = value;
    };

    this.Initialize();

    this.UpdateBarCountLimit();
    this.UpdateMesh();
};

uicanvas2dgraphics.Sector = function (x, y, r, sa, ea) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.sa = new uiframework.PropertyDouble("Start Angle, θ", sa, common.unit.angle);
    this.ea = new uiframework.PropertyDouble("End Angle, θ", ea, common.unit.angle);

    this.Render = function (renderer) {
        var sa = this.sa.value;
        var ea = this.ea.value;

        sa *= Math.PI / 180;
        ea *= Math.PI / 180;

        renderer.DrawSector(this.x.value, this.y.value, this.r.value, sa, ea, this.property);
    };
};
uicanvas2dgraphics.SectionSector = function (x, y, r, a) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;
    this.a = new uiframework.PropertyInteger("Angle, θ", a, common.unit.angle, 1, 360);
    this.a.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();
            var a = this.a.GetValue();

            var ah = Math.PI * ((180 - a) / 2) / 180;

            var yt = y + r;
            var yb = y - r;

            var xl = x - r;
            var xr = x;

            var symr = "";
            var syma = "";

            if (this.showdimsymbol) {
                symr = "R";
                syma = "θ";
            }

            this.dimoffset = r * 0.2;

            var unit = "";
            var aunit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
                aunit = " " + common.unit.angle.value.symbol;
            }

            var dw, da = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dw = symr + " = " + uiframework.settings.Format(r) + unit;
                    da = syma + " = " + uiframework.settings.Format(a) + aunit;
                } else {
                    dw = uiframework.settings.Format(r) + unit;
                    da = uiframework.settings.Format(a) + aunit;
                }
            } else {
                dw = symr;
                da = syma;
            }

            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLine(x, y, r, 90 - a / 2, -this.dimoffset, dw));
            this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 270 - a / 2, 270 + a / 2, 0.5 * this.dimoffset, da));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var a = this.a.GetValue();

        this.shape = new uicanvas2dgraphics.Sector(x, y, r, 270 - a / 2, 270 + a / 2);

        //this.objects = [];
        var circle = new uicanvas2dgraphics.Circle(x, y, r);
        circle.property.linecolor = "#CCC";
        circle.property.showfill = false;
        this.backobjects.push(circle);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var a = this.a.value;

        var n = 32;
        if (a <= 45)
            n = 4;
        else if (a <= 90)
            n = 8;
        else if (a <= 135)
            n = 12;
        else if (a <= 180)
            n = 16;
        else if (a <= 225)
            n = 20;
        else if (a <= 270)
            n = 24;
        else if (a <= 315)
            n = 28;

        var points = [];

        var da = a / n;

        var ta = (Math.PI / 180) * a / 2;

        var ptx = r * Math.sin(ta);
        var pty = r * Math.cos(ta);

        var pt = new common.Point2F(ptx, pty);
        points.push(new common.Point2F(ptx, pty));

        for (var i = 0; i < n; i++) {
            pt.Rotate(x, y, da);
            points.push(new common.Point2F(pt.x, pt.y));
        }

        var mesh = {};
        mesh.Area = [];

        for (var i = 0; i < n; i++) {
            var pt0 = uicanvas2dgraphics.GenerateMeshPoint(0, 0, 0);
            var pt1;
            var pt2;
            pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i + 1].x, points[i + 1].y, 0);
            pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
            var area = {};
            area.Points = [];

            area.Points.push(pt0);
            area.Points.push(pt1);
            area.Points.push(pt2);

            mesh.Area.push(area);
        }

        return mesh;
    };

    this.Bounds = function () {
        var r = this.r.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - r;
        bounds.y1 = y - r;

        bounds.x2 = x + r;
        bounds.y2 = y + r;

        return bounds;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.a.SetValue(a);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.CircleArc = function (x, y, r, t, sa, ea) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);
    this.sa = new uiframework.PropertyDouble("Start Angle, θ", sa, common.unit.angle);
    this.ea = new uiframework.PropertyDouble("End Angle, θ", ea, common.unit.angle);

    this.property.thickness = 2;

    this.Render = function (renderer) {
        var sa = this.sa.value;
        var ea = this.ea.value;

        sa *= Math.PI / 180;
        ea *= Math.PI / 180;

        renderer.DrawArcSection(this.x.value, this.y.value, this.r.value, (this.r.value - this.t.value), sa, ea, this.property);
    };
};
uicanvas2dgraphics.SectionCircleArc = function (x, y, r, t, a) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;
    this.t = new uiframework.PropertyDouble("Thickness, t", t, common.unit.length, 0.1, 20000);
    this.t.convert = false;
    this.a = new uiframework.PropertyInteger("Angle, θ", a, common.unit.angle, 1, 360);
    this.a.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();
            var t = this.t.GetValue();
            var a = this.a.GetValue();

            var yt = y + r;
            var yb = y - r;

            var xl = x - r;
            var xr = x;

            var symr = "";
            var syma = "";
            var symt = "";

            if (this.showdimsymbol) {
                symr = "R";
                syma = "θ";
                symt = "t";
            }

            this.dimoffset = r * 0.2;

            var unit = "";
            var aunit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
                aunit = " " + common.unit.angle.value.symbol;
            }

            var dw, da, dt = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dw = symr + " = " + uiframework.settings.Format(r) + unit;
                    da = syma + " = " + uiframework.settings.Format(a) + aunit;
                    dt = symt + " = " + uiframework.settings.Format(t) + unit;
                } else {
                    dw = uiframework.settings.Format(r) + unit;
                    da = uiframework.settings.Format(a) + aunit;
                    dt = uiframework.settings.Format(t) + unit;
                }
            } else {
                dw = symr;
                da = syma;
                dt = symt;
            }

            var aa = a * Math.PI / 180;
            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLine(x, y, r, 90 - a / 2, -this.dimoffset, dw));
            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLineLHS(x - (r - t) * Math.sin(aa / 2), y + (r - t) * Math.cos(aa / 2), t, 90 + a / 2, +this.dimoffset, dt));
            this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 270 - a / 2, 270 + a / 2, 0.5 * this.dimoffset, da));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var t = this.t.GetValue();
        var a = this.a.GetValue();

        this.shape = new uicanvas2dgraphics.CircleArc(x, y, r, t, 270 - a / 2, 270 + a / 2);

        //this.objects = [];
        var circle = new uicanvas2dgraphics.Circle(x, y, r);
        circle.property.thickness = 2;
        circle.property.linecolor = "#CCC";
        circle.property.showfill = false;
        this.backobjects.push(circle);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var t = this.t.value;
        var a = this.a.value;

        var r2 = r - t;
        var n = 32;

        if (a <= 45)
            n = 8;
        else if (a <= 90)
            n = 8;
        else if (a <= 135)
            n = 12;
        else if (a <= 180)
            n = 16;
        else if (a <= 225)
            n = 20;
        else if (a <= 270)
            n = 24;
        else if (a <= 315)
            n = 28;

        var points = [];
        var points2 = [];

        var da = a / n;

        var ta = (Math.PI / 180) * a / 2;

        var ptx = r * Math.sin(ta);
        var pty = r * Math.cos(ta);
        var ptx2 = r2 * Math.sin(ta);
        var pty2 = r2 * Math.cos(ta);

        var pt = new common.Point2F(ptx, pty);
        var ptb = new common.Point2F(ptx2, pty2);
        points.push(new common.Point2F(ptx, pty));
        points2.push(new common.Point2F(ptx2, pty2));

        for (var i = 0; i < n; i++) {
            pt.Rotate(x, y, da);
            ptb.Rotate(x, y, da);
            points.push(new common.Point2F(pt.x, pt.y));
            points2.push(new common.Point2F(ptb.x, ptb.y));
        }

        var mesh = {};
        mesh.Area = [];

        for (var i = 0; i < n; i++) {
            var pt0;
            var pt1;
            var pt2;
            var pt3;

            pt0 = uicanvas2dgraphics.GenerateMeshPoint(points2[i + 1].x, points2[i + 1].y, 0);
            pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i + 1].x, points[i + 1].y, 0);
            pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
            pt3 = uicanvas2dgraphics.GenerateMeshPoint(points2[i].x, points2[i].y, 0);

            var area = {};
            area.Points = [];

            area.Points.push(pt0);
            area.Points.push(pt1);
            area.Points.push(pt2);
            mesh.Area.push(area);

            area.Points.push(pt0);
            area.Points.push(pt2);
            area.Points.push(pt3);
            mesh.Area.push(area);
        }

        return mesh;
    };

    this.Bounds = function () {
        var r = this.r.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - r;
        bounds.y1 = y - r;

        bounds.x2 = x + r;
        bounds.y2 = y + r;

        return bounds;
    };

    this.UpdateLimits = function () {
        this.r.min = this.t.GetValue();
        this.t.max = this.r.GetValue();
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.t.SetValue(t);
        this.a.SetValue(a);
    };

    this.UpdateMesh();

};

uicanvas2dgraphics.Segment = function (x, y, r, a) {
    uicanvas2dgraphics.ShapeBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.a = new uiframework.PropertyDouble("Angle, θ", a, common.unit.angle);

    this.property.thickness = 2;

    this.Render = function (renderer) {
        var a = this.a.value;
        a *= Math.PI / 180;

        renderer.DrawSegment(this.x.value, this.y.value, this.r.value, a, this.property);
    };
};
uicanvas2dgraphics.SectionSegment = function (x, y, r, a) {
    uicanvas2dgraphics.SectionBase.call(this);

    this.ShapeBase(x, y);
    this.r = new uiframework.PropertyDouble("Radius, R", r, common.unit.length, 0.1, 20000);
    this.r.convert = false;
    this.a = new uiframework.PropertyInteger("Angle, θ", a, common.unit.angle, 1, 360);
    this.a.convert = false;

    this.UpdateDimensions = function () {
        this.dimensions = [];

        if (this.showdimlines) {
            var x = this.x.GetValue();
            var y = this.y.GetValue();
            var r = this.r.GetValue();
            var a = this.a.GetValue();

            var yt = y + r;
            var yb = y - r;

            var xl = x - r;
            var xr = x;

            var symr = "";
            var syma = "";
            if (this.showdimsymbol) {
                syma = "θ";
                symr = "R";
            }

            this.dimoffset = r * 0.2;

            var unit = "";
            var aunit = "";

            if (this.showunits) {
                unit = " " + common.unit.length.value.name;
                aunit = " " + common.unit.angle.value.symbol;
            }

            var dw, da = "";

            if (this.showdimvalue) {
                if (this.showdimsymbol) {
                    dw = symr + " = " + uiframework.settings.Format(r) + unit;
                    da = syma + " = " + uiframework.settings.Format(a) + aunit;
                } else {
                    dw = uiframework.settings.Format(r) + unit;
                    da = uiframework.settings.Format(a) + aunit;
                }
            } else {
                dw = symr;
                da = syma;
            }

            this.dimensions.push(new uicanvas2dgraphics.InclinedDimLine(x, y, r, 90 - a / 2, -this.dimoffset, dw));
            this.dimensions.push(new uicanvas2dgraphics.AngularDimLine(x, y, r, 270 - a / 2, 270 + a / 2, 0.5 * this.dimoffset, da));

            for (var i1 = 0; i1 < this.dimensions.length; i1++) {
                this.dimensions[i1].angle = this.angle;
                this.dimensions[i1].UpdateMesh();
                this.dimensions[i1].property.linecolor = this.linecolor;
                this.dimensions[i1].property.fillcolor = this.linecolor;
                this.dimensions[i1].property.textcolor = this.textcolor;
            }
        }
    };

    this.UpdateMesh = function () {
        this.UpdateSection();

        var x = this.x.GetValue();
        var y = this.y.GetValue();
        var r = this.r.GetValue();
        var a = this.a.GetValue();

        this.shape = new uicanvas2dgraphics.Segment(x, y, r, a);

        //this.objects = [];
        var circle = new uicanvas2dgraphics.Circle(x, y, r);
        circle.property.thickness = 2;
        circle.property.linecolor = "#CCC";
        circle.property.showfill = false;
        this.backobjects.push(circle);
    };

    this.GetMesh = function () {
        var x = this.x.value;
        var y = this.y.value;
        var r = this.r.value;
        var a = this.a.value;
        var n = 32;

        if (a <= 45)
            n = 4;
        else if (a <= 90)
            n = 8;
        else if (a <= 135)
            n = 12;
        else if (a <= 180)
            n = 16;
        else if (a <= 225)
            n = 20;
        else if (a <= 270)
            n = 24;
        else if (a <= 315)
            n = 28;

        var points = [];

        var da = a / n;

        var ta = (Math.PI / 180) * a / 2;

        var ptx = r * Math.sin(ta);
        var pty = r * Math.cos(ta);

        var pt = new common.Point2F(ptx, pty);
        points.push(new common.Point2F(ptx, pty));

        for (var i = 0; i < n; i++) {
            pt.Rotate(x, y, da);
            points.push(new common.Point2F(pt.x, pt.y));
        }

        var mesh = {};
        mesh.Area = [];

        var centerpt = new common.Point2F(0, pty);

        for (var i = 0; i < n; i++) {
            var pt0 = uicanvas2dgraphics.GenerateMeshPoint(centerpt.x, centerpt.y, 0);
            var pt1;
            var pt2;
            pt1 = uicanvas2dgraphics.GenerateMeshPoint(points[i + 1].x, points[i + 1].y, 0);
            pt2 = uicanvas2dgraphics.GenerateMeshPoint(points[i].x, points[i].y, 0);
            var area = {};
            area.Points = [];

            area.Points.push(pt0);
            area.Points.push(pt1);
            area.Points.push(pt2);

            mesh.Area.push(area);
        }

        return mesh;
    };

    this.Bounds = function () {
        var r = this.r.GetValue();

        var bounds = new common.Bounds2F();
        bounds.x1 = x - r;
        bounds.y1 = y - r;

        bounds.x2 = x + r;
        bounds.y2 = y + r;

        return bounds;
    };

    this.Reset = function () {
        this.x.SetValue(x);
        this.y.SetValue(y);
        this.r.SetValue(r);
        this.a.SetValue(a);
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.PolylineRebar = function (points, rbc, rbm, sp) {
    uicanvas2dgraphics.RebarBase.call(this);

    this.sp = sp;
    this.rebars = points;
    this.rbc = rbc;
    this.rbm = rbm;
    this.points = [];

    this.UpdateMesh = function () {
        this.points = [];

        var rebarnumbers;
        var line2points;

        //fit remaining rebars along the lines of the shape
        for (var j = 0; j < this.rebars.length - 1; j++) {
            line2points = new common.Line2F(this.rebars[j].x, this.rebars[j].y, this.rebars[j + 1].x, this.rebars[j + 1].y);
            rebarnumbers = line2points.GetPointsBySpacing(this.sp + 2 * this.rbm);

            if (rebarnumbers !== null) {
                for (var k = 0; k < rebarnumbers.length - 1; k++) {
                    if (k === 0 || k === (rebarnumbers.length - 1))
                        this.points.push(new common.Point2F(rebarnumbers[k].x, rebarnumbers[k].y, this.rbc));
                    else
                        this.points.push(new common.Point2F(rebarnumbers[k].x, rebarnumbers[k].y, this.rbm));
                }
            }
        }
    };

    this.UpdateMesh();
};

uicanvas2dgraphics.Arrow = function (x, y, w, h, e, a, dp) {
    uicanvas2dgraphics.Base.call(this);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.properties = dp;
    this.w4 = w / 4;
    this.a = a;
    this.e = e;

    this.Render = function (renderer) {
        if (this.a === 0) {
            renderer.DrawLine(this.x, this.y + this.e, this.x, this.y + this.h, this.properties);

            var points = [];
            points[0] = new common.Point2F(this.x, this.y + this.e);
            points[1] = new common.Point2F(this.x - this.w4, this.y + this.e + this.w);
            points[2] = new common.Point2F(this.x + this.w4, this.y + this.e + this.w);
            points[3] = new common.Point2F(this.x, this.y + this.e);
            renderer.DrawPolygon(points, this.properties);

            return new common.Point2F(this.x, this.y + this.h);
        } else {
            var aa = Math.PI * this.a / 180;
            var c = common.Rotate(this.x, this.y, this.x, this.y + this.e, aa);
            var r = common.Rotate(this.x, this.y, this.x, this.y + this.h, aa);
            renderer.DrawLine(c.x, c.y, r.x, r.y, this.properties);

            var points = [];
            points[0] = common.Rotate(this.x, this.y, this.x, this.y + this.e, aa);
            points[1] = common.Rotate(this.x, this.y, this.x - this.w4, this.y + this.e + this.w, aa);
            points[2] = common.Rotate(this.x, this.y, this.x + this.w4, this.y + this.e + this.w, aa);
            points[3] = common.Rotate(this.x, this.y, this.x, this.y + this.e, aa);
            renderer.DrawPolygon(points, this.properties);

            return new common.Point2F(r.x, r.y);
        }
    };
};

uicanvas2dgraphics.Axis = function (x, y, len, dpc, dp2, dp3, cx, cy) {
    uicanvas2dgraphics.Base.call(this);

    this.x = x;
    this.y = y;
    this.len = len;
    this.drawpropcircle = dpc;
    this.drawprop2 = dp2;
    this.drawprop3 = dp3;
    this.a = 0;
    this.cx = cx;
    this.cy = cy;
    this.dimensionfontsize = 12;

    this.Render = function (renderer) {
        var artail = this.len * 0.16;
        var arw = this.len * 0.16;
        var cd = this.len * 0.08;

        var ar = new uicanvas2dgraphics.Arrow(x + len - artail, y, arw, len, 0, 90, this.drawprop3);
        ar.Render(renderer);

        ar = new uicanvas2dgraphics.Arrow(x, y + len - artail, arw, len, 0, 180, this.drawprop2);
        ar.Render(renderer);

        var font = "normal " + this.dimensionfontsize + "px sans-serif";

        //        renderer.DrawText(this.cx, x + len + arw - artail, y - (arw * 0.75), font, this.drawpropcircle.textcolor, Math.PI * (360 - this.a) / 180);
        renderer.DrawText(this.cx, x + len - artail, y, font, this.drawpropcircle.textcolor, Math.PI * (360 - this.a) / 180);
        renderer.DrawText(this.cy, x, y + len - artail, font, this.drawpropcircle.textcolor, Math.PI * (360 - this.a) / 180);

        var circle = new uicanvas2dgraphics.Circle(x, y, cd);
        circle.property.scale = false;
        circle.property.fillcolor = "transparent";
        circle.property.linecolor = this.drawpropcircle.linecolor;
        circle.Render(renderer);

        return new common.Point2F(this.x, this.y);
    };

    this.UpdateBounds = function () {
    };
};

uicanvas2dgraphics.GenerateMeshPoint = function (x, y, z) {
    var item = {};
    item.Stress = 0;
    item.X = x;
    item.Y = y;
    item.Z = z;
    return item;
};