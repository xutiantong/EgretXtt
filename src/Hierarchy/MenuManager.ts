/**
 * 层级管理模块
 */
module Hierarchy {
	/**
	 * 菜单管理器
	 * Hierarchy：2
	 *
	 */
	export class MenuManager extends eui.Component implements eui.UIComponent {
		static D: MenuManager = null;
		public group: eui.Group;//伸缩group
		public pause: eui.Image;//暂停
		public reback: eui.Image;//返回
		public music: eui.ToggleButton;//声音
		public mains: eui.ToggleButton;//菜单
		public ifpause: boolean = false//当前是否暂停状态
		public rect: eui.Rect;//暂停遮罩
		public lab: eui.Image;//暂停标志
		public constructor() {
			super();
			this.skinName = "Menu"

		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.mains.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.reback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.lab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this)
			this.group.height = 0
			this.init()
		}
		private touch(e: egret.TouchEvent) {
			MUSIC4.get().play("dianji")
			switch (e.target) {
				//点击暂停页面
				case this.lab:
					console.log("正常")
					this.ifpause = true
					egret.ticker.resume()
					egret.ticker.update()
					MUSIC4.get().huifuLast()
					egret.Tween.get(this.group).to({ height: 0 }, 300)
					this.mains.selected = false
					this.rect.visible = false
					this.music.touchEnabled = true
					this.reback.touchEnabled = true
					this.pause.touchEnabled = true
					this.lab.visible = false
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
					MUSIC4.get().pauseLast()
					MUSIC4.get().play("bg", -1);
					Manager.DelayManager.get().removeAllDelay();
					Manager.GlobalManager.get().restart();
					Manager.EventManager.get().removeAllListener();
					Hierarchy.AbManager.get().show("Start")
					this.music.selected = false
					this.init()
					break;
				case this.music:
					//点击声音
					switch (this.music.selected) {
						case false:
							MUSIC4.get().play("bg", -1);
							break;
						case true:
							MUSIC4.get().stop("bg")
							break;
						default:
							break;
					}
					break;
				case this.pause:
					//点击暂停
					console.log("暂停")
					MUSIC4.get().pauseLast()
					this.rect.visible = true
					this.music.touchEnabled = false
					this.lab.visible = true
					this.reback.touchEnabled = false
					this.pause.touchEnabled = false
					this.ifpause = true
					egret.ticker.update()
					setTimeout(() => {
						egret.ticker.pause()
					}, 200)

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

		//单例
		static get(): MenuManager {
			if (this.D == null) {
				this.D = new MenuManager()
			}
			return this.D;
		}

	}
}