
module Assembly {
	/**
	 * 场景1
	 */
	export class Scene1 extends eui.Component implements eui.UIComponent {
		public bgGroup: eui.Group;
		public questionGroup: eui.Group;
		public answerGroup: eui.Group;

		public num: number;
		private finishList = [0, 0, 0];
		private questionCfg: Array<any> = [[[], [], []], [[], [], []]];
		private curQuestion: Array<any>;
		private curNum: number;
		private questionNum: number;
		private posList = [[{ x: 480, y: 700 }, { x: 960, y: 500 }, { x: 1380, y: 600 }], [{ x: 300, y: 480 }, { x: 940, y: 380 }, { x: 1530, y: 700 }]];
		private roundList = [["使途名篇", "半官半隐", "远离俗世"], ["少年悠游", "结识李白", "科考失败"]];
		private Global = Manager.GlobalManager.get();

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getInstance().addToFactory("shanshui_ske_json", "shanshui_tex_json", "shanshui_tex_png");
			DRAGONBONES.getInstance().addToFactory("tianyuan_menghaoran_ske_json", "tianyuan_menghaoran_tex_json", "tianyuan_menghaoran_tex_png");
			DRAGONBONES.getInstance().initArmature("王维背景", "shanshui_wangwei", "newAnimation", 0, this.bgGroup);
			DRAGONBONES.getInstance().initArmature("孟浩然背景", "tianyuan_menghaoran", "newAnimation", 0, this.bgGroup);
			DRAGONBONES.getInstance().initArmature("题版", "tiban", "newAnimation", 1, this.questionGroup, 960, 1180);
			DRAGONBONES.getInstance().getarmature("题版").armature.getSlot("timuzi").displayList = [this.answerGroup];
			this.initConfig();
		}

		private initConfig() {
			let config = RES.getRes("ti_json");
			for (let i = 0; i < 48; i++) {
				this.questionCfg[(config[i].name == "王维" ? 0 : 1)][parseInt(config[i].node) - 1].push(config[i]);
			}
		}

		init() {
			MUSIC4.get().play("bird", 0);
			MUSIC4.get().play("tips2");
			this.generateQuestion();
			this.touchChildren = true;
			this.questionGroup.visible = false;
			this.finishList = [0, 0, 0];
			DRAGONBONES.getInstance().getarmature("王维背景").visible = this.num == 0;
			DRAGONBONES.getInstance().getarmature("孟浩然背景").visible = this.num == 1;
			for (let i = 0; i < 3; i++) {
				DRAGONBONES.getInstance().initArmature("按钮" + i, "anniu", "normal", 0, this.bgGroup, this.posList[this.num][i].x, this.posList[this.num][i].y);
				let label = new eui.Label(this.roundList[this.num][i]);
				label.size = 40;
				label.fontFamily = "z2";
				label.textColor = 0x73b2b1;
				label.width = 36;
				label.height = 163;
				label.anchorOffsetX = 22;
				label.anchorOffsetY = 81.5;
				DRAGONBONES.getInstance().getarmature("按钮" + i).armature.getSlot("anniu_zi").displayList = [label];
				Manager.EventManager.get().addListener("Scene1", label, egret.TouchEvent.TOUCH_TAP, () => {
					DRAGONBONES.getInstance().getarmature("按钮" + i).animation.play("click", 1);
					MUSIC4.get().play("dianji");
					egret.Tween.get(label).wait(1000).call(() => {
						this.showQuestion(i);
					});
				}, this);
			}
			for (let i = 1; i <= 4; i++) {
				Manager.EventManager.get().addListener("Scene1", this["g" + i], egret.TouchEvent.TOUCH_TAP, this.onClick.bind(this, i), this);
			}
		}

