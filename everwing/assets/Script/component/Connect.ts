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
export default class Connect extends cc.Component {

    @property(cc.Sprite) connect: cc.Sprite = null;
    public activeState: boolean = false;


    start () {
        this.node.active = false;
    }

    public showConnect(isActive: boolean,worldPoint:cc.Vec2=null){
        this.node.active = isActive;
        this.activeState = isActive;
        this.connect.node.stopAllActions();
        if(isActive){
            if(worldPoint != null){
                this.connect.node.setPosition(this.connect.node.parent.convertToNodeSpaceAR(worldPoint));
            }else{
                this.connect.node.setPosition(cc.v2(0,0));
            }
            this.connect.node.runAction(cc.repeatForever(cc.rotateBy( 0.6,360)));
        }
    }
    
}
