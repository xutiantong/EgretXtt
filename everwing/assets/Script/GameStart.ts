import Log from "./utils/log/Log";
import NetMessage from "./net/NetMessage";
import PanelManager, { PANEL } from "./manager/PanelManager";
import GameConst, { AssetConst } from "./GameConst";
import { CFG } from "./manager/ConfigManager";
import { NET } from "./net/core/NetManager";
import NetConst from "./net/NetConst";
import { GAME } from "./model/GameData";
import { SCENE } from "./scene/SceneManager";
import SocialAssist, { SOCIAL } from "./modules/social/SocialAssist";
import WXInterface, { WX_API } from "./modules/share/WXInterface";
import { MSG } from "./message/MessageController";
import MessageConst from "./message/MessageConst";
import { PAY } from "./modules/pay/PayAssist";
import { DEVICE } from "./modules/device/DeviceAssist";

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
export default class GameStart extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        MSG.on(MessageConst.Friend_Share_In_Friend,this.OnShareInFriend,this);
        MSG.on(MessageConst.Friend_Recommend_List_Change,this.OnShareInFriend,this);
        console.log("setFrameRate *** "+DEVICE.getOS());
        if(DEVICE.getOS()=="AND")
        {
            console.log("DEVICE.getOS()  *** AND");
            // cc.game.setFrameRate(30);
        }
        cc.director.getCollisionManager().enabled=true;
    }

    public OnShareInFriend(evt)
    {

    }
    start () {
        SOCIAL.loginState();
    }
    onDestroy()
    {
        MSG.off(MessageConst.Friend_Share_In_Friend,this.OnShareInFriend,this); 
        MSG.off(MessageConst.Friend_Recommend_List_Change,this.OnShareInFriend,this);
    }
}