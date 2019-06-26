import { LEVELMG } from "../level/LevelManager";
import PrefabBase from "../../component/PrefabBase";
import { POOL } from "../../manager/PoolManager";

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
export default class StarBg extends PrefabBase {

    @property([cc.Node])
    bgNode: cc.Node[] = [];

    private _starNode: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {}

    // update (dt) {}

    refreshBgPic () {
        for (let i = 0; i < this._starNode.length; i++) {
            const element = this._starNode[i];
            POOL.putPrefabToPool(element);
        }
        this._starNode = [];
        let starPic = LEVELMG.currentLevelData.starPic;
        for (const key in starPic) {
            if (starPic.hasOwnProperty(key)) {
                let index = parseInt(key) - 1;
                if (index >= this.bgNode.length) {
                    continue;
                }

                const element = starPic[key];
                POOL.getPrefabFromPool("prefabs/star/" + element, (node: cc.Node) => {
                    node.parent = this.bgNode[index];
                    this._starNode.push(node);
                });
            }
        }
    }
}
