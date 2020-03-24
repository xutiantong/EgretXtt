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
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        Select.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Select.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("chutangsijie_1_ske_json", "chutangsijie_1_tex_json", "chutangsijie_1_tex_png");
            this.bookAnim = DRAGONBONES.getInstance().initArmature("翻书动画", "fanshu");
            this.aniGroup.addChild(this.bookAnim);
            this.bookAnim.armature.getSlot("shu_zuo2211").displayList = [this.slotLeftTextImg];
            this.bookAnim.armature.getSlot("shu_zuo_luobinwang").displayList = [this.slotLeftBg];
            this.bookAnim.armature.getSlot("shu_you_luobinwang").displayList = [this.slotRightGroup];
            // let img = new eui.Image("shu1_png");
            // this.addChild(img);
            // img.anchorOffsetX = img.width / 2;
            // img.anchorOffsetY = img.height / 2;
            // this.bookAnim.armature.getSlot("shu1").displayList = [img];
        };
        Select.prototype.init = function () {
            var _this = this;
            this.bookAnim.animation.gotoAndStopByFrame("fanshu", 0);
            this.slotLeftTextImg.alpha = 0;
            Manager.EventManager.get().addListener("Select", this.bookAnim, dragonBones.EgretEvent.COMPLETE, this.animComplete, this);
            this.closeImg.visible = false;
            egret.Tween.get(this.closeImg, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
            Manager.EventManager.get().addListener("Select", this.closeImg, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                MUSIC4.get().play("book");
                _this.closeImg.visible = false;
                _this.bookAnim.animation.timeScale = -1;
                _this.bookAnim.animation.play("fanshu", 1);
            }, this);
            this.slotLeftBg.source = "bookSlotBg" + (this.num - 1) + "_png";
            this.slotLeftTextImg.source = "bookSlotLabel" + (this.num - 1) + "_png";
            this.slotImg.source = "select_slot" + (this.num - 1) + "_png";
        };
        Select.prototype.playBookAnim = function () {
            MUSIC4.get().play("book");
            this.bookAnim.animation.timeScale = 1;
            this.bookAnim.animation.play("fanshu", 1);
        };
        Select.prototype.animComplete = function (evt) {
            var _this = this;
            if (evt.animationName == "fanshu") {
                if (evt.armature.animation.timeScale == 1) {
                    egret.Tween.get(this.slotLeftTextImg).to({ alpha: 1 }, 500).call(function () {
                        _this.closeImg.visible = true;
                    });
                }
                else {
                    egret.Tween.get(this).wait(500).call(function () {
                        //展示scene, 开始做题
                        Hierarchy.AbManager.get().hide("Select");
                        Hierarchy.AbManager.get().getOne("Scene1").num = _this.num - 1;
                        Hierarchy.AbManager.get().show("Scene1");
                    });
                }
            }
        };
        return Select;
    }(eui.Component));
    Assembly.Select = Select;
    __reflect(Select.prototype, "Assembly.Select", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=Select.js.map