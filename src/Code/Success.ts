class Success extends eui.Component implements eui.UIComponent {

	public aniGroup: eui.Group;
	public again: eui.Image;
	public label: eui.Label;

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		DragonBonesManager.getInstance().addToFactory("taiozhanjieshu_ske_json", "taiozhanjieshu_tex_json", "taiozhanjieshu_tex_png")
		DragonBonesManager.getInstance().initArmatureDisplay("success", "tiaozhanjieshu")
		this.again.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.parent.visible = false
			GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.click_sound);
			GlobalManager.getInstance().mainscene.restart()
		}, this)
	}

	init() {
		this.label.alpha = 0;
		var wrongNum = GlobalManager.getInstance().mainscene.question.questionWrongNum;
		if (wrongNum == 0) {
			this.label.text = "恭喜你答对全部题目";
		} else if (wrongNum == 6) {
			this.label.text = "同学们，请再接再厉吧";
		} else {
			this.label.text = "答对" + ((6 - wrongNum) > 0 ? (6 - wrongNum) : 0) + "道题,答错" + wrongNum + "道题";
		}
		egret.Tween.get(this.label).to({ alpha: 1 }, 600)
		GlobalManager.getInstance().dg.playAnimation("success", "shengli", this.aniGroup, 1);
		GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.finish_sound);
	}
}