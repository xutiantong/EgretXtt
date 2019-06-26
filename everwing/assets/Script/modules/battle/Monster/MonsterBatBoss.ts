import {EmMonsterType} from "./MonsterBase";
import MonsterBossBase, {choose, rollFloat} from "./MonsterBossBase";
import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import {AssetConst, BossConst, ConfigConst} from "../../../GameConst";
import {BM} from "../BattleManager";
import EnemyBulletItem from "../EnemyBulletItem";
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

var extCfg = {
    health: 5e3,
    speed: 1,
    special: 1,
    attackCountMin: 2,
    attackCountMax: 15,
    attackCountPerSpecialPt: 1.5,
    breathOffsetX: 0,
    breathOffsetY: 40,
    breathBounceSpecialPtRequirement: 6,
    breathBounceChance: .5,
    breathAngleRange: Math.PI / 9,
    breathBounceAngleRange: Math.PI / 3,
    breathScaleMin: 0.8,//.6,
    breathScaleMax: 1.4,//1.1,
    breathBounceScaleMin: .6,
    breathBounceScaleMax: .9,
    breathSpeedMin: .2,
    breathSpeedMax: .9,
    breathSpeedPerSpeedPt: .05,
    breathAnimationTotalFrames: 13,
    breathAnimationDelayFrames: 7,
    staffOffsetX: -150,
    staffOffsetY: 180,
    staffScaleMin: 1,//.6,
    staffScaleMax: 1.4,//.9,
    staffScalePerSpecialPt: .02,
    staffSpeedMin: .4,
    staffSpeedMax: 1.1,
    staffSpeedPerSpeedPt: .05,
    staffAnimationTotalFrames: 15,
    staffAnimationDelayFrames: 6,
    staffTailLength: 5,
    staffTailDelayNumerator: 1440,
    staffTailDelayFactor: .85,
    staffTailScaleFactor: .65,
    fpsMin: 24,
    fpsMax: 60,
    fpsPerSpeedPt: .5
};

var bgHeight = cc.winSize.height;
@ccclass
export default class MonsterBatBoss extends MonsterBossBase {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    attackNode: cc.Node = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(sp.Skeleton)
    bossSp: sp.Skeleton = null;

    private _direction: number = -1;//-1为左，1为右
    private _speed: number = 1;
    private _attackTime: number = 2;

    // onLoad () {}

    start() {

    }

    onLoad() {
        this.bossSp.setCompleteListener(this.spineEventCompleteCallback.bind(this));
    }

    unuse() {
        this.unscheduleAllCallbacks();
        super.unuse()
    }

    protected resetStart() {
        this.MonsterType = EmMonsterType.Boss;
        this.monsterInfo = new MonsterInfo();
        var maxHp = parseInt(CFG.getCfgDataById(ConfigConst.BOSS, "1")["monsterMaxHp"]) * LevelManager.getInstance().currentChapter;
        this.monsterInfo.parseData({monsterId: 1, monsterType: 1, monsterHp: maxHp, monsterMaxHp: maxHp});
        this.attackNode.removeAllChildren();
        this.skillNode.removeAllChildren();
        this.node.stopAllActions();
        this.attackNode.stopAllActions();
        this.skillNode.stopAllActions();
        console.log("bosslevel:" + this.bossLevel)
    }

    protected OnDeath() {
        super.OnDeath();
    }

    public playSkill() {
        //monsterSkill
    }

    public onlaunch() {
        this.node.setPosition(cc.v2(0, cc.winSize.height / 2 + this.node.getContentSize().height / 2));
        this.resetStart();
        this.show();

    }

    //开场动画
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

    get bossLevel(): number {
        return LevelManager.getInstance().currentChapter;
    }

    get attackCount(): number {
        return Math.min(extCfg.attackCountMax, extCfg.attackCountMin * this.bossLevel)
    }

    get breathScale(): number {
        return rollFloat(extCfg.breathScaleMin, extCfg.breathScaleMax)
    }

    get breathSpeed(): number {
        var e = extCfg.breathSpeedPerSpeedPt * extCfg.speed * this.bossLevel * Math.random();
        return Math.min(extCfg.breathSpeedMax, extCfg.breathSpeedMin + e)
    }

    get staffScale(): number {
        var e = extCfg.staffScaleMin + extCfg.staffScalePerSpecialPt * this.bossLevel;
        return Math.min(extCfg.staffScaleMax, e)
    }

    //更新行为
    public updateBehavior() {
        this.runNextAction();
    }

    public runNextAction() {
        this[choose(["breathAttack", "staffAttack", "mixedAttack"])]()
        // this[choose(["staffAttack"])]()
    }

