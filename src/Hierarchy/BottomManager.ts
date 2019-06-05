/**
 * 层级管理模块
 */
module Hierarchy {
	/**
	 * 游戏场景最底层
	 * Hierarchy：0
	 */
	export class BottomManager extends eui.Component implements eui.UIComponent {
		static D: BottomManager = null;
		Arr: Array<any> = new Array<any>();//源数组
		Arred: Array<any> = new Array<any>()//找到的错别字
		nowSen: string//当前场景
		PageTime: number//第几次玩
		public constructor() {
			super()
			this.skinName = "Bottom";
		}
		protected childrenCreated(): void {
			this.init();
		}
		init() {
		}
		//单例
		static get(): BottomManager {
			if (this.D == null) {
				this.D = new BottomManager()
			}
			return this.D;
		}

	}
}