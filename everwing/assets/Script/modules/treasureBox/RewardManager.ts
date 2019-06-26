import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../GameConst";

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

export const RewardConst = {
    RewardGold:"101",
    RewardTrophy:"105",
}

@ccclass
export default class RewardManager {

    private static _instance: RewardManager = null;
    public static getInstance(): RewardManager {
        if (RewardManager._instance == null) {
            RewardManager._instance = new RewardManager();
            
        }
        return RewardManager._instance;
    }

    public static RewardOrganize:string="宝箱";

    
    

    private _rewardCfg:{}[]=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    public getReward(){
        this._rewardCfg=null;
        let cfg:{}[]=CFG.getCfgByKey(ConfigConst.PRIZE,"name",RewardManager.RewardOrganize);
        this._rewardCfg=cfg;
        if(this._rewardCfg&&this._rewardCfg.length!=0){
            let reward:{}[]=[];
            //随机金币
            var goldData=this.getRewardByRandom("goods");
            if(goldData){
                reward.push(goldData);
            }
            //随机奖杯
            var trophyData=this.getRewardByRandom("goods_second");
            if(trophyData){
                reward.push(trophyData);
            }
            return reward;
        }
        return null;
    }

    

    private getRewardByRandom(name:string){
        var totalRate:number = 0;
        var rewardArr =[];
        this._rewardCfg.forEach(element=>{
            if(element[name]){
                let itemArr=element[name].split(":");
                if(itemArr.length>1){
                    var area:any ={};
                    area.type=itemArr[0];
                    area.num=itemArr[1];
                    area.min=totalRate;
                    totalRate+=Number(itemArr[2]);
                    area.max=totalRate;
                    rewardArr.push(area);
                }
            }
        });
        var rand =this.getRandomArbitrary(0,totalRate);
        var curInfo:{} = null;
        rewardArr.forEach(element => {
            if(element.max >= rand && element.min <=rand){
                curInfo =element;
            }
        });
        return curInfo;
    }

    private getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
}

export var REWAED = RewardManager.getInstance();