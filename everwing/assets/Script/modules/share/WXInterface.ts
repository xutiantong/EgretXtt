import { SHARE } from "./ShareAssist";
import Log from "../../utils/log/Log";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../GameConst";
import GameUtil from "../../utils/GameUtil";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import { SOCIAL } from "../social/SocialAssist";
import { SOUND } from "../../manager/SoundManager";
import { Toast } from "../toast/Toast";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";
 

export default class WXInterface  {

    public static shareType_LifeAgain:number = 31;//复活分享
    public static shareType_Rank:number = 32;//排行榜分享
    public static videoType_LifeAgain:number = 33;//复活视频
    public static shareType_BulletUpgrade: number = 34;//子弹升级
    public static shareType_ShowShare:number = 36; //再次挑战
    public static shareType_FriendFight:number=37; //好友助战
    public static videoType_RushToBoss:number = 35;//复活视频

    private static _instance: WXInterface = null;
    public static getInstance(): WXInterface {
        if (WXInterface._instance == null) {
            WXInterface._instance = new WXInterface();
        }
        return WXInterface._instance;
    }
    private constructor()
    {
        window["wxOnShow"] = function(res)
        {
            MSG.emit(MessageConst.Player_PageBack_Update);
            try {
                var query = res.query;
                console.log("wxOnShow shareOpenid="+query.shareOpenid +" shareid="+query.shareid+" shareType="+query.type+" query="+query)
                if(query!=undefined){
                    var shareOpenId = query.shareOpenid;
                    var shareId = query.shareid;
                    var shareType = query.type;
                    var shareFromUid=query.shareFromUid;
                    if(shareId!=undefined){
                        SHARE.wxOnShow(shareType,shareId,shareOpenId,shareFromUid,res.query);
                    }
                }
                console.log("wxOnShow emit");
            } catch (error) {
                console.log(error)
            }
        };
        window["wxGetGameVersion"]=function(){
            var tempVersion = window['getVersion']
            return tempVersion;
        };

        window["wxOnHide"] = function(res)
        {
            try {
                MSG.emit(MessageConst.Player_goBack_Update);
                console.log("wxOnHide emit");
            } catch (error) {
                console.log(error)
            }
        };
    }
    /**
     * 分享接口
     * param1: string 分享出去的标题。
     * param2: string 分享出去的图片连接。
     * param3: string 特殊逻辑功能的字段，必须是 key1=val1&key2=val2 的格式。
     * param4: 分享成功得回调函数
     * param5: 回调函数的上下文
     */
    public ShareToWXFriends(title: string, img: string, query: string, callback: Function, context: Object)
    {
        // Log.info("share info: title = " + title + ", url = " + img);
        console.log("share info: title = " + title + ", url = " + img);
        let shareAppMessage = window['shareAppMessage'];
        if (shareAppMessage != undefined) {
            shareAppMessage(title, img, "&shareFromUid="+SOCIAL.socialData.uid+"&"+query, callback.bind(context));
        } else {
            Log.error("getWXUserInfo is not define!");
        }
    }

    //获取跟shareId 的sharePoint相同的分享类型，按照权重分布
    private getABTestInfo(sharepoint:number){
        var samePointArr:{}[] = CFG.getArrayCfgByKey(ConfigConst.SHARE,"sharepoint",String(sharepoint));
        if(samePointArr.length!=0){

            if(samePointArr[0]["sharingProbability"] >= 100){
                return samePointArr[0];
            }

            var totalRate:number = 0;
            var areaArr =[];
            samePointArr.forEach(element => {
                var area:any ={};
                area.id = element["id"];
                area.min = totalRate;
                totalRate += element["sharingProbability"];
                area.max = totalRate;
                areaArr.push(area);
            });
            var rand = Math.random()*100;
            var curInfo:{} = null;
            areaArr.forEach(element => {
                if(element.max >= rand && element.min <=rand){
                    curInfo = CFG.getCfgDataById(ConfigConst.SHARE, String(element.id));;
                }
            });
            return curInfo;
        }
        return null;
    }

