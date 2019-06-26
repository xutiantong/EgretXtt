import { BuffBase, BuffType, BuffOverlap } from "./BuffBase";
import IActor from "../Actor/IActor";
import { BuffData } from "./BuffData";
import { BuffConfig } from "./BuffConfig";
import { POOL } from "../../../manager/PoolManager";
import { AssetConst } from "../../../GameConst";
import { PANEL } from "../../../manager/PanelManager";
import SideTips from "../SideTips";
import { GAME } from "../../../model/GameData";
import { BM } from "../BattleManager";
/**
 * 管理器 addbuff 到actor  actor 查找自己的actorbuff组件
 */
export default class BuffManager{

    public  buffBase:Array<BuffBase> = new Array<BuffBase>();

    /// <summary>
    /// 执行buff
    /// </summary>
    /// <param name="actor"></param>
    /// <param name="buffID"></param>
    public DoBuffById(actor:IActor,buffID:number)
    {
        this.DoBuff(actor,this.GetBuffBase(buffID));
    }

    /// <summary>
    /// 执行buff
    /// </summary>
    /// <param name="actor"></param>
    /// <param name="buff"></param>
    public DoBuff(actor:IActor,  buff:BuffBase)
    {
        if (buff == null) return;
        let db:BuffData = null;

        switch (buff.BuffType)
        {
            case BuffType.AddHp: //增加血量
                if (!this.IsAdd(actor, buff))
                {
                    db = BuffData.CreateWithCallBack(buff, ()=>{
                        actor.ActorAttr.AddHP(buff.Num);
                    });

                }
                break;
            case BuffType.AddMaxHp: //增加最大血量
                if (!this.IsAdd(actor, buff))
                {
                    db = BuffData.Create(buff,null,null, ()=>{
                        actor.ActorAttr.AddMaxHP(buff.Num);

                    },()=>{
                        actor.ActorAttr.AddMaxHP(buff.Num);
                    },
                    ()=>{
                        actor.ActorAttr.SubMaxHp(buff.Num);
                    }
                    );
                }
                break;
            case BuffType.SubHp: //减少血量
                if (!this.IsAdd(actor, buff))
                { 
                    db = BuffData.CreateWithCallBack(buff, ()=>{
                        actor.ActorAttr.SubHp(buff.Num);
                    });
                }
                break;
            case BuffType.SubMaxHp: //减少最大血量
                if (!this.IsAdd(actor, buff))
                {
                    db = BuffData.Create(buff,null,null, ()=>{
                        actor.ActorAttr.SubMaxHp(buff.Num);
                    },()=>{
                        actor.ActorAttr.SubMaxHp(buff.Num);
                    },()=>{
                        actor.ActorAttr.AddMaxHP(buff.Num);
                    }
                   );
                }
                break;
            case BuffType.AddSprint:
                if (!this.IsAdd(actor,buff))
                {
                    db = BuffData.CreateWithCallBack(buff, ()=>{
                         //todo 冲刺

                    });
                }
                break;
            case BuffType.DoubleBullet:
                if (!this.IsAdd(actor,buff))
                {
                    db = BuffData.Create(buff,()=>{
                        //开始调用一次
                        SideTips.ShowSideTips("攻击效果","双倍攻击！","img/common/mushroom");
                    },()=>{
                        //结束调用一次

                    });
                }
                break;
            case BuffType.AddAttack:
                if (!this.IsAdd(actor,buff))
                {
                    db = BuffData.Create(buff,()=>{
                        //console.log("addDamage:onstart");
                        actor.ActorAttr.addDamage(buff.Num);
                        if(actor.ActorAttr.bulletLev!=19){
                            actor.ActorAttr.bulletLev+=1;
                        }
                        SideTips.ShowSideTips( (actor.ActorAttr.attack-10)/5+" 级","杀伤力: "+String(actor.ActorAttr.attack),"img/battle/drop/clover");
                    },()=>{
                        //结束调用一次
                        actor.ActorAttr.attack = BM.getBulletDamage();
                        actor.ActorAttr.bulletLev = GAME.playerData.RoleData.bullet;
                    },()=>{
                        //console.log("addDamage:callback");
                    },()=>{
                        //console.log("addDamage:addlayer");
                        actor.ActorAttr.addDamage(buff.Num);
                        if(actor.ActorAttr.bulletLev!=19){
                            actor.ActorAttr.bulletLev+=1;
                        }
                        SideTips.ShowSideTips( (actor.ActorAttr.attack-10)/5+" 级","杀伤力: "+String(actor.ActorAttr.attack),"img/battle/drop/clover");
                    });
                }
                break;
            case BuffType.Magnet:
                if (!this.IsAdd(actor,buff))
                {
                    db = BuffData.Create(buff,()=>{
                        //开始调用一次
                        SideTips.ShowSideTips("道具强化","吸收道具","img/battle/drop/citie");

                    },()=>{
                        
                    });
                    db.OnChagneTime =(data)=>{
                        SideTips.ShowSideTips("道具强化","吸收道具","img/battle/drop/citie");
                    }
                }
            break;
            // case BuffType.AddDamageFloated: //浮空
            //     if (!IsAdd(actor, buff))
            //     {
            //         db = BuffData.Create(buff, delegate
            //         {
            //             if (actor.ActorState != ActorState.DamageRise)
            //                 actor.ActorAttr.DamageRiseAbility = buff.Num;
            //             actor.SetDamageRiseState();
            //         });
            //     }
            //     break;
            // case BuffType.AddFloated:
            //     if (!IsAdd(actor, buff))
            //     {
            //         db = BuffData.Create(buff, delegate
            //         {
            //             Vector3 moveDir = Vector3.up;
            //             moveDir *= buff.Num;
            //             actor.CharacterController.Move(moveDir*Time.deltaTime);
            //         });
            //     }
            //      break;
            // case BuffType.AddSprint:
            //     if (!IsAdd(actor,buff))
            //     {
            //         db = BuffData.Create(buff, delegate {
            //             Vector3 moveDir = actor.transform.forward;
            //             moveDir *= buff.Num;
            //             moveDir.y += -20;
            //             actor.CharacterController.Move(moveDir*Time.deltaTime);
            //             //actor.Translate(Vector3.forward * buff.Num * Time.deltaTime);
            //         });
            //     }
            //     break;
            // case BuffType.AddIsIgnoreGravity:
            //     if (!IsAdd(actor, buff))
            //     {
            //         db = BuffData.Create(buff, null);
            //         db.OnStart = delegate { actor.ActorPhysical.IsIgnoreGravity = true; };
            //         db.OnFinsh = delegate
            //         {
            //             actor.ActorPhysical.IsIgnoreGravity = false;
            //         };
            //     }
            //     break;
        }
        if (db != null)
            actor.ActorBuff.AddBuff(db);
    }

