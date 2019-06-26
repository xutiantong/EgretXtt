import SocialBase from "./SocialBase";
import { DEVICE } from "../device/DeviceAssist";
import { PANEL } from "../../manager/PanelManager";
import SocialData from "../../model/SocialData";
import { SOCIAL } from "./SocialAssist";
import Log from "../../utils/log/Log";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import { CFG } from "../../manager/ConfigManager";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import { GAME } from "../../model/GameData";
import { SHARE } from "../share/ShareAssist";
import { SCENE } from "../../scene/SceneManager";
import { LogUtils } from "../../utils/log/LogUtils";
import GameConst, { LoadingStep, AssetConst, Loading_debug_step } from "../../GameConst";
import { RES } from "../../manager/ResourceManager";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";
import { LOGINMG } from "../../manager/LoginManager";
import { POOL } from "../../manager/PoolManager";



export default class SocialWechatGame extends SocialBase{
    constructor(bType:string){
        super(bType);
        if(CC_DEBUG)
        {
            console.log('SocialWechatGame init')
        }
        SOCIAL.socialData.serverIp = window['farmSocketUrl'];
        MSG.on(MessageConst.Social_Auth_Update,this.SyncAuthToServer,this);
        let __self = this;
        MSG.on(MessageConst.Social_ReLogin,()=>{
            __self.StartGame();
        },this);
    }

