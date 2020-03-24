/**
 * 常用方法合集
 */
namespace COMMONUTILS {

	/**
	 * 是否是汉字
	 * @param temp 字符
	 */
	export function isChinese(temp: string) {
		var re: RegExp = new RegExp('[^\\u4e00-\\u9fa5]');
		if (re.test(temp)) return false;
		return true;
	}

	/**
	 * 是否为数字
	 * @param val 字符 
	 */
	export function isNumber(val: string) {
		var regPos = /^\d+(\.\d+)?$/; //非负浮点数
		var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
		if (regPos.test(val) || regNeg.test(val)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 是否有数字
	 * @param val 字符
	 */
	export function haveNumber(val: string) {
		var regPos = /\d+/;
		if (regPos.test(val)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 添加灰度化
	 * @param obj 对象
	 */
	export function addColorMatrix(obj: any) {
		var colorMatrix = [
			0.3, 0.9, 0, 0, 0,
			0.3, 0.9, 0, 0, 0,
			0.3, 0.9, 0, 0, 0,
			0, 0, 0, 1, 0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
		obj.filters = [colorFlilter];
	}

	/**
	 * 随机数组内元素顺序
	 * @param arr 数组
	 */
	export function randomArrOrder(arr: any[]) {
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
	export function randomNewArr(arr: Array<any>, num: number) {
		let arrOld: Array<any> = new Array<any>();
		arrOld = [...arr];
		let arrNew: Array<any> = new Array<any>();
		for (let i = 0; i < num; i++) {
			let random = COMMONUTILS.getRandomNum(0, arrOld.length - 1);//产生随机数用作下标 
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
	export function getRandomNum(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	/**
	 * 任意颜色滤镜
	 * @param obj 对象
	 * @param color 滤镜颜色
	 * @param alpha 透明度
	 */
	export function addFilter(obj: any, color: number, alpha = 0.8) {
		var color: number = color;        							// 光晕的颜色，十六进制，不包含透明度
		var alpha: number = alpha;             						// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
		var blurX: number = 15;             						// 水平模糊量。有效值为 0 到 255.0（浮点）
		var blurY: number = 15;              						// 垂直模糊量。有效值为 0 到 255.0（浮点）
		var strength: number = 5;           						// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		var quality: number = egret.BitmapFilterQuality.HIGH;       // 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		var inner: boolean = true;            						// 指定发光是否为内侧发光
		var knockout: boolean = false;            					// 指定对象是否具有挖空效果
		var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
		obj.filters = [glowFilter];
	}

	/**
	 * 生成拼音上标、标红、前引号不在句尾，其他符号不在句首的句子
	 * @version 1.0
	 * @param group 插入父节点
	 * @param txt 内容
	 * @param labelData 字体格式
	 * @param wordNum 每行字数
	 * @param pinyinData 拼音格式
	 * @param isParagraph 是否需要空两格
	 * @param isCenter 是否需要居中
	 * @todo 可根据实际情况自己调整
	 */
	export function generateText(group: eui.Group, txt: string, labelData: any, wordNum: number, pinyinData: any, isParagraph: boolean = true, isCenter: boolean = false, specialColor: string = 'cc3300') {
		group.removeChildren();
		txt = txt.replace(/（）/g, "_");
		let pinyinList = [];
		let redList = [];
		while (txt.indexOf("（") != -1 || txt.indexOf("<") != -1) {
			if ((txt.indexOf("（") >= 0 && txt.indexOf("<") >= 0 && txt.indexOf("（") < txt.indexOf("<")) || txt.indexOf("<") == -1) {
				let content = txt.substring(txt.indexOf("（") + 1, txt.indexOf("）"));
				let last = false
				if (pinyinList.length > 0 && pinyinList[pinyinList.length - 1].word == txt.charAt(txt.indexOf("（") - 1)) {
					last = true;
				}
				pinyinList.push({ content: content, word: txt.charAt(txt.indexOf("（") - 1), last: last });
				txt = txt.substring(0, txt.indexOf("（")) + txt.substring(txt.indexOf("）") + 1);
			} else {
				let content = txt.substring(txt.indexOf("<") + 1, txt.indexOf(">"))
				while (content.indexOf("（") != -1) {
					content = content.substring(0, content.indexOf("（")) + content.substring(content.indexOf("）") + 1);
				}
				redList.push(content);
				txt = txt.replace("<", "");
				txt = txt.replace(">", "");
			}
		}
		let lineNum = 1;
		let labelList = [];
		let times = (txt.length + 2 / wordNum) + 1;
		for (let i = 0; i < times; i++) {
			let label = new eui.Label();
			labelList.push(label);
			label.textColor = labelData.textColor;
			label.fontFamily = labelData.fontFamily;
			label.size = labelData.fontSize;
			label.stroke = labelData.stroke;
			label.strokeColor = labelData.strokeColor;
			if (lineNum == 1 && isParagraph) {
				label.text = "        ";
			}
			let len = 0;
			let len2 = 0;
			while (len < ((lineNum == 1 && isParagraph) ? wordNum - 2 : wordNum) && len < txt.length) {
				label.text += txt[len2] != undefined ? txt[len2] : "";
				len += COMMONUTILS.isNumber(txt[len2]) ? 0.55 : txt[len2] == "." ? 0.3 : 1;
				len2 += 1;
			}
			len = label.text.length;
			len2 = label.text.length - ((lineNum == 1 && isParagraph) ? 8 : 0);
			if (label.text.charAt(len - 1) == "“") {
				label.text = label.text.substr(0, len - 1);
				txt = txt.substr(len2 - 1);
			} else if (txt.charAt(len2) == "。" || txt.charAt(len2) == "，" || txt.charAt(len2) == "？" || txt.charAt(len2) == "！"
				|| txt.charAt(len2) == "：" || txt.charAt(len2) == "”" || txt.charAt(len2) == "、" || txt.charAt(len2) == "；") {
				if (label.text.charAt(len - 1) == "。" || label.text.charAt(len - 1) == "，" || label.text.charAt(len - 1) == "？" || label.text.charAt(len - 1) == "！"
					|| label.text.charAt(len - 1) == "：" || label.text.charAt(len - 1) == "”" || label.text.charAt(len - 1) == "、" || label.text.charAt(len - 1) == "；") {
					label.text = label.text.substr(0, len - 2);
					txt = txt.substr(len2 - 2);
				} else {
					label.text = label.text.substr(0, len - 1);
					txt = txt.substr(len2 - 1);
				}
			} else {
				txt = txt.substr(len2);
			}
			if (label.text == "") {
				labelList.pop();
				continue;
			}
			group.addChild(label);
			label.x = 0;
			let havePinyin = false;
			for (let j = 0; j < pinyinList.length; j++) {
				if (label.text.indexOf(pinyinList[j].word) >= 0) {
					havePinyin = true;
					break;
				}
			}
			if (lineNum == 1) {
				label.y = 0;
			} else {
				label.y = labelList[lineNum - 2].y + (havePinyin ? (pinyinData.pSize + 10) : labelData.lineSpacing) + labelData.fontSize;
			}
			lineNum += 1;
		}
		// 添加拼音和标红
		labelList.forEach((v, line) => {
			pinyinList.forEach((vv) => {
				if (v.text.indexOf(vv.word) >= 0) {
					let pLabel = new eui.Label(vv.content);
					pLabel.size = pinyinData.pSize;
					pLabel.textColor = pinyinData.textColor;
					pLabel.stroke = pinyinData.stroke;
					pLabel.strokeColor = pinyinData.strokeColor;
					pLabel.fontFamily = "z3";
					pLabel.height = pinyinData.pSize + 10;
					pLabel.width = (pLabel.text.length + 1) * pinyinData.pSize;
					pLabel.textAlign = egret.HorizontalAlign.CENTER;
					pLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
					pLabel.anchorOffsetX = pLabel.width / 2;
					group.addChild(pLabel);
					pLabel.x = labelData.fontSize * 0.5 + labelData.fontSize * ((line == 0 && isParagraph) ? v.text.indexOf(vv.word) - 5.8 : v.text.indexOf(vv.word));
					if (line != 0 && COMMONUTILS.haveNumber(v.text)) {
						let len = 0;
						for (let i = 0; i < v.text.length; i++) {
							if (v.text[i] == vv.word) {
								len += this.isNumber(v.text[i]) ? 0.55 : (v.text[i] == ".") ? 0.3 : 1;
								break;
							}
							len += this.isNumber(v.text[i]) ? 0.55 : (v.text[i] == ".") ? 0.3 : 1;
						}
						pLabel.x = labelData.fontSize * (len - 0.5);
					}
					// if (vv.last) {
					// 	pLabel.x = labelData.fontSize * 0.5 + labelData.fontSize * ((line == 0 && isParagraph) ? v.text.lastIndexOf(vv.word) - 5.1 : v.text.lastIndexOf(vv.word));
					// }
					pLabel.y = v.y - 5 - pLabel.height;
				}
			});
			let newText = v.text;
			for (let i = 0; i < redList.length; i++) {
				let samePart = newText.split("").filter((item: any) => redList[i].split("").includes(item));
				if (samePart.length < redList[i].length && (newText.indexOf(samePart[0]) != 0 && newText.indexOf(samePart[0]) != newText.length - 1)) {
					continue;
				}
				let xx = samePart.join("");
				if (samePart.length > redList[i].length) {
					xx = redList[i];
				}
				newText = newText.replace(new RegExp(xx, "g"), "<font color='#" + specialColor + "'>" + xx + "</font>");
			}
			newText = newText.replace(/_/g, "__");
			v.textFlow = (new egret.HtmlTextParser).parser(newText);
			if (isCenter) {
				group.width = v.width != 0 ? v.width : group.width;
				group.anchorOffsetX = group.width / 2;
			}
		});
	}

}