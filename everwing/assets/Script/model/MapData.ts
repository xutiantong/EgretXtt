import Log from "../utils/log/Log";

export default class MapData {
    /*** positionInfo|JsonArray|position基本信息
         *      id|int|位置id
         *      type|int|建筑类型：1农田
         *      itemId|int|建筑id
         *      collectTime|long|上次收集资源时间
         *      resBefore|int|升级或升星之前的金币
         *      timeBefore|int|升级或升星之前的时间
         *      occupyInfo|JsonObject|被占领情况
         *          uid|string|对方id
         *          openId|string|对方openId （头像的情况再看）
         *          occupyTime|long|对方占领的时间
     */

    /** 
    * farmlandInfos|JSONArray|农田信息列表
    *      posId|int|位置id
    *      resId|int|种植物品:对应resource的id
    *      time|long|种植的时间
    *      speedList|JSONArray|好友助力加速的数据
    */
    public positionInfo: any = {};
    /** dogInfo|狗的信息，具体待定*/
    public dogInfo: Array<any> = null;
    public guide: any = null;

    public parse(data: any) {
        
        Log.debug("",JSON.stringify(data.farmlandInfos))
        this.positionInfo = {};
        for (let k in data.farmlandInfos) {
            let item = data.farmlandInfos[k];
            this.positionInfo[item.posId] = item;
        }
        this.guide = data.guide;
        // this.guide.needGuide = 1;
        if (this.guide == null) {
            this.guide = {};
        }
    }

    public addPositionInfo(info:any){
        this.positionInfo[info.id] = info;
    }
}
