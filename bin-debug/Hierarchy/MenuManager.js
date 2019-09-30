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
     * 菜单管理器
     * Hierarchy：1
     *
     */
    var MenuManager = (function (_super) {
        __extends(MenuManager, _super);
        function MenuManager() {
            var _this = _super.call(this) || this;
            _this.ifpause = false; //当前是否暂停状态
            _this.skinName = "Menu";
            return _this;
        }
        MenuManager.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.mains.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.reback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.group.height = 0;
            this.init();
        };
        MenuManager.prototype.touch = function (e) {
            var _this = this;
            MUSIC4.get().play("dianji");
            switch (e.target) {
                //点击暂停页面
                case this.lab:
                    console.log("正常");
                    this.ifpause = true;
                    egret.ticker.resume();
                    egret.ticker.update();
                    MUSIC4.get().continueLast();
                    egret.Tween.get(this.group).to({ height: 0 }, 300);
                    this.mains.selected = false;
                    this.rect.visible = false;
                    this.music.touchEnabled = true;
                    this.reback.touchEnabled = true;
                    this.pause.touchEnabled = true;
                    this.lab.visible = false;
                    break;
                case this.mains:
                    this.mains.touchEnabled = false;
                    //点击伸缩弹出
                    switch (this.mains.selected) {
                        case false:
                            Manager.DelayManager.get().removeDelay(3);
                            egret.Tween.get(this.group).to({ height: 0 }, 300).call(function () {
                                _this.mains.touchEnabled = true;
                            });
                            break;
                        case true:
                            egret.Tween.get(this.group).to({ height: 517 }, 500, egret.Ease.backOut).call(function () {
                                // 三秒自动收回
                                Manager.DelayManager.get().addDelay(3000, function () {
                                    egret.Tween.get(_this.group).to({ height: 0 }, 300).call(function () {
                                        _this.mains.touchEnabled = true;
                                        _this.mains.selected = false;
                                    });
                                }, 3);
                                _this.mains.touchEnabled = true;
                            });
                            break;
                        default:
                            break;
                    }
                    break;
                case this.reback:
                    //点击重置
                    MUSIC4.get().pauseLast();
                    MUSIC4.get().play("bg", -1);
                    Manager.DelayManager.get().removeAllDelay();
                    Manager.GlobalManager.get().restart();
                    Manager.EventManager.get().removeAllListener();
                    Hierarchy.AbManager.get().show("Start");
                    this.music.selected = false;
                    this.init();
                    break;
                case this.music:
                    //点击声音
                    switch (this.music.selected) {
                        case false:
                            MUSIC4.get().play("bg", -1);
                            break;
                        case true:
                            MUSIC4.get().stop("bg");
                            break;
                        default:
                            break;
                    }
                    break;
                case this.pause:
                    //点击暂停
                    console.log("暂停");
                    MUSIC4.get().pauseLast();
                    this.rect.visible = true;
                    this.music.touchEnabled = false;
                    this.lab.visible = true;
                    this.reback.touchEnabled = false;
                    this.pause.touchEnabled = false;
                    this.ifpause = true;
                    egret.ticker.update();
                    setTimeout(function () {
                        egret.ticker.pause();
                    }, 200);
                    break;
                default:
                    break;
            }
        };
        MenuManager.prototype.init = function () {
            var _this = this;
            this.lab.visible = false;
            this.rect.visible = false;
            this.ifpause = false;
            this.mains.selected = false;
            egret.Tween.get(this.group).to({ height: 0 }, 300).call(function () {
                _this.mains.touchEnabled = true;
            });
        };
        //单例
        MenuManager.get = function () {
            if (this.D == null) {
                this.D = new MenuManager();
            }
            return this.D;
        };
        MenuManager.D = null;
        return MenuManager;
    }(eui.Component));
    Hierarchy.MenuManager = MenuManager;
    __reflect(MenuManager.prototype, "Hierarchy.MenuManager", ["eui.UIComponent", "egret.DisplayObject"]);
})(Hierarchy || (Hierarchy = {}));
//# sourceMappingURL=MenuManager.js.map