import {EmMonsterType} from "./MonsterBase";
import MonsterBossBase from "./MonsterBossBase";
import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import {AssetConst, BossConst, ConfigConst, ZERO} from "../../../GameConst";
import EnemyBulletItem from "../EnemyBulletItem";
import LevelManager from "../../level/LevelManager";
import {CFG} from "../../../manager/ConfigManager";
import {SOUND, SoundConst} from "../../../manager/SoundManager";
import FiniteTimeAction = cc.FiniteTimeAction;

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
    //
    scale: 1,
    health: 5e3,
    element: "nature",
    speed: 1,
    special: 1,
    //子弹参数
    bulletOffsetX: 0,
    bulletOffsetY: 30,
    bulletScale: .6,
    randomizedAttacksSpecialPtRequirement: 6,
    phaseRecoveryTime: 1250,
    //side攻击
    sideAttackCount: 4,
    sideBulletCountMin: 3,
    sideBulletCountMax: 8,
    sideSpeedMin: .2,
    sideSpeedMax: 1.3,
    sideSpeedPerSpeedPt: .1,
    sideAnimationTotalFrames: 36,
    sideAnimationDelayFrames: 10,
    sideRightAngleMin: 9 * Math.PI / 32,
    sideRightAngleMax: 17 * Math.PI / 32,
    sideLeftAngleMin: 15 * Math.PI / 32,
    sideLeftAngleMax: 23 * Math.PI / 32,
    //center攻击
    centerAttackCount: 3,
    centerBulletCountMin: 3,
    centerBulletCountMax: 6,
    centerSpeedMin: .2,
    centerSpeedMax: .6,
    centerSpeedPerSpeedPt: .03,
    centerAnimationTotalFrames: 36,
    centerAnimationDelayFrames: 10,
    centerSmallAngleMin: 10 * Math.PI / 32,
    centerSmallAngleMax: 22 * Math.PI / 32,
    centerLargeAngleMin: 9 * Math.PI / 32,
    centerLargeAngleMax: 23 * Math.PI / 32,

    fpsMin: 24,
    fpsMax: 60,
    fpsPerSpeedPt: .5
};

var behaviors = ["sideAttack", "centerAttack"];
@ccclass
export default class MonsterTreeBoss extends MonsterBossBase {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    attackNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(sp.Skeleton)
    bossSp: sp.Skeleton = null;

    private attackIndex: number = 0;

    onLoad() {
        this.bossSp.setCompleteListener(this.spineEventCompleteCallback.bind(this));
    }

    start() {

    }

