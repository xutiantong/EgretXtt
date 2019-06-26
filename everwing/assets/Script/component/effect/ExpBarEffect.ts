import ProgressBarEffect from "./ProgressBarEffect";
import MessageConst from "../../message/MessageConst";
import { ResourceConst } from "../../GameConst";
import { GAME } from "../../model/GameData";

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
export default class ExpBarEffect extends ProgressBarEffect {
    ListenEvent:string=MessageConst.Player_Data_RefreshUI;
    public UpdateData(e)
    {
        this._useAnim = e.detail.useAnim;
        if(e.detail.resId == ResourceConst.Exp){
            //计算当前的经验值
            var pro:number = GAME.getExpProgress();
            this.setNewValue(pro);
        }
    }
}
