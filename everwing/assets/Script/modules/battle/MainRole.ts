import CollideItem from "./CollideItem";
import {POOL} from "../../manager/PoolManager";
import {AssetConst, ConfigConst} from "../../GameConst";
import MonsterBase from "./Monster/MonsterBase";
import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import EnemySuperBullet from "./EnemySuperBullet";
import EnemyBulletItem from "./EnemyBulletItem";
import IActor from "./Actor/IActor";
import ActorBuff from "./Actor/ActorBuff";
import ActorAttr from "./Actor/ActorAttr";
import BuffManager from "./BuffSystem/BuffManager";
import DottingUtil, {BIActionConst} from "../../utils/DottingUtil";
import {PANEL} from "../../manager/PanelManager";
import {CFG} from "../../manager/ConfigManager";
import {GAME} from "../../model/GameData";
import {BM} from "./BattleManager";
import {RES} from "../../manager/ResourceManager";
import {SOUND} from "../../manager/SoundManager";
import FriendPlane from "../Friend/FriendPlane";
import {BATTLEDATA} from "../../model/BattleData";
import NewBulletItem from "./NewBulletItem";
import {ShakeUtils} from "../../utils/ShakeUtils";
import frameClipDisplay from "../../component/frameClipDisplay";
import BoxCollider = cc.BoxCollider;


const {ccclass, property} = cc._decorator;


@ccclass
export default class MainRole extends CollideItem implements IActor{
    Init() {
    }

    @property(ActorBuff)
    public ActorBuff: ActorBuff=null;
    @property(ActorAttr)
    public ActorAttr:ActorAttr=null;
    public buffManager:BuffManager;
    @property(cc.Node) playerNode:cc.Node = null;
    @property(cc.Node) rushNode:cc.Node = null;
    @property(cc.ParticleSystem) starNode:cc.ParticleSystem=null;
    @property(cc.ParticleSystem) clodeNode:cc.ParticleSystem=null;
    @property(cc.Sprite) whitetbg:cc.Sprite=null;
    @property(cc.Node) dieNode:cc.Node=null;
    @property(cc.Node) planeNode:cc.Node=null;
    @property(sp.Skeleton) laserSkeleton:sp.Skeleton=null;

    private boxCollider:cc.BoxCollider = null;
    private oldHitBox:cc.Rect;
    private laserHitBox:cc.Rect;
    private rushHitBox:cc.Rect;

    private _touchIsValid:boolean = false;
    private _doubleBullet:boolean = false;
    private _doubleTimeout:any = null;

    public static Role:MainRole = null;

    private _rushType:number = 0;
    public _numDead:number=0;
    private _deadDetail:any = null;
    private _uiLayer:cc.Node=null;
    private _bg:cc.Sprite=null;
    private _battleNode:cc.Node = null;
    private _planes:Array<cc.Node>=[];

