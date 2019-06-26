import LevelConfig, {MonstArrangeInfo} from "./LevelConfig";
import LevelMonsterGroup from "./LevelMonsterGroup";
import {CFG} from "../../manager/ConfigManager";
import {BossConfig, ConfigConst} from "../../GameConst";

export default class LevelManager {

    private static _instance: LevelManager = null;
    public static getInstance(): LevelManager {
        if (LevelManager._instance == null) {
            LevelManager._instance = new LevelManager();
        }
        return LevelManager._instance;
    }
    
    public currentChapter:number = 1;
    public currentLevelData:LevelConfig=new LevelConfig();
    public mapMonsterGroups:Array<LevelMonsterGroup>=null;
    public levelTotalCount:number = 1;

    //boss相关
    public rushBossID: number = -1;
    public bossIndex: number = -1;
    public lastBossId: number = 0;

    public initializeLevelMg(cb:Function){
        let allChapter:object = CFG.getCfgGroup(ConfigConst.LEVEL);
        if (allChapter ){
            this.levelTotalCount = Object.keys(allChapter).length
        }
        // console.log('initializeLevelMg',this.levelTotalCount);
        cb && cb();
    }
    //清除缓存数据
    public clearLevelData(){
        this.currentChapter = 1;
        this.bossIndex = -1;
        this.lastBossId = 0;
        this.currentLevelData = new LevelConfig();

    }
    //设置当前关卡
    public chooseCurrentChapter(tempChapter:number ,cb:Function){
        if (tempChapter >= 1){
            this.currentChapter = tempChapter;
        }
        //读取关卡配置表
        tempChapter =  CFG.getCfgDataById(ConfigConst.LEVEL,String(this.currentChapter));
        this.currentLevelData.initLevelData(tempChapter);
        

        // console.log('chooseCurrentChapter',this.currentLevelData);
        //this.updateLevelCoefficient();
        cb && cb();
    }
    //更新关卡相关难度系数
    public updateLevelCoefficient(){
        // let rankCfg = CFG.getCfgDataById(ConfigConst.RANK ,String(GAME.playerData.RoleData.level));
        // if (BATTLEDATA.normalMonsterFiyTime <= this.currentLevelData.monster_overtime){
        //     return ;
        // }
        // let monserFlyTime = this.currentLevelData.monster_overtime;
        // let superBulletFlyTime = rankCfg.rocket_time;
        // //let factor = rankCfg.factor;
        // // for(let i =1;i< this.currentChapter ;i++){
        // //     monserFlyTime = monserFlyTime * factor;
        // //     superBulletFlyTime = superBulletFlyTime * factor;
        // // }
        // BATTLEDATA.superBulletFiyTime = superBulletFlyTime;
        // BATTLEDATA.normalMonsterFiyTime = monserFlyTime;
    }
    

    public getCurrentWaveMonstList():Array<any>{
        let arrangeMax:number = this.currentLevelData.arrangeMax;
        let min:number = 1;
        let rand:number = Math.floor(Math.random()*(arrangeMax-min+1)+min);
        let tempElement:MonstArrangeInfo = null;
   
        for (const key in this.currentLevelData.waveMonstsArrangeList) {
            if (this.currentLevelData.waveMonstsArrangeList.hasOwnProperty(key)) {
                const element:MonstArrangeInfo = this.currentLevelData.waveMonstsArrangeList[key];
                if (element.arrangeInfoMax >= rand && element.arrangeInfoMin <= rand){
                    tempElement = element;
                }
            }
        }
        let monstArrangeId = '';
        if (tempElement == null){
            tempElement = this.currentLevelData.waveMonstsArrangeList[0];
        }
        monstArrangeId=  tempElement.id;
        let cfgData =  CFG.getCfgDataById(ConfigConst.CONSTANT,monstArrangeId);
        
        let monstsArr = cfgData.parm1.split('|');
        //随机顺序
        monstsArr.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});
        //  console.log('怪物顺序' , monstsArr);
        return monstsArr;
    }
    //初始化下一关卡
    public initNextChapter(cb:Function){
        this.chooseCurrentChapter(this.currentChapter + 1,()=>{
            cb && cb();
        });
    }
    // 判断是否是完成所有关卡
    public isFinishTotalChapter(){
        if (this.currentChapter >= this.levelTotalCount){
            return true;
        }
        return false;
    }

    public setBossID(index: number) {
        for (let i = 0; i < BossConfig.length; i++) {
            if (BossConfig[i].id == index) {
                this.bossIndex = i;
            }
        }
        this.rushBossID = index;
    }

    public getBossSpawnID() {
        if (this.bossIndex == -1) {
            this.bossIndex = Math.floor(Math.random() * BossConfig.length);
        } else {
            this.bossIndex = (this.bossIndex + 1) % BossConfig.length;
        }

        var e = BossConfig[this.bossIndex];
        var bossKilled = LEVELMG.currentChapter - 1;
        for (; e.need > bossKilled;) {
            this.bossIndex = (this.bossIndex + 1) % BossConfig.length;
            e = BossConfig[this.bossIndex];
        }
        return e.id
    }
}

export var LEVELMG = LevelManager.getInstance();