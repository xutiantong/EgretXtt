import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import PanelManager, { PANEL } from "../../manager/PanelManager";
import {POOL} from "../../manager/PoolManager";
import {AssetConst, ConfigConst, ZERO} from "../../GameConst";
import {GAME} from "../../model/GameData";
import {Toast} from "../toast/Toast";
import SideTips from "./SideTips";

import {BGMG} from "../bg/BgManager";
import {BATTLEDATA, GameState, RushType} from "../../model/BattleData";
import {MONSTMG} from "../monsterMg/MonsterMg";
import {LEVELMG} from "../level/LevelManager";

import MainRole from "./MainRole";
import {SOUND, SoundConst} from "../../manager/SoundManager";
import {CFG} from "../../manager/ConfigManager";
import PrefabBase from "../../component/PrefabBase";
import {ROCKET} from "../rocket/RocketManager";
import {NET} from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";

import {EmMonsterType} from "./Monster/MonsterBase";
import NewBulletItem from "./NewBulletItem";
import Timer from "./Monster/Timer";

export const willBeEliteNum: number = 10;//杀多少出精英怪

export const laserCfg = {
    duration: 2560,
    damage: 1500,
    hitInterval: 64
};

export default class BattleManager extends cc.Component {
    private static _instance: BattleManager = null;
    public static getInstance(): BattleManager {
        if (BattleManager._instance == null) {
            BattleManager._instance = new BattleManager();
        }
        return BattleManager._instance;
    }
    private _battleNode:cc.Node = null;
    private _mainRoleNode:cc.Node = null;
    public isBossAcitve:boolean = true;
    //laser
    public laserTimer:Timer = new Timer();
    public bullets: NewBulletItem[] = [];

    public get mainRoleNode() : cc.Node {
        return this._mainRoleNode;
    }

    
    public get battleNode() : cc.Node {
        return this._battleNode;
    }
    
    
    private map:{[key:number] : number} = {};

    /**
     * 打到boss处分数
     */
    public bossScore:number=0;

    /**
     * 击杀怪物数量 用于判定精英怪
     */
    // private _curKillMonsterInitEliteNum: number = 0;
    // private _curInitEliteState: boolean = false;
    /**
     * 击杀怪物计数器
     */

    // private _numKillMonster: number = 0;B
    // private _numKillMonsterMax: number = 100;
    // private _scoreNum: number = 0;

    // public StateGame:GameState;
    // private _wave: number = 0;//波数
    // private _chapter: number = 0;//关卡
    // private _chapterCfg: any = null;//关卡配置

    // private _gameStartTime:number = 0;
    // private _bossState:number = 0;
    // private _rushType:number = 0;//加速类型
    // private _initEnd:boolean = false;

    private _bossCupNum: number = 0;            // 奖杯数量 击杀boss
    private _highScoreCupNum: number = 0;       // 奖杯数量 新纪录
    private _shareCupNum: number = 0;           // 奖杯数量 分享

    private _shareNum: number = 0;//记录分享复活次数
    public _startGameTime: number = 0;//开始游戏时间

    private _rushToBoss:number=0;//冲刺到上次打死的boss

    private _rushTime: number = 0; //冲刺时间

    private preLoadCount: number = 0; //预加载个数
    //触摸状态,正常为0，复活界面为1
    // public _touchStatus:number=0;

    /**
     * 初始化battle
     */
 
