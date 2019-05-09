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
var yuwen;
(function (yuwen) {
    var main = (function (_super) {
        __extends(main, _super);
        function main(com) {
            var _this = _super.call(this) || this;
            _this.ifpause = false; //当前是否暂停状态
            _this.skinName = "main";
            com.addChild(_this);
            return _this;
        }
        main.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.mains.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.reback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.remusic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
            this.init();
        };
        main.prototype.touch = function (e) {
            var _this = this;
            switch (e.target) {
                //点击重读
                case this.remusic:
                    if (cores.getinstatic().index.guanka.guanka_now != null) {
                        cores.getinstatic().index.guanka.guanka_now.duti.du(cores.getinstatic().index.guanka.guanka_now.ti.okZi);
                    }
                    break;
                //点击暂停页面
                case this.lab:
                    console.log("正常");
                    egret.Tween.get(this.group).to({ height: 0 }, 300);
                    this.mains.selected = false;
                    this.rect.visible = false;
                    this.music.touchEnabled = true;
                    this.reback.touchEnabled = true;
                    this.pause.touchEnabled = true;
                    this.lab.visible = false;
                    if (this.music.selected != true) {
                        cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 1;
                    }
                    break;
                case this.mains:
                    this.mains.touchEnabled = false;
                    //点击伸缩弹出
                    switch (this.mains.selected) {
                        case false:
                            egret.Tween.get(this.group).to({ height: 0 }, 300).call(function () {
                                _this.mains.touchEnabled = true;
                            });
                            break;
                        case true:
                            egret.Tween.get(this.group).to({ height: 517 }, 500, egret.Ease.backOut).call(function () {
                                _this.mains.touchEnabled = true;
                            });
                            break;
                        default:
                            break;
                    }
                    break;
                case this.reback:
                    //点击重置
                    cores.getinstatic().index.GO_guanka();
                    this.music.selected = false;
                    cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 1;
                    this.init();
                    break;
                case this.music:
                    //点击伸缩弹出
                    switch (this.music.selected) {
                        case false:
                            cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 1;
                            break;
                        case true:
                            cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 0;
                            break;
                        default:
                            break;
                    }
                    break;
                case this.pause:
                    //点击暂停
                    console.log("暂停");
                    this.rect.visible = true;
                    this.music.touchEnabled = false;
                    this.lab.visible = true;
                    this.reback.touchEnabled = false;
                    cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 0;
                    this.pause.touchEnabled = false;
                    break;
                default:
                    break;
            }
        };
        main.prototype.init = function () {
            var _this = this;
            this.lab.visible = false;
            this.rect.visible = false;
            this.ifpause = false;
            this.mains.selected = false;
            egret.Tween.get(this.group).to({ height: 0 }, 300).call(function () {
                _this.mains.touchEnabled = true;
            });
        };
        return main;
    }(eui.Component));
    yuwen.main = main;
    __reflect(main.prototype, "yuwen.main", ["eui.UIComponent", "egret.DisplayObject"]);
})(yuwen || (yuwen = {}));
//# sourceMappingURL=main.js.map