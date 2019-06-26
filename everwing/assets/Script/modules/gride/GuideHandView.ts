import {MSG} from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";
import {NET} from "../../net/core/NetManager";
import NetConst from "../../net/NetConst";
import {GAME} from "../../model/GameData";
import DottingUtil, {BIActionConst} from "../../utils/DottingUtil";
import PrefabBase from "../../component/PrefabBase";

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
export default class GuideHandView extends PrefabBase {

    @property(cc.Sprite) handSprite: cc.Sprite = null;
    @property(cc.Node) clickNode: cc.Node = null;
    @property(cc.Node) maskNode: cc.Node = null;
    @property(cc.Sprite) maskSpriteColor: cc.Sprite = null;

    private _data = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onInit(data: any) {
        //坐标、大小、click事件、步骤
        this._data = data;
        if (this._data) {
            this.showMask();
        }
    }

    onEnable() {
        MSG.on(MessageConst.GuideOver, this.guideOver);
    }

    onDisable() {
    }

    onButtonClick() {
        MSG.emit(MessageConst.GuideClick);
    }

    showMask() {
        let wordPos = cc.v2(0, 0);
        if (this._data.wordPos) {
            wordPos = this._data.wordPos;
            this.clickNode.position = this._data.wordPos;
            this.maskNode.position = this._data.wordPos;
        }
        let arcPos;
        if (this._data.arcPos) {
            arcPos = this._data.arcPos;
            this.maskNode.setAnchorPoint(arcPos);
        }
        let size = cc.size(0, 0);
        if (this._data.size) {
            size = this._data.size;
            //this.clickNode.setContentSize(this._data.size);
            //this.maskNode.setContentSize(this._data.size);
        }
        this.maskSpriteColor.node.opacity = 200;
        this.handSprite.node.active = true;
        var moveup = cc.v2(-10, 10);
        var movedown = cc.v2(10, -10);
        this.handSprite.node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.4, moveup), cc.moveBy(0.4, movedown))));
    }

    //完成任务触发事件
    private guideOver() {
        var step = GAME.playerData.RoleData.guideStep + 1;
        GAME.updatePlayerData_v1({"guideStep":step});
        var guideStr = "";
        if (step && step == 1) {
            guideStr = "6";
        } else if (step && step == 2) {
            guideStr = "8";
        }else if(step && step == 3){
            guideStr = "10";
        }
        if (guideStr != "") {
            DottingUtil.bi_normalFun(BIActionConst.kActName_NewUserGuide, {guideid: guideStr,abTest:GAME._abTestSwitchData["10008"]});
            GAME._userGuideStep=guideStr;
        }

        NET.send(NetConst.UpdateGuide, {method: "update", guideStep: step}, (data) => {
            GAME.updatePlayerData_v1(data.playerInfo);

        }, this)
    }
}
