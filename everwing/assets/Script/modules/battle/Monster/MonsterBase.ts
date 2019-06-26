import MonsterInfo from "./MonsterInfo";
import {POOL} from "../../../manager/PoolManager";
import MainRole from "../MainRole";
import CollideItem from "../CollideItem";
import {AssetConst, monsterTypeID, ZERO} from "../../../GameConst";
import {PANEL} from "../../../manager/PanelManager";
import {MSG} from "../../../message/MessageController";
import MessageConst from "../../../message/MessageConst";
import {DROP} from "../../drop/DropItemManager";
import {RES} from "../../../manager/ResourceManager";
import PlaneBullet from "../../Friend/PlaneBullet";
import NewBulletItem from "../NewBulletItem";
import {BM, laserCfg} from "../BattleManager";
import {SOUND, SoundConst} from "../../../manager/SoundManager";


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
export default class MonsterBase extends CollideItem {

    @property(cc.Node)
    monsterS: cc.Node = null;
    
    @property(cc.Sprite)
    hpS: cc.Sprite = null;
    
    @property(cc.ProgressBar)
    hpBar:cc.ProgressBar = null;

    public MonsterType:EmMonsterType = EmMonsterType.Normal;

    protected monsterInfo: MonsterInfo=null;

    protected stateMonster:EmMonsterState = EmMonsterState.Live;

    private _rushType:number = 0;

    private _hurting:number=0;
    private _idx:number = -1;//当前怪物所属波数
    
    private rewardId:number =0;
    private nextLaserTime:number = 0;
    // onLoad () {
        
    // }
    // start () {

    // }
    public create()
    {
        if(this.hpBar)
        {
            this.hpBar.progress=1;
            this.hpBar.node.active = false;
        }
        this.monsterInfo = new MonsterInfo();
        this.stateMonster = EmMonsterState.Live;
    }
    // public createByParams(data:object){
    //     this.create;
    //     if (data){
    //         this.monsterInfo.parseData(data);
    //     }

    // }
    public reuse()
    {
        this.stateMonster = EmMonsterState.Live;
        this.node.active=true;
        this.monsterInfo.MonsterHp = this.monsterInfo.MonsterMaxHp;

    }

    public setData(idx:number, rushType:number,rewardId:number =0) {
        this._idx = idx;
        this._rushType = rushType;
        this.rewardId = rewardId;
    }

    public unuse()
    {
        this.node.stopAllActions();
        this.stateMonster = EmMonsterState.Die;
        if(this.hpBar)
        {
            this.hpBar.progress=1;
            this.hpBar.node.active = false;
        }
        this.node.active=false;
        this.nextLaserTime = 0;
        if (this.monsterS) {
            this.monsterS.y = 0;
            this.monsterS.stopAllActions()
        }

    }

    onEnable(){
        MSG.on(MessageConst.MonsterDeath, this.onMsgDeath, this);
        MSG.on(MessageConst.RushAddSpeed, this.setRushState, this);
    }

    onDisable(){
        MSG.off(MessageConst.MonsterDeath, this.onMsgDeath, this);
        MSG.off(MessageConst.RushAddSpeed, this.setRushState, this);
    }
    
