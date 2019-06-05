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
    var Introduction = (function (_super) {
        __extends(Introduction, _super);
        function Introduction() {
            return _super.call(this) || this;
        }
        Introduction.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Introduction.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getinstance().addToFactory("talk_ske_json", "talk_tex_json", "talk_tex_png");
            this.dongdong = DRAGONBONES.getinstance().initArmature("东东介绍", "dongdong");
            this.addChild(this.dongdong);
            this.dongdong.scaleX = 0.5;
            this.dongdong.scaleY = 0.5;
            this.dongdong.x = 350;
            this.dongdong.y = 1080;
        };
        Introduction.prototype.init = function () {
            Manager.EventManager.get().addListener("Introduction", this.touchGroup, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            Manager.EventManager.get().addListener("Introduction", this.dongdong, dragonBones.EgretEvent.COMPLETE, this.onComplete, this);
            MUSIC4.get().play("introduction");
            this.dongdong.animation.play("talk_tanchu", 1);
            var tmp = new egret.Bitmap();
            tmp.texture = RES.getRes("a1_png");
            tmp.anchorOffsetX = tmp.texture.textureWidth / 2;
            tmp.anchorOffsetY = tmp.texture.textureHeight / 2;
            this.dongdong.armature.getSlot("qipao").displayList = [tmp];
        };
        Introduction.prototype.onClick = function () {
            //点击声音
            MUSIC4.get().play("dianji");
            //介绍声音
            MUSIC4.get().stop("introduction");
            //隐藏介绍界面
            Hierarchy.MessageManager.get().hide("Introduction");
            //开始第一题
            Hierarchy.AbManager.get().getOne("Scene1").showNextQuestion();
            Hierarchy.AbManager.get().getOne("Scene1").showDongDong(true);
        };
        Introduction.prototype.onComplete = function (evt) {
            if (evt.animationName == "talk_tanchu") {
                this.dongdong.animation.play("xunhuan", 0);
            }
        };
        return Introduction;
    }(eui.Component));
    Assembly.Introduction = Introduction;
    __reflect(Introduction.prototype, "Assembly.Introduction", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=Introduction.js.map