import {LEVELMG} from "../level/LevelManager";
import {MONSTMG} from "../monsterMg/MonsterMg";
import {BATTLEDATA, RushType} from "../../model/BattleData";
import {AssetConst, RocketType} from "../../GameConst";
import {POOL} from "../../manager/PoolManager";
import WaringItem from "../battle/WaringItem";
import {rollFloat, rollInt} from "../battle/Monster/MonsterBossBase";
import MainRole from "../battle/MainRole";
import EnemySuperBullet from "../battle/EnemySuperBullet";

/**
 * 火箭刷新逻辑：
 * 在LevelConfig.rocketTypeByMonsterWave中按怪物波数取火箭类型
 * 如果未取到 则按照LevelConfig.rocketProb的权重去随机看是否会产生火箭
 * 如果火箭类型为1时 单个火箭
 * 如果火箭类型为2时 成排火箭 3-4个
 * 如果火箭类型为3时 双排火箭 第一排4个 第二排1-2个
 * 如果火箭类型为4时
 * 则按LevelConfig.rocketSingleProb/LevelConfig.rocketRowProb/LevelConfig.rocketStormProb权重
 * 随机生成一种类型的火箭
 * 
 */
var bgWidth = 750;

class RocketManager {
    private static _instance: RocketManager = null;
    public static getInstance(): RocketManager {
        if (this._instance == null) {
            this._instance = new RocketManager();
        }

        return this._instance;
    }

    private _totalWidth: number = 750;          // 屏蔽总宽度
    private _rocketWidth: number = 150;         // 火箭宽度

    private _battleLayer: cc.Node = null;       // 战斗节点
    private _mainRoleNode: cc.Node = null;      // 主角节点

    
    /**
     * 初始化
     * @param battleLayer 
     * @param mainRoleNode 
     */
    public init (battleLayer: cc.Node, mainRoleNode: cc.Node) {
        this._battleLayer = battleLayer;
        this._mainRoleNode = mainRoleNode;
    }
    

    /**
     * 生成火箭
     */
    public showRocket () {
        // 加速过程不产生火箭
        if (BATTLEDATA._rushType == RushType.Rush_Invincible) {
            return;
        }
        let rocketType = this._getRocketTypeByMonsterWave();
        if (rocketType == RocketType.None) {
            return;
        }
        
        this.createWaringItem(rocketType);
    }

    /**
     * 生成火箭预警
     * @param rocketType 火箭类型
     */
    public createWaringItem (rocketType: number) {
        if (this._mainRoleNode == null) {
            return;
        }

        switch (rocketType) {
            case RocketType.Single:
                this._createSingleWarnigItem();
                break;
            case RocketType.Row:
                this._createRowWaringItem(this._chooseByWeight(100, 50) ? 4 : 3);
                break;
            case RocketType.Storm:
                this._createStormWaringItem();
                MONSTMG.skip = 1;
                break;
            default:
                break;
        }


    }

    /**
     * 单个火箭预警
     */
    private _createSingleWarnigItem () {
        let rolePosX = this._mainRoleNode.position.x;
        let index = Math.floor(rolePosX / this._rocketWidth);
        let posX:number = this._rocketWidth * index;
        POOL.getPrefabFromPool(AssetConst.WaringItem,(node:cc.Node)=>{
            node.setPosition(cc.v2(posX, cc.winSize.height/2 - 200));
            node.parent = this._battleLayer;
            let waringItem: WaringItem = node.getComponent(WaringItem);
            waringItem.reset(0);
        });
    }

    /**
     * 成排火箭预警
     */
    private _createRowWaringItem (totalCount: number, followRole: boolean = true) {
        let indexList: number[] = [];
        if (followRole) {
            let rolePosX = this._mainRoleNode.position.x;
            indexList.push(rolePosX);
            totalCount--;
        }

        while (totalCount > 0) {
            indexList.push(this.randomRocketX());
            totalCount--;
        }

        for (let i = 0; i < indexList.length; i++) {
            const posX = indexList[i];
            POOL.getPrefabFromPool(AssetConst.WaringItem,(node:cc.Node)=>{
                node.setPosition(cc.v2(posX, cc.winSize.height/2 - 200));
                node.parent = this._battleLayer;
                let waringItem: WaringItem = node.getComponent(WaringItem);
                waringItem.reset(i);
            });
        }
    }

