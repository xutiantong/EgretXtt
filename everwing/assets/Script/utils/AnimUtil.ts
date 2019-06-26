import { POOL } from "../manager/PoolManager";
import { ZERO } from "../GameConst";

export default class AnimUtil{

    public static showLabelFly(node:cc.Node,str:string){
        var labelNode:cc.Node = POOL.getLabelFromPool();
        var label:cc.Label = labelNode.getComponent(cc.Label);
        label.node.parent = node;

        //格式化
        label.string = str;
        label.fontSize = 28;
        label.node.color = cc.color(255,255,255,255);
        label.node.opacity = 255;
        label.node.position = ZERO;
        
        var spa = cc.spawn(cc.moveTo(0.6,label.node.position.add(cc.v2(0,50))),
            cc.sequence(cc.delayTime(0.3),cc.fadeOut(0.3))      
        )
        var callback = cc.callFunc(function(){
            POOL.putLabelToPool(labelNode);
        },this);
        label.node.runAction(cc.sequence(spa,callback));
    }
}
