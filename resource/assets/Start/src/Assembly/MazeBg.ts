module Assembly {
	export class MazeBg extends eui.Component implements eui.UIComponent {


		private Global = Manager.GlobalManager.get();
		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			//[0,2,6,8]删除1个,[1,3,5,7]删除1个
			let deletIndex0 = COMMONUTILS.randomNewArr([0, 2, 6, 8], 1)[0]
			let deletIndex1 = COMMONUTILS.randomNewArr([1, 3, 5, 7], 1)[0]
			this["item" + deletIndex0].visible = false
			this["item" + deletIndex1].visible = false
			//[4]随机删除
			this["item" + 4].visible = Math.random() > 0.5 ? true : false

			//[9,11,15,17]删除1个,[10,12,14,16]删除1个
			let deletIndex2 = COMMONUTILS.randomNewArr([9, 11, 15, 17], 1)[0]
			let deletIndex3 = COMMONUTILS.randomNewArr([10, 12, 14, 16], 1)[0]
			this["item" + deletIndex2].visible = false
			this["item" + deletIndex3].visible = false
			//[13]随机删除
			this["item" + 13].visible = Math.random() > 0.5 ? true : false

			this.Global.hasShadowArr = [deletIndex0, deletIndex1, deletIndex2, deletIndex3]
			if (this["item" + 4].visible == false) {
				this.Global.hasShadowArr.push(4)
			}
			if (this["item" + 13].visible == false) {
				this.Global.hasShadowArr.push(13)
			}
		}
	}
}