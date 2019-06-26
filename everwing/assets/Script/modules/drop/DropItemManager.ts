import { POOL } from "../../manager/PoolManager";
import { AssetConst, ConfigConst, DropItemType } from "../../GameConst";
import { PANEL } from "../../manager/PanelManager";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import { BM } from "../battle/BattleManager";
import { CFG } from "../../manager/ConfigManager";
import { LEVELMG } from "../level/LevelManager";
import DropItem from "./DropItem";
import MainRole from "../battle/MainRole";


export interface randomInfo {
    count:number,
    maxNumber:number,
    weight:{}
}

export default class DropItemManager {

    private static _instance: DropItemManager = null;
    private _isShowSideTips:boolean = false;
    private static DropRangId:string = "20001";
    private static DropRangId2:string = "20002";
    private static BossDropNumberId:string = "20003";
    private static BossDropCupCountId:string = "20004";
    private BossDropCupCount:number = 2;
    private BossDropNomalCount:number = 2;
    private static maxPlayerBulletLevelID:string = "20005";
    private maxPlayerBulletLevel:number = 29;
    
    private dropTypeRang:randomInfo = null;
    private dropItemRang:randomInfo = null;
    public static getInstance(): DropItemManager {
        if (DropItemManager._instance == null) {
            DropItemManager._instance = new DropItemManager();
        }
        return DropItemManager._instance;
    }
    public createItemDrop(pos){
        let itemType = DropItemType.DoubleBullet;
        let rand = Math.random();
        if(rand<0.25)
        {
            itemType =  DropItemType.DoubleBullet;;
        }
        else if(rand>=0.25&&rand<0.50)
        {
            itemType =  DropItemType.AddDamage;;
        }
        else if(rand>=0.5&&rand<0.75){
            itemType =  DropItemType.RushAddSpeed;;
        }
        else {
            itemType =  DropItemType.AddMagnet;;
        }
       
        POOL.getPrefabFromPool(AssetConst.DropItem+"/drop"+itemType.toString(),(node:cc.Node)=>{
            let battleNode = PANEL.panelHolder.battleLayer;
            node.parent = battleNode;
            let startPos: cc.Vec2 = pos;
            node.position = startPos;
            let targetPos = new cc.Vec2(startPos.x + Math.random()*100 - 50,-cc.winSize.height/2-100);
            let centerPos = cc.v2(startPos.x + (targetPos.x - startPos.x) * 0.4, targetPos.y + (startPos.y - targetPos.y) * 1.9);
            let time = 2.5*(startPos.y-targetPos.y)/1600;
            let bezierTo = cc.bezierTo(time, [startPos, centerPos, targetPos])
            let action =cc.sequence(bezierTo,cc.callFunc(()=>{
                if(node.activeInHierarchy)
                {
                    POOL.putPrefabToPool(node)
                }}));
            action.setTag(1);
            node.runAction(action);
        });
    }

    public static getRandomArray (parseStr: string):randomInfo {
        let items = parseStr.split('|');
        if(items instanceof Array){
            let data:randomInfo = {count:0,maxNumber:0,weight:{}};
            for (let i = 0; i < items.length; i++) {
                let goods: string = String(items[i]);
                let arr = goods.split(":")
                if (arr.length < 2) {
                    continue;
                }
                let weight= parseInt(arr[1]);
                data.weight[arr[0]] = weight;
                data.count+=1;
                data.maxNumber += weight;
            } 
            return data;
        }
        else{
            return null;
        }
    }

    private getRandomKey(infos:randomInfo):string{
        if(infos){
            let t = Math.random()*infos.maxNumber ;
            let now = 0;
            let itemkey = "";
            for (const key in infos.weight) {
                itemkey =  key
                if (infos.weight.hasOwnProperty(key)) {
                    now += infos.weight[key];
                    if(t<=now){
                        return key;
                    }
                }
            }
            return itemkey;
        }
        else{
            return ""
        }
    }
    public getDropItem(isboss:boolean = false){               //获取掉落key
        let data:any ={}
        let infos = this.dropTypeRang;
        if(this.dropTypeRang == null){
            this.initDropBase();
            infos = this.dropTypeRang;
        }
        if(infos){
            let key = this.getRandomKey(infos); //key == "1" 是宝石 2 是道具
            if(key =="1"){
                let items:randomInfo = null;
                if(isboss){
                    items = LEVELMG.currentLevelData.boss_gem;
                }
                else{
                    items = LEVELMG.currentLevelData.monstrGem
                }
                let key2 = this.getRandomKey(items);
                if(key2!=""){
                    return key2;
                }
            }
            else if(key =="2"){
                let items = this.dropItemRang;
                let key2 = this.getRandomKey(items);
                if(key2!=""){
                    return key2;
                }
                
            }
        }
    }

    public createDrop(pos,isboss:boolean =false){
        let itemType:number = parseInt(this.getDropItem(isboss));
        if(itemType == DropItemType.AddDamage){
            let level = this.maxPlayerBulletLevel;//CFG.getCfgDataById(ConfigConst.CONSTANT,DropItemManager.maxPlayerBulletLevelID).parm1;
            if( MainRole.Role.ActorAttr.bulletLev>=level){
                itemType = DropItemType.Gold;
            }
        }

        if(isboss){
            if(itemType == DropItemType.RushAddSpeed){
                itemType = DropItemType.Gold;
            }
            this.createDropByType(pos,itemType);
            return;
        }
        this.createMonsterDropByType(pos,itemType);
    }