    private magnetNode: cc.Node;
    private doubleShotNode: cc.Node;
    onLoad () {
        
        MainRole.Role = this;
        if(this.ActorAttr==null)
        {
            this.ActorAttr = this.getComponent(ActorAttr);
        }
        this.ActorAttr.Init();
        this.buffManager = new BuffManager();
        if(this.ActorBuff==null)
        {
            this.ActorBuff = this.getComponent(ActorBuff);
        }
        this.ActorBuff.InitBuff(this,this.buffManager);
        if(this.ActorAttr)
        {
            this.ActorAttr.Reset();
        }
        if(this.ActorBuff)
        {
            this.ActorBuff.Reset();
        }
        MSG.on(MessageConst.addDamage,this.addDamage,this);
        MSG.on(MessageConst.doubleBullet,this.doubleBullet,this);
        MSG.on(MessageConst.addMagnet,this.addMagnet,this);
        MSG.on(MessageConst.UseReviveStatus,this.UseReviveStatusAction,this);
        this.starNode.positionType = cc.ParticleSystem.PositionType.GROUPED;
        this.clodeNode.positionType = cc.ParticleSystem.PositionType.GROUPED;

        this._battleNode = PANEL.panelHolder.battleLayer;
        this.boxCollider = this.node.getComponent(BoxCollider);
        this.oldHitBox =  cc.rect(
            this.boxCollider.offset.x,this.boxCollider.offset.y,
            this.boxCollider.size.width,this.boxCollider.size.height);
        var minHitY = this.oldHitBox.y - this.oldHitBox.height / 2;
        this.laserHitBox = cc.rect(
            this.oldHitBox.x,(minHitY + cc.winSize.height)/2,
            this.oldHitBox.width,(-minHitY + cc.winSize.height)
        );
        this.rushHitBox =  cc.rect(
            this.boxCollider.offset.x,this.boxCollider.offset.y,
            250,this.boxCollider.size.height);

        this.magnetNode = new cc.Node;
        this.magnetNode.addComponent(frameClipDisplay)
            .setFrame("animation/magnet/magnet", 10, 30);
        this.magnetNode.scale = 2;
        this.magnetNode.active = false;
        this.node.addChild(this.magnetNode);

        this.doubleShotNode = new cc.Node;
        this.doubleShotNode.addComponent(frameClipDisplay)
            .setFrame("animation/doubleShot/doubleShot", 8, 30);
        this.doubleShotNode.scale = 2;
        this.doubleShotNode.active = false;
        this.node.addChild(this.doubleShotNode)
    }

