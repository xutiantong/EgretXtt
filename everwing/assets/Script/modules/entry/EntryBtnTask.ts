import EntryBtnBase from "./EntryBtnBase";
import MessageConst from "../../message/MessageConst";
import { PANEL } from "../../manager/PanelManager";
import { MSG } from "../../message/MessageController";

import { AssetConst } from "../../GameConst";
import { Toast } from "../toast/Toast";

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
export default class EntryBtnTask extends EntryBtnBase {

    @property(cc.Label)
    public lab:cc.Label=null;
    //public EvtListenerNewId = MessageConst.Friend_Boost_New_Change;
    public onClickItem()
    {
        // if(TASK.TaskState == TaskProgressState.Finish)
        // {
        //     Toast.showToast("暂无可做任务");
        //     return;
        // }
        // if(TASK.TaskState == TaskProgressState.CanGetReward)
        // {
        //     PANEL.showSinglePopUp(AssetConst.TaskRwdView);
        //     // TASK.onkMainUITaskClick();
        //     return;
        // }
        // PANEL.showSinglePopUp(AssetConst.TaskView);
        //TASK.onkMainUITaskClick();
        //MSG.emit(MessageConst.ShowTaskJump,{actionType:1});
    }
    public onEnable()
    {
        MSG.on(MessageConst.MAINUI_TASK_UPDATE,this.onRefreshUI,this);
    }
    public onDisable()
    {
        MSG.off(MessageConst.MAINUI_TASK_UPDATE,this.onRefreshUI,this);
    }
    public start()
    {
        super.start();
        this.onRefreshUI();
    }
    public onRefreshUI()
    {

    }
    /**
     * todo new 
     * @param evt 
     */
    public onNewChange(evt)
    {
        super.onNewChange(evt)
    }
}
