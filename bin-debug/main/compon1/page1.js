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
    //第一题的主页
    var page1 = (function (_super) {
        __extends(page1, _super);
        function page1(com) {
            var _this = _super.call(this) || this;
            com.addChild(_this);
            return _this;
        }
        page1.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        page1.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getinstance().playAnimation("关卡1背景动画", "huodonghua", "关卡1背景动画动画分组", this.animGroup, 0);
            this.ti = new z.ti1(this.tiGroup);
            this.dazi = new z.dazi(this.daziGroup);
            this.duti = new z.duti(this.dutiGroup);
            this.xue = new z.xue(this.xueGroup);
        };
        //初始化
        page1.prototype.init = function () {
            DRAGONBONES.getinstance().playAnimation("仓颉正面", "zhanli", "仓颉分组", this.daziGroup, 0);
            DRAGONBONES.getinstance().getarmature("仓颉正面").x = 248;
            DRAGONBONES.getinstance().getarmature("仓颉正面").y = 980;
            this.daziGroup.addChild(DRAGONBONES.getinstance().getarmature("仓颉写字"));
            DRAGONBONES.getinstance().getarmature("仓颉写字").x = 248;
            DRAGONBONES.getinstance().getarmature("仓颉写字").y = 980;
            DRAGONBONES.getinstance().getarmature("仓颉写字").visible = false;
            this.ti.init();
            this.xue.init();
            this.dazi.img.alpha = 0;
        };
        return page1;
    }(eui.Component));
    z.page1 = page1;
    __reflect(page1.prototype, "z.page1", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=page1.js.map