    public initBattle() {
       let cfgData =  CFG.getCfgDataById(ConfigConst.MESSAGE,String(LEVELMG.currentChapter ));
       if (cfgData &&  cfgData.message){
             Toast.showToast(cfgData.message,5);
       }
       
        this.RegisgterNode();
        this.RegisterEvent();
        this.StartBattle();
    }
    /**
     * 注册节点
     */
    public RegisgterNode()
    {
        //注册背景节点
        BGMG.regisgterNode();
        this._battleNode = PANEL.panelHolder.battleLayer;
        //注册怪物节点
        MONSTMG.regisgterNode();
    }
    /**
     * 注册事件
     */
    public RegisterEvent()
    {
        
        //玩家死亡
        MSG.on(MessageConst.PlayerDied,this.PlayerDied,this);
        //玩家复活
        MSG.on(MessageConst.PlayerRevive,this.PlayerRevive,this);
        
        /** 游戏结束*/
        MSG.on(MessageConst.GameOver,this.FinishBattle,this);
        /**
         * 击杀怪物事件
         */
        MSG.on(MessageConst.KillMonster,this.onKillMonster,this);

        MSG.on(MessageConst.RushAddSpeed, this.startRushState, this);
        MSG.on('CurrentChapterPass',this.chapterPassAction,this);
    }
    /**
     * 注册事件
     */
    public UnRegisterEvent()
    {

        MSG.off(MessageConst.PlayerDied,this.PlayerDied,this);
        MSG.off(MessageConst.PlayerRevive,this.PlayerRevive,this);
        /**
         * 游戏结束
         */
        MSG.off(MessageConst.GameOver,this.FinishBattle,this);
        /**
         * 击杀怪物事件
         */
        MSG.off(MessageConst.KillMonster,this.onKillMonster,this);

        MSG.off(MessageConst.RushAddSpeed, this.startRushState, this);
        MSG.off('CurrentChapterPass',this.chapterPassAction,this);
        this.unscheduleAllCallbacks();
    }

    /**
     * 进入游戏状态
     */
    public StartBattle()
    {
        console.log('开始游戏');
        this.RushToBoss();
        this._startGameTime = new Date().getTime();
        BATTLEDATA._initEnd = false;
        
        BATTLEDATA.StateGame = GameState.Battle;
        BATTLEDATA._rushType = RushType.Rush_None;
        BATTLEDATA._wave = 0;
        BGMG.startBattleBack(
            ()=>{
                PANEL.playCloudClose();
            });
        this.initPalyer();
        
        // this.initMonster();
        // 开启怪物产出循环
        //this.proloadMonster();
        MONSTMG.startMonstLoop();
        BATTLEDATA._gameStartTime = GAME.getServerTime();
    }
    /**
     * 重新开始游戏
     */
    public Restart()
    {
        // BATTLEDATA._chapter = 1;
        LEVELMG.clearLevelData();
        LEVELMG.chooseCurrentChapter(1,()=>{
            this.StartBattle();
        })
  
    }

    /**
     * 重新开始游戏
     */
    public EntryNextChapter()
    {
        
    }

    public exitBattle () {
 
        BGMG.cleanBattleBack();
        if (this._battleNode) {
            this._battleNode.removeAllChildren();
        }
        MONSTMG.cleanMonsters();
        MONSTMG.exitBattle();
        MSG.emit(MessageConst.ExitBattle);

       this.UnRegisterEvent();
    }



    private triggerRush() {
        if (this._mainRoleNode == null /* || this._bg2Node == null */) {
            return;
        } else {
            BATTLEDATA._initEnd = true;
        }
        if (BATTLEDATA._rushType != RushType.Rush_None) {
            return;
        }

        //复活加音效
        if(this._mainRoleNode&&this._mainRoleNode.getComponent(MainRole)._numDead!=0){
            SOUND.playRushSound();
        }

        PANEL.panelHolder.cloudNode.setPosition( cc.p(0,0) );
        PANEL.panelHolder.cloudNode.opacity = 255;
        PANEL.panelHolder.cloudNode.active = true;
        PANEL.panelHolder.cloudNode.runAction( cc.sequence( cc.moveTo( 10, cc.p(0,-2000)), cc.fadeOut(0.1) ) );

        MSG.emit( MessageConst.RushAddSpeed, {type:RushType.Rush_Start} );


    }

    private startRushState(e) {
        if (e.detail.type == undefined || e.detail.type == 0) {
            return;
        }
        if(BATTLEDATA._rushType == RushType.Rush_Boss){
            return;
        }
        BATTLEDATA._rushType = e.detail.type;
        BATTLEDATA._unableCrtMonster = false;
        let sch = cc.director.getScheduler();
        sch.setTimeScale(5.0);
        this._rushTime =4;
        this.isBossAcitve = false;
        if (BATTLEDATA._rushType == RushType.Rush_Start) {
            if (BATTLEDATA._bossState == 1){
                //正在打boss
                this._rushTime = 4;
                sch.setTimeScale(1.0);
            }else{
                this._rushTime = 3;
            }
          
        }else if (BATTLEDATA._rushType == RushType.Rush_Invincible) {
            this._rushTime = 2;
            SideTips.ShowSideTips("移动效果","无敌冲刺","ui/common1/chongci");
            SOUND.playRushSound();
            // if(e.detail.rushtoboss){
            //     this.unschedule(this.endRushState);
            // }
        }else if (BATTLEDATA._rushType == RushType.Rush_Boss) {
            this._rushTime = 6;
            BATTLEDATA._wave = LEVELMG.currentLevelData.totalWave-1;
            if(e.detail["bossId"]!=undefined){
                LEVELMG.setBossID(e.detail["bossId"]);
            }
            //MSG.emit(MessageConst.addMagnet);
        }
        // this.unschedule(this.unableCreateMonster);
        // this.unschedule(this.endRushState);
        //this.scheduleOnce( this.unableCreateMonster.bind(this), durTime - 5 );//冲刺解说前3秒 不出现怪物
        //this.scheduleOnce( this.endRushState.bind(this), durTime);

    }

