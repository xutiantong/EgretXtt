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
    var CuoTiBen = (function (_super) {
        __extends(CuoTiBen, _super);
        function CuoTiBen() {
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        CuoTiBen.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        CuoTiBen.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getinstance().addToFactory("cuotiben_ske_json", "cuotiben_tex_json", "cuotiben_tex_png");
            DRAGONBONES.getinstance().initArmature("错题本动画", "Armature");
            this.scrollerLeft.verticalScrollBar.autoVisibility = false;
            this.scrollerLeft.verticalScrollBar.visible = false;
            this.scrollerRight.verticalScrollBar.autoVisibility = false;
            this.scrollerRight.verticalScrollBar.visible = false;
        };
        CuoTiBen.prototype.init = function () {
            var _this = this;
            this.page = 0;
            this.leftArrow.visible = false;
            this.rightArrow.visible = this.Global.wrongArr.length > 1;
            Manager.EventManager.get().addListener("CuoTiBen", this.leftArrow, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                _this.page -= 1;
                _this.leftArrow.visible = _this.page > 0;
                _this.rightArrow.visible = _this.page < _this.Global.wrongArr.length - 1;
                _this.scrollerLeft.viewport.scrollV = 0;
                _this.scrollerRight.viewport.scrollV = 0;
                _this.showCuoTi();
            }, this);
            Manager.EventManager.get().addListener("CuoTiBen", this.rightArrow, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                _this.page += 1;
                _this.leftArrow.visible = _this.page > 0;
                _this.rightArrow.visible = _this.page < _this.Global.wrongArr.length - 1;
                _this.scrollerLeft.viewport.scrollV = 0;
                _this.scrollerRight.viewport.scrollV = 0;
                _this.showCuoTi();
            }, this);
            this.showCuoTi();
            this.scrollerRight.y = -400;
            this.scrollerLeft.y = -400;
            this.scrollerRight.alpha = 0;
            this.scrollerLeft.alpha = 0;
            egret.Tween.get(this.scrollerRight).to({ y: 362, alpha: 1 }, 800, egret.Ease.backInOut);
            egret.Tween.get(this.scrollerLeft).to({ y: 362, alpha: 1 }, 800, egret.Ease.backInOut);
            DRAGONBONES.getinstance().playAnimation("错题本动画", "newAnimation", "a", this.aniGroup, 1, 1, 1, 1);
        };
        CuoTiBen.prototype.showCuoTi = function () {
            var question = this.Global.questionCurArr[this.Global.wrongArr[this.page].id - 1];
            var textCorrect = "       ";
            for (var i = 1; i <= 6; i++) {
                if (question[String(i)] != null) {
                    textCorrect += question[String(i)];
                }
            }
            var textWrong = "       ";
            for (var j = 0; j < this.Global.wrongArr[this.page].answer.length; j++) {
                textWrong += this.Global.wrongArr[this.page].answer[j];
            }
            var correctText = this.fixText(textCorrect);
            var wrongText = this.fixText(textWrong);
            this.labelWrong.text = wrongText;
            this.labelCorrect.text = correctText;
            this.labelCorrect.wordWrap = true;
            this.labelWrong.wordWrap = true;
        };
        CuoTiBen.prototype.fixText = function (text) {
            var length = text.length;
            var fixText = "";
            var pos = 15;
            while (length >= pos) {
                var str = text.substr(pos, 1);
                if (str == "”" && text.substr(pos - 2, 1) == "“") {
                    fixText += text.slice(0, pos - 2) + "\n";
                    text = text.slice(pos - 2);
                    pos = 10;
                }
                else if ((str == "，" || str == "。") && text.substr(pos - 1, 1) == "”" && text.substr(pos - 3, 1) == "“") {
                    fixText += text.slice(0, pos - 3) + "\n";
                    text = text.slice(pos - 3);
                    pos = 10;
                }
                else if ((str == "，" || str == "。") && text.substr(pos - 1, 1) == "”") {
                    fixText += text.slice(0, pos - 2);
                    text = text.slice(pos - 2);
                    pos = 10;
                }
                else if (text.substr(pos - 1, 1) == "“") {
                    fixText += text.slice(0, pos - 1) + "\n";
                    text = text.slice(pos - 1);
                    pos = 10;
                }
                else {
                    pos += 10;
                }
            }
            fixText += text;
            return fixText;
        };
        return CuoTiBen;
    }(eui.Component));
    Assembly.CuoTiBen = CuoTiBen;
    __reflect(CuoTiBen.prototype, "Assembly.CuoTiBen", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
