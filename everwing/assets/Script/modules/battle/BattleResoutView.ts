import PopupBase from "../../component/PopupBase";
import {BM} from "./BattleManager";
import {KVData, wxOpenData, WxOpenDataKeys} from "../../WXOpenData/WxOpenData";
import NumberUtil from "../../utils/NumberUtil";
import {NET} from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import {GAME} from "../../model/GameData";
import {SOUND} from "../../manager/SoundManager";
import WXInterface, {WX_API} from "../share/WXInterface";
import {CFG} from "../../manager/ConfigManager";
import {AssetConst, ConfigConst} from "../../GameConst";
import DottingUtil, {BIActionConst} from "../../utils/DottingUtil";
import {LEVELMG} from "../level/LevelManager";
import {PANEL} from "../../manager/PanelManager";
import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import {Toast} from "../toast/Toast";
import MonsterMg from "../monsterMg/MonsterMg";


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
export default class BattleResoutView extends PopupBase {

    @property(cc.Label)
    score: cc.Label = null;
    @property(cc.Label)
    coins: cc.Label = null;
    @property(cc.Label)
    reason: cc.Label = null;
    @property(cc.Label)
    bossCup: cc.Label = null;
    @property(cc.Label)
    highScoreCup: cc.Label = null;
    @property(cc.Label)
    shareCup: cc.Label = null;
    @property(cc.Button)
    videoBtn: cc.Button = null;
    @property(cc.Button)
    shareBtn: cc.Button = null;
    @property(cc.Label) 
    bossNum:cc.Label=null;
    @property(cc.Label)
    highScore:cc.Label=null;

    private _score: number = 0;
    private _cup: number = 0;
    private _wxVideoId = "adunit-95a519153e57bb7e";
    private _configId = "51";
    private _videoNum: number = 0;
    private _shareNum: number = 0;
    private _dieReason: string = '';
    private _dieId: number = 0;
    private _bossScore:number=0;
    private _isShare:boolean=false;
    private _doubleGoldShareData=null;
    private _isOpenShare:boolean = false;
    private _shareTime:number=0;
    private _isShareId:string="90003";

