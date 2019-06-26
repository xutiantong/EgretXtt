import MonsterBase, {EmMonsterType} from "./MonsterBase";
import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import {AssetConst, ConfigConst, EntourageConst} from "../../../GameConst";
import EnemyBulletItem from "../EnemyBulletItem";
import {CFG} from "../../../manager/ConfigManager";
import LevelManager, {LEVELMG} from "../../level/LevelManager";
import {rollFloat, rollInt} from "./MonsterBossBase";
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

var cfg = {
    tossUpCountPerSpecialPtMin:1.25,
    tossUpCountPerSpecialPtMax:2,
    tossUpCountMin:4,
    tossUpCountMax: 10,
    tossUpSpeedMin: .25,
    tossUpSpeedMax: .45,
    tossUpGravity: 4e-4,
    tossUpHorzDrag: -2e-4,
    tossUpAngleOffset: -Math.PI / 2,
    tossUpAngleMin: -Math.PI / 6,
    tossUpAngleMax: Math.PI / 6,
    tossUpScaleMin: .5,
    tossUpScaleMax: 1.05,
    tossUpScalePerSpecialPt: .01,
    tossUpScaleOffsetMin: 0,
    tossUpScaleOffsetMax: .4,


    minionAttackDelayInitial: 5e3,
    minionAttackDelayMin: 3500,
    minionAttackDelayPerSpeedPt: -100,
};

@ccclass
export default class MonsterWitchEntourageWater extends MonsterBase {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    attackNode: cc.Node = null;
    private _bosshp:number=100;

    @property(sp.Skeleton)
    bossSp: sp.Skeleton = null;

    onLoad() {
        this.bossSp.setCompleteListener(this.spineEventCompleteCallback.bind(this));
    }

    private spineEventCompleteCallback(trackEntry) {
        if (trackEntry.animation.name != "idle") {
            this.bossSp.setAnimation(1, "idle", true);
        }
    }

    start () {

    }

    /**
     * 初始化小怪
     */
    public initLittleBoss(){
        this._bosshp = parseInt(CFG.getCfgDataById(ConfigConst.BOSS, EntourageConst.Water.toString())["monsterMaxHp"]) * LevelManager.getInstance().currentChapter;
        this.onlaunch();
    }

    protected resetStart () {
        this.MonsterType = EmMonsterType.Entourage;
        this.monsterInfo = new MonsterInfo();
        this.monsterInfo.parseData({monsterId: 2, monsterType: 2, monsterHp: this._bosshp, monsterMaxHp: this._bosshp});
        this.attackNode.removeAllChildren();
        this.node.stopAllActions();
        this.attackNode.stopAllActions();
    }

    public create () {
        super.create();
    }

    protected OnDeath() {
        super.OnDeath();
    }
    
    public playSkill () {
        //monsterSkill
    }

    public onlaunch () {
        this.resetStart();
        SOUND.play(SoundConst.boss_queen_water_appear);
        this.node.runAction(cc.sequence(
            cc.delayTime(this.minionAttackCooldown / 1000),
            cc.callFunc(() => this.attackAction())
        ))
    }

    // update (dt) {
    //     if (this._inited == false) {
    //         return;
    //     }
    //     this.attackAction();
    // }

    private attackAction () {
        this.bossSp.setAnimation(1, "attack", false);
        SOUND.play(SoundConst.boss_queen_water_attack);
        var cnt = this.tossUpCount;
        for(var i = 0 ; i < cnt; i++){
            let pos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            this.fireBullet("water", pos.x, pos.y, this.tossUpSpeed, this.tossUpAngle, this.tossUpScale, 0, this.tossUpGravity, false)
        }
        this.node.runAction(cc.sequence(
            cc.delayTime(this.minionAttackCooldown / 1000),
            cc.callFunc(() => this.attackAction())
        ));
    }

    private fireBullet(t: string, x, y, speed, angle, scale, ax, ay, c) {
        //计算加速度
        var s = Math.cos(angle) * speed;
        var r = Math.sin(angle) * speed;
        POOL.getPrefabFromPool(AssetConst.EnemyBullet4Item, (node: cc.Node) => {
            node.parent = this.node.parent.parent.getChildByName("skillNode");
            let l = node.getComponent(EnemyBulletItem);
            l.reset(t);
            l.x = x;
            l.y = y;
            l.vx = -s;
            l.vy = -r;
            l.scale = scale;
            l.ax = -(ax || ay ? cfg.tossUpHorzDrag * -l.vx : 0);
            l.ay = -ay;
            l.isHoming = c;
            l.syncPos()
        })
    }


    get minionAttackCooldown() {
        var e = cfg.minionAttackDelayInitial + cfg.minionAttackDelayPerSpeedPt * this.speed;
        return Math.max(cfg.minionAttackDelayMin, e)
    }

    get speed() {
        return LEVELMG.currentChapter;
    }

    get special() {
        return LEVELMG.currentChapter;
    }

    get tossUpCount() {
        var special = LEVELMG.currentChapter;
        var e = Math.floor(cfg.tossUpCountPerSpecialPtMin * special), t = Math.floor(cfg.tossUpCountPerSpecialPtMax * special);
        var i = rollInt(e, t);
        return Math.max(cfg.tossUpCountMin, Math.min(cfg.tossUpCountMax, i))
    }

    get tossUpAngle() {
        var e = rollFloat(cfg.tossUpAngleMin, cfg.tossUpAngleMax);
        return cfg.tossUpAngleOffset + e
    }

    get tossUpScale() {
        var e = cfg.tossUpScaleMin + cfg.tossUpScalePerSpecialPt * this.special;
        var t = rollFloat(cfg.tossUpScaleOffsetMin, cfg.tossUpScaleOffsetMax);
        return Math.min(cfg.tossUpScaleMax, e + t)
    }

    get tossUpGravity() {
        return cfg.tossUpGravity
    }

    get tossUpSpeed() {
        return rollFloat(cfg.tossUpSpeedMin, cfg.tossUpSpeedMax)
    }
}
