import { BuffType, BuffOverlap, BuffCalculateType, BuffShutDownType, BuffBase } from "./BuffBase";

export class BuffData
{
    /// <summary>
    /// 缓存栈
    /// </summary>
    private static poolCache:Array<BuffData> = new Array<BuffData>();
    /// <summary>
    /// BuffData下一个ID
    /// </summary>
    public static buffIndex:number=0;
    /// <summary>
    /// ID
    /// </summary>
    public  buffDataID:number=0;
    /// <summary>
    /// 配置表ID
    /// </summary>
    public  BuffID:number=-1;
    /// <summary>
    /// buff类型
    /// </summary>
    public  BuffType:BuffType=0;
    /// <summary>
    /// 叠加类型
    /// </summary>
    public BuffOverlap:BuffOverlap = BuffOverlap.StackedLayer;
    /// <summary>
    /// 执行次数
    /// </summary>
    public  BuffCalculate:BuffCalculateType = BuffCalculateType.Loop;
    /// <summary>
    /// 关闭类型
    /// </summary>
    public BuffShutDownType :BuffShutDownType = BuffShutDownType.All;
    /// <summary>
    /// 最大限制
    /// </summary>
    public MaxLimit:number=1;
    /// <summary>
    /// 当前数据
    /// </summary>
    private _Limit:number=1;
    public get Limit():number {return this._Limit; }
    /// <summary>
    /// 执行时间
    /// </summary>
    private  PersistentTime:number;
    public get GetPersistentTime():number { return this.PersistentTime;}
    /// <summary>
    /// 当前时间
    /// </summary>
    private  _CurTime:number=0;
    /// <summary>
    /// 事件参数
    /// </summary>
    public  Data:any;
    /// <summary>
    /// 调用频率
    /// </summary>
    public  CallFrequency :number=1;
    /// <summary>
    /// 当前频率
    /// </summary>
    private _curCallFrequency:number=1;
    /// <summary>
    /// 执行次数
    /// </summary>
    private index:number=0;
    /// <summary>
    /// 根据 CallFrequency 间隔 调用 结束时会调用一次 会传递 Data数据 Action<Data>
    /// </summary>
    public  OnCallBackParam:Function;
    /// <summary>
    ///   /// <summary>
    /// 根据 CallFrequency 间隔 调用 结束时会调用一次 会传递 Data数据 int 次数 Action<object, int>
    /// </summary>
    /// </summary>
    public  OnCallBackParamIndex:Function;
    /// <summary>
    /// 根据 CallFrequency 间隔 调用 结束时会调用一次
    /// </summary>
    public  OnCallBack:Function;
    /// <summary>
    /// 根据 CallFrequency 间隔 调用 结束时会调用一次 int 次数 Action<int>
    /// </summary>
    public  OnCallBackIndex:Function;

    /// <summary>
    /// 当改变时间
    /// </summary> Action<BuffData>
    public  OnChagneTime:Function;
    /// <summary>
    /// 当添加层  Action<BuffData>
    /// </summary>
    public  OnAddLayer:Function;
    /// <summary>
    /// 当删除层 Action<BuffData>
    /// </summary>
    public  OnSubLayer:Function;
    /// <summary>
    /// 开始调用 Action
    /// </summary>
    public  OnStart:Function;
    /// <summary>
    /// 结束调用 Action
    /// </summary>
    public  OnFinsh:Function;
    private  _isFinsh:boolean;

    public buffConfig:BuffBase;

    /// <summary>
    /// 构造方法 oncallBack 参数为空
    /// </summary>
    public constructor(persistentTime, onCallBack:Function)
    {
        // this.buffDataID = ++BuffData.buffIndex;
        this.CallFrequency = 1;
        //this.PersistentTime = 0;
        this.PersistentTime = persistentTime;
        this.OnCallBack = onCallBack;
        this.buffDataID = ++BuffData.buffIndex;
    }

    /// <summary>
    /// 重置时间
    /// </summary>
    public ResterTime()
    {
        this._CurTime = 0;
    }

    /// <summary>
    /// 修改 时间
    /// </summary>
    /// <param name="time"></param>
    public ChangePersistentTime( time:number)
    {
        this.PersistentTime = time;
        if (this.PersistentTime >= this.MaxLimit)
        this.PersistentTime = this.MaxLimit;
        if (this.OnChagneTime != null)
        {
            this.OnChagneTime(this);
        }
    }

    /// <summary>
    /// 加一层
    /// </summary>
    public AddLayer()
    {
        this._Limit++;
        this._CurTime = 0;
        if (this._Limit > this.MaxLimit)
        {
            this._Limit = this.MaxLimit;
            return;
        }
        if (this.OnAddLayer != null)
        {
            this.OnAddLayer(this);
        }
    }

    /// <summary>
    /// 减一层
    /// </summary>
    public SubLayer()
    {
        this._Limit--;
        if (this.OnSubLayer != null)
        {
            this.OnSubLayer(this);
        }
    }

    /// <summary>
    /// 开始Buff
    /// </summary>
    public StartBuff()
    {
        //ChangeLimit(MaxLimit);
        this._isFinsh = false;
        if (this.OnStart != null)
        {
            this.OnStart();
        }
    }

