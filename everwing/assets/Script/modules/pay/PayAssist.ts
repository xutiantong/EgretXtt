import { PANEL } from "../../manager/PanelManager";
import { CFG } from "../../manager/ConfigManager";
import NetConst from "../../net/NetConst";
import { NET } from "../../net/core/NetManager";
import { DEVICE } from "../device/DeviceAssist";
import Log from "../../utils/log/Log";
import { MSG } from "../../message/MessageController";
import { SOCIAL } from "../social/SocialAssist";
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
export default class PayAssist {

    public static _inst:PayAssist;
    public static getInstance():PayAssist
    {
        return this._inst||(this._inst = new PayAssist())
    }
    public buyEventId:string;
    public payId:number;
    public payPrice:number;
    public payNum:number;
    /**
     * 订单id 服务器返回
     */
    public orderId:string;
    public ReqPay(payId:number,payPrice:number,buyEventId:string,num:number=1)
    {
        if(DEVICE.getOS() == "IOS")
        {
            PANEL.showAlert("支付提示","暂未开放");
            return;
        }
        this.payId = payId;
        this.payPrice = payPrice;
        this.payNum = num;
        this.buyEventId= buyEventId;
        //BI打点 购买申请
        DottingUtil.bi_normalFun(BIActionConst.kActName_PayBefore,
            {money:this.payPrice, num:1, productid:this.payId},true);
        // SOCIAL.socialBase.toBI("PayBefore",{money:this.payPrice, num:1, productid:this.payId});
        NET.send(NetConst.PayBefore, {payId:payId,money:this.payPrice, num:1}, (res) =>{
            // success
                  //BI打点 购买申请返回
            DottingUtil.bi_normalFun(BIActionConst.kActName_PayBeforeRet,
                {ret:0,orderId:res.uuid,money:this.payPrice, num:1, productid:this.payId},true); 
            // SOCIAL.socialBase.toBI("PayBeforeRet",{ret:0,orderId:res.uuid,money:this.payPrice, num:1, productid:this.payId});
            this.orderId = res.uuid;
            this.requestMidasPay();
        }, this, (res) =>{
            // fail
            let errMsg = JSON.stringify(res);
             //BI打点 购买申请失败返回
             DottingUtil.bi_normalFun(BIActionConst.kActName_PayBeforeRet,
                {ret:1,money:this.payPrice, num:1, productid:this.payId,errMsg:errMsg},true); 
            // SOCIAL.socialBase.toBI("PayBeforeRet",{ret:1,money:this.payPrice, num:1, productid:this.payId});
            this.orderId = null;
            this.payCallBackFailed(null);
        });
    }


