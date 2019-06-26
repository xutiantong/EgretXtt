import PanelBase from "../../component/PanelBase";
import MList from "../../component/MList";
import ButtonEffect from "../../component/effect/ButtonEffect";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst, ResourceConst, ZERO } from "../../GameConst";
import ConfigUtil from "../../utils/ConfigUtil";
import NumUtil from "../../utils/NumberUtil";
import StringUtil from "../../utils/StringUtil";
import { NET } from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import { GAME } from "../../model/GameData";
import { PANEL } from "../../manager/PanelManager";
import { HttpManager } from "../../net/core/HttpManager";
import GameUtil from "../../utils/GameUtil";
import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
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
export default class EveryDayPanel extends PanelBase {

    @property(cc.Button) close_button: cc.Button = null;
    @property(cc.Label) titleText: cc.Label = null;
    @property(cc.Label) desText: cc.Label = null;
    @property(cc.Button) get_button: cc.Button = null;
    @property(cc.Label) btn_text: cc.Label = null;

    private _list: MList = null;

    private dayIndex = 0;
    private rewardId = 1;
    private hasGet = false;
    panelShowOrder = -1;

    // LIFE-CYCLE CALLBACKS:
    public onInit(param?:any){
        super.onInit();
        console.log('EveryDayPanel:param')
        console.log(param)
        if (param){
            this.dayIndex = param.index;
            this.rewardId = param.rewardId;
            this.hasGet = param.hasGet;
        }
 
    }

    onLoad () {
        super.onLoad();

        this.close_button.addComponent(ButtonEffect);
        

        this._list = this.node.getComponent(MList);
        this._list.touchEnabled = false;
        this.get_button.enableAutoGrayEffect = true;
        this.titleText.string =  "每日登陆"//CFG.getText("login_reward_ui_1");
        this.desText.string =  "每天都要来看看哦~" //CFG.getText("login_reward_ui_4");
       
        // this.btn_text.node.
  
    }

    start () {
        super.start();
        // if(!GLOBAL.activeLogin)
        // {
        //     Log.debug("登录活动数据为:"+GLOBAL.activeLogin);
        //     return;
        // }
        // if(GLOBAL.isAuditsSever())
        // {
        //     this.btn_text.string =  CFG.getText(GLOBAL.activeLogin.hasGet?"login_reward_ui_6":"login_reward_ui_7");
        // }else
        // {
        //     this.btn_text.string = CFG.getText(GLOBAL.activeLogin.hasGet?"login_reward_ui_6":"login_reward_ui_5");
        // }
        
        // if(!GLOBAL.activeLogin.hasGet)
        // {
        //     this.get_button.addComponent(ButtonEffect);
        // }
        this.get_button.interactable = !this.hasGet;
        if(!this.hasGet){
            this.btn_text.node.getComponent(cc.LabelOutline).color  =  cc.color(15,160,148);
        }else{
            this.btn_text.node.getComponent(cc.LabelOutline).color  =  cc.color(145,145,145);
        }

        this.updataRewardData();
        this.panelShowOrder = -1;
    }

    private updataRewardData(){
        let cfg = CFG.getCfgDataById(ConfigConst.LOGINREWARD,String( this.rewardId));
        let index = this.dayIndex;
        let rewardstr:string = cfg["prize"];
        let rewards = rewardstr.split(";");
        if(rewards instanceof Array)
        {
            let len = rewards.length;
            let arr = [];
            for (let i = 0; i < len; i++) {
               
                let rCfg =  ConfigUtil.getPrizeInfo(NumUtil.toInt(rewards[i]));
                // console.log( rCfg)
                let name = rCfg.name ; //CFG.getText(rCfg.name);
                name +="X" + String(rCfg.num);
                // if(rCfg.id!=undefined)
                // {
                //     name +="X" + String(rCfg.num); //StringUtil.formatReadableNumber(rCfg.num);
                    
                // }
                let hasGet = (i<index||(i==index && this.hasGet));
                arr.push({receiveed:hasGet,isRandom:rCfg["random_num"]>1,name:name,icon:rCfg.icon,title:"第"+(i+1)+"天"});
            }
            console.log('everyday loginReward')
            console.log(arr)
            this._list.setData(arr);
        }
    }
    // update (dt) {}

