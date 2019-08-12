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
     * 字组件
     */
    var Word = (function (_super) {
        __extends(Word, _super);
        function Word() {
            var _this = _super.call(this) || this;
            _this.foodList = ["mogu_png", "pingguo_png", "yumi_png", "roupian_png", "yu_png", "yurou_png"];
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        Word.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Word.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            egret.Tween.get(this.tipGroup, { loop: true }).to({ alpha: 0 }, 500).to({ alpha: 1 }, 500);
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            if (this.Global.questionType == 0) {
                this.bg.source = this.foodList[COMMONUTILS.get().getRandomNum(0, 2)];
            }
            else {
                this.bg.source = this.foodList[COMMONUTILS.get().getRandomNum(3, 5)];
            }
            var question = this.Global.questionCurArr[this.Global.questionNum - 1];
            this.label.text = question.question.substr((question.mark == 1 ? -1 : 0), 1);
            this.img.x = (question.mark == 1 ? 20 : 158);
            this.label.x = (question.mark == 1 ? 189 : 51);
            this["tip" + question.pos].visible = true;
            this.answer.visible = false;
            this.answer.source = question.p1;
            this.question.source = question.pq;
        };
        Word.prototype.onClick = function () {
        };
        return Word;
    }(eui.Component));
    Assembly.Word = Word;
    __reflect(Word.prototype, "Assembly.Word", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
