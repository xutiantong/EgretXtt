class System extends eui.Component implements eui.UIComponent {

	public group: eui.Group;//伸缩group
	public pause: eui.Image;//暂停
	public reback: eui.Image;//返回
	public music: eui.ToggleButton;//声音
	public mains: eui.ToggleButton;//菜单
	ifpause: boolean = false//当前是否暂停状态
	public rect: eui.Rect;//暂停遮罩
	public lab: eui.Image;//暂停标志

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.mains.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
		this.reback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
		this.pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
		this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
		this.lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
		this.init()
	}

	private touch(e: egret.TouchEvent) {
		GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.click_sound);
		switch (e.target) {
			case this.lab:
				//点击暂停页面
				egret.Tween.get(this.group).to({ height: 0 }, 300)
				this.mains.selected = false
				this.rect.visible = false
				this.music.touchEnabled = true
				this.reback.touchEnabled = true
				this.pause.touchEnabled = true
				this.lab.visible = false
				GlobalManager.getInstance().mainscene.question.touchChildren = true;
				if (this.music.selected != true) {
					GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 1
				}
				break;
			case this.mains:
				//点击伸缩弹出
				this.mains.touchEnabled = false
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
				GlobalManager.getInstance().mainscene.restart();
				this.music.selected = false
				GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 1
				this.init()
				break;
			case this.music:
				//点击音乐
				switch (this.music.selected) {
					case false:
						GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 1
						break;
					case true:
						GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 0
						break;
					default:
						break;
				}
				break;
			case this.pause:
				//点击暂停
				this.rect.visible = true
				this.music.touchEnabled = false
				this.lab.visible = true 
				this.reback.touchEnabled = false
				GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bg_sound).volume = 0
				this.pause.touchEnabled = false
				GlobalManager.getInstance().mainscene.question.touchChildren = false;
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