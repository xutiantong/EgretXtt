import { MSG } from "../../message/MessageController";
import { GAME } from "../../model/GameData";
import { ResourceConst } from "../../GameConst";
import StringUtil from "../../utils/StringUtil";
import AnimUtil from "../../utils/AnimUtil";


// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NumEffect extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    @property
    ListenEvent: string = "";
    @property
    ResourceType: number = 2; //默认金币

    curValue: number = 0;
    newValue: number = 1;

    // private valueAdd: number = 0;
    onEnable() {
        if (this.ListenEvent != "") {
            MSG.on(this.ListenEvent, this.UpdateData, this);
        }
    }
    onDisable() {
        if (this.ListenEvent != "") {
            MSG.off(this.ListenEvent, this.UpdateData, this);
        }
    }
    start() {

    }
    private _useAnim:boolean = false;
    public UpdateData(e) {
        this._useAnim = e.detail.useAnim;
        if (e.detail.resId == this.ResourceType) {
            if (this.ResourceType == ResourceConst.Gold) {
                this.setNewValue(GAME.playerData.gold);
            } else if (this.ResourceType == ResourceConst.RedPacket) {
                this.setNewValue(GAME.playerData.redPacket);
            }
            else if(this.ResourceType==ResourceConst.Diamond)
            {
                this.setNewValue(GAME.playerData.diamond);
            }
        }
    }
    public setNewValue(newValue: number) {
        this.newValue = newValue;
        this.valueAddTotal = newValue - this.curValue;
        // this.valueAdd = (this.newValue - this.curValue) / 50;
    }

    private totalTime = 1; // 1秒播完
    private DoChange(dt) {
        this.curValue += (dt/this.totalTime)*this.valueAddTotal;
        if (this.curValue >= this.newValue) {
            this.curValue = this.newValue;
            if (this.ResourceType == ResourceConst.Gold) {
                AnimUtil.showLabelFly(this.node, "+ " + this.valueAddTotal.toFixed(0));
            } else if (this.ResourceType == ResourceConst.RedPacket) {
                AnimUtil.showLabelFly(this.node, "+ " + StringUtil.formatRedPacket(this.valueAddTotal));
            }
            else if(this.ResourceType == ResourceConst.Diamond)
            {
                AnimUtil.showLabelFly(this.node, "+ " + this.valueAddTotal.toFixed(0));
            }
        }
        this.updateText(dt);
    }
    update(dt) {
        if (this.curValue > this.newValue || !this._useAnim) {
            this.curValue = this.newValue;
            this.updateText(dt);
        }else if (this.curValue < this.newValue) {
            this.DoChange(dt);
        }
    }

    private updateText(dt) {
        if (this.ResourceType == ResourceConst.Gold) {
            //如果金币超过一亿，一百万显示为xx.xx 小数点后0可省略
            if (this.curValue >= 100000000) {
                this.label.string = String(Math.round(this.curValue / 1000000) / 100) + "亿";
            }
            else if (this.curValue >= 1000000) {
                this.label.string = String(Math.round(this.curValue / 100) / 100) + "万";
            } else {
                this.label.string = String(this.curValue.toFixed(0));
            }
        } else if (this.ResourceType == ResourceConst.RedPacket) {
            this.label.string = StringUtil.formatRedPacket(this.curValue)+"元";
        }else if(this.ResourceType == ResourceConst.Diamond){
            this.label.string = String(this.curValue.toFixed(0));
        }
    }


    private valueAddTotal: number = 0;

    // update (dt) {}
}
