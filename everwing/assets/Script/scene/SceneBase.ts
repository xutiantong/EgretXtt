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
export default class SceneBase extends cc.Component {

    @property(cc.Node)
    zoomLayer: cc.Node = null;
    @property(cc.Node)
    tipLayer: cc.Node = null;
    @property(cc.Node)
    topLayer: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    protected _scorllView: cc.ScrollView = null;

    private _isMoving:boolean = false;
    private _oriSizeW:number = 0;
    private _oriSizeH:number = 0;

    onLoad () {
        if (this.zoomLayer != null) {
            this._scorllView = this.zoomLayer.getComponent(cc.ScrollView);
            this._oriSizeW = this._scorllView.content.getContentSize().width;
            this._oriSizeH = this._scorllView.content.getContentSize().height;
        }

    }

    /**
     * 设置滚动窗是否滚动
     * @param val 是否滚动
     */
    public setScrollEnable(val:boolean){
        if(this._scorllView!=undefined){
            this._scorllView.horizontal = this._scorllView.vertical = val;
        }
    }


    //场景移除时候的操作
    public onRemove(){

    }
    //场景恢复时候的操作
    public onResume(){

    }
    start () {

    }

    public getGuideNode(key:string, value:string=""):cc.Node {
        return null;
    }

    /**
     * 设置视图位置
     * @param pos 位置2d坐标
     */
    private _tmpLocalPos:cc.Vec2 = cc.p(0,0);
    public moveToPos(worldPos:cc.Vec2=cc.p(0, 0) ,scale:number=0, during:number = 0.4,cb:Function=null){
        if(this._scorllView==undefined){
            this._scorllView = this.zoomLayer.getComponent(cc.ScrollView);
        }
        if(this._scorllView!=undefined){
            this.StopScorllViewAction();
            this._scorllView.enabled = false;
            if (worldPos.x==0 && worldPos.y==0) {
                worldPos = cc.p(cc.winSize.width/2, cc.winSize.height/2);
            }

            this._tmpLocalPos = this._scorllView.content.convertToNodeSpaceAR(worldPos);
            let endPos = cc.p(0,0);

            let pos1 = this._scorllView.content.getPosition();
            endPos.x += (cc.winSize.width/2 - worldPos.x + pos1.x);
            endPos.y += (cc.winSize.height/2 - worldPos.y + pos1.y);

            if (scale > 0) {
                endPos = this.getEndPos(scale, this._tmpLocalPos, endPos);
            } else {
                scale = this._scorllView.content.getScale();
            }
            this.checkPos(endPos);

            let act = cc.spawn( cc.moveTo( during, endPos), cc.scaleTo( during, scale) );
            var move = (cb!=null)?cc.sequence( act,cc.callFunc(cb)):act;
            this._isMoving = true;
            this._scorllView.content.runAction(cc.sequence(move,cc.callFunc(()=>{
                this._isMoving = false;
                this._scorllView.enabled = true;
            })));
            
        }
    }

    private getEndPos( scale:number=1.0 , pt:cc.Vec2, endPt:cc.Vec2 ):cc.Vec2 {
        let curScale = this._scorllView.content.getScale();
        let scaleVal = scale;
        let curPos = pt;

        let tmpSizeW  = this._oriSizeW * scaleVal;
        let tmpSizeH  = this._oriSizeH * scaleVal;
        this._scorllView.content.setContentSize( cc.size(tmpSizeW, tmpSizeH) );

        let maxW = this._oriSizeW/2;
        let maxH = this._oriSizeH/2;
        let offX = curPos.x - maxW;
        let offY = curPos.y - maxH;
        let addX = offX*(scaleVal-curScale);
        let addY = offY*(scaleVal-curScale);

        let pos = endPt;

        pos.x -= addX + maxW*(scaleVal-curScale);
        pos.y -= addY + maxH*(scaleVal-curScale);

        return pos;

    }

    //cok缩放写法
    // public testScale()
    // {
    //     let curPos = this._tmpLocalPos;