    /**
     * 
     * @param shareType 配置Id
     * @param cbFun 发送给服务器后返回的函数
     */
    public ShareByCfg(shareType:number,querry:string="",cbFun:Function = null,reqParam?:any)
    {      
        console.log('wxApi.ShareByCfg');
        // if(CC_DEBUG)
        // {
        //     console.log("debug test share");
        //     var shareReq:any = {};
        //     shareReq.shareId = 123456;
        //     shareReq.shareType = shareType; //红包分享
        //     shareReq.toOpenId ="";
        //     NET.send(NetConst.NewShare,shareReq,(data)=>{  
        //             console.log("share Complete!");
        //     },this);
        //     return;
        // }
        let shareInfo: any =  this.getABTestInfo(shareType);//CFG.getCfgDataById(ConfigConst.SHARE, String(shareType));
        if(!shareInfo)
            return;
        let title: string = CFG.getText(shareInfo.name);
        let url: string = GameUtil.getShareUrl(shareInfo.icon);
        //console.log("分享图片的地址:"+url);
        if(querry!="")
        {
            querry="type="+shareType+"&"+querry
        }
        DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessage ,
            {type:shareType,nodeid:shareInfo.id});
        this.ShareToWXFriends(title, url, querry, (res: object, shareID: string, shareToType: number) => {
            console.log("share WX Complete!");
            var shareReq:any = {};
            shareReq.shareId = shareID;
            shareReq.shareType = shareType; //红包分享
            shareReq.toOpenId ="";
            shareReq.toType = shareToType;
            if(shareToType && shareToType == 1){
                shareReq.shareTicket = res;
            }
            if(reqParam!=undefined){
                for (var key in reqParam){
                    shareReq[key] = reqParam[key];
                    console.log("shareReq add param:",key,","+ reqParam,key);
                }
            }
            NET.send(NetConst.NewShare,shareReq,(data)=>{
                SOCIAL.socialBase.toBI("WXShareAppMessageRet", {ret:0,ShareID:shareReq.shareId,type:shareReq.shareType,shareto:shareReq.shareToType,From:shareReq.shareType},true);
                console.log("share Complete!");
                data.toType = shareToType;
                console.log(data);
                cbFun && cbFun(data);
            },this,(data)=>{
                if(data.data.errorCode && data.data.errorCode == 10404){
                    Toast.showToast("您已经分享过该群，请分享到其他群！")
                    return;
                }
            });
        }, this);
    }


  


    /**
     * 
     * @param shareType 配置Id
     * @param cbFun 发送给服务器后返回的函数
     */
    public getShareType(shareType:number,querry:string="",cbFun:Function = null,customData:any)
    {  
        let shareInfo: any =  this.getABTestInfo(shareType);//CFG.getCfgDataById(ConfigConst.SHARE, String(shareType));
        if(!shareInfo)
            return;
        let title: string = CFG.getText(shareInfo.name);
        let url: string = GameUtil.getShareUrl(shareInfo.icon);
        //console.log("分享图片的地址:"+url);
        DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessage ,
            {type:shareType,nodeid:shareInfo.id})
        this.ShareToWXFriends(title, url, querry, (res: object, shareID: string, shareToType: number) => {
            console.log("share WX Complete!");
            var shareReq:any = {};
            shareReq.shareId = shareID;
            shareReq.shareType = shareInfo.id; //红包分享
            shareReq.toOpenId ="";
            shareReq.toType = shareToType;
            shareReq.customData=customData;
            if(shareToType && shareToType == 1){
                shareReq.shareTicket = res;
              
            }
            DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessage ,
                {type:shareType,nodeid:shareInfo.id});
            cbFun && cbFun(shareReq);
        }, this);
    }

    /**
     * 发送统计
     * @param msgName 
     * @param argsObj {
     * '参数' : '参数值',
     * '参数_2' : '参数值2'
     * }
     */
    public aldstatMsg(msgName,argsObj?:any){
        var aldstat = window["aldstat"];
        if(!aldstat)
            return; 
        console.log("aldstat sendEvent");
        if(argsObj){
            aldstat.sendEvent(msgName,argsObj);
        }else{
            aldstat.sendEvent(msgName)
        }
    }

    // 看视频
    // public showVideoAd(success: Function, fail: Function, desc: string = "", VideoAd_type:number = 0)
    public showVideoAd(videoType:number,success:Function,fail:Function,desc:string,videoID:string="")
    {
        let showVideoAd = window['showVideoAd'];
        if (showVideoAd != undefined) {
            SOUND.stopBgSound();
            var isHaveVideoAd  = showVideoAd(function(playSuccess){
                SOUND.resumeBgSound();
                Log.error("showVideoAd is reward!", playSuccess);
                // playSuccess == 1 ? data.success() : data.fail();
                if(playSuccess == 1){
                    success && success();
                    return ;
                } 
                 if(playSuccess == 2)
                {
                    Toast.showToast("广告加载失败");      
                }
                fail && fail();
            },videoType, videoID);
            if(isHaveVideoAd === false){
                SOUND.resumeBgSound();
                if(desc) {
                    Toast.showToast(desc);
                }
            }
        } else {
            Log.error("showVideoAd is not define!");
        }
    }
    
    /**
     * 微信客服会话 
     * @param sessionFrom 会话来源
     * @param showMsgCard 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话之后会收到一个消息卡片，通过以下三个参数设置卡片的内容
     * @param sendMsgTitle   会话内消息卡片标题
     * @param semdMsgPath   会话内消息卡片路径    
     * @param sendMsgImg  会话内消息卡片图片路径
     * @param success   成功的回调函数   
     * @param fail 失败的回调函数
     */
    public openWXCustomerServiceConvers(sessionFrom:string,
        showMsgCard:boolean,sendMsgTitle:boolean,
        semdMsgPath:string,sendMsgImg:string,
        success:Function,fail:Function){
            let tempOpt = {};
            tempOpt["sessionFrom"] = sessionFrom? sessionFrom:"";
            tempOpt["showMessageCard"] = showMsgCard ;
            tempOpt["sendMessageTitle"] = sendMsgTitle? sendMsgTitle:"";
            tempOpt["sendMessagePath"] = semdMsgPath? semdMsgPath:"";
            tempOpt["sendMessageImg"] = sendMsgImg? sendMsgImg:"";
            tempOpt["success"] = success? success:null;
            tempOpt["fail"] = fail? fail:null;
            window["openCustomerServiceConvers"](tempOpt)
    }


    //  分享新方法 18-10-10  /////////////////////////

    /***
     * 分享类型
     * return 分享数据
     */
    public getShareInfoData(shareType:number):Object{
        let shareInfo: any =  this.getABTestInfo(shareType);
        return shareInfo;
    }

    /**
     * 
     * @param shareInfo 分享数据
     * @param querry 参数
     * @param openShareCb 打开了分享的回调参数 返回分享的数据  (shareData:any,shareId:string ,shareToType:number)
     * @param successCb 分享成功回调 --wxAPI 新版本不支持回调  (res, shareId, isSuccess, resEncryptedData)
     * @param reqParam 
     */
    public shareByCfg_v1(shareInfo:object,querry:string="",openShareCb:Function = null ,completeCb:Function = null,reqParam?:any)
    {   
        console.log('wxApi.ShareByCfg');
        // let shareInfo: any =  this.getABTestInfo(shareType);//CFG.getCfgDataById(ConfigConst.SHARE, String(shareType));
        if(!shareInfo)
            return;
        let title: string = CFG.getText(shareInfo['name']);
        let imgUrl = shareInfo['icon'];
        // imgUrl = 'https://ppfiles-1256721769.file.myqcloud.com/everwing/shareImg/share_pic140.png';
        let url = ''
        if (imgUrl.indexOf("http")<0){
            url =  GameUtil.getShareUrl(imgUrl)
        }else{
            url = imgUrl;
        }
       
        console.log("分享图片的地址:"+url);
        //console.log("分享图片的地址:"+url);
        if(querry!="")
        {
            querry="type="+shareInfo['sharepoint']+"&"+querry;
        }else{
            querry="type="+shareInfo['sharepoint'];
        }
        DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessage , {type:shareInfo['id'],nodeid:shareInfo['id']});
        this.ShareToWXFriends_v1(title ,url,querry ,
            (shareInfo_v1:any , shareId:string,shareToType:number) =>{
                DottingUtil.bi_normalFun(BIActionConst.kActName_WXShareAppMessageRet,
                    { ret: 0, ShareID: shareId, type:shareInfo['id'], shareto: shareToType,nodeid:shareInfo['id']});
                openShareCb && openShareCb(shareInfo,shareId ,shareToType);
            },(res, shareId, isSuccess, resEncryptedData)=>{
                completeCb && completeCb(res,shareId,isSuccess,resEncryptedData);
            },this);  
    }

    /**
     * 
     * @param title 分享出去的标题。
     * @param img 享出去的图片连接。
     * @param query 特殊逻辑功能的字段，必须是 key1=val1&key2=val2 的格式。
     * @param openShareCb 打开分享回调 (shareData:any,shareId:string,shareToType:number)
     * @param successCb  完成分享回调 (res, shareId, isSuccess, resEncryptedData)
     * @param context 当前上下文对象
     */
    public ShareToWXFriends_v1(title: string, img: string, query: string, openShareCb:Function = null ,completeCb:Function = null, context: Object)
    {
        // Log.info("share info: title = " + title + ", url = " + img);
        console.log("share info: title = " + title + ", url = " + img);
        let shareAppMessage = window['shareAppMessage_v1'];
        if (shareAppMessage != undefined) {
            shareAppMessage(title, img, "&shareFromUid="+SOCIAL.socialData.uid+"&"+query,openShareCb.bind(context),completeCb.bind(context) );
        } else {
            Log.error("getWXUserInfo is not define!");
        }
    }

    public bannerShow(){
        let banner = window['showBanner']
        if(banner != undefined){
            banner()
        }else{
            Log.error("banner id not define");
            
        }
    }

    public bannerHide(){
        let HideBanner = window['dissmisBanner']
        if(HideBanner != undefined){
            HideBanner();
        }else{
            Log.error("bannerhide id not define");
        }
    }

    public gameClubShow(){
        let gameClub = window['gameClub']
        if(gameClub != undefined){
            gameClub()
        }else{
            Log.error("gameClub id not define"); 
        }
    }

    public gameClubHide(){
        let hideGameClub = window['dissmisGameClub']
        if(hideGameClub != undefined){
            hideGameClub();
        }else{
            Log.error("hideGameClub id not define");
        }
    }
}

export var WX_API= WXInterface.getInstance();