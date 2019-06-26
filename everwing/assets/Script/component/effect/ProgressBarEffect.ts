import { MSG } from "../../message/MessageController";

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
export default class ProgressBarEffect extends cc.Component {


    @property(cc.ProgressBar)
    bar:cc.ProgressBar=null;
    
    @property
    ListenEvent:string="";

    curValue: number = 0;
    newValue:number = 1;
  

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    onEnable(){
        if(this.ListenEvent!="")
        {
            MSG.on(this.ListenEvent,this.UpdateData,this);
        }
    }
    onDisable(){
        if(this.ListenEvent!="")
        {
            MSG.off(this.ListenEvent,this.UpdateData,this);
        }
    }
    start () {

    }

    protected _useAnim:boolean = false;

    public UpdateData(e)
    {

    }
    public setNewValue(newValue:number)
    {
        console.log("经验更新", this.newValue, newValue);
        this.newValue = newValue;
    }

    private DoChange()
    {
        this.curValue+=0.02;
        if(this.curValue>this.newValue)
        {
            this.curValue = this.newValue;
        }
        if(this.curValue>1)
        {
            this.curValue = 1;
        }
        this.bar.progress = this.curValue;
    }
    update (dt) {
        if(!this._useAnim || this.curValue>=this.newValue){
            this.bar.progress = this.curValue = this.newValue;
        }else if(this.curValue<this.newValue)
        {
            this.DoChange();
        }

    }
}
