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
    //大字组件
    var dazi = (function (_super) {
        __extends(dazi, _super);
        function dazi(com) {
            var _this = _super.call(this) || this;
            com.addChild(_this);
            return _this;
        }
        dazi.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        dazi.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img.alpha = 0;
        };
        dazi.prototype.init = function () {
            egret.Tween.get(this.img).to({ alpha: 0 }, 300);
        };
        //根据当前题目正确字数组自动变更大字显示
        //无参数
        dazi.prototype.setImg = function () {
            switch (cores.getinstatic().index.page1.ti.okZi) {
                case "爸":
                    this.img.source = "ba_png";
                    break;
                case "大":
                    this.img.source = "da_png";
                    break;
                case "关":
                    this.img.source = "guan_png";
                    break;
                case "开":
                    this.img.source = "kai_png";
                    break;
                case "妈":
                    this.img.source = "ma_png";
                    break;
                case "朋":
                    this.img.source = "peng_png";
                    break;
                case "小":
                    this.img.source = "xiao_png";
                    break;
                case "友":
                    this.img.source = "you_png";
                    break;
                case "长":
                    this.img.source = "zhang_png";
                    break;
                default:
                    break;
            }
            egret.Tween.get(this.img).to({ alpha: 1 }, 800);
        };
        return dazi;
    }(eui.Component));
    z.dazi = dazi;
    __reflect(dazi.prototype, "z.dazi", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=dazi.js.map