class cores extends eui.Component implements eui.UIComponent {
	private static st: cores = null;//单例存储
	public dg: DRAGONBONES;//龙骨调用类
	public pr: PARTICLE;//特效调用类
	index: z.index;
	public changjing2: changjing2;
	public music2: music2;

	constructor() {
		super();
		this.dg = DRAGONBONES.getinstance();
		this.pr = PARTICLE.getinstance();
		this.index = new z.index();
		this.changjing2 = new changjing2(this.index);
		this.addChild(this.changjing2);
		this.changjing2.to(this.index);
	}







	/**
	 * 随机数组内元素顺序
	 */
	public suijishunxubyarr(arr) {
		let newarr: Array<any> = new Array<any>()
		let oldarr: Array<any> = new Array<any>()
		oldarr = [...arr]
		for (let i = 0; i < arr.length; i++) {
			let rodow = this.getsuiji(0, oldarr.length - 1)
			newarr.push(oldarr[rodow])
			oldarr.splice(rodow, 1)
		}
		return newarr
	}


	/**
	 * 从指定数组随机出几个值并组成新数组(返回值为原元素类型)
	 * arr:源数组
	 * num:要几个随机元素
	 */
	public suiji(arr: Array<any>, num: number) {
		let arrold: Array<any> = new Array<any>();
		arrold = [...arr];
		let arrnew: Array<any> = new Array<any>();
		for (let i = 0; i < num; i++) {
			let rodow = cores.getinstatic().getsuiji(0, arrold.length - 1);//产生随机数用作下标 
			arrnew.push(arrold[rodow]);
			arrold.splice(rodow, 1);
		}
		return arrnew;
	}


	/**
	 * 从指定数组随机出几个值并组成新数组(返回值为原元素类型)
	 * arr:源数组
	 * min:最小个数
	 * max:最大个数
	 */
	public suijifanwei(arr: Array<any>, min: number, max: number) {
		let arrold: Array<any> = new Array<any>();
		let arrnew: Array<any> = new Array<any>();
		arrold = [...arr];
		let num = this.getsuiji(min, max);
		for (let i = 0; i < num; i++) {
			let rodow = cores.getinstatic().getsuiji(0, arrold.length - 1);//产生随机数用作下标 
			arrnew.push(arrold[rodow]);
			arrold.splice(rodow, 1);
		}
		return arrnew;
	}


	/**
	 * 获取范围内随机整数
	 */
	public getsuiji(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min)

	}
	/**
     * 获取范围内随机小数
	 */
	public getsuijixiaoshu(min: number, max: number): number {
		return (Math.random() * (max - min + 1) + min)

	}


	/**
	 * 去掉滤镜
	 */
	remfilter(img) {
		img.filters = [];
	}


	/**
	 * 任意颜色滤镜
	 */
	lvjin_any(an, colori) {
		var color: number = colori;        /// 光晕的颜色，十六进制，不包含透明度
		var alpha: number = 0.8;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
		var blurX: number = 35;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
		var blurY: number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
		var strength: number = 5;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		var quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		var inner: boolean = true;            /// 指定发光是否为内侧发光
		var knockout: boolean = false;            /// 指定对象是否具有挖空效果
		var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY,
			strength, quality, inner, knockout);
		an.filters = [glowFilter];
	}



	/**
	 * 添加滤镜(红绿)
	 */
	lvjin_red_green(img, boo) {
		let ss;
		if (boo == false) {
			ss = 0xF92727
		} else {
			ss = 0x07F237
		}
		var color: number = ss;        /// 光晕的颜色，十六进制，不包含透明度
		var alpha: number = 0.8;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
		var blurX: number = 35;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
		var blurY: number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
		var strength: number = 5;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		var quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		var inner: boolean = true;            /// 指定发光是否为内侧发光
		var knockout: boolean = false;            /// 指定对象是否具有挖空效果
		var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY,
			strength, quality, inner, knockout);
		img.filters = [glowFilter];
	}
	public static getinstatic(): cores {
		if (this.st == null) {
			this.st = new cores();
		}
		return this.st;
	}



}