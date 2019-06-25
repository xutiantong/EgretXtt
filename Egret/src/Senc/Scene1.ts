module Assembly {
	/**
	 * 场景1
	 */
	export class Scene1 extends eui.Component implements eui.UIComponent {

		public aniGroup: eui.Group;//背景动画层
		public questionGroup: eui.Group;//题目层
		public confirm: eui.Image;
		public basket: eui.Group;
		private questionCfg: Array<any> = []; //题目配置
		private pan: dragonBones.EgretArmatureDisplay;
		private startPoint = { x: 0, y: 0 };
		private moveAnswer: string = "";
		private answer = [];
		private answerPos = [{ x: 1460, y: 190 }, { x: 1460, y: 325 }, { x: 1460, y: 460 }, { x: 1460, y: 590 }, { x: 1460, y: 725 }, { x: 1460, y: 855 }];
		private result = ["", "", "", "", "", ""];

		private Global = Manager.GlobalManager.get();

		public constructor() {
			super();
		}
		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.pan = DRAGONBONES.getinstance().initArmature("烤盘", "shouzhua");
			this.aniGroup.addChild(this.pan);
			this.initCfg();
		}

		init() {
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
		}

		private initCfg() {
			let config = RES.getRes("ti_json");
			for (let i = 0; i < 11; i++) {
				this.questionCfg.push(config[i]);
			}
		}

		private generateQuestion() {
			let questionCurArr = [];
			questionCurArr = COMMONUTILS.get().suiji(this.questionCfg, 6);
			questionCurArr = COMMONUTILS.get().suijishunxubyarr(questionCurArr);
			this.Global.questionCurArr = questionCurArr;
		}

		private showNextQuestion() {
			this.touchChildren = false;
			Hierarchy.MenuManager.get().reback.touchEnabled = false;
			if (this.Global.questionNum == 7) {
				egret.Tween.get(this.basket).to({ y: 0 }, 1000, egret.Ease.quadOut).call(() => {
					MUSIC4.get().play("finish");
				}).wait(3500).call(() => {
					Hierarchy.AbManager.get().show("End");
					Hierarchy.MenuManager.get().reback.touchEnabled = true;
					this.touchChildren = true;
					console.log("over");
				});
				return;
			}
			this.answer = [];
			for (let i = 1; i <= 6; i++) {
				if (this.Global.questionCurArr[this.Global.questionNum - 1][i] != null) {
					this.answer.push(this.Global.questionCurArr[this.Global.questionNum - 1][i]);
				}
			}
			this.answer = COMMONUTILS.get().suijishunxubyarr(this.answer);
			for (let j = 0; j <= this.answer.length - 1; j++) {
				let bread = new Bread(this.answer[String(j)]);
				this.questionGroup.addChild(bread);
				bread.x = 450;
				bread.y = 150 + (j) * 155;
				bread.rotation = COMMONUTILS.get().getsuiji(-5, 5);
			}
			this.pan.animation.gotoAndStopByFrame("in", 0);
			egret.Tween.get(this.questionGroup).to({ alpha: 1 }, 1000);
			egret.Tween.get(this.pan).to({ y: 350 }, 1000, egret.Ease.circOut).call(() => {
				this.touchChildren = true;
				Hierarchy.MenuManager.get().reback.touchEnabled = true;
				this.pan.animation.play("in", 1)
			});
		}

		private showQuestionOut() {
			this.touchChildren = false;
			Hierarchy.MenuManager.get().reback.touchEnabled = false;
			this.pan.animation.play("out", 1);
			egret.Tween.get(this.questionGroup).wait(250).to({ x: 1100 }, 1300, egret.Ease.circOut);
			egret.Tween.get(this.pan).wait(250).to({ x: 2440 }, 1330, egret.Ease.circOut).call(() => {
				this.questionGroup.x = 0;
				this.questionGroup.alpha = 0;
				this.questionGroup.removeChildren();
				this.pan.x = 1400;
				this.pan.y = 1500;
				this.result = ["", "", "", "", "", ""];
				this.showNextQuestion();
			});
		}

		private onClickConfirm() {
			this.confirm.touchEnabled = false;
			egret.Tween.get(this.confirm).call(() => {
				let correct = true
				for (let i = 1; i <= this.answer.length; i++) {
					if (this.Global.questionCurArr[this.Global.questionNum - 1][i] != this.result[i - 1]) {
						this.Global.wrongArr.push({ id: this.Global.questionNum, answer: this.result });
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
			}).to({ y: 1100 }, 500, egret.Ease.circOut).call(() => {
				this.Global.questionNum += 1;
				this.showQuestionOut();
				this.confirm.touchEnabled = true;
			});
		}

		private onTouchBegin(evt: egret.TouchEvent) {
			for (let i = 0; i < this.questionGroup.numChildren; i++) {
				if (Math.abs(evt.stageX - this.questionGroup.getChildAt(i).x) <= 420 && Math.abs(evt.stageY - this.questionGroup.getChildAt(i).y) <= 75) {
					this.startPoint.x = this.questionGroup.getChildAt(i).x;
					this.startPoint.y = this.questionGroup.getChildAt(i).y;
					this.moveAnswer = this.questionGroup.getChildAt(i).name;
					this.questionGroup.setChildIndex(this.questionGroup.getChildAt(i), -2);
				}
			}
		}

		private onTouchMove(evt: egret.TouchEvent) {
			for (let i = 0; i < this.questionGroup.numChildren; i++) {
				if (this.moveAnswer == this.questionGroup.getChildAt(i).name) {
					this.questionGroup.getChildAt(i).x = evt.stageX;
					this.questionGroup.getChildAt(i).y = evt.stageY;
					break;
				}
			}
		}

		private onTouchEnd(evt: egret.TouchEvent) {
			for (let i = 0; i < this.questionGroup.numChildren; i++) {
				if (this.moveAnswer == this.questionGroup.getChildAt(i).name) {
					for (let j = 0; j < this.answer.length; j++) {
						if (Math.abs(evt.stageX - this.answerPos[j].x) <= 420 && Math.abs(evt.stageY - this.answerPos[j].y) <= 75) {
							if (this.result[j] == "") {
								this.result.forEach((v, index) => {
									if (v == this.moveAnswer) {
										this.result[index] = "";
									}
								});
								this.result[j] = this.moveAnswer;
								this.questionGroup.getChildAt(i).x = this.answerPos[j].x;
								this.questionGroup.getChildAt(i).y = this.answerPos[j].y;
								this.questionGroup.getChildAt(i).rotation = 0;
								this.moveAnswer = "";
								this.checkShowConfirm();
								return;
							} else {
								if (this.startPoint.x < 500) {
									this.questionGroup.getChildAt(i).x = this.startPoint.x;
									this.questionGroup.getChildAt(i).y = this.startPoint.y;
									this.moveAnswer = "";
									return;
								}
								let tmp = this.result[j];
								this.result.forEach((v, index) => {
									if (v == this.moveAnswer) {
										this.result[index] = tmp;
										for (let k = 0; k < this.questionGroup.numChildren; k++) {
											if (tmp == this.questionGroup.getChildAt(k).name) {
												this.questionGroup.getChildAt(k).x = this.startPoint.x;
												this.questionGroup.getChildAt(k).y = this.startPoint.y;
											}
										}
									}
								});
								this.result[j] = this.moveAnswer;
								this.questionGroup.getChildAt(i).x = this.answerPos[j].x;
								this.questionGroup.getChildAt(i).y = this.answerPos[j].y;
								this.moveAnswer = "";
								this.checkShowConfirm();
								return;
							}
						}
					}
					this.questionGroup.getChildAt(i).x = this.startPoint.x;
					this.questionGroup.getChildAt(i).y = this.startPoint.y;
					this.moveAnswer = "";
					this.checkShowConfirm();
					return;
				}
			}
		}

		private checkShowConfirm() {
			let show = true;
			for (let i = 0; i < this.answer.length; i++) {
				if (this.result[i] == "") {
					show = false;
				}
			}
			if (show) {
				egret.Tween.get(this.confirm).to({ y: 835 }, 500, egret.Ease.circOut);
			}
		}

	}
}