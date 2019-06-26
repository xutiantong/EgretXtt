import MainView from "../../modules/MainView";
import { ResourceConst, ZERO, AssetConst } from "../../GameConst";
import PoolManager, { POOL } from "../../manager/PoolManager";
import ImgLoader from "../ImgLoader";
import frameClipDisplay from "../frameClipDisplay";
import { PANEL } from "../../manager/PanelManager";
import EntryBtnView from "../../modules/entry/EntryBtnView";
import { RES } from "../../manager/ResourceManager";


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
export default class BoxFlyAnim extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    public resType:number = ResourceConst.Gold;

    onLoad () {
        this._mui = this.node.getComponent(MainView);
    }

    private _mui:MainView =null;

    start () {

    }

    private playBoxFlySigle(node:cc.Node){
        var entryBtnView = PANEL.getPanelSingle(AssetConst.EntryBtnView);
        if (entryBtnView == undefined) {
            return;
        }
        let view = entryBtnView.getComponent(EntryBtnView);
        
        let targetPos = view.btnBoxNode.parent.convertToWorldSpaceAR(view.btnBoxNode.position);
        targetPos = this._mui.node.convertToNodeSpaceAR(targetPos);
        let removeSelf = cc.removeSelf();
        let callback = cc.callFunc(function() {
            node.stopAllActions();
            POOL.putImgSpriteToPool(node);
        }, this);
        let moveTo = cc.moveTo(0.6,targetPos).easing(cc.easeIn(1));
        let spa =cc.spawn(moveTo,cc.scaleTo(0.6,0.2,0.8),cc.fadeTo(0.6,100));
        let seq = cc.sequence(spa, callback,removeSelf);
        node.runAction(seq);
    }

    public playBoxOutAni (pic:string,worldPos:cc.Vec2) {
        if(this._mui == null){
            return;
        }
        let parentNode = PANEL.panelHolder.tipLayer;
        let startPos: cc.Vec2 = parentNode.convertToNodeSpaceAR(worldPos);//this.node;
        
        var node:cc.Node=new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            RES.loadLocalSprite(pic,sprite);
            // sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw(pic));
            node.parent = parentNode;//this.node;
            node.position = startPos;
            node.scale = 1.2;
            let w = 50;
            let exW = -50;
            if (Math.random() > 0.5) {
                w = -w;
                exW = -exW;
            }
            let h = 0;
            let startPoint = startPos;
            let endPoint = cc.v2(startPoint.x - w, startPoint.y + h);
            let time = 0.5;
            let xishu:number = 1.5;
            let bezier = cc.bezierTo(time,[startPoint,cc.v2(startPoint.x + (endPoint.x - startPoint.x)/2, 150*xishu),endPoint]);
            let bezier2 = cc.bezierTo(0.28,[endPoint,cc.v2(endPoint.x + exW, endPoint.y + 100*xishu), endPoint.add(cc.v2(exW,0))]);
            endPoint = endPoint.add(cc.v2(exW,0));
            exW = exW/2;
            let bezier3 = cc.bezierTo(0.25,[endPoint,cc.v2(endPoint.x + exW, endPoint.y + 60*xishu), endPoint.add(cc.v2(exW,0))]);
            endPoint = endPoint.add(cc.v2(exW,0));
            exW = exW/2;
            let bezier4 = cc.bezierTo(0.2,[endPoint,cc.v2(endPoint.x + exW, endPoint.y + 20*xishu), endPoint.add(cc.v2(exW,0))]);
            let finish = cc.callFunc(()=>{
                this.playBoxFlySigle(node);
            }, this);
            node.runAction(cc.sequence(cc.delayTime(Math.random()/3+0.1),bezier.easing(cc.easeIn(0.5)),bezier2.easing(cc.easeOut(1.5)),bezier3.easing(cc.easeOut(1)),bezier4,cc.delayTime(0.5),finish));
    }
    // update (dt) {}
}
