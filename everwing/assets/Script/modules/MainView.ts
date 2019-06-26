import PanelBase from "../component/PanelBase";
import {AssetConst, ConfigConst, ResourceConst, ZERO} from "../GameConst";
import {GAME} from "../model/GameData";
import {MSG} from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import {PANEL} from "../manager/PanelManager";
import GameUtil from "../utils/GameUtil";
import ResFlyAnim from "../component/effect/ResFlyAnim";
import {RES} from "../manager/ResourceManager";
import WXInterface, {WX_API} from "./share/WXInterface";
import BoxFlyAnim from "../component/effect/BoxFlyAnim";
import {BM} from "./battle/BattleManager";
import {BATTLEDATA, GameState, RushType} from "../model/BattleData";
import {LEVELMG} from "./level/LevelManager";
import {WxDomainAction, wxOpenData, WxOpenDataKeys} from "../WXOpenData/WxOpenData";
import {SOUND} from "../manager/SoundManager";
import DottingUtil, {BIActionConst} from "../utils/DottingUtil";
import {Toast} from "./toast/Toast";
import {POOL} from "../manager/PoolManager";
import {NET} from "../net/core/NetManager";
import NetConst from "../net/NetConst";
import {SOCIAL} from "./social/SocialAssist";
import {CFG} from "../manager/ConfigManager";
import {REWAED} from "./treasureBox/RewardManager";
import { ABTEST } from "../manager/AbTestSwitchMg";


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
export default class MainView extends PanelBase{


    // LIFE-CYCLE CALLBACKS:
    // @property(cc.Label) diamondValue: cc.Label = null;
    // @property(cc.Label) cashValue: cc.Label = null;
    // @property(cc.Label) coinsValue: cc.Label = null;
    // @property(cc.Label) levelValue:cc.Label = null;
    // @property(cc.Label) expValue:cc.Label = null;
    // @property(cc.ProgressBar) progressbar:cc.ProgressBar = null;
    
    // @property(cc.Sprite) goldIcon:cc.Sprite = null;
    // @property(cc.Sprite) redbagIcon:cc.Sprite = null;
    // @property(cc.Sprite) expIcon:cc.Sprite = null;
    // @property(cc.Sprite) diamondIcon:cc.Sprite = null;
    // @property(cc.Node) redExpNode:cc.Node = null;

    // @property(cc.Node) goldNode:cc.Node = null;
    // @property(cc.Node) expNode:cc.Node = null;
    // @property(cc.Node) RedNode:cc.Node = null;
    // @property(cc.Node) DiamondNode:cc.Node = null;

    // @property(sp.Skeleton) goldSke:sp.Skeleton = null;
    // @property(sp.Skeleton) ExpSke:sp.Skeleton = null;
    // @property(sp.Skeleton) RedPacSke:sp.Skeleton = null;
    // @property(sp.Skeleton) DiamondSke:sp.Skeleton = null;

    // @property(cc.Sprite) userPicSp:cc.Sprite=null;

    // @property(cc.Node) subParentNode:cc.Node=null;


    @property(cc.Node) battleBtn:cc.Node=null;
    // @property(cc.Label) roundCoin:cc.Label=null;
    @property(cc.Label) chapterPage:cc.Label=null;
    @property(cc.Sprite) chapterSprite:cc.Sprite=null;
    @property(cc.Label) historyHighScore: cc.Label = null;
    @property(cc.Node) newHighScore:cc.Node=null;
    @property(cc.Sprite) surpassSprite:cc.Sprite=null;

    @property(cc.Node) battleNode:cc.Node=null;

    @property(cc.Label) cupLabel:cc.Label=null;
    @property(cc.Label) goldLabel:cc.Label=null;
    @property(cc.Label) diamondLabel:cc.Label=null;

    @property(cc.Sprite) goldIcon:cc.Sprite = null;
    @property(cc.Sprite) trophyIcon:cc.Sprite = null;
    @property(cc.Sprite) diamondIcon:cc.Sprite = null;

    @property(cc.Label) nowgold: cc.Label = null;
    @property(cc.Node) HistoryScoreNode:cc.Node=null;
    @property(cc.Sprite) bgmusicButtonSprite:cc.Sprite=null;
    @property(cc.Sprite) musicButtonSprite:cc.Sprite=null;
    
    @property(cc.Label) debugLabel: cc.Label = null;
 

    @property (cc.Node) topeNode:cc.Node = null;
    @property (cc.Button) friendFightBtn:cc.Button=null;
    @property (cc.Button) friendFightingBtn:cc.Button=null;
    @property (cc.Sprite) hasFriendSprite:cc.Sprite=null;

    @property(cc.Node) startBattleNode: cc.Node = null;
    @property(cc.Node) bulletUpgradeNode: cc.Node = null;
    @property(cc.Node) rankNode: cc.Node = null;

    @property(cc.Label) level:cc.Label=null;
    @property(cc.Label) upLevelPercent:cc.Label=null;
    @property(cc.ProgressBar) levelBar:cc.ProgressBar=null;
    @property(cc.Button) pauseGameBtn:cc.Button = null;
    @property(cc.Button) startGameBtn:cc.Button = null;

    @property (cc.Label) treasureBoxLabel:cc.Label=null;
    @property (cc.Animation) treasureBoxAnimation:cc.Animation=null;
    @property (cc.Sprite) treasureBoxSprite:cc.Sprite=null;

    @property (cc.Node) MainButtonNode:cc.Node=null;
    @property (cc.Node) rightNode:cc.Node=null;
    @property (cc.Node) leftButtonNode:cc.Node=null;
    
