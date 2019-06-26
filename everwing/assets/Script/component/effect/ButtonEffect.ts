import { SOUND } from "../../manager/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonEffect extends cc.Component {

    @property(cc.Node)
    public targetNode:cc.Node=null;
    
    @property originalScale:number = 1;
    private onNodeTouchStart(evt) {
        this.targetNode.stopAllActions();
        var seq = cc.sequence(
            cc.scaleTo(0.06, 1.3 * this.originalScale),
            cc.scaleTo(0.1, 1.1 * this.originalScale)
        );
        this.targetNode.runAction(seq);
        SOUND.playBtnSound();
    }

    private onNodeTouchEnd(evt) {
        this.targetNode.stopAllActions();
        var seq = cc.sequence(
            cc.scaleTo(0.05, 1.2 * this.originalScale),
            cc.scaleTo(0.06, 1 * this.originalScale)
        );
        this.targetNode.runAction(seq);
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.targetNode==null)
        {
            this.targetNode= this.node;
        }
    }

    start () {

    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onNodeTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onNodeTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onNodeTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onNodeTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
    }

    // update (dt) {}

    onDestroy() {

    }
}
