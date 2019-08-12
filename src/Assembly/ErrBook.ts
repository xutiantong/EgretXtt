module Assembly {
	/**
	 * 错题本
	 */
	export class ErrBook extends eui.Component implements eui.UIComponent {

		public aniGroup: eui.Group; //动画层
		public leftArrow: eui.Image; //上一页
		public rightArrow: eui.Image; //下一页
		public contentGroup: eui.Group; //内容
		public answer1: eui.Label;
		public answer2: eui.Label;
		public answer3: eui.Label;
		public correct1: eui.Label;
		public correct2: eui.Label;
		public correct3: eui.Label;
		public arrow2: eui.Image;
		public arrow3: eui.Image;
		private page: number; //当前看到第几页
		private wrongArr = [];

		private Global = Manager.GlobalManager.get();

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getInstance().addToFactory("cuotiben_ske_json", "cuotiben_tex_json", "cuotiben_tex_png");
			DRAGONBONES.getInstance().initArmature("错题本动画", "cuotiben");
		}

		init() {
			Hierarchy.AbManager.get().hide("End");
			this.Global.wrongArr.forEach((v) => {
				if (this.wrongArr.length == 0 || this.wrongArr[this.wrongArr.length - 1].length == 3) {
					this.wrongArr.push([v]);
				} else {
					this.wrongArr[this.wrongArr.length - 1].push(v);
				}
			});
			this.page = 0;
			this.leftArrow.visible = false;
			this.rightArrow.visible = this.wrongArr.length > 1;
			Manager.EventManager.get().addListener("CuoTiBen", this.leftArrow, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji");
				this.page -= 1;
				this.leftArrow.visible = this.page > 0;
				this.rightArrow.visible = this.page < this.wrongArr.length - 1;
				this.showCuoTi();
			}, this);
			Manager.EventManager.get().addListener("CuoTiBen", this.rightArrow, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji");
				this.page += 1;
				this.leftArrow.visible = this.page > 0;
				this.rightArrow.visible = this.page < this.wrongArr.length - 1;
				this.showCuoTi();
			}, this);
			this.showCuoTi();
			this.contentGroup.scaleX = 0;
			this.contentGroup.scaleY = 0;
			egret.Tween.get(this.contentGroup).to({ scaleX: 1, scaleY: 1 }, 600, egret.Ease.backInOut);
			DRAGONBONES.getInstance().playAnimation("错题本动画", "shengli", this.aniGroup, 1, 1, 1, 1, 0, -120);
		}

		private showCuoTi() {
			let question1 = this.Global.questionCurArr[this.wrongArr[this.page][0]];
			this.answer1.text = question1.question.replace("()", "_");
			this.correct1.text = COMMONUTILS.get().replacePos(question1.question, (question1.mark == 1 ? 0 : 1), (question1.mark == 1 ? 3 : 4), question1.correct);
			if (this.wrongArr[this.page].length > 1) {
				this.arrow2.visible = true;
				let question2 = this.Global.questionCurArr[this.wrongArr[this.page][1]];
				this.answer2.text = question2.question.replace("()", "_");
				this.correct2.text = COMMONUTILS.get().replacePos(question2.question, (question2.mark == 1 ? 0 : 1), (question2.mark == 1 ? 3 : 4), question2.correct);
			} else {
				this.answer2.text = "";
				this.correct2.text = "";
				this.arrow2.visible = false;
			}
			if (this.wrongArr[this.page].length > 2) {
				this.arrow3.visible = true;
				let question3 = this.Global.questionCurArr[this.wrongArr[this.page][2]];
				this.answer3.text = question3.question.replace("()", "_");
				this.correct3.text = COMMONUTILS.get().replacePos(question3.question, (question3.mark == 1 ? 0 : 1), (question3.mark == 1 ? 3 : 4), question3.correct);
			} else {
				this.arrow3.visible = false;
				this.answer3.text = "";
				this.correct3.text = "";
			}
		}

	}
}