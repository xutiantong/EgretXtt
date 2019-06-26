import { ActionType_WxOpen, RM, DataKeys_WxOpen, RankCloudData_WxOpen, UserInfo_WxOpen, Message_WxOpen } from "./WxOpenRankManager";
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
export default class WxOpenRankScene extends WxOpenSceneBase {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    contentNode: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.Sprite)
    avatarImgSprite: cc.Sprite = null;
    @property(cc.Label)
    rankLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Node)
    rankNode: cc.Node = null;

    private _rankData: RankCloudData_WxOpen[] = null;
    private _selfInfo: UserInfo_WxOpen = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    initData(actionType: ActionType_WxOpen, data: any) {
        switch (actionType) {
            case ActionType_WxOpen.FriendRank: //好友
                RM.getFriendData([data.key], this.onGetFriendDataSuccess.bind(this), this.onFail.bind(this));
                break;
            case ActionType_WxOpen.GroupRank: //群
                RM.getGroupCloudStorage(data.shareTicket, [data.key], this.onGetGroupDataSuccess.bind(this), this.onFail.bind(this));
                break;
            default:
                break;
        }
    }

    onEnable(){
        this.node.on("initSelfData",this.initself,this);
    }
    
    onDisable(){
        this.node.off("initSelfData",this.initself,this);
    }

    draw () {
        this.contentNode.removeAllChildren()
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
        let size = this._rankData.length;
        let haveself=false;
        
        for (let i = 0; i < size; i++) {
            let isSelf = false;
            const element = this._rankData[i];
            if(this._selfInfo.avatarUrl==element.avatarUrl){
                isSelf=true;
                haveself=true;
                this.initself({"rank":i,"data":element});
            }

            if (i >= 10) {
                if (haveself) {
                    break;
                }
                continue;
            }
            
            var item = cc.instantiate(this.itemPrefab);
            item.getComponent('WxOpenRankItem').init(i, element,isSelf);
            this.contentNode.addChild(item);
        }
    }

    initself(mydata){
        if(this.rankNode.active==false){
            this.rankNode.active=true;
        }
        this.rankLabel.string=mydata.rank+1;
        this.nameLabel.string=mydata.data.nickname;
        var score=mydata.data.KVDataList.length != 0 ? mydata.data.KVDataList[0].value : 0;
        this.scoreLabel.string=RM.getScore(score);
        RM.createImage(mydata.data.avatarUrl,this.avatarImgSprite);
    }

    onFail (res) {
        console.error(res);
    }
    
    onGetGroupDataSuccess (res) {
        // console.log("onGetGroupDataSuccess")
        // console.log(JSON.stringify(res.data))
        this._rankData = res.data;
        this.draw();
    }

    onGetFriendDataSuccess (res) {
        // console.log("onGetFriendDataSuccess")
        // console.log(JSON.stringify(res.data))
        this._rankData = res.data;

        RM.getUserInfo(["selfOpenId"], this.onGetUserInfoSuccess.bind(this));
    }

    // onGetUserDataSuccess (res) {
    //     console.log("onGetUserDataSuccess")
    //     console.log(JSON.stringify(res.data))
    //     this.selfRankData = res.data;

    //     rankManager.getUserInfo(['selfOpenId'], onGetUserInfoSuccess);
    // }

    onGetUserInfoSuccess (res) {
        // console.log("onGetUserInfoSuccess")
        // console.log(JSON.stringify(res.data))
        this._selfInfo = res.data[0];
        this.draw()
    }

    // update (dt) {}
}