    private _chapterPage:number=1;
    private _roundCoin:number = 0;
    private _resAnims:any ={};
    private _boxAnims:BoxFlyAnim = null;
    private _resAnimConst: number[] = [ResourceConst.Gold, ResourceConst.Trophy];
    private _orignPos:cc.Vec2;
    private _highScore:number = 0;
    private _surpassTex = new cc.Texture2D();
    private _surpassTimeParam: any = null;

    private _firstInBattle:boolean  = false;//第一次进入游戏战场
    private _friendFightOpen:number=0;
    private _shareData=null;
    private isInBattle:boolean = false;
    private _sch=1;
    private _treasureTime:number=0;
    private _isguideBattle:boolean  = false;//第一次进入游戏战场
    onLoad () {
        // this.node.width = cc.winSize.width;
        // this.node.height = cc.winSize.height;
        console.log('mainview size',this.node.width,this.node.height);
        console.log('battleBtn size',this.battleBtn.width,this.battleBtn.height);
        console.log('topeNode position', this.topeNode.position);
        //通知界面加载完成
        PANEL.mui = this;
        MSG.emit(MessageConst.Loading_mainui_prefab,{prefab:AssetConst.MainView});
        this._orignPos = this.node.getPosition();
        this.initUpdate();
        
        this._resAnimConst.forEach(resType => {
            this._resAnims[resType] = this.addComponent(ResFlyAnim);
            this._resAnims[resType].resType = resType;
        });

        this._boxAnims = this.addComponent(BoxFlyAnim);
        // this.RedPacSke.node.active = false;
        
        if(GAME.useRedpacket){
            if(GAME._mainViewAbTest == "c"){
                this.initAbTest();
            }
        }else{
            // this.RedNode.active = false;
        }
        this._firstInBattle  = GAME.isPlayerNewUser();
        if(this._firstInBattle){
            this.changeNewUser(true);
        }
         //this._firstInBattle = true;
        MSG.on(MessageConst.ExitBattle,this.outBattle,this);
        MSG.on(MessageConst.FinishNewGuide,this.finishNewGuide,this);
        
        this.initMusic();
        this._showDebugLabel();
        this.friendFrightSwitch();
        console.log("屏幕width",cc.winSize.width);
        console.log("屏幕height",cc.winSize.height);
    }

    
    onEnable(){
        MSG.on(MessageConst.Player_Data_Change_v1,this.onPlayerDataChange_v1,this);
        MSG.on(MessageConst.Social_Auth_Update,this.OnAuthUpdate,this);
        MSG.on(MessageConst.GUIDE_HIDE,this.onHideGuide,this);
        MSG.on(MessageConst.AddRoundCoin,this.updateRoundCoin,this);
        MSG.on(MessageConst.ShowReStart, this.showRestart, this);
        MSG.on(MessageConst.StartGame,this.startBattle,this);
        MSG.on(MessageConst.FriendFrientFromShare,this.friendFightShareClick,this);
        MSG.on(MessageConst.FriendFightingBtnSwitch,this.controlFriendFightingBtn,this);
        MSG.on(MessageConst.initBeforeBossGold,this.initBeforeBossGold,this);
        MSG.on(MessageConst.friendRedSpotShow,this.friendRedSpotShow,this);
        MSG.on(MessageConst.showUpLevel,this.showUpLevel,this);
        MSG.on(MessageConst.hidePause,this.hidePauseGameBtn,this);
        MSG.on(MessageConst.updateMainViewData,this.updateAfterAnimation,this);
        MSG.on(MessageConst.RankGuide,this.rankGuide,this);
        this.startBattleNode.on(cc.Node.EventType.TOUCH_START, this.startBattle, this);
        this.bulletUpgradeNode.on(cc.Node.EventType.TOUCH_START, this.openBulletUpgrade, this);
        this.rankNode.on(cc.Node.EventType.TOUCH_START, this.openRank, this);

        let shareData=WX_API.getShareInfoData(WXInterface.shareType_Rank);
        this._shareData=shareData;
        // var intervalTime=setInterval(
        //         ()=>{
        //             if(this.battleBtn.active==true&&(!GAME.isPlayerNewUser())){
        //                 PANEL.showSinglePopUp(AssetConst.RankView,{"isguide":true});
        //             }
        //             clearInterval(intervalTime);
        //         },500
        // );
    }

    onDisable(){
        MSG.off(MessageConst.Player_Data_Change_v1,this.onPlayerDataChange_v1,this);
        MSG.off(MessageConst.Social_Auth_Update,this.OnAuthUpdate,this);
        MSG.off(MessageConst.GUIDE_HIDE,this.onHideGuide,this);
        MSG.off(MessageConst.AddRoundCoin,this.updateRoundCoin,this);
        MSG.off(MessageConst.ShowReStart, this.showRestart, this);
        MSG.off(MessageConst.StartGame,this.startBattle,this);
        MSG.off(MessageConst.FriendFrientFromShare,this.friendFightShareClick,this);
        MSG.off(MessageConst.FriendFightingBtnSwitch,this.controlFriendFightingBtn,this);
        MSG.off(MessageConst.initBeforeBossGold,this.initBeforeBossGold,this);
        MSG.off(MessageConst.friendRedSpotShow,this.friendRedSpotShow,this);
        MSG.off(MessageConst.showUpLevel,this.showUpLevel,this);
        MSG.off(MessageConst.hidePause,this.hidePauseGameBtn,this);
        MSG.off(MessageConst.updateMainViewData,this.updateAfterAnimation,this);
        MSG.off(MessageConst.RankGuide,this.rankGuide,this);
        // MSG.off(MessageConst.FinishNewGuide,this.finishNewGuide,this);

        this.startBattleNode.off(cc.Node.EventType.TOUCH_START, this.startBattle, this);
        this.bulletUpgradeNode.off(cc.Node.EventType.TOUCH_START, this.openBulletUpgrade, this);
        this.rankNode.off(cc.Node.EventType.TOUCH_START, this.openRank, this);

        this._shareData=null;
    }

