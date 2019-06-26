import MonsterBase, { EmMonsterType } from "./MonsterBase";
import MonsterBossBase from "./MonsterBossBase";
import MonsterInfo from "./MonsterInfo";
import { POOL } from "../../../manager/PoolManager";
import { AssetConst } from "../../../GameConst";
import { PANEL } from "../../../manager/PanelManager";
import MonsterSplitBossMidItem from "./MonsterSplitBossMidItem";

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
export default class MonsterSplitBossBigItem extends MonsterBossBase {
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    @property(sp.Skeleton) bossSp:sp.Skeleton=null;

    private canDash:boolean = false;
    private _bosshp:number=100;
    private _bossid:number=1;
    private _delaytime:number=5;
    start () {

    }

    /**
     * 初始化小怪
     */
    public initLittleBoss(bossdata:any){
        if(bossdata){
            if(bossdata.bosshp){
                this._bosshp=Number(bossdata.bosshp);
            }
            if(bossdata._bossid){
                this._bossid=Number(bossdata.bossid);
            }
            if(bossdata._delaytime){
                this._delaytime=Number(bossdata.delaytime);
            }
        }
        this.onlaunch();
    }

    protected resetStart () {
        this.canDash = false;
        this.MonsterType = EmMonsterType.Boss;
        this.monsterInfo = new MonsterInfo();
        //this.monsterInfo.parseData({monsterId: 3, monsterType: 3, monsterHp: 20000, monsterMaxHp: 20000});
        this.monsterInfo.parseData({monsterId: 3, monsterType: 3, monsterHp: this._bosshp, monsterMaxHp: this._bosshp});
        this.node.stopAllActions();
    }

    protected OnDeath() {
        for(let i=0;i<2;i++){
            POOL.getPrefabFromPool(AssetConst.MonsterSplitBossMidItem,(node:cc.Node)=>{
                node.parent = PANEL.panelHolder.monsterLayer;
                node.position = this.node.position.add(cc.v2(-100+i*200,0));
                let com = node.getComponent(MonsterSplitBossMidItem);
                com.initLittleBoss({"bosshp":this.monsterInfo.MonsterMaxHp/2,"bossid":this._bossid*2+i-1,"delaytime":5});
            });
        }
        this.resetStart();
        POOL.putPrefabToPool(this.node);
        // super.OnDeath();
    }
    
    public playSkill () {
        //monsterSkill
    }

    public onlaunch () {
        this.resetStart();
        let finish = cc.callFunc(()=>{
            this.attackAction();
        }, this);
        this.node.runAction(finish);
    }

    update (dt) {
        if(this.canDash){
            let i = Math.random();
            if(i > 0.99){
                //this.beforeDashAction();
                this.dashAction();
            }
        }
    }

    private attackAction () {
        let left = -cc.winSize.width/2+this.node.getContentSize().width/2;
        let right = cc.winSize.width/2-this.node.getContentSize().width/2;
        let leftDis = this.node.position.x - left;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.moveTo(6*leftDis/(cc.winSize.width-(this.node.getContentSize().width)),cc.p(left,this.node.position.y)),
        cc.moveTo(6,cc.p(right,this.node.position.y)),cc.moveTo(3,cc.p(0,this.node.position.y)))));
        this.canDash = true;
    }

    private dashAction(){
        this.canDash = false;
        this.node.stopAllActions();
        let bottom = -cc.winSize.height/2+200;
        let bottomDis = this.node.position.y - bottom;
        let y = cc.winSize.height/2 - this.node.getContentSize().height/2-50;

        let fall=cc.callFunc(()=>{
            this.bossSp.setAnimation(1, "attack", false);

        },this)
        // let stopaction=cc.callFunc(()=>{
        //     this.node.stopAllActions();
        // })

        this.node.runAction(cc.sequence(cc.spawn(cc.moveTo(bottomDis/(y-bottom),cc.p(this.node.position.x,-cc.winSize.height/2+200)).easing(cc.easeQuadraticActionIn()),fall) ,
        cc.moveTo(2.5,cc.p(this.node.position.x,y)),cc.callFunc(()=>{
            this.attackAction();
        //}),cc.delayTime(2*this._delaytime-this._delaytime*this._bossid)));
        })));

    }

    // private beforeDashAction(){
    //     let stopaction=cc.callFunc(()=>{
    //         this.node.stopAllActions();
    //         this.dashAction();
    //     })
    //     this.node.runAction(cc.sequence(cc.delayTime(this._delaytime*this._bossid),stopaction));
    // }
}
