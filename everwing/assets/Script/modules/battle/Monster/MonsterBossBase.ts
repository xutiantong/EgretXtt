import MonsterBase from "./MonsterBase";
import {MSG} from "../../../message/MessageController";
import {DROP} from "../../drop/DropItemManager";
import LevelManager, {LEVELMG} from "../../level/LevelManager";

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

export var choose = function (e) {
    var index = Math.floor(Math.random() * e.length);
    return e[index == e.length ? 0 : index]
};
export var rollFloat = function (min, max) {
    return min + Math.random() * (max - min)
};
export var rollInt = function (min, max) {
    return Math.floor(min + Math.random() * (1 + max - min))
};

@ccclass
export default class MonsterBossBase extends MonsterBase {
    // LIFE-CYCLE CALLBACKS:
    protected _curSkillIndex: number = 0;
    public bossId: number = 0;

    // onLoad () {}

    start() {

    }


    protected get fpsNormal(): number {
        return 30;
    }

    protected get special(): number {
        return LevelManager.getInstance().currentChapter;
    }

    protected get speed(): number {
        return LevelManager.getInstance().currentChapter;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public playSkill() {
        //monsterSkill
    }

    public onlaunch() {
    }

    protected OnDeath() {
        // DottingUtil.bi_normalFun(BIActionConst.kActName_KillBossMonster,null);
        setTimeout(() => {
            //只通知当前关卡完成
            MSG.emit('CurrentChapterPass');
        }, 4000);
        DROP.createBossDrop(this.node.position);
        this.resetStart();
        super.OnDeath();
        LEVELMG.lastBossId = this.bossId;
    }

    protected createExplode(pos) {
    }

    protected resetStart() {
    }

    public noHrut(){
        return this.node.position.y + this.node.getContentSize().height/2 > cc.winSize.height/2;
    }
    // update (dt) {}
}
