import EntryBtnBase from "./EntryBtnBase";
import { PANEL } from "../../manager/PanelManager";
import { AssetConst } from "../../GameConst";
import MessageConst from "../../message/MessageConst";


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
export default class EntryBtnInviteRwd extends EntryBtnBase {

    public EvtListenerNewId = MessageConst.Friend_Invite_New_Change;
    public onClickItem()
    {
        // if(this.sprNew){
        //     this.sprNew.node.active = false;
        // }
        // PANEL.showPopUp(AssetConst.InviteRwdPanel);
    }

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
