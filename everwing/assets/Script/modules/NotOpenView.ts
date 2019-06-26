import PanelBase from "../component/PanelBase";
import { PANEL } from "../manager/PanelManager";
import PopupBase from "../component/PopupBase";

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
export default class NotOpenView extends PopupBase {
    @property(cc.Label) desLabel: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    start () {
    }
    private onClickClose()
    {
        PANEL.closePanel(this.node);
    }

    onInit(param,info){
        super.onInit(param,info);
        if(param != undefined){
            if(param.money){
                this.desLabel.string = "达到"+String(param.money)+"元可提现到微信钱包";
            }else if(param.ios){
                this.desLabel.string = "非常抱歉，根据微信规定IOS支付暂不开放";
            }else if(param.shop){
                this.desLabel.string = "由于游戏玩法调整，您的果实已经转换为金币";
            }
        }else{
            this.desLabel.string = "该功能暂未开放";
        }
    }
    // update (dt) {}
}
