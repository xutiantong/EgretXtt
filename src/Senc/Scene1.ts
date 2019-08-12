module Assembly {
	/**
	 * 场景1
	 */
	export class Scene1 extends eui.Component implements eui.UIComponent {

		public bgGroup: eui.Group; //背景动画层
		public selectGroup: eui.Group; //选题层
		public questionGroup: eui.Group; //题目互动层
		public foodGroup: eui.Group; //选项层
		public touchBag1: eui.Group;
		public touchBag2: eui.Group;
		public touch1: eui.Group;
		public touch2: eui.Group;
		public touch3: eui.Group;
		public touch4: eui.Group;
		public img1: eui.Image;
		public img2: eui.Image;
		public img3: eui.Image;
		public img4: eui.Image;
		private questionCfg: Array<any> = []; //题目配置
		private bag1: dragonBones.EgretArmatureDisplay;
		private bag2: dragonBones.EgretArmatureDisplay;
		private cangjie: dragonBones.EgretArmatureDisplay;
		private father: dragonBones.EgretArmatureDisplay;
		private sister: dragonBones.EgretArmatureDisplay;
		private mother: dragonBones.EgretArmatureDisplay;
		private curWord: Word = null;

		private Global = Manager.GlobalManager.get();

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
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
		}

		init() {
			this.generateQuestion();
			Manager.EventManager.get().addListener("Scene1", this.touchBag1, egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
			Manager.EventManager.get().addListener("Scene1", this.touchBag2, egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
			Manager.EventManager.get().addListener("Scene1", this.img1, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			Manager.EventManager.get().addListener("Scene1", this.img2, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			Manager.EventManager.get().addListener("Scene1", this.img3, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			Manager.EventManager.get().addListener("Scene1", this.img4, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			this.foodGroup.removeChildren();
			this.showSelect();
		}

		private initCfg() {
			let config = RES.getRes("ti_json");
			for (let i = 0; i < 25; i++) {
				this.questionCfg.push(config[i]);
			}
		}

		private generateQuestion() {
			this.Global.questionCurArr = COMMONUTILS.get().randomNewArr(this.questionCfg, 9);
		}

		private showSelect() {
			this.touchChildren = true;
			this.selectGroup.visible = true;
			this.questionGroup.visible = false;
			this.touchBag1.touchEnabled = true;
			this.touchBag2.touchEnabled = true;
			this.bag1.animation.play("bi");
			this.bag2.animation.play("bi");
		}

		private showNextQuestion(x?: number, y?: number) {
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
				this.curWord = new Word();
				this.foodGroup.addChild(this.curWord);
				this.curWord.x = x + 250;
				this.curWord.y = y;
				this.curWord.scaleX = 0;
				this.curWord.scaleY = 0;
				egret.Tween.get(this.curWord).to({ x: 960, y: 150, scaleX: 1, scaleY: 1 }, 400);
			} else {
				this.curWord = new Word();
				this.foodGroup.addChild(this.curWord);
				this.curWord.x = 960;
				this.curWord.y = 150;
			}
			let question = this.Global.questionCurArr[this.Global.questionNum - 1];
			let arr = [1, 2, 3, 4];
			arr = COMMONUTILS.get().randomArrOrder(arr);
			for (let i = 1; i <= 4; i++) {
				this["touch" + i].setChildIndex(this["img" + i], -1);
				this["img" + i].touchEnabled = true;
				this["img" + i].visible = true;
				this["img" + i].scaleX = 0.78;
				this["img" + i].scaleY = 0.78;
				this["img" + i].filters = [];
				this["img" + i].source = question["p" + arr[i - 1]];
			}
			//恢复点击
			egret.Tween.get(this.questionGroup).to({ alpha: 1 }, 300).call(() => {
				this.touchChildren = true;
				Hierarchy.MenuManager.get().reback.touchEnabled = true;
			});
		}

		private onSelect(evt: egret.TouchEvent) {
			this.touchBag1.touchEnabled = false;
			this.touchBag2.touchEnabled = false;
			MUSIC4.get().play("bag");
			evt.target.getChildAt(0).animation.play("kai", 1);
			let x = evt.target.x;
			let y = evt.target.y
			this.Global.questionType = evt.target == this.touchBag1 ? 0 : 1;
			Manager.DelayManager.get().addDelay(600, () => {
				MUSIC4.get().play("bounce");
				this.showNextQuestion(x, y);
			});
			egret.Tween.get(this.selectGroup).wait(2000).to({ alpha: 0 }, 300).call(() => {
				this.selectGroup.visible = false;
				this.questionGroup.visible = true;
				MUSIC4.get().play("introduction2");
			}).to({ alpha: 1 });
		}

		private onClick(evt: egret.TouchEvent) {
			this.touchChildren = false;
			Hierarchy.MenuManager.get().reback.touchEnabled = false;
			if (evt.target == this.img1) {
				this.img1.touchEnabled = false;
				if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
					MUSIC4.get().play("bag");
					MUSIC4.get().play("fatherLaugh");
					this.father.animation.play("xiao", 1);
					Manager.DelayManager.get().addDelay(330, () => { this.father.animation.play("zhanli", 0); });
					let pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
					pos = this.touch1.globalToLocal(pos.x, pos.y);
					egret.Tween.get(this.img1).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(() => {
						this.curWord.tipGroup.visible = false;
					}).wait(500).call(() => {
						this.curWord.label.visible = false;
						this.curWord.img.visible = false;
						this.setChildIndex(this.foodGroup, -1);
					}).to({ x: 24, y: 346, visible: false }).call(() => {
						MUSIC4.get().play("fly");
						egret.Tween.get(this.curWord).to({ x: this.touch1.x + 100, y: this.touch1.y + 230, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(() => {
							this.setChildIndex(this.questionGroup, -1);
							for (let i = 1; i <= 4; i++) {
								this["img" + i].filters = [];
							}
							egret.Tween.get(this.questionGroup).to({ alpha: 0 }, 300).call(() => {
								this.Global.questionNum += 1;
								this.showNextQuestion();
							});
						});
					});
				} else {
					MUSIC4.get().play("err");
					MUSIC4.get().play("fatherDoubt");
					this.father.animation.play("yiwen", 1);
					Manager.DelayManager.get().addDelay(1670, () => { this.father.animation.play("zhanli", 0); });
					COMMONUTILS.get().addGreenRedFilter(this.img1, false);
					this.touchChildren = true;
					Hierarchy.MenuManager.get().reback.touchEnabled = true;
					if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
						this.Global.wrongArr.push(this.Global.questionNum - 1);
					}
				}
			} else if (evt.target == this.img2) {
				this.img2.touchEnabled = false;
				if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
					MUSIC4.get().play("bag");
					MUSIC4.get().play("sisterLaugh");
					this.sister.animation.play("xiao", 1);
					Manager.DelayManager.get().addDelay(330, () => { this.sister.animation.play("zhanli", 0); });
					let pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
					pos = this.touch2.globalToLocal(pos.x, pos.y);
					egret.Tween.get(this.img2).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(() => {
						this.curWord.tipGroup.visible = false;
					}).wait(500).call(() => {
						this.curWord.label.visible = false;
						this.curWord.img.visible = false;
						this.setChildIndex(this.foodGroup, -1);
					}).to({ x: -9, y: 188, visible: false }).call(() => {
						MUSIC4.get().play("fly");
						egret.Tween.get(this.curWord).to({ x: this.touch2.x + 100, y: this.touch2.y + 200, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(() => {
							this.setChildIndex(this.questionGroup, -1);
							for (let i = 1; i <= 4; i++) {
								this["img" + i].filters = [];
							}
							egret.Tween.get(this.questionGroup).to({ alpha: 0 }, 300).call(() => {
								this.Global.questionNum += 1;
								this.showNextQuestion();
							});
						});
					});
				} else {
					MUSIC4.get().play("err");
					MUSIC4.get().play("sisterDoubt");
					this.sister.animation.play("yiwen", 1);
					Manager.DelayManager.get().addDelay(1670, () => { this.sister.animation.play("zhanli", 0); });
					COMMONUTILS.get().addGreenRedFilter(this.img2, false);
					this.touchChildren = true;
					Hierarchy.MenuManager.get().reback.touchEnabled = true;
					if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
						this.Global.wrongArr.push(this.Global.questionNum - 1);
					}
				}
			} else if (evt.target == this.img3) {
				this.img3.touchEnabled = false;
				if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
					MUSIC4.get().play("bag");
					MUSIC4.get().play("brotherLaugh");
					this.cangjie.animation.play("xiao", 1);
					Manager.DelayManager.get().addDelay(330, () => { this.cangjie.animation.play("zhanli", 0); });
					let pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
					pos = this.touch3.globalToLocal(pos.x, pos.y);
					egret.Tween.get(this.img3).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(() => {
						this.curWord.tipGroup.visible = false;
					}).wait(500).call(() => {
						this.curWord.label.visible = false;
						this.curWord.img.visible = false;
						this.setChildIndex(this.foodGroup, -1);
					}).to({ x: 27, y: 230, visible: false }).call(() => {
						MUSIC4.get().play("fly");
						egret.Tween.get(this.curWord).to({ x: this.touch3.x + 100, y: this.touch3.y + 120, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(() => {
							this.setChildIndex(this.questionGroup, -1);
							for (let i = 1; i <= 4; i++) {
								this["img" + i].filters = [];
							}
							egret.Tween.get(this.questionGroup).to({ alpha: 0 }, 300).call(() => {
								this.Global.questionNum += 1;
								this.showNextQuestion();
							});
						});
					});
				} else {
					MUSIC4.get().play("err");
					MUSIC4.get().play("brotherDoubt");
					this.cangjie.animation.play("yiwen", 1);
					Manager.DelayManager.get().addDelay(1670, () => { this.cangjie.animation.play("zhanli", 0); });
					COMMONUTILS.get().addGreenRedFilter(this.img3, false);
					this.touchChildren = true;
					Hierarchy.MenuManager.get().reback.touchEnabled = true;
					if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
						this.Global.wrongArr.push(this.Global.questionNum - 1);
					}
				}
			} else if (evt.target == this.img4) {
				this.img4.touchEnabled = false;
				if (evt.target.source == this.Global.questionCurArr[this.Global.questionNum - 1].p1) {
					MUSIC4.get().play("bag");
					MUSIC4.get().play("motherLaugh");
					this.mother.animation.play("xiao", 1);
					Manager.DelayManager.get().addDelay(330, () => { this.mother.animation.play("zhanli", 0); });
					let pos = new egret.Point(this.curWord.x + (this.curWord.img.x == 20 ? -169 : -31), this.curWord.y - 99.5);
					pos = this.touch4.globalToLocal(pos.x, pos.y);
					egret.Tween.get(this.img4).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1 }, 1000).call(() => {
						this.curWord.tipGroup.visible = false;
					}).wait(500).call(() => {
						this.curWord.label.visible = false;
						this.curWord.img.visible = false;
						this.setChildIndex(this.foodGroup, -1);
					}).to({ x: 15, y: 202, visible: false }).call(() => {
						MUSIC4.get().play("fly");
						egret.Tween.get(this.curWord).to({ x: this.touch4.x + 100, y: this.touch4.y + 150, scaleX: 0.2, scaleY: 0.2 }, 600).to({ alpha: 0 }).call(() => {
							this.setChildIndex(this.questionGroup, -1);
							for (let i = 1; i <= 4; i++) {
								this["img" + i].filters = [];
							}
							egret.Tween.get(this.questionGroup).to({ alpha: 0 }, 300).call(() => {
								this.Global.questionNum += 1;
								this.showNextQuestion();
							});
						});
					});
				} else {
					MUSIC4.get().play("err");
					MUSIC4.get().play("motherDoubt");
					this.mother.animation.play("yiwen", 1);
					Manager.DelayManager.get().addDelay(1670, () => { this.mother.animation.play("zhanli", 0); });
					COMMONUTILS.get().addGreenRedFilter(this.img4, false);
					this.touchChildren = true;
					Hierarchy.MenuManager.get().reback.touchEnabled = true;
					if (this.Global.wrongArr[this.Global.wrongArr.length - 1] != this.Global.questionNum - 1) {
						this.Global.wrongArr.push(this.Global.questionNum - 1);
					}
				}
			}
		}

	}
}