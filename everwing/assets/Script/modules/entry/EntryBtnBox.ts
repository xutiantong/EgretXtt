import EntryBtnBase from "./EntryBtnBase";
import { PANEL } from "../../manager/PanelManager";
import { AssetConst } from "../../GameConst";
import MessageConst from "../../message/MessageConst";
import { SOCIAL } from "../social/SocialAssist";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";

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
export default class EntryBtnBox extends EntryBtnBase {
    public onClickItem()
    {
        // NET.send(NetConst.reqBoxInfo,null,(data)=>{
        //     PANEL.showPopUp(AssetConst.TreasureBoxPopupView,data);
        // },this);
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
    // update (dt) {}
}