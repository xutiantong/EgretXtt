import IActorComponent from "./IActorComponent";
import { GAME } from "../../../model/GameData";
import { CFG } from "../../../manager/ConfigManager";
import { ConfigConst } from "../../../GameConst";
import { BM } from "../BattleManager";

/**
 * 属性管理器
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class ActorAttr extends cc.Component implements IActorComponent{

    Init() {
        
        this.hp = 100;
        this.attack = BM.getBulletDamage();
        this.bulletLev = GAME.playerData.RoleData.bullet;
    }
    Reset() {
        this.hp = 100;
        this.attack = BM.getBulletDamage();
    }

    public hp:number = 100;
    public attack:number = 15;
    public bulletLev:number=1;
    public AddHP(add:number){

    }
    public SubHp(sub:number){

    }
    public AddMaxHP(add:number){

    }
    public SubMaxHp(sub:number){

    }
    public addDamage(add:number){
        this.attack += add;
    }
}