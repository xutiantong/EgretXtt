var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Assembly;
(function (Assembly) {
    /**
     * 挑战结束元件
     */
    var EndCell = (function (_super) {
        __extends(EndCell, _super);
        function EndCell(n, boo) {
            var _this = _super.call(this) || this;
            _this.n = n;
            _this.boo = boo;
            return _this;
        }
        EndCell.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        EndCell.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            var tiNum;
            switch (this.n) {
                case 0:
                    tiNum = "第一题";
                    break;
                case 1:
                    tiNum = "第二题";
                    break;
                case 2:
                    tiNum = "第三题";
                    break;
                case 3:
                    tiNum = "第四题";
                    break;
                case 4:
                    tiNum = "第五题";
                    break;
                case 5:
                    tiNum = "第六题";
                    break;
                case 6:
                    tiNum = "第七题";
                    break;
                case 7:
                    tiNum = "第八题";
                    break;
                case 8:
                    tiNum = "第九题";
                    break;
                case 9:
                    tiNum = "第十题";
                    break;
                default:
                    break;
            }
            this.lab.text = tiNum;
            if (this.boo == true) {
                this.img.source = "dui_png";
            }
            else {
                this.img.source = "cuo_png";
            }
        };
        return EndCell;
    }(eui.Component));
    Assembly.EndCell = EndCell;
    __reflect(EndCell.prototype, "Assembly.EndCell", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=EndCell.js.map