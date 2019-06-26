import { RES } from "../manager/ResourceManager";

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
export default class ImgLoader extends cc.Sprite {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public load(path:string,type:string = null){
        if (path == null) {
            return;
        }
        let self = this;
        if (path.indexOf("http://") >= 0) {
             cc.loader.load({url: path, type: type},this.loadComplete.bind(this));
        } else if (path.indexOf("resources") >= 0) {
            let __self = this;
             RES.getSpriteFrameByPath(path ,
                (error: Error, resource: cc.SpriteFrame) =>{
                    __self.spriteFrame = resource;
                }
            )
        } else if (path.indexOf("resources") < 0) {
            let __self = this;
             RES.getSpriteFrameByPath(path ,
                (error: Error, resource: cc.SpriteFrame) =>{
                    __self.spriteFrame = resource;
                }
            )
        }
    }

    private loadComplete(err,tex)
    {
        if(err){
            console.log("MIconLoader.load fial: "+ err);
        }else{
            this.spriteFrame = new cc.SpriteFrame(tex);
        }
    }
    start () {

    }

    // update (dt) {}
}
