/**
 * 组件
 */
module Assembly {
	/**
	 * 选关界面组件
	 */
    export class Select2 extends eui.Component implements eui.UIComponent {

        public aniGroup: eui.Group

        private select1: eui.Group;
        private select2: eui.Group;

        public constructor() {
            super();
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            DRAGONBONES.getInstance().addToFactory("xuanren_ske_json", "xuanren_tex_json", "xuanren_tex_png");
            DRAGONBONES.getInstance().initArmature("选择背景", "bg", "newAnimation", 1, this.aniGroup);
            DRAGONBONES.getInstance().initArmature("选择左", "btn_xuanren", "normal", 0, this.aniGroup, 480, 540);
            DRAGONBONES.getInstance().initArmature("选择右", "btn_xuanren1", "normal", 0, this.aniGroup, 1440, 540);
            DRAGONBONES.getInstance().initArmature("柳叶", "liuye1", "newAnimation", 0, this.aniGroup);
        }

        init() {
            DRAGONBONES.getInstance().getarmature("选择左").animation.play("normal", 0);
            DRAGONBONES.getInstance().getarmature("选择右").animation.play("normal", 0);
            Manager.EventManager.get().addListener("Select2", this.select1, egret.TouchEvent.TOUCH_TAP, () => {
                MUSIC4.get().play("dianji");
                MUSIC4.get().stop("tips1");
                DRAGONBONES.getInstance().getarmature("选择左").animation.play("click", 1);
                egret.Tween.get(this.select1).wait(330).call(() => {
                    Hierarchy.AbManager.get().hide("Select2");
                    Hierarchy.AbManager.get().getOne("Select").num = 1;
                    Hierarchy.AbManager.get().show("Select");
                    Hierarchy.AbManager.get().getOne("Select").playBookAnim();
                })
            }, this);
            Manager.EventManager.get().addListener("Select2", this.select2, egret.TouchEvent.TOUCH_TAP, () => {
                MUSIC4.get().play("dianji");
                MUSIC4.get().stop("tips1");
                DRAGONBONES.getInstance().getarmature("选择右").animation.play("click", 1);
                egret.Tween.get(this.select2).wait(330).call(() => {
                    Hierarchy.AbManager.get().hide("Select2");
                    Hierarchy.AbManager.get().getOne("Select").num = 2;
                    Hierarchy.AbManager.get().show("Select");
                    Hierarchy.AbManager.get().getOne("Select").playBookAnim();
                })
            }, this);
        }

    }
}