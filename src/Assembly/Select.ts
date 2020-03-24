/**
 * 组件
 */
module Assembly {
	/**
	 * 选关界面组件
	 */
    export class Select extends eui.Component implements eui.UIComponent {
        aniGroup: eui.Group
        slotImg: eui.Image
        slotLeftBg: eui.Image
        slotLeftTextImg: eui.Image
        slotRightGroup: eui.Group
        closeImg: eui.Image
        num: number
        private bookAnim: dragonBones.EgretArmatureDisplay;
        private Global = Manager.GlobalManager.get()
        public constructor() {
            super();
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            DRAGONBONES.getInstance().addToFactory("chutangsijie_1_ske_json", "chutangsijie_1_tex_json", "chutangsijie_1_tex_png");
            this.bookAnim = DRAGONBONES.getInstance().initArmature("翻书动画", "fanshu");
            this.aniGroup.addChild(this.bookAnim);

            this.bookAnim.armature.getSlot("shu_zuo2211").displayList = [this.slotLeftTextImg];

            this.bookAnim.armature.getSlot("shu_zuo_luobinwang").displayList = [this.slotLeftBg];
            this.bookAnim.armature.getSlot("shu_you_luobinwang").displayList = [this.slotRightGroup];
            // let img = new eui.Image("shu1_png");
            // this.addChild(img);
            // img.anchorOffsetX = img.width / 2;
            // img.anchorOffsetY = img.height / 2;
            // this.bookAnim.armature.getSlot("shu1").displayList = [img];
        }

        init() {
            this.bookAnim.animation.gotoAndStopByFrame("fanshu", 0);
            this.slotLeftTextImg.alpha = 0;

            Manager.EventManager.get().addListener("Select", this.bookAnim, dragonBones.EgretEvent.COMPLETE, this.animComplete, this);

            this.closeImg.visible = false;
            egret.Tween.get(this.closeImg, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
            Manager.EventManager.get().addListener("Select", this.closeImg, egret.TouchEvent.TOUCH_TAP, () => {
                MUSIC4.get().play("dianji")
                MUSIC4.get().play("book")
                this.closeImg.visible = false
                this.bookAnim.animation.timeScale = -1
                this.bookAnim.animation.play("fanshu", 1)
            }, this)

            this.slotLeftBg.source = "bookSlotBg" + (this.num - 1) + "_png"
            this.slotLeftTextImg.source = "bookSlotLabel" + (this.num - 1) + "_png"
            this.slotImg.source = "select_slot" + (this.num - 1) + "_png"
        }

        private playBookAnim() {
            MUSIC4.get().play("book")
            this.bookAnim.animation.timeScale = 1
            this.bookAnim.animation.play("fanshu", 1)
        }

        private animComplete(evt: dragonBones.EgretEvent) {
            if (evt.animationName == "fanshu") {
                if (evt.armature.animation.timeScale == 1) {
                    egret.Tween.get(this.slotLeftTextImg).to({ alpha: 1 }, 500).call(() => {
                        this.closeImg.visible = true
                    })
                } else {
                    egret.Tween.get(this).wait(500).call(() => {
                        //展示scene, 开始做题
                        Hierarchy.AbManager.get().hide("Select");
                        Hierarchy.AbManager.get().getOne("Scene1").num = this.num - 1;
                        Hierarchy.AbManager.get().show("Scene1");
                    })
                }
            }
        }
    }
}