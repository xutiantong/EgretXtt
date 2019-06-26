import CollideItem from "./CollideItem";
import {POOL} from "../../manager/PoolManager";
import MainRole from "./MainRole";
import {MSG} from "../../message/MessageController";
import {SOUND} from "../../manager/SoundManager";
import {BM} from "./BattleManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemySuperBullet extends CollideItem {

    @property(cc.Node) parNode:cc.Node = null;
    private _touchIsValid:boolean = false;

    onLoad () {
    }

    start () {
    }

    onEnable(){
    }

    onDisable(){
    }

    public onlaunch(times: number) {
        this.scheduleOnce(()=>{
            SOUND.playMissileSound();
        },0.5);
        var endPos = cc.v2(this.node.getPositionX(), -cc.winSize.height / 2 - 300);
        this.node.runAction(cc.sequence(cc.moveTo(times, endPos) ,cc.callFunc(()=>{
            this.onRemove(1);
        }) ) );
    }
    public onRemove(status:number)
    {
        console.log('EnemySuperBullet  onRemove', status);
        if (status == 1){
            //导弹划出屏幕
            MSG.emit('superBulletPass');
        }else{
            //导弹相撞
        }
        //this.node.destroy();
        POOL.putPrefabToPool(this.node);
    }
    public onCollisionEnter (other:cc.Collider, self:cc.Collider) {
        if(other.node.group=="player")
        {
            if(BM.laserTimer.isActive()){
                this.onRemove(1);
                return;
            }
           let mainRole = other.node.getComponent(MainRole);
           if(mainRole)
           {
               mainRole.onCollisionSuuperBullet(this);
           }
            this.onRemove(0);
        }
    }
    public reuse()
    {
        this.node.active= true;
    }
    public unuse()
    {
        super.unuse();
        this.node.stopAllActions();
        this.node.active=false;
    }

}