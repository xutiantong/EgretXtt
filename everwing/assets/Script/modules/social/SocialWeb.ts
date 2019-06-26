import SocialBase from "./SocialBase";
import { SOCIAL } from "./SocialAssist";
import { CFG } from "../../manager/ConfigManager";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import { GAME } from "../../model/GameData";
import { PANEL } from "../../manager/PanelManager";
import { DEVICE } from "../device/DeviceAssist";
import Log from "../../utils/log/Log";
import { SCENE } from "../../scene/SceneManager";
import GameConst, { LoadingStep, Loading_debug_step, AssetConst } from "../../GameConst";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import FarmScene from "../../scene/FarmScene";
import { LOGINMG } from "../../manager/LoginManager";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";
import { SHARE } from "../share/ShareAssist";
import { RES } from "../../manager/ResourceManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SocialWeb extends SocialBase{

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    start () {
    }
    constructor(bType:string){
        super(bType);
        
    }

    /**
     * 初始化系统信息
     */
    public initSystemInfo()
    {
        DEVICE.deviceData.platform ="web";
        if(window['getVersion']!=undefined){
            DEVICE.deviceData.appversion = window['getVersion'];
        }
        this.authorizeState = 1;

        var buildRelease:boolean= false;
        if(window["buildRelease"]!=undefined){
            buildRelease = window["buildRelease"];
        }
        
        if(buildRelease){
            SOCIAL.socialData.serverIp = "wss://ppdev.rivergame.net/everwing_release";
            SOCIAL.socialData.accountId = "10001";
        }else{
            SOCIAL.socialData.serverIp = "wss://ppdev.rivergame.net/everwing_test";   //1服
            // SOCIAL.socialData.gameIp = "wss://ppdev.rivergame.net:8081/websocket";     //2服
            //SOCIAL.socialData.serverIp = "ws://10.1.37.52:8006/websocket"
            SOCIAL.socialData.accountId = "1847297";
        }
        if(window["account_id"]!=undefined && window["account_id"]!=""){
            SOCIAL.socialData.accountId = window["account_id"];
        }
        Log.debug("initSystemInfo:{appVersion:"+DEVICE.deviceData.appversion
            +",buildRelease:"+ buildRelease 
            +",serverIp:"+ SOCIAL.socialData.serverIp 
            +",accountId:"+ SOCIAL.socialData.accountId 
        );
    }

    public Login()
    {
        //通过加载开始
        CFG.loadConfig(this.configLoadComplete.bind(this));
    }


    private configLoadComplete(){
        MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.configLoaded});
        MSG.emit(MessageConst.Debug_loading_step , {step:Loading_debug_step.Loading_debug_step_configFinish});
        //MSG.emit(MessageConst.Debug_loading_step , {step:Loading_debug_step.Loading_debug_step_loadOtherPrefabFinish});
        // //不连接服务器
        // MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.serverDataInited});
        // SCENE.startupMainUI();
        // return;
        this.preloadPrefabAfterLogin2()
        LOGINMG.gameLogin(SOCIAL.socialData.serverIp,
            (status:Number) =>{
                if (status == 0){
                    console.log("登录完成,开始游戏");
                    // DottingUtil.bi_normalFun(BIActionConst.kActName_EnterGame,
                    //     {
                    //         ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
                    //         InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
                    //         InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:''
                    //     });
                        // SHARE.DoWakeUpAction();
                        SOCIAL.socialBase.SyncAuthState();
                }else{
                    console.error("登录失败,请检查错误日志");
                }
            },this);
    }



        /** 
     * 登录一个新的账号
     */
    public logAnotherAccount(newUserId:string){
        if (newUserId){
            SOCIAL.socialData.accountId = newUserId;
        }
        let __self = this;
        NET.dismissConnect(()=>{
            __self.reloadInit()
        })
    }


    private reloadInit(){
        MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.configLoaded});
        let self = this
        NET.connect(SOCIAL.socialData.serverIp, ()=>{
            NET.send(NetConst.Init, self.getInitParams(), function(data: any) {
                console.log('socketCallback id : ' + NetConst.Init)
                console.log(data)
                GAME.onUserBaseChanged(data.baseInfo);
                MSG.emit(MessageConst.kUserGMReset)
            }, self)
        }, self);
    }

    /**初始化参数 */
    private getInitParams(){
        return {gender: 0,
            icon: 'default',};
    }

    // update (dt) {}

    public preloadAfterLoginMap = {
        1:AssetConst.BattleBg,
        2:AssetConst.StarBg,
        3:AssetConst.MainRole,
        4:AssetConst.WaringItem,
        5:AssetConst.MonsterItem,
        6:AssetConst.OverContinueView,
        7:AssetConst.MonsterBatBossItem,
        8:AssetConst.MonsterTreeBossItem,
        9:AssetConst.MonsterSplitBossItem,
        10:AssetConst.MonsterWitchBossItem,
        11:AssetConst.MonsterSplitBossBigItem,
        12:AssetConst.MonsterSplitBossMidItem,
        13:AssetConst.MonsterEliteItem,
        14:AssetConst.MonsterWitchEntourageItemFire,
        15:AssetConst.MonsterWitchEntourageItemWater,
        16:AssetConst.MonsterWitchEntourageItemWind,
        17:AssetConst.Warning,
        18:AssetConst.EnemySuperBullet,
        19:AssetConst.MonsterItemBlink,
        20:AssetConst.UITouchLock,
        21:"img/BG/backImg2.png",
        22:"img/BG/backImg3.png",
        23:AssetConst.FriendPlane,
     }
 
     public preloadNodeInPool = { 
         3:1,
         6:1,
         7:1,
         8:1,
         9:1,
         16:1,
         18:1,
     }
 
     public preloadPrefabAfterLogin2(){
         let arr:string[]=[];
         for(let key in this.preloadAfterLoginMap){
             arr.push(this.preloadAfterLoginMap[key]);
         }
         
         RES.Preload(arr,(error)=>{
             MSG.emit(MessageConst.Debug_loading_step , 
                 {step:Loading_debug_step.Loading_debug_step_loadOtherPrefabFinish});
         },(name:string,count:number)=>{ 
             console.log('preloadPrefabAfterLogin',name);
             MSG.emit(MessageConst.Debug_preloading_step , 
             {step:count});});
     }
}
