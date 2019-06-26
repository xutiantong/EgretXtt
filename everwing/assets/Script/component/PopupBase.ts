import PanelBase from "./PanelBase";
import Log from "../utils/log/Log";
import PanelManager, { PANEL } from "../manager/PanelManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupBase extends PanelBase {

    public static TAG_POPUP_ACTION:number = 10086;
    // LIFE-CYCLE CALLBACKS:

    /** 是否开启面板自适应，放大缩小 */
    protected _enabledAutoSize: boolean = true;
    /** 弹出效果开启标示 */
    protected _enabledPopupEffect: boolean = true;
    /** 面板弹出动画锁 */
    private _locked: boolean = false;

    // onLoad () {}
    public getLocked() {
        return this._locked;
    }

    protected panelMaskTouch(e){
        if (this._locked == true) {
            return;
        }
        this.closePanel();
    }

    private _oriScale:number = 1;
    protected onShow(){
        super.onShow();
        if (this._locked == true) {
            return;
        }
        this._locked = true;
        this.node.active = true;
        PANEL.on(PanelManager.Panel_Mask_Touch_Begin,this.panelMaskTouch,this);
       if (this._enabledAutoSize == true && this.node.width > cc.winSize.width) {
            let scale = this.node.scale;
            scale = (cc.winSize.width) / this.node.width;
            this.node.scale = scale;
        }
        if (this._enabledPopupEffect == true) {
            this._oriScale = this.node.scale;
            this.node.scale = 0.5* this._oriScale;
            var seq = cc.sequence(
                cc.scaleTo(0.1, this._oriScale * 1.1),
                cc.scaleTo(0.03, this._oriScale),
                cc.callFunc(() => {
                    if(this._showCallback){
                        this._showCallback();
                    }
                    this._locked = false;
                }, this),
            );
            seq.setTag(PopupBase.TAG_POPUP_ACTION);
            this.node.runAction(seq);
        } else {
            if (this.node != null) {
                this.node.emit("show");
            }
            if(this._showCallback){
                this._showCallback();
            }
            this._locked = false;
        }
    }

    protected onClose(){
        PANEL.off(PanelManager.Panel_Mask_Touch_Begin,this.panelMaskTouch,this);
        this.node.stopActionByTag(PopupBase.TAG_POPUP_ACTION);
        if (this._enabledPopupEffect == true) {
            this.node.stopAllActions();
            // let scale = this._oriScale;
            var seq = cc.sequence(
                cc.scaleTo(0.03, this._oriScale * 1.1),
                cc.scaleTo(0.1, this._oriScale * 0.5),
                cc.callFunc(() => {
                    this.node.active = false;
                    this._closeCallback(this.node);
                }, this)
            );
            this.node.runAction(seq);
        } else {
            this.node.active = false;
            this._closeCallback(this.node);
        }
    }


    unuse() {
        super.unuse();
        this.node.scale = this._oriScale;
    }

    start () {

    }

    // update (dt) {}
}
