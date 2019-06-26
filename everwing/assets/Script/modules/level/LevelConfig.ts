import DropItemManager, { randomInfo } from "../drop/DropItemManager";

export class MonstArrangeInfo{
    public id:string;
    public arrangeInfoMax:number;
    public arrangeInfoMin:number;
}
export default class LevelConfig{

    public levelId:number = 1;
    public levelBossId:number = 0;
    public lastBossId:number=0;
    public totalWave:number = 20;
    public chapter:number = 1;
    public waveMonstsArrangeWeight:object = {};//每种排列的权重
    public waveMonstsArrangeList:Array<MonstArrangeInfo> = [];//怪物排列样式list
    public arrangeMax:number = 0;//权重总和
    public monstrGem:randomInfo = null;                             //小怪掉落宝石
    public boss_gem:randomInfo = null;                              //boss掉落宝石
    public treasure_gem:randomInfo = null;                              //宝箱掉落宝石
    public boss_cup:randomInfo = null;                              //boss掉落奖杯

    public rocketTypeByMonsterWave: {[key: number]: number} = {};   // 第几波刷什么类型的火箭
    public rocketProb: number = 0;                                  // 火箭产生的概率
    public rocketSingleProb: number = 0;                            // 单个火箭产生的概率
    public rocketRowProb: number = 0;                               // 成排火箭产生的概率
    public rocketStormProb: number = 0;                             // 双排火箭产生的概率
    public bomb_prob:number = 0;                                    //炸弹怪概率
    public treasure_prob:number = 0;                                //宝箱概率
    public rocketFlyTime: number = 3;                               // 火箭飞行时间
    public rocket_timemax: number = 3;                              //火箭最大时间
    public rocket_timemin: number = 3;                              //火箭最小时间
    public rocketTrack: number = 0.025;                             // 火箭跟随
    public starPic: {[key: number]: string} = {};                   // 二层背景星球配置
    public monster_overtime:number = 4.27;
    public reset () {
        this.levelId = 1;
        this.levelBossId = 1;
        this.totalWave = 20;
        this.chapter = 1;
        this.waveMonstsArrangeWeight = {};
        this.waveMonstsArrangeList = [];
        this.arrangeMax = 0;
        this.monstrGem = null;
        this.boss_gem = null;
        this.boss_cup = null;
        this.rocketTypeByMonsterWave = {};
        this.rocketProb = 0;
        this.rocketSingleProb = 0;
        this.rocketRowProb = 0;
        this.rocketStormProb = 0;
        this.bomb_prob = 0;
        this.treasure_prob = 0;
        this.rocketFlyTime = 3;
        this.rocketTrack = 0.025;
        this.monster_overtime =4.27;
        this.starPic = {};
        this.rocket_timemax = 3;
        this.rocket_timemin = 3;
    }

    public initLevelData(cfgData:any){
        
        this.reset();
        if (!cfgData){
            return ;
        }
        if (cfgData.boss){
            this.levelBossId = cfgData.boss;
        }
        if (cfgData.chapter){
            this.chapter = cfgData.chapter;
        }
        if (cfgData.id){
            this.levelId = cfgData.id;
        }
        if (cfgData.wave){
            this.totalWave = cfgData.wave;
        }
        if(cfgData.monster_gem){
            this.monstrGem = DropItemManager.getRandomArray(cfgData.monster_gem);
        }
        if(cfgData.boss_gem){
            this.boss_gem = DropItemManager.getRandomArray(cfgData.boss_gem);
        }
        if(cfgData.boss_cup){
            this.boss_cup = DropItemManager.getRandomArray(cfgData.boss_cup);
        }
        if(cfgData.treasure_gem){
            this.treasure_gem = DropItemManager.getRandomArray(cfgData.treasure_gem);
        }
        
        if(cfgData.monster_overtime){
            this.monster_overtime = cfgData.monster_overtime;
        }
        if(cfgData.rocket_timemax){
            this.rocket_timemax = cfgData.rocket_timemax;
        }
        if(cfgData.rocket_timemin){
            this.rocket_timemin = cfgData.rocket_timemin;
        }
        if(cfgData.treasure_prob){
            this.treasure_prob = cfgData.treasure_prob;
        }
        if(cfgData.bomb_prob){
            this.bomb_prob = cfgData.bomb_prob;
        }
        if (cfgData.monster_blood){
            this.waveMonstsArrangeList = [];
            this.waveMonstsArrangeWeight = {};
            let dataString:string = cfgData.monster_blood;
            let monstsArrangelist = dataString.split("|");
            // for (const key in monstsArrangelist) {
            //     if (object.hasOwnProperty(key)) {
            //         const element = object[key];
                    
            //     }
            // }
            if(monstsArrangelist instanceof Array){
                let len = monstsArrangelist.length;
                monstsArrangelist.forEach(element => {
                    let arr = element.split(":");
                    if (arr.length == 2){
                        let arrange = arr[0];
                        let arrangeWeight = arr[1];
                        // this.waveMonstsArrangeList.push(arrange);
                        this.waveMonstsArrangeWeight[String(arrange)]= arrangeWeight;
                    }
                });
            }
            let arrangeMax = 0;
            for (const key in this.waveMonstsArrangeWeight) {
                if (this.waveMonstsArrangeWeight.hasOwnProperty(key)) {
                    const element = this.waveMonstsArrangeWeight[key];
                    let arrangeInfo = new MonstArrangeInfo();
                    arrangeInfo.id = key;
                    arrangeInfo.arrangeInfoMin = arrangeMax + 1;
                    arrangeMax = arrangeMax + Number(element);
                    arrangeInfo.arrangeInfoMax = arrangeMax;
                    this.waveMonstsArrangeList.push(arrangeInfo);
                }
            }
            this.arrangeMax = arrangeMax;
        }
        if (cfgData.rocket_script) {
            let rocketWaveTypeList = String(cfgData.rocket_script).split("|");
            for (const iterator of rocketWaveTypeList) {
                let arr = iterator.split(":");
                if (arr.length != 2) {
                    continue;
                }

                let wave = parseInt(arr[0]);
                let type = parseInt(arr[1]);
                this.rocketTypeByMonsterWave[wave] = type;
            }
        }
        if (cfgData.rocket_prob) {
            this.rocketProb = parseFloat(String(cfgData.rocket_prob));
        }
        if (cfgData.rocket_single) {
            this.rocketSingleProb = parseFloat(String(cfgData.rocket_single));
        }
        if (cfgData.rocket_row) {
            this.rocketRowProb = parseFloat(String(cfgData.rocket_row));
        }
        if (cfgData.rocket_row) {
            this.rocketStormProb = parseFloat(String(cfgData.rocket_row));
        }
        if (cfgData.rocket_time) {
            this.rocketFlyTime = parseFloat(String(cfgData.rocket_time));
        }
        if (cfgData.rocket_track) {
            this.rocketTrack = parseFloat(String(cfgData.rocket_track));
        }
        if (cfgData.star) {
            let starList = String(cfgData.star).split("|");
            for (const iterator of starList) {
                let arr = iterator.split(":");
                if (arr.length != 2) {
                    continue;
                }

                let num = parseInt(arr[0]);
                this.starPic[num] = arr[1];
            }
        }
    }
}
