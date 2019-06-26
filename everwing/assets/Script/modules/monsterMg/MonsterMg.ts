import {PANEL} from "../../manager/PanelManager";
import {BATTLEDATA, GameState, RushType} from "../../model/BattleData";
import {POOL} from "../../manager/PoolManager";
import {AssetConst, BossConst, ConfigConst, DropItemType, monsterTypeID, ZERO} from "../../GameConst";
import {RES} from "../../manager/ResourceManager";
import MonsterBossBase from "../battle/Monster/MonsterBossBase";
import MonsterNormalBlink from "../battle/Monster/MonsterNormalBlink";
import MonsterNormal from "../battle/Monster/MonsterNormal";
import MonsterElite from "../battle/Monster/MonsterElite";

import {LEVELMG} from "../level/LevelManager";
import {CFG} from "../../manager/ConfigManager";
import {ROCKET} from "../rocket/RocketManager";
import {BM} from "../battle/BattleManager";
import {DROP} from "../drop/DropItemManager";
import MonsterInfo from "../battle/Monster/MonsterInfo";
import {GAME} from "../../model/GameData";
import {SOUND, SoundConst} from "../../manager/SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterMg extends cc.Component {

    private _monsterNode:cc.Node = null;
    
    private static waveSize:number = 5;
    private enemyLevel:number = 0;
    private _lastMonster: string[] = [];

    private nextLootMonsterTier:number = 1;
    public LootMonsterBaseHp:number = 5000;
    public LootMonsterBaseMaxHp:number = 5000;
    private nextLootMonsterWave:number = 0;
    private previousHealth:number = 0;
    private previousMaxHealth:number = 0;
    public skip: number = 0;

    private static _instance: MonsterMg = null;
    private currentBoss:cc.Node= null;
    private bossWarning:cc.Node= null;
    private bossTime: number = 0;

    public static getInstance(): MonsterMg {
        if (MonsterMg._instance == null) {
            MonsterMg._instance = new MonsterMg();
        }
        return MonsterMg._instance;
    }

     /**  注册节点  */
    public regisgterNode()
    {
        this._monsterNode = PANEL.panelHolder.monsterLayer;
    }
    //清除怪物
    public cleanMonsters(){
        if (this._monsterNode) {
            this._monsterNode.removeAllChildren();
        }
    }

     /** * 清理怪物*/
     public clearMonstNode()
    {
        this.bossWarning = null;
        if(this._monsterNode)
        {
            let count:number = this._monsterNode.children.length;
            for (let index = 0; index < count; index++) {
                let element = this._monsterNode.children[index];
                if(element)
                {
                    element.destroy();
                }
            }
        }
        POOL.clearPool(AssetConst.MonsterItem);
        POOL.clearPool(AssetConst.MonsterEliteItem);
    }



    //开始怪物轮询
    public startMonstLoop(){

        this.enemyLevel = 0;
        this._lastMonster = [];

        let loot = CFG.getCfgDataById(ConfigConst.BOSS,"201");
        if(loot){
            this.LootMonsterBaseHp = loot.monsterHp;
            this.LootMonsterBaseMaxHp = loot.monsterMaxHp
        }
        this.showNextLoot();
        let t = 2.5;
        if(GAME.playerData.RoleData["masterSpeed"]!=undefined){
            t = GAME.playerData.RoleData["masterSpeed"];
            if(t<0.01){
                t=2.5
            }
        }

        if(GAME.playerData.RoleData.gameNumber >=10){
            //t = 2.5;
        }
        this.schedule(this.onMonsterTick, t );
    }

    private onMonsterTick()
    {
        if(BATTLEDATA.StateGame == GameState.Finish)
        {
            this.unschedule(this.onMonsterTick);
            return;
        }
        this.creatWaveMonster();
    }

    public rushToBoss(){
        this.unschedule(this.onMonsterTick);
            return;
    }

    // 创建每一波的怪物
    public creatWaveMonster(){
        if (BATTLEDATA.StateGame == GameState.PalyerDied){
            //玩家死亡
            console.log('玩家死亡');
            return ;
        }
        if (BATTLEDATA._rushType == RushType.Rush_Start || BATTLEDATA._initEnd == false) {
            return;
        }
        if ( BATTLEDATA._rushType != RushType.Rush_None && BATTLEDATA._unableCrtMonster) {
            return;
        }
        if (BATTLEDATA._CloudIsOpen){
            //开着云层，不刷怪
            return ;
        }

        if (this.skip > 0) {
            this.skip--;
            return;
        }
        let wave = LEVELMG.currentLevelData.totalWave;

        if(BATTLEDATA._rushType == RushType.Rush_None ){
        // let wave = BATTLEDATA._chapterCfg.wave;
            if (BATTLEDATA._wave < wave) {
                BATTLEDATA._wave += 1;
                if (BATTLEDATA._wave >= wave &&  LEVELMG.currentLevelData.levelBossId > 0) {
                    //记录打到boss分数
                    BM.bossScore=BATTLEDATA._scoreNum;
                    var bossId = 0;
                    if (LEVELMG.rushBossID != -1) {
                        bossId = LEVELMG.rushBossID;
                        LEVELMG.rushBossID = -1;
                    }
                    else{
                        bossId = LEVELMG.getBossSpawnID();
                    }
                    this.showBossWarning(bossId);
                    this.initMonsterBoss(bossId);
                    return;
                }
            } else {
                //出了boss 不再继续生成小怪
                //新逻辑每关都有boss
                // if(BATTLEDATA._wave < wave + 2 && LEVELMG.currentLevelData.levelBossId == 0){
                //     BATTLEDATA._wave += 1;
                //     if(BATTLEDATA._wave == wave + 2){
                //         // this.changeChapter();
                //         MSG.emit('CurrentChapterPass');
                //     }
                // }
                return;
            }
            ROCKET.showRocket();
        }

        this.createSpawnWave();
        if(BATTLEDATA._rushType == RushType.Rush_None ){
            this.enemyLevel +=1;
            this.spawnLootMonser();
        }
        /*let waveMonsts = LEVELMG.getCurrentWaveMonstList()
        for (let i=0; i<5; i++) {
            let monstInfo = CFG.getCfgDataById(ConfigConst.BOSS,waveMonsts[i]);
            console.log('波数',BATTLEDATA._wave)
            console.log(monstInfo);
            let itemMonster:boolean = Math.random()*20 <=1?true:false;
            let prefabName = AssetConst.MonsterItem;
            if(itemMonster){
                prefabName = AssetConst.MonsterItemBlink;
            }
            POOL.getPrefabFromPool(prefabName,(node:cc.Node)=>{
                if(node==null)
                {
                    console.error("对象池中的prefab为空:"+prefabName)
                    return;
                }
                if(BATTLEDATA.StateGame == GameState.Finish)
                {
                    POOL.putPrefabToPool(node);
                    return;
                }

                node.parent = this._monsterNode;
   
                let posx = -300;
                if (i == 1) {
                    posx = -150;
                }else if (i == 2) {
                    posx = 0;
                }else if (i == 3) {
                    posx = 150 ;
                }else if (i == 4) {
                    posx = 300;
                }
                let sp = cc.v2(posx, 1000);
                node.setPosition( sp );
                if(itemMonster){
                    let com:MonsterNormalBlink = node.getComponent(MonsterNormalBlink);
                    com.updateMonstInfo(monstInfo);
                    com.setData(BATTLEDATA._wave, BATTLEDATA._rushType);
                    com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                }else{
                    let com:MonsterNormal = node.getComponent(MonsterNormal);
                    com.updateMonstInfo(monstInfo);
                    com.setData(BATTLEDATA._wave, BATTLEDATA._rushType);
                    com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                }
            });
        }
         */
    }

    private showBossWarning(bossId:number){
        let self = this;
        POOL.getPrefabFromPool(AssetConst.Warning,(node:cc.Node)=>{
            //boss预警需要加载在战场节点上
            let battleNode:cc.Node = PANEL.panelHolder.battleLayer;
            node.parent = battleNode;
            let spNode = node.getChildByName("yingzi");
            if (spNode) {
                let sp = spNode.getComponent(cc.Sprite);
                RES.loadLocalSprite("img/common1/Monster/yingzi" + bossId, sp);
            }
            this.bossWarning = node;
            SOUND.play(SoundConst.boss_alarm)
            // setTimeout(() => {
            //     POOL.putPrefabToPool(node);
            // }, 3000);
        });
    }

    /**
     * boss
     */
    public initMonsterBoss(bossType: number = 0) {
        let assetName = "";
        if (bossType == BossConst.MonsterBatBossItem) {
            assetName = AssetConst.MonsterBatBossItem;
        }
        else if (bossType == BossConst.MonsterTreeBossItem) {
            assetName = AssetConst.MonsterTreeBossItem;
        }
        else if (bossType == BossConst.MonsterWitchBossItem) {
            assetName = AssetConst.MonsterWitchBossItem;
        }
        else if (bossType == BossConst.MonsterSplitBossItem) {
            assetName = AssetConst.MonsterSplitBossItem;
        }
        else {
            return;
        }
        POOL.getPrefabFromPool(assetName,(node:cc.Node)=>{
            BATTLEDATA._bossState = 1;
            var bossBase = node.getComponent(MonsterBossBase);
            bossBase.bossId = bossType;
            //node.parent = this._monsterNode;
            this.bossTime = 3;
            this.currentBoss = node;
        });
    }

    /**  精英怪 */
    public initMonsterElite() {
        POOL.getPrefabFromPool(AssetConst.MonsterEliteItem,(node:cc.Node)=>{
            node.parent = this._monsterNode;
            let com:MonsterElite = node.getComponent(MonsterElite);
            com.onlaunch(ZERO,this.previousHealth,this.previousMaxHealth);
        });
    }

    //生成普通小怪
    private createMonster(type,x,y){
        let monstInfo = CFG.getCfgDataById(ConfigConst.BOSS,type);
            //console.log('波数',BATTLEDATA._wave)
            let prefabName = AssetConst.MonsterItem;
            let reward=0;
            let itemMonster = false;
            if(type!=monsterTypeID.MonsterBoomID&&type!=monsterTypeID.MonsterTreasureID){
                reward = parseInt(DROP.getDropItem(false));
                if(reward == DropItemType.DoubleBullet||reward == DropItemType.AddDamage||reward==DropItemType.RushAddSpeed||reward == DropItemType.AddMagnet){
                    itemMonster = true;
                }
                else{
                    if(BATTLEDATA._rushType==RushType.Rush_Boss){
                        reward = 0;
                    }
                }
            }
            //console.log("rewardID:"+reward+" monsterinfo",monstInfo);
            if(itemMonster){
                prefabName = AssetConst.MonsterItemBlink;
                //console.log("create:MonsterItemBlink");
            }
            POOL.getPrefabFromPool(prefabName,(node:cc.Node)=>{
                if(node==null)
                {
                    //console.error("对象池中的prefab为空:"+prefabName)
                    return;
                }
                if(BATTLEDATA.StateGame == GameState.Finish)
                {
                    POOL.putPrefabToPool(node);
                    return;
                }

                node.parent = this._monsterNode;
   
               
                let sp = cc.v2(x, y);
                node.setPosition( sp );
                if(itemMonster){
                    let com:MonsterNormalBlink = node.getComponent(MonsterNormalBlink);
                    com.updateMonstInfo(monstInfo);
                    com.setData(BATTLEDATA._wave, BATTLEDATA._rushType,reward);
                    com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                }else{
                    let com:MonsterNormal = node.getComponent(MonsterNormal);
                    com.updateMonstInfo(monstInfo);
                    com.setData(BATTLEDATA._wave, BATTLEDATA._rushType,reward);
                    com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                }
            });
    }
    //生成一波小怪
    private createSpawnWave(){
        let i = MonsterMg.waveSize + 1 / MonsterMg.waveSize * this.enemyLevel;
        let currentChapter = LEVELMG.currentChapter;
        let o = Math.min(16, 1 + currentChapter);
        let a = Math.max(1, Math.min(o, currentChapter));
        let r = Math.round(Math.random()*MonsterMg.waveSize);
        if(r>= MonsterMg.waveSize){
            r = MonsterMg.waveSize-1;
        }
        if(BATTLEDATA._rushType!=0){
            r = MonsterMg.waveSize;
        }
        let levelData = LEVELMG.currentLevelData;
        let bomb =  levelData.bomb_prob;
        let treasure =  levelData.treasure_prob;
        let ids = "";
        for (let u = 0; u < MonsterMg.waveSize; u++) {
            let h = MonsterMg.waveSize - u;
            let d = 1;
            let id = 1;
            if(u!==r){
                d = Math.max(a, Math.min(o, Math.floor(i / h + Math.random())));
                id = d +100;
            }
            else{
                d = 1;
                id = 101;
                let rand = Math.random() ;
                if(rand <= bomb){
                    d = 1,
                        id = monsterTypeID.MonsterBoomID;
                    i -= 1
                }else if(rand <= bomb + treasure ){
                    d = 1, 
                    id = monsterTypeID.MonsterTreasureID;
                    i -= 1; 
                }else{ 
                    i -= d;
                }
            }
            let x = -300+150*u;
            let y = 1000;
            this.createMonster(id,x,y);
            i -= d;
            ids += (d + 100) + ","
        }
        while (this._lastMonster.length >= 3) {
            this._lastMonster.shift()
        }
        this._lastMonster.push(ids)
    }
    public exitBattle(){
        this.previousHealth = 0;
        this.nextLootMonsterTier = 1;
        this.nextLootMonsterWave = 0;
        this.previousMaxHealth = 0;
        this.bossTime = 0;
        if(this.bossWarning){
            POOL.putPrefabToPool(this.bossWarning);
            //this.bossWarning = null;
        }
        //this.bossWarning =null;
        if(this.currentBoss){
            POOL.putPrefabToPool(this.currentBoss);
            //this.currentBoss = null;
        }
        //this.currentBoss =null;
    }
    public showNextLoot(){
        let m = Math.round(Math.random())+1;
        if(m>2){
            m = 2;
        }
        let l = LEVELMG.currentLevelData.totalWave;
        this.nextLootMonsterTier += m;
        this.nextLootMonsterWave =Math.round( Math.random()*( Math.floor(.4 * l) - Math.floor(.1 * l)));
        if(this.nextLootMonsterWave<=0){
            this.nextLootMonsterWave = 1;
        }
        console.log("nextLoot:l:"+this.nextLootMonsterTier+" w:"+this.nextLootMonsterWave)
    }

    public spawnLootMonser(){
        if(LEVELMG.currentChapter == this.nextLootMonsterTier){
            if(this.nextLootMonsterWave == BATTLEDATA._wave){
                this.initMonsterElite();
                this.showNextLoot();
            }
        }
    }
    public resetLootMonser(data:MonsterInfo){
        this.previousHealth = data.MonsterHp;
        this.previousMaxHealth = data.MonsterMaxHp;
    }

    get wave(): number {
        return this.enemyLevel;
    }

    get lastMonster(): string[] {
        return this._lastMonster;
    }

    public updateDt(dt:number){
        if(this.bossTime>0.01){
            if(BM.isBossAcitve){
                this.bossTime -= dt;
                if(this.bossTime<0.01){
                    if(this.currentBoss){
                        this.currentBoss.parent = this._monsterNode;
                        let com:MonsterBossBase = this.currentBoss.getComponent(MonsterBossBase);
                        com.onlaunch();
                        if(this.bossWarning){
                            POOL.putPrefabToPool(this.bossWarning);

                            this.bossWarning = null;
                        }
                        this.currentBoss = null;
                    }
                }
            }
            else{
                this.bossTime = 3;
            }
        }
    }


}

export var MONSTMG = MonsterMg.getInstance();