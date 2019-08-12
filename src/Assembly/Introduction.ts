module Assembly {
	/**
	 * @description 介绍组件
	 * @description gameName:人物名称 talkNum：说话次数 startText:第一句话 LoopText：第二句话
	 * @description introduction1,introduction2为介绍第一二句话的音频
	 */
	export class Introduction extends eui.Component implements eui.UIComponent {

		//UI
		public touchGroup: eui.Group;
		//设置
		private gameName: string = "仓颉";
		private talkNum: number = 1;
		private startText: string = "同学们，过年啦，我们家最爱吃的就是饺子，请按照题板选择饺子馅吧，包出美味的饺子吧！"
		private LoopText: string = "";
		//参数
		private skeName: string = "";//龙骨文件ske
		private texName: string = "";//龙骨文件tex
		private texName2: string = "";//龙骨文件png
		private armera: string = "";//骨架
		private animStart: string = "";//第一段动画名
		private animLoop: string = "";//第二段动画名
		private soltName: string = "";//气泡插槽名
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
			//1.龙骨散文件
			if (this.gameName == "东东") {
				this.skeName = "talk_ske_json";
				this.texName = "talk_tex_json";
				this.texName2 = "talk_tex_png";
				this.armera = "dongdong";
				this.animStart = "talk_tanchu";
				this.animLoop = "xunhuan";
				this.soltName = "qipao"
			}
			else if (this.gameName == "小王子") {
				this.skeName = "DB_duibai_ske_json";
				this.texName = "DB_duibai_tex_json";
				this.texName2 = "DB_duibai_tex_png";
				this.armera = "duibai";
				this.animStart = "DB_duibaitanchu";
				this.animLoop = "DB_duibai_xunhuan";
				this.soltName = "qipao"
			}
			else if (this.gameName == "仓颉") {
				this.skeName = "shuohua_ske_json";
				this.texName = "shuohua_tex_json";
				this.texName2 = "shuohua_tex_png";
				this.armera = "shuohua";
				this.animStart = "tanchu";
				this.animLoop = "shuohua";
				this.soltName = "qipao"
			}
			else if (this.gameName == "小侦探") {
				this.skeName = "xiaozhentan_ske_json";
				this.texName = "xiaozhentan_tex_json";
				this.texName2 = "xiaozhentan_tex_png";
				this.armera = "xiaozhentan";
				this.animStart = "tanchu";
				this.animLoop = "tanchushuohua";
				this.soltName = "talk"
			}
			else if (this.gameName == "仓颉女友") {
				this.skeName = "cjny_ske_json";
				this.texName = "cjny_tex_json";
				this.texName2 = "cjny_tex_png";
				this.armera = "cjny";
				this.animStart = "tallk_1";
				this.animLoop = "tallk_2";
				this.soltName = "cangjie1";
			}
			//2.创建骨架
			this.dr.addToFactory(this.skeName, this.texName, this.texName2)
			this.dr.initArmature("说话", this.armera, () => { }, () => {
				//播完弹出自动播放循环
				if (this.gameName == "东东") {
					this.dr.playAnimation("说话", this.animLoop, this.touchGroup, 0, 0.5, 0.5, 1, 300, 1080);
				} else if (this.gameName == "小王子") {
					this.dr.playAnimation("说话", this.animLoop, this.touchGroup, 0, 1, 1, 1, 0, -100);
				} else if (this.gameName == "仓颉") {
					this.dr.playAnimation("说话", this.animLoop, this.touchGroup, 0, 1, 1, 1, 300, 1080);
				} else if (this.gameName == "小侦探") {
					this.dr.playAnimation("说话", this.animLoop, this.touchGroup, 0, 1, 1, 1);
				} else if (this.gameName == "仓颉女友") {
					this.dr.playAnimation("说话", this.animLoop, this.touchGroup, 0, 1, 1, 1, -100, 480);
				}
			});
		}

		/**
		 * 更改泡泡内容
		 * @param num 
		 */
		private changePop(num: number) {
			let pop: Assembly.Pop = new Assembly.Pop(num == 1 ? this.startText : this.LoopText)
			// this.addChild(pop)
			this.dr.changeSlotDisplay("说话", this.soltName, pop);
		}

		init() {
			//1.一开始禁止点击，等待弹出动画弹出
			this.touchChildren = false
			this.touchEnabled = false
			//2.换第一句话的图片
			this.changePop(1);
			Manager.DelayManager.get().addDelay(500, () => {
				MUSIC4.get().play("introduction1")
				if (this.talkNum == 1) {
					//如果只是播放一个题目框，则立即恢复点击可切断
					this.touchChildren = true
					this.touchEnabled = true
					//第一段声音播完则动画停住
					MUSIC4.get().addEvent("introduction1", () => {
						this.dr.getarmature("说话").armature.animation.gotoAndStopByFrame(this.animLoop, 0)
					}, this)
				} else if (this.talkNum == 2) {
					//如果播放多个板子，则在第一个声音播放完后播放下一个板子的声音和动画
					MUSIC4.get().addEvent("introduction1", () => {
						//2.换第一句话的图片
						this.changePop(2)
						MUSIC4.get().play("introduction2")
						this.touchChildren = true
						this.touchEnabled = true
						MUSIC4.get().addEvent("introduction2", () => {
							this.dr.getarmature("说话").armature.animation.gotoAndStopByFrame(this.animLoop, 0)
						}, this)
					}, this)
				}
			})
			//自动播放弹出
			if (this.gameName == "东东") {
				this.dr.playAnimation("说话", this.animStart, this.touchGroup, 1, 0.5, 0.5, 1, 300, 1080)
			} else if (this.gameName == "小王子") {
				this.dr.playAnimation("说话", this.animStart, this.touchGroup, 1, 1, 1, 1, 0, -100)
			} else if (this.gameName == "仓颉") {
				this.dr.playAnimation("说话", this.animStart, this.touchGroup, 1, 1, 1, 1, 300, 1080)
			} else if (this.gameName == "小侦探") {
				this.dr.playAnimation("说话", this.animStart, this.touchGroup, 1, 1, 1, 1)
			} else if (this.gameName == "仓颉女友") {
				this.dr.playAnimation("说话", this.animStart, this.touchGroup, 1, 1, 1, 1, -100, 480)
			}
			Manager.EventManager.get().addListener("Introduction", this, egret.TouchEvent.TOUCH_TAP, () => {
				// 点击声音
				MUSIC4.get().play("dianji");
				// 停止介绍
				MUSIC4.get().stop("introduction1");
				MUSIC4.get().stop("introduction2");
				// 隐藏介绍界面
				Hierarchy.MessageManager.get().hide("Introduction");
				// 开始第一题
				Hierarchy.AbManager.get().getOne("Scene1").showNextQuestion();
			}, this);
		}

	}
}