    private updateRoundCoin(data){
        this._roundCoin += Number(data.detail.num);
        // this.roundCoin.string = String(this._roundCoin);
        this.nowgold.string = this._roundCoin.toString();//"<color=#ffd803><outline color=#4f2509 width=3><b>"+String(this._roundCoin)+"</b></outline></c>";
        if(this._roundCoin > this._highScore){
            this.historyHighScore.string = String(this._roundCoin);//"<color=#ffd803><outline color=#4f2509 width=3><b>最高分: "+String(this._roundCoin)+"</b></outline></c>" ;
            this.newHighScore.active = true;
        }
    }

    private updateSurpassSprite() {
        // 分数变更时通知子域更新
        wxOpenData.wxPostMessageToSubDomain({
            action:WxDomainAction.Surpass,
            data:{key: WxOpenDataKeys.Score, currScore: this._roundCoin}
        });
        wxOpenData.updateSharedCanvas(this.surpassSprite, this._surpassTex);
    }

    private onHideGuide(data:any) {
        // let type =data.detail.type;
        // if (type == "hide") {
        //     this.subParentNode.active = false;
        // }else {
        //     this.subParentNode.active = true;
        // }
    }

    private OnAuthUpdate(evt)
    {
        // let icon =evt.detail.icon;
        // let gender = evt.detail.gender;
        // let name = evt.detail.name;
        // GAME.playerData.icon = icon;
        // GAME.playerData.gender = gender;
        // GAME.playerData.playerName = name;
        // RES.loadHeadSpriteV1(icon,this.userPicSp,gender);
    }

    private onClickAddExp()
    {
        // let pos = this.expIcon.node.parent.convertToWorldSpaceAR(this.expIcon.node.getPosition());
        // PANEL.addLoadingLayer(pos);
    }

    private onClickAddDiamond()
    {
        // PANEL.showPopUp(AssetConst.NotOpenView);
        // let pos = this.diamondIcon.node.parent.convertToWorldSpaceAR(this.diamondIcon.node.getPosition());
        // if(DEVICE.getOS() == "IOS"){
        //     PANEL.showPopUp(AssetConst.NotOpenView,{ios:1},null,pos);
        // }else{
    
        //     PANEL.showPopUp(AssetConst.MallView,{page:2},null,pos);
        // }
    }

    private onClickAddGold()
    {
        // PANEL.showPopUp(AssetConst.NotOpenView);
        // let pos = this.goldIcon.node.parent.convertToWorldSpaceAR(this.goldIcon.node.getPosition());
        // if(DEVICE.getOS() == "IOS"){
        //     PANEL.showPopUp(AssetConst.NotOpenView,{ios:1},null,pos);
        // }else{
        //     PANEL.showPopUp(AssetConst.MallView,{page:1},null,pos);
        // }
    }

    private onClickAddRedBag()
    {
        // let pos = this.redbagIcon.node.parent.convertToWorldSpaceAR(this.redbagIcon.node.getPosition());
        // if(GAME._mainViewAbTest != "a"){
        //     PANEL.showPopUp(AssetConst.NotOpenView,{money:10},null,pos);
        // }else{
        //     PANEL.showPanel(AssetConst.MyRedEnvelope,PanelManager.Type_Popup  , {redbag:GAME.playerData.redPacket},null,null,pos);
        // }
    }
    
    public getTargetPos(itemid):cc.Vec2{
        var pos:cc.Vec2;
        if (itemid === ResourceConst.Gold) {
            pos = this.goldIcon.node.convertToWorldSpaceAR(ZERO);
        } else if (itemid === ResourceConst.Trophy) {
            pos =this.trophyIcon.node.convertToWorldSpaceAR(ZERO);
        } else if (itemid === ResourceConst.Diamond) {
            pos =this.diamondIcon.node.convertToWorldSpaceAR(ZERO);
        } else{
            pos = ZERO;
        }

        return this.node.convertToNodeSpaceAR(pos);
    }
 
    private isInitUpdate:boolean = false;
    private initUpdate(){
        this.isInitUpdate =true;
        this.resDataChanged = [ResourceConst.Gold,
            ResourceConst.Exp,
            ResourceConst.RedPacket,ResourceConst.Diamond];
    }
    private onPlayerDataChange(){
        this.isInitUpdate =false;
        this.resDataChanged = [ResourceConst.Gold,
            ResourceConst.Exp,
            ResourceConst.RedPacket,ResourceConst.Diamond];
    }

    private onPlayerDataChange_v1(){
        this.goldLabel.string = String(GAME.playerData.RoleData.gold);
        this.cupLabel.string = String(GAME.playerData.RoleData.trophy);
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
    }

    start () {
        // let icon=GAME.playerData.icon;
        // if(icon!=null && icon!="")
        // {
        //     RES.loadHeadSpriteV1(icon,this.userPicSp,GAME.playerData.gender);
           
        // }
    }

