/* global common, mobicanvasgraphics, mobicanvas, uiframework, CANVASCOMMAND */

var uicanvas2dmodel = function () {
    this.list = [];
    this.CTRL = 0;
    this.drawingid = 0;

    this.visible = new uiframework.PropertyBoolean("visible", true);

    this.Clone = function () {
        var model = new uicanvas2dmodel();

        for (i = 0; i < this.list.length; i++) {
            model.list.push(this.list[i].Clone());
        }

        return model;
    };

    this.Add = function (drawing) {
        if (drawing !== null) {
            this.drawingid++;

            if (drawing.id === undefined || drawing.id < 0)
                drawing.id = this.drawingid;

            else if (this.drawingid < drawing.id)
                this.drawingid = drawing.id;
        }

        if (drawing.name.value === "")
            drawing.name.value = this.list.length + 1;

        this.list[this.list.length] = drawing;

        return drawing;
    };

    this.Remove = function (object) {
        for (i = 0; i < this.list.length; i++) {
            if (this.list[i].id === object.id) {
                this.list.splice(i, 1);
                break;
            }
        }
    };

    this.Clear = function () {
        this.list = [];
    };

    this.Dispose = function () {
        for (var i = this.list.length - 1; i >= 0; i--) {
            delete this.list[i];
            this.list.pop();
        }
    };

    this.Bounds = function () {
        var bounds = new common.Bounds2F();
        this.ModelBounds(bounds, this.list);

        return bounds;
    };

    this.ModelBounds = function (bounds, list) {
        for (var i = 0; i < list.length; i++) {
            list[i].UpdateBounds(bounds);
        }
    };

    this.Delete = function () {
        this.DeleteObject(this.list);
    };

    this.DeleteObject = function (o) {
        if (this.visible.value) {
            var list = o;

            for (i = 0; i < list.length; i++) {
                if (list[i].selected) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    };

    this.Render = function (renderer) {
        if (this.visible.value) {
            //Render others
            for (var i = 0; i < this.list.length; i++)
                if (this.list[i] !== null && this.list[i].visible) {
                    if (this.list[i].name.value === "")
                        this.list[i].name.value = i + 1;

                    this.list[i].Render(renderer);
                }
        }
    };

    this.ClearSelection = function () {
        var list = this.list;
        for (i = 0; i < list.length; i++) {
            if (list[i] !== null)
                list[i].selected = false;
        }
    };

    this.SelectByRectangle = function (x1, y1, x2, y2) {
        this.SelectObjectByRectangle(this.list, x1, y1, x2, y2);
    };

    this.SetObjectForSelection = function (x, y) {
        this.UpdateObjectForSelection(this.list, x, y);
    };

    this.ClearObjectSelection = function (o) {
        var list = o;
        for (i = 0; i < list.length; i++) {
            if (list[i] !== null)
                list[i].selected = false;
        }
    };

    this.SelectObjectByRectangle = function (o, x1, y1, x2, y2, z1, z2, selected) {
        if (this.visible.value) {
            var sel = 0;
            var i = 0;
            var hasselection = false;

            for (i = o.length - 1; i >= 0; i--) {
                if (o[i] !== null) {
                    sel = o[i].selected;

                    if (o[i].SelectByRectangle && o[i].SelectByRectangle(x1, y1, x2, y2, z1, z2)) {
                        if (sel === 1 && o[i].sid === -1) {
                            o[i].selected = false;
                        } else if (o[i].sid !== -1) {
                            o[i].selected = true;
                            this.hasselection = true;

                            selected.push(o[i]);
                            hasselection = true;

                            for (var j = o.length - 1; j >= 0; j--) {
                                if (o[j] !== null) {
                                    if (o[j].sid === -1)
                                        o[j].selected = false;
                                }
                            }
                        } else {
                            o[i].selected = true;
                            this.hasselection = true;

                            selected.push(o[i]);
                            hasselection = true;
                        }
                    }
                }
            }

            return hasselection;
        }
    };

    this.UpdateObjectForSelection = function (o, x, y) {
        if (this.visible.value) {
            var list = o;
            var has = false;
            var ishandle = false;

            this.hasselection = false;

            for (i = 0; i < list.length; i++) {
                if (list[i] !== null && list[i].selected)
                    if (list[i].SelectByPoint(x, y)) {
                        if (list[i].sid !== -1)
                            ishandle = true;

                        has = true;
                        break;
                    }
            }

            if (has) {
                if (ishandle) {
                    for (i = 0; i < list.length; i++) {
                        if (list[i] !== null && list[i].sid !== -1) {
                            this.hasselection = true;
                            list[i].onmove = true;
                        }
                    }
                } else {
                    for (i = 0; i < list.length; i++) {
                        if (list[i] !== null && list[i].selected) {
                            this.hasselection = true;
                            list[i].onmove = true;
                        }
                    }
                }
            }
        }
    };

    this.SelectObjectByPoint = function (o, x, y) {
        if (this.visible.value) {
            //Select only one drawing
            this.hasselection = false;
            var sel = 0;
            var i = 0;

            for (i = o.length - 1; i >= 0; i--) {
                var object = o[i];
                if (object.iscontainer) {
                    if (object.SelectByPoint !== undefined && object.SelectByPoint(this, x, y))
                        return true;
                } else {
                    if (object !== null) {
                        sel = object.selected;

                        if (object.SelectByPoint !== undefined && object.SelectByPoint(x, y)) {
                            if (sel && object.sid === -1) {
                                object.selected = false;
                                this.hasselection = true;
                                object.drawprop = object.defaultprop;
                            } else if (object.sid !== -1) {
                                object.selected = true;
                                this.hasselection = true;
                                object.drawprop = object.selectedprop;

                                for (var j = o.length - 1; j >= 0; j--) {
                                    if (o[j] !== null) {
                                        if (o[j].sid === -1)
                                            o[j].selected = false;
                                    }
                                }
                            } else {
                                object.selected = true;
                                this.hasselection = true;
                                object.drawprop = object.selectedprop;
                            }

                            return true;
                        }
                    }
                }
            }
        }
    };

    this.ClearObjectForMove = function () {
        var list = this.list;
        for (i = 0; i < list.length; i++) {
            if (list[i] !== null)
                if (list[i].onmove) {
                    list[i].onmove = false;
                }
        }
    };


    //Selection

    this.SetObjectForSelection = function (x, y) {
        if (this.visible.value) {
            var list = this.list;
            var has = false;
            var ishandle = false;

            this.hasselection = false;

            for (i = 0; i < list.length; i++) {
                if (list[i] !== null && list[i].selected)
                    if (list[i].SelectByPoint(x, y)) {
                        if (list[i].sid !== -1)
                            ishandle = true;

                        has = true;
                        break;
                    }
            }

            if (has) {
                if (ishandle) {
                    for (i = 0; i < list.length; i++) {
                        if (list[i] !== null && list[i].sid !== -1) {
                            this.hasselection = true;
                            list[i].onmove = true;
                        }
                    }
                } else {
                    for (i = 0; i < list.length; i++) {
                        if (list[i] !== null && list[i].selected) {
                            this.hasselection = true;
                            list[i].onmove = true;
                        }
                    }
                }
            }
        }
    };

    this.TestSelectByPoint = function (x, y, z) {
        return this.TestSelectObjectByPoint(this.list, x, y, z);
    };

    this.TestSelectObjectByPoint = function (o, x, y, z) {
        if (this.visible.value) {
            //Select only one drawing
            this.hasselection = false;

            for (i = 0; i < o.length; i++) {
                if (o[i] !== null) {
                    if (o[i].SelectByPoint(x, y, z)) {
                        this.hasselection = true;
                        return true;
                    }
                }
            }
        }

        return false;
    };

    this.SelectByPoint = function (x, y, selected) {
        return this.SelectObjectByPoint(this.list, x, y, selected);
    };

    this.SelectObjectByPoint = function (o, x, y, z, selectedobjects) {
        if (this.visible.value) {
            //Select only one drawing
            this.hasselection = false;
            var i = 0;
            var selected = false;

            for (i = o.length - 1; i >= 0; i--) {
                var object = o[i];
                if (object.iscontainer) {
                    if (object.SelectByPoint(this, x, y, z)) {
                        selectedobjects.push(object);
                        return true;
                    }
                } else {
                    if (object !== null) {
                        selected = object.selected;

                        if (object.SelectByPoint && object.SelectByPoint(x, y, z)) {
                            object.selected = !selected;
                            this.hasselection = object.selected;
                            selectedobjects.push(object);
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    };

    this.SelectAll = function () {
        this.SelectAllList(this.list);
    };

    this.SelectAllList = function (list) {
        if (this.visible.value)
            for (i = 0; i < list.length; i++) {
                if (list[i] !== null)
                    list[i].selected = true;
            }
    };

    this.GetSelectedObjects = function (list, selection) {
        if (this.visible.value)
            for (i = 0; i < list.length; i++) {
                if (list[i].selected)
                    selection.push(list[i]);
            }
    };


    //Snap
    this.Snap = function (settings, x, y, tolerance) {
        if (settings.SNAPPOINT) {
            var snap = this.SnapToPoints(x, y, tolerance);
            if (snap !== undefined)
                return snap;
        }

        if (settings.SNAPLINE) {
            var snap = this.SnapToLines(x, y, tolerance);
            if (snap !== undefined)
                return snap;
        }
    };

    this.SnapToPoints = function (x, y, tolerance) {

    };

    this.SnapToLines = function (x, y, tolerance) {

    };

    this.SnapObjectToPoints = function (list, x, y, tolerance) {
        for (i = 0; i < list.length; i++) {
            if (list[i] !== null) {
                if (list[i].GetPoint !== undefined) {
                    var point = list[i].GetPoint();

                }
            }
        }
    };

    this.SnapObjectToLines = function (list, x, y, tolerance) {
        for (i = 0; i < list.length; i++) {
            if (list[i] !== null) {
                if (list[i].GetLine !== undefined) {
                    var line = list[i].GetLine();
                    if (line.InBetweenX(x) && line.InBetweenY(y)) {
                        var intersection = line.GetPointIntersection(new common.Point2F(x, y), tolerance);
                        if (intersection !== undefined) {
                            return intersection;
                        }
                    }
                }
            }
        }

        return;
    };


    //Key Events
    this.KeyDown = function (event, canvas) {
        switch (event.which) {
            case 17:    //CTRL
                this.CTRL = 1;
                break;

            case 27: //Escape    
                this.ClearSelection();

                if ((canvas.command === CANVASCOMMAND.DRAW) && canvas.mouse.mousedowncount === 0)
                    canvas.command = CANVASCOMMAND.SELECT;
                else if (canvas.command === CANVASCOMMAND.DRAW) {
                    canvas.mouse.downsnaplist = [];
                    canvas.mouse.mousedowncount = 0;
                }

                canvas.Render();

            case 32:    //Space
                break;

            case 46:    //Delete
                this.Delete();
                break;

            case 65:    //A
                if (this.CTRL === 1) {
                    this.SelectAll();
                    canvas.Render();
                }

                break;

            case 66:    //B
                if (this.CTRL === 1)
                    this.Copy();
                break;

            case 67:    //C
                if (this.CTRL === 1)
                    this.Copy();
                break;

            case 68:    //D
                break;

            case 69:    //E
                break;

            case 70:    //F
                break;

            case 71:    //G
                if (this.SHOWGRID)
                    this.SHOWGRID = 0;
                else
                    this.SHOWGRID = 1;

                break;

            case 72:    //H
                break;

            case 73:    //I
                break;

            case 76:    //L
                break;

            case 80:    //P
                break;

            case 82:    //R
                break;

            case 83:    //S
                canvas.SelectCommand();
                break;

            case 86:    //V
                if (this.CTRL === 1)
                    this.Paste();
                break;

            case 87:    //W
                break;

            case 88:    //X
                break;

            case 89:    //Y
                if (this.CTRL === 1) {
                    this.Redo();
                }
                break;

            case 90:    //Z
                if (this.CTRL === 1) {
                    this.Undo();
                }
                break;

            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:

            case 96:    //0
            case 97:    //1
            case 98:    //2
            case 99:    //3
            case 100:    //4
            case 101:    //5
            case 102:    //6
            case 103:    //7
            case 104:    //8
            case 105:    //9
//                if (canvas.textbox === undefined && canvas.command === CANVASCOMMAND.DRAW)
//                    canvas.ShowTextBox(canvas.mouse.current.x + canvas.left + 10, canvas.mouse.current.y + canvas.top - 30, this.ProcessTextBoxInput);

                break;

            case 113:    //F2
                break;

            case 114:    //F3
                break;

            case 115:    //F4
                canvas.ZoomAll();
                break;

            case 116:    //F5
                break;

            case 117:    //F6
                break;

            case 118:    //F7
                break;

            case 119:    //F8
                break;

            case 120:    //F9
                break;

            case 121:    //F10
                break;
        }
    };


    //Mouse Events
    this.OnMouseMove = function (renderer, x, y) {

    };


    // Tree View
    this.ModelTree = function () {

    };


    //Other Functionality
    this.GetProperty = function () {
        return this.selected ? this.selectedproperty : this.property;
    };
};