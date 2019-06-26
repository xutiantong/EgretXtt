import { RM, RankCloudData_WxOpen, UserInfo_WxOpen, ActionType_WxOpen } from "./WxOpenRankManager";
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
export default class WxOpenSurpassScene extends WxOpenSceneBase {

    @property(cc.Sprite)
    avatarImgSprite: cc.Sprite = null;

    private _rankData: RankCloudData_WxOpen[] = null;
    private _selfTop: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {}

    refresh (currScore: number) {
        if (this._selfTop) {
            return;
        }

        for (let i = this._rankData.length - 1; i >= 0; i--) {
            const element = this._rankData[i];
            let score = element.KVDataList.length != 0 ? element.KVDataList[0].value : 0;
            if (currScore < score && i == this._rankData.length - 1) {
                let avatarUrl = element.avatarUrl;
                this.node.active = true;
                RM.createImage(avatarUrl,this.avatarImgSprite);
                break;
            } else if (currScore > score && i == 0) {
                this._selfTop = true;
                this.node.active = false;
                break;
            } else {
                if (currScore > score) {
                    continue;
                }

                let avatarUrl = element.avatarUrl;
                this.node.active = true;
                RM.createImage(avatarUrl,this.avatarImgSprite);
                break;
            }
        }
    }

    initData (actionType: ActionType_WxOpen, data: any) {
        this.node.active = false;
        if (this._rankData == null) {
            RM.getFriendData([data.key], this.onGetFriendDataSuccess.bind(this), this.onFail.bind(this));
            return;
        }
    }

    updateData (data: any) {
        if (this._rankData == null) {
            return;
        }
        this.refresh(data.currScore)
    }

    onFail (res) {
        console.error(res);
    }

    onGetFriendDataSuccess (res) {
        // console.log("onGetFriendDataSuccess")
        // console.log(JSON.stringify(res.data))
        this._rankData = res.data;
        this._rankData.sort((a, b) => {
            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                return 0;
            }
            if (a.KVDataList.length == 0) {
                return 1;
            }
            if (b.KVDataList.length == 0) {
                return -1;
            }
            return Number(b.KVDataList[0].value) - Number(a.KVDataList[0].value);
        });

        this.refresh(0);
    }

    // update (dt) {}
}
