import { BuffType, BuffCalculateType, BuffOverlap, BuffShutDownType } from "./BuffBase";

let buff={
    /**
     * 双倍子弹
     */
    "1":{
        /// <summary>
        /// BuffID
        /// </summary>
        BuffID:1,
        /// <summary>
        /// Buff类型
        /// </summary>
        BuffType:BuffType.DoubleBullet,
        /// <summary>
        /// 执行此
        /// </summary>
        BuffCalculate:BuffCalculateType.Once, //= BuffCalculateType.Loop;
        /// <summary>
        /// 叠加类型
        /// </summary>
        BuffOverlap:BuffOverlap.ResterTime, //= BuffOverlap.StackedLayer;
        /// <summary>
        /// 消除类型
        /// </summary>
        BuffShutDownType:BuffShutDownType.All,// = BuffShutDownType.All;
        /// <summary>
        /// 如果是堆叠层数，表示最大层数，如果是时间，表示最大时间
        /// </summary>
        MaxLimit:10,// = 0;
        /// <summary>
        /// 执行时间
        /// </summary>
        Time:10,// = 0;
        /// <summary>
        /// 间隔时间 不是频率的就是填写0
        /// </summary>
        CallFrequency:0,//=1;
        /// <summary>
        /// 双倍
        /// </summary>
        Num:2,

    },
    /**
     * 增加攻击力
     */
    "2":{
            /// <summary>
        /// BuffID
        /// </summary>
        BuffID:2,
        /// <summary>
        /// Buff类型
        /// </summary>
        BuffType:BuffType.AddAttack,
        /// <summary>
        /// 执行此
        /// </summary>
        BuffCalculate:BuffCalculateType.Once, //= BuffCalculateType.Loop;
        /// <summary>
        /// 伤害叠加
        /// </summary>
        BuffOverlap:BuffOverlap.StackedLayer, //= BuffOverlap.StackedLayer;
        /// <summary>
        /// 消除类型
        /// </summary>
        BuffShutDownType:BuffShutDownType.All,// = BuffShutDownType.All;
        /// <summary>
        /// 如果是堆叠层数，表示最大层数，如果是时间，表示最大时间
        /// </summary>
        MaxLimit:Number.MAX_VALUE,// = 0;
        /// <summary>
        /// 执行时间
        /// </summary>
        Time:Number.MAX_VALUE,// = 0;
        /// <summary>
        /// 间隔时间 不是频率的就是填写0
        /// </summary>
        CallFrequency:0,//=1;
        /// <summary>
        /// 双倍
        /// </summary>
        Num:5,
    },
    /**
     * 磁铁 吸收道具
     */
    "3":{
        /// <summary>
    /// BuffID
    /// </summary>
    BuffID:3,
    /// <summary>
    /// Buff类型
    /// </summary>
    BuffType:BuffType.Magnet,
    /// <summary>
    /// 执行此
    /// </summary>
    BuffCalculate:BuffCalculateType.Once, //= BuffCalculateType.Loop;
    /// <summary>
    /// 时间叠加
    /// </summary>
    BuffOverlap:BuffOverlap.StackedTime, //= BuffOverlap.StackedLayer;
    /// <summary>
    /// 消除类型
    /// </summary>
    BuffShutDownType:BuffShutDownType.All,// = BuffShutDownType.All;
    /// <summary>
    /// 如果是堆叠层数，表示最大层数，如果是时间，表示最大时间
    /// </summary>
    MaxLimit:Number.MAX_VALUE,// = 0;
    /// <summary>
    /// 执行时间
    /// </summary>
    Time:10,
    /// <summary>
    /// 间隔时间 不是频率的就是填写0
    /// </summary>
    CallFrequency:0,//=1;
    /// <summary>
    /// 范围
    /// </summary>
    Num:300, //130/576*屏幕宽度
}

}
export var BuffConfig= buff; 