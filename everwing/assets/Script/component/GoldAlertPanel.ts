import PopupBase from "./PopupBase";
import { PANEL } from "../manager/PanelManager";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import { SCENE } from "../scene/SceneManager";
import FarmScene from "../scene/FarmScene";

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
export default class GoldAlertPanel extends PopupBase {

    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(cc.Label)
    labelMsg: cc.Label = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    closeBtn: cc.Button = null;

    public static Button_Type_OK:number = 0;
    public static Button_Type_YesNo:number = 1;


    private _btnType:number = 0;
    private _title:string;
    private _msg:string;
    private _okCallback:Function;
    private _cancelCallback:Function;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }


    public onInit(param?:any){
        super.onInit();
        if(param !=undefined){
            this._btnType = param.type==undefined?0:param.type;
            this._title = param.title;
            this._msg = param.msg;
            this._okCallback = param.okcb;
            this._cancelCallback = param.cancel;
            
            this.labelMsg.string = this._msg;
            this.labelTitle.string = this._title;

            if(param.clickMaskClose!=undefined){
                this.clickMaskClose = param.clickMaskClose;
            }
            if(param.closBtnShow!=undefined){
                this.btnClose.node.active = param.closBtnShow;
            }
        }
    }
    private clickMaskClose:boolean =true;
    protected panelMaskTouch(e){
        // if(this.clickMaskClose){
        //     this.closePanel();
        // }
    }

    onEnable(){
        this.btnClose.node.on(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onOnlyClose, this);
    }

    onDisable(){
        this.btnClose.node.off(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);
        this.closeBtn.node.off(cc.Node.EventType.TOUCH_END, this.onOnlyClose, this);
    }

    private onOnlyClose(evt) {
        this.closePanel();
    }

    private onBtnCloseClick(evt) {
        this.closePanel();
        // PANEL.closeAllPopPanel();
        // MSG.emit( MessageConst.CloseAllPanel );
        
        // let farmScene:FarmScene = SCENE.currentScene as FarmScene;
        // if (farmScene) {
        //     let pos = farmScene.getCangkuPosition();
        //     farmScene.moveToPos( pos );
        // }
        // MSG.emit( MessageConst.ShowHandle );
    }

    start () {

    }

    // update (dt) {}
}
