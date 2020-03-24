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
var Assembly;
(function (Assembly) {
    var BackGround = (function (_super) {
        __extends(BackGround, _super);
        function BackGround() {
            var _this = _super.call(this) || this;
            _this.speedBg = 2; //背景 山 速度
            _this.speed = 3; //轨道 栅栏 速度 
            return _this;
        }
        BackGround.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        BackGround.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        BackGround.prototype.updateData = function () {
            if (this.group0.x >= 0) {
                this.group0.x += this.speed;
                this.group1.x = this.group0.x - this.group0.width;
            }
            if (this.group1.x >= 0) {
                this.group1.x += this.speed;
                this.group0.x = this.group1.x - this.group1.width;
            }
            if (this.group2.x >= 0) {
                this.group2.x += this.speedBg;
                this.group3.x = this.group2.x - this.group2.width;
            }
            if (this.group3.x >= 0) {
                this.group3.x += this.speedBg;
                this.group2.x = this.group3.x - this.group3.width;
            }
        };
        return BackGround;
    }(eui.Component));
    Assembly.BackGround = BackGround;
    __reflect(BackGround.prototype, "Assembly.BackGround", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=BackGround.js.map