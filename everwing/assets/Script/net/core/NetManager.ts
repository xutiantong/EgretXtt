import Socket from "./Socket";
import { MSG } from "../../message/MessageController";
import NetConst from "../NetConst";
import Log from "../../utils/log/Log";
import { GAME } from "../../model/GameData";
import SocialAssist, { SOCIAL } from "../../modules/social/SocialAssist";
import { DEVICE } from "../../modules/device/DeviceAssist";
import MessageConst from "../../message/MessageConst";
import GameConst from "../../GameConst";
import DottingUtil, { BIActionConst } from "../../utils/DottingUtil";

export class NetManager
{
    public NET_MESSAGE:string = "NET_MESSAGE";
    public RECONNECT_FINISH:string = "RECONNECT_FINISH";

    private _isConnected:boolean = false;
    private _isConnecting:boolean = false;
    private _connectCbObj:any =null;
    private _connectTimeOutTime:number =5000;
    private _connectTimeOutId:number =NaN;

    private _ip:string ="";
    private _socket:WebSocket = null;
    
    public  errorID:string = "-1";
    private _msgDict:object ={};
    private _seqId: number = 0;
    private static _inst:NetManager;
    
    public static getInst(): NetManager {
        return NetManager._inst ||(NetManager._inst = new NetManager());
    }

