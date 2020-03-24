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
    var Word = (function (_super) {
        __extends(Word, _super);
        function Word() {
            return _super.call(this) || this;
        }
        Word.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Word.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        return Word;
    }(eui.Component));
    Assembly.Word = Word;
    __reflect(Word.prototype, "Assembly.Word", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=Word.js.map