module Assembly {
	/**
	 * @description 介绍组件
	 * @description
	 * @description introduction1,introduction2为介绍第一二句话的音频
	 */
	export class Introduction extends eui.Component implements eui.UIComponent {

		//UI
		public touchGroup: eui.Group;
		//设置
		private animNameArr: Array<string> = ["小书童"]
		private startText: string = "同学们，你们向往闲适恬淡的山水田园生活吗？今天我们就一起走进王维和孟浩然的人生旅程中，去感悟山水之美，田园之乐吧！"
		private LoopText: string = "";
		//参数
		private skeName0: string = "shutong_ske_json";
		private texName0: string = "shutong_tex_json";
		private texNamePng0: string = "shutong_tex_png";

		private skeName1: string = "sister_ske_json";
		private texName1: string = "sister_tex_json";
		private texNamePng1: string = "sister_tex_png";

		private armera0: string = "shutong";//骨架
		private animStart0: string = "tanchu";//第一段动画名
		private animLoop0: string = "talk";//第二段动画名
		private animLoop01: string = "talk";//第三段动画名
		private animStop0: string = "talk_mouse_stop"//停住呼吸动画
		private slotName0: string = "1";//气泡插槽名

		private armera1: string = "sister";//骨架
		private animStart1: string = "stanchu";//第一段动画名
		private animLoop1: string = "yiwen";//第二段动画名
		private animLoop11: string = "xiao";//第三段动画名
		private slotName1: string = "1";//气泡插槽名

		private anim0: dragonBones.EgretArmatureDisplay
		private anim1: dragonBones.EgretArmatureDisplay

		//公共
		private dr: DRAGONBONES = DRAGONBONES.getInstance()//龙骨方法

		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			//创建骨架
			for (let i = 0; i < this.animNameArr.length; i++) {
				this.dr.addToFactory(this["skeName" + i], this["texName" + i], this["texNamePng" + i])
				this["anim" + i] = this.dr.initArmature(this.animNameArr[i], this["armera" + i])

			}
		}


		/**
		 * 更改泡泡内容
		 * @param num 
		 */
		private changePop(name: string, slotName: string, num: number) {
			let pop: Assembly.Pop = new Assembly.Pop(num == 1 ? this.startText : this.LoopText)
			// this.addChild(pop)
			if (num != 1) {
				pop.arrowImage.horizontalCenter = 500
				pop.arrowImage.scaleX = -1
				pop.anchorOffsetX = pop.width / 2 + 200
				pop.anchorOffsetY = pop.height / 2 - 150
				pop.scaleX = pop.scaleY = 1.2
			} else {
				pop.anchorOffsetX = pop.width / 2 - 100
				pop.anchorOffsetY = pop.height / 2
			}
			DRAGONBONES.getInstance().getarmature(name).armature.getSlot(slotName).displayList = [pop]
		}

		init() {
			for (let i = 0; i < this.animNameArr.length; i++) {

				//更改插槽
				this.changePop(this.animNameArr[i], this["slotName" + i], i + 1);

				//onComplete
				Manager.EventManager.get().addListener("Introduction", this["anim" + i], dragonBones.EgretEvent.COMPLETE, this.animComplete, this)
			}
			//visible
			this.anim0.visible = true
			if (this.anim1) this.anim1.visible = false
			//播放第一动画
			this.dr.playAnimation(this.animNameArr[0], this.animStart0, this.touchGroup, 1, 1, 1, 1, 300, 1080);
			MUSIC4.get().play("introduction1")
			MUSIC4.get().addEvent("introduction1", () => {
				this.showAnim2()
			}, this)

			Manager.EventManager.get().addListener("Introduction", this, egret.TouchEvent.TOUCH_TAP, () => {
				MUSIC4.get().play("dianji")
				if (this.animNameArr.length == 1) {
					this.showScene1()
				} else {
					if (this.anim0.visible == false) {
						this.showScene1()
					} else {
						this.showAnim2()
					}
				}
			}, this)

		}

		private showAnim2() {
			MUSIC4.get().stop("introduction1");
			//第一动画停住
			this.anim0.animation.gotoAndStopByFrame(this.animLoop0, 0)
			this.anim0.animation.play(this.animStop0, 0)

			if (this.animNameArr.length == 1) {
				// this.showScene1()
			} else {
				this.anim0.visible = false
				//第二动画播放
				MUSIC4.get().play("introduction2")
				this.anim1.visible = true
				this.dr.playAnimation(this.animNameArr[1], this.animStart1, this.touchGroup, 1, 1, 1, 1, 1700, 1080);
				MUSIC4.get().addEvent("introduction2", () => {
					//第二动画停住
					this.anim1.animation.gotoAndStopByFrame(this.animLoop1, 0)
					// this.anim1.visible = false
					// this.showScene1()
				}, this)
			}
		}

		private showScene1() {
			MUSIC4.get().stop("introduction1");
			MUSIC4.get().stop("introduction2");
			// 隐藏介绍界面
			Hierarchy.MessageManager.get().hide("Introduction");
			// 开始第一题
			// Hierarchy.AbManager.get().getOne("Scene1").showNextQuestion();
			//女声提示
			MUSIC4.get().play("tips1", 1);
		}

		private animComplete(evt: dragonBones.EgretEvent) {
			if (evt.animationName == this.animStart0) {
				// console.log("动画1弹出播放完")
				evt.armature.animation.play(this.animLoop0, 1)
			}
			if (evt.animationName == this.animLoop0) {
				let _name = Math.random() > 0.5 ? this.animLoop0 : this.animLoop01
				evt.armature.animation.play(_name, 1)
			}
			if (evt.animationName == this.animLoop01) {
				let _name = Math.random() > 0.5 ? this.animLoop0 : this.animLoop01
				evt.armature.animation.play(_name, 1)
			}


			if (evt.animationName == this.animStart1) {
				// console.log("动画2弹出播放完")
				evt.armature.animation.play(this.animLoop1, 1)
			}
			if (evt.animationName == this.animLoop1) {
				let _name = Math.random() > 0.5 ? this.animLoop1 : this.animLoop11
				evt.armature.animation.play(_name, 1)
			}
			if (evt.animationName == this.animLoop11) {
				let _name = Math.random() > 0.5 ? this.animLoop1 : this.animLoop11
				evt.armature.animation.play(_name, 1)
			}
		}
	}
}