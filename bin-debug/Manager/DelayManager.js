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
 * 管理类
 */
var Manager;
(function (Manager) {
    /**
     * 延时管理
     */
    var DelayManager = (function (_super) {
        __extends(DelayManager, _super);
        function DelayManager() {
            var _this = _super.call(this) || this;
            // 多个延时线
            _this.delay1 = new Object;
            _this.delay2 = new Object;
            _this.delay3 = new Object;
            return _this;
        }
        /**
         * 添加延时
         * @param time 延时时间
         * @param callBack 延时执行的函数
         * @param num 延时线
         * @param loop 是否循环
         */
        DelayManager.prototype.addDelay = function (time, callBack, num, loop) {
            if (num === void 0) { num = 1; }
            if (loop === void 0) { loop = false; }
            egret.Tween.get(this["delay" + num], { loop: loop }).wait(time).call(callBack);
        };
        /**
         * 移除指定延时
         * @param num: 延时线
         */
        DelayManager.prototype.removeDelay = function (num) {
            egret.Tween.removeTweens(this["delay" + num]);
        };
        /**
         * 移除DelayManager所有延时
         */
        DelayManager.prototype.removeAllDelay = function () {
            egret.Tween.removeTweens(this["delay1"]);
            egret.Tween.removeTweens(this["delay2"]);
            egret.Tween.removeTweens(this["delay3"]);
        };
        //单例
        DelayManager.get = function () {
            if (this.D == null) {
                this.D = new DelayManager();
            }
            return this.D;
        };
        DelayManager.D = null;
        return DelayManager;
    }(egret.EventDispatcher));
    Manager.DelayManager = DelayManager;
    __reflect(DelayManager.prototype, "Manager.DelayManager");
})(Manager || (Manager = {}));
//# sourceMappingURL=DelayManager.js.map