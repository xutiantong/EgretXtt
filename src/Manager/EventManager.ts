/**
 * 管理类
 */
module Manager {
	/**
	 * 事件管理
	 */
	export class EventManager extends egret.EventDispatcher {
		static D: EventManager = null;
		listenerArr: Array<any> = []; //事件监听列表
		public constructor() {
			super();
		}

		/**
		 * 添加监听事件
		 * @param className 类名
		 * @param addObj 添加事件的对象
		 * @param type 事件类型
		 * @param listener 监听回调方法
		 * @param thisObj this对象
		 */
		addListener(className: string, addObj: egret.DisplayObject, type: any, listener: Function, thisObj: any) {
			addObj.addEventListener(type, listener, thisObj);
			this.listenerArr.push({ className: className, addObj: addObj, type: type, listener: listener, thisObj: thisObj })
		}

		/**
		 * 移除类中全部监听事件
		 * @param className 类名
		 */
		removeListenerFromClass(className: string) {
			this.listenerArr.forEach((v, i) => {
				if (v != null && v.className == className) {
					v.addObj.removeEventListener(v.type, v.listener, v.thisObj);
					this.listenerArr[i] = null;
				}
			});
			this.listenerArr = this.listenerArr.filter((v) => { return v != null; });
		}

		/**
		 * 移除EventManager中全部监听事件
		 */
		removeAllListener() {
			this.listenerArr.forEach((v, i) => {
				if (v != null) {
					v.addObj.removeEventListener(v.type, v.listener, v.thisObj);
				}
			});
			this.listenerArr = [];
		}

		//单例
		static get(): EventManager {
			if (this.D == null) {
				this.D = new EventManager()
			}
			return this.D;
		}


	}
}