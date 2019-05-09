module z {
	//第一题的题单件
	export class ti1 extends eui.Component implements eui.UIComponent {
		public group: eui.Group;//字组
		Arr: Array<string> = new Array<string>()//存储真字的数组
		Arr_jia: Array<string> = new Array<string>()//存储假字的数组
		Arr_zu: Array<string> = new Array<string>()//存储全部字的数组
		Arr_cuo: Array<number> = new Array<number>()//存储答错的题目
		page: number//当前第几题
		okZi: string//当前正确的字
		public constructor(com) {
			super();
			com.addChild(this)
		}
		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.onceInit();

		}
		//唯一初始化
		private onceInit() {
			this.create_zhen();//唯一生成真字组
		}
		//初始化
		init() {
			this.Arr = cores.getinstatic().suijishunxubyarr(this.Arr);//随机
			this.Arr_cuo = []//清空错误组
			this.page = 0;
			this.create_jia()//每次生成假的字组
			this.chuti()//出题
		}
		//生成假字组
		private create_jia() {
			this.Arr_jia = [];
			let str = "个山了牙左右上下风口不住进去气也力天鸟草时你我自己奶白绿蓝云雨叶儿飞的是对老师早美亮走西全第中几书包好明当心要课睡";
			for (let i = 0; i < str.length; i++) {
				this.Arr_jia.push(str.charAt(i))
			}
			this.Arr_jia = cores.getinstatic().suijishunxubyarr(this.Arr_jia);//随机
		}
		//唯一生成真字组
		private create_zhen() {
			this.Arr = ["爸", "大", "关", "开", "妈", "朋", "小", "友", "长"];
			this.Arr = cores.getinstatic().suijishunxubyarr(this.Arr);//随机
		}
		chuti() {
			egret.Tween.get(this.group).to({ alpha: 1 }, 1000).call(() => {
				this.touchChildren = true
				cores.getinstatic().index.main.remusic.touchEnabled = true
			})
			this.touchChildren = false
			cores.getinstatic().index.main.remusic.touchEnabled = false
			cores.getinstatic().index.page1.dazi.init()
			this.group.removeChildren()
			this.Arr_zu = []//重置当前组
			this.okZi = this.Arr[this.page]
			this.Arr_zu.push(this.okZi)
			this.Arr_zu.push(this.Arr_jia.shift())
			this.Arr_zu.push(this.Arr_jia.shift())
			this.Arr_zu.push(this.Arr_jia.shift())
			this.Arr_zu = cores.getinstatic().suijishunxubyarr(this.Arr_zu);//随机
			this.Arr_zu.forEach((v, i) => {
				let zis: z.zi1 = new z.zi1(v)
				this.group.addChild(zis)
				zis.x = zis.width * i + 7
				if (i == 0) {
					zis.y = 17.2
				}
				if (i == 1) {
					zis.y = 21.2
				}
				if (i == 2) {
					zis.y = 17.0
				}
				if (i == 3) {
					zis.y = 11.5
				}
			})
			this.page += 1;
			cores.getinstatic().index.page1.duti.du(cores.getinstatic().index.page1.ti.okZi)

		}



	}
}