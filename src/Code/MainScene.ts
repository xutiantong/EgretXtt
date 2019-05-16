class MainScene extends eui.Component implements eui.UIComponent {

	public startGroup: eui.Group;
	public startAniGroup: eui.Group;
	public systemGroup: eui.Group;
	public questionGroup: eui.Group;
	public bgGroup: eui.Group;
	public introductionGroup: eui.Group;
	public successGroup: eui.Group;
	public startButton: eui.Button;
	music: MusicManager; //音乐
	system: System; //系统
	question: Question;//题目
	success: Success;//成功
	introduction: Introduction;//介绍
	changjing: dragonBones.EgretArmatureDisplay;
	startgame: dragonBones.EgretArmatureDisplay;

	//声音
	bg_sound: egret.Sound = RES.getRes("bg_mp3");
	fail_sound: egret.Sound = RES.getRes("again_mp3");
	err_sound: egret.Sound = RES.getRes("err_mp3");
	click_sound: egret.Sound = RES.getRes("dianji_mp3");
	finish_sound: egret.Sound = RES.getRes("finish_mp3");
	talk_introduction1_sound: egret.Sound = RES.getRes("talk_introduction1_mp3");
	talk_introduction2_sound: egret.Sound = RES.getRes("talk_introduction2_mp3");
	bird_sound: egret.Sound = RES.getRes("bird_mp3");
	bubble_sound: egret.Sound = RES.getRes("bubble_mp3");
	crab_sound: egret.Sound = RES.getRes("crab_mp3");
	seastar_sound: egret.Sound = RES.getRes("seastar_mp3");
	shell_sound: egret.Sound = RES.getRes("shell_mp3");
	wave_sound: egret.Sound = RES.getRes("wave_mp3");

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.loadRes();
		this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showIntroduction, this);
		this.music = new MusicManager(this.bg_sound, this.fail_sound, this.err_sound, this.click_sound, this.finish_sound,
			this.talk_introduction1_sound, this.talk_introduction2_sound, this.bird_sound, this.bubble_sound, this.crab_sound,
			this.seastar_sound, this.shell_sound, this.wave_sound);
		GlobalManager.getInstance().dg.playAnimation("changjing", "normal", this.bgGroup);
		GlobalManager.getInstance().dg.playAnimation("start", "chongshua", this.startAniGroup, 1);
		this.changjing.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
		this.music.play(this.bg_sound, -1);
		egret.Tween.get(this, { loop: true }).wait(15000).call(() => { this.music.play(this.bird_sound) });
	}

	private loadRes() {
		GlobalManager.getInstance().dg.addToFactory("xiaodongwu_ske_json", "xiaodongwu_tex_json", "xiaodongwu_tex_png");
		GlobalManager.getInstance().dg.addToFactory("pangxie_ske_json", "pangxie_tex_json", "pangxie_tex_png");
		GlobalManager.getInstance().dg.addToFactory("changjing_ske_json", "changjing_tex_0_json", "changjing_tex_0_png");
		// GlobalManager.getInstance().dg.addToFactoryAtlas("changjing_tex_0_json", "changjing_tex_0_png");
		GlobalManager.getInstance().dg.addToFactoryAtlas("changjing_tex_1_json", "changjing_tex_1_png");
		GlobalManager.getInstance().dg.addToFactoryAtlas("changjing_tex_2_json", "changjing_tex_2_png");
		this.changjing = GlobalManager.getInstance().dg.initArmatureDisplay("changjing", "changjingdonghua");
		this.startgame = GlobalManager.getInstance().dg.initArmatureDisplay("start", "kaishiyouxi");
	}

	private onComplete(evt: dragonBones.EgretEvent) {
		if (evt.animationName == "chongshua") {
			this.changjing.animation.play("in", 1);
		} else if (evt.animationName == "in") {
			this.changjing.animation.play("normal");
			this.question.showNextAniIn();
		}
	}

	startGame() {
		this.startGroup.visible = false;
		this.music.play(this.click_sound);
		this.introductionGroup.visible = false;
		this.system = new System();
		this.systemGroup.addChild(this.system);
		this.question = new Question();
		this.questionGroup.addChild(this.question);
		this.success = new Success();
		this.successGroup.addChild(this.success);
		this.successGroup.visible = false;
	}

	showIntroduction() {
		this.startGroup.visible = false;
		this.music.play(this.click_sound);
		this.introduction = new Introduction();
		this.introductionGroup.addChild(this.introduction);
	}

	showSuccess() {
		this.successGroup.visible = true;
		this.success.init();
	}

	restart() {
		this.changjing.animation.play("normal");
		this.question.restart();
	}

	showWave() {
		this.changjing.animation.play("chongshua", 1);
		this.music.play(this.wave_sound);
	}

}