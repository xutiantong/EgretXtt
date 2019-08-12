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
            _this.wrongArr = [];
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        ErrBook.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        ErrBook.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("cuotiben_ske_json", "cuotiben_tex_json", "cuotiben_tex_png");
            DRAGONBONES.getInstance().initArmature("错题本动画", "cuotiben");
        };
        ErrBook.prototype.init = function () {
            var _this = this;
            Hierarchy.AbManager.get().hide("End");
            this.Global.wrongArr.forEach(function (v) {
                if (_this.wrongArr.length == 0 || _this.wrongArr[_this.wrongArr.length - 1].length == 3) {
                    _this.wrongArr.push([v]);
                }
                else {
                    _this.wrongArr[_this.wrongArr.length - 1].push(v);
                }
            });
            this.page = 0;
            this.leftArrow.visible = false;
            this.rightArrow.visible = this.wrongArr.length > 1;
            Manager.EventManager.get().addListener("CuoTiBen", this.leftArrow, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                _this.page -= 1;
                _this.leftArrow.visible = _this.page > 0;
                _this.rightArrow.visible = _this.page < _this.wrongArr.length - 1;
                _this.showCuoTi();
            }, this);
            Manager.EventManager.get().addListener("CuoTiBen", this.rightArrow, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                _this.page += 1;
                _this.leftArrow.visible = _this.page > 0;
                _this.rightArrow.visible = _this.page < _this.wrongArr.length - 1;
                _this.showCuoTi();
            }, this);
            this.showCuoTi();
            this.contentGroup.scaleX = 0;
            this.contentGroup.scaleY = 0;
            egret.Tween.get(this.contentGroup).to({ scaleX: 1, scaleY: 1 }, 600, egret.Ease.backInOut);
            DRAGONBONES.getInstance().playAnimation("错题本动画", "shengli", this.aniGroup, 1, 1, 1, 1, 0, -120);
        };
        ErrBook.prototype.showCuoTi = function () {
            var question1 = this.Global.questionCurArr[this.wrongArr[this.page][0]];
            this.answer1.text = question1.question.replace("()", "_");
            this.correct1.text = COMMONUTILS.get().replacePos(question1.question, (question1.mark == 1 ? 0 : 1), (question1.mark == 1 ? 3 : 4), question1.correct);
            if (this.wrongArr[this.page].length > 1) {
                this.arrow2.visible = true;
                var question2 = this.Global.questionCurArr[this.wrongArr[this.page][1]];
                this.answer2.text = question2.question.replace("()", "_");
                this.correct2.text = COMMONUTILS.get().replacePos(question2.question, (question2.mark == 1 ? 0 : 1), (question2.mark == 1 ? 3 : 4), question2.correct);
            }
            else {
                this.answer2.text = "";
                this.correct2.text = "";
                this.arrow2.visible = false;
            }
            if (this.wrongArr[this.page].length > 2) {
                this.arrow3.visible = true;
                var question3 = this.Global.questionCurArr[this.wrongArr[this.page][2]];
                this.answer3.text = question3.question.replace("()", "_");
                this.correct3.text = COMMONUTILS.get().replacePos(question3.question, (question3.mark == 1 ? 0 : 1), (question3.mark == 1 ? 3 : 4), question3.correct);
            }
            else {
                this.arrow3.visible = false;
                this.answer3.text = "";
                this.correct3.text = "";
            }
        };
        return ErrBook;
    }(eui.Component));
    Assembly.ErrBook = ErrBook;
    __reflect(ErrBook.prototype, "Assembly.ErrBook", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
