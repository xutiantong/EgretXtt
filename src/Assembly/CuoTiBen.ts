module Assembly {
	export class CuoTiBen extends eui.Component implements eui.UIComponent {

		public aniGroup: eui.Group;
		public contentGroup: eui.Group;
		public restart: eui.Image;

		private Global = Manager.GlobalManager.get();

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().addToFactory("taiozhanjieshu_ske_json", "taiozhanjieshu_tex_json", "taiozhanjieshu_tex_png");
			DRAGONBONES.getinstance().initArmature("错题本", "tiaozhanjieshu");
		}

		init() {
			Manager.EventManager.get().addListener("CuoTiBen", this.restart, egret.TouchEvent.TOUCH_TAP, () => {
				//点击重置
				MUSIC4.get().play("dianji");
				MUSIC4.get().pauseLast()
				MUSIC4.get().play("bg", -1)
				Manager.DelayManager.get().removeAllDelay();
				this.Global.restart();
				Manager.EventManager.get().removeAllListener();
				Hierarchy.AbManager.get().show("Start")
				Hierarchy.MenuManager.get().music.selected = false
				this.init()
			}, this);
			this.contentGroup.removeChildren();
			this.contentGroup.alpha = 0;
			DRAGONBONES.getinstance().playAnimation("错题本", "shengli", "a", this.aniGroup, 1);
			for (let i = 0; i < 10; i++) {
				let correct = true;
				this.Global.wrongArr.forEach((v, j) => {
					if (v == i) {
						this.Global.wrongArr.splice(j, 1);
						correct = false;
					}
				});
				let word = this.Global.questionCurArr[i].zimu.substring(0, this.Global.questionCurArr[i].zimu.length - 1) +
					COMMONUTILS.get().getPinyin(this.Global.questionCurArr[i].zimu.substr(-1, 1), this.Global.questionCurArr[i].shengdiao);
				var cell = new CuoTiBenCell(word, correct);
				this.contentGroup.addChild(cell);
				this.contentGroup.scaleX = 1.2;
				this.contentGroup.scaleY = 1.2;
			}
			egret.Tween.get(this.contentGroup).wait(500).to({ alpha: 1 }, 500, egret.Ease.backInOut);
		}
	}
}