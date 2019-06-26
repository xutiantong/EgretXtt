import {MSG} from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import {POOL} from "../manager/PoolManager";
import NumberUtil from "../utils/NumberUtil";
import WaringItem from "../modules/battle/WaringItem";
import MainRole from "../modules/battle/MainRole";


import {AssetConst, ConfigConst, DropItemType} from "../GameConst";
import MonsterNormal from "../modules/battle/Monster/MonsterNormal";
import MonsterNormalBlink from "../modules/battle/Monster/MonsterNormalBlink";
import {RES} from "../manager/ResourceManager";
import {CFG} from "../manager/ConfigManager";
import DottingUtil, {BIActionConst} from "../utils/DottingUtil";
import PrefabBase from "../component/PrefabBase";
import {ROCKET} from "../modules/rocket/RocketManager";

import BgManager from "../modules/bg/BgManager";

import DropItem from "../modules/drop/DropItem";
import { GAME } from "../model/GameData";


const {ccclass, property} = cc._decorator;

@ccclass

export default class UserGuideScene extends PrefabBase {

    @property(cc.Node) bgLayer:cc.Node=null;
    @property(cc.Node) battleLayer:cc.Node=null;
    @property(cc.Node) bgNode1:cc.Node=null;
    @property(cc.Node) bgNode2:cc.Node=null;
    @property(cc.Label) tipLabel:cc.Label=null;
    @property(cc.Sprite) timeSprite:cc.Sprite=null;

    private startP:cc.Vec2=cc.v2(0, BgManager.deFaultHeight);
    private endP:cc.Vec2=cc.v2(0,-BgManager.deFaultHeight);
    private bgDur:number=60;
    private moveNode:cc.Node=null;

    private _mainRoleNode:cc.Node = null;

    private currentGuideStep:GuideStep = GuideStep.guideNone;
    private StepFourthPosition:cc.Vec2=null;
    private StepRushState:number=0;

    //金币掉落
    private goldDrop: number = 101;

    onLoad () {
        this.initScene();
        this.initPalyer();
        ROCKET.init(this.battleLayer, this._mainRoleNode);
    }

    start () {
        this.registerEvent();
       
    }
    onEnable(){
        this.doNextGuide();
    }
    public endGuide(){
        console.log('endGuide');
        this.unRegisterEvent();
        this.node.destroy();
        MSG.emit(MessageConst.FinishNewGuide);
    }

