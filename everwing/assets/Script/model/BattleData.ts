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
export default class BattleData extends cc.Component {
    /**
     * 击杀怪物数量 用于判定精英怪
     */
    public _curKillMonsterInitEliteNum: number = 0;
    public _curInitEliteState: boolean = false;
    public _scoreNum: number = 0;

    public StateGame:GameState;
    public _wave: number = 0;//当前波数
    public _chapter: number = 0;//关卡
    public _chapterCfg: any = null;//关卡配置

    public _gameStartTime:number = 0;
    public _bossState:number = 0;//boss存活状态
    public _rushType:RushType ;//加速类型
    public _initEnd:boolean = false;
    //触摸状态,正常为0，复活界面为1
    public _touchStatus:number=0;

    public _unableCrtMonster:boolean = false;//是否可以产出怪物
    public _numKillMonster: number = 0;
    public _numKillMonsterMax: number = 100;

    public _CloudIsOpen:boolean = false;//云层打开
    private static _instance: BattleData = null;
    public static getInstance(): BattleData {
        if (BattleData._instance == null) {
            BattleData._instance = new BattleData();
        }
        return BattleData._instance;
    }

    public superBulletFiyTime:number = 3;//默认新手3s
    public normalMonsterFiyTime:number = 5;//怪物默认飞行5s
}

export var BATTLEDATA = BattleData.getInstance();
export enum GameState
{
    /**
     * 离开战斗场景后
     */
    None,
    /**
     * 开始战斗
     */
    Battle,
    /**
     * 战斗结束
     */
    Finish,
    //玩家死亡
    PalyerDied,
 
}
/**
 * 加速类型
 */
export enum RushType{
     Rush_None ,//没有加速
     Rush_Start , //入场加速
     Rush_Invincible, //无敌道具加速
     Rush_Boss , //打boss前加速
}