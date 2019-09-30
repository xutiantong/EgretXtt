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
        this.Arr = new Array(); // name sound channel isPlay
    }
    /**
     * 注册声音
     * @param arr 声音文件名称合集
     */
    MUSIC4.prototype.init = function (arr) {
        var _this = this;
        arr.forEach(function (element) {
            var sound = RES.getRes(element + "_mp3");
            var channel = null;
            _this.Arr.push({
                name: element,
                sound: sound,
                channel: channel,
                isPlay: false
            });
        });
    };
    /**
    * 继续上一个播放
    */
    MUSIC4.prototype.continueLast = function () {
        for (var i = 0; i < this.last_Arr.length; i++) {
            this.play(this.last_Arr[i], 1, this.position_Arr[i]);
        }
    };
    /**
     * 暂停上一个播放
     */
    MUSIC4.prototype.pauseLast = function () {
        this.last_Arr = [];
        this.position_Arr = [];
        for (var i = 0; i < this.Arr.length; i++) {
            var v = this.Arr[i];
            if (v.channel != null) {
                var ch = v.channel;
                if (v.isPlay == true) {
                    this.last_Arr.push(v.name);
                    this.position_Arr.push(ch.position);
                    this.stop(v.name);
                }
            }
        }
    };
    /**
     * 根据名字播放声音
     * @param name 文件名
     * @param num 播放次数
     * @param start 开始位置
     */
    MUSIC4.prototype.play = function (name, num, start) {
        if (num === void 0) { num = 1; }
        if (start === void 0) { start = 0; }
        var _loop_1 = function (i) {
            var v = this_1.Arr[i];
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                }
                v.channel = v.sound.play(start, num);
                v.isPlay = true;
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, function () {
                    v.isPlay = false;
                }, this_1);
                return "break";
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.Arr.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
    };
    /**
     * 根据名字停止声音
     * @param name 文件名
     */
    MUSIC4.prototype.stop = function (name) {
        for (var i = 0; i < this.Arr.length; i++) {
            var v = this.Arr[i];
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                    v.channel = null;
                    v.isPlay = false;
                }
                break;
            }
        }
    };
    /**
     * 根据名字添加声音结束回调
     * @param name 文件名
     * @param fun 方法
     * @param that 对象this
     */
    MUSIC4.prototype.addEvent = function (name, fun, that) {
        for (var i = 0; i < this.Arr.length; i++) {
            var v = this.Arr[i];
            if (name == v.name) {
                if (v.call != undefined && v.call != null) {
                    v.channel.removeEventListener(egret.Event.SOUND_COMPLETE, v.call, that);
                }
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, fun, that);
                v.call = fun;
                break;
            }
        }
    };
    /**
     * 获得声音的长度(秒)
     * @param name
     */
    MUSIC4.prototype.getLength = function (name) {
        for (var i = 0; i < this.Arr.length; i++) {
            var v = this.Arr[i];
            if (name == v.name) {
                return v.sound.length;
            }
        }
    };
    MUSIC4.get = function () {
        if (this.D == null) {
            this.D = new MUSIC4();
        }
        return this.D;
    };
    MUSIC4.D = null;
    return MUSIC4;
}());
__reflect(MUSIC4.prototype, "MUSIC4");
//# sourceMappingURL=MUSIC4.js.map