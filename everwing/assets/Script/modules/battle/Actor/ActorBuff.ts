import { BuffData } from "../BuffSystem/BuffData";
import { BuffType } from "../BuffSystem/BuffBase";
import BuffManager from "../BuffSystem/BuffManager";
import IActor from "./IActor";
import IActorComponent from "./IActorComponent";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ActorBuff extends cc.Component implements IActorComponent{
    Init() {
        this.buffs = new Array<BuffData>();
    }
    Reset() {
        this.buffs = new Array<BuffData>();
    }

    private buffs:Array<BuffData> =null;

    public buffManager:BuffManager=null;
    public actor:IActor;
    public onLoad()
    {
    }

    InitBuff(act:IActor,manager:BuffManager)
    {
        this.actor = act;
        this.buffManager =manager;
        this.Init();
    }

    /// <summary>
    /// 执行buff
    /// </summary>
    UpdateLogic(deltaTime)
    {
        if(this.buffs==undefined ||this.buffs==null)
        {
            if(CC_DEBUG)
            {
                console.error("buffs 为空");
            }
            return;
        }
        for (let i = this.buffs.length - 1; i >= 0; i--)
        {
            this.buffs[i].OnTick(deltaTime);
            if (this.buffs[i].IsFinsh)
            {
                this.buffs[i].CloseBuff();
                this.buffs.splice(i,1);
            }
        }
    }

    /// <summary>
    /// 添加buff
    /// </summary>
    /// <param name="buffData"></param>
    public AddBuff( buffData:BuffData)
    {
        if (this.buffs.indexOf(buffData)==-1)
        {
            this.buffs.push(buffData);
            buffData.StartBuff();
        }
    }

    /// <summary>
    /// 移除buff buffid 流水id
    /// </summary>
    /// <param name="buffDataID"></param>
    public RemoveBuffById(buffDataID:number)
    {
        let bd:BuffData = this.GetBuffById(buffDataID);
        if(bd!=null)
            bd.CloseBuff();
    }

    /// <summary>
    /// 移除buff
    /// </summary>
    /// <param name="buffData"></param>
    public RemoveBuff( buffData:BuffData)
    {
        if (this.buffs.indexOf(buffData)>=0)
        {
            buffData.CloseBuff();
        }
    }

    /// <summary>
    /// 获取buff buff 的流水Id
    /// </summary>
    /// <param name="buffDataID"></param>
    /// <returns></returns>
    public GetBuffById(buffDataID:number):BuffData
    {
        for (let i = 0; i < this.buffs.length; i++)
        {
            if (this.buffs[i].buffDataID == buffDataID)
                return this.buffs[i];
        }
        return null;
    }

    /// <summary>
    /// 获取buff config id
    /// </summary>
    /// <param name="buffBaseID"></param>
    /// <returns></returns>
    public  GetBuffByBaseID(buffBaseID:number):BuffData
    {
        for (let i = 0; i < this.buffs.length; i++)
        {
            if (this.buffs[i].BuffID == buffBaseID)
                return this.buffs[i];
        }
        return null;
    }

    /// <summary>
    /// 获取buff
    /// </summary>
    /// <param name="buffType"></param>
    /// <returns></returns>
    public  GetBuff( buffType:BuffType):BuffData[]
    {
        let buffdatas = new Array<BuffData>();
        for (let i = 0; i < this.buffs.length; i++)
        {
            if (this.buffs[i].BuffType == buffType)
                buffdatas.push(this.buffs[i]);
        }
        return buffdatas;
    }
    /**
     * 获取指定类型的buff
     * @param buffType buff 枚举的定义
     */
    public  GetBuffByType( buffType:BuffType):BuffData
    {
        let buffdatas = null;
        for (let i = 0; i < this.buffs.length; i++)
        {
            if (this.buffs[i].BuffType == buffType)
                return this.buffs[i];
        }
        return buffdatas;
    }


    /// <summary>
    /// 执行buff
    /// </summary>
    /// <param name="buffID"></param>
    public DoBuff( buffID:number)
    {
        if(this.buffManager==null)
        {
            return;
        }
        this.buffManager.DoBuffById(this.actor,buffID);
    }

    public IsHasBuff(buffID:number):boolean
    {
        let data=this.GetBuffByBaseID(buffID);
        if(data==null)
        {
            return false;
        }
        if(data.IsFinsh)
        {
            return false;
        }
        return true;
    }
    /**
     * 是否包含指定类型的buff
     * @param buffType 
     */
    public IsHasBuffType(buffType:BuffType):boolean
    {
        if(this.GetBuffByType(buffType)==null)
        {
            return false;
        }
        return true;
    }
}
