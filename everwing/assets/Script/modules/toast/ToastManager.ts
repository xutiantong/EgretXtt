import Log from "../../utils/log/Log";
import { POOL } from "../../manager/PoolManager";

const {ccclass, property} = cc._decorator;
@ccclass
export class ToastManager extends cc.Component {

    @property(cc.Node) tipLayer: cc.Node = null;

    private _queueTip: Array<ToastBase> = [];
    private _hasToast: boolean = false;

    public static getManager(): ToastManager {
        let uiCanvas = cc.find("UICanvas");
        if (uiCanvas === null) {
            Log.error("UICanvas not found!");
            return null;
        }
        let mangager = uiCanvas.getComponent(ToastManager);
        if (mangager === null) {
            Log.error("ToastManager not found!");
            return null;
        }
        return mangager;
    }

    public showToast(tip: ToastBase) {
        
        for (let i = 0; i < this._queueTip.length; i++) {
            let item = this._queueTip[i];
            if (item != null) {
                this.removeToast(item);
                item.unscheduleAllCallbacks();
                item.node.active=false;
            }
        }

        this._queueTip.push(tip);
        this.checkQueue();
    }

    public removeToast(tip: ToastBase) {
        let index = this._queueTip.indexOf(tip);
        if (index >= 0) {
            this._queueTip.splice(index, 1);
            this._hasToast = false;
        }
        this.checkQueue();
    }

    public hasToast(msg) {
        let flag = false;
        for (let i = 0; i < this._queueTip.length; i++) {
            let item = this._queueTip[i];
            if (item != null) {
                flag = item.hasToast(msg);
                break;
            }
        }
        return flag;
    }

    private checkQueue() {
        if (this._queueTip.length > 0 && this._hasToast == false) {
            let tip: ToastBase = this._queueTip[0];
            if (tip != null) {
                this._hasToast = true;
                this.node.addChild(tip.node);
                tip.willShow();
            }
        }
    }
}

export class ToastBase extends cc.Component {
    private static TAG_TIP_ACTION: number = 10086;

    protected _duration: number = 2;
    
    private _closing: boolean = false;
    private _tipPos: cc.Vec2 = cc.v2(0, 0);

    public show() {
        if (this.node != null) {
            this._tipPos.x = this.node.x;
            this._tipPos.y = this.node.y;
        }
        let manager = ToastManager.getManager()
        if (manager != null) {
            manager.showToast(this);
        }
    }

    public remove() {
        this.willClose();
    }

    public hasToast(msg) {
        return false;
    }

    public willShow() {
        this._closing = false;
        this.node.stopActionByTag(ToastBase.TAG_TIP_ACTION);
        this.node.y = this._tipPos.y + this.node.height;
        let seq = cc.sequence(
            cc.moveTo(0.2, cc.v2(this._tipPos.x, this._tipPos.y - 10)),
            cc.moveTo(0.02, cc.v2(this._tipPos.x, this._tipPos.y)),
            cc.delayTime(this._duration),
            cc.callFunc(() => {
                this.willClose();
            }, this),
        );
        this.node.runAction(seq);
    }

    public fixWidth() {
        let scale = this.node.scale;
        if (this.node.width > cc.winSize.width) {
            scale = cc.winSize.width / this.node.width;
            this.node.scale = scale;
        }
    }

    public fixHeight() {
        let scale = this.node.scale;
        if (this.node.height > cc.winSize.height) {
            scale = cc.winSize.height / this.node.height;
            this.node.scale = scale;
        }
    }
    
    protected willClose() {
        if (this._closing == true) {
            return;
        }
        this._closing = true;
        this.node.stopActionByTag(ToastBase.TAG_TIP_ACTION);
        let seq = cc.sequence(
            cc.moveBy(0.2, cc.v2(0, -10)),
            cc.moveTo(0.02, cc.v2(this._tipPos.x, this._tipPos.y + this.node.height)),
            cc.delayTime(0.1),
            cc.callFunc(function() {
                this.extClose();
            }, this),
            cc.removeSelf(),
        );
        this.node.runAction(seq);
    }

    private extClose() {
        let manager = ToastManager.getManager()
        if (manager != null) {
            manager.removeToast(this);
        }
    }
}