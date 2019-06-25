/**
 * 层级管理模块
 */
module Hierarchy {
	/**
	 * 引导管理器
	 * Hierarchy：4
	 */
	export class GuideManager extends egret.DisplayObjectContainer {
		static D: GuideManager = null;

		public constructor() {
			super()
			DRAGONBONES.getinstance().addToFactory("dongdongdianji_ske_json", "dongdongdianji_tex_json", "dongdongdianji_tex_png");
			//初始化对号(全局唯一)
			DRAGONBONES.getinstance().initArmature("手指", "shouzhi")
		}
		//指引
		show(x, y) {

		}
		//隐藏
		hide() {

		}







		//单例
		static get(): GuideManager {
			if (this.D == null) {
				this.D = new GuideManager()
			}
			return this.D;
		}
	}
}