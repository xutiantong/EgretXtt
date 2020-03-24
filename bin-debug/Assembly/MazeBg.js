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
    var MazeBg = (function (_super) {
        __extends(MazeBg, _super);
        function MazeBg() {
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        MazeBg.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        MazeBg.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //[0,2,6,8]删除1个,[1,3,5,7]删除1个
            var deletIndex0 = COMMONUTILS.randomNewArr([0, 2, 6, 8], 1)[0];
            var deletIndex1 = COMMONUTILS.randomNewArr([1, 3, 5, 7], 1)[0];
            this["item" + deletIndex0].visible = false;
            this["item" + deletIndex1].visible = false;
            //[4]随机删除
            this["item" + 4].visible = Math.random() > 0.5 ? true : false;
            //[9,11,15,17]删除1个,[10,12,14,16]删除1个
            var deletIndex2 = COMMONUTILS.randomNewArr([9, 11, 15, 17], 1)[0];
            var deletIndex3 = COMMONUTILS.randomNewArr([10, 12, 14, 16], 1)[0];
            this["item" + deletIndex2].visible = false;
            this["item" + deletIndex3].visible = false;
            //[13]随机删除
            this["item" + 13].visible = Math.random() > 0.5 ? true : false;
            this.Global.hasShadowArr = [deletIndex0, deletIndex1, deletIndex2, deletIndex3];
            if (this["item" + 4].visible == false) {
                this.Global.hasShadowArr.push(4);
            }
            if (this["item" + 13].visible == false) {
                this.Global.hasShadowArr.push(13);
            }
        };
        return MazeBg;
    }(eui.Component));
    Assembly.MazeBg = MazeBg;
    __reflect(MazeBg.prototype, "Assembly.MazeBg", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=MazeBg.js.map