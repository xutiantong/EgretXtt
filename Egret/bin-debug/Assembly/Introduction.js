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
     * 说你好，读题组件
     * gameName: string = "东东"//由于动画的各种参数不同，得区别构建，目前有1.东东2.小王子
     * talkNum: number = 1//对话有几个（如果有两段对话，则第一段播放时不可点击，第二段解锁后可点击切断）
     * 两段声音命名：introduction1,introduction2
     * 两张图片命名：timu1,timu2
     */
    var Introduction = (function (_super) {
        __extends(Introduction, _super);
        function Introduction() {
            var _this = _super.call(this) || this;
            //设置
            _this.gameName = "东东";
            _this.talkNum = 2;
            _this.startText = "同学们，今天我是一名小小糕点师，要帮助大师父做很多美味的面包。不过，我遇到了一点小麻烦，你们能帮帮我吗？";
            _this.LoopText = "面团上有一些句子，你可以给他们排序吗？只有排列正确，我们才能开始烤面包呢！";
            //参数
            _this.skeName = ""; //龙骨文件ske
            _this.texName = ""; //龙骨文件tex
            _this.texName2 = ""; //龙骨文件png
            _this.armera = ""; //骨架
            _this.animStart = ""; //第一段动画名
            _this.animLoop = ""; //第二段动画名
            _this.soltName = ""; //气泡插槽名
            //公共
            _this.dr = DRAGONBONES.getinstance(); //龙骨方法
            _this.assembly = Hierarchy.AbManager.get(); //组件
            return _this;
        }
        Introduction.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Introduction.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            //1.龙骨散文件
            if (this.gameName == "东东") {
                this.skeName = "talk_ske_json";
                this.texName = "talk_tex_json";
                this.texName2 = "talk_tex_png";
                this.armera = "dongdong";
                this.animStart = "talk_tanchu";
                this.animLoop = "xunhuan";
                this.soltName = "qipao";
            }
            else if (this.gameName == "小王子") {
                this.skeName = "DB_duibai_ske_json";
                this.texName = "DB_duibai_tex_json";
                this.texName2 = "DB_duibai_tex_png";
                this.armera = "duibai";
                this.animStart = "DB_duibaitanchu";
                this.animLoop = "DB_duibai_xunhuan";
                this.soltName = "qipao";
            }
            else if (this.gameName == "仓颉") {
                this.skeName = "shuohua_ske_json";
                this.texName = "shuohua_tex_json";
                this.texName2 = "shuohua_tex_png";
                this.armera = "cangjiBodyAnimtaion";
                this.animStart = "tanchu";
                this.animLoop = "shuohua";
                this.soltName = "qipao";
            }
            //2.创建骨架
            this.dr.addToFactory(this.skeName, this.texName, this.texName2);
            this.dr.initArmature("说话", this.armera, function () { }, function () {
                //播完弹出自动播放循环
                if (_this.gameName == "东东") {
                    _this.dr.playAnimation("说话", _this.animLoop, "a", _this.touchGroup, 0, 0.5, 0.5, 1, 300, 1080);
                }
                else if (_this.gameName == "小王子") {
                    _this.dr.playAnimation("说话", _this.animLoop, "a", _this.touchGroup, 0, 1, 1, 1, 0, -100);
                }
                else if (_this.gameName == "仓颉") {
                    _this.dr.playAnimation("说话", _this.animLoop, "a", _this.touchGroup, 0, 1, 1, 1, 300, 1080);
                }
            });
        };
        /**
         * 更改泡泡内容
         * @param num
         */
        Introduction.prototype.changePop = function (num) {
            var pop = new Assembly.Pop(num == 1 ? this.startText : this.LoopText);
            this.addChild(pop);
            this.dr.changeSlotImg2("说话", this.soltName, pop);
        };
        /**
         * 自动调用
         */
        Introduction.prototype.init = function () {
            var _this = this;
            //1.一开始禁止点击，等待弹出动画弹出
            this.touchChildren = false;
            this.touchEnabled = false;
            //2.换第一句话的图片
            this.changePop(1);
            Manager.DelayManager.get().addDelay(500, function () {
                MUSIC4.get().play("introduction1");
                if (_this.talkNum == 1) {
                    //如果只是播放一个题目框，则立即恢复点击可切断
                    _this.touchChildren = true;
                    _this.touchEnabled = true;
                    //第一段声音播完则动画停住
                    MUSIC4.get().addEvent("introduction1", function () {
                        _this.dr.getarmature("说话").armature.animation.gotoAndStopByFrame(_this.animLoop, 0);
                    }, _this);
                }
                else if (_this.talkNum == 2) {
                    //如果播放多个板子，则在第一个声音播放完后播放下一个板子的声音和动画
                    MUSIC4.get().addEvent("introduction1", function () {
                        //2.换第一句话的图片
                        _this.changePop(2);
                        MUSIC4.get().play("introduction2");
                        _this.touchChildren = true;
                        _this.touchEnabled = true;
                    }, _this);
                    MUSIC4.get().addEvent("introduction2", function () {
                        _this.dr.getarmature("说话").armature.animation.gotoAndStopByFrame(_this.animLoop, 0);
                    }, _this);
                }
            });
            //自动播放弹出
            if (this.gameName == "东东") {
                this.dr.playAnimation("说话", this.animStart, "a", this.touchGroup, 1, 0.5, 0.5, 1, 300, 1080);
            }
            else if (this.gameName == "小王子") {
                this.dr.playAnimation("说话", this.animStart, "a", this.touchGroup, 1, 1, 1, 1, 0, -100);
            }
            else if (this.gameName == "仓颉") {
                this.dr.playAnimation("说话", this.animStart, "a", this.touchGroup, 1, 1, 1, 1, 300, 1080);
            }
            Manager.EventManager.get().addListener("Introduction", this, egret.TouchEvent.TOUCH_TAP, function () {
                // 点击声音
                MUSIC4.get().play("dianji");
                // 停止介绍
                MUSIC4.get().stop("introduction1");
                MUSIC4.get().stop("introduction2");
                // 隐藏介绍界面
                Hierarchy.MessageManager.get().hide("Introduction");
                // 开始第一题
                Hierarchy.AbManager.get().getOne("Scene1").showNextQuestion();
            }, this);
        };
        return Introduction;
    }(eui.Component));
    Assembly.Introduction = Introduction;
    __reflect(Introduction.prototype, "Assembly.Introduction", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
