class ShadowBg extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
	}
	private Global = Manager.GlobalManager.get();
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();

		for (let a = 0; a < this.Global.hasShadowArr.length; a++) {
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					if (i * 8 + j == this.Global.hasShadowArr[a]) {
						this["item" + (i * 8 + j)].visible = false
					}
				}
			}
		}
		this.Global.hasShadowArr = []
	}

}