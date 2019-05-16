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
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(type, num) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.num = num;
        return _this;
    }
    Item.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    Item.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        if (this.type == 1) {
            var seastar = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.seastar_sound);
            if (seastar != null) {
                if (seastar.position == 0) {
                    GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
                }
            }
            else {
                GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
            }
            this.item = GlobalManager.getInstance().dg.initArmatureDisplay("haixing" + this.num, "haixing");
            GlobalManager.getInstance().dg.playAnimation("haixing" + this.num, "newAnimation", this);
            this.item.scaleX = 1.5;
            this.item.scaleY = 1.5;
        }
        else if (this.type == 2) {
            var shell = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.shell_sound);
            if (shell != null) {
                if (shell.position == 0) {
                    GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.shell_sound);
                }
            }
            else {
                GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.shell_sound);
            }
            this.item = GlobalManager.getInstance().dg.initArmatureDisplay("beike" + this.num, "beike");
            GlobalManager.getInstance().dg.playAnimation("beike" + this.num, "newAnimation", this);
            this.item.scaleX = 1.5;
            this.item.scaleY = 1.5;
        }
        else if (this.type == 3) {
            var bubble = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bubble_sound);
            if (bubble != null) {
                if (bubble.position == 0) {
                    GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.bubble_sound);
                }
            }
            else {
                GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.bubble_sound);
            }
            this.item = GlobalManager.getInstance().dg.initArmatureDisplay("hailuo" + this.num, "hailuo");
            GlobalManager.getInstance().dg.playAnimation("hailuo" + this.num, "newAnimation", this);
            this.item.scaleX = 1.5;
            this.item.scaleY = 1.5;
        }
        else if (this.type == 4) {
            var crab = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.seastar_sound);
            if (crab != null) {
                if (crab.position == 0) {
                    GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
                }
            }
            else {
                GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
            }
            this.item = GlobalManager.getInstance().dg.initArmatureDisplay("pangxie" + this.num, "pangxie");
            GlobalManager.getInstance().dg.playAnimation("pangxie" + this.num, "newAnimation", this);
            this.item.scaleX = 1.5;
            this.item.scaleY = 1.5;
        }
    };
    return Item;
}(eui.Component));
__reflect(Item.prototype, "Item", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=Item.js.map