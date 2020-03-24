module Assembly {
	/**
	 * 错题本
	 */
	export class ErrBook extends eui.Component implements eui.UIComponent {

		aniGroup: eui.Group; //动画层
		leftArrow: eui.Image; //上一页
		rightArrow: eui.Image; //下一页
		contentGroup: eui.Group; //内容
		questionLabel: eui.Label

		private page: number; //当前看到第几页
		private cuotiAnim: dragonBones.EgretArmatureDisplay;//错题本动画
		private cuotileft: dragonBones.EgretArmatureDisplay;//错题本动画
		private cuotiright: dragonBones.EgretArmatureDisplay;//错题本动画
		private Global = Manager.GlobalManager.get();
		private questionCfg: Array<any>

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getInstance().addToFactory("shanshui_cuotiben_ske_json", "shanshui_cuotiben_tex_json", "shanshui_cuotiben_tex_png");
			this.cuotiAnim = DRAGONBONES.getInstance().initArmature("错题本动画", "cuotiben");
			this.cuotileft = DRAGONBONES.getInstance().initArmature("错题本左", "anniuzuo", "in", 1, this.aniGroup, 550, 540);
			this.cuotiright = DRAGONBONES.getInstance().initArmature("错题本右", "anniuyou", "in", 1, this.aniGroup, 1370, 540);
			this.aniGroup.addChild(this.cuotiAnim);
			this.cuotiAnim.armature.getSlot("zi").displayList = [this.questionLabel];
			this.cuotiAnim.x = 35;
			this.questionCfg = [];
			let config = RES.getRes("ti_json");
			for (let i = 0; i < 48; i++) {
				this.questionCfg.push(config[i]);
			}
		}

		init() {
			Hierarchy.AbManager.get().hide("End");
			this.page = 0;
			this.leftArrow.visible = false;
			this.cuotileft.visible = false;
			this.rightArrow.visible = this.Global.wrongArr.length > 1;
			this.cuotiright.visible = this.Global.wrongArr.length > 1;
			Manager.EventManager.get().addListener("CuoTiBen", this.leftArrow, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji");
				this.cuotileft.animation.play("click", 1);
				this.page -= 1;
				this.leftArrow.visible = this.page > 0;
				this.rightArrow.visible = this.page < this.Global.wrongArr.length - 1;
				this.cuotileft.visible = this.page > 0;
				this.cuotiright.visible = this.page < this.Global.wrongArr.length - 1;
				this.showCuoTi();
			}, this);
			Manager.EventManager.get().addListener("CuoTiBen", this.rightArrow, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji");
				this.cuotiright.animation.play("click", 1);
				this.page += 1;
				this.leftArrow.visible = this.page > 0;
				this.rightArrow.visible = this.page < this.Global.wrongArr.length - 1;
				this.cuotileft.visible = this.page > 0;
				this.cuotiright.visible = this.page < this.Global.wrongArr.length - 1;
				this.showCuoTi();
			}, this);
			this.showCuoTi();
			// this.contentGroup.y = -762;
			// this.contentGroup.alpha = 0;
			// egret.Tween.get(this.contentGroup).wait(2880).to({ y: 0, alpha: 1 }, 800, egret.Ease.backInOut);
			this.cuotiAnim.animation.play("in", 1);
			this.cuotileft.animation.play("in", 1);
			this.cuotiright.animation.play("in", 1);
		}

		private showCuoTi() {
			let data = this.Global.wrongArr[this.page];
			let txt = this.questionCfg[parseInt(data)].analysis.split("\n");
			if (txt.length == 1) {
				this.questionLabel.text = "        " + txt[0];
				this.questionLabel.size = 56;
				this.questionLabel.textColor = 0x212102;
				this.questionLabel.wordWrap = true;
				this.questionLabel.textAlign = egret.HorizontalAlign.LEFT;
			} else {
				this.questionLabel.textAlign = egret.HorizontalAlign.CENTER;
				if (this.questionCfg[parseInt(data)].type == 2) {
					this.questionLabel.textFlow = (new egret.HtmlTextParser).parse(
						"<font color='#1e2406' size='61'>" + txt[0] + "\n</font>"
						+ "<font color='#3a4623' size='30'>" + txt[1] + "\n</font>"
						+ "<font color='#31340a' size='42'>  " + txt[2].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>"
						+ "<font color='#31340a' size='42'>  " + txt[3].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>"
						+ "<font color='#31340a' size='42'>  " + txt[4].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>"
						+ "<font color='#31340a' size='42'>  " + txt[5].replace(this.questionCfg[parseInt(data)].a1, "</font><font color='#cc3300' size='42'>" + this.questionCfg[parseInt(data)].a1 + "</font><font color='#31340a' size='42'>") + "\n</font>"
					)
				} else {
					this.questionLabel.textFlow = <Array<egret.ITextElement>>[
						{ text: txt[0] + "\n", style: { "textColor": 0x1e2406, "size": 61 } }
						, { text: txt[1] + "\n", style: { "textColor": 0x3a4623, "size": 30 } }
						, { text: "  " + txt[2] + "\n", style: { "textColor": 0x31340a, "size": 42 } }
						, { text: "  " + txt[3] + "\n", style: { "textColor": 0x31340a, "size": 42 } }
						, { text: "  " + txt[4] + "\n", style: { "textColor": 0x31340a, "size": 42 } }
						, { text: "  " + txt[5] + "\n", style: { "textColor": 0x31340a, "size": 42 } }
					];
				}
			}
		}

	}
}