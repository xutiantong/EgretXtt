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
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        End.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        End.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("tiaozhanwancheng_ch_ske_json", "tiaozhanwancheng_ch_tex_json", "tiaozhanwancheng_ch_tex_png");
            this.end = DRAGONBONES.getInstance().initArmature("结束", "tiaozhanwancheng");
            this.aniGroup.addChild(this.end);
        };
        End.prototype.init = function () {
            egret.Tween.get(this.btnWord, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).
                to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 })
                .to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).wait(3000);
            this.end.animation.play("in", 1);
            this.btnWord.visible = this.Global.wrongArr.length > 0;
            MUSIC4.get().play("show", 1);
            //点击再来一次
            Manager.EventManager.get().addListener("End", this.restart, egret.TouchEvent.TOUCH_TAP, function () {
                //点击重置
                MUSIC4.get().play("dianji");
                MUSIC4.get().pauseLast();
                MUSIC4.get().play("bg", -1);
                Manager.DelayManager.get().removeAllDelay();
                Manager.GlobalManager.get().restart();
                Manager.EventManager.get().removeAllListener();
                Hierarchy.AbManager.get().hide("End");
                Hierarchy.AbManager.get().show("Start");
                Hierarchy.MenuManager.get().music.selected = false;
                Hierarchy.MenuManager.get().init();
            }, this);
            //点击卡库按钮
            Manager.EventManager.get().addListener("End", this.btnWord, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                Hierarchy.AbManager.get().hide("End");
                Hierarchy.AbManager.get().show("ErrBook");
            }, this);
        };
        return End;
    }(eui.Component));
    Assembly.End = End;
    __reflect(End.prototype, "Assembly.End", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=End.js.map