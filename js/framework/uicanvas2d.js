/* global common, _counter, mobiwork, uicanvas2dmodel, uicanvas2dgraphics, this, selected, POSITION, VIEWTYPE, uiframework, $SETTINGS */
var CANVASCOMMAND = {
    SELECT: {name: "SELECT", value: 0},
    PAN: {value: 1},
    DRAW: {value: 2}
};

var canvassettings = function () {
    this.SHOWGRID = true;
    this.SHOWRULER = true;
    this.SHOWLABEL = true;

    this.SNAPGRID = true;
    this.SNAPPOINT = true;
    this.SNAPLINE = true;
    this.SHOWAXIS = false;
    this.FLOATAXIS = true;

    this.background = "#FFF";
    this.axis = "#222";
    this.major = "#DDD";
    this.minor = "#EEE";
    this.ruler = "#111";
    this.rulerline = "#111";
    this.rulertext = "#FFF";
    this.fontcolor = "#FFF";

    this.WhiteBackground = function () {
        this.background = "#FFF";
        this.axis = "#888";
        this.major = "#BBB";
        this.minor = "#D8D8D8";
        this.ruler = "#F8F8F8";
        this.rulerline = "#AAA";
        this.rulertext = "#000";
        this.fontcolor = "#000";
    };

    this.BlackBackground = function () {
        this.background = "#000";
        this.axis = "#444";
        this.major = "#222";
        this.minor = "#111";
        this.ruler = "#111";
        this.rulertext = "#FFF";
        this.fontcolor = "#FFF";
    };

    this.WhiteBackground();
};

