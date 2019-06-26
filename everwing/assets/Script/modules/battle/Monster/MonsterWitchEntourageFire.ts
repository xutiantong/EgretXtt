import MonsterBase, {EmMonsterType} from "./MonsterBase";
import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import {AssetConst, ConfigConst, EntourageConst} from "../../../GameConst";
import EnemyBulletItem from "../EnemyBulletItem";
import LevelManager, {LEVELMG} from "../../level/LevelManager";
import {CFG} from "../../../manager/ConfigManager";
import MainRole from "../MainRole";
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
    fastAimedDelayFrames: 8,
    fastAimedOffsetY: 35,
    fastAimedSpeedMin: .3,
    fastAimedSpeedMax: .5,
    fastAimedSpeedPerSpeedPt: .015,
    fastAimedScaleMin: .7,
    fastAimedScaleMax: .9,
    fastAimedScalePerSpecialPt: .01,

    minionAttackDelayInitial: 5e3,
    minionAttackDelayMin: 3500,
    minionAttackDelayPerSpeedPt: -100,
};

@ccclass
export default class MonsterWitchEntourageFire extends MonsterBase {
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
        this._bosshp = parseInt(CFG.getCfgDataById(ConfigConst.BOSS, EntourageConst.Fire.toString())["monsterMaxHp"]) * LevelManager.getInstance().currentChapter;
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
        SOUND.play(SoundConst.boss_queen_fire_appear);
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
        this.bossSp.setAnimation(1, "attack_3", false);
        var fire = cc.callFunc(() => {
            SOUND.play(SoundConst.boss_queen_fire_attack);
            var playerPos = MainRole.Role.node.convertToWorldSpaceAR(cc.v2(0, 0));
            var curPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
            var endPos = cc.v2(curPos.x, curPos.y + cfg.fastAimedOffsetY);
            var angle = Math.atan2(endPos.y - playerPos.y, endPos.x - playerPos.x);
            this.fireBullet("fire", endPos.x, endPos.y, this.fastAimedSpeed, angle, this.fastAimedScale);
            console.info("fire")
        });
        var delay = this.fastAimedDelay / 1000;
        this.node.runAction(cc.sequence(
            cc.delayTime(delay), fire,
            cc.delayTime(delay), fire,
            cc.delayTime(delay), fire,
            cc.delayTime(delay), fire,
            cc.delayTime(this.minionAttackCooldown / 1000),
            cc.callFunc(() => this.attackAction())
        ));
    }

    private fireBullet(t: string, x, y, speed, angle, scale) {
        //计算加速度
        var s = Math.cos(angle) * speed;
        var r = Math.sin(angle) * speed;
        POOL.getPrefabFromPool(AssetConst.EnemyBullet3Item, (node: cc.Node) => {
            node.parent = this.node.parent.parent.getChildByName("skillNode");
            let l = node.getComponent(EnemyBulletItem);
            l.reset(t);
            l.x = x;
            l.y = y;
            l.vx = -s;
            l.vy = -r;
            l.scale = scale;
            l.syncPos();
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

    get fastAimedScale() {
        var e = cfg.fastAimedScaleMin + cfg.fastAimedScalePerSpecialPt * this.special;
        return Math.min(cfg.fastAimedScaleMax, e)
    }

    get fastAimedDelay() {
        return 1e3 * cfg.fastAimedDelayFrames / 30
    }

    get fastAimedSpeed() {
        var e = cfg.fastAimedSpeedMin + cfg.fastAimedSpeedPerSpeedPt * this.speed;
        return Math.min(cfg.fastAimedSpeedMax, e)
    }
}