    public changeMonsterHp (hurt: number):boolean {
        this.monsterInfo.MonsterHp = hurt;
        this.hpBar.node.active = true;
        if(this.monsterInfo.MonsterHp<=0)
        {
            return true;
        }
        return false;
    }
    public onChangeHpView(worldPos: cc.Vec2 = ZERO)
    {
        if(this.stateMonster == EmMonsterState.Die)
        {
            return;
        }
        if(this.hpBar)
        {
            this.hpBar.progress = this.monsterInfo.MonsterHpRadio;
            if(this.monsterInfo.MonsterHp>0)
            {
                if (this.MonsterType == EmMonsterType.Boss) {
                    //this.createBossAttack(worldPos);
                    this.createAttack(worldPos);
                }else if(this.MonsterType == EmMonsterType.Entourage){
                    //this.createAttack(worldPos)
                }else {
                    //this.createAttack(this.node.position);
                }
                this.hpBar.node.active =true;
            }
        }
        if(this.monsterInfo.MonsterHp<=0)
        {
            this.stateMonster = EmMonsterState.Die;
            if(this.monsterInfo.MonsterId == monsterTypeID.MonsterBoomID){
                MSG.emit(MessageConst.MonsterDeath, {idx:-1});
            }
            else{
                this.OnDeath();
            }
        }
    }
    public changeMonsterHpFactor(ratio:number):boolean
    {
        this.monsterInfo.MonsterHp =-ratio;

        if(this.monsterInfo.MonsterHp<=0)
        {
            return true;
        }
        return false;
    }
    /**
     * 死亡
     */
    protected OnDeath()
    {
        this.createExplode(this.node.position);


        if (this.node.name == "MonsterEliteItem") {
            DROP.createLootDrop(this.node.position);
        }
        else {
            if (this.monsterInfo.MonsterId == monsterTypeID.MonsterTreasureID) {
                DROP.createTreasureDrop(this.node.getPosition().add(cc.v2(0, 100)));
            }
            else if (this.rewardId > 0) {
                DROP.createMonsterDropByType(this.node.position, this.rewardId);
            }
            //DROP.createDrop(this.node.position);
        }
        POOL.putPrefabToPool(this.node);

        this.deathSound()
    }

    protected deathSound() {
        switch (this.monsterInfo.MonsterId) {
            case monsterTypeID.MonsterBoomID:
                SOUND.play(SoundConst.enemy_death_bomb);
                break;
            case monsterTypeID.MonsterTreasureID:
                SOUND.play(SoundConst.enemy_death_treasure);
                break;
            default:
                SOUND.play(SoundConst.enemy_death)
        }
    }
    
    /**
     * 小怪受伤
     */
    public onHurt(){
        var moveup:number=20;
        if(this._hurting==1||this.stateMonster == EmMonsterState.Die){
            return;
        }
        this._hurting=1;
        var finish=cc.callFunc(()=>{
            this._hurting=0;
        }, this);
        //运动幅度
        if(this.MonsterType==EmMonsterType.Normal){
            moveup=40;
        }
        var hurtAction=cc.sequence(cc.moveBy(0.05,cc.v2(0,moveup)),cc.moveBy(0.05,cc.v2(0,-moveup)),finish);
        this.monsterS.runAction(hurtAction);
    } 

    protected moveMonster () {
        
    }
    //返回怪物波次
    public getMonsterWave():number{
        return this._idx;
    }
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    public onCollisionEnter (other:cc.Collider, self:cc.Collider) {
        if(other.node.group =="bullet")
        {
            //超过屏幕的子弹不参与计算
            if(other.node.getPositionY()>cc.winSize.height*0.5)
            {
                POOL.putPrefabToPool(other.node);
                return;
            }
            let bullet = other.node.getComponent(NewBulletItem);
            if(bullet)
            {
                bullet.onCollisionMonster(this);
            }
        }else if(other.node.group =="pBullet")
        {
            //超过屏幕的子弹不参与计算
            if(other.node.getPositionY()>cc.winSize.height*0.5)
            {
                POOL.putPrefabToPool(other.node);
                return;
            }
            let pBullet = other.node.getComponent(PlaneBullet);
            if(pBullet)
            {
                pBullet.onCollisionMonster(this);
            }
        }
        else if(other.node.group=="player")
        {
            if(BM.laserTimer.isActive()){
                this.onLaser(other.node);
                return;
            }
            //怪物已经在下方的碰撞不进行计算
            if (this._rushType != 0) {
                this.OnDeath();    
                //MSG.emit(MessageConst.MonsterDeath, {idx:this.getMonsterWave()});
                return;
            }
            if(other.node.getPositionY()>self.node.getPositionY())
            {
                return;
            }
           let mainRole = other.node.getComponent(MainRole);
           if(mainRole)
           {
               mainRole.onCollisionMonster(this);
           }
        }
    }

