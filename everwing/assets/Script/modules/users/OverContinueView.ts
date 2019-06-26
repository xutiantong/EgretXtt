import PanelBase from "../../component/PanelBase";
import WXInterface, {WX_API} from "../share/WXInterface";
import {GAME} from "../../model/GameData";
import DottingUtil, {BIActionConst} from "../../utils/DottingUtil";
import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import {BM} from "../battle/BattleManager";
import {RES} from "../../manager/ResourceManager";
import {BATTLEDATA} from "../../model/BattleData";
import {Toast} from "../toast/Toast";
import {NET} from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import {POOL} from "../../manager/PoolManager";
import {AssetConst} from "../../GameConst";
import GuideHandView from "../gride/GuideHandView";

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
export default class OverContinueView extends PanelBase {

    @property(cc.Label) TimeLebel: cc.Label = null;
    @property(cc.Label) ButtonLebel: cc.Label = null;
    @property(cc.Sprite) TimeSprite1: cc.Sprite = null;
    @property(cc.Sprite) TimeSprite2: cc.Sprite = null;
    @property(cc.Sprite) TimeSprite3: cc.Sprite = null;
    @property(cc.Node) videoBtn: cc.Node = null;
    @property(cc.Node) shareBtn: cc.Node = null;
    @property(cc.Node) refuseBtn: cc.Node = null;
    @property(cc.Node) closeBtn: cc.Node = null;
    private _data:any=null;
    private _time:number = 99;
    //类型  1分享   2看视频
    private _type:number=1;
    private _timeOutId:any=null;
    private _isOpenShare:boolean = false;
    private _lifeAgainShareData = null;
    private _lifeAgainVideoData = null;
    private _shareTime:number=0;
    private _lifetime: number = 0;
    private _lifeAgainSuccess: number = 0;
    private _guideNode: cc.Node = null;

    public onInit(data?:any){
        console.log("打开死亡界面");
        if (this._guideNode != null) {
            POOL.putPrefabToPool(this._guideNode);
        }
        if(data){
            this._data=data;

            this._time = 9;
            if (this._data.configlife && this._data.configlife.time){
                this._time=this._data.configlife.time;
            }
            //this.TimeLebel.string = String(this._time);
            this.lodeNum(this._time);
            this.countDown();
            console.log("倒计时"+this._timeOutId);
            this._lifetime = data.lifetime;
            if (this._lifetime > 0) {
                this.shareBtn.active = true;
                this.ButtonLebel.string = "免费复活";
                this.videoBtn.active = false;
                this.refuseBtn.active = false;
                this.closeBtn.active = true;
                this._type = 3;
                this.guideHandShow();
            } else {
                this.ButtonLebel.string = "分享复活";
                if (this._data.configlife && this._data.configlife.share_ad == 1 && GAME.isShareOpen) {
                    this.shareBtn.active = true;
                    this.videoBtn.active = false;
                    this.refuseBtn.active = false;
                    this.closeBtn.active = false;
                    this.refuseButtonShow();
                    this._type = 1;
                } else {
                    this._type = 2;
                    this.videoBtn.active = true;
                    this.shareBtn.active = false;
                    this.refuseBtn.active = false;
                    this.closeBtn.active = false;
                    this.refuseButtonShow();
                }
            }
            
     
        }
    }
    
    start () {
        BATTLEDATA._touchStatus=1;
    }
    
