import {EmMonsterState, EmMonsterType} from "./MonsterBase";
import MonsterBossBase, {rollFloat, rollInt} from "./MonsterBossBase";
import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import {AssetConst, BossConst, ConfigConst} from "../../../GameConst";
import {PANEL} from "../../../manager/PanelManager";
import Timer from "./Timer";
import {bgWidth} from "../Enitiy/MonsterEntity";
import {CFG} from "../../../manager/ConfigManager";
import LevelManager from "../../level/LevelManager";
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
var bgHeight = cc.winSize.height;
var cfg = {
    scale: 1,
    health: 2500,
    element: "toxic",
    speed: 1,
    special: 1,
    splitCount: 3,
    splitTime: 50,
    scaleInitial: 1,
    scaleFinal: .2,
    horzMovementSpecialPtRequirement: 6,
    horzMovementSpeedPercentMin: .5,
    horzMovementSpeedPercentMax: 1.5,
    horzMovementSpeedPerSpeedPt: .0085,
    horzMovementSpeedMin: .05,
    horzMovementSpeedMax: .18,
    chargeChanceMin: .5,
    chargeChanceMax: .75,
    chargeChancePerSpecialPt: .0125,
    chargeSpeedMin: .2,
    chargeSpeedMax: .5,
    chargeSpeedPerSpeedPt: .025,
    chargeRetryDelayInitial: 2e3,
    chargeRetryDelayMin: 250,
    chargeRetryDelayPerSpeedPt: -125,
    bounceRecoverDelayInitial: 7e3,
    bounceRecoverDelayMin: 3e3,
    bounceRecoverDelayPerSpeedPt: -250,
    delayOffsetMin: 0,
    delayOffsetMax: 2500,
    bounceOffsetY: -175,
    bounceRecoverOffsetYMin: 0,
    bounceRecoverOffsetYMax: bgHeight / 2,
    bounceRecoverOffsetYPerSpecialPt: 32,
    creepSpeedMin: .03,
    creepSpeedMax: .06,
    creepSpeedPerSpeedPt: .002,
    creepTimeInitial: 2e3,
    creepTimeMin: 1750,
    creepTimePerSpeedPt: -25,
    creepTimeOffsetMin: 0,
    creepTimeOffsetMax: 800,
    recoilSpeedMin: -.2,
    recoilSpeedMax: -.1,
    recoilSpeedPerSpeedPt: .02,
    splitRecoverDelayInitial: 4e3,
    splitRecoverDelayMin: 2e3,
    splitRecoverDelayPerSpeedPt: -250,
    splitCreepTimeInitial: 1500,
    splitCreepTimeMin: 500,
    splitCreepTimePerSpeedPt: -80,
    raidStartSplitDelayInitial: 2e3,
    raidStartSplitDelayMin: 1e3,
    raidStartSplitDelayPerSpeedPt: -50,
    raidStartSplitDelayOffsetMin: 0,
    raidStartSplitDelayOffsetMax: 3e3,
    raidStartOffsetYMin: -1e3,
    raidStartOffsetYMax: 0,
    fpsMin: 24,
    fpsMax: 60,
    fpsPerSpeedPt: .5
};
var splitKill = 0;

@ccclass
export default class MonsterSplitBoss extends MonsterBossBase {
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    @property(sp.Skeleton) bossSp: sp.Skeleton = null;

    private x: number = 0;
    private y: number = 0;
    private vx: number = 0;
    private vy: number = 0;
    private ax: number = 0;
    private ay: number = 0;

    private scale: number = 1;
    private splitIndex: number = 0;
    private vxCharge: number = 0;
    private isSplitting: boolean = false;
    private isBouncing: boolean = false;
    private shouldUpdateSpeed: boolean = false;

    private isReady: boolean = false;
    private actionTimer: Timer = new Timer();
    private chargeAnim: boolean = false;

    private ccMove: boolean = false;

    get creepSpeed() {
        var e = cfg.creepSpeedMin + cfg.creepSpeedPerSpeedPt * this.speed;
        return Math.min(cfg.creepSpeedMax, e)
    }