    public onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == "player") {
            if (BM.laserTimer.isActive()) {
                this.onLaser(other.node);
                return;
            }
        }
    }

    //激光
    protected onLaser(playerNode:cc.Node){
        if(this.nextLaserTime == 0){
            this.scheduleOnce(()=>{
                this.nextLaserTime = 0;
            },BM.laserTimer.getTime()/1000);
        }
        if(!this.nextLaserTime || this.nextLaserTime <= BM.laserTimer.getElapsed()){
            var pos = cc.v2(playerNode.x,this.node.position.y);
            this.applyDamage(pos, laserCfg.damage);
           this.nextLaserTime += laserCfg.hitInterval
        }
    }


    public applyDamage(pos:cc.Vec2,hurt:number){
        switch (this.MonsterType){
            case EmMonsterType.Normal:{
                let kill = this.changeMonsterHpFactor(hurt);
                this.onChangeHpView();
                this.onHurt();
                let wave= this.getMonsterWave();
                let type= this.MonsterType;
                if(kill)
                {
                    MSG.emit(MessageConst.KillMonster,{condigId:1,num:1,currentWave:wave,mosterType:type});
                }
            }break;
            case EmMonsterType.Boss:{
                if (this.noHrut()) {
                    hurt = 0;
                }
                let kill = this.changeMonsterHpFactor(hurt);
                this.onChangeHpView(pos);
                if(kill)
                {
                    MSG.emit(MessageConst.KillMonster,{condigId:1,num:1});
                }
            }break;
            case EmMonsterType.Entourage: {
                if (this.node.position.y + this.node.getContentSize().height / 2 > cc.winSize.height / 2) {
                    hurt = 0;
                }
                let kill = this.changeMonsterHpFactor(hurt);
                this.onChangeHpView(pos);
                if (kill) {
                    MSG.emit(MessageConst.KillEntourage);
                }
            }break;
            case EmMonsterType.Elite: {
                if (this.node.position.y + this.node.getContentSize().height/2 > cc.winSize.height/2) {
                    hurt = 0;
                }
                let kill = this.changeMonsterHpFactor(hurt);
                this.onChangeHpView();
                this.onHurt();
                if(kill)
                {
                    MSG.emit(MessageConst.KillMonster,{condigId:1,num:1});
                }
            }break;
        }
    }

    protected createExplode(pos: cc.Vec2){
        POOL.getPrefabFromPool(AssetConst.MonsterDie,(node:cc.Node)=>{
            node.parent = PANEL.panelHolder.battleLayer;
            node.position = pos;
        });
    }

    private createAttack(pos){
        POOL.getPrefabFromPool(AssetConst.MonsterBeHurt,(node:cc.Node)=>{
            node.parent = PANEL.panelHolder.battleLayer;
            node.position = pos;
        });
    }

    private createBossAttack(pos){
        POOL.getPrefabFromPool(AssetConst.BossBeHurt,(node:cc.Node)=>{
            node.parent = PANEL.panelHolder.battleLayer;
            RES.lodeLocalTexture(node.getComponent(cc.ParticleSystem),"img/common1/bullet/bulletitem1");
            node.position = pos;
        });
    }

    private onMsgDeath(e) {
        if(e.detail.idx==-1&&this.monsterInfo&&this.monsterInfo.MonsterType == EmMonsterType.Normal){
            this.OnDeath();
            return;
        }
        // if (this.getMonsterWave() == e.detail.idx) {
        //     this.OnDeath();
        // }
    }

    private setRushState(e) {
        if (e.detail.type == undefined) {
            return;
        }
        this._rushType = e.detail.type;
    }

    public noHrut():boolean{
        return false;
    }

    // update (dt) {}
}

export enum EmMonsterType
{
    /**
     * 普通怪
     */
    Entourage = 0,
    /**
     * 精英怪
     */
    Boss,
    /**
     * boss
     */
    Normal,
    /**
     * boss小怪
     */
    Elite,
}

export enum EmMonsterState
{
    /**
     * 活
     */
    Live,
    /**
     * 死
     */
    Die,
}

