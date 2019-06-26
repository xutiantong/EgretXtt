
export default class GameConst{

    public static LoadingScene:string="LoadScene";
    public static GameFramScene:string ="EverwingScene";
    public static UserGuideScene:string = "GuideScene";
    // public static GameFriendFarmSecne:string = "FriendFarmScene2"

    /**
     * 地块的高度
     */
    public static LandHeight :number = 116;
    /**
     * 地块高度的一半
     */
    public static LandHeightHalf :number = 53;

    public static CenterBottom :cc.Vec2 = cc.p(0.5,0);

}

export enum LoadingStep {
    platformLogin = 0,    //平台登陆完成
    configLoaded,        //配置加载完成
    serverDataInited,   //服务器数据初始化
    uiLoadComplete,     //ui加载完成
}
export enum Loading_debug_step {
    Loading_debug_step_configStart = 0,
    Loading_debug_step_configFinish = 1,
    Loading_debug_step_wxloginStart,
    Loading_debug_step_wxloginFinsh= 3,
    Loading_debug_step_loadSceneStart,
    Loading_debug_step_loadSceneFinish = 5,
    Loading_debug_step_serverLoginStart,
    Loading_debug_step_serverLoginFinish= 7,
    Loading_debug_step_serverInitFinish,
    Loading_debug_step_loadSoundStart,
    Loading_debug_step_loadSoundFinish = 10,
    Loading_debug_step_MainViewLoadStart,
    Loading_debug_step_MainViewLoadFinish,
    Loading_debug_step_loadOtherPrefabStart=13,
    Loading_debug_step_loadOtherPrefabFinish=14,
}

export const AssetConst = {
    AlertPanel: "prefabs/AlertPanel",


    MainView: "prefabs/MainView",

    NotOpenView: "prefabs/NotOpenView",

    ToastUI:"prefabs/ToastUI",

    EntryBtnView:"prefabs/EntryBtnView",

    UserLevelUpView:"prefabs/UserUpgradeView",
    EveryDayPanel:"prefabs/EveryDayPanel",


    BattleBg: "prefabs/battleBg",
    MainRole: "prefabs/MainRole",
    BulletItem: "prefabs/BulletItem",
    EnemyBulletItem: "prefabs/EnemyBulletItem",
    EnemyBullet2Item: "prefabs/EnemyBullet2Item",
    EnemyBullet3Item: "prefabs/EnemyBullet3Item",
    EnemyBullet4Item: "prefabs/EnemyBullet4Item",
    EnemyBullet5Item: "prefabs/EnemyBullet5Item",
    EnemyBulletTreeItem: "prefabs/EnemyBulletTreeItem",
    MonsterItem: "prefabs/MonsterItem",
    MonsterItemBlink: "prefabs/MonsterItemBlink",
    DropItem: "prefabs/drop",
    MonsterEliteItem: "prefabs/MonsterEliteItem",
    MonsterBatBossItem: "prefabs/MonsterBatBossItem",
    MonsterTreeBossItem: "prefabs/MonsterTreeBossItem",
    MonsterWitchBossItem: "prefabs/MonsterWitchBossItem",
    MonsterSplitBossItem: "prefabs/MonsterSplitBossItem",
    MonsterSplitBossBigItem: "prefabs/MonsterSplitBossBigItem",
    MonsterSplitBossMidItem: "prefabs/MonsterSplitBossMidItem",
    WaringItem: "prefabs/WaringItem",
    EnemySuperBullet: "prefabs/EnemySuperBullet",
    BattleResoutView: "prefabs/BattleResoutView",
    MonsterBeHurt: "prefabs/MonsterBeHurt",
    BossBeHurt: "prefabs/BossBeHurt",
    // MonsterDie: "prefabs/MonsterDie",
    MonsterDie: "prefabs/MonsterDeath",
    AddNumItem: "prefabs/addnumitem",
    Warning: "prefabs/tiaozi",
    SideTips: "prefabs/SideTips",
    MonsterWitchEntourageItemFire: "prefabs/MonsterWitchEntourageItemFire",
    MonsterWitchEntourageItemWater: "prefabs/MonsterWitchEntourageItemWater",
    MonsterWitchEntourageItemWind: "prefabs/MonsterWitchEntourageItemWind",

    OpenContinueView: "prefabs/OpenContinueView",
    OverContinueView: "prefabs/OverContinueView",
    RankView: "prefabs/RankView",
    GuideLeft:"prefabs/GuideLeft",
    GuideRight:"prefabs/GuideRight",
    BulletUpgradeView: "prefabs/BulletUpgradeView",
    ReStartView:"prefabs/ReStartView",
    FriendFight:"prefabs/FriendFight",
    GuideScene:"prefabs/UserGuideView",
    UserAuthorize:"prefabs/UserAuthorize",
    FriendPlane:"prefabs/FriendPlane",
    PlaneBullet:"prefabs/PlaneBullet",
    UITouchLock:"prefabs/UITouchLock",
    StarBg: "prefabs/StarBg",
    Upgradepanel:"prefabs/Upgradepanel",
    BoxReward:"prefabs/BoxReward",
    GuideHandView: "prefabs/GuideHandView",
};

