/**
 * 系统消息
 */
export default class MessageConst{
    public static Debug_loading_step:string = "kDebug_loading_step";//debug 启动
    public static Social_ReLogin:string = "kSocial_Relogin";//彻底重连通知
    public static Debug_preloading_step:string = "kDebug_preloading_step";//debug proload资源
    //登陆加载进度
    public static Loading_step_finish:string ="Loading_step_finish";

    
    //加载主界面预制
    public static Loading_mainui_prefab:string ="Loading_mainui_prefab";


    //社交平台登陆
    public static Social_Login_Finish:string ="Social_Login";
    public static Player_PageBack_Update:string ="Player_PageBack_Update";  //从后台切回
    public static Player_goBack_Update:string ="Player_goBack_Update";  //转到后台
    /**
     * 游戏内授权的通知
     */
    public static Social_Auth_Update:string ="Social_Auth_Update";
    /**
     * 游戏内授权的通知
     */
    public static Social_Login_Update_Auth:string ="Social_Login_Update_Auth";

    //农作物收获完成
    public static Farmland_Reap_Complete:string ="Farmland_Reap_Complete";
    //农作物种植完成
    public static Farmland_Plant_Complete:string ="Farmland_Plant_Complete";
    
    //农作物生长完成
    public static Farmland_Growth_Complete:string ="Farmland_Growth_Complete";
    //农田生长一半
    public static Farmland_Growth_Half:string ="Farmland_Growth_Half";
    //农场地块升级解锁
    public static Farmland_userUpgrade_Unlock:string ="Farmland_userUpgrade_Unlock";
    //农场开始解锁
    public static Farmland_Unlock_start:string ="Farmland_Unlock_start";
    //农场解锁完成
    public static Farmland_Unlock_Complete:string ="Farmland_Unlock_Complete";
    //农场立即解锁完成
    public static Farmland_Unlock_Invite_Complete:string ="Farmland_Unlock_Invite_Complete";
    //农场空地块点击
    public static FarmlandUnlock_Click:string ="FarmlandUnlock_Click";
    //农场空地块点击
    public static FarmlandGrowth_Click:string ="FarmlandGrowth_Click";
    //农场可种植位置更新
    public static Farmland_Free_Pos_Update:string ="Farmland_Free_Pos_Update";
    //农场可解锁位置更新
    public static Farland_Next_locked_update:string ="Farland_Next_locked_update";

    //用户数据界面刷新
    public static Player_Data_Change:string ="Player_Data_Change";
     //用户数据界面刷新
     public static Player_Data_Change_v1:string ="Player_Data_Change_v1";
    //用户界面更新，参数为资源类型,如果有动画在动画后更新，没有动画立即
    public static Player_Data_RefreshUI:string ="Player_Data_RefreshUI";
    //用户数据界面刷新
    public static Player_Data_Change_Value:string ="Player_Data_Change_Value";
    
    public static Seed_Unlock_Change:string ="Seed_Unlock_Change";

    //点击种子
    public static SeedItem_unlock_Click:string = "SeedItem_unlock_Click";
    public static SeedItem_Check_Can_Unlock:string = "SeedItem_Check_Can_Unlock";
    //入口UI
    public static Entry_Btn_Click_SeedShop="Entry_Btn_Click_SeedShop";
    //入口UI
    public static Entry_Btn_Click_PastureShop="Entry_Btn_Click_PastureShop";

    //农场解锁时间变更
    public static Farmland_Unlock_TimeChange:string ="Farmland_Unlock_Complete";
    //等级变化
    public static Farmland_Level_Change:string ="Farmland_Level_Change";

    //好友相关
    public static Friend_Share_In_Friend="Friend_Share_In_Friend";
    public static Friend_Share_List_Change="Friend_Share_List_Change";
    public static Friend_Recommend_List_Change="Friend_Recommend_List_Change";
    public static Friend_Verify_List_Change="Friend_Agree_List_Change";
    public static Friend_Invitation_change = "Friend_Invitation_change";  //好友邀请更新
    public static Friend_My_Friend_List_Change = "Friend_My_Friend_List_Change";
    public static Friend_Close_RedDot = "Friend_Close_RedDot";
    
    //释放或者有好友进来后刷新list
    public static Friend_Boost_Refresh:string ="Friend_Boost_Refresh";
    //小红点刷新
    public static Friend_Boost_New_Change:string ="Friend_Boost_New_Change";
    //邀请好友奖励信息刷新提示
    public static Friend_Invite_New_Change:string ="Friend_Invite_New_Change";

    public static kFriend_openFriFarm = "Friend_openFriFarm";

    //场景切换完成
    public static Scene_Change_complete:string ="Scene_Change_complete";
    //好友农场
    public static Friend_Farmland_Growth_Complete:string ="Friend_Farmland_Growth_Complete";
    public static Friend_Farmland_Steal_Click:string ="Friend_Farmland_Steal_Click";

    public static kUserLevelUp:string ="User_LevelUp";

    //提现跳转种子商店
    public static GetCashToShop:string ="GetCashToShop";

    //收获监听
    public static HarvestShare:string="HarvestShare";

    //加速
    public static AcceleratePlant:string="AcceleratePlant";

    //引导
    public static UPDATE_GUIDE:string="UPDATE_GUIDE";

    //引导隐藏
    public static GUIDE_HIDE:string="GUIDE_HIDE";

    //添加buttoneffect
    public static ADD_BUTTONEFFECT:string="ADD_BUTTONEFFECT";
    //dogStatus
    public static DogStatus:string="DogStatus";

