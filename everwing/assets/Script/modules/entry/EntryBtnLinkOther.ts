import EntryBtnBase from "./EntryBtnBase";
import { SOCIAL } from "../social/SocialAssist";
import frameClipDisplay from "../../component/frameClipDisplay";

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
export default class EntryBtnLinkOther extends EntryBtnBase {

    @property(cc.Node)
    public frameSprite:cc.Node = null;

    private frameDisplay:frameClipDisplay = null;
    public onLoad()
    {
        super.onLoad();
        // this.frameDisplay=this.frameSprite.getComponent(frameClipDisplay);
        // if(this.frameDisplay)
        // {
        //     this.frameDisplay.setFrameSheet("image/gdp/sfll","sfll",13,6);
        // }
    }


    public onClickItem()
    {
        let linkToOther = window['linkToOther'];
        if(linkToOther!=undefined)
        {
            console.log("跳转:wxeac1c69ffebd6a64");
            linkToOther("wxeac1c69ffebd6a64",{channel:"sunyou"},()=>{
                SOCIAL.socialBase.toBI("WXLinkToOther",{ret:0,toAppId:"wxeac1c69ffebd6a64"});
            },(err)=>{
                console.log(err);
                SOCIAL.socialBase.toBI("WXLinkToOther",{ret:1,detail:err});
            })
        }
    }
}
