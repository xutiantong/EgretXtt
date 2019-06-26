import PrefabBase from "../../component/PrefabBase";
import { POOL } from "../../manager/PoolManager";

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
export default class EffectTimeFinishCallBack extends PrefabBase {
    @property
    public time:number =0.01;
    private isuse:boolean = true;
    start () {
        this.delayRemove();
    }

    public onCompelete (evt) {
        if(this.isuse){
            POOL.putPrefabToPool(this.node);
        }
    }

    private delayRemove(){
        let self =this;
        this.node.runAction(cc.sequence(cc.delayTime(this.time),cc.callFunc(()=>{self.ondelayRemove()})))
    }

    private ondelayRemove(){
        if(this.isuse){
            POOL.putPrefabToPool(this.node);
        }
    }
    public unuse() {
        super.unuse();
        this.node.stopAllActions();
        this.node.parent = null;
        this.isuse = false;
        this.node.active=false;
    }

    public reuse()
    {
        this.node.active= true;
        this.isuse = true;
        let ani = this.node.getComponent(cc.Animation);
        ani.play();
        this.delayRemove();
    }
    // update (dt) {}
}
