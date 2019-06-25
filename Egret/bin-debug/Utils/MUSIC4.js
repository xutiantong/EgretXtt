var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 对外提供声音同步缓存加载方案
 * 第3版本
 */
var MUSIC4 = (function () {
    function MUSIC4() {
        this.last_Arr = new Array();
        this.position_Arr = new Array();
        /**
         * 货站
         * 存储
         * name
         * sound
         * channel
         */
        this.Arr = new Array();
    }
    /**
     * 注册声音
     */
    MUSIC4.prototype.init = function (arr) {
        var _this = this;
        arr.forEach(function (element, i) {
            var sound = RES.getRes(element + "_mp3");
            var channel = null;
            _this.Arr.push({
                name: element,
                sound: sound,
                channel: channel,
                isplay: false
            });
        });
    };
    //继续上一个播放
    MUSIC4.prototype.huifuLast = function () {
        var _this = this;
        this.last_Arr.forEach(function (v, i) {
            _this.play(v, 1, _this.position_Arr[i]);
        });
    };
    //暂停上一个播放
    MUSIC4.prototype.pauseLast = function () {
        var _this = this;
        this.last_Arr = [];
        this.position_Arr = [];
        this.Arr.forEach(function (v) {
            if (v.channel != null) {
                var ch = v.channel;
                if (v.isplay == true) {
                    _this.last_Arr.push(v.name);
                    _this.position_Arr.push(ch.position);
                    _this.stop(v.name);
                }
            }
            return;
        });
    };
    /**
     * 根据名字播放声音
     */
    MUSIC4.prototype.play = function (name, num, start) {
        var _this = this;
        if (num === void 0) { num = 1; }
        if (start === void 0) { start = 0; }
        this.Arr.forEach(function (v) {
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                }
                v.channel = v.sound.play(start, num);
                v.isplay = true;
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, function () {
                    v.isplay = false;
                }, _this);
                return;
            }
        });
    };
    /**
     * 根据名字停止声音
     */
    MUSIC4.prototype.stop = function (name) {
        this.Arr.forEach(function (v) {
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                    v.channel = null;
                    v.isplay = false;
                }
                return;
            }
        });
    };
    /**
     * 為聲音添加監聽播放完
     * @param name
     * @param fun
     * @param that
     */
    MUSIC4.prototype.addEvent = function (name, fun, that) {
        this.Arr.forEach(function (v) {
            if (name == v.name) {
                if (v.call != undefined && v.call != null) {
                    v.channel.removeEventListener(egret.Event.SOUND_COMPLETE, v.call, that);
                }
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, fun, that);
                v.call = fun;
                return;
            }
        });
    };
    /**
    * 返回实例确保单例
    */
    MUSIC4.get = function () {
        if (this.D == null) {
            this.D = new MUSIC4();
        }
        return this.D;
    };
    /**
     * 单例存储
     */
    MUSIC4.D = null;
    return MUSIC4;
}());
__reflect(MUSIC4.prototype, "MUSIC4");
