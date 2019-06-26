
/**
 * 网络协议
 * 
 */
export default class NetConst{

    public static NET_ConnectTimeOut:string = "-3";
    public static NET_CLOSE:string = "-2";
    public static NET_ERROR:string = "-4";
    public static ExceptionCmd :string = "-1";  
    public static NET_Connected:string = "0";
    public static NET_Connecting:string = "1";

    public static Login :string = "10001";// 登录，参数：accountId
    /**心跳 */
    public static Heart:string = "10101";
    // 农场起始11000
    public static Init:string = "11001";
    /**被顶下 */
    public static SCBeTakePlace:string = "10004";

    /*** 开启新农场 发送：  id|int|农场id 返回： 该农场的farmlandInfo */
    public static OpenFarmland:string = "11002";
    /**农场收获
     * 发送：
     * posIds|string|多个位置，";"隔开
     * 返回：
     * expInfo|JSONObject|经验
     *      exp|int|经验
     *      level|int|等级
     * farmlandInfos|JSONArray|本次采集的农田信息列表
     *      posId|int|位置id
     *      resId|int|种植物品:收获完，此时为0
     *      time|long|种植的时间:收获完，此时为0
     *      unLockedTime|long|解锁结束时间点
     * 
     *      addExp|int|本农田收获得到的经验
     *      addGold|int|本农田收获得到的金币
     *      addRedPacket|double|本农田收获得到的红包
     * 
     * resInfo|JSONArray|本次采集的获取的资源信息
     *      resId|string|资源
     *      all|int|总量*/
    public static ReqReap:string = "11004";
    /**
     * 种植 11003
     * 发送：
     * posIds|string|多个位置，";"隔开
     * resId|int|种植物品:对应resource的id
     * 返回：
     * costCount|int|花费了多少
     * goldNum|int|总共有多少
     * expInfo|JSONObject|经验
     *      exp|int|经验
     *      level|int|等级
     * farmInfo| 农田信息 */
    public static ReqPlant:string = "11003";

    
    /**
     * 获取一个农田信息：11006
     * 发送：
     * posId|int|
     * 返回：
     * posId|int|位置id
     * resId|int|种植物品:对应resource的id
     * time|long|种植的时间
     * unLockedTime|long|解锁结束时间点
     * redPacket|红包
     */
    public static ReqFarmInfo: string = "11006";
    /**
     * 获取地块加速的信息
     * 发送：
     * posId|int|
     * * 返回：
     * posId|int|位置id
     * 
     */
    public static ReqFarmlandSpeedInfo:string = "11009";

    /**
     * 获取种子信息
     */
    public static SeedList:string = "11220";
    /**
     * 请求解锁商店 
     * 发送：
     * seedId|int|
     */
    public static SeedUnlock:string = "11221";

    //分享相关
    public static NewShare:string = "11521";

    public static UpgradeLevel:string="11300";
    /**支付相关 */
    /**向游戏服务器请求购买 
     * param
     * id (int) 礼包 id
     * body(String) 登录时从账号服得到的 body
     * 
     * return
     * code  0成功 其他都是失败
     * prepay_id 成功时的支付流水号
    */
   public static requestBuy:string = "12570";

   /** 购买之前的校验
     * 发送：
     * payId|int|产品id
     * 返回：
     * uuid|String|交易id  
     */
    public static PayBefore:string = "12571";

    /** // 取消支付
    * 发送：
    * uuid|String|交易id
    * 返回：
    */
    public static PayCancel:string = "12572";

   /**
     * 获取好友列表：11140
     * 发送：无
     * 返回：
     * userId|String|用户ID
     * userFriendInfoList|List<UserFriendInfo>|朋友数据
     *     id|String|朋友uid
     *     nickName|String|名字
     *     avatarUrl|String|头像
     *     level|int|等级
     *     redPacketInfo|RedPacketInfo|红包数据
     */
    public static GetFriendList:string = "11540";

    /**
     * 验证加好友
     */
    public static VerifyFriend:string = "11142";
    /**
     * 好友申请列表：
     */
    public static FriendVerifyList:string = "11143";
    /**
     * 发起好友请求 FriendVerify 返回Boolean 证明发送成功
     */
    public static ReqAddFriend:string = "11144";
    /**
     * 请求推荐好友列表
     */
    public static ReqRecommendFriend:string = "11147";

    /**获取好友的游戏数据 */
    public static GetFriendGameData:string = "11541";
    /**
     * "stolenId":"偷取好友的","landIds":"地块Id"","identityType":"是否是NPC"
     */
    public static ReqStealFarmland:string = "11542";


    /**登陆每日奖励  */
    public static  LoginReward:string = "11501";
    /**
     * 请求好友助力列表
     */
    public static ReqFriendBoostList:string ="11550";

    /**
     * 释放好友助力
     */
    public static ReqReleaseBoostList:string ="11551";

    /**
     * 提现要求
     */
    public static WithdrawalRequirement:string = "11600"; 
    /* 
     * 金币钻石商城
     */
    public static ReqMallInfoList:string ="30001";
    /* 
     * 分享信息
     */
    public static AcceleratedSharing:string = "11610";
    /**
     * 看完视频加奖励
     */
    public static AddWatchTime:string = "11612";

