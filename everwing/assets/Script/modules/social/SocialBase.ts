// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SocialBase {
    public browserType:string ="web-mobile";
    /**
     * 0 未授权
     * 1 登陆检查到授权
     * 2 游戏内授权
     */
    public  authorizeState:number;
    public isForceAuth:boolean=false;
    public 
    constructor(bType:string)
    {
        this.browserType =bType;
    }
    /**
     * 登陆社交平台
     */
    public Login()
    {

    }
    /**
     * 登出社交平台
     */
    public LoginOut()
    {

    }
    /** 
     * 登录一个新的账号
     */
    public logAnotherAccount(newUserId:string){

    }
    /**
     * 初始化系统信息
     */
    public initSystemInfo()
    {
        
    }
    public getUserInfo()
    {

    }
    
    public SyncAuthState()
    {
        
    }
    public isHasAuth():boolean
    {
        return this.authorizeState>0;
    }
    public CheckAuthInGame():boolean
    {
        return this.isHasAuth();
    }
    public toBI(type, ext = null, isImportant = false)
    {
        // if(CC_DEBUG)
        // {
        //     if(ext)
        //     {
        //         console.log("发送Bi数据："+type);
        //         console.log(ext);
        //     }
        // }
        window["toBI"] && window["toBI"](type,ext, isImportant);
    }





}
