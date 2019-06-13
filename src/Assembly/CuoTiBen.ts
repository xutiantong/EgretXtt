module Assembly {
	export class CuoTiBen extends eui.Component implements eui.UIComponent {
		public aniGroup: eui.Group;//动画
		public rightArrow: eui.Image;//下一页
		public leftArrow: eui.Image;//上一页
		public labelWrong: eui.Label;
		public labelCorrect: eui.Label;
		public scrollerLeft: eui.Scroller;
		public scrollerRight: eui.Scroller;
		private page: number;//当前看到第几页

		private Global = Manager.GlobalManager.get();

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().addToFactory("cuotiben_ske_json", "cuotiben_tex_json", "cuotiben_tex_png");
			DRAGONBONES.getinstance().initArmature("错题本动画", "Armature");
			this.scrollerLeft.verticalScrollBar.autoVisibility = false;
			this.scrollerLeft.verticalScrollBar.visible = false;
			this.scrollerRight.verticalScrollBar.autoVisibility = false;
			this.scrollerRight.verticalScrollBar.visible = false;
		}

		init() {
			this.page = 0
			this.leftArrow.visible = false;
			this.rightArrow.visible = this.Global.wrongArr.length > 1;
			Manager.EventManager.get().addListener("CuoTiBen", this.leftArrow, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji");
				this.page -= 1;
				this.leftArrow.visible = this.page > 0;
				this.rightArrow.visible = this.page < this.Global.wrongArr.length - 1;
				this.scrollerLeft.viewport.scrollV = 0;
				this.scrollerRight.viewport.scrollV = 0;
				this.showCuoTi();
			}, this);
			Manager.EventManager.get().addListener("CuoTiBen", this.rightArrow, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji");
				this.page += 1;
				this.leftArrow.visible = this.page > 0;
				this.rightArrow.visible = this.page < this.Global.wrongArr.length - 1;
				this.scrollerLeft.viewport.scrollV = 0;
				this.scrollerRight.viewport.scrollV = 0;
				this.showCuoTi();
			}, this);
			this.showCuoTi();
			this.scrollerRight.y = -400;
			this.scrollerLeft.y = -400;
			this.scrollerRight.alpha = 0;
			this.scrollerLeft.alpha = 0;
			egret.Tween.get(this.scrollerRight).to({ y: 362, alpha: 1 }, 800, egret.Ease.backInOut);
			egret.Tween.get(this.scrollerLeft).to({ y: 362, alpha: 1 }, 800, egret.Ease.backInOut);
			DRAGONBONES.getinstance().playAnimation("错题本动画", "newAnimation", "a", this.aniGroup, 1, 1, 1, 1);
		}

		private showCuoTi() {
			let question = this.Global.questionCurArr[this.Global.wrongArr[this.page].id - 1]
			let textCorrect: string = "       ";
			for (let i = 1; i <= 6; i++) {
				if (question[String(i)] != null) {
					textCorrect += question[String(i)];
				}
			}
			let textWrong: string = "       ";
			for (let j = 0; j < this.Global.wrongArr[this.page].answer.length; j++) {
				textWrong += this.Global.wrongArr[this.page].answer[j];
			}
			let correctText: string = this.fixText(textCorrect);
			let wrongText: string = this.fixText(textWrong);

			this.labelWrong.text = wrongText;
			this.labelCorrect.text = correctText;
			this.labelCorrect.wordWrap = true;
			this.labelWrong.wordWrap = true;
		}

		private fixText(text: string) {
			let length = text.length;
			let fixText = "";
			let pos = 15;
			while (length >= pos) {
				let str = text.substr(pos, 1);
				if (str == "”" && text.substr(pos - 2, 1) == "“") {
					fixText += text.slice(0, pos - 2) + "\n";
					text = text.slice(pos - 2);
					pos = 10;
				} else if ((str == "，" || str == "。") && text.substr(pos - 1, 1) == "”" && text.substr(pos - 3, 1) == "“") {
					fixText += text.slice(0, pos - 3) + "\n";
					text = text.slice(pos - 3);
					pos = 10;
				} else if ((str == "，" || str == "。") && text.substr(pos - 1, 1) == "”") {
					fixText += text.slice(0, pos - 2);
					text = text.slice(pos - 2);
					pos = 10;
				} else if (text.substr(pos - 1, 1) == "“") {
					fixText += text.slice(0, pos - 1) + "\n";
					text = text.slice(pos - 1);
					pos = 10;
				} else {
					pos += 10;
				}
			}
			fixText += text;
			return fixText;
		}
	}
}