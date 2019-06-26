import PrefabBase from "../../component/PrefabBase";
import { POOL } from "../../manager/PoolManager";
import MonsterBase, { EmMonsterType } from "../battle/Monster/MonsterBase";
import {SOUND} from "../../manager/SoundManager";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
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
export default class PlaneBullet extends PrefabBase {

    @property(cc.Node) parNode:cc.Node = null;
    private _touchIsValid:boolean = false;
    private _hurt:number=15;
    onLoad () {
    }

    start () {
    }

    onEnable(){
    }

    onDisable(){
    }

    public onlaunch(endPos:cc.Vec2) {
        this.node.runAction( cc.sequence( cc.moveTo(0.6, endPos),cc.callFunc(()=>{
            this.onRemove();
        }) ) );
    }
    public onRemove()
    {
        //this.node.destroy();
        POOL.putPrefabToPool(this.node);
    }
    public onCollisionEnter (other:cc.Collider, self:cc.Collider) {
        if(other.node.group =="bound")
        {
            this.onRemove();
        }
    }
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
            if(item.MonsterType == EmMonsterType.Normal)
            {
                let hurt = this._hurt;
                if (item.node.position.y + item.node.getContentSize().height/2 > cc.winSize.height/2) {
                    hurt = 0;
                    // cc.log("打怪不掉血------3");
                }
                let kill = item.changeMonsterHpFactor(hurt);
                item.onChangeHpView();
                item.onHurt();
                let wave=  item.getMonsterWave();
                if(kill)
                {
                    MSG.emit(MessageConst.KillMonster,{condigId:1,num:1,currentWave:wave});
                }
            }
            else if(item.MonsterType == EmMonsterType.Boss)
            {

                let hurt = this._hurt;
                if (item.node.position.y + item.node.getContentSize().height/2 > cc.winSize.height/2) {
                    hurt = 0;
                }
                let kill = item.changeMonsterHpFactor(hurt);
                let pos = this.node.position;
                item.onChangeHpView(pos);
                if(kill)
                {
                    MSG.emit(MessageConst.KillMonster,{condigId:1,num:1});
                }
            }
            else if(item.MonsterType == EmMonsterType.Entourage)
            {

                let hurt = this._hurt;
                if (item.node.position.y + item.node.getContentSize().height/2 > cc.winSize.height/2) {
                    hurt = 0;
                }
                let kill = item.changeMonsterHpFactor(hurt);
                let pos = this.node.position;
                item.onChangeHpView(pos);
                if(kill)
                {
                    MSG.emit(MessageConst.KillEntourage);
                }
            }
            else if (item.MonsterType == EmMonsterType.Elite)
            {
                let hurt = this._hurt;
                if (item.node.position.y + item.node.getContentSize().height/2 > cc.winSize.height/2) {
                    hurt = 0;
                }
                let kill = item.changeMonsterHpFactor(hurt);
                item.onChangeHpView();
                item.onHurt();
                if(kill)
                {
                    MSG.emit(MessageConst.KillMonster,{condigId:1,num:1});
                }
            }
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
        //移除所有定时器
        this.unscheduleAllCallbacks();
        this.isUsed =false;
        this.node.active=false;
    }
}
