import { wxOpenData, WxDomainAction, WxOpenDataKeys } from "../../WXOpenData/WxOpenData";
import PanelBase from "../../component/PanelBase";
import WXInterface, { WX_API } from "../share/WXInterface";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";
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
export default class RankView extends PanelBase {

    @property(cc.Label)
    buttonLabel: cc.Label = null;

    @property(cc.Sprite)
    rankSprite: cc.Sprite = null;

    @property(cc.Node)
    handSprite:cc.Node=null;

    private _texture: cc.Texture2D = new cc.Texture2D();
    private _rankShareData=null;
    private _isguide:boolean=false;
    // LIFE-CYCLE CALLBACKS:

    onEnable(){
        let shareData=WX_API.getShareInfoData(WXInterface.shareType_Rank);
        this._rankShareData=shareData;
        DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessagePre ,{type:shareData["id"]});
    }

    onDisable(){
        this._rankShareData=null;
       
    }

    public onInit (data) {
        super.onInit(data);
        let sharedCanvas = wxOpenData.wxGetSharedCanvas();
        wxOpenData.initSharedCanvas(this.rankSprite, WxDomainAction.FriendRank, WxOpenDataKeys.Score);
        this._isguide=data.isguide;
        if(data.isguide){ 
            this.guideHandShow();
        }else{
            this.handSprite.active=false;
        }
    }

    private onCloseClick(){
        this.closePanel();
        WX_API.gameClubShow();
       
    }
    private onReturnClick(){
        this.closePanel();
        WX_API.gameClubShow();
    }
    private onChartsClick(){
        console.log("群排行");
        WX_API.shareByCfg_v1(this._rankShareData,"",
                (shareData:any,shareId:string,shareToType:number)=>{
                    console.log('shareOpenCallback',shareData,shareId,shareToType);
                },(res, shareId, isSuccess, resEncryptedData)=>{
                    console.log('shareFinishCallback',res,shareId,isSuccess,resEncryptedData);
                },this);
    }
    update (dt) {
        wxOpenData.updateSharedCanvas(this.rankSprite, this._texture);
    }

    /**
     * 引导
     */
    private guideHandShow(){
        console.log('排行引导'+this._isguide);
        this.handSprite.active=true;
        var moveup=cc.v2(-10,10);
        var movedown=cc.v2(10,-10);
        this.handSprite.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.4,moveup),cc.moveBy(0.4,movedown))));
    }

}
