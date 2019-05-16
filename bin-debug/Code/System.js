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
var System = (function (_super) {
    __extends(System, _super);
    function System() {
        var _this = _super.call(this) || this;
        _this.ifpause = false; //当前是否暂停状态
        return _this;
    }
    System.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    System.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.mains.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.reback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.init();
    };
    System.prototype.touch = function (e) {
        var _this = this;
        GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.click_sound);
        switch (e.target) {
            case this.lab:
                //点击暂停页面
                egret.Tween.get(this.group).to({ height: 0 }, 300);
                this.mains.selected = false;
                this.rect.visible = false;
                this.music.touchEnabled = true;
                this.reback.touchEnabled = true;
                this.pause.touchEnabled = true;
                this.lab.visible = false;
                GlobalManager.getInstance().mainscene.question.touchChildren = true;
                if (this.music.selected != true) {
                    GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 1;
                }
                break;
            case this.mains:
                //点击伸缩弹出
                this.mains.touchEnabled = false;
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
                GlobalManager.getInstance().mainscene.restart();
                this.music.selected = false;
                GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 1;
                this.init();
                break;
            case this.music:
                //点击音乐
                switch (this.music.selected) {
                    case false:
                        GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 1;
                        break;
                    case true:
                        GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 0;
                        break;
                    default:
                        break;
                }
                break;
            case this.pause:
                //点击暂停
                this.rect.visible = true;
                this.music.touchEnabled = false;
                this.lab.visible = true;
                this.reback.touchEnabled = false;
                GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 0;
                this.pause.touchEnabled = false;
                GlobalManager.getInstance().mainscene.question.touchChildren = false;
                break;
            default:
                break;
        }
    };
    System.prototype.init = function () {
        var _this = this;
        this.lab.visible = false;
        this.rect.visible = false;
        this.ifpause = false;
        this.mains.selected = false;
        egret.Tween.get(this.group).to({ height: 0 }, 300).call(function () {
            _this.mains.touchEnabled = true;
        });
    };
    return System;
}(eui.Component));
__reflect(System.prototype, "System", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=System.js.map