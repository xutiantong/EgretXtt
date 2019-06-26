import PanelHolder from "../component/PanelHolder";
import PanelBase from "../component/PanelBase";
import Log from "../utils/log/Log";
import { AssetConst, ZERO } from "../GameConst";
import StringUtil from "../utils/StringUtil";
import PrefabBase from "../component/PrefabBase";
import { POOL } from "./PoolManager";
import MainView from "../modules/MainView";
import { SOCIAL } from "../modules/social/SocialAssist";
import PopupBase from "../component/PopupBase";
import { RES } from "./ResourceManager";
import LoadingScene from "../Scene/LoadingScene";
import SceneBase from "../scene/SceneBase";
import { SCENE } from "../scene/SceneManager";
import { GAME } from "../model/GameData";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import UITouchLock from "../modules/UITouchLock";

export default class PanelManager extends cc.EventTarget{
    private static _instance: PanelManager = null;
    public static getInstance(): PanelManager {
        if (PanelManager._instance == null) {
            PanelManager._instance = new PanelManager();
            
        }
        return PanelManager._instance;
    }
    //弹窗背景点击事件
    public static Panel_Mask_Touch_Begin:string="Panel_Mask_Touch_Begin";

    
    public static Type_Popup:number = 0;
    public static Type_Alert:number = 1;
    public static Type_UI:number = 2;
    public static Type_NOTICE:number = 3;
    public static Type_Bottom:number = 4;
    public static Type_Guide:number = 5;
     
    private _mui:MainView =null
    public get mui():MainView{
        return this._mui;
    }
    public set mui(mui:MainView){
        this._mui = mui;
    }
    private _uiTouchLock: cc.Node = null;
    public constructor()
    {
        
        super();
        this._panels =[];
        this._modalPanels = [];
    }
    

    private _panelHolder:PanelHolder;
    public registerHolder(holder:PanelHolder){
        this._panelHolder = holder;
        this.initMaskLayer();
    }
    public get panelHolder(){
        return this._panelHolder;
    }

    /** 面板遮罩节点 */
    private _maskLayer: cc.Node = null;

    private _panels:Array<PanelBase>;
    private _modalPanels:Array<PanelBase>;

    /**
     * 面板加载锁，在锁住情况下不能打开面板,同时配合 act 这个参数使用，为true时生效
     * 主要是防止 同一个地方连续点击，会弹出多个面板
     * 其他情况，允许同时打开多个 不一样的面板
     */
    private _locked:boolean = false;

    /**
     * 显示面板
     * @param panelName 
     * @param param 
     */
    public showPanel(path:string,type:number = 0,param?:any, act:boolean=false,parent = null,worldPoint:cc.Vec2=null){
        console.log(path)
        if (this._locked && act) {
            console.log( "error: can't open %s" ,path);
            return;
        }
        this._locked = true;
        POOL.getPrefabFromPool(path,(node:cc.Node)=>{
            var panel:PanelBase = node.getComponent(PanelBase);
            console.log('panel size :',panel.node.width,panel.node.height);
            if(panel){
                var layer:cc.Node;
                switch(type){
                    case PanelManager.Type_Popup:{
                        layer = this._panelHolder.panelLayer;
                    }break;
                    case PanelManager.Type_Alert:
                    case PanelManager.Type_NOTICE:
                    {
                        layer = this._panelHolder.topLayer;
                    }break;
                    case PanelManager.Type_UI:{
                        layer = this._panelHolder.uiLayer;
                        panel.isModal = false;
                    }break;
                    case PanelManager.Type_Bottom:{
                        layer = this._panelHolder.bottomLayer;
                    }break;
                    case PanelManager.Type_Guide:{
                        layer = this._panelHolder.guideLayer;
                        panel.isModal = false;
                    }break;
                    default:{
                        layer = this._panelHolder.panelLayer;
                    }break;
                }
                node.parent = layer;
                if(parent!=null){
                    node.parent = parent;
                }

                this._panels.push(panel);
                if(panel.isModal){
                    this._modalPanels.push(panel);
                    this.showMaskLayer(panel);
                }

                panel.show(this.showCallback.bind(this),param);
                
            }
            this._locked = false;
        },worldPoint);
    }
    
