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
    /**
     * @description 介绍组件
     * @description
     * @description introduction1,introduction2为介绍第一二句话的音频
     */
    var Introduction = (function (_super) {
        __extends(Introduction, _super);
        function Introduction() {
            var _this = _super.call(this) || this;
            //设置
            _this.animNameArr = ["小书童"];
            _this.startText = "同学们，你们向往闲适恬淡的山水田园生活吗？今天我们就一起走进王维和孟浩然的人生旅程中，去感悟山水之美，田园之乐吧！";
            _this.LoopText = "";
            //参数
            _this.skeName0 = "shutong_ske_json";
            _this.texName0 = "shutong_tex_json";
            _this.texNamePng0 = "shutong_tex_png";
            _this.skeName1 = "sister_ske_json";
            _this.texName1 = "sister_tex_json";
            _this.texNamePng1 = "sister_tex_png";
            _this.armera0 = "shutong"; //骨架
            _this.animStart0 = "tanchu"; //第一段动画名
            _this.animLoop0 = "talk"; //第二段动画名
            _this.animLoop01 = "talk"; //第三段动画名
            _this.animStop0 = "talk_mouse_stop"; //停住呼吸动画
            _this.slotName0 = "1"; //气泡插槽名
            _this.armera1 = "sister"; //骨架
            _this.animStart1 = "stanchu"; //第一段动画名
            _this.animLoop1 = "yiwen"; //第二段动画名
            _this.animLoop11 = "xiao"; //第三段动画名
            _this.slotName1 = "1"; //气泡插槽名
            //公共
            _this.dr = DRAGONBONES.getInstance(); //龙骨方法
            return _this;
        }
        Introduction.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Introduction.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            //创建骨架
            for (var i = 0; i < this.animNameArr.length; i++) {
                this.dr.addToFactory(this["skeName" + i], this["texName" + i], this["texNamePng" + i]);
                this["anim" + i] = this.dr.initArmature(this.animNameArr[i], this["armera" + i]);
            }
        };
        /**
         * 更改泡泡内容
         * @param num
         */
        Introduction.prototype.changePop = function (name, slotName, num) {
            var pop = new Assembly.Pop(num == 1 ? this.startText : this.LoopText);
            // this.addChild(pop)
            if (num != 1) {
                pop.arrowImage.horizontalCenter = 500;
                pop.arrowImage.scaleX = -1;
                pop.anchorOffsetX = pop.width / 2 + 200;
                pop.anchorOffsetY = pop.height / 2 - 150;
                pop.scaleX = pop.scaleY = 1.2;
            }
            else {
                pop.anchorOffsetX = pop.width / 2 - 100;
                pop.anchorOffsetY = pop.height / 2;
            }
            DRAGONBONES.getInstance().getarmature(name).armature.getSlot(slotName).displayList = [pop];
        };
        Introduction.prototype.init = function () {
            var _this = this;
            for (var i = 0; i < this.animNameArr.length; i++) {
                //更改插槽
                this.changePop(this.animNameArr[i], this["slotName" + i], i + 1);
                //onComplete
                Manager.EventManager.get().addListener("Introduction", this["anim" + i], dragonBones.EgretEvent.COMPLETE, this.animComplete, this);
            }
            //visible
            this.anim0.visible = true;
            if (this.anim1)
                this.anim1.visible = false;
            //播放第一动画
            this.dr.playAnimation(this.animNameArr[0], this.animStart0, this.touchGroup, 1, 1, 1, 1, 300, 1080);
            MUSIC4.get().play("introduction1");
            MUSIC4.get().addEvent("introduction1", function () {
                _this.showAnim2();
            }, this);
            Manager.EventManager.get().addListener("Introduction", this, egret.TouchEvent.TOUCH_TAP, function () {
                MUSIC4.get().play("dianji");
                if (_this.animNameArr.length == 1) {
                    _this.showScene1();
                }
                else {
                    if (_this.anim0.visible == false) {
                        _this.showScene1();
                    }
                    else {
                        _this.showAnim2();
                    }
                }
            }, this);
        };
        Introduction.prototype.showAnim2 = function () {
            var _this = this;
            MUSIC4.get().stop("introduction1");
            //第一动画停住
            this.anim0.animation.gotoAndStopByFrame(this.animLoop0, 0);
            this.anim0.animation.play(this.animStop0, 0);
            if (this.animNameArr.length == 1) {
                // this.showScene1()
            }
            else {
                this.anim0.visible = false;
                //第二动画播放
                MUSIC4.get().play("introduction2");
                this.anim1.visible = true;
                this.dr.playAnimation(this.animNameArr[1], this.animStart1, this.touchGroup, 1, 1, 1, 1, 1700, 1080);
                MUSIC4.get().addEvent("introduction2", function () {
                    //第二动画停住
                    _this.anim1.animation.gotoAndStopByFrame(_this.animLoop1, 0);
                    // this.anim1.visible = false
                    // this.showScene1()
                }, this);
            }
        };
        Introduction.prototype.showScene1 = function () {
            MUSIC4.get().stop("introduction1");
            MUSIC4.get().stop("introduction2");
            // 隐藏介绍界面
            Hierarchy.MessageManager.get().hide("Introduction");
            // 开始第一题
            // Hierarchy.AbManager.get().getOne("Scene1").showNextQuestion();
            //女声提示
            MUSIC4.get().play("tips1", 1);
        };
        Introduction.prototype.animComplete = function (evt) {
            if (evt.animationName == this.animStart0) {
                // console.log("动画1弹出播放完")
                evt.armature.animation.play(this.animLoop0, 1);
            }
            if (evt.animationName == this.animLoop0) {
                var _name = Math.random() > 0.5 ? this.animLoop0 : this.animLoop01;
                evt.armature.animation.play(_name, 1);
            }
            if (evt.animationName == this.animLoop01) {
                var _name = Math.random() > 0.5 ? this.animLoop0 : this.animLoop01;
                evt.armature.animation.play(_name, 1);
            }
            if (evt.animationName == this.animStart1) {
                // console.log("动画2弹出播放完")
                evt.armature.animation.play(this.animLoop1, 1);
            }
            if (evt.animationName == this.animLoop1) {
                var _name = Math.random() > 0.5 ? this.animLoop1 : this.animLoop11;
                evt.armature.animation.play(_name, 1);
            }
            if (evt.animationName == this.animLoop11) {
                var _name = Math.random() > 0.5 ? this.animLoop1 : this.animLoop11;
                evt.armature.animation.play(_name, 1);
            }
        };
        return Introduction;
    }(eui.Component));
    Assembly.Introduction = Introduction;
    __reflect(Introduction.prototype, "Assembly.Introduction", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
//# sourceMappingURL=Introduction.js.map