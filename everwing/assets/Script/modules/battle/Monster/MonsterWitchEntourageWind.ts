import MonsterBase, {EmMonsterType} from "./MonsterBase";
import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import {AssetConst, ConfigConst, EntourageConst} from "../../../GameConst";
import EnemyBulletItem from "../EnemyBulletItem";
import LevelManager, {LEVELMG} from "../../level/LevelManager";
import {CFG} from "../../../manager/ConfigManager";
import {rollFloat} from "./MonsterBossBase";
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
    slowHomingDelayFrames: 17,
    slowHomingSpeedMin: .2,
    slowHomingSpeedMax: .25,
    slowHomingSpeedPerSpeedPt: .004,
    slowHomingAngleOffset: Math.PI / 2,
    slowHomingAngleMin: -Math.PI / 16,
    slowHomingAngleMax: Math.PI / 16,
    slowHomingScaleMin: .85,
    slowHomingScaleMax: 1.15,
    slowHomingScalePerSpecialPt: .015,

    minionAttackDelayInitial: 5e3,
    minionAttackDelayMin: 3500,
    minionAttackDelayPerSpeedPt: -100,
};
@ccclass
export default class MonsterWitchEntourageWind extends MonsterBase {
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
        SOUND.play(SoundConst.boss_queen_wind_appear);
        this._bosshp = parseInt(CFG.getCfgDataById(ConfigConst.BOSS, EntourageConst.Wind.toString())["monsterMaxHp"]) * LevelManager.getInstance().currentChapter;
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
        var fire = cc.callFunc(() => {
            let pos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            this.fireBullet("leaf", pos.x, pos.y, this.slowHomingSpeed, this.slowHomingAngle, this.slowHomingScale, true)
        });
        this.bossSp.setAnimation(1, "attack", false);
        SOUND.play(SoundConst.boss_queen_wind_attack);
        this.node.runAction(cc.sequence(
            fire,
            cc.delayTime(this.slowHomingDelay / 1000),
            fire,
            cc.delayTime(this.minionAttackCooldown / 1000),
            cc.callFunc(() => this.attackAction())
        ));
    }

    private fireBullet(t: string, x, y, speed, angle, scale, c) {
        //计算加速度
        var s = Math.cos(angle) * speed;
        var r = Math.sin(angle) * speed;
        POOL.getPrefabFromPool(AssetConst.EnemyBullet5Item, (node: cc.Node) => {
            node.parent = this.node.parent.parent.getChildByName("skillNode");
            let l = node.getComponent(EnemyBulletItem);
            l.reset(t);
            l.x = x;
            l.y = y;
            l.vx = -s;
            l.vy = -r;
            l.scale = scale;
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

    get slowHomingDelay() {
        return cfg.slowHomingDelayFrames * 1e3 / 30
    }

    get slowHomingAngle() {
        var e = rollFloat(cfg.slowHomingAngleMin, cfg.slowHomingAngleMax);
        return cfg.slowHomingAngleOffset + e
    }

    get slowHomingScale() {
        var e = cfg.slowHomingScaleMin + cfg.slowHomingScalePerSpecialPt * this.special;
        return Math.min(cfg.slowHomingScaleMax, e)
    }

    get slowHomingSpeed() {
        var e = cfg.slowHomingSpeedMin + cfg.slowHomingSpeedPerSpeedPt * this.speed;
        return Math.min(cfg.slowHomingSpeedMax, e)
    }
}