var uicanvas2d = function () {
    uiframework.Base.call(this);

    this.parent = null;
    this.id = null;
    this.context = null;
    this.canvas = null;
    this.viewer = null;
    this.buffer = null;

    this.canvasbuffer = null;
    this.contextbuffer = null;

    this.drawingid = 0;

    this.center = new common.Point2F(0, 0);
    this.gridvalue = new common.Point2F(1, 1);
    this.middle = new common.Point2F(0, 0);
    this.gridsize = 100;
    this.rulersize = 30;

    this.width = 100;
    this.height = 100;
    this.left = 0;
    this.top = 0;

    this.defaultgridsize = 100;
    this.zoomvalue = 1;
    this.minorinterval = 10;

    this.mouse = new common.Mouse();

    this.guide = null;
    this.drawaxisprop = new common.DrawProperties();
    this.drawaxisprop.scale = false;
    this.drawaxisprop.linecolor = "#00F";
    this.drawaxisprop.fillcolor = "rgba(0,0,255,0.2)";

    this.Position = POSITION.RELATIVE;
    this.command = CANVASCOMMAND.PAN;
    this.onmousewheel = false;

    this.ismobile = false;
    this.settings = new canvassettings();

    this.defaultfill = "#00F";
    this.defaultstroke = "#000";
    this.selectfill = "#F00";
    this.selectstroke = "#F00";

    this.font = "normal 4px arial";
    this.fontfactor = 1;

    this.labelx = "X";
    this.labely = "Y";

    this.axisx = "X";
    this.axisy = "Y";

    this.axiscolorx = "#F00";
    this.axiscolory = "#080";

    this.hasborder = true;

    this.mousedownevent;
    this.mousemoveevent;
    this.mouseupevent;
    this.mousewheelevent;

    this.onpanning = false;

    this.viewtype = VIEWTYPE.XY;
    this.viewxy = 0;
    this.viewxz = 0;
    this.viewyz = 0;

    this.gridintervalx = 0;

    this.onmousemove = new Event('onmousemove');
    this.ongraphicsselected = new Event('ongraphicsselected');

    this.model;

    //Event Listeners
    this.OnMouseMove = function (func) {
        this.canvas.addEventListener('onmousemove', func);
    };

    this.OnGraphicsSelected = function (func) {
        this.canvas.addEventListener('ongraphicsselected', func);
    };

    //Initialization

    this.Load = function (parent) {
        var canvasid = "canvas" + _counter++;

        if (this.id === null) {
            var check = $("#" + canvasid);
            if (check.length !== 0) {
                console.log("FAILED: Canvas " + this.id + " already exists.");
                return false;
            }

            this.parent = parent;
            this.id = '#' + canvasid;

            //Main Canvas
            if (this.hasborder)
                this.parent.append('<canvas id="' + canvasid + '" class="canvas"></canvas>');
            else
                this.parent.append('<canvas id="' + canvasid + '" class="canvas" style="border:none"></canvas>');

            this.viewer = $(this.id);
            this.canvas = document.getElementById(canvasid);

            if (this.canvas) {
                this.context = this.canvas.getContext('2d');

                if (this.model === undefined)
                    this.model = new uicanvas2dmodel();

                this.BindEvents();

                console.log("SUCCESS:" + canvasid + " is successfully initialized.");
            } else {
                console.log("FAILED: Cannot get canvas element.");
            }
        } else {
            console.log("FAILED: " + canvasid + " is already initialized.");
        }
    };

    this.Resize = function (x, y, w, h, parentx, parenty) {
        this.viewer.css({left: parentx, top: parenty, width: w, height: h});

        this.canvas.width = w;
        this.canvas.height = h;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        var offset = this.parent.offset();
        this.top = offset.top;
        this.left = offset.left;

        this.center.x = Math.round(this.width / 2);
        this.center.y = Math.round(this.height / 2);

        this.UpdateCanvasScaleRatio();

        if ($SETTINGS.UpdateCSS)
            $SETTINGS.UpdateCSS();

        this.Render();
    };

    this.GetImageURL = function () {
        var grid = this.settings.SHOWGRID;
        this.settings.SHOWGRID = false;

        var ruler = this.settings.SHOWRULER;
        this.settings.SHOWRULER = false;

        this.ZoomAll();
        var image = this.canvas.toDataURL('image/jpeg');

        this.settings.SHOWGRID = grid;
        this.settings.SHOWRULER = ruler;
        this.Render();

        return image;
    };

    //Conversion

    this.ToCoordX_2 = function (pointX) {
        return this.center.x + (pointX / this.gridvalue.x - this.middle.x) * this.gridsize;
    };

    this.ToCoordY_2 = function (pointY) {
        return this.center.y - (pointY / this.gridvalue.y - this.middle.y) * this.gridsize;
    };

    this.ToCoordX = function (pointX) {
        return Math.round(this.center.x + (pointX / this.gridvalue.x - this.middle.x) * this.gridsize);
    };

    this.ToCoordY = function (pointY) {
        return Math.round(this.center.y - (pointY / this.gridvalue.y - this.middle.y) * this.gridsize);
    };

    this.ToPointX = function (coordX) {
        return (this.middle.x - (this.center.x - coordX) / this.gridsize) * this.gridvalue.x;
    };

    this.ToPointY = function (coordY) {
        return (this.middle.y + (this.center.y - coordY) / this.gridsize) * this.gridvalue.y;
    };

    this.ToPointWidth = function (pointWidth) {
        return (pointWidth / this.gridsize) * this.gridvalue.y;
    };

    this.ToCoordWidth = function (coordWidth) {
        return (coordWidth * this.gridsize) / this.gridvalue.x;
    };

    this.Clear = function () {
        this.BasicRectangle(0, 0, 30000, 30000, this.settings.background, this.settings.background);
    };

    this.UpdateCanvasScaleRatio = function () {
        var devicePixelRatio = window.devicePixelRatio || 1,
                backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
                this.context.mozBackingStorePixelRatio ||
                this.context.msBackingStorePixelRatio ||
                this.context.oBackingStorePixelRatio ||
                this.context.backingStorePixelRatio || 1,
                ratio = devicePixelRatio / backingStoreRatio;

        // ensure we have a value set for auto.
        // If auto is set to false then we
        // will simply not upscale the canvas
        // and the default behaviour will be maintained
        if (typeof auto === 'undefined') {
            auto = true;
        }

        // upscale the canvas if the two ratios don't match
        if (auto && devicePixelRatio !== backingStoreRatio) {

            var oldWidth = this.canvas.width;
            var oldHeight = this.canvas.height;

            this.canvas.width = oldWidth * ratio;
            this.canvas.height = oldHeight * ratio;

            this.canvas.style.width = oldWidth + 'px';
            this.canvas.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            this.context.scale(ratio, ratio);
        }
    };


    //Rendering

    this.Render = function () {
        //Clear current drawing
        this.Clear();
        this.fontfactor = this.gridsize / (this.gridvalue.x);
        this.font = "normal " + 5 * this.zoomvalue + "px sans-serif";

        //Draw grid
        if (this.settings.SHOWGRID)
            this.DrawGrid();


        if ($SETTINGS.UpdateCSS)
            $SETTINGS.UpdateCSS();

        //Render Model
        this.model.Render(this);

        if (this.settings.SHOWRULER) {
            this.BasicRectangle(14, this.height / 2, 30, this.height, this.settings.ruler, this.settings.ruler);
            this.BasicRectangle(this.width / 2, this.height - 15, this.width, 30, this.settings.ruler, this.settings.ruler);
            this.DrawAxis();
        }

        this.DrawGlobalAxis();
    };

    this.StoreBuffer = function (canvas) {
        this.buffer = this.rendertocanvas(this.width, this.height, function (context, canvas) {
            canvas.context = context;
            canvas.Render();
            canvas.contextbackup = context;
        });

        this.context = this.canvas.getContext('2d');
    };

    this.RestoreBuffer = function () {
        if (this.buffer === null)
            this.StoreBuffer();

        this.context.drawImage(this.buffer, 0, 0);
    };

    this.rendertocanvas = function (width, height, renderFunction) {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        renderFunction(buffer.getContext('2d'), this);
        return buffer;
    };


    //Drawing

    this.DrawGrid = function () {
        var root = Math.pow(10, Math.round(Math.log(this.gridsize * this.gridvalue.x) / Math.LN10)) / 100;
        this.gridintervalx = this.gridvalue.x / root;

        var x1 = this.ToCoordX(0);
        var x2 = x1;
        var y1 = this.ToCoordY(0);
        var y2 = y1;

        var axisx = x1;
        var axisy = y1;

        var minorinterval = this.gridsize * this.gridintervalx / 10;
        var majorinterval = minorinterval * 10;

        if (minorinterval < 10) {
            minorinterval *= 10;
            majorinterval *= 10;
            this.gridintervalx *= 10;
        }

        //Minor x
        if (minorinterval >= 10) {
            while (x1 > 0 || x2 < this.width) {
                this.BasicLine(x1, 0, x1, this.height, this.settings.minor);
                x1 -= minorinterval;
                x2 += minorinterval;
                this.BasicLine(x2, 0, x2, this.height, this.settings.minor);
            }

            //Minor Y
            while (y1 > 0 || y2 < this.height) {
                this.BasicLine(0, y1, this.width, y1, this.settings.minor);
                y1 -= minorinterval;
                y2 += minorinterval;
                this.BasicLine(0, y2, this.width, y2, this.settings.minor);
            }
        }

        x1 = axisx;
        x2 = x1;
        y1 = axisy;
        y2 = y1;

        //Major x
        while (x1 > 0 || x2 < this.width) {
            this.BasicLine(x1, 0, x1, this.height, this.settings.major);
            //this.BasicText(x1, x1, axisy, font, fontcolor);

            x1 -= majorinterval;
            x2 += majorinterval;

            this.BasicLine(x2, 0, x2, this.height, this.settings.major);
            //this.BasicText(x2, x2, axisy, font, fontcolor);
        }

        //Major Y
        while (y1 > 0 || y2 < this.height) {
            this.BasicLine(0, y1, this.width, y1, this.settings.major);
            y1 -= majorinterval;
            y2 += majorinterval;
            this.BasicLine(0, y2, this.width, y2, this.settings.major);
        }

        //Axis
        x1 = axisx;
        x2 = x1;
        y1 = axisy;
        y2 = y1;

        this.BasicLine(x1, 0, x1, this.height, this.settings.axis);
        this.BasicLine(0, y1, this.width, y1, this.settings.axis);
    };

    this.DrawAxis = function () {
        var font = "normal 10px sans-serif";
        var fontlabel = "bold 12px sans-serif";
        var fontcolor = this.settings.rulertext;

        var x1 = 0;
        var y1 = 0;
        var angle = Math.PI * 270 / 180;

        var root = Math.pow(10, Math.round(Math.log(this.gridsize) / Math.LN10)) / 100;
        var intervalx = this.gridvalue.x / root;
        var intervaly = this.gridvalue.y / root;
        var intervalsize = this.ToPointWidth(intervalx);

        var x2 = x1 + intervalx;
        var y2 = y1 + intervaly;

        var round = 0;

        if (intervalx <= 10)
            round = 2;

        var x = this.rulersize;
        var y = this.rulersize;
        var cy = this.height - y;

        //Major x
        var px1 = this.ToCoordX(x1);
        var px2 = this.ToCoordX(x2);

        while (px1 >= 0 || px2 < this.width) {
            if (this.gridvalue.x >= 1 && this.gridvalue.x <= 100) {
                if (px1 >= x && px1 < this.width) {
                    if (Math.abs(x1) >= 10000)
                        this.BasicText(x1.toExponential(1), px1, cy + 5, font, fontcolor, 0, "center", "top");
                    else
                        this.BasicText(x1.toFixed(round), px1, cy + 5, font, fontcolor, 0, "center", "top");

                    this.BasicLine(px1, cy, px1, cy + 5, this.settings.rulerline, 2);
                }

                if (px2 < this.width && px2 >= x) {
                    if (Math.abs(x2) >= 10000)
                        this.BasicText(x2.toExponential(1), px2, cy + 5, font, fontcolor, 0, "center", "top");
                    else
                        this.BasicText(x2.toFixed(round), px2, cy + 5, font, fontcolor, 0, "center", "top");

                    this.BasicLine(px2, cy, px2, cy + 5, this.settings.rulerline, 2);
                }
            } else {
                if (px1 >= x && px1 < this.width) {
                    if (Math.abs(x1) >= 10000)
                        this.BasicText(x1.toExponential(1), px1, cy + 5, font, fontcolor, 0, "center", "top");
                    else
                        this.BasicText(x1.toFixed(round), px1, cy + 5, font, fontcolor, 0, "center", "top");

                    this.BasicLine(px1, cy, px1, cy + 5, this.settings.rulerline, 2);
                }

                if (px2 < this.width && px2 >= x)
                {
                    if (Math.abs(x2) >= 10000)
                        this.BasicText(x2.toExponential(1), px2, cy + 5, font, fontcolor, 0, "center", "top");
                    else
                        this.BasicText(x2.toFixed(round), px2, cy + 5, font, fontcolor, 0, "center", "top");

                    this.BasicLine(px2, cy, px2, cy + 5, this.settings.rulerline, 2);
                }
            }

            x1 -= intervalx;
            x2 += intervalx;

            px1 = this.ToCoordX(x1);
            px2 = this.ToCoordX(x2);
        }

        //Major Y
        var py1 = this.ToCoordY(y1);
        var py2 = this.ToCoordY(y2);

        while (py2 > 0 || py1 <= cy) {
            if (this.gridvalue.y >= 1 && this.gridvalue.y <= 100) {
                if (py1 > 0 && py1 <= cy) {
                    if (Math.abs(y1) >= 10000)
                        this.BasicText(y1.toExponential(1), x - 5, py1, font, fontcolor, angle, "center", "bottom");
                    else
                        this.BasicText(y1.toFixed(round), x - 5, py1, font, fontcolor, angle, "center", "bottom");

                    this.BasicLine(x - 5, py1, x, py1, this.settings.rulerline, 2);
                }

                if (py2 <= cy && py2 > 0) {
                    if (Math.abs(y2) >= 10000)
                        this.BasicText(y2.toExponential(1), x - 5, py2, font, fontcolor, angle, "center", "bottom");
                    else
                        this.BasicText(y2.toFixed(round), x - 5, py2, font, fontcolor, angle, "center", "bottom");

                    this.BasicLine(x - 5, py2, x, py2, this.settings.rulerline, 2);
                }
            } else {
                if (py1 > 0 && py1 <= cy) {
                    if (Math.abs(y1) >= 10000)
                        this.BasicText(y1.toExponential(1), x - 5, py1, font, fontcolor, angle, "center", "bottom");
                    else
                        this.BasicText(y1.toFixed(round), x - 5, py1, font, fontcolor, angle, "center", "bottom");

                    this.BasicLine(x - 5, py1, x, py1, this.settings.rulerline, 2);
                }

                if (py2 <= cy && py2 > 0) {
                    if (Math.abs(y1) >= 10000)
                        this.BasicText(y2.toExponential(1), x - 5, py2, font, fontcolor, angle, "center", "bottom");
                    else
                        this.BasicText(y2.toFixed(round), x - 5, py2, font, fontcolor, angle, "center", "bottom");

                    this.BasicLine(x - 5, py2, x, py2, this.settings.rulerline, 2);
                }
            }

            y1 -= intervaly;
            y2 += intervaly;

            py1 = this.ToCoordY(y1);
            py2 = this.ToCoordY(y2);
        }

        this.BasicLine(x, 0, x, this.height - y, this.settings.rulerline, 2);
        this.BasicLine(x, this.height - y, this.width, this.height - y, this.settings.rulerline, 2);

        //Draw Label

        if (this.settings.SHOWLABEL) {
            this.BasicText(this.labelx, this.width - 10, this.height - y - 10, fontlabel, fontcolor, 0, "right", "bottom");
            this.BasicText(this.labely, x + 10, 10, fontlabel, fontcolor, angle, "right", "top");
        }

    };

    this.DrawGlobalAxis = function () {
        var fontlabel = "bold 12px sans-serif";
        var fontcolor = this.settings.rulertext;

        var x = this.rulersize;
        var y = this.rulersize;

        if (this.settings.SHOWAXIS) {
            //Draw Axis
            if (this.settings.FLOATAXIS) {
                if (this.settings.SHOWRULER) {
                    x += 20;
                    y = this.height - this.rulersize - 20;
                } else {
                    x = 20;
                    y = this.height - 20;
                }
            } else {
                x = this.ToCoordX(0);
                y = this.ToCoordY(0);
            }

            var axislength = 100;
            if (this.width <= 500 || this.height <= 500) {
                axislength = 50;
            }
            //X - Axis
            var lxcolor = this.axiscolorx;
            var lycolor = this.axiscolory;
            this.BasicLine(x, y, x + axislength, y, lxcolor, 2);
            this.BasicLine(x + axislength - 10, y - 5, x + axislength, y, lxcolor, 2);
            this.BasicLine(x + axislength - 10, y + 5, x + axislength, y, lxcolor, 2);
            this.BasicText(this.axisx, x + axislength + 5, y, fontlabel, fontcolor, 0, "left", "middle");

            //Y - Axis
            this.BasicLine(x, y, x, y - axislength, lycolor, 2);
            this.BasicLine(x - 5, y - axislength + 10, x, y - axislength, lycolor, 2);
            this.BasicLine(x + 5, y - axislength + 10, x, y - axislength, lycolor, 2);
            this.BasicText(this.axisy, x, y - axislength - 10, fontlabel, fontcolor, 0, "center", "middle");
        }
    };

    this.BasicLine = function (x1, y1, x2, y2, color, linewidth) {
        this.context.beginPath();
        this.context.moveTo(x1 - 0.5, y1 - 0.5);
        this.context.lineTo(x2 - 0.5, y2 - 0.5);
        this.context.strokeStyle = color;

        if (linewidth === undefined)
            this.context.lineWidth = 1;
        else
            this.context.lineWidth = linewidth;

        this.context.stroke();
    };

    this.GuideLine = function (x1, y1, x2, y2) {
        this.context.save();

        this.context.beginPath();
        this.context.moveTo(Math.round(x1) - 0.5, Math.round(y1) - 0.5);
        this.context.lineTo(Math.round(x2) - 0.5, Math.round(y2) - 0.5);
        this.context.strokeStyle = "rgba(255,255,0,0.5)";
        this.context.setLineDash([2, 3]);
        this.context.lineWidth = 1;
        this.context.stroke();

        this.context.restore();
    };

    this.BasicRectangle = function (x, y, w, h, fillcolor, linecolor) {
        var aw = w;
        var ah = h;
        var ax = x - aw / 2;
        var ay = y - ah / 2;

        this.context.fillStyle = fillcolor;
        this.context.strokeStyle = linecolor;
        this.context.lineWidth = 1;

        this.context.fillRect(ax, ay, aw, ah);
        this.context.strokeRect(ax, ay, aw, ah);
    };

    this.BasicCircle = function (x, y, radius, fillcolor, linecolor, thickness, scale) {
        var ar = radius;
        var ax = x;
        var ay = y;

        this.context.beginPath();
        this.context.fillStyle = fillcolor;
        this.context.strokeStyle = linecolor;
        this.context.lineWidth = 1;

        this.context.arc(ax, ay, ar, 0, Math.PI * 2, false);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    };

    this.BasicText = function (text, x, y, font, color, a, ha, va) {
        if (a === null) {
            var ax = x;
            var ay = y;

            if (ha !== undefined)
                this.context.textAlign = ha;

            if (va !== undefined)
                this.context.textBaseline = va;

            this.context.fillStyle = color;
            this.context.font = font;
            this.context.fillText(text, ax, ay);
        } else {
            this.context.save();
            var ax = x;
            var ay = y;

            if (ha !== undefined)
                this.context.textAlign = ha;
            else
                this.context.textAlign = 'center';

            if (va !== undefined)
                this.context.textBaseline = va;
            else
                this.context.textBaseline = "bottom";

            this.context.fillStyle = color;
            this.context.font = font;
            this.context.translate(ax, ay);
            this.context.rotate(a);
            this.context.fillText(text, 0, 0);
            this.context.restore();
        }
    };

    this.DrawSelection = function (x1, y1, x2, y2) {
        var w = Math.abs(x1 - x2);
        var h = Math.abs(y1 - y2);

        x1 = Math.min(x1, x2);
        y1 = Math.min(y1, y2);

        this.context.save();
        this.context.fillStyle = "rgba(0,0,255,0.2)";
        this.context.strokeStyle = "#00F";
        this.context.lineWidth = 1;
        this.context.setLineDash([2, 3]);

        this.context.fillRect(x1, y1, w, h);
        this.context.strokeRect(x1, y1, w, h);

        this.context.restore();
    };

    this.DrawDrawingAxis = function (x, y) {
        x = this.ToCoordX(x);
        y = this.ToCoordY(y);

        this.context.save();
        this.context.fillStyle = this.drawaxisprop.fillcolor;
        this.context.strokeStyle = this.drawaxisprop.linecolor;
        this.context.lineWidth = this.drawaxisprop.thickness;
        this.context.setLineDash([2, 3]);

        this.context.beginPath();
        this.context.moveTo(x - 0.5, 0 - 0.5);
        this.context.lineTo(x - 0.5, this.height - 0.5);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(0 - 0.5, y - 0.5);
        this.context.lineTo(this.width - 0.5, y - 0.5);
        this.context.stroke();

        var aw = 10;
        var ah = 10;
        var ax = x - aw / 2;
        var ay = y - ah / 2;

        this.context.fillStyle = "#88F";
        this.context.fillRect(ax, ay, aw, ah);

        this.context.restore();
    };

    this.DrawLine = function (x1, y1, x2, y2, property) {
        var ax1 = this.ToCoordX(x1);
        var ay1 = this.ToCoordY(y1);
        var ax2 = this.ToCoordX(x2);
        var ay2 = this.ToCoordY(y2);

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.moveTo(Math.round(ax1), Math.round(ay1));
        this.context.lineTo(Math.round(ax2), Math.round(ay2));
        this.context.stroke();
    };

    this.DrawPolyLine = function (points, property) {
        var x = this.ToCoordX(points[0].x);
        var y = this.ToCoordY(points[0].y);

        this.UpdateContextProperties(property);

        if (property.pointcolor) {
            var x2;
            var y2;

            this.context.lineWidth = property.thickness * this.gridsize / (this.defaultgridsize * this.gridvalue.x);
            //this.context.lineCap = 'round';

            for (var i = 1; i < points.length; i++) {
                x = this.ToCoordX(points[i - 1].x);
                y = this.ToCoordY(points[i - 1].y);

                x2 = this.ToCoordX(points[i].x);
                y2 = this.ToCoordY(points[i].y);

                this.context.fillStyle = points[i].color;
                this.context.strokeStyle = points[i].color;

                this.context.beginPath();
                this.context.moveTo(x, y);
                this.context.lineTo(x2, y2);
                this.context.stroke();
            }
        } else {
            this.context.beginPath();
            this.context.moveTo(x, y);

            for (var i = 1; i < points.length; i++) {
                x = this.ToCoordX(points[i].x);
                y = this.ToCoordY(points[i].y);
                this.context.lineTo(x, y);
            }

            this.context.stroke();
        }
    };

    this.DrawRectangle = function (x, y, w, h, property) {
        var aw = this.gridsize * w / this.gridvalue.x;
        var ah = this.gridsize * h / this.gridvalue.x;
        var ax = this.ToCoordX(x) - aw / 2;
        var ay = this.ToCoordY(y) - ah / 2;

        this.UpdateContextProperties(property);

        if (property.showfill)
            this.context.fillRect(ax, ay, aw, ah);

        if (property.showline)
            this.context.strokeRect(ax, ay, aw, ah);
    };

    this.DrawArcDimLine = function (x, y, radius, innerradius, startangle, endangle, property) {
        var ar = this.gridsize * radius / this.gridvalue.x;
        var ir = this.gridsize * innerradius / this.gridvalue.x;

        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.moveTo(ax, ay);
        this.context.arc(ax, ay, ar, startangle, endangle, false);

        if (ar !== ir) {
            this.context.lineTo(ax, ay);
            this.context.arc(ax, ay, ir, endangle, startangle, true);
            this.context.fill();
        }

        this.context.stroke();
    };

    this.DrawArcSection = function (x, y, radius, innerradius, startangle, endangle, property) {
        var ar = this.gridsize * radius / this.gridvalue.x;
        var ir = this.gridsize * innerradius / this.gridvalue.x;

        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.arc(ax, ay, ar, startangle, endangle, false);

        if (ar !== ir) {
            this.context.arc(ax, ay, ir, endangle, startangle, true);
            this.context.fill();
        }

        this.context.closePath();

        this.context.stroke();
    };

    this.DrawMoment = function (x, y, radius, startangle, endangle, clockwise, property) {
        var w = 0.1;
        var w4 = 0.02;

        var points = [];
        var x1 = x + w;

        if (startangle > endangle)
            clockwise = false;

        if (!clockwise)
            x1 = x - w;

        var y1 = y + radius;

        points[0] = new common.Point2F(x1, y1);
        points[1] = new common.Point2F(x, y1 + w4);
        points[2] = new common.Point2F(x, y1 - w4);
        points[3] = new common.Point2F(x1, y1);
        this.DrawPolygon(points, property);

        this.DrawArc(x, y, radius, startangle, endangle, property);
    };

    this.DrawArc = function (x, y, radius, startangle, endangle, property) {
        var ar = this.gridsize * radius / this.gridvalue.x;
        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        this.UpdateContextProperties(property);

        this.context.beginPath();

        this.context.arc(ax, ay, ar, Math.PI * startangle / 180, Math.PI * endangle / 180);
        this.context.stroke();
    };

    this.DrawCircle = function (x, y, radius, property) {
        var ar = this.gridsize * radius / this.gridvalue.x;
        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.arc(ax, ay, ar, 0, Math.PI * 2, false);
        this.context.closePath();

        if (property.showfill)
            this.context.fill();

        if (property.showline)
            this.context.stroke();
    };

    this.DrawEllipse = function (x, y, w, h, property) {
        var kappa = .5522848,
                ox = (w / 2) * kappa, // control point offset horizontal
                oy = (h / 2) * kappa, // control point offset vertical
                xe = x + w, // x-end
                ye = y + h, // y-end
                xm = x + w / 2, // x-middle
                ym = y + h / 2;       // y-middle

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.moveTo(x, ym);
        this.context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        this.context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        this.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this.context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        this.context.closePath();
        this.context.stroke();
    };

    this.DrawSector = function (x, y, radius, startangle, endangle, property) {
        var ar = this.gridsize * radius / this.gridvalue.x;

        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.moveTo(ax, ay);
        this.context.arc(ax, ay, ar, startangle, endangle, false);
        this.context.lineTo(ax, ay);
        this.context.fill();
        this.context.stroke();
    };

    this.DrawSegment = function (x, y, radius, angle, property) {
        var ar = this.gridsize * radius / this.gridvalue.x;

        var sx = x - radius * Math.sin(angle / 2);
        var sy = y + radius * Math.cos(angle / 2);

        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        sx = this.ToCoordX(sx);
        sy = this.ToCoordY(sy);

        var startangle = 1.5 * Math.PI - angle / 2;
        var endangle = 1.5 * Math.PI + angle / 2;

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.moveTo(sx, sy);
        this.context.arc(ax, ay, ar, startangle, endangle, false);
        this.context.lineTo(sx, sy);
        this.context.fill();
        this.context.stroke();
    };

    this.DrawPipe = function (x, y, radius, innerradius, property) {
        var ar = this.gridsize * radius / this.gridvalue.x;
        var ir = this.gridsize * innerradius / this.gridvalue.x;

        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.arc(ax, ay, ar, 0, Math.PI * 2, false);
        this.context.arc(ax, ay, ir, 0, Math.PI * 2, true);
        this.context.fill();

        this.context.beginPath();
        this.context.arc(ax, ay, ar, 0, Math.PI * 2, false);
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(ax, ay, ir, 0, Math.PI * 2, false);
        this.context.stroke();
    };

    this.DrawTube = function (x, y, w, h, tw1, tw2, tf1, tf2, property) {
        var aw = this.gridsize * w / this.gridvalue.x;
        var ah = this.gridsize * h / this.gridvalue.x;

        var atf1 = this.gridsize * tf1 / this.gridvalue.x;
        var atf2 = this.gridsize * tf2 / this.gridvalue.x;

        var atw1 = this.gridsize * tw1 / this.gridvalue.x;
        var atw2 = this.gridsize * tw2 / this.gridvalue.x;

        var rx = x - w / 2 + tw1;
        var ry = y + h / 2 - tf1;

        var rw = aw - (atw1 + atw2);
        var rh = ah - (atf1 + atf2);

        rx = this.ToCoordX(rx);
        ry = this.ToCoordY(ry);

        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);

        this.context.beginPath();
        this.UpdateContextProperties(property);

        this.context.moveTo(ax - aw / 2 - 0.5, ay - ah / 2 - 0.5);
        this.context.lineTo(ax - aw / 2 - 0.5, ay + ah / 2 - 0.5);
        this.context.lineTo(ax + aw / 2 - 0.5, ay + ah / 2 - 0.5);
        this.context.lineTo(ax + aw / 2 - 0.5, ay - ah / 2 - 0.5);
        this.context.lineTo(ax - aw / 2 - 0.5, ay - ah / 2 - 0.5);

        this.context.rect(rx, ry, rw, rh);
        this.context.fill();
        this.context.stroke();
    };

    this.DrawPolygon = function (points, property) {
        if (points.length !== 0) {
            this.context.beginPath();

            this.UpdateContextProperties(property);

            //First point
            var x = this.ToCoordX_2(points[0].x);
            var y = this.ToCoordY_2(points[0].y);
            this.context.moveTo(x, y);

            //Second to the last point
            for (var i = 1; i < points.length; i++) {
                x = this.ToCoordX(points[i].x);
                y = this.ToCoordY(points[i].y);
                this.context.lineTo(x, y);
            }

            this.context.closePath();

            if (property.showfill)
                this.context.fill();

            if (property.showline)
                this.context.stroke();
        }
    };

    this.DrawArrow = function (x1, y1, x2, y2, w, h, property, arrow1, arrow2) {
        var line = new common.Line2F(x1, y1, x2, y2);
        var angle = -line.GetAngle();

        var ax1 = this.ToCoordX(x1);
        var ay1 = this.ToCoordY(y1);
        var ax2 = this.ToCoordX(x2);
        var ay2 = this.ToCoordY(y2);

        this.UpdateContextProperties(property);

        this.context.beginPath();
        this.context.moveTo(Math.round(ax1), Math.round(ay1));
        this.context.lineTo(Math.round(ax2), Math.round(ay2));

        this.context.stroke();

        //Arrow 1
        if (arrow1 === undefined || arrow1) {
            var point1 = [];
            point1[0] = new common.Point2F(x1, y1);
            point1[1] = new common.Point2F(x1 + w, y1 + h / 2);
            point1[2] = new common.Point2F(x1 + w, y1 - h / 2);

            if (angle !== 0)
                for (var i = 0; i < point1.length; i++)
                    point1[i].Rotate(x1, y1, angle);

            this.DrawPolygon(point1, property);
        }

        //Arrow 2
        if (arrow2 === undefined || arrow2) {
            var point2 = [];
            point2[0] = new common.Point2F(x2, y2);
            point2[1] = new common.Point2F(x2 - w, y2 + h / 2);
            point2[2] = new common.Point2F(x2 - w, y2 - h / 2);

            if (angle !== 0)
                for (var i = 0; i < point2.length; i++)
                    point2[i].Rotate(x2, y2, angle);

            this.DrawPolygon(point2, property);
        }
    };

    this.DrawText = function (text, x, y, font, color, a, horzalign, vertalign) {
        if (!a) {
            var ax = this.ToCoordX(x);
            var ay = this.ToCoordY(y);
            this.context.fillStyle = color;
            this.context.font = font;

            if (horzalign !== undefined && horzalign !== null)
                this.context.textAlign = horzalign;
            else
                this.context.textAlign = "center";

            if (vertalign !== undefined && vertalign !== null)
                this.context.textBaseline = vertalign;
            else
                this.context.textBaseline = "bottom";

            this.context.fillText(text, ax, ay);
        } else {
            this.context.save();
            var ax = this.ToCoordX(x);
            var ay = this.ToCoordY(y);

            if (horzalign !== undefined && horzalign !== null)
                this.context.textAlign = horzalign;
            else
                this.context.textAlign = "center";

            if (vertalign !== undefined && vertalign !== null)
                this.context.textBaseline = vertalign;
            else
                this.context.textBaseline = "bottom";

            this.context.fillStyle = color;
            this.context.font = font;
            this.context.translate(ax, ay);
            this.context.rotate(a);
            this.context.fillText(text, 0, 0);
            this.context.restore();
        }
    };

    this.DrawImage = function (image, x, y) {
        var ax = this.ToCoordX(x);
        var ay = this.ToCoordY(y);
        var scale = this.gridsize / this.defaultgridsize;

        var width = image.width * scale;
        var height = image.height * scale;
        this.context.drawImage(image, ax, ay, width, height);

    };

    this.UpdateContextProperties = function (property) {
        if (property.gradientpoint1 && property.gradientpoint2) {
            var gradient = this.context.createLinearGradient(this.ToCoordX_2(property.gradientpoint1.X), this.ToCoordY_2(property.gradientpoint1.Y), this.ToCoordX_2(property.gradientpoint2.X), this.ToCoordY_2(property.gradientpoint2.Y));
            gradient.addColorStop(0, property.gradientcolor1);
            gradient.addColorStop(1, property.gradientcolor2);

            this.context.fillStyle = gradient;
            this.context.strokeStyle = gradient;
            //this.context.strokeStyle = "black";

        } else {
            this.context.fillStyle = property.fillcolor;
            this.context.strokeStyle = property.linecolor;
        }

        if (property.scale) {
            this.context.lineWidth = property.thickness * this.gridsize / (this.defaultgridsize * this.gridvalue.x);

            if (this.context.lineWidth < 1)
                this.context.lineWidth = 1;
        } else
            this.context.lineWidth = property.thickness;
    };

    this.ShowTextBox = function (x, y) {
        $("body").append("<div id='inputbox'><input id='inputboxtext' type='text' name='inputboxtext'/></div>");

        //Resize Form
        var height = $(window).height();
        var width = $(window).width();
        var w = 100;
        var h = 40;

        if (w > width)
            w = width;

        if (h > height)
            h = height;

        $("#inputbox").css({left: x, top: y});

        this.textbox = $("#inputboxtext");
        this.textbox.focus();

        var f = this.ProcessTextBoxInput;
        var ref = this;

        this.textbox.keydown(function (e) {
            if (e.which === 13) {
                var value = $("input[name='inputboxtext']").val();

                if (f !== undefined)
                    f(value, ref);

                ref.CloseTextBox();
            }
        });
    };

    this.CloseTextBox = function () {
        $("#inputbox").remove();
        this.textbox = undefined;
    };

    this.ProcessTextBoxInput = function (value, canvas) {
        switch (canvas.command) {
            case CANVASCOMMAND.DRAW:
                var res = value.split(" ");
                if (res.length === 1) {
                    canvas.guide.UpdateLength(parseFloat(value));

                    canvas.model.Add(canvas.guide.Clone());

                    canvas.mousedowncount = 1;
                    canvas.mouse.downsnap.x = canvas.guide.x2;
                    canvas.mouse.downsnap.y = canvas.guide.y2;

                    if (canvas.guide.numberofpoints === 1)
                        canvas.mouse.mousedowncount = 0;
                    else
                        canvas.mouse.mousedowncount = 1;

                    canvas.mouse.downsnaplist = [];
                    canvas.mouse.downsnaplist.push(canvas.mouse.downsnap);

                    canvas.StoreBuffer();
                    canvas.Render();
                } else if (res.length === 2) {
                    if (canvas.mousedowncount === 0) {
                        var x = parseFloat(res[0]);
                        var y = parseFloat(res[0]);

                        canvas.mouse.downsnap.x = x;
                        canvas.mouse.downsnap.y = y;

                        canvas.Add(new canvas.Joint(canvas.mouse.downsnap.x, canvas.mouse.downsnap.y));
                        canvas.StoreBuffer();

                        var beam = new canvas.Beam(canvas.mouse.downsnap.x, canvas.mouse.downsnap.y, canvas.mouse.downsnap.x, canvas.mouse.downsnap.y);
                        canvas.guide = beam;
                    } else {
                        var x = parseFloat(res[0]);
                        var y = parseFloat(res[1]);

                        var beam = canvas.guide;
                        beam.x2 = beam.x1 + x;
                        beam.y2 = beam.y1 + y;

                        canvas.Add(beam);

                        var beam = new canvas.Beam(beam.x2, beam.y2, beam.x2, beam.y2);
                        canvas.guide = beam;

                        canvas.mouse.downsnap.x = beam.x2;
                        canvas.mouse.downsnap.y = beam.y2;
                    }

                    canvas.StoreBuffer();
                    canvas.Render();

                    canvas.mousedowncount = 1;
                }

                canvas.CloseTextBox();
                break;
        }
    };


    // Drawing Mode

    this.SelectCommand = function () {
        this.mouse.mousedowncount = 0;
        this.command = CANVASCOMMAND.SELECT;
    };

    this.StartDrawLine = function () {
        this.command = CANVASCOMMAND.DRAWLINE;
        this.guide = new uicanvas2dgraphics.Line(0, 0, 0, 0);
    };

    this.Snap = function (x, y) {
        var tolerance = this.gridintervalx * this.gridvalue.x / 10;
        var snapgrid;

        if (this.settings.SNAPGRID) {
            snapgrid = new common.Point2F(0, 0);
            snapgrid.x = common.Snap(x, tolerance);
            snapgrid.y = common.Snap(y, tolerance);
        }

        var snap;

        if (Math.abs(snapgrid.x - x) < Math.abs(snapgrid.y - y))
            snap = this.model.Snap(this.settings, snapgrid.x, y, tolerance);
        else
            snap = this.model.Snap(this.settings, x, snapgrid.y, tolerance);

        if (snap !== undefined && snap !== null) {
            snap.x = common.Round(snap.x, 3);
            snap.y = common.Round(snap.y, 3);

            return snap;
        } else {
            if (snapgrid !== undefined) {
                snapgrid.x = common.Round(snapgrid.x, 3);
                snapgrid.y = common.Round(snapgrid.y, 3);

                return snapgrid;
            } else
                return new common.Point2F(x, y);
        }
    };


    //Editing

    this.DeleteAll = function () {
        this.list = [];
    };

    this.Move = function () {
        this.hasmoved = 0;

        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i] !== null)
                if (this.list[i].selected === 1) {
                    //Move select drawing
                    if (this.list[i].sid === -1)
                        this.list[i].Move(this.mouse.currentsnap.x - this.mouse.previoussnap.x, this.mouse.currentsnap.y - this.mouse.previoussnap.y);
                    else
                        this.list[i].Move(this.mouse.currentsnap.x, this.mouse.currentsnap.y);

                    this.hasmoved = 1;
                }
        }
    };

    this.Pan = function (x, y) {
        this.middle.x -= x / this.gridsize;
        this.middle.y -= y / this.gridsize;
    };

    this.MoveSelection = function (x, y, xo, yo) {
        var list = this.list;
        for (i = 0; i < list.length; i++) {
            if (list[i] !== null)
                if (list[i].onmove) {
                    list[i].Move(x, y, xo, yo);
                }
        }
    };

    this.MoveByPoint = function (current, previous) {
        if (!((current.x === previous.x) && (current.y === previous.y))) {
            this.middle.x -= (current.x - previous.x) / this.gridvalue.x;
            this.middle.y -= (current.y - previous.y) / this.gridvalue.y;
        }
    };

    this.RotateSelection = function (angle) {
        var list = this.list;
        for (i = 0; i < list.length; i++) {
            if (list[i] !== null)
                if (list[i].selected === 1) {
                    list[i].angle = angle;
                    list[i].UpdateMesh();
                }
        }
    };


    //Zoom

    this.ZoomAll = function () {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        var bounds = this.model.Bounds();

        if (bounds.x1 < 1000000000) {
            var x1 = bounds.x1;
            var y1 = bounds.y1;

            var x2 = bounds.x2;
            var y2 = bounds.y2;

            var mid = new common.Point2F((x1 + x2) / 2, (y1 + y2) / 2);
            var difference = new common.Point2F(Math.abs(x1 - x2) / this.gridvalue.x, Math.abs(y1 - y2) / this.gridvalue.y);

            if (((difference.x / difference.y) >= (this.width / this.height))) {
                if (difference.x === 0)
                    return;

                this.gridsize = this.width / (1.5 * difference.x);
            } else {
                if (difference.y === 0)
                    return;

                this.gridsize = this.height / (1.5 * difference.y);
            }

            if (this.gridsize > 1000) {
                this.gridsize /= 10;
                this.gridvalue.x /= 10;
                this.gridvalue.y /= 10;
            } else if (this.gridsize >= 10) {

            } else if (this.gridsize >= 1) {
                this.gridsize *= 5;
                this.gridvalue.x *= 5;
                this.gridvalue.y *= 5;
            } else {
                this.gridsize *= 10;
                this.gridvalue.x *= 10;
                this.gridvalue.y *= 10;
            }

            if (this.settings.SHOWRULER) {
                this.middle.x = mid.x / this.gridvalue.x - this.rulersize / (2 * this.gridsize);
                this.middle.y = mid.y / this.gridvalue.y - this.rulersize / (2 * this.gridsize);
            } else {
                this.middle.x = mid.x / this.gridvalue.x;
                this.middle.y = mid.y / this.gridvalue.y;
            }

            this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);
            this.Render();
        }
    };

    this.Zoom = function (x, y, d) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        var prev = new common.Point2F(this.ToPointX(x), this.ToPointY(y));
        this.ZoomRealtime(d);

        var curr = new common.Point2F(this.ToPointX(x), this.ToPointY(y));
        this.MoveByPoint(curr, prev);

        this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);
        this.Render();
    };

    this.ZoomIn = function () {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        this.gridsize *= 1.15;
        this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);

        this.Render();
    };

    this.ZoomOut = function () {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        this.gridsize /= 1.15;
        this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);
        this.Render();
    };

    this.ZoomRealtime = function (d) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        var mult = this.gridsize * d;
        var size = this.gridsize + (mult / this.defaultgridsize);

        if (size > 1000) {
            this.gridsize = Math.round(size) / 10;
            this.gridvalue.x /= 10;
            this.gridvalue.y /= 10;
        } else if (size >= 10)
            this.gridsize = Math.round(size);
        else {
            this.gridsize = size * 10;
            this.gridvalue.x *= 10;
            this.gridvalue.y *= 10;
        }
    };

    this.ZoomFactor = function (factor) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        this.gridsize *= factor;
        this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);
        this.Render();
    };


    //Events

    this.KeyDown = function (event) {
        //Exit if textbox is visible
        if (this.textbox !== undefined) {
            if (event.which === 27) {
                this.CloseTextBox();

                if (this.guide !== null && this.mouse.mousedowncount !== 0)
                    this.guide.Render(this);

                return;
            } else
                return;
        }

        this.model.KeyDown(event, this);
    };

    this.KeyUp = function (event) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        if (this.textbox === null) {
            switch (event.which) {
                case 17:    //CTRL
                    this.CTRL = 0;
                    break;

                case 32:    //SPACE
                    this.command = this.orgcommand;
                    break;
            }
        }
    };

    this.DoubleClick = function () {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        if (this.command === this.Commands.DRAWPOLYGON) {
            this.Add(this.guide);
            this.guide = new this.Polygon();
        }
    };

    this.MouseDown = function (x, y, button) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        //Set mouse down and previous position
        this.mouse.down.x = x;
        this.mouse.down.y = y;
        this.mouse.previous.x = x;
        this.mouse.previous.y = y;

        var x1 = this.ToPointX(x);
        var y1 = this.ToPointY(y);

        this.mouse.downsnap = this.Snap(x1, y1);

        this.mouse.previoussnap.x = this.mouse.downsnap.x;
        this.mouse.previoussnap.y = this.mouse.downsnap.y;

        this.mouse.ismousedown = true;

        if (button === 0) {
            switch (this.command) {
                case CANVASCOMMAND.SELECT:
                    this.StoreBuffer();
                    break;

                case CANVASCOMMAND.PAN:
                    this.model.SetObjectForSelection(x1, y1);
                    break;

                case CANVASCOMMAND.DRAW:
                    if (this.onmouse) {
                        if (this.mouse.downsnaplist.length !== 0) {
                            if (!this.mouse.downsnaplist[this.mouse.downsnaplist.length - 1].Equal(this.mouse.downsnap))
                                this.mouse.downsnaplist.push(this.mouse.downsnap);
                        } else
                            this.mouse.downsnaplist.push(this.mouse.downsnap);

                        this.mouse.mousedowncount += 1;
                    } else {
                        this.mouse.downsnaplist = [];
                        this.mouse.downsnaplist.push(this.mouse.downsnap);
                        this.mouse.mousedowncount = 1;
                    }

                    break;
            }

        } else if (button === 1 && this.model.OnMouseDown) {
            this.model.OnMouseDown(this, x1, y1);

        } else if (button === 2) {
            this.mouse.mousedowncount = 0;
            this.mouse.downsnaplist = [];
        }
    };

    this.MouseMove = function (x, y, button) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        //Set current mouse position
        this.mouse.current.x = x;
        this.mouse.current.y = y;

        var x1 = this.ToPointX(x);
        var y1 = this.ToPointY(y);

        this.mouse.currentsnap = this.Snap(x1, y1);

        var render = true;
        this.onpanning = false;

        if (button === 1) {
            switch (this.command) {
                case CANVASCOMMAND.SELECT:
                    if (this.mouse.ismousedown) {
                        this.RestoreBuffer();
                        this.DrawSelection(this.mouse.down.x, this.mouse.down.y, this.mouse.current.x, this.mouse.current.y);
                        render = false;
                    } else {
                        this.model.OnMouseMove(this, x1, y1);
                        render = false;
                    }

                    break;

                case CANVASCOMMAND.PAN:
                    if (this.mouse.ismousedown) {
                        if (this.hasselection) {
                            var mx = this.mouse.currentsnap.x - this.mouse.previoussnap.x;
                            var my = this.mouse.currentsnap.y - this.mouse.previoussnap.y;

                            this.MoveSelection(mx, my, x1, y1);
                            this.Render();
                            render = false;
                        } else {
                            var dx = this.mouse.current.x - this.mouse.previous.x;
                            var dy = this.mouse.previous.y - this.mouse.current.y;

                            this.onpanning = true;
                            this.Pan(dx, dy);
                            this.Render();
                        }
                    } else
                        this.model.OnMouseMove(this, x1, y1);

                    render = false;
                    break;

                case CANVASCOMMAND.DRAW:
                    if (this.mouse.mousedowncount !== 0)
                        this.onmousemove.previous = this.mouse.downsnap;
                    else
                        this.onmousemove.previous = undefined;

                    this.onmousemove.position = this.mouse.currentsnap;

                    this.canvas.dispatchEvent(this.onmousemove);

                    var factor = common.unit.length.value.value;

                    if (this.mouse.mousedowncount !== 0)
                        this.guide.UpdateGuide(this.mouse.downsnaplist[0].x / factor, this.mouse.downsnaplist[0].y / factor, this.mouse.currentsnap.x / factor, this.mouse.currentsnap.y / factor);

                    break;
            }
        } else if (button === 2) {
            //Pan drawing
            this.onpanning = true;
            this.Pan(this.mouse.current.x - this.mouse.previous.x, this.mouse.previous.y - this.mouse.current.y);
            this.Render();

            render = false;
        } else {
            this.model.OnMouseMove(this, x1, y1);
            this.mouse.mousedowncount = 0;
            this.mouse.downsnaplist = [];

            render = false;
        }

        //Set previous mouse position
        this.mouse.previous.x = this.mouse.current.x;
        this.mouse.previous.y = this.mouse.current.y;

        this.mouse.previoussnap.x = this.mouse.currentsnap.x;
        this.mouse.previoussnap.y = this.mouse.currentsnap.y;

        //Refresh
        if (render)
            this.Render();

        switch (this.command) {
            case CANVASCOMMAND.DRAW:
                //Draw drawing guide
                if (this.guide !== null && this.mouse.mousedowncount !== 0)
                    this.guide.Render(this);

                if (button !== 2)
                    this.DrawDrawingAxis(this.mouse.currentsnap.x, this.mouse.currentsnap.y);

                break;
        }
    };

    this.MouseUp = function (x, y, button) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        this.onpanning = false;

        //Set current mouse position
        this.mouse.current.x = x;
        this.mouse.current.y = y;

        this.mouse.ismousedown = false;

        if (button === 1) {
            switch (this.command) {
                case CANVASCOMMAND.SELECT:
                case CANVASCOMMAND.PAN:
                    this.model.ClearObjectForMove();

                    var dx = Math.abs(this.mouse.current.x - this.mouse.down.x);
                    var dy = Math.abs(this.mouse.current.y - this.mouse.down.y);

                    if (dx === 0 || dy === 0)
                    {
                        var selected = [];
                        if (this.model.SelectByPoint(this.ToPointX(this.mouse.current.x), this.ToPointY(this.mouse.current.y), selected)) {
                            this.ongraphicsselected.selected = selected;
                            this.canvas.dispatchEvent(this.ongraphicsselected);
                        }

                    } else {
                        var x1 = this.ToPointX(this.mouse.down.x);
                        var x2 = this.ToPointX(this.mouse.current.x);
                        var y1 = this.ToPointY(this.mouse.down.y);
                        var y2 = this.ToPointY(this.mouse.current.y);
                        var temp;

                        if (x1 > x2) {
                            temp = x1;
                            x1 = x2;
                            x2 = temp;
                        }

                        if (y1 > y2) {
                            temp = y1;
                            y1 = y2;
                            y2 = temp;
                        }

                        var selected = [];
                        if (this.model.SelectByRectangle(x1, y1, x2, y2, selected)) {
                            this.ongraphicsselected.selected = selected;
                            this.canvas.dispatchEvent(this.ongraphicsselected);
                        }
                    }

                    this.Render();
                    break;

                case CANVASCOMMAND.DRAW:
                    if (!this.onmouse) {
                        if (!this.mouse.downsnaplist[this.mouse.downsnaplist.length - 1].Equal(this.mouse.currentsnap)) {
                            this.mouse.mousedowncount = 2;
                            this.mouse.downsnaplist.push(this.mouse.currentsnap);
                        }
                    }

                    if (this.guide !== null && this.guide.numberofpoints <= this.mouse.mousedowncount) {
                        var factor = common.unit.length.value.value;

                        if (this.guide.numberofpoints === 1)
                            this.guide.UpdateGuide(this.mouse.downsnap.x / factor, this.mouse.downsnap.y / factor, this.mouse.downsnap.x / factor, this.mouse.downsnap.y / factor);
                        else
                            this.guide.UpdateGuide(this.mouse.downsnaplist[0].x / factor, this.mouse.downsnaplist[0].y / factor, this.mouse.downsnaplist[1].x / factor, this.mouse.downsnaplist[1].y / factor);

                        this.model.Add(this.guide.Clone(), this.gridvalue.x / 10);

                        if (this.guide.numberofpoints === 1)
                            this.mouse.mousedowncount = 0;
                        else
                            this.mouse.mousedowncount = 1;

                        this.mouse.downsnaplist = [];
                        this.mouse.downsnaplist.push(this.mouse.downsnap);

                        if (this.model.UpdateMesh)
                            this.model.UpdateMesh();

                        this.Render();
                    }
                    break;
            }
        }
        // else if (button === 2) {
        //     switch (this.command) {
        //         case CANVASCOMMAND.DRAWPOLYGON:
        //             this.Add(this.guide);
        //             this.DrawingComplete(this.guide);
        //             this.Select();
        //             break;

        //         default:
        //     }
        // }

        this.StoreBuffer();
    };

    this.MouseWheel = function (x, y, delta) {
        //Exit if textbox is visible
        if (this.textbox !== undefined)
            return;

        this.onpanning = true;
        this.onmousewheel = true;

        //Set current mouse position
        this.mouse.current.x = x;
        this.mouse.current.y = y;
        this.mouse.delta = delta * 10;

        //Zoom
        this.Zoom(this.mouse.current.x, this.mouse.current.y, this.mouse.delta);

        if (this.mousewheelevent !== undefined) {
            var e = {};
            this.mousewheelevent(x, y, e);

            if (e.cancel !== undefined && e.cancel)
                return false;
        }

        this.StoreBuffer();
        this.onmousewheel = false;
    };

    this.Dispose = function () {
        $(this.id).unbind();
        $(this.id).remove();
    };

    this.BindEvents = function () {
        var curx = 0;
        var cury = 0;
        var downx = 0;
        var downy = 0;
        var start = 0;
        var onmouse = false;

        var pointerdist = 0;
        var ontouch = 0;
        var parent = this;

        var touch0x;
        var touch0y;
        var touch1x;
        var touch1y;

        document.body.onkeydown = function (event) {
            parent.KeyDown(event);
        };

        document.body.onkeyup = function (event) {
            parent.KeyUp(event);
        };

        $(this.id).dblclick(function () {
            //this.DoubleClick();
        });

        $(this.id).mouseenter(function (event) {
            onmouse = true;

            if (window.addEventListener)
                window.addEventListener('DOMMouseScroll', wheel, false);

            window.onmousewheel = document.onmousewheel = wheel;
        });

        $(this.id).mouseleave(function (event) {
            onmouse = false;
            window.removeEventListener('DOMMouseScroll', wheel, false);
        });

        //Mouse down event
        $(this.id).mousedown(function (event) {
            event.preventDefault();

            var x = event.pageX - parent.left;
            var y = event.pageY - parent.top;

            parent.MouseDown(x, y, event.which);
            parent.onmouse = true;

            return false;
        });

        //Mouse up event
        $(this.id).mouseup(function (event) {
            event.preventDefault();

            var x = event.pageX - parent.left;
            var y = event.pageY - parent.top;

            parent.MouseUp(x, y, event.which);
        });

        //Mouse move event
        $(this.id).mousemove(function (event) {
            if (onmouse) {
                event.preventDefault();

                var x = event.pageX - parent.left;
                var y = event.pageY - parent.top;

                parent.MouseMove(x, y, event.which);
            }
        });

        $(this.id).on("touchstart", function (event) {
            event.preventDefault();
            onmouse = true;

            var e = event.originalEvent;

            parent.onmouse = false;

            downx = e.touches[0].pageX - parent.left;
            downy = e.touches[0].pageY - parent.top;

            if (e.targetTouches.length > 2) {
                parent.MouseDown(downx, downy, 1);
                ontouch = 2;
            } else if (e.targetTouches.length > 1) {
                touch0x = e.targetTouches[0].pageX - parent.left;
                touch0y = e.targetTouches[0].pageY - parent.top;

                touch1x = e.targetTouches[1].pageX - parent.left;
                touch1y = e.targetTouches[1].pageY - parent.top;

                var dx = touch0x - touch1x;
                var dy = touch0y - touch1y;

                pointerdist = Math.sqrt(dx * dx + dy * dy);
                ontouch = 1;
            } else {
                ontouch = 0;
                pointerdist = 0;
                start = 0;
                parent.MouseDown(downx, downy, 0);
            }
        });

        $(this.id).on("touchmove", function (event) {
            if (onmouse) {
                event.preventDefault();

                var e = event.originalEvent;
                parent.onmouse = false;

                curx = e.touches[0].pageX - parent.left;
                cury = e.touches[0].pageY - parent.top;

                if (e.targetTouches.length > 2) {
                    parent.MouseMove(curx, cury, 1);
                } else if (e.targetTouches.length > 1) {
                    if (ontouch === 1) {
                        if (pointerdist === 0) {
                            touch0x = e.targetTouches[0].pageX - parent.left;
                            touch0y = e.targetTouches[0].pageY - parent.top;

                            touch1x = e.targetTouches[1].pageX - parent.left;
                            touch1y = e.targetTouches[1].pageY - parent.top;

                            var dx = touch0x - touch1x;
                            var dy = touch0y - touch1y;

                            pointerdist = Math.sqrt(dx * dx + dy * dy);

                        } else {
                            touch0x = e.targetTouches[0].pageX - parent.left;
                            touch0y = e.targetTouches[0].pageY - parent.top;

                            touch1x = e.targetTouches[1].pageX - parent.left;
                            touch1y = e.targetTouches[1].pageY - parent.top;

                            var dx = touch0x - touch1x;
                            var dy = touch0y - touch1y;

                            var dist = Math.sqrt(dx * dx + dy * dy);

                            var centerx = (touch0x + touch1x) / 2;
                            var centery = (touch0y + touch1y) / 2;

                            var delta = dist - pointerdist;
                            parent.MouseWheel(centerx, centery, (delta) / 20);

                            pointerdist = dist;
                        }
                    }
                } else {
                    if (ontouch === 0)
                        parent.MouseMove(curx, cury, 1);
                }

                start = 1;
            }
        });

        $(this.id).on("touchend", function (event) {
            event.preventDefault();
            parent.onmouse = false;

            if (start === 1) {
                parent.MouseUp(curx, cury, 1);
            } else {
                parent.MouseUp(downx, downy, 1);
            }

            if (ontouch > 0)
                if (event.targetTouches.length === 0)
                    ontouch = 0;

            start = 0;
        });

        $(this.id).on("touchcancel", function (event) {
            event.preventDefault();
            start = 0;
            ontouch = 0;
        });


        //Event handler for mouse wheel event.
        function wheel(event) {
            if (onmouse) {
                var delta = 0;
                if (!event)
                    event = window.event;

                if (event.wheelDelta) {
                    delta = event.wheelDelta / 240;
                } else if (event.detail) {
                    delta = -event.detail / 3;
                }

                var x = event.pageX - parent.left;
                var y = event.pageY - parent.top;

                parent.MouseWheel(x, y, delta);

                if (event.preventDefault)
                    event.preventDefault();
            }
        }
    };
};