		private generateQuestion() {
			this.curQuestion = [[], [], []];
			if (this.num == 0) {
				this.curQuestion[0].push(this.questionCfg[0][0][COMMONUTILS.getRandomNum(0, 1)]);
				this.curQuestion[1].push(this.questionCfg[0][1][COMMONUTILS.getRandomNum(0, 3)]);
				this.curQuestion[1].push(this.questionCfg[0][1][COMMONUTILS.getRandomNum(4, 7)]);
				this.curQuestion[1].push(this.questionCfg[0][1][COMMONUTILS.getRandomNum(8, 9)]);
				this.curQuestion[2].push(this.questionCfg[0][2][COMMONUTILS.getRandomNum(0, 3)]);
				this.curQuestion[2].push(this.questionCfg[0][2][COMMONUTILS.getRandomNum(4, 5)]);
				this.curQuestion[2].push(this.questionCfg[0][2][COMMONUTILS.getRandomNum(6, 7)]);
			} else {
				this.curQuestion[0].push(this.questionCfg[1][0][COMMONUTILS.getRandomNum(0, 1)]);
				this.curQuestion[0].push(this.questionCfg[1][0][COMMONUTILS.getRandomNum(2, 9)]);
				this.curQuestion[0].push(this.questionCfg[1][0][COMMONUTILS.getRandomNum(10, 13)]);
				this.curQuestion[1].push(this.questionCfg[1][1][1]);
				this.curQuestion[2].push(this.questionCfg[1][2][COMMONUTILS.getRandomNum(0, 3)]);
				this.curQuestion[2].push(this.questionCfg[1][2][COMMONUTILS.getRandomNum(4, 7)]);
				this.curQuestion[2].push(this.questionCfg[1][2][COMMONUTILS.getRandomNum(8, 9)]);
				this.curQuestion[2].push(this.questionCfg[1][2][COMMONUTILS.getRandomNum(10, 11)]);
			}
		}

		private showQuestion(num: number) {
			this.curNum = num;
			this.finishList[num] = 1;
			this.questionNum = 0;
			this.questionGroup.visible = true;
			DRAGONBONES.getInstance().getarmature("题版").animation.play("newAnimation", 1);
			this.showNextQuestion();
		}

		private showNextQuestion() {
			if (this.questionNum == this.curQuestion[this.curNum].length) {
				this.questionGroup.visible = false;
				if (this.finishList.indexOf(0) < 0) {
					Hierarchy.AbManager.get().show("End");
				}
				this.touchChildren = true;
				return;
			}
			const data = this.curQuestion[this.curNum][this.questionNum];
			COMMONUTILS.generateText(this["title"], data.question, { fontSize: 60, fontFamily: "z2", textColor: 0x492227, lineSpacing: 15, stroke: 0, strokeColor: 0xffffff }, 10, { pSize: 40, textColor: 0x000000, stroke: 0, strokeColor: 0xffffff }, true, false);
			let arr = COMMONUTILS.randomArrOrder([data.a1, data.a2, data.a3, data.a4]);
			for (let i = 1; i <= 4; i++) {
				this["l" + i].text = arr[i - 1];
				this["g" + i].name = arr[i - 1];
			}
			this.touchChildren = true;
		}

		private onClick(num: number) {
			this.touchChildren = false;
			if (this["g" + num].name == this.curQuestion[this.curNum][this.questionNum].a1) {
				egret.Tween.get(this["g" + num]).to({ scaleX: 1.1, scaleY: 1.1 }, 150).to({ scaleX: 1, scaleY: 1 }, 150);
				MUSIC4.get().play("right");
				if (this.curQuestion[this.curNum][this.questionNum].type == 2) {
					COMMONUTILS.generateText(this["title"], this.curQuestion[this.curNum][this.questionNum].question.replace("（）", "<" + this.curQuestion[this.curNum][this.questionNum].a1 + ">"), { fontSize: 60, fontFamily: "z2", textColor: 0x492227, lineSpacing: 15, stroke: 0, strokeColor: 0xffffff }, 10, { pSize: 40, textColor: 0x000000, stroke: 0, strokeColor: 0xffffff }, true, false);
				}
				egret.Tween.get(this).wait(500).call(() => {
					this.questionNum++;
					this.showNextQuestion();
				});
			} else {
				MUSIC4.get().play("wrong");
				COMMONUTILS.addFilter(this["g" + num], 0xcc3300, 0.8);
				egret.Tween.get(this["g" + num]).to({ scaleX: 1.1, scaleY: 1.1 }, 150).to({ scaleX: 1, scaleY: 1 }, 150).call(() => {
					this["g" + num].filters = [];
				});
				if (this.Global.wrongArr.indexOf(this.curQuestion[this.curNum][this.questionNum].id) < 0) {
					this.Global.wrongArr.push(this.curQuestion[this.curNum][this.questionNum].id);
				}
				this.touchChildren = true;
			}
		}

	}
}