    private unableCreateMonster() {
        BATTLEDATA._unableCrtMonster = true;
    }

    //好友助战面板开着时，冲刺暂停
    public friendFrightShowing:boolean=false;
    //暂停按钮
    public pauseBtnStatus:boolean = false;
    //看视频暂停
    public gameBtnPause:boolean = false;

    private endRushState() {
        console.log("endrushstate", BATTLEDATA._rushType);
        this.isBossAcitve = true;
        BATTLEDATA._unableCrtMonster = false;
        let sch = cc.director.getScheduler();
        sch.setTimeScale(1.0);

        MSG.emit(MessageConst.MonsterDeath, {idx:-1});
        BATTLEDATA._rushType = RushType.Rush_None;
        MSG.emit( MessageConst.RushAddSpeed, {type:RushType.Rush_None} );
    }



    private initPalyer() {
        POOL.getPrefabFromPool(AssetConst.MainRole,(node:cc.Node)=>{
            
            this._mainRoleNode = node;
            this._mainRoleNode.parent = this._battleNode;
            let tempRole:MainRole = this._mainRoleNode.getComponent(MainRole);
            tempRole.playerNode.active = true;
            this._mainRoleNode.setPosition( cc.v2(0, -430) );
            this.triggerRush();
            ROCKET.init(this._battleNode, this._mainRoleNode);
        });
      
    }
    /**
     * 清理玩家
     */
    private clearPlayer()
    {
        POOL.putPrefabToPool(this._mainRoleNode);
    }

    /**
     * 获取玩家node的position
     */
    public getMainRoleNodePos () {
        if (this._mainRoleNode) {
            return this._mainRoleNode.parent.convertToWorldSpaceAR(this._mainRoleNode.position);
        }
        return ZERO;
    }
  
    /**
     * 清理怪物
     */
    private clearNode(nd:cc.Node)
    {
        if(nd)
        {
            let count:number = nd.children.length;
            for (let index = 0; index < count; index++) {
                let element = nd.children[index];
                if(element)
                {
                    element.destroy();
                }
            }
        }
    }


    public update(dt:number)
    {
        this.doPreload();
        if(this._rushTime >0.01&&(!this.friendFrightShowing)&&(!this.pauseBtnStatus)&&(!this.gameBtnPause)){
            this._rushTime -= dt;///cc.director.getScheduler().getTimeScale();
            if(this._rushTime<=0.01){
                this.endRushState();
            }
        }
        MONSTMG.updateDt(dt);

        //激光
        if(this.laserTimer.isActive()){
            this.laserTimer.step(dt * 1000);
            this.laserTimer.isActive()|| this.onLaserFinish()
        }
    }
    //判断是否显示精英怪
    public judgeInitEliteMonster () {
        if (BATTLEDATA._curInitEliteState == false) {
            ++BATTLEDATA._curKillMonsterInitEliteNum;
            if (BATTLEDATA._curKillMonsterInitEliteNum > willBeEliteNum) {
                BATTLEDATA._curKillMonsterInitEliteNum = 0;
                BATTLEDATA._curInitEliteState = true;
                MONSTMG.initMonsterElite();
            }
        }
    }
    /** 重置精英怪击杀数量*/
    public resetKillMonsterNum () {
        BATTLEDATA._curInitEliteState = false;
        BATTLEDATA._curKillMonsterInitEliteNum = 0;
        BATTLEDATA._numKillMonster=0;
    }
    
