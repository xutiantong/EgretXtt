module Assembly {
	export class CuoTiBenCell extends eui.Component implements eui.UIComponent {

		private word: string;
		private correct: boolean;
		public label: eui.Label;
		public mark: eui.Image;

		public constructor(word: string, correct: boolean) {
			super();
			this.word = word;
			this.correct = correct;
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			this.label.text = this.word;
			if (!this.correct) {
				this.mark.source = "cuo_png";
			}
		}
	}
}