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
 * 组件
 */
var Assembly;
(function (Assembly) {
    /**
     * 开始界面组件
     */
    var Start = (function (_super) {
        __extends(Start, _super);
        function Start() {
            return _super.call(this) || this;
        }
        Start.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Start.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getinstance().addToFactory("kaishiyouxi_ske_json", "kaishiyouxi_tex_json", "kaishiyouxi_tex_png");
            this.startAni = DRAGONBONES.getinstance().initArmature("开始动画", "kaishiyouxi");
        };
        Start.prototype.onStart = function () {
            this.startButton.visible = false;
            Hierarchy.MenuManager.get().reback.touchEnabled = false;
            this.startAni.animation.play("out", 1);
            //点击声音
            MUSIC4.get().play("dianji");
            Hierarchy.MenuManager.get().reback.touchEnabled = true;
            //隐藏开始界面
            Hierarchy.AbManager.get().hide("Start");
            //显示场景1
            Hierarchy.AbManager.get().show("Scene1");
            //显示介绍界面
            Hierarchy.MessageManager.get().show("Introduction");
        };
        //每次show自动调用
        Start.prototype.init = function () {
            this.startButton.visible = true;
            DRAGONBONES.getinstance().playAnimation("开始动画", "newAnimation", "a", this.aniGroup, 1);
            Manager.EventManager.get().addListener("Start", this.startButton, egret.TouchEvent.TOUCH_TAP, this.onStart, this);
        };
        return Start;
    }(eui.Component));
    Assembly.Start = Start;
    __reflect(Start.prototype, "Assembly.Start", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
