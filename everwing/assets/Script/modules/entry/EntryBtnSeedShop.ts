import EntryBtnBase from "./EntryBtnBase";
import MessageConst from "../../message/MessageConst";
import { MSG } from "../../message/MessageController";

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
export default class EntryBtnSeedShop extends EntryBtnBase {

    public EvtListenerNewId = MessageConst.SeedItem_Check_Can_Unlock;
    public EvtEntryClickId = MessageConst.Entry_Btn_Click_SeedShop;
    public onNewChange(evt)
    {
        super.onNewChange(evt)
        if(evt.detail.showNew)
        {
            if(this.sprNew)
            {
                var anim=this.sprNew.getComponent(cc.Animation);
                if(anim)
                {
                    anim.play();
                }
            }
        }
    }
}
