module z {
	//关卡页
	export class guanka extends eui.Component implements eui.UIComponent {
		public guanGroup: eui.Group;//放置关卡图片
		public animGroup: eui.Group;//放置脚步动画
		oneOvered: boolean = false//第1关是否完成
		over: boolean = false//是否全通过
		guanka_now: any = null;//当前管卡
		public constructor(com) {
			super();
			com.addChild(this);
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.guanGroup.getChildAt(0).addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				//去第1关
				console.log(1)
				cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.guanka_sound).stop()
				this.parent.visible = false;
				cores.getinstatic().index.pageGroup1.visible = true;
				cores.getinstatic().index.page1.init()
				cores.getinstatic().index.init()
				cores.getinstatic().index.page1.dazi.init()
				this.guanka_now = cores.getinstatic().index.page1
			}, this)
			


		}

		/**
		 * 欢迎来到关卡选择页面
		 */
		welcome() {
			cores.getinstatic().index.music2.play(cores.getinstatic().index.guanka_sound)
			this.guanka_now = null;//重置当前关卡为null
			cores.getinstatic().index.pageGroup1.visible = false
			cores.getinstatic().index.pageGroup2.visible = false
			cores.getinstatic().index.pageGroup3.visible = false
			this.guanGroup.getChildAt(1).touchEnabled = false
			this.guanGroup.getChildAt(2).touchEnabled = false
			// this.oneOvered = true;
			if (this.oneOvered == true) {
				//如果全通关
				this.over = true
			} else {
				this.over = false
			}
			if (this.oneOvered == true) {
				let img7: eui.Image = <eui.Image>this.guanGroup.getChildAt(0)
				img7.source = "1tongguo_png"
			} else {
				let img0: eui.Image = <eui.Image>this.guanGroup.getChildAt(0)
				img0.source = "1xuanzhong_png"
			}
		}
	}
}