    private showCallback(){
        //todo
    }

    /**
     * 移除面板
     * @param panel 
     */
    public closePanel(node:cc.Node){
        var panel:PanelBase = node.getComponent(PanelBase);
        if(panel){
            var panelIndex:number = this._panels.indexOf(panel);
            if(panelIndex>-1){
                this._panels.splice(panelIndex, 1);
            }
            if(panel.isModal){
                var modalIndex:number = this._modalPanels.indexOf(panel);
                if(modalIndex>-1){
                    this._modalPanels.splice(modalIndex, 1);
                }
            }
            panel.close(this.closeCallback.bind(this));
        }
    }

    /**
     * 移除指定的面板
     * @param name 
     */
    public closePanelWithName(name:string){
        var node:cc.Node = this.getPanelSingle(name);
        if(node){
            this.closePanel(node);
        }
    }

    private closeCallback(node:cc.Node){
        POOL.putPrefabToPool(node);
        this.checkMaskLayer();
    }

    
    /**
     * 获取一组面板
     * @param path 
     */
    public getPanels(path):Array<cc.Node>{
        var panels:Array<cc.Node> =[];
        this._panels.forEach(panel => {
            if(panel instanceof PrefabBase){
                if((panel as PrefabBase).prefabPath == path){
                    panels.push(panel.node);
                }
            }
        });
        return panels;
    }
    /**
     * 获取一个面板
     * @param path 
     */
    public getPanelSingle(path):cc.Node{
        var panels = this.getPanels(path);
        return panels.length>0?panels[0]:null;
    }

    /**
     * 获取当前面板
     */
    public getCurrentPanel():cc.Node{
        let lastIdx = this._panels.length - 1;
        if (lastIdx >=0 ) {
            return this._panels[lastIdx].node;
        }
        return null;
    }

    public showMaskLayer(panel: PanelBase) {
        if(!this._maskLayer.isValid)
        {
            return;
        }
        // if(SOCIAL.isIPhoneX){
        //     this._maskLayer.y = SOCIAL.systemInfo.statusBarHeight;
        //     this._maskLayer.setContentSize(cc.winSize.width, cc.winSize.height+44);
        // }
        if(panel.isValid&&panel.node.isValid&&panel.node.parent.isValid)
        {
            if(this._maskLayer.parent&&this._maskLayer.parent.isValid)
            {
                this._maskLayer.parent = panel.node.parent;
                this._maskLayer.zIndex = panel.node.zIndex-1;
                this._maskLayer.active = true;
            }
        }
    }

    public setMaskLayerOpacity(opacity:number) {
        this._maskLayer.opacity = opacity;
    }
    
    public checkMaskLayer() {
        if (this._modalPanels.length > 0) {
            let panel = this._modalPanels[this._modalPanels.length-1];
            if(panel.isValid && panel.node.isValid)
            {
                if (panel.node.zIndex < 0) {
                    this._maskLayer.active = false;
                    this._maskLayer.zIndex = 0;
                } else {
                    this.showMaskLayer(panel);
                }
            }
        } else {
            this._maskLayer.active = false;
            this._maskLayer.zIndex = 0;
        }
    }

    /** 初始化MaskLayer */
    private initMaskLayer() {
        if (this._maskLayer != null) {
            return;
        }
        this._maskLayer = new cc.Node();
        this._maskLayer.setAnchorPoint(0.5, 0.5);
        this._maskLayer.addComponent(cc.BlockInputEvents);
        let sp:cc.Sprite = this._maskLayer.addComponent(cc.Sprite);
        sp.type = cc.Sprite.Type.SLICED;
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        let __self = this;
        RES.getSpriteFrameByPath('/img/ui/touming',
            (error: Error, resource: cc.SpriteFrame) => {
                console.log('initMaskLayer')
                sp.spriteFrame = resource;
                __self._maskLayer.opacity = 240;
                __self._maskLayer.color = cc.color(0, 0, 0);
                __self._maskLayer.zIndex = 0;
                __self._maskLayer.setContentSize(cc.winSize.width, cc.winSize.height);
                __self._maskLayer.parent = __self._panelHolder.panelLayer;
                __self._maskLayer.active = false;
                __self._maskLayer.on(cc.Node.EventType.TOUCH_START, __self.onMaskTouchStart, __self);
            }   
        )
    
        
    }
    private onMaskTouchStart(e){
        this.emit(PanelManager.Panel_Mask_Touch_Begin,e);
    }

