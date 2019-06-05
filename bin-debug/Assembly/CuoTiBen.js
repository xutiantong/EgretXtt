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
    var CuoTiBen = (function (_super) {
        __extends(CuoTiBen, _super);
        function CuoTiBen() {
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        CuoTiBen.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        CuoTiBen.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getinstance().addToFactory("taiozhanjieshu_ske_json", "taiozhanjieshu_tex_json", "taiozhanjieshu_tex_png");
            DRAGONBONES.getinstance().initArmature("错题本", "tiaozhanjieshu");
        };
        CuoTiBen.prototype.init = function () {
            var _this = this;
            Manager.EventManager.get().addListener("CuoTiBen", this.restart, egret.TouchEvent.TOUCH_TAP, function () {
                //点击重置
                MUSIC4.get().play("dianji");
                MUSIC4.get().pauseLast();
                MUSIC4.get().play("bg", -1);
                Manager.DelayManager.get().removeAllDelay();
                _this.Global.restart();
                Manager.EventManager.get().removeAllListener();
                Hierarchy.AbManager.get().show("Start");
                Hierarchy.MenuManager.get().music.selected = false;
                _this.init();
            }, this);
            this.contentGroup.removeChildren();
            this.contentGroup.alpha = 0;
            DRAGONBONES.getinstance().playAnimation("错题本", "shengli", "a", this.aniGroup, 1);
            var _loop_1 = function (i) {
                var correct = true;
                this_1.Global.wrongArr.forEach(function (v, j) {
                    if (v == i) {
                        _this.Global.wrongArr.splice(j, 1);
                        correct = false;
                    }
                });
                var word = this_1.Global.questionCurArr[i].zimu.substring(0, this_1.Global.questionCurArr[i].zimu.length - 1) +
                    COMMONUTILS.get().getPinyin(this_1.Global.questionCurArr[i].zimu.substr(-1, 1), this_1.Global.questionCurArr[i].shengdiao);
                cell = new Assembly.CuoTiBenCell(word, correct);
                this_1.contentGroup.addChild(cell);
                this_1.contentGroup.scaleX = 1.2;
                this_1.contentGroup.scaleY = 1.2;
            };
            var this_1 = this, cell;
            for (var i = 0; i < 10; i++) {
                _loop_1(i);
            }
            egret.Tween.get(this.contentGroup).wait(500).to({ alpha: 1 }, 500, egret.Ease.backInOut);
        };
        return CuoTiBen;
    }(eui.Component));
    Assembly.CuoTiBen = CuoTiBen;
    __reflect(CuoTiBen.prototype, "Assembly.CuoTiBen", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=CuoTiBen.js.map