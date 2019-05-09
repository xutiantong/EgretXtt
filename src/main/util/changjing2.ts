/**
 * 场景切换工具2.0版本
 */
class changjing2 extends eui.Component implements eui.UIComponent {
	private component_set: any[] = new Array();
	private last: eui.Component;
	public constructor(...yemianarray) {
		super();
		console.log("场景切换工具创建");
		for (let n of yemianarray) {
			this.component_set.push(n);
			console.log(yemianarray.length + "个页面注册成功")
		}
	}

	/**
	 * 对外提供场景切换
	 */
	to(yemian: eui.Component) {
		for (let i = 0; i < this.component_set.length; i++) {
			if (this.component_set[i] == yemian) {
				if (this.last != undefined) { this.removeChild(this.last); }
				this.addChild(this.component_set[i]);
				this.last = this.component_set[i];
			}

		}

	}

}