import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";

export default class ShareAssist {
    private static _instance: ShareAssist = null;
    public static getInstance(): ShareAssist {
        if (ShareAssist._instance == null) {
            ShareAssist._instance = new ShareAssist();
        }
        return ShareAssist._instance;
    }
    public wakeUpReqData:any;
    public wxOnShow(type:number,shareId:number,shareOpenId:number,shareFromUid:any,query?:any){
        //console.log("wx onshow set wakeUpReqData");
        this.wakeUpReqData={shareType:type,shareId:shareId,shareFromUid:shareFromUid,isnew:1,customData:query}
        if(NET.isNetUseable())
        {
            //console.log("wx onshow isNetUseAble");
            this.DoWakeUpAction();
            this.wakeUpReqData=null;
        }
    }
    /**
     * 微信分享链接进来的消息处理
     */
    public DoWakeUpAction()
    {
        console.log("DoWakeUpAction");
        console.log(this.wakeUpReqData);
        if(this.wakeUpReqData==null|| this.wakeUpReqData==undefined)
        {
            //console.log("wakeUpReqData==null");
            return;
        }
        if(this.wakeUpReqData.shareId==undefined)
        {
            //console.log("wakeUpReqData.shareId==undefined");
            return;
        }
        console.log("WakeUpByShare " +this.wakeUpReqData)
        let isnew=window["checkIsNew"];
        this.wakeUpReqData["isnew"]=isnew;
        NET.send(NetConst.WakeUpByShare, this.wakeUpReqData, (data)=>{
            console.log("WakeUpByShare success:",data);
            this.onShareBack(data);
            this.wakeUpReqData=null;
        },this);
    }
    //通过分享进入游戏的数据处理
    public onShareBack(data:any){
        if(data.shareInfo)
        {
            this.onGetShareInfo(data.shareInfo);
        }
    }
    public onGetShareInfo(info){
        
    }

    //测试方法
    public sendTest(){
        var shareReq:any = {};
        shareReq.shareId = "testShare"+Date.now();
        shareReq.shareType = 2; //红包分享
        shareReq.toOpenId ="";
        NET.send(NetConst.NewShare,shareReq,(data)=>{  
                console.log("share Complete!");
        },this);
    }
}


export var SHARE = ShareAssist.getInstance();


