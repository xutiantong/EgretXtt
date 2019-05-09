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
    //第一题的题单件
    var ti1 = (function (_super) {
        __extends(ti1, _super);
        function ti1(com) {
            var _this = _super.call(this) || this;
            _this.Arr = new Array(); //存储真字的数组
            _this.Arr_jia = new Array(); //存储假字的数组
            _this.Arr_zu = new Array(); //存储全部字的数组
            _this.Arr_cuo = new Array(); //存储答错的题目
            com.addChild(_this);
            return _this;
        }
        ti1.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        ti1.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.onceInit();
        };
        //唯一初始化
        ti1.prototype.onceInit = function () {
            this.create_zhen(); //唯一生成真字组
        };
        //初始化
        ti1.prototype.init = function () {
            this.Arr = cores.getinstatic().suijishunxubyarr(this.Arr); //随机
            this.Arr_cuo = []; //清空错误组
            this.page = 0;
            this.create_jia(); //每次生成假的字组
            this.chuti(); //出题
        };
        //生成假字组
        ti1.prototype.create_jia = function () {
            this.Arr_jia = [];
            var str = "个山了牙左右上下风口不住进去气也力天鸟草时你我自己奶白绿蓝云雨叶儿飞的是对老师早美亮走西全第中几书包好明当心要课睡";
            for (var i = 0; i < str.length; i++) {
                this.Arr_jia.push(str.charAt(i));
            }
            this.Arr_jia = cores.getinstatic().suijishunxubyarr(this.Arr_jia); //随机
        };
        //唯一生成真字组
        ti1.prototype.create_zhen = function () {
            this.Arr = ["爸", "大", "关", "开", "妈", "朋", "小", "友", "长"];
            this.Arr = cores.getinstatic().suijishunxubyarr(this.Arr); //随机
        };
        ti1.prototype.chuti = function () {
            var _this = this;
            egret.Tween.get(this.group).to({ alpha: 1 }, 1000).call(function () {
                _this.touchChildren = true;
                cores.getinstatic().index.main.remusic.touchEnabled = true;
            });
            this.touchChildren = false;
            cores.getinstatic().index.main.remusic.touchEnabled = false;
            cores.getinstatic().index.page1.dazi.init();
            this.group.removeChildren();
            this.Arr_zu = []; //重置当前组
            this.okZi = this.Arr[this.page];
            this.Arr_zu.push(this.okZi);
            this.Arr_zu.push(this.Arr_jia.shift());
            this.Arr_zu.push(this.Arr_jia.shift());
            this.Arr_zu.push(this.Arr_jia.shift());
            this.Arr_zu = cores.getinstatic().suijishunxubyarr(this.Arr_zu); //随机
            this.Arr_zu.forEach(function (v, i) {
                var zis = new z.zi1(v);
                _this.group.addChild(zis);
                zis.x = zis.width * i + 7;
                if (i == 0) {
                    zis.y = 17.2;
                }
                if (i == 1) {
                    zis.y = 21.2;
                }
                if (i == 2) {
                    zis.y = 17.0;
                }
                if (i == 3) {
                    zis.y = 11.5;
                }
            });
            this.page += 1;
            cores.getinstatic().index.page1.duti.du(cores.getinstatic().index.page1.ti.okZi);
        };
        return ti1;
    }(eui.Component));
    z.ti1 = ti1;
    __reflect(ti1.prototype, "z.ti1", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=ti1.js.map