    public playResflyAni(itemId: number, worldPos: cc.Vec2, value:number=0){
        let pic = GameUtil.getResIconPath(itemId);
        if (pic === "") {
            console.log("playResAni: icon not found!");
            return;
        }

        this.startResFlyAnim(itemId);
        var resAnim:ResFlyAnim = this._resAnims[itemId];
        if(resAnim){
            this.scheduleOnce(()=>{
                resAnim.doFlyAnim(pic,worldPos,itemId,value,(isEndFly)=>{
                //    var node:cc.Node;
                //    var ske:sp.Skeleton;
                //     if(itemId == ResourceConst.Gold){
                //         node = this.goldNode;
                //         ske = this.goldSke;
                //     }else if(itemId == ResourceConst.Exp){
                //         node = this.expNode;
                //         ske = this.ExpSke;
                //     }else if(itemId == ResourceConst.RedPacket){
                //         node = this.RedNode;
                //         ske = this.RedPacSke;
                //     }else if(itemId == ResourceConst.Diamond){
                //         node = this.DiamondNode;
                //         ske = this.DiamondSke;
                //     }
                //     var bounce = node.getComponent(ResBounceEffect);
                //     bounce.play();
                //     if(isEndFly){
                //         ske.node.active = true;
                //         ske.setAnimation(0,"animation",false);
                //     }
                });
            },0.2*Math.random())
        }
    }

    public playResOutAni (itemId: number, worldPos: cc.Vec2, value:number=0) {
        // let pic = GameUtil.getResIconPath(itemId);
        // if (pic === "") {
        //     Log.error("playResAni: icon not found!");
        //     return;
        // }

        // this.startResFlyAnim(itemId);
        // var resAnim:ResFlyAnim = this._resAnims[itemId];
        // if(resAnim){
        //     this.scheduleOnce(()=>{
        //         resAnim.playResOutAni(pic,worldPos,itemId,value,(isEndFly)=>{
        //            var node:cc.Node;
        //            var ske:sp.Skeleton;
        //             if(itemId == ResourceConst.Gold){
        //                 node = this.goldNode;
        //                 ske = this.goldSke;
        //             }else if(itemId == ResourceConst.Exp){
        //                 node = this.expNode;
        //                 ske = this.ExpSke;
        //             }else if(itemId == ResourceConst.RedPacket){
        //                 node = this.RedNode;
        //                 ske = this.RedPacSke;
        //             }else if(itemId == ResourceConst.Diamond){
        //                 node = this.DiamondNode;
        //                 ske = this.DiamondSke;
        //             }
        //             var bounce = node.getComponent(ResBounceEffect);
        //             bounce.play();
        //             if(isEndFly){
        //                 ske.node.active = true;
        //                 ske.setAnimation(0,"animation",false);
        //             }
        //         });
        //     },0.2*Math.random())
        // }
    
    }
    public playBoxOutAni (worldPos: cc.Vec2) {
        if (this._boxAnims == undefined) {
            return;
        }

        let pic = "ui/newui/zhuyemian/baoxiang";
        this._boxAnims.playBoxOutAni(pic,worldPos);
    }
    //动画更新中的资源类型
    public resflyAnimplaying:Array<any> = [];
    //需要更新的资源
    public resDataChanged:Array<any> =[];

    public startResFlyAnim(resId){
        if(this.resflyAnimplaying.indexOf(resId)<0){
            this.resflyAnimplaying.push(resId);
        }
    }

    public endResFlyAnim(resId){
        var index = this.resflyAnimplaying.indexOf(resId);
        if(index>=0){
            this.resflyAnimplaying.splice(index,1);
            if(this.resDataChanged.indexOf(resId)<0){
                this.resDataChanged.push(resId);
            }
        }
    }

    //延迟更新界面，如果有动画需要在动画完毕时更新
    // update (dt) {
    //     if(this.resDataChanged.length>0){
    //         for (let i = 0; i < this.resDataChanged.length; i++) {
    //             let resId = this.resDataChanged[i];
    //             if(this.resflyAnimplaying.indexOf(resId)<0){
    //                 Log.debug("mainView_refresh:",TextUtil.getGameResName(resId));
    //                 if(resId ==  ResourceConst.Gold){
    //                     this.updateGlod();
    //                 }else if(resId == ResourceConst.RedPacket){
    //                     this.updateRedPacket();
    //                 }else if(resId == ResourceConst.Exp){
    //                     this.updateExp();
    //                 }else if(resId == ResourceConst.Diamond){
    //                     this.updateDiamond();
    //                 }
    //                 //更新界面事件 
    //                 MSG.emit(MessageConst.Player_Data_RefreshUI,{resId:resId,useAnim:!this.isInitUpdate});
    //             }
    //         }
    //         // this.resDataChanged.forEach(resId => {
        
    //         // });
    //         this.resDataChanged = [];
    //     }

    // }

    
    /**
     * 点击用户头像响应
     */
    private userHeadTouchAction(){
        // BM.changeChapter();
        console.log('userHeadTouchAction');
            // SOCIAL.socialBase.CheckAuthInGame();
    }
    
    private updateDiamond(){

    }

    private initAbTest(){
        // this.RedNode.removeComponent(cc.Widget);
        // this.RedNode.setPosition(cc.p(70,610));
        // this.DiamondNode.setPositionX(-1000);
        // this.RedNode.getComponent(cc.Sprite).spriteFrame = this.goldNode.getChildByName("xp_progressbar_bg").getComponent(cc.Sprite).spriteFrame;
        // this.RedNode.setContentSize(cc.size(186,53));
        // this.redbagIcon.node.setScale(0.6);
        // this.redbagIcon.node.setPosition(cc.v2(-65,3));
        // let add = new cc.Node();
        // add.name = "plus";
        // add.setPosition(cc.v2(75.0));
        // add.addComponent(cc.Sprite);
        // this.RedNode.addChild(add);
        // let __self = this;
        // RES.getSpriteFrameByPath("ui/top/plus.png",(error: Error, resource: cc.SpriteFrame)=>{
        //     __self.RedNode.getChildByName("plus").getComponent(cc.Sprite).spriteFrame = resource;
        // })
        // this.cashValue.node.setPosition(cc.v2(0,0));
        // this.cashValue.node.removeComponent(cc.LabelOutline);
        // this.cashValue.node.color = cc.color(49,104,125);
    }