    public createGemDrop(pos,isboss:boolean =false){

    }

    public createMonsterDropByType(pos, itemType,dx:boolean=false,dy:boolean=false){ 
        POOL.getPrefabFromPool(AssetConst.DropItem+"/drop"+itemType.toString(),(node:cc.Node)=>{
            let battleNode = PANEL.panelHolder.battleLayer;
            node.parent = battleNode;
            node.getComponent(DropItem).reset(itemType,pos,dx,dy);
        });
    }

    public createDropByType(pos, itemType,zorder:number=0){ 
        POOL.getPrefabFromPool(AssetConst.DropItem+"/drop"+itemType.toString(),(node:cc.Node)=>{
            let battleNode = PANEL.panelHolder.battleLayer;
            node.parent = battleNode;
            node.setLocalZOrder(zorder);
            node.getComponent(DropItem).reset(itemType,pos,false,true);
        });
    }

    public createCupDrop(pos,isboss:boolean =false){  //掉落奖杯
        let items = LEVELMG.currentLevelData.boss_cup;
        let key2 = this.getRandomKey(items);
        if(key2==""){
            return "";
        }
        this.createDropByType(pos,key2,1000);
    }

    public createBossDrop(pos){            //boss掉落
        let cfg = CFG.getCfgDataById(ConfigConst.CONSTANT,DropItemManager.BossDropNumberId);
        let dropCount = Math.round(Math.random()*(cfg.parm2-cfg.parm1))+cfg.parm1;
        setTimeout(() => {
            for(let i = 0 ;i < 10; i++) {
                this.createDrop(pos, true);
            }
        }, 50);
        dropCount -=10;
        setTimeout(() => {
            for(let i = 0 ;i < this.BossDropNomalCount; i++) {
                    this.createDropByType(pos, DropItemType.Trophy,1000);
            }
        }, 100);
        setTimeout(() => {
            for(let i = 0 ;i < this.BossDropCupCount; i++) {
                    this.createCupDrop(pos,true);
            }
        }, 120);
        dropCount -= this.BossDropCupCount;
        dropCount -= this.BossDropNomalCount;
        setTimeout(() => {
            for(let i = 0 ;i < 10; i++) {
                this.createDrop(pos, true);
            }
        }, 150);
        dropCount -=10;
        setTimeout(() => {
            for(let i = 0 ;i < dropCount; i++) {
                this.createDrop(pos, true);
            }
        }, 220);
        // setTimeout(() => {
        //     for(let i = 0 ;i < 3; i++) {
        //         this.createDropByType(pos, 4);
        //     }
        // }, 300);
        // setTimeout(() => {
        //     for(let i = 0 ;i < 3; i++) {
        //         this.createDropByType(pos, 5);
        //     }
        // }, 350);
        // setTimeout(() => {
        //     for(let i = 0 ;i < 3; i++) {
        //         this.createDropByType(pos, 6);
        //     }
        // }, 400);
        // setTimeout(() => {
        //     for(let i = 0 ;i < 3; i++) {
        //         this.createDropByType(pos, 7);
        //     }
        // }, 450);
    }

    private shuffle(a) {
        var len = a.length;
        for (var i = 0; i < len - 1; i++) {
            var index = Math.floor(Math.random() * (len - i));
            if(index == len){
                index = len -1;
            }
            var temp = a[index];
            a[index] = a[len - i - 1];
            a[len - i - 1] = temp;
        }
    }
    public createLootDrop(pos){
        let dropCount =  Math.floor(3 + Math.random() * 4);
        let a:number[]=[]
        for(let i=0;i<dropCount;i++){
            a.push(50*i);
        }
        this.shuffle(a);
        
        setTimeout(() => {
            this.createDropByType(pos, DropItemType.Trophy);
        }, a[0]);
        setTimeout(() => {
            this.createDropByType(pos, DropItemType.AddDamage);
        }, a[1]);
        for(let i=2;i<dropCount;i++){
            setTimeout(() => {
                this.createDrop(pos);
            }, a[i]);
        }
    }

    public createTreasureDrop(pos){
        let dropCount = Math.floor(7 + Math.random() * 4);
        let a:number[]=[]
        for(let i=0;i<dropCount;i++){
            a.push(30*i);
        }
        //this.shuffle(a);
        
        let self = this;
        for(let i=0;i<dropCount;i++){
            setTimeout(() => {
                let items = LEVELMG.currentLevelData.treasure_gem;
                let key2 = self.getRandomKey(items);
                self.createMonsterDropByType(pos,key2,true,false);
            }, 30*i);
        }
    }
    public initDropBase(){
        let cfgData =  CFG.getCfgDataById(ConfigConst.CONSTANT,DropItemManager.DropRangId);
        this.dropTypeRang = DropItemManager.getRandomArray(cfgData.parm1)
        this.BossDropCupCount = CFG.getCfgDataById(ConfigConst.CONSTANT,DropItemManager.BossDropCupCountId).parm2;
        this.BossDropNomalCount = CFG.getCfgDataById(ConfigConst.CONSTANT,DropItemManager.BossDropCupCountId).parm1;
        let cfgData2 =  CFG.getCfgDataById(ConfigConst.CONSTANT,DropItemManager.DropRangId2);
        this.dropItemRang = DropItemManager.getRandomArray(cfgData2.parm1)
        this.maxPlayerBulletLevel = CFG.getCfgDataById(ConfigConst.CONSTANT,DropItemManager.maxPlayerBulletLevelID).parm1;
    }
}
export var DROP = DropItemManager.getInstance();