    /**
     * 
     * @param ip 连接服务器地址 ip地址格式:wss://ip:port或ws://ip:port
     * @param cb 连接成功回调 cbFun()
     * @param thisObj 回调上下文
     */
    public connect(ip:string, cb:Function, thisObj:any) {
        if(this._isConnecting || this._isConnected)
        {
            return;
        }
        let  startConnectStamp=new Date().getTime();
        this._ip = ip;
        if(cb) {
            this._connectCbObj ={"cb":cb,"this":thisObj,'startTime':startConnectStamp};
        }
        this._isConnecting = true;
        if(this._socket == null) {
            this._socket = this.createSocket(this._connectTimeOutTime);
        }
        MSG.emit(NET.NET_MESSAGE, {id:NetConst.NET_Connecting,data:{}});
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerConnect,{serverip:ip});
        // SOCIAL.socialBase.toBI("GameServerConnect",{serverip:ip});
    }
    /**
     * 主动断开socket
     * @param cb 
     */
    public dismissConnect(cb:Function){
        this.dispose()
        cb&&cb()
    }


    /**
     * 发送网络消息
     * @param id 消息ID
     * @param data 消息内容 JSONOBJ
     * @param cb 消息回调 cbFun(data:string)
     * @param thisObj 回调上下文
     * @param fail 网络处理失败回调，1. 后端报错 2. 前端处理异常
     */
    public send(id: string, data: any, cb: Function, thisObj: any, fail: Function = null)
    {

        if(id==NetConst.NewShare)
        {
            console.log("暂时屏蔽分享的消息");
            return;
        }

        if(this._socket)
        {
            let currentSeq = this._seqId;
            let obj = {seq: currentSeq, "id":id,"data":data||{}}
            let msg = JSON.stringify(obj);
            let  saSendStamp=new Date().getTime();
            //Log.debug("[net] send msg: "+msg);
            if (id != NetConst.Heart){
                //过滤心跳
                this._msgDict[currentSeq] = {"id": id,"startSendTime":saSendStamp, "cb":cb, "this":thisObj, fail: fail, "msg":msg};
            }
            this._socket.send(msg);
            this._seqId += 1;
        }
        else{
            console.log("网络没有链接 socket 为null");
            MSG.emit(NET.NET_MESSAGE, {id:NetConst.NET_ERROR,data:{}});
        }
    }

    private createSocket(timeout:number){
        let ws;
        if(this._ip.indexOf("ws")!=0)
        {
            this._ip ="wss://"+this._ip
        }
        Log.debug("连接服务器:",this._ip);
        //[bi] will connect gs:ip

        //超时
        this._connectTimeOutId = setTimeout(this.onTimeout.bind(this),timeout);    
        
        ws = new WebSocket(this._ip);
        
        //连接成功
        ws.onopen = this.onOpen_v1.bind(this);
        //连接关闭
        ws.onclose = this.onClose.bind(this);
        //收到消息
        ws.onmessage = this.onMessage.bind(this);
        //出错
        ws.onerror = this.onError.bind(this);
        return ws;
    }
    private onOpen(e:Event = null) {
        SOCIAL.socialBase.toBI("GameServerConnectRet",{ret:0});
        let  endConnectStamp=new Date().getTime();
        let startStamp = this._connectCbObj.startTime;
        console.log('connect 连接时间: ' , endConnectStamp - startStamp);
        this.removeTimeout();

        this._isConnected = true;
        this._isConnecting = false;
        this._seqId = 0;
        MSG.emit(NET.NET_MESSAGE, {id:NetConst.NET_Connected,data:{}});

        for(let key in this._msgDict) {
            if(this._msgDict[key].id == NetConst.Login)
            {
                delete this._msgDict[key];
                break;
            }
        }

        let self = this;
        GAME.initLoginTime();
        let biData = {
            ret:1,
            cmd:'connecting',
            cmdSeq:0,
            cmdstime:startStamp,
            cmdetime:endConnectStamp,
            cmdutime:endConnectStamp - startStamp
        }
        DottingUtil.bi_normalFun(BIActionConst.kActName_RequestTimeConsuming , biData);
        SOCIAL.socialBase.toBI("GameServerLogin");

        var loginData = null
        
        if ( SOCIAL.social_type == SocialAssist.SOCIAL_Wechat){
            loginData = {
                accountId: SOCIAL.socialData.openId,
                deviceid:DEVICE.deviceData.deviceid,appversion:DEVICE.deviceData.appversion,platform:DEVICE.deviceData.platform,   
                shareId: SOCIAL.socialData.currentLoginShareId, 
                adId: window["adId"],
                adMaterial:window["adMaterial"],
                userInfo: SOCIAL.socialData.playerWXInfoEncryption,//3级授权前没有这个数据
                userAuthStatus: SOCIAL.socialBase.isHasAuth(),
                loginType:'weixin',channel:window["channel"],
                code:SOCIAL.socialData.code,
            }
        }else {
            loginData = {
                accountId: SOCIAL.socialData.accountId,
                deviceid:DEVICE.deviceData.deviceid ? DEVICE.deviceData.deviceid: SOCIAL.socialData.accountId,
                appversion:DEVICE.deviceData.appversion,platform:DEVICE.deviceData.platform,   
                shareId: SOCIAL.socialData.currentLoginShareId, 
                adId: window["adId"],
                loginType:'web',
                adMaterial:window["adMaterial"],
            }
        }
        if(CC_DEBUG)
        {
            console.log("请求登录数据：");
            console.log(loginData);
        }
        NET.send(
            NetConst.Login, 
            loginData,
                function(res) {
                    //success 
                    SOCIAL.socialData.code ="";
                    NET.startHeartbeat(NetConst.Heart);
                    SOCIAL.socialBase.toBI("GameServerLoginRet", 
                     { 
                        ret: 0 ,
                        ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
                        InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
                        InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:''
                    }, 
                    true);
                    if(CC_DEBUG)
                    {
                        console.log("Login 返回:");
                        console.log(res);
                    }
                    
                    GAME.initLogin(res);
                    
                    for(let key in self._msgDict) {
                        self._socket.send(self._msgDict[key].msg);
                    }
                    
                    if(self._connectCbObj)
                    {
                        console.log(" GAME.initLogin 187");
                        self._connectCbObj.cb.call(self._connectCbObj.this);
                        self._connectCbObj = null;
                    }
                   
                },null,(msg)=>{
                    SOCIAL.socialBase.toBI("GameServerLoginRet",
                    { ret: 1,
                        ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
                        InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
                        InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:''
                     }
                        , true);
                });
    }

    public doSendresidueMsg(){
        for(let key in this._msgDict) {
            this._socket.send(this._msgDict[key].msg);
        }
    }
    private onOpen_v1(e:Event = null){
        DottingUtil.bi_normalFun(BIActionConst.kActName_GameServerConnectRet,{ret:0});
        let  endConnectStamp=new Date().getTime();
        let startStamp = this._connectCbObj.startTime;
        console.log('socket open connect 连接时间: ' , endConnectStamp - startStamp);
        this.removeTimeout();

        this._isConnected = true;
        this._isConnecting = false;
        this._seqId = 0;
        MSG.emit(NET.NET_MESSAGE, {id:NetConst.NET_Connected,data:{}});

        for(let key in this._msgDict) {
            if(this._msgDict[key].id == NetConst.Login)
            {
                delete this._msgDict[key];
                break;
            }
        }
        let self = this;
        GAME.initLoginTime();

        this.startHeartbeat(NetConst.Heart);
        let biData = {
            ret:1,
            cmd:'connecting',
            cmdSeq:0,
            cmdstime:startStamp,
            cmdetime:endConnectStamp,
            cmdutime:endConnectStamp - startStamp
        }
        DottingUtil.bi_normalFun(BIActionConst.kActName_RequestTimeConsuming , biData);
        if(this._connectCbObj)
        {
            this._connectCbObj.cb.call(this._connectCbObj.this , 0);
            this._connectCbObj = null;
        }
      
    }
    private onMessage(e:MessageEvent) {
        var data = e.data;
        let json = null;
        if(data.indexOf("id:")>-1) {
            Log.debug("此消息id属性不对：",data);
            data = data.replace("id:","id");
        }
        try{
            json = JSON.parse(data);
        } catch(e){
            this.doFailMessage(null, 'json parse err!');
            throw("socket json ");
        }
        if(json != null) {
            if(json.id == this.errorID) {   
                this.doFailMessage(json);
                Log.debug("消息异常:" + JSON.stringify(data));
            } else {
                this.doSuccMessage(json);
            }
            MSG.emit(NET.NET_MESSAGE, json);
        }
    }

    /** 处理失败消息 */
    private doFailMessage(json: any, error: any = null) {
        let obj = this._msgDict[json.seq];
        if (obj){
            let stSendTime = obj.startSendTime;
            let endSendTime=new Date().getTime();
            let tempObj = {
                startSendTime :stSendTime,
                endSendTime:endSendTime,
                id:obj.id,
                msg:obj.msg
            }
            this.collectCMDTimer(false,json,tempObj);
        }
        if(obj != null) {
            if (obj.fail instanceof Function) {
                delete this._msgDict[json.seq];
                obj.fail.call(obj.this, json, error);
            }
        }
    }

    /** 处理成功消息 */
    private doSuccMessage(json: any) {
        let obj = this._msgDict[json.seq];
        if (obj){
            let stSendTime = obj.startSendTime;
            let endSendTime=new Date().getTime();
            let tempObj = {
                startSendTime :stSendTime,
                endSendTime:endSendTime,
                id:obj.id,
                msg:obj.msg
            }
            this.collectCMDTimer(true,json,tempObj);
        }
        if(obj != null) {
            delete this._msgDict[json.seq];
            obj.cb &&  obj.cb.call(obj.this, json.data); 
        }
    }
    //请求打点
    private collectCMDTimer(isSuccess:boolean,serverJson:any,requestObj:any){
        let endSendStamp=requestObj.endSendTime;
        let startSendTime = requestObj.startSendTime;
        let cmdCostTime = endSendStamp - startSendTime;
        let biData = {
            ret:isSuccess? 0:1,
            cmd:serverJson.id? serverJson.id :'',
            cmdSeq:serverJson.seq,
            cmdstime:startSendTime,
            cmdetime:endSendStamp,
            cmdutime:cmdCostTime
        }
        DottingUtil.bi_normalFun(BIActionConst.kActName_RequestTimeConsuming , biData);
    }

    private onClose(e:CloseEvent)
    {
        Log.debug("socket:close")
        this.dispose();
        MSG.emit(NET.NET_MESSAGE, {id:NetConst.NET_CLOSE,data:{}});
    }
    private onError(e:Event)
    {
        Log.debug("socket:error")
        if(this._connectCbObj)
        {
            this._connectCbObj.cb.call(this._connectCbObj.this , 1);
        }
        this.dispose();
        MSG.emit(NET.NET_MESSAGE, {id:NetConst.NET_ERROR,data:{}});
    }
    private onTimeout()
    {
        if(!this._socket || this._socket.readyState != WebSocket.CONNECTING){
            return;
        }
        Log.debug("[net] connect cnt over max ,will hint");
        this.dispose();
        MSG.emit(NET.NET_MESSAGE, {id:NetConst.NET_ConnectTimeOut,data:{}});
    }

    public reConnect(){
        if(this._connectCbObj) //登陆重连
        {
            let  startConnectStamp=new Date().getTime();
            this._connectCbObj['startTime'] = startConnectStamp;
            this.connect(this._ip, this._connectCbObj.cb, this._connectCbObj.this);
        }else{ //断线重连
            this.connect(this._ip, function() {
                MSG.emit(NET.RECONNECT_FINISH);
            }, this);
        }
    }

    public reConnet_v1(cb:Function){
        if(this._connectCbObj) //登陆重连
        {
            let  startConnectStamp=new Date().getTime();
            this._connectCbObj['startTime'] = startConnectStamp;
            this.connect(this._ip, this._connectCbObj.cb, this._connectCbObj.this);
            cb && cb(0);
        }else{ //断线重连
            cb &&  cb(1);
        }
    }

    private removeTimeout(){
        if(!isNaN(this._connectTimeOutId)){
            clearInterval(this._connectTimeOutId);
            this._connectTimeOutId = NaN;
        }
    }

    private dispose(){
        this._isConnected = false;
        this._isConnecting = false;
        if(!isNaN(this._timeOutId))
        {
            clearInterval(this._timeOutId);
            this._timeOutId = NaN;
        }
        this.removeTimeout();
        if(this._socket)
        {
            if(this._socket.readyState == WebSocket.OPEN)
            {
                this._socket.close();
            }
            this._socket.onopen = this._socket.onclose = this._socket.onmessage = this._socket.onerror = null;
        }
        this._socket = null;
    }

    /**
     * 连接是否有效
     */
    public isNetUseable(){
        return this._socket!=null  && this._socket.readyState == WebSocket.OPEN;
    }

    /**计时器ID */
    private _timeOutId:number = NaN;
    /**超时次数 */
    private _timeOutNum:number;
    /**超时时长 */
    private _timeOutTime:number;
    /**
     * 启动心跳
     * @param msgId 心跳消息号
     * @param time  心跳间隔 默认15s
     */
    public startHeartbeat(msgId:any,time:number = 15000) {

        this._timeOutTime = time;
        if(isNaN(this._timeOutId))
        {
            let self = this;

            this._timeOutId = setInterval(()=>{
                self._timeOutNum++;
                if(self._timeOutNum>1)
                {
                    Log.debug("心跳超时次数：",self._timeOutNum);
                    this.dispose();
                }else
                {
                    self.send(msgId,null,()=>{
                        self._timeOutNum = 0;
                    },self);
                }
               
            },time)
        }
    }
}


export var NET = NetManager.getInst();