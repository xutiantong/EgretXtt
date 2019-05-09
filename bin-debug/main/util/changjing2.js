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
 * 场景切换工具2.0版本
 */
var changjing2 = (function (_super) {
    __extends(changjing2, _super);
    function changjing2() {
        var yemianarray = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            yemianarray[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.component_set = new Array();
        console.log("场景切换工具创建");
        for (var _a = 0, yemianarray_1 = yemianarray; _a < yemianarray_1.length; _a++) {
            var n = yemianarray_1[_a];
            _this.component_set.push(n);
            console.log(yemianarray.length + "个页面注册成功");
        }
        return _this;
    }
    /**
     * 对外提供场景切换
     */
    changjing2.prototype.to = function (yemian) {
        for (var i = 0; i < this.component_set.length; i++) {
            if (this.component_set[i] == yemian) {
                if (this.last != undefined) {
                    this.removeChild(this.last);
                }
                this.addChild(this.component_set[i]);
                this.last = this.component_set[i];
            }
        }
    };
    return changjing2;
}(eui.Component));
__reflect(changjing2.prototype, "changjing2", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=changjing2.js.map