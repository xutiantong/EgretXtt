import CollideItem from "./CollideItem";
import {POOL} from "../../manager/PoolManager";
import {ZERO} from "../../GameConst";
import MainRole from "./MainRole";
import {BM} from "./BattleManager";

const {ccclass, property} = cc._decorator;

var cfg = {
    energyBall: {
        frameRate: 24,
        width: 128,
        height: 128,
        offsetMinHitX: -44,
        offsetMaxHitX: 44,
        offsetMinHitY: -44,
        offsetMaxHitY: 44,
        rotationSpeedMin: 2,
        rotationSpeedMax: 5,
        isSkinnedWithBoss: !0,
        particleImage: "resources/images/game/base/bullet_pip_lime.png",
        defaultAnimation: "pulse",
        compositeOperation: "lighter"
    },
    treeLeaf: {
        width: 128,
        height: 128,
        offsetMinHitX: -16,
        offsetMaxHitX: 16,
        offsetMinHitY: -16,
        offsetMaxHitY: 16,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        isSkinnedWithBoss: !0,
        image: "treeLeaf",
        particleImage: "resources/images/game/base/bullet_pip_nature.png",
        compositeOperation: "lighter"
    },
    leaf: {
        width: 128,
        height: 128,
        offsetMinHitX: -16,
        offsetMaxHitX: 16,
        offsetMinHitY: -16,
        offsetMaxHitY: 16,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        image: "resources/images/game/base/bullet_pip_nature.png",
        particleImage: "resources/images/game/base/bullet_pip_nature.png",
        compositeOperation: "lighter"
    },
    water: {
        width: 128,
        height: 128,
        offsetMinHitX: -16,
        offsetMaxHitX: 16,
        offsetMinHitY: -16,
        offsetMaxHitY: 16,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        image: "resources/images/game/base/bullet_pip_water.png",
        particleImage: "resources/images/game/base/bullet_pip_water.png",
        compositeOperation: "lighter"
    },
    fire: {
        width: 128,
        height: 128,
        offsetMinHitX: -16,
        offsetMaxHitX: 16,
        offsetMinHitY: -16,
        offsetMaxHitY: 16,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        image: "resources/images/game/base/bullet_pip_fire.png",
        particleImage: "resources/images/game/base/bullet_pip_fire.png",
        compositeOperation: "lighter"
    },
    vortex: {
        offsetMinHitX: -55,
        offsetMaxHitX: 55,
        offsetMinHitY: -55,
        offsetMaxHitY: 55,
        particleImage: "resources/images/game/base/bullet_pip_shadow.png",
        visible: !1
    },
    icicle: {
        width: 50,
        height: 140,
        offsetMinHitX: -12,
        offsetMaxHitX: 12,
        offsetMinHitY: -40,
        offsetMaxHitY: 40,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        isSkinnedWithBoss: !0,
        images: ["icicle1", "icicle2"],
        particleImage: "resources/images/game/base/bullet_pip_cyan.png",
        compositeOperation: "lighter"
    },
    boulder: {
        width: 110,
        height: 110,
        offsetMinHitX: -35,
        offsetMaxHitX: 35,
        offsetMinHitY: -35,
        offsetMaxHitY: 35,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        isSkinnedWithBoss: !0,
        image: "boulder",
        particleImage: "resources/images/game/base/bullet_pip_cyan.png",
        compositeOperation: "lighter"
    },
    icicleSpike: {
        width: 125,
        height: 260,
        offsetMinHitX: -25,
        offsetMaxHitX: 25,
        offsetMinHitY: -100,
        offsetMaxHitY: 130,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        isSkinnedWithBoss: !0,
        image: "icicleSpike",
        particleImage: "resources/images/game/base/bullet_pip_cyan.png",
        compositeOperation: "lighter",
        visible: !1
    },
    mekBullet: {
        width: 128,
        height: 128,
        offsetMinHitX: -16,
        offsetMaxHitX: 16,
        offsetMinHitY: -16,
        offsetMaxHitY: 16,
        rotationSpeedMin: 0,
        rotationSpeedMax: 0,
        isSkinnedWithBoss: !0,
        image: "mekBullet",
        particleImage: "resources/images/game/base/bullet_pip_jungle.png",
        compositeOperation: "lighter"
    },
    missile: {
        offsetMinHitX: -22,
        offsetMaxHitX: 22,
        offsetMinHitY: -22,
        offsetMaxHitY: 22,
        particleImage: "resources/images/game/base/bullet_pip_orange.png",
        visible: !1
    }
};

@ccclass
export default class EnemyBulletItem extends CollideItem {

    @property(cc.Node) parNode:cc.Node = null;
    @property(cc.Sprite) bulletSp:cc.Sprite = null;
    private _touchIsValid:boolean = false;
    private _pos: cc.Vec2 = ZERO;

    onLoad () {
    }

    start () {
    }

    onEnable(){
    }

    onDisable(){
    }

