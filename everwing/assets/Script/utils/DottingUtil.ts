// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class DottingUtil  {

    // public bi_launch(launchOb:LaunchOb){
    //     // this.bi_base( BIActionConst.kActName_Launch ,launchOb)
    // } 

    public static bi_normalFun(actionKey:string ,actionData:any ,isImportant:boolean = false){
        if ( window["toBI"]){
            window["toBI"](actionKey,actionData,isImportant);
        }else{
            console.log('call BI ' + 'step : ' +  actionKey + '  extData : ',JSON.stringify(actionData));     
        }
     
    }
}


export  class BIActionConst{

    public static kActName_GameServerConnect:string = "GameServerConnect";
    public static kActName_GameServerConnectRet:string = "GameServerConnectRet";
    public static kActName_GameServerLogin:string = "GameServerLogin";
    public static kActName_GameServerLoginRet:string = "GameServerLoginRet";
    public static kActName_GameServerInit:string = "GameServerInit";
    public static kActName_GameServerInitRet:string = "GameServerInitRet";
    public static kActName_EnterGame:string = "EnterGame";

    public static kActName_OnLoadLoadingScene:string = "OnLoadLoadingScene";
    public static kActName_BeginLoadingScene:string = "BeginLoadingScene";
    public static kActName_LoadingStart:string = "LoadingStart";
    public static kActName_LoadingFinish:string = "LoadingFinish";
    public static kActName_LoadDataConfig:string = "LoadDataConfig";
    public static kActName_LoadDataConfigRet:string = "LoadDataConfigRet";
    public static kActName_DownLoadGameScene:string = "DownLoadGameScene";
    public static kActName_DownLoadGameSceneRet:string = "DownLoadGameSceneRet";
    public static kActName_CusAbtest:string = "CusAbtest";
    public static kActName_DownLoadDataCheckUpdate:string = "DownLoadDataCheckUpdate";
    public static kActName_ReqReap:string = "Receiving";//收货果实打点
    public static kActName_ReqReapRet:string = "ReceivingRet";//收货果实回调打点
    public static kActName_NewUserGuide:string = "NewUserGuide";

    public static kActName_WXShareAppMessagePre:string = "WXShareAppMessagePre";//有可分享的页面打开
    public static kActName_WXShareAppMessage:string = "WXShareAppMessage";//触发分享打点
    public static kActName_WXShareAppMessageRet:string = "WXShareAppMessageRet";//分享成功回调打点
    
    public static kActName_CusDogShareViewOpen:string = "CusDogViewOpen";//小狗面板打开
    public static kActName_CusDogShareViewClickRefuse:string = "CusDogShareViewClickRefuse";//小狗分享面板点击拒绝
    public static kActName_CusDogShareViewClickShare:string = "CusDogShareViewClickShare";//小狗分享面板点击分享
    public static kActName_CusDogClick:string = "CusDogClick";//点击小狗次数
    public static kActName_CusDogFiveFirendHelpViewOpen:string = "CusDogFiveFirendHelpViewOpen";//5人分享小狗面板打开
    public static kActName_CusDogFiveFirendHelpViewClickShare:string = "CusDogFiveFirendHelpViewClickShare";//5人分享小狗面板打开

    public static kActName_CusOpenBoxByKey:string = "CusOpenBoxByKey";// 使用要是开宝箱
    public static kActName_CusOpenBoxByShare:string = "CusOpenBoxByShare";//分享获取宝箱钥匙

    public static kActName_CusLevelUp_v2:string = "CusLevelUp_v2";//等级达到2级
    public static kActName_CusLevelUpV2_clickShare:string = "CusLevelUp_clickShare";//等级达到2级
    public static kActName_CusLevelUpV2_clickRefuse:string = "CusLevelUp_clickRefuse";//等级达到2级

    public static kActName_CusFarmLandUnlock:string = "CusFarmLandUnlocked";//解锁地块
    
    public static kActName_CusShareSpeedPlate:string = "CusShareSpeedPlate";//点击告示牌次数
    public static kActName_CusShareSpeedPlate_clickShare:string = "CusShareSpeedPlate_clickShare";//告示牌界面点击【求助】次数
    public static kActName_CusShareSpeedPlate_clickWarchTV:string = "CusShareSpeedPlate_clickWarchTV";//告示牌界面点击【观看】次数
    public static kActName_CusShareSpeedPlate_pushToPass:string = "CusShareSpeedPlate_pushToPass";//使用【一键加速】次数

    public static kActName_CusInviteFriendRwd:string = "CusInviteFriendRwd";//邀请好友得奖励
    public static kActName_CusInviteUnlock:string = "CusInviteUnlock";//邀请好友解锁地块

    public static kActName_CusOpenShop:string = "CusOpenShop";//点击商店次数
    public static kActName_CusSaled:string = "CusSaled";//商店出售道具次数

    public static kActName_CusFriendBarClick:string = "CusFriendBarClick";//点击左侧好友栏次数
    public static kActName_CusFriendUserClick:string = "CusFriendUserClick";//在好友农场偷菜的次数

    public static kActName_RequestTimeConsuming:string = "RequestTimeConsuming";//命令请求的状态信息

    public static kActName_PayBefore:string = "PayBefore";//购买申请
    public static kActName_PayBeforeRet:string = "PayBeforeRet";//购买申请返回
    public static kActName_PayCallWX_requestMidasPayment:string = "PayCallWX_requestMidasPayment";//调用wx米大师API
    public static kActName_PayMidas:string = "PayMidas";//购买米大师币
    public static kActName_PayMidasRet:string = "PayMidasRet";//购买米大师币返回
    public static kActName_PayCancel:string = "PayCancel";//取消购买商品
    public static kActName_PayCancelRet:string = "PayCancelRet";//取消购买商品返回
    public static kActName_PayBuy:string = "PayBuy";//购买商品
    public static kActName_PayBuyRet:string = "PayBuyRet";//购买商品返回

    public static kActName_KillNormalMonster = "Cus_KillNormalMonster"//杀死普通怪物
    public static kActName_KillEliteMonster = "Cus_KillEliteMonster"//杀死精英怪物
    public static kActName_KillBossMonster = "Cus_KillBossMonster"//杀死boss
    public static kActName_KillByNormalMonster = "Cus_KillByNormalMonster"//被怪物杀死
    public static kActName_KillByBossMonster = "Cus_KillByBossMonster"//被boss杀死
    public static kActName_KillByMissile = "Cus_KillByMissile"//被火箭杀死
    public static kActName_FinshOwnGame= "Cus_FinshOneGame"//完成单局游戏
    public static kActName_DoTask= "DoTask"//任务改写
    public static kActName_GameAgain= "Cus_GameAgain"//再次挑战
    public static kActName_ABTest= "ABTest"//ab打点
    public static kActName_ABTest1= "ABTest1"//小怪速度打点
}
