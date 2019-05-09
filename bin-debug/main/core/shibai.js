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
    //失败界面组件
    var shibai = (function (_super) {
        __extends(shibai, _super);
        function shibai(com) {
            var _this = _super.call(this) || this;
            _this.skinName = "shibai";
            com.addChild(_this);
            return _this;
        }
        shibai.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getinstance().addToFactory("shibai_ske_json", "shibai_tex_json", "shibai_tex_png");
            DRAGONBONES.getinstance().initArmature("失败", "shibai");
            this.again.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.parent.visible = false;
                cores.getinstatic().index.GO_guanka();
            }, this);
        };
        shibai.prototype.init = function () {
            cores.getinstatic().dg.playAnimation("失败", "shibai", "失败分组", this.animGroup, 1);
        };
        return shibai;
    }(eui.Component));
    z.shibai = shibai;
    __reflect(shibai.prototype, "z.shibai", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=shibai.js.map