    private _loginsuccess:boolean = false;
    private _configSuccess:boolean = false;
    public initSystemInfo()
    {
        //console.log('SocialWechatGame initSystemInfo')
        super.initSystemInfo()
        DEVICE.deviceData =window["systemInfo"];
        //console.log('SocialWechatGame initSystemInfo finish')

        //console.log("setFrameRate ---- "+DEVICE.getOS());
        if(DEVICE.getOS()=="AND")
        {
            //console.log("DEVICE.getOS()  ---- AND");
            cc.game.setFrameRate(30);
        }
    }
    public Login()
    {
        //console.log('wx_login start')
        GAME.loadingTimeTrace("weixin login start");
        let wxlogin = window['wxlogin'];
        console.log('SocialWechatGame wxlogin')
        if (wxlogin != undefined) {
            //console.log('wx_login')
            PANEL.addLoadingLayer();
            MSG.emit(MessageConst.Debug_loading_step , 
                {step:Loading_debug_step.Loading_debug_step_wxloginStart});
            wxlogin(this.onLogin.bind(this), this.onLoginProgress.bind(this));
        } else {
            console.log('SocialWechatGame wxlogin-else')
        }
        //加载配置
        this.loadConfig();
        //监听小程序显示事件
        cc.director.on('appOnShow', this.SyncAuthState, this);
        //this.preloadPrefab();
    }
    /**
     * 预加载场景
     */
    public preloadScene()
    {
        var time = Date.now();
        console.log("[load][preload_scene]："+GameConst.GameFramScene+" start "+time);
        let __self = this;
        MSG.emit(MessageConst.Debug_loading_step , 
            {step:Loading_debug_step.Loading_debug_step_loadSceneStart});
            
        cc.director.preloadScene(GameConst.GameFramScene, function () {
            MSG.emit(MessageConst.Debug_loading_step , 
                {step:Loading_debug_step.Loading_debug_step_loadSceneFinish});
            MSG.emit(MessageConst.Debug_loading_step , 
                    {step:Loading_debug_step.Loading_debug_step_loadOtherPrefabStart});
            __self.preloadPrefabAfterLogin2();
            if(CC_DEBUG)
            {
                console.log("[load][preload_scene]："+GameConst.GameFramScene+" end "+Date.now()+" consume:"+(Date.now()-time));
            }
            //多个场景占用内存高 暂时只预加载一个吧
            // cc.director.preloadScene(GameConst.GameFriendFarmSecne,function(){
            //     if(CC_DEBUG)
            //     {
            //         console.log("[load][preload_scene]："+GameConst.GameFriendFarmSecne+" end "+Date.now()+" consume:"+(Date.now()-time));
            //     }
            // });
        });
    }
    /**
     * 预加载prefab
     */
    public preloadPrefab()
    {
        DottingUtil.bi_normalFun(BIActionConst.kActName_DownLoadGameScene ,null);
        var time = Date.now();
        if(CC_DEBUG)
        {
            console.log("[load] preloadPrefab start "+time);
        }
        let preloadArray =[
            { path: AssetConst.EntryBtnView,initialCount:0},
            // { path: AssetConst.FriendSideBar,initialCount:0},
            { path: AssetConst.MainView,initialCount:0},
            //{ path: AssetConst.SeedView,initialCount:0}
        ];

        // RES.loadAtlas(AtlasAssetConst.Zhuyemian, (atlas:cc.SpriteAtlas)=>{
        // });
        
        // RES.loadAtlas(AtlasAssetConst.Common, (atlas:cc.SpriteAtlas)=>{
        // });
    }

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
       24:AssetConst.BattleResoutView,
       25:AssetConst.OpenContinueView,
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
            this.loadSomeNodeInPool();
            MSG.emit(MessageConst.Debug_loading_step , 
                {step:Loading_debug_step.Loading_debug_step_loadOtherPrefabFinish});
        },(name:string,count:number)=>{ 
            console.log('preloadPrefabAfterLogin',name);
            MSG.emit(MessageConst.Debug_preloading_step , 
            {step:count});});
    }


    public preloadPrefabAfterLogin(num:number = 1){
        console.log('preloadPrefabAfterLogin')
        MSG.emit(MessageConst.Debug_preloading_step , 
            {step:num});
        if(num > Object.keys(this.preloadAfterLoginMap).length || num < 1){
            this.loadSomeNodeInPool();
            MSG.emit(MessageConst.Debug_loading_step , 
                {step:Loading_debug_step.Loading_debug_step_loadOtherPrefabFinish});
            return;
        }
        let name = this.preloadAfterLoginMap[num];
        var time = Date.now();
        RES.Preload(name,(error)=>{
            if(error == ""){
                 console.log('preloadPrefabAfterLogin',name);
                if(this.preloadNodeInPool[num]){
                    POOL.getPrefabFromPool(name,(node:cc.Node)=>{
                        console.log('getPrefabFromPool',name);
                        if (node){
                            POOL.putPrefabToPool(node);
                        }
                    });
                }
                this.preloadPrefabAfterLogin(num+1);
            }else{
                this.preloadPrefabAfterLogin(num+1);
                 console.error("[load][pre_error]:"+error);
            }
        });
    }
    public loadSomeNodeInPool(){
        
        POOL.getPrefabFromPool(AssetConst.MainRole,(node:cc.Node)=>{
            if (node){
                POOL.putPrefabToPool(node);
            }
        });
        // POOL.getPrefabFromPool(AssetConst.BulletItem,(node:cc.Node)=>{
        //     if (node){
        //         POOL.putPrefabToPool(node);
        //     }
        // });
        POOL.getPrefabFromPool(AssetConst.MonsterItem,(node:cc.Node)=>{
            if (node){
                POOL.putPrefabToPool(node);
            }
        });
    }

    
    public loadConfig(){
         //加载配置
         DottingUtil.bi_normalFun(BIActionConst.kActName_LoadDataConfig ,{ret:0});
         MSG.emit(MessageConst.Debug_loading_step , {step:Loading_debug_step.Loading_debug_step_configStart})
         CFG.loadConfig(this.configLoadComplete.bind(this));
         
    }
    // 设置登陆进度
    onLoginProgress(progress) {
        Log.info("登陆进度:"+progress);
    }
    public  isForceAuth =false;
    /**
     * 
     * @param reqData 
     * let reqData = {
            code: res.code,
            platform: window.client_login_platform,
            deviceid: window.client_deviceid,
            version: window["wxGetGameVersion"](),
          }
     * @param ip 
     */
    onLogin(reqData, ip)
    {
        this._loginsuccess = true;
        MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.platformLogin});
        MSG.emit(MessageConst.Debug_loading_step , 
            {step:Loading_debug_step.Loading_debug_step_wxloginFinsh});
        GAME.loadingTimeTrace("weixin login success");
        
        let platform = window["systemInfo"].platform;
        reqData.platform =platform;

        DEVICE.deviceData.appversion = reqData.version;
        DEVICE.deviceData.deviceid = reqData.deviceid;
        DEVICE.deviceData.platform = platform;
            
        PANEL.removeLoadingLayer();

        console.log(" onLogin回调__ts回调wxlogin  ",reqData, '  platform: ' + platform, 'ip: ' + ip);
        // SOCIAL.socialData.accountId = id;
        // SOCIAL.socialData.openId = id;
        // SOCIAL.socialData.gameIp = ip;
        SOCIAL.socialData.code = reqData.code;
        SOCIAL.socialData.inviteOpenId = window["WX_InviteOpenid"];
        SOCIAL.socialData.inviteType = window["WX_InviteType"];
        SOCIAL.socialData.currentLoginShareId = window["WX_ShareId"];
        //this.getUserInfo();
        this.StartGame();
    } 

    public getUserInfo()
    {
        super.getUserInfo();
        let getWXUserInfo = window['getWxUserInfoWithCredentials'];
        if (getWXUserInfo != undefined) {
            getWXUserInfo(this.onGetUserInfo.bind(this));
        } else {
            Log.error("getWXUserInfo is not define!");
        }
    }
    onGetUserInfo(res:any)
    {
        // 拉取玩家信息回掉
        //RES.emit(GameCoreEvent.LOGIN_SUCCESS, {});
        console.log("wx回调getUserInfo:")
        console.log(res)
        // Log.debug("wx回调getUserInfo:",JSON.stringify(res));
        if (res == null) {
            SOCIAL.socialData.playerWXInfo = null;
            //以下接口已经废弃
            if(this.isForceAuth)
            {
                let getWxOpenSetting = window['wxOpenSetting'];
                if(getWxOpenSetting !=undefined )
                {
                    getWxOpenSetting((res)=>{
                        console.log("引导授权成功");
                    },()=>{
                        console.log("引导授权失败");
                    });
                }
            }
            return;
        }
        
        SOCIAL.socialData.playerWXInfo = JSON.parse(res["rawData"]);
        SOCIAL.socialData.playerWXInfoEncryption = res;
        let wxInfo ={gender: Number(SOCIAL.socialData.playerWXInfo["gender"]),icon: String(SOCIAL.socialData.playerWXInfo["avatarUrl"]),name:String(SOCIAL.socialData.playerWXInfo["nickName"])};
        SOCIAL.socialData.updatePlayerWxInfoByWx(wxInfo);
        //游戏内授权的处理
        //MSG.emit(MessageConst.Social_Auth_Update,wxInfo);
        if(this.authorizeState==0)
        {
            this.authorizeState =2;
        }
        //MSG.emit(MessageConst.Social_Login_Finish,this);
        //初始化进度条操作
        //this.node.getComponent(GameInit).initByWx(GLOBAL.accountId, GLOBAL.game_ip);
        if(this.authorizeState==1 && this.isForceAuth == false)
        {
            //已经授权的 登陆获取消息后直接开始 此时没弹窗 b并且不是强制登陆的 需要发送给服务器消息 userinfo
            MSG.emit(MessageConst.Social_Login_Update_Auth,wxInfo);
        }
    }

    private StartGame()
    {
        if(!this._loginsuccess){
            if(CC_DEBUG)
            {
                console.log("需要等待 wx登陆");
            }
            return ;
        }
        if (!this._configSuccess){
            console.log("需要等待 加载配置");
            return;
        }

        //不连接服务器
        // MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.serverDataInited});
        // SCENE.startupMainUI();
        // return;


        GAME.loadingTimeTrace("load config start");
        LogUtils.showLog('socialWechatGame StartGame')
        console.log('socialWechatGame StartGame')
        MSG.emit(MessageConst.Debug_loading_step , 
            {step:Loading_debug_step.Loading_debug_step_serverLoginStart});

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
                        SHARE.DoWakeUpAction();
                        SOCIAL.socialBase.SyncAuthState();
                }else{
                    console.error("登录失败,请检查错误日志");
                }
            },this);
     

    }
    private configLoadComplete(){
        console.log('配置加载完成')
        DottingUtil.bi_normalFun(BIActionConst.kActName_LoadDataConfigRet ,{ret:0});
        console.log("[load][loadConfig] end"+Date.now());
        GAME.loadingTimeTrace("load config complete");
        LogUtils.showLog('socialWechatGame configLoadComplete()')
        console.log('农场socket url : ' + SOCIAL.socialData.serverIp)
        this._configSuccess = true;
        MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.configLoaded});
        MSG.emit(MessageConst.Debug_loading_step , {step:Loading_debug_step.Loading_debug_step_configFinish})
        
        this.preloadScene();
        this.StartGame();
    }
    /**初始化参数 */
    private getInitParams(){
        if(SOCIAL.socialData.playerWXInfo==null)
        {
            return {};
        }
        return {gender: SOCIAL.socialData.playerWXInfo["gender"],
            icon: SOCIAL.socialData.playerWXInfo["avatarUrl"],};
    }
    private _isCanUseAuth=false;
    /**
     * 从wx服务器同步授权状态
     */
    public SyncAuthState()
    {
        //授权消息发送
        let wxGetSetting = window['wxGetSetting'];
        if(wxGetSetting!=undefined)
        {
            wxGetSetting((state)=>{
                //state=1;//test
                this.authorizeState=state;
                SOCIAL.socialData.authorizeState=state;
                this._isCanUseAuth = true;
                
                if(state == 0 || state == -1)
                {
                    //未授权的直接进游戏
                    console.log("wx auth state=="+this.authorizeState);
                    // this.StartGame();
                }       
                else{
                    //已经授权的
                    console.log("wx auth state=="+this.authorizeState);
                    //this.getUserInfo();
                }
            },()=>{
                Log.info("wxGetSetting失败");
            });
        }
    }

    public CheckAuthInGame():boolean
    {
        if(!this._isCanUseAuth)
        {
            //授权没检查成功就直接让种植
            return true;
        }
        if(this.authorizeState==0)
        {
            //未授权过
            //未授权的提示授权
            this.isForceAuth = true;
            this.getUserInfo();
            return false;
        }
        else if(this.authorizeState==1)
        {
            return true;
        }
        else if(this.authorizeState==2)
        {
            //游戏内授权
            return true;
        }
        else if(this.authorizeState ==-1)
        {
            //未授权 拒绝过
            return true;
        }
        return false;
    }
        /** 
     * 登录一个新的账号
     */
    public logAnotherAccount(newUserId:string){
        if (newUserId){
            SOCIAL.socialData.accountId = newUserId;
        }
        window['wechatShowModel'](
            '是否退出小程序，重启后将会使用新账号',
            (res)=>{
                if (res.confirm == true){
                    window['exitMiniProgram']();
                }
                
            },
        )
       
        // let __self = this;
        // NET.dismissConnect(()=>{
        //     __self.reloadInit()
           
        // })
    }


    private reloadInit(){
        MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.configLoaded});
        let self = this
        console.log('reloadInit')
        NET.connect(SOCIAL.socialData.serverIp, ()=>{
            NET.send(NetConst.Init, self.getInitParams(), function(data: any) {
                console.log('socketCallback id : ' + NetConst.Init)
                console.log(data)
                // GAME.initServerData(data);
                GAME.onUserBaseChanged(data.baseInfo);
                MSG.emit(MessageConst.kUserGMReset)
            }, self)
        }, self);
    }

    /**
     * 拿到授权信息后发送给服务器
     * @param evt 
     */
    public SyncAuthToServer(evt)
    {
        if(SOCIAL.socialData.playerWXInfoEncryption==undefined)
        {
            return;
        }
        let userInfo=SOCIAL.socialData.playerWXInfoEncryption;
        if(CC_DEBUG)
        {
            console.log("SyncAuthToServer data");
            console.log(userInfo);
        }
        console.log("todo 把消息wx授权消息同步给服务器");
        NET.send(NetConst.SyncUserInfo,{userInfo: userInfo},(res)=>{
            console.log("SyncAuthToServer success");
        },(error)=>{
            console.log("SyncAuthToServer fail");
            console.error(error);
        });
    }
    
}
