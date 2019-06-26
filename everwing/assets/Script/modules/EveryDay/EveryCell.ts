import MitemRender from "../../component/MItemRender"
 
import { CFG } from "../../manager/ConfigManager";

import { RES } from "../../manager/ResourceManager"

import GameUtil from "../../utils/GameUtil";
import MItemRender from "../../component/MItemRender";


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
export default class EveryCell extends MItemRender {

    @property(cc.Node)bg_0: cc.Node = null;
    @property(cc.Node)bg_1: cc.Node = null;
    @property(cc.Sprite)itemImg: cc.Sprite = null;
    @property(cc.Label)titleText: cc.Label = null;
    @property(cc.Label)itemText: cc.Label = null;
    @property(cc.Node)receiveed: cc.Node = null;
   
    
    private friendUid: string = null;

    public setData(data) {
        super.setData(data);

        this.bg_0.active = !data.isRandom;
        this.bg_1.active = data.isRandom;
        this.receiveed.active = data.receiveed;
        this.titleText.string = data.title;
        
        this.itemText.string = data.name;
        let __self = this;
        let picPath = "ui/newui/shangcheng"+ String(data.icon).substr(2,String(data.iocn).length-2);
        RES.getSpriteFrameByPath(picPath,(error: Error, resource: cc.SpriteFrame)=>{
            __self.itemImg.spriteFrame = resource
        })

        // this.itemImg.spriteFrame = new cc.SpriteFrame(GameUtil.getRawResourcePath(data.icon));
        // RES.loadImage(data.icon,this.itemImg);
       }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // }
    

    // start () {

    // }

    // update (dt) {}

 
}