    onDestroy(){
        console.log('onDestroyGuide');
    }
    private doNextGuide(){
        if (this.currentGuideStep == GuideStep.guideNone){
            //新手左滑动
            DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid:'2',abTest:GAME._abTestSwitchData["10008"]});
            GAME._userGuideStep="2";
            //开始左滑
            this.doStepFirst();
        }else if (this.currentGuideStep == GuideStep.guideMoveLeft){
            //新手开始右滑打点
            DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid:'3',abTest:GAME._abTestSwitchData["10008"]});
            GAME._userGuideStep="3";
            //开始右滑
            this.doStepSecond();
        }else if (this.currentGuideStep == GuideStep.guideMoveRight){
            //新手开始躲闪打点
            DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid:'4',abTest:GAME._abTestSwitchData["10008"]});
            GAME._userGuideStep="4";
            //开始躲闪
            this.doStepThird();
        }else if (this.currentGuideStep == GuideStep.guideSuperBullet){
            //新手开始加速打点
            DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid:'5',abTest:GAME._abTestSwitchData["10008"]});
            GAME._userGuideStep="5";
            //开始加速
            this.doStepFourth();
        }else if (this.currentGuideStep == GuideStep.guideUseSprintProps){
            this.endGuide();
            // 完成引导
        }
    }

    // update (dt) {}

    //初始化
    private initScene(){
        //初始化背景
        this.bgNode1.setPosition(cc.v2(0,0));
        let seq1 = cc.sequence( cc.moveTo(this.bgDur/2, this.endP), cc.moveTo(0, this.startP), cc.moveTo(this.bgDur/2, cc.v2(0,0)));
        this.bgNode1.runAction( cc.repeatForever( seq1 ) );

        this.bgNode2.setPosition(this.startP);
        let seq2 = cc.sequence( cc.moveTo(this.bgDur, this.endP), cc.moveTo(0, this.startP));
        this.bgNode2.runAction( cc.repeatForever( seq2 ) );
    }

    public registerEvent()
    {
        MSG.on(MessageConst.KillMonster,this.onKillMonster,this);
        MSG.on(MessageConst.CreateSuperBullet, this.createEnemySuperBullet, this);
        MSG.on('superBulletPass',this.superBulletPassAction,this);
        MSG.on('playerRopeCrash',this.superBulletCollideAction,this);
    }
    public unRegisterEvent()
    {
        MSG.off(MessageConst.CreateSuperBullet, this.createEnemySuperBullet, this);
        MSG.off('superBulletPass',this.superBulletPassAction,this);
        MSG.off('playerRopeCrash',this.superBulletCollideAction,this);
    }

    private initPalyer() {
        POOL.getPrefabFromPool(AssetConst.MainRole,(node:cc.Node)=>{
            
            this._mainRoleNode = node;
            let tempRole:MainRole = this._mainRoleNode.getComponent(MainRole);
            tempRole.playerNode.active = true;
            tempRole.rushNode.active = false;
            this._mainRoleNode.parent = this.battleLayer;
            this._mainRoleNode.setPosition( cc.v2(0, -430) );
            // this.triggerRush();
        });
      
    }

    private onKillMonster(ext){
        if(this.moveNode&&this.moveNode!=null){
            this.moveNode.destroy();
        }
        if(this.currentGuideStep !=GuideStep.guideUseSprintProps){
            this.dropGold();
            this.scheduleOnce(()=>{
                this.doNextGuide();
            },2);
        }else{
            this.StepFourth();
        }
    }

    private dropGold() {
        POOL.getPrefabFromPool(AssetConst.DropItem + "/drop" + DropItemType.Gold, (node: cc.Node) => {
            node.parent = this.battleLayer;
            let startPos: cc.Vec2 = null;
            let posx = 0;
            if (this.currentGuideStep == GuideStep.guideMoveLeft) {
                posx = -250;
            } else if (this.currentGuideStep == GuideStep.guideMoveRight) {
                posx = 250;
            }
            startPos = cc.v2(posx, this.node.height / 4);

            node.position = startPos;
            node.getComponent(DropItem).reset(DropItemType.Gold,startPos,false,false);
            // let targetPos = new cc.Vec2(startPos.x + Math.random() * 100 - 50, -cc.winSize.height / 2 - 100);
            // let centerPos = cc.v2(startPos.x + (targetPos.x - startPos.x) * 0.4, targetPos.y + (startPos.y - targetPos.y) * 1.5);
            // let time = 2.5 * (startPos.y - targetPos.y) / 1600;
            // let bezierTo = cc.bezierTo(time, [startPos, centerPos, targetPos])
            // let action = cc.sequence(bezierTo, cc.callFunc(() => {
            //     if (node.activeInHierarchy) {
            //         POOL.putPrefabToPool(node)
            //     }
            // }));
            //action.setTag(1);
            //node.runAction(action);
        });
    }
    //躲过导弹
    private superBulletPassAction(ext){
        console.log('superBulletPassAction');
        this.currentGuideStep = GuideStep.guideSuperBullet;
        this.scheduleOnce(()=>{
            this.doNextGuide();
        },1);
    }
    //角色被撞
    private superBulletCollideAction(){
        if (this.currentGuideStep= GuideStep.guideSuperBullet){
            //撞到火箭
            this.currentGuideStep = GuideStep.guideMoveRight;
            this.scheduleOnce(()=>{
                let tempRole:MainRole = this._mainRoleNode.getComponent(MainRole);
                tempRole.playerNode.active = true;
                this.doNextGuide();
            },2);
        }else{

        }
    }


    private addMonstOnWorldPoint(point:cc.Vec2){
        let prefabName = AssetConst.MonsterItem;
        let monstInfo = CFG.getCfgDataById(ConfigConst.BOSS,'101');
        POOL.getPrefabFromPool(prefabName,(node:cc.Node)=>{
            node.parent = this.battleLayer;
            let sceneHeight =  this.node.height ;
            let monstNode:MonsterNormal = node.getComponent(MonsterNormal);
            monstNode.updateMonstInfo(monstInfo);
            // let posx = -250;
            // let posY = sceneHeight /4;
            // let sp = cc.v2(posx, posY);
            node.setPosition( point );
        });
    }

    private doStepFirst(){
        console.log('doStepFirst');
        this.guideMove(AssetConst.GuideLeft);
        let posx = -250;
        let sceneHeight =  this.node.height ;
        let posY = sceneHeight /4;
        let sp = cc.v2(posx, posY);
        this.addMonstOnWorldPoint(sp);

        this.currentGuideStep = GuideStep.guideMoveLeft;
    }

    private doStepSecond(){
        console.log('doStepSecond');
        this.guideMove(AssetConst.GuideRight);
        let sceneHeight =  this.node.height ;
        let posx = 250;
        let posY = sceneHeight /4;
        let sp = cc.v2(posx, posY);
        this.addMonstOnWorldPoint(sp);

        this.currentGuideStep = GuideStep.guideMoveRight;
    }
 
    private doStepThird(){
        this.tipLabel.string="糟糕，导弹来袭！快躲避一下吧。";
        this.timeSprite.node.active=true;
        var timeCount:number=3;
        let _self=this;
        this.schedule(()=>{
            if(timeCount!=0){
                RES.loadLocalSprite("img/ui/newshuzi/"+timeCount,this.timeSprite,1,()=>{
                    _self.tipLabel.node.active=true;
                });
                timeCount--;
            }else{
                this.tipLabel.node.active=false;
                this.timeSprite.node.active=false;
                this.timeSprite.spriteFrame=null;
            }

        }, 1, 3);
        this._mainRoleNode.setPosition( cc.v2(0, -430) );
        this.initSuperVec();
        this.startCreateWaring();
        this.currentGuideStep = GuideStep.guideSuperBullet;
    }


     //火箭预警
     private startCreateWaring() {
        let dt =0.7 + Math.random();
        // this.scheduleOnce( this.startCreateWaring.bind(this), dt );
        this.createWaringItem();
    }

    private _totalW:number = 750;
    private _cellW:number = 150;
    private _superVec:number[] = [];
    private initSuperVec() {
        let num = NumberUtil.toInt(this._totalW / this._cellW);
        for (let i=0; i<num; i++) {
            this._superVec.push(0);
        }
    }

    public createWaringItem() {
        let tmpX = 0;
        let idx = 0;
        if (this._mainRoleNode) {
            let wpt = this._mainRoleNode.parent.convertToWorldSpaceAR( this._mainRoleNode.getPosition() );
            idx = NumberUtil.toInt(wpt.x / this._cellW);
            let minDis = this._superVec.length * 2;
            let findIdx = -1;
            if (idx < this._superVec.length) {
    
                if (this._superVec[idx] == 1) {
                    if (idx-1 >= 0 && this._superVec[idx-1] == 0) {
                        findIdx = idx - 1;
                    }else if (idx+1 < this._superVec.length && this._superVec[idx+1] == 0) {
                        findIdx = idx + 1;
                    }
                }else {
                    findIdx = idx;
                }

                if (findIdx != -1) {
                    wpt.x += (findIdx - idx)*this._cellW;
                    idx = findIdx;
                    this._superVec[idx] = 1;
                } else {
                    return;
                }
                wpt.x = Math.min( wpt.x, this._totalW-50 );
                wpt.x = Math.max( wpt.x, 50);
            }
            
            tmpX = this.battleLayer.convertToNodeSpaceAR(wpt).x;
        }
        // let totoalWidth = cc.winSize.width - 200;
        // let posX:number = NumberUtil.toInt(Math.random() * totoalWidth) - totoalWidth/2;
        
        let posX:number = tmpX;
        POOL.getPrefabFromPool(AssetConst.WaringItem,(node:cc.Node)=>{
            node.setPosition( cc.v2(posX, cc.winSize.height/2 - 200) );
            node.parent = this.battleLayer;
            let waringItem:WaringItem = node.getComponent(WaringItem);
            waringItem.reset(0);
        });

    }

    public createEnemySuperBullet(e) {

        let wptx = e.detail.wpt.x;
        let idx = e.detail.idx;
        if (idx < this._superVec.length) {
            this._superVec[idx] = 0;
        }
        POOL.getPrefabFromPool(AssetConst.EnemySuperBullet,(node:cc.Node)=>{
            node.setPosition( cc.v2(wptx, cc.winSize.height/2 + 100) );
            if (this.battleLayer == undefined) {
                return;
            }
            node.parent = this.battleLayer;
        });
    }

    private doStepFourth(){
        console.log('doStepFourth');
        this.tipLabel.string="攻击小怪兽，收集掉落道具试试！";
        this.tipLabel.node.active=true;
        let sceneHeight =  this.node.height ;
            let posx = 0;
            let posY = sceneHeight /3;
            let sp = cc.v2(posx, posY);
        this.addMonstOnWorldPoint(sp);
        this.currentGuideStep = GuideStep.guideUseSprintProps;
    }

    //第四步打死怪后，进行加速
    private StepFourth(){
        this.scheduleOnce(()=>{
            this.tipLabel.node.active=false;
        },2);
        this.dropGold();
        POOL.getPrefabFromPool(AssetConst.DropItem+"/drop1003",(node:cc.Node)=>{
            node.parent = this.battleLayer;
            let startPos: cc.Vec2=null;
            if(this.StepFourthPosition!=null){
                startPos= this.StepFourthPosition;
            }else{
                startPos=cc.v2(0,this.node.height/4);
            }
            
            node.position = startPos;
            node.getComponent(DropItem).reset(DropItemType.RushAddSpeed,startPos,false,false);
            // let targetPos = new cc.Vec2(startPos.x + Math.random()*100 - 50,-cc.winSize.height/2-100);
            // let centerPos = cc.v2(startPos.x + (targetPos.x - startPos.x) * 0.4, targetPos.y + (startPos.y - targetPos.y) * 1.5);
            // let time = 2.5*(startPos.y-targetPos.y)/1600;
            // let bezierTo = cc.bezierTo(time, [startPos, centerPos, targetPos])
            // let action =cc.sequence(bezierTo,cc.callFunc(()=>{
            //     if(node.activeInHierarchy)
            //     {
            //         POOL.putPrefabToPool(node)
            //     }}));
            // action.setTag(1);
            // node.runAction(action);
            MSG.once(MessageConst.RushAddSpeed, this.stepFourthRushMonstor, this);
            this.scheduleOnce(()=>{
                if(this.StepRushState==0){
                    this.doNextGuide();
                }
            },5);
        });
    }

    //冲刺时怪物加载
    private stepFourthRushMonstor(){
        let monstInfo = CFG.getCfgDataById(ConfigConst.BOSS,'101');
        this.StepRushState=1;
        let sch = cc.director.getScheduler();
        this.scheduleOnce(()=>{
            MSG.emit( MessageConst.RushAddSpeed, {type:0} );
            sch.setTimeScale(1.0);
            this.doNextGuide();
        }, 15);
        sch.setTimeScale(5.0);
        this.schedule(()=>{
            for (let i=0; i<5; i++) {
                let itemMonster:boolean = Math.random()*20 <=1?true:false;
                let prefabName = AssetConst.MonsterItem;
                if(itemMonster){
                    prefabName = AssetConst.MonsterItemBlink;
                }
                POOL.getPrefabFromPool(prefabName,(node:cc.Node)=>{
                    if(node==null)
                    {
                        console.error("对象池中的prefab为空:" + prefabName);
                        return;
                    }
                    node.parent = this.battleLayer;
                    let posx = 0;
                    if (i == 1) {
                        posx = -150;
                    }else if (i == 2) {
                        posx = 150;
                    }else if (i == 3) {
                        posx = -300;
                    }else if (i == 4) {
                        posx = 300;
                    }
                    let sp = cc.v2(posx, 1000);
                    node.setPosition( sp );
                    if(itemMonster){
                        let com:MonsterNormalBlink = node.getComponent(MonsterNormalBlink);
                        com.setData(1, 1, this.goldDrop);
                        com.updateMonstInfo(monstInfo);
                        com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                    }
                    else{
                        let com:MonsterNormal = node.getComponent(MonsterNormal);
                        com.setData(1, 1, this.goldDrop);
                        com.updateMonstInfo(monstInfo);
                        com.onlaunch( sp.add( cc.v2(0,-2000) ) );
                    }
                  
                });
            }
        },1,3);
        
    }
 
    //左移右移加载
    private guideMove(movePrefab){
        POOL.getPrefabFromPool(movePrefab,(node:cc.Node)=>{
            node.parent=this.battleLayer;
            this.moveNode=node;
        });
    }

}

export enum GuideStep {
    guideNone = 0,
    guideMoveLeft = 1,
    guideMoveRight= 2,
    guideSuperBullet = 3,//火箭
    guideUseSprintProps = 4,
}