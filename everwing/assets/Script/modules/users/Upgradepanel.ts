import PopupBase from "../../component/PopupBase";
import {GAME} from "../../model/GameData";
import {CFG} from "../../manager/ConfigManager";
import {ConfigConst} from "../../GameConst";
import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import {NET} from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";

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
export default class Upgradepanel extends PopupBase {

    @property(cc.Label) goldLebel: cc.Label = null;
    @property(cc.Label) levelLebel: cc.Label = null;

    private _upgold:number=0;

    public onInit(data?:any){
        console.log(data);
        if(data ){
            if(GAME.playerData.RoleData.level){
                var _data=GAME.playerData.RoleData;
                _data.level+=1;
                if (data.exp) {
                    _data.exp -= Number(data.exp);
                }
                GAME.updatePlayerData_v1(_data);
            }
            this.goldLebel.string =String(data.gold);
            this._upgold=data.gold;
        }
        let level=GAME.playerData.RoleData.level;
        this.levelLebel.string=level.toString();
    }

    start () {

    }

    onEnable(){

    }
    onDisable() {
        
    }

    private closeViewButtonAction(){
        var gold=GAME.playerData.RoleData.gold-this._upgold;
        GAME.updatePlayerData_v1({"gold":gold});
        let levelData=CFG.getCfgByKey(ConfigConst.RANK,"level",GAME.playerData.RoleData.level);
        let nextLevelData=CFG.getCfgByKey(ConfigConst.RANK,"level",GAME.playerData.RoleData.level+1);
        if(nextLevelData.length>0&&levelData.length>0&&(GAME.playerData.RoleData.exp>=levelData[0].score)){
            MSG.emit(MessageConst.showUpLevel, {"gold": levelData[0]["coin"], "exp": levelData[0]["score"]});
        }
        this.closePanel();
        NET.send(NetConst.UpLevel,{method:"upperLevelAddGold",level:GAME.playerData.RoleData.level-1},(data)=>{
            if(data["message"]=="ok"){
                GAME.updatePlayerData_v1(data["playInfo"]);
            }
        },this,()=>{});
    }

}
