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
var ShadowBg = (function (_super) {
    __extends(ShadowBg, _super);
    function ShadowBg() {
        var _this = _super.call(this) || this;
        _this.Global = Manager.GlobalManager.get();
        return _this;
    }
    ShadowBg.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    ShadowBg.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        for (var a = 0; a < this.Global.hasShadowArr.length; a++) {
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if (i * 8 + j == this.Global.hasShadowArr[a]) {
                        this["item" + (i * 8 + j)].visible = false;
                    }
                }
            }
        }
        this.Global.hasShadowArr = [];
    };
    return ShadowBg;
}(eui.Component));
__reflect(ShadowBg.prototype, "ShadowBg", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=ShadowBg.js.map