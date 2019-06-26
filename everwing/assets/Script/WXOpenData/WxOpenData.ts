import Log from "../utils/log/Log";
import SocialAssist, { SOCIAL } from "../modules/social/SocialAssist";

declare const wx;

export interface KVData
{
    key:string;
    value:string;
}

//改动后需同步改动 项目根目录/subdomain/consts.js
export const enum WxOpenDataKeys
{
    Score = "score",
}

//改动后需同步改动 项目根目录/subdomain/consts.js
export const enum WxDomainAction
{
    FriendRank = 1,             // 好友排行榜
    GroupRank = 2,              // 群排行榜
    Surpass = 3,                // 即将超越
    RestartRank=4,              //重新开始排行
}

export interface WxDomainMessage
{
    action:WxDomainAction;
    data?:any;       //https://developers.weixin.qq.com/minigame/dev/document/open-api/context/OpenDataContext.postMessage.html
}


class WxOpenData
{
    wxSetUserCloudStorage(kvDatas:KVData[])
    {
        if (!this.checkWxOpenDataAvalible()) {
            return;
        }

        wx.setUserCloudStorage({
            KVDataList:kvDatas,
            success:res => {
                Log.debug("setUserCloudStorage success", res);
            },
            fail:res => {
                Log.debug("setUserCloudStorage fail", res);
            },
        });
    }
    
    wxPostMessageToSubDomain(msgObj:WxDomainMessage)
    {
        if (!this.checkWxOpenDataAvalible()) {
            return;
        }

        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(msgObj);
    }

    wxGetSharedCanvas()
    {
        if (!this.checkWxOpenDataAvalible()) {
            return;
        }

        const openDataContext = wx.getOpenDataContext();
        let canvas = openDataContext.canvas;
        return canvas;
    }

    updateSharedCanvas(sprite: cc.Sprite, texture: cc.Texture2D) {
        if (!this.checkWxOpenDataAvalible()) {
            return;
        }

        let sharedCanvas = this.wxGetSharedCanvas();
        texture.initWithElement(sharedCanvas);
        texture.handleLoadedTexture();
        let sf = new cc.SpriteFrame(texture);
        let sizeTexture = sf.getRect().size;
        let size = sprite.node.getContentSize;
       // console.log("updateSharedCanvas w:"+sizeTexture.width +" h:"+sizeTexture.height )
        if(Math.abs(sizeTexture.width-sizeTexture.width)<10 && Math.abs(sizeTexture.height-sizeTexture.height)<10){
            sprite.spriteFrame = sf;
        }
    }

    setSharedCanvasSize(sprite: cc.Sprite) {
        if (!this.checkWxOpenDataAvalible()) {
            return;
        }

        let sharedCanvas = this.wxGetSharedCanvas();
        sharedCanvas.width = sprite.node.width;
        sharedCanvas.height = sprite.node.height;
    }

    initSharedCanvas(sprite: cc.Sprite, actionType: WxDomainAction, key: WxOpenDataKeys) {
        if (!this.checkWxOpenDataAvalible()) {
            return;
        }
        
        this.setSharedCanvasSize(sprite);
        this.wxPostMessageToSubDomain({
            action:actionType,
            data:{key: key}
        });
    }

    checkWxOpenDataAvalible() :boolean {
        if (SOCIAL.social_type == SocialAssist.SOCIAL_Wechat) {
            return true;
        }

        return false;
    }
}

export const wxOpenData = new WxOpenData();
