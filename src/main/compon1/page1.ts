module z {
	//第一题的主页
	export class page1 extends eui.Component implements eui.UIComponent {
		public animGroup: eui.Group;
		public tiGroup: eui.Group;
		public daziGroup: eui.Group;
		public dutiGroup: eui.Group;
		public xueGroup: eui.Group;

		//----------------------组件区
		ti: z.ti1//出题组件
		dazi: z.dazi//大图组件
		duti: z.duti//读题组件
		xue: z.xue//血条组件
		public constructor(com) {
			super();
			com.addChild(this);
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			DRAGONBONES.getinstance().playAnimation("关卡1背景动画", "huodonghua", "关卡1背景动画动画分组", this.animGroup, 0);
			this.ti = new z.ti1(this.tiGroup);
			this.dazi = new z.dazi(this.daziGroup);
			this.duti = new z.duti(this.dutiGroup);
			this.xue = new z.xue(this.xueGroup);
		}

		//初始化
		init() {
			DRAGONBONES.getinstance().playAnimation("仓颉正面", "zhanli", "仓颉分组", this.daziGroup, 0)
			DRAGONBONES.getinstance().getarmature("仓颉正面").x = 248
			DRAGONBONES.getinstance().getarmature("仓颉正面").y = 980
			this.daziGroup.addChild(DRAGONBONES.getinstance().getarmature("仓颉写字"))
			DRAGONBONES.getinstance().getarmature("仓颉写字").x = 248
			DRAGONBONES.getinstance().getarmature("仓颉写字").y = 980
			DRAGONBONES.getinstance().getarmature("仓颉写字").visible = false
			this.ti.init()
			this.xue.init()
			this.dazi.img.alpha = 0

		}
	}
}