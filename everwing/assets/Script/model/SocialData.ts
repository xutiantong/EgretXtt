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
export default class SocialData {
    // /**
    //  * Ip 地址
    //  */
    // public gameIp:string;
        /**
     * 服务器ip
     */
    public serverIp:string;
    /**
     * 账号Id
     */
    public accountId:string;
    /**
     * wx code
     */
    public code:string;
    /**
     * 服务器返回的Uid
     */
    public uid:string;
    //微信的openId
    public openId:string;
    public isNewUser:boolean;
    //玩家的微信账户信息
    public playerWXInfo: any = null;
    //玩家的微信加密数据
    public playerWXInfoEncryption:any = null;
    /**邀请者ＩＤ */
    public inviteOpenId:string;
    /**邀请类型，邀请好友，好友帮助 */
    public inviteType:string = null;
    /**通过分享点进来的时候会获得此次分享的shareID */
    public currentLoginShareId: string = null;

    public authorizeState:number=0;

    /**
     * 同步给服务器的数据
     */
    public roleWxData: {gender:number,icon:string,name:string} = null;
    /**
     * 获取用户性别 0：未知、1：男、2：女
     */
    public getRoleGender():number
    {
        if(this.roleWxData)
        {
            return this.roleWxData.gender;
        }
        return 0;
    }
    /**
     * 获取用户的头像
     */
    public getRoleIcon():string
    {
        if(this.roleWxData)
        {
            return this.roleWxData.icon;
        }
        return "ui/avatar/icon_man";
    }
    /**
     * 获取用户的别称
     */
    public getRoleNickName()
    {
        return this.playerWXInfo.name;
    }
    /**
     * 根据服务器初始化PlayerWxInfo
     * @param data 
     */
    public setPlayerWxInfoByServer(data:{gender:number,icon:string,name:string})
    {
        this.roleWxData = data;
    }
    /**
     * 微信服务器返回的数据 直接更新
     * @param data 
     */
    public updatePlayerWxInfoByWx(data:{gender:number,icon:string,name:string})
    {
        this.roleWxData = data;
    }
}
