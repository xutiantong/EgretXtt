module z {
	//失败界面组件
	export class shibai extends eui.Component implements eui.UIComponent {
		public animGroup: eui.Group;
		public again: eui.Image;
		public constructor(com) {
			super();
			this.skinName = "shibai"
			com.addChild(this);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().addToFactory("shibai_ske_json", "shibai_tex_json", "shibai_tex_png")
			DRAGONBONES.getinstance().initArmature("失败", "shibai")
			this.again.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.parent.visible = false;
				cores.getinstatic().index.GO_guanka();
			}, this)

		}

		init() {
			cores.getinstatic().dg.playAnimation("失败", "shibai", "失败分组", this.animGroup, 1)
		}


	}
}