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
 * 音乐切换工具2.0
 */
var music2 = (function (_super) {
    __extends(music2, _super);
    function music2() {
        var sounds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sounds[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.soundarray = new Array();
        for (var _a = 0, sounds_1 = sounds; _a < sounds_1.length; _a++) {
            var n = sounds_1[_a];
            var m = new M();
            m.sound = n;
            _this.soundarray.push(m);
            console.log(sounds.length + "个声音注册成功");
        }
        return _this;
    }
    /**
     * 对外提供音乐切换服务
     */
    music2.prototype.play = function (soundi, nn) {
        for (var _i = 0, _a = this.soundarray; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.sound == soundi) {
                if (nn) {
                    if (n.channel == null) {
                        var channel = n.sound.play(0, nn);
                        n.channel = channel;
                    }
                    else {
                        n.channel = n.sound.play(0, nn);
                    }
                }
                else {
                    if (n.channel == null) {
                        var channel = n.sound.play(0, 1);
                        n.channel = channel;
                    }
                    else {
                        n.channel = n.sound.play(0, 1);
                    }
                }
                return n.channel;
            }
        }
    };
    /**
     *  对外提供已创建声道返回服务
     */
    music2.prototype.getchannel = function (soundi) {
        var s = null;
        for (var _i = 0, _a = this.soundarray; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.sound == soundi) {
                s = n.channel;
            }
        }
        return s;
    };
    return music2;
}(eui.Component));
__reflect(music2.prototype, "music2", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=music2.js.map