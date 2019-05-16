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
var GlobalManager = (function (_super) {
    __extends(GlobalManager, _super);
    function GlobalManager() {
        var _this = _super.call(this) || this;
        _this.dg = DragonBonesManager.getInstance();
        _this.mainscene = new MainScene();
        _this.addChild(_this.mainscene);
        return _this;
    }
    /**
     * 随机数组内元素顺序
     */
    GlobalManager.prototype.suijishunxubyarr = function (arr) {
        var newarr = new Array();
        var oldarr = new Array();
        oldarr = arr.slice();
        for (var i = 0; i < arr.length; i++) {
            var rodow = this.getsuiji(0, oldarr.length - 1);
            newarr.push(oldarr[rodow]);
            oldarr.splice(rodow, 1);
        }
        return newarr;
    };
    /**
     * 从指定数组随机出几个值并组成新数组(返回值为原元素类型)
     * arr:源数组
     * num:要几个随机元素
     */
    GlobalManager.prototype.suiji = function (arr, num) {
        var arrold = new Array();
        arrold = arr.slice();
        var arrnew = new Array();
        for (var i = 0; i < num; i++) {
            var rodow = GlobalManager.getInstance().getsuiji(0, arrold.length - 1); //产生随机数用作下标 
            arrnew.push(arrold[rodow]);
            arrold.splice(rodow, 1);
        }
        return arrnew;
    };
    /**
     * 从指定数组随机出几个值并组成新数组(返回值为原元素类型)
     * arr:源数组
     * min:最小个数
     * max:最大个数
     */
    GlobalManager.prototype.suijifanwei = function (arr, min, max) {
        var arrold = new Array();
        var arrnew = new Array();
        arrold = arr.slice();
        var num = this.getsuiji(min, max);
        for (var i = 0; i < num; i++) {
            var rodow = GlobalManager.getInstance().getsuiji(0, arrold.length - 1); //产生随机数用作下标 
            arrnew.push(arrold[rodow]);
            arrold.splice(rodow, 1);
        }
        return arrnew;
    };
    /**
     * 获取范围内随机整数
     */
    GlobalManager.prototype.getsuiji = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    /**
     * 获取范围内随机小数
     */
    GlobalManager.prototype.getsuijixiaoshu = function (min, max) {
        return (Math.random() * (max - min + 1) + min);
    };
    /**
     * 去掉滤镜
     */
    GlobalManager.prototype.remfilter = function (img) {
        img.filters = [];
    };
    /**
     * 任意颜色滤镜
     */
    GlobalManager.prototype.lvjin_any = function (an, colori) {
        var color = colori; /// 光晕的颜色，十六进制，不包含透明度
        var alpha = 0.8; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX = 35; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 5; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner = true; /// 指定发光是否为内侧发光
        var knockout = false; /// 指定对象是否具有挖空效果
        var glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
        an.filters = [glowFilter];
    };
    /**
     * 添加滤镜(红绿)
     */
    GlobalManager.prototype.lvjin_red_green = function (img, boo) {
        var ss;
        if (boo == false) {
            ss = 0xF92727;
        }
        else {
            ss = 0x07F237;
        }
        var color = ss; /// 光晕的颜色，十六进制，不包含透明度
        var alpha = 0.8; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX = 35; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 5; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner = true; /// 指定发光是否为内侧发光
        var knockout = false; /// 指定对象是否具有挖空效果
        var glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
        img.filters = [glowFilter];
    };
    GlobalManager.getInstance = function () {
        if (this.st == null) {
            this.st = new GlobalManager();
        }
        return this.st;
    };
    GlobalManager.st = null; //单例存储
    return GlobalManager;
}(eui.Component));
__reflect(GlobalManager.prototype, "GlobalManager", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GlobalManager.js.map