    /// <summary>
    /// 玩家是否已经有此buff
    /// </summary>
    /// <param name="actor"></param>
    /// <param name="buff"></param>
    /// <returns></returns>
    private IsAdd( actor:IActor, buff:BuffBase):boolean
    {
        let oldBuff:BuffData = actor.ActorBuff.GetBuffByBaseID(buff.BuffID);
       
        if (oldBuff != null)
        {
            switch (buff.BuffOverlap)
            {
                case BuffOverlap.ResterTime:
                    oldBuff.ResterTime();
                    break;
                case BuffOverlap.StackedLayer:
                    oldBuff.AddLayer();
                    break;
                case BuffOverlap.StackedTime:
                    oldBuff.ChangePersistentTime(oldBuff.GetPersistentTime + buff.Time);
                    break;
                default:
                    break;
            }
            return true;
        }
        return false;
    }

    // /// <summary>
    // /// 获取配置数据
    // /// </summary>
    // /// <param name="buffID"></param>
    // /// <returns></returns>
    public  GetBuffBase( buffID:number):BuffBase
    {
        let buffconfig = BuffConfig[buffID.toString()];
        if(buffconfig==null)
        {
            console.error("BuffConfig 中找不到buffId："+buffID.toString()+"的配置");
        }
        return buffconfig;
    }
}



