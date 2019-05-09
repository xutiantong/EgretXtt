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
    var duti = (function (_super) {
        __extends(duti, _super);
        function duti(com) {
            var _this = _super.call(this) || this;
            _this.last = null; //上次播放的
            com.addChild(_this);
            return _this;
        }
        duti.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        duti.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            cores.getinstatic().dg.getarmature("木板动画").x = 900;
            cores.getinstatic().dg.getarmature("木板动画").visible = false;
        };
        duti.prototype.du = function (n) {
            this.last != null ? this.last.stop() : 1 + 1 == 2;
            cores.getinstatic().dg.getarmature("木板动画").visible = false;
            switch (n) {
                case "爸":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.ba_sound);
                    break;
                case "大":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.da_sound);
                    break;
                case "关":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.guan_sound);
                    break;
                case "开":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.kai_sound);
                    break;
                case "妈":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.ma_sound);
                    break;
                case "朋":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.peng_sound);
                    break;
                case "小":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.xiao_sound);
                    break;
                case "友":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.you3_sound);
                    break;
                case "长":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.zhang_sound);
                    break;
                case "个":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.ge_sound);
                    break;
                case "山":
                    break;
                case "了":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.liao_sound);
                    break;
                case "牙":
                    break;
                case "左":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.zuo_sound);
                    break;
                case "右":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.you4_sound);
                    break;
                case "上":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.shang_sound);
                    break;
                case "下":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.xia_sound);
                    break;
                case "口":
                    cores.getinstatic().dg.getarmature("木板动画").visible = true;
                    cores.getinstatic().dg.playAnimation("木板动画", "in", "木板分组", this, 1);
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.luoxia_sound);
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.hanzi_sound);
                    var img = new egret.Bitmap(RES.getRes("kou_png"));
                    img.anchorOffsetX = img.width / 2;
                    img.anchorOffsetY = img.height / 2;
                    cores.getinstatic().dg.getarmature("木板动画").armature.getSlot("女").display = img;
                    cores.getinstatic().dg.getarmature("木板动画").armature.invalidUpdate("root", true);
                    break;
                case "风":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.feng_sound);
                    break;
                case "不":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.bu_sound);
                    break;
                case "住":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.zhu_sound);
                    break;
                case "进":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.jin_sound);
                    break;
                case "去":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.qu_sound);
                    break;
                case "生":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.sheng_sound);
                    break;
                case "气":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.qi_sound);
                    break;
                case "也":
                    this.last = cores.getinstatic().index.music2.play(cores.getinstatic().index.ye_sound);
                    break;
                default:
                    break;
            }
        };
        return duti;
    }(eui.Component));
    z.duti = duti;
    __reflect(duti.prototype, "z.duti", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=duti.js.map