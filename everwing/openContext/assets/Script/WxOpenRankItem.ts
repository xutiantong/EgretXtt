import { RM, RankCloudData_WxOpen } from "./WxOpenRankManager";

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
export default class WxOpenRankItem extends cc.Component {

    @property(cc.Sprite)
    avatarImgSprite: cc.Sprite = null;
    @property(cc.Label)
    rankLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Sprite)
    bgImg: cc.Sprite = null;
    @property(cc.Sprite)
    chartImg: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    init(rank: number, data: RankCloudData_WxOpen, isSelf: boolean) {
        let avatarUrl = data.avatarUrl;
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        this.rankLabel.string = RM.getScore(rank + 1);
        RM.createImage(avatarUrl,this.avatarImgSprite);
        this.nameLabel.string = nick;
        this.scoreLabel.string = grade.toString();
        //是自己
        if(isSelf){
            RM.lodeLocalSprite("ui/charts/zikuai",this.bgImg);
        }
        if(rank==0){
            this.chartImg.node.active=true;
            this.rankLabel.node.active=false;
            this.nameLabel.node.color=cc.color(255,198,0);
            this.scoreLabel.node.color=cc.color(255,198,0);
            RM.lodeLocalSprite("ui/charts/di1",this.chartImg);
        }else if(rank==1){
            this.chartImg.node.active=true;
            this.rankLabel.node.active=false;
            this.nameLabel.node.color=cc.color(255,198,0);
            this.scoreLabel.node.color=cc.color(255,198,0);
            RM.lodeLocalSprite("ui/charts/di2",this.chartImg);
        }else if(rank==2){
            this.chartImg.node.active=true;
            this.rankLabel.node.active=false;
            this.nameLabel.node.color=cc.color(255,198,0);
            this.scoreLabel.node.color=cc.color(255,198,0);
            RM.lodeLocalSprite("ui/charts/di3",this.chartImg);
        }
    }
    // update (dt) {}
}
