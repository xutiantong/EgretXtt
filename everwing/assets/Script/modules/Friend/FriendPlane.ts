import { RES } from "../../manager/ResourceManager";
import PoolManager, { POOL } from "../../manager/PoolManager";
import PlaneBullet from "./PlaneBullet";
import { PANEL } from "../../manager/PanelManager";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import { AssetConst } from "../../GameConst";

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
export default class FriendPlane extends cc.Component {

    @property(cc.Node)
    plane1: cc.Node = null;

    @property(cc.Node)
    plane2: cc.Node = null;

    @property(cc.Sprite)
    headImg:cc.Sprite=null;

    private _rushType:number=0;
    private _battleNode:cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    onEnable(){
        MSG.on(MessageConst.RushAddSpeed, this.startRushState, this);
        this._battleNode = PANEL.panelHolder.battleLayer;
    }

    onDisable(){
        this.unscheduleAllCallbacks();
        MSG.off(MessageConst.RushAddSpeed, this.startRushState, this);
    }

    // update (dt) {}
    //初始化
    public setdata(data){
        if(data){
            if(data.planeType==1){
                this.plane1.active=true;
                this.plane2.active=false;
                
            }else{
                this.plane2.active=true;
                this.plane1.active=false;
            }

            if(data.portrait&&data.portrait!=""){
                RES.loadHeadSpriteV1(data.portrait,this.headImg);
            }else{
                let uid=String(data["uid"]);
                RES.loadnpcSprite(uid.substr(uid.length-1),this.headImg);
            }
            this._rushType=data.rushType;
            this.schedule( this.addBullet.bind(this), 0.066 );
        }
    }

    //添加子弹
    private addBullet(){

        if (this._rushType != 0) {
            return;
        }

        POOL.getPrefabFromPool(AssetConst.PlaneBullet,(node:cc.Node)=>{
            if(node==null)
            {
                return;
            }
            if(this.node&&this.node.parent)
            {
                node.parent =this._battleNode;
                let sp =this.node.getPosition().add( cc.v2(0, 80)).add(this.node.parent.parent.position);

                node.setPosition(  sp );
                let worldPos = sp;
                let com:PlaneBullet = node.getComponent(PlaneBullet);
                com.onlaunch( sp.add( cc.v2(0,cc.winSize.height - worldPos.y) ));
            }
        });
    }
    
    /**
     * 监听冲刺
     */
    private startRushState(e) {
        this._rushType = e.detail.type;
    }

}
