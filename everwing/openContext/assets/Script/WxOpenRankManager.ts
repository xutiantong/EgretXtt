declare const wx;

export interface KVData_WxOpen
{
    key:string;
    value:string;
}

export const enum DataKeys_WxOpen
{
    Score = "score",
}

//改动后需同步改动 项目根目录/subdomain/consts.js
export const enum ActionType_WxOpen
{
    FriendRank = 1,             // 好友排行榜
    GroupRank = 2,              // 群排行榜
    Surpass = 3,                // 即将超越
    RestartRank=4,              //重新开始排行
}

export interface Message_WxOpen
{
    action:ActionType_WxOpen;
    data?:any;       //https://developers.weixin.qq.com/minigame/dev/document/open-api/context/OpenDataContext.postMessage.html
}

export interface RankCloudData_WxOpen
{
    avatarUrl: string;
    nickname: string;
    openid: string;
    KVDataList: KVData_WxOpen[];
}

export interface UserInfo_WxOpen
{
    avatarUrl: string;
    city: string;
    country: string;
    gender: number;
    language: string;
    nickName: string;
    openId: string;
    province: string;
}

class RankManager
{
    /**
      * 监听主域发送的消息
      * @param {Function} callback 
      */
     onMessage(callback) {
        wx.onMessage(data => {
            callback(data);
        });
    }

     /**
      * 获取好友托管数据
      * @param {Array} keyList 要拉取的 key 列表
      * @param {Function} success 接口调用成功的回调函数
      * @param {Function} fail    接口调用失败的回调函数
      * @returns {data:[RankCloudData_WxOpen]}
      */
    getFriendData(keyList: string[], success: Function, fail: Function) {
        wx.getFriendCloudStorage({
            keyList: keyList,
            success: res => {
                console.log("%cget friend cloud storage success", "color:green");
                success(res)
            },
            fail: res => {
                console.error("get friend cloud storage fail");
                fail(res)
            }
        });
    }

    /**
     * 获取群好友托管数据
     * @param {String} shareTicket 群分享对应的 shareTicket
     * @param {Array} keyList     要拉取的 key 列表
     * @param {Function} success     接口调用成功的回调函数
     * @param {Function} fail        接口调用失败的回调函数
     * @returns {data:[RankCloudData_WxOpen]}
     */
    getGroupCloudStorage(shareTicket: string, keyList: string[], success: Function, fail: Function) {
        wx.getGroupCloudStorage({
            shareTicket: shareTicket,
            keyList: keyList,
            success: res => {
                console.log("%cget group cloud storage success", "color:green");
                success(res)
            },
            fail: res => {
                console.error("get group cloud storage fail");
                fail(res)
            }
        });
    }

    /**
     * 获取玩家自己托管数据
     * @param {Array} keyList   要获取的 key 列表	
     * @param {Function} success   接口调用成功的回调函数
     * @param {Function} fail      接口调用失败的回调函数
     * @returns {KVDataList[{key(string):value(string)}]}
     */
    getUserCloudStorage(keyList: string[], success: Function, fail: Function) {
        wx.getUserCloudStorage({
            keyList: keyList,
            success: res => {
                console.log("%cget user cloud storage success", "color:green");
                success(res)
            },
            fail: res => {
                console.error("get user cloud storage fail");
                fail(res)
            }
        });
    }

    /**
     * 获取用户信息
     * @param {Array} openIdList    要获取信息的用户的 openId 数组，如果要获取当前用户信息，则将数组中的一个元素设为 'selfOpenId'
     * @param {Function} success       接口调用成功的回调函数
     * @returns {data:[{UserInfo_WxOpen}]}
     */
    getUserInfo(openIdList: string[],success: Function) {
        wx.getUserInfo({
            openIdList: openIdList,
            success: res => {
                console.log("%cget friend cloud storage success", "color:green");
                success(res)
            }
        });
    }

    /**
     * 创建头像
     * @param {String} avatarUrl    头像url
     * @param {cc.Sprite} content   精灵
     */
    createImage(avatarUrl: string,content: cc.Sprite) {
        try {
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    content.spriteFrame = new cc.SpriteFrame(texture);
                } catch (e) {
                    cc.log(e);
                    content.node.active = false;
                }
            };
            image.src = avatarUrl;
        }catch (e) {
            cc.log(e);
            content.node.active = false;
        }
    }

    /**
     * 把分数变为1，000，000模式显示
     * @param {Number} num  分数
     */
    getScore(num: number){
        //分数
        if (num >= 1000000) {
            var num1 = Math.floor(num/1000000);
            var num2 = Math.floor(num%1000000/1000);
            var num3 = num%1000;
            var str2 = num2.toString();
            var str3 = num3.toString();
            if (num2 < 10) {
                str2 = "00" + num2;
            }else if (num2<100) {
                str2 = "0" + num2;
            }
            
            if (num3<10) {
                str3= "00" + num3;
            }else if (num3<100) {
                str3= "0" + num3;
            }
            return num1 + "," + str2 + "," + str3;
        }
        else if (num >= 1000) {
            var num1 = Math.floor(num / 1000);
            var num2 = num % 1000;
            var str2 = num2.toString();
            if (num2 < 10) {
                str2 = "00" + num2;
            }else if (num2 < 100) {
                str2 = "0" + num2;
            }
            return num1 + "," + str2;
        }else {
            return num.toString();
        }
    }

    /**
     * 加载本地图片
     */
    lodeLocalSprite(localurl,container){
        cc.loader.loadRes(localurl, cc.SpriteFrame, function (err, spriteFrame) {
            if (err ) {
                console.log('loadLocalSprite failed: ', "[" + localurl + "]");
            } else {
                container.spriteFrame = spriteFrame;
            }
        });
    }
}

export const RM = new RankManager();