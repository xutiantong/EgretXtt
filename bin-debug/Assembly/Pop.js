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
     * 介绍界面的泡泡
     */
    var Pop = (function (_super) {
        __extends(Pop, _super);
        function Pop(str) {
            var _this = _super.call(this) || this;
            _this.skinName = "Pop";
            _this.strTex = str;
            return _this;
        }
        Pop.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.anchorOffsetX = this.width / 2 - 120;
            this.anchorOffsetY = this.height / 2;
            this.label.text = "       " + this.strTex;
            this.label.wordWrap = true;
            this.bubble.height = this.label.height + 70 < 200 ? 200 : this.label.height + 70;
        };
        return Pop;
    }(eui.Component));
    Assembly.Pop = Pop;
    __reflect(Pop.prototype, "Assembly.Pop", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=Pop.js.map