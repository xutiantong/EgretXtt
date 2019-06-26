import { PANEL } from "../manager/PanelManager";
import Connect from "./Connect";
import SceneSwitchAni from "../scene/SceneSwitchAni";
import { RES } from "../manager/ResourceManager";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import { LoadingStep, Loading_debug_step } from "../GameConst";
import SocialAssist, { SOCIAL } from "../modules/social/SocialAssist";

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
export default class PanelHolder extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node) bottomLayer: cc.Node = null;

    @property(cc.Node) bgLayer: cc.Node = null;
    @property(cc.Node) cloudNode: cc.Node = null;
    @property(cc.Node) battleLayer: cc.Node = null;
    @property(cc.Node) monsterLayer: cc.Node = null;
    
    @property(cc.Node) uiLayer: cc.Node = null;
    @property(cc.Node) panelLayer: cc.Node = null;
    @property(cc.Node) guideLayer: cc.Node = null;
    @property(cc.Node) tipLayer: cc.Node = null;
    @property(cc.Node) topLayer: cc.Node = null;
    @property(cc.Label) labVersion: cc.Label = null;

    @property(cc.Node) guideNode: cc.Node = null;
    @property(cc.Node) mainNode: cc.Node = null;
    /** 新手引导面板--遮罩节点 */
    private _guideMaskLayer: cc.Node = null;
    private _guideColorLayer: cc.Node = null;
    private _guideBlockLayer: cc.Node = null; 

    @property (cc.Node) loadingView:cc.Node = null;


    onLoad () {
        // console.log('pannelHolder size',this.node.width,this.node.height);
         //this.node.width = cc.winSize.width;
        cc.game.addPersistRootNode(this.node);
        //注册管理器 
        PANEL.registerHolder(this);

        this.initVersion();
        this.initGuideMaskLayer();
    }
    private initVersion()
    {
        if(this.labVersion==null)
        {
            return;
        }
        var env = window["currentEnvironment"]
        var introStr = "（公测版）"
        if (env == "release"){
           
        }else if (env == "test"){
            introStr = "（测试1）"
        }else if (env == "dev"){
            introStr = "（测试2）"
        }else if (env == "local"){
            introStr = " (本地)"
        }
        console.log( 'initVersion:' +window["getVersion"]);
        if (window['getVersion']){
            var tempVer = "V" + window['getVersion'] + introStr
            this.labVersion.string= tempVer
        }
   
    }

    start () {

    }
    onEnable(){
        console.log('pannelHolder size',this.node.width,this.node.height);
        console.log('topLayer size',this.node.width,this.node.height)
        MSG.on('farmSceneLoadFinish',this.onCloseLoadingView,this);
    }
    onDestroy(){
       
        MSG.off('farmSceneLoadFinish',this.onCloseLoadingView,this);
    }

    private onCloseLoadingView(){
        this.loadingView.removeFromParent();
    }
  

    // 转圈提示
    public addLoadingLayer(worldPoint:cc.Vec2 = null)
    {
        let connectingLayer = this.topLayer.getChildByName("ConnectingLayer");
        var connect:Connect = connectingLayer.getComponent("Connect");
        connect.showConnect(true,worldPoint);
    }

        // 转圈提示隐藏
    public removeLoadingLayer()
    {
        let connectingLayer = this.topLayer.getChildByName("ConnectingLayer");
        var connect:Connect = connectingLayer.getComponent("Connect");
        connect.showConnect(false);
    }

    public playCloudOpen(cb)
    {
        let cloudLayer = this.topLayer.getChildByName("CloudLayer");
        var cloud:SceneSwitchAni = cloudLayer.getComponent("SceneSwitchAni");
        cloud.playOpen(cb);
    }

    public playCloudClose()
    {
        let cloudLayer = this.topLayer.getChildByName("CloudLayer");
        var cloud:SceneSwitchAni = cloudLayer.getComponent("SceneSwitchAni");
        cloud.playClose();
    }

    /** 初始化GuideMaskLayer */
    private initGuideMaskLayer() {
        if (this._guideMaskLayer != null) {
            return;
        }
        let blockLayer = new cc.Node();
        blockLayer.setAnchorPoint(0.5, 0.5);
        blockLayer.addComponent(cc.BlockInputEvents);
        blockLayer.setContentSize(cc.director.getWinSizeInPixels().width, cc.director.getWinSizeInPixels().height);
        blockLayer.parent = this.guideLayer;
        blockLayer.active = false;
        this._guideBlockLayer = blockLayer;

        this._guideMaskLayer = new cc.Node();
        this._guideMaskLayer.setAnchorPoint(cc.p(0.5,0.5));
        this._guideMaskLayer.setContentSize(cc.size(0,0));
        let mask = this._guideMaskLayer.addComponent(cc.Mask);
        mask.inverted = true;
        mask.type = 0;
        this._guideMaskLayer.parent = this.guideLayer;

        let colorLayer = new cc.Node();
        colorLayer.setAnchorPoint(0.5, 0.5);
        // colorLayer.addComponent(cc.BlockInputEvents);
        let sp = colorLayer.addComponent(cc.Sprite);
        sp.spriteFrame = new cc.SpriteFrame();
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        colorLayer.opacity = 0;
        colorLayer.color = cc.color(0, 0, 0);
        colorLayer.zIndex = 0;
        colorLayer.setContentSize(cc.director.getWinSizeInPixels().width * 3, cc.director.getWinSizeInPixels().height* 3);
        colorLayer.parent = this._guideMaskLayer;
        this._guideColorLayer = colorLayer;

        this._guideMaskLayer.active = false;
    }
    public showGuideMask () {
        this._guideColorLayer.opacity = 0;
        this._guideMaskLayer.active = true;
        this._guideBlockLayer.active = true;
    }
    public hideGuideMask () {
        this._guideMaskLayer.active = false;
        this._guideBlockLayer.active = false;
        this._guideColorLayer.opacity = 0;
        this._guideMaskLayer.setContentSize(cc.size(0,0));
    }

    public updateGuideMaskPosAndSize (pos:cc.Vec2, size:cc.Size, arcPos:cc.Vec2, isFullScr:boolean=false) {
        let localPos = this._guideMaskLayer.parent.convertToNodeSpaceAR(pos);
        this._guideMaskLayer.setPosition(localPos);
        this._guideMaskLayer.setContentSize(size);
        this._guideMaskLayer.setAnchorPoint(arcPos);
        this._guideColorLayer.opacity = 200;
        if (isFullScr) {
            this._guideMaskLayer.setContentSize(cc.size(0,0));
            this._guideColorLayer.opacity = 0;
        }
    }
    // update (dt) {}
}
