import { ToastBase, ToastManager } from "./ToastManager";
import { POOL } from "../../manager/PoolManager";
import { AssetConst } from "../../GameConst";

export class Toast extends ToastBase {
    /**
     * 
     * @param msg 提示消息
     * @param duration 多少秒后自动关闭提示
     * @param positiony 纵坐标，默认190
     */
    public static showToast(msg: string, duration: number = 2,positiony?:number) {
        let hasToast = ToastManager.getManager().hasToast(msg);
        if (hasToast == false) {
            if(isNaN(positiony)){
                positiony=190;
            }
            Toast.createToastNode(msg,duration,positiony);
        }
    }

    private _msg: string = '';

    public setData(msg, duration) {
        this._duration = duration;
        this._msg = msg;
    }

    public hasToast(msg) {
        if (this._msg === msg) {
            return true;
        }
        return false;
    }
    private static createToastNode(msg: string,duration:number,positiony:number): cc.Node {
        if (msg == null) {
            return null;
        }
        POOL.getPrefabFromPool(AssetConst.ToastUI,(node:cc.Node)=>{
            if (node.parent != null) {
                node.removeFromParent();
            }
            console.log("length:"+msg.length);
            node.width = 450;
            node.position = cc.v2(0,positiony);
            let lblTip = node.getComponentInChildren(cc.Label);
            lblTip.string = msg;
            let toast = node.addComponent(Toast);
            toast.fixWidth();
            toast.setData(msg, duration);
            toast.show();
            return node;
        })
        return null;
    }

}
