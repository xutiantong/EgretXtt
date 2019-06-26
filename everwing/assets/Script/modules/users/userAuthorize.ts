import PanelBase from "../../component/PanelBase";
import PanelManager, { PANEL } from "../../manager/PanelManager";
import GameConst, { ConfigConst, ResourceConst, ZERO, AssetConst } from "../../GameConst";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import { GAME } from "../../model/GameData";
import { SOCIAL } from "../social/SocialAssist";
import {BM} from "../battle/BattleManager";
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
export default class UserAuthorize extends PanelBase {

    @property(cc.Button)
    closeButton: cc.Button = null;

    private _button=null;
    private _fightshow=false;
    private _sch=1;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onEnable(){
        var userInfoBtn=window["userInfoBtn"];
        if(userInfoBtn){
            console.log("winsize width "+cc.winSize.width+"winsize height "+cc.winSize.height)
            this._button=userInfoBtn(cc.winSize.width/4-7.5,cc.winSize.height/4-19,185,143,this.getUserInfoCallBack.bind(this));
            var userInfoBtnShow=window["userInfoBtnShow"];
            userInfoBtnShow(this._button);
        }  
    }
    // update (dt) {}

    onDisable(){
        if(this._button){
            var userInfoRemove=window["userInfoRemove"];
            userInfoRemove(this._button);
            this._button=null;
        }
    }

    public onInit(data?:any){
        if(data&&data==true){
            this._fightshow=true;
            var sch= cc.director.getScheduler();
            this._sch= sch.getTimeScale();
            sch.setTimeScale(0);
            BM.friendFrightShowing=true;
        }
    }

    /**
     * 关闭继续
     */
    private closeAuthorize(){
        this.closePanel();
        PANEL.showSinglePopUp(AssetConst.FriendFight,{"fight":this._fightshow,"sch":this._sch});
    }

    /**
     * 用户授权结束
     */
    private getUserInfoCallBack(res){
        console.log("WXUserInfoButtonUtils::onButtonTap", res);
		if(res && res.userInfo)
		{
            SOCIAL.socialData.authorizeState=1;
            //授权成功
            NET.send(NetConst.UserAuthorize,{"method":"update","userInfo":res.userInfo},(data) =>{
                if(data){
                    console.log("authorizeupdatedata",data);
                    GAME.updatePlayerData_v1(data.baseInfo.playerInfo);
                }
            },this)
            this.closeAuthorize();
		}
		else
		{
			//拒绝了授权
			this.closeAuthorize();
		}
    }

}