    get creepTime() {
        var e = cfg.creepTimeInitial,
            t = cfg.creepTimePerSpeedPt * this.speed,
            i = rollInt(cfg.creepTimeOffsetMin, cfg.creepTimeOffsetMax);
        return Math.max(cfg.creepTimeMin, e + t + i)
    }

    get chargeChance() {
        var e = cfg.chargeChanceMin + cfg.chargeChancePerSpecialPt * this.special;
        return Math.min(cfg.chargeChanceMax, e)
    }

    get shouldMoveHorizontally() {
        return this.special >= cfg.horzMovementSpecialPtRequirement
    }

    get shouldCharge() {
        return (this.shouldMoveHorizontally || this.scale < 1) && Math.random() <= this.chargeChance
    }

    get recoilSpeed() {
        var e = cfg.recoilSpeedMin + cfg.recoilSpeedPerSpeedPt * this.speed;
        return Math.min(cfg.recoilSpeedMax, e)
    }

    get chargeRetryDelay() {
        var t = cfg.chargeRetryDelayPerSpeedPt * this.speed;
        var i = rollInt(cfg.delayOffsetMin, cfg.delayOffsetMax);
        var n = this.scale * (cfg.chargeRetryDelayInitial + t + i);
        return Math.max(cfg.chargeRetryDelayMin, n)
    }

    get chargeSpeed() {
        var e = cfg.chargeSpeedMin + cfg.chargeSpeedPerSpeedPt * this.speed;
        return Math.min(cfg.chargeSpeedMax, e)
    }

    get horizontalSpeed() {
        var e = 0;
        if (this.shouldMoveHorizontally) {
            e = rollFloat(cfg.horzMovementSpeedPercentMin, cfg.horzMovementSpeedPercentMax) *
                (cfg.horzMovementSpeedMin + cfg.horzMovementSpeedPerSpeedPt * this.speed)
        }
        return Math.min(cfg.horzMovementSpeedMax, e)
    }

    get bounceRecoverOffsetY() {
        var e = cfg.bounceRecoverOffsetYMin;
        var t = cfg.bounceRecoverOffsetYPerSpecialPt * this.special;
        var i = Math.min(cfg.bounceRecoverOffsetYMax, e + t);
        return rollFloat(e, i)
    }

    get splitRecoverDelay() {
        var e = cfg.splitRecoverDelayInitial;
        var t = cfg.splitRecoverDelayPerSpeedPt * this.speed;
        var i = rollInt(cfg.delayOffsetMin, cfg.delayOffsetMax);
        var n = this.scale * (e + t + i);
        return Math.max(cfg.splitRecoverDelayMin, n)
    }

    getScale(cnt: number) {
        var O = (cfg.scaleFinal - cfg.scaleInitial) / (cfg.splitCount + 1);
        return cfg.scaleInitial + cnt * O;
    }

    start() {
    }

    onLoad() {
        //this.bossSp.setCompleteListener(this.spineEventCompleteCallback.bind(this));
    }

    public onlaunch() {
        splitKill = 0;
        this.node.setPosition(cc.v2(0, cc.winSize.height / 2 + this.node.getContentSize().height / 2));
        this.resetStart();
        this.show();

    }

    private syncPos() {
        this.x = this.node.getPositionX() + bgWidth / 2;
        this.y = this.node.getPositionY() + bgHeight / 2;
    }

    public show() {
        let self = this;
        let finish = cc.callFunc(() => {
            this.playerAnimation("idle");
            self.syncPos();
            self.isReady = true
        }, this);
        //
        this.node.runAction(
            cc.sequence(
                cc.delayTime(BossConst.BOSS_SHOW_DELAY_TIME),
                cc.spawn(
                    cc.moveBy(3, cc.v2(0, -this.node.getContentSize().height - 50)).easing(cc.easeQuadraticActionIn()),
                    cc.delayTime(3)
                ),
                finish
            )
        );
    }

    private step(dt: number): void {
        if (!this.isReady) {
            return
        }
        var t = dt * 1000;
        this.move(t);
        if (this.validateHealth() && this.validatePosition(t)) {
            this.updateBehavior(t)
        }
    }

    protected validateHealth() {
        return this.monsterInfo.MonsterHp > 0;
    }