    // //点击开始战斗
    // private startBattle() {
    //     this._roundCoin = 0;
    // }
 
    private finishNewGuide(){
        console.log(this.finishNewGuide);
        PANEL.panelHolder.guideNode.active = false;
        PANEL.panelHolder.guideNode.removeAllChildren();
        PANEL.playCloudOpen(()=>{
            /*
            SCENE.changeScene(GameConst.GameFramScene,()=>{
                this.initOpenData();
              
                LEVELMG.chooseCurrentChapter(1,()=>{
                    this.battleBtn.active = false;
                    this.battleNode.active=true;
                    this.HistoryScoreNode.y=558.5;
                    GAME._isInUserGuide = false;
                    this.scheduleOnce(()=>{
                        BM.initBattle();
                        // this.schedule(this.onMonsterTick, 2.5 );
                    },0.5)
                })
            });*/

            this.initOpenData();
              BM.proloadMonster();
              this.isInBattle = true;
                LEVELMG.chooseCurrentChapter(1,()=>{
                    this.battleBtn.active = false;
                    this.battleNode.active=true;
                    //this.HistoryScoreNode.y=558.5;
                    GAME._isInUserGuide = false;
                    this.scheduleOnce(()=>{
                        BM.initBattle();
                        // this.schedule(this.onMonsterTick, 2.5 );
                    },0.5)
                })

        })
    }

    private initOpenData(){
       this._roundCoin = 0;
 
        // this.roundCoin.string = "0";

        wxOpenData.initSharedCanvas(this.surpassSprite, WxDomainAction.Surpass, WxOpenDataKeys.Score);
        this.surpassSprite.node.active = true;
        this.updateSurpassSprite();
        let __self = this;
        this._surpassTimeParam = setInterval(() => {
            __self.updateSurpassSprite() 
         }, 5000);
        this.nowgold.string = "0" //"<color=#ffd803><outline color=#4f2509 width=3><b>0</b></outline></c>";
 

        // LEVELMG.initializeLevelMg(()=>{
        //     LEVELMG.chooseCurrentChapter(1,()=>{
        //         PANEL.playCloudOpen(()=>{
        //             this.battleBtn.active = false;
        //             this.battleNode.active=true;
        //             this.HistoryScoreNode.y=558.5;
        //             // this.historyHighScore.node.y=74;
        //             // this.maxscore.node.setPosition(cc.v2(79,74));
        //             BM.initBattle();
        //         });
        //     })
        // })


    }

    private startBattle(evt: cc.Event.EventTouch) {
        this._isguideBattle=this._firstInBattle;
        PANEL.showUITouchLock();
        LEVELMG.initializeLevelMg(
            ()=>{
                //是否新手
                if (this._firstInBattle&&ABTEST.getGuideABTest()){
                    PANEL.playCloudOpen(()=>{
                        this._roundCoin = 0;
                        this.nowgold.string = "0";// "<color=#ffd803><outline color=#4f2509 width=3><b>0</b></outline></c>";
                        PANEL.closeUITouchLock();
                        this.battleBtn.active = false;
                        this.battleNode.active=true;
                        //this.HistoryScoreNode.y=558.5;
                        GAME._isInUserGuide = true;
                        //新手开始游戏打点
                        DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid:'1',abTest:GAME._abTestSwitchData["10008"]});
                        GAME._userGuideStep="1";

                        // SCENE.changeScene(GameConst.UserGuideScene,()=>{
                        //     this._firstInBattle= false;
                        //     PANEL.playCloudClose();
                        //     this.startGameMusic();

                        POOL.getPrefabFromPool(AssetConst.GuideScene,(node:cc.Node)=>{
                            if (node){
                                this._firstInBattle= false;
                                PANEL.playCloudClose();
                                this.startGameMusic();
                                PANEL.panelHolder.guideNode.addChild(node);
                                this.controlFriendFightingBtn({"detail":this._friendFightOpen});
                            }
                        });
                        
                        // SCENE.changeScene(GameConst.UserGuideScene,()=>{
                        //     this._firstInBattle= false;
                        //     PANEL.playCloudClose();
                        //     this.startGameMusic();
                        // });
                    })
                }else{
                    //新手游戏打点
                    var guideStep = GAME.playerData.RoleData.guideStep;
                    var guideStr = "";
                    if (guideStep && guideStep == 1) {
                        guideStr = "7";
                    } else if (guideStep && guideStep == 2) {
                        guideStr = "9";
                    }
                    if (guideStr != "") {
                        DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid: guideStr,abTest:GAME._abTestSwitchData["10008"]});
                        GAME._userGuideStep=guideStr;
                    }
                    
