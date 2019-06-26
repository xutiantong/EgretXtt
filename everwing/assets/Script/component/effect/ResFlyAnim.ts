import MainView from "../../modules/MainView";
import { ResourceConst, ZERO } from "../../GameConst";
import PoolManager, { POOL } from "../../manager/PoolManager";
import ImgLoader from "../ImgLoader";
import frameClipDisplay from "../frameClipDisplay";
import { PANEL } from "../../manager/PanelManager";


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
export default class ResFlyAnim extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    public resType:number = ResourceConst.Gold;

    onLoad () {
        this._mui = this.node.getComponent(MainView);
    }

    private _mui:MainView =null;

    start () {

    }

    private flyCountEvery:number = 3;
    private isFlying:boolean = false;

    private flyNodes:Array<cc.Node> =[];
    public doFlyAnim(pic:string,worldPos:cc.Vec2,itemId:number,value:number,flyEnd:Function){
        if(this._mui == null){
            return;
        }
        let useClip:boolean = false;
        if(itemId== ResourceConst.Gold){  
            useClip = true;
        }

        let parentNode = PANEL.panelHolder.tipLayer;
        let startPos: cc.Vec2 = parentNode.convertToNodeSpaceAR(worldPos);//this.node;
        
        let node :cc.Node;
        for (var i:number = 0;i<this.flyCountEvery;i++){
            // if(itemId== ResourceConst.Gold){ //金币使用动画
            //     node = POOL.getFrameClipFromPool();
            //     node.getComponent(frameClipDisplay).setFrame("animation/coin_fly/coin_fly",6,20);
            // }else{ 
                node = POOL.getImgSpriteFromPool();
                node.getComponent(ImgLoader).load(pic);
            //}
            node.parent = parentNode;//this.node;
            node.position = startPos.add(cc.v2((2*Math.random()-1)*100,(2*Math.random()-1)*50));
            node.scale = 0.8;
            this.flyNodes.push(node);
        }
        
        var func = ()=>{
            var isEndFly = false;
            if(this.flyNodes.length>0){
                var flynode:cc.Node = this.flyNodes.pop();
                if(this.flyNodes.length ==0){
                    isEndFly = true;
                    this.unschedule(func);
                }
                this.playResFlySigle(flynode,itemId,flyEnd,isEndFly,useClip);
            }
        };
        this.schedule(func
        ,0.1);

        if (value>0) {
            this.showLabel(value, startPos);
        }
        
    }

    private playResFlySigle(node:cc.Node,itemId,flyEnd,isEndFly,useClip){
        let startPos = node.position;
        let targetPos = this._mui.getTargetPos(itemId);
        // let centerPos = cc.v2(startPos.x + (targetPos.x - startPos.x) * 0.2, targetPos.y + (startPos.y - targetPos.y) * 0.2);
        // let bezierTo = cc.bezierTo(0.6, [startPos, centerPos, targetPos]).easing(cc.easeIn(1))
        // let posionTo = cc.place(targetPos);
        let removeSelf = cc.removeSelf();
        let callback = cc.callFunc(function() {
            node.stopAllActions();

            if(useClip){
                POOL.putFrameClipToPool(node);
            }else{
                POOL.putImgSpriteToPool(node);
            }
            flyEnd(isEndFly);
            this._mui.endResFlyAnim(itemId);
        }, this);
        let moveTo = cc.moveTo(0.6,targetPos).easing(cc.easeIn(1));

        let spa;
        if(useClip){
            spa =cc.spawn(moveTo,cc.fadeTo(0.6,100));
        }else{
           spa =cc.spawn(moveTo,cc.scaleTo(0.6,0.2,0.8),cc.fadeTo(0.6,100));
        }

        let seq = cc.sequence(spa, callback,removeSelf);
        node.runAction(seq);
    }

    private showLabel(num:number, pos:cc.Vec2) {
        let node = new cc.Node();
        let label = node.addComponent(cc.Label);
        label.string = "+"+num.toString();
        label.fontSize = 80;
        label.lineHeight = 90;

        let outLine = node.addComponent(cc.LabelOutline);
        outLine.width = 3;
        outLine.color = cc.color(160,80,80);

        node.color = cc.color(255, 255, 0);
        node.parent = PANEL.panelHolder.tipLayer;

        node.position = pos.add( cc.p(0,180) );

        node.runAction( cc.sequence( cc.fadeOut(3), cc.removeSelf() ) );
    }

    public playResOutAni (pic:string,worldPos:cc.Vec2,itemId:number,value:number,flyEnd:Function) {
        if(this._mui == null){
            return;
        }
        let useClip:boolean = false;
        if(itemId== ResourceConst.Gold){  
            useClip = true;
        }

        let parentNode = PANEL.panelHolder.tipLayer;
        let startPos: cc.Vec2 = parentNode.convertToNodeSpaceAR(worldPos);//this.node;
        
        let node :cc.Node;
        for (var i:number = 0;i<this.flyCountEvery;i++){
            if(itemId== ResourceConst.Gold){ //金币使用动画
                node = POOL.getFrameClipFromPool();
                node.getComponent(frameClipDisplay).setFrame("animation/coin_fly/coin_fly",6,20);
            }else{ 
                node = POOL.getImgSpriteFromPool();
                node.getComponent(ImgLoader).load(pic);
            }
            node.parent = parentNode;//this.node;
            node.position = startPos;
            node.scale = 1.2;
            let w = 80*Math.random() + 70;
            let exW = 50;
            // if (i % 2 == 0) {
            //     w = -w;
            //     exW = -exW;
            // }
            let h = 0;
            let startPoint = startPos;
            let endPoint = cc.v2(startPoint.x + w, startPoint.y + h);
            let time = 0.5;
            let xishu:number = 1.5;
            let bezier = cc.bezierTo(time,[startPoint,cc.v2(startPoint.x + (endPoint.x - startPoint.x)/2, startPoint.y + 150*xishu),endPoint]);
            let bezier2 = cc.bezierTo(0.28,[endPoint,cc.v2(endPoint.x + exW, endPoint.y + 100*xishu), endPoint.add(cc.v2(exW,0))]);
            endPoint = endPoint.add(cc.v2(exW,0));
            exW = exW/2;
            let bezier3 = cc.bezierTo(0.25,[endPoint,cc.v2(endPoint.x + exW, endPoint.y + 60*xishu), endPoint.add(cc.v2(exW,0))]);
            endPoint = endPoint.add(cc.v2(exW,0));
            exW = exW/2;
            let bezier4 = cc.bezierTo(0.2,[endPoint,cc.v2(endPoint.x + exW, endPoint.y + 20), endPoint.add(cc.v2(exW,0))]);
            node.runAction(cc.sequence(cc.delayTime(Math.random()/3+0.1),bezier.easing(cc.easeIn(0.5)),bezier2.easing(cc.easeOut(1.5)),bezier3.easing(cc.easeOut(1)),bezier4,cc.delayTime(0.5)));
            this.flyNodes.push(node);
        }
        var func = ()=>{
            var isEndFly = false;
            if(this.flyNodes.length>0){
                var flynode:cc.Node = this.flyNodes.pop();
                if(this.flyNodes.length ==0){
                    isEndFly = true;
                    this.unschedule(func);
                }
                this.playResFlySigle(flynode,itemId,flyEnd,isEndFly,useClip);
            }
            else {
                this.unschedule(func);
            }
        };
        this.unschedule(func);
        this.schedule(func
        ,0.1, cc.macro.REPEAT_FOREVER, 1.2);
        if (value>0) {
            this.showLabel(value, startPos);
        }
    }
    // update (dt) {}
}
