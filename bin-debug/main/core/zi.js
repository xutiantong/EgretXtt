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
var z;
(function (z) {
    /**
        * 字组件
        */
    var zi = (function (_super) {
        __extends(zi, _super);
        function zi(zi) {
            var _this = _super.call(this) || this;
            _this.skinName = "zi";
            _this.zi = zi;
            return _this;
        }
        zi.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.check.visible = true;
            this.img.source = "green_png";
            this.setZi(this.zi);
        };
        zi.prototype.init = function () {
            this.check.visible = false;
        };
        zi.prototype.setcheck = function () {
            this.check.source = "cuo_png";
            this.img.source = "huang_png";
        };
        zi.prototype.setZi = function (zi) {
            this.visible = true;
            this.lab.text = zi;
        };
        return zi;
    }(eui.Component));
    z.zi = zi;
    __reflect(zi.prototype, "z.zi", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=zi.js.map