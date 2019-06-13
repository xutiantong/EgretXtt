/**
 * 组件
 */
module Assembly {
	/**
	 * 开始界面组件
	 */
	export class Start extends eui.Component implements eui.UIComponent {
		public aniGroup: eui.Group;
		public startButton: eui.Image;
		public startAni: dragonBones.EgretArmatureDisplay;
		public constructor() {
			super();
		}
		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().addToFactory("kaishiyouxi_ske_json", "kaishiyouxi_tex_json", "kaishiyouxi_tex_png")
			this.startAni = DRAGONBONES.getinstance().initArmature("开始动画", "kaishiyouxi")
		}

		private onStart() {
			this.startButton.visible = false;
			Hierarchy.MenuManager.get().reback.touchEnabled = false;
			this.startAni.animation.play("out", 1);
			//点击声音
			MUSIC4.get().play("dianji")
			Hierarchy.MenuManager.get().reback.touchEnabled = true;
			//隐藏开始界面
			Hierarchy.AbManager.get().hide("Start")
			//显示场景1
			Hierarchy.AbManager.get().show("Scene1");
			//显示介绍界面
			Hierarchy.MessageManager.get().show("Introduction");
		}
		//每次show自动调用
		init() {
			this.startButton.visible = true;
			DRAGONBONES.getinstance().playAnimation("开始动画", "newAnimation", "a", this.aniGroup, 1);
			Manager.EventManager.get().addListener("Start", this.startButton, egret.TouchEvent.TOUCH_TAP, this.onStart, this);
		}
	}
}