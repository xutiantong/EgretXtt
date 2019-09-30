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
     * 全局变量管理类
     */
    var GlobalManager = (function (_super) {
        __extends(GlobalManager, _super);
        function GlobalManager() {
            var _this = _super.call(this) || this;
            _this.questionType = 0;
            _this.questionNum = 1; //当前题号
            _this.questionCurArr = new Array(); //当前题库
            _this.wrongArr = []; //错题库
            _this.isFirstPlay = true; //是否第一次玩
            return _this;
        }
        //单例
        GlobalManager.get = function () {
            if (this.D == null) {
                this.D = new GlobalManager();
            }
            return this.D;
        };
        /**
         * 重来时初始化
         */
        GlobalManager.prototype.restart = function () {
            this.questionNum = 1;
            this.wrongArr = [];
        };
        GlobalManager.D = null;
        return GlobalManager;
    }(egret.EventDispatcher));
    Manager.GlobalManager = GlobalManager;
    __reflect(GlobalManager.prototype, "Manager.GlobalManager");
})(Manager || (Manager = {}));
//# sourceMappingURL=GlobalManager.js.map