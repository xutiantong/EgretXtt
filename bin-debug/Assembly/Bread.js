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
     * 面包组件
     */
    var Bread = (function (_super) {
        __extends(Bread, _super);
        function Bread(content) {
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            _this.content = content;
            return _this;
        }
        Bread.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Bread.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img.source = COMMONUTILS.get().getsuiji(1, 6) + "_png";
            this.label.text = this.content;
            this.name = this.content;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        };
        return Bread;
    }(eui.Component));
    Assembly.Bread = Bread;
    __reflect(Bread.prototype, "Assembly.Bread", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
