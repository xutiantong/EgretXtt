module z {
    /**
        * 字组件
        */
    export class zi extends eui.Component implements eui.UIComponent {
        public lab: eui.Label;//字
        zi: string//当前字
        public img: eui.Image;
        public check: eui.Image;


        public constructor(zi) {
            super();
            this.skinName = "zi"
            this.zi = zi;
        }



        protected childrenCreated(): void {
            super.childrenCreated();
            this.check.visible = true
            this.img.source = "green_png"
            this.setZi(this.zi)

        }


        init() {
            this.check.visible = false
        }



        setcheck() {
            this.check.source = "cuo_png"
            this.img.source = "huang_png"

        }

        setZi(zi) {
            this.visible = true
            this.lab.text = zi;

        }


    }
}