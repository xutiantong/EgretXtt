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
     * 组件管理器
     * Hierarchy：1
     */
    var AbManager = (function (_super) {
        __extends(AbManager, _super);
        function AbManager() {
            var _this = _super.call(this) || this;
            _this.Arr = new Array(); //存储组件
            return _this;
        }
        /**
         * 注册组件
         */
        AbManager.prototype.init = function (arr) {
            var _this = this;
            arr.forEach(function (v) {
                _this.Arr.push(v);
            });
        };
        /**
         * 显示组件
         */
        AbManager.prototype.show = function (name) {
            var _this = this;
            this.Arr.forEach(function (v) {
                if (v.name == name) {
                    _this.addChild(v.obj);
                    if (v.obj["init"] != null) {
                        v.obj.init();
                    }
                }
            });
        };
        /**
         * 隐藏组件
         */
        AbManager.prototype.hide = function (name) {
            var _this = this;
            this.Arr.forEach(function (v) {
                if (v.name == name) {
                    if (v.obj.parent) {
                        _this.removeChild(v.obj);
                        Manager.EventManager.get().removeListenerFromClass(String(name));
                    }
                }
            });
        };
        /**
         * 获取组件
         */
        AbManager.prototype.getOne = function (name) {
            var a = null;
            this.Arr.forEach(function (v) {
                if (v.name == name) {
                    a = v.obj;
                }
            });
            return a;
        };
        //单例
        AbManager.get = function () {
            if (this.D == null) {
                this.D = new AbManager();
            }
            return this.D;
        };
        AbManager.D = null;
        return AbManager;
    }(egret.DisplayObjectContainer));
    Hierarchy.AbManager = AbManager;
    __reflect(AbManager.prototype, "Hierarchy.AbManager");
})(Hierarchy || (Hierarchy = {}));
