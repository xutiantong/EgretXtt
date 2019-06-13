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
     * 游戏场景最底层
     * Hierarchy：0
     */
    var BottomManager = (function (_super) {
        __extends(BottomManager, _super);
        function BottomManager() {
            var _this = _super.call(this) || this;
            _this.Arr = new Array(); //源数组
            _this.Arred = new Array(); //找到的错别字
            _this.skinName = "Bottom";
            return _this;
        }
        BottomManager.prototype.childrenCreated = function () {
            this.init();
        };
        BottomManager.prototype.init = function () {
        };
        //单例
        BottomManager.get = function () {
            if (this.D == null) {
                this.D = new BottomManager();
            }
            return this.D;
        };
        BottomManager.D = null;
        return BottomManager;
    }(eui.Component));
    Hierarchy.BottomManager = BottomManager;
    __reflect(BottomManager.prototype, "Hierarchy.BottomManager", ["eui.UIComponent", "egret.DisplayObject"]);
})(Hierarchy || (Hierarchy = {}));
