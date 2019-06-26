import TouchListener from "./TouchListener";

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
export default class SpineDisplay extends cc.Component {
    protected _aniPlayName: string = "loop";
    protected _aniPlayTimes: number = 0;

    private _boneNode:cc.Node =null;
    private _boneDisplay:sp.Skeleton;

    public static spinePool:cc.NodePool = new cc.NodePool();

    /**
     * 加载动画
     */
    public load(spineResPath:string){
        if(SpineDisplay.spinePool.size()>0){
            this._boneNode = SpineDisplay.spinePool.get();
        }else{
            this._boneNode = new cc.Node();
        }
        this.loadBoneRes(spineResPath)
    }
    
    private loadBoneRes(res){
        this._boneNode.parent = this.node;
        this._boneNode.zIndex = -1;
        this._boneDisplay = this._boneNode.addComponent(sp.Skeleton);
        cc.loader.loadResDir(res, (error: Error, resource: any[]) => {
            if (resource.length <= 0) {
                return;
            }
            for (let i in resource) {
                let item = resource[i];
                if (item instanceof sp.SkeletonData) {
                    this._boneDisplay.skeletonData = item;
                }
            }
            this.playAnimation(this._aniPlayName, this._aniPlayTimes);
        });
    }

    /**
     * 
     * @param name 播放动画名称
     * @param playTimes 播放次数
     */
    public playAnimation(name: string, playTimes: number = 0) {
        this._aniPlayName = name;
        this._aniPlayTimes = playTimes;
        if (this._boneDisplay) {
            this._boneDisplay.setAnimation(0,this._aniPlayName, playTimes == 0?true:false);
        }
    }

    public get animationName(){
        return this._aniPlayName;
    }
    // onLoad () {}

    start () {

    }

    onDestroy(){
        if(this._boneNode.isValid)
        {
            if(this._boneNode){
                this._boneNode.removeComponent(sp.Skeleton);
                SpineDisplay.spinePool.put(this._boneNode);
            }
        }
    }
    // update (dt) {}
}
