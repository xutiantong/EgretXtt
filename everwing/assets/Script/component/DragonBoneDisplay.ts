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
export default class DragonBoneDisplay extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    protected _aniPlayName: string = "loop";
    protected _aniPlayTimes: number = 0;
    protected _aniDeaultName: string = "loop";

    private _boneNode:cc.Node =null;
    private _boneDisplay: dragonBones.ArmatureDisplay = null;
    
    /**
     * 加载动画
     * @param dragonBoneResName 
     * @param armatureName 
     */
    public load(dragonBoneResName:string,armatureName:string){
        
        if(this._boneNode){
            return;
        }

        
        this._boneNode = new cc.Node();
        this._boneNode.parent = this.node;
        this._boneDisplay = this._boneNode.addComponent(dragonBones.ArmatureDisplay);
        this._boneDisplay.armatureName = null;
        cc.loader.loadResDir(dragonBoneResName, (error: Error, resource: any[]) => {
            if (resource.length <= 0) {
                return;
            }
            for (let i in resource) {
                let item = resource[i];
                if (item instanceof dragonBones.DragonBonesAsset) {
                    this._boneDisplay.dragonAsset = item;
                } else if (item instanceof dragonBones.DragonBonesAtlasAsset) {
                    this._boneDisplay.dragonAtlasAsset = item;
                }
            }
            this._boneDisplay.armatureName = armatureName;
            this.playAnimation(this._aniPlayName, this._aniPlayTimes, this._aniDeaultName);
        });
    }

    /**
     * 
     * @param name 播放动画名称
     * @param playTimes 播放次数
     * @param defaultName 默认动画名称
     */
    public playAnimation(name: string, playTimes: number = 0, defaultName: string = "loop") {
        this._aniPlayName = name;
        this._aniPlayTimes = playTimes;
        this._aniDeaultName = defaultName;
        if (this._boneDisplay && this._boneDisplay.armatureName != null) {
            let names = this._boneDisplay.getAnimationNames(this._boneDisplay.armatureName);
            if (names.indexOf(name) < 0) {
                this._aniPlayName = defaultName;
                this._boneDisplay.playAnimation(defaultName, this._aniPlayTimes);
            } else {
                this._boneDisplay.playAnimation(this._aniPlayName, this._aniPlayTimes);
            }
        }
    }

    onDestroy(){
        if(this._boneNode){
            this._boneNode.destroy();
        }
    }

    start () {

    }

    // update (dt) {}
}
