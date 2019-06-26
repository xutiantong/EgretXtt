import CollideItem from "./CollideItem";
import {POOL} from "../../manager/PoolManager";
import MonsterBase from "./Monster/MonsterBase";
import IActor from "./Actor/IActor";
import {SOUND} from "../../manager/SoundManager"

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletItem extends CollideItem {

    @property(cc.Node) parNode:cc.Node = null;
    private _touchIsValid:boolean = false;
    private _actor:IActor = null;

    onLoad () {
    }

    start () {
    }

    onEnable(){
    }

    onDisable(){
    }
    public onlaunch(endPos:cc.Vec2,actor:IActor) {
        this._actor = actor;
        this.node.runAction( cc.sequence( cc.moveTo(0.6, endPos),cc.callFunc(()=>{
            this.onRemove();
        }) ) );
    }
    public onRemove()
    {
        //this.node.destroy();
        POOL.putPrefabToPool(this.node);
    }

    // public onCollisionEnter (other:cc.Collider, self:cc.Collider) {
    //
    //     if(other.node.group =="bound")
    //     {
    //         this.onRemove();
    //         console.log("bound")
    //     }
    //     // if(other.node)
    //     // if (self.node.y > other.node.y) {
    //     //     this._zorderState = false;
    //     // }
    //     // else {
    //     //     this._zorderState = true;
    //     // }
    //     // self.node.zIndex = 10000 - self.node.y
    // }
    /**
     * 怪物与子弹相撞
     */
    private isUsed:boolean =false;
    
    public onCollisionMonster(item:MonsterBase)
    {
        if(this.isUsed)
        {
            //避免打多个 如果能穿透这里不要返回
            return;
        }

        this.isUsed = true;
        if(item)
        {
            SOUND.playBulletHiteMonsterSound();
            let hurt = this._actor.ActorAttr.attack;
            item.applyDamage(this.node.position,hurt);
        }
        //todo 播放特效
        POOL.putPrefabToPool(this.node);
    }

    public reuse()
    {
        this.node.stopAllActions();
        this.isUsed =false;
        this.node.active= true;
    }
    public unuse()
    {
        super.unuse();
        this.isUsed =false;
        this.node.active=false;
    }
}