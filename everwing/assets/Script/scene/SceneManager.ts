import SceneBase from "./SceneBase";
import GameConst, { AssetConst, LoadingStep, Loading_debug_step } from "../GameConst";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import PanelManager, { PANEL } from "../manager/PanelManager";
import DottingUtil, { BIActionConst } from "../utils/DottingUtil";

export default class SceneManager{
    private static _instance: SceneManager = null;
    public static getInstance(): SceneManager {
        if (SceneManager._instance == null) {
            SceneManager._instance = new SceneManager();
            
        }
        return SceneManager._instance;
    }
    //好友场景界面初始化
    public friendUICreated:boolean = false;
    //主场景界面初始化
    public mainUICreated:boolean = false;
    public isPreLoadComplete:boolean = false;
    public isStartupMainUI:boolean = false;
    //需要在这些ui加载完成才切换场景
    // private mainUILoadPrefabs:Array<string> = [AssetConst.EntryBtnView,AssetConst.FriendSideBar,AssetConst.MainView,AssetConst.SeedView];
    private mainUILoadPrefabs:Array<string> = [AssetConst.MainView];
    private mainUILoadPrefabsProgress:any = {};
    
    public startupMainUI(){
        this.isStartupMainUI = true;
        if(this.isPreLoadComplete){
            this.doStartupMainUI();
        }
    }

    public doStartupMainUI(){
        var time = Date.now();
        if(CC_DEBUG)
        {
            console.log("[load] startupMainUI start "+time);
        }
        if(!SCENE.mainUICreated){
            SCENE.mainUICreated = true;
            this.mainUILoadPrefabsProgress = {};
            MSG.on(MessageConst.Loading_mainui_prefab,this.loadingMainuiPrefab,this);

            // PANEL.showPanel(AssetConst.EntryBtnView,PanelManager.Type_Bottom);
            // PANEL.showPanel(AssetConst.FriendSideBar,PanelManager.Type_UI);
            PANEL.showPanel(AssetConst.MainView,PanelManager.Type_UI);
            // PANEL.showPanel(AssetConst.SeedView,PanelManager.Type_UI);
            // PANEL.showPanel(AssetConst.PastureShopView,PanelManager.Type_UI);
            
        }
        if(CC_DEBUG)
        {
            console.log("[load] startupMainUI end "+Date.now()+" consume:"+(Date.now() - time));
        }
    }


    public preLoadComplete(){
        this.isPreLoadComplete = true;
        if(this.isStartupMainUI){
            this.doStartupMainUI()
        }
    }

    private loadingMainuiPrefab(e){
        MSG.emit(MessageConst.Debug_loading_step , 
            {step:Loading_debug_step.Loading_debug_step_MainViewLoadStart});
        var prefab:string= e.detail.prefab;
        console.log("load ui complete:",prefab);
        this.mainUILoadPrefabsProgress[prefab] = true;
        var allComplete:boolean = true;
        this.mainUILoadPrefabs.forEach(element => {
            var complete:boolean = (this.mainUILoadPrefabsProgress[element]== true)?true:false;
            allComplete = allComplete && complete;
        });
        if(allComplete){
            console.log("load ui all complete..");
            MSG.emit(MessageConst.Debug_loading_step , 
                {step:Loading_debug_step.Loading_debug_step_MainViewLoadFinish});
            MSG.off(MessageConst.Loading_mainui_prefab,this.loadingMainuiPrefab,this);
            MSG.emit(MessageConst.Loading_step_finish,{step:LoadingStep.uiLoadComplete});
        }
    }
 
    private _curScene:SceneBase = null;
    private _curSceneName:string ="";
    public get currentScene(){
        return this._curScene;
    }

    /**
     * 当前场景名
     */
    public get currentSceneName(){
        return this._curSceneName;
    }

    private _preloadedSceneMap:any ={};
    private _preloadedSceneCB:any = null;
    
    public preLoadedScene(sceneName:string){
        this._preloadedSceneMap[sceneName] = false;
        cc.director.preloadScene(sceneName,()=>{
            this._preloadedSceneMap[sceneName] = true;
            console.log("场景预加载结束:",sceneName);
            if(this._preloadedSceneCB!=null && this._preloadedSceneCB.name == sceneName){
                this.changeScene(this._preloadedSceneCB.name,this._preloadedSceneCB.callback);
                this._preloadedSceneCB = null;
            }
        });
    }

    public changeScene(sceneName:string,cb?:Function){
        console.log("开始加载场景："+sceneName);
        PANEL.closeAllPopPanel();
        cb&&cb();
        MSG.emit(MessageConst.Scene_Change_complete,{name:sceneName})
        MSG.emit('farmSceneLoadFinish');
        return;
        //检查预加载
        if(this._preloadedSceneMap[sceneName]==undefined ||this._preloadedSceneMap[sceneName]== true){
            console.log("直接场景切换")
            this.doChangeScene(sceneName,cb);
        }else{
            console.log("等待预加载完成场景切换")
            this._preloadedSceneCB = {name:sceneName,callback:cb};
        }
    }

    private doChangeScene(sceneName:string,cb?:Function){
        console.log("开始加载场景："+sceneName);
        if(this._curScene)
        {
            this._curScene.onRemove();
            this._curScene.unscheduleAllCallbacks();
        }
        PANEL.closeAllPopPanel();
        cc.director.loadScene(sceneName, () => {
            console.log("加载场景结束："+sceneName);
            let node = cc.director.getScene().getChildByName('Canvas');
            var scene:SceneBase = node.getComponent(SceneBase)
            if(scene){
                this._curScene = scene;
                this._curSceneName = sceneName;
                scene.onResume();
                scene.scheduleOnce(()=>{
                    cb&&cb();
                    MSG.emit(MessageConst.Scene_Change_complete,{name:sceneName})
                },0.3);
            }
        });
    }

    public hasGuide() {
    }

    // //初始化场景
    // public initScene(){
    //     let node = cc.director.getScene().getChildByName('Canvas');
    //     this._curScene = node.getComponent(SceneBase)
    //     this._curScene.onResume();
    //     GUIDE.startSceneGuide(this._curScene);
    // }
}



export var SCENE = SceneManager.getInstance();
