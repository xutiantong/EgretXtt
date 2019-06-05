module Assembly {
	export class Introduction extends eui.Component implements eui.UIComponent {

		public touchGroup: eui.Group;
		private dongdong: dragonBones.EgretArmatureDisplay;

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().addToFactory("talk_ske_json", "talk_tex_json", "talk_tex_png")
			this.dongdong = DRAGONBONES.getinstance().initArmature("东东介绍", "dongdong")
			this.addChild(this.dongdong);
			this.dongdong.scaleX = 0.5;
			this.dongdong.scaleY = 0.5;
			this.dongdong.x = 350;
			this.dongdong.y = 1080;
		}

		init() {
			Manager.EventManager.get().addListener("Introduction", this.touchGroup, egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			Manager.EventManager.get().addListener("Introduction", this.dongdong, dragonBones.EgretEvent.COMPLETE, this.onComplete, this);
			MUSIC4.get().play("introduction");
			this.dongdong.animation.play("talk_tanchu", 1);
			let tmp = new egret.Bitmap();
			tmp.texture = RES.getRes("a1_png");
			tmp.anchorOffsetX = tmp.texture.textureWidth / 2;
			tmp.anchorOffsetY = tmp.texture.textureHeight / 2;
			this.dongdong.armature.getSlot("qipao").displayList = [tmp];
		}

		private onClick() {
			//点击声音
			MUSIC4.get().play("dianji");
			//介绍声音
			MUSIC4.get().stop("introduction");
			//隐藏介绍界面
			Hierarchy.MessageManager.get().hide("Introduction");
			//开始第一题
			Hierarchy.AbManager.get().getOne("Scene1").showNextQuestion();
			Hierarchy.AbManager.get().getOne("Scene1").showDongDong(true);
		}

		private onComplete(evt: dragonBones.EgretEvent) {
			if (evt.animationName == "talk_tanchu") {
				this.dongdong.animation.play("xunhuan", 0);
			}
		}
	}
}