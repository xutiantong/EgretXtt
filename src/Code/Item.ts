class Item extends eui.Component implements eui.UIComponent {

	public itemGroup: eui.Group;
	type: number;
	num: number;
	item: dragonBones.EgretArmatureDisplay;

	public constructor(type, num) {
		super();
		this.type = type;
		this.num = num;
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		if (this.type == 1) {
			var seastar = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.seastar_sound);
			if (seastar != null) {
				if (seastar.position == 0) {
					GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
				}
			} else {
				GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
			}
			this.item = GlobalManager.getInstance().dg.initArmatureDisplay("haixing" + this.num, "haixing");
			GlobalManager.getInstance().dg.playAnimation("haixing" + this.num, "newAnimation", this);
			this.item.scaleX = 1.5;
			this.item.scaleY = 1.5;
		} else if (this.type == 2) {
			var shell = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.shell_sound);
			if (shell != null) {
				if (shell.position == 0) {
					GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.shell_sound);
				}
			} else {
				GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.shell_sound);
			}
			this.item = GlobalManager.getInstance().dg.initArmatureDisplay("beike" + this.num, "beike");
			GlobalManager.getInstance().dg.playAnimation("beike" + this.num, "newAnimation", this);
			this.item.scaleX = 1.5;
			this.item.scaleY = 1.5;
		} else if (this.type == 3) {
			var bubble = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.bubble_sound);
			if (bubble != null) {
				if (bubble.position == 0) {
					GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.bubble_sound);
				}
			} else {
				GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.bubble_sound);
			}
			this.item = GlobalManager.getInstance().dg.initArmatureDisplay("hailuo" + this.num, "hailuo");
			GlobalManager.getInstance().dg.playAnimation("hailuo" + this.num, "newAnimation", this);
			this.item.scaleX = 1.5;
			this.item.scaleY = 1.5;
		} else if (this.type == 4) {
			var crab = GlobalManager.getInstance().mainscene.music.getchannel(GlobalManager.getInstance().mainscene.seastar_sound);
			if (crab != null) {
				if (crab.position == 0) {
					GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
				}
			} else {
				GlobalManager.getInstance().mainscene.music.play(GlobalManager.getInstance().mainscene.seastar_sound);
			}
			this.item = GlobalManager.getInstance().dg.initArmatureDisplay("pangxie" + this.num, "pangxie");
			GlobalManager.getInstance().dg.playAnimation("pangxie" + this.num, "newAnimation", this);
			this.item.scaleX = 1.5;
			this.item.scaleY = 1.5;
		}
	}
}