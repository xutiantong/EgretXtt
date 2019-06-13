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
     * 场景1
     */
    var Scene1 = (function (_super) {
        __extends(Scene1, _super);
        function Scene1() {
            var _this = _super.call(this) || this;
            _this.questionCfg = []; //题目配置
            _this.startPoint = { x: 0, y: 0 };
            _this.moveAnswer = "";
            _this.answer = [];
            _this.answerPos = [{ x: 1460, y: 190 }, { x: 1460, y: 325 }, { x: 1460, y: 460 }, { x: 1460, y: 590 }, { x: 1460, y: 725 }, { x: 1460, y: 855 }];
            _this.result = ["", "", "", "", "", ""];
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        Scene1.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Scene1.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.pan = DRAGONBONES.getinstance().initArmature("烤盘", "shouzhua");
            this.aniGroup.addChild(this.pan);
            this.initCfg();
        };
        Scene1.prototype.init = function () {
            this.result = ["", "", "", "", "", ""];
            this.questionGroup.alpha = 0;
            this.questionGroup.removeChildren();
            this.pan.x = 1400;
            this.pan.y = 1500;
            this.confirm.y = 1110;
            this.basket.y = -1080;
            this.generateQuestion();
            Manager.EventManager.get().addListener("Scene1", this.questionGroup, egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            Manager.EventManager.get().addListener("Scene1", this.questionGroup, egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            Manager.EventManager.get().addListener("Scene1", this.questionGroup, egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            Manager.EventManager.get().addListener("Scene1", this.confirm, egret.TouchEvent.TOUCH_TAP, this.onClickConfirm, this);
        };
        Scene1.prototype.initCfg = function () {
            var config = RES.getRes("ti_json");
            for (var i = 0; i < 11; i++) {
                this.questionCfg.push(config[i]);
            }
        };
        Scene1.prototype.generateQuestion = function () {
            var questionCurArr = [];
            questionCurArr = COMMONUTILS.get().suiji(this.questionCfg, 6);
            questionCurArr = COMMONUTILS.get().suijishunxubyarr(questionCurArr);
            this.Global.questionCurArr = questionCurArr;
        };
        Scene1.prototype.showNextQuestion = function () {
            var _this = this;
            this.touchChildren = false;
            Hierarchy.MenuManager.get().reback.touchEnabled = false;
            if (this.Global.questionNum == 7) {
                egret.Tween.get(this.basket).to({ y: 0 }, 1000, egret.Ease.quadOut).call(function () {
                    MUSIC4.get().play("finish");
                }).wait(3500).call(function () {
                    Hierarchy.AbManager.get().show("End");
                    Hierarchy.MenuManager.get().reback.touchEnabled = true;
                    _this.touchChildren = true;
                    console.log("over");
                });
                return;
            }
            this.answer = [];
            for (var i = 1; i <= 6; i++) {
                if (this.Global.questionCurArr[this.Global.questionNum - 1][i] != null) {
                    this.answer.push(this.Global.questionCurArr[this.Global.questionNum - 1][i]);
                }
            }
            this.answer = COMMONUTILS.get().suijishunxubyarr(this.answer);
            for (var j = 0; j <= this.answer.length - 1; j++) {
                var bread = new Assembly.Bread(this.answer[String(j)]);
                this.questionGroup.addChild(bread);
                bread.x = 450;
                bread.y = 150 + (j) * 155;
                bread.rotation = COMMONUTILS.get().getsuiji(-5, 5);
            }
            this.pan.animation.gotoAndStopByFrame("in", 0);
            egret.Tween.get(this.questionGroup).to({ alpha: 1 }, 1000);
            egret.Tween.get(this.pan).to({ y: 350 }, 1000, egret.Ease.circOut).call(function () {
                _this.touchChildren = true;
                Hierarchy.MenuManager.get().reback.touchEnabled = true;
                _this.pan.animation.play("in", 1);
            });
        };
        Scene1.prototype.showQuestionOut = function () {
            var _this = this;
            this.touchChildren = false;
            Hierarchy.MenuManager.get().reback.touchEnabled = false;
            this.pan.animation.play("out", 1);
            egret.Tween.get(this.questionGroup).wait(250).to({ x: 1100 }, 1300, egret.Ease.circOut);
            egret.Tween.get(this.pan).wait(250).to({ x: 2440 }, 1330, egret.Ease.circOut).call(function () {
                _this.questionGroup.x = 0;
                _this.questionGroup.alpha = 0;
                _this.questionGroup.removeChildren();
                _this.pan.x = 1400;
                _this.pan.y = 1500;
                _this.result = ["", "", "", "", "", ""];
                _this.showNextQuestion();
            });
        };
        Scene1.prototype.onClickConfirm = function () {
            var _this = this;
            this.confirm.touchEnabled = false;
            egret.Tween.get(this.confirm).call(function () {
                var correct = true;
                for (var i = 1; i <= _this.answer.length; i++) {
                    if (_this.Global.questionCurArr[_this.Global.questionNum - 1][i] != _this.result[i - 1]) {
                        _this.Global.wrongArr.push({ id: _this.Global.questionNum, answer: _this.result });
                        MUSIC4.get().play("err");
                        MUSIC4.get().play("wrong");
                        correct = false;
                        break;
                    }
                }
                if (correct) {
                    MUSIC4.get().play("dianji");
                    MUSIC4.get().play("correct");
                }
            }).to({ y: 1100 }, 500, egret.Ease.circOut).call(function () {
                _this.Global.questionNum += 1;
                _this.showQuestionOut();
                _this.confirm.touchEnabled = true;
            });
        };
        Scene1.prototype.onTouchBegin = function (evt) {
            for (var i = 0; i < this.questionGroup.numChildren; i++) {
                if (Math.abs(evt.stageX - this.questionGroup.getChildAt(i).x) <= 420 && Math.abs(evt.stageY - this.questionGroup.getChildAt(i).y) <= 75) {
                    this.startPoint.x = this.questionGroup.getChildAt(i).x;
                    this.startPoint.y = this.questionGroup.getChildAt(i).y;
                    this.moveAnswer = this.questionGroup.getChildAt(i).name;
                    this.questionGroup.setChildIndex(this.questionGroup.getChildAt(i), -2);
                }
            }
        };
        Scene1.prototype.onTouchMove = function (evt) {
            for (var i = 0; i < this.questionGroup.numChildren; i++) {
                if (this.moveAnswer == this.questionGroup.getChildAt(i).name) {
                    this.questionGroup.getChildAt(i).x = evt.stageX;
                    this.questionGroup.getChildAt(i).y = evt.stageY;
                    break;
                }
            }
        };
        Scene1.prototype.onTouchEnd = function (evt) {
            var _this = this;
            for (var i = 0; i < this.questionGroup.numChildren; i++) {
                if (this.moveAnswer == this.questionGroup.getChildAt(i).name) {
                    var _loop_1 = function (j) {
                        if (Math.abs(evt.stageX - this_1.answerPos[j].x) <= 420 && Math.abs(evt.stageY - this_1.answerPos[j].y) <= 75) {
                            if (this_1.result[j] == "") {
                                this_1.result.forEach(function (v, index) {
                                    if (v == _this.moveAnswer) {
                                        _this.result[index] = "";
                                    }
                                });
                                this_1.result[j] = this_1.moveAnswer;
                                this_1.questionGroup.getChildAt(i).x = this_1.answerPos[j].x;
                                this_1.questionGroup.getChildAt(i).y = this_1.answerPos[j].y;
                                this_1.questionGroup.getChildAt(i).rotation = 0;
                                this_1.moveAnswer = "";
                                this_1.checkShowConfirm();
                                return { value: void 0 };
                            }
                            else {
                                if (this_1.startPoint.x < 500) {
                                    this_1.questionGroup.getChildAt(i).x = this_1.startPoint.x;
                                    this_1.questionGroup.getChildAt(i).y = this_1.startPoint.y;
                                    this_1.moveAnswer = "";
                                    return { value: void 0 };
                                }
                                var tmp_1 = this_1.result[j];
                                this_1.result.forEach(function (v, index) {
                                    if (v == _this.moveAnswer) {
                                        _this.result[index] = tmp_1;
                                        for (var k = 0; k < _this.questionGroup.numChildren; k++) {
                                            if (tmp_1 == _this.questionGroup.getChildAt(k).name) {
                                                _this.questionGroup.getChildAt(k).x = _this.startPoint.x;
                                                _this.questionGroup.getChildAt(k).y = _this.startPoint.y;
                                            }
                                        }
                                    }
                                });
                                this_1.result[j] = this_1.moveAnswer;
                                this_1.questionGroup.getChildAt(i).x = this_1.answerPos[j].x;
                                this_1.questionGroup.getChildAt(i).y = this_1.answerPos[j].y;
                                this_1.moveAnswer = "";
                                this_1.checkShowConfirm();
                                return { value: void 0 };
                            }
                        }
                    };
                    var this_1 = this;
                    for (var j = 0; j < this.answer.length; j++) {
                        var state_1 = _loop_1(j);
                        if (typeof state_1 === "object")
                            return state_1.value;
                    }
                    this.questionGroup.getChildAt(i).x = this.startPoint.x;
                    this.questionGroup.getChildAt(i).y = this.startPoint.y;
                    this.moveAnswer = "";
                    this.checkShowConfirm();
                    return;
                }
            }
        };
        Scene1.prototype.checkShowConfirm = function () {
            var show = true;
            for (var i = 0; i < this.answer.length; i++) {
                if (this.result[i] == "") {
                    show = false;
                }
            }
            if (show) {
                egret.Tween.get(this.confirm).to({ y: 835 }, 500, egret.Ease.circOut);
            }
        };
        return Scene1;
    }(eui.Component));
    Assembly.Scene1 = Scene1;
    __reflect(Scene1.prototype, "Assembly.Scene1", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