    // 转圈提示
    public addLoadingLayer(worldPoint:cc.Vec2 = null)
    {
        this._panelHolder.addLoadingLayer(worldPoint);
    }

        // 转圈提示隐藏
    public removeLoadingLayer()
    {
        this._panelHolder.removeLoadingLayer();
    }

    public playCloudClose()
    {
        this._panelHolder.playCloudClose();
    }

    public playCloudOpen(cb)
    {
        this._panelHolder.playCloudOpen(cb);
    }

    /**
     * 
     * @param path 显示弹窗 
     * @param param 
     */
    public showPopUp(path:string,param?:any, act:boolean=false){
         this.showPanel(path,PanelManager.Type_Popup,param, act);
    }

    /**
     * 显示单个弹窗
     * @param path 
     * @param param 
     */
    public showSinglePopUp(path:string,param?:any, act:boolean=false){
        this.showUITouchLock();
        var node = this.getPanelSingle(path);
        if(node==null||node==undefined)
        {
            this.showPanel(path,PanelManager.Type_Popup,param, act)
        }
        else{
            node.getComponent(PanelBase).show(null,param);
        }
    }

    public showUITouchLock () {
        if (this._uiTouchLock != null) {
            return;
        }

        let _self = this;
        POOL.getPrefabFromPool(AssetConst.UITouchLock,(node:cc.Node)=>{
            node.parent = this._mui.node;
            _self._uiTouchLock = node;
        });
    }

    public closeUITouchLock () {
        if (this._uiTouchLock == null) {
            return;
        }

        POOL.putPrefabToPool(this._uiTouchLock);
        this._uiTouchLock = null;
    }

    /**
     * 显示提示框
    */
    public showAlert(title:string,message:string,okCallback?:Function,cancelCallback?:Function,btnType?:number, act:boolean=false){
        var param:any = {title:title,msg:message,okcb:okCallback,cancel:cancelCallback,type:btnType};
        // this.showPanel(AssetConst.AlertPanel,PanelManager.Type_Alert,param, act);
    }
    /**
     * 显示金币不足提示框
    */
   public showGoldAlert(title:string, message:string, act:boolean=false){
        var param:any = {title:title,msg:message};
        // this.showPanel(AssetConst.GoldAlertPanel,PanelManager.Type_Alert,param, act);
    }
    /**
     * 显示提示框
    */
   public showAlertOption(title:string,message:string,okText:string,okCallback?:Function,cancelCallback?:Function,btnType?:number, act:boolean=false){
    var param:any = {title:title,msg:message,okTxt:okText,okcb:okCallback,cancel:cancelCallback,type:btnType};
    // this.showPanel(AssetConst.AlertPanel,PanelManager.Type_Alert,param, act);
    }

    /**
     * 显示网络提示框，不能点击遮罩关闭。登陆阶段loadingscene被ui层挡住，需要临时加到场景
    */
   public showNetAlert(title:string,message:string,okCallback?:Function,cancelCallback?:Function,btnType?:number, act:boolean=false){
        var param:any = {title:title,msg:message,okcb:okCallback,cancel:cancelCallback,type:btnType,clickMaskClose:false,closBtnShow:false};
        if(SCENE.currentScene == null){  //加载阶段
            let node = cc.director.getScene().getChildByName('UICanvas');
            var scene:SceneBase = node.getComponent(SceneBase)
            if(scene instanceof LoadingScene){
                // this.showPanel(AssetConst.AlertPanel,PanelManager.Type_Alert,param, act, scene.topLayer);
            }
        }else{
            // this.showPanel(AssetConst.AlertPanel,PanelManager.Type_Alert,param, act);
        }
    }

    //移除所有弹窗
    public closeAllPopPanel(){
        this._panels.forEach(panel => {
            if(panel instanceof PopupBase){
                this.closePanel(panel.node);
            }
        });
    }
}




export var PANEL = PanelManager.getInstance();