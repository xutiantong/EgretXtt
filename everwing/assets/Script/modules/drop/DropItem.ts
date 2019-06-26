import MainRole from "../battle/MainRole";
import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import PrefabBase from "../../component/PrefabBase";
import {POOL} from "../../manager/PoolManager";
import {DropItemType} from "../../GameConst";
import {BM} from "../battle/BattleManager";
import {BuffType} from "../battle/BuffSystem/BuffBase";
import AddNumItem from "../battle/AddNumItem";
import {SOUND, SoundConst} from "../../manager/SoundManager"


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
export default class DropItem extends PrefabBase {

    private static DropWidth:number=30;
    
    private xx:number=0;
    private yy:number=0;
    private vx:number=0;
    private vy:number=0;
    private ax:number=0;
    private ay:number=0;
    private _scale: number = 1;
    private _anim: cc.Animation;

    public unuse()
    {
        this.node.stopAllActions();
        this.node.active=false;
        this._hasStopDrop=false;
        this.node.scale = this._scale;
        this._moveState = DropMoveState.Auto;

    }
    public reuse(){
        this._hasStopDrop=false; 
        this._isHasBeenRecyle= false;
        this.node.active=true;
        this.node.scale = this._scale;
        this._moveState = DropMoveState.Auto;
        if (this._anim) {
            this._anim.play()
        }
    }

    onLoad() {
        this._scale = this.node.scale;
        this._anim = this.node.getComponent(cc.Animation);
        if (!this._anim) {
            this._scale = this.node.scale = 2;
        }
    }

    onEnable()
    {
        //console.log("注册事件："+MessageConst.OnHandlerRoleMove);
        //MSG.on(MessageConst.OnHandlerRoleMove,this.onRoleMove,this);
    }
    // start()
    // {
    //     // if(MainRole.Role)
    //     // {
    //     //     let delta= MainRole.Role.node.parent.convertToNodeSpaceAR(MainRole.Role.node.position).sub(this.node.parent.convertToNodeSpaceAR(this.node.position));
    //     //     this.moveSpeed.x = delta.x/3;
    //     //     this.moveSpeed.y = delta.y/3;
    //     // }
    //     // cc.moveBy(3,this.moveSpeed);
    // }
    onDisable()
    {
        //MSG.off(MessageConst.OnHandlerRoleMove,this.onRoleMove,this);
    }
    private speedX:number=10;
    private speedY:number=20;

    // public onRoleMove(evt)
    // {

    // }
    /**
     * 
     * @param evt 角色移动
     */
    // public onRoleMove(evt)
    // {
    //     if(MainRole.Role.node&&MainRole.Role.node.activeInHierarchy)
    //     {
    //         let roleNode =MainRole.Role.node;
    //         let rolePos =roleNode.getPosition();
    //         let nodePos = this.node.getPosition();
    //         if(rolePos.y<=nodePos.y)
    //         {
    //             let delta= cc.pDistance(nodePos,rolePos);
    //             // this._positionDelta = rolePos.sub(nodePos);
    //             // this._startPosition = nodePos
    //             let consumeTime = delta/this.speedY;
               
    //             this.node.stopActionByTag(1);
    //             this.node.stopAction(this.followerAction);
    //             this.followerAction = cc.moveTo(consumeTime,rolePos);
    //             //移动前停止所有动作
    //             //this.node.stopAllActions()
    //             //进行移动
    //             this.node.runAction(this.followerAction);
    //         }
    //     }
    // }
    private _hasStopDrop:boolean = false; //被吸引

    private _isHasBeenRecyle:boolean= false;

