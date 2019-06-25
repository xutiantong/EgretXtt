/**
 * 注册组件参数
 */
type Ab = {
	name: string//组件名称
	obj: any//组件实体

}
/**
 * 层级管理模块
 */
module Hierarchy {
	/**
	 * 组件管理器
	 * Hierarchy：1
	 */
	export class AbManager extends egret.DisplayObjectContainer {
		static D: AbManager = null;
		Arr: Array<Ab> = new Array<Ab>();//存储组件
		public constructor() {
			super();
		}
		/**
		 * 注册组件
		 */
		init(arr: Array<Ab>) {
			arr.forEach((v) => {
				this.Arr.push(v);
			})
		}
		/**
		 * 显示组件
		 */
		show(name) {
			this.Arr.forEach((v) => {
				if (v.name == name) {
					this.addChild(v.obj)
					if (v.obj["init"] != null) {
						v.obj.init();
					}
				}
			})

		}
		/**
		 * 隐藏组件
		 */
		hide(name) {
			this.Arr.forEach((v) => {
				if (v.name == name) {
					if (v.obj.parent) {
						this.removeChild(v.obj)
						Manager.EventManager.get().removeListenerFromClass(String(name));
					}
				}
			})
		}
		/**
		 * 获取组件
		 */
		getOne(name): any {
			let a = null
			this.Arr.forEach((v) => {
				if (v.name == name) {
					a = v.obj
				}
			})
			return a
		}



		//单例
		static get(): AbManager {
			if (this.D == null) {
				this.D = new AbManager()
			}
			return this.D;
		}

	}
}