    /// <summary>
    /// 执行中
    /// </summary>
    /// <param name="delayTime"></param>
    public OnTick(delayTime:number)
    {
        this._CurTime += delayTime;
        //判断时间是否结束
        if (this._CurTime >= this.PersistentTime)
        {
            ///调用事件
            this.CallBack();
            //判断结束类型 为层方式
            if (this.BuffShutDownType == BuffShutDownType.Layer)
            {
                this.SubLayer();
                //判读层数小于1 则结束
                if (this._Limit <= 0)
                {
                    this._isFinsh = true;
                    return;
                }
                //重置时间
                this._curCallFrequency = 0;
                this._CurTime = 0;
                return;
            }
            this._isFinsh = true;
            return;
        }

        //如果是按频率调用
        if (this.CallFrequency > 0)
        {
            this._curCallFrequency += delayTime;
            if (this._curCallFrequency >= this.CallFrequency)
            {
                this._curCallFrequency = 0;
                this.CallBack();
            }
            return;
        }
        ///调用回调
        this.CallBack();
    }

    /// <summary>
    /// 获取当前执行时间
    /// </summary>
    public get GetCurTime():number
    {
        return this._CurTime;
    }
    /// <summary>
    /// 是否结束
    /// </summary>
    public get IsFinsh():boolean
    {
        return this._isFinsh;
    }

    /// <summary>
    /// 调用回调
    /// </summary>
    private CallBack()
    {
        //次数增加
        this.index++;
        //判断buff执行次数 
        if (this.BuffCalculate == BuffCalculateType.Once)
        {
            if (this.index > 1) { this.index = 2; return; }
        }

        if (this.OnCallBack != null)
        {
            this.OnCallBack();
        }
        if (this.OnCallBackIndex != null)
        {
            this.OnCallBackIndex(this.index);
        }
        if (this.OnCallBackParam != null)
        {
            this.OnCallBackParam(this.Data);
        }
        if (this.OnCallBackParamIndex != null)
        {
            this.OnCallBackParamIndex(this.Data, this.index);
        }
    }

    /// <summary>
    /// 关闭buff
    /// </summary>
    public CloseBuff()
    {
        if (this.OnFinsh != null)
        {
            this.OnFinsh();
        }
        this.Clear();
    }

    public Clear()
    {
        this._Limit = 0;
        this.BuffID = -1;
        this.index = 0;
        this.PersistentTime = 0;
        this._CurTime = 0;
        this.Data = null;
        this.CallFrequency = 0;
        this._curCallFrequency = 0;
        this.OnCallBackParam = null;
        this.OnCallBack = null;
        this.OnStart = null;
        this.OnFinsh = null;
        this._isFinsh = false;
        this.buffConfig=null;
        this.BuffType = BuffType.None;
        BuffData.Push(this);
    }

    /// <summary>
    /// 创建BuffData
    /// </summary>
    /// <returns></returns>
    public static  CreateNull():BuffData
    {
        if (this.poolCache.length < 1)
            return new BuffData(0,null);
        let buffData :BuffData= this.poolCache.pop();
        return buffData;
    }

    public static CreateWithCallBack( buffBase:BuffBase, onCallBack:Function):BuffData
    {
       return this.Create(buffBase,onCallBack,null,null);
    }
    /**
     * 
     * @param buffBase 
     * @param onStart  buff开始调用一次
     * @param onFinish buff结束调用一次
     * @param onCallBack Action(); 每个执行周期调用一次
     * @param addLayerAcion Action<BuffData> 
     * @param  subLayerAction Action<BuffData> 
     */
    public static Create( buffBase:BuffBase,onStart:Function,onFinish:Function, onCallBack?:Function,addLayerAcion?:Function,subLayerAction?:Function):BuffData
    {
        let db:BuffData = BuffData.Pop();
        db.BuffCalculate = buffBase.BuffCalculate;
        db.BuffID = buffBase.BuffID;
        db.CallFrequency = buffBase.CallFrequency;
        db.PersistentTime = buffBase.Time;
        db.BuffOverlap = buffBase.BuffOverlap;
        db.BuffShutDownType = buffBase.BuffShutDownType;
        db.BuffType = buffBase.BuffType;
        db.MaxLimit = buffBase.MaxLimit;
        db.OnCallBack = onCallBack;
        db.OnAddLayer = addLayerAcion;
        db.OnSubLayer = subLayerAction;
        db.OnStart = onStart;
        db.OnFinsh = onFinish;
        db._Limit = 1;
        db.buffConfig = buffBase;
        return db;
    }

    /// <summary>
    /// 弹出
    /// </summary>
    /// <returns></returns>
    private static Pop():BuffData
    {
        if (this.poolCache.length < 1)
        {
            let bd = new BuffData(0,null);
            return bd;
        }
        let buffData = this.poolCache.pop();
        return buffData;
    }

    /// <summary>
    /// 压入
    /// </summary>
    /// <param name="buffData"></param>
    private static  Push( buffData:BuffData)
    {
        this.poolCache.push(buffData);
    }

}

