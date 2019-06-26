import EntryBtnBase from "./EntryBtnBase";
import { SOUND } from "../../manager/SoundManager";


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
export default class EntryBtnBgMusic extends EntryBtnBase {

    @property(cc.Node) openNode:cc.Node = null;
    @property(cc.Node) closeNode:cc.Node = null;

    onEnable() {
        if (SOUND.getMusicSwitch()) {
            this.openNode.active = true;
            this.closeNode.active = false;
        }else {
            this.openNode.active = false;
            this.closeNode.active = true;
        }
    }

    public onClickItem()
    {
       SOUND.SetMuiscOpen();
       if (SOUND.getMusicSwitch()) {
            this.openNode.active = true;
            this.closeNode.active = false;
        }else {
            this.openNode.active = false;
            this.closeNode.active = true;
        }
       
    }

}
