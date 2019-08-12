/**
 * 管理类
 */
module Manager {
	/**
	 * 延时管理
	 */
    export class DelayManager extends egret.EventDispatcher {

        static D: DelayManager = null;
        // 多个延时线
        public delay1 = new Object;
        public delay2 = new Object;
        public delay3 = new Object;

        public constructor() {
            super();
        }

        /**
         * 添加延时
         * @param time 延时时间
         * @param callBack 延时执行的函数
         * @param num 延时线
         * @param loop 是否循环
         */
        addDelay(time: number, callBack: Function, num: number = 1, loop: boolean = false) {
            egret.Tween.get(this["delay" + num], { loop: loop }).wait(time).call(callBack);
        }

        /**
         * 移除指定延时
         * @param num: 延时线
         */
        removeDelay(num: number) {
            egret.Tween.removeTweens(this["delay" + num]);
        }

        /**
         * 移除DelayManager所有延时
         */
        removeAllDelay() {
            egret.Tween.removeTweens(this["delay1"]);
            egret.Tween.removeTweens(this["delay2"]);
            egret.Tween.removeTweens(this["delay3"]);
        }

        //单例
        static get(): DelayManager {
            if (this.D == null) {
                this.D = new DelayManager();
            }
            return this.D;
        }
    }
}