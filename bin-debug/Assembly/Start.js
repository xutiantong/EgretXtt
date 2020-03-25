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
 * 组件
 */
var Assembly;
(function (Assembly) {
    /**
     * 开始界面组件
     */
    var Start = (function (_super) {
        __extends(Start, _super);
        function Start() {
            var _this = _super.call(this) || this;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        Start.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Start.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            DRAGONBONES.getInstance().addToFactory("startgame_ske_json", "startgame_tex_json", "startgame_tex_png");
            this.startAni = DRAGONBONES.getInstance().initArmature("开始动画", "startgame");
            this.aniGroup.addChild(this.startAni);
            this.startAni.armature.getSlot("形状_64").displayList = [];
            this.startAni.armature.getSlot("开始_游戏").displayList = [];
            DRAGONBONES.getInstance().addToFactory("startbtn_ske_json", "startbtn_tex_json", "startbtn_tex_png");
            this.startBtnAni = DRAGONBONES.getInstance().initArmature("开始按钮动画", "startbt");
            this.addChild(this.startBtnAni);
        };
        Start.prototype.onStart = function (evt) {
            var _this = this;
            this.startGroup.touchEnabled = false;
            this.startGroup.touchChildren = false;
            MUSIC4.get().play("dianji");
            this.startBtnAni.animation.play("click", 1);
            egret.Tween.get(this.startGroup).to({ scaleX: 1.2, scaleY: 1.2 }, 830).to({ scaleX: 1, scaleY: 1 }, 1750 - 830).call(function () {
                //隐藏开始界面
                Hierarchy.AbManager.get().hide("Start");
                //显示场景1
                Hierarchy.AbManager.get().show("Select2");
                //显示介绍
                Hierarchy.MessageManager.get().show("Introduction");
                _this.startGroup.touchEnabled = true;
                _this.startGroup.touchChildren = true;
            });
        };
        Start.prototype.init = function () {
            this.startGroup.visible = true;
            this.startAni.animation.play("newAnimation", 1);
            this.startBtnAni.animation.play("normal", 0);
            Manager.EventManager.get().addListener("Start", this.startGroup, egret.TouchEvent.TOUCH_TAP, this.onStart, this);
            this.addShua(this["gg"]);
        };
        Start.prototype.addShua = function (obj) {
            var texture = new egret.RenderTexture();
            texture.drawToTexture(obj);
            var gameTitle_mask = new egret.Bitmap(texture);
            gameTitle_mask.x = obj.x;
            gameTitle_mask.y = obj.y;
            this.addChild(gameTitle_mask);
            var spark = new egret.Bitmap(RES.getRes("soldier_light_png"));
            var MOVE_MIN_Y = obj.y;
            var MOVE_MAX_Y = obj.y + obj.height - spark.height;
            spark.y = MOVE_MIN_Y;
            spark.x = obj.x;
            spark.mask = gameTitle_mask;
            this.addChild(spark);
            var speed = 8;
            var direction = 1;
            egret.Ticker.getInstance().register(function () {
                spark.y += speed * direction;
                if (spark.y > MOVE_MAX_Y || spark.y < MOVE_MIN_Y)
                    direction *= -1;
            }, this);
        };
        return Start;
    }(eui.Component));
    Assembly.Start = Start;
    __reflect(Start.prototype, "Assembly.Start", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=Start.js.map