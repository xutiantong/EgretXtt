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
    var CuoTiBenCell = (function (_super) {
        __extends(CuoTiBenCell, _super);
        function CuoTiBenCell(word, correct) {
            var _this = _super.call(this) || this;
            _this.word = word;
            _this.correct = correct;
            return _this;
        }
        CuoTiBenCell.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        CuoTiBenCell.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.label.text = this.word;
            if (!this.correct) {
                this.mark.source = "cuo_png";
            }
        };
        return CuoTiBenCell;
    }(eui.Component));
    Assembly.CuoTiBenCell = CuoTiBenCell;
    __reflect(CuoTiBenCell.prototype, "Assembly.CuoTiBenCell", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=CuoTiBenCell.js.map