    private static _instance: BattleResoutView = null;
    public static getInstance(): BattleResoutView {
        if (BattleResoutView._instance == null) {
            BattleResoutView._instance = new BattleResoutView();
        }
        return BattleResoutView._instance;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public onInit (data: any) {
        console.log('弹出结算面板');
        this._score = data.score;
        super.onInit(data);
        this.score.string = String(this._score).toString();
        this.coins.string = String(this._score).toString();
        this._cup = data.bossCup + data.highScoreCup + data.shareCup;
        this.bossCup.string = String(data.bossCup).toString();
        this.highScoreCup.string = String(data.highScoreCup).toString();
        this.shareCup.string = String(data.shareCup).toString();
        this.bossNum.string=String(LEVELMG.currentLevelData.chapter-1);
        if(this._score>GAME.playerData.RoleData.maxScore){
            this.highScore.string=String(this._score);
        }else{
            this.highScore.string=String(GAME.playerData.RoleData.maxScore);
        }
        
        this._bossScore=data.bossScore;
        if(data.reason)
        {
            // this.reason.string = data.reason;
            console.log("死亡原因:"+data.reason+' '+data.dieReasonId);
            this._dieReason = data.reason;
            this._dieId = data.dieReasonId;
        }
        this._shareNum = data.shareNum;
        cc.audioEngine.pauseAll();
        SOUND.playEverwingOverMusic();
        // if (data.isnewUser) {
        //     this.videoBtn.node.active = false;
        // } else {
        //     this.videoBtn.node.active = true;
        // }
        this.videoBtn.node.active = true;
        this.videoBtn.interactable=true;
 

        var isshare=CFG.getCfgDataById(ConfigConst.CONSTANT,this._isShareId);
        if(isshare&&isshare["parm1"]==0){
            this._isShare=true;
            this.shareBtn.node.active=true;
            this.videoBtn.node.active=false;
        }else{
            this._isShare=false;
            this.shareBtn.node.active=false;
            this.videoBtn.node.active=true;
        }

    }    

    onEnable(){
        cc.director.on('appOnShow', this.appWillOnShow, this);
        cc.director.on('appOnHide', this.appWillOnHide, this);
        if(this._isShare){
            let shareData = WX_API.getShareInfoData(WXInterface.shareType_ShowShare);
            this._doubleGoldShareData = shareData;
            DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessagePre ,{type:shareData['id']});
        }
     
        //金币数量、得分、奖杯数量、分享次数、视频次数、关卡进度、死亡类型（小怪碰撞、boss攻击、导弹攻击）,游戏开始时间和打点时间
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 5,
            stepName: '弹出结算面板',
            gold: this.coins.string,
            score: this.score.string,
            trophy: this._cup,
            gameStartTime: BM._startGameTime,
            gameEndTime: new Date().getTime(),
            shareNum: this._shareNum,
            videoNum: this._videoNum,
            checkPoint: LEVELMG.currentLevelData.chapter,
            dieId: this._dieId,
            dieType: this._dieReason
        });
    }

    onDisable(){
        cc.director.off('appOnShow', this.appWillOnShow, this);
        cc.director.off('appOnHide', this.appWillOnHide, this);
        this._doubleGoldShareData=null;
    }

    private appWillOnShow(){
        console.log('监听 appWillOnShow');
        let nowtime=new Date().getTime();
        let sharetime=nowtime-this._shareTime;
        console.log(sharetime);
        if (this._isOpenShare){
            if (sharetime >= 2000) {
                Toast.showToast("分享成功",1.5,0);
                this.doubleGold();
            }else{
                Toast.showToast("请分享到不同的群",1.5,0);
            }
            
        }
    }
    private appWillOnHide(){
        console.log('监听 appWillOnHide');
        this._shareTime=new Date().getTime();
    }

    public onSure () {
        console.log('点击好的');
        BM.exitBattle();
        let highScore = GAME.playerData.RoleData.maxScore;
        if (highScore < this._score) {
            let data: KVData = {key: WxOpenDataKeys.Score, value: this._score.toString()};
            wxOpenData.wxSetUserCloudStorage([data]);
        }
        let score = this.score.string; 
        let gold = this.coins.string;
        // let resGold;
        // let Config = CFG.getCfgDataById(ConfigConst.BULLET,"100"+(5-GAME.playerData.RoleData.guideTimes));
        // if(GAME.playerData.RoleData.guideTimes>0){
        //     resGold = Number(gold)+Number(Config.cost_coin);
        // }else{
        //     resGold = gold; 
        // }
    //    console.log('之前的金币数', GAME.playerData.RoleData.gold);
    //    console.log('发送的金币数',gold);
    // console.log('bossId:'+ LEVELMG.currentLevelData.levelBossId);
        // let bossId = LEVELMG.currentLevelData.levelBossId;
        let chapterId = LEVELMG.currentLevelData.chapter;
        let endGameTime = new Date().getTime();
        // console.log("startTime:"+BM._startGameTime);
        // console.log("endTime:"+endGameTime);
        // console.log('关卡：'+LEVELMG.currentLevelData.chapter);
       //完成单局游戏打点
        //    console.log("子弹等级:"+GAME.playerData.RoleData.bullet);
        //金币数量、得分、奖杯数量、分享次数、视频次数、关卡进度、死亡类型（小怪碰撞、boss攻击、导弹攻击）,游戏开始时间和打点时间
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 8, stepName: '点击好的按钮打点',
            gold: gold, score: score,
            bulletRank: GAME.playerData.RoleData.bullet,
            trophy: this._cup,
            gameStartTime: BM._startGameTime,
            gameEndTime: endGameTime,
            shareNum: this._shareNum,
            videoNum: this._videoNum,
            checkPoint: chapterId,
            dieId: this._dieId,
            dieType: this._dieReason,
            wave: MonsterMg.getInstance().wave,
            lastMonster: MonsterMg.getInstance().lastMonster
        });
        DottingUtil.bi_normalFun(BIActionConst.kActName_DoTask, { taskid: chapterId, progress: 0, virtue: score });
        
        if(GAME._userGuideStep=="5"||GAME._userGuideStep=="7"||GAME._userGuideStep=="10"){
            DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid: GAME._userGuideStep+".1",abTest:GAME._abTestSwitchData["10008"]});
        }
        this.updatePlayerData();
        NET.send(NetConst.SaveLevelData, {
            "gold": gold,
            "bossId": LEVELMG.lastBossId,
            "exp": 0,
            "score": score,
            "energyNum": 0,
            "trophy": this._cup,
            "checkpointId": chapterId,
            "bossScore":this._bossScore
        }, (data) => {

            if (data) {
                console.log(data);
                // console.log('服务器返回的金币数',data.gold);            
                GAME.updatePlayerData_v1(data.playerInfo);
                // if(GAME.playerData.RoleData.guideTimes>0 && GAME.playerData.RoleData.bullet < 5 ){
                //     Toast.showToast('完成第'+String(4-GAME.playerData.RoleData.guideTimes)+'次挑战，获得金币'+String(Config.cost_coin),2);
                // }
            }
            //重置
            this._videoNum = 0;


        }, this);
        this.showViews();
        MSG.emit(MessageConst.hidePause);
}

    public onSeeView () {
        console.log('点击看视频');
        //点击看视频打点
        let endTime = new Date().getTime();
        //金币数量、得分、奖杯数量、分享次数、视频次数、关卡进度、死亡类型（小怪碰撞、boss攻击、导弹攻击）,游戏开始时间和打点时间
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 6,
            stepName: '点击看视频按钮',
            gold: this.coins.string,
            score: this.score.string,
            trophy: this._cup,
            gameStartTime: BM._startGameTime,
            gameEndTime: endTime,
            shareNum: this._shareNum,
            videoNum: this._videoNum,
            checkPoint: LEVELMG.currentLevelData.chapter,
            dieId: this._dieId,
            dieType: this._dieReason
        });

        let cfg = CFG.getCfgDataById(ConfigConst.SHARE,this._configId);
        let Id = cfg['id'];
        console.log('配置id',Id);
        let highScore = GAME.playerData.RoleData.maxScore;
        let score = this.score.string; 
        if (NumberUtil.toInt(highScore) < this._score) {
            let data: KVData = {key: WxOpenDataKeys.Score, value: this._score.toString()};
            wxOpenData.wxSetUserCloudStorage([data]);
        }
        
        WX_API.showVideoAd(Id, this.doubleGold.bind(this),this.failDoubleGold.bind(this),"",this._wxVideoId);
    }

    public onShare () {
        console.log('点击分享');
        //点击分享打点
        let endTime = new Date().getTime();
        //金币数量、得分、奖杯数量、分享次数、视频次数、关卡进度、死亡类型（小怪碰撞、boss攻击、导弹攻击）,游戏开始时间和打点时间
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 3,
            stepName: '点击分享按钮',
            gold: this.coins.string,
            score: this.score.string,
            trophy: this._cup,
            gameStartTime: BM._startGameTime,
            gameEndTime: endTime,
            shareNum: this._shareNum,
            videoNum: this._videoNum,
            checkPoint: LEVELMG.currentLevelData.chapter,
            dieId: this._dieId,
            dieType: this._dieReason
        });

        let cfg = CFG.getCfgDataById(ConfigConst.SHARE,this._configId);
        let Id = cfg['id'];
        console.log('配置id',Id);
        let highScore = GAME.playerData.RoleData.maxScore;
        let score = this.score.string; 
        if (NumberUtil.toInt(highScore) < this._score) {
            let data: KVData = {key: WxOpenDataKeys.Score, value: this._score.toString()};
            wxOpenData.wxSetUserCloudStorage([data]);
        }
        
        if (window['socialType'] == 1){
            //wxchat
            let __self = this;
            WX_API.shareByCfg_v1( this._doubleGoldShareData,"",
            (shareData:any,shareId:string,shareToType:number)=>{
                __self._isOpenShare = true;
                console.log('shareOpenCallback',shareData,shareId,shareToType);
                
            },(res, shareId, isSuccess, resEncryptedData)=>{
                console.log('shareFinishCallback',res,shareId,isSuccess,resEncryptedData);
            },this);
        }else{
            //web
            this.doubleGold();
        }
    }

    public doubleGold(){
        //看视频次数加一
        this._videoNum = this._videoNum + 1;
        let gold = this.coins.string;
        let doubleGold =Number(gold)*2;
        this.coins.string = String(doubleGold);
        this.videoBtn.interactable = false;

        //看视频加倍成功打点
        let endTime = new Date().getTime();
        //金币数量、得分、奖杯数量、分享次数、视频次数、关卡进度、死亡类型（小怪碰撞、boss攻击、导弹攻击）,游戏开始时间和打点时间
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 7,
            stepName: '看视频成功打点',
            gold: this.coins.string,
            score: this.score.string,
            trophy: this._cup,
            gameStartTime: BM._startGameTime,
            gameEndTime: endTime,
            shareNum: this._shareNum,
            videoNum: this._videoNum,
            checkPoint: LEVELMG.currentLevelData.chapter,
            dieId: this._dieId,
            dieType: this._dieReason
        });
    }

    public failDoubleGold(){
        
    }

    protected panelMaskTouch(e){
        return;
    }

    /**
     * 结算
     */
    // public battleResout(score:number,gold:number,cup:number,dieId:number,dieReason:number){
    //     BM.exitBattle();

    //     let highScore = GAME.playerData.RoleData.maxScore;
    //     if (highScore < score) {
    //         let data: KVData = {key: WxOpenDataKeys.Score, value: score.toString()};
    //         wxOpenData.wxSetUserCloudStorage([data]);
    //     }
    //     let chapterId = LEVELMG.currentLevelData.chapter;
    //     let endGameTime = new Date().getTime();
    //    //完成单局游戏打点
    //    //金币数量、得分、奖杯数量、分享次数、视频次数、关卡进度、死亡类型（小怪碰撞、boss攻击、导弹攻击）
    //     DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
    //         stepName:"noView",
    //         gold: gold, score: score,
    //         "trophy": cup,
    //         gameStartTime: BM._startGameTime,
    //         gameEndTime: endGameTime,
    //         checkPoint: chapterId,
    //         dieId: dieId,
    //         dieType: dieReason,
    //         wave: MonsterMg.getInstance().wave,
    //         lastMonster: MonsterMg.getInstance().lastMonster
    //     });
    //     DottingUtil.bi_normalFun(BIActionConst.kActName_DoTask, { taskid: chapterId, progress: 0, virtue: score });
    //     NET.send(NetConst.SaveLevelData, { "gold": gold, "bossId": 1, "exp": 1, "score": score, "energyNum": 1, "trophy": cup , "checkpointId": chapterId}, (data) => {
    //         if (data) {
    //             console.log(data);
    //             // console.log('服务器返回的金币数',data.gold);
    //             GAME.updatePlayerData_v1(data.playerInfo);
    //         }
    //     }, this)

    //     this.showViews();

    // }

    /**
     * 展现子弹升级、再来一次界面
     */
    private showViews() {
        
        cc.audioEngine.pauseAll();
        SOUND.playEverwingMeunMusic();
        WX_API.bannerShow();
        WX_API.gameClubShow();
        //根据guideTimes判断是否弹子弹升级界面
        //let Config = CFG.getCfgDataById(ConfigConst.BULLET, "100" + String(GAME.playerData.RoleData.bullet));
        let levelData=CFG.getCfgByKey(ConfigConst.RANK,"level",GAME.playerData.RoleData.level);
        let nextLevelData=CFG.getCfgByKey(ConfigConst.RANK,"level",GAME.playerData.RoleData.level+1);
        var guideStep = GAME.playerData.RoleData.guideStep;
        if (guideStep < 2) {
            PANEL.showSinglePopUp(AssetConst.BulletUpgradeView, {"isguide": true});
        } else if(nextLevelData.length>0&&levelData.length>0&&(GAME.playerData.RoleData.exp>=levelData[0].score)){
            //MSG.emit(MessageConst.ShowReStart);
            MSG.emit(MessageConst.showUpLevel, {"gold": levelData[0]["coin"], "exp": levelData[0]["score"]});
        }
        // else{
        //     MSG.emit(MessageConst.RankGuide);
        // }

        this.closePanel();
    }
    // update (dt) {}

    //更新数据
    private updatePlayerData(){
        let nowChapter=LEVELMG.currentLevelData.chapter;
        let lastChapter=GAME.playerData.RoleData.checkpointId;
        var conntentData={};
        let num:number=0;
        if(nowChapter>lastChapter&&LEVELMG.lastBossId!=0){
            conntentData["bossId"] = LEVELMG.lastBossId;
        }
        if(this._bossScore>GAME.playerData.RushBossData.lashScore){
            num++;
            conntentData["lashScore"]=this._bossScore;
        }
        if(num){
            GAME.updateRushBossData(conntentData);
        }
        var roleData = GAME.playerData.RoleData;
        roleData.gold += Number(this.coins.string);
        roleData.exp += Number(this.score.string);
        roleData.bossId = LEVELMG.lastBossId;
        //this.score分数取最大分  trophy累加  checkpointId最大
        if(roleData.maxScore<Number(this.score.string)){
            roleData.maxScore=Number(this.score.string);
        }
        if(roleData.checkpointId<LEVELMG.currentLevelData.chapter){
            roleData.checkpointId = LEVELMG.currentLevelData.chapter;
        }
        roleData.totalScore+=Number(this.score.string);
        roleData.trophy+=this._cup;
        roleData.gameNumber++; 
        GAME.updatePlayerData_v1(roleData);
        
    }
}
