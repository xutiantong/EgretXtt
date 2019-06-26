import PanelBase from "../../component/PanelBase";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import SeedData from "../../model/SeedData";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import { GAME } from "../../model/GameData";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst, AssetConst } from "../../GameConst";
import { ABTEST } from "../../manager/AbTestSwitchMg";
import PanelManager, { PANEL } from "../../manager/PanelManager";

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
/**
 * 主界面 入口按钮
 */
@ccclass
export default class EntryBtnView extends PanelBase {
    public isModal = false;
    @property(cc.Node)
    BtnEntrySevenLogin:cc.Node=null;
    @property(cc.Node) btnGMRessetAccount :cc.Node = null;

    @property(cc.Node) btnGdpSdk :cc.Node = null;

    @property(cc.Node) subParentNode:cc.Node=null;

    @property(cc.Node) groupNode:cc.Node=null;

    @property (cc.Node) btnOpenSeedViewNode:cc.Node = null;

    @property (cc.Node) btnLotteryNode:cc.Node = null;

    @property (cc.Node) btnBoxNode:cc.Node = null;

    private _orignPos:cc.Vec2;

    public start()
    {
        this.CheckSevenOpen();
        this.CheckGdpOpen();
        this.checkLottery();
        // this.checkSeedViewShowStatus();

        this.scheduleOnce( this.delayExet.bind(this), 1 );
    }

    private delayExet() {
        if (GAME.activeLoginData && false == GAME.activeLoginData.hasGet){
            // PANEL.showPanel(AssetConst.EveryDayPanel,PanelManager.Type_Popup ,GAME.activeLoginData);
        } else {
            this.loginPop();
        }
    }
    // update (dt) {}
    public onLoad()
    {
        //通知界面加载完成
        this._orignPos = this.node.getPosition();
        if(GAME._mainViewAbTest == "c"){
            this.groupNode.getComponent(cc.Layout).paddingTop = 135;
        }
        
        MSG.emit(MessageConst.Loading_mainui_prefab,{prefab:AssetConst.EntryBtnView});

        MSG.on(MessageConst.Player_Data_Change,this.onPlayerDataChange,this);
        MSG.on(MessageConst.Friend_Boost_Refresh,this.onFriendBoostRefresh,this);
        MSG.on(MessageConst.GUIDE_HIDE,this.onHideGuide,this);

        MSG.on(MessageConst.CLOSE_USER_UPGRADE_VIEW,this.userUpgrade,this);
        MSG.on(MessageConst.LOGIN_POP_VIEW,this.loginPop,this);
        
    }
    public onDestroy()
    {
        MSG.off(MessageConst.Player_Data_Change,this.onPlayerDataChange,this);
        MSG.off(MessageConst.Friend_Boost_Refresh,this.onFriendBoostRefresh,this);
        MSG.off(MessageConst.GUIDE_HIDE,this.onHideGuide,this);

        MSG.off(MessageConst.CLOSE_USER_UPGRADE_VIEW,this.userUpgrade,this);
        MSG.off(MessageConst.LOGIN_POP_VIEW,this.loginPop,this);
    }

    private onHideGuide(data:any) {
        let type =data.detail.type;
        if (type == "hide") {
            this.subParentNode.active = false;
        }else {
            this.subParentNode.active = true;
        }
    }

    private onPlayerDataChange()
    {
        this.CheckSevenOpen();
        this.checkGM()
    }
    private CheckSevenOpen()
    {
        if (GAME.activeLoginData ){
            var cfg = CFG.getCfgDataById(ConfigConst.CONSTANT,"daily_sharing");
            let level =7;
            if(cfg)
            {
                if(cfg.parm1)
                {
                    level = cfg.parm1;
                }
            }
            if(this.BtnEntrySevenLogin.isValid)
            {
                if(GAME.playerData && GAME.playerData.level)
                {
                    this.BtnEntrySevenLogin.active = GAME.playerData.level>=level;
                }
            }
        }

    }
    /**
     * 检查Gdp开关状态
     */
    private CheckGdpOpen()
    {
        if(this.btnGdpSdk)
        {
            this.btnGdpSdk.active = true;
        }

       
    }
    /**
     * 检查种子面板是否显示
     */
    private checkSeedViewShowStatus(){
      
            this.btnOpenSeedViewNode.active = false;
      
    }

    private onFriendBoostRefresh(data)
    {
        
    }

    private checkGM(){
        console.log('checkGM')
        if(GAME.playerData && GAME.playerData.GM)
        {
             this.btnGMRessetAccount.active = GAME.playerData.GM >0
        }
    }

    private checkLottery() {
        if ( this.btnLotteryNode.active == false ) {
            let cfgData = CFG.getCfgDataById(ConfigConst.ROULETTE, "1");
            if (cfgData && cfgData.on_off=="1" ) {
                let lv = cfgData.on_level;
                if (GAME.playerData.level >= lv) {
                    this.btnLotteryNode.active = true;
                }
            }
        }
    }

    private userUpgrade() {
        if (this.btnLotteryNode.active == false) {
            this.checkLottery();
            if ( this.btnLotteryNode.active ) {
                // PANEL.showPanel(AssetConst.LotteryTableView);
            }
        }

    }

    private loginPop() {
        //判定首弹 转盘抽奖 面板
        if (GAME.rouletteFirstLogin) {
            this.checkLottery();
            if ( this.btnLotteryNode.active ) {
                // PANEL.showPanel(AssetConst.LotteryTableView);
                return;
            }
        }

    }

}
