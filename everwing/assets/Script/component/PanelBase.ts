import { PANEL } from "../manager/PanelManager";
import { NET } from "../net/core/NetManager";
import Log from "../utils/log/Log";
import PrefabBase from "./PrefabBase";
import { AssetConst } from "../GameConst";

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
export default class PanelBase extends PrefabBase {


    onLoad () {
        this.node.active = false;

    }

    /**
     * 是否模态面板
     */
    public isModal:boolean= true;
    /**
     * 获取数据协议
     */
    public getInfoRequest:string ="";
    //获取数据参数
    public getInfoRequestParam:any =null;

    start () {

    }

    protected initParam:any;
    private init(param?:any){
        this.initParam = param;
        if(this.getInfoRequest!=""){
            NET.send(this.getInfoRequest,this.getInfoRequestParam, this.onGetInfoSuccess, this, this.onGetInfoFailed)
        }else{
            this.onInit(this.initParam);
            this.onShow();
        }
    }
    private onGetInfoSuccess(info){
        this.onInit(this.initParam,info);
        this.onShow();
    }

    private onGetInfoFailed(msg){
        Log.error(msg);
        this.onInit(this.initParam);
        this.onShow();
    }
    

    //显示的动作
    protected _showCallback:Function;
    public show(cb:Function,param?:any){
        this._showCallback = cb;
        this.init(param);
    }

    //关闭的动作
    protected _closeCallback:Function;
    public close(cb:Function){
        this._closeCallback = cb;
        this.onClose();
    }

    //关闭面板
    public closePanel(){
        console.log("关闭面板："+this.node.name);
        PANEL.closePanel(this.node);
    }

    protected onInit(initParam?:any,serverInfo?:any){
        //初始化处理
    }

    protected onShow(){
        this.node.active = true;
        PANEL.closeUITouchLock();
        if(this._showCallback){
            this._showCallback();
        }
    }

    protected onClose(){
        this.node.active = false;
        this._closeCallback(this.node);
    }

    public getGuideNode(key:string) {
        return null;
    }

    public getLocked() {
        return false;
    }

    onDestroy(){
    }
}
