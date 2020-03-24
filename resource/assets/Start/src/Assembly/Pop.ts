module Assembly {
	/**
	 * 介绍界面的泡泡
	 */
	export class Pop extends eui.Component implements eui.UIComponent {

		arrowImage: eui.Image

		public bubbleGroup: eui.Group;
		public label: eui.Label;
		public bubble: eui.Image;
		private strTex: string;//参数

		public constructor(str: string) {
			super();
			this.skinName = "Pop"
			this.strTex = str;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.anchorOffsetX = this.width / 2 - 120
			this.anchorOffsetY = this.height / 2
			this.label.text = "       " + this.strTex;
			this.label.wordWrap = true;
			this.bubble.height = this.label.height + 70 < 200 ? 200 : this.label.height + 70;
		}

	}
}