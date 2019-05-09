module z {
	/**
	 * 成功界面
	 */
	export class success extends eui.Component implements eui.UIComponent {
		public animGroup: eui.Group;
		public start: eui.Image;
		public ziGroup: eui.Group;

		public constructor(com) {
			super();
			this.skinName = "success"
			com.addChild(this);
		}



		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().addToFactory("taiozhanjieshu_ske_json", "taiozhanjieshu_tex_json", "taiozhanjieshu_tex_png")
			DRAGONBONES.getinstance().initArmature("挑战结束", "tiaozhanjieshu")
			cores.getinstatic().dg.getarmature("挑战结束").y -= 160
			this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				this.parent.visible = false
				cores.getinstatic().index.GO_guanka()

			}, this)
		}



		init(page) {
			this.ziGroup.scaleX = 0
			this.ziGroup.scaleY = 0
			this.ziGroup.x = 613
			egret.Tween.get(this.ziGroup).to({ scaleX: 1, scaleY: 1 }, 850, egret.Ease.quadIn)
			this.ziGroup.removeChildren()
			let layou: eui.TileLayout = new eui.TileLayout()
			layou.paddingTop = 6
			this.ziGroup.layout = layou;
			this.ziGroup.x = 630
	
			for (let i = 0; i < page.ti.Arr.length; i++) {
				let zi = new z.zi(page.ti.Arr[i])
				if (page.ti.Arr.length >= 9) {
					zi.scaleX = 0.9
					zi.scaleY = 0.9
				}
				this.ziGroup.addChild(zi)
			}


			page.ti.Arr_cuo.forEach((j) => {
				let zi: z.zi = <z.zi>this.ziGroup.getChildAt(j);
				zi.setcheck()
			})

			cores.getinstatic().dg.playAnimation("挑战结束", "shengli", "挑战结束分组", this.animGroup, 1)
		}
	}
}