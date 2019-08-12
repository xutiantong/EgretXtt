module Assembly {
	/**
	 * 挑战结束元件
	 */
	export class EndCell extends eui.Component implements eui.UIComponent {
		public lab: eui.Label;//第几题
		public img: eui.Image;//对错图片
		n: number//第几题
		boo: boolean//对错

		public constructor(n: number, boo: boolean) {
			super();
			this.n = n
			this.boo = boo
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			let tiNum: string;
			switch (this.n) {
				case 0:
					tiNum = "第一题"
					break;
				case 1:
					tiNum = "第二题"
					break;
				case 2:
					tiNum = "第三题"
					break;
				case 3:
					tiNum = "第四题"
					break;
				case 4:
					tiNum = "第五题"
					break;
				case 5:
					tiNum = "第六题"
					break;
				case 6:
					tiNum = "第七题"
					break;
				case 7:
					tiNum = "第八题"
					break;
				case 8:
					tiNum = "第九题"
					break;
				case 9:
					tiNum = "第十题"
					break;
				default:
					break;
			}
			this.lab.text = tiNum;
			if (this.boo == true) {
				this.img.source = "dui_png"
			} else {
				this.img.source = "cuo_png"
			}
		}

	}
}