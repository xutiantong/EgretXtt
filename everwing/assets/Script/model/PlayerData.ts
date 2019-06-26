/**"bossId":2,"checkpointId":1,"energyPotion":2,"gold":300.0,"level":0,"strengthen":0,"trophy":0.0,"uid":"693739521","updateTime":1538101134915 */
export class PlayerData {

    /** 玩家名*/
    public playerName:string = "Unknown";

    /** 经验*/
    public exp: number = 0;

    /** 等级*/
    public level:number = 1;
    
    /** 金币*/
    public gold:number = 0;

    /**红包 */
    public redPacket:number = 0;
    
    /** 钻石*/
    public diamond: number = 0;

    /** 性别*/
    public gender: number = 0;

    /** 头像*/
    public icon: string = null;

    // /**体力 */
    // public power:number = 0;

    // /**最大体力 */
    // public maxpower:number;

    // /**友情点数，分享使用 */
    // public friendShipPoint:number;

    // /**今日头去 */
    // public todaySteal:number;

    // /**开始恢复体力的时间 */
    // public powerTime:number;

    // /** 今天占领次数*/
    // public occupyCountToday:number;
    // /**今天点击获取钻石等的次数 */
    // public specialCountToday:number;
    // /** 占领情况
    //  *  occupyInfo|jsonArray|占领情况
    // *          uid|string|对方玩家
    // *          pos|int|占领的位置
    // *          state|int|占领的状态：占领中，占领完成，被监禁
    // *          time|long|占领起始时间戳
    // */
    // public occupyInfo: Array<any> = null;

    // /**当前排行榜金币数据 */
    // public rankGold: number = null;

    /** GM标记 */
    public GM:number = 0;
    
    public RoleData:RoleData=null;

    public RushBossData:RushBossData=null;

    public parse(info: any) {
      
        let role = this.RoleData;
        if (!role ){
            role = new RoleData();
        }
        if (info.bossId!=undefined) {
            role.bossId = info.bossId;
        }
        if (info.checkpointId!=undefined) {
            role.checkpointId = info.checkpointId;
        }
        if (info.energyPotion!=undefined) {
            role.energyPotion = info.energyPotion;
        }
        if (info.gold!=undefined) {
            role.gold = info.gold;
        }
        if (info.level!=undefined) {
            role.level = info.level;
        }
        if (info.strengthen!=undefined) {
            role.strengthen = info.strengthen;
        }
        if (info.trophy!=undefined) {
            role.trophy = info.trophy;
        }
        if (info.uid!=undefined) {
            role.uid = info.uid;
        }
        if (info.updateTime!=undefined) {
            role.updateTime = info.updateTime;
        }
        if (info.maxScore!=undefined) {
            role.maxScore = info.maxScore;
        }

        if (info.open!=undefined) {
            role.open = info.open;
        }
        if (info.bullet!=undefined) {
            role.bullet = info.bullet;
        }
        if (info.gameNumber!=undefined) {
            role.gameNumber = info.gameNumber;
        }
        if (info.guideTimes!=undefined) {
            role.guideTimes = info.guideTimes;
        }
        if (info.lifeTimes!=undefined) {
            role.lifeTimes = info.lifeTimes;
        }
        if (info.exp!=undefined) {
            role.exp = info.exp;
        }
        if (info.masterSpeed!=undefined) {
            role.masterSpeed = info.masterSpeed;
        }
        if (info.guideStep!=undefined) {
            role.guideStep = info.guideStep;
        }
        if(info.reconnectTime!=undefined){
            role.reconnectTime=info.reconnectTime;
        }
        if(info.totalScore!=undefined){
            role.totalScore=info.totalScore;
        }
        this.RoleData = role;
    }

    /**
     * 更新冲到boss数据
     */
    public praseRushBossData(info:any){
        let connectData = this.RushBossData;
        if (!connectData ){
            connectData = new RushBossData();
        }
        if(info.lashScore!=undefined){
            connectData.lashScore=info.lashScore;
        }
        if(info.bossId!=undefined){
            connectData.bossId=info.bossId;
        }
        if(info.energyNum!=undefined){
            connectData.energyNum=info.energyNum;
        }
        this.RushBossData=connectData;
    }
}

/**
 * 打飞机的角色数据
 */
export class RoleData {
    /**
     * 当前bossId
     */
    public bossId: number=0;
    /**
     * 当前关卡id
     */
    public checkpointId: number=0;
    /**
     * 能量id
     */
    public energyPotion: number=0;
    /**
     * 金币
     */
    public gold: number=0;
    /**
     * 等级
     */
    public level: number=0;
    /**
     * 强化等级
     */
    public strengthen: number=0;
    /**
     * 奖杯
     */
    public trophy: number=0;
    public uid: string="";
    /**
     * 更新时间
     */
    public updateTime: number=0;
    /**
     * 最高分
     */
    public maxScore: number=0;
    

    /**
     * 是否屏蔽分享
     */
    public open: number=0;

    /**
     * 子弹等级
     */
    public bullet: number=0;

    public gameNumber: number=0;

    public guideTimes: number=0;

    /**
     * 剩余免费复活次数
     */
    public lifeTimes: number=0;

    /**
     * 总分数
     */
    public totalScore: number=0;

    /** 经验*/
    public exp: number=0;
    public masterSpeed: number=0;

    /**
     * 新手引导步骤
     */
    public guideStep: number=0;

    /**
     * 时间戳
     */
    public reconnectTime:number=0;
}

/**
 * 冲刺到boss数据
 */
export class RushBossData{
    /**
     * 分数
     */
    public lashScore:number=0;
    /**
     * bossid
     */
    public bossId:number=0;
    /**
     * 能量瓶数量
     */
    public energyNum:number=0;
}

