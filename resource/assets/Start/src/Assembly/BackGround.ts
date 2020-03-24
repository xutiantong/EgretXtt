module Assembly {
	export class BackGround extends eui.Component implements eui.UIComponent {
		public constructor() {
			super();
		}

		group0: eui.Group
		group1: eui.Group
		group2: eui.Group
		group3: eui.Group

		private speedBg = 2//背景 山 速度
		public speed = 3//轨道 栅栏 速度 

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();

		}
		updateData() {
			if (this.group0.x >= 0) {
				this.group0.x += this.speed
				this.group1.x = this.group0.x - this.group0.width
			}
			if (this.group1.x >= 0) {
				this.group1.x += this.speed
				this.group0.x = this.group1.x - this.group1.width
			}
			if (this.group2.x >= 0) {
				this.group2.x += this.speedBg
				this.group3.x = this.group2.x - this.group2.width
			}
			if (this.group3.x >= 0) {
				this.group3.x += this.speedBg
				this.group2.x = this.group3.x - this.group3.width
			}
		}
	}
}