    //玩家死亡
    private PlayerDied(evt){
    
        this._mainRoleNode.active= false;
        BATTLEDATA.StateGame = GameState.PalyerDied;
        this.map={};
    }
    //玩家复活
    private PlayerRevive(evt){
   
        this._mainRoleNode.setPosition( cc.v2(0, -430) );
        this._mainRoleNode.getComponent(MainRole).playerNode.active = true;
        this._mainRoleNode.active= true ;
        //设置冲刺
        //this.triggerRush();
        this.removeAllBullet();
        this.onLaser(2.5);

        BATTLEDATA.StateGame = GameState.Battle;
        // 分享复活后奖励奖杯
        this._shareCupNum  = 5;

        //分享复活次数加一
        this._shareNum = this._shareNum + 1;

    }
    /**
     * 结束战斗
     * @param evt 
     */
    private FinishBattle(evt)
    {
        if(BATTLEDATA.StateGame == GameState.Finish)
        {
            return;
        }
        BATTLEDATA._bossState = 0;
        //this.ResetRole();
        MONSTMG.clearMonstNode();
        this.clearBulletPool();
        this.clearNode(this._battleNode);
        this.resetKillMonsterNum();
        BATTLEDATA.StateGame = GameState.Finish;
        if(evt.detail)
        {
            console.log('dieId:' + evt.detail.id);
            if (GAME.playerData.RoleData.checkpointId < 3 && LEVELMG.currentLevelData.chapter < 3) {
                //todo 跳转到结算界面

                PANEL.showSinglePopUp(AssetConst.BattleResoutView, {
                    score: BATTLEDATA._scoreNum,
                    bossCup: this._bossCupNum,
                    highScoreCup: this._highScoreCupNum,
                    shareCup: this._shareCupNum,
                    dieReasonId: evt.detail.id,
                    reason: evt.detail.reason,
                    shareNum: this._shareNum,
                    isnewUser: true,
                    bossScore:this.bossScore
                });

                //调用结算方法
                //BattleResoutView.getInstance().battleResout(BATTLEDATA._scoreNum,BATTLEDATA._scoreNum,this._bossCupNum + this._highScoreCupNum + this._shareCupNum,evt.detail.id,evt.detail.reason);
            } else {
                //todo 跳转到结算界面

                PANEL.showSinglePopUp(AssetConst.BattleResoutView, {
                    score: BATTLEDATA._scoreNum,
                    bossCup: this._bossCupNum,
                    highScoreCup: this._highScoreCupNum,
                    shareCup: this._shareCupNum,
                    dieReasonId: evt.detail.id,
                    reason: evt.detail.reason,
                    shareNum: this._shareNum,
                    isnewUser: false,
                    bossScore:this.bossScore
                });
            }

            // if(evt.detail.result=="success")
            // {
            //     //Toast.showToast("恭喜通关！");
            //     //todo 跳转到结算界面


            //     PANEL.showSinglePopUp(AssetConst.BattleResoutView, {score:BATTLEDATA._scoreNum, bossCup:this._bossCupNum, highScoreCup:this._highScoreCupNum, shareCup: this._shareCupNum,dieReasonId:evt.detail.id, reason:evt.detail.reason, shareNum:this._shareNum});

            // }
            // else if(evt.detail.result=="fail")
            // {
            //     //跳转到重新开始界面

            //     PANEL.showSinglePopUp(AssetConst.BattleResoutView, {score:BATTLEDATA._scoreNum, bossCup:this._bossCupNum, highScoreCup:this._highScoreCupNum, shareCup: this._shareCupNum,dieReasonId:evt.detail.id,  reason:evt.detail.reason, shareNum:this._shareNum});


            // }
        }
        this.resetData();
    }
    /**
     * 击杀怪物
     * @param evt 
     */
    private onKillMonster(evt)
    {
        if(evt.detail)
        {   
            // console.log("击杀怪物"+evt.detail.currentWave);
            // console.log("击杀类型"+evt.detail.mosterType);
            if (evt.detail.mosterType == EmMonsterType.Normal){
                if(this.map[evt.detail.currentWave]==null||this.map[evt.detail.currentWave]==undefined){
                    this.map[evt.detail.currentWave]=0;
                }else{
                    this.map[evt.detail.currentWave] = this.map[evt.detail.currentWave]+1;
                }
           
                if(this.map[evt.detail.currentWave]== 4){
                    SideTips.ShowSideTips("一波清场","金币+2","img/common/jinbi");
                    MSG.emit(MessageConst.AddRoundCoin,{num:2});
                    BM.changeScore(2);
                   
                    this.map={};
                }
                // console.log('map',this.map);
                // console.log('个数',this.map[evt.detail.currentWave]);
               // this.judgeInitEliteMonster();
            }
            if(BATTLEDATA._numKillMonster<BATTLEDATA._numKillMonsterMax)
            {
                BATTLEDATA._numKillMonster++;
            }
        }
    }

