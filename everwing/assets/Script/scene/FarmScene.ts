// import FarmlandBase from "../modules/farm/comp/FarmlandBase";
import SceneBase from "./SceneBase";
import  { GAME } from "../model/GameData";
import { CFG } from "../manager/ConfigManager";
import GameConst, { ConfigConst, AssetConst, ZERO, ResourceConst } from "../GameConst";
import Log from "../utils/log/Log";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import PanelManager, { PANEL } from "../manager/PanelManager";
import { SCENE } from "./SceneManager";
import TouchListener from "../component/TouchListener";
import { SOUND } from "../manager/SoundManager";
// import GuideManager, { GuideM } from "../modules/guide/GuideManager";
import NumberUtil from "../utils/NumberUtil";
import { RES } from "../manager/ResourceManager";
// import ShopEntry from "../modules/shop/ShopEntry";
// import TreeEntry from "../modules/shop/TreeEntry";
import { Toast } from "../modules/toast/Toast";
import { FarmSceneConfig } from "./FarmSceneConfig";

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
export default class FarmScene extends SceneBase {

    @property(cc.Node) dogNode:cc.Node = null;
    @property(cc.Prefab) treePrefab:cc.Prefab = null;

    private loadNum:number = 0;
    private perfabCfg:Array<any> = null;
    private isStart:Boolean = false;
    private static Unlock_type_invertCount:number = 6;

    public _farmlands:any;
    onLoad () {
        super.onLoad();
        this._farmlands = [];
        this.cascadeGetFarmland(this.node);
        // SOUND.playBgSound();
        this.perfabCfg = FarmSceneConfig;

        // RES.loadAtlas("mainui/mainui_atlas",(atlas:cc.SpriteAtlas)=>{
        //     let a = atlas;
        // });
    }

    private printPos(){
        // console.log("+++++++++++++++++++++++++++++++++++++",pos);
        this.perfabCfg.sort((a,b)=>{
            let disa = Math.pow((980-a.pX),2)+Math.pow((730-a.pY),2);
            let disb = Math.pow((980-b.pX),2)+Math.pow((730-b.pY),2);
            if(disa > disb)return 1;
            if(disa = disb)return 0;
            if(disa < disb)return -1;
        });
        console.log("+++++++++++++++++++++++++++++++++++++",this.perfabCfg)
    }

    private cascadeGetFarmland(parent:cc.Node){
    }

    /**
     * 根据地块id获取农田
     * @param posId 
     */
    public getFarmByPos(posId:number){
        return this._farmlands[posId];
    }

    public initFromServer(){
        // let mapData = FARM.mapData.positionInfo;
        // let farmlands = CFG.getCfgByKey(ConfigConst.FARMLAND);
        // for (let k in farmlands) {
        //     let id = Number(k)+1;
        //     let data = mapData[id];
            
        //     let farm:FarmlandBase = this._farmlands[id];
        //     if (farm != null) {
        //         farm.init(data);
        //     } else if (farm == null) { //锁定
        //         Log.error("id farmland is not found!, id = ", id);
        //     }
        // }

    }
    start(){
        MSG.emit('farmSceneLoadFinish');
        this.isStart = true;
        // this.scheduleOnce(()=>{
        //     RES.loadAtlas(AtlasAssetConst.SEED, (atlas:cc.SpriteAtlas)=>{
        //     });
        //     RES.loadAtlas(AtlasAssetConst.Imgtxt, (atlas:cc.SpriteAtlas)=>{
        //     });
        // },2);
        this._scorllView.enabled = false;
    }
    onEnable(){
        MSG.on(MessageConst.kUserLevelUp ,this.onUserLevelUp,this);
        MSG.on(MessageConst.kUserGMReset,this.resetData,this);

    }

    onDisable(){
        MSG.off(MessageConst.kUserLevelUp ,this.onUserLevelUp,this)
        MSG.off(MessageConst.kUserGMReset,this.resetData,this);
    }

    private resetData(){
        this.initFromServer();
    }

    
    //用户等级升级
    private onUserLevelUp(e){
        if (e && e.detail && e.detail.level){
            var userLevel = e.detail.level
        }
        var userData = {level:userLevel}
        // if (SCENE.hasGuide()) {
        //     return;
        // }
        PANEL.showPanel(AssetConst.UserLevelUpView ,PanelManager.Type_Popup ,userData);

    }

    public onRemove(){
        var main = PANEL.getPanelSingle(AssetConst.MainView);
        if(main){
            main.active = false;
        }
        var entryBtnView = PANEL.getPanelSingle(AssetConst.EntryBtnView);
        if(entryBtnView){
            entryBtnView.active = false;
        }
    }

    public onResume(){
		var main = PANEL.getPanelSingle(AssetConst.MainView);
        if(main){
            main.active = true;
        }
        // var entryBtnView = PANEL.getPanelSingle(AssetConst.EntryBtnView);
        // if(entryBtnView){
        //     entryBtnView.active = true;
        // }
        // if(FARM.serverDataInit){
        //     GAME.loadingTimeTrace("farm scene init");
        //     this.initFromServer();
        // }
    }

    public getGuideNode(key:string, value:string=""):cc.Node {
        let ret:cc.Node = null;
        if (key == "dog") {
            // ret = this._dog;
        }else if (key == "cangku") {
            // ret = this._cangku;
        }else if (key == "tile") { //地块
            // let farm:FarmlandBase = this.getFarmByPos( NumberUtil.toFloat(value) );
            // if (farm) {
            //     // if (farm.currentState >= FarmlandBase.State_Growth) {
            //     //     GuideManager.getInstance().GudieLogic.getTrigger().removeFormCurrentStep(2);
            //     // }
            //     ret = farm.node;
            // }
        }
        return ret
    }
    public _playTime:number;

    public flyItem(posId:number, itemId:number, num:number=0, othId:string="") {
        let base:cc.Component = null;
        if (posId == 0 && othId !="") {
            if (othId == "guoshu1") {
                // base = this.tree1Node.getComponent(TreeEntry);
                // posId = 500001;
            }else if (othId == "guoshu2") {
                // base = this.tree2Node.getComponent(TreeEntry);
                // posId = 500002;
            }
        }else {
            base = this.getFarmByPos( posId );
        }
        // if (base == null || this._cangku==null) {
        //     return;
        // }
        // let shopEntry = this._cangku.getComponent(ShopEntry);
        // if (shopEntry) {
        //     shopEntry.flyItem(posId, itemId, base, num);
        // }
    }

    update (dt) {
    }
}
