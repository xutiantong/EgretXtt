import PopupBase from "../../component/PopupBase";

import PanelBase from "../../component/PanelBase";
import LevelManager, { LEVELMG } from "../level/LevelManager";
import { BM  } from "./BattleManager";
import PanelManager, { PANEL } from "../../manager/PanelManager";
import { wxOpenData, WxDomainAction, WxOpenDataKeys } from "../../WXOpenData/WxOpenData";
import { SOUND } from "../../manager/SoundManager";
import WXInterface, { WX_API } from "../share/WXInterface";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";
import { GAME } from "../../model/GameData";
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
export default class ReStartView extends PopupBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    battlegroup: cc.Button = null;

    @property(cc.Button)
    shareIt: cc.Button = null;

    @property(cc.Node)
    panelBg:cc.Node = null;

    @property(cc.Button)
    aginGame: cc.Button = null;


    @property(cc.Sprite)
    rankSprite: cc.Sprite = null;

    private _rankShareData=null;
    private _showShareData=null;
    private _restartTex = new cc.Texture2D();

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        wxOpenData.updateSharedCanvas(this.rankSprite, this._restartTex);
    }

    onEnable(){
        let shareDataRank=WX_API.getShareInfoData(WXInterface.shareType_Rank);
        this._rankShareData=shareDataRank;
        DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessagePre ,{type:shareDataRank["id"]});
        let shareDataShow = WX_API.getShareInfoData(WXInterface.shareType_ShowShare);
        this._showShareData = shareDataShow;
        DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessagePre ,{type:shareDataShow['id']});
    }

    onDisable(){
        this._rankShareData=null;
        this._showShareData=null;
    }

    public onInit () {
        console.log('弹出再次挑战界面')
        let endTime = new Date().getTime();
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameAgain, {
            stepId: 1, stepName: '弹出再次挑战界面', gameStartTime: BM._startGameTime, gameEndTime: endTime
        });
        WX_API.gameClubHide();
        console.log('reStart onInit')
        wxOpenData.initSharedCanvas(this.rankSprite, WxDomainAction.RestartRank, WxOpenDataKeys.Score);
     


        //是否屏蔽北上广
        if(GAME.isShareOpen){
            this.battlegroup.node.active= true;
        }else{   
            this.battlegroup.node.active= false;
            this.panelBg.width = 656;
            this.panelBg.height = 520;
            this.aginGame.node.y = -125;
            this.shareIt.node.y = -125;
            this.panelBg.y = 65;
        }
    }

    private onCloseClick(){
        console.log('点击关闭')
        let endTime = new Date().getTime();
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameAgain, {
            stepId: 5, stepName: '点击关闭再次挑战', gameStartTime: BM._startGameTime, gameEndTime: endTime
        });
        WX_API.gameClubShow();
        MSG.emit(MessageConst.showUpLevel);
        this.closePanel();
    }


    private reStartGame(){
        console.log('点击再来一局')
        let endTime = new Date().getTime;
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameAgain, {
            stepId: 4, stepName: '点击再来一局', gameStartTime: BM._startGameTime, gameEndTime: endTime
        });
        this.closePanel();
        MSG.emit(MessageConst.StartGame);
        
       
    }

    private battleGroup(){
        console.log('挑战群')
        let endTime = new Date().getTime();
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameAgain, {
            stepId: 2, stepName: '点击挑战群', gameStartTime: BM._startGameTime, gameEndTime: endTime
        });
        WX_API.shareByCfg_v1(this._rankShareData,"",
                (shareData:any,shareId:string,shareToType:number)=>{
                    console.log('shareOpenCallback',shareData,shareId,shareToType);
                },(res, shareId, isSuccess, resEncryptedData)=>{
                    console.log('shareFinishCallback',res,shareId,isSuccess,resEncryptedData);
                },this);
    }

    private share(){
        console.log('点击炫耀')
        let endTime = new Date().getTime();
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameAgain, {
            stepId: 3, stepName: '点击炫耀', gameStartTime: BM._startGameTime, gameEndTime: endTime
        });
        WX_API.shareByCfg_v1( this._showShareData,"",
        (shareData:any,shareId:string,shareToType:number)=>{
            console.log('shareOpenCallback',shareData,shareId,shareToType);
        },(res, shareId, isSuccess, resEncryptedData)=>{
            console.log('shareFinishCallback',res,shareId,isSuccess,resEncryptedData);
        },this);
    }    

}
