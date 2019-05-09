module z {
	//第一题的字单件
	export class zi1 extends eui.Component implements eui.UIComponent {

		public cuo: eui.Image;

		public label: eui.Label;
		zi;//当前字
		public constructor(zi) {
			super();
			this.zi = zi;
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			this.rotation = 0
			egret.Tween.get(this, { loop: true }).to({ rotation: 3 }, cores.getinstatic().getsuiji(650, 860)).to({ rotation: 0 }, cores.getinstatic().getsuiji(650, 860))
			this.label.text = this.zi;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				cores.getinstatic().index.music2.play(cores.getinstatic().index.dianji_sound)
				cores.getinstatic().index.page1.ti.touchChildren = false
				//点击字
				if (this.zi == cores.getinstatic().index.page1.ti.okZi) {
					//选择正确
					cores.getinstatic().index.main.remusic.touchEnabled = false
					egret.Tween.get(this).to({ scaleX: 1.1, scaleY: 1.1 }, 300, egret.Ease.quadOut).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.quadOut)


					DRAGONBONES.getinstance().getarmature("仓颉正面").animation.play("zhoulu", 0)
					egret.Tween.get(DRAGONBONES.getinstance().getarmature("仓颉正面")).to({ x: 890 }, 2100).call(() => {
						cores.getinstatic().index.music2.play(cores.getinstatic().index.xiezi_sound)
						cores.getinstatic().index.page1.dazi.setImg()
						DRAGONBONES.getinstance().getarmature("仓颉正面").visible = false
						DRAGONBONES.getinstance().getarmature("仓颉写字").visible = true
						DRAGONBONES.getinstance().getarmature("仓颉写字").x = 890
						DRAGONBONES.getinstance().getarmature("仓颉写字").animation.play("zhanli", 1).timeScale = 3


						setTimeout(() => {
							//9
							if (cores.getinstatic().index.page1.ti.page >=9) {
								//大结局
								cores.getinstatic().index.GO_success(cores.getinstatic().index.page1)
								cores.getinstatic().index.guanka.oneOvered = true;
							} else {
								egret.Tween.get(cores.getinstatic().index.page1.ti.group).to({ alpha: 0 }, 300).call(() => {
									cores.getinstatic().index.page1.ti.chuti()
								})
							}
						}, 1900)
					})



				} else {
					//选择错误
					DRAGONBONES.getinstance().getarmature("仓颉正面").animation.play("naotou", 1)
					cores.getinstatic().index.music2.play(cores.getinstatic().index.cangjieen_sound)
					cores.getinstatic().index.page1.ti.Arr_cuo.push(cores.getinstatic().index.page1.ti.page - 1)//错字记录
					cores.getinstatic().index.music2.play(cores.getinstatic().index.err_sound)
					cores.getinstatic().index.page1.xue.sunshi()//掉血
					egret.Tween.get(this).to({ y: 300 }, 500, egret.Ease.quadOut).call(() => {
						cores.getinstatic().index.page1.ti.touchChildren = true
					})
				}
			}, this);
		}
	}
}