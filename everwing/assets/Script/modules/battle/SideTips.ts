import PrefabBase from "../../component/PrefabBase";
import { POOL } from "../../manager/PoolManager";
import { AssetConst } from "../../GameConst";
import { PANEL } from "../../manager/PanelManager";
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
export default class SideTips extends PrefabBase {

    public static ShowPos =cc.p(cc.winSize.width+91,(cc.winSize.height/2)-100);
    @property(cc.Label)
    public uplabel:cc.Label = null;

    @property(cc.Label)
    public downlabel:cc.Label = null;

    @property(cc.Sprite)
    public iconSp:cc.Sprite = null;

    public uptxt:string="";
    public downtxt:string="";
    public icon:string="";

    public reuse()
    {
        this.uplabel.string = "";
        this.downlabel.string ="";
        this.node.active =true;
        
    }
    private static count:number=0;
    public unuse()
    {
        this.node.stopAllActions();
        this.node.active =false;
    }
    public static ShowSideTips(uplabel:string,downlabel:string,icon:string)
    {
        SideTips.count++;
        POOL.getPrefabFromPool(AssetConst.SideTips,(node:cc.Node)=>{
            node.parent = PANEL.panelHolder.battleLayer;
            let cmpt = node.getComponent(SideTips);
            if(cmpt)
            {
                cmpt.uptxt = uplabel;
                //console.log("uplabel:"+uplabel);
                cmpt.downtxt = downlabel;
                cmpt.icon = icon;
                cmpt.initView();
            }
            node.setPosition(SideTips.ShowPos);
            //console.log("SideTips.ShowPos:"+SideTips.ShowPos);
            node.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.5),cc.moveBy(0.5,cc.p(-200,(-(SideTips.count-1))*100))),
            cc.delayTime(1),
            cc.spawn(cc.fadeOut(0.5),cc.moveBy(0.5,cc.p(200,(-(SideTips.count-1))*100),)),
            cc.callFunc(()=>{
                POOL.putPrefabToPool(node);
                SideTips.count--;
            })));
        });
    }
    public initView()
    {
        //console.log(this.uptxt);
        this.uplabel.string = this.uptxt;
        this.downlabel.string =this.downtxt;
        RES.loadLocalSprite(this.icon,this.iconSp);
    }
}