    public changeScore (score: number) {

        BATTLEDATA._scoreNum += score;
    }
    private resetScore (score: number) {
        BATTLEDATA._scoreNum = 0;

        BATTLEDATA._scoreNum += score;

        // 新纪录加奖杯
        let currHighScore = GAME.playerData.RoleData.maxScore;
        if (BATTLEDATA._scoreNum > currHighScore && this._highScoreCupNum == 0) {
            this._highScoreCupNum = 10;
        }
    }
    private resetData () {
        BATTLEDATA._scoreNum = 0;
        this._bossCupNum = 0;
        this._highScoreCupNum = 0;
        this._shareCupNum = 0;
        this._shareNum = 0;
        this._rushTime = 0;
        this.isBossAcitve = true;
    }

    public addCup (add: number) {
        console.log("addCup: ", add);
        this._bossCupNum += add;

    }

    public rushToBoss:boolean=false;
    //完成当前关卡
    public chapterPassAction(){
        //必须是在关卡完成时查询
        if ( LEVELMG.isFinishTotalChapter()) {
            //已经通关最后一关
            MSG.emit(MessageConst.GameOver,{result:"success",reason:"过关啦!"});
            return;
        }
        BATTLEDATA._CloudIsOpen = true;
        PANEL.playCloudOpen(this.doChangeChapter.bind(this));
        //如果进行了空间跨越，恢复小怪加载
        if(this.rushToBoss){
            this.rushToBoss=false;
            MONSTMG.startMonstLoop();
        }
    }

    private doChangeChapter(){
        //清空map数据
        this.map={};
        let __self = this;
        LEVELMG.initNextChapter(()=>{
            BGMG.chaperChangedForBg(()=>{
                // 清零当前怪物波数
                BATTLEDATA._wave = 0;
                //MONSTMG.clearMonstNode();
                BATTLEDATA._CloudIsOpen = false;
                PANEL.playCloudClose();
                BATTLEDATA._bossState = 0;
                let cfgData =  CFG.getCfgDataById(ConfigConst.MESSAGE,String(LEVELMG.currentChapter ));
                if (cfgData &&  cfgData.message){
                    Toast.showToast(cfgData.message,5);
                }
                this.preloadAfterLoginMap.push({Prefab: "guai/monster" + (LEVELMG.currentChapter + 1), count: 15})
                
            });
        });
    }

    public getBulletPrefabPath(bulletLevel: number) {
        return "prefabs/bullet/BulletItem" + bulletLevel.toString();
    }

    public getBulletNewPrefabPath() {
        return "prefabs/newbullet/BulletItemBase";
    }

