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
/**
 * 层级管理模块
 */
var Hierarchy;
(function (Hierarchy) {
    /**
     * 引导管理器
     * Hierarchy：4
     */
    var GuideManager = (function (_super) {
        __extends(GuideManager, _super);
        function GuideManager() {
            var _this = _super.call(this) || this;
            DRAGONBONES.getinstance().addToFactory("dongdongdianji_ske_json", "dongdongdianji_tex_json", "dongdongdianji_tex_png");
            //初始化对号(全局唯一)
            DRAGONBONES.getinstance().initArmature("手指", "shouzhi");
            return _this;
        }
        //指引
        GuideManager.prototype.show = function (x, y) {
        };
        //隐藏
        GuideManager.prototype.hide = function () {
        };
        //单例
        GuideManager.get = function () {
            if (this.D == null) {
                this.D = new GuideManager();
            }
            return this.D;
        };
        GuideManager.D = null;
        return GuideManager;
    }(egret.DisplayObjectContainer));
    Hierarchy.GuideManager = GuideManager;
    __reflect(GuideManager.prototype, "Hierarchy.GuideManager");
})(Hierarchy || (Hierarchy = {}));
