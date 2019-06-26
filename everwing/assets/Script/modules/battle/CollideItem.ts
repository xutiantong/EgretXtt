import NumberUtil from "../../utils/NumberUtil";
import StringUtil from "../../utils/StringUtil";
import PrefabBase from "../../component/PrefabBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CollideItem extends PrefabBase {

    @property(cc.Node) boxNode:cc.Node = null;

    onLoad () {
    }

    start () {
    }

    // /**
    //  * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // public onCollisionStay (other, self) {
    //     // let state = false;
    //     // if (self.node.y > other.node.y) {
    //     //     state = false;
    //     // }
    //     // else {
    //     //     state = true;
    //     // }
    //     // if (state != this._zorderState) {
    //     //     this._zorderState = state;
    //     //     self.node.zIndex = 10000 - self.node.y
    //     //     other.node.zIndex = 10000 - other.node.y
    //     // }
    // }
    // /**
    //  * 当碰撞结束后调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // public onCollisionExit (other, self) {
    // }

}