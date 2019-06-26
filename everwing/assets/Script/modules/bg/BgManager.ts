import { PANEL } from "../../manager/PanelManager";
import { POOL } from "../../manager/PoolManager";
import { AssetConst } from "../../GameConst";
import { RES } from "../../manager/ResourceManager";
import StarBg from "./StarBg";
import { bgHeight } from "../battle/Enitiy/MonsterEntity";
import { LEVELMG } from "../level/LevelManager";

const {ccclass, property} = cc._decorator;

export const BossConst = {
    0:"img/BG/backImg3.png",
    1:"img/BG/backImg1.png",
    2:"img/BG/backImg2.png",
}

@ccclass
export default class BgManager extends cc.Component {

    private _bgNode:cc.Node = null;
    private _bg1Node:cc.Node = null;
    private _bg2Node:cc.Node = null;

    private _starBg1: StarBg = null;
    private _starBg2: StarBg = null;

    private _bgZorder: number = 1;
    private _bgindex: number = 1;
    private _starZorder: number = 2;
    public static deFaultHeight: number = 2024*2;
    private static _instance: BgManager = null;
    public static getInstance(): BgManager {
        if (BgManager._instance == null) {
            BgManager._instance = new BgManager();
        }
        return BgManager._instance;
    }


    /**
     * 注册节点
     */
    public regisgterNode()
    {
        this._bgNode = PANEL.panelHolder.bgLayer;
    }
    //初始化背景
   public startBattleBack(cb:Function){
       this.initBg();
       this._starBgRefresh();
       cb && cb();
   }
   //清理背景子节点
   public cleanBattleBack(){
        if (this._starBg1) {
            this._starBg1.node.stopAllActions();
            POOL.putPrefabToPool(this._starBg1.node);
            this._starBg1 = null;
        }
        if (this._starBg2) {
            this._starBg2.node.stopAllActions();
            POOL.putPrefabToPool(this._starBg2.node);
            this._starBg2 = null;
        }
        if (this._bgNode) {
            this._bgNode.removeAllChildren();
        }
   }
   //关卡变化更换背景图片
   public chaperChangedForBg(cb:Function){
        this._starBgRefresh();
        if (cb){
            cb();
        }
        BGMG.changeBg(LEVELMG.currentChapter);
       //目前不换背景颜色
    // let bgNum = Math.round(Math.random()*3);
    // let bgName = "";
    // if(bgNum == 1){
    //     bgName = "green_bg";
    // }else if(bgNum == 2){
    //     bgName = "blue_bg";
    // }else if(bgNum == 3){
    //     bgName = "brown_bg";
    // }
    // console.log("加载名称:"+bgName);
    // if(bgName!=""){
    //     let bg1Sp = this._bgNode.getChildByName("bg1Node").getChildByName("bg").getComponent(cc.Sprite);
    //     let bg2Sp = this._bgNode.getChildByName("bg2Node").getChildByName("bg").getComponent(cc.Sprite);
    //     RES.loadLocalSprite("ui/battleBG/"+bgName,bg1Sp);
    //     RES.loadLocalSprite("ui/battleBG/"+bgName,bg2Sp);
    // }
   }
 
