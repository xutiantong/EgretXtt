import { TipsManager } from "./TipsManager";
import { ZERO } from "../../GameConst";

const {ccclass, property} = cc._decorator;
@ccclass
export class TipBase extends cc.Component {
    private static TAG_TIP_ACTION: number = 10086;
    
    private _closing: boolean = false;
    private _tipPos: cc.Vec2 = cc.v2(0, 0);

    private _target:cc.Node =null;
    public show(target:cc.Node) {
        let manager = TipsManager.getManager()
        if (manager != null) {
            manager.removeTip(this);
            manager.showTip(this);
        }
        this._target = target;
        this.adjustPosition();
    }

    public adjustPosition(){
        if (this.node != null) {
            if(this._target != null)
            {
                let tpos = this._target.convertToWorldSpaceAR(ZERO)
                let pos  = tpos.add(cc.v2(0,(this._target.height+this.node.height)>>1));
                this.node.position = pos;
                let nodeRect = this.node.getBoundingBoxToWorld();
                if(nodeRect.y + nodeRect.height<=cc.winSize.height)
                {
                    if(nodeRect.x <0)
                    {
                        this.node.x += -nodeRect.x;
                    }else if(nodeRect.x + nodeRect.width>cc.winSize.width)
                    {
                        this.node.x += -(nodeRect.x + nodeRect.width-cc.winSize.width)
                    }
                }else
                {
                    let w = (this._target.width+this.node.width)>>1;
                    if(pos.x<cc.winSize.width*0.5)
                    {
                        pos = tpos.add(cc.v2(w,0));
                    }else
                    {
                        pos = tpos.sub(cc.v2(w,0));
                    }
                    this.node.position = pos;
                }
            }
            
        }
       
    }

    public remove() {
        this.willClose();
    }

    public hasToast(msg) {
        return false;
    }

    public willShow() {
        this._closing = false;
    }

    public fixWidth() {
        let scale = this.node.scale;
        if (this.node.width > cc.winSize.width) {
            scale = cc.winSize.width / this.node.width;
            this.node.scale = scale;
        }
    }

    public fixHeight() {
        let scale = this.node.scale;
        if (this.node.height > cc.winSize.height) {
            scale = cc.winSize.height / this.node.height;
            this.node.scale = scale;
        }
    }
    
    protected willClose() {
        if (this._closing) {
            return;
        }
        this._closing = true;
        this.node.removeFromParent();
    }
}