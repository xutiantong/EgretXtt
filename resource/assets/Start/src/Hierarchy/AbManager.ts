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
	 * Hierarchy：0
	 */
	export class AbManager extends egret.DisplayObjectContainer {

		static D: AbManager = null;
		Arr: Array<Ab> = new Array<Ab>();//存储组件

		public constructor() {
			super();
		}

		/**
		 * 注册组件
		 * @param arr 组件数组
		 */
		init(arr: Array<Ab>) {
			arr.forEach((v) => {
				this.Arr.push(v);
			});
		}

		/**
		 * 显示组件
		 * @param name 名称
		 */
		show(name: string, buttom: boolean = false) {
			for (let i = 0; i < this.Arr.length; i++) {
				let v = this.Arr[i];
				if (v.name == name) {
					this.addChildAt(v.obj, buttom ? 0 : -1)
					if (v.obj["init"] != null) {
						v.obj.init();
					}
				}
			}
		}

		/**
		 * 隐藏组件
		 * @param name 名称
		 */
		hide(name: string) {
			for (let i = 0; i < this.Arr.length; i++) {
				let v = this.Arr[i];
				if (v.name == name) {
					if (v.obj.parent) {
						this.removeChild(v.obj)
						Manager.EventManager.get().removeListenerFromClass(String(name));
						break;
					}
				}
			}
		}

		/**
		 * 获取组件
		 * @param name 名称
		 */
		getOne(name: string): any {
			let assembly = null
			for (let i = 0; i < this.Arr.length; i++) {
				let v = this.Arr[i];
				if (v.name == name) {
					assembly = v.obj;
					return assembly;
				}
			}
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