    //商店点击
    public static Store_ItemClick:string ="Store_ItemClick";

    //刷新种子解锁界面
    public static RefreshSeedUnlockView:string="RefreshSeedUnlockView";
    public static CloseSeedUnlockView:string="CloseSeedUnlockView";

    public static kUserGMReset:string = "kUserGMReset";
    //浇水加速
    public static WaterAccleratePlant:string="WaterAccleratePlant";
	//购买动物
    public static PastureBuyAnimal:string = "PastureBuyAnimal";
    //分享狗
    public static RefreshFriendShareFive:string = "RefreshFriendShareFive";

    //关闭所有面板
    public static CloseAllPanel:string = "CloseAllPanel";

    //显示引导小手
    public static ShowHandle:string = "ShowHandle";
    //任务跳转
    public static ShowTaskJump:string ="ShowTaskJump";
    //控制任务的显示和隐藏
    public static SET_TASK_ACTIVE:string ="SET_TASK_ACTIVE";
    //更新任务UI
    public static TASK_UI_UPDATE:string="TASK_UI_UPDATE";
    //更新任务主界面UI
    public static MAINUI_TASK_UPDATE:string="MAINUI_TASK_UPDATE";
    //移动到狗位置打开分享界面
    public static MOVE_OPEN_DOG_VIEW:string ="MOVE_OPEN_DOG_VIEW";

    //更新小狗状态
    public static UPDATE_DOG_STATE:string="UPDATE_DOG_STATE";
    //狗狗宝箱cd 完成
    public static Dog_Box_CD_Finish="Dog_Box_CD_Finish";
    //更新宝箱
    public static Dog_Box_Update="Dog_Box_Update";
    //狗找箱子
    public static Dog_Find_Box="Dog_Find_Box";
    //关闭狗气泡
    public static Close_Dog_Speak="Close_Dog_Speak";
    //获取宝箱奖励
    public static Dog_Box_Get_Reward ="Dog_Box_Get_Reward";
    //更新狗窝皮肤
    public static UPDATE_DOG_HOME_ICON ="UPDATE_DOG_HOME_ICON";
    //更新狗窝升级界面
    public static UPDATE_DOG_HOME_PANEL ="UPDATE_DOG_HOME_PANEL";

    //用户升级并关闭升级面板
    public static CLOSE_USER_UPGRADE_VIEW ="CLOSE_USER_UPGRADE_VIEW";
    //登录弹出面板消息
    public static LOGIN_POP_VIEW ="LOGIN_POP_VIEW";
    //打开宝箱使用观看视频
    public static OpenTreasureBoxByWatch = "OpenTreasureBoxByWatch";
    //打开宝箱 直接打开
    public static OpenTreasureBoxByOpen = "OpenTreasureBoxByOpen";
    //升级赠送动物
    public static Push_Give_Animal ="Push_Give_Animal";
    //保存赠送的动物
    public static Save_Give_Animal:string = "Save_Give_Animal";
    //保存赠送的动物
    public static SaveAll_Give_Animal:string = "SaveAll_Give_Animal";
    //精英怪消失
    public static MonsterEliteDisable:string="MonsterEliteDisable";

    //#region everwing 相关
    public static PlayerDied:string = "PlayerDied"; 
    public static PlayerRevive:string = "PlayerRevive"; 
    
    /**
     * 游戏结束 参数 result: success 或者 fail
     */
    public static GameOver:string = "GameOver"; 
    /**
     * 击杀怪物 num 1 coinfigId 1
     */
    public static KillMonster:string ="KillMonster";
    /**
     * 击杀boss小怪
     */
    public static KillEntourage:string ="KillEntourage";
    /**
     * 退出战斗
     */
    public static ExitBattle:string ="ExitBattle";

    //#endregion
    public static AddRoundCoin:string = "AddRoundCoin";
    //doublebullet
    public static doubleBullet:string = "doubleBullet";
    //adddamage
    public static addDamage:string = "addDamage";
    public static addMagnet:string = "addMagnet";

    //创建导弹
    public static CreateSuperBullet:string ="CreateSuperBullet";
    //移动
    public static OnHandlerRoleMove:string ="OnHandlerRoleMove";

    //动画加速
    public static RushAddSpeed:string ="RushAddSpeed";
    //让怪物死亡
    public static MonsterDeath:string ="MonsterDeath";
    //使用复活状态
    public static UseReviveStatus:string = "UseReviveStatus";

    //完成新手引导
    public static FinishNewGuide:string = "FinishNewGuide";

    //显示再来一次
    public static ShowReStart:string = "ShowReStart";

    //开始游戏事件
    public static StartGame:string = "StartGame";

    //好友助力
    public static FriendFrientFromShare:string="FriendFrientFromShare";

    //好友助力添加飞机
    public static FriendFrientPlane:string="FriendFrientPlane";

    //好友助力开关战斗界面助战按钮
    public static FriendFightingBtnSwitch:string="FriendFightingBtnSwitch";
    //冲刺到boss初始化金币事件
    public static initBeforeBossGold="initBeforeBossGold";
    //显示好友助战小红点
    public static friendRedSpotShow="friendRedSpotShow";

    //显示升级面板
    public static showUpLevel="showUpLevel";
    public static hidePause = "hidePause";
    //动画完成更新数据
    public static updateMainViewData="updateMainViewData";
    //排行榜引导事件
    public static RankGuide="RankGuide";

    //新手完成引导事件
    public static GuideOver = "GuideOver";

    //新手点击事件
    public static GuideClick = "GuideClick";
}


