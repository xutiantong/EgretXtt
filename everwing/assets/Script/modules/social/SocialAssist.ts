import SocialData from "../../model/SocialData";
import SocialBase from "./SocialBase";
import SocialWechatGame from "./SocialWechatGame";
import PanelManager from "../../manager/PanelManager";
import SocialWeb from "./SocialWeb";
import Log from "../../utils/log/Log";
import { GAME } from "../../model/GameData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SocialAssist{

    public static _inst:SocialAssist;
    public static getInstance():SocialAssist
    {
        return this._inst||(this._inst = new SocialAssist())
    }

    public systemInfo:any = null;
    public isIPhoneX:boolean = false;
    public isLogin:boolean = false;

    public static SOCIAL_WEB:number =0;
    public static SOCIAL_Wechat:number = 1;

   
    public social_type :number =  SocialAssist.SOCIAL_WEB;// 1=设置当前平台为微信小游戏
    public socialData:SocialData =null;
    public socialBase:SocialBase =null;
    constructor(){
        this.socialData = new SocialData();
    }
    public GetSocial():SocialBase
    {
        console.log('GetSocial():SocialBase')
        console.log(window['socialType'])
        var tempWindowType = Number(window['socialType'])
        console.log(tempWindowType)
        if (tempWindowType  ){
            if (tempWindowType == 0){
                this.social_type =SocialAssist.SOCIAL_WEB
            }else if (tempWindowType == 1){
                this.social_type =SocialAssist.SOCIAL_Wechat
            }
        }else {
            window['socialType'] = 0;
        }
        // if(cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT_GAME)
        // {
        //     return new SocialWechatGame(cc.sys.browserType);
        // }
        if(this.social_type == SocialAssist.SOCIAL_WEB){
            console.log('进入web')
            return new SocialWeb(cc.sys.browserType);
        }else if(this.social_type == SocialAssist.SOCIAL_Wechat){
            console.log('进入wechat')
            return new SocialWechatGame(cc.sys.browserType);
        }
        
        return new SocialBase(cc.sys.browserType);
    }

    public loginState()
    {

        this.socialBase = this.GetSocial();
        SOCIAL.systemInfo = window["systemInfo"];
        if(SOCIAL.systemInfo && SOCIAL.systemInfo.model.indexOf("iPhone X")>=0 )
        {
            SOCIAL.isIPhoneX = true;
            let offY = SOCIAL.systemInfo.statusBarHeight;
            console.log("SOCIAL.isIPhoneX  offY:"+offY);
            if(offY>0)
            {
                if(PanelManager.getInstance().panelHolder){
                    let w = PanelManager.getInstance().panelHolder.uiLayer.getComponent(cc.Widget);
                    if(w){
                        w.top = offY;
                        w.updateAlignment();
                    }
                }
            }
            // let offY = SOCIAL.systemInfo.statusBarHeight;
            // if(offY>0)
            // {
            //     let uiCanvas = cc.find("UICanvas");
            //     if (uiCanvas === null) {
            //         return null;
            //     }
            //     let wg = uiCanvas.getComponent(cc.Widget);
            //     wg.top = offY;
            // }
        }
        if(this.socialBase==null)
        {
            console.log('socialassist socialBase = null')
            return;
        }
        console.log('socialassist 跳过return')
        this.socialBase.initSystemInfo();
        this.socialBase.Login();
    }
}
export var SOCIAL = SocialAssist.getInstance();
