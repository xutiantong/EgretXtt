import Log from "../utils/log/Log";
import { PlayerData } from "./PlayerData";
import { CFG } from "../manager/ConfigManager";
import GameConst, { ConfigConst, ResourceConst, ZERO, LoadingStep } from "../GameConst";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import { SOCIAL } from "../modules/social/SocialAssist";
import DottingUtil, { BIActionConst } from "../utils/DottingUtil";

import NumberUtil from "../utils/NumberUtil";
import { SOUND } from "../manager/SoundManager";
import { BATTLEDATA } from "./BattleData";
import { NET } from "../net/core/NetManager";
import NetConst from "../net/NetConst";

export default class GameData{
    public friendData:any = null;
    public activeLoginData:any = null;
    public rouletteFirstLogin:boolean = false;
    public static _inst:GameData;

    public isShareOpen = false;
    public static getInstance():GameData
    {
        return this._inst||(this._inst = new GameData())
    }
    private _initLoginTime: number = 0;
    private _serverTime: number = 0;
    // 服务器时间戳
    public getServerTime() {
        let nowTime = new Date().getTime();
        let diff = nowTime - this._initLoginTime;
        let stime = this._serverTime + diff;
        return stime;
    }
    
    private _firstLogin:boolean = false;
    public _dogSwitch:boolean = false;
    public _mainViewAbTest:string = null;
    public _guideAbTest:string = null;
    public _abTestSwitchData:any = {};
    public playerData:PlayerData = null;//玩家信息
    private _useRedPacket:boolean = false;

    public _isInUserGuide:boolean = false;//是否在新手教程 
    public _userGuideStep:string="";

    public boxInfo:any=null; //宝箱数据

    public get useRedpacket(){  //红包开关
        return this._useRedPacket;
    }
    
    private userLevelUpNotifyData = null;//用户升级通知数据
    public initLoginTime() {
        this._initLoginTime = new Date().getTime();
    }
    public initLogin(res:any) {
        if(CC_DEBUG)
        {
            console.log("用户登录数据(initLogin)：");
            console.log(res);
        }
        if(res["serverTime"]!==undefined){
            let nowTime = new Date().getTime();
            this._initLoginTime += nowTime - this._initLoginTime;
            this._serverTime = res["serverTime"];
        }
        if(res.openId)
        {
            // window.login_body = data;
            window['WX_MyOpenid'] = res.openId;
            SOCIAL.socialData.accountId =res.openId;
            SOCIAL.socialData.openId =res.openId;
        }
        if(res.newUser!=undefined)
        {
            SOCIAL.socialData.isNewUser = res.newUser;
            window["isnew"]=res.newUser==true?0:1;
            window["checkIsNew"] = window["isnew"];
        }
    }
    

