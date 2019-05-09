module z {
	//大字组件
	export class dazi extends eui.Component implements eui.UIComponent {
		public img: eui.Image;//大字图片
		public constructor(com) {
			super();
			com.addChild(this)
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			this.img.alpha = 0
		}
		init() {
			egret.Tween.get(this.img).to({ alpha: 0 }, 300)

		}
		//根据当前题目正确字数组自动变更大字显示
		//无参数
		setImg() {

			switch (cores.getinstatic().index.page1.ti.okZi) {
				case "爸":
					this.img.source = "ba_png"
					break;
				case "大":
					this.img.source = "da_png"
					break;
				case "关":
					this.img.source = "guan_png"
					break;
				case "开":
					this.img.source = "kai_png"
					break;
				case "妈":
					this.img.source = "ma_png"
					break;
				case "朋":
					this.img.source = "peng_png"
					break;
				case "小":
					this.img.source = "xiao_png"
					break;
				case "友":
					this.img.source = "you_png"
					break;
				case "长":
					this.img.source = "zhang_png"
					break;
				default:
					break;

			}
			egret.Tween.get(this.img).to({ alpha: 1 }, 800)

		}
	}
}