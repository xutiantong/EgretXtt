module Assembly {
	/**
	 * 卡库
	 */
	export class CardScene extends eui.Component implements eui.UIComponent {

		animGroup: eui.Group

		return: eui.Image
		private cardAnim: dragonBones.EgretArmatureDisplay
		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			DRAGONBONES.getInstance().addToFactory("zika_ske_json", "zika_tex_json", "zika_tex_png");
			this.cardAnim = DRAGONBONES.getInstance().initArmature("卡片动画", "zika");
			this.animGroup.addChild(this.cardAnim)
			// this.cardAnim.scaleX = this.cardAnim.scaleY = 0.8
			let tian = new eui.Image("card1_png");
			let tu = new eui.Image("card2_png");
			tian.anchorOffsetX = 398 / 2;
			tian.anchorOffsetY = 599 / 2;
			tu.anchorOffsetX = 398 / 2;
			tu.anchorOffsetY = 599 / 2;
			this.cardAnim.armature.getSlot("card_tian").displayList = [tian];
			this.cardAnim.armature.getSlot("card_tu").displayList = [tu];
		}

		init() {
			this.cardAnim.animation.play("in", 1)
			this.animGroup.touchChildren = true
			Manager.EventManager.get().addListener("CardScene", this.animGroup, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji")
				this.cardAnim.animation.play("click", 1)
				this.animGroup.touchChildren = false
			}, this)
			Manager.EventManager.get().addListener("CardScene", this.cardAnim, dragonBones.EgretEvent.COMPLETE, (evt: dragonBones.EgretEvent) => {
				if (evt.animationName == "click") {
					this.cardAnim.animation.play("katanchu", 1)
				}
			}, this)


			Manager.EventManager.get().addListener("CardScene", this.return, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji")
				Hierarchy.AbManager.get().hide("CardScene")

				MUSIC4.get().pauseLast()
				MUSIC4.get().play("bg", -1);
				Manager.DelayManager.get().removeAllDelay();
				Manager.GlobalManager.get().restart();
				Manager.EventManager.get().removeAllListener();
				Hierarchy.AbManager.get().hide("End")

				Hierarchy.AbManager.get().show("Start")
				Hierarchy.MenuManager.get().music.selected = false
				Hierarchy.MenuManager.get().init();
			}, this)
		}
	}
}