    //     let curScale = this._scorllView.content.getScale();
    //     let scaleVal = 1.3;
    //     let _wf:number = 0.5;
    //     let _hf:number = 0.5;
    //     let maxW = this._scorllView.content.width;
    //     let maxH = this._scorllView.content.height;
    //     let orArc = this._scorllView.content.getAnchorPoint();

    //     this._scorllView.content.setScale(scaleVal);

    //     let anchor = cc.p(maxW*orArc.x, maxH*orArc.y);
    //     anchor = anchor.mul( 1.0- scaleVal );

    //     let endX = cc.winSize.width*_wf - curPos.x*scaleVal - anchor.x;
    //     let endY = cc.winSize.height*_hf - curPos.y*scaleVal - anchor.y;

    //     this._scorllView.content.setScale(curScale);

    //     let act = cc.spawn( cc.moveTo( 10, cc.p(endX, endY)), cc.scaleTo( 10, scaleVal) )
    //     this._isMoving = true;
    //     this._scorllView.content.runAction(cc.sequence(act,cc.callFunc(()=>{
    //         this._isMoving = false;
    //     })));

    // }

    public tmpMoveToPos( worldPos:cc.Vec2,during:number = 0.4,cb:Function=null) {
        if(this._scorllView==undefined){
            this._scorllView = this.zoomLayer.getComponent(cc.ScrollView);
        }
        if(this._scorllView!=undefined){
            // worldPos.x += this._scorllView.content.position.x;
            // worldPos.y += this._scorllView.content.position.y;
            // worldPos.x -= cc.winSize.width / 2;
            // worldPos.y -= cc.winSize.height / 2;    

            // this._scorllView.content.resumeAllActions();
            // this._scorllView.stopAutoScroll();
            // let pos = this._scorllView.content.convertToNodeSpaceAR(worldPos);
            // pos = new cc.Vec2(-pos.x,-pos.y);
            // this.checkPos(pos);
            var move = (cb!=null)?cc.sequence( cc.moveTo(during,worldPos),cc.callFunc(cb)):cc.moveTo(during,worldPos);
            this._isMoving = true;
            this._scorllView.content.runAction(cc.sequence(move,cc.callFunc(()=>{
                this._isMoving = false;
            })));
        }
    }

    public moveByPos(pos:cc.Vec2,during:number = 0.4,cb:Function=null){
        if(this._scorllView==undefined){
            this._scorllView = this.zoomLayer.getComponent(cc.ScrollView);
        }
        if(this._scorllView!=undefined){
            this._scorllView.content.resumeAllActions();
            var posEnd:cc.Vec2 = this._scorllView.content.position.add(pos);
            this.checkPos(posEnd);
            var move = (cb!=null)?cc.sequence( cc.moveTo(during,posEnd),cc.callFunc(cb)):cc.moveTo(during,posEnd);
            this._isMoving = true;
            this._scorllView.content.runAction(cc.sequence(move,cc.callFunc(()=>{
                this._isMoving = false;
            })));
        }
    }

    private checkPos(pos:cc.Vec2){
        let contentWidth = this._scorllView.content.width - cc.winSize.width; //移动范围
        let contentHeight = this._scorllView.content.height- cc.winSize.height;//移动范围
        let minX = -cc.winSize.width/2-contentWidth;
        let minY = -cc.winSize.height/2-contentHeight;

        if (pos.x < minX) {
            pos.x = minX;
        } else if (pos.x > -cc.winSize.width/2) {
            pos.x = -cc.winSize.width/2;
        }

        if (pos.y < minY) {
            pos.y = minY;
        } else if (pos.y > -cc.winSize.height/2) {
            pos.y = -cc.winSize.height/2;
        }
        
    }

    
    public get isMoveing(){
        return this._isMoving ||this._scorllView.isScrolling() || this._scorllView.isAutoScrolling();
    }

    public StopScorllViewAction() {
        this._scorllView.stopAutoScroll();
    }

    public flyItem(posId:number, itemId:number, num:number=0, othId:string="") {

    }

    public getScorllViewScale () {
        return this._scorllView.content.scale;
    }

    // update (dt) {
    //     let pos = this._scorllView.content.getPosition();
    //     cc.log("x : %d  ,  y: %d ", pos.x, pos.y);
    // }
}
