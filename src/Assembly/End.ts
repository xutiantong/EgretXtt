module Assembly {
	/**
	 * 挑战结束组件
	 */
	export class End extends eui.Component implements eui.UIComponent {

		aniGroup: eui.Group;//挑战结束动画
		contentGroup: eui.Group;//放结果元件
		restart: eui.Image;//再玩一次
		btnWord: eui.Image;//卡库


		private end: dragonBones.EgretArmatureDisplay;
		private Global = Manager.GlobalManager.get()
		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getInstance().addToFactory("tiaozhanwancheng_ch_ske_json", "tiaozhanwancheng_ch_tex_json", "tiaozhanwancheng_ch_tex_png");
			this.end = DRAGONBONES.getInstance().initArmature("结束", "tiaozhanwancheng");
			this.aniGroup.addChild(this.end);
		}

		init() {
			egret.Tween.get(this.btnWord, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).
				to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 })
				.to({ scaleX: 1.2, scaleY: 1.2 }, 250, egret.Ease.sineOut).to({ scaleX: 1, scaleY: 1 }).wait(3000)
			this.end.animation.play("in", 1);
			this.btnWord.visible = this.Global.wrongArr.length > 0;
			MUSIC4.get().play("show", 1);

			//点击再来一次
			Manager.EventManager.get().addListener("End", this.restart, egret.TouchEvent.TOUCH_TAP, () => {
				//点击重置
				MUSIC4.get().play("dianji");
				MUSIC4.get().pauseLast();
				MUSIC4.get().play("bg", -1);
				Manager.DelayManager.get().removeAllDelay();
				Manager.GlobalManager.get().restart();
				Manager.EventManager.get().removeAllListener();
				Hierarchy.AbManager.get().hide("End");

				Hierarchy.AbManager.get().show("Start");
				Hierarchy.MenuManager.get().music.selected = false;
				Hierarchy.MenuManager.get().init();

			}, this);
			//点击卡库按钮
			Manager.EventManager.get().addListener("End", this.btnWord, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji");

				Hierarchy.AbManager.get().hide("End");
				Hierarchy.AbManager.get().show("ErrBook");
			}, this);
		}

	}
}