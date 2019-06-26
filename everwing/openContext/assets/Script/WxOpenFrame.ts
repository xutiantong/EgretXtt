import { RM, Message_WxOpen, ActionType_WxOpen } from "./WxOpenRankManager";
import WxOpenSceneBase from "./WxOpenSceneBase";

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
export default class WxOpenRankScene extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _currScene: WxOpenSceneBase = null;
    private _sceneLoaded: string = "";
    private _sceneLoading: boolean = false;

    start () {
        RM.onMessage((res: Message_WxOpen) => {
            let sceneName = "";
            switch (res.action) {
                case ActionType_WxOpen.FriendRank:
                case ActionType_WxOpen.GroupRank:
                    sceneName = "RankScene";
                    break;
                case ActionType_WxOpen.Surpass:
                    sceneName = "SurpassScene";
                    break;
                case ActionType_WxOpen.RestartRank:
                    sceneName="restartRankScene"
                    break;
                default:
                    break;
            }
            this.switchWxOpenScene(sceneName, res);
        });
    }

    private switchWxOpenScene(sceneName: string, res: Message_WxOpen) {
        console.log("openscence");
        if (this._sceneLoaded == sceneName) {
            this._currScene.updateData(res.data);
            return;
        }

        if (this._sceneLoading) {
            return;
        }
        this._sceneLoading = true;
        cc.director.preloadScene(sceneName, () => {
            cc.director.loadScene(sceneName, () => {
                let node = cc.director.getScene().getChildByName('UICanvas');
                var scene: WxOpenSceneBase = node.getComponent(WxOpenSceneBase);
                this._currScene = scene;
                this._sceneLoading = false;
                this._sceneLoaded = sceneName;
                this._currScene.initData(res.action, res.data);
                this._currScene.updateData(res.data);
            });
        });
    }
    // update (dt) {}
}
