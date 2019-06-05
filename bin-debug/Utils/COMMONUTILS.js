var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var COMMONUTILS = (function () {
    function COMMONUTILS() {
        this.Arr = new Array();
    }
    /**
     * 随机数组内元素顺序
     */
    COMMONUTILS.prototype.suijishunxubyarr = function (arr) {
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
     * @param arr:源数组
     * @param num:要几个随机元素
     */
    COMMONUTILS.prototype.suiji = function (arr, num) {
        var arrold = new Array();
        arrold = arr.slice();
        var arrnew = new Array();
        for (var i = 0; i < num; i++) {
            var rodow = COMMONUTILS.get().getsuiji(0, arrold.length - 1); //产生随机数用作下标 
            arrnew.push(arrold[rodow]);
            arrold.splice(rodow, 1);
        }
        return arrnew;
    };
    /**
     * 从指定数组随机出几个值并组成新数组(返回值为原元素类型)
     * @param arr:源数组
     * @param min:最小个数
     * @param max:最大个数
     */
    COMMONUTILS.prototype.suijifanwei = function (arr, min, max) {
        var arrold = new Array();
        var arrnew = new Array();
        arrold = arr.slice();
        var num = this.getsuiji(min, max);
        for (var i = 0; i < num; i++) {
            var rodow = COMMONUTILS.get().getsuiji(0, arrold.length - 1); //产生随机数用作下标 
            arrnew.push(arrold[rodow]);
            arrold.splice(rodow, 1);
        }
        return arrnew;
    };
    /**
     * 获取范围内随机整数
     */
    COMMONUTILS.prototype.getsuiji = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    /**
     * 获取范围内随机小数
     */
    COMMONUTILS.prototype.getsuijixiaoshu = function (min, max) {
        return (Math.random() * (max - min + 1) + min);
    };
    /**
     * 去掉滤镜
     */
    COMMONUTILS.prototype.remfilter = function (img) {
        img.filters = [];
    };
    /**
     * 任意颜色滤镜
     */
    COMMONUTILS.prototype.lvjin_any = function (an, colori, alpha) {
        if (alpha === void 0) { alpha = 0.8; }
        var color = colori; /// 光晕的颜色，十六进制，不包含透明度
        var alpha = alpha; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX = 35; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 5; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner = false; /// 指定发光是否为内侧发光
        var knockout = false; /// 指定对象是否具有挖空效果
        var glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
        an.filters = [glowFilter];
    };
    /**
     * 添加滤镜(红绿)
     */
    COMMONUTILS.prototype.lvjin_red_green = function (img, boo) {
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
    /**
     * 通过编号活动拼音字符串
     * āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ
     */
    COMMONUTILS.prototype.getPinyin = function (zimu, num) {
        switch (zimu + num) {
            case "ɑ0":
                return "ā";
            case "ɑ1":
                return "á";
            case "ɑ2":
                return "ǎ";
            case "ɑ3":
                return "à";
            case "o0":
                return "ō";
            case "o1":
                return "ó";
            case "o2":
                return "ǒ";
            case "o3":
                return "ò";
            case "e0":
                return "ē";
            case "e1":
                return "é";
            case "e2":
                return "ě";
            case "e3":
                return "è";
            case "i0":
                return "ī";
            case "i1":
                return "í";
            case "i2":
                return "ǐ";
            case "i3":
                return "ì";
            case "u0":
                return "ū";
            case "u1":
                return "ú";
            case "u2":
                return "ǔ";
            case "u3":
                return "ù";
            case "ü0":
                return "ǖ";
            case "ü1":
                return "ǘ";
            case "ü2":
                return "ǚ";
            case "ü3":
                return "ǜ";
            default:
                return "err";
        }
    };
    COMMONUTILS.get = function () {
        if (this.st == null) {
            this.st = new COMMONUTILS();
        }
        return this.st;
    };
    COMMONUTILS.st = null;
    return COMMONUTILS;
}());
__reflect(COMMONUTILS.prototype, "COMMONUTILS");
//# sourceMappingURL=COMMONUTILS.js.map