    onEnable() {
        this.get_button.node.on(cc.Node.EventType.TOUCH_END, this.onBtnGetClick, this);
        this.close_button.node.on(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);
    }

    onDisable() {
        this.get_button.node.off(cc.Node.EventType.TOUCH_END, this.onBtnGetClick, this);
        this.close_button.node.off(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);

        MSG.emit( MessageConst.LOGIN_POP_VIEW );
    }

    private onBtnCloseClick(evt) {
        this.closePanel();
    }

    private onBtnGetClick(evt){
        console.log(evt)
        // console.log(this._data)
        let cfg = CFG.getCfgDataById(ConfigConst.LOGINREWARD,String( this.rewardId));
        let index = this.dayIndex;
        let rewardstr:string = cfg["prize"];
        let rewards = rewardstr.split(";");
        var prizeId = rewards[Number(index)];
        console.log(prizeId);
        this.get_button.interactable = false;
    
        this.hasGet  = true;
        GAME.activeLoginData.hasGet = true;
        this.updataRewardData();
        this.btn_text.node.getComponent(cc.LabelOutline).color  =  cc.color(145,145,145);
        
        // //更新数据
        // var tempGold:number = Number(4000);
        // this.closePanel()
        // GAME.updatePlayerData({gold:tempGold});
        // PANEL.mui.playResflyAni(ResourceConst.Gold, cc.p(cc.winSize.width/2,cc.winSize.height/2).add(cc.v2(40, 20)));
        // return ;

        NET.send(NetConst.LoginReward,null,(data)=>{  
            GAME.activeLoginData.hasGet = true;
            this.hasGet  = true;
            console.log(data)
            var tempGold:number = Number(data.gold);
        
            this.closePanel()
            GAME.updatePlayerData({gold:tempGold});
            PANEL.mui.playResflyAni(ResourceConst.Gold, cc.p(cc.winSize.width/2,cc.winSize.height/2).add(cc.v2(40, 20)));
            // var rewardArray: Array<any> = data.reward;
            // for(let i=0; i<rewardArray.length; i++)
            // {
            //     let rewardData = CFG.getCfgDataById(ConfigConst.RESOURCE, rewardArray[i].itemId);
            //     PanelLoader.loader(AssetConst.GetOneRewardPanel, {name: rewardData.remark, num: rewardArray[i].num, icon: rewardData.icon}, true, false);
            //     Game.getGameLogic(BarnLogic).upResNum(rewardArray[i].itemId, rewardArray[i].num);
            // }
        },this);



    }
    
    private shareCompleteCb(){
        // if(!GLOBAL.activeLogin.hasGet)
        // {
            // NET.send(NetConst.LoginReward,null,(data)=>{  
            //     GLOBAL.activeLogin.hasGet = true;
            //     Game.eventCenter.emit("everyDayRedDot");
            //     this.closeUI();
            //     GameUtil.getDataReward(data);
            //     // var rewardArray: Array<any> = data.reward;
            //     // for(let i=0; i<rewardArray.length; i++)
            //     // {
            //     //     let rewardData = CFG.getCfgDataById(ConfigConst.RESOURCE, rewardArray[i].itemId);
            //     //     PanelLoader.loader(AssetConst.GetOneRewardPanel, {name: rewardData.remark, num: rewardArray[i].num, icon: rewardData.icon}, true, false);
            //     //     Game.getGameLogic(BarnLogic).upResNum(rewardArray[i].itemId, rewardArray[i].num);
            //     // }
            // },this);
        // }
    }
}
