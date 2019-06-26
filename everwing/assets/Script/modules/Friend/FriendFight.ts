import PanelBase from "../../component/PanelBase";
import WXInterface, { WX_API } from "../share/WXInterface";
import MList from "../../component/MList";
import { Toast } from "../toast/Toast";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import { BM } from "../battle/BattleManager";
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
export default class FriendFight extends PanelBase {

    @property(cc.Button)
    shareButton: cc.Button = null;
    @property(cc.Button)
    fightingButton: cc.Button = null;
    @property(cc.ScrollView)
    scrollView:cc.ScrollView=null;

    private _friendList:MList=null;
    private _data:Array<any>=[];
    private _shareTime:number=0;
    private _isOpenShare:boolean = false;
    private _FriendFightShareData=null;
    private _sch=1;
    
    onLoad (){
        this._friendList = this.scrollView.getComponent(MList);
    }

    public onInit(data?:any){
        this._sch=data.sch;
        if(data.fight){
            this.fightingButton.node.active=true;
            let sch = cc.director.getScheduler();
            if(sch.getTimeScale()!=0){
                BM.friendFrightShowing=true;
                this._sch=sch.getTimeScale();
                sch.setTimeScale(0);
            }
            
        }else{
            this.fightingButton.node.active=false;
        }
        //请求数据
        NET.send(NetConst.FriendFight,{"method":"list"}, (data)=>{
            console.log("list",data);
            if(data&&data.list){
                this._data=data.list;
                this.initFriendData();
            }
        },this);
        // this._data=[{
        //     "uid": "0",
        //     "sex": "0",
        //     "name": "0",
        //     "portrait": ""
        // }];
        // this.initFriendData();
    }

    start () {

    }

    onEnable(){
        //分享打点
        cc.director.on('appOnShow', this.appWillOnShow, this);
        cc.director.on('appOnHide', this.appWillOnHide, this);
        let shareData = WX_API.getShareInfoData(WXInterface.shareType_FriendFight);
        this._FriendFightShareData = shareData;
        DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessagePre ,{type:shareData['id']});
        MSG.on(MessageConst.FriendFrientFromShare,this.refrishList,this);

    }

    onDisable(){
        cc.director.off('appOnShow', this.appWillOnShow, this);
        cc.director.off('appOnHide', this.appWillOnHide, this);
        this._FriendFightShareData = null;
        MSG.off(MessageConst.FriendFrientFromShare,this.refrishList,this);
    }

    private appWillOnShow(){
        console.log('监听 appWillOnShow')
        let nowtime=new Date().getTime();
        let sharetime=nowtime-this._shareTime;
        console.log(sharetime);
        if (this._isOpenShare){
            // if(sharetime>=3000){
                this.shareSuccessCallBack();
            // }else{
            //     Toast.showToast("请分享到不同的群",8,0);
            // }   
        }
    }

    private appWillOnHide(){
        console.log('监听 appWillOnHide')
        this._shareTime=new Date().getTime();
    }
    
    //分享
    private onShareClick(){
        console.log('shareButtonAction')
        if (window['socialType'] == 1){
            //wxchat
            let __self = this;
            WX_API.shareByCfg_v1( this._FriendFightShareData,"",
            (shareData:any,shareId:string,shareToType:number)=>{
                __self._isOpenShare = true;
                console.log('shareOpenCallback',shareData,shareId,shareToType);
                
            },(res, shareId, isSuccess, resEncryptedData)=>{
                console.log('shareFinishCallback',res,shareId,isSuccess,resEncryptedData);
            },this);
        }else{
            //web
            this.shareSuccessCallBack();
        }
    }

    //分享成功回调
    private shareSuccessCallBack(){
        this._isOpenShare = false;
        Toast.showToast("发送群求助更多朋友",1.5);
    }

    //出战
    private onFightingClick(){
        //出战
        if(window['socialType'] == 1){
            if(this._data.length!=0){
                NET.send(NetConst.FriendFight,{"method":"consume","consumeId":this._data[0].uid}, (data)=>{
                    console.log("consumeId",data);
                    if(data.result&&data.result.message=="ok"){
                        MSG.emit(MessageConst.FriendFrientPlane,this._data[0]);
                        this._data.splice(0,1);
                        if(this._data.length==0){
                            MSG.emit(MessageConst.friendRedSpotShow,{"redspot":false});
                        }
                        this.initFriendData();
                        this.onCloseButtonClick();
                        
                    }else{
                        Toast.showToast("出战失败",1.5);
                        this.onCloseButtonClick();
                    }
                },this,()=>{
                    Toast.showToast("出战失败",1.5);
                    this.onCloseButtonClick();
                });
                
            }else{
                Toast.showToast("暂时没有好友为您助战",1.5);
            }
        }else{
            this._data=[{
                "uid": "0",
                "sex": "0",
                "name": "0",
                "portrait": ""
            }];
            MSG.emit(MessageConst.FriendFrientPlane,this._data[0]);
            this.onCloseButtonClick();
        }
        
    }

    //关闭界面
    private onCloseButtonClick(){
        this._isOpenShare = false;
        this.setLastScheduler();
        this.closePanel();
    }

    /**
     * 初始化好友数据
     */
    private initFriendData(){
        if(this._data.length>8){
            this._friendList.setData(this._data.slice(8));
        }else{
            var friendListData=JSON.parse(JSON.stringify(this._data));
            var frienddata={"notfriend":1};
            while(friendListData.length<8){
                friendListData.push(frienddata);
            }
            console.log("friendshuju",this._data);
            this._friendList.setData(friendListData);
        }
    }

    /**
     * 刷新好友助力列表
     */
    private refrishList(res){
        MSG.emit(MessageConst.friendRedSpotShow,{"redspot":false});
        this._data.push(res.detail);
        this.initFriendData();
    }

    /**
     * 恢复正常速度
     */
    private setLastScheduler(){
        console.log("friendfight",this._sch);
        console.log("status",BM.pauseBtnStatus)
        if(BM.pauseBtnStatus == false){
            let sch = cc.director.getScheduler();
            sch.setTimeScale(this._sch);
            BM.friendFrightShowing=false;
        }
    }
    // update (dt) {}
}
