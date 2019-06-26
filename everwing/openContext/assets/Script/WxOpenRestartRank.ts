
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
export default class WxOpenRestartRank extends WxOpenSceneBase {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    contentNode: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    private _rankData: RankCloudData_WxOpen[] = null;
    private _selfInfo: UserInfo_WxOpen = null;
    private _littlenum:number=1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    initData(actionType: ActionType_WxOpen, data: any) {
        RM.getFriendData([data.key], this.onGetFriendDataSuccess.bind(this), this.onFail.bind(this));
    }

    onGetFriendDataSuccess (res) {
        // console.log("onGetFriendDataSuccess")
        // console.log(JSON.stringify(res.data))
        this._rankData = res.data;

        RM.getUserInfo(["selfOpenId"], this.onGetUserInfoSuccess.bind(this));
    }

    onGetUserInfoSuccess (res) {
        // console.log("onGetUserInfoSuccess")
        // console.log(JSON.stringify(res.data))
        this._selfInfo = res.data[0];
        var rankdatas=this.getDatas();
        this.draw(rankdatas);
    }

    //获取本人前后共三个人的数据
    private getDatas(){
        var rankdatas=[];
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
        let isSelf = false;
        for (let i = 0; i < size; i++) {
            const element = this._rankData[i];
            if(this._selfInfo.avatarUrl==element.avatarUrl){
                isSelf=true;
                if(i==0){
                    this._littlenum=i;
                    rankdatas.push(this._rankData[i]);
                    if(this._rankData[i+1]){
                        rankdatas.push(this._rankData[i+1]);
                    }
                    if(this._rankData[i+2]){
                        rankdatas.push(this._rankData[i+2]);
                    }
                    return rankdatas;
                }else if(i==size-1){
                    this._littlenum=i-2;
                    if(this._rankData[i-2]){
                        rankdatas.push(this._rankData[i-2]);
                    }
                    if(this._rankData[i-1]){
                        rankdatas.push(this._rankData[i-1]);
                    }
                    rankdatas.push(this._rankData[i]);
                    return rankdatas;
                }else{
                    this._littlenum=i-1;
                    if(this._rankData[i-1]){
                        rankdatas.push(this._rankData[i-1]);
                    }
                    rankdatas.push(this._rankData[i]);
                    if(this._rankData[i+1]){
                        rankdatas.push(this._rankData[i+1]);
                    }
                    return rankdatas;
                }
            }
        }
    }
    private draw (rankdatas) {
        this.contentNode.removeAllChildren();
        let size = rankdatas.length;
        for (let i = 0; i < size; i++) {
            let isSelf = false;
            const element = rankdatas[i];
            if(this._selfInfo.avatarUrl==element.avatarUrl){
                isSelf=true;
                
            }
            var item = cc.instantiate(this.itemPrefab);
            item.getComponent('WxOpenRankItem').init(this._littlenum, element,isSelf);
            this.contentNode.addChild(item);
            this._littlenum++;
        }
    }

    onFail (res) {
        console.error(res);
    }

}