    private validatePosition(dt: number) {
        //t 超出边界
        var t = false;
        var offsetX = this.node.width * this.scale / 2;
        if (this.x < offsetX) {
            this.x = offsetX;
            t = true
        } else if (this.x > bgWidth - offsetX) {
            this.x = bgWidth - offsetX;
            t = true
        }
        if (t) {
            //反方向
            if (this.chargeAnim) {
                this.chargeAnim = false;
                this.vx = -this.vxCharge
            } else {
                this.vx *= -1
            }
        }
        //爬回Y值 = 当前y+bgHeight-bounceOffsetY
        var yy = -cfg.bounceOffsetY;
        //不分裂 无爬回 并且当前y大于爬回Y值
        if (!this.isSplitting && !this.isBouncing && this.y < yy) {
            this.bounce()
        }
        return !(this.y >= bgHeight)

    }

    //移动
    private move(e: number) {
        if (this.vx == 0 && this.vy == 0 && this.ax == 0 && this.ay == 0 || this.ccMove) {
            return;
        }
        this.x += e * this.vx / 2;
        this.vx += e * this.ax;
        this.x += e * this.vx / 2;
        this.y += e * this.vy / 2;
        this.vy += e * this.ay;
        this.y += e * this.vy / 2;
        this.node.position = cc.v2(this.x - bgWidth / 2, this.y - bgHeight / 2)
        // this.node.position = cc.v2(this.node.position.x, this.y - bgHeight / 2)
    }

    //更新行为
    protected updateBehavior(dt: number) {
        this.actionTimer.step(dt);
        this.actionTimer.isActive() || this.runNextAction()
    }

    public runNextAction() {
        //无分裂 需要更新速度 增加爬回速度
        if (!this.isSplitting && this.shouldUpdateSpeed || this.vy === 0) {
            this.shouldUpdateSpeed = !1;
            this.vy = -this.creepSpeed;
        }
        //无分裂 需要充能
        if (!this.isSplitting && this.shouldCharge) {
            this.charge()
        } else {
            this.actionTimer.reset(this.chargeRetryDelay)
        }
    }

