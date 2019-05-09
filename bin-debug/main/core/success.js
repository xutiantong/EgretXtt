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
     * 成功界面
     */
    var success = (function (_super) {
        __extends(success, _super);
        function success(com) {
            var _this = _super.call(this) || this;
            _this.skinName = "success";
            com.addChild(_this);
            return _this;
        }
        success.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getinstance().addToFactory("taiozhanjieshu_ske_json", "taiozhanjieshu_tex_json", "taiozhanjieshu_tex_png");
            DRAGONBONES.getinstance().initArmature("挑战结束", "tiaozhanjieshu");
            cores.getinstatic().dg.getarmature("挑战结束").y -= 160;
            this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.parent.visible = false;
                cores.getinstatic().index.GO_guanka();
            }, this);
        };
        success.prototype.init = function (page) {
            var _this = this;
            this.ziGroup.scaleX = 0;
            this.ziGroup.scaleY = 0;
            this.ziGroup.x = 613;
            egret.Tween.get(this.ziGroup).to({ scaleX: 1, scaleY: 1 }, 850, egret.Ease.quadIn);
            this.ziGroup.removeChildren();
            var layou = new eui.TileLayout();
            layou.paddingTop = 6;
            this.ziGroup.layout = layou;
            this.ziGroup.x = 630;
            for (var i = 0; i < page.ti.Arr.length; i++) {
                var zi_1 = new z.zi(page.ti.Arr[i]);
                if (page.ti.Arr.length >= 9) {
                    zi_1.scaleX = 0.9;
                    zi_1.scaleY = 0.9;
                }
                this.ziGroup.addChild(zi_1);
            }
            page.ti.Arr_cuo.forEach(function (j) {
                var zi = _this.ziGroup.getChildAt(j);
                zi.setcheck();
            });
            cores.getinstatic().dg.playAnimation("挑战结束", "shengli", "挑战结束分组", this.animGroup, 1);
        };
        return success;
    }(eui.Component));
    z.success = success;
    __reflect(success.prototype, "z.success", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=success.js.map