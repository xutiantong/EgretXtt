class Introduction extends eui.Component implements eui.UIComponent {

	public aniGroup: eui.Group;
	duibai: dragonBones.EgretArmatureDisplay;
	public startButton: eui.Image;

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		GlobalManager.getInstance().dg.addToFactory("dongdongAnimation2x_ske_json", "dongdongAnimation2x_tex_json", "dongdongAnimation2x_tex_png");
		this.duibai = GlobalManager.getInstance().dg.initArmatureDisplay("duibai", "dongdong");
		this.duibai.scaleX = 0.3;
		this.duibai.scaleY = 0.3;
		this.duibai.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
		let tmp = new egret.Bitmap();
		tmp.texture = RES.getRes("talk1_png");
		tmp.anchorOffsetX = tmp.texture.textureWidth / 2
		tmp.anchorOffsetY = tmp.texture.textureHeight / 2
		this.duibai.armature.getSlot("qipao").displayList = [tmp];
		GlobalManager.getInstance().dg.playAnimation("duibai", "talk_tanchu", this.aniGroup, 1, 200, 1080);
		this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
		GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.talk_introduction1_sound);
		GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction1_sound)
			.addEventListener(egret.Event.SOUND_COMPLETE, this.onSound, this);
	}

	private startGame() {
		GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.click_sound);
		GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction1_sound).stop();
		if (GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction2_sound)) {
			GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.talk_introduction2_sound).stop();
		}
		GlobalManager.getInstance().mainscene.startGame();
	}

	private onComplete(evt: dragonBones.EgretEvent) {
		if (evt.animationName == "talk_tanchu") {
			this.duibai.animation.play("xunhuan_tishi", 0);
		}
	}

	private onSound() {
		let tmp = new egret.Bitmap();
		tmp.texture = RES.getRes("talk2_png");
		tmp.anchorOffsetX = tmp.texture.textureWidth / 2
		tmp.anchorOffsetY = tmp.texture.textureHeight / 2
		this.duibai.armature.getSlot("qipao").displayList = [tmp];
		GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.talk_introduction2_sound);
	}
}