import FarmScene from "../scene/FarmScene";
import GameUtil from "../utils/GameUtil";

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
export default class TouchListener extends cc.Component {

    
    start () {

    }
    private _isMove:boolean = false;
    private _isStartDrag:boolean = false;
    private _longTimeDuring:number = 0.4;
    private _isLongTime:boolean = false;


    public static Touch_Start:string ="Touch_Start";
    public static Touch_Move:string ="Touch_Move";
    public static Touch_End:string ="Touch_End";
    public static Touch_Cancel:string ="Touch_Cancel";

    public static TOUCH_CLICK:string ="TOUCH_CLICK";

    public static Drag_Start:string ="Drag_Start";
    public static Drag_Move:string ="Drag_Move";
    public static Drag_End:string ="Drag_End";

    public static Touch_LongTime_Begin:string ="Touch_LongTime_Begin";
    public static Touch_LongTime_End:string ="Touch_LongTime_End";


    //开始位置
    public startLoc:cc.Vec2 = null;
    //当前位置
    public curLoc:cc.Vec2 = null;

    //是否精确点击
    public isLucencyTouch:boolean = false;
    //侦听事件的节点，默认为附加组件的节点
    private _listener:cc.Node = null;
    public setListener(node:cc.Node){
        this._listener = node;
    }
    public getListener(){
        return this._listener || this.node;
    }

    private _touchIsValid:boolean = false;

    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    /**
     * 触摸到此地图对象时被调用。
     * @param evt 
     */
    protected onTouchStart(evt:cc.Event.EventTouch) {
        this._touchIsValid = false;
        this.checkLucencyTouch(evt,()=>{
            this.getListener().emit(TouchListener.Touch_Start,this);

            this._touchIsValid = true;
            this.startLoc = evt.getStartLocation();
            this.curLoc = evt.getLocation();
            this.scheduleOnce(this.checkLongTime,this._longTimeDuring);
        });
    }


    private checkLucencyTouch(evt:cc.Event.EventTouch,callback:Function){
        if(!this.isLucencyTouch || !this.node)
        {
            callback();
            return;
        }
        var locationInNode = this.node.convertToNodeSpace(evt.getLocation());
        var size = this.node.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);
        var imgObj = this.node.getComponentInChildren(cc.Sprite).spriteFrame.getTexture().getHtmlElementObj();
        if(cc.rectContainsPoint(rect, locationInNode)){
            if(GameUtil.onLucencyTouch(imgObj,locationInNode.x,size.height-locationInNode.y)){
                callback();
            }else{
                return;
            }
        }
    }

    private checkLongTime(){
        if(!this._isMove){
            this._isLongTime = true;
            this.onLongTimeTouchBegin();
        }
    }
    private endLongTime(){
        if(this._isLongTime){
            this.onLongTimeTouchEnd();
        }
        this._isLongTime = false;
        this.unschedule(this.checkLongTime);
    }

    /**
     * 在此地图对象上点击时被调用
     * @param evt 
     */
    protected onTouchEnd(evt) {
        if(!this._touchIsValid)
            return;
       
        if(this._isMove){
            this.onDragEnd();
        }else{
            if(!this._isLongTime){
                this.onTouchClick();
            }
        }
        this._isMove= false;
        this._isStartDrag = false;
        this.endLongTime();
        this.getListener().emit(TouchListener.Touch_End,this);

    }

    protected onTouchCancel(evt){
        if(!this._touchIsValid)
            return;
        
        
        if(this._isMove){
            this.onDragEnd();
        }
        this._isMove= false;
        this._isStartDrag = false;
        this.endLongTime();
        this.getListener().emit(TouchListener.Touch_Cancel,this);

    }

    /**
     * 
     * @param evt 跟移动互斥的点击
     */
    protected onTouchClick(){
        this.getListener().emit(TouchListener.TOUCH_CLICK,this);
    }

    /**
     * 长按开始
     * @param evt 
     */
    protected onLongTimeTouchBegin(){
        this.getListener().emit(TouchListener.Touch_LongTime_Begin,this);
    }

    protected onLongTimeTouchEnd(){
        this.getListener().emit(TouchListener.Touch_LongTime_End,this);
    }
    /**
     * 在此地图对象上滑动时被调用
     * @param evt 
     */
    protected onTouchMove(evt:cc.Event.EventTouch) {
        if(!this._touchIsValid)
            return;

        this.getListener().emit(TouchListener.Touch_Move,this);

        this.startLoc = evt.getStartLocation();
        this.curLoc = evt.getLocation();
        var offx = Math.abs(this.curLoc.x - this.startLoc.x);
        var offy = Math.abs(this.curLoc.y - this.startLoc.y);
        var defaultDis = 10;    
        let vip = cc.view.getVisibleSizeInPixel();    
        let targetDpiRatio = vip.width * vip.height/(750*1134);
        defaultDis *= targetDpiRatio
        if(offx>defaultDis ||offy>defaultDis){
            this._isMove= true;
            if(!this._isStartDrag){
                this._isStartDrag = true;
                this.onDragStart();
            }
            this.onDragMove();
        }

    }

    protected onDragStart(){
        this.getListener().emit(TouchListener.Drag_Start,this);
    }

    protected onDragMove(){
        this.getListener().emit(TouchListener.Drag_Move,this);
    }

    protected onDragEnd(){
        this.getListener().emit(TouchListener.Drag_End,this);
    }

    // update (dt) {}
}