    protected resetStart() {
        this.MonsterType = EmMonsterType.Boss;
        this.monsterInfo = new MonsterInfo();
        var maxHp = parseInt(CFG.getCfgDataById(ConfigConst.BOSS, "2")["monsterMaxHp"]) * LevelManager.getInstance().currentChapter;
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

    public playSkill() {
        //monsterSkill
    }

    get sideBulletDelay(): number {
        return 1e3 * cfg.sideAnimationDelayFrames / this.fpsNormal / 1000
    }

    get sideStartDelay() {
        return 1e3 * cfg.sideAnimationTotalFrames / this.fpsNormal / 1000
    }

    get sideBulletCount() {
        var e = Math.floor(cfg.sideBulletCountMin + this.special);
        return Math.min(cfg.sideBulletCountMax, e)
    }

    get sideBulletSpeed() {
        var e = cfg.sideSpeedMin + cfg.sideSpeedPerSpeedPt * this.speed;
        return Math.min(cfg.sideSpeedMax, e)
    }

    get centerBulletCount() {
        var e = Math.floor(cfg.centerBulletCountMin + this.special);
        return Math.min(cfg.centerBulletCountMax, e)
    }

    get centerBulletDelay() {
        return 1e3 * cfg.centerAnimationDelayFrames / this.fpsNormal / 1000
    }

    get centerBulletSpeed() {
        var e = cfg.centerSpeedMin + cfg.centerSpeedPerSpeedPt * this.speed;
        return Math.min(cfg.centerSpeedMax, e)
    }

    get centerStartDelay() {
        return 1e3 * cfg.centerAnimationTotalFrames / this.fpsNormal / 1000
    }

    public onlaunch() {
        this.node.setPosition(cc.v2(0, cc.winSize.height / 2 + this.node.getContentSize().height / 2));
        this.resetStart();
        this.show()
    }

    public show() {

        let self = this;
        let finish = cc.callFunc(() => {
            self.updateBehavior();
        }, this);
        //
        let falling = cc.callFunc(() => {
            this.bossSp.setAnimation(1, "idle", false);
        });
        this.node.runAction(
            cc.sequence(
                cc.delayTime(BossConst.BOSS_SHOW_DELAY_TIME),
                cc.spawn(
                    cc.moveBy(3, cc.v2(0, -this.node.getContentSize().height - 50)).easing(cc.easeQuadraticActionIn()),
                    cc.sequence(cc.delayTime(3), falling, cc.delayTime(1.5))
                ),
                finish
            )
        );
    }

    //更新行为
    public updateBehavior() {
        this.runNextAction();
    }

    public runNextAction() {

        var behavior = behaviors[this.attackIndex++];
        this.attackIndex >= behaviors.length && (this.attackIndex = 0);
        this[behavior]()
        // this[choose(["staffAttack"])]()
    }

    sideAttack = function () {
        this.queueAttacks(["leftAttack", "rightAttack"], cfg.sideAttackCount, this.sideStartDelay)
    };

    queueAttacks = function (behavior: string[], attackCount, startDelay) {
        this.node.stopAllActions();
        var o = cfg.phaseRecoveryTime / 1000;
        var a = Math.floor(Math.random() * behavior.length);
        var queue: FiniteTimeAction[] = [];
        for (var s = 0; s < attackCount; s++) {
            queue = queue.concat(this[behavior[a]](startDelay));
            o += startDelay;
            if (this.shouldRandomizeAttacks) {
                a = Math.floor(Math.random() * behavior.length)
            } else {
                a = (a + 1) % behavior.length
            }
        }
        queue.push(cc.delayTime(o));
        queue.push(cc.callFunc(() => this.runNextAction()));
        this.node.runAction(cc.sequence(queue))
    };

    private leftAttack(e: number): FiniteTimeAction[] {
        var queue = [];
        queue.push(this.animation("attack_1"));
        //animation
        queue.push(cc.delayTime(this.sideBulletDelay / 2));
        //playSound
        queue.push(cc.callFunc(() => SOUND.play(SoundConst.boss_tree_attack_1)));
        queue.push(cc.delayTime(this.sideBulletDelay / 2));
        //fire
        queue = queue.concat(this.fireSpreadShot(this.sideBulletCount, this.sideBulletSpeed, cfg.sideLeftAngleMin, cfg.sideLeftAngleMax));
        queue.push(cc.delayTime(e - this.sideBulletDelay));
        return queue;
    }

    private rightAttack(e: number): FiniteTimeAction[] {
        var queue = [];
        queue.push(this.animation("attack_2"));
        //animation
        queue.push(cc.delayTime(this.sideBulletDelay / 2));
        //playSound
        queue.push(cc.callFunc(() => SOUND.play(SoundConst.boss_tree_attack_1)));
        queue.push(cc.delayTime(this.sideBulletDelay / 2));
        //fire
        queue = queue.concat(this.fireSpreadShot(this.sideBulletCount, this.sideBulletSpeed, cfg.sideRightAngleMin, cfg.sideRightAngleMax));
        queue.push(cc.delayTime(e - this.sideBulletDelay));
        return queue;
    }

    centerAttack = function () {
        this.queueAttacks(["smallCenterAttack", "largeCenterAttack"], cfg.centerAttackCount, this.centerStartDelay)
    };

    smallCenterAttack = function (e) {
        var queue = [];
        queue.push(this.animation("attack_3"));
        //animation
        queue.push(cc.delayTime(this.centerBulletDelay / 2));
        //playSound
        queue.push(cc.callFunc(() => SOUND.play(SoundConst.boss_tree_attack_2)));
        queue.push(cc.delayTime(this.centerBulletDelay / 2));
        //fire
        queue = queue.concat(this.fireSpreadShot(this.centerBulletCount - 1, this.centerBulletSpeed, cfg.centerSmallAngleMin, cfg.centerSmallAngleMax));
        queue.push(cc.delayTime(e - this.sideBulletDelay));
        return queue;
    };

    largeCenterAttack = function (e) {
        var queue = [];
        queue.push(this.animation("attack_3"));
        //animation
        queue.push(cc.delayTime(this.centerBulletDelay / 2));
        //playSound
        queue.push(cc.delayTime(this.centerBulletDelay / 2));
        //fire
        queue = queue.concat(this.fireSpreadShot(this.centerBulletCount, this.centerBulletSpeed, cfg.centerLargeAngleMin, cfg.centerLargeAngleMax));
        queue.push(cc.delayTime(e - this.sideBulletDelay));
        return queue;
    };

    //count speed anglemin anglemax
    private fireSpreadShot(cnt: number, speed: number, angleMin: number, angleMax: number): FiniteTimeAction[] {
        var queue: FiniteTimeAction[] = [];
        var min = Math.min(angleMin, angleMax);
        var max = Math.max(angleMin, angleMax);
        var angle = (max - min) / (cnt - 1);
        for (var c = 0; c < cnt; c++) {
            let u = min + angle * c;
            let fireBullet = cc.callFunc(() => {
                POOL.getPrefabFromPool(AssetConst.EnemyBulletTreeItem, (node: cc.Node) => {
                    node.parent = this.skillNode;
                    var p = node.convertToNodeSpaceAR(cc.v2(0, 0));
                    // node.active = false;
                    let item = node.getComponent(EnemyBulletItem);
                    console.log(u);
                    let pos = cc.pRotateByAngle(cc.v2(0, -cc.winSize.height), ZERO, cc.degreesToRadians(90 - u * 180 / Math.PI));

                    let time = (pos.mag() / speed) / 1000;
                    item.onlaunch(cc.v2(pos.x, pos.y), time, cfg.bulletScale);
                })
            });
            queue.push(fireBullet);
        }
        return queue;
    }

    private animation(name: string) {
        return cc.callFunc(() => {
            this.bossSp.setAnimation(1, name, false);
        }, this);
    }

    private spineEventCompleteCallback(trackEntry) {
        if (trackEntry.animation.name != "idle") {
            this.bossSp.setAnimation(1, "idle", true);
        }
    }

    protected deathSound() {
        SOUND.play(SoundConst.boss_tree_death)
    }
}