export const CommonStr = {
    noEnoughGold: "没金币啦，多种点农作物卖掉吧",
};
export const ConfigConst = {
    // POSITION: "position",
    //FARMLAND: "farmland",
    //EXP:"exp",
    RESOURCE:"resource",
    //SEEDS:"seeds",
    LEVEL:"level",
    SHARE:"share",
    //GUIDE:"guide_new",
    LOGINREWARD:"login_reward",
    PRIZE:"prize",
    CONSTANT:"constant",
	//FRUIT:"fruit",
    //LINE:"line",
    TASK:"mission",
    //TASKCHAPTER:"mission_chapter",
    //TASKTYPE:"mission_type",
    TREASUREBOX:"treasure_box",
    //InviteRwd:"invite_rewards",
    ROULETTE:"roulette",
    RESURGENCE:"resurgence",
    BULLET:"bullet",
    BOSS:"boss",
    RANK:"rank",
    MESSAGE:"message",
};
export const ResourceConst = {
    Diamond:1,
    Gold:2,
    Exp:3,
    DogFood:4,
    RedPacket:5,
    /**
     *狗舍材料
     */
    DogHomeMaterial:6,
    Trophy:7,
};

export const AtlasAssetConst = {
    SEED: "image/seed/seed",
    ANIMAL: "image/animal/animal",
    Common: "ui/newui/component/common_1_atlas",
    Zhuyemian: "ui/newui/zhuyemian/zhuyemian_atlas",
    Imgtxt: "ui/newui/imgtxt/imgtxt_atlas",
};

export const BossConst = {
    None:0,
    MonsterBatBossItem:1,
    MonsterTreeBossItem:2,
    MonsterWitchBossItem:3,
    MonsterSplitBossItem:4,

    BOSS_SHOW_DELAY_TIME: 1
};

export const EntourageConst = {
    Fire:301,
    Water:302,
    Wind:303,
};
export const ZERO = cc.v2(0, 0);

/**
 * 掉落类型
 */
export const DropItemType = {
    Gold: 101,                // 金币
    Diamond1: 102,             // 钻石 +10金币
 Diamond2: 103,             // 钻石 +20金币
Diamond3: 104,             // 钻石 +40金币

    Trophy: 105,              // 奖杯
Trophy1: 106,              // 铜杯+5杯
Trophy2: 107,              // 银杯+10杯
Trophy3: 108,              // 金杯+20杯

    DoubleBullet: 1001,     // 双枪
    AddDamage: 1002,        // 加伤害
    RushAddSpeed: 1003,     // 冲刺
    AddMagnet: 1004,        // 磁铁
};

/**
 * 火箭类型
 */
export const RocketType = {
    None: 0,                // 无火箭
    Single: 1,              // 单个
    Row: 2,                 // 成排
    Storm: 3,               // 双排
    Random: 4,              // 上面三种类型随机 必出火箭
};

export const monsterTypeID={
    MonsterBoomID:202,
    MonsterTreasureID:203,
};

export const BossConfig = [
    {id:BossConst.MonsterBatBossItem,need:0},
    {id:BossConst.MonsterTreeBossItem,need:0},
    {id:BossConst.MonsterSplitBossItem,need:0},
    {id:BossConst.MonsterWitchBossItem,need:3},
];