    public preloadInitAfterLoginMap = [
        {Prefab: AssetConst.Warning, count: 1},
        {Prefab: AssetConst.EnemyBulletItem, count: 25},
        {Prefab:AssetConst.EnemyBulletTreeItem,count:5},
        {Prefab: AssetConst.MonsterBeHurt, count: 6},
        {Prefab: AssetConst.MonsterDie, count: 10},
        {Prefab:AssetConst.DropItem+"/drop108",count:1},
        {Prefab: AssetConst.DropItem + "/drop102", count: 1},
        {Prefab: AssetConst.DropItem + "/drop101", count: 10},
        {Prefab:AssetConst.DropItem+"/drop107",count:1},
        {Prefab: AssetConst.DropItem + "/drop1001", count: 2},
        {Prefab: AssetConst.DropItem + "/drop1002", count: 2},
        {Prefab: AssetConst.DropItem + "/drop1003", count: 2},
        {Prefab: AssetConst.DropItem + "/drop1004", count: 2},
        {Prefab:AssetConst.DropItem+"/drop106",count:1},
        {Prefab: AssetConst.EnemyBullet3Item, count: 5},
        {Prefab: AssetConst.SideTips, count: 2},
        {Prefab: AssetConst.AddNumItem + "/addNum1", count: 10},
        {Prefab: AssetConst.AddNumItem + "/addNum2", count: 2},
        {Prefab: AssetConst.AddNumItem + "/addNum5", count: 1},
        {Prefab: AssetConst.AddNumItem + "/addNum10", count: 1},
        {Prefab: AssetConst.EnemySuperBullet, count: 6},
        {Prefab: this.getBulletNewPrefabPath(), count: 16},
        {Prefab: AssetConst.MonsterItem, count: 15},
        {Prefab: AssetConst.MonsterItemBlink, count: 15},
        {Prefab: AssetConst.EnemyBullet4Item, count: 5},
        {Prefab: AssetConst.EnemyBullet3Item, count: 5},
        {Prefab: "guai/monster1", count: 15},
        {Prefab: "guai/monster2", count: 15},
        {Prefab: NewBulletItem.NewBulletPath + "1", count: 80},
        {Prefab: NewBulletItem.NewBulletPath + "2", count: 80},
        {Prefab: NewBulletItem.NewBulletPath + "3", count: 80},
        {Prefab: NewBulletItem.NewBulletPath + "4", count: 16},
        {Prefab: NewBulletItem.NewBulletPath + "5", count: 16},
    ];
    private preloadAfterLoginMap = [];
    public proloadMonster() {
        this.preloadAfterLoginMap = this.preloadInitAfterLoginMap.concat();
        this.preLoadCount = this.preloadAfterLoginMap.length;
        // for(let x in this.preloadAfterLoginMap){
        //     POOL.getPrefabFromPool(this.preloadAfterLoginMap[x].Prefab,(node:cc.Node)=>{
        //         if(node){
        //             let count = self.preloadAfterLoginMap[x].count;
        //             for(let i = 0;i<count;i++){
        //                 let monster = cc.instantiate(node);
        //                 monster.getComponent(PrefabBase).prefabPath = self.preloadAfterLoginMap[x].Prefab;
        //                 monster.getComponent(PrefabBase).create();
        //                 POOL.putPrefabToPool(monster);
        //             }
        //         }
        //     });
        // }
    }

    private doPreload(){
        if (this.preloadAfterLoginMap.length > 0) {
            let self = this;
            let data = this.preloadAfterLoginMap.pop();
            POOL.getPrefabFromPool(data.Prefab, (node: cc.Node) => {
                if(node){
                    let count = data.count;
                    for(let i = 0;i<count;i++){
                        let monster = cc.instantiate(node);
                        monster.getComponent(PrefabBase).prefabPath = data.Prefab;
                        monster.getComponent(PrefabBase).create();
                        POOL.putPrefabToPool(monster);
                    }
                    }
                });
            //this.preLoadCount = this.preLoadCount-1;
        }
    }

    private clearBulletPool(){
        for(let x in this.preloadAfterLoginMap){
            POOL.clearPool(this.preloadAfterLoginMap[x].Prefab);
        }
    }
    
    public getBulletDamage() {
        let bullet = GAME.playerData.RoleData.bullet;
        let configId = 1000 + bullet;
        let config = CFG.getCfgDataById(ConfigConst.BULLET, configId.toString());
        return parseInt(config.atk)
    }

    /**
     * 空间跳跃
     */
    private RushToBoss(){
        if(GAME.playerData.RoleData.checkpointId>1&&GAME.playerData.RushBossData.bossId!=0&&GAME.playerData.RushBossData.lashScore!=0){
            PANEL.showPanel(AssetConst.OpenContinueView,PanelManager.Type_UI);
        }
    }

    public onLaser(mulitTime:number = 1) {
        if (!this.laserTimer.isActive()) {
            var t = mulitTime * laserCfg.duration;
            this.laserTimer.reset(t);
            MainRole.Role.onLaser(t);
            SOUND.play(SoundConst.booster_laser)
        }
    }

    public onLaserFinish(){
        MainRole.Role.onLaserFinish()
    }

    public removeAllBullet(){
        for(let b in this.bullets) {
            this.bullets[b].onRemove()
        }
    }
}

export var BM = BattleManager.getInstance();