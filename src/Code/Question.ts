class Question extends eui.Component implements eui.UIComponent {

	public label: eui.Label;
	public markGroup1: eui.Group;
	public markGroup2: eui.Group;
	public aniGroup1: eui.Group;
	public aniGroup2: eui.Group;
	public Group1: eui.Group;
	public Group2: eui.Group;
	public img1: eui.Image;
	public img2: eui.Image;

	questionCfg: any;//题目配置
	questionArr: Array<Object> = new Array<Object>()//所有题目数据
	questionCurArr: Array<Object> = new Array<Object>()//当前题目数据
	questionNum: number = -1;//当前题号
	questionWrongNum: number = 0;
	curAnswer: string//当前正确答案
	fontsize: number = 60;//字号大小
	chanzi: dragonBones.EgretArmatureDisplay;
	chanziTouch: boolean = true;
	canTouch1: boolean = false;
	canTouch2: boolean = false;
	finish1: boolean = false;
	finish2: boolean = false;
	need: boolean = false;
	touchX: number;
	touchY: number;
	canErr: boolean = true;
	canCorr: boolean = true;
	canAdd: boolean = true;

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.questionCfg = RES.getRes("center_json");
		for (let i = 0; i < 10; i++) {
			this.questionArr.push(this.questionCfg[i])
		}
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
		this.Group1.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveGroup.bind(this, 1), this);
		this.Group2.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveGroup.bind(this, 2), this);
		GlobalManager.getInstance().dg.addToFactory("shatan_ske_json", "shatan_tex_json", "shatan_tex_png");
		this.chanzi = GlobalManager.getInstance().dg.initArmatureDisplay("chanzi", "chanzi");
		GlobalManager.getInstance().dg.playAnimation("chanzi", "newAnimation", this);
		this.chanzi.visible = false;
		// this.chanzi.scaleX = -1;
		this.generateQuestion();
		this.showNextAniIn();
	}

	private generateQuestion() {
		this.questionNum = -1;
		this.questionCurArr = [];
		this.questionCurArr = GlobalManager.getInstance().suiji(this.questionArr, 6);
	}

	private initTouchArea() {
		var dd = this.label.$renderNode.drawData;
		var count = 1;
		for (let i = 0; i < dd.length; i++) {
			if (dd[Number(i)]["href"] == "event:click") {
				var ww = dd[Number(i) - 1].length * 60;
				this["img" + count].width = ww;
				this["Group" + count].x = dd[Number(i) - 3] + this.label.x;
				this["Group" + count].y = dd[Number(i) - 2] + this.label.y - 45;
				this["Group" + count].width = ww;
				if (count == 2) { this.need = true; }
				count++;
			}
		}
	}

	private touchBegin(evt: egret.TouchEvent) {
		if (this.chanziTouch) {
			this.chanzi.visible = true;
			this.chanzi.x = evt.stageX;
			this.chanzi.y = evt.stageY;
			this.canErr = true;
			this.canCorr = true;
			this.touchX = evt.stageX;
			this.touchY = evt.stageY;
		}

		var distanceX1 = Math.abs(evt.stageX - this.Group1.x - this.Group1.width / 2);
		var distanceY1 = Math.abs(evt.stageY - this.Group1.y - this.Group1.height / 2);
		this.canTouch1 = (distanceX1 <= this.Group1.width / 2 + 2 * this.fontsize) && (distanceY1 <= this.Group1.height / 2 + this.fontsize);

		var distanceX2 = Math.abs(evt.stageX - this.Group2.x - this.Group2.width / 2);
		var distanceY2 = Math.abs(evt.stageY - this.Group2.y - this.Group2.height / 2);
		this.canTouch2 = (distanceX2 <= this.Group2.width / 2 + 2 * this.fontsize) && (distanceY2 <= this.Group2.height / 2 + this.fontsize);
	}

	private touchMove(evt: egret.TouchEvent) {
		if (this.chanziTouch) {
			this.chanzi.visible = true;
			this.chanzi.x = evt.stageX;
			this.chanzi.y = evt.stageY;
		}
		var point1 = new egret.Point(evt.stageX, evt.stageY);
		var point2 = new egret.Point(this.touchX, this.touchY);
		var distance = egret.Point.distance(point1, point2);
		if (this.canErr && distance >= 2 * this.fontsize) {
			this.canErr = false;
			GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.err_sound);
			if (this.canAdd) {
				this.canAdd = false;
				this.questionWrongNum += 1;
			}
		}
	}

	private touchEnd(evt: egret.TouchEvent) {
		if (this.chanziTouch) {
			this.chanzi.visible = false;
			this.chanzi.x = evt.stageX;
			this.chanzi.y = evt.stageY;
		}
	}

	private touchMoveGroup(num: number, evt: egret.TouchEvent) {
		this.canErr = false;
		if (this.canTouch1 && num == 1) {
			if (this.canCorr) {
				GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.finish_sound);
				this.canCorr = false;
			}
			var width = evt.stageX - this.Group1.x;
			if (width < this.markGroup1.width + 2 * this.fontsize) {
				this.markGroup1.width = width > this.markGroup1.width ? width : this.markGroup1.width;
				if (this.markGroup1.width >= this.Group1.width - 45) {
					this.markGroup1.width = this.Group1.width;
					this.finish1 = true;
				}
			}
		}
		if (this.canTouch2 && num == 2 && this.need) {
			if (this.canCorr) {
				GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.finish_sound);
				this.canCorr = false;
			}
			var width = evt.stageX - this.Group2.x;
			if (width < this.markGroup2.width + 2 * this.fontsize) {
				this.markGroup2.width = width > this.markGroup2.width ? width : this.markGroup2.width;
				if (this.markGroup2.width >= this.Group2.width - 45) {
					this.markGroup2.width = this.Group2.width
					this.finish2 = true;
				}
			}
		}
		if (this.finish1 && (this.need ? this.finish2 : true)) {
			var itemNum1 = Math.round((this.Group1.width - 30) / 150);
			var itemNum2 = Math.round((this.Group2.width - 30) / 150);
			for (let i = 1; i <= itemNum1 + itemNum2; i++) {
				var item: Item = new Item(GlobalManager.getInstance().getsuiji(1, 4), i);
				if (i <= itemNum1) {
					this.aniGroup1.addChild(item);
					item.x = (i - 1) * item.width + i * 30 + 40;
					item.y = this.Group1.height / 2;
				} else {
					if (this.need) {
						this.aniGroup2.addChild(item);
						item.x = (i - itemNum1 - 1) * item.width + (i - itemNum1) * 30 + 40;
						item.y = this.Group2.height / 2;
					}
				}
			}
			this.showNextAniOut();
		}
	}

	showNextAniIn() {
		egret.Tween.get(this.label).call(() => { this.showNextQuestion() }).to({ alpha: 1 }, 500).
			call(() => {
				this.touchChildren = true;
				GlobalManager.getInstance().mainscene.system.mains.touchEnabled = true;
				this.chanziTouch = true;
				this.canAdd = true;
			});
	}

	showNextAniOut() {
		this.canErr = false;
		this.touchChildren = false;
		this.chanziTouch = false;
		this.chanzi.visible = false;
		egret.Tween.get(this.label).wait(3000).call(() => {
			this.need = false;
			this.finish1 = false;
			this.finish2 = false;
			this.markGroup1.width = 0;
			this.markGroup2.width = 0;
			this.aniGroup1.removeChildren();
			this.aniGroup2.removeChildren();
			GlobalManager.getInstance().mainscene.showWave();
		}).to({ alpha: 0 }, 300);
	}

	showNextQuestion() {
		this.questionNum += 1;
		if (this.questionNum == 6) {
			GlobalManager.getInstance().mainscene.showSuccess();
		} else {
			var question: string = "        ";
			for (let i = 1; i <= 5; i++) {
				if (this.questionCurArr[this.questionNum]["sentence" + i] != null) {
					if (i == this.questionCurArr[this.questionNum]["correct"]) {
						this.curAnswer = this.questionCurArr[this.questionNum]["sentence" + i];
						question += "<a href = 'event:click'>" + this.curAnswer + "</a>";
					} else {
						question += this.questionCurArr[this.questionNum]["sentence" + i];
					}
				} else {
					break;
				}
			}
			this.questionCurArr["txt"] = question;
			this.label.textFlow = (new egret.HtmlTextParser).parser(question);
			egret.Tween.get(this).wait(500).call(() => { this.initTouchArea() });
		}
	}

	restart() {
		egret.Tween.removeTweens(this.label);
		this.need = false;
		this.finish1 = false;
		this.finish2 = false;
		this.chanziTouch = true;
		this.chanzi.visible = false;
		this.markGroup1.width = 0;
		this.markGroup2.width = 0;
		this.aniGroup1.removeChildren();
		this.aniGroup2.removeChildren();
		this.label.alpha = 0;
		this.questionWrongNum = 0;
		this.generateQuestion();
		this.showNextAniIn();
	}
}