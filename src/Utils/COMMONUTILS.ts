/**
 * 常用方法合集
 * (都需要重新指向)
 */
class COMMONUTILS {

	static st: COMMONUTILS = null
	Arr: Array<any> = new Array<any>()//存储滤镜对象

	constructor() {

	}

	/**
	 * 截屏并保存到指定路径
	 * 传入参数为现实对象
	 * 截屏可选择截屏区域 
	 * @todo 老方法，废弃，有需要再重新写
	 * @param com 
	 */
	screenShot(com: any) {
		// let render = new egret.RenderTexture();
		// let rootLayer = com;
		// render.drawToTexture(com);
		// //获取到文件流
		// let base64Str = render.toDataURL("image/png");
		// //保存到bitmap
		// let bitmap: egret.Bitmap = new egret.Bitmap();
		// //保存到电脑
		// render.saveToFile("image/png", "aa.png");
	}

	/**
	 * 是否是汉字
	 * @param temp 字符
	 */
	isChinese(temp: string) {
		var re: RegExp = new RegExp('[^\\u4e00-\\u9fa5]');
		if (re.test(temp)) return false;
		return true;
	}

	/**
	 * 获取当前客户端时间
	 */
	getTimeNow(): string {
		let now = new Date();
		let nowYear = now.getFullYear();
		let nowMonth = now.getMonth() + 1;
		let nowweekday = now.getDate();
		let nowMonths: string | number;
		let nowweekdays: string | number;
		if (nowMonth < 10) {
			nowMonths = "0" + nowMonth;
		} else {
			nowMonths = nowMonth;
		}
		if (nowweekday < 10) {
			nowweekdays = "0" + nowweekday;
		} else {
			nowweekdays = nowweekday;
		}
		let hh = now.getHours();            //时
		let mm = now.getMinutes();          //分
		let ss = now.getSeconds();           //秒
		let hhs: string | number, mms: string | number, sss: string | number;
		if (hh < 10) {
			hhs = "0" + hh;
		} else {
			hhs = hh;
		}
		if (mm < 10) {
			mms = "0" + mm;
		} else {
			mms = mm;
		}
		if (ss < 10) {
			sss = "0" + ss;
		} else {
			sss = ss;
		}
		return nowYear + "-" + nowMonths + "-" + nowweekdays + "  " + hhs + ":" + mms + ":" + sss;
	}

	/**
	 * 全部替换
	 * @param str 替换字符串
	 * @param searchValue 被替换内容
	 * @param replaceValue　要替换内容
	 */
	public replaceAll(str: string, searchValue: string, replaceValue: string) {
		var reg = new RegExp(searchValue, "g"); //创建正则RegExp对象   
		str = str.replace(reg, replaceValue);
		return str
	}

