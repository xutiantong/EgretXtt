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
            DRAGONBONES.getinstance().addToFactory("taiozhanjieshu_ske_json", "taiozhanjieshu_tex_json", "taiozhanjieshu_tex_png");
            DRAGONBONES.getinstance().initArmature("挑战结束动画", "tiaozhanjieshu");
        };
        //自动初始化
        End.prototype.init = function () {
            egret.Tween.get(this.cuotiben, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).
                to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 })
                .to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).wait(3000);
            MUSIC4.get().play("over");
            DRAGONBONES.getinstance().playAnimation("挑战结束动画", "shengli", "a", this.aniGroup, 1, 1, 1, 1, 0, -120);
            this.cuotiben.visible = false;
            if (Manager.GlobalManager.get().wrongArr.length > 0) {
                this.cuotiben.visible = true;
            }
            //添加对错
            this.contentGroup.removeChildren();
            var _loop_1 = function (i) {
                var correct = true;
                Manager.GlobalManager.get().wrongArr.forEach(function (v) {
                    if (v.id - 1 == i) {
                        correct = false;
                    }
                });
                this_1.contentGroup.addChild(new Assembly.EndCell(i, correct));
            };
            var this_1 = this;
            for (var i = 0; i < 6; i++) {
                _loop_1(i);
            }
            this.contentGroup.alpha = 0;
            this.contentGroup.scaleX = 0;
            this.contentGroup.scaleY = 0;
            egret.Tween.get(this.contentGroup).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backInOut);
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
                Hierarchy.AbManager.get().show("CuoTiBen");
                MUSIC4.get().play("dianji");
            }, this);
        };
        return End;
    }(eui.Component));
    Assembly.End = End;
    __reflect(End.prototype, "Assembly.End", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
