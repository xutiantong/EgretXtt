import MonsterBase, { EmMonsterType } from "./MonsterBase";
import { BM } from "../BattleManager";
import { ZERO, DropItemType } from "../../../GameConst";
import MonsterInfo from "./MonsterInfo";
import DottingUtil, { BIActionConst } from "../../../utils/DottingUtil";
import { MONSTMG } from "../../monsterMg/MonsterMg";
import LevelConfig from "../../level/LevelConfig";
import { LEVELMG } from "../../level/LevelManager";
import DropItemManager, { DROP } from "../../drop/DropItemManager";
import DropItem from "../../drop/DropItem";
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
export default class MonsterElite extends MonsterBase {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public MonsterType:EmMonsterType = EmMonsterType.Elite;

    private damageSinceLastCoin:number = 0;
    start () {
        
    }
    public create () {
        super.create();
        this.monsterInfo = new MonsterInfo();
        this.monsterInfo.parseData({monsterId: 1, monsterType: 1, monsterHp: MONSTMG.LootMonsterBaseHp*LEVELMG.currentChapter, monsterMaxHp: MONSTMG.LootMonsterBaseMaxHp*LEVELMG.currentChapter});
    }
    public reuse()
    {
        this.monsterInfo = new MonsterInfo();
        this.monsterInfo.parseData({monsterId: 1, monsterType: 1, monsterHp: MONSTMG.LootMonsterBaseHp*LEVELMG.currentChapter, monsterMaxHp: MONSTMG.LootMonsterBaseMaxHp*LEVELMG.currentChapter});
    }
    protected OnDeath() {
        // DottingUtil.bi_normalFun(BIActionConst.kActName_KillEliteMonster,null);
        super.OnDeath();
        BM.resetKillMonsterNum();
        MONSTMG.resetLootMonser(this.monsterInfo);
    }

    public onlaunch(endPos:cc.Vec2 = ZERO,hp:number =0,maxhp:number=0) {
        if(hp>0){
            this.monsterInfo.parseData({monsterId: 1, monsterType: 1, monsterHp: hp, monsterMaxHp: maxhp})
            this.hpBar.node.active =true;
            this.hpBar.progress = this.monsterInfo.MonsterHpRadio;
        }
        this.node.setPosition(cc.v2(Math.random()*cc.winSize.width - cc.winSize.width/2, cc.winSize.height/2 + 80));
        let cha = (cc.winSize.height - 300) / 4;
        let time = 10;
        let speed = cc.winSize.width / time;
        
        let move1 = cc.moveTo((cc.winSize.width/2 + this.node.getPositionX())/speed, cc.v2(-cc.winSize.width/2, this.node.getPositionY() - cha * 1));
        let move2 = cc.moveTo(time, cc.v2(cc.winSize.width/2, this.node.getPositionY() - cha * 2));
        let move3 = cc.moveTo(time, cc.v2(-cc.winSize.width/2, this.node.getPositionY() - cha * 3));
        let randomX = Math.random()*cc.winSize.width - cc.winSize.width/2;
        let time1 = randomX/speed;
        let move6 = cc.moveBy(time1, cc.v2(randomX, this.node.getPositionY() - cha * 3 - 100));
        let move7 = cc.moveBy(1, cc.v2(0, - cha-this.node.getContentSize().height));

        this.node.runAction(cc.sequence(move1, move2, move3, move6, cc.delayTime(2), move7, cc.removeSelf()));
    }

    onDisable() {
        BM.resetKillMonsterNum();
        MONSTMG.resetLootMonser(this.monsterInfo);
    }

    public changeMonsterHpFactor(ratio:number):boolean
    {
        let b = super.changeMonsterHpFactor(ratio);
        if (true) {
            var n = this.monsterInfo.MonsterMaxHp / 25;
            this.damageSinceLastCoin += ratio;
            if(this.damageSinceLastCoin >= n){
                this.damageSinceLastCoin -= n;
                DROP.createMonsterDropByType(this.node.getPosition(),DropItemType.Gold);
            }  
        }
        return false;
    }
    // update (dt) {}
}
