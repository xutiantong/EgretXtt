import {POOL} from "../../manager/PoolManager";
import PrefabBase from "../../component/PrefabBase";
import {ROCKET} from "../rocket/RocketManager";
import {LEVELMG} from "../level/LevelManager";
import MainRole from "./MainRole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WaringItem extends PrefabBase {

    @property(cc.Node) lineNode:cc.Node = null;

    onLoad () {
    }

    start () {
    }
    public reuse()
    {
        if(this.lineNode)
        {
            this.lineNode.scaleX=0;
        }
        this.node.active= true;
    }
    public unuse()
    {
        if(this.lineNode)
        {
            this.lineNode.scaleX=0;
        }
        this.node.active=false;
    }
    public create()
    {
        if(this.lineNode)
        {
            this.lineNode.scaleX=0;
        }
    }

    onDisable(){
    }

    public onRemove(){
        POOL.putPrefabToPool(this.node);
    }

    private _followNode:cc.Node = null;
    private _indexId:number = 0;

    public reset(idx: number) {
        this._indexId = idx;
        this._followNode = idx == 0 ? MainRole.Role.node : null;

        let seq1 = cc.sequence(cc.fadeTo(0.1, 50), cc.fadeTo(0.1, 255));
        let times = Math.random() * (LEVELMG.currentLevelData.rocket_timemax - LEVELMG.currentLevelData.rocket_timemin) + LEVELMG.currentLevelData.rocket_timemin;
        let _times = times / 4;
        let seq = cc.sequence(cc.fadeTo(_times, 50), cc.fadeTo(_times, 255));
        this.node.runAction(cc.sequence(
            cc.repeat(seq, 4),
            cc.delayTime(0.3),
            cc.repeat(seq1, 2),
            cc.callFunc(() => {
                this._followNode = null;
                let pt = this.node.getPosition();

                ROCKET.createRocketAtPosition(pt.x, times);
            }),
            cc.callFunc(() => {
                this.onRemove();
            })
        ));

        let seq2 = cc.sequence(cc.scaleTo(0.2, 0.1), cc.scaleTo(0.2, 0), cc.scaleTo(0.25, 0.5), cc.scaleTo(0.01, 0), cc.scaleTo(0.01, 0.5), cc.scaleTo(0.01, 0), cc.scaleTo(0.01, 0.5), cc.scaleTo(0.25, 1));
        if (this.lineNode) {
            this.lineNode.runAction(seq2);
        }
    }

    update() {
        if (this._followNode) {
            let rolePosX = this._followNode.position.x;
            let curPosX = this.node.position.x;
            let a = 300 - 250 * LEVELMG.currentLevelData.rocketTrack;
            let newPosX = ((a - 1.0) * curPosX + rolePosX) / a;
            this.node.setPositionX(newPosX);
        }
    }
}