    private initBg() {
        let startP = cc.v2(0, BgManager.deFaultHeight);
        let endP = cc.v2(0, -BgManager.deFaultHeight);
        let dur = 60;

        let bgNum = Math.round(Math.random()*3);
        let bgName = "";
        // if(bgNum == 1){
        //     bgName = "green_bg";
        // }else if(bgNum == 2){
        //     bgName = "blue_bg";
        // }else if(bgNum == 3){
        //     bgName = "brown_bg";
        // }
        console.log("加载名称:"+bgName);
        let bg1Node:cc.Node = null;
        let __self = this;
        POOL.getPrefabFromPool(AssetConst.BattleBg,(node:cc.Node)=>{
            node.parent = __self._bgNode;
            node.setLocalZOrder(this._bgZorder);
            bg1Node = node;
            bg1Node.name = "bg1Node";
            __self._bg1Node = node;
            // let sp1 = bg1Node.getChildByName("bg").getComponent(cc.Sprite);
            // RES.loadLocalSprite("ui/battleBG/"+bgName,sp1);
            bg1Node.setPosition(cc.v2(0,0));
            let seq1 = cc.sequence( cc.moveTo(dur/2, endP), cc.moveTo(0, startP), cc.moveTo(dur/2, cc.v2(0,0)));
            bg1Node.runAction( cc.repeatForever( seq1 ) );
        });

        let bg2Node:cc.Node = null;
        POOL.getPrefabFromPool(AssetConst.BattleBg,(node:cc.Node)=>{
            node.parent = __self._bgNode;
            node.setLocalZOrder(this._bgZorder);
            bg2Node = node;
            bg2Node.name = "bg2Node";
            __self._bg2Node = node;
            // let sp2 = bg2Node.getChildByName("bg").getComponent(cc.Sprite);
            // RES.loadLocalSprite("ui/battleBG/"+bgName,sp2);
            bg2Node.setPosition(startP);
            let seq2 = cc.sequence( cc.moveTo(dur, endP), cc.moveTo(0, startP) );
            bg2Node.runAction( cc.repeatForever( seq2 ) );
            __self._bg2Node = bg2Node;
            // this.triggerRush();
        });

    }

    public changeBg(index:number){
        if(index>=3){
            index = index%3;
        }
        if(this._bg1Node){
            this.doChangeBg(this._bg1Node,BossConst[index]);
        }
        if(this._bg2Node){
            this.doChangeBg(this._bg2Node,BossConst[index]);
        }
    }

    private doChangeBg(node:cc.Node,path:string){
        let spr:cc.Sprite = node.getChildByName("bg").getComponent(cc.Sprite);
        
        RES.loadLocalSprite(path,spr,2);
    }

    private _starBgRefresh () {
        let startP = cc.v2(0, BgManager.deFaultHeight);
        let endP = cc.v2(0, -BgManager.deFaultHeight);
        let dur = 40;
        let __self = this;

        if (this._starBg1 == null) {
            POOL.getPrefabFromPool(AssetConst.StarBg, (node:cc.Node)=>{
                node.parent = __self._bgNode;
                node.setLocalZOrder(this._starZorder);
                __self._starBg1 = node.getComponent(StarBg);
                
                node.setPosition(cc.v2(0,0));
                let seq1 = cc.sequence( cc.moveTo(dur/2, endP), cc.moveTo(0, startP), cc.moveTo(dur/2, cc.v2(0,0)));
                node.runAction( cc.repeatForever( seq1 ) );
                __self._starBg1.refreshBgPic();
            });

            POOL.getPrefabFromPool(AssetConst.StarBg, (node:cc.Node)=>{
                node.parent = __self._bgNode;
                node.setLocalZOrder(this._starZorder);
                __self._starBg2 = node.getComponent(StarBg);
                node.setPosition(startP);
                let seq2 = cc.sequence( cc.moveTo(dur, endP), cc.moveTo(0, startP) );
                node.runAction( cc.repeatForever( seq2 ) );
                __self._starBg2.refreshBgPic();
            });
        } else {
            this._starBg1.node.stopAllActions();
            this._starBg1.node.setPosition(cc.v2(0,0));
            let seq1 = cc.sequence( cc.moveTo(dur/2, endP), cc.moveTo(0, startP), cc.moveTo(dur/2, cc.v2(0,0)));
            this._starBg1.node.runAction( cc.repeatForever( seq1 ) );
            this._starBg1.refreshBgPic();

            this._starBg2.node.stopAllActions();
            this._starBg2.node.setPosition(startP);
            let seq2 = cc.sequence( cc.moveTo(dur, endP), cc.moveTo(0, startP) );
            this._starBg2.node.runAction( cc.repeatForever( seq2 ) );
            this._starBg2.refreshBgPic();
        }
    }
}

export var BGMG = BgManager.getInstance();