module Assembly {
	/**
	 * 挑战结束组件
	 */
	export class End extends eui.Component implements eui.UIComponent {

		public aniGroup: eui.Group;//挑战结束动画
		public contentGroup: eui.Group;//放结果元件
		public restart: eui.Image;//再玩一次
		public cuotiben: eui.Image;//错题本
		public label: eui.Label;
		private end: dragonBones.EgretArmatureDisplay;

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getInstance().addToFactory("tiaozhanwancheng_ske_json", "tiaozhanwancheng_tex_json", "tiaozhanwancheng_tex_png")
			this.end = DRAGONBONES.getInstance().initArmature("挑战结束动画", "tiaozhanwancheng1")
		}

		init() {
			egret.Tween.get(this.cuotiben, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).
				to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 })
				.to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).wait(3000)
			MUSIC4.get().play("success");
			DRAGONBONES.getInstance().playAnimation("挑战结束动画", "tiaozhanwancheng_kuai", this.aniGroup, 1, 1, 1, 1);
			this.cuotiben.visible = false;
			if (Manager.GlobalManager.get().wrongArr.length > 0) {
				this.cuotiben.visible = true;
			}

			//添加对错
			this.label.textFlow = (new egret.HtmlTextParser).parser("完成<font color='#f45110'>" + (9 - Manager.GlobalManager.get().wrongArr.length) + "</font>个食物分类");
			this.end.armature.getSlot("wenzi").displayList = [this.contentGroup];
			// this.contentGroup.alpha = 0;
			// this.contentGroup.scaleX = 0;
			// this.contentGroup.scaleY = 0;
			// egret.Tween.get(this.contentGroup).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backInOut);
			//点击再来一次
			Manager.EventManager.get().addListener("End", this.restart, egret.TouchEvent.TOUCH_TAP, () => {
				//点击重置
				MUSIC4.get().play("dianji");
				MUSIC4.get().pauseLast()
				MUSIC4.get().play("bg", -1);
				Manager.DelayManager.get().removeAllDelay();
				Manager.GlobalManager.get().restart();
				Manager.EventManager.get().removeAllListener();
				Hierarchy.AbManager.get().show("Start")
				Hierarchy.MenuManager.get().music.selected = false
				Hierarchy.MenuManager.get().init();

			}, this);
			//点击错题本
			Manager.EventManager.get().addListener("End", this.cuotiben, egret.TouchEvent.TOUCH_TAP, () => {
				Hierarchy.AbManager.get().show("ErrBook");
				MUSIC4.get().play("dianji")
			}, this);
		}

	}
}