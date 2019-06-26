import PanelBase from "../../component/PanelBase";
import {GAME} from "../../model/GameData";
import {CFG} from "../../manager/ConfigManager";
import {AssetConst, ConfigConst, ZERO} from "../../GameConst";
import {POOL} from "../../manager/PoolManager";
import {NET} from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import WXInterface, {WX_API} from "../share/WXInterface";
import {BM} from "./BattleManager";
import {Toast} from "../toast/Toast";

import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import SocialAssist, {SOCIAL} from "../social/SocialAssist";
import NewBulletItem from "./NewBulletItem";
import GuideHandView from "../gride/GuideHandView";


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
export default class BulletUpgradeView extends PanelBase {

    @property(cc.Node)
    oldItemNode: cc.Node = null;
    @property(cc.Node)
    newItemNode: cc.Node = null;
    @property(cc.Label)
    oldLvLabel: cc.Label = null;
    @property(cc.Label)
    oldDamageLabel: cc.Label = null;
    @property(cc.Label)
    newLvLabel: cc.Label = null;
    @property(cc.Label)
    newDamageLabel: cc.Label = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Button)
    okButton: cc.Button = null;
    @property(cc.Button)
    goldlessButton: cc.Button = null;
    @property(cc.Animation)
    upgradeAnimation: cc.Animation = null;
    @property(cc.Node)
    handSprite:cc.Node=null;
    @property(cc.Label) topCup:cc.Label=null;
    @property(cc.Label) topGold:cc.Label=null;
    @property(cc.Label) topDiamond:cc.Label=null;
    

    @property (cc.Button) watchMoiveBtn:cc.Button = null;
    @property (cc.Sprite) notNewSp:cc.Sprite = null;

    @property(cc.Label) level:cc.Label=null;
    @property(cc.Label) upLevelPercent:cc.Label=null;
    @property(cc.ProgressBar) levelBar:cc.ProgressBar=null;

    @property(cc.Node) TextNode: cc.Node = null;

    private _oldBulletNode: cc.Node = null;     // 子弹实体 用于放回池子
    private _newBulletNode: cc.Node = null;
    private _isguide:boolean=false;
    private _guideNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public onInit (data: any) {
        super.onInit(data);
        this._isguide=data.isguide;
        if (this._guideNode != null) {
            POOL.putPrefabToPool(this._guideNode);
        }
        if(data.isguide){ 
            this.guideHandShow();
        }else{
            this.handSprite.active=false;
        }
        this._refreshView();
        this.topGold.string = String(GAME.playerData.RoleData.gold);
        this.topDiamond.string = String(0);
        this.topCup.string = String(GAME.playerData.RoleData.trophy);
        WX_API.gameClubHide();
    }    

    onEnable(){
        MSG.on(MessageConst.Player_Data_Change_v1,this.onPlayerDataChange_v1,this);
        MSG.on(MessageConst.GuideClick, this.onSureClick, this);
    }

    onDisable(){
        MSG.off(MessageConst.Player_Data_Change_v1,this.onPlayerDataChange_v1,this);
        MSG.off(MessageConst.GuideClick, this.onSureClick, this);
    }

    private _refreshView() {
        this.newItemNode.removeAllChildren();
        this.oldItemNode.removeAllChildren();
        let bullet = GAME.playerData.RoleData.bullet;
        let newBullet = bullet + 1;
        let oldConfigId = 1000 + bullet;
        let newConfigId = 1000 + newBullet;
        let oldConfig = CFG.getCfgDataById(ConfigConst.BULLET, oldConfigId.toString());
        let newConfig = CFG.getCfgDataById(ConfigConst.BULLET, newConfigId.toString());

        if (this._oldBulletNode) {
            POOL.putPrefabToPool(this._oldBulletNode);
            this._oldBulletNode = null;
        }
        POOL.getPrefabFromPool(BM.getBulletNewPrefabPath(), (node: cc.Node) => {
            if (node == null) {
                return;
            }
            node.getComponent(NewBulletItem).setData(bullet);
            this._oldBulletNode = node;
            node.position = ZERO;
            node.parent = this.oldItemNode;
        });
        this.oldLvLabel.string = bullet.toString() + "级";
        this.oldDamageLabel.string = "杀伤力:" + oldConfig.atk;
        this.goldLabel.string = oldConfig.cost_coin;

        let level = GAME.playerData.RoleData.level;
        this.level.string=String(level);
        let upData=CFG.getCfgDataById(ConfigConst.RANK,level.toString());
        var intPro:number=0;
        if(upData){
            intPro= Math.ceil((GAME.playerData.RoleData.exp/upData.score)*100);
        }
        if(intPro>100){
            intPro=100;
        }
        this.upLevelPercent.string=intPro+"%";
        this.levelBar.progress=intPro/100;

        if (this._isguide) {
            this.okButton.node.active = true;
            this.goldlessButton.node.active = false;
        } else {
            this.okButton.node.active = parseInt(oldConfig.cost_coin) <= GAME.playerData.RoleData.gold;
            this.goldlessButton.node.active = !this.okButton.node.active;
        }
        
        if (newConfig == null || newConfig == undefined) {
            this.okButton.node.active = false;
            this.goldlessButton.node.active=true;
            this.goldlessButton.interactable = false;
            this.watchMoiveBtn.interactable = false;
            this.newLvLabel.node.active = false;
            this.newDamageLabel.node.active = false;
            this.notNewSp.node.active = true;
            return;
        }

        if (this._newBulletNode) {
            POOL.putPrefabToPool(this._newBulletNode);
            this._newBulletNode = null;
        }
        POOL.getPrefabFromPool(BM.getBulletNewPrefabPath(), (node: cc.Node) => {
            if (node == null) {
                return;
            }
            node.getComponent(NewBulletItem).setData(newBullet);
            this._newBulletNode = node;
            node.position = ZERO;
            node.parent = this.newItemNode;
        });

        this.newLvLabel.string = newBullet.toString() + "级";
        this.newDamageLabel.string = "杀伤力:" + newConfig.atk;
    }

    public onSureClick () {
        this.handSprite.active=false;
        let bullet = GAME.playerData.RoleData.bullet;
        let oldConfigId = 1000 + bullet;
        let oldConfig = CFG.getCfgDataById(ConfigConst.BULLET, oldConfigId.toString());
        if(this._isguide==true){
            this._isguide = false;
            var bulletnext=bullet+1;
            GAME.updatePlayerData_v1({"bullet":bulletnext});
            MSG.emit(MessageConst.GuideOver);
            this._refreshView();
            this.playUpgradeAnimation();
            this.successPrompt();
            NET.send(NetConst.BulletUpgrade, {"gold":0}, (data) => {
                GAME.updatePlayerData_v1(data.playerInfo);
                
            }, this,this.failPrompt);
            this.onCloseClick();
        }else{
            var gold=GAME.playerData.RoleData.gold-oldConfig.cost_coin;
            var bulletnext=bullet+1;
            GAME.updatePlayerData_v1({"gold":gold,"bullet":bulletnext});
            this._refreshView();
            this.playUpgradeAnimation();
            this.successPrompt();
            NET.send(NetConst.BulletUpgrade, {"gold":oldConfig.cost_coin}, (data) => {
                GAME.updatePlayerData_v1(data.playerInfo);
                
            }, this,this.failPrompt);
        }
    }

    public onMovieClick () {
        if (SOCIAL.social_type == SocialAssist.SOCIAL_WEB){
            this.shareSuccessCallBack();
        }else{
            let shareData = WX_API.getShareInfoData(WXInterface.shareType_BulletUpgrade);
            console.log(shareData);
            let adId = shareData["incentiveAdvertising"];
            WX_API.showVideoAd(shareData["id"], this.shareSuccessCallBack.bind(this),this.closeViewButtonAction.bind(this),"",adId);
        }
      
    }

    private onPlayerDataChange_v1(){
        this.topGold.string = String(GAME.playerData.RoleData.gold);
        this.topCup.string = String(GAME.playerData.RoleData.trophy);
        //刷新按钮
        
    }

    private playUpgradeAnimation() {
        this.upgradeAnimation.node.active = true;
        setTimeout(() => {
            this.upgradeAnimation.node.active = false;
        }, 2000);
    }

    /**
     * 升级成功
     */
    private successPrompt(){
        Toast.showToast('太棒了，战斗力又提升了!',1.5);
    }

    /**
     * 升级失败
     */
    private failPrompt(){
        Toast.showToast('好像没升级成功。',1.5);
    }

    private shareSuccessCallBack(){
        NET.send(NetConst.BulletUpgrade, {"gold":0}, (data) => {
            GAME.updatePlayerData_v1(data.playerInfo);
            this._refreshView();
            this.playUpgradeAnimation();
            this.successPrompt();
        }, this,this.failPrompt);
    }
    public closeViewButtonAction(){
        Toast.showToast('观看视频失败',3);
    }

    public onCloseClick () {
        if (this._oldBulletNode) {
            POOL.putPrefabToPool(this._oldBulletNode);
        }
        if (this._newBulletNode) {
            POOL.putPrefabToPool(this._newBulletNode);
        }

        this._oldBulletNode = null;
        this._newBulletNode = null;
        this.closePanel();
        MSG.emit(MessageConst.hidePause);
        if (!this._isguide) {
            WX_API.gameClubShow();
        }else{
            let levelData=CFG.getCfgByKey(ConfigConst.RANK,"level",GAME.playerData.RoleData.level);
            let nextLevelData=CFG.getCfgByKey(ConfigConst.RANK,"level",GAME.playerData.RoleData.level+1);
            if(nextLevelData.length>0&&levelData.length>0&&(GAME.playerData.RoleData.exp>=levelData[0].score)){
                MSG.emit(MessageConst.showUpLevel, {"gold": levelData[0]["coin"], "exp": levelData[0]["score"]});
            }else{

                //MSG.emit(MessageConst.RankGuide);
            }
        }

        


    } 

    protected panelMaskTouch(e){
        return;
    }

    /**
     * 金币不足不可升级
     */
    private goldlessButtonClick(){
        Toast.showToast('金币不够，去打怪赚钱吧！',1.5);
    }

    /**
     * 引导
     */
    private guideHandShow(){
        // console.log('引导'+this._isguide)
        // this.okButton.node.active = true;
        // this.handSprite.active=true;
        // var moveup=cc.v2(-10,10);
        // var movedown=cc.v2(10,-10);
        // this.handSprite.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.4,moveup),cc.moveBy(0.4,movedown))));
        // this.scheduleOnce( function() {Toast.showToast('升级子弹，打怪更快哦！',2),0.2},
        // )

        let arcPos = this.okButton.node.getAnchorPoint();
        let wordPos = this.okButton.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let nodePos = this.node.convertToNodeSpaceAR(wordPos);
        let size = this.okButton.node.getContentSize();
        console.log('this Node', this.node.convertToWorldSpaceAR(cc.v2(0, 0)));
        console.log("btnposition", this.okButton.node.getPosition());
        console.log("wordpos", nodePos);
        var _self = this;
        POOL.getPrefabFromPool(AssetConst.GuideHandView, (node: cc.Node) => {
            node.parent = _self.node;
            var guideView = node.getComponent(GuideHandView);
            guideView.onInit({"arcPos": arcPos, "wordPos": nodePos, "size": size});
            _self._guideNode = node;
        });
    }

    // update (dt) {}
}
