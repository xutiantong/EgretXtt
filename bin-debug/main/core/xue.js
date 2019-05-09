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
var z;
(function (z) {
    /**
        * 心组件
        */
    var xue = (function (_super) {
        __extends(xue, _super);
        function xue(com) {
            var _this = _super.call(this) || this;
            _this.skinName = "xue";
            com.addChild(_this);
            return _this;
        }
        xue.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.init();
        };
        /**
         * 初始化
         */
        xue.prototype.init = function () {
            this.x1.visible = true;
            this.x2.visible = true;
            this.num = 2;
        };
        /**
         * 掉血
         */
        xue.prototype.sunshi = function () {
            if (this.num == 2) {
                //如果满血
                this.x1.visible = false;
            }
            else if (this.num == 1) {
                this.x2.visible = false;
                //如果已经没血
                //////********没血逻辑******/////////// */
                cores.getinstatic().index.GO_shibai();
            }
            this.num -= 1;
        };
        return xue;
    }(eui.Component));
    z.xue = xue;
    __reflect(xue.prototype, "z.xue", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=xue.js.map