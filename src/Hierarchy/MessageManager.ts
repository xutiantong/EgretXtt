/**
 * 层级管理模块
 */
module Hierarchy {
	/**
	 * 组件管理器
	 * Hierarchy：3
	 */
	export class MessageManager extends egret.DisplayObjectContainer {

		static D: MessageManager = null;
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
			});
		}

		/**
		 * 显示组件
		 * @param name 名字
		 */
		show(name: string) {
			this.Arr.forEach((v) => {
				if (v.name == name) {
					this.addChild(v.obj)
					if (v.obj["init"] != null) {
						v.obj.init();
					}
				}
			});
		}

		/**
		 * 隐藏组件
		 * @param name 名字
		 */
		hide(name: string) {
			this.Arr.forEach((v) => {
				if (v.name == name) {
					if (v.obj.parent) {
						this.removeChild(v.obj);
						Manager.EventManager.get().removeListenerFromClass(String(name));
					}
				}
			});
		}

		/**
		 * 获取组件
		 * @param name 名字
		 */
		getOne(name: string): any {
			let a = null
			this.Arr.forEach((v) => {
				if (v.name == name) {
					a = v.obj
				}
			});
			return a
		}

		//单例
		static get(): MessageManager {
			if (this.D == null) {
				this.D = new MessageManager();
			}
			return this.D;
		}

	}
}