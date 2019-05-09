module z {
    /**
        * 心组件
        */
    export class xue extends eui.Component implements eui.UIComponent {
        public x1: eui.Image;
        public x2: eui.Image;


        num: number//当前血量
        public constructor(com) {
            super();
            this.skinName="xue"
            com.addChild(this)
        }

      

        protected childrenCreated(): void {
            super.childrenCreated();
            this.init()
        }


		/**
		 * 初始化
		 */
        init() {
            this.x1.visible = true;
            this.x2.visible = true;
            this.num = 2

        }


		/**
		 * 掉血
		 */
        sunshi() {
            if (this.num == 2) {
                //如果满血
                this.x1.visible = false
            } else if (this.num == 1) {
                this.x2.visible = false
                //如果已经没血
                //////********没血逻辑******/////////// */
                cores.getinstatic().index.GO_shibai()
            }
            this.num -= 1;
        }



    }



}