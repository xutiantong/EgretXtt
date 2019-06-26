import PopupBase from "../../component/PopupBase";
import { RES } from "../../manager/ResourceManager";
import { RewardConst } from "./RewardManager";
import { PANEL } from "../../manager/PanelManager";
import { ResourceConst } from "../../GameConst";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";

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
export default class BoxReward extends PopupBase {

    @property(cc.Node)  rewardNode1: cc.Node=null;
    @property(cc.Label) rewardLabel1: cc.Label = null;
    @property(cc.Sprite) rewardSprite1: cc.Sprite=null;

    @property(cc.Node)  rewardNode2: cc.Node=null;
    @property(cc.Label) rewardLabel2: cc.Label = null;
    @property(cc.Sprite) rewardSprite2: cc.Sprite=null;

    @property(cc.Node)  rewardNode3: cc.Node=null;
    @property(cc.Label) rewardLabel3: cc.Label = null;
    @property(cc.Sprite) rewardSprite3: cc.Sprite=null;

    private _hasgold:number=0;
    private _hastrophy:number=0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    public onInit(prame){
        super.onInit(prame);
        this.rewardNode1.active=false;
        this.rewardNode2.active=false;
        this.rewardNode3.active=false;
        this._hastrophy=0;
        this._hasgold=0;
        if(prame&&prame.length>0){
            this.rewardNode1.active=true;
            this.rewardLabel1.string=prame[0]["num"];
            this.loadRewardImg(prame[0]["type"],this.rewardSprite1,this.rewardNode1);
            if(prame.length>1){
                this.rewardNode2.active=true;
                this.rewardLabel2.string=prame[1]["num"];
                this.loadRewardImg(prame[1]["type"],this.rewardSprite2,this.rewardNode2);
                if(prame.length>2){
                    this.rewardNode3.active=true;
                    this.rewardLabel3.string=prame[2]["num"];
                    this.loadRewardImg(prame[2]["type"],this.rewardSprite3,this.rewardNode3);
                }
            }
        }
        this.scheduleOnce(()=>{
            this.flyAnimation();
        },1)
    }

    private loadRewardImg(type:string,sprite:cc.Sprite,node:cc.Node){
        if(type==RewardConst.RewardGold){
            this._hasgold+=1;
            RES.loadLocalSprite("img/common/jinbi",sprite);
            console.log(node.convertToWorldSpace(sprite.node.position));
            this.scheduleOnce(()=>{
                PANEL.mui.playResflyAni(ResourceConst.Gold,node.convertToWorldSpace(sprite.node.position).add(cc.v2(100, 20)));
            },1);
            
        }else if(type==RewardConst.RewardTrophy){
            this._hastrophy+=1;
            RES.loadLocalSprite("img/common/jiangbei",sprite);
            this.scheduleOnce(()=>{
                PANEL.mui.playResflyAni(ResourceConst.Trophy,node.convertToWorldSpace(sprite.node.position).add(cc.v2(100, 20)));
            },1);
        }
    }

    private flyAnimation(){
        // if(this._hasgold){

        //     PANEL.mui.playResflyAni(ResourceConst.Gold, cc.p(cc.winSize.width/2,cc.winSize.height/2).add(cc.v2(40, 20)));
        // }
        // if(this._hastrophy){
        //     PANEL.mui.playResflyAni(ResourceConst.Trophy, cc.p(cc.winSize.width/2,cc.winSize.height/2).add(cc.v2(40, 20)))
        // }
        MSG.emit(MessageConst.updateMainViewData);
        this.closePanel();
    }

}
