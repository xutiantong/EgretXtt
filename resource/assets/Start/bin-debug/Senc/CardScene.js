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
     * 卡库
     */
    var CardScene = (function (_super) {
        __extends(CardScene, _super);
        function CardScene() {
            return _super.call(this) || this;
        }
        CardScene.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        CardScene.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("zika_ske_json", "zika_tex_json", "zika_tex_png");
            this.cardAnim = DRAGONBONES.getInstance().initArmature("卡片动画", "zika");
            this.animGroup.addChild(this.cardAnim);
            // this.cardAnim.scaleX = this.cardAnim.scaleY = 0.8
            var tian = new eui.Image("card1_png");
            var tu = new eui.Image("card2_png");
            tian.anchorOffsetX = 398 / 2;
            tian.anchorOffsetY = 599 / 2;
            tu.anchorOffsetX = 398 / 2;
            tu.anchorOffsetY = 599 / 2;
            this.cardAnim.armature.getSlot("card_tian").displayList = [tian];
            this.cardAnim.armature.getSlot("card_tu").displayList = [tu];
        };
        CardScene.prototype.init = function () {
            var _this = this;
            this.cardAnim.animation.play("in", 1);
            this.animGroup.touchChildren = true;
            Manager.EventManager.get().addListener("CardScene", this.animGroup, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                _this.cardAnim.animation.play("click", 1);
                _this.animGroup.touchChildren = false;
            }, this);
            Manager.EventManager.get().addListener("CardScene", this.cardAnim, dragonBones.EgretEvent.COMPLETE, function (evt) {
                if (evt.animationName == "click") {
                    _this.cardAnim.animation.play("katanchu", 1);
                }
            }, this);
            Manager.EventManager.get().addListener("CardScene", this.return, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                Hierarchy.AbManager.get().hide("CardScene");
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
        };
        return CardScene;
    }(eui.Component));
    Assembly.CardScene = CardScene;
    __reflect(CardScene.prototype, "Assembly.CardScene", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=CardScene.js.map