    /**初始化服务器数据 */
    public initServerData(data:any=null) {
        SOCIAL.isLogin = true;
        MSG.emit(MessageConst.ADD_BUTTONEFFECT);
        if(data["firstLogin"]!==undefined){
            this._firstLogin = Boolean(data["firstLogin"]);
        }
        if (data['clientIp']){
            window['clientIp'] = data['clientIp']
        }
       
        this.playerData = new PlayerData();          
        if(data == null) {
            Log.error("initServerData: data is null!");
            return;
        }
        
        if(data.uid != undefined){
            SOCIAL.socialData.uid = data.uid;
            window["uid"] = data.uid;
        }
        
        let localData=localStorage.getItem("playerData");
        console.log("localData",localData);
        let isLocal=0;
        if(localData&&localData!=""){
            let playerLocal=JSON.parse(localData);
            if(playerLocal&&playerLocal.RoleData&&playerLocal.RoleData.reconnectTime&&data.baseInfo.playerInfo.reconnectTime<playerLocal.RoleData.reconnectTime&&playerLocal.RoleData.uid==data.baseInfo.playerInfo.uid){
                isLocal=1;
                this.playerData.parse(playerLocal.RoleData);
                if(playerLocal && playerLocal.connectUpperGame){
                    this.playerData.praseRushBossData(playerLocal.connectUpperGame);
                }
                console.log("localData",this.playerData);
                NET.send(NetConst.ReConnect,{"method":"update","playerInfo":this.playerData.RoleData,"connectUpperGame":this.playerData.RushBossData},(data)=>{
                    console.log("ReConnect",data);
                },this);
            }
        }
        if(isLocal==0){
            this.playerData.parse(data.baseInfo.playerInfo);
            if(data && data.baseInfo && data.baseInfo.connectUpperGame){
                this.playerData.praseRushBossData(data.baseInfo.connectUpperGame);
            }
        }
            


        if (data && data.baseInfo && data.baseInfo.playerInfo){
            let open = data.baseInfo.playerInfo.open;
            if (open == 1){
                this.isShareOpen = true;
            }
        }
        if(data && data.baseInfo && data.baseInfo.boxInfo){
            this.boxInfo=data.baseInfo.boxInfo;
        }
        if(data&&data.baseInfo&&data&&data.baseInfo.abTestArray){
            this.initAbTestData_v1(data.baseInfo.abTestArray);
        }
        MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.serverDataInited});
    }

    /**
     * 
     * @param data 
     */
    public updatePlayerData(data){
        var oldexp:number = this.playerData.exp;
        var oldLevel:number = this.playerData.level;
        var oldGold:number = this.playerData.gold;
        var oldRedPacket:number = this.playerData.redPacket;
        this.playerData.parse(data);
        console.log(data)
        MSG.emit(MessageConst.Player_Data_Change);
    }

    /**
     * 
     * @param data 
     */
    public updatePlayerData_v1(data){
        var oldGold:number = this.playerData.RoleData.gold;
        var oldMaxScore:number = this.playerData.RoleData.maxScore;
        var oldTrophy: number = this.playerData.RoleData.trophy;
        data.reconnectTime=this.getServerTime();
        this.playerData.parse(data);
        
        console.log(data);
        console.log("gold"+ this.playerData.RoleData.gold);
        console.log("MaxScore"+ this.playerData.RoleData.maxScore);
        MSG.emit(MessageConst.Player_Data_Change_v1);
        this.setPlayerDataToLocal();
    }

    /**
     * @param data
     */
    public updateRushBossData(data){
        this.playerData.praseRushBossData(data);
        var reconnectTime=this.getServerTime();
        this.playerData.parse({"reconnectTime":reconnectTime});
        this.setPlayerDataToLocal();
    }
    

    public getExpProgress():number{
        var nowLevel:number = this.playerData.level;
        var nowExp:number = this.playerData.exp;
        var needExp:number = CFG.getCfgDataById(ConfigConst.LEVEL,nowLevel.toString())["need_exp"];
        var pro:number = nowExp / needExp;
        if(isNaN(pro)) {
            pro = 0;
        }
        if(pro > 1)
        {
            pro = 1;
        }
        if(pro < 0){
            pro = 0;
        }
        console.log('当前经验',nowExp, pro);
        return pro;
    }

    //更新用户数据：from app
    public onUserBaseChanged(data){
        GAME.updatePlayerData(data);
    }

    public isCanUpgradeByGold():boolean
    {
        let config = CFG.getCfgDataById(ConfigConst.LEVEL,GAME.playerData.level.toString());
        if(config==null ||config==undefined)
        {
            return false;
        }
        if(config.need_gold>GAME.playerData.gold)
        {
            return false;
        }
        if(config.need_exp>GAME.playerData.exp)
        {
            return false;
        }
        return true;
    }
    /**用户等级升级 */
    public userLevelUp(data){
        console.log('game.userLevelUp')
        console.log(data)
        this.userLevelUpNotifyData = data;
        if (data.level == 2){
            DottingUtil.bi_normalFun(BIActionConst.kActName_CusLevelUp_v2,null);
        }
        var userLevel = data.level
        GAME.updatePlayerData({level:userLevel});
        MSG.emit(MessageConst.kUserLevelUp ,{level:userLevel});
    }

    public checkUserLevelUpNotify(){
        if (this.userLevelUpNotifyData){
            var userLevel = this.userLevelUpNotifyData.level
            MSG.emit(MessageConst.kUserLevelUp ,{level:userLevel});
            this.userLevelUpNotifyData = null;
        }
    }

    private _preTraceTime:number =-1;
    private _totalTime:number = 0;
    public loadingTimeTrace(step:string){
        var delta;
        var  nowTime:number = new Date().getTime();
        if(this._preTraceTime<0){
            delta = nowTime - window["loadingStartTime"];
        }else{
            delta = nowTime - this._preTraceTime;
        }
        this._totalTime += delta;
        this._preTraceTime = nowTime;
        Log.debug("[loadingTime tarce]:"+ step +",dt:",delta,",total:",this._totalTime);
        
    }

    public isNewPalyer:boolean = false;
    public pushSwitchData( data:any ) {
        this.isNewPalyer = true;
    }
    // 是否是新用户
    public isPlayerNewUser():boolean{
        if (window['isnew'] == 0){
            return true;
        }
        return false;
    }
    private sendWXRankUserLevel(userLevelVal: number, uid)
    {
        userLevelVal = NumberUtil.toInt(userLevelVal);
        let storeDataOnWx = window["setWXUserCloudStorage"];
        if (storeDataOnWx != undefined) {
            storeDataOnWx({level: userLevelVal, uid: uid});
        } else {
            Log.error("storeDataOnWx is not define!");
        }
    }

    public initAbTestData(data){
        console.log('initAbTestData');
        console.log(data);
        if(data.AbTestInfo){
            for(let k in data.AbTestInfo){
                let info = data.AbTestInfo[k];
                if (info){
                    var testId = info.testId ;
                    var actionKey = BIActionConst.kActName_CusAbtest + '_' + testId;
                    let biData = {};
                    biData['kABTestInfo'] = info;
                    for (let key in info){
                        biData[String(key)] = info[key] ? info[key] :'';
                    }
                    DottingUtil.bi_normalFun(actionKey,biData)
                    if (testId == 102){
                        //102默认设置为a
                        if (info.type ){
                            this._abTestSwitchData[testId] =   String(info.type) ;
                        }else{
                            this._abTestSwitchData[testId] = 'a';
                        }
                    }else{
                        if (info.type){
                            this._abTestSwitchData[testId] = String(info.type) ;
                        }else{
                            this._abTestSwitchData[testId] = '';
                        }
                      
                    }
                }
                if(info.testId == 101){
                    this._guideAbTest = info.type;
                }else if(info.testId == 102){
                    if (info.type ){
                        this._mainViewAbTest = info.type;
                    }else{
                        this._mainViewAbTest = 'a';
                    }
                }
            }
            console.log('ABtestSwitchData')
            console.log(this._abTestSwitchData);
        }
    }

    public setPlayerDataToLocal(){
        let data={
            "RoleData":this.playerData.RoleData,
            "connectUpperGame":this.playerData.RushBossData,
        }
        
        localStorage.setItem("playerData",JSON.stringify(data));
        var msg=localStorage.getItem("playerData");
        console.log("playerDataLocalStorage",msg);
    }
    
    public initAbTestData_v1(data){
        console.log('initAbTestData');
        console.log(data);
        if(data){
            for(let k in data){
                let info = data[k];
                if (info){
                    var testId = info.testId ;
                    var actionKey = BIActionConst.kActName_CusAbtest + '_' + testId;
                    let biData = {};
                    biData['kABTestInfo'] = info;
                    for (let key in info){
                        biData[String(key)] = info[key] ? info[key] :'';
                    }
                    DottingUtil.bi_normalFun(actionKey,biData)
                    if (info.testType){
                        this._abTestSwitchData[testId] = String(info.testType);
                    }
                }
            }
        }
        console.log('ABtestSwitchData')
        console.log(this._abTestSwitchData);
    }
}

export var GAME = GameData.getInstance();