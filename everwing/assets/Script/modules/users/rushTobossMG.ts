import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import { CFG } from "../../manager/ConfigManager";
import { AssetConst, ConfigConst } from "../../GameConst";
import { POOL } from "../../manager/PoolManager";
import { PANEL } from "../../manager/PanelManager";
import MonsterNormal from "../battle/Monster/MonsterNormal";
import MonsterNormalBlink from "../battle/Monster/MonsterNormalBlink";
import {MONSTMG} from "../monsterMg/MonsterMg";
import { RES } from "../../manager/ResourceManager";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocpos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class rushTobossMG extends cc.Component {

    private _monsterNode:cc.Node = null;
    private static _instance: rushTobossMG = null;
    public static getInstance(): rushTobossMG {
        if (rushTobossMG._instance == null) {
            rushTobossMG._instance = new rushTobossMG();
        }
        return rushTobossMG._instance;
    }
    
    public onLoad(){
        this._monsterNode = PANEL.panelHolder.monsterLayer;
    }

    //加载小怪
    public createMonsters(bossId){
        this.scheduleOnce(()=>{
            MSG.emit( MessageConst.RushAddSpeed, {type:0} );
            this.lodeBoss(bossId);
            MONSTMG.rushToBoss();
        }, 10)
        //加载几波小怪
        let monstInfo = CFG.getCfgDataById(ConfigConst.BOSS,'101');
        this.schedule(()=>{
            for (let i=0; i<5; i++) {
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
                    node.parent = this._monsterNode;
                    let posx = 0;
                    if (i == 1) {
                        posx = -150;
                    }else if (i == 2) {
                        posx = 150;
                    }else if (i == 3) {
                        posx = -300;
                    }else if (i == 4) {
                        posx = 300;
                    }
                    let sp = cc.v2(posx, 1000);
                    node.setPosition( sp );
                    if(itemMonster){
                        let com:MonsterNormalBlink = node.getComponent(MonsterNormalBlink);
                        com.setData(1, 1);
                        com.updateMonstInfo(monstInfo);
                        com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                    }
                    else{
                        let com:MonsterNormal = node.getComponent(MonsterNormal);
                        com.setData(1, 1); 
                        com.updateMonstInfo(monstInfo);
                        com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                    }
                  
                });
            }
        },1,5);
    }
    //加载boss
    private lodeBoss(bossId){
        this.showBossWarning(bossId);
        MONSTMG.initMonsterBoss(bossId);
    }

    private showBossWarning(bossId){
        let self = this;
        POOL.getPrefabFromPool(AssetConst.Warning,(node:cc.Node)=>{
            //boss预警需要加载在战场节点上
            let battleNode:cc.Node = PANEL.panelHolder.battleLayer;
            node.parent = battleNode;
            let spNode = node.getChildByName("yingzi");
            if (spNode) {
                let sp = spNode.getComponent(cc.Sprite);
                RES.loadLocalSprite("img/common1/Monster/yingzi"+bossId, sp);
            }
            setTimeout(() => {
                POOL.putPrefabToPool(node);
            }, 3000);
        });
    }

}

export var RUSHTOBOSS = rushTobossMG.getInstance();