    start () {
    }
    update(dt)
    {
        if(this.ActorBuff)
        {
            this.ActorBuff.UpdateLogic(dt);
        }
    }
    onEnable(){
    
        this.schedule( this.onlaunch.bind(this), 0.066 );
        this.lodeWhiteBg();
        MSG.on(MessageConst.RushAddSpeed, this.startRushState, this);
        MSG.on(MessageConst.FriendFrientPlane,this.addPlane,this);

        this._battleNode.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this._battleNode.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this._battleNode.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);


    }

    onDisable(){
        this.unscheduleAllCallbacks();
        this._bg.destroy();
        MSG.off(MessageConst.RushAddSpeed, this.startRushState, this);
        MSG.off(MessageConst.FriendFrientPlane,this.addPlane,this);

        this._battleNode.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this._battleNode.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this._battleNode.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

    onDestroy(){
        MSG.off(MessageConst.doubleBullet,this.doubleBullet,this);
        MSG.off(MessageConst.addDamage,this.addDamage,this);
        MSG.off(MessageConst.addMagnet,this.addMagnet,this);
        MSG.off(MessageConst.UseReviveStatus,this.UseReviveStatusAction,this);
    }

    private onlaunch() {
    
        if (this.playerNode.active == false){
        //已经死亡
            return ;
        }
        if (this._rushType != 0) {
            return;
        }
        if(BM.laserTimer.isActive()){
            return;
        }
        let bullet = this.ActorAttr.bulletLev;
        

        POOL.getPrefabFromPool(BM.getBulletNewPrefabPath(),(node:cc.Node)=>{
            if(node==null)
            {
                return;
            }
            if(this.node&&this.node.parent)
            {
                node.parent = this.node.parent;
                //检查是否有双倍子弹的buff
                if(this.ActorBuff.IsHasBuff(1)){
                    let sp = this.node.getPosition().add( cc.v2(60, 80) );
                    node.setPosition(  sp );
                    let worldPos = sp;
                    let com:NewBulletItem = node.getComponent(NewBulletItem);
                    com.setData(bullet);
                    com.onlaunch( sp.add( cc.v2(0,cc.winSize.height - worldPos.y) ), this);
                }else{
                    let sp = this.node.getPosition().add( cc.v2(0, 80) );
                    node.setPosition(  sp );
                    let worldPos = sp;
                    let com:NewBulletItem = node.getComponent(NewBulletItem);
                    com.setData(bullet);
                    com.onlaunch( sp.add( cc.v2(0,cc.winSize.height - worldPos.y) ), this);
                }
            }
        });
        if(this.ActorBuff.IsHasBuff(1)){
            POOL.getPrefabFromPool(BM.getBulletNewPrefabPath(),(node:cc.Node)=>{
                if(node==null)
                {
                    return;
                }
                if(this.node&&this.node.parent)
                {
                    let sp = this.node.getPosition().add( cc.v2(60, 80) );
                    node.parent = this.node.parent;
                    node.setPosition(this.node.getPosition().add( cc.v2(-50, 80) ));
                    let worldPos = sp;
                    let com2:NewBulletItem = node.getComponent(NewBulletItem);
                    com2.setData(bullet);
                    com2.onlaunch( sp.add( cc.v2(-100,cc.winSize.height - worldPos.y) ), this);
                }
            });
        }
    }

    public onLaser(timer:number){
            this.boxCollider.offset = cc.v2(this.laserHitBox.x,this.laserHitBox.y);
            this.boxCollider.size = cc.size(this.laserHitBox.width,this.laserHitBox.height);
            this.laserSkeleton.node.active = true;
            this.laserSkeleton.timeScale = 2;
        this.node.runAction(cc.sequence(
           cc.callFunc(()=>this.laserSkeleton.setAnimation(1, "begin", false)),
           cc.delayTime(0.5),
           cc.callFunc(()=>this.laserSkeleton.setAnimation(1, "loop", true)),
           cc.delayTime(timer-1),
           cc.callFunc(()=>this.laserSkeleton.setAnimation(1, "end", false)),
        ));

    }


    public onLaserFinish(){
        this.boxCollider.offset = cc.v2(this.oldHitBox.x,this.oldHitBox.y);
        this.boxCollider.size = cc.size(this.oldHitBox.width,this.oldHitBox.height);
        this.laserSkeleton.node.active = false;
    }

    private doubleBullet(){
        if(this.buffManager==null)
        {
            return;
        }
        this.buffManager.DoBuffById(this,1);
        this.doubleShotNode.active = true;
        this.ActorBuff.GetBuffByBaseID(1).OnFinsh = () => {
            this.doubleShotNode.active = false;
        }
        // this._doubleBullet = true;
        // if(this._doubleTimeout != null){
        //     clearTimeout(this._doubleTimeout);
        // }
        // this._doubleTimeout = setTimeout(() => {
        //     this._doubleBullet = false;
        // }, 10000);
    }

    private addDamage(){
        if(this.buffManager==null)
        {
            return;
        }
        this.buffManager.DoBuffById(this,2);
    }
    private addMagnet()
    {
        if(this.buffManager==null)
        {
            return;
        }
        this.buffManager.DoBuffById(this,3);
        this.magnetNode.active = true;
        this.ActorBuff.GetBuffByBaseID(3).OnFinsh = () => {
            this.magnetNode.active = false;
        }
    }
    /** 判断是否可以触发碰撞 */
    private checkCanTriggerCollide():boolean{

        if (this._rushType != 0) {
            return false;
        }
        if (this.playerNode.active == false){
            return false;
        }
        return true;
    }
    /**
     * 怪物与人相撞
     * @param monster 
     */
    public onCollisionMonster(monster:MonsterBase)
    {
       if (false == this.checkCanTriggerCollide()){
            return ;
       }
        if(monster)
        {
            monster.changeMonsterHpFactor(1);
            monster.onChangeHpView();
            var deadDetail={result:"fail",id:1,reason:"怪物子弹碰撞","kActName":BIActionConst.kActName_KillByNormalMonster};
            DottingUtil.bi_normalFun(BIActionConst.kActName_KillByNormalMonster,null);
            this._deadDetail = deadDetail;
            this.playerRopeCrash();
           
        }
    }
    //人和怪物子弹相撞
    public onCollisionSuuperBullet(bullet:EnemySuperBullet)
    {
        if (false == this.checkCanTriggerCollide()){
            return ;
       }
        if(bullet)
        {
            var deadDetail={result:"fail",id:2,reason:"火箭碰撞","kActName":BIActionConst.kActName_KillByMissile};
            DottingUtil.bi_normalFun(BIActionConst.kActName_KillByMissile,null);
            this._deadDetail = deadDetail;
            this.playerRopeCrash();
           
        }
    }
    //人和boss子弹相撞
    public onCollisionEnemyBullet(bullet:EnemyBulletItem)
    {
        if (false == this.checkCanTriggerCollide()){
            return ;
       }
        if(bullet)
        {
            var deadDetail={result:"fail",id:3,reason:"boss子弹碰撞","kActName":BIActionConst.kActName_KillByBossMonster};
            DottingUtil.bi_normalFun(BIActionConst.kActName_KillByBossMonster,null);
            this._deadDetail = deadDetail;
            this.playerRopeCrash();
        }
    }
    //玩家角色发生碰撞
    private playerRopeCrash(){


        //去掉小飞机
        this.removePlane();
        //死亡音效
        SOUND.playDeathSound();
        MSG.emit('playerRopeCrash');
        this.dieAnimation(()=>{
            if ( GAME._isInUserGuide == false){
                var life = this.lifeAgain(this._deadDetail);
                if(!life){
                    //Toast.showToast("You Fail!");
                    this.endGame();
                }
            }
        });
        ShakeUtils.shakeView(PANEL.panelHolder.bgLayer);
        ShakeUtils.shakeView(PANEL.panelHolder.battleLayer);
        ShakeUtils.shakeView(PANEL.panelHolder.monsterLayer)
    }

    /**
     * 复活
     */
    private lifeAgain(deadDetail){
        this._numDead++;
        let configlife = CFG.getCfgDataById(ConfigConst.RESURGENCE, this._numDead.toString());
        // let configlife = CFG.getCfgDataById(ConfigConst.RESURGENCE, '1');


        let lifetime = GAME.playerData.RoleData.lifeTimes;
        let guideStep = GAME.playerData.RoleData.guideStep;
        if (guideStep && guideStep > 1 && configlife && configlife.open) {
            if (!isNaN(lifetime) && lifetime > 0 && guideStep == 2) {
                MSG.emit(MessageConst.PlayerDied, deadDetail);
                PANEL.showSinglePopUp(AssetConst.OverContinueView, {
                    "configlife": configlife,
                    "deadDetail": deadDetail,
                    "lifetime": lifetime
                });
                return true;
            } else {
                MSG.emit(MessageConst.PlayerDied, deadDetail);
                PANEL.showSinglePopUp(AssetConst.OverContinueView, {
                    "configlife": configlife,
                    "deadDetail": deadDetail,
                    "lifetime": 0
                });
                return true;
            }
        }
        this._numDead=0;
        return false;
        
    }

    /**
     * 复活页面回调
     */
    private UseReviveStatusAction(evt){
        if(evt.detail.status == 1){
            //点击复活
            // this.playerNode.active = true;
            MSG.emit(MessageConst.PlayerRevive);
            
            this._deadDetail = null;
            MSG.emit(MessageConst.FriendFightingBtnSwitch,2);
        }else{
            //结束游戏
            this.endGame();
        }
     
    }

    private endGame(){
        // this.playerNode.active = true;
        POOL.putPrefabToPool(this.node);
        MSG.emit(MessageConst.GameOver, this._deadDetail);
        this._numDead = 0;
        this._deadDetail = null;
    }

    public clearRole(){
        POOL.putPrefabToPool(this.node);
    }

    public reuse()
    {
        if(this.node.active==false)
        {
            this.node.active= true;
        }
        // if (this.playerNode.active == false){
        //     this.playerNode.active = true;
        // }
        // this.playerSafe = true;//恢复复活标志位
        this.clodeNode.node.active= false;
        this.starNode.node.active= false;
        this.playerNode.rotation=0;
        this.rushNode.rotation=0;
        this.ActorAttr = this.getComponent(ActorAttr);
        this.ActorAttr.Init();
        this.buffManager = new BuffManager();
        this.ActorBuff = this.getComponent(ActorBuff);
        this.ActorBuff.InitBuff(this,this.buffManager);
        if(this.ActorAttr)
        {
            this.ActorAttr.Reset();
        }
        if(this.ActorBuff)
        {
            this.ActorBuff.Reset();
        }
    }
    public unuse()
    {
        this.unscheduleAllCallbacks();
        if(this.ActorAttr)
        {
            this.ActorAttr.Reset();
        }
        if(this.ActorBuff)
        {
            this.ActorBuff.Reset();
        }
        if(this.node.active==true)
        {
            this.node.active = false;
        }
    }
    public create()
    {
        this.node.active= true;
        this.playerNode.rotation=0;
        this.rushNode.rotation=0;
    }

    private startRushState(e) {
        this._rushType = e.detail.type;
        if( this._rushType != 0) {
            this.rushNode.active = true;
            this.boxCollider.offset = cc.v2(this.rushHitBox.x,this.rushHitBox.y);
            this.boxCollider.size = cc.size(this.rushHitBox.width,this.rushHitBox.height);
        }else {
            this.rushNode.active = false;
            this.boxCollider.offset = cc.v2(this.oldHitBox.x,this.oldHitBox.y);
            this.boxCollider.size = cc.size(this.oldHitBox.width,this.oldHitBox.height);
        }
    }

    private endRushState() {
        
    }

    //死亡动画
    private dieAnimation(cb:Function){
        this.playerNode.active = false;
        let sch = cc.director.getScheduler();
        sch.setTimeScale(0.2);
       
        this._bg.node.opacity=200;
        let windowSize=cc.view.getVisibleSize();
        this._bg.node.width=windowSize.width+150;
        this._bg.node.height=windowSize.height+300;
        this._bg.node.active=true;
        var whiteanimation=cc.fadeTo(0.4,0);
        this._bg.node.runAction(whiteanimation);

        this.clodeNode.node.active=true;
        this.starNode.node.active=true;
    
        let __self = this;
        this.scheduleOnce(function(){
            __self.endDirectorSlowly(cb);
        },0.4)
    }

    private endDirectorSlowly(cb:Function){
        let sch = cc.director.getScheduler();
        sch.setTimeScale(1);

        let __self = this;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            // this.doSomething();

            __self.starNode.resetSystem();
            __self.clodeNode.resetSystem();
            __self.starNode.positionType = cc.ParticleSystem.PositionType.GROUPED;
            __self.clodeNode.positionType = cc.ParticleSystem.PositionType.GROUPED;
            __self.clodeNode.node.active= false;
            __self.starNode.node.active= false;
            cb && cb()
        }, 0.5);
    }

    //白板加载
    private lodeWhiteBg(){
        this._uiLayer=PANEL.panelHolder.uiLayer;
        var bgnode=new cc.Node();
        this._bg=bgnode.addComponent(cc.Sprite);
        this._bg.node.parent=this._uiLayer;
        RES.loadLocalSprite("img/common/bai",this._bg);
        this._bg.dstBlendFactor=cc.BlendFunc.BlendFactor.ONE;
        this._bg.node.active=false;
    }

    /**
     * 添加飞机助战
     */
    private addPlane(res){
        var friendInfo=res.detail;
        var positionx=-100;
        var planeType=1;
        if(this.planeNode.childrenCount==0){
            positionx=-100;
            planeType=1;
        }else if(this.planeNode.childrenCount==1){
            positionx=100;
            planeType=2;
            //关掉右边助战按钮
        MSG.emit(MessageConst.FriendFightingBtnSwitch,0);
        }
        POOL.getPrefabFromPool(AssetConst.FriendPlane,(node:cc.Node)=>{
            if(node==null)
            {
                return;
            }
            if(this.node&&this.node.parent)
            {
                node.parent = this.planeNode;
                let plane: FriendPlane = node.getComponent(FriendPlane);
                plane.setdata({"portrait":friendInfo.portrait,"planeType":planeType,"rushType":this._rushType,"uid":friendInfo.uid});
                node.x=positionx;
                this._planes.push(node);
            }
        });
    }

    /**
     * 移除飞机
     */
    private removePlane(){
        this.planeNode.removeAllChildren();
        MSG.emit(MessageConst.FriendFightingBtnSwitch,0);
        this._planes=[];
    }

    private _maxAngle:number = 10;
    private _deltaX:number=0;
    private _touchId:number=Number.MAX_VALUE;
    private onTouchStart(evt:cc.Event.EventTouch)
    {
        BATTLEDATA._touchStatus=0;
        if (this.node == null || this.node.parent == null) {
            return;
        }
        if(this._touchId==undefined || this._touchId==Number.MAX_VALUE)
        {
            this._touchId= evt.getID();
        }
    }

    private onTouchMove(evt:cc.Event.EventTouch) {
        if (this.node == null || this.node.parent == null) {
            return;
        }
        if(this._touchId!=evt.getID())
        {
            return;
        }
        if(BATTLEDATA._touchStatus==1){
            return;
        }
        let delta =evt.getDeltaX();
        let willPosX = this.node.getPositionX() +delta*2;
        if (willPosX > cc.winSize.width/2) {
            willPosX = cc.winSize.width/2;
        }
        else if (willPosX < -cc.winSize.width/2) {
            willPosX = -cc.winSize.width/2;
        }
        if (this.playerNode.active){
            this.node.setPositionX( willPosX );
            this._deltaX+=delta;
            //计算偏移
            let abs =Math.abs(this._deltaX);
            let angle =abs /cc.winSize.width*180;
            if(angle>this._maxAngle)
            {
                angle =this._maxAngle;
            }
            if(delta>0)
            {
                this.playerNode.rotation=angle;
                this.rushNode.rotation=angle;
                if(this._planes.length!=0){
                    this._planes.forEach(element=>{
                        element.rotation=angle;
                    });
                }
            }
            else{
                this.playerNode.rotation=-angle;
                this.rushNode.rotation=-angle;
                if(this._planes.length!=0){
                    this._planes.forEach(element=>{
                        element.rotation=-angle;
                    });
                }
            }
            if(Math.abs(delta)<50)
            {
                this.playerNode.runAction(cc.rotateTo(0.1,0));
                this.rushNode.runAction(cc.rotateTo(0.1,0));
                if(this.planeNode.childrenCount!=0){
                    this.planeNode.children.forEach(element=>{
                        element.runAction(cc.rotateTo(0.1,0));
                    });
                }
            } 
        }
        //MSG.emit(MessageConst.OnHandlerRoleMove,{position:this.node.getPosition()});
    }

    private onTouchEnd(evt:cc.Event.EventTouch) {
        if (this.node == null || this.node.parent == null) {
            return;
        }
        if(this._touchId!=evt.getID())
        {
            return;
        }
       this.ResetRole();
    }

    private ResetRole()
    {  
        this.playerNode.runAction(cc.rotateTo(0.2,0));
                this.rushNode.runAction(cc.rotateTo(0.2,0));
                if(this.planeNode.childrenCount!=0){
                    this.planeNode.children.forEach(element=>{
                        element.runAction(cc.rotateTo(0.2,0));
                    });
                }
        this._deltaX=0;
        this._touchId = Number.MAX_VALUE;
    }
    
}