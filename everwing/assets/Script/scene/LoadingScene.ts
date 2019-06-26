import { NET } from "../net/core/NetManager";
import NetConst from "../net/NetConst";
import { CFG } from "../manager/ConfigManager";
import { SCENE } from "./SceneManager";
import GameData, { GAME } from "../model/GameData";
import GameConst, { AssetConst, LoadingStep, Loading_debug_step } from "../GameConst";
import SceneBase from "./SceneBase";
import PanelManager, { PANEL } from "../manager/PanelManager";
import { SOCIAL } from "../modules/social/SocialAssist";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import DottingUtil, { BIActionConst } from "../utils/DottingUtil"; 
import { RES } from "../manager/ResourceManager";

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
export default class LoadingScene extends SceneBase {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.ProgressBar)
    loadingBar: cc.ProgressBar = null;
    @property(cc.Label)
    lblProgress: cc.Label = null;

        //debug 节点
        @property (cc.Label) debug_configLabel:cc.Label = null;
        @property (cc.Label) debug_loginLabel:cc.Label = null;
        @property (cc.Label) debug_loadSceneLabel:cc.Label = null; 
        @property (cc.Label) debug_preloadSceneLabel:cc.Label = null; 

    private proloadcount:number = 0;
    private loadingstep:number = 0;
    onLoad () {
        console.debug("游戏启动");
       
        DottingUtil.bi_normalFun(BIActionConst.kActName_OnLoadLoadingScene ,null);
        // SOCIAL.socialBase.toBI("OnLoadLoadingScene", null, false);
        this.lblProgress.string = "0%";
        this.loadingBar.progress = 0;
        this.nextMaxStepPro = this.stepProgress[0];
    }
    start(){
        console.log('loadingSecene',this.node.width , this.node.height);
        if (window["currentEnvironment"] != "release"){
            this.debug_configLabel.node.active = true;
            this.debug_loadSceneLabel.node.active = true;
            this.debug_loginLabel.node.active = true;
            this.debug_preloadSceneLabel.node.active = true;
        }
        DottingUtil.bi_normalFun(BIActionConst.kActName_LoadingStart ,null);
        // SOCIAL.socialBase.toBI("BeginLoadingScene", null, false);
        //预加载游戏场景
        // RES.loadAtlas(AtlasAssetConst.SEED, (atlas:cc.SpriteAtlas)=>{
        // });
        
        SCENE.preLoadedScene(GameConst.GameFramScene);
    }
    onEnable()
    {
        DottingUtil.bi_normalFun(BIActionConst.kActName_BeginLoadingScene ,null);
        MSG.on(MessageConst.Loading_step_finish,this.onLoadingStep,this);
        // if (window["currentEnvironment"] != "release"){
            MSG.on(MessageConst.Debug_loading_step,this.onDebugLoadingAction,this);
            MSG.on(MessageConst.Debug_preloading_step,this.proloadProcent,this);
            
        // }
       
    }
    onDisable()
    {
        MSG.off(MessageConst.Loading_step_finish,this.onLoadingStep,this);
        // if (window["currentEnvironment"] != "release"){
            MSG.off(MessageConst.Debug_loading_step,this.onDebugLoadingAction,this);
            MSG.on(MessageConst.Debug_preloading_step,this.proloadProcent,this);
        // }
       
    }

    private proloadProcent(e){
        var step = e.detail.step ;
        this.proloadcount = step;
        this.nextMaxStepPro = this.stepProgress[this.loadingstep]+this.proloadcount;
        console.log("proloadProcent:"+this.proloadcount);
        console.log("proloadnextMaxStepPro:"+this.nextMaxStepPro);
    }

    private onDebugLoadingAction(e){
        var step = e.detail.step ;
        console.log("Loading_debug_step:",step,"t:"+new Date().getTime());
        
        if( Loading_debug_step.Loading_debug_step_configStart == step){
            this.debug_configLabel.string = "配置：开始加载" ;
        }else if ( Loading_debug_step.Loading_debug_step_configFinish == step){
            this.debug_configLabel.string = "配置：加载完成" ;
        }else if ( Loading_debug_step.Loading_debug_step_wxloginStart == step){
            this.debug_loginLabel.string = "登录: 微信登录开始";
        }else if ( Loading_debug_step.Loading_debug_step_wxloginFinsh == step){
            this.debug_loginLabel.string = "登录: 微信登录完成";
        }else if ( Loading_debug_step.Loading_debug_step_loadSceneStart == step){
            this.debug_loadSceneLabel.string = "场景: 场景加载开始";
        }else if ( Loading_debug_step.Loading_debug_step_loadSceneFinish == step){
            this.debug_loadSceneLabel.string = "场景: 场景加载完成";
        }else if ( Loading_debug_step.Loading_debug_step_serverLoginStart == step){
            this.debug_loginLabel.string = "登录: 服务器登录开始";
        }else if ( Loading_debug_step.Loading_debug_step_serverLoginFinish == step){
            this.debug_loginLabel.string = "登录: 服务器登录完成";
        }else if ( Loading_debug_step.Loading_debug_step_serverInitFinish == step){
            this.debug_loginLabel.string = "登录: 服务器数据加载完成";
        }else if ( Loading_debug_step.Loading_debug_step_loadSoundStart == step){
            this.debug_loginLabel.string = "登录: 音效加载开始";
        }else if ( Loading_debug_step.Loading_debug_step_loadSoundFinish == step){
            this.debug_loginLabel.string = "登录: 音效加载完成";
        }else if ( Loading_debug_step.Loading_debug_step_MainViewLoadStart == step){
            this.debug_loadSceneLabel.string = "场景: 主页面加载开始";
        }else if ( Loading_debug_step.Loading_debug_step_MainViewLoadFinish == step){
            this.debug_loadSceneLabel.string = "场景: 主页面加载完成";
        }else if ( Loading_debug_step.Loading_debug_step_loadOtherPrefabStart == step){
            this.debug_preloadSceneLabel.string = "预加载: 开始";
        }else if ( Loading_debug_step.Loading_debug_step_loadOtherPrefabFinish == step){
            this.debug_preloadSceneLabel.string = "预加载: 完成";
            SCENE.preLoadComplete();
        }
    }
    private stepProgress:Array<number>= [25,50,75,80]; //对应loadingStep enum
    private totalLoadingTime:number =10; // 总匀速加载时间
    private nextMaxStepPro:number;
    //加载进度
    private onLoadingStep(e){
        var step = e.detail.step ;
        console.log("onLoadingStep:",step,"t:"+new Date().getTime());
        var stepPro:number = this.stepProgress[step];
        this.setProgress(stepPro);
        if(step == LoadingStep.uiLoadComplete){ //加载完成
            DottingUtil.bi_normalFun(BIActionConst.kActName_LoadingFinish ,null);
            this.entergame();
        }else{
            this.nextMaxStepPro = this.stepProgress[step+1]+this.proloadcount;
            this.loadingstep =step+1;
        }
    }    

    private entergame(){
        DottingUtil.bi_normalFun(BIActionConst.kActName_EnterGame,
            {
                ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
                InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
                InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:''
            });
        SCENE.changeScene(GameConst.GameFramScene, this.startGuide);
    }
    private startGuide() { 
        return;
    }

    update(dt){
        if(this._prePro<this.nextMaxStepPro-1){
            var pro = this._prePro;
            var add = (dt /this.totalLoadingTime)*100;
            pro += add;
            if(pro>100)
                pro = 100;
            this.setProgress(pro);
        }
    }

    private _prePro = 0;
    private setProgress(pro){
        if(pro<= this._prePro){
            return;
        }
        this._prePro  = pro;

        var intPro:number = Math.ceil(pro);
        this.lblProgress.string = intPro +"%";
        this.loadingBar.progress = intPro/100;
    }
}