	/**
	 * 添加灰度化
	 */
	public addColorMatrix(obj: { filters: egret.ColorMatrixFilter[]; }) {
		var colorMatrix = [
			0.3, 0.9, 0, 0,
			0, 0.3, 0.9, 0,
			0, 0, 0.3, 0.9,
			0, 0, 0, 0,
			0, 0, 1, 0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
		obj.filters = [colorFlilter];
		this.Arr.push(obj)
	}


	/**
	 * 随机数组内元素顺序
	 */
	public randomArrOrder(arr: any[]) {
		let newArr: Array<any> = new Array<any>();
		let oldArr: Array<any> = new Array<any>();
		oldArr = [...arr];
		for (let i = 0; i < arr.length; i++) {
			let random = this.getRandomNum(0, oldArr.length - 1);
			newArr.push(oldArr[random]);
			oldArr.splice(random, 1);
		}
		return newArr;
	}

	/**
	 * 从指定数组随机出几个值并组成新数组(返回值为原元素类型)
	 * @param arr:源数组
	 * @param num:要几个随机元素
	 */
	public randomNewArr(arr: Array<any>, num: number) {
		let arrOld: Array<any> = new Array<any>();
		arrOld = [...arr];
		let arrNew: Array<any> = new Array<any>();
		for (let i = 0; i < num; i++) {
			let random = COMMONUTILS.get().getRandomNum(0, arrOld.length - 1);//产生随机数用作下标 
			arrNew.push(arrOld[random]);
			arrOld.splice(random, 1);
		}
		return arrNew;
	}

	/**
	 * 获取范围内随机整数
	 * @param min 最小值
	 * @param max 最大值
	 */
	public getRandomNum(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	/**
	 * 去掉滤镜
	 */
	removefilter(obj = null) {
		if (obj == null) {
			this.Arr.forEach((v) => {
				v.filters = [];
			})
		} else {
			obj.filters = [];
		}
	}

	/**
	 * 任意颜色滤镜
	 * @param obj 对象
	 * @param color 滤镜颜色
	 * @param alpha 透明度
	 */
	addFilter(obj: { filters: egret.GlowFilter[]; }, color: number, alpha = 0.8) {
		var color: number = color;        							// 光晕的颜色，十六进制，不包含透明度
		var alpha: number = alpha;             						// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
		var blurX: number = 35;             						// 水平模糊量。有效值为 0 到 255.0（浮点）
		var blurY: number = 35;              						// 垂直模糊量。有效值为 0 到 255.0（浮点）
		var strength: number = 5;           						// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		var quality: number = egret.BitmapFilterQuality.HIGH;       // 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		var inner: boolean = false;            						// 指定发光是否为内侧发光
		var knockout: boolean = false;            					// 指定对象是否具有挖空效果
		var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
		obj.filters = [glowFilter];
	}

	/**
	 * 添加滤镜(红绿)
	 * @param obj 对象
	 * @param boo 红绿选择
	 */
	addGreenRedFilter(obj: any, boo: boolean) {
		let ss: number;
		if (boo == false) {
			ss = 0xF92727;
		} else {
			ss = 0x07F237;
		}
		var color: number = ss;                   					 // 光晕的颜色，十六进制，不包含透明度
		var alpha: number = 0.8;                     				 // 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
		var blurX: number = 35;                     			     // 水平模糊量。有效值为 0 到 255.0（浮点）
		var blurY: number = 35;                     			     // 垂直模糊量。有效值为 0 到 255.0（浮点）
		var strength: number = 5;                     			     // 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		var quality: number = egret.BitmapFilterQuality.HIGH;        // 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		var inner: boolean = false;           						 // 指定发光是否为内侧发光
		var knockout: boolean = false;         					     // 指定对象是否具有挖空效果
		var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
		obj.filters = [glowFilter];
	}

	/**
	 * 查找字符串中字符第几次出现的位置
	 * @param str 字符串
	 * @param cha 字符
	 * @param num 第几次（第一次为0，第二次为1，以此类推）
	 */
	find(str: string, cha: string, num: number) {
		var x = str.indexOf(cha);
		for (var i = 0; i < num; i++) {
			x = str.indexOf(cha, x + 1);
		}
		return x;
	}

	/**
	 * 替换字符串中指定位置内容
	 * @param text 字符串
	 * @param start 开始位置
	 * @param stop 结束位置
	 * @param replaceText 替换内容
	 */
	replacePos(text: string, start: number, stop: number, replaceText: string) {
		let myStr = text.substring(0, start) + replaceText + text.substring(stop);
		return myStr;
	}

	/**
	 * 处理中文引号换行问题（临时方法并不完善，使用时可根据情况修改）
	 * @param text 字符串
	 * @param start 开始位置（第二行第一个字的下标，第一行可能涉及句子开头空两格，就是7个空格7个字符）
	 * @param num 每行能显示的字数
	 */
	fixText(text: string, start: number, num: number) {
		let length = text.length;
		let fixText = "";
		let pos = start;
		while (length >= pos) {
			let str = text.substr(pos, 1);
			if (str == "”" && text.substr(pos - 2, 1) == "“") {
				fixText += text.slice(0, pos - 2) + "\n";
				text = text.slice(pos - 2);
				pos = num;
			} else if ((str == "，" || str == "。") && text.substr(pos - 1, 1) == "”" && text.substr(pos - 3, 1) == "“") {
				fixText += text.slice(0, pos - 3) + "\n";
				text = text.slice(pos - 3);
				pos = num;
			} else if ((str == "，" || str == "。") && text.substr(pos - 1, 1) == "”") {
				fixText += text.slice(0, pos - 2);
				text = text.slice(pos - 2);
				pos = num;
			} else if (text.substr(pos - 1, 1) == "“") {
				fixText += text.slice(0, pos - 1) + "\n";
				text = text.slice(pos - 1);
				pos = num;
			} else {
				pos += num;
			}
		}
		fixText += text;
		return fixText;
	}

	public static get(): COMMONUTILS {
		if (this.st == null) {
			this.st = new COMMONUTILS();
		}
		return this.st;
	}
}