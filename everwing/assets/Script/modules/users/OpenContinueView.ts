import PopupBase from "../../component/PopupBase";
import WXInterface, { WX_API } from "../share/WXInterface";
import GameData, { GAME } from "../../model/GameData";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import { CFG } from "../../manager/ConfigManager";
import ComItem from "../../component/ComItem";
import MList from "../../component/MList";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import { RES } from "../../manager/ResourceManager";
import { AssetConst, ConfigConst } from "../../GameConst";
import { POOL } from "../../manager/PoolManager";
import { PANEL } from "../../manager/PanelManager";
import MonsterNormal from "../battle/Monster/MonsterNormal";
import MonsterNormalBlink from "../battle/Monster/MonsterNormalBlink";
import {MONSTMG} from "../monsterMg/MonsterMg";
import {RUSHTOBOSS} from "./rushTobossMG";
import { BM } from "../battle/BattleManager";
import LevelManager, { LEVELMG } from "../level/LevelManager";
import {BATTLEDATA, GameState, RushType} from "../../model/BattleData";
import PanelBase from "../../component/PanelBase";

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
export default class OpenContinueView extends PanelBase {
    @property(cc.Sprite) bossSpr: cc.Sprite = null;
    @property(cc.Sprite) bossNum1: cc.Sprite = null;
    @property(cc.Sprite) bossNum2: cc.Sprite = null;
    @property(cc.Sprite) bossNum3: cc.Sprite = null;
    @property(cc.Label)  bossName:cc.Label =null;
    @property(cc.ScrollView) scroll:cc.ScrollView=null;
    @property(cc.Button) okBtn:cc.Button=null;

    private _monsterNode:cc.Node = null;
    private _energyList:MList=null;
    private _energyNum:number=0;
    private _bossId:number=0;
    private _checkpointId:number=0;
    private _close:boolean=false;
    private _lashScore:number=0;
    private _configId = "50";
    private _wxVideoId = "adunit-c9d4c0250c9d87ac";
    private _sch=1;
    private _videoRushToBossData=null;

    private closeTimer= null;
    public onLoad(){
        this._monsterNode = PANEL.panelHolder.monsterLayer;
        this._energyList = this.scroll.getComponent(MList);
    }

    start () {

    }

    onEnable(){
        this.unscheduleAllCallbacks();
        this.closeTimer=  setTimeout(() => {
            this.closePanel();
            this._close=true;
        }, 3000);
        this._energyNum=GAME.playerData.RushBossData.energyNum;
        this._bossId=GAME.playerData.RushBossData.bossId;
        this._checkpointId=GAME.playerData.RoleData.checkpointId;
        this._lashScore=GAME.playerData.RushBossData.lashScore;

        if(this._energyNum>0){
            this.okBtn.interactable=true;
        }else{
            this.okBtn.interactable=false;
        }
        this.setList();
        this.setNum();
        RES.loadLocalSprite("img/common1/boss/bossImg/boss"+this._bossId,this.bossSpr);
        var bossInfo=CFG.getCfgDataById(ConfigConst.BOSS,this._bossId.toString());
        if(bossInfo){
            this.bossName.string= bossInfo.remark;
        }
        let videoData=WX_API.getShareInfoData(WXInterface.videoType_RushToBoss);
        this._videoRushToBossData=videoData;
    }
    onDisable() {
        this._videoRushToBossData=null;
    }

    update(){
        let sch= cc.director.getScheduler();
        let scale= sch.getTimeScale();
        // if(scale==1&&(!this._close)){
        //     this.closePanel();
        //     this._close=true;
        // }
    }

    public clickOKBtn(){
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
        this.consume();
        MSG.emit(MessageConst.initBeforeBossGold,{"num":this._lashScore});
        BATTLEDATA._scoreNum=this._lashScore;

        NET.send(NetConst.RushToBoss,{method:"consume"}, (data) => {
            if(data&&data.message=="ok"){
                //消耗能量瓶
            }
        }, this);
    }

