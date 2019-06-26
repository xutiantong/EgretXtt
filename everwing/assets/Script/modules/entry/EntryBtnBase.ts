import { MSG } from "../../message/MessageController";
import MessageConst from "../../message/MessageConst";

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
export default class EntryBtnBase extends cc.Component {

    @property(cc.Sprite)
    sprNew: cc.Sprite = null;
    @property(cc.Button)
    btnItem: cc.Button = null;
    public EvtListenerNewId:string;
    public EvtEntryClickId:string;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    start () {
        if(this.btnItem)
        {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个node节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "EntryBtnBase";//这个是代码文件名
            clickEventHandler.handler = "onClickItem";
            this.btnItem.clickEvents.push(clickEventHandler);
        }
    }
    onLoad()
    {
        if(this.EvtListenerNewId==null||this.EvtListenerNewId=="")
        {
            return;
        }
        MSG.on(this.EvtListenerNewId,this.onNewChange,this);
    }
    onDestroy()
    {
        if(this.EvtListenerNewId==null||this.EvtListenerNewId=="")
        {
            return;
        }
        MSG.off(this.EvtListenerNewId,this.onNewChange,this);
    }
    public onNewChange(evt)
    {
        if(this.sprNew)
        {
            this.sprNew.node.active = evt.detail.showNew;
        }
    }
    public onClickItem()
    {
        if(this.EvtEntryClickId==null||this.EvtEntryClickId=="")
        {
            return;
        }
        MSG.emit(this.EvtEntryClickId);
    }
    // update (dt) {}
}
