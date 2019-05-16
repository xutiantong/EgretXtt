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
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        var _this = _super.call(this) || this;
        //声音
        _this.bg_sound = RES.getRes("bg_mp3");
        _this.fail_sound = RES.getRes("again_mp3");
        _this.err_sound = RES.getRes("err_mp3");
        _this.click_sound = RES.getRes("dianji_mp3");
        _this.finish_sound = RES.getRes("finish_mp3");
        _this.talk_introduction1_sound = RES.getRes("talk_introduction1_mp3");
        _this.talk_introduction2_sound = RES.getRes("talk_introduction2_mp3");
        _this.bird_sound = RES.getRes("bird_mp3");
        _this.bubble_sound = RES.getRes("bubble_mp3");
        _this.crab_sound = RES.getRes("crab_mp3");
        _this.seastar_sound = RES.getRes("seastar_mp3");
        _this.shell_sound = RES.getRes("shell_mp3");
        _this.wave_sound = RES.getRes("wave_mp3");
        return _this;
    }
    MainScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    MainScene.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.loadRes();
        this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showIntroduction, this);
        this.music = new MusicManager(this.bg_sound, this.fail_sound, this.err_sound, this.click_sound, this.finish_sound, this.talk_introduction1_sound, this.talk_introduction2_sound, this.bird_sound, this.bubble_sound, this.crab_sound, this.seastar_sound, this.shell_sound, this.wave_sound);
        GlobalManager.getInstance().dg.playAnimation("changjing", "normal", this.bgGroup);
        GlobalManager.getInstance().dg.playAnimation("start", "chongshua", this.startAniGroup, 1);
        this.changjing.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
        this.music.play(this.bg_sound, -1);
        egret.Tween.get(this, { loop: true }).wait(15000).call(function () { _this.music.play(_this.bird_sound); });
    };
    MainScene.prototype.loadRes = function () {
        GlobalManager.getInstance().dg.addToFactory("xiaodongwu_ske_json", "xiaodongwu_tex_json", "xiaodongwu_tex_png");
        GlobalManager.getInstance().dg.addToFactory("changjing_ske_json", "changjing_tex_0_json", "changjing_tex_0_png");
        // GlobalManager.getInstance().dg.addToFactoryAtlas("changjing_tex_0_json", "changjing_tex_0_png");
        GlobalManager.getInstance().dg.addToFactoryAtlas("changjing_tex_1_json", "changjing_tex_1_png");
        GlobalManager.getInstance().dg.addToFactoryAtlas("changjing_tex_2_json", "changjing_tex_2_png");
        this.changjing = GlobalManager.getInstance().dg.initArmatureDisplay("changjing", "changjingdonghua");
        this.startgame = GlobalManager.getInstance().dg.initArmatureDisplay("start", "kaishiyouxi");
    };
    MainScene.prototype.onComplete = function (evt) {
        if (evt.animationName == "chongshua") {
            this.changjing.animation.play("in", 1);
        }
        else if (evt.animationName == "in") {
            this.changjing.animation.play("normal");
            this.question.showNextAniIn();
        }
    };
    MainScene.prototype.startGame = function () {
        this.startGroup.visible = false;
        this.music.play(this.click_sound);
        this.introductionGroup.visible = false;
        this.system = new System();
        this.systemGroup.addChild(this.system);
        this.question = new Question();
        this.questionGroup.addChild(this.question);
        this.success = new Success();
        this.successGroup.addChild(this.success);
        this.successGroup.visible = false;
    };
    MainScene.prototype.showIntroduction = function () {
        this.startGroup.visible = false;
        this.music.play(this.click_sound);
        this.introduction = new Introduction();
        this.introductionGroup.addChild(this.introduction);
    };
    MainScene.prototype.showSuccess = function () {
        this.successGroup.visible = true;
        this.success.init();
    };
    MainScene.prototype.restart = function () {
        this.changjing.animation.play("normal");
        this.question.restart();
    };
    MainScene.prototype.showWave = function () {
        this.changjing.animation.play("chongshua", 1);
        this.music.play(this.wave_sound);
    };
    return MainScene;
}(eui.Component));
__reflect(MainScene.prototype, "MainScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=MainScene.js.map