    /**
     * 用户取消支付
     */
     private payCallBackFailed(res: any) {
        if(res)
        {
            console.log("payCallBackFailed:"+JSON.stringify(res));
        }
        PANEL.removeLoadingLayer();
        PANEL.showAlert("支付提示", "购买失败！");
        this.sendCancel();    
    }
    private sendCancel(){
        if(this.orderId && this.orderId != "") {

            // SOCIAL.socialBase.toBI("PayCancel",{orderId: this.orderId,money:this.payPrice, num:1, productid:this.payId});
            DottingUtil.bi_normalFun(BIActionConst.kActName_PayCancel,
                {orderId: this.orderId,money:this.payPrice, num:1, productid:this.payId},true);
            NET.send(NetConst.PayCancel, {uuid: this.orderId,money:this.payPrice, num:1, productid:this.payId}, (msg) =>{
                // success
                DottingUtil.bi_normalFun(BIActionConst.kActName_PayCancelRet,
                    {ret:0,orderId: this.orderId,money:this.payPrice, num:1, productid:this.payId},true);
                // SOCIAL.socialBase.toBI("PayCancelRet",{ret:0,orderId: this.orderId,money:this.payPrice, num:1, productid:this.payId});
                this.orderId = null;
                Log.info("[payCallBackFailed] [success]");
            }, this, (msg) =>{
                // fail                
                let errStr = "";
                if(msg && msg.data && msg.data.errorMsg){
                    errStr = msg.data.errorMsg;
                }
                DottingUtil.bi_normalFun(BIActionConst.kActName_PayCancelRet,
                    {orderId:this.orderId,ret:1,errStr: errStr,money:this.payPrice, num:1, productid:this.payId},true);
                // SOCIAL.socialBase.toBI("PayCancelRet",{orderId:this.orderId,ret:1,errStr: errStr,money:this.payPrice, num:1, productid:this.payId});
                Log.error("[payCallBackFailed] [fail] " + errStr + " [order]"+ this.orderId);
                this.orderId = null;
            });
        }
    }
    /**
     * https://developers.weixin.qq.com/minigame/dev/document/midas-payment/wx.requestMidasPayment.html
     * 请求支付 详情看链接 注意错误码的处理
     */
    private requestMidasPay() {
       
        let requestMidasPayment = window['requestMidasPayment'];
        if (requestMidasPayment != undefined) {
            DottingUtil.bi_normalFun(BIActionConst.kActName_PayCallWX_requestMidasPayment,
                {ret:0,money:this.payPrice, num:1, productid:this.payId},true);
             // 直接唤起米大师支付
            PANEL.addLoadingLayer();
            DottingUtil.bi_normalFun(BIActionConst.kActName_PayMidas,
                {orderId:this.orderId,money:this.payPrice, num:1, productid:this.payId},true);
            // SOCIAL.socialBase.toBI("PayMidas",{money:this.payPrice, num:1, productid:this.payId});
            requestMidasPayment({mode: "game", quantity: this.payPrice *10},
            this.buyCallBackSuccess.bind(this), this.buyCallBackFailed.bind(this));
        } else {
            DottingUtil.bi_normalFun(BIActionConst.kActName_PayCallWX_requestMidasPayment,
                {ret:1,money:this.payPrice, num:1, productid:this.payId},true);
            PANEL.showAlert("支付提示","当前系统不支持虚拟支付！");
        }
     }
     /////////////////////米大师调用回调
     /**
      * 米大师购买成功
      */
     private buyCallBackSuccess(res: any){
        // 人民币购买虚拟货币成功，向服务器后台请求获得礼包
        Log.debug("购买虚拟货币成功！向服务器请求获取礼包");
        DottingUtil.bi_normalFun(BIActionConst.kActName_PayMidasRet,
            {ret:0,orderId:this.orderId,money:this.payPrice, num:1, productid:this.payId},true);
        // SOCIAL.socialBase.toBI("PayMidasRet",{ret:0,money:this.payPrice, num:1, productid:this.payId});
        this.sendPayBuy();
    }
   /**
     * 米大师购买失败
     */
    private buyCallBackFailed(res: any) {
        // let errorMsg = JSON.stringify(res);
        //   errorMsg = encodeURI(errorMsg);
        let errorCode = res.errCode
        if (!errorCode){
            errorCode = 0;
        }
        let errorMsg = 'errCode:' + errorCode; 
        DottingUtil.bi_normalFun(BIActionConst.kActName_PayMidasRet,
            {ret:1,orderId:this.orderId,money:this.payPrice, num:1, productid:this.payId,errMsg:errorMsg},true);
        // SOCIAL.socialBase.toBI("PayMidasRet",{ret:1,money:this.payPrice, num:1, productid:this.payId});
        console.log("buyCallBackFailed: "+JSON.stringify(res));
        PANEL.removeLoadingLayer();
        if(res!=undefined)
        {
            if(res.errCode!=undefined)
            {
                if(res.errCode==-2||res.errCode==1)
                {
                    PANEL.showAlert("支付提示", "用户取消购买！");
                }
                else
                {
                    PANEL.showAlert("支付提示", "购买失败!("+res.errCode+")");
                }
            }
        }
        this.sendCancel();
        //this.sendPayBuy();
    }

     ///////////调用游戏服务器支付
     private sendPayBuy() {
        // 请求服务器购买礼包   
        // let body = window["login_body"];
        // let token = body.token;
        DottingUtil.bi_normalFun(BIActionConst.kActName_PayBuy,
            {orderId:this.orderId,money:this.payPrice, num:1, productid:this.payId},true);
        // SOCIAL.socialBase.toBI("PayBuy",{orderId:this.orderId,money:this.payPrice, num:1, productid:this.payId});
        NET.send(NetConst.requestBuy, {payId: this.payId, token: window["WX_Token"],uuid: this.orderId,money:this.payPrice, num:1}, this.onServerPayment, this, this.onServerPaymentFailed);
    }

     private onServerPayment(data) {
         DottingUtil.bi_normalFun(BIActionConst.kActName_PayBuyRet,
            {orderId:this.orderId,ret:0,money:this.payPrice, num:1, productid:this.payId},true);
        // SOCIAL.socialBase.toBI("PayBuyRet",{orderId:this.orderId,ret:0,money:this.payPrice, num:1, productid:this.payId},true);
        PANEL.removeLoadingLayer();
        //GameUtil.getDataReward(data);
        // data.reward.forEach(e => {
        //     Game.getGameLogic(BarnLogic).upResNum(e.itemId,e.num);
        // });
        //Game.eventCenter.emit("shop_paysuccess",data);
        console.log("支付成功回调");
        if(this.buyEventId!=null&&this.buyEventId!="")
        {
            MSG.emit(this.buyEventId,{payId:this.payId,success:true});        
        }
        this.orderId = null;
    }
    private onServerPaymentFailed(res: any) {
        let errorMsg = JSON.stringify(res);
        DottingUtil.bi_normalFun(BIActionConst.kActName_PayBuyRet,
            {orderId:this.orderId,ret:1,money:this.payPrice, num:1, productid:this.payId,errMsg:errorMsg},true);
        // SOCIAL.socialBase.toBI("PayBuyRet",{orderId:this.orderId,ret:1,money:this.payPrice, num:1, productid:this.payId,errMsg:errorMsg},true);
        //this.sendCancel();
        console.log("支付失败回调");
        if(this.buyEventId!=null&&this.buyEventId!="")
        {
            MSG.emit(this.buyEventId,{payId:this.payId,success:false});        
        }   
        PANEL.showAlert("支付错误","支付失败！");
        this.orderId = null;
    }
}
export var PAY=PayAssist.getInstance();
