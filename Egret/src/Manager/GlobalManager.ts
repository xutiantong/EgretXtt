/**
 * 管理类
 */
module Manager {
	/**
	 * 全局变量管理类
	 */
    export class GlobalManager extends egret.EventDispatcher {

        static D: GlobalManager = null;
        public questionNum: number = 1;
        public questionCurArr: Array<any> = new Array<any>();
        public wrongArr: Array<any> = [];

        public constructor() {
            super();
        }

        //单例
        static get(): GlobalManager {
            if (this.D == null) {
                this.D = new GlobalManager()
            }
            return this.D;
        }

        restart() {
            this.questionNum = 1;
            this.wrongArr = [];
        }
    }
}