    private randomRocketX() {
        var spacing = bgWidth / 10;
        var b = spacing - bgWidth / 2;
        var x = bgWidth / 2 - spacing;
        var ret = rollFloat(b, x);
        return ret
    }

    /**
     * 火箭雨预警
     */
    private _createStormWaringItem () {
        var count = rollInt(5, 6);
        var actions = [];
        for (let i = 0; i < count; i++) {
            actions.push(cc.delayTime(0.6 * i));
            actions.push(cc.callFunc(() => {
                POOL.getPrefabFromPool(AssetConst.WaringItem, (node: cc.Node) => {
                    var posX = i == 0 ? MainRole.Role.node.x : this.randomRocketX();
                    node.setPosition(cc.v2(posX, cc.winSize.height / 2 - 200));
                    node.parent = this._battleLayer;
                    let waringItem: WaringItem = node.getComponent(WaringItem);
                    waringItem.reset(i);
                });
            }))
        }
        this._battleLayer.runAction(cc.sequence(actions))
    }

    public createRocketAtPosition(posX: number, times: number) {
        if (this._battleLayer == null) {
            return;
        }

        POOL.getPrefabFromPool(AssetConst.EnemySuperBullet,(node:cc.Node)=>{
            node.setPosition(cc.v2(posX, cc.winSize.height/2 + 100));
            node.parent = this._battleLayer;
            node.getComponent(EnemySuperBullet).onlaunch(times)
        });
    }

    /**
     * 根据怪物波数获取火箭类型 0表示用
     */
    private _getRocketTypeByMonsterWave (): number {
        let ret = RocketType.None;
        let levelConfig = LEVELMG.currentLevelData;
        let monsterWave = BATTLEDATA._wave;
        if (levelConfig.rocketTypeByMonsterWave[monsterWave] == undefined) {
            if (this._randomWaveRocket()) {
                ret = RocketType.Random;
            }
        } else {
            ret = levelConfig.rocketTypeByMonsterWave[monsterWave];
        }

        if (ret == RocketType.Random) {
            ret = this._randomRocketType();
        }

        return ret;
    }

    /**
     * 根据三种类型的火箭的权重随机产生一种火箭
     */
    private _randomRocketType (): number {
        let ret = 1;
        let levelConfig = LEVELMG.currentLevelData;
        let weightList: number[] = [
            levelConfig.rocketSingleProb,
            levelConfig.rocketRowProb,
            levelConfig.rocketStormProb
        ];

        let totalWeight = levelConfig.rocketSingleProb + levelConfig.rocketRowProb + levelConfig.rocketStormProb;
        let r = Math.floor(Math.random() * totalWeight);
        let beginIndex = 0;
        for (let i = 0; i < weightList.length; i++) {
            const element = weightList[i];
            if (r >= beginIndex && r <= beginIndex + element) {
                ret = i + 1;
                break;
            } else {
                beginIndex += element;
            }
        }
        return ret;
    }

    /**
     * 如果本波未配置产生火箭 则根据火箭出现权重判断是否随机产生火箭
     */
    private _randomWaveRocket (): boolean {
        let levelConfig = LEVELMG.currentLevelData;
        let ret = this._chooseByWeight(100, Number(levelConfig.rocketProb));
        return ret;
    } 

    /**
     * 根据权重二选一
     */
    private _chooseByWeight (totalWeight: number, weight: number): boolean {
        let ret = true;
        let r = Math.random() * totalWeight;
        if (r > weight) {
            ret = false;
        }

        return ret;
    }
}

export var ROCKET = RocketManager.getInstance();