    public onlaunch(endPos:cc.Vec2, time:number, scale:number = 1) {
        this.node.scale = scale;
        var deltaP = this.node.position.sub(endPos);
        var angle = cc.pToAngle(deltaP) / Math.PI * 180;
        this.bulletSp.node.rotation = -angle+90 ;
        this.node.runAction( cc.sequence( cc.moveTo(time, endPos),cc.callFunc(()=>{
            this.onRemove();
        }) ) );
    }
    public onlaunchSprinkle(endPos:cc.Vec2, time:number){
        this.node.runAction( cc.sequence(
            cc.bezierTo(time, [this.node.position,
            cc.v2(this.node.position.x + (endPos.x - this.node.position.x) * 0.8, endPos.y + (this.node.position.y - endPos.y) * (1.2 + Math.random())),
            endPos]),
            cc.callFunc(()=>{
            this.onRemove();
        }) ) );
    }
    public onRemove()
    {
        //this.node.destroy();
        POOL.putPrefabToPool(this.node);
    }
    public onCollisionEnter (other:cc.Collider, self:cc.Collider) {
        if(other.node.group=="player")
        {
            if(BM.laserTimer.isActive()){
                this.onRemove();
                return;
            }
           let mainRole = other.node.getComponent(MainRole);
           if(mainRole)
           {
               mainRole.onCollisionEnemyBullet(this);
           }
        }
    }
    /**
     * 怪物与子弹相撞
     */
    // private isUsed:boolean =false;
    //
    // public onCollisionMonster(item:MonsterBase)
    // {
    //     if(this.isUsed)
    //     {
    //         //避免打多个 如果能穿透这里不要返回
    //         return;
    //     }
    //     this.isUsed = true;
    //     //计算子弹的伤害 todo 子弹的伤害
    //     let hurt = 30;
    //     if(item)
    //     {
    //         let kill = item.changeMonsterHpFactor(hurt);
    //         item.onChangeHpView();
    //         if(kill)
    //         {
    //             MSG.emit(MessageConst.KillMonster,{condigId:1,num:1});
    //         }
    //     }
    //     //todo 播放特效
    //     POOL.putPrefabToPool(this.node);
    // }

    public reuse()
    {
        this.node.stopAllActions();
        this.node.setPosition(0,0);
        this.isUsed =false;
        this.node.active= true;
    }
    public unuse()
    {
        this._update = false;
        super.unuse();
        this.isUsed =false;
        this.node.active=false;
    }


    public isHoming = !1;
    private onBounce = null;
    private config = null;
    private height: number;
    private width: number;
    private id;
    private _scale;
    private dr = 0;//角度
    public x = 0;
    public y = 0;
    public vx = 0;
    public vy = 0;
    public ax = 0;
    public ay = 0;
    private _update = false;

    private _offx;
    private _offy;

    set scale(val: number) {
        this.height = this.node.height * val;
        this.width = this.node.width * val;
        this.node.scale = val;
        this._scale = val;
    }

    get scale() {
        return this._scale;
    }

    public reset(t: string) {
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.id = t;
        this.isHoming = !1;
        this.onBounce = null;
        this.config = cfg[t];
        this.scale = 1;
        this.dr = 0;
        this.applyRotation();
        var pos = this.node.parent.convertToWorldSpaceAR(cc.v2(0, 0));
        this._offx = pos.x;
        this._offy = pos.y;
        this._update = true;
    }

    update(dt: number) {
        if (!this._update) return;
        this.step(dt * 1000)
    }

    private applyRotation() {
        var e = this.config;
        if (e.rotationSpeedMin || e.rotationSpeedMax) {
            var t = Math.min(e.rotationSpeedMin, e.rotationSpeedMax);
            var i = Math.max(e.rotationSpeedMin, e.rotationSpeedMax);
            var n = e.randomizeRotationDirection && Math.random() < .5 ? -1 : 1;
            this.dr = (t + Math.random() * (i - t)) * n
        }
    }

    private move(e: number) {
        this.x += e * this.vx / 2;
        this.vx += e * this.ax;
        this.x += e * this.vx / 2;
        this.y += e * this.vy / 2;
        this.vy += e * this.ay;
        this.y += e * this.vy / 2;
        this.node.position = cc.v2(this.x - this._offx, this.y - this._offy)
    }

    public syncPos() {
        this.node.position = cc.v2(this.x - this._offx, this.y - this._offy)
    }

    private step(e: number) {
        this.move(e);
        this.updateMovementEffects(e);
        this.validatePosition();
    }


    private validatePosition() {
        this.onBounce && (this.x < 0 || this.x > cc.winSize.width) && this.onBounce();
        return !(this.y + this.height / 2 <= 0 ||
            this.y - this.height / 2 >= 3 * cc.winSize.height / 2 ||
            this.x + this.width / 2 <= -cc.winSize.width / 2 ||
            this.x - this.width / 2 >= 3 * cc.winSize.width / 2) ||
            (this.kill(), !1)


    }

    kill = function () {
        this.onRemove();
        console.log("kill")
    };

    bounce = function () {
        if (this.x < 0) {
            this.x = 0;
            this.vx *= -1;
            this.dr *= -1
        } else if (this.x > cc.winSize.width) {
            this.x = cc.winSize.width;
            this.vx *= -1;
            this.dr *= -1
        }
    };

    updateMovementEffects = function (e) {
        if (this.isHoming) {
            var playerPos = MainRole.Role.node.convertToWorldSpaceAR(cc.v2(0, 0));
            var C = Math.PI / 12500;
            var i = this.vx,
                n = this.vy,
                a = playerPos.x - this.x,
                s = playerPos.y - this.y,
                r = Math.atan2(n, i),
                l = Math.atan2(s, a),
                c = l - r;
            c = c > 0 ? Math.min(c, e * C) : Math.max(c, e * -C);
            var u = r + c;
            var h = Math.sqrt(i * i + n * n);
            this.vx = Math.cos(u) * h;
            this.vy = Math.sin(u) * h;
        }
    }
}