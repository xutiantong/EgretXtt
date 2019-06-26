import PrefabBase from "../../component/PrefabBase";
import { POOL } from "../../manager/PoolManager";
import { AssetConst } from "../../GameConst";
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
export default class AddNumItem extends PrefabBase {
   private static fixPos:cc.Vec2=new cc.Vec2(0,200);
   unuse()
   {
        this.node.active=false;
   }
   reuse()
   {
       this.node.stopAllActions();
        this.node.active=true;
   }
   create()
   {
   }
   public onEnable()
   {
       //console.log(this.node.position);
        this.node.runAction(cc.sequence(cc.fadeIn(0.4),cc.fadeOut(0.4),cc.callFunc(()=>{
        POOL.putPrefabToPool(this.node);
        })));
   }
    // update (dt) {}
    public static ShowNum(pos:cc.Vec2,num:number)
    {
        POOL.getPrefabFromPool(AssetConst.AddNumItem+"/addNum"+String(num),(nd:cc.Node)=>{
            nd.parent = PANEL.panelHolder.battleLayer;
            nd.setPosition(pos.add(AddNumItem.fixPos));
        });
    }
}
