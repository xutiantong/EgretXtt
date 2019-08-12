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
            _this.curWord = null;
            _this.Global = Manager.GlobalManager.get();
            return _this;
        }
        Scene1.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Scene1.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initCfg();
            DRAGONBONES.getInstance().initArmature("背景", "bg");
            DRAGONBONES.getInstance().playAnimation("背景", "newAnimation", this.bgGroup, 0);
            this.bag1 = DRAGONBONES.getInstance().initArmature("果树", "guoshu");
            this.touchBag1.addChild(this.bag1);
            this.bag1.x = -930;
            this.bag1.y = -420;
            this.bag2 = DRAGONBONES.getInstance().initArmature("鱼肉", "yurou");
            this.touchBag2.addChild(this.bag2);
            this.bag2.x = -930;
            this.bag2.y = -420;
            DRAGONBONES.getInstance().addToFactory("jiaren_ske_json", "jiaren_tex_json", "jiaren_tex_png");
            this.cangjie = DRAGONBONES.getInstance().initArmature("仓颉", "cangjie");
            this.touch3.addChild(this.cangjie);
            this.cangjie.scaleX = 0.65;
            this.cangjie.scaleY = 0.65;
            this.cangjie.x = 141;
            this.cangjie.y = 351;
            this.cangjie.animation.play("zhanli", 0);
            this.father = DRAGONBONES.getInstance().initArmature("爸爸", "father");
            this.touch1.addChild(this.father);
            this.father.scaleX = 0.65;
            this.father.scaleY = 0.65;
            this.father.x = 141;
            this.father.y = 500;
            this.father.animation.play("zhanli", 0);
            this.sister = DRAGONBONES.getInstance().initArmature("妹妹", "sister");
            this.touch2.addChild(this.sister);
            this.sister.scaleX = 0.5;
            this.sister.scaleY = 0.5;
            this.sister.x = 105;
            this.sister.y = 320;
            this.sister.animation.play("zhanli", 0);
            this.mother = DRAGONBONES.getInstance().initArmature("妈妈", "mother");
            this.touch4.addChild(this.mother);
            this.mother.scaleX = 0.65;
            this.mother.scaleY = 0.65;
            this.mother.x = 141;
            this.mother.y = 330;
            this.mother.animation.play("zhanli", 0);
        };
        Scene1.prototype.init = function () {
            this.generateQuestion();
            Manager.EventManager.get().addListener("Scene1", this.touchBag1, egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
            Manager.EventManager.get().addListener("Scene1", this.touchBag2, egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
            Manager.EventManager.get().addListener("Scene1", this.img1, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            Manager.EventManager.get().addListener("Scene1", this.img2, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            Manager.EventManager.get().addListener("Scene1", this.img3, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            Manager.EventManager.get().addListener("Scene1", this.img4, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            this.foodGroup.removeChildren();
            this.showSelect();
        };
        Scene1.prototype.initCfg = function () {
            var config = RES.getRes("ti_json");
            for (var i = 0; i < 25; i++) {
                this.questionCfg.push(config[i]);
            }
        };
        Scene1.prototype.generateQuestion = function () {
            this.Global.questionCurArr = COMMONUTILS.get().randomNewArr(this.questionCfg, 9);
        };
        Scene1.prototype.showSelect = function () {
            this.touchChildren = true;
            this.selectGroup.visible = true;
            this.questionGroup.visible = false;
            this.touchBag1.touchEnabled = true;
            this.touchBag2.touchEnabled = true;
            this.bag1.animation.play("bi");
            this.bag2.animation.play("bi");
        };
        Scene1.prototype.showNextQuestion = function (x, y) {
            var _this = this;
            //禁止点击
            this.touchChildren = false;
            Hierarchy.MenuManager.get().reback.touchEnabled = false;
            //判断是否结束
            if (this.Global.questionNum == 10) {
                Hierarchy.AbManager.get().show("End");
                Hierarchy.MenuManager.get().reback.touchEnabled = true;
                console.log("over");
                return;
            }
            this.foodGroup.removeChildren();
            if (this.Global.questionNum == 1) {
                this.curWord = new Assembly.Word();
                this.foodGroup.addChild(this.curWord);
                this.curWord.x = x + 250;
                this.curWord.y = y;
                this.curWord.scaleX = 0;
                this.curWord.scaleY = 0;
                egret.Tween.get(this.curWord).to({ x: 960, y: 150, scaleX: 1, scaleY: 1 }, 400);
            }
            else {
                this.curWord = new Assembly.Word();
                this.foodGroup.addChild(this.curWord);
                this.curWord.x = 960;
                this.curWord.y = 150;
            }
            var question = this.Global.questionCurArr[this.Global.questionNum - 1];
            var arr = [1, 2, 3, 4];
            arr = COMMONUTILS.get().randomArrOrder(arr);
            for (var i = 1; i <= 4; i++) {
                this["touch" + i].setChildIndex(this["img" + i], -1);
                this["img" + i].touchEnabled = true;
                this["img" + i].visible = true;
                this["img" + i].scaleX = 0.78;
                this["img" + i].scaleY = 0.78;
                this["img" + i].filters = [];
                this["img" + i].source = question["p" + arr[i - 1]];
            }
            //恢复点击
            egret.Tween.get(this.questionGroup).to({ alpha: 1 }, 300).call(function () {
                _this.touchChildren = true;
                Hierarchy.MenuManager.get().reback.touchEnabled = true;
            });
        };
        Scene1.prototype.onSelect = function (evt) {
            var _this = this;
            this.touchBag1.touchEnabled = false;
            this.touchBag2.touchEnabled = false;
            MUSIC4.get().play("bag");
            evt.target.getChildAt(0).animation.play("kai", 1);
            var x = evt.target.x;
            var y = evt.target.y;
            this.Global.questionType = evt.target == this.touchBag1 ? 0 : 1;
            Manager.DelayManager.get().addDelay(600, function () {
                MUSIC4.get().play("bounce");
                _this.showNextQuestion(x, y);
            });
            egret.Tween.get(this.selectGroup).wait(2000).to({ alpha: 0 }, 300).call(function () {
                _this.selectGroup.visible = false;
                _this.questionGroup.visible = true;
                MUSIC4.get().play("introduction2");
            }).to({ alpha: 1 });
        };
        Scene1.prototype.onClick = function (evt) {
            var _this = this;
            this.touchChildren = false;
            Hierarchy.MenuManager.get().reback.touchEnabled = false;
            if (evt.target == this.img1) {
                this.img1.touchEnabled = false;
                if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
                    MUSIC4.get().play("bag");
                    MUSIC4.get().play("fatherLaugh");
                    this.father.animation.play("xiao", 1);
                    Manager.DelayManager.get().addDelay(330, function () { _this.father.animation.play("zhanli", 0); });
                    var pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
                    pos = this.touch1.globalToLocal(pos.x, pos.y);
                    egret.Tween.get(this.img1).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(function () {
                        _this.curWord.tipGroup.visible = false;
                    }).wait(500).call(function () {
                        _this.curWord.label.visible = false;
                        _this.curWord.img.visible = false;
                        _this.setChildIndex(_this.foodGroup, -1);
                    }).to({ x: 24, y: 346, visible: false }).call(function () {
                        MUSIC4.get().play("fly");
                        egret.Tween.get(_this.curWord).to({ x: _this.touch1.x + 100, y: _this.touch1.y + 230, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(function () {
                            _this.setChildIndex(_this.questionGroup, -1);
                            for (var i = 1; i <= 4; i++) {
                                _this["img" + i].filters = [];
                            }
                            egret.Tween.get(_this.questionGroup).to({ alpha: 0 }, 300).call(function () {
                                _this.Global.questionNum += 1;
                                _this.showNextQuestion();
                            });
                        });
                    });
                }
                else {
                    MUSIC4.get().play("err");
                    MUSIC4.get().play("fatherDoubt");
                    this.father.animation.play("yiwen", 1);
                    Manager.DelayManager.get().addDelay(1670, function () { _this.father.animation.play("zhanli", 0); });
                    COMMONUTILS.get().addGreenRedFilter(this.img1, false);
                    this.touchChildren = true;
                    Hierarchy.MenuManager.get().reback.touchEnabled = true;
                    if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
                        this.Global.wrongArr.push(this.Global.questionNum - 1);
                    }
                }
            }
            else if (evt.target == this.img2) {
                this.img2.touchEnabled = false;
                if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
                    MUSIC4.get().play("bag");
                    MUSIC4.get().play("sisterLaugh");
                    this.sister.animation.play("xiao", 1);
                    Manager.DelayManager.get().addDelay(330, function () { _this.sister.animation.play("zhanli", 0); });
                    var pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
                    pos = this.touch2.globalToLocal(pos.x, pos.y);
                    egret.Tween.get(this.img2).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(function () {
                        _this.curWord.tipGroup.visible = false;
                    }).wait(500).call(function () {
                        _this.curWord.label.visible = false;
                        _this.curWord.img.visible = false;
                        _this.setChildIndex(_this.foodGroup, -1);
                    }).to({ x: -9, y: 188, visible: false }).call(function () {
                        MUSIC4.get().play("fly");
                        egret.Tween.get(_this.curWord).to({ x: _this.touch2.x + 100, y: _this.touch2.y + 200, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(function () {
                            _this.setChildIndex(_this.questionGroup, -1);
                            for (var i = 1; i <= 4; i++) {
                                _this["img" + i].filters = [];
                            }
                            egret.Tween.get(_this.questionGroup).to({ alpha: 0 }, 300).call(function () {
                                _this.Global.questionNum += 1;
                                _this.showNextQuestion();
                            });
                        });
                    });
                }
                else {
                    MUSIC4.get().play("err");
                    MUSIC4.get().play("sisterDoubt");
                    this.sister.animation.play("yiwen", 1);
                    Manager.DelayManager.get().addDelay(1670, function () { _this.sister.animation.play("zhanli", 0); });
                    COMMONUTILS.get().addGreenRedFilter(this.img2, false);
                    this.touchChildren = true;
                    Hierarchy.MenuManager.get().reback.touchEnabled = true;
                    if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
                        this.Global.wrongArr.push(this.Global.questionNum - 1);
                    }
                }
            }
            else if (evt.target == this.img3) {
                this.img3.touchEnabled = false;
                if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
                    MUSIC4.get().play("bag");
                    MUSIC4.get().play("brotherLaugh");
                    this.cangjie.animation.play("xiao", 1);
                    Manager.DelayManager.get().addDelay(330, function () { _this.cangjie.animation.play("zhanli", 0); });
                    var pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
                    pos = this.touch3.globalToLocal(pos.x, pos.y);
                    egret.Tween.get(this.img3).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(function () {
                        _this.curWord.tipGroup.visible = false;
                    }).wait(500).call(function () {
                        _this.curWord.label.visible = false;
                        _this.curWord.img.visible = false;
                        _this.setChildIndex(_this.foodGroup, -1);
                    }).to({ x: 27, y: 230, visible: false }).call(function () {
                        MUSIC4.get().play("fly");
                        egret.Tween.get(_this.curWord).to({ x: _this.touch3.x + 100, y: _this.touch3.y + 120, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(function () {
                            _this.setChildIndex(_this.questionGroup, -1);
                            for (var i = 1; i <= 4; i++) {
                                _this["img" + i].filters = [];
                            }
                            egret.Tween.get(_this.questionGroup).to({ alpha: 0 }, 300).call(function () {
                                _this.Global.questionNum += 1;
                                _this.showNextQuestion();
                            });
                        });
                    });
                }
                else {
                    MUSIC4.get().play("err");
                    MUSIC4.get().play("brotherDoubt");
                    this.cangjie.animation.play("yiwen", 1);
                    Manager.DelayManager.get().addDelay(1670, function () { _this.cangjie.animation.play("zhanli", 0); });
                    COMMONUTILS.get().addGreenRedFilter(this.img3, false);
                    this.touchChildren = true;
                    Hierarchy.MenuManager.get().reback.touchEnabled = true;
                    if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
                        this.Global.wrongArr.push(this.Global.questionNum - 1);
                    }
                }
            }
            else if (evt.target == this.img4) {
                this.img4.touchEnabled = false;
                if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
                    MUSIC4.get().play("bag");
                    MUSIC4.get().play("motherLaugh");
                    this.mother.animation.play("xiao", 1);
                    Manager.DelayManager.get().addDelay(330, function () { _this.mother.animation.play("zhanli", 0); });
                    var pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
                    pos = this.touch4.globalToLocal(pos.x, pos.y);
                    egret.Tween.get(this.img4).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(function () {
                        _this.curWord.tipGroup.visible = false;
                    }).wait(500).call(function () {
                        _this.curWord.label.visible = false;
                        _this.curWord.img.visible = false;
                        _this.setChildIndex(_this.foodGroup, -1);
                    }).to({ x: 15, y: 202, visible: false }).call(function () {
                        MUSIC4.get().play("fly");
                        egret.Tween.get(_this.curWord).to({ x: _this.touch4.x + 100, y: _this.touch4.y + 150, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(function () {
                            _this.setChildIndex(_this.questionGroup, -1);
                            for (var i = 1; i <= 4; i++) {
                                _this["img" + i].filters = [];
                            }
                            egret.Tween.get(_this.questionGroup).to({ alpha: 0 }, 300).call(function () {
                                _this.Global.questionNum += 1;
                                _this.showNextQuestion();
                            });
                        });
                    });
                }
                else {
                    MUSIC4.get().play("err");
                    MUSIC4.get().play("motherDoubt");
                    this.mother.animation.play("yiwen", 1);
                    Manager.DelayManager.get().addDelay(1670, function () { _this.mother.animation.play("zhanli", 0); });
                    COMMONUTILS.get().addGreenRedFilter(this.img4, false);
                    this.touchChildren = true;
                    Hierarchy.MenuManager.get().reback.touchEnabled = true;
                    if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
                        this.Global.wrongArr.push(this.Global.questionNum - 1);
                    }
                }
            }
        };
        return Scene1;
    }(eui.Component));
    Assembly.Scene1 = Scene1;
    __reflect(Scene1.prototype, "Assembly.Scene1", ["eui.UIComponent", "egret.DisplayObject"]);
})(Assembly || (Assembly = {}));
