window.skins={};
                function __extends(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = undefined;
                generateEUI.skins = {"eui.Button":"resource/eui_skins/ButtonSkin.exml","eui.CheckBox":"resource/eui_skins/CheckBoxSkin.exml","eui.HScrollBar":"resource/eui_skins/HScrollBarSkin.exml","eui.HSlider":"resource/eui_skins/HSliderSkin.exml","eui.Panel":"resource/eui_skins/PanelSkin.exml","eui.TextInput":"resource/eui_skins/TextInputSkin.exml","eui.ProgressBar":"resource/eui_skins/ProgressBarSkin.exml","eui.RadioButton":"resource/eui_skins/RadioButtonSkin.exml","eui.Scroller":"resource/eui_skins/ScrollerSkin.exml","eui.ToggleSwitch":"resource/eui_skins/ToggleSwitchSkin.exml","eui.VScrollBar":"resource/eui_skins/VScrollBarSkin.exml","eui.VSlider":"resource/eui_skins/VSliderSkin.exml","eui.ItemRenderer":"resource/eui_skins/ItemRendererSkin.exml","load":"resource/eui_skins/load/load.exml","z.index":"resource/eui_skins/main/index.exml","z.guanka":"resource/eui_skins/guanka/guanka.exml","z.page1":"resource/eui_skins/page/page1.exml","z.ti1":"resource/eui_skins/ti/ti1.exml","z.zi1":"resource/eui_skins/zi/zi1.exml","z.dazi":"resource/eui_skins/dazi/dazi.exml","success":"resource/eui_skins/jieju/success.exml","shibai":"resource/eui_skins/jieju/shibai.exml","zi":"resource/eui_skins/jieju/zi.exml","main":"resource/eui_skins/jieju/main.exml","xue":"resource/eui_skins/xue/xue.exml"};generateEUI.paths['resource/eui_skins/ButtonSkin.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/CheckBoxSkin.exml'] = window.skins.CheckBoxSkin = (function (_super) {
	__extends(CheckBoxSkin, _super);
	function CheckBoxSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_disabled_png")
				])
		];
	}
	var _proto = CheckBoxSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "checkbox_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return CheckBoxSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/dazi/dazi.exml'] = window.daziSkin = (function (_super) {
	__extends(daziSkin, _super);
	function daziSkin() {
		_super.call(this);
		this.skinParts = ["img"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this.img_i()];
	}
	var _proto = daziSkin.prototype;

	_proto.img_i = function () {
		var t = new eui.Image();
		this.img = t;
		t.horizontalCenter = 0;
		t.source = "da_png";
		t.verticalCenter = 0;
		return t;
	};
	return daziSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/duti/duti.exml'] = window.dutiSkin = (function (_super) {
	__extends(dutiSkin, _super);
	function dutiSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.height = 1080;
		this.width = 1920;
	}
	var _proto = dutiSkin.prototype;

	return dutiSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/guanka/guanka.exml'] = window.guankaSkin = (function (_super) {
	__extends(guankaSkin, _super);
	function guankaSkin() {
		_super.call(this);
		this.skinParts = ["animGroup","guanGroup"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this._Image3_i(),this.animGroup_i(),this.guanGroup_i()];
	}
	var _proto = guankaSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "ditu_jpg";
		t.top = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.source = "youjiantou_png";
		t.x = 8.85;
		t.y = 458.06;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.source = "zuojiantou_png";
		t.x = 1790.54;
		t.y = 472.36;
		return t;
	};
	_proto.animGroup_i = function () {
		var t = new eui.Group();
		this.animGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.guanGroup_i = function () {
		var t = new eui.Group();
		this.guanGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		t.elementsContent = [this._Image4_i(),this._Image5_i(),this._Image6_i(),this._Image7_i(),this._Image8_i(),this._Image9_i()];
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.source = "1_png";
		t.x = 196.76;
		t.y = 655;
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.source = "2_png";
		t.x = 313.26;
		t.y = 240.06;
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		t.source = "3_png";
		t.x = 708.82;
		t.y = 561.15;
		return t;
	};
	_proto._Image7_i = function () {
		var t = new eui.Image();
		t.source = "4_png";
		t.x = 960;
		t.y = 200.67;
		return t;
	};
	_proto._Image8_i = function () {
		var t = new eui.Image();
		t.source = "5_png";
		t.x = 1339.12;
		t.y = 331.09;
		return t;
	};
	_proto._Image9_i = function () {
		var t = new eui.Image();
		t.source = "6_png";
		t.x = 1485.92;
		t.y = 682.27;
		return t;
	};
	return guankaSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HSliderSkin.exml'] = window.skins.HSliderSkin = (function (_super) {
	__extends(HSliderSkin, _super);
	function HSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = HSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.height = 6;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_sb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "thumb_png";
		t.verticalCenter = 0;
		return t;
	};
	return HSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ItemRendererSkin.exml'] = window.skins.ItemRendererSkin = (function (_super) {
	__extends(ItemRendererSkin, _super);
	function ItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text");
	}
	var _proto = ItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	return ItemRendererSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/jieju/main.exml'] = window.main = (function (_super) {
	__extends(main, _super);
	var main$Skin1 = 	(function (_super) {
		__extends(main$Skin1, _super);
		function main$Skin1() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","qiangdadeniukou_02_2_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = main$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "yinyue-anniu_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return main$Skin1;
	})(eui.Skin);

	var main$Skin2 = 	(function (_super) {
		__extends(main$Skin2, _super);
		function main$Skin2() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = main$Skin2.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "anniu-shezhi_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return main$Skin2;
	})(eui.Skin);

	function main() {
		_super.call(this);
		this.skinParts = ["rect","lab","pause","reback","music","group","mains","remusic"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this.rect_i(),this.lab_i(),this._Group1_i(),this.mains_i(),this.remusic_i()];
	}
	var _proto = main.prototype;

	_proto.rect_i = function () {
		var t = new eui.Rect();
		this.rect = t;
		t.bottom = 0;
		t.fillAlpha = 0.5;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.lab_i = function () {
		var t = new eui.Image();
		this.lab = t;
		t.horizontalCenter = 0;
		t.source = "zanting_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 617.21;
		t.scrollEnabled = true;
		t.touchEnabled = false;
		t.width = 114.36;
		t.x = 1792.13;
		t.y = 389.61;
		t.elementsContent = [this.group_i()];
		return t;
	};
	_proto.group_i = function () {
		var t = new eui.Group();
		this.group = t;
		t.anchorOffsetX = 4;
		t.anchorOffsetY = 512;
		t.bottom = 0.21000000000003638;
		t.height = 517;
		t.scaleX = 1;
		t.scaleY = 1;
		t.scrollEnabled = true;
		t.width = 114;
		t.x = 0;
		t.elementsContent = [this._Image1_i(),this.pause_i(),this.reback_i(),this.music_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 112.12;
		t.rotation = 90;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "anniu-di_png";
		t.width = 521.21;
		t.x = 116;
		t.y = 12;
		return t;
	};
	_proto.pause_i = function () {
		var t = new eui.Image();
		this.pause = t;
		t.source = "zanting-anniu_png";
		t.x = 7.13;
		t.y = 64.09;
		return t;
	};
	_proto.reback_i = function () {
		var t = new eui.Image();
		this.reback = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "fanhui-anniu_png";
		t.x = 11.22;
		t.y = 184.09;
		return t;
	};
	_proto.music_i = function () {
		var t = new eui.ToggleButton();
		this.music = t;
		t.label = "";
		t.x = 5.58;
		t.y = 307.49;
		t.skinName = main$Skin1;
		return t;
	};
	_proto.mains_i = function () {
		var t = new eui.ToggleButton();
		this.mains = t;
		t.label = "";
		t.scaleX = 1;
		t.scaleY = 1;
		t.x = 1783.18;
		t.y = 922.7;
		t.skinName = main$Skin2;
		return t;
	};
	_proto.remusic_i = function () {
		var t = new eui.Image();
		this.remusic = t;
		t.source = "chongboanniu_png";
		t.x = 1639.06;
		t.y = 931.79;
		return t;
	};
	return main;
})(eui.Skin);generateEUI.paths['resource/eui_skins/jieju/shibai.exml'] = window.shibai = (function (_super) {
	__extends(shibai, _super);
	function shibai() {
		_super.call(this);
		this.skinParts = ["animGroup","again"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this._Rect1_i(),this.animGroup_i(),this.again_i()];
	}
	var _proto = shibai.prototype;

	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.fillAlpha = 0.6;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.animGroup_i = function () {
		var t = new eui.Group();
		this.animGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.again_i = function () {
		var t = new eui.Image();
		this.again = t;
		t.bottom = 138;
		t.horizontalCenter = 0;
		t.source = "anniu_png";
		return t;
	};
	return shibai;
})(eui.Skin);generateEUI.paths['resource/eui_skins/jieju/success.exml'] = window.success = (function (_super) {
	__extends(success, _super);
	function success() {
		_super.call(this);
		this.skinParts = ["animGroup","ziGroup","banziGroup","start"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this._Rect1_i(),this.animGroup_i(),this.banziGroup_i(),this.start_i()];
	}
	var _proto = success.prototype;

	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.fillAlpha = 0.6;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.animGroup_i = function () {
		var t = new eui.Group();
		this.animGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.banziGroup_i = function () {
		var t = new eui.Group();
		this.banziGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		t.elementsContent = [this.ziGroup_i()];
		return t;
	};
	_proto.ziGroup_i = function () {
		var t = new eui.Group();
		this.ziGroup = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 458.91;
		t.scrollEnabled = true;
		t.touchEnabled = false;
		t.width = 754.18;
		t.x = 613;
		t.y = 372;
		t.layout = this._TileLayout1_i();
		return t;
	};
	_proto._TileLayout1_i = function () {
		var t = new eui.TileLayout();
		t.columnAlign = "justifyUsingWidth";
		t.horizontalAlign = "center";
		t.paddingTop = 6;
		t.rowAlign = "top";
		t.verticalAlign = "middle";
		return t;
	};
	_proto.start_i = function () {
		var t = new eui.Image();
		this.start = t;
		t.bottom = 34;
		t.horizontalCenter = 0;
		t.source = "fanhuiguanka_png";
		return t;
	};
	return success;
})(eui.Skin);generateEUI.paths['resource/eui_skins/jieju/zi.exml'] = window.zi = (function (_super) {
	__extends(zi, _super);
	function zi() {
		_super.call(this);
		this.skinParts = ["img","lab","check"];
		
		this.elementsContent = [this.img_i(),this.lab_i(),this.check_i()];
	}
	var _proto = zi.prototype;

	_proto.img_i = function () {
		var t = new eui.Image();
		this.img = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "huang_png";
		t.top = 0;
		return t;
	};
	_proto.lab_i = function () {
		var t = new eui.Label();
		this.lab = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.fontFamily = "z2";
		t.left = 0;
		t.right = 0;
		t.size = 101;
		t.text = "牛";
		t.textAlign = "center";
		t.textColor = 0x000000;
		t.top = 0;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.check_i = function () {
		var t = new eui.Image();
		this.check = t;
		t.bottom = 0;
		t.horizontalCenter = 0;
		t.source = "dui_png";
		return t;
	};
	return zi;
})(eui.Skin);generateEUI.paths['resource/eui_skins/load/load.exml'] = window.load = (function (_super) {
	__extends(load, _super);
	function load() {
		_super.call(this);
		this.skinParts = ["gr","lab"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this._Rect1_i(),this.gr_i(),this.lab_i()];
	}
	var _proto = load.prototype;

	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.anchorOffsetX = 0;
		t.bottom = 0;
		t.fillAlpha = 0.52;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.gr_i = function () {
		var t = new eui.Group();
		this.gr = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.lab_i = function () {
		var t = new eui.Label();
		this.lab = t;
		t.bold = true;
		t.fontFamily = "FangSong";
		t.height = 200;
		t.horizontalCenter = 0;
		t.size = 74;
		t.text = "";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 300;
		t.y = 130;
		return t;
	};
	return load;
})(eui.Skin);generateEUI.paths['resource/eui_skins/main/index.exml'] = window.indexSkin = (function (_super) {
	__extends(indexSkin, _super);
	function indexSkin() {
		_super.call(this);
		this.skinParts = ["pageGroup3","pageGroup2","pageGroup1","mainGroup","successGroup","shibaiGroup","guankaGroup","startAnimGroup","start","startGroup"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this.pageGroup3_i(),this.pageGroup2_i(),this.pageGroup1_i(),this.mainGroup_i(),this.successGroup_i(),this.shibaiGroup_i(),this.guankaGroup_i(),this.startGroup_i()];
	}
	var _proto = indexSkin.prototype;

	_proto.pageGroup3_i = function () {
		var t = new eui.Group();
		this.pageGroup3 = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.pageGroup2_i = function () {
		var t = new eui.Group();
		this.pageGroup2 = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.pageGroup1_i = function () {
		var t = new eui.Group();
		this.pageGroup1 = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.mainGroup_i = function () {
		var t = new eui.Group();
		this.mainGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.successGroup_i = function () {
		var t = new eui.Group();
		this.successGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.shibaiGroup_i = function () {
		var t = new eui.Group();
		this.shibaiGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.guankaGroup_i = function () {
		var t = new eui.Group();
		this.guankaGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.startGroup_i = function () {
		var t = new eui.Group();
		this.startGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		t.elementsContent = [this._Image1_i(),this.startAnimGroup_i(),this._Image2_i(),this.start_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "bg_png";
		t.top = 0;
		return t;
	};
	_proto.startAnimGroup_i = function () {
		var t = new eui.Group();
		this.startAnimGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.source = "shuiyin_png";
		return t;
	};
	_proto.start_i = function () {
		var t = new eui.Image();
		this.start = t;
		t.bottom = 160;
		t.horizontalCenter = 0.5;
		t.source = "anniu-kaishi_png";
		return t;
	};
	return indexSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/page/page1.exml'] = window.page1Skin = (function (_super) {
	__extends(page1Skin, _super);
	function page1Skin() {
		_super.call(this);
		this.skinParts = ["animGroup","daziGroup","tiGroup","dutiGroup","xueGroup"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this.animGroup_i(),this.daziGroup_i(),this.tiGroup_i(),this.dutiGroup_i(),this.xueGroup_i()];
	}
	var _proto = page1Skin.prototype;

	_proto.animGroup_i = function () {
		var t = new eui.Group();
		this.animGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.daziGroup_i = function () {
		var t = new eui.Group();
		this.daziGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.tiGroup_i = function () {
		var t = new eui.Group();
		this.tiGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.dutiGroup_i = function () {
		var t = new eui.Group();
		this.dutiGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	_proto.xueGroup_i = function () {
		var t = new eui.Group();
		this.xueGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		return t;
	};
	return page1Skin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","moveArea","closeButton"];
		
		this.minHeight = 230;
		this.minWidth = 450;
		this.elementsContent = [this._Image1_i(),this.moveArea_i(),this.closeButton_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(2,2,12,12);
		t.source = "border_png";
		t.top = 0;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 45;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image2_i(),this.titleDisplay_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "header_png";
		t.top = 0;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.left = 15;
		t.right = 5;
		t.size = 20;
		t.textColor = 0xFFFFFF;
		t.verticalCenter = 0;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.bottom = 5;
		t.horizontalCenter = 0;
		t.label = "close";
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xffffff;
		t.percentHeight = 100;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.height = 24;
		t.left = "10";
		t.right = "10";
		t.size = 20;
		t.textColor = 0x000000;
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.height = 24;
		t.left = 10;
		t.right = 10;
		t.size = 20;
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ti/ti1.exml'] = window.ti1Skin = (function (_super) {
	__extends(ti1Skin, _super);
	function ti1Skin() {
		_super.call(this);
		this.skinParts = ["group"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this._Image1_i(),this.group_i(),this._Image2_i()];
	}
	var _proto = ti1Skin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.horizontalCenter = 0;
		t.source = "ganzi_png";
		return t;
	};
	_proto.group_i = function () {
		var t = new eui.Group();
		this.group = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 37;
		t.height = 267.94;
		t.horizontalCenter = 3;
		t.width = 764.18;
		t.layout = this._BasicLayout1_i();
		return t;
	};
	_proto._BasicLayout1_i = function () {
		var t = new eui.BasicLayout();
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.source = "shuiyin_png";
		return t;
	};
	return ti1Skin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/xue/xue.exml'] = window.xue = (function (_super) {
	__extends(xue, _super);
	function xue() {
		_super.call(this);
		this.skinParts = ["x2","x1"];
		
		this.height = 1080;
		this.width = 1920;
		this.elementsContent = [this.x2_i(),this.x1_i()];
	}
	var _proto = xue.prototype;

	_proto.x2_i = function () {
		var t = new eui.Image();
		this.x2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 58.67;
		t.source = "taoxin_png";
		t.width = 70.67;
		t.x = 47.99;
		t.y = 26.34;
		return t;
	};
	_proto.x1_i = function () {
		var t = new eui.Image();
		this.x1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 58.67;
		t.source = "taoxin_png";
		t.width = 70.67;
		t.x = 137.99;
		t.y = 26.34;
		return t;
	};
	return xue;
})(eui.Skin);generateEUI.paths['resource/eui_skins/zi/zi1.exml'] = window.zi1Skin = (function (_super) {
	__extends(zi1Skin, _super);
	function zi1Skin() {
		_super.call(this);
		this.skinParts = ["label"];
		
		this.elementsContent = [this._Image1_i(),this.label_i()];
	}
	var _proto = zi1Skin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = -1;
		t.left = 0;
		t.right = 0;
		t.source = "xingzhuang1_png";
		t.top = 1;
		return t;
	};
	_proto.label_i = function () {
		var t = new eui.Label();
		this.label = t;
		t.anchorOffsetX = 96;
		t.anchorOffsetY = 136;
		t.bottom = -39;
		t.fontFamily = "z2";
		t.left = -6;
		t.right = 6;
		t.size = 106;
		t.text = "字";
		t.textAlign = "center";
		t.textColor = 0x000000;
		t.top = 39;
		t.verticalAlign = "middle";
		return t;
	};
	return zi1Skin;
})(eui.Skin);