    private _moveState:DropMoveState = DropMoveState.Auto;
    public update(dt:number)
    {
        if(MainRole.Role.node&&MainRole.Role.node.activeInHierarchy)
        {
            if(BM.laserTimer.isActive()){
                var dis = cc.pDistance(this.node.getPosition(), MainRole.Role.node.getPosition());
                if(dis < 200){
                    this.showAddAni(this.node.position,this.node.name);
                    POOL.putPrefabToPool(this.node);
                    return;
                }
            }

            if(!this._hasStopDrop){
                let buffManget= MainRole.Role.ActorBuff.GetBuffByType(BuffType.Magnet);
                let nodePos = this.node.getPosition();
                if((buffManget!=null&&buffManget.buffConfig!=null))
                {
                    let roleNode =MainRole.Role.node;
                    let rolePos =roleNode.getPosition();
                    
                    let delta= cc.pDistance(nodePos,rolePos);
                    if(buffManget.buffConfig!=null&&delta<buffManget.buffConfig.Num)
                    {
                        this._hasStopDrop= true;
                    }
                }
            }
            this.updatePos(dt);
        }   
    }
    // public onRoleMove(evt)
    // {
        
    //     if(MainRole.Role.node&&MainRole.Role.node.activeInHierarchy)
    //     {
    //         let roleNode =MainRole.Role.node;
    //         let rolePos =roleNode.getPosition();
    //         let nodePos = this.node.getPosition();
    //         let delta= cc.pDistance(nodePos,rolePos);
    //         console.log(delta);
    //         if(delta>500)
    //         {
    //             return;
    //         }
    //         if(rolePos.y<=nodePos.y)
    //         {
    //             // this._positionDelta = rolePos.sub(nodePos);
    //             // this._startPosition = nodePos
    //             let consumeTime = delta/this.speedY;
               
    //             let dropaction=<cc.ActionInterval>this.node.getActionByTag(1);
    //             //this.node.stopAction(this.followerAction);
    //             this.followerAction = cc.moveBy(consumeTime,rolePos.sub(nodePos),0);
    //             //移动前停止所有动作
    //             //this.node.stopAllActions()
    //             //进行移动
    //             let spawn=cc.spawn(dropaction,this.followerAction);
    //             this.node.runAction(spawn);
    //         }
    //     }
    // }

    private targrtPosition:cc.Vec2;
    // private _positionDelta:cc.Vec2;
    // private _startPosition:cc.Vec2;
    // public update(dt)
    // {
    //     if(this.targrtPosition==undefined||this.targrtPosition==null)
    //     {
    //         return;
    //     }
    //     var x = this._positionDelta.x * dt;
    //     var y = this._positionDelta.y * dt;
    //     var locStartPosition = this._startPosition;
    //     this.node.setPosition(locStartPosition.x + x, locStartPosition.y + y);
    // }

    public onCollisionEnter (other:cc.Collider, self:cc.Collider) {
        if(other.node.group =="player"){
            if(BM.laserTimer.isActive()){
                return
            }
            this.showAddAni(self.node.position,self.node.name);
            POOL.putPrefabToPool(self.node);
        }
    }

    public reset(type, t, i, n) {
        //gem cfg
        
        //vvx
        let s = (i ? 2 : 1) * (n ? Math.random()*2+1: 1);
        //vvy
        let r = (i ? 2 : 1) * (n ? Math.random()*2.5 +0.5: 1);
       // let l = p.default.types[e];
        // if(l && l.yVelocityMultiplier){
        //     r *= l.yVelocityMultiplier
        // }
        //this.id = type;
        this.xx = t.x; 
        this.yy = t.y;  
        this.vx = s * (Math.random()*0.2-0.1); 
        this.vy = r * 0.588; 
        this.ax = 0;
        this.ay = -.0019;
        this.node.setPosition(this.xx,this.yy);
        // this.common = o.common || 0, 
        // this.premium = o.premium || 0, 
        // this.duration = o.duration || 0, 
        // this.sound = o.sound || "", 
        // this.voice = o.voice || "",
        // this.chargeValue = o.chargeValue || 0, 
        // this.collected = !1, 
        // this.staleView = !!this.view, 
        // a.commonPossible += this.common
    }

