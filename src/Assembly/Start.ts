/**
 * 组件
 */
module Assembly {
	/**
	 * 开始界面组件
	 */
	export class Start extends eui.Component implements eui.UIComponent {

		aniGroup: eui.Group;
		startGroup: eui.Group;
		startButton: eui.Image;
		private startAni: dragonBones.EgretArmatureDisplay;
		private startBtnAni: dragonBones.EgretArmatureDisplay;
		private Global = Manager.GlobalManager.get()
		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			DRAGONBONES.getInstance().addToFactory("startgame_ske_json", "startgame_tex_json", "startgame_tex_png");
			this.startAni = DRAGONBONES.getInstance().initArmature("开始动画", "startgame");
			this.aniGroup.addChild(this.startAni)
			this.startAni.armature.getSlot("形状_64").displayList = []
			this.startAni.armature.getSlot("开始_游戏").displayList = []

			DRAGONBONES.getInstance().addToFactory("startbtn_ske_json", "startbtn_tex_json", "startbtn_tex_png");
			this.startBtnAni = DRAGONBONES.getInstance().initArmature("开始按钮动画", "startbt");
			this.addChild(this.startBtnAni)
		}

		private onStart(evt: egret.TouchEvent) {
			this.startGroup.touchEnabled = false
			this.startGroup.touchChildren = false
			MUSIC4.get().play("dianji");
			this.startBtnAni.animation.play("click", 1)
			egret.Tween.get(this.startGroup).to({ scaleX: 1.2, scaleY: 1.2 }, 830).to({ scaleX: 1, scaleY: 1 }, 1750 - 830).call(() => {
				//隐藏开始界面
				Hierarchy.AbManager.get().hide("Start");
				//显示场景1
				Hierarchy.AbManager.get().show("Select2");
				//显示介绍
				Hierarchy.MessageManager.get().show("Introduction");
				this.startGroup.touchEnabled = true
				this.startGroup.touchChildren = true
			})
		}

		init() {
			this.startGroup.visible = true;
			this.startAni.animation.play("newAnimation", 1)
			this.startBtnAni.animation.play("normal", 0)
			Manager.EventManager.get().addListener("Start", this.startGroup, egret.TouchEvent.TOUCH_TAP, this.onStart, this);
		}


	}
}