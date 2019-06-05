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
		public constructor() {
			super();
		}
		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().addToFactory("kaishiyouxi_ske_json", "kaishiyouxi_tex_json", "kaishiyouxi_tex_png")
			DRAGONBONES.getinstance().initArmature("开始动画", "kaishiyouxi")
		}

		private onStart() {
			//点击声音
			MUSIC4.get().play("dianji")
			//隐藏开始界面
			Hierarchy.AbManager.get().hide("Start")
			//显示介绍界面
			Hierarchy.MessageManager.get().show("Introduction");
			//显示场景1
			Hierarchy.AbManager.get().show("Scene1");
		}
		//每次show自动调用
		init() {
			DRAGONBONES.getinstance().playAnimation("开始动画", "newAnimation", "a", this.aniGroup, 1);
			Manager.EventManager.get().addListener("Start", this.startButton, egret.TouchEvent.TOUCH_TAP, this.onStart, this);
			Hierarchy.AbManager.get().getOne("Scene1").showDongDong(false);
		}
	}
}