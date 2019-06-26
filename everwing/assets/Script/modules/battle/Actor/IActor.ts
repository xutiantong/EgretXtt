import ActorBuff from "./ActorBuff";
import ActorAttr from "./ActorAttr";

/**
 * 角类接口
 */
export default interface IActor{
    /**
     * 初始化的时候重置属性
     */
    ActorBuff:ActorBuff;
    ActorAttr:ActorAttr;
}