    private updatePos(dt:number){
        if (!this.node.active){
            return;
        }
        let e =dt*1000;
        this.xx += e * this.vx * 0.5;
        this.vx += e * this.ax;
        this.xx += e * this.vx * 0.5;
        
        //限制横向范围
        if(this.xx < -375+DropItem.DropWidth){
            this.xx = -375+DropItem.DropWidth;
            this.vx = -this.vx;
        }else if( this.xx > 375 - DropItem.DropWidth){
            this.xx = 375 - DropItem.DropWidth;  
            this.vx = -this.vx;                     
        }
        
        this.yy += e * Math.max(-2.52, this.vy) *0.5;
        this.vy += e * this.ay;
        this.yy += e * Math.max(-2.52, this.vy)*0.5 ;
        
        if(this._hasStopDrop){
            let t =this.node.scale ;
            t -= dt*4;
            if(t<0)
            {
                t = 0;
            }
            this.node.scale = t;
            let p = MainRole.Role.node.getPosition();
            this.xx = this.xx - (2-t)*(this.xx-p.x)/2;
            this.yy = this.yy - (2-t)*(this.yy-p.y)/2;
            this.node.setPosition(this.xx,this.yy);
            return;
        }
        this.node.setPosition(this.xx,this.yy);
        
        if (this.yy < -cc.winSize.height/2-100){
                //纵轴超出 释放
            this.endScreen(); 
        }
        //被收集中
        // if (r.collected && r.view) {
        //     var l = i.x, 
        //     c = i.y, 
        //     u = r.x, 
        //     h = r.y + (c - C), 
        //     d = l - u, 
        //     f = c - h,
        //     p = 1 - r.view.style.scale;
        //     r.x += p * d, 
        //     r.y += p * f
        // } else 
        // if (this.yy >= a){
        //     //纵轴超出 释放
        //     V.releaseModel(r), 
        //     o--
        // }
    }


    private endScreen(){
        POOL.putPrefabToPool(this.node);
    }

    private showAddAni(pos,name){
        let type = parseInt(name.substr(4,String(name).length));
        switch (type) {
            case DropItemType.DoubleBullet:
                MSG.emit(MessageConst.doubleBullet);
                SOUND.play(SoundConst.item_collect_double_shot);
                break;
            case DropItemType.AddDamage:
                MSG.emit(MessageConst.addDamage);
                SOUND.play(SoundConst.item_collect_clover);
                break;
            case DropItemType.RushAddSpeed:
                MSG.emit(MessageConst.RushAddSpeed,{type:2});
                SOUND.play(SoundConst.item_collect_rush);
                break;
            case DropItemType.AddMagnet:
                MSG.emit(MessageConst.addMagnet);
                SOUND.play(SoundConst.item_collect_magnet);
                break;
            case DropItemType.Trophy:
            case DropItemType.Trophy1:
            case DropItemType.Trophy2:
            case DropItemType.Trophy3:
                let addTroNum =1;
                if (type == DropItemType.Trophy1) {
                    addTroNum = 5;
                }
                else
                if (type == DropItemType.Trophy2) {
                    addTroNum = 10;
                }
                else
                if (type == DropItemType.Trophy3) {
                    addTroNum = 20;
                }
                BM.addCup(addTroNum);
                AddNumItem.ShowNum(pos, addTroNum);
                SOUND.play(SoundConst.trophy_collect);
                break;
            case DropItemType.Gold:
            case DropItemType.Diamond1:
            case DropItemType.Diamond2:
            case DropItemType.Diamond3:
            
                let addNum = 1;
                if (type == DropItemType.Diamond1) {
                    addNum = 10;
                }
                else if (type == DropItemType.Diamond2) {
                    addNum = 20;
                }
                else if (type == DropItemType.Diamond3) {
                    addNum = 40;
                }
                MSG.emit(MessageConst.AddRoundCoin,{num:addNum});
                BM.changeScore(addNum);
                AddNumItem.ShowNum(pos, addNum);
                if (type == DropItemType.Gold) {
                    SOUND.playCoinCollectSound();
                } else {
                    SOUND.play(SoundConst.gem_collect)
                }
                break;
            default:
                break;
        }
    }
}
export enum DropMoveState{
    Auto,
    Magnet,
    AfterMagnet,
}