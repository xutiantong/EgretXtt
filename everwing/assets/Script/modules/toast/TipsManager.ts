import { TipBase } from "./TipBase";
import Log from "../../utils/log/Log";

const {ccclass, property} = cc._decorator;

//
// 提示弹出管理
//

@ccclass
export class TipsManager extends cc.Component {

    @property(cc.Node) tipLayer: cc.Node = null;

    private _hasToast: boolean = false;

    public static getManager(): TipsManager {
        let uiCanvas = cc.find("UICanvas");
        if (uiCanvas === null) {
            Log.error("UICanvas not found!");
            return null;
        }
        let mangager = uiCanvas.getComponent(TipsManager);
        if (mangager === null) {
            Log.error("TipsManager not found!");
            return null;
        }
        return mangager;
    }

    public showTip(tip: TipBase) {
        if (tip != null) {
            if(tip.node.isChildOf(this.tipLayer)){
                return;
            }
            this.tipLayer.addChild(tip.node);
            tip.willShow();
        }
    }

    public removeTip(tip: TipBase) {
        if (tip != null) {
            tip.remove();
        }
    }
}