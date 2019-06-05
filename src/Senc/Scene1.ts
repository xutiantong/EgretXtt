module Assembly {
	/**
	 * 场景1
	 */
	export class Scene1 extends eui.Component implements eui.UIComponent {

		public aniGroup: eui.Group;//背景动画层
		public questionGroup: eui.Group;//题目层
		public eraser: eui.Image;//擦除
		public box: eui.Image;//确认
		private dongdong: dragonBones.EgretArmatureDisplay;//东东
		private blackBoard: dragonBones.EgretArmatureDisplay;//黑板
		private boardEraser: dragonBones.EgretArmatureDisplay;//板擦
		private questionCfg: Array<any> = new Array<any>();
		private gestureUtil: pr.PDollarRecognizer = pr.PDollarRecognizer.create();//手写识别
		private _layer: egret.Shape;
		private _mousePoints: Array<any> = [];
		private _currentPoint: pr.Point;
		private _currentNum: number = 0;
		private _isTouchInside: boolean = false;

		private Global = Manager.GlobalManager.get()

		public constructor() {
			super();
		}
		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this._layer = new egret.Shape();
			this.addChild(this._layer);;
			DRAGONBONES.getinstance().addToFactory("chaheiban_ske_json", "chaheiban_tex_json", "chaheiban_tex_png");
			this.blackBoard = DRAGONBONES.getinstance().initArmature("黑板遮罩", "heibancha");
			this.aniGroup.addChild(this.blackBoard);
			this.blackBoard.x = 1160;
			this.blackBoard.y = 580;
			this._layer.mask = this.blackBoard;
			this.blackBoard.animation.gotoAndStopByFrame("heiban", 0);

			this.boardEraser = DRAGONBONES.getinstance().initArmature("板擦", "heibancha");
			this.aniGroup.addChild(this.boardEraser);
			this.boardEraser.x = 1160;
			this.boardEraser.y = 580;
			this.boardEraser.visible = false;

			this.dongdong = DRAGONBONES.getinstance().initArmature("东东", "dongdong");
			this.aniGroup.addChild(this.dongdong);
			this.dongdong.animation.play("xunhuan_tishi_1", 0);
			this.dongdong.scaleX = 0.5;
			this.dongdong.scaleY = 0.5;
			this.dongdong.x = 350;
			this.dongdong.y = 1080;
			this.dongdong.visible = false;

			let config = RES.getRes("ti_json");
			for (let i = 0; i < 190; i++) {
				this.questionCfg.push(config[i]);
			}
		}

		init() {
			this.generateQuestion();
			Manager.EventManager.get().addListener("Scene1", this.questionGroup, egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			Manager.EventManager.get().addListener("Scene1", this.questionGroup, egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
			Manager.EventManager.get().addListener("Scene1", this.questionGroup, egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
			Manager.EventManager.get().addListener("Scene1", this.eraser, egret.TouchEvent.TOUCH_TAP, this.onClickEraser, this);
			Manager.EventManager.get().addListener("Scene1", this.box, egret.TouchEvent.TOUCH_TAP, this.onClickBox, this);
		}

		private initGesture() {
			this.Global.questionCurArr.forEach((v, i) => {
				this.addGesture(v.zimu + v.shengdiao);
			});
			console.log(this.gestureUtil.getGesture());
		}

		private addGesture(name: string) {
			switch (name) {
				case "bɑ0":
					this.gestureUtil.addGesture("bɑ0", new Array(
						new pr.Point(634, 230, 1), new pr.Point(629, 406, 1),
						new pr.Point(629, 351, 2), new pr.Point(658, 348, 2), new pr.Point(688, 363, 2), new pr.Point(713, 390, 2), new pr.Point(703, 430, 2), new pr.Point(663, 444, 2), new pr.Point(643, 448, 2),
						new pr.Point(822, 350, 3), new pr.Point(789, 348, 3), new pr.Point(759, 358, 3), new pr.Point(744, 395, 3), new pr.Point(744, 433, 3), new pr.Point(767, 448, 3), new pr.Point(807, 438, 3), new pr.Point(820, 395, 3), new pr.Point(822, 361, 3), new pr.Point(820, 421, 3), new pr.Point(825, 441, 3),
						new pr.Point(754, 298, 4), new pr.Point(809, 298, 4)
					));
					break;
				case "bɑ1":
					this.gestureUtil.addGesture("bɑ1", new Array(
						new pr.Point(634, 230, 1), new pr.Point(629, 406, 1),
						new pr.Point(629, 351, 2), new pr.Point(658, 348, 2), new pr.Point(688, 363, 2), new pr.Point(713, 390, 2), new pr.Point(703, 430, 2), new pr.Point(663, 444, 2), new pr.Point(643, 448, 2),
						new pr.Point(822, 350, 3), new pr.Point(789, 348, 3), new pr.Point(759, 358, 3), new pr.Point(744, 395, 3), new pr.Point(744, 433, 3), new pr.Point(767, 448, 3), new pr.Point(807, 438, 3), new pr.Point(820, 395, 3), new pr.Point(822, 361, 3), new pr.Point(820, 421, 3), new pr.Point(825, 441, 3),
						new pr.Point(797, 305, 4), new pr.Point(814, 277, 4), new pr.Point(835, 247, 4)
					));
					break;
				case "bɑ2":
					this.gestureUtil.addGesture("bɑ2", new Array(
						new pr.Point(634, 230, 1), new pr.Point(629, 406, 1),
						new pr.Point(629, 351, 2), new pr.Point(658, 348, 2), new pr.Point(688, 363, 2), new pr.Point(713, 390, 2), new pr.Point(703, 430, 2), new pr.Point(663, 444, 2), new pr.Point(643, 448, 2),
						new pr.Point(822, 350, 3), new pr.Point(789, 348, 3), new pr.Point(759, 358, 3), new pr.Point(744, 395, 3), new pr.Point(744, 433, 3), new pr.Point(767, 448, 3), new pr.Point(807, 438, 3), new pr.Point(820, 395, 3), new pr.Point(822, 361, 3), new pr.Point(820, 421, 3), new pr.Point(825, 441, 3),
						new pr.Point(770, 270, 4), new pr.Point(790, 290, 4), new pr.Point(810, 310, 4), new pr.Point(830, 290, 4), new pr.Point(850, 270, 4)
					));
					break;
				case "bɑ3":
					this.gestureUtil.addGesture("bɑ3", new Array(
						new pr.Point(634, 230, 1), new pr.Point(629, 406, 1),
						new pr.Point(629, 351, 2), new pr.Point(658, 348, 2), new pr.Point(688, 363, 2), new pr.Point(713, 390, 2), new pr.Point(703, 430, 2), new pr.Point(663, 444, 2), new pr.Point(643, 448, 2),
						new pr.Point(822, 350, 3), new pr.Point(789, 348, 3), new pr.Point(759, 358, 3), new pr.Point(744, 395, 3), new pr.Point(744, 433, 3), new pr.Point(767, 448, 3), new pr.Point(807, 438, 3), new pr.Point(820, 395, 3), new pr.Point(822, 361, 3), new pr.Point(820, 421, 3), new pr.Point(825, 441, 3),
						new pr.Point(770, 270, 4), new pr.Point(790, 290, 4), new pr.Point(810, 310, 4)
					));
					break;
				case "bo0":
					this.gestureUtil.addGesture("bo0", new Array(
						new pr.Point(611, 292, 1), new pr.Point(610, 316, 1), new pr.Point(608, 347, 1), new pr.Point(606, 377, 1), new pr.Point(605, 403, 1), new pr.Point(602, 425, 1), new pr.Point(601, 448, 1), new pr.Point(600, 468, 1), new pr.Point(600, 483, 1),
						new pr.Point(630, 396, 2), new pr.Point(648, 405, 2), new pr.Point(661, 420.2829769714519, 2), new pr.Point(668, 438, 2), new pr.Point(663, 459, 2), new pr.Point(644, 473, 2), new pr.Point(620, 483, 2), new pr.Point(595, 484, 2),
						new pr.Point(716, 390, 3), new pr.Point(699, 395, 3), new pr.Point(686, 411, 3), new pr.Point(681, 434, 3), new pr.Point(679, 463, 3), new pr.Point(694, 478, 3), new pr.Point(716, 486, 3), new pr.Point(737, 476, 3), new pr.Point(746, 454, 3), new pr.Point(746, 429, 3), new pr.Point(736, 406, 3),
						new pr.Point(688, 353, 4), new pr.Point(727, 356, 4), new pr.Point(749, 356, 4)
					));
					break;
				case "bo1":
					this.gestureUtil.addGesture("bo1", new Array(
						new pr.Point(611, 292, 1), new pr.Point(610, 316, 1), new pr.Point(608, 347, 1), new pr.Point(606, 377, 1), new pr.Point(605, 403, 1), new pr.Point(602, 425, 1), new pr.Point(601, 448, 1), new pr.Point(600, 468, 1), new pr.Point(600, 483, 1),
						new pr.Point(630, 396, 2), new pr.Point(648, 405, 2), new pr.Point(661, 420.2829769714519, 2), new pr.Point(668, 438, 2), new pr.Point(663, 459, 2), new pr.Point(644, 473, 2), new pr.Point(620, 483, 2), new pr.Point(595, 484, 2),
						new pr.Point(716, 390, 3), new pr.Point(699, 395, 3), new pr.Point(686, 411, 3), new pr.Point(681, 434, 3), new pr.Point(679, 463, 3), new pr.Point(694, 478, 3), new pr.Point(716, 486, 3), new pr.Point(737, 476, 3), new pr.Point(746, 454, 3), new pr.Point(746, 429, 3), new pr.Point(736, 406, 3),
						new pr.Point(734, 338, 4), new pr.Point(747, 318, 4)
					));
					break;
				case "bo2":
					this.gestureUtil.addGesture("bo2", new Array(
						new pr.Point(611, 292, 1), new pr.Point(610, 316, 1), new pr.Point(608, 347, 1), new pr.Point(606, 377, 1), new pr.Point(605, 403, 1), new pr.Point(602, 425, 1), new pr.Point(601, 448, 1), new pr.Point(600, 468, 1), new pr.Point(600, 483, 1),
						new pr.Point(630, 396, 2), new pr.Point(648, 405, 2), new pr.Point(661, 420.2829769714519, 2), new pr.Point(668, 438, 2), new pr.Point(663, 459, 2), new pr.Point(644, 473, 2), new pr.Point(620, 483, 2), new pr.Point(595, 484, 2),
						new pr.Point(716, 390, 3), new pr.Point(699, 395, 3), new pr.Point(686, 411, 3), new pr.Point(681, 434, 3), new pr.Point(679, 463, 3), new pr.Point(694, 478, 3), new pr.Point(716, 486, 3), new pr.Point(737, 476, 3), new pr.Point(746, 454, 3), new pr.Point(746, 429, 3), new pr.Point(736, 406, 3),
						new pr.Point(685, 330, 4), new pr.Point(700, 350, 4), new pr.Point(715, 370, 4), new pr.Point(730, 350, 4), new pr.Point(745, 330, 4)
					));
					break;
				case "bo3":
					this.gestureUtil.addGesture("bo3", new Array(
						new pr.Point(611, 292, 1), new pr.Point(610, 316, 1), new pr.Point(608, 347, 1), new pr.Point(606, 377, 1), new pr.Point(605, 403, 1), new pr.Point(602, 425, 1), new pr.Point(601, 448, 1), new pr.Point(600, 468, 1), new pr.Point(600, 483, 1),
						new pr.Point(630, 396, 2), new pr.Point(648, 405, 2), new pr.Point(661, 420.2829769714519, 2), new pr.Point(668, 438, 2), new pr.Point(663, 459, 2), new pr.Point(644, 473, 2), new pr.Point(620, 483, 2), new pr.Point(595, 484, 2),
						new pr.Point(716, 390, 3), new pr.Point(699, 395, 3), new pr.Point(686, 411, 3), new pr.Point(681, 434, 3), new pr.Point(679, 463, 3), new pr.Point(694, 478, 3), new pr.Point(716, 486, 3), new pr.Point(737, 476, 3), new pr.Point(746, 454, 3), new pr.Point(746, 429, 3), new pr.Point(736, 406, 3),
						new pr.Point(685, 320, 4), new pr.Point(700, 340, 4), new pr.Point(715, 360, 4)
					));
					break;
				case "bi0":
					this.gestureUtil.addGesture("bi0", new Array(
						new pr.Point(561, 282, 1), new pr.Point(561, 303, 1), new pr.Point(561, 317, 1), new pr.Point(561, 332, 1), new pr.Point(561, 349, 1), new pr.Point(561, 371, 1), new pr.Point(561, 388, 1), new pr.Point(561, 405, 1), new pr.Point(561, 420, 1), new pr.Point(561, 434, 1), new pr.Point(561, 450, 1),
						new pr.Point(565, 380, 2), new pr.Point(588, 380, 2), new pr.Point(601, 385, 2), new pr.Point(615, 398, 2), new pr.Point(616, 415, 2), new pr.Point(610, 431, 2), new pr.Point(598, 444, 2), new pr.Point(578, 453, 2), new pr.Point(563, 456, 2),
						new pr.Point(643, 395, 3), new pr.Point(643, 423, 3), new pr.Point(641, 443, 3),
						new pr.Point(618, 335, 4), new pr.Point(658, 335, 4)
					));
					break;
				case "bi1":
					this.gestureUtil.addGesture("bi1", new Array(
						new pr.Point(561, 282, 1), new pr.Point(561, 303, 1), new pr.Point(561, 317, 1), new pr.Point(561, 332, 1), new pr.Point(561, 349, 1), new pr.Point(561, 371, 1), new pr.Point(561, 388, 1), new pr.Point(561, 405, 1), new pr.Point(561, 420, 1), new pr.Point(561, 434, 1), new pr.Point(561, 450, 1),
						new pr.Point(565, 380, 2), new pr.Point(588, 380, 2), new pr.Point(601, 385, 2), new pr.Point(615, 398, 2), new pr.Point(616, 415, 2), new pr.Point(610, 431, 2), new pr.Point(598, 444, 2), new pr.Point(578, 453, 2), new pr.Point(563, 456, 2),
						new pr.Point(643, 395, 3), new pr.Point(643, 423, 3), new pr.Point(641, 443, 3),
						new pr.Point(641, 331, 4), new pr.Point(659, 305, 4)
					));
					break;
				case "bi2":
					this.gestureUtil.addGesture("bi2", new Array(
						new pr.Point(561, 282, 1), new pr.Point(561, 303, 1), new pr.Point(561, 317, 1), new pr.Point(561, 332, 1), new pr.Point(561, 349, 1), new pr.Point(561, 371, 1), new pr.Point(561, 388, 1), new pr.Point(561, 405, 1), new pr.Point(561, 420, 1), new pr.Point(561, 434, 1), new pr.Point(561, 450, 1),
						new pr.Point(565, 380, 2), new pr.Point(588, 380, 2), new pr.Point(601, 385, 2), new pr.Point(615, 398, 2), new pr.Point(616, 415, 2), new pr.Point(610, 431, 2), new pr.Point(598, 444, 2), new pr.Point(578, 453, 2), new pr.Point(563, 456, 2),
						new pr.Point(643, 395, 3), new pr.Point(643, 423, 3), new pr.Point(641, 443, 3),
						new pr.Point(626, 318, 4), new pr.Point(636, 345, 4), new pr.Point(649, 331, 4)
					));
					break;
				case "bi3":
					this.gestureUtil.addGesture("bi3", new Array(
						new pr.Point(561, 282, 1), new pr.Point(561, 303, 1), new pr.Point(561, 317, 1), new pr.Point(561, 332, 1), new pr.Point(561, 349, 1), new pr.Point(561, 371, 1), new pr.Point(561, 388, 1), new pr.Point(561, 405, 1), new pr.Point(561, 420, 1), new pr.Point(561, 434, 1), new pr.Point(561, 450, 1),
						new pr.Point(565, 380, 2), new pr.Point(588, 380, 2), new pr.Point(601, 385, 2), new pr.Point(615, 398, 2), new pr.Point(616, 415, 2), new pr.Point(610, 431, 2), new pr.Point(598, 444, 2), new pr.Point(578, 453, 2), new pr.Point(563, 456, 2),
						new pr.Point(643, 395, 3), new pr.Point(643, 423, 3), new pr.Point(641, 443, 3),
						new pr.Point(620, 303, 4), new pr.Point(643, 340, 4)
					));
					break;
				case "bu0":
					this.gestureUtil.addGesture("bu0", new Array(
						new pr.Point(746, 303, 1), new pr.Point(746, 323, 1), new pr.Point(746, 350, 1), new pr.Point(746, 373, 1), new pr.Point(746, 397, 1), new pr.Point(746, 425, 1), new pr.Point(744, 451, 1), new pr.Point(744, 479, 1), new pr.Point(744, 506, 1),
						new pr.Point(751, 415, 2), new pr.Point(776, 415, 2), new pr.Point(794, 421, 2), new pr.Point(806, 436, 2), new pr.Point(822, 456, 2), new pr.Point(822, 476, 2), new pr.Point(807, 499, 2), new pr.Point(785, 506, 2), new pr.Point(761, 509, 2),
						new pr.Point(852, 421, 3), new pr.Point(852, 458, 3), new pr.Point(852, 493, 3), new pr.Point(860, 509, 3), new pr.Point(885, 511, 3), new pr.Point(902, 483, 3), new pr.Point(910, 434, 3), new pr.Point(907, 448, 3), new pr.Point(907, 478, 3), new pr.Point(915, 496, 3), new pr.Point(933, 508, 3),
						new pr.Point(874, 380, 4), new pr.Point(902, 380, 4)
					));
					break;
				case "bu2":
					this.gestureUtil.addGesture("bu2", new Array(
						new pr.Point(746, 303, 1), new pr.Point(746, 323, 1), new pr.Point(746, 350, 1), new pr.Point(746, 373, 1), new pr.Point(746, 397, 1), new pr.Point(746, 425, 1), new pr.Point(744, 451, 1), new pr.Point(744, 479, 1), new pr.Point(744, 506, 1),
						new pr.Point(751, 415, 2), new pr.Point(776, 415, 2), new pr.Point(794, 421, 2), new pr.Point(806, 436, 2), new pr.Point(822, 456, 2), new pr.Point(822, 476, 2), new pr.Point(807, 499, 2), new pr.Point(785, 506, 2), new pr.Point(761, 509, 2),
						new pr.Point(852, 421, 3), new pr.Point(852, 458, 3), new pr.Point(852, 493, 3), new pr.Point(860, 509, 3), new pr.Point(885, 511, 3), new pr.Point(902, 483, 3), new pr.Point(910, 434, 3), new pr.Point(907, 448, 3), new pr.Point(907, 478, 3), new pr.Point(915, 496, 3), new pr.Point(933, 508, 3),
						new pr.Point(854, 343, 4), new pr.Point(870, 368, 4), new pr.Point(884, 386, 4), new pr.Point(902, 375, 4), new pr.Point(922, 355, 4)
					));
					break;
				case "bu3":
					this.gestureUtil.addGesture("bu3", new Array(
						new pr.Point(746, 303, 1), new pr.Point(746, 323, 1), new pr.Point(746, 350, 1), new pr.Point(746, 373, 1), new pr.Point(746, 397, 1), new pr.Point(746, 425, 1), new pr.Point(744, 451, 1), new pr.Point(744, 479, 1), new pr.Point(744, 506, 1),
						new pr.Point(751, 415, 2), new pr.Point(776, 415, 2), new pr.Point(794, 421, 2), new pr.Point(806, 436, 2), new pr.Point(822, 456, 2), new pr.Point(822, 476, 2), new pr.Point(807, 499, 2), new pr.Point(785, 506, 2), new pr.Point(761, 509, 2),
						new pr.Point(852, 421, 3), new pr.Point(852, 458, 3), new pr.Point(852, 493, 3), new pr.Point(860, 509, 3), new pr.Point(885, 511, 3), new pr.Point(902, 483, 3), new pr.Point(910, 434, 3), new pr.Point(907, 448, 3), new pr.Point(907, 478, 3), new pr.Point(915, 496, 3), new pr.Point(933, 508, 3),
						new pr.Point(864, 345, 4), new pr.Point(879, 376, 4), new pr.Point(894, 398, 4)
					));
					break;
				case "pɑ0":
					this.gestureUtil.addGesture("pɑ0", new Array(
						new pr.Point(596, 371, 1), new pr.Point(596, 392, 1), new pr.Point(596, 419, 1), new pr.Point(596, 445, 1), new pr.Point(596, 468, 1), new pr.Point(596, 491, 1), new pr.Point(596, 511, 1), new pr.Point(595, 532, 1),
						new pr.Point(601, 370, 2), new pr.Point(623, 370, 2), new pr.Point(640, 375, 2), new pr.Point(655, 388, 2), new pr.Point(656, 408, 2), new pr.Point(649, 426, 2), new pr.Point(632, 440, 2), new pr.Point(613, 446, 2),
						new pr.Point(716, 380, 3), new pr.Point(704, 370, 3), new pr.Point(689, 368, 3), new pr.Point(676, 376, 3), new pr.Point(668, 386, 3), new pr.Point(666, 416, 3), new pr.Point(671, 439, 3), new pr.Point(691, 446, 3), new pr.Point(711, 441, 3), new pr.Point(718, 415, 3), new pr.Point(719, 391, 3), new pr.Point(719, 421, 3), new pr.Point(731, 439, 3),
						new pr.Point(668, 330, 4), new pr.Point(696, 325, 4)
					));
					break;
				case "pɑ1":
					this.gestureUtil.addGesture("pɑ1", new Array(
						new pr.Point(596, 371, 1), new pr.Point(596, 392, 1), new pr.Point(596, 419, 1), new pr.Point(596, 445, 1), new pr.Point(596, 468, 1), new pr.Point(596, 491, 1), new pr.Point(596, 511, 1), new pr.Point(595, 532, 1),
						new pr.Point(601, 370, 2), new pr.Point(623, 370, 2), new pr.Point(640, 375, 2), new pr.Point(655, 388, 2), new pr.Point(656, 408, 2), new pr.Point(649, 426, 2), new pr.Point(632, 440, 2), new pr.Point(613, 446, 2),
						new pr.Point(716, 380, 3), new pr.Point(704, 370, 3), new pr.Point(689, 368, 3), new pr.Point(676, 376, 3), new pr.Point(668, 386, 3), new pr.Point(666, 416, 3), new pr.Point(671, 439, 3), new pr.Point(691, 446, 3), new pr.Point(711, 441, 3), new pr.Point(718, 415, 3), new pr.Point(719, 391, 3), new pr.Point(719, 421, 3), new pr.Point(731, 439, 3),
						new pr.Point(683, 343, 4), new pr.Point(711, 305, 4)
					));
					break;
				case "pɑ3":
					this.gestureUtil.addGesture("pɑ3", new Array(
						new pr.Point(596, 371, 1), new pr.Point(596, 392, 1), new pr.Point(596, 419, 1), new pr.Point(596, 445, 1), new pr.Point(596, 468, 1), new pr.Point(596, 491, 1), new pr.Point(596, 511, 1), new pr.Point(595, 532, 1),
						new pr.Point(601, 370, 2), new pr.Point(623, 370, 2), new pr.Point(640, 375, 2), new pr.Point(655, 388, 2), new pr.Point(656, 408, 2), new pr.Point(649, 426, 2), new pr.Point(632, 440, 2), new pr.Point(613, 446, 2),
						new pr.Point(716, 380, 3), new pr.Point(704, 370, 3), new pr.Point(689, 368, 3), new pr.Point(676, 376, 3), new pr.Point(668, 386, 3), new pr.Point(666, 416, 3), new pr.Point(671, 439, 3), new pr.Point(691, 446, 3), new pr.Point(711, 441, 3), new pr.Point(718, 415, 3), new pr.Point(719, 391, 3), new pr.Point(719, 421, 3), new pr.Point(731, 439, 3),
						new pr.Point(663, 298, 4), new pr.Point(686, 333, 4)
					));
					break;
				case "po0":
					this.gestureUtil.addGesture("po0", new Array(
						new pr.Point(556, 225, 1), new pr.Point(558, 253, 1), new pr.Point(558, 284, 1), new pr.Point(558, 309, 1), new pr.Point(558, 334, 1), new pr.Point(558, 356, 1), new pr.Point(558, 378, 1),
						new pr.Point(558, 396, 1), new pr.Point(566, 228, 2), new pr.Point(589, 222, 2), new pr.Point(611, 227, 2), new pr.Point(621, 243, 2), new pr.Point(624, 264, 2), new pr.Point(612, 288, 2), new pr.Point(590, 303, 2), new pr.Point(561, 305, 2),
						new pr.Point(676, 217, 3), new pr.Point(653, 217, 3), new pr.Point(644, 235, 3), new pr.Point(641, 257, 3), new pr.Point(644, 277, 3), new pr.Point(658, 292, 3), new pr.Point(676, 297, 3), new pr.Point(697, 295, 3), new pr.Point(704, 277, 3), new pr.Point(704, 253, 3), new pr.Point(699, 233, 3),
						new pr.Point(643, 175, 4), new pr.Point(674, 175, 4), new pr.Point(693, 175, 4)
					));
					break;
				case "po1":
					this.gestureUtil.addGesture("po1", new Array(
						new pr.Point(556, 225, 1), new pr.Point(558, 253, 1), new pr.Point(558, 284, 1), new pr.Point(558, 309, 1), new pr.Point(558, 334, 1), new pr.Point(558, 356, 1), new pr.Point(558, 378, 1),
						new pr.Point(558, 396, 1), new pr.Point(566, 228, 2), new pr.Point(589, 222, 2), new pr.Point(611, 227, 2), new pr.Point(621, 243, 2), new pr.Point(624, 264, 2), new pr.Point(612, 288, 2), new pr.Point(590, 303, 2), new pr.Point(561, 305, 2),
						new pr.Point(676, 217, 3), new pr.Point(653, 217, 3), new pr.Point(644, 235, 3), new pr.Point(641, 257, 3), new pr.Point(644, 277, 3), new pr.Point(658, 292, 3), new pr.Point(676, 297, 3), new pr.Point(697, 295, 3), new pr.Point(704, 277, 3), new pr.Point(704, 253, 3), new pr.Point(699, 233, 3),
						new pr.Point(683, 167, 4), new pr.Point(703, 145, 4)
					));
					break;
				case "po2":
					this.gestureUtil.addGesture("po2", new Array(
						new pr.Point(556, 225, 1), new pr.Point(558, 253, 1), new pr.Point(558, 284, 1), new pr.Point(558, 309, 1), new pr.Point(558, 334, 1), new pr.Point(558, 356, 1), new pr.Point(558, 378, 1),
						new pr.Point(558, 396, 1), new pr.Point(566, 228, 2), new pr.Point(589, 222, 2), new pr.Point(611, 227, 2), new pr.Point(621, 243, 2), new pr.Point(624, 264, 2), new pr.Point(612, 288, 2), new pr.Point(590, 303, 2), new pr.Point(561, 305, 2),
						new pr.Point(676, 217, 3), new pr.Point(653, 217, 3), new pr.Point(644, 235, 3), new pr.Point(641, 257, 3), new pr.Point(644, 277, 3), new pr.Point(658, 292, 3), new pr.Point(676, 297, 3), new pr.Point(697, 295, 3), new pr.Point(704, 277, 3), new pr.Point(704, 253, 3), new pr.Point(699, 233, 3),
						new pr.Point(656, 169, 4), new pr.Point(669, 184, 4), new pr.Point(693, 172, 4), new pr.Point(704, 150, 4)
					));
					break;
				case "po3":
					this.gestureUtil.addGesture("po3", new Array(
						new pr.Point(556, 225, 1), new pr.Point(558, 253, 1), new pr.Point(558, 284, 1), new pr.Point(558, 309, 1), new pr.Point(558, 334, 1), new pr.Point(558, 356, 1), new pr.Point(558, 378, 1),
						new pr.Point(558, 396, 1), new pr.Point(566, 228, 2), new pr.Point(589, 222, 2), new pr.Point(611, 227, 2), new pr.Point(621, 243, 2), new pr.Point(624, 264, 2), new pr.Point(612, 288, 2), new pr.Point(590, 303, 2), new pr.Point(561, 305, 2),
						new pr.Point(676, 217, 3), new pr.Point(653, 217, 3), new pr.Point(644, 235, 3), new pr.Point(641, 257, 3), new pr.Point(644, 277, 3), new pr.Point(658, 292, 3), new pr.Point(676, 297, 3), new pr.Point(697, 295, 3), new pr.Point(704, 277, 3), new pr.Point(704, 253, 3), new pr.Point(699, 233, 3),
						new pr.Point(649, 164, 4), new pr.Point(673, 185, 4)
					));
					break;
				case "pi0":
					this.gestureUtil.addGesture("pi0", new Array(
						new pr.Point(590, 317, 1), new pr.Point(591, 335, 1), new pr.Point(591, 355, 1), new pr.Point(591, 375, 1), new pr.Point(591, 393, 1), new pr.Point(591, 412, 1), new pr.Point(591, 432, 1), new pr.Point(591, 448, 1), new pr.Point(591, 464, 1),
						new pr.Point(596, 317, 2), new pr.Point(618, 322, 2), new pr.Point(636, 336, 2), new pr.Point(648, 366, 2), new pr.Point(640, 384, 2), new pr.Point(620, 388, 2),
						new pr.Point(683, 318, 3), new pr.Point(683, 356, 3), new pr.Point(683, 383, 3),
						new pr.Point(661, 277, 4), new pr.Point(691, 280, 4)
					));
					break;
				case "pi1":
					this.gestureUtil.addGesture("pi1", new Array(
						new pr.Point(590, 317, 1), new pr.Point(591, 335, 1), new pr.Point(591, 355, 1), new pr.Point(591, 375, 1), new pr.Point(591, 393, 1), new pr.Point(591, 412, 1), new pr.Point(591, 432, 1), new pr.Point(591, 448, 1), new pr.Point(591, 464, 1),
						new pr.Point(596, 317, 2), new pr.Point(618, 322, 2), new pr.Point(636, 336, 2), new pr.Point(648, 366, 2), new pr.Point(640, 384, 2), new pr.Point(620, 388, 2),
						new pr.Point(683, 318, 3), new pr.Point(683, 356, 3), new pr.Point(683, 383, 3),
						new pr.Point(683, 285, 4), new pr.Point(704, 253, 4)
					));
					break;
				case "pi2":
					this.gestureUtil.addGesture("pi2", new Array(
						new pr.Point(590, 317, 1), new pr.Point(591, 335, 1), new pr.Point(591, 355, 1), new pr.Point(591, 375, 1), new pr.Point(591, 393, 1), new pr.Point(591, 412, 1), new pr.Point(591, 432, 1), new pr.Point(591, 448, 1), new pr.Point(591, 464, 1),
						new pr.Point(596, 317, 2), new pr.Point(618, 322, 2), new pr.Point(636, 336, 2), new pr.Point(648, 366, 2), new pr.Point(640, 384, 2), new pr.Point(620, 388, 2),
						new pr.Point(683, 318, 3), new pr.Point(683, 356, 3), new pr.Point(683, 383, 3),
						new pr.Point(654, 248, 4), new pr.Point(673, 280, 4), new pr.Point(691, 273, 4), new pr.Point(704, 252, 4)
					));
					break;
				case "pi3":
					this.gestureUtil.addGesture("pi3", new Array(
						new pr.Point(590, 317, 1), new pr.Point(591, 335, 1), new pr.Point(591, 355, 1), new pr.Point(591, 375, 1), new pr.Point(591, 393, 1), new pr.Point(591, 412, 1), new pr.Point(591, 432, 1), new pr.Point(591, 448, 1), new pr.Point(591, 464, 1),
						new pr.Point(596, 317, 2), new pr.Point(618, 322, 2), new pr.Point(636, 336, 2), new pr.Point(648, 366, 2), new pr.Point(640, 384, 2), new pr.Point(620, 388, 2),
						new pr.Point(683, 318, 3), new pr.Point(683, 356, 3), new pr.Point(683, 383, 3),
						new pr.Point(664, 250, 4), new pr.Point(673, 273, 4), new pr.Point(684, 287, 4)
					));
					break;
				case "pu0":
					this.gestureUtil.addGesture("pu0", new Array(
						new pr.Point(629, 292, 1), new pr.Point(626, 314, 1), new pr.Point(624, 338, 1), new pr.Point(624, 365, 1), new pr.Point(623, 392, 1), new pr.Point(623, 416, 1), new pr.Point(623, 439, 1), new pr.Point(623, 458, 1),
						new pr.Point(633, 290, 2), new pr.Point(656, 290, 2), new pr.Point(671, 303, 2), new pr.Point(678, 324, 2), new pr.Point(686, 340, 2), new pr.Point(683, 358, 2), new pr.Point(656, 370, 2), new pr.Point(636, 373, 2),
						new pr.Point(701, 303, 3), new pr.Point(701, 331, 3), new pr.Point(701, 355, 3), new pr.Point(709, 371, 3), new pr.Point(731, 376, 3), new pr.Point(741, 348, 3), new pr.Point(746, 318, 3), new pr.Point(747, 304, 3), new pr.Point(749, 340, 3), new pr.Point(757, 361, 3), new pr.Point(771, 358, 3),
						new pr.Point(719, 257, 4), new pr.Point(744, 257, 4)
					));
					break;
				case "pu1":
					this.gestureUtil.addGesture("pu1", new Array(
						new pr.Point(629, 292, 1), new pr.Point(626, 314, 1), new pr.Point(624, 338, 1), new pr.Point(624, 365, 1), new pr.Point(623, 392, 1), new pr.Point(623, 416, 1), new pr.Point(623, 439, 1), new pr.Point(623, 458, 1),
						new pr.Point(633, 290, 2), new pr.Point(656, 290, 2), new pr.Point(671, 303, 2), new pr.Point(678, 324, 2), new pr.Point(686, 340, 2), new pr.Point(683, 358, 2), new pr.Point(656, 370, 2), new pr.Point(636, 373, 2),
						new pr.Point(701, 303, 3), new pr.Point(701, 331, 3), new pr.Point(701, 355, 3), new pr.Point(709, 371, 3), new pr.Point(731, 376, 3), new pr.Point(741, 348, 3), new pr.Point(746, 318, 3), new pr.Point(747, 304, 3), new pr.Point(749, 340, 3), new pr.Point(757, 361, 3), new pr.Point(771, 358, 3),
						new pr.Point(737, 242, 4), new pr.Point(751, 220, 4)
					));
					break;
				case "pu2":
					this.gestureUtil.addGesture("pu2", new Array(
						new pr.Point(629, 292, 1), new pr.Point(626, 314, 1), new pr.Point(624, 338, 1), new pr.Point(624, 365, 1), new pr.Point(623, 392, 1), new pr.Point(623, 416, 1), new pr.Point(623, 439, 1), new pr.Point(623, 458, 1),
						new pr.Point(633, 290, 2), new pr.Point(656, 290, 2), new pr.Point(671, 303, 2), new pr.Point(678, 324, 2), new pr.Point(686, 340, 2), new pr.Point(683, 358, 2), new pr.Point(656, 370, 2), new pr.Point(636, 373, 2),
						new pr.Point(701, 303, 3), new pr.Point(701, 331, 3), new pr.Point(701, 355, 3), new pr.Point(709, 371, 3), new pr.Point(731, 376, 3), new pr.Point(741, 348, 3), new pr.Point(746, 318, 3), new pr.Point(747, 304, 3), new pr.Point(749, 340, 3), new pr.Point(757, 361, 3), new pr.Point(771, 358, 3),
						new pr.Point(701, 233, 4), new pr.Point(714, 255, 4), new pr.Point(729, 255, 4), new pr.Point(744, 238, 4)
					));
					break;
				case "pu3":
					this.gestureUtil.addGesture("pu3", new Array(
						new pr.Point(629, 292, 1), new pr.Point(626, 314, 1), new pr.Point(624, 338, 1), new pr.Point(624, 365, 1), new pr.Point(623, 392, 1), new pr.Point(623, 416, 1), new pr.Point(623, 439, 1), new pr.Point(623, 458, 1),
						new pr.Point(633, 290, 2), new pr.Point(656, 290, 2), new pr.Point(671, 303, 2), new pr.Point(678, 324, 2), new pr.Point(686, 340, 2), new pr.Point(683, 358, 2), new pr.Point(656, 370, 2), new pr.Point(636, 373, 2),
						new pr.Point(701, 303, 3), new pr.Point(701, 331, 3), new pr.Point(701, 355, 3), new pr.Point(709, 371, 3), new pr.Point(731, 376, 3), new pr.Point(741, 348, 3), new pr.Point(746, 318, 3), new pr.Point(747, 304, 3), new pr.Point(749, 340, 3), new pr.Point(757, 361, 3), new pr.Point(771, 358, 3),
						new pr.Point(686, 202, 4), new pr.Point(699, 238, 4), new pr.Point(711, 257, 4)
					));
					break;
				case "mɑ0":
					this.gestureUtil.addGesture("mɑ0", new Array(
						new pr.Point(522, 252, 1), new pr.Point(525, 278, 1), new pr.Point(527, 308, 1), new pr.Point(527, 308, 1), new pr.Point(530, 277, 1), new pr.Point(538, 250, 1), new pr.Point(555, 253, 1), new pr.Point(560, 282, 1), new pr.Point(560, 310, 1), new pr.Point(560, 280, 1), new pr.Point(560, 257, 1), new pr.Point(573, 243, 1), new pr.Point(590, 248, 1), new pr.Point(601, 273, 1), new pr.Point(603, 307, 1),
						new pr.Point(678, 242, 2), new pr.Point(654, 230, 2), new pr.Point(633, 232, 2), new pr.Point(626, 245, 2), new pr.Point(621, 270, 2), new pr.Point(620, 297, 2), new pr.Point(633, 310, 2), new pr.Point(661, 313, 2), new pr.Point(676, 297, 2), new pr.Point(678, 272, 2), new pr.Point(678, 260, 2), new pr.Point(678, 287, 2), new pr.Point(681, 305, 2), new pr.Point(694, 310, 2),
						new pr.Point(636, 205, 3), new pr.Point(661, 205, 3)
					));
					break;
				case "mɑ1":
					this.gestureUtil.addGesture("mɑ1", new Array(
						new pr.Point(522, 252, 1), new pr.Point(525, 278, 1), new pr.Point(527, 308, 1), new pr.Point(527, 308, 1), new pr.Point(530, 277, 1), new pr.Point(538, 250, 1), new pr.Point(555, 253, 1), new pr.Point(560, 282, 1), new pr.Point(560, 310, 1), new pr.Point(560, 280, 1), new pr.Point(560, 257, 1), new pr.Point(573, 243, 1), new pr.Point(590, 248, 1), new pr.Point(601, 273, 1), new pr.Point(603, 307, 1),
						new pr.Point(678, 242, 2), new pr.Point(654, 230, 2), new pr.Point(633, 232, 2), new pr.Point(626, 245, 2), new pr.Point(621, 270, 2), new pr.Point(620, 297, 2), new pr.Point(633, 310, 2), new pr.Point(661, 313, 2), new pr.Point(676, 297, 2), new pr.Point(678, 272, 2), new pr.Point(678, 260, 2), new pr.Point(678, 287, 2), new pr.Point(681, 305, 2), new pr.Point(694, 310, 2),
						new pr.Point(644, 207, 3), new pr.Point(659, 182, 3), new pr.Point(671, 162, 3)
					));
					break;
				case "mɑ2":
					this.gestureUtil.addGesture("mɑ2", new Array(
						new pr.Point(522, 252, 1), new pr.Point(525, 278, 1), new pr.Point(527, 308, 1), new pr.Point(527, 308, 1), new pr.Point(530, 277, 1), new pr.Point(538, 250, 1), new pr.Point(555, 253, 1), new pr.Point(560, 282, 1), new pr.Point(560, 310, 1), new pr.Point(560, 280, 1), new pr.Point(560, 257, 1), new pr.Point(573, 243, 1), new pr.Point(590, 248, 1), new pr.Point(601, 273, 1), new pr.Point(603, 307, 1),
						new pr.Point(678, 242, 2), new pr.Point(654, 230, 2), new pr.Point(633, 232, 2), new pr.Point(626, 245, 2), new pr.Point(621, 270, 2), new pr.Point(620, 297, 2), new pr.Point(633, 310, 2), new pr.Point(661, 313, 2), new pr.Point(676, 297, 2), new pr.Point(678, 272, 2), new pr.Point(678, 260, 2), new pr.Point(678, 287, 2), new pr.Point(681, 305, 2), new pr.Point(694, 310, 2),
						new pr.Point(624, 190, 3), new pr.Point(643, 204, 3), new pr.Point(656, 204, 3), new pr.Point(674, 184, 3)
					));
					break;
				case "mɑ3":
					this.gestureUtil.addGesture("mɑ3", new Array(
						new pr.Point(522, 252, 1), new pr.Point(525, 278, 1), new pr.Point(527, 308, 1), new pr.Point(527, 308, 1), new pr.Point(530, 277, 1), new pr.Point(538, 250, 1), new pr.Point(555, 253, 1), new pr.Point(560, 282, 1), new pr.Point(560, 310, 1), new pr.Point(560, 280, 1), new pr.Point(560, 257, 1), new pr.Point(573, 243, 1), new pr.Point(590, 248, 1), new pr.Point(601, 273, 1), new pr.Point(603, 307, 1),
						new pr.Point(678, 242, 2), new pr.Point(654, 230, 2), new pr.Point(633, 232, 2), new pr.Point(626, 245, 2), new pr.Point(621, 270, 2), new pr.Point(620, 297, 2), new pr.Point(633, 310, 2), new pr.Point(661, 313, 2), new pr.Point(676, 297, 2), new pr.Point(678, 272, 2), new pr.Point(678, 260, 2), new pr.Point(678, 287, 2), new pr.Point(681, 305, 2), new pr.Point(694, 310, 2),
						new pr.Point(624, 167, 3), new pr.Point(636, 185, 3), new pr.Point(644, 205, 3)
					));
					break;
				case "mo0":
					this.gestureUtil.addGesture("mo0", new Array(
						new pr.Point(477, 267, 1), new pr.Point(492, 280, 1), new pr.Point(493, 300, 1), new pr.Point(493, 320, 1), new pr.Point(493, 308, 1), new pr.Point(496, 285, 1), new pr.Point(498, 267, 1), new pr.Point(513, 265, 1), new pr.Point(525, 278, 1), new pr.Point(525, 295, 1), new pr.Point(525, 315, 1), new pr.Point(525, 293, 1), new pr.Point(525, 274, 1), new pr.Point(530, 262, 1), new pr.Point(546, 262, 1), new pr.Point(556, 277, 1), new pr.Point(556, 297, 1), new pr.Point(556, 317, 1),
						new pr.Point(615, 265, 2), new pr.Point(593, 262, 2), new pr.Point(580, 273, 2), new pr.Point(578, 292, 2), new pr.Point(580, 308, 2), new pr.Point(595, 320, 2), new pr.Point(611, 323, 2), new pr.Point(629, 317, 2), new pr.Point(634, 295, 2), new pr.Point(633, 277, 2),
						new pr.Point(581, 228, 3), new pr.Point(603, 225, 3), new pr.Point(621, 223, 3)
					));
					break;
				case "mo1":
					this.gestureUtil.addGesture("mo1", new Array(
						new pr.Point(477, 267, 1), new pr.Point(492, 280, 1), new pr.Point(493, 300, 1), new pr.Point(493, 320, 1), new pr.Point(493, 308, 1), new pr.Point(496, 285, 1), new pr.Point(498, 267, 1), new pr.Point(513, 265, 1), new pr.Point(525, 278, 1), new pr.Point(525, 295, 1), new pr.Point(525, 315, 1), new pr.Point(525, 293, 1), new pr.Point(525, 274, 1), new pr.Point(530, 262, 1), new pr.Point(546, 262, 1), new pr.Point(556, 277, 1), new pr.Point(556, 297, 1), new pr.Point(556, 317, 1),
						new pr.Point(615, 265, 2), new pr.Point(593, 262, 2), new pr.Point(580, 273, 2), new pr.Point(578, 292, 2), new pr.Point(580, 308, 2), new pr.Point(595, 320, 2), new pr.Point(611, 323, 2), new pr.Point(629, 317, 2), new pr.Point(634, 295, 2), new pr.Point(633, 277, 2),
						new pr.Point(606, 232, 3), new pr.Point(620, 217, 3), new pr.Point(634, 205, 3)
					));
					break;
				case "mo2":
					this.gestureUtil.addGesture("mo2", new Array(
						new pr.Point(477, 267, 1), new pr.Point(492, 280, 1), new pr.Point(493, 300, 1), new pr.Point(493, 320, 1), new pr.Point(493, 308, 1), new pr.Point(496, 285, 1), new pr.Point(498, 267, 1), new pr.Point(513, 265, 1), new pr.Point(525, 278, 1), new pr.Point(525, 295, 1), new pr.Point(525, 315, 1), new pr.Point(525, 293, 1), new pr.Point(525, 274, 1), new pr.Point(530, 262, 1), new pr.Point(546, 262, 1), new pr.Point(556, 277, 1), new pr.Point(556, 297, 1), new pr.Point(556, 317, 1),
						new pr.Point(615, 265, 2), new pr.Point(593, 262, 2), new pr.Point(580, 273, 2), new pr.Point(578, 292, 2), new pr.Point(580, 308, 2), new pr.Point(595, 320, 2), new pr.Point(611, 323, 2), new pr.Point(629, 317, 2), new pr.Point(634, 295, 2), new pr.Point(633, 277, 2),
						new pr.Point(581, 215, 3), new pr.Point(600, 235, 3), new pr.Point(613, 222, 3), new pr.Point(626, 204, 3)
					));
					break;
				case "mo3":
					this.gestureUtil.addGesture("mo3", new Array(
						new pr.Point(477, 267, 1), new pr.Point(492, 280, 1), new pr.Point(493, 300, 1), new pr.Point(493, 320, 1), new pr.Point(493, 308, 1), new pr.Point(496, 285, 1), new pr.Point(498, 267, 1), new pr.Point(513, 265, 1), new pr.Point(525, 278, 1), new pr.Point(525, 295, 1), new pr.Point(525, 315, 1), new pr.Point(525, 293, 1), new pr.Point(525, 274, 1), new pr.Point(530, 262, 1), new pr.Point(546, 262, 1), new pr.Point(556, 277, 1), new pr.Point(556, 297, 1), new pr.Point(556, 317, 1),
						new pr.Point(615, 265, 2), new pr.Point(593, 262, 2), new pr.Point(580, 273, 2), new pr.Point(578, 292, 2), new pr.Point(580, 308, 2), new pr.Point(595, 320, 2), new pr.Point(611, 323, 2), new pr.Point(629, 317, 2), new pr.Point(634, 295, 2), new pr.Point(633, 277, 2),
						new pr.Point(585, 205, 3), new pr.Point(596, 225, 3)
					));
					break;
				case "mi0":
					this.gestureUtil.addGesture("mi0", new Array(
						new pr.Point(522, 385, 1), new pr.Point(528, 410, 1), new pr.Point(528, 434, 1), new pr.Point(528, 460, 1), new pr.Point(528, 439, 1), new pr.Point(528, 426, 1), new pr.Point(531, 408, 1), new pr.Point(535, 394, 1), new pr.Point(548, 391, 1), new pr.Point(557, 403, 1), new pr.Point(558, 425, 1), new pr.Point(558, 440, 1), new pr.Point(558, 428, 1), new pr.Point(558, 411, 1), new pr.Point(560, 395, 1), new pr.Point(571, 390, 1), new pr.Point(581, 398, 1), new pr.Point(583, 413, 1), new pr.Point(585, 428, 1), new pr.Point(586, 446, 1),
						new pr.Point(616, 395, 2), new pr.Point(620, 423, 2), new pr.Point(620, 446, 2),
						new pr.Point(603, 355, 3), new pr.Point(624, 355, 3)
					));
					break;
				case "mi1":
					this.gestureUtil.addGesture("mi1", new Array(
						new pr.Point(522, 385, 1), new pr.Point(528, 410, 1), new pr.Point(528, 434, 1), new pr.Point(528, 460, 1), new pr.Point(528, 439, 1), new pr.Point(528, 426, 1), new pr.Point(531, 408, 1), new pr.Point(535, 394, 1), new pr.Point(548, 391, 1), new pr.Point(557, 403, 1), new pr.Point(558, 425, 1), new pr.Point(558, 440, 1), new pr.Point(558, 428, 1), new pr.Point(558, 411, 1), new pr.Point(560, 395, 1), new pr.Point(571, 390, 1), new pr.Point(581, 398, 1), new pr.Point(583, 413, 1), new pr.Point(585, 428, 1), new pr.Point(586, 446, 1),
						new pr.Point(616, 395, 2), new pr.Point(620, 423, 2), new pr.Point(620, 446, 2),
						new pr.Point(616, 353, 3), new pr.Point(636, 325, 3)
					));
					break;
				case "mi2":
					this.gestureUtil.addGesture("mi2", new Array(
						new pr.Point(522, 385, 1), new pr.Point(528, 410, 1), new pr.Point(528, 434, 1), new pr.Point(528, 460, 1), new pr.Point(528, 439, 1), new pr.Point(528, 426, 1), new pr.Point(531, 408, 1), new pr.Point(535, 394, 1), new pr.Point(548, 391, 1), new pr.Point(557, 403, 1), new pr.Point(558, 425, 1), new pr.Point(558, 440, 1), new pr.Point(558, 428, 1), new pr.Point(558, 411, 1), new pr.Point(560, 395, 1), new pr.Point(571, 390, 1), new pr.Point(581, 398, 1), new pr.Point(583, 413, 1), new pr.Point(585, 428, 1), new pr.Point(586, 446, 1),
						new pr.Point(616, 395, 2), new pr.Point(620, 423, 2), new pr.Point(620, 446, 2),
						new pr.Point(586, 323, 3), new pr.Point(606, 348, 3), new pr.Point(621, 338, 3), new pr.Point(634, 318, 3)
					));
					break;
				case "mi3":
					this.gestureUtil.addGesture("mi3", new Array(
						new pr.Point(522, 385, 1), new pr.Point(528, 410, 1), new pr.Point(528, 434, 1), new pr.Point(528, 460, 1), new pr.Point(528, 439, 1), new pr.Point(528, 426, 1), new pr.Point(531, 408, 1), new pr.Point(535, 394, 1), new pr.Point(548, 391, 1), new pr.Point(557, 403, 1), new pr.Point(558, 425, 1), new pr.Point(558, 440, 1), new pr.Point(558, 428, 1), new pr.Point(558, 411, 1), new pr.Point(560, 395, 1), new pr.Point(571, 390, 1), new pr.Point(581, 398, 1), new pr.Point(583, 413, 1), new pr.Point(585, 428, 1), new pr.Point(586, 446, 1),
						new pr.Point(616, 395, 2), new pr.Point(620, 423, 2), new pr.Point(620, 446, 2),
						new pr.Point(593, 318, 3), new pr.Point(608, 343, 3)
					));
					break;
				case "mu1":
					this.gestureUtil.addGesture("mu1", new Array(
						new pr.Point(522, 385, 1), new pr.Point(528, 410, 1), new pr.Point(528, 434, 1), new pr.Point(528, 460, 1), new pr.Point(528, 439, 1), new pr.Point(528, 426, 1), new pr.Point(531, 408, 1), new pr.Point(535, 394, 1), new pr.Point(548, 391, 1), new pr.Point(557, 403, 1), new pr.Point(558, 425, 1), new pr.Point(558, 440, 1), new pr.Point(558, 428, 1), new pr.Point(558, 411, 1), new pr.Point(560, 395, 1), new pr.Point(571, 390, 1), new pr.Point(581, 398, 1), new pr.Point(583, 413, 1), new pr.Point(585, 428, 1), new pr.Point(586, 446, 1),
						new pr.Point(611, 385, 2), new pr.Point(611, 408, 2), new pr.Point(611, 426, 2), new pr.Point(616, 443, 2), new pr.Point(634, 448, 2), new pr.Point(649, 433, 2), new pr.Point(658, 415, 2), new pr.Point(658, 393, 2), new pr.Point(654, 411, 2), new pr.Point(654, 434, 2), new pr.Point(666, 446, 2),
						new pr.Point(616, 353, 3), new pr.Point(636, 325, 3)
					));
					break;
				case "mu2":
					this.gestureUtil.addGesture("mu2", new Array(
						new pr.Point(522, 385, 1), new pr.Point(528, 410, 1), new pr.Point(528, 434, 1), new pr.Point(528, 460, 1), new pr.Point(528, 439, 1), new pr.Point(528, 426, 1), new pr.Point(531, 408, 1), new pr.Point(535, 394, 1), new pr.Point(548, 391, 1), new pr.Point(557, 403, 1), new pr.Point(558, 425, 1), new pr.Point(558, 440, 1), new pr.Point(558, 428, 1), new pr.Point(558, 411, 1), new pr.Point(560, 395, 1), new pr.Point(571, 390, 1), new pr.Point(581, 398, 1), new pr.Point(583, 413, 1), new pr.Point(585, 428, 1), new pr.Point(586, 446, 1),
						new pr.Point(611, 385, 2), new pr.Point(611, 408, 2), new pr.Point(611, 426, 2), new pr.Point(616, 443, 2), new pr.Point(634, 448, 2), new pr.Point(649, 433, 2), new pr.Point(658, 415, 2), new pr.Point(658, 393, 2), new pr.Point(654, 411, 2), new pr.Point(654, 434, 2), new pr.Point(666, 446, 2),
						new pr.Point(586, 323, 3), new pr.Point(606, 348, 3), new pr.Point(621, 338, 3), new pr.Point(634, 318, 3)
					));
					break;
				case "mu3":
					this.gestureUtil.addGesture("mu3", new Array(
						new pr.Point(522, 385, 1), new pr.Point(528, 410, 1), new pr.Point(528, 434, 1), new pr.Point(528, 460, 1), new pr.Point(528, 439, 1), new pr.Point(528, 426, 1), new pr.Point(531, 408, 1), new pr.Point(535, 394, 1), new pr.Point(548, 391, 1), new pr.Point(557, 403, 1), new pr.Point(558, 425, 1), new pr.Point(558, 440, 1), new pr.Point(558, 428, 1), new pr.Point(558, 411, 1), new pr.Point(560, 395, 1), new pr.Point(571, 390, 1), new pr.Point(581, 398, 1), new pr.Point(583, 413, 1), new pr.Point(585, 428, 1), new pr.Point(586, 446, 1),
						new pr.Point(611, 385, 2), new pr.Point(611, 408, 2), new pr.Point(611, 426, 2), new pr.Point(616, 443, 2), new pr.Point(634, 448, 2), new pr.Point(649, 433, 2), new pr.Point(658, 415, 2), new pr.Point(658, 393, 2), new pr.Point(654, 411, 2), new pr.Point(654, 434, 2), new pr.Point(666, 446, 2),
						new pr.Point(593, 318, 3), new pr.Point(608, 343, 3)
					));
					break;
				case "fɑ0":
					this.gestureUtil.addGesture("fɑ0", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(681, 380, 3), new pr.Point(664, 376, 3), new pr.Point(649, 380, 3), new pr.Point(646, 399, 3), new pr.Point(644, 416, 3), new pr.Point(653, 431, 3), new pr.Point(669, 433, 3), new pr.Point(684, 423, 3), new pr.Point(688, 398, 3), new pr.Point(688, 395, 3), new pr.Point(688, 415, 3), new pr.Point(694, 430, 3),
						new pr.Point(649, 341, 4), new pr.Point(671, 343, 4), new pr.Point(686, 345, 4)
					));
					break;
				case "fɑ1":
					this.gestureUtil.addGesture("fɑ1", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(681, 380, 3), new pr.Point(664, 376, 3), new pr.Point(649, 380, 3), new pr.Point(646, 399, 3), new pr.Point(644, 416, 3), new pr.Point(653, 431, 3), new pr.Point(669, 433, 3), new pr.Point(684, 423, 3), new pr.Point(688, 398, 3), new pr.Point(688, 395, 3), new pr.Point(688, 415, 3), new pr.Point(694, 430, 3),
						new pr.Point(673, 330, 4), new pr.Point(688, 317, 4)
					));
					break;
				case "fɑ2":
					this.gestureUtil.addGesture("fɑ2", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(681, 380, 3), new pr.Point(664, 376, 3), new pr.Point(649, 380, 3), new pr.Point(646, 399, 3), new pr.Point(644, 416, 3), new pr.Point(653, 431, 3), new pr.Point(669, 433, 3), new pr.Point(684, 423, 3), new pr.Point(688, 398, 3), new pr.Point(688, 395, 3), new pr.Point(688, 415, 3), new pr.Point(694, 430, 3),
						new pr.Point(651, 326, 4), new pr.Point(668, 350, 4), new pr.Point(683, 331, 4), new pr.Point(693, 318, 4)
					));
					break;
				case "fɑ3":
					this.gestureUtil.addGesture("fɑ3", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(681, 380, 3), new pr.Point(664, 376, 3), new pr.Point(649, 380, 3), new pr.Point(646, 399, 3), new pr.Point(644, 416, 3), new pr.Point(653, 431, 3), new pr.Point(669, 433, 3), new pr.Point(684, 423, 3), new pr.Point(688, 398, 3), new pr.Point(688, 395, 3), new pr.Point(688, 415, 3), new pr.Point(694, 430, 3),
						new pr.Point(646, 333, 4), new pr.Point(663, 353, 4)
					));
					break;
				case "fo0":
					this.gestureUtil.addGesture("fo0", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(673, 373, 3), new pr.Point(654, 375, 3), new pr.Point(641, 388, 3), new pr.Point(641, 411, 3), new pr.Point(654, 431, 3), new pr.Point(669, 434, 3), new pr.Point(684, 428, 3), new pr.Point(689, 408, 3), new pr.Point(689, 388, 3), new pr.Point(678, 376, 3),
						new pr.Point(649, 341, 4), new pr.Point(671, 343, 4), new pr.Point(686, 345, 4)
					));
					break;
				case "fo1":
					this.gestureUtil.addGesture("fo1", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(673, 373, 3), new pr.Point(654, 375, 3), new pr.Point(641, 388, 3), new pr.Point(641, 411, 3), new pr.Point(654, 431, 3), new pr.Point(669, 434, 3), new pr.Point(684, 428, 3), new pr.Point(689, 408, 3), new pr.Point(689, 388, 3), new pr.Point(678, 376, 3),
						new pr.Point(673, 330, 4), new pr.Point(688, 317, 4)
					));
					break;
				case "fu0":
					this.gestureUtil.addGesture("fu0", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(639, 395, 3), new pr.Point(639, 415, 3), new pr.Point(651, 430, 3), new pr.Point(668, 431, 3), new pr.Point(684, 413, 3), new pr.Point(686, 396, 3), new pr.Point(689, 376, 3), new pr.Point(689, 400, 3), new pr.Point(689, 423, 3), new pr.Point(706, 428, 3),
						new pr.Point(649, 341, 4), new pr.Point(671, 343, 4), new pr.Point(686, 345, 4)
					));
					break;
				case "fu1":
					this.gestureUtil.addGesture("fu1", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(639, 395, 3), new pr.Point(639, 415, 3), new pr.Point(651, 430, 3), new pr.Point(668, 431, 3), new pr.Point(684, 413, 3), new pr.Point(686, 396, 3), new pr.Point(689, 376, 3), new pr.Point(689, 400, 3), new pr.Point(689, 423, 3), new pr.Point(706, 428, 3),
						new pr.Point(673, 330, 4), new pr.Point(688, 317, 4)
					));
					break;
				case "fu2":
					this.gestureUtil.addGesture("fu2", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(639, 395, 3), new pr.Point(639, 415, 3), new pr.Point(651, 430, 3), new pr.Point(668, 431, 3), new pr.Point(684, 413, 3), new pr.Point(686, 396, 3), new pr.Point(689, 376, 3), new pr.Point(689, 400, 3), new pr.Point(689, 423, 3), new pr.Point(706, 428, 3),
						new pr.Point(651, 326, 4), new pr.Point(668, 350, 4), new pr.Point(683, 331, 4), new pr.Point(693, 318, 4)
					));
					break;
				case "fu3":
					this.gestureUtil.addGesture("fu3", new Array(
						new pr.Point(563, 380, 1), new pr.Point(623, 380, 1),
						new pr.Point(619, 320, 2), new pr.Point(608, 317, 2), new pr.Point(596, 317, 2), new pr.Point(590, 328, 2), new pr.Point(590, 343, 2), new pr.Point(590, 363, 2), new pr.Point(590, 385, 2), new pr.Point(590, 399, 2), new pr.Point(590, 415, 2), new pr.Point(591, 431, 2),
						new pr.Point(639, 395, 3), new pr.Point(639, 415, 3), new pr.Point(651, 430, 3), new pr.Point(668, 431, 3), new pr.Point(684, 413, 3), new pr.Point(686, 396, 3), new pr.Point(689, 376, 3), new pr.Point(689, 400, 3), new pr.Point(689, 423, 3), new pr.Point(706, 428, 3),
						new pr.Point(646, 333, 4), new pr.Point(663, 353, 4)
					));
					break;
				case "dɑ0":
					this.gestureUtil.addGesture("dɑ0", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1025, 528, 3), new pr.Point(1008, 528, 3), new pr.Point(992, 529, 3), new pr.Point(988, 547, 3), new pr.Point(987, 569, 3), new pr.Point(985, 586, 3), new pr.Point(995, 599, 3), new pr.Point(1013, 599, 3), new pr.Point(1036, 586, 3), new pr.Point(1041, 562, 3), new pr.Point(1040, 547, 3), new pr.Point(1036, 577, 3), new pr.Point(1041, 592, 3), new pr.Point(1061, 599, 3),
						new pr.Point(1008, 488, 4), new pr.Point(1036, 491, 4)
					));
					break;
				case "dɑ1":
					this.gestureUtil.addGesture("dɑ1", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1025, 528, 3), new pr.Point(1008, 528, 3), new pr.Point(992, 529, 3), new pr.Point(988, 547, 3), new pr.Point(987, 569, 3), new pr.Point(985, 586, 3), new pr.Point(995, 599, 3), new pr.Point(1013, 599, 3), new pr.Point(1036, 586, 3), new pr.Point(1041, 562, 3), new pr.Point(1040, 547, 3), new pr.Point(1036, 577, 3), new pr.Point(1041, 592, 3), new pr.Point(1061, 599, 3),
						new pr.Point(1015, 484, 4), new pr.Point(1036, 466, 4)
					));
					break;
				case "dɑ2":
					this.gestureUtil.addGesture("dɑ2", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1025, 528, 3), new pr.Point(1008, 528, 3), new pr.Point(992, 529, 3), new pr.Point(988, 547, 3), new pr.Point(987, 569, 3), new pr.Point(985, 586, 3), new pr.Point(995, 599, 3), new pr.Point(1013, 599, 3), new pr.Point(1036, 586, 3), new pr.Point(1041, 562, 3), new pr.Point(1040, 547, 3), new pr.Point(1036, 577, 3), new pr.Point(1041, 592, 3), new pr.Point(1061, 599, 3),
						new pr.Point(988, 459, 4), new pr.Point(1002, 484, 4), new pr.Point(1016, 498, 4), new pr.Point(1031, 479, 4), new pr.Point(1041, 459, 4)
					));
					break;
				case "dɑ3":
					this.gestureUtil.addGesture("dɑ3", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1025, 528, 3), new pr.Point(1008, 528, 3), new pr.Point(992, 529, 3), new pr.Point(988, 547, 3), new pr.Point(987, 569, 3), new pr.Point(985, 586, 3), new pr.Point(995, 599, 3), new pr.Point(1013, 599, 3), new pr.Point(1036, 586, 3), new pr.Point(1041, 562, 3), new pr.Point(1040, 547, 3), new pr.Point(1036, 577, 3), new pr.Point(1041, 592, 3), new pr.Point(1061, 599, 3),
						new pr.Point(1003, 473, 4), new pr.Point(1013, 496, 4)
					));
					break;
				case "de0":
					this.gestureUtil.addGesture("de0", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(995, 561, 3), new pr.Point(1020, 561, 3), new pr.Point(1043, 556, 3), new pr.Point(1041, 539, 3), new pr.Point(1023, 533, 3), new pr.Point(1000, 526, 3), new pr.Point(992, 539, 3), new pr.Point(988, 559, 3), new pr.Point(988, 579, 3), new pr.Point(1003, 592, 3), new pr.Point(1020, 596, 3), new pr.Point(1038, 594, 3),
						new pr.Point(1008, 488, 4), new pr.Point(1036, 491, 4)
					));
					break;
				case "de1":
					this.gestureUtil.addGesture("de1", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(995, 561, 3), new pr.Point(1020, 561, 3), new pr.Point(1043, 556, 3), new pr.Point(1041, 539, 3), new pr.Point(1023, 533, 3), new pr.Point(1000, 526, 3), new pr.Point(992, 539, 3), new pr.Point(988, 559, 3), new pr.Point(988, 579, 3), new pr.Point(1003, 592, 3), new pr.Point(1020, 596, 3), new pr.Point(1038, 594, 3),
						new pr.Point(1015, 484, 4), new pr.Point(1036, 466, 4)
					));
					break;
				case "de3":
					this.gestureUtil.addGesture("de3", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(995, 561, 3), new pr.Point(1020, 561, 3), new pr.Point(1043, 556, 3), new pr.Point(1041, 539, 3), new pr.Point(1023, 533, 3), new pr.Point(1000, 526, 3), new pr.Point(992, 539, 3), new pr.Point(988, 559, 3), new pr.Point(988, 579, 3), new pr.Point(1003, 592, 3), new pr.Point(1020, 596, 3), new pr.Point(1038, 594, 3),
						new pr.Point(1003, 473, 4), new pr.Point(1013, 496, 4)
					));
					break;
				case "di0":
					this.gestureUtil.addGesture("di0", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1013, 534, 3), new pr.Point(1013, 559, 3), new pr.Point(1013, 581, 3),
						new pr.Point(1008, 488, 4), new pr.Point(1036, 491, 4)
					));
					break;
				case "di1":
					this.gestureUtil.addGesture("di1", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1013, 534, 3), new pr.Point(1013, 559, 3), new pr.Point(1013, 581, 3),
						new pr.Point(1015, 484, 4), new pr.Point(1036, 466, 4)
					));
					break;
				case "di2":
					this.gestureUtil.addGesture("di2", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1013, 534, 3), new pr.Point(1013, 559, 3), new pr.Point(1013, 581, 3),
						new pr.Point(988, 459, 4), new pr.Point(1002, 484, 4), new pr.Point(1016, 498, 4), new pr.Point(1031, 479, 4), new pr.Point(1041, 459, 4)
					));
					break;
				case "di3":
					this.gestureUtil.addGesture("di3", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(1013, 534, 3), new pr.Point(1013, 559, 3), new pr.Point(1013, 581, 3),
						new pr.Point(1003, 473, 4), new pr.Point(1013, 496, 4)
					));
					break;
				case "du0":
					this.gestureUtil.addGesture("du0", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(992, 531, 3), new pr.Point(990, 561, 3), new pr.Point(990, 584, 3), new pr.Point(1005, 592, 3), new pr.Point(1021, 587, 3), new pr.Point(1033, 569, 3), new pr.Point(1036, 541, 3), new pr.Point(1036, 556, 3), new pr.Point(1035, 574, 3), new pr.Point(1043, 596, 3),
						new pr.Point(1008, 488, 4), new pr.Point(1036, 491, 4)
					));
					break;
				case "du1":
					this.gestureUtil.addGesture("du1", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(992, 531, 3), new pr.Point(990, 561, 3), new pr.Point(990, 584, 3), new pr.Point(1005, 592, 3), new pr.Point(1021, 587, 3), new pr.Point(1033, 569, 3), new pr.Point(1036, 541, 3), new pr.Point(1036, 556, 3), new pr.Point(1035, 574, 3), new pr.Point(1043, 596, 3),
						new pr.Point(1015, 484, 4), new pr.Point(1036, 466, 4)
					));
					break;
				case "du2":
					this.gestureUtil.addGesture("du2", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(992, 531, 3), new pr.Point(990, 561, 3), new pr.Point(990, 584, 3), new pr.Point(1005, 592, 3), new pr.Point(1021, 587, 3), new pr.Point(1033, 569, 3), new pr.Point(1036, 541, 3), new pr.Point(1036, 556, 3), new pr.Point(1035, 574, 3), new pr.Point(1043, 596, 3),
						new pr.Point(988, 459, 4), new pr.Point(1002, 484, 4), new pr.Point(1016, 498, 4), new pr.Point(1031, 479, 4), new pr.Point(1041, 459, 4)
					));
					break;
				case "du3":
					this.gestureUtil.addGesture("du3", new Array(
						new pr.Point(963, 526, 1), new pr.Point(947, 514, 1), new pr.Point(936, 514, 1), new pr.Point(926, 518, 1), new pr.Point(917, 528, 1), new pr.Point(905, 538, 1), new pr.Point(904, 549, 1), new pr.Point(902, 564, 1), new pr.Point(902, 581, 1), new pr.Point(909, 589, 1), new pr.Point(922, 596, 1), new pr.Point(937, 596, 1), new pr.Point(951, 597, 1), new pr.Point(962, 589, 1),
						new pr.Point(965, 461, 2), new pr.Point(965, 498, 2), new pr.Point(965, 521, 2), new pr.Point(965, 539, 2), new pr.Point(965, 557, 2), new pr.Point(968, 576, 2), new pr.Point(978, 586, 2),
						new pr.Point(992, 531, 3), new pr.Point(990, 561, 3), new pr.Point(990, 584, 3), new pr.Point(1005, 592, 3), new pr.Point(1021, 587, 3), new pr.Point(1033, 569, 3), new pr.Point(1036, 541, 3), new pr.Point(1036, 556, 3), new pr.Point(1035, 574, 3), new pr.Point(1043, 596, 3),
						new pr.Point(1003, 473, 4), new pr.Point(1013, 496, 4)
					));
					break;
				case "tɑ0":
					this.gestureUtil.addGesture("tɑ0", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(857, 461, 3), new pr.Point(852, 448, 3), new pr.Point(834, 439, 3), new pr.Point(819, 444, 3), new pr.Point(814, 461, 3), new pr.Point(809, 481, 3), new pr.Point(809, 498, 3), new pr.Point(824, 509, 3), new pr.Point(841, 506, 3), new pr.Point(857, 493, 3), new pr.Point(860, 473, 3), new pr.Point(860, 484, 3), new pr.Point(862, 501, 3),
						new pr.Point(816, 410, 4), new pr.Point(855, 410, 4)
					));
					break;
				case "tɑ1":
					this.gestureUtil.addGesture("tɑ1", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(857, 461, 3), new pr.Point(852, 448, 3), new pr.Point(834, 439, 3), new pr.Point(819, 444, 3), new pr.Point(814, 461, 3), new pr.Point(809, 481, 3), new pr.Point(809, 498, 3), new pr.Point(824, 509, 3), new pr.Point(841, 506, 3), new pr.Point(857, 493, 3), new pr.Point(860, 473, 3), new pr.Point(860, 484, 3), new pr.Point(862, 501, 3),
						new pr.Point(840, 403, 4), new pr.Point(852, 390, 4)
					));
					break;
				case "tɑ2":
					this.gestureUtil.addGesture("tɑ2", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(857, 461, 3), new pr.Point(852, 448, 3), new pr.Point(834, 439, 3), new pr.Point(819, 444, 3), new pr.Point(814, 461, 3), new pr.Point(809, 481, 3), new pr.Point(809, 498, 3), new pr.Point(824, 509, 3), new pr.Point(841, 506, 3), new pr.Point(857, 493, 3), new pr.Point(860, 473, 3), new pr.Point(860, 484, 3), new pr.Point(862, 501, 3),
						new pr.Point(814, 380, 4), new pr.Point(820, 400, 4), new pr.Point(830, 416, 4), new pr.Point(842, 403, 4), new pr.Point(854, 383, 4)
					));
					break;
				case "tɑ3":
					this.gestureUtil.addGesture("tɑ3", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(857, 461, 3), new pr.Point(852, 448, 3), new pr.Point(834, 439, 3), new pr.Point(819, 444, 3), new pr.Point(814, 461, 3), new pr.Point(809, 481, 3), new pr.Point(809, 498, 3), new pr.Point(824, 509, 3), new pr.Point(841, 506, 3), new pr.Point(857, 493, 3), new pr.Point(860, 473, 3), new pr.Point(860, 484, 3), new pr.Point(862, 501, 3),
						new pr.Point(812, 393, 4), new pr.Point(825, 411, 4)
					));
					break;
				case "te0":
					this.gestureUtil.addGesture("te0", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(832, 471, 3), new pr.Point(852, 468, 3), new pr.Point(864, 461, 3), new pr.Point(850, 444, 3), new pr.Point(830, 436, 3), new pr.Point(814, 448, 3), new pr.Point(811, 466, 3), new pr.Point(811, 488, 3), new pr.Point(820, 499, 3), new pr.Point(840, 503, 3), new pr.Point(857, 491, 3),
						new pr.Point(816, 410, 4), new pr.Point(855, 410, 4)
					));
					break;
				case "te3":
					this.gestureUtil.addGesture("te3", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(832, 471, 3), new pr.Point(852, 468, 3), new pr.Point(864, 461, 3), new pr.Point(850, 444, 3), new pr.Point(830, 436, 3), new pr.Point(814, 448, 3), new pr.Point(811, 466, 3), new pr.Point(811, 488, 3), new pr.Point(820, 499, 3), new pr.Point(840, 503, 3), new pr.Point(857, 491, 3),
						new pr.Point(812, 393, 4), new pr.Point(825, 411, 4)
					));
					break;
				case "ti0":
					this.gestureUtil.addGesture("ti0", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(834, 449, 3), new pr.Point(834, 486, 3), new pr.Point(834, 504, 3),
						new pr.Point(816, 410, 4), new pr.Point(855, 410, 4)
					));
					break;
				case "ti1":
					this.gestureUtil.addGesture("ti1", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(834, 449, 3), new pr.Point(834, 486, 3), new pr.Point(834, 504, 3),
						new pr.Point(840, 403, 4), new pr.Point(852, 390, 4)
					));
					break;
				case "ti2":
					this.gestureUtil.addGesture("ti2", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(834, 449, 3), new pr.Point(834, 486, 3), new pr.Point(834, 504, 3),
						new pr.Point(814, 380, 4), new pr.Point(820, 400, 4), new pr.Point(830, 416, 4), new pr.Point(842, 403, 4), new pr.Point(854, 383, 4)
					));
					break;
				case "ti3":
					this.gestureUtil.addGesture("ti3", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(834, 449, 3), new pr.Point(834, 486, 3), new pr.Point(834, 504, 3),
						new pr.Point(812, 393, 4), new pr.Point(825, 411, 4)
					));
					break;
				case "tu0":
					this.gestureUtil.addGesture("tu0", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(809, 464, 3), new pr.Point(812, 489, 3), new pr.Point(827, 499, 3), new pr.Point(845, 489, 3), new pr.Point(854, 469, 3), new pr.Point(857, 449, 3), new pr.Point(857, 458, 3), new pr.Point(857, 481, 3), new pr.Point(860, 499, 3),
						new pr.Point(816, 410, 4), new pr.Point(855, 410, 4)
					));
					break;
				case "tu1":
					this.gestureUtil.addGesture("tu1", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(809, 464, 3), new pr.Point(812, 489, 3), new pr.Point(827, 499, 3), new pr.Point(845, 489, 3), new pr.Point(854, 469, 3), new pr.Point(857, 449, 3), new pr.Point(857, 458, 3), new pr.Point(857, 481, 3), new pr.Point(860, 499, 3),
						new pr.Point(840, 403, 4), new pr.Point(852, 390, 4)
					));
					break;
				case "tu2":
					this.gestureUtil.addGesture("tu2", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(809, 464, 3), new pr.Point(812, 489, 3), new pr.Point(827, 499, 3), new pr.Point(845, 489, 3), new pr.Point(854, 469, 3), new pr.Point(857, 449, 3), new pr.Point(857, 458, 3), new pr.Point(857, 481, 3), new pr.Point(860, 499, 3),
						new pr.Point(814, 380, 4), new pr.Point(820, 400, 4), new pr.Point(830, 416, 4), new pr.Point(842, 403, 4), new pr.Point(854, 383, 4)
					));
					break;
				case "tu3":
					this.gestureUtil.addGesture("tu3", new Array(
						new pr.Point(718, 446, 1), new pr.Point(732, 443, 1), new pr.Point(742, 443, 1), new pr.Point(755, 443, 1), new pr.Point(766, 443, 1), new pr.Point(782, 443, 1), new pr.Point(793., 439, 1),
						new pr.Point(754, 385, 2), new pr.Point(757, 410, 2), new pr.Point(757, 428, 2), new pr.Point(759, 442, 2), new pr.Point(759, 463, 2), new pr.Point(759, 484, 2), new pr.Point(762, 504, 2), new pr.Point(771, 513, 2), new pr.Point(786, 511, 2),
						new pr.Point(809, 464, 3), new pr.Point(812, 489, 3), new pr.Point(827, 499, 3), new pr.Point(845, 489, 3), new pr.Point(854, 469, 3), new pr.Point(857, 449, 3), new pr.Point(857, 458, 3), new pr.Point(857, 481, 3), new pr.Point(860, 499, 3),
						new pr.Point(812, 393, 4), new pr.Point(825, 411, 4)
					));
					break;
				case "nɑ0":
					this.gestureUtil.addGesture("nɑ0", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(865, 343, 3), new pr.Point(850, 330, 3), new pr.Point(830, 331, 3), new pr.Point(824, 350, 3), new pr.Point(819, 375, 3), new pr.Point(819, 398, 3), new pr.Point(829, 416, 3), new pr.Point(854, 421, 3), new pr.Point(865, 401, 3), new pr.Point(869, 371, 3), new pr.Point(869, 361, 3), new pr.Point(870, 390, 3), new pr.Point(877, 406, 3), new pr.Point(892, 411, 3),
						new pr.Point(844, 288, 4), new pr.Point(864, 290, 4)
					));
					break;
				case "nɑ1":
					this.gestureUtil.addGesture("nɑ1", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(865, 343, 3), new pr.Point(850, 330, 3), new pr.Point(830, 331, 3), new pr.Point(824, 350, 3), new pr.Point(819, 375, 3), new pr.Point(819, 398, 3), new pr.Point(829, 416, 3), new pr.Point(854, 421, 3), new pr.Point(865, 401, 3), new pr.Point(869, 371, 3), new pr.Point(869, 361, 3), new pr.Point(870, 390, 3), new pr.Point(877, 406, 3), new pr.Point(892, 411, 3),
						new pr.Point(840, 293, 4), new pr.Point(865, 262, 4)
					));
					break;
				case "nɑ2":
					this.gestureUtil.addGesture("nɑ2", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(865, 343, 3), new pr.Point(850, 330, 3), new pr.Point(830, 331, 3), new pr.Point(824, 350, 3), new pr.Point(819, 375, 3), new pr.Point(819, 398, 3), new pr.Point(829, 416, 3), new pr.Point(854, 421, 3), new pr.Point(865, 401, 3), new pr.Point(869, 371, 3), new pr.Point(869, 361, 3), new pr.Point(870, 390, 3), new pr.Point(877, 406, 3), new pr.Point(892, 411, 3),
						new pr.Point(820, 257, 4), new pr.Point(830, 277, 4), new pr.Point(842, 297, 4), new pr.Point(855, 290, 4), new pr.Point(869, 267, 4)
					));
					break;
				case "nɑ3":
					this.gestureUtil.addGesture("nɑ3", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(865, 343, 3), new pr.Point(850, 330, 3), new pr.Point(830, 331, 3), new pr.Point(824, 350, 3), new pr.Point(819, 375, 3), new pr.Point(819, 398, 3), new pr.Point(829, 416, 3), new pr.Point(854, 421, 3), new pr.Point(865, 401, 3), new pr.Point(869, 371, 3), new pr.Point(869, 361, 3), new pr.Point(870, 390, 3), new pr.Point(877, 406, 3), new pr.Point(892, 411, 3),
						new pr.Point(830, 263, 4), new pr.Point(842, 287, 4)
					));
					break;
				case "ne0":
					this.gestureUtil.addGesture("ne0", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(825, 368, 3), new pr.Point(857, 371, 3), new pr.Point(877, 366, 3), new pr.Point(864, 351, 3), new pr.Point(840, 333, 3), new pr.Point(825, 336, 3), new pr.Point(819, 358, 3), new pr.Point(819, 383, 3), new pr.Point(824, 405, 3), new pr.Point(840, 413, 3), new pr.Point(860, 413, 3), new pr.Point(875, 398, 3),
						new pr.Point(844, 288, 4), new pr.Point(864, 290, 4)
					));
					break;
				case "ne1":
					this.gestureUtil.addGesture("ne1", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(825, 368, 3), new pr.Point(857, 371, 3), new pr.Point(877, 366, 3), new pr.Point(864, 351, 3), new pr.Point(840, 333, 3), new pr.Point(825, 336, 3), new pr.Point(819, 358, 3), new pr.Point(819, 383, 3), new pr.Point(824, 405, 3), new pr.Point(840, 413, 3), new pr.Point(860, 413, 3), new pr.Point(875, 398, 3),
						new pr.Point(840, 293, 4), new pr.Point(865, 262, 4)
					));
					break;
				case "ne3":
					this.gestureUtil.addGesture("ne3", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(825, 368, 3), new pr.Point(857, 371, 3), new pr.Point(877, 366, 3), new pr.Point(864, 351, 3), new pr.Point(840, 333, 3), new pr.Point(825, 336, 3), new pr.Point(819, 358, 3), new pr.Point(819, 383, 3), new pr.Point(824, 405, 3), new pr.Point(840, 413, 3), new pr.Point(860, 413, 3), new pr.Point(875, 398, 3),
						new pr.Point(830, 263, 4), new pr.Point(842, 287, 4)
					));
					break;
				case "ni0":
					this.gestureUtil.addGesture("ni0", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(840, 361, 3), new pr.Point(840, 390, 3),
						new pr.Point(844, 288, 4), new pr.Point(864, 290, 4)
					));
					break;
				case "ni1":
					this.gestureUtil.addGesture("ni1", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(840, 361, 3), new pr.Point(840, 390, 3),
						new pr.Point(840, 293, 4), new pr.Point(865, 262, 4)
					));
					break;
				case "ni2":
					this.gestureUtil.addGesture("ni2", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(840, 361, 3), new pr.Point(840, 390, 3),
						new pr.Point(820, 257, 4), new pr.Point(830, 277, 4), new pr.Point(842, 297, 4), new pr.Point(855, 290, 4), new pr.Point(869, 267, 4)
					));
					break;
				case "ni3":
					this.gestureUtil.addGesture("ni3", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(840, 361, 3), new pr.Point(840, 390, 3),
						new pr.Point(830, 263, 4), new pr.Point(842, 287, 4)
					));
					break;
				case "nu1":
					this.gestureUtil.addGesture("nu1", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(819, 353, 3), new pr.Point(817, 378, 3), new pr.Point(817, 395, 3), new pr.Point(827, 408, 3), new pr.Point(845, 411, 3), new pr.Point(859, 398, 3), new pr.Point(865, 375, 3), new pr.Point(872, 345, 3), new pr.Point(867, 356, 3), new pr.Point(865, 380, 3), new pr.Point(865, 398, 3),
						new pr.Point(840, 293, 4), new pr.Point(865, 262, 4)
					));
					break;
				case "nu2":
					this.gestureUtil.addGesture("nu2", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(819, 353, 3), new pr.Point(817, 378, 3), new pr.Point(817, 395, 3), new pr.Point(827, 408, 3), new pr.Point(845, 411, 3), new pr.Point(859, 398, 3), new pr.Point(865, 375, 3), new pr.Point(872, 345, 3), new pr.Point(867, 356, 3), new pr.Point(865, 380, 3), new pr.Point(865, 398, 3),
						new pr.Point(820, 257, 4), new pr.Point(830, 277, 4), new pr.Point(842, 297, 4), new pr.Point(855, 290, 4), new pr.Point(869, 267, 4)
					));
					break;
				case "nu3":
					this.gestureUtil.addGesture("nu3", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(819, 353, 3), new pr.Point(817, 378, 3), new pr.Point(817, 395, 3), new pr.Point(827, 408, 3), new pr.Point(845, 411, 3), new pr.Point(859, 398, 3), new pr.Point(865, 375, 3), new pr.Point(872, 345, 3), new pr.Point(867, 356, 3), new pr.Point(865, 380, 3), new pr.Point(865, 398, 3),
						new pr.Point(830, 263, 4), new pr.Point(842, 287, 4)
					));
					break;
				case "nü2":
					this.gestureUtil.addGesture("nü2", new Array(
						new pr.Point(736, 326, 1), new pr.Point(746, 335, 1), new pr.Point(747, 343, 1), new pr.Point(747, 356, 1), new pr.Point(747, 370, 1), new pr.Point(747, 382, 1), new pr.Point(744, 394, 1), new pr.Point(743, 407, 1),
						new pr.Point(751, 343, 2), new pr.Point(762, 333, 2), new pr.Point(777, 331, 2), new pr.Point(791, 340, 2), new pr.Point(796, 356, 2), new pr.Point(799, 376, 2), new pr.Point(799, 393, 2), new pr.Point(799, 411, 2),
						new pr.Point(819, 353, 3), new pr.Point(817, 378, 3), new pr.Point(817, 395, 3), new pr.Point(827, 408, 3), new pr.Point(845, 411, 3), new pr.Point(859, 398, 3), new pr.Point(865, 375, 3), new pr.Point(872, 345, 3), new pr.Point(867, 356, 3), new pr.Point(865, 380, 3), new pr.Point(865, 398, 3),
						new pr.Point(819, 312, 4),
						new pr.Point(872, 312, 5),
						new pr.Point(819, 248, 6), new pr.Point(827, 278, 6), new pr.Point(837, 293, 6), new pr.Point(857, 273, 6)
					));
					break;
				case "lɑ0":
					this.gestureUtil.addGesture("lɑ0", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(833, 505, 2), new pr.Point(807, 494, 2), new pr.Point(791, 494, 2), new pr.Point(782, 511, 2), new pr.Point(773, 529, 2), new pr.Point(770, 551, 2), new pr.Point(780, 578, 2), new pr.Point(807, 583, 2), new pr.Point(827, 574, 2), new pr.Point(840, 547, 2), new pr.Point(842, 518, 2), new pr.Point(842, 551, 2), new pr.Point(843, 569, 2), new pr.Point(854, 568, 2),
						new pr.Point(812, 461, 3), new pr.Point(834, 461, 3)
					));
					break;
				case "lɑ1":
					this.gestureUtil.addGesture("lɑ1", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(833, 505, 2), new pr.Point(807, 494, 2), new pr.Point(791, 494, 2), new pr.Point(782, 511, 2), new pr.Point(773, 529, 2), new pr.Point(770, 551, 2), new pr.Point(780, 578, 2), new pr.Point(807, 583, 2), new pr.Point(827, 574, 2), new pr.Point(840, 547, 2), new pr.Point(842, 518, 2), new pr.Point(842, 551, 2), new pr.Point(843, 569, 2), new pr.Point(854, 568, 2),
						new pr.Point(818, 455, 3), new pr.Point(830, 428, 3)
					));
					break;
				case "lɑ2":
					this.gestureUtil.addGesture("lɑ2", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(833, 505, 2), new pr.Point(807, 494, 2), new pr.Point(791, 494, 2), new pr.Point(782, 511, 2), new pr.Point(773, 529, 2), new pr.Point(770, 551, 2), new pr.Point(780, 578, 2), new pr.Point(807, 583, 2), new pr.Point(827, 574, 2), new pr.Point(840, 547, 2), new pr.Point(842, 518, 2), new pr.Point(842, 551, 2), new pr.Point(843, 569, 2), new pr.Point(854, 568, 2),
						new pr.Point(795, 435, 3), new pr.Point(804, 460, 3), new pr.Point(816, 463, 3), new pr.Point(831, 441, 3)
					));
					break;
				case "lɑ3":
					this.gestureUtil.addGesture("lɑ3", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(833, 505, 2), new pr.Point(807, 494, 2), new pr.Point(791, 494, 2), new pr.Point(782, 511, 2), new pr.Point(773, 529, 2), new pr.Point(770, 551, 2), new pr.Point(780, 578, 2), new pr.Point(807, 583, 2), new pr.Point(827, 574, 2), new pr.Point(840, 547, 2), new pr.Point(842, 518, 2), new pr.Point(842, 551, 2), new pr.Point(843, 569, 2), new pr.Point(854, 568, 2),
						new pr.Point(791, 422, 3), new pr.Point(801, 444, 3), new pr.Point(809, 463, 3)
					));
					break;
				case "le0":
					this.gestureUtil.addGesture("le0", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(779, 536, 2), new pr.Point(816, 533, 2), new pr.Point(846, 533, 2), new pr.Point(842, 517, 2), new pr.Point(819, 506, 2), new pr.Point(800, 503, 2), new pr.Point(785, 511, 2), new pr.Point(782, 529, 2), new pr.Point(780, 548, 2), new pr.Point(792, 565, 2), new pr.Point(806, 574, 2), new pr.Point(827, 578, 2), new pr.Point(843, 565, 2),
						new pr.Point(812, 461, 3), new pr.Point(834, 461, 3)
					));
					break;
				case "le3":
					this.gestureUtil.addGesture("le3", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(779, 536, 2), new pr.Point(816, 533, 2), new pr.Point(846, 533, 2), new pr.Point(842, 517, 2), new pr.Point(819, 506, 2), new pr.Point(800, 503, 2), new pr.Point(785, 511, 2), new pr.Point(782, 529, 2), new pr.Point(780, 548, 2), new pr.Point(792, 565, 2), new pr.Point(806, 574, 2), new pr.Point(827, 578, 2), new pr.Point(843, 565, 2),
						new pr.Point(791, 422, 3), new pr.Point(801, 444, 3), new pr.Point(809, 463, 3)
					));
					break;
				case "li0":
					this.gestureUtil.addGesture("li0", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(810, 499, 2), new pr.Point(809, 536, 2), new pr.Point(809, 557, 2),
						new pr.Point(812, 461, 3), new pr.Point(834, 461, 3)
					));
					break;
				case "li1":
					this.gestureUtil.addGesture("li1", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(810, 499, 2), new pr.Point(809, 536, 2), new pr.Point(809, 557, 2),
						new pr.Point(818, 455, 3), new pr.Point(830, 428, 3)
					));
					break;
				case "li2":
					this.gestureUtil.addGesture("li2", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(810, 499, 2), new pr.Point(809, 536, 2), new pr.Point(809, 557, 2),
						new pr.Point(795, 435, 3), new pr.Point(804, 460, 3), new pr.Point(816, 463, 3), new pr.Point(831, 441, 3)
					));
					break;
				case "li3":
					this.gestureUtil.addGesture("li3", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(810, 499, 2), new pr.Point(809, 536, 2), new pr.Point(809, 557, 2),
						new pr.Point(791, 422, 3), new pr.Point(801, 444, 3), new pr.Point(809, 463, 3)
					));
					break;
				case "lu0":
					this.gestureUtil.addGesture("lu0", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(780, 509, 2), new pr.Point(780, 533, 2), new pr.Point(780, 559, 2), new pr.Point(785, 580, 2), new pr.Point(804, 589, 2), new pr.Point(828, 578, 2), new pr.Point(842, 535, 2), new pr.Point(842, 508, 2), new pr.Point(842, 542, 2), new pr.Point(840, 565, 2), new pr.Point(848, 577, 2),
						new pr.Point(812, 461, 3), new pr.Point(834, 461, 3)
					));
					break;
				case "lu1":
					this.gestureUtil.addGesture("lu1", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(780, 509, 2), new pr.Point(780, 533, 2), new pr.Point(780, 559, 2), new pr.Point(785, 580, 2), new pr.Point(804, 589, 2), new pr.Point(828, 578, 2), new pr.Point(842, 535, 2), new pr.Point(842, 508, 2), new pr.Point(842, 542, 2), new pr.Point(840, 565, 2), new pr.Point(848, 577, 2),
						new pr.Point(818, 455, 3), new pr.Point(830, 428, 3)
					));
					break;
				case "lu2":
					this.gestureUtil.addGesture("lu2", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(780, 509, 2), new pr.Point(780, 533, 2), new pr.Point(780, 559, 2), new pr.Point(785, 580, 2), new pr.Point(804, 589, 2), new pr.Point(828, 578, 2), new pr.Point(842, 535, 2), new pr.Point(842, 508, 2), new pr.Point(842, 542, 2), new pr.Point(840, 565, 2), new pr.Point(848, 577, 2),
						new pr.Point(795, 435, 3), new pr.Point(804, 460, 3), new pr.Point(816, 463, 3), new pr.Point(831, 441, 3)
					));
					break;
				case "lu3":
					this.gestureUtil.addGesture("lu3", new Array(
						new pr.Point(753, 410, 1), new pr.Point(750, 435, 1), new pr.Point(750, 456, 1), new pr.Point(748, 478, 1), new pr.Point(747, 502, 1), new pr.Point(747, 530, 1), new pr.Point(747, 555, 1), new pr.Point(747, 578, 1), new pr.Point(747, 590, 1),
						new pr.Point(780, 509, 2), new pr.Point(780, 533, 2), new pr.Point(780, 559, 2), new pr.Point(785, 580, 2), new pr.Point(804, 589, 2), new pr.Point(828, 578, 2), new pr.Point(842, 535, 2), new pr.Point(842, 508, 2), new pr.Point(842, 542, 2), new pr.Point(840, 565, 2), new pr.Point(848, 577, 2),
						new pr.Point(791, 422, 3), new pr.Point(801, 444, 3), new pr.Point(809, 463, 3)
					));
					break;
				case "ge0":
					this.gestureUtil.addGesture("ge0", new Array(
						new pr.Point(998, 333, 1), new pr.Point(979, 329, 1), new pr.Point(960, 326, 1), new pr.Point(944, 326, 1), new pr.Point(926, 338, 1), new pr.Point(919, 348, 1), new pr.Point(913, 364, 1), new pr.Point(913, 384, 1), new pr.Point(917, 402, 1), new pr.Point(924, 416, 1), new pr.Point(941, 426, 1), new pr.Point(962, 432, 1), new pr.Point(976, 431, 1), new pr.Point(989, 426, 1),
						new pr.Point(998, 345, 2), new pr.Point(998, 381, 2), new pr.Point(998, 435, 2), new pr.Point(998, 458, 2), new pr.Point(1000, 479, 2), new pr.Point(995, 504, 2), new pr.Point(980, 518, 2), new pr.Point(958, 521, 2), new pr.Point(941, 515, 2), new pr.Point(935, 499, 2),
						new pr.Point(1050, 372, 3), new pr.Point(1075, 368, 3), new pr.Point(1095, 357, 3), new pr.Point(1095, 341, 3), new pr.Point(1080.04, 330, 3), new pr.Point(1057, 321, 3), new pr.Point(1036, 321, 3), new pr.Point(1022, 333, 3), new pr.Point(1018, 351, 3), new pr.Point(1018, 374, 3), new pr.Point(1018, 398, 3), new pr.Point(1028, 413, 3), new pr.Point(1048, 423, 3), new pr.Point(1071, 426, 3), new pr.Point(1090, 423, 3), new pr.Point(1105, 413, 3),
						new pr.Point(1033, 278, 4), new pr.Point(1075, 278, 4)
					));
					break;
				case "ge1":
					this.gestureUtil.addGesture("ge1", new Array(
						new pr.Point(998, 333, 1), new pr.Point(979, 329, 1), new pr.Point(960, 326, 1), new pr.Point(944, 326, 1), new pr.Point(926, 338, 1), new pr.Point(919, 348, 1), new pr.Point(913, 364, 1), new pr.Point(913, 384, 1), new pr.Point(917, 402, 1), new pr.Point(924, 416, 1), new pr.Point(941, 426, 1), new pr.Point(962, 432, 1), new pr.Point(976, 431, 1), new pr.Point(989, 426, 1),
						new pr.Point(998, 345, 2), new pr.Point(998, 381, 2), new pr.Point(998, 435, 2), new pr.Point(998, 458, 2), new pr.Point(1000, 479, 2), new pr.Point(995, 504, 2), new pr.Point(980, 518, 2), new pr.Point(958, 521, 2), new pr.Point(941, 515, 2), new pr.Point(935, 499, 2),
						new pr.Point(1050, 372, 3), new pr.Point(1075, 368, 3), new pr.Point(1095, 357, 3), new pr.Point(1095, 341, 3), new pr.Point(1080.04, 330, 3), new pr.Point(1057, 321, 3), new pr.Point(1036, 321, 3), new pr.Point(1022, 333, 3), new pr.Point(1018, 351, 3), new pr.Point(1018, 374, 3), new pr.Point(1018, 398, 3), new pr.Point(1028, 413, 3), new pr.Point(1048, 423, 3), new pr.Point(1071, 426, 3), new pr.Point(1090, 423, 3), new pr.Point(1105, 413, 3),
						new pr.Point(1047, 290, 4), new pr.Point(1065, 264, 4)
					));
					break;
				case "ge2":
					this.gestureUtil.addGesture("ge2", new Array(
						new pr.Point(998, 333, 1), new pr.Point(979, 329, 1), new pr.Point(960, 326, 1), new pr.Point(944, 326, 1), new pr.Point(926, 338, 1), new pr.Point(919, 348, 1), new pr.Point(913, 364, 1), new pr.Point(913, 384, 1), new pr.Point(917, 402, 1), new pr.Point(924, 416, 1), new pr.Point(941, 426, 1), new pr.Point(962, 432, 1), new pr.Point(976, 431, 1), new pr.Point(989, 426, 1),
						new pr.Point(998, 345, 2), new pr.Point(998, 381, 2), new pr.Point(998, 435, 2), new pr.Point(998, 458, 2), new pr.Point(1000, 479, 2), new pr.Point(995, 504, 2), new pr.Point(980, 518, 2), new pr.Point(958, 521, 2), new pr.Point(941, 515, 2), new pr.Point(935, 499, 2),
						new pr.Point(1050, 372, 3), new pr.Point(1075, 368, 3), new pr.Point(1095, 357, 3), new pr.Point(1095, 341, 3), new pr.Point(1080.04, 330, 3), new pr.Point(1057, 321, 3), new pr.Point(1036, 321, 3), new pr.Point(1022, 333, 3), new pr.Point(1018, 351, 3), new pr.Point(1018, 374, 3), new pr.Point(1018, 398, 3), new pr.Point(1028, 413, 3), new pr.Point(1048, 423, 3), new pr.Point(1071, 426, 3), new pr.Point(1090, 423, 3), new pr.Point(1105, 413, 3),
						new pr.Point(1010, 249, 4), new pr.Point(1024, 275, 4), new pr.Point(1037, 297, 4), new pr.Point(1053, 282, 4), new pr.Point(1066, 261, 4)
					));
					break;
				case "ge3":
					this.gestureUtil.addGesture("ge3", new Array(
						new pr.Point(998, 333, 1), new pr.Point(979, 329, 1), new pr.Point(960, 326, 1), new pr.Point(944, 326, 1), new pr.Point(926, 338, 1), new pr.Point(919, 348, 1), new pr.Point(913, 364, 1), new pr.Point(913, 384, 1), new pr.Point(917, 402, 1), new pr.Point(924, 416, 1), new pr.Point(941, 426, 1), new pr.Point(962, 432, 1), new pr.Point(976, 431, 1), new pr.Point(989, 426, 1),
						new pr.Point(998, 345, 2), new pr.Point(998, 381, 2), new pr.Point(998, 435, 2), new pr.Point(998, 458, 2), new pr.Point(1000, 479, 2), new pr.Point(995, 504, 2), new pr.Point(980, 518, 2), new pr.Point(958, 521, 2), new pr.Point(941, 515, 2), new pr.Point(935, 499, 2),
						new pr.Point(1050, 372, 3), new pr.Point(1075, 368, 3), new pr.Point(1095, 357, 3), new pr.Point(1095, 341, 3), new pr.Point(1080.04, 330, 3), new pr.Point(1057, 321, 3), new pr.Point(1036, 321, 3), new pr.Point(1022, 333, 3), new pr.Point(1018, 351, 3), new pr.Point(1018, 374, 3), new pr.Point(1018, 398, 3), new pr.Point(1028, 413, 3), new pr.Point(1048, 423, 3), new pr.Point(1071, 426, 3), new pr.Point(1090, 423, 3), new pr.Point(1105, 413, 3),
						new pr.Point(1015, 243, 4), new pr.Point(1033, 270, 4), new pr.Point(1044, 287, 4)
					));
					break;
				case "gu0":
					this.gestureUtil.addGesture("gu0", new Array(
						new pr.Point(998, 333, 1), new pr.Point(979, 329, 1), new pr.Point(960, 326, 1), new pr.Point(944, 326, 1), new pr.Point(926, 338, 1), new pr.Point(919, 348, 1), new pr.Point(913, 364, 1), new pr.Point(913, 384, 1), new pr.Point(917, 402, 1), new pr.Point(924, 416, 1), new pr.Point(941, 426, 1), new pr.Point(962, 432, 1), new pr.Point(976, 431, 1), new pr.Point(989, 426, 1),
						new pr.Point(998, 345, 2), new pr.Point(998, 381, 2), new pr.Point(998, 435, 2), new pr.Point(998, 458, 2), new pr.Point(1000, 479, 2), new pr.Point(995, 504, 2), new pr.Point(980, 518, 2), new pr.Point(958, 521, 2), new pr.Point(941, 515, 2), new pr.Point(935, 499, 2),
						new pr.Point(1018, 333, 3), new pr.Point(1018, 369, 3), new pr.Point(1019, 395, 3), new pr.Point(1025, 414, 3), new pr.Point(1045, 423, 3), new pr.Point(1063, 423, 3), new pr.Point(1083, 408, 3), new pr.Point(1092, 366, 3), new pr.Point(1093, 335, 3), new pr.Point(1093, 351, 3), new pr.Point(1090, 378, 3), new pr.Point(1090, 402, 3), new pr.Point(1095, 416, 3), new pr.Point(1107, 428, 3),
						new pr.Point(1033, 278, 4), new pr.Point(1075, 278, 4)
					));
					break;
				case "gu2":
					this.gestureUtil.addGesture("gu2", new Array(
						new pr.Point(998, 333, 1), new pr.Point(979, 329, 1), new pr.Point(960, 326, 1), new pr.Point(944, 326, 1), new pr.Point(926, 338, 1), new pr.Point(919, 348, 1), new pr.Point(913, 364, 1), new pr.Point(913, 384, 1), new pr.Point(917, 402, 1), new pr.Point(924, 416, 1), new pr.Point(941, 426, 1), new pr.Point(962, 432, 1), new pr.Point(976, 431, 1), new pr.Point(989, 426, 1),
						new pr.Point(998, 345, 2), new pr.Point(998, 381, 2), new pr.Point(998, 435, 2), new pr.Point(998, 458, 2), new pr.Point(1000, 479, 2), new pr.Point(995, 504, 2), new pr.Point(980, 518, 2), new pr.Point(958, 521, 2), new pr.Point(941, 515, 2), new pr.Point(935, 499, 2),
						new pr.Point(1018, 333, 3), new pr.Point(1018, 369, 3), new pr.Point(1019, 395, 3), new pr.Point(1025, 414, 3), new pr.Point(1045, 423, 3), new pr.Point(1063, 423, 3), new pr.Point(1083, 408, 3), new pr.Point(1092, 366, 3), new pr.Point(1093, 335, 3), new pr.Point(1093, 351, 3), new pr.Point(1090, 378, 3), new pr.Point(1090, 402, 3), new pr.Point(1095, 416, 3), new pr.Point(1107, 428, 3),
						new pr.Point(1010, 249, 4), new pr.Point(1024, 275, 4), new pr.Point(1037, 297, 4), new pr.Point(1053, 282, 4), new pr.Point(1066, 261, 4)
					));
					break;
				case "gu3":
					this.gestureUtil.addGesture("gu3", new Array(
						new pr.Point(998, 333, 1), new pr.Point(979, 329, 1), new pr.Point(960, 326, 1), new pr.Point(944, 326, 1), new pr.Point(926, 338, 1), new pr.Point(919, 348, 1), new pr.Point(913, 364, 1), new pr.Point(913, 384, 1), new pr.Point(917, 402, 1), new pr.Point(924, 416, 1), new pr.Point(941, 426, 1), new pr.Point(962, 432, 1), new pr.Point(976, 431, 1), new pr.Point(989, 426, 1),
						new pr.Point(998, 345, 2), new pr.Point(998, 381, 2), new pr.Point(998, 435, 2), new pr.Point(998, 458, 2), new pr.Point(1000, 479, 2), new pr.Point(995, 504, 2), new pr.Point(980, 518, 2), new pr.Point(958, 521, 2), new pr.Point(941, 515, 2), new pr.Point(935, 499, 2),
						new pr.Point(1018, 333, 3), new pr.Point(1018, 369, 3), new pr.Point(1019, 395, 3), new pr.Point(1025, 414, 3), new pr.Point(1045, 423, 3), new pr.Point(1063, 423, 3), new pr.Point(1083, 408, 3), new pr.Point(1092, 366, 3), new pr.Point(1093, 335, 3), new pr.Point(1093, 351, 3), new pr.Point(1090, 378, 3), new pr.Point(1090, 402, 3), new pr.Point(1095, 416, 3), new pr.Point(1107, 428, 3),
						new pr.Point(1015, 243, 4), new pr.Point(1033, 270, 4), new pr.Point(1044, 287, 4)
					));
					break;
				case "kɑ0":
					this.gestureUtil.addGesture("kɑ0", new Array(
						new pr.Point(810, 321, 1), new pr.Point(810, 345, 1), new pr.Point(810, 368, 1), new pr.Point(810, 389, 1), new pr.Point(810, 413, 1), new pr.Point(810, 434, 1), new pr.Point(810, 458, 1), new pr.Point(810, 475, 1), new pr.Point(810, 488, 1), new pr.Point(810, 501, 1), new pr.Point(810, 514, 1),
						new pr.Point(851, 430, 2), new pr.Point(831, 444, 2), new pr.Point(818, 454, 2), new pr.Point(828, 464, 2), new pr.Point(858, 482, 2), new pr.Point(870, 491, 2),
						new pr.Point(950, 446, 3), new pr.Point(928, 432, 3), new pr.Point(913, 431, 3), new pr.Point(895, 431, 3), new pr.Point(887, 452, 3), new pr.Point(887, 475, 3), new pr.Point(895, 500, 3), new pr.Point(917, 512, 3), new pr.Point(934, 497, 3), new pr.Point(940, 473, 3), new pr.Point(943, 455, 3), new pr.Point(943, 481, 3), new pr.Point(944, 499, 3), new pr.Point(967, 514, 3),
						new pr.Point(908, 387, 4), new pr.Point(925, 387, 4)
					));
					break;
				case "kɑ2":
					this.gestureUtil.addGesture("kɑ2", new Array(
						new pr.Point(810, 321, 1), new pr.Point(810, 345, 1), new pr.Point(810, 368, 1), new pr.Point(810, 389, 1), new pr.Point(810, 413, 1), new pr.Point(810, 434, 1), new pr.Point(810, 458, 1), new pr.Point(810, 475, 1), new pr.Point(810, 488, 1), new pr.Point(810, 501, 1), new pr.Point(810, 514, 1),
						new pr.Point(851, 430, 2), new pr.Point(831, 444, 2), new pr.Point(818, 454, 2), new pr.Point(828, 464, 2), new pr.Point(858, 482, 2), new pr.Point(870, 491, 2),
						new pr.Point(950, 446, 3), new pr.Point(928, 432, 3), new pr.Point(913, 431, 3), new pr.Point(895, 431, 3), new pr.Point(887, 452, 3), new pr.Point(887, 475, 3), new pr.Point(895, 500, 3), new pr.Point(917, 512, 3), new pr.Point(934, 497, 3), new pr.Point(940, 473, 3), new pr.Point(943, 455, 3), new pr.Point(943, 481, 3), new pr.Point(944, 499, 3), new pr.Point(967, 514, 3),
						new pr.Point(889, 360, 4), new pr.Point(896, 384, 4), new pr.Point(911, 399, 4), new pr.Point(925, 390, 4), new pr.Point(941, 368, 4)
					));
					break;
				case "hu0":
					this.gestureUtil.addGesture("hu0", new Array(
						new pr.Point(664, 342, 1), new pr.Point(664, 363, 1), new pr.Point(663, 387, 1), new pr.Point(663, 410, 1), new pr.Point(660, 433, 1), new pr.Point(657, 449, 1), new pr.Point(657, 466, 1), new pr.Point(657, 479, 1), new pr.Point(657, 495, 1), new pr.Point(657, 507, 1),
						new pr.Point(660, 449, 2), new pr.Point(673, 446, 2), new pr.Point(688, 451, 2), new pr.Point(700, 461, 2), new pr.Point(705, 472, 2), new pr.Point(705, 491, 2), new pr.Point(705, 508, 2),
						new pr.Point(724, 461, 3), new pr.Point(723, 482, 3), new pr.Point(731, 499, 3), new pr.Point(749, 514, 3), new pr.Point(765, 503, 3), new pr.Point(771, 485, 3), new pr.Point(771, 461, 3), new pr.Point(771, 469, 3), new pr.Point(771, 485, 3), new pr.Point(771, 500, 3), new pr.Point(783, 509, 3),
						new pr.Point(744, 422, 4), new pr.Point(761, 422, 4)
					));
					break;
				case "hu1":
					this.gestureUtil.addGesture("hu1", new Array(
						new pr.Point(664, 342, 1), new pr.Point(664, 363, 1), new pr.Point(663, 387, 1), new pr.Point(663, 410, 1), new pr.Point(660, 433, 1), new pr.Point(657, 449, 1), new pr.Point(657, 466, 1), new pr.Point(657, 479, 1), new pr.Point(657, 495, 1), new pr.Point(657, 507, 1),
						new pr.Point(660, 449, 2), new pr.Point(673, 446, 2), new pr.Point(688, 451, 2), new pr.Point(700, 461, 2), new pr.Point(705, 472, 2), new pr.Point(705, 491, 2), new pr.Point(705, 508, 2),
						new pr.Point(724, 461, 3), new pr.Point(723, 482, 3), new pr.Point(731, 499, 3), new pr.Point(749, 514, 3), new pr.Point(765, 503, 3), new pr.Point(771, 485, 3), new pr.Point(771, 461, 3), new pr.Point(771, 469, 3), new pr.Point(771, 485, 3), new pr.Point(771, 500, 3), new pr.Point(783, 509, 3),
						new pr.Point(756, 417, 4), new pr.Point(780, 386, 4)
					));
					break;
				case "hu2":
					this.gestureUtil.addGesture("hu2", new Array(
						new pr.Point(664, 342, 1), new pr.Point(664, 363, 1), new pr.Point(663, 387, 1), new pr.Point(663, 410, 1), new pr.Point(660, 433, 1), new pr.Point(657, 449, 1), new pr.Point(657, 466, 1), new pr.Point(657, 479, 1), new pr.Point(657, 495, 1), new pr.Point(657, 507, 1),
						new pr.Point(660, 449, 2), new pr.Point(673, 446, 2), new pr.Point(688, 451, 2), new pr.Point(700, 461, 2), new pr.Point(705, 472, 2), new pr.Point(705, 491, 2), new pr.Point(705, 508, 2),
						new pr.Point(724, 461, 3), new pr.Point(723, 482, 3), new pr.Point(731, 499, 3), new pr.Point(749, 514, 3), new pr.Point(765, 503, 3), new pr.Point(771, 485, 3), new pr.Point(771, 461, 3), new pr.Point(771, 469, 3), new pr.Point(771, 485, 3), new pr.Point(771, 500, 3), new pr.Point(783, 509, 3),
						new pr.Point(729, 404, 4), new pr.Point(737, 419, 4), new pr.Point(752, 420, 4), new pr.Point(764, 401, 4)
					));
					break;
				case "hu3":
					this.gestureUtil.addGesture("hu3", new Array(
						new pr.Point(664, 342, 1), new pr.Point(664, 363, 1), new pr.Point(663, 387, 1), new pr.Point(663, 410, 1), new pr.Point(660, 433, 1), new pr.Point(657, 449, 1), new pr.Point(657, 466, 1), new pr.Point(657, 479, 1), new pr.Point(657, 495, 1), new pr.Point(657, 507, 1),
						new pr.Point(660, 449, 2), new pr.Point(673, 446, 2), new pr.Point(688, 451, 2), new pr.Point(700, 461, 2), new pr.Point(705, 472, 2), new pr.Point(705, 491, 2), new pr.Point(705, 508, 2),
						new pr.Point(724, 461, 3), new pr.Point(723, 482, 3), new pr.Point(731, 499, 3), new pr.Point(749, 514, 3), new pr.Point(765, 503, 3), new pr.Point(771, 485, 3), new pr.Point(771, 461, 3), new pr.Point(771, 469, 3), new pr.Point(771, 485, 3), new pr.Point(771, 500, 3), new pr.Point(783, 509, 3),
						new pr.Point(720, 375, 4), new pr.Point(737, 395, 4), new pr.Point(750, 414, 4)
					));
					break;
				case "ji0":
					this.gestureUtil.addGesture("ji0", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(813, 186, 3), new pr.Point(813, 205, 3), new pr.Point(813, 222, 3), new pr.Point(813, 234, 3),
						new pr.Point(816, 142, 4), new pr.Point(831, 142, 4)
					));
					break;
				case "ji1":
					this.gestureUtil.addGesture("ji1", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(813, 186, 3), new pr.Point(813, 205, 3), new pr.Point(813, 222, 3), new pr.Point(813, 234, 3),
						new pr.Point(819, 136, 4), new pr.Point(830, 120, 4)
					));
					break;
				case "ji2":
					this.gestureUtil.addGesture("ji2", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(813, 186, 3), new pr.Point(813, 205, 3), new pr.Point(813, 222, 3), new pr.Point(813, 234, 3),
						new pr.Point(794, 124, 4), new pr.Point(806, 147, 4), new pr.Point(824, 151, 4), new pr.Point(836, 129, 4)
					));
					break;
				case "ji3":
					this.gestureUtil.addGesture("ji3", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(813, 186, 3), new pr.Point(813, 205, 3), new pr.Point(813, 222, 3), new pr.Point(813, 234, 3),
						new pr.Point(797, 124, 4), new pr.Point(813, 148, 4)
					));
					break;
				case "ju0":
					this.gestureUtil.addGesture("ju0", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(806, 196, 3), new pr.Point(807, 220, 3), new pr.Point(815, 240, 3), new pr.Point(836, 238, 3), new pr.Point(848, 223, 3), new pr.Point(851, 205, 3), new pr.Point(852, 190, 3), new pr.Point(852, 205, 3), new pr.Point(852, 226, 3), new pr.Point(863, 241, 3),
						new pr.Point(816, 142, 4), new pr.Point(831, 142, 4)
					));
					break;
				case "ju1":
					this.gestureUtil.addGesture("ju1", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(806, 196, 3), new pr.Point(807, 220, 3), new pr.Point(815, 240, 3), new pr.Point(836, 238, 3), new pr.Point(848, 223, 3), new pr.Point(851, 205, 3), new pr.Point(852, 190, 3), new pr.Point(852, 205, 3), new pr.Point(852, 226, 3), new pr.Point(863, 241, 3),
						new pr.Point(819, 136, 4), new pr.Point(830, 120, 4)
					));
					break;
				case "ju2":
					this.gestureUtil.addGesture("ju2", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(806, 196, 3), new pr.Point(807, 220, 3), new pr.Point(815, 240, 3), new pr.Point(836, 238, 3), new pr.Point(848, 223, 3), new pr.Point(851, 205, 3), new pr.Point(852, 190, 3), new pr.Point(852, 205, 3), new pr.Point(852, 226, 3), new pr.Point(863, 241, 3),
						new pr.Point(794, 124, 4), new pr.Point(806, 147, 4), new pr.Point(824, 151, 4), new pr.Point(836, 129, 4)
					));
					break;
				case "ju3":
					this.gestureUtil.addGesture("ju3", new Array(
						new pr.Point(773, 181, 1), new pr.Point(773, 195, 1), new pr.Point(773, 205, 1), new pr.Point(773, 218.45, 1), new pr.Point(774, 231, 1), new pr.Point(776, 244.57, 1), new pr.Point(776, 258, 1), new pr.Point(776, 270, 1), new pr.Point(774, 281, 1), new pr.Point(770, 291, 1), new pr.Point(764, 302, 1), new pr.Point(758, 306, 1), new pr.Point(748, 302, 1),
						new pr.Point(743, 293, 1), new pr.Point(771, 147, 2),
						new pr.Point(806, 196, 3), new pr.Point(807, 220, 3), new pr.Point(815, 240, 3), new pr.Point(836, 238, 3), new pr.Point(848, 223, 3), new pr.Point(851, 205, 3), new pr.Point(852, 190, 3), new pr.Point(852, 205, 3), new pr.Point(852, 226, 3), new pr.Point(863, 241, 3),
						new pr.Point(797, 124, 4), new pr.Point(813, 148, 4)
					));
					break;
				case "qi0":
					this.gestureUtil.addGesture("qi0", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(825, 357, 3), new pr.Point(825, 377, 3), new pr.Point(825, 398, 3), new pr.Point(827, 417, 3),
						new pr.Point(816, 315, 4), new pr.Point(839, 314, 4)
					));
					break;
				case "qi1":
					this.gestureUtil.addGesture("qi1", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(825, 357, 3), new pr.Point(825, 377, 3), new pr.Point(825, 398, 3), new pr.Point(827, 417, 3),
						new pr.Point(828, 321, 4), new pr.Point(849, 297, 4)
					));
					break;
				case "qi2":
					this.gestureUtil.addGesture("qi2", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(825, 357, 3), new pr.Point(825, 377, 3), new pr.Point(825, 398, 3), new pr.Point(827, 417, 3),
						new pr.Point(803, 287, 4), new pr.Point(821, 311, 4), new pr.Point(833, 324, 4), new pr.Point(845, 299, 4),
					));
					break;
				case "qi3":
					this.gestureUtil.addGesture("qi3", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(825, 357, 3), new pr.Point(825, 377, 3), new pr.Point(825, 398, 3), new pr.Point(827, 417, 3),
						new pr.Point(803, 288, 4), new pr.Point(818, 317, 4), new pr.Point(825, 332, 4)
					));
					break;
				case "qu0":
					this.gestureUtil.addGesture("qu0", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(818, 365, 3), new pr.Point(816, 395, 3), new pr.Point(824, 417, 3), new pr.Point(845, 423, 3), new pr.Point(858, 411, 3), new pr.Point(869, 395, 3), new pr.Point(873, 371, 3), new pr.Point(873, 353, 3), new pr.Point(867, 368, 3), new pr.Point(866, 395, 3), new pr.Point(870, 414, 3), new pr.Point(887, 422, 3),
						new pr.Point(816, 315, 4), new pr.Point(839, 314, 4)
					));
					break;
				case "qu1":
					this.gestureUtil.addGesture("qu1", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(818, 365, 3), new pr.Point(816, 395, 3), new pr.Point(824, 417, 3), new pr.Point(845, 423, 3), new pr.Point(858, 411, 3), new pr.Point(869, 395, 3), new pr.Point(873, 371, 3), new pr.Point(873, 353, 3), new pr.Point(867, 368, 3), new pr.Point(866, 395, 3), new pr.Point(870, 414, 3), new pr.Point(887, 422, 3),
						new pr.Point(828, 321, 4), new pr.Point(849, 297, 4)
					));
					break;
				case "qu2":
					this.gestureUtil.addGesture("qu2", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(818, 365, 3), new pr.Point(816, 395, 3), new pr.Point(824, 417, 3), new pr.Point(845, 423, 3), new pr.Point(858, 411, 3), new pr.Point(869, 395, 3), new pr.Point(873, 371, 3), new pr.Point(873, 353, 3), new pr.Point(867, 368, 3), new pr.Point(866, 395, 3), new pr.Point(870, 414, 3), new pr.Point(887, 422, 3),
						new pr.Point(803, 287, 4), new pr.Point(821, 311, 4), new pr.Point(833, 324, 4), new pr.Point(845, 299, 4),
					));
					break;
				case "qu3":
					this.gestureUtil.addGesture("qu3", new Array(
						new pr.Point(789, 350, 1), new pr.Point(776, 345, 1), new pr.Point(761, 344, 1), new pr.Point(741, 344, 1), new pr.Point(731, 348, 1), new pr.Point(723, 356, 1), new pr.Point(722, 369, 1), new pr.Point(717, 378, 1), new pr.Point(717, 391, 1), new pr.Point(717, 405, 1), new pr.Point(718, 416, 1), new pr.Point(732, 426, 1), new pr.Point(747, 431, 1), new pr.Point(759, 431, 1), new pr.Point(771, 431, 1), new pr.Point(780, 425, 1),
						new pr.Point(791, 353, 2), new pr.Point(791, 373, 2), new pr.Point(791, 395, 2), new pr.Point(789, 410, 2), new pr.Point(788, 428, 2), new pr.Point(788, 444, 2), new pr.Point(788, 459, 2), new pr.Point(788, 475, 2), new pr.Point(788, 491, 2), new pr.Point(789, 506, 2), new pr.Point(791, 518, 2),
						new pr.Point(818, 365, 3), new pr.Point(816, 395, 3), new pr.Point(824, 417, 3), new pr.Point(845, 423, 3), new pr.Point(858, 411, 3), new pr.Point(869, 395, 3), new pr.Point(873, 371, 3), new pr.Point(873, 353, 3), new pr.Point(867, 368, 3), new pr.Point(866, 395, 3), new pr.Point(870, 414, 3), new pr.Point(887, 422, 3),
						new pr.Point(803, 288, 4), new pr.Point(818, 317, 4), new pr.Point(825, 332, 4)
					));
					break;
				case "xi0":
					this.gestureUtil.addGesture("xi0", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(831, 422, 3), new pr.Point(831, 446, 3), new pr.Point(831, 469, 3),
						new pr.Point(824, 366, 4), new pr.Point(848, 366, 4)
					));
					break;
				case "xi1":
					this.gestureUtil.addGesture("xi1", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(831, 422, 3), new pr.Point(831, 446, 3), new pr.Point(831, 469, 3),
						new pr.Point(831, 374, 4), new pr.Point(852, 351, 4), new pr.Point(864, 335, 4)
					));
					break;
				case "xi2":
					this.gestureUtil.addGesture("xi2", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(831, 422, 3), new pr.Point(831, 446, 3), new pr.Point(831, 469, 3),
						new pr.Point(809, 360, 4), new pr.Point(822, 375, 4), new pr.Point(836, 365, 4), new pr.Point(845, 335, 4)
					));
					break;
				case "xi3":
					this.gestureUtil.addGesture("xi3", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(831, 422, 3), new pr.Point(831, 446, 3), new pr.Point(831, 469, 3),
						new pr.Point(806, 347, 4), new pr.Point(818, 366, 4), new pr.Point(822, 375, 4)
					));
					break;
				case "xu0":
					this.gestureUtil.addGesture("xu0", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(816, 426, 3), new pr.Point(822, 458, 3), new pr.Point(842, 469, 3), new pr.Point(857, 457, 3), new pr.Point(858, 432, 3), new pr.Point(858, 408, 3), new pr.Point(858, 413, 3), new pr.Point(858, 431, 3), new pr.Point(861, 451, 3), new pr.Point(873, 464, 3), new pr.Point(884, 466, 3),
						new pr.Point(824, 366, 4), new pr.Point(848, 366, 4)
					));
					break;
				case "xu1":
					this.gestureUtil.addGesture("xu1", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(816, 426, 3), new pr.Point(822, 458, 3), new pr.Point(842, 469, 3), new pr.Point(857, 457, 3), new pr.Point(858, 432, 3), new pr.Point(858, 408, 3), new pr.Point(858, 413, 3), new pr.Point(858, 431, 3), new pr.Point(861, 451, 3), new pr.Point(873, 464, 3), new pr.Point(884, 466, 3),
						new pr.Point(831, 374, 4), new pr.Point(852, 351, 4), new pr.Point(864, 335, 4)
					));
					break;
				case "xu2":
					this.gestureUtil.addGesture("xu2", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(816, 426, 3), new pr.Point(822, 458, 3), new pr.Point(842, 469, 3), new pr.Point(857, 457, 3), new pr.Point(858, 432, 3), new pr.Point(858, 408, 3), new pr.Point(858, 413, 3), new pr.Point(858, 431, 3), new pr.Point(861, 451, 3), new pr.Point(873, 464, 3), new pr.Point(884, 466, 3),
						new pr.Point(809, 360, 4), new pr.Point(822, 375, 4), new pr.Point(836, 365, 4), new pr.Point(845, 335, 4)
					));
					break;
				case "xu3":
					this.gestureUtil.addGesture("xu3", new Array(
						new pr.Point(734, 395, 1), new pr.Point(741, 402, 1), new pr.Point(746, 411, 1), new pr.Point(750, 420, 1), new pr.Point(756, 431, 1), new pr.Point(761, 440, 1), new pr.Point(768, 448, 1), new pr.Point(775, 456, 1), new pr.Point(779, 464, 1), new pr.Point(783, 472, 1), new pr.Point(791, 479, 1),
						new pr.Point(785, 409, 2), new pr.Point(774, 423, 2), new pr.Point(763, 434, 2), new pr.Point(753, 441, 2), new pr.Point(740, 447, 2), new pr.Point(733, 457, 2), new pr.Point(723, 466, 2),
						new pr.Point(816, 426, 3), new pr.Point(822, 458, 3), new pr.Point(842, 469, 3), new pr.Point(857, 457, 3), new pr.Point(858, 432, 3), new pr.Point(858, 408, 3), new pr.Point(858, 413, 3), new pr.Point(858, 431, 3), new pr.Point(861, 451, 3), new pr.Point(873, 464, 3), new pr.Point(884, 466, 3),
						new pr.Point(806, 347, 4), new pr.Point(818, 366, 4), new pr.Point(822, 375, 4)
					));
					break;
				case "zi0":
					this.gestureUtil.addGesture("zi0", new Array(
						new pr.Point(586, 374, 1), new pr.Point(602, 372, 1), new pr.Point(625, 372, 1), new pr.Point(651, 372, 1), new pr.Point(666, 372, 1), new pr.Point(655, 386, 1), new pr.Point(642, 398, 1), new pr.Point(624, 414, 1), new pr.Point(608, 425, 1), new pr.Point(598, 435, 1), new pr.Point(589, 446, 1), new pr.Point(598, 447, 1), new pr.Point(618, 447, 1), new pr.Point(634, 444, 1), new pr.Point(654, 444, 1), new pr.Point(667, 444, 1),
						new pr.Point(705, 383, 2), new pr.Point(703, 404, 2), new pr.Point(700, 431, 2), new pr.Point(700, 449, 2),
						new pr.Point(702, 330, 3), new pr.Point(723, 330, 3)
					));
					break;
				case "zi2":
					this.gestureUtil.addGesture("zi2", new Array(
						new pr.Point(586, 374, 1), new pr.Point(602, 372, 1), new pr.Point(625, 372, 1), new pr.Point(651, 372, 1), new pr.Point(666, 372, 1), new pr.Point(655, 386, 1), new pr.Point(642, 398, 1), new pr.Point(624, 414, 1), new pr.Point(608, 425, 1), new pr.Point(598, 435, 1), new pr.Point(589, 446, 1), new pr.Point(598, 447, 1), new pr.Point(618, 447, 1), new pr.Point(634, 444, 1), new pr.Point(654, 444, 1), new pr.Point(667, 444, 1),
						new pr.Point(705, 383, 2), new pr.Point(703, 404, 2), new pr.Point(700, 431, 2), new pr.Point(700, 449, 2),
						new pr.Point(688, 311, 3), new pr.Point(697, 335, 3), new pr.Point(714, 327, 3), new pr.Point(729, 297, 3)
					));
					break;
				case "zi3":
					this.gestureUtil.addGesture("zi3", new Array(
						new pr.Point(586, 374, 1), new pr.Point(602, 372, 1), new pr.Point(625, 372, 1), new pr.Point(651, 372, 1), new pr.Point(666, 372, 1), new pr.Point(655, 386, 1), new pr.Point(642, 398, 1), new pr.Point(624, 414, 1), new pr.Point(608, 425, 1), new pr.Point(598, 435, 1), new pr.Point(589, 446, 1), new pr.Point(598, 447, 1), new pr.Point(618, 447, 1), new pr.Point(634, 444, 1), new pr.Point(654, 444, 1), new pr.Point(667, 444, 1),
						new pr.Point(705, 383, 2), new pr.Point(703, 404, 2), new pr.Point(700, 431, 2), new pr.Point(700, 449, 2),
						new pr.Point(694, 306, 3), new pr.Point(705, 329, 3)
					));
					break;
				case "ci0":
					this.gestureUtil.addGesture("ci0", new Array(
						new pr.Point(822, 350, 1), new pr.Point(810, 344, 1), new pr.Point(797, 344, 1), new pr.Point(779, 344, 1), new pr.Point(768, 348, 1), new pr.Point(762, 357, 1), new pr.Point(758, 370, 1), new pr.Point(756, 384, 1), new pr.Point(755, 397, 1), new pr.Point(759, 410, 1), new pr.Point(770, 420, 1), new pr.Point(783, 426, 1), new pr.Point(795, 429, 1), new pr.Point(808, 429, 1), new pr.Point(820, 423, 1),
						new pr.Point(864, 347, 2), new pr.Point(863, 374, 2), new pr.Point(863, 398, 2), new pr.Point(863, 423, 2),
						new pr.Point(839, 306, 3), new pr.Point(860, 306, 3), new pr.Point(883, 308, 3)
					));
					break;
				case "ci1":
					this.gestureUtil.addGesture("ci1", new Array(
						new pr.Point(822, 350, 1), new pr.Point(810, 344, 1), new pr.Point(797, 344, 1), new pr.Point(779, 344, 1), new pr.Point(768, 348, 1), new pr.Point(762, 357, 1), new pr.Point(758, 370, 1), new pr.Point(756, 384, 1), new pr.Point(755, 397, 1), new pr.Point(759, 410, 1), new pr.Point(770, 420, 1), new pr.Point(783, 426, 1), new pr.Point(795, 429, 1), new pr.Point(808, 429, 1), new pr.Point(820, 423, 1),
						new pr.Point(864, 347, 2), new pr.Point(863, 374, 2), new pr.Point(863, 398, 2), new pr.Point(863, 423, 2),
						new pr.Point(870, 311, 3), new pr.Point(893, 279, 3)
					));
					break;
				case "ci2":
					this.gestureUtil.addGesture("ci2", new Array(
						new pr.Point(822, 350, 1), new pr.Point(810, 344, 1), new pr.Point(797, 344, 1), new pr.Point(779, 344, 1), new pr.Point(768, 348, 1), new pr.Point(762, 357, 1), new pr.Point(758, 370, 1), new pr.Point(756, 384, 1), new pr.Point(755, 397, 1), new pr.Point(759, 410, 1), new pr.Point(770, 420, 1), new pr.Point(783, 426, 1), new pr.Point(795, 429, 1), new pr.Point(808, 429, 1), new pr.Point(820, 423, 1),
						new pr.Point(864, 347, 2), new pr.Point(863, 374, 2), new pr.Point(863, 398, 2), new pr.Point(863, 423, 2),
						new pr.Point(834, 284, 3), new pr.Point(849, 303, 3), new pr.Point(860, 320, 3), new pr.Point(870, 300, 3), new pr.Point(883, 291, 3)
					));
					break;
				case "ci3":
					this.gestureUtil.addGesture("ci3", new Array(
						new pr.Point(822, 350, 1), new pr.Point(810, 344, 1), new pr.Point(797, 344, 1), new pr.Point(779, 344, 1), new pr.Point(768, 348, 1), new pr.Point(762, 357, 1), new pr.Point(758, 370, 1), new pr.Point(756, 384, 1), new pr.Point(755, 397, 1), new pr.Point(759, 410, 1), new pr.Point(770, 420, 1), new pr.Point(783, 426, 1), new pr.Point(795, 429, 1), new pr.Point(808, 429, 1), new pr.Point(820, 423, 1),
						new pr.Point(864, 347, 2), new pr.Point(863, 374, 2), new pr.Point(863, 398, 2), new pr.Point(863, 423, 2),
						new pr.Point(828, 267, 3), new pr.Point(852, 303, 3)
					));
					break;
				case "ci0":
					this.gestureUtil.addGesture("ci0", new Array(
						new pr.Point(810, 347, 1), new pr.Point(795, 347, 1), new pr.Point(780, 344, 1), new pr.Point(767, 347, 1), new pr.Point(762, 365, 1), new pr.Point(773, 381, 1), new pr.Point(791, 386, 1), new pr.Point(809, 390, 1), new pr.Point(821, 404, 1), new pr.Point(821, 419, 1), new pr.Point(803, 422, 1), new pr.Point(783, 423, 1), new pr.Point(762, 413, 1),
						new pr.Point(864, 347, 2), new pr.Point(863, 374, 2), new pr.Point(863, 398, 2), new pr.Point(863, 423, 2),
						new pr.Point(839, 306, 3), new pr.Point(860, 306, 3), new pr.Point(883, 308, 3)
					));
					break;
				case "ci2":
					this.gestureUtil.addGesture("ci2", new Array(
						new pr.Point(810, 347, 1), new pr.Point(795, 347, 1), new pr.Point(780, 344, 1), new pr.Point(767, 347, 1), new pr.Point(762, 365, 1), new pr.Point(773, 381, 1), new pr.Point(791, 386, 1), new pr.Point(809, 390, 1), new pr.Point(821, 404, 1), new pr.Point(821, 419, 1), new pr.Point(803, 422, 1), new pr.Point(783, 423, 1), new pr.Point(762, 413, 1),
						new pr.Point(864, 347, 2), new pr.Point(863, 374, 2), new pr.Point(863, 398, 2), new pr.Point(863, 423, 2),
						new pr.Point(834, 284, 3), new pr.Point(849, 303, 3), new pr.Point(860, 320, 3), new pr.Point(870, 300, 3), new pr.Point(883, 291, 3)
					));
					break;
				case "ci3":
					this.gestureUtil.addGesture("ci3", new Array(
						new pr.Point(810, 347, 1), new pr.Point(795, 347, 1), new pr.Point(780, 344, 1), new pr.Point(767, 347, 1), new pr.Point(762, 365, 1), new pr.Point(773, 381, 1), new pr.Point(791, 386, 1), new pr.Point(809, 390, 1), new pr.Point(821, 404, 1), new pr.Point(821, 419, 1), new pr.Point(803, 422, 1), new pr.Point(783, 423, 1), new pr.Point(762, 413, 1),
						new pr.Point(864, 347, 2), new pr.Point(863, 374, 2), new pr.Point(863, 398, 2), new pr.Point(863, 423, 2),
						new pr.Point(828, 267, 3), new pr.Point(852, 303, 3)
					));
					break;
				case "zhi":
					this.gestureUtil.addGesture("zhi0", new Array(
						new pr.Point(661, 431, 1), new pr.Point(680, 431, 1), new pr.Point(701, 433, 1), new pr.Point(715, 437, 1), new pr.Point(728, 438, 1), new pr.Point(730, 441, 1), new pr.Point(722, 452, 1), new pr.Point(708, 463, 1), new pr.Point(699, 478, 1), new pr.Point(688, 488, 1), new pr.Point(680, 497, 1), new pr.Point(670, 506, 1), new pr.Point(678, 508, 1), new pr.Point(696, 508, 1), new pr.Point(709, 505, 1), new pr.Point(725, 505, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(827, 407, 5), new pr.Point(851, 407, 5)
					));
					break;
				case "zhi":
					this.gestureUtil.addGesture("zhi1", new Array(
						new pr.Point(661, 431, 1), new pr.Point(680, 431, 1), new pr.Point(701, 433, 1), new pr.Point(715, 437, 1), new pr.Point(728, 438, 1), new pr.Point(730, 441, 1), new pr.Point(722, 452, 1), new pr.Point(708, 463, 1), new pr.Point(699, 478, 1), new pr.Point(688, 488, 1), new pr.Point(680, 497, 1), new pr.Point(670, 506, 1), new pr.Point(678, 508, 1), new pr.Point(696, 508, 1), new pr.Point(709, 505, 1), new pr.Point(725, 505, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(843, 404, 5), new pr.Point(858, 383, 5)
					));
					break;
				case "zhi":
					this.gestureUtil.addGesture("zhi2", new Array(
						new pr.Point(661, 431, 1), new pr.Point(680, 431, 1), new pr.Point(701, 433, 1), new pr.Point(715, 437, 1), new pr.Point(728, 438, 1), new pr.Point(730, 441, 1), new pr.Point(722, 452, 1), new pr.Point(708, 463, 1), new pr.Point(699, 478, 1), new pr.Point(688, 488, 1), new pr.Point(680, 497, 1), new pr.Point(670, 506, 1), new pr.Point(678, 508, 1), new pr.Point(696, 508, 1), new pr.Point(709, 505, 1), new pr.Point(725, 505, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(813, 377, 5), new pr.Point(822, 399, 5), new pr.Point(836, 410, 5), new pr.Point(858, 393, 5), new pr.Point(870, 374, 5)
					));
					break;
				case "zhi":
					this.gestureUtil.addGesture("zhi3", new Array(
						new pr.Point(661, 431, 1), new pr.Point(680, 431, 1), new pr.Point(701, 433, 1), new pr.Point(715, 437, 1), new pr.Point(728, 438, 1), new pr.Point(730, 441, 1), new pr.Point(722, 452, 1), new pr.Point(708, 463, 1), new pr.Point(699, 478, 1), new pr.Point(688, 488, 1), new pr.Point(680, 497, 1), new pr.Point(670, 506, 1), new pr.Point(678, 508, 1), new pr.Point(696, 508, 1), new pr.Point(709, 505, 1), new pr.Point(725, 505, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(818, 386, 5), new pr.Point(827, 405, 5)
					));
					break;
				case "chi":
					this.gestureUtil.addGesture("chi0", new Array(
						new pr.Point(722, 437, 1), new pr.Point(705, 432, 1), new pr.Point(685, 437, 1), new pr.Point(669, 454, 1), new pr.Point(670, 479, 1), new pr.Point(681, 494, 1), new pr.Point(699, 503, 1), new pr.Point(717, 506, 1), new pr.Point(734, 506, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(827, 407, 5), new pr.Point(851, 407, 5)
					));
					break;
				case "chi":
					this.gestureUtil.addGesture("chi1", new Array(
						new pr.Point(722, 437, 1), new pr.Point(705, 432, 1), new pr.Point(685, 437, 1), new pr.Point(669, 454, 1), new pr.Point(670, 479, 1), new pr.Point(681, 494, 1), new pr.Point(699, 503, 1), new pr.Point(717, 506, 1), new pr.Point(734, 506, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(843, 404, 5), new pr.Point(858, 383, 5)
					));
					break;
				case "chi":
					this.gestureUtil.addGesture("chi2", new Array(
						new pr.Point(722, 437, 1), new pr.Point(705, 432, 1), new pr.Point(685, 437, 1), new pr.Point(669, 454, 1), new pr.Point(670, 479, 1), new pr.Point(681, 494, 1), new pr.Point(699, 503, 1), new pr.Point(717, 506, 1), new pr.Point(734, 506, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(813, 377, 5), new pr.Point(822, 399, 5), new pr.Point(836, 410, 5), new pr.Point(858, 393, 5), new pr.Point(870, 374, 5)
					));
					break;
				case "chi":
					this.gestureUtil.addGesture("chi3", new Array(
						new pr.Point(722, 437, 1), new pr.Point(705, 432, 1), new pr.Point(685, 437, 1), new pr.Point(669, 454, 1), new pr.Point(670, 479, 1), new pr.Point(681, 494, 1), new pr.Point(699, 503, 1), new pr.Point(717, 506, 1), new pr.Point(734, 506, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(818, 386, 5), new pr.Point(827, 405, 5)
					));
					break;
				case "shi":
					this.gestureUtil.addGesture("shi0", new Array(
						new pr.Point(718, 432, 1), new pr.Point(702, 429, 1), new pr.Point(687, 440, 1), new pr.Point(681, 451, 1), new pr.Point(687, 466, 1), new pr.Point(708, 473, 1), new pr.Point(723, 481, 1), new pr.Point(723, 496, 1), new pr.Point(709, 508, 1), new pr.Point(691, 509, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(827, 407, 5), new pr.Point(851, 407, 5)
					));
					break;
				case "shi":
					this.gestureUtil.addGesture("shi1", new Array(
						new pr.Point(718, 432, 1), new pr.Point(702, 429, 1), new pr.Point(687, 440, 1), new pr.Point(681, 451, 1), new pr.Point(687, 466, 1), new pr.Point(708, 473, 1), new pr.Point(723, 481, 1), new pr.Point(723, 496, 1), new pr.Point(709, 508, 1), new pr.Point(691, 509, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(843, 404, 5), new pr.Point(858, 383, 5)
					));
					break;
				case "shi":
					this.gestureUtil.addGesture("shi2", new Array(
						new pr.Point(718, 432, 1), new pr.Point(702, 429, 1), new pr.Point(687, 440, 1), new pr.Point(681, 451, 1), new pr.Point(687, 466, 1), new pr.Point(708, 473, 1), new pr.Point(723, 481, 1), new pr.Point(723, 496, 1), new pr.Point(709, 508, 1), new pr.Point(691, 509, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(813, 377, 5), new pr.Point(822, 399, 5), new pr.Point(836, 410, 5), new pr.Point(858, 393, 5), new pr.Point(870, 374, 5)
					));
					break;
				case "shi":
					this.gestureUtil.addGesture("shi3", new Array(
						new pr.Point(718, 432, 1), new pr.Point(702, 429, 1), new pr.Point(687, 440, 1), new pr.Point(681, 451, 1), new pr.Point(687, 466, 1), new pr.Point(708, 473, 1), new pr.Point(723, 481, 1), new pr.Point(723, 496, 1), new pr.Point(709, 508, 1), new pr.Point(691, 509, 1),
						new pr.Point(752, 347, 2), new pr.Point(752, 366, 2), new pr.Point(752, 387, 2), new pr.Point(752, 407, 2), new pr.Point(752, 430, 2), new pr.Point(753, 451, 2), new pr.Point(753, 470, 2), new pr.Point(753, 490, 2), new pr.Point(753, 504, 2),
						new pr.Point(766, 432, 3), new pr.Point(782, 433, 3), new pr.Point(795, 443, 3), new pr.Point(803, 457, 3), new pr.Point(804, 476, 3), new pr.Point(804, 497, 3),
						new pr.Point(834, 437, 4), new pr.Point(834, 467, 4), new pr.Point(833, 494, 4),
						new pr.Point(818, 386, 5), new pr.Point(827, 405, 5)
					));
					break;
				case "yi0":
					this.gestureUtil.addGesture("yi0", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(794, 374, 3), new pr.Point(788, 399, 3), new pr.Point(788, 417, 3),
						new pr.Point(782, 326, 4), new pr.Point(806, 326, 4)
					));
					break;
				case "yi1":
					this.gestureUtil.addGesture("yi1", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(794, 374, 3), new pr.Point(788, 399, 3), new pr.Point(788, 417, 3),
						new pr.Point(803, 324, 4), new pr.Point(816, 311, 4)
					));
					break;
				case "yi2":
					this.gestureUtil.addGesture("yi2", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(794, 374, 3), new pr.Point(788, 399, 3), new pr.Point(788, 417, 3),
						new pr.Point(773, 311, 4), new pr.Point(785, 332, 4), new pr.Point(797, 347, 4), new pr.Point(810, 318, 4), new pr.Point(819, 300, 4)
					));
					break;
				case "yi3":
					this.gestureUtil.addGesture("yi3", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(794, 374, 3), new pr.Point(788, 399, 3), new pr.Point(788, 417, 3),
						new pr.Point(779, 312, 4), new pr.Point(794, 335, 4)
					));
					break;
				case "yu0":
					this.gestureUtil.addGesture("yu0", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(776, 371, 3), new pr.Point(779, 386, 3), new pr.Point(782, 405, 3), new pr.Point(786, 422, 3), new pr.Point(798, 432, 3), new pr.Point(816, 426, 3), new pr.Point(822, 402, 3), new pr.Point(822, 380, 3), new pr.Point(822, 377, 3), new pr.Point(825, 398, 3), new pr.Point(830, 417, 3),
						new pr.Point(782, 326, 4), new pr.Point(806, 326, 4)
					));
					break;
				case "yu1":
					this.gestureUtil.addGesture("yu1", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(776, 371, 3), new pr.Point(779, 386, 3), new pr.Point(782, 405, 3), new pr.Point(786, 422, 3), new pr.Point(798, 432, 3), new pr.Point(816, 426, 3), new pr.Point(822, 402, 3), new pr.Point(822, 380, 3), new pr.Point(822, 377, 3), new pr.Point(825, 398, 3), new pr.Point(830, 417, 3),
						new pr.Point(803, 324, 4), new pr.Point(816, 311, 4)
					));
					break;
				case "yu2":
					this.gestureUtil.addGesture("yu2", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(776, 371, 3), new pr.Point(779, 386, 3), new pr.Point(782, 405, 3), new pr.Point(786, 422, 3), new pr.Point(798, 432, 3), new pr.Point(816, 426, 3), new pr.Point(822, 402, 3), new pr.Point(822, 380, 3), new pr.Point(822, 377, 3), new pr.Point(825, 398, 3), new pr.Point(830, 417, 3),
						new pr.Point(773, 311, 4), new pr.Point(785, 332, 4), new pr.Point(797, 347, 4), new pr.Point(810, 318, 4), new pr.Point(819, 300, 4)
					));
					break;
				case "yu3":
					this.gestureUtil.addGesture("yu3", new Array(
						new pr.Point(697, 362, 1), new pr.Point(699, 375, 1), new pr.Point(700, 386, 1), new pr.Point(701, 397, 1), new pr.Point(702, 406, 1), new pr.Point(705, 417, 1), new pr.Point(709, 425, 1),
						new pr.Point(748, 367, 2), new pr.Point(740, 386, 2), new pr.Point(734, 404, 2), new pr.Point(726, 420, 2), new pr.Point(718, 435, 2), new pr.Point(714, 454, 2), new pr.Point(708, 467, 2), new pr.Point(703, 484, 2),
						new pr.Point(776, 371, 3), new pr.Point(779, 386, 3), new pr.Point(782, 405, 3), new pr.Point(786, 422, 3), new pr.Point(798, 432, 3), new pr.Point(816, 426, 3), new pr.Point(822, 402, 3), new pr.Point(822, 380, 3), new pr.Point(822, 377, 3), new pr.Point(825, 398, 3), new pr.Point(830, 417, 3),
						new pr.Point(779, 312, 4), new pr.Point(794, 335, 4)
					));
					break;
				case "wu0":
					this.gestureUtil.addGesture("wu0", new Array(
						new pr.Point(621, 407, 1), new pr.Point(625, 428, 1), new pr.Point(633, 447, 1), new pr.Point(639, 467, 1), new pr.Point(645, 481, 1), new pr.Point(652, 463, 1), new pr.Point(661, 443, 1), new pr.Point(663, 424, 1), new pr.Point(666, 414, 1), new pr.Point(667, 429, 1), new pr.Point(670, 449, 1), new pr.Point(676, 463, 1), new pr.Point(682, 478, 1), new pr.Point(693, 469, 1), new pr.Point(699, 451, 1), new pr.Point(702, 436, 1), new pr.Point(706, 423, 1), new pr.Point(709, 408, 1),
						new pr.Point(722, 429, 2), new pr.Point(722, 449, 2), new pr.Point(726, 472, 2), new pr.Point(737, 481, 2), new pr.Point(753, 481, 2), new pr.Point(768, 461, 2), new pr.Point(768, 441, 2), new pr.Point(768, 419, 2), new pr.Point(768, 422, 2), new pr.Point(768, 447, 2), new pr.Point(768, 464, 2), new pr.Point(785, 475, 2),
						new pr.Point(731, 380, 3), new pr.Point(756, 380, 3)
					));
					break;
				case "wu1":
					this.gestureUtil.addGesture("wu1", new Array(
						new pr.Point(621, 407, 1), new pr.Point(625, 428, 1), new pr.Point(633, 447, 1), new pr.Point(639, 467, 1), new pr.Point(645, 481, 1), new pr.Point(652, 463, 1), new pr.Point(661, 443, 1), new pr.Point(663, 424, 1), new pr.Point(666, 414, 1), new pr.Point(667, 429, 1), new pr.Point(670, 449, 1), new pr.Point(676, 463, 1), new pr.Point(682, 478, 1), new pr.Point(693, 469, 1), new pr.Point(699, 451, 1), new pr.Point(702, 436, 1), new pr.Point(706, 423, 1), new pr.Point(709, 408, 1),
						new pr.Point(722, 429, 2), new pr.Point(722, 449, 2), new pr.Point(726, 472, 2), new pr.Point(737, 481, 2), new pr.Point(753, 481, 2), new pr.Point(768, 461, 2), new pr.Point(768, 441, 2), new pr.Point(768, 419, 2), new pr.Point(768, 422, 2), new pr.Point(768, 447, 2), new pr.Point(768, 464, 2), new pr.Point(785, 475, 2),
						new pr.Point(743, 386, 3), new pr.Point(756, 366, 3), new pr.Point(771, 348, 3)
					));
					break;
				case "wu2":
					this.gestureUtil.addGesture("wu2", new Array(
						new pr.Point(621, 407, 1), new pr.Point(625, 428, 1), new pr.Point(633, 447, 1), new pr.Point(639, 467, 1), new pr.Point(645, 481, 1), new pr.Point(652, 463, 1), new pr.Point(661, 443, 1), new pr.Point(663, 424, 1), new pr.Point(666, 414, 1), new pr.Point(667, 429, 1), new pr.Point(670, 449, 1), new pr.Point(676, 463, 1), new pr.Point(682, 478, 1), new pr.Point(693, 469, 1), new pr.Point(699, 451, 1), new pr.Point(702, 436, 1), new pr.Point(706, 423, 1), new pr.Point(709, 408, 1),
						new pr.Point(722, 429, 2), new pr.Point(722, 449, 2), new pr.Point(726, 472, 2), new pr.Point(737, 481, 2), new pr.Point(753, 481, 2), new pr.Point(768, 461, 2), new pr.Point(768, 441, 2), new pr.Point(768, 419, 2), new pr.Point(768, 422, 2), new pr.Point(768, 447, 2), new pr.Point(768, 464, 2), new pr.Point(785, 475, 2),
						new pr.Point(723, 363, 3), new pr.Point(732, 380, 3), new pr.Point(746, 386, 3), new pr.Point(758, 359, 3)
					));
					break;
				case "wu3":
					this.gestureUtil.addGesture("wu3", new Array(
						new pr.Point(621, 407, 1), new pr.Point(625, 428, 1), new pr.Point(633, 447, 1), new pr.Point(639, 467, 1), new pr.Point(645, 481, 1), new pr.Point(652, 463, 1), new pr.Point(661, 443, 1), new pr.Point(663, 424, 1), new pr.Point(666, 414, 1), new pr.Point(667, 429, 1), new pr.Point(670, 449, 1), new pr.Point(676, 463, 1), new pr.Point(682, 478, 1), new pr.Point(693, 469, 1), new pr.Point(699, 451, 1), new pr.Point(702, 436, 1), new pr.Point(706, 423, 1), new pr.Point(709, 408, 1),
						new pr.Point(722, 429, 2), new pr.Point(722, 449, 2), new pr.Point(726, 472, 2), new pr.Point(737, 481, 2), new pr.Point(753, 481, 2), new pr.Point(768, 461, 2), new pr.Point(768, 441, 2), new pr.Point(768, 419, 2), new pr.Point(768, 422, 2), new pr.Point(768, 447, 2), new pr.Point(768, 464, 2), new pr.Point(785, 475, 2),
						new pr.Point(720, 350, 3), new pr.Point(738, 374, 3)
					));
					break;
				case "ri1":
					this.gestureUtil.addGesture("ri1", new Array(
						new pr.Point(655, 365, 1), new pr.Point(660, 375, 1), new pr.Point(663, 389, 1), new pr.Point(663, 402, 1), new pr.Point(663, 416, 1), new pr.Point(663, 431, 1), new pr.Point(661, 444, 1), new pr.Point(661, 440, 1), new pr.Point(663, 426, 1), new pr.Point(664, 413, 1), new pr.Point(666, 396, 1), new pr.Point(669, 384, 1), new pr.Point(675, 375, 1), new pr.Point(687, 371, 1), new pr.Point(696, 366, 1),
						new pr.Point(744, 371, 2), new pr.Point(744, 389, 2), new pr.Point(744, 410, 2), new pr.Point(744, 432, 2), new pr.Point(744, 444, 2),
						new pr.Point(718, 285, 3), new pr.Point(738, 315, 3)
					));
					break;
				case "ru1":
					this.gestureUtil.addGesture("ru1", new Array(
						new pr.Point(663, 363, 1), new pr.Point(673, 383, 1), new pr.Point(679, 399, 1), new pr.Point(679, 418, 1), new pr.Point(679, 435, 1), new pr.Point(679, 449, 1), new pr.Point(679, 438, 1), new pr.Point(681, 422, 1), new pr.Point(684, 407, 1), new pr.Point(688, 389, 1), new pr.Point(696, 375, 1), new pr.Point(705, 369, 1), new pr.Point(717, 368, 1),
						new pr.Point(741, 384, 2), new pr.Point(741, 410, 2), new pr.Point(741, 431, 2), new pr.Point(747, 447, 2), new pr.Point(767, 446, 2), new pr.Point(783, 435, 2), new pr.Point(791, 408, 2), new pr.Point(791, 384, 2), new pr.Point(789, 390, 2), new pr.Point(789, 417, 2), new pr.Point(789, 432, 2), new pr.Point(806, 440, 2),
						new pr.Point(777, 327, 3), new pr.Point(791, 311, 3)
					));
					break;
				case "ru2":
					this.gestureUtil.addGesture("ru2", new Array(
						new pr.Point(663, 363, 1), new pr.Point(673, 383, 1), new pr.Point(679, 399, 1), new pr.Point(679, 418, 1), new pr.Point(679, 435, 1), new pr.Point(679, 449, 1), new pr.Point(679, 438, 1), new pr.Point(681, 422, 1), new pr.Point(684, 407, 1), new pr.Point(688, 389, 1), new pr.Point(696, 375, 1), new pr.Point(705, 369, 1), new pr.Point(717, 368, 1),
						new pr.Point(741, 384, 2), new pr.Point(741, 410, 2), new pr.Point(741, 431, 2), new pr.Point(747, 447, 2), new pr.Point(767, 446, 2), new pr.Point(783, 435, 2), new pr.Point(791, 408, 2), new pr.Point(791, 384, 2), new pr.Point(789, 390, 2), new pr.Point(789, 417, 2), new pr.Point(789, 432, 2), new pr.Point(806, 440, 2),
						new pr.Point(746, 317, 3), new pr.Point(762, 339, 3), new pr.Point(774, 330, 3), new pr.Point(788, 314, 3)
					));
					break;
				case "ru3":
					this.gestureUtil.addGesture("ru3", new Array(
						new pr.Point(663, 363, 1), new pr.Point(673, 383, 1), new pr.Point(679, 399, 1), new pr.Point(679, 418, 1), new pr.Point(679, 435, 1), new pr.Point(679, 449, 1), new pr.Point(679, 438, 1), new pr.Point(681, 422, 1), new pr.Point(684, 407, 1), new pr.Point(688, 389, 1), new pr.Point(696, 375, 1), new pr.Point(705, 369, 1), new pr.Point(717, 368, 1),
						new pr.Point(741, 384, 2), new pr.Point(741, 410, 2), new pr.Point(741, 431, 2), new pr.Point(747, 447, 2), new pr.Point(767, 446, 2), new pr.Point(783, 435, 2), new pr.Point(791, 408, 2), new pr.Point(791, 384, 2), new pr.Point(789, 390, 2), new pr.Point(789, 417, 2), new pr.Point(789, 432, 2), new pr.Point(806, 440, 2),
						new pr.Point(743, 308, 3), new pr.Point(755, 321, 3), new pr.Point(770, 341, 3)
					));
					break;
				case "re2":
					this.gestureUtil.addGesture("re2", new Array(
						new pr.Point(663, 363, 1), new pr.Point(673, 383, 1), new pr.Point(679, 399, 1), new pr.Point(679, 418, 1), new pr.Point(679, 435, 1), new pr.Point(679, 449, 1), new pr.Point(679, 438, 1), new pr.Point(681, 422, 1), new pr.Point(684, 407, 1), new pr.Point(688, 389, 1), new pr.Point(696, 375, 1), new pr.Point(705, 369, 1), new pr.Point(717, 368, 1),
						new pr.Point(765, 402, 2), new pr.Point(789, 401, 2), new pr.Point(800, 384, 2), new pr.Point(783, 372, 2), new pr.Point(765, 368, 2), new pr.Point(747, 377, 2), new pr.Point(743, 393, 2), new pr.Point(741, 413, 2), new pr.Point(747, 429, 2), new pr.Point(762, 443, 2), new pr.Point(779, 443, 2), new pr.Point(794, 431, 2),
						new pr.Point(746, 317, 3), new pr.Point(762, 339, 3), new pr.Point(774, 330, 3), new pr.Point(788, 314, 3)
					));
					break;
				case "re3":
					this.gestureUtil.addGesture("re3", new Array(
						new pr.Point(663, 363, 1), new pr.Point(673, 383, 1), new pr.Point(679, 399, 1), new pr.Point(679, 418, 1), new pr.Point(679, 435, 1), new pr.Point(679, 449, 1), new pr.Point(679, 438, 1), new pr.Point(681, 422, 1), new pr.Point(684, 407, 1), new pr.Point(688, 389, 1), new pr.Point(696, 375, 1), new pr.Point(705, 369, 1), new pr.Point(717, 368, 1),
						new pr.Point(765, 402, 2), new pr.Point(789, 401, 2), new pr.Point(800, 384, 2), new pr.Point(783, 372, 2), new pr.Point(765, 368, 2), new pr.Point(747, 377, 2), new pr.Point(743, 393, 2), new pr.Point(741, 413, 2), new pr.Point(747, 429, 2), new pr.Point(762, 443, 2), new pr.Point(779, 443, 2), new pr.Point(794, 431, 2),
						new pr.Point(743, 308, 3), new pr.Point(755, 321, 3), new pr.Point(770, 341, 3)
					));
					break;
			}
		}

		private generateQuestion() {
			this.gestureUtil.deleteAllGestures();
			let questionCurArr = [];
			while (questionCurArr.length < 10) {
				let correct: number = COMMONUTILS.get().getsuiji(0, 189);
				let canAdd = true;
				questionCurArr.forEach((v, i) => {
					if (v == this.questionCfg[correct]) {
						canAdd = false;
					}
				});
				if (canAdd) {
					questionCurArr.push(this.questionCfg[correct]);
				}
			}
			questionCurArr = COMMONUTILS.get().suijishunxubyarr(questionCurArr);
			this.Global.questionCurArr = questionCurArr;
			this.initGesture();
		}

		private showNextQuestion() {
			if (this.Global.questionNum == 11) {
				Hierarchy.MenuManager.get().reback.touchEnabled = true;
				Hierarchy.AbManager.get().show("CuoTiBen");
				return;
			}
			this.blackBoard.animation.gotoAndStopByFrame("heiban", 0);
			var question = this.Global.questionCurArr[this.Global.questionNum - 1];
			this.touchChildren = true;
			Hierarchy.MenuManager.get().reback.touchEnabled = true;
			Hierarchy.MenuManager.get().read.touchEnabled = true;
			// this.label1.text = question.zimu + question.shengdiao;
			MUSIC4.get().play(question.zimu + "_" + question.shengdiao);
		}

		private showDongDong(visible: boolean) {
			if (this.dongdong) {
				this.dongdong.visible = visible;
			}
		}

		private onTouchBegin(evt: egret.TouchEvent) {
			this._isTouchInside = true;
			this._currentNum += 1;
			var p: pr.Point = new pr.Point(evt.stageX, evt.stageY, this._currentNum);
			this._mousePoints.push(p);
			this._currentPoint = p;
		}

		private onTouchMove(evt: egret.TouchEvent) {
			if (this._isTouchInside) {
				var p: pr.Point = new pr.Point(evt.stageX, evt.stageY, this._currentNum);
				this._mousePoints.push(p);
				this._layer.graphics.lineStyle(10, 0xffffff);
				this._layer.graphics.moveTo(this._currentPoint.x ? this._currentPoint.x : p.x, this._currentPoint.y ? this._currentPoint.y : p.y);
				this._layer.graphics.lineTo(p.x, p.y);
				this._layer.graphics.endFill();
				this._currentPoint = p;
			}
		}

		private onTouchEnd(evt: egret.TouchEvent) {
			if (this._isTouchInside) {
				this._mousePoints.push(new pr.Point(evt.stageX, evt.stageY, this._currentNum));
				this._isTouchInside = false;
			}
		}

		private onClickBox() {
			if (this._mousePoints.length == 0) {
				return;
			}
			Hierarchy.MenuManager.get().reback.touchEnabled = false;
			Hierarchy.MenuManager.get().read.touchEnabled = false;
			this.touchChildren = false;
			let result = this.gestureUtil.recognize(this._mousePoints);
			// this.label2.text = result.name;
			this.dongdong.animation.play("talk");
			if (result.name == this.Global.questionCurArr[this.Global.questionNum - 1].zimu + this.Global.questionCurArr[this.Global.questionNum - 1].shengdiao) {
				MUSIC4.get().play("correct");
				MUSIC4.get().play("talk_correct");
			} else {
				MUSIC4.get().play("err");
				MUSIC4.get().play("talk_wrong");
				this.Global.wrongArr.push(this.Global.questionNum - 1);
			}
			egret.Tween.get(this._layer).wait(2500).call(() => {
				this.dongdong.animation.play("xunhuan_tishi_1", 0);
				MUSIC4.get().play("eraser");
				this.blackBoard.animation.play("heiban", 1);
				this.boardEraser.visible = true;
				this.boardEraser.animation.play("cha", 1);
			}).wait(1000).call(() => {
				MUSIC4.get().stop("eraser");
				this.boardEraser.visible = false;
				this._mousePoints = [];
				this._currentNum = 0;
				this._layer.graphics.clear();
				this.Global.questionNum += 1;
				this.showNextQuestion();
			});
		}

		private onClickEraser() {
			MUSIC4.get().play("dianji");
			Hierarchy.MenuManager.get().reback.touchEnabled = false;
			Hierarchy.MenuManager.get().read.touchEnabled = false;
			this.touchChildren = false;
			egret.Tween.get(this._layer).call(() => {
				MUSIC4.get().play("eraser");
				this.blackBoard.animation.play("heiban", 1);
				this.boardEraser.visible = true;
				this.boardEraser.animation.play("cha", 1);
			}).wait(1000).call(() => {
				MUSIC4.get().stop("eraser");
				this.boardEraser.visible = false;
				this._mousePoints = [];
				this._currentNum = 0;
				this._layer.graphics.clear();
				Hierarchy.MenuManager.get().reback.touchEnabled = true;
				Hierarchy.MenuManager.get().read.touchEnabled = true;
				this.touchChildren = true;
				this.blackBoard.animation.gotoAndStopByFrame("heiban", 0);
			});
		}
	}
}