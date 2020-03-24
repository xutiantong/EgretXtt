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
     * 错题本
     */
    var ErrBook = (function (_super) {
        __extends(ErrBook, _super);
        function ErrBook() {
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        ErrBook.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        ErrBook.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("shanshui_cuotiben_ske_json", "shanshui_cuotiben_tex_json", "shanshui_cuotiben_tex_png");
            this.cuotiAnim = DRAGONBONES.getInstance().initArmature("错题本动画", "cuotiben");
            this.cuotileft = DRAGONBONES.getInstance().initArmature("错题本左", "anniuzuo", "in", 1, this.aniGroup, 550, 540);
            this.cuotiright = DRAGONBONES.getInstance().initArmature("错题本右", "anniuyou", "in", 1, this.aniGroup, 1370, 540);
            this.aniGroup.addChild(this.cuotiAnim);
            this.cuotiAnim.armature.getSlot("zi").displayList = [this.questionLabel];
            this.cuotiAnim.x = 35;
            this.questionCfg = [];
            var config = RES.getRes("ti_json");
            for (var i = 0; i < 48; i++) {
                this.questionCfg.push(config[i]);
            }
        };
        ErrBook.prototype.init = function () {
            var _this = this;
            Hierarchy.AbManager.get().hide("End");
            this.page = 0;
            this.leftArrow.visible = false;
            this.cuotileft.visible = false;
            this.rightArrow.visible = this.Global.wrongArr.length > 1;
            this.cuotiright.visible = this.Global.wrongArr.length > 1;
            Manager.EventManager.get().addListener("CuoTiBen", this.leftArrow, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                _this.cuotileft.animation.play("click", 1);
                _this.page -= 1;
                _this.leftArrow.visible = _this.page > 0;
                _this.rightArrow.visible = _this.page < _this.Global.wrongArr.length - 1;
                _this.cuotileft.visible = _this.page > 0;
                _this.cuotiright.visible = _this.page < _this.Global.wrongArr.length - 1;
                _this.showCuoTi();
            }, this);
            Manager.EventManager.get().addListener("CuoTiBen", this.rightArrow, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                _this.cuotiright.animation.play("click", 1);
                _this.page += 1;
                _this.leftArrow.visible = _this.page > 0;
                _this.rightArrow.visible = _this.page < _this.Global.wrongArr.length - 1;
                _this.cuotileft.visible = _this.page > 0;
                _this.cuotiright.visible = _this.page < _this.Global.wrongArr.length - 1;
                _this.showCuoTi();
            }, this);
            this.showCuoTi();
            // this.contentGroup.y = -762;
            // this.contentGroup.alpha = 0;
            // egret.Tween.get(this.contentGroup).wait(2880).to({ y: 0, alpha: 1 }, 800, egret.Ease.backInOut);
            this.cuotiAnim.animation.play("in", 1);
            this.cuotileft.animation.play("in", 1);
            this.cuotiright.animation.play("in", 1);
        };
        ErrBook.prototype.showCuoTi = function () {
            var data = this.Global.wrongArr[this.page];
            var txt = this.questionCfg[parseInt(data)].analysis.split("\n");
            if (txt.length == 1) {
                this.questionLabel.text = "        " + txt[0];
                this.questionLabel.size = 56;
                this.questionLabel.textColor = 0x212102;
                this.questionLabel.wordWrap = true;
                this.questionLabel.textAlign = egret.HorizontalAlign.LEFT;
            }
            else {
                this.questionLabel.textAlign = egret.HorizontalAlign.CENTER;
                if (this.questionCfg[parseInt(data)].type == 2) {
                    this.questionLabel.textFlow = (new egret.HtmlTextParser).parse("<font color='#1e2406' size='61'>" + txt[0] + "\n</font>"
                        + "<font color='#3a4623' size='30'>" + txt[1] + "\n</font>"
                        + "<font color='#31340a' size='42'>  " + txt[2].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>"
                        + "<font color='#31340a' size='42'>  " + txt[3].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>"
                        + "<font color='#31340a' size='42'>  " + txt[4].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>"
                        + "<font color='#31340a' size='42'>  " + txt[5].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>");
                }
                else {
                    this.questionLabel.textFlow = [
                        { text: txt[0] + "\n", style: { "textColor": 0x1e2406, "size": 61 } },
                        { text: txt[1] + "\n", style: { "textColor": 0x3a4623, "size": 30 } },
                        { text: "  " + txt[2] + "\n", style: { "textColor": 0x31340a, "size": 42 } },
                        { text: "  " + txt[3] + "\n", style: { "textColor": 0x31340a, "size": 42 } },
                        { text: "  " + txt[4] + "\n", style: { "textColor": 0x31340a, "size": 42 } },
                        { text: "  " + txt[5] + "\n", style: { "textColor": 0x31340a, "size": 42 } }
                    ];
                }
            }
        };
        return ErrBook;
    }(eui.Component));
    Assembly.ErrBook = ErrBook;
    __reflect(ErrBook.prototype, "Assembly.ErrBook", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=ErrBook.js.map