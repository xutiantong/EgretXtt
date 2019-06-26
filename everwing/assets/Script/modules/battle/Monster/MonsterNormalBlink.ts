import MonsterBase from "./MonsterBase";
import { BM } from "../BattleManager";
import NumberUtil from "../../../utils/NumberUtil";
import { RES } from "../../../manager/ResourceManager";
import { POOL } from "../../../manager/PoolManager";
import MonsterInfo from "./MonsterInfo";
import { BATTLEDATA } from "../../../model/BattleData";
import { MonsterAssetConst } from "./MonsterNormal";
import { LEVELMG } from "../../level/LevelManager";

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
export default class MonsterNormalBlink extends MonsterBase {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    
    protected moveMonster () {
        //读表移动   
        
    }

    public create () {
        super.create();
        // let arr:string [] = ["xiaoguai_hong","xiaoguai_lan","xiaoguai_huang","xiaoguai_zi"];
        // //let arr:string [] = ["guai_hong","guai_lan","guai_lvhuang","guai_lv","guai_zi"];
        // //let arr:string [] = ["baiguai","huangguai","baiguai","huangguai","baiguai"];
        // let num:number = NumberUtil.toInt(Math.random()*4) % 4;
        // POOL.getPrefabFromPool("guai/"+arr[num],(node:cc.Node)=>{
        //     node.parent = this.monsterS;
        //     //node.scale = 2;
        // });
    }
    public updateMonstInfo(data:object){
        // super.createByParams(data);
    
       
        if (!this.monsterInfo ){
            this.monsterInfo = new MonsterInfo();
        }
        this.monsterInfo.parseData(data);
        //let arr:string [] = ["xiaoguai_lan","xiaoguai_zi","xiaoguai_huang","xiaoguai_hong","xiaoguai_bai"]
        let colorName:string = "xiaoguai_lan";
        if(this.monsterInfo.MonsterIcon!="")
        {
            colorName = this.monsterInfo.MonsterIcon;
        }
        let __self = this;
        console.log('current color',colorName);
        for(let i:number=this.monsterS.children.length-1;i>=0;i--){
            POOL.putPrefabToPool(this.monsterS.children[i]);
        }
        this.monsterS.removeAllChildren();
        POOL.getPrefabFromPool("guai/"+colorName,(colorMode:cc.Node)=>{
            colorMode.parent = __self.monsterS;
            colorMode.setPosition(0,0);
        });
    }
    protected OnDeath() {
        super.OnDeath();
    }
    
    public onlaunch(endPos:cc.Vec2) {
        
        let times =  LEVELMG.currentLevelData.monster_overtime;
        let self =this;
        this.node.runAction( cc.sequence( cc.moveTo(times, endPos), cc.callFunc(()=>{self.onRemoveMonster()}) ) );
    }

    private onRemoveMonster()
    {
        POOL.putPrefabToPool(this.node);
    }
    // update (dt) {}
}
