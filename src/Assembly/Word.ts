module Assembly {
	/**
	 * 字组件
	 */
    export class Word extends eui.Component implements eui.UIComponent {

        public touchGroup: eui.Group;
        public tipGroup: eui.Group;
        public img: eui.Group;
        public label: eui.Label;
        public bg: eui.Image;
        public answer: eui.Image;
        public question: eui.Image;
        public tip1: eui.Image;
        public tip2: eui.Image;
        public tip3: eui.Image;
        public content: string;
        public num: number;
        private foodList = ["mogu_png", "pingguo_png", "yumi_png", "roupian_png", "yu_png", "yurou_png"];

        private Global = Manager.GlobalManager.get();

        public constructor() {
            super();
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            egret.Tween.get(this.tipGroup, { loop: true }).to({ alpha: 0 }, 500).to({ alpha: 1 }, 500);
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            if (this.Global.questionType == 0) {
                this.bg.source = this.foodList[COMMONUTILS.get().getRandomNum(0, 2)];
            } else {
                this.bg.source = this.foodList[COMMONUTILS.get().getRandomNum(3, 5)];
            }
            let question = this.Global.questionCurArr[this.Global.questionNum - 1];
            this.label.text = question.question.substr((question.mark == 1 ? -1 : 0), 1);
            this.img.x = (question.mark == 1 ? 20 : 158);
            this.label.x = (question.mark == 1 ? 189 : 51);
            this["tip" + question.pos].visible = true;
            this.answer.visible = false;
            this.answer.source = question.p1;
            this.question.source = question.pq;
        }

        private onClick() {

        }

    }
}