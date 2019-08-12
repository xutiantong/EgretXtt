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
			DRAGONBONES.getInstance().addToFactory("kaishiyouxi_ske_json", "kaishiyouxi_tex_json", "kaishiyouxi_tex_png");
			this.startAni = DRAGONBONES.getInstance().initArmature("开始动画", "kaishiyouxi");
		}

		private onStart() {
			MUSIC4.get().play("dianji");
			//隐藏开始界面
			Hierarchy.AbManager.get().hide("Start");
			//显示选关
			Hierarchy.AbManager.get().show("Select");
		}

		init() {
			this.startButton.visible = true;
			DRAGONBONES.getInstance().playAnimation("开始动画", "newAnimation", this.aniGroup, 1);
			Manager.EventManager.get().addListener("Start", this.startButton, egret.TouchEvent.TOUCH_TAP, this.onStart, this);
		}

	}
}