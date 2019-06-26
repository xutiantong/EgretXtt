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
export default class LoadTexture extends cc.Component {

    @property
    public url:string ="";
    @property
    public type:"jpg"|"png" ="png";
    @property(cc.Sprite)
    private  spr:cc.Sprite =null;
    private loadtype=0;
    onLoad()
    {
        this.load("ui/cd","png",0);
        if(this.spr==null)
        {
            this.spr = this.getComponent(cc.Sprite);
        }
        if(CC_DEBUG)
        {
            if(this.spr==null)
            {
                console.error("加载文件失败！");
            }
        }
    }
    /**
     * 加载图片
     * @param path 
     * @param type 
     */
    public load(path:string,type:string = null,loadtype){
        this.loadtype=loadtype;
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
                    if(error)
                    {
                        console.error("LoadTexture加载失败："+path);
                        return;
                    }
                    __self.loading(__self);
                    __self.spr.spriteFrame = resource;
                }
            )
        } else if (path.indexOf("resources") < 0) {
            let __self = this;
             RES.getSpriteFrameByPath(path ,
                (error: Error, resource: cc.SpriteFrame) =>{
                    if(error)
                    {
                        console.error("LoadTexture加载失败："+path);
                        return;
                    }
                     __self.loading(__self);
                     __self.spr.spriteFrame = resource;
                }
            )
        }
    }
    private loadComplete(err,tex)
    {
        if(err){
            
            console.log("MIconLoader.load fial: "+ err);
        }else{
            this.loading(this);
            this.spr.spriteFrame = new cc.SpriteFrame(tex);
        }
    }
    start()
    {
        this.load(this.url,this.type,1);
    }

    private loading(self){
        if(self.loadtype){
            self.spr.node.stopAllActions();
            self.spr.node.rotation=0;
        }else{
            this.spr.node.runAction(cc.repeatForever(cc.rotateBy( 0.6,360)));
        }
        
    }
}
