export interface BuffBase
{
    /// <summary>
    /// BuffID
    /// </summary>
    BuffID:number;
    /// <summary>
    /// Buff类型
    /// </summary>
    BuffType:BuffType;
    /// <summary>
    /// 执行此
    /// </summary>
    BuffCalculate:BuffCalculateType; //= BuffCalculateType.Loop;
    /// <summary>
    /// 叠加类型
    /// </summary>
    BuffOverlap:BuffOverlap; //= BuffOverlap.StackedLayer;
    /// <summary>
    /// 消除类型
    /// </summary>
    BuffShutDownType:BuffShutDownType;// = BuffShutDownType.All;
    /// <summary>
    /// 如果是堆叠层数，表示最大层数，如果是时间，表示最大时间
    /// </summary>
    MaxLimit:number;// = 0;
    /// <summary>
    /// 执行时间
    /// </summary>
    Time:number;// = 0;
    /// <summary>
    /// 间隔时间
    /// </summary>
    CallFrequency:number;//=1;
    /// <summary>
    /// 执行数值 比如加血就是每次加多少
    /// </summary>
    Num:number;
}

/// <summary>
/// buff类型
/// </summary>
export enum BuffType
{
    None=0,
    /// <summary>
    /// 恢复HP
    /// </summary>
    AddHp,
    /// <summary>
    /// 增加最大血量
    /// </summary>
    AddMaxHp,
    /// <summary>
    /// 减血
    /// </summary>
    SubHp,
    /// <summary>
    /// 减最大生命值
    /// </summary>
    SubMaxHp,

    /// <summary>
    /// 冲刺
    /// </summary>
    AddSprint,

    /**
     * 双倍子弹
     */
    DoubleBullet,

    /**
     * 双倍金币
     */
    DoubleGold,
    /**
     * 增加攻击力
     */
    AddAttack,
    /**
     * 磁铁
     */
    Magnet,
    // /// <summary>
    // /// 眩晕
    // /// </summary>
    // AddVertigo,
    // /// <summary>
    // /// 被击浮空
    // /// </summary>
    // AddFloated,
    // /// <summary>
    // /// 击退
    // /// </summary>
    // AddRepel,
    // /// <summary>
    // /// 冲刺
    // /// </summary>
    // AddSprint,
    // /// <summary>
    // /// 被击浮空
    // /// </summary>
    // AddDamageFloated,
    // /// <summary>
    // /// 添加忽略重力
    // /// </summary>
    // AddIsIgnoreGravity,

}

/// <summary>
/// 叠加类型
/// </summary>
export enum BuffOverlap
{
    None,
    /// <summary>
    /// 增加时间
    /// </summary>
    StackedTime,
    /// <summary>
    /// 堆叠层数
    /// </summary>
    StackedLayer,
    /// <summary>
    /// 重置时间
    /// </summary>
    ResterTime,
}

/// <summary>
/// 关闭类型
/// </summary>
export enum BuffShutDownType
{
    /// <summary>
    /// 关闭所有
    /// </summary>
    All,
    /// <summary>
    /// 单层关闭
    /// </summary>
    Layer,
}

/// <summary>
/// 执行类型
/// </summary>
export enum BuffCalculateType
{
    /// <summary>
    /// 一次
    /// </summary>
    Once,
    /// <summary>
    /// 每次
    /// </summary>
    Loop,
}

