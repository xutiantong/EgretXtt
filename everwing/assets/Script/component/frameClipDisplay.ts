import StringUtil from "../utils/StringUtil";
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

/**
 * 序列帧组件
 */
@ccclass
export default class frameClipDisplay extends cc.Sprite {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _frameName:string ="";
    private _frameCount:number = 0;
    private _curFrame:number = 0;
    private _startFarme:number = 0;
    private _framePath:string ="";
    
    private _frames:any = {};
    private _loadCount:number = 0;
    private _loaded:boolean = false;
    private _frameRate:number = 60;

    public onCompleteListener:Function = null;

    /**
     * 
     * @param name 序列帧资源路径
     * @param count 序列帧数
     * @param frameRate 帧率
     * @param start 起始帧 
     * @param repeat 是否循环   1:不循环
     */
    public setFrame(name:string,count:number,frameRate:number = 60,start:number = 0,repeat:number = 0){
        this._frameName = name;
        this._framePath = this._frameName.substring(0,this._frameName.lastIndexOf("/")+1);
        this._frameCount = count;
        this._frameRate = frameRate;
        this._startFarme = start;

        this._loadCount = 0;
        this._loaded = false;
        for(var i:number = 0;i<count;i++){
            var clipName = this._frameName +"_"+i;
            cc.loader.loadRes(clipName,cc.SpriteFrame,(err,spriteFrame)=>{
                var resname:string = this._framePath + spriteFrame.name;
                this._frames[resname] = spriteFrame;
                this._loadCount++;
                if(this._loadCount>=count){
                    this._loaded = true;
                    if(repeat == 0){
                        this.play();
                    }else{
                        this.playFrame();
                    }
                }
            })
        }
    }

    /**
     * 
     * @param atlasName 图集路径
     * @param animName 图集中的动作名:如 zhu-walk
     * @param count 该动作的帧数
     * @param frameRate 播放动作的帧率，默认60
     * @param start 起始帧
     */
    public setFrameSheet(atlasName:string,animName:string,count:number,frameRate:number = 60,start:number = 0){
        this._frameName = animName;
        this._frameCount = count;
        this._frameRate = frameRate;
        this._startFarme = start;
        let self = this;
        RES.loadAtlas(atlasName,(atlas:cc.SpriteAtlas)=>{
            for(var i=0;i<count;i++){
                var frame = atlas.getSpriteFrame(self._frameName+"_"+i);
                if(frame == undefined){
                    frame = atlas.getSpriteFrame(self._frameName+"_"+i+".png");
                }
                if(frame){
                    self._frames[self._frameName +"_" +i] = frame;
                }
            }
            self._loaded = true;
            self.play();
        });
    }

    public play(){
        if(!this._loaded)
            return;
        this.stop();
        this._curFrame = this._startFarme;
        var time:number = 1/this._frameRate;
        if(this._frameRate==0) return;
        this.schedule(this.onFrame,time,cc.macro.REPEAT_FOREVER);
    }

    public playFrame(){
        if(!this._loaded)
            return;
        this.stop();
        this._curFrame = this._startFarme;
        var time:number = 1/this._frameRate;
        if(this._frameRate==0) return;
        this.schedule(this.onFrameWithNum,time,cc.macro.REPEAT_FOREVER);
    }

    public stop(){
        this._loaded = false;
        this.unschedule(this.onFrame);
        this.unscheduleAllCallbacks();
    }

    private onFrame(){
        var curFrame:cc.SpriteFrame = this._frames[this._frameName +"_"+this._curFrame];
        if(curFrame){
            this.spriteFrame = curFrame;
        }else{
            console.log("frame missed!name:" + this._frameName +"_"+this._curFrame);
        }
        this._curFrame++;
        if(this._curFrame>=this._frameCount){
            if(this.onCompleteListener!=null){
                this.onCompleteListener();
            }
            this._curFrame = this._startFarme;
        }
    }

    private onFrameWithNum(){
        var curFrame:cc.SpriteFrame = this._frames[this._frameName +"_"+this._curFrame];
        if(curFrame){
            this.spriteFrame = curFrame;
        }else{
            this._loaded = false;
            this.unschedule(this.onFrame);
            this.unscheduleAllCallbacks();
            console.log("frame missed!name:" + this._frameName +"_"+this._curFrame);
        }
        this._curFrame++;
        if(this._curFrame>=this._frameCount){
            if(this.onCompleteListener!=null){
                this.onCompleteListener();
            }
            this.destroy();
        }
    }

    onDestroy(){
        this._loaded = false;
        this.unschedule(this.onFrame);
        this.unschedule(this.onFrameWithNum);
        this.unscheduleAllCallbacks();
    }

    start () {

    }

    // update (dt) {}
}