    public videoBtn(){
        //
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
        BM.gameBtnPause=true;
        let sch = cc.director.getScheduler();
        sch.setTimeScale(0);
        if(this._videoRushToBossData){
            WX_API.showVideoAd(this._videoRushToBossData["id"], this.videoReset.bind(this),this.failVideo.bind(this),"",this._videoRushToBossData["incentiveAdvertising"]);
        }
    }

    public clickCloseBtn(){
        this.closePanel();
        this._close=true;
    }

    private setList(){
        var dataList=[];
        for(let i=0;i<5;i++){
            if(i<this._energyNum){
                dataList.push(true);
            }else{
                dataList.push(false);
            }
        }
        this._energyList.setData(dataList);
    }

    private setNum(){
        let num=this._checkpointId-1;
        if(num>=100){
            var num1=Math.floor(num/100);
            var num2=Math.floor(num/10)%10;
            var num3=num%100;
            this.bossNum1.node.active=true;
            this.bossNum2.node.active=true;
            this.bossNum3.node.active=true;
            RES.loadLocalSprite("img/ui/bossshuzi/shuzi"+num1,this.bossNum1);
            RES.loadLocalSprite("img/ui/bossshuzi/shuzi"+num2,this.bossNum2);
            RES.loadLocalSprite("img/ui/bossshuzi/shuzi"+num3,this.bossNum3);
        }
        else if(num>=10){
            var num1=Math.floor(num/10);
            var num2=num%10;
            this.bossNum1.node.active=false;
            this.bossNum2.node.active=true;
            this.bossNum3.node.active=true;
            RES.loadLocalSprite("img/ui/bossshuzi/shuzi"+num1,this.bossNum2);
            RES.loadLocalSprite("img/ui/bossshuzi/shuzi"+num2,this.bossNum3);
        }else{
            this.bossNum1.node.active=false;
            this.bossNum2.node.active=false;
            this.bossNum3.node.active=true;
            RES.loadLocalSprite("img/ui/bossshuzi/shuzi"+num,this.bossNum3);
        }
    }

    //消耗能量瓶
    private consume(){
       if(this._energyNum!= 0){
            //能量瓶消耗
            this._energyNum--;
            GAME.updateRushBossData({ energyNum: this._energyNum });
            //冲刺
            LEVELMG.chooseCurrentChapter(GAME.playerData.RoleData.checkpointId - 1, () => { })
            MSG.emit(MessageConst.RushAddSpeed, { type: RushType.Rush_Boss, rushtoboss: true, bossId: this._bossId });
            // RUSHTOBOSS.createMonsters(this._bossId);
            // BM.rushToBoss=true;
       }
        this.closePanel();
        this._close=true;
        
    }

    private videoReset() {
        NET.send(NetConst.RushToBoss,{method:"reset"}, (data) => {
            if(data&&data.message=="ok"){
 
            }
        }, this);
        this._energyNum=5;
        GAME.updateRushBossData({ energyNum: this._energyNum });
        this.setList();
        this.setNum();
        BM.gameBtnPause = false;
        LEVELMG.chooseCurrentChapter(GAME.playerData.RoleData.checkpointId - 1, () => {
            MSG.emit(MessageConst.RushAddSpeed, { type: RushType.Rush_Boss, rushtoboss: true, bossId: this._bossId });
            this.closePanel();
            this._close = true;
         })
        // let sch = cc.director.getScheduler();
        // if(BATTLEDATA._rushType!=RushType.Rush_None){
        //     sch.setTimeScale(5);
        // }else{
        //     sch.setTimeScale(this._sch);
        // }
        // this.closePanel();
    }

    private failVideo(){
        BM.gameBtnPause = false;
        let sch = cc.director.getScheduler();
        if(BATTLEDATA._rushType!=RushType.Rush_None){
            sch.setTimeScale(5);
        }else{
            sch.setTimeScale(this._sch);
        }
        // this.closePanel();
        setTimeout(() => {
            this.closePanel();
        }, 3000);
    }
}
