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
        GlobalManager.getInstance().dg.addToFactory("dongdongAnimation2x_ske_json", "dongdongAnimation2x_tex_json", "dongdongAnimation2x_tex_png");
        this.duibai = GlobalManager.getInstance().dg.initArmatureDisplay("duibai", "dongdong");
        this.duibai.scaleX = 0.3;
        this.duibai.scaleY = 0.3;
        this.duibai.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
        var tmp = new egret.Bitmap();
        tmp.texture = RES.getRes("talk1_png");
        tmp.anchorOffsetX = tmp.texture.textureWidth / 2;
        tmp.anchorOffsetY = tmp.texture.textureHeight / 2;
        this.duibai.armature.getSlot("qipao").displayList = [tmp];
        GlobalManager.getInstance().dg.playAnimation("duibai", "talk_tanchu", this.aniGroup, 1, 200, 1080);
        this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.talk_introduction1_sound);
        GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction1_sound)
            .addEventListener(egret.Event.SOUND_COMPLETE, this.onSound, this);
    };
    Introduction.prototype.startGame = function () {
        GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.click_sound);
        GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction1_sound).stop();
        if (GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction2_sound)) {
            GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction2_sound).stop();
        }
        GlobalManager.getInstance().mainscene.startGame();
    };
    Introduction.prototype.onComplete = function (evt) {
        if (evt.animationName == "talk_tanchu") {
            this.duibai.animation.play("xunhuan_tishi", 0);
        }
    };
    Introduction.prototype.onSound = function () {
        var tmp = new egret.Bitmap();
        tmp.texture = RES.getRes("talk2_png");
        tmp.anchorOffsetX = tmp.texture.textureWidth / 2;
        tmp.anchorOffsetY = tmp.texture.textureHeight / 2;
        this.duibai.armature.getSlot("qipao").displayList = [tmp];
        GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.talk_introduction2_sound);
    };
    return Introduction;
}(eui.Component));
__reflect(Introduction.prototype, "Introduction", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=Introduction.js.map