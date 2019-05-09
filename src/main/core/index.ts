module z {
	//主页
	export class index extends eui.Component implements eui.UIComponent {
		music2: music2;
		public successGroup: eui.Group;
		public shibaiGroup: eui.Group;
		shibai: z.shibai;
		success: z.success;
		//第三关---------------
		public pageGroup3: eui.Group;
		//第二关---------------
		public pageGroup2: eui.Group;
		//第一关---------------
		public pageGroup1: eui.Group;
		page1: z.page1;
		//菜单页---------------
		main: yuwen.main;//菜单页
		public mainGroup: eui.Group;
		//关卡页---------------
		public guankaGroup: eui.Group;
		guanka: z.guanka;
		//游戏开始进入页-----------------
		public startGroup: eui.Group;
		public startAnimGroup: eui.Group;
		public start: eui.Image;
		//声音---------------------
		cangjieen_sound: egret.Sound = RES.getRes("cangjieen_mp3");
		yutupaopao_sound: egret.Sound = RES.getRes("yutupaopao_mp3");
		jianxiao_sound: egret.Sound = RES.getRes("jianxiao_mp3");
		luoxia_sound: egret.Sound = RES.getRes("luoxia_mp3");
		qipao_sound: egret.Sound = RES.getRes("qipao_mp3");
		ba_sound: egret.Sound = RES.getRes("mba_mp3");
		bu_sound: egret.Sound = RES.getRes("mbu_mp3");
		da_sound: egret.Sound = RES.getRes("mda_mp3");
		feng_sound: egret.Sound = RES.getRes("mfeng_mp3");
		ge_sound: egret.Sound = RES.getRes("mge_mp3");
		guan_sound: egret.Sound = RES.getRes("mguan_mp3");
		jin_sound: egret.Sound = RES.getRes("mjin_mp3");
		kai_sound: egret.Sound = RES.getRes("mkai_mp3");
		liao_sound: egret.Sound = RES.getRes("mliao_mp3");
		ma_sound: egret.Sound = RES.getRes("mma_mp3");
		peng_sound: egret.Sound = RES.getRes("mpeng_mp3");
		qi_sound: egret.Sound = RES.getRes("mqi_mp3");
		qu_sound: egret.Sound = RES.getRes("mqu_mp3");
		shang_sound: egret.Sound = RES.getRes("mshang_mp3");
		sheng_sound: egret.Sound = RES.getRes("msheng_mp3");
		xia_sound: egret.Sound = RES.getRes("mxia_mp3");
		xiao_sound: egret.Sound = RES.getRes("mxiao_mp3");
		ye_sound: egret.Sound = RES.getRes("mye_mp3");
		you3_sound: egret.Sound = RES.getRes("myou3_mp3");
		you4_sound: egret.Sound = RES.getRes("myou4_mp3");
		zhang_sound: egret.Sound = RES.getRes("mzhang_mp3");
		zhu_sound: egret.Sound = RES.getRes("mzhu_mp3");
		zuo_sound: egret.Sound = RES.getRes("mzuo_mp3");
		hanzi_sound: egret.Sound = RES.getRes("hanzi_mp3");
		bg_sound: egret.Sound = RES.getRes("bg_mp3");
		again_sound: egret.Sound = RES.getRes("again_mp3");
		dianji_sound: egret.Sound = RES.getRes("dianji_mp3");
		err_sound: egret.Sound = RES.getRes("err_mp3");
		tiaozhan_sound: egret.Sound = RES.getRes("tiaozhan_mp3");
		xiezi_sound: egret.Sound = RES.getRes("xiezi_mp3");
		laoyu_sound: egret.Sound = RES.getRes("laoyu_mp3");
		jinchang_sound: egret.Sound = RES.getRes("jinchang_mp3");
		xiaoshi_sound: egret.Sound = RES.getRes("xiaoshi_mp3");
		guanka_sound: egret.Sound = RES.getRes("guanka_mp3");
		jiaobu_sound: egret.Sound = RES.getRes("jiaobu_mp3");
		public constructor() {
			super();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			this.onceInit();//全局唯一加载
			this.init()//即时初始化


		}

		private onceInit() {
			this.loadDR()//初次唯一加载动画资源
			this.listen()//初次唯一监听
			this.oneTime();//初次唯一操作
			this.music2.play(this.bg_sound, -1)




		}



		/**
		 * 多次初始化时调用
		 */
		init() {
			this.successGroup.visible = false
			this.shibaiGroup.visible = false
		}
		//去往关卡
		GO_guanka() {
			//去往关卡前重置所有
			if (cores.getinstatic().index.guanka.guanka_now != null) {
				cores.getinstatic().index.guanka.guanka_now.duti.last != null ? cores.getinstatic().index.guanka.guanka_now.duti.last.stop() : 1 + 1 == 2
			}
			this.guankaGroup.visible = true;
			this.guanka.welcome();
		}

		//去成功界面
		GO_success(page) {
			cores.getinstatic().index.music2.play(cores.getinstatic().index.tiaozhan_sound)
			this.successGroup.visible = true
			this.success.init(page)
		}
		//去失败界面
		GO_shibai() {
			cores.getinstatic().index.music2.play(cores.getinstatic().index.again_sound)
			this.shibaiGroup.visible = true
			this.shibai.init()
		}

		//点击监听
		private touch(e: egret.TouchEvent) {
			this.music2.play(this.dianji_sound)
			switch (e.target) {
				case this.start:
					this.startGroup.visible = false
					this.GO_guanka()//去往关卡页面
					break;
				default:
					break;
			}
		}
		//唯一监听
		private listen() {
			this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);

		}
		//唯一操作
		private oneTime() {
			this.music2 = new music2(this.jiaobu_sound, this.cangjieen_sound, this.guanka_sound, this.yutupaopao_sound, this.laoyu_sound, this.jinchang_sound, this.xiaoshi_sound, this.jianxiao_sound, this.luoxia_sound, this.qipao_sound, this.hanzi_sound, this.bg_sound, this.again_sound, this.dianji_sound, this.err_sound, this.tiaozhan_sound, this.xiezi_sound, this.ba_sound, this.bu_sound, this.da_sound, this.feng_sound, this.ge_sound, this.guan_sound, this.jin_sound, this.kai_sound, this.liao_sound, this.liao_sound, this.ma_sound, this.peng_sound, this.qi_sound,
				this.qu_sound, this.shang_sound, this.sheng_sound, this.xia_sound, this.xiao_sound, this.ye_sound, this.you3_sound, this.you4_sound, this.zhang_sound, this.zhu_sound, this.zuo_sound)
			DRAGONBONES.getinstance().playAnimation("开始动画", "startanimation", "开始动画分组", this.startAnimGroup, 1)
			this.main = new yuwen.main(this.mainGroup);
			this.guanka = new z.guanka(this.guankaGroup);
			this.page1 = new z.page1(this.pageGroup1);
			this.success = new z.success(this.successGroup);
			this.shibai = new z.shibai(this.shibaiGroup);

		}
		//唯一加载动画
		private loadDR() {
			//木板动画-----------
			DRAGONBONES.getinstance().addToFactory("mubandonghua_ske_json", "mubandonghua_tex_json", "mubandonghua_tex_png");
			DRAGONBONES.getinstance().initArmature("木板动画", "mubandonghua");
			//开始动画-----------
			DRAGONBONES.getinstance().addToFactory("startgame_ske_json", "startgame_tex_json", "startgame_tex_png");
			DRAGONBONES.getinstance().initArmature("开始动画", "startgame");	
			//第一关背景动画-----------
			DRAGONBONES.getinstance().addToFactory("bgdonghua_ske_json", "bgdonghua_tex_json", "bgdonghua_tex_png");
			DRAGONBONES.getinstance().initArmature("关卡1背景动画", "bgdonghua");
			//第一关牌子动画-----------
			DRAGONBONES.getinstance().addToFactory("paizi_ske_json", "paizi_tex_json", "paizi_tex_png");
			//仓颉动画-----------
			DRAGONBONES.getinstance().addToFactory("cangjiBodyAnimtaion_ske_json", "cangjiBodyAnimtaion_tex_json", "cangjiBodyAnimtaion_tex_png")
			DRAGONBONES.getinstance().initArmature("仓颉正面", "cangjiBodyAnimtaion");
			DRAGONBONES.getinstance().initArmature("仓颉写字", "xiezi", null, () => {
				DRAGONBONES.getinstance().getarmature("仓颉写字").visible = false
				DRAGONBONES.getinstance().getarmature("仓颉正面").visible = true
				DRAGONBONES.getinstance().getarmature("仓颉正面").x = 248
				DRAGONBONES.getinstance().getarmature("仓颉正面").y = 980
				DRAGONBONES.getinstance().getarmature("仓颉写字").x = 248
				DRAGONBONES.getinstance().getarmature("仓颉写字").y = 980
				DRAGONBONES.getinstance().getarmature("仓颉正面").animation.play("zhanli", 0)
			});



		}









	}
}