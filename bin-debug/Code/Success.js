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
var Success = (function (_super) {
    __extends(Success, _super);
    function Success() {
        return _super.call(this) || this;
    }
    Success.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    Success.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        DragonBonesManager.getInstance().addToFactory("taiozhanjieshu_ske_json", "taiozhanjieshu_tex_json", "taiozhanjieshu_tex_png");
        DragonBonesManager.getInstance().initArmatureDisplay("success", "tiaozhanjieshu");
        this.again.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.parent.visible = false;
            GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.click_sound);
            GlobalManager.getInstance().mainscene.restart();
        }, this);
    };
    Success.prototype.init = function () {
        this.label.alpha = 0;
        var wrongNum = GlobalManager.getInstance().mainscene.question.questionWrongNum;
        if (wrongNum == 0) {
            this.label.text = "恭喜你答对全部题目";
        }
        else if (wrongNum == 6) {
            this.label.text = "同学们，请再接再厉吧";
        }
        else {
            this.label.text = "答对" + ((6 - wrongNum) > 0 ? (6 - wrongNum) : 0) + "道题,答错" + wrongNum + "道题";
        }
        egret.Tween.get(this.label).to({ alpha: 1 }, 600);
        GlobalManager.getInstance().dg.playAnimation("success", "shengli", this.aniGroup, 1);
        GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.finish_sound);
    };
    return Success;
}(eui.Component));
__reflect(Success.prototype, "Success", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=Success.js.map