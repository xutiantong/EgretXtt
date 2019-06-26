
import { NET } from "../net/core/NetManager";
import SocialAssist, { SOCIAL } from "../modules/social/SocialAssist";
import DottingUtil, { BIActionConst } from "../utils/DottingUtil";
import { DEVICE } from "../modules/device/DeviceAssist";
import NetConst from "../net/NetConst";
import { GAME } from "../model/GameData";
import { SCENE } from "../scene/SceneManager";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import { Loading_debug_step } from "../GameConst";
import { SOUND } from "./SoundManager";


export default class LoginManager  {
    private static _instance: LoginManager = null;
    public static getInstance(): LoginManager {
        if (LoginManager._instance == null) {
            LoginManager._instance = new LoginManager();
            
        }
        return LoginManager._instance;
    }
    private loginCallBackDic= null;
    /**
     * 
     * @param connectIp 连接ip
     * @param cb 回调函数
     * @param thisObj 上下文对象
     */
    public gameLogin(connectIp:string,cb:Function, thisObj:any){
        this.loginCallBackDic = {
            cb:cb,
            thisObj:thisObj
        }
        this.startConnectServer(connectIp);
    }
    public startConnectServer(connectIp:string){
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerConnect,{ret:0})
        let __self = this;
        NET.connect(
            connectIp,
            (status:number)=>{
                if (status == 0){
                    console.log('连接成功');
                  
                    __self.startFarmLogin();
                    DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerConnectRet,{ret:0})
                }else{
                      //底层会根据消息通知，自行重连
                    DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerConnectRet,{ret:1})
                }             
            },this)
    }


    public startFarmLogin(){
        console.log('startFarmLogin()')
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerLogin,null);
        let  loginData = this.getLoginData();
        if(CC_DEBUG)
        {
            console.log("Login Params: ");
            console.log(loginData);
        }
        let __self = this;
        NET.send(NetConst.Login,loginData,
            (resData) => {
              
                NET.doSendresidueMsg();
                SOCIAL.socialData.code ="";
                DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerLoginRet,{ 
                    ret: 0 ,
                    ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
                    InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
                    InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:'',
                    systeminfo:   window['systemInfo']? window['systemInfo']: ''
                })
                //server时间同步
                GAME.initLogin(resData);
                MSG.emit(MessageConst.Debug_loading_step , 
                    {step:Loading_debug_step.Loading_debug_step_serverLoginFinish});
                __self.startFarmInit();
            },this,
            (errMsg) => {
                console.error(errMsg);
                DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerLoginRet,{  
                    ret: 1,
                    ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
                    InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
                    InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:'',
                    systeminfo:   window['systemInfo']? window['systemInfo']: ''
                })
            });
    }

    public startFarmInit(){
        let self = this
        
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerInit,null);
        NET.send(NetConst.Init, this.getTempInitParams(), function(data: any) {
            console.log('socketCallback id : ' + NetConst.Init)
            console.log(data)
            GAME.initServerData(data);
            DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerInitRet,{ ret: 0});
            MSG.emit(MessageConst.Debug_loading_step , 
                {step:Loading_debug_step.Loading_debug_step_serverInitFinish});
            SOUND.preLoadSound(() => {
                SCENE.startupMainUI();
            });
            if (this.loginCallBackDic){
                this.loginCallBackDic.cb.call(this.loginCallBackDic.thisObj.this,0);
                this.loginCallBackDic = null;
            }

            console.log('请求abTest列表')
            //请求abTest列表
            // NET.send(NetConst.ABTest, {method:'list'}, function(data: any) {
            //     console.log('ab:')
            //     console.log(data)
            //     GAME.initAbTestData_v1(data);
            //     let abArray = data.array;
            //     if(abArray.length!=0){
            //         let testType = abArray[0].testId;
            //         let testId = abArray[0].testType;
            //         DottingUtil.bi_normalFun(BIActionConst.kActName_ABTest,{testid:testId, testtype: testType});
            //         if(abArray.length!=1){
            //             let testType1 = abArray[1].testId;
            //             let testId1 = abArray[1].testType;
            //             DottingUtil.bi_normalFun(BIActionConst.kActName_ABTest1,{testid:testId1, testtype: testType1});
            //         }
            //     }
            // }, this,
            // (errMsg)=>{
            //     console.error(errMsg);
            // })
        }, this,
        (errMsg)=>{
            console.error(errMsg);
            DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerInitRet,{ ret: 1})
            if (this.loginCallBackDic){
                this.loginCallBackDic.cb.call(this.loginCallBackDic.thisObj.this,1);
                this.loginCallBackDic = null;
            }
        })

       
    }

    private getLoginData(){
        let  loginData = null;
        if ( SOCIAL.social_type == SocialAssist.SOCIAL_Wechat){
            loginData = {
                accountId: SOCIAL.socialData.openId,
                deviceid:DEVICE.deviceData.deviceid,appversion:DEVICE.deviceData.appversion,platform:DEVICE.deviceData.platform,   
                shareId: SOCIAL.socialData.currentLoginShareId, 
                adId: window["adId"],
                adMaterial:window["adMaterial"],
                userInfo: SOCIAL.socialData.playerWXInfoEncryption,//3级授权前没有这个数据
                userAuthStatus: SOCIAL.socialBase.isHasAuth(),
                loginType:'weixin',channel:window["channel"],
                code:SOCIAL.socialData.code,
            }
        }else {
            loginData = {
                accountId: SOCIAL.socialData.accountId,
                deviceid:DEVICE.deviceData.deviceid ? DEVICE.deviceData.deviceid: SOCIAL.socialData.accountId,
                appversion:DEVICE.deviceData.appversion,platform:DEVICE.deviceData.platform,   
                shareId: SOCIAL.socialData.currentLoginShareId, 
                adId: window["adId"],
                loginType:'web',
                adMaterial:window["adMaterial"],
            }
        }
        return loginData;
    }
    private getTempInitParams(){
        return {};
    }
}

export var LOGINMG = LoginManager.getInstance();