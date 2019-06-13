module Assembly {
	/**
	 * 面包组件
	 */
    export class Bread extends eui.Component implements eui.UIComponent {

        public touchGroup: eui.Group;
        public img: eui.Image;
        public label: eui.Label;
        private content: string;

        private Global = Manager.GlobalManager.get();

        public constructor(content: string) {
            super();
            this.content = content;
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.img.source = COMMONUTILS.get().getsuiji(1, 6) + "_png";
            this.label.text = this.content;
            this.name = this.content;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        }

    }
}