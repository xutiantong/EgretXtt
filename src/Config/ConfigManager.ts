module Hierarchy {
	/**
	 * 配置管理器
	 */
	export class ConfigManager extends eui.Component implements eui.UIComponent {
		static D: ConfigManager = null;
		public constructor() {
			super()

		}
		protected childrenCreated(): void {
			this.config()
		}
		//配置
		private config() {
			//1.注册声音
			var musicArr = ["bg", "dianji", "err", "correct", "introduction", "talk_correct", "talk_wrong", "eraser"];
			let config = RES.getRes("ti_json");
			for (let i = 0; i <= 189; i++) {
				musicArr.push(config[i].zimu + "_" + config[i].shengdiao);
			}
			MUSIC4.get().init(musicArr);
			//2.注册层级
			this.addChildAt(Hierarchy.BottomManager.get(), 0);
			this.addChildAt(Hierarchy.AbManager.get(), 1);
			this.addChildAt(Hierarchy.MenuManager.get(), 2);
			this.addChildAt(Hierarchy.MessageManager.get(), 3);
			this.addChildAt(Hierarchy.GuideManager.get(), 4);
			//3.注册组件
			Hierarchy.AbManager.get().init([
				{ name: "Start", obj: new Assembly.Start() },
				{ name: "Scene1", obj: new Assembly.Scene1() },
				{ name: "CuoTiBen", obj: new Assembly.CuoTiBen() }

			]);
			//4.注册消息提示
			Hierarchy.MessageManager.get().init([
				{ name: "Introduction", obj: new Assembly.Introduction() }
			]);
			//5.初始化全局变量
			Manager.GlobalManager.get();
			//6.默认起始组件
			Hierarchy.AbManager.get().show("Start");
			MUSIC4.get().play("bg", -1)

		}
		//单例
		static get(): ConfigManager {
			if (this.D == null) {
				this.D = new ConfigManager()
			}
			return this.D;
		}

	}
}