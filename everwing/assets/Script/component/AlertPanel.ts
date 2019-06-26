import PanelBase from "./PanelBase";
import PopupBase from "./PopupBase";

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
export default class AlertPanel extends PopupBase {

    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(cc.Label)
    labelMsg: cc.Label = null;
    @property(cc.Button)
    btnOk: cc.Button = null;
    @property(cc.Label)
    labOk: cc.Label = null;
    @property(cc.Button)
    btnCancel: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;

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
            this.labOk.string = param.okTxt==undefined?"确定":param.okTxt;
            
            if(this._btnType== AlertPanel.Button_Type_OK){
                this.btnCancel.node.active = false;
                this.btnOk.node.x = 0;
            }else if(this._btnType == AlertPanel.Button_Type_YesNo){
                this.btnCancel.node.active = true;
                this.btnOk.node.x = -127;
            }
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
        this.btnOk.node.on(cc.Node.EventType.TOUCH_END, this.onBtnOkClick, this);
        this.btnCancel.node.on(cc.Node.EventType.TOUCH_END, this.onBtnCancelClick, this);
        this.btnClose.node.on(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);
    }

    onDisable(){
        this.btnOk.node.off(cc.Node.EventType.TOUCH_END, this.onBtnOkClick, this);
        this.btnCancel.node.off(cc.Node.EventType.TOUCH_END, this.onBtnCancelClick, this);
        this.btnClose.node.off(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);
    }


    private onBtnOkClick(evt) {
        if(this._okCallback){
            this._okCallback();
        }
        this.closePanel();
    }

    private onBtnCancelClick(evt) {
        if(this._cancelCallback){
            this._cancelCallback();
        }
        this.closePanel();
    }

    private onBtnCloseClick(evt) {
        this.closePanel();
    }

    start () {

    }

    // update (dt) {}
}
