/**
 * 管理类
 */
module Manager {
	/**
	 * 全局变量管理类
	 */
    export class GlobalManager extends egret.EventDispatcher {

        static D: GlobalManager = null;
        public questionType = 0;
        public questionNum: number = 1; //当前题号
        public questionCurArr: Array<any> = new Array<any>(); //当前题库
        public wrongArr: Array<any> = []; //错题库
        public isFirstPlay: boolean = true; //是否第一次玩

        public constructor() {
            super();
        }

        //单例
        static get(): GlobalManager {
            if (this.D == null) {
                this.D = new GlobalManager();
            }
            return this.D;
        }

        /**
         * 重来时初始化
         */
        restart() {
            this.questionNum = 1;
            this.wrongArr = [];
        }
    }
}