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
var Assembly;
(function (Assembly) {
    /**
     * 挑战结束组件
     */
    var End = (function (_super) {
        __extends(End, _super);
        function End() {
            return _super.call(this) || this;
        }
        End.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        End.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("tiaozhanwancheng_ske_json", "tiaozhanwancheng_tex_json", "tiaozhanwancheng_tex_png");
            this.end = DRAGONBONES.getInstance().initArmature("挑战结束动画", "tiaozhanwancheng1");
        };
        End.prototype.init = function () {
            egret.Tween.get(this.cuotiben, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).
                to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 })
                .to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).wait(3000);
            MUSIC4.get().play("success");
            DRAGONBONES.getInstance().playAnimation("挑战结束动画", "tiaozhanwancheng_kuai", this.aniGroup, 1, 1, 1, 1);
            this.cuotiben.visible = false;
            if (Manager.GlobalManager.get().wrongArr.length > 0) {
                this.cuotiben.visible = true;
            }
            //添加对错
            this.label.textFlow = (new egret.HtmlTextParser).parser("完成<font color='#f45110'>" + (9 - Manager.GlobalManager.get().wrongArr.length) + "</font>个食物分类");
            this.end.armature.getSlot("wenzi").displayList = [this.contentGroup];
            // this.contentGroup.alpha = 0;
            // this.contentGroup.scaleX = 0;
            // this.contentGroup.scaleY = 0;
            // egret.Tween.get(this.contentGroup).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backInOut);
            //点击再来一次
            Manager.EventManager.get().addListener("End", this.restart, egret.TouchEvent.TOUCH_TAP, function () {
                //点击重置
                MUSIC4.get().play("dianji");
                MUSIC4.get().pauseLast();
                MUSIC4.get().play("bg", -1);
                Manager.DelayManager.get().removeAllDelay();
                Manager.GlobalManager.get().restart();
                Manager.EventManager.get().removeAllListener();
                Hierarchy.AbManager.get().show("Start");
                Hierarchy.MenuManager.get().music.selected = false;
                Hierarchy.MenuManager.get().init();
            }, this);
            //点击错题本
            Manager.EventManager.get().addListener("End", this.cuotiben, egret.TouchEvent.TOUCH_TAP, function () {
                Hierarchy.AbManager.get().show("ErrBook");
                MUSIC4.get().play("dianji");
            }, this);
        };
        return End;
    }(eui.Component));
    Assembly.End = End;
    __reflect(End.prototype, "Assembly.End", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=End.js.map