                    this.initOpenData();
                    LEVELMG.chooseCurrentChapter(1,()=>{
                        BM.proloadMonster();
                        this.isInBattle = true;
                        PANEL.playCloudOpen(()=>{
                            PANEL.closeUITouchLock();
                            BM.initBattle();
                            this.battleBtn.active = false;
                            this.battleNode.active=true;
                            this.startGameMusic();
                            this.controlFriendFightingBtn({"detail":this._friendFightOpen});
                        });
                    });
                }
            });

        cc.audioEngine.pauseAll();
        SOUND.playEverwingGameMusic();
        WX_API.bannerHide();
        WX_API.gameClubHide();
        this.scheduleOnce(function(){this.pauseGameBtn.node.active = true},0.5);
        this.startGameBtn.node.active=false;
    }

    private openRank(evt: cc.Event.EventTouch) {
        PANEL.showSinglePopUp(AssetConst.RankView,{"isguide":false});
        WX_API.gameClubHide();
    }

    private openBulletUpgrade(evt: cc.Event.EventTouch) {
        PANEL.showSinglePopUp(AssetConst.BulletUpgradeView,{"isguide":false});
        WX_API.gameClubHide();
    }

    private restartBattle()
    {
        PANEL.playCloudOpen(()=>{
            this.battleBtn.active = false;
            this.isInBattle = true;
            LEVELMG.chooseCurrentChapter(1,()=>{
                this.battleNode.active=true;
                this.HistoryScoreNode.y=558.5;
                BM.Restart();
                // BM.initBattle();
                this.startGameMusic();
                this.controlFriendFightingBtn({"detail":this._friendFightOpen});
            })
            // this.schedule(this.onMonsterTick, 2.5 );
        });
        SOUND.playEverwingGameMusic();
        WX_API.bannerHide();
        WX_API.gameClubHide();
        this.scheduleOnce(function(){this.pauseGameBtn.node.active = true},0.5);
        this.startGameBtn.node.active=false;
    }
    
    private onMonsterTick()
    {
        if(BATTLEDATA.StateGame == GameState.Finish)
        {
            this.unschedule(this.onMonsterTick);
            return;
        }
        // BM.initMonster();
    }
    public outBattle() {
        this.surpassSprite.node.active = false;
        clearInterval(this._surpassTimeParam);
        let data = GAME.playerData.RoleData;
        if (data){
            if(this._roundCoin > this._highScore){
                GAME.updatePlayerData_v1(data);
                this._highScore = this._roundCoin;
            }
        }
        this.historyHighScore.string = String(this._highScore);
        this.historyHighScore.node.active = true;
        this.newHighScore.active = false;
        this.isInBattle = false;
        this.battleBtn.active = true;
        this.battleNode.active=false;
        this.treasureInit();
        this.onPlayerDataChange_v1();
        this.unscheduleAllCallbacks();
        this.changeNewUser(false);
    }
    public onShow():void
    {
        let score = GAME.playerData.RoleData.maxScore;

        this._highScore = score;
        this.historyHighScore.string = score.toString();//"<color=#ffd803><outline color=#4f2509 width=3><b>最高分: "+score.toString()+"</b></outline></c>" ;
        this._chapterPage = 1;
        // this.chapterPage.string = String(this._chapterPage);
        if(this.battleBtn.active==false)
        {
            this.battleBtn.active=true;
            this.isInBattle = false;
        }
        this.battleNode.active=false;
        //this.HistoryScoreNode.y=484.5;
        console.log(GAME.playerData.RoleData.gold.toString());
        this.diamondLabel.string = String(0);
        this.treasureInit();
        this.onPlayerDataChange_v1();
        SOUND.playEverwingMeunMusic();
        WX_API.bannerShow();
        WX_API.gameClubShow();
        this.pauseGameBtn.node.active=false;
        this.startGameBtn.node.active=false;
    }

    private onClickLeft(){
        // if(this._chapterPage == 1){
        //     return;
        // }
        // this._chapterPage -=1;
        // // this.chapterPage.string = String(this._chapterPage);
        // RES.loadLocalSprite("ui/common1/chapter"+String(this._chapterPage),this.chapterSprite)
    }

    private onClickRight(){
        // if(this._chapterPage == 5){
        //     return;
        // }
        // this._chapterPage +=1;
        // // this.chapterPage.string = String(this._chapterPage);
        // RES.loadLocalSprite("ui/common1/chapter"+String(this._chapterPage),this.chapterSprite)
    }

    private onbgmusicButtonClick(){
        SOUND.SetBgMuiscOpen();
        if(SOUND.getBgMusicSwitch()){
            RES.loadLocalSprite("img/ui/music/yinyue",this.bgmusicButtonSprite);
        }else{
            RES.loadLocalSprite("img/ui/music/guanbiyinyue",this.bgmusicButtonSprite);
        }
    }

    private onmusicButtonClick(){
        SOUND.SetMuiscOpen();
        if(SOUND.getMusicSwitch()){
            RES.loadLocalSprite("img/ui/music/yinxiao",this.musicButtonSprite);
        }else{
            RES.loadLocalSprite("img/ui/music/guanbiyinxiao",this.musicButtonSprite);
        }
    }
    //开始游戏音乐与音效
    private startGameMusic(){
        SOUND.playEverwingGameMusic();
        SOUND.playGameIntoSound();
    }

    //初始化缓存音乐音效
    private initMusic(){
        SOUND.initData();
        if(!SOUND.getBgMusicSwitch()){
            RES.loadLocalSprite("img/ui/music/guanbiyinyue",this.bgmusicButtonSprite);
        }
        if(!SOUND.getMusicSwitch()){
            RES.loadLocalSprite("img/ui/music/guanbiyinxiao",this.musicButtonSprite);
        }
    }
    //展示再挑战一次的页面
    private showRestart(){
        // this.scheduleOnce(function() {
        //     PANEL.showSinglePopUp(AssetConst.ReStartView)
        // }, 0.2);
    }
    
    private reStartGame(){
        // this.startBattle();
        this.restartBattle();
        
    }

    /**
     * 好友助战
     */
    private friendFightClick(){
        var fight:boolean=false;

        if(this.battleBtn.active==true){
            fight=false;
        }else{
            fight=true;
        }
        var authorize=window["wxGetSetting"];
        if(authorize!=undefined){
            if(SOCIAL.socialData.authorizeState==1){
                PANEL.showSinglePopUp(AssetConst.FriendFight,{"fight":fight,"sch":1});
            }else{
                PANEL.showSinglePopUp(AssetConst.UserAuthorize,fight);
            }
            // authorize((res)=>{
            //     if(res==1){
            //         PANEL.showSinglePopUp(AssetConst.FriendFight,{"fight":fight,"sch":1});
            //     }else{
            //         PANEL.showSinglePopUp(AssetConst.UserAuthorize,fight);
            //     }
            // },()=>{
            //     console.log("获取用户信息失败");
            // });
        }else{
            PANEL.showSinglePopUp(AssetConst.FriendFight,{"fight":fight,"sch":1});
        }
        
    }

    /**
     * 好友助战被点击分享链接
     */
    private friendFightShareClick(res){
        if(res.detail&&res.detail.name){
            Toast.showToast(res.detail.name+"加入你的助战列表",1.5);
        }else{
            Toast.showToast("一位朋友加入你的助战列表",1.5);
        }
        this.friendRedSpotShow({"detail":{"redspot":true}});
    }

    /**
     * 好友助战开关
     */
    private friendFrightSwitch(){
        if(window['socialType'] == 1){
            NET.send(NetConst.FriendFight,{"method":"switch"}, (data)=>{
                console.log("switch",data);
                if(data&&data.open!=undefined&&data.open!=null&&data.open==0){
                    this._friendFightOpen=1;
                    this.friendFightBtn.node.active=true;
                    this.friendFightingBtn.node.active=true;
                    if(data.size&&data.size>0){
                        this.hasFriendSprite.node.active=true;
                    }else{
                        this.hasFriendSprite.node.active=false;
                    }
                }else{
                    this.friendFightBtn.node.active=false;
                    this.friendFightingBtn.node.active=false;
                    this.hasFriendSprite.node.active=false;
                }
            },this);
        }else{
            this._friendFightOpen=1;
            this.friendFightBtn.node.active=true;
            this.friendFightingBtn.node.active=true;
        }
        
    }

    /**
     * 好友助战
     */
    private controlFriendFightingBtn(res){
        if(res.detail!=null&&res.detail!=undefined){
            if(res.detail==1){
                this.friendFightingBtn.node.active=true;
            }else if(res.detail==0){
                this.friendFightingBtn.node.active=false;
            }else if(res.detail==2){
                if(this._friendFightOpen==1){
                    this.friendFightingBtn.node.active=true;
                }else{
                    this.friendFightingBtn.node.active=false;
                }
                
            } 
        }
    }

    /**
     * 好友助战红点
     */
    private friendRedSpotShow(e){
        if(e.detail&&e.detail.redspot==true){
            this.hasFriendSprite.node.active=true;
        }else{
            this.hasFriendSprite.node.active=false;
        }
    }

    private _showDebugLabel () {
        if (CC_DEBUG && false) {
            let _self = this;
            setTimeout(() => {
                let nodeMap: { [key: string]: number } = {};
                GameUtil.enumNode(PANEL.panelHolder.battleLayer, (node: cc.Node) => {
                    _self._calculateNodeCount(node, nodeMap);
                });

                let debugStr = "";
                let totalCount = 0;
                for (const key in nodeMap) {
                    if (nodeMap.hasOwnProperty(key)) {
                        const element = nodeMap[key];
                        debugStr += key;
                        debugStr += "-";
                        debugStr += element.toString();
                        debugStr += "\n";
                        totalCount += element;
                    }
                }
                debugStr = "battleLayer node\ntotal-" + totalCount.toString() + "\n" + debugStr;
                _self.debugLabel.string = debugStr;

                _self._showDebugLabel();
            }, 1000);
        } else {
            this.debugLabel.string = "";
        }
    }

    private _calculateNodeCount (node: cc.Node, nodeMap: {[key:string]:number}) {
        if (nodeMap[node.name] == undefined) {
            nodeMap[node.name] = 1;
        } else {
            nodeMap[node.name] += 1;
        }
    }

    //初始化当前金币
    private initBeforeBossGold(data){
        this._roundCoin = Number(data.detail.num);
        // this.roundCoin.string = String(this._roundCoin);
        this.nowgold.string = this._roundCoin.toString();//"<color=#ffd803><outline color=#4f2509 width=3><b>"+String(this._roundCoin)+"</b></outline></c>" ;
        if(this._roundCoin > this._highScore){
            this.historyHighScore.string = String(this._roundCoin);//"<color=#ffd803><outline color=#4f2509 width=3><b>最高分: "+String(this._roundCoin)+"</b></outline></c>" ;
            this.newHighScore.active = true;
        }
    }

    public update(dt){
        if(this.isInBattle==true){
            BM.update(dt);
        }
    }

    //分享
    private shareBtnClick(){
        console.log("主界面分享");
        WX_API.shareByCfg_v1(this._shareData,"",
                (shareData:any,shareId:string,shareToType:number)=>{
                    console.log('shareOpenCallback',shareData,shareId,shareToType);
                },(res, shareId, isSuccess, resEncryptedData)=>{
                    console.log('shareFinishCallback',res,shareId,isSuccess,resEncryptedData);
        },this);
    }

     //展示升级页面
    private showUpLevel(data){
        if(data.detail){
            let goldData = data.detail;
            this.scheduleOnce(function() {
                PANEL.showPopUp(AssetConst.Upgradepanel, goldData);
            }, 0.2);
            return;
        }
    }

      private pauseGame(){
        this.pauseGameBtn.node.active = false;
        this.startGameBtn.node.active = true;
        
        BM.pauseBtnStatus=true;
        let sch = cc.director.getScheduler();
        sch.setTimeScale(0);
      }

      private startGame(){
        this.pauseGameBtn.node.active = true;
        this.startGameBtn.node.active = false;

        BM.pauseBtnStatus = false;
        let sch = cc.director.getScheduler();
        if(BATTLEDATA._rushType!=RushType.Rush_None){
            sch.setTimeScale(5);
        }else{
            sch.setTimeScale(this._sch);
        }
      }

      public hidePauseGameBtn(){
          this.pauseGameBtn.node.active = false;
          this.startGameBtn.node.active = false;
      }

    //宝箱初始化
    private upPlayerInfo=null;
    private _treasureInterval=0;
    private treasureInit(){
        let nowhour=new Date().getHours();
        let nowtime=new Date().getTime();
        //if(GAME.boxInfo&&nowhour>=8&&nowhour<22&&nowtime>=Number(GAME.boxInfo.updateTime)){
        if(GAME.boxInfo&&nowtime>=Number(GAME.boxInfo.updateTime)){
            //可领取,播动画
            this.treasureBoxAnimation.node.active=true;
            this.treasureBoxSprite.node.active=false;
            this.treasureBoxAnimation.play();
            this.treasureBoxLabel.string="可领取";
        }else{
            //开始倒计时，停止动画
            this.treasureBoxAnimation.node.active=false;
            this.treasureBoxSprite.node.active=true;
            let nowTime=new Date().getTime();
            if(nowTime<Number(GAME.boxInfo.updateTime)){
                this._treasureTime=(Number(GAME.boxInfo.updateTime)-nowTime)/1000;
                this.treasureCountDown();
                
                this._treasureInterval= setInterval(() => {
                    this._treasureTime--;
                    this.treasureCountDown();
                 }, 1000);
            }else{
                this.treasureBoxLabel.string="";
            }

        }
        
    }

    //宝箱点击事件
    
    private treasureOnClick(){
        let nowhour=new Date().getHours();
        let nowtime=new Date().getTime();
        //if(nowhour>=8&&nowhour<22&&nowtime>=Number(GAME.boxInfo.updateTime)){
        if(nowtime>=Number(GAME.boxInfo.updateTime)){
            //可领取,开始倒计时
            this.treasureBoxAnimation.node.active=false;
            this.treasureBoxSprite.node.active=true;
            let nowTime=new Date().getTime();
            let updateTime=nowTime+4*60*60*1000;
            this._treasureTime=(updateTime-nowTime)/1000;
            GAME.boxInfo.updateTime=updateTime;
            var __self;
            this._treasureInterval= setInterval(() => {
                this._treasureTime--;
                this.treasureCountDown();
             }, 1000);
            //随机出金币、奖杯，调领取界面，飞动画
            var rewards= REWAED.getReward();
            if(rewards&&rewards.length>0){
                PANEL.showSinglePopUp(AssetConst.BoxReward,rewards);
                //把数据发送给后台
                NET.send(NetConst.GetTreasureBox,{"gold":rewards[0]["num"],"trophy":rewards[1]["num"],"updateTime":updateTime},(data)=>{
                    console.log("treasureOnClick",data);
                    if(data["boxInfo"]){
                        GAME.boxInfo=data["boxInfo"];
                    }
                    if(data["playerInfo"]){
                        //这个应该在飞金币之后更新
                        this.upPlayerInfo=data["playerInfo"];
                    }
                },this);
            }
        }else{
            //不可领取
            Toast.showToast("还不能领取呦",1.5);
        }
        
    }

    //倒计时
    private treasureCountDown(){
        if(this.isInBattle){
            return;
        }
        if(this._treasureTime>0){
            var levelTime=GameUtil.secondToHMS(this._treasureTime);
            this.treasureBoxLabel.string=levelTime;
        }else{
            clearInterval(this._treasureInterval);
            this.treasureBoxAnimation.node.active=true;
            this.treasureBoxSprite.node.active=false;
            this.treasureBoxAnimation.play();
            this.treasureBoxLabel.string="可领取";
        }
    }

    //动画完成更新用户数据
    private updateAfterAnimation(){
        if(this.upPlayerInfo){
            this.scheduleOnce(()=>{
                GAME.updatePlayerData_v1(this.upPlayerInfo);
                this.upPlayerInfo=null;
            },0.5);
            
        }
    }


    private rankGuide(){
        console.log("guide",GAME.isPlayerNewUser());
        if(this._isguideBattle){
            PANEL.showSinglePopUp(AssetConst.RankView,{"isguide":true});
        }
    }

    //客服
    private onCustomerServiceClick(){
        WX_API.openWXCustomerServiceConvers('fromGame',false,undefined,undefined,undefined,function(sucessRes){
        },function(failRes){
        })
    }

    //展示、切换新手主页面，只有开始游戏
    private changeNewUser(isnew:boolean){
        if(isnew){
            this.MainButtonNode.active=false;
            this.leftButtonNode.active=false;
            this.rightNode.active=false;
        }else{
            this.MainButtonNode.active=true;
            this.leftButtonNode.active=true;
            this.rightNode.active=true;
        }
    }
}
