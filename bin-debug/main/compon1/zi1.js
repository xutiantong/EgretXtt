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
    //第一题的字单件
    var zi1 = (function (_super) {
        __extends(zi1, _super);
        function zi1(zi) {
            var _this = _super.call(this) || this;
            _this.zi = zi;
            return _this;
        }
        zi1.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        zi1.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.rotation = 0;
            egret.Tween.get(this, { loop: true }).to({ rotation: 3 }, cores.getinstatic().getsuiji(650, 860)).to({ rotation: 0 }, cores.getinstatic().getsuiji(650, 860));
            this.label.text = this.zi;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                cores.getinstatic().index.music2.play(cores.getinstatic().index.dianji_sound);
                cores.getinstatic().index.page1.ti.touchChildren = false;
                //点击字
                if (_this.zi == cores.getinstatic().index.page1.ti.okZi) {
                    //选择正确
                    cores.getinstatic().index.main.remusic.touchEnabled = false;
                    egret.Tween.get(_this).to({ scaleX: 1.1, scaleY: 1.1 }, 300, egret.Ease.quadOut).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.quadOut);
                    DRAGONBONES.getinstance().getarmature("仓颉正面").animation.play("zhoulu", 0);
                    egret.Tween.get(DRAGONBONES.getinstance().getarmature("仓颉正面")).to({ x: 890 }, 2100).call(function () {
                        cores.getinstatic().index.music2.play(cores.getinstatic().index.xiezi_sound);
                        cores.getinstatic().index.page1.dazi.setImg();
                        DRAGONBONES.getinstance().getarmature("仓颉正面").visible = false;
                        DRAGONBONES.getinstance().getarmature("仓颉写字").visible = true;
                        DRAGONBONES.getinstance().getarmature("仓颉写字").x = 890;
                        DRAGONBONES.getinstance().getarmature("仓颉写字").animation.play("zhanli", 1).timeScale = 3;
                        setTimeout(function () {
                            //9
                            if (cores.getinstatic().index.page1.ti.page >= 9) {
                                //大结局
                                cores.getinstatic().index.GO_success(cores.getinstatic().index.page1);
                                cores.getinstatic().index.guanka.oneOvered = true;
                            }
                            else {
                                egret.Tween.get(cores.getinstatic().index.page1.ti.group).to({ alpha: 0 }, 300).call(function () {
                                    cores.getinstatic().index.page1.ti.chuti();
                                });
                            }
                        }, 1900);
                    });
                }
                else {
                    //选择错误
                    DRAGONBONES.getinstance().getarmature("仓颉正面").animation.play("naotou", 1);
                    cores.getinstatic().index.music2.play(cores.getinstatic().index.cangjieen_sound);
                    cores.getinstatic().index.page1.ti.Arr_cuo.push(cores.getinstatic().index.page1.ti.page - 1); //错字记录
                    cores.getinstatic().index.music2.play(cores.getinstatic().index.err_sound);
                    cores.getinstatic().index.page1.xue.sunshi(); //掉血
                    egret.Tween.get(_this).to({ y: 300 }, 500, egret.Ease.quadOut).call(function () {
                        cores.getinstatic().index.page1.ti.touchChildren = true;
                    });
                }
            }, this);
        };
        return zi1;
    }(eui.Component));
    z.zi1 = zi1;
    __reflect(zi1.prototype, "z.zi1", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=zi1.js.map