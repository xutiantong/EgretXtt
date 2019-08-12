/**
 * 组件
 */
module Assembly {
	/**
	 * 选关界面组件
	 */
    export class Select extends eui.Component implements eui.UIComponent {

        public aniGroup: eui.Group;
        private ani: dragonBones.EgretArmatureDisplay;

        public constructor() {
            super();
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            DRAGONBONES.getInstance().addToFactory("budai_ske_json", "budai_tex_json", "budai_tex_png");
            this.ani = DRAGONBONES.getInstance().initArmature("串场动画", "chuanchang");
            this.aniGroup.addChild(this.ani);
        }

        init() {
            this.ani.animation.play("newAnimation", 1);
            Manager.DelayManager.get().addDelay(8200, () => {
                MUSIC4.get().play("introduction1");
                Manager.DelayManager.get().addDelay(28000, () => {
                    MUSIC4.get().stop("introduction1");
                    Hierarchy.AbManager.get().show("Scene1");
                    Hierarchy.AbManager.get().hide("Select");
                }, 3);
            }, 3);
            Manager.EventManager.get().addListener("Select", this.aniGroup, egret.TouchEvent.TOUCH_TAP, () => {
                MUSIC4.get().play("dianji");
                Manager.DelayManager.get().removeDelay(3);
                MUSIC4.get().stop("introduction1");
                Hierarchy.AbManager.get().show("Scene1");
                Hierarchy.AbManager.get().hide("Select");
            }, this);
        }

    }
}