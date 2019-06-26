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
export default class SceneSwitchAni extends cc.Component {

    @property(cc.Node) cloud: cc.Node = null;

    private _dragon:dragonBones.ArmatureDisplay = null
    private _cb:Function = null;

    start () {
        
    }

    onEnable(){
        this._dragon = this.cloud.getComponent(dragonBones.ArmatureDisplay);
    }

    public playOpen(cb:Function){
        this._cb = cb;
        this._dragon.addEventListener(dragonBones.EventObject.COMPLETE as any,this.onPlayComplete,this);
        this._dragon.playAnimation("cloudenter",1);
    }
    
    private onPlayComplete(){
        this._dragon.removeEventListener(dragonBones.EventObject.COMPLETE as any,this.onPlayComplete,this);
        if(this._cb != null){
            this._cb&&this._cb();
        }
    }

    public playClose(){
        this._dragon.playAnimation("clouddropout",1);
    }
}