    /**
     * 大宝箱看完视频加奖励
     */
    public static BoxAddWatch:string = "11014";

    /**
     * 出售大宝箱看完视频加奖励
     */
    public static SellBoxAddWatch:string = "11653";
    

    /*
     * 点击一键加速
     */
    public static AcceleratedClick:string = "11613";

    /**
     * 一键加速界面获取配置
     */
    public static AcceleratedGetConfig:string = "11620";

    /** 开始新游戏 */
    public static  StartNewGame = '10007';
    //设置引导
    public static SetGuide:string = "10203";

    //小狗引导起名字
     public static DogName:string = "11640";

    /**
     * 获取商店信息
     * 发送：无
     * 返回：
     * storeFruitList|List<StoreFruitInfo>|商店数据
     *     id|String|水果id
     *     num|int|水果数量
     */
    public static StoreGetInfo:string = "11650";
    /**
     * 出售商店物品
     * 发送：str "id;num|id;num";
     * 返回：
     * goldNum：int 获得的金币
     * goldAdd：int 增加的金币
     */
    public static StoreSellFruit:string = "11651";
     //浇水
    public static Water:string = "11011";

    //购买动物
    public static BuyAnimal:string ="11700";

    //收获苹果树
    public static CollectApple:string ="11652";
    //获取帮助狗子的好友
    public static FriendHelpDog:string = "11641";


    //任务 11120
    public static reqTaskInfo:string="11120" ; // 任务信息
    public static AwardTaskFinish:string = "11121"; // 领取任务完成奖励
    public static AwardTaskRate:string = "11122"; // 领取总任务完成百分

    //设置音乐和音效
    public static SettingMusic:string = "11015";
    //同步用户授权信息
    public static SyncUserInfo:string="11030";

    public static ReqGetDogBoxReward:string="11720";
    public static ReqUpgradeDogHome:string="11721";

    public static reqBoxInfo:string="20158";

    public static openBox:string="20159";
    //获取邀请好友的奖励
    public static InviteFriendRwd:string = "20200";
    public static GetInviteFriendRwd:string = "20201";

    //获取 为解锁地主的地块 而 邀请好友的数据
    public static UnlockInviteFriend:string = "11031";
    //解锁地主的地块
    public static UnlockInviteTile:string = "11032";

    //转盘抽奖--抽奖
    public static LotteryDraw:string = "30101";
    //转盘抽奖--初始数据
    public static LotteryDrawData:string = "30100";

    //打开农田宝箱
    public static treasureBoxOpen:string = "11731";

    //保存关卡数据
    public static SaveLevelData:string = "100";

    //分享屏蔽
    public static ShareOpen:string = "12001";
    //分享唤醒
    public static WakeUpByShare:string = "12004";

    //子弹升级
    public static BulletUpgrade:string = "12002";

    //好友助战
    public static FriendFight:string="12003";

    //授权
    public static UserAuthorize:string="12005";

    //空间跨越到boss
    public static RushToBoss:string = "12007";
    //免费复活
    public static LifeAgainFree:string = "12006";

    //ab接口
    public static ABTest:string = "12008";

    //升级接口
    public static UpLevel:string="12009";

    //领宝箱接口
    public static GetTreasureBox:string="12010";

    //新手引导同步任务进度
    public static UpdateGuide: string = "12011";

    //断线重连
    public static ReConnect:string="12012";
}


export class PushConst{
    public static UpLevelPrize:string = "20101";

    /**
    * *返回：newFarmLands|JSONArray|新解锁的地块信息
    *      posId|int|位置id
    *      resId|int|种植物品:对应resource的id
    *      time|long|种植的时间
    *      unLockedTime|long|解锁结束时间点
    *
     */
    public static newFarmland:string ="11007";
    //解锁 地块加速推送
    public static FarmLandUnlockTimeChange:string="11008";
    /**
    //推送数据更新
    // data.put("level",userBase.getLevel());
    //     data.put("diamond",userBase.getDiamond());
    //     data.put("exp",userBase.getExp());
    //     data.put("gold",userBase.getGold());
    */
    //     data.put("redPacket", userBase.getRedPacket());
    public static userBaseChange:string ="10205";
    //后台切回刷新用户信息，
    public static RefreshUserInfo:string = "10206";

    //有玩家通过分享链接进来调用
    public static PushFriendInfo:string ="11148";

    public static PushStealFriendInfo:string ="20150";
    //添加好友推送
    public static PushHaveFriendInvitation:string = "20151";
    //用户升级推送
    public static PushUserLevelUp:string = "20152";
    //用户升级推送
    public static PushFriendBoostRefresh:string = "20153";
    //小红点推送
    public static PushCloseFarmRedPoint:string = "20154";
    //小狗引导推送开关
    public static PushAbTestDogInfo:string = "20155";
    //某些功能开关
    public static PushSwitchInfo:string = "20156";
    //狗状态推送
    public static PushDogHomeStatus:string = "20157";
    //分享解锁小狗的推送
    public static PushFriendShareFriend:string = "11012";

    //邀请好友奖励推送
    public static PushInviteFriendRwd:string = "11016";

    //推送赠送的动物
    public static PushGiveAnimal:string = "20158";

    //推送好友助力
    public static FriendFightShare:string="1001";

    
    
}