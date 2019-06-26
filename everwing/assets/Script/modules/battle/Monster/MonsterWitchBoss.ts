import {EmMonsterType} from "./MonsterBase";
import MonsterBossBase from "./MonsterBossBase";
import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import {AssetConst, BossConst, ConfigConst} from "../../../GameConst";
import MonsterWitchEntourageFire from "./MonsterWitchEntourageFire";
import MonsterWitchEntourageWater from "./MonsterWitchEntourageWater";
import MonsterWitchEntourageWind from "./MonsterWitchEntourageWind";
import LevelManager from "../../level/LevelManager";
import {CFG} from "../../../manager/ConfigManager";
import {SOUND, SoundConst} from "../../../manager/SoundManager";

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
//蜜蜂怪
export default class MonsterWitchBoss extends MonsterBossBase {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    attackNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Node)
    EntourageNode1: cc.Node = null;
    @property(cc.Node)
    EntourageNode2: cc.Node = null;
    @property(cc.Node)
    EntourageNode3: cc.Node = null;
    @property(sp.Skeleton) 
    bossSp:sp.Skeleton=null;

    private circleCenter: cc.Vec2 = cc.v2(0, 0);
    private circleRadius: number = 300;
    private carSpeed: number = 10;
    private radian: number = 0;
    private type:number = 0;

    onLoad () {
        this.schedule(this.circleMove, 0.02);
        this.bossSp.setCompleteListener(this.spineEventCompleteCallback.bind(this));
    }

    start () {

    }

    unuse(){
        this.EntourageNode1.removeAllChildren(true);
        this.EntourageNode2.removeAllChildren(true);
        this.EntourageNode3.removeAllChildren(true);
        super.unuse()
    }

    protected resetStart () {
        this.type = 0;
        this.MonsterType = EmMonsterType.Boss;
        this.monsterInfo = new MonsterInfo();
        var maxHp = parseInt(CFG.getCfgDataById(ConfigConst.BOSS, BossConst.MonsterWitchBossItem.toString())["monsterMaxHp"]) * LevelManager.getInstance().currentChapter;
        this.monsterInfo.parseData({monsterId: 1, monsterType: 1, monsterHp: maxHp, monsterMaxHp: maxHp});
        this.attackNode.removeAllChildren();
        this.skillNode.removeAllChildren();
        this.node.stopAllActions();
        this.attackNode.stopAllActions();
        this.skillNode.stopAllActions();
    }

    protected OnDeath() {

        super.OnDeath();
    }
    
    public playSkill () {
        //monsterSkill
    }

    public onlaunch () {
        this.node.setPosition(cc.v2(0, cc.winSize.height/2 + this.node.getContentSize().height/2));
        this.resetStart();
        let finish = cc.callFunc(()=>{
            this.bossAttack();
        }, this);
        let falling=cc.callFunc(()=>{
            SOUND.play(SoundConst.boss_queen_laugh);
            this.bossSp.setAnimation(1, "idle", false);
        }, this);
        let attack=cc.callFunc(()=>{
            this.attackAction();
            this.schedule(this.attackAction,10);
        }, this);
        this.node.runAction(cc.sequence(
            cc.delayTime(BossConst.BOSS_SHOW_DELAY_TIME),
            cc.spawn(cc.moveBy(2, cc.v2(0, -this.node.getContentSize().height-50)).easing(cc.easeQuadraticActionIn()),
                cc.sequence(cc.delayTime(1.5),falling)),
            finish,
            cc.delayTime(1),
            attack));
    }

    // update (dt) {
    //     if (this._inited == false) {
    //         return;
    //     }
    //     this.attackAction();
    // }

    private attackAction () {
        var i = this.EntourageNode1.children.length != 0?1:0;
        i+= this.EntourageNode2.children.length != 0?1:0;
        i+= this.EntourageNode3.children.length != 0?1:0;

        if(i >= 2){
            this.bossAttack()
        }else{
            if(this.type%3 == 0){
                if(this.EntourageNode1.children.length !=0){
                    return;
                }
                this.bossSp.setAnimation(1, "attack_1_begin", false);
                POOL.getPrefabFromPool(AssetConst.MonsterWitchEntourageItemFire,(node:cc.Node)=>{
                    node.parent = this.EntourageNode1;
                    node.setPosition(0,0);
                    let com = node.getComponent(MonsterWitchEntourageFire);
                    com.initLittleBoss();
                });
            }else if(this.type%3 == 1){
                if(this.EntourageNode2.children.length !=0){
                    return;
                }
                this.bossSp.setAnimation(1, "attack_3_begin", false);
                SOUND.play(SoundConst.boss_queen_water_appear);
                POOL.getPrefabFromPool(AssetConst.MonsterWitchEntourageItemWater,(node:cc.Node)=>{
                    node.parent = this.EntourageNode2;
                    node.setPosition(0,0);
                    let com = node.getComponent(MonsterWitchEntourageWater);
                });
            }
            else if(this.type%3 == 2){
                if(this.EntourageNode3.children.length !=0){
                    return;
                }
                this.bossSp.setAnimation(1, "attack_2_begin", false);
                POOL.getPrefabFromPool(AssetConst.MonsterWitchEntourageItemWind,(node:cc.Node)=>{
                    node.parent = this.EntourageNode3;
                    node.setPosition(0,0);
                    let com = node.getComponent(MonsterWitchEntourageWind);
                    com.initLittleBoss();
                });
            }
            this.type += 1;
        }

    }

    private circleMove (dt) {
        for(let i=0;i<3;i++){
            let radian = this.radian;
            this.radian -= dt * (this.carSpeed/100);
            radian += dt * (this.carSpeed/100) + Math.PI*i*2/3;
            let x = this.circleRadius * Math.cos(radian) + this.circleCenter.x; 
            let y = this.circleRadius * Math.sin(radian) + this.circleCenter.y;
            if(i==0){
                this.EntourageNode1.position = cc.v2(x, y);
            }else if(i==1){
                this.EntourageNode2.position = cc.v2(x, y);
            }else if(i==2){
                this.EntourageNode3.position = cc.v2(x, y);
            }
        }
    }

    /**
     * 动画完成，播放循环idle动画
     */
    private spineEventCompleteCallback(trackEntry) {
        var name: string = trackEntry.animation.name;
        var index = name.lastIndexOf("_");
        if (index != -1) {
            var prefix = name.substring(0, index);
            var action = name.substring(index + 1);
            if (action == "begin") {
                this.bossSp.setAnimation(1, prefix + "_loop", true);
            }
            else if (trackEntry.animation.name == "loop") {
                this.bossSp.setAnimation(1, prefix + "_end", true);
            } else {
                this.bossSp.setAnimation(1, "idle", true);
            }
        }

    }

    /**
     * 攻击动画
     */
    private bossAttack(){
        //if(this.EntourageNode1.children.length==0||this.EntourageNode2.children.length ==0||this.EntourageNode3.children.length==0){
        this.bossSp.setAnimation(1, "attack_4_begin", false);
        //}
        console.log("攻击小怪数量"+this.EntourageNode1.children.length+"____"+this.EntourageNode2.children.length+"____"+this.EntourageNode3.children.length)
    }

    protected deathSound() {
        SOUND.play(SoundConst.boss_queen_death)
    }
}
