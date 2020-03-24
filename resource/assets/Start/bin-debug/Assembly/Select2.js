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
    var Select2 = (function (_super) {
        __extends(Select2, _super);
        function Select2() {
            return _super.call(this) || this;
        }
        Select2.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Select2.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("xuanren_ske_json", "xuanren_tex_json", "xuanren_tex_png");
            DRAGONBONES.getInstance().initArmature("选择背景", "bg", "newAnimation", 1, this.aniGroup);
            DRAGONBONES.getInstance().initArmature("选择左", "btn_xuanren", "normal", 0, this.aniGroup, 480, 540);
            DRAGONBONES.getInstance().initArmature("选择右", "btn_xuanren1", "normal", 0, this.aniGroup, 1440, 540);
            DRAGONBONES.getInstance().initArmature("柳叶", "liuye1", "newAnimation", 0, this.aniGroup);
        };
        Select2.prototype.init = function () {
            var _this = this;
            DRAGONBONES.getInstance().getarmature("选择左").animation.play("normal", 0);
            DRAGONBONES.getInstance().getarmature("选择右").animation.play("normal", 0);
            Manager.EventManager.get().addListener("Select2", this.select1, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                MUSIC4.get().stop("tips1");
                DRAGONBONES.getInstance().getarmature("选择左").animation.play("click", 1);
                egret.Tween.get(_this.select1).wait(330).call(function () {
                    Hierarchy.AbManager.get().hide("Select2");
                    Hierarchy.AbManager.get().getOne("Select").num = 1;
                    Hierarchy.AbManager.get().show("Select");
                    Hierarchy.AbManager.get().getOne("Select").playBookAnim();
                });
            }, this);
            Manager.EventManager.get().addListener("Select2", this.select2, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                MUSIC4.get().stop("tips1");
                DRAGONBONES.getInstance().getarmature("选择右").animation.play("click", 1);
                egret.Tween.get(_this.select2).wait(330).call(function () {
                    Hierarchy.AbManager.get().hide("Select2");
                    Hierarchy.AbManager.get().getOne("Select").num = 2;
                    Hierarchy.AbManager.get().show("Select");
                    Hierarchy.AbManager.get().getOne("Select").playBookAnim();
                });
            }, this);
        };
        return Select2;
    }(eui.Component));
    Assembly.Select2 = Select2;
    __reflect(Select2.prototype, "Assembly.Select2", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=Select2.js.map