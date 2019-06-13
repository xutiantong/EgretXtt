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
     * 事件管理
     */
    var EventManager = (function (_super) {
        __extends(EventManager, _super);
        function EventManager() {
            var _this = _super.call(this) || this;
            _this.listenerArr = []; //事件监听列表
            return _this;
        }
        /**
         * 添加监听事件
         * @param className 类名
         * @param addObj 添加事件的对象
         * @param type 事件类型
         * @param listener 监听回调方法
         * @param thisObj this对象
         */
        EventManager.prototype.addListener = function (className, addObj, type, listener, thisObj) {
            // if (DEBUG) console.log("addListener: " + className);
            addObj.addEventListener(type, listener, thisObj);
            this.listenerArr.push({ className: className, addObj: addObj, type: type, listener: listener, thisObj: thisObj });
        };
        /**
         * 移除类中全部监听事件
         * @param className 类名
         */
        EventManager.prototype.removeListenerFromClass = function (className) {
            var _this = this;
            this.listenerArr.forEach(function (v, i) {
                if (v != null && v.className == className) {
                    v.addObj.removeEventListener(v.type, v.listener, v.thisObj);
                    _this.listenerArr[i] = null;
                }
            });
            this.listenerArr = this.listenerArr.filter(function (v) { return v != null; });
        };
        /**
         * 移除EventManager中全部监听事件
         */
        EventManager.prototype.removeAllListener = function () {
            this.listenerArr.forEach(function (v, i) {
                if (v != null) {
                    v.addObj.removeEventListener(v.type, v.listener, v.thisObj);
                }
            });
            this.listenerArr = [];
        };
        //单例
        EventManager.get = function () {
            if (this.D == null) {
                this.D = new EventManager();
            }
            return this.D;
        };
        EventManager.D = null;
        return EventManager;
    }(egret.EventDispatcher));
    Manager.EventManager = EventManager;
    __reflect(EventManager.prototype, "Manager.EventManager");
})(Manager || (Manager = {}));
