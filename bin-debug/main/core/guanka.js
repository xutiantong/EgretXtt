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
    //关卡页
    var guanka = (function (_super) {
        __extends(guanka, _super);
        function guanka(com) {
            var _this = _super.call(this) || this;
            _this.oneOvered = false; //第1关是否完成
            _this.over = false; //是否全通过
            _this.guanka_now = null; //当前管卡
            com.addChild(_this);
            return _this;
        }
        guanka.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        guanka.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.guanGroup.getChildAt(0).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                //去第1关
                console.log(1);
                cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.guanka_sound).stop();
                _this.parent.visible = false;
                cores.getinstatic().index.pageGroup1.visible = true;
                cores.getinstatic().index.page1.init();
                cores.getinstatic().index.init();
                cores.getinstatic().index.page1.dazi.init();
                _this.guanka_now = cores.getinstatic().index.page1;
            }, this);
        };
        /**
         * 欢迎来到关卡选择页面
         */
        guanka.prototype.welcome = function () {
            cores.getinstatic().index.music2.play(cores.getinstatic().index.guanka_sound);
            this.guanka_now = null; //重置当前关卡为null
            cores.getinstatic().index.pageGroup1.visible = false;
            cores.getinstatic().index.pageGroup2.visible = false;
            cores.getinstatic().index.pageGroup3.visible = false;
            this.guanGroup.getChildAt(1).touchEnabled = false;
            this.guanGroup.getChildAt(2).touchEnabled = false;
            // this.oneOvered = true;
            if (this.oneOvered == true) {
                //如果全通关
                this.over = true;
            }
            else {
                this.over = false;
            }
            if (this.oneOvered == true) {
                var img7 = this.guanGroup.getChildAt(0);
                img7.source = "1tongguo_png";
            }
            else {
                var img0 = this.guanGroup.getChildAt(0);
                img0.source = "1xuanzhong_png";
            }
        };
        return guanka;
    }(eui.Component));
    z.guanka = guanka;
    __reflect(guanka.prototype, "z.guanka", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=guanka.js.map