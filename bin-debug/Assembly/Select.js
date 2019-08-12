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
     * 选关界面组件
     */
    var Select = (function (_super) {
        __extends(Select, _super);
        function Select() {
            return _super.call(this) || this;
        }
        Select.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Select.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("budai_ske_json", "budai_tex_json", "budai_tex_png");
            this.ani = DRAGONBONES.getInstance().initArmature("串场动画", "chuanchang");
            this.aniGroup.addChild(this.ani);
        };
        Select.prototype.init = function () {
            this.ani.animation.play("newAnimation", 1);
            Manager.DelayManager.get().addDelay(8200, function () {
                MUSIC4.get().play("introduction1");
                Manager.DelayManager.get().addDelay(28000, function () {
                    MUSIC4.get().stop("introduction1");
                    Hierarchy.AbManager.get().show("Scene1");
                    Hierarchy.AbManager.get().hide("Select");
                }, 3);
            }, 3);
            Manager.EventManager.get().addListener("Select", this.aniGroup, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                Manager.DelayManager.get().removeDelay(3);
                MUSIC4.get().stop("introduction1");
                Hierarchy.AbManager.get().show("Scene1");
                Hierarchy.AbManager.get().hide("Select");
            }, this);
        };
        return Select;
    }(eui.Component));
    Assembly.Select = Select;
    __reflect(Select.prototype, "Assembly.Select", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
