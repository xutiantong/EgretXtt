import { MSG } from "../message/MessageController";
import NetConst, { PushConst } from "./NetConst";
import { PANEL } from "../manager/PanelManager";
import { GAME } from "../model/GameData";
import MessageConst from "../message/MessageConst";
import Log from "../utils/log/Log";
import { NET } from "./core/NetManager";
import { SCENE } from "../scene/SceneManager";
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
export default class NetMessage extends cc.Component {

    // onLoad () {}

    private isInBack:boolean = false;
    start () {

    }
    onEnable() {
        MSG.on(NET.NET_MESSAGE, this.onNetMessage, this);
        MSG.on(MessageConst.Player_PageBack_Update,this.onPageBack,this);
        MSG.on(MessageConst.Player_goBack_Update,this.onGoBack,this);
    }

    onDisable() {
        MSG.off(NET.NET_MESSAGE, this.onNetMessage, this);
        MSG.off(MessageConst.Player_PageBack_Update,this.onPageBack,this);
        MSG.off(MessageConst.Player_goBack_Update,this.onGoBack,this);
    }
    // update (dt) {}
    private _retryNum:number=0;
    private _retryMaxNum:number=3;
    private _retryTime:number=3;
    private _socketState:string;
    public getSocketState():string
    {
        return this._socketState;
    }
    private onNetMessage(e:any)
    {
        let msgid = e.detail.id+"";
        this._socketState  = msgid;
        switch(msgid)
        {
            case NetConst.NET_Connecting:
            {
                PANEL.addLoadingLayer();
            }   
        break;
            case NetConst.NET_Connected:
            {
                this._retryNum =0;
                PANEL.removeLoadingLayer();
            }                
            break;
            case NetConst.ExceptionCmd:{
                let msg = e.detail.data.errorCode+","+e.detail.data.errorMsg;
                if(CC_DEBUG) {
                    msg = JSON.stringify(e.detail);
                }
                // altp = AlertPanel.showAlert("",msg);
            }break;
            case NetConst.NET_CLOSE:{
                this.retryLogin("网络异常","链接已断开，请检查网络状态后重试",NetConst.NET_CLOSE);
            }break;
            case NetConst.NET_ERROR:{
                this.retryLogin("网络异常","链接错误，请检查网络后重试",NetConst.NET_ERROR);
            }break;
            case NetConst.NET_ConnectTimeOut:
            {
                this.retryLogin("超时警告","链接超时，请检查网络后重试",NetConst.NET_ConnectTimeOut);
            }                
            break;
            case NetConst.SCBeTakePlace:{
                this.showNetClose();                 
            }break;
            default:{
            this.MsgPushParser(msgid,e.detail.data);
            }
            break;
        }
    }

    //切入后台
    private onGoBack(e){
        this.isInBack = true;
    }

    private onPageBack(e){
        if(this.isInBack)
        {
            this.isInBack = false;
            if(this._socketState ==NetConst.NET_CLOSE||this._socketState ==NetConst.NET_ERROR||this._socketState ==NetConst.NET_ConnectTimeOut)
            {
                this.retryConnectNet();
            }
        }
    }

    private _isRetrying:boolean = false;
    private retryLogin(tittle:string,content:string,src:string,forceAlert:boolean= false)
    {
        if(this.isInBack){
            console.log("isInBack return");
            return;
        }
        if(this._isRetrying){
            console.log("_isRetrying return");
            return;
        }
        this._isRetrying = true;
        PANEL.addLoadingLayer();
        console.log("Retry Connect:",this._retryNum,",type:",src);
        if(++this._retryNum<this._retryMaxNum )
        {
   
            this.scheduleOnce(()=>{
                this.retryConnectNet();
            },this._retryTime ) ;
  
        }else{
            //网络连续连不上之后，就5秒后再重试
            let __self = this;
            this.scheduleOnce(()=>{
                __self._retryNum=0;
                __self.retryConnectNet();
            },5);
        }
        if(CC_DEBUG)
        {
            console.log(src);
        }
    }

    private retryConnectNet(){
        this._isRetrying = false;
        // NET.reConnect();
        NET.reConnet_v1((status :number)=>{
            if (status == 1){
                //值为1 说明无法重连，直接重新走login
                MSG.emit(MessageConst.Social_ReLogin);
            }
        })
    }

    private showNetClose()
    {
        this._isRetrying = true;
        // Game.eventCenter.off(NET.NET_MESSAGE,this.onNetMessage,this);
        PANEL.showNetAlert("警告","你的账号在别处登陆!请重新登录",this.okCallback.bind(this));
    }

    private okCallback(){
        this.retryConnectNet();
    }
    private MsgPushParser(id:string,data:any)
    {
        // console.log("推通消息处理：",id,JSON.stringify(data));
        switch(id)
        {
            case PushConst.UpLevelPrize:{

            }break;
            case PushConst.userBaseChange:{
                GAME.onUserBaseChanged(data);
            }break;
            case PushConst.RefreshUserInfo:{
                Log.debug("onUserBackRefresh done");
                MSG.emit(MessageConst.Player_PageBack_Update);
            }break;
            case PushConst.PushUserLevelUp:{
                GAME.userLevelUp(data);
            }break;
            case PushConst.PushCloseFarmRedPoint:{
                MSG.emit(MessageConst.Friend_Close_RedDot);
            }break;
            case PushConst.PushSwitchInfo:{
                GAME.pushSwitchData(data);
            }break;
            case PushConst.PushInviteFriendRwd:
            {
                MSG.emit(MessageConst.Friend_Invite_New_Change, {showNew: true} );
            }
            break;
            case PushConst.FriendFightShare:
            {
                MSG.emit(MessageConst.FriendFrientFromShare,data);
            }
            break;
        }
    }
}