    mixedAttack = function () {
        var e = this.attackCount;
        var dir = Math.random() < .5 ? -1 : 1;
        this.node.stopAllActions();
        var delayTime = 0;
        for (var a = 0; a < e; a++) {
            if ("breathAttack" === choose(["breathAttack", "staffAttack"])) {
                this.queueBreathAttack(dir, delayTime);
                dir *= -1;
                delayTime += 0.9;
            } else {
                this.queueStaffAttack(delayTime);
                delayTime += 0.1 * extCfg.staffTailLength
            }
        }
        delayTime += 1;
        this.scheduleNext(delayTime)

    };

    scheduleNext(delayTime: number) {
        var self = this;
        var fun: () => void = () => self.updateBehavior();
        this.scheduleOnce(fun, delayTime);
    }


    breathAttack = function () {
        var cnt = this.attackCount;
        var dir = Math.random() < .5 ? -1 : 1;
        var delayTime = 0;
        this.node.stopAllActions();
        for (var o = 0; o < cnt; o++) {
            this.queueBreathAttack(dir, delayTime);
            dir *= -1;
            delayTime += 0.9;
        }
        delayTime += 2 * 0.9;
        this.scheduleNext(delayTime)
    };

    queueBreathAttack = function (dir, delay) {
        var t = this;
        let times = delay;
        this.node.runAction(cc.sequence(
            cc.delayTime(times),
            this.playAnimation("attack_2"),
            cc.callFunc(() => SOUND.play(SoundConst.boss_king_burp)),
            cc.callFunc(() => {
                t.fireBreathBullet(dir)
            })
        ))
    };
    fireBreathBullet = function (dir: number) {
        console.log("fireBreathBullet " + dir);
        let fireBullet = cc.callFunc(() => {
            //speed
            var speed: number = this.breathSpeed;
            var angle: number = Math.random() * extCfg.breathAngleRange * dir;
            //scale
            var scale = this.breathScale;
            POOL.getPrefabFromPool(AssetConst.EnemyBulletItem, (node: cc.Node) => {
                node.parent = this.skillNode;
                node.position = cc.v2(extCfg.breathOffsetX, extCfg.breathOffsetY);
                var p = node.convertToNodeSpaceAR(cc.v2(0, 0));
                // node.active = false;
                let endPos = cc.v2(-p.y * Math.tan(angle), p.y);
                let time = endPos.mag() / 400;
                let item = node.getComponent(EnemyBulletItem);
                item.onlaunch(cc.v2(endPos.x, endPos.y), time, scale);
            })
        });

        //攻击动画
        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            fireBullet
        ))
    };

    playAnimation(animation: string) {
        let bossAngry = cc.callFunc(() => {
            this.bossSp.setAnimation(1, animation, false);
        }, this);
        return bossAngry;
    }

    staffAttack = function () {
        var e = this.attackCount;
        var delayTime = 0;
        this.node.stopAllActions();
        for (var n = 0; n < e; n++) {
            this.queueStaffAttack(delayTime);
            delayTime += 0.1 * extCfg.staffTailLength
        }
        delayTime += 1;
        this.scheduleNext(delayTime)
    };

    //拖尾长球
    queueStaffAttack = function (delay) {
        var t = this;
        let time = delay;
        this.node.runAction(cc.sequence(
            cc.delayTime(delay),
            this.playAnimation("attack_1"),
            cc.callFunc(() => {
                t.fireStaffBullet()
            })
        ))
    };

    fireStaffBullet = function () {
        console.log("fireStaffBullet ");
        var actions = [];
        for (var c = 0; c < extCfg.staffTailLength; c++) {
            let i = c;
            let delay = 0.1 * Math.pow(extCfg.staffTailDelayFactor, i);
            var worldPoint = BM.getMainRoleNodePos();
            var point = this.skillNode.convertToNodeSpaceAR(cc.v2(worldPoint.x, 0));
            point = cc.v2(point.x, point.y);
            var time = Math.sqrt(point.x * point.x + point.y * point.y) / 400;
            actions.push(cc.callFunc(() => SOUND.play(SoundConst.boss_king_attack)));
            actions.push(cc.delayTime(delay));
            actions.push(cc.callFunc(() => {
                //scale
                var scale = this.staffScale * Math.pow(extCfg.staffTailScaleFactor, i);
                POOL.getPrefabFromPool(AssetConst.EnemyBulletItem, (node: cc.Node) => {
                    node.parent = this.skillNode;
                    node.setLocalZOrder(0 - i);
                    node.position = cc.v2(extCfg.staffOffsetX, extCfg.staffOffsetY);
                    // node.active = false;
                    let item = node.getComponent(EnemyBulletItem);
                    item.onlaunch(cc.v2(point.x, point.y), time, scale);
                })
            }));
        }
        this.node.runAction(cc.sequence(actions))
    };


    /**
     * 动画完成，播放循环idle动画
     */
    private spineEventCompleteCallback(trackEntry) {
        if (trackEntry.animation.name != "idle") {
            this.bossSp.setAnimation(1, "idle", true);
        }
    }

    protected deathSound() {
        SOUND.play(SoundConst.boss_king_death)
    }
}
