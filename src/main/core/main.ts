module yuwen {
	export class main extends eui.Component implements eui.UIComponent {
		public group: eui.Group;//伸缩group
		public pause: eui.Image;//暂停
		public reback: eui.Image;//返回
		public music: eui.ToggleButton;//声音
		public mains: eui.ToggleButton;//菜单
		public remusic: eui.Image;//重读
		ifpause: boolean = false//当前是否暂停状态
		public rect: eui.Rect;//暂停遮罩
		public lab: eui.Image;//暂停标志
		public constructor(com) {
			super();
			this.skinName = "main"
			com.addChild(this)
		}




		protected childrenCreated(): void {
			super.childrenCreated();
			this.mains.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.reback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.remusic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.init()
		}


		private touch(e: egret.TouchEvent) {
			switch (e.target) {
				//点击重读
				case this.remusic:
					if (cores.getinstatic().index.guanka.guanka_now != null) {
						cores.getinstatic().index.guanka.guanka_now.duti.du(cores.getinstatic().index.guanka.guanka_now.ti.okZi)
					}
					break;
				//点击暂停页面
				case this.lab:
					console.log("正常")
					egret.Tween.get(this.group).to({ height: 0 }, 300)
					this.mains.selected = false
					this.rect.visible = false
					this.music.touchEnabled = true
					this.reback.touchEnabled = true
					this.pause.touchEnabled = true
					this.lab.visible = false
					if (this.music.selected != true) {
						cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 1
					}
					break;
				case this.mains:
					this.mains.touchEnabled = false
					//点击伸缩弹出
					switch (this.mains.selected) {
						case false:
							egret.Tween.get(this.group).to({ height: 0 }, 300).call(() => {
								this.mains.touchEnabled = true
							})
							break;
						case true:
							egret.Tween.get(this.group).to({ height: 517 }, 500, egret.Ease.backOut).call(() => {
								this.mains.touchEnabled = true
							})
							break;
						default:
							break;
					}
					break;

				case this.reback:
					//点击重置
					cores.getinstatic().index.GO_guanka()
					this.music.selected = false
					cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 1
					this.init()
					break;
				case this.music:
					//点击伸缩弹出
					switch (this.music.selected) {
						case false:
							cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 1
							break;
						case true:
							cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 0
							break;
						default:
							break;
					}
					break;
				case this.pause:
					//点击暂停
					console.log("暂停")
					this.rect.visible = true
					this.music.touchEnabled = false
					this.lab.visible = true
					this.reback.touchEnabled = false
					cores.getinstatic().index.music2.getchannel(cores.getinstatic().index.bg_sound).volume = 0
					this.pause.touchEnabled = false
					break;
				default:
					break;
			}

		}

		init() {
			this.lab.visible = false
			this.rect.visible = false
			this.ifpause = false
			this.mains.selected = false
			egret.Tween.get(this.group).to({ height: 0 }, 300).call(() => {
				this.mains.touchEnabled = true
			})


		}
	}
}