    //充能 下降
    private charge() {
        var s = -bgHeight - cfg.bounceOffsetY;
        var time = Math.abs(s / this.chargeSpeed);
        var to = cc.v2(this.node.position.x, s);
        this.vxCharge = this.vx;
        this.chargeAnim = true;
        var self = this;
        this.ccMove = true;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.playerAnimation("attack");
            }),
            cc.delayTime(0.1),
            cc.moveTo(time / 1000, to),//.easing(cc.easeOut(3)),
            cc.callFunc(() => {
                self.syncPos();
                self.ccMove = false;
                self.vx = 0;
                self.vy = 0;
                this.chargeAnim = false
            })
        ));
        //this.chargeAnim.now({vx: 0}, time, c.default.easeOut);
        this.vy = this.chargeSpeed;
        //TODO 播放动画
        this.actionTimer.reset(99999)
    }

    //爬行 上升
    private bounce() {
        var e = this;
        var n = this.creepTime * 1.68 / 1000;
        var to = cc.v2(this.node.position.x, bgHeight / 2 - this.bounceRecoverOffsetY + this.node.height / 2);
        this.isBouncing = !0;
        this.vy = 0;
        //爬行
        this.ccMove = true;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => this.playerAnimation("idle")),
            cc.moveTo(n, to).easing(cc.easeElasticOut(3)),
            cc.callFunc(() => {
                e.syncPos();
                e.ccMove = false;
                e.isBouncing = !1;
                e.vx < 0 ? e.vx = -1 * e.horizontalSpeed : e.vx = e.horizontalSpeed;
                e.vy = -this.creepSpeed;
                e.actionTimer.reset(e.chargeRetryDelay)
            })));
        //开始充能 TODO
        // this.chargeAnim.now({vx: this.vxCharge}, n, c.default.easeIn)
    }

    private split() {
        var e = this;
        var cnt = this.splitIndex + 1;
        if (!(cnt > cfg.splitCount)) {
            SOUND.play(SoundConst.boss_blob_split);
            this.onSplitStart();
            //播放动画
            this.node.runAction(cc.sequence(
                //player animation,
                cc.callFunc(() => {
                    this.playerAnimation("idle");
                }),
                cc.delayTime(0.1),
                cc.callFunc(() => e.onSplitAnimationFinish(cnt))
            ));
            return true
        }
        return false
    }

    onSplitStart = function () {
        this.isReady = !1;
        this.isSplitting = !0;
        this.isBouncing = !1;
        this.vy = this.recoilSpeed;
        this.actionTimer.reset(99999);
    };

    onSplitAnimationFinish = function (cnt: number) {
        var health = this.monsterInfo.MonsterMaxHp / 2;
        var scale = this.getScale(cnt);
        var yy: number = this.vy;
        var pos = this.node.position;
        let _self=this;
        POOL.getPrefabFromPool(AssetConst.MonsterSplitBossItem, (node: cc.Node) => {
            node.parent = PANEL.panelHolder.monsterLayer;
            let a = node.getComponent(MonsterSplitBoss);
            a.bossId=_self.bossId;
            a.node.position = pos;
            a.onSplitFinish(!1, health, scale);
            a.splitIndex = cnt;
            a.vy = yy;
        });
        this.onSplitFinish(!0, health, scale, pos);
        this.splitIndex = cnt;
        this.vy = yy;
    };

    private onSplitFinish(old: boolean, hp: number, scale: number) {
        this.resetStart();
        this.monsterInfo.parseData({monsterId: 1, monsterType: 1, monsterHp: hp, monsterMaxHp: hp});
        this.scale = scale;
        this.node.scale = scale;
        var _xx = old ? 126 * scale / 2 : -126 * scale / 2;
        this.node.setPositionX(this.node.getPositionX() + _xx);
        console.log("_xx:", _xx);
        //横向速度
        var _vx = (old ? 1 : -1) * this.horizontalSpeed;
        //splitAnim
        var self = this;
        this.ccMove = true;
        this.node.runAction(cc.sequence(
            cc.moveTo(cfg.splitTime / 1000, cc.v2(this.node.x + _xx, this.node.y)).easing(cc.easeOut(3)),
            cc.callFunc(() => self.syncPos()),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                self.ccMove = false;
                self.vx = _vx;
                self.isReady = !0;
                self.actionTimer.reset(this.splitRecoverDelay);
                self.vy = -self.creepSpeed;
            })
        ))
        //this.creepAnim.now({vy: r}, this.splitCreepTime, c.default.easeOut)

    }


    protected resetStart() {
        this.actionTimer.reset(0);
        this.MonsterType = EmMonsterType.Boss;
        this.monsterInfo = new MonsterInfo();
        var maxHp = parseInt(CFG.getCfgDataById(ConfigConst.BOSS, "4")["monsterMaxHp"]) * LevelManager.getInstance().currentChapter;
        this.monsterInfo.parseData({monsterId: 1, monsterType: 1, monsterHp: maxHp, monsterMaxHp: maxHp});
        this.node.stopAllActions();
        this.hpBar.progress = 1;
        this.stateMonster = EmMonsterState.Live;
        this.playerAnimation("idle");
        this.isReady = false;
        this.splitIndex = 0;
        this.vxCharge = 0;
        this.node.scale = this.scale = 1;
        this.vx = this.vy = this.ax = this.ay = 0;
        this.isSplitting = this.isBouncing = this.shouldUpdateSpeed = this.ccMove = false;
        this.node.stopAllActions()
    }

    private playerAnimation(action: string) {
        this.bossSp.setToSetupPose();
        this.bossSp.setAnimation(1, action, true);
    }

    protected OnDeath() {

        if (!this.split()) {
            splitKill++;
            if (splitKill >= Math.pow(2, cfg.splitCount)) {
                splitKill = 0;
                super.OnDeath()
            } else {
                this.resetStart();
                POOL.putPrefabToPool(this.node);
            }
        }
    }

    public playSkill() {
        //monsterSkill
    }


    update(dt) {
        this.step(dt)
    }

    /**
     * 动画完成，播放循环idle动画
     */
    private spineEventCompleteCallback(trackEntry) {
        if (trackEntry.animation.name != "idle") {
            this.playerAnimation("idle");
        }
    }

    public noHrut(){
        return this.isReady?false:super.noHrut()
    }

    protected deathSound() {
        SOUND.play(SoundConst.boss_blob_death)
    }
}