    onEnable(){
        MSG.on(MessageConst.GuideClick, this.shareButtonAction, this);
        cc.director.on('appOnShow', this.appWillOnShow, this);
        cc.director.on('appOnHide', this.appWillOnHide, this);
        if (this._type == 1 || this._type == 3) {
            let shareData = WX_API.getShareInfoData(WXInterface.shareType_LifeAgain);
            this._lifeAgainShareData = shareData;
            DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessagePre ,{type:shareData['id']});
        }
        let videoData=WX_API.getShareInfoData(WXInterface.videoType_LifeAgain);
        this._lifeAgainVideoData=videoData;
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 1, stepName: '打开残忍拒绝界面', gameStartTime: BM._startGameTime, gameEndTime: new Date().getTime()
        });
    }

    onDisable(){
        MSG.on(MessageConst.GuideClick, this.shareButtonAction, this);
        BATTLEDATA._touchStatus=0;
        cc.director.off('appOnShow', this.appWillOnShow, this);
        cc.director.off('appOnHide', this.appWillOnHide, this);
        this._lifeAgainShareData = null;
        this._lifeAgainVideoData=null;
    }
    private appWillOnShow(){
        console.log('监听 appWillOnShow');
        let nowtime=new Date().getTime();
        let sharetime=nowtime-this._shareTime;
        console.log(sharetime);
        if (this._isOpenShare){
            if (sharetime >= 3000 || this._type == 3) {
                this.shareSuccessCallBack();
            }else{
                Toast.showToast("请分享到不同的群",8,0);
                this.countDown();
            }
            
        }
    }
    private appWillOnHide(){
        console.log('监听 appWillOnHide');
        this._shareTime=new Date().getTime();
    }
    public shareButtonAction(){
        let endTime = new Date().getTime();
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 2, stepName: '点击分享复活按钮', gameStartTime: BM._startGameTime, gameEndTime: endTime
        });

        console.log('shareButtonAction');
        if (window['socialType'] == 1 && this._type != 3) {
            //wxchat
            clearInterval(this._timeOutId);
            let __self = this;
            WX_API.shareByCfg_v1( this._lifeAgainShareData,"",
            (shareData:any,shareId:string,shareToType:number)=>{
                __self._isOpenShare = true;
                console.log('shareOpenCallback',shareData,shareId,shareToType);
                
            },(res, shareId, isSuccess, resEncryptedData)=>{
                console.log('shareFinishCallback',res,shareId,isSuccess,resEncryptedData);
            },this);
            // WX_API.NewShareByCfg(WXInterface.shareType_LifeAgain, "", this.shareSuccessCallBack.bind(this));
        }else{
            //web
            this.shareSuccessCallBack();
        }
    }
    private videoClick(){
        clearInterval(this._timeOutId);
        WX_API.showVideoAd(this._lifeAgainVideoData["id"], this.shareSuccessCallBack.bind(this),this.videoFileCallBack.bind(this),"",this._lifeAgainVideoData["incentiveAdvertising"]);
    }
    private shareSuccessCallBack(){
        if (this._type == 3) {
            this.cutDownLifeTimes();
        } else {
            let endTime = new Date().getTime();
            DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
                stepId: 3, stepName: '复活成功打点', gameStartTime: BM._startGameTime, gameEndTime: endTime
            });
            this.closePanel();
            console.log("复活成功");
            // let sch = cc.director.getScheduler();
            // sch.setTimeScale(1);
            MSG.emit(MessageConst.UseReviveStatus, {status: 1});
            console.log("倒计时yi" + this._timeOutId);
            clearInterval(this._timeOutId);
            this._isOpenShare = false;
        }
    }

    private videoFileCallBack(){
        this.countDown();
    }

    public closeViewButtonAction(){
        console.log('点击残忍拒绝');
        let endTime = new Date().getTime();
        DottingUtil.bi_normalFun(BIActionConst.kActName_FinshOwnGame, {
            stepId: 4, stepName: '点击残忍拒绝', gameStartTime: BM._startGameTime, gameEndTime: endTime
        });

        this.closePanel();
        MSG.emit(MessageConst.UseReviveStatus,{status:0});
        // let sch = cc.director.getScheduler();
        // sch.setTimeScale(1);
        console.log("倒计时er"+this._timeOutId);
        clearInterval(this._timeOutId);
        this._isOpenShare = false;
    }

    //加载数字
    private lodeNum(num:number){

        if(num>=100){
            var num1=Math.floor(num/100);
            var num2=Math.floor(num/10)%10;
            var num3=num%100;
            this.TimeSprite1.node.active=true;
            this.TimeSprite2.node.active=true;
            this.TimeSprite3.node.active=true;
            RES.loadLocalSprite("img/ui/newshuzi/"+num1,this.TimeSprite1);
            RES.loadLocalSprite("img/ui/newshuzi/"+num2,this.TimeSprite2);
            RES.loadLocalSprite("img/ui/newshuzi/"+num3,this.TimeSprite3);
        }
        else if(num>=10){
            var num1=Math.floor(num/10);
            var num2=num%10;
            this.TimeSprite1.node.active=false;
            this.TimeSprite2.node.active=true;
            this.TimeSprite3.node.active=true;
            RES.loadLocalSprite("img/ui/newshuzi/"+num1,this.TimeSprite2);
            RES.loadLocalSprite("img/ui/newshuzi/"+num2,this.TimeSprite3);
        }else{
            this.TimeSprite1.node.active=false;
            this.TimeSprite2.node.active=false;
            this.TimeSprite3.node.active=true;
            RES.loadLocalSprite("img/ui/newshuzi/"+num,this.TimeSprite3);
        }
    }

    /**
     * 展现残忍拒绝按钮
     */
    private refuseButtonShow(){
        this.refuseBtn.active=true;
        this.refuseBtn.opacity=0;
        this.refuseBtn.runAction(cc.sequence(cc.delayTime(1),cc.fadeIn(0.3)));
    }

    /**
     * 倒计时
     */
    private countDown(){
        var _timeOutId=setInterval( ()=>{
            this._time -= 1;
            //this.TimeLebel.string = String(this._time);
            
            if (this._time == -1) {
                this.TimeSprite3.node.active=false;
                clearInterval(_timeOutId);
            }else{
                this.lodeNum(this._time);
            }
        }, 1000 );
        this._timeOutId=_timeOutId;
        console.log("倒计时"+this._timeOutId);
    }

    /**
     * 右上角关闭按钮点击事件，实际复活
     */
    private onCloseBtnClick() {
        if (this._type == 3) {
            this.shareSuccessCallBack();
        } else {
            this.closeViewButtonAction();
        }
    }

    /**
     * 复活成功,减少次数
     */
    private cutDownLifeTimes() {
        NET.send(NetConst.LifeAgainFree, {"method": "consumeLifeTime"}, (data) => {
            if (data) {
                console.log("cutDownLifeTimes", data);
                // console.log('服务器返回的金币数',data.gold);
                GAME.updatePlayerData_v1(data.playerInfo);
            } else {
            }
        }, this);
        MSG.emit(MessageConst.GuideOver);
        console.log("复活成功");
        MSG.emit(MessageConst.UseReviveStatus, {status: 1});
        console.log("倒计时yi" + this._timeOutId);
        clearInterval(this._timeOutId);
        this._isOpenShare = false;
        GAME.playerData.RoleData.lifeTimes--;
        this.closePanel();
    }

    /**
     * 引导
     */
    private guideHandShow() {
        let arcPos = this.shareBtn.getAnchorPoint();
        let wordPos = this.shareBtn.convertToWorldSpaceAR(cc.v2(0, 0));
        let nodePos = this.node.convertToNodeSpaceAR(wordPos);
        let size = this.shareBtn.getContentSize();
        var _self = this;
        POOL.getPrefabFromPool(AssetConst.GuideHandView, (node: cc.Node) => {
            node.parent = _self.node;
            var guideView = node.getComponent(GuideHandView);
            guideView.onInit({"arcPos": arcPos, "wordPos": nodePos, "size": size});
            _self._guideNode = node;
        });
    }
}
