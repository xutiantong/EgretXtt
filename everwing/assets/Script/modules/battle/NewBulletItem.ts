import CollideItem from "./CollideItem";
import {POOL} from "../../manager/PoolManager";
import MonsterBase from "./Monster/MonsterBase";
import IActor from "./Actor/IActor";
import {SOUND} from "../../manager/SoundManager";
import {BM} from "./BattleManager";

const {ccclass, property} = cc._decorator;

export const formations=[[], 
    [{x: 0, y: 0}], 
    [{x: -1, y: 0}, {x: 1, y: 0}], 
    [{x: -2, y: 2}, {x: 0, y: 0}, {x: 2,y: 2}], 
    [{x: -3, y: 2}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 3, y: 2}], 
    [{x: -4, y: 4}, {x: -2, y: 2}, {x: 0,y: 0}, {x: 2, y: 2}, {x: 4, y: 4}], 
    [{x: -5, y: 4}, {x: -3, y: 2}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 3, y: 2}, {x: 5,y: 4}],
    [{x: -1, y: 4}, {x: -3, y: 2}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 3, y: 2}, {x: 1, y: 4}], 
    [{x: -4,y: 4}, {x: -2, y: 2}, {x: -2, y: 1}, {x: 0, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 4, y: 4}], 
    [{x: -2,y: 2}, {x: -1, y: 4}, {x: 0, y: 0}, {x: 1, y: 4}, {x: 2, y: 2}], 
    [{x: 0, y: 0}, {x: -1, y: 2}, {x: 0, y: 4}, {x: 1,y: 2}], 
    [{x: -2, y: 0}, {x: 0, y: 2}, {x: 2, y: 0}], 
    [{x: -1, y: 0}, {x: 1, y: 0}, {x: -1, y: 4}, {x: 1,y: 4}, {x: 0, y: 2}], 
    [{x: -3, y: 3}, {x: -2, y: 2}, {x: -1, y: 4}, {x: 0, y: 0}, {x: 1, y: 4}, {x: 2, y: 2}, {x: 3,y: 3}], 
    [{x: -2, y: 3}, {x: -1, y: 2}, {x: 0, y: 0}, {x: 0, y: 4}, {x: 1, y: 2}, {x: 2, y: 3}], 
    [{x: -2,y: 3}, {x: -1.5, y: 4}, {x: -1, y: 2}, {x: 0, y: 0}, {x: 0, y: 4}, {x: 1, y: 2}, {x: 1.5, y: 4}, {x: 2,y: 3}],
    [{x: -2, y: 1.5}, {x: -1, y: 0}, {x: 0, y: 3}, {x: 1, y: 0}, {x: 2, y: 1.5}], 
    [{x: -2, y: 0}, {x: 2,y: 0}], 
    [{x: -2, y: 0}, {x: 0, y: 2}, {x: 2, y: 0}],
    [{x: 0, y: 0}, {x: -2, y: 2}, {x: 0, y: 4}, {x: 2, y: 2}]];
export const levels= [{}, 
    {formation: 1, one: [0], scale: 1}, 
    {formation: 2, one: [0, 1], scale: 1}, 
    {formation: 3, one: [0, 1, 2],scale: 1}, 
    {formation: 4, one: [0, 1, 2, 3], scale: 1}, 
    {formation: 1, two: [0], scale: 1}, 
    {formation: 3, one: [0, 2],two: [1],scale: 1}, 
    {formation: 5, one: [0, 1, 3, 4], two: [2], scale: 1}, 
    {formation: 2, two: [0, 1], scale: 1}, 
    {formation: 4, one: [0, 3],two: [1, 2],scale: 1}, 
    {formation: 7, one: [0, 1, 4, 5], two: [2, 3], scale: 1}, 
    {formation: 3, two: [0, 1, 2],scale: 1}, 
    {formation: 5, one: [0, 4], two: [1, 2, 3], scale: 1}, 
    {formation: 13, one: [0, 2, 4, 6],two: [1, 3, 5],scale: 1}, 
    {formation: 1, three: [0], scale: 1}, 
    {formation: 3, one: [0, 2], three: [1], scale: 1}, 
    {formation: 9, one: [0, 1, 3, 4],three: [2],scale: 1}, 
    {formation: 3, two: [0, 2], three: [1], scale: 1}, 
    {formation: 9, one: [0, 4], two: [1, 3],three: [2], scale: 1}, 
    {formation: 8, one: [0, 2, 4, 6], two: [1, 5], three: [3], scale: 1}, 
    {formation: 10, two: [1, 2, 3],three: [0], scale: 1}, 
    {formation: 2, three: [0, 1], scale: 1}, 
    {formation: 4, one: [0, 3], three: [1, 2], scale: 1}, 
    {formation: 7,one: [0, 1, 4, 5],three: [2, 3],scale: 1}, 
    {formation: 11, two: [1], three: [0, 2], scale: 1}, 
    {formation: 4,two: [0, 3],three: [1, 2],scale: 1}, 
    {formation: 7, one: [0, 5], two: [1, 4], three: [2, 3], scale: 1}, 
    {formation: 12,two: [2, 3, 4],three: [0, 1],scale: 1}, 
    {formation: 3, three: [0, 1, 2], scale: 1}, 
    {formation: 9, one: [1, 3],three: [0, 2, 4],scale: 1}, 
    {formation: 13, one: [0, 2, 4, 6], three: [1, 3, 5], scale: 1}, 
    {formation: 10, two: [2],three: [0, 1, 3],scale: 1}, 
    {formation: 14, one: [0, 5], two: [3], three: [1, 2, 4], scale: 1}, 
    {formation: 15,one: [0, 1, 6, 7],two: [4],three: [2, 3, 5],scale: 1}, 
    {formation: 14, two: [0, 3, 5], three: [1, 2, 4], scale: 1}, 
    {formation: 0,four: !0,scale: 1}, 
    {formation: 2, one: [0, 1], four: !0, scale: 1}, 
    {formation: 4,one: [0, 1, 2, 3],four: !0,scale: 1}, 
    {formation: 2, two: [0, 1], four: !0, scale: 1}, 
    {formation: 4,one: [0, 3],two: [1, 2],four: !0,scale: 1}, 
    {formation: 7, one: [0, 1, 4, 5], two: [2, 3], four: !0, scale: 1}, 
    {formation: 4,two: [0, 1, 2, 3],four: !0,scale: 1}, 
    {formation: 2, three: [0, 1], four: !0, scale: 1}, 
    {formation: 4,one: [0, 3],three: [1, 2],four: !0,scale: 1}, 
    {formation: 6, one: [0, 1, 4, 5], three: [2, 3], four: !0, scale: 1}, 
    {formation: 4,two: [0, 3],three: [1, 2],four: !0,scale: 1}, 
    {formation: 9, two: [1, 3], three: [0, 2, 4], four: !0, scale: 1}, 
    {formation: 4,three: [0, 1, 2, 3],four: !0,scale: 1}, 
    {formation: 7, two: [0, 5], three: [1, 2, 3, 4], four: !0, scale: 1}, 
    {formation: 7,three: [0, 1, 2, 3, 4, 5],four: !0,scale: 1}, 
    {formation: 0, five: !0, scale: 1}, {formation: 2, one: [0, 1], five: !0, scale: 1}, 
    {formation: 3,one: [0, 2],two: [1],five: !0,scale: 1}, 
    {formation: 9, one: [1, 3], two: [0, 4], three: [2], five: !0, scale: 1}, 
    {formation: 16,two: [0, 2, 4],three: [1, 3],five: !0,scale: 1}, 
    {formation: 0, four: !0, five: !0, scale: 1}, 
    {formation: 17,one: [0, 1],four: !0,five: !0,scale: 1}, 
    {formation: 3, two: [0, 1, 2], four: !0, five: !0, scale: 1}, 
    {formation: 18,two: [1],three: [0, 2],four: !0,five: !0,scale: 1}, 
    {formation: 9, two: [1, 3], three: [0, 2, 4], four: !0, five: !0, scale: 1}, 
    {formation: 0,six: !0,scale: 1}, 
    {formation: 3, one: [0, 1, 2], six: !0, scale: 1}, 
    {formation: 4,one: [0, 3],two: [1, 2],six: !0,scale: 1}, 
    {formation: 19, two: [1, 2, 3], three: [0], six: !0, scale: 1}, 
    {formation: 7,one: [0, 5],two: [1, 4],three: [2, 3],six: !0,scale: 1}, 
    {formation: 0, four: !0, six: !0, scale: 1}, 
    {formation: 3,three: [0, 1, 2],four: !0,six: !0,scale: 1}, 
    {formation: 4, two: [0, 1, 2, 3], four: !0, six: !0, scale: 1}, 
    {formation: 9,one: [0, 4],two: [1, 3],three: [2],four: !0,six: !0,scale: 1}, 
    {formation: 19, three: [0, 1, 2, 3], four: !0, six: !0, scale: 1}, 
    {formation: 0,six: !0,seven: !0,scale: 1}
];


@ccclass
export default class NewBulletItem extends CollideItem {

    @property(cc.Node) baseNode:cc.Node = null;

    @property(cc.Node) childNode:cc.Node = null;
    private _actor:IActor = null;
    
    private baseData ={};
    private level = -1;
    public static NewBulletPath = "prefabs/newbullet/BulletImg";
    private static horizontalSpacing:number= 8;
    private static verticalSpacing:number= 10; 
    private static nameArr:string[] = ["three","two","one"];
    private static imgArr:string[] = ["3","2","1"];
    onLoad () {
    }

    start () {
    }

    onEnable(){
    }

    onDisable(){
    }

    public setData(level:number){
        
        if(this.level ==level){
            return ;
        }
        this.level = level;
        let data =levels[level];
        
        let __self = this;
       // console.log('current color',colorName);
        this.cleanBullet();

        this.baseData = {};
        let basePosArr = formations[data.formation];
        let zorder = 0;
        for(let i=0;i<NewBulletItem.nameArr.length;i++){
            if(data[NewBulletItem.nameArr[i]]!=undefined){
                let arr = data[NewBulletItem.nameArr[i]];
                for (let j = 0;j<arr.length;j++){
                    let xx = basePosArr[arr[j]].x*NewBulletItem.horizontalSpacing;
                    let yy = -(basePosArr[arr[j]].y-2)*NewBulletItem.verticalSpacing;
                    let myOrder = zorder++;
                    POOL.getPrefabFromPool(NewBulletItem.NewBulletPath+NewBulletItem.imgArr[i],(colorMode:cc.Node)=>{
                        colorMode.parent = __self.childNode;
                        colorMode.setLocalZOrder(myOrder);
                        colorMode.x = xx;
                        colorMode.y = yy;
                    })
                }
            }
        }
        
        
        
        for(let i = 0;i<basePosArr.length;i++){
            if(this.baseData[i]!=undefined){
                let xx = basePosArr[i].x*NewBulletItem.horizontalSpacing;
                let yy = -(basePosArr[i].y-2)*NewBulletItem.verticalSpacing;
                let zorder = i;
                POOL.getPrefabFromPool(NewBulletItem.NewBulletPath+this.baseData[i],(colorMode:cc.Node)=>{
                    colorMode.parent = __self.childNode;
                    colorMode.setLocalZOrder(zorder);
                    colorMode.x = xx;
                    colorMode.y = yy;
                })
            }
        }
        if(data.four!=undefined){
            this.deCodeBaseNode(data.four,4);
        }
        if(data.five!=undefined){
            this.deCodeBaseNode(data.five,5);
        }
        if(data.six!=undefined){
            this.deCodeBaseNode(data.six,5);
        }
        if(data.seven!=undefined){
            this.deCodeBaseNode(data.seven,5);
        }
    }

    private deCodeChildNode(data:any,index:number){
        if(data instanceof Array){
            let len = data.length;
            for (let i = 0; i < len; i++) {
                this.baseData[data[i]]=index;
            }
        }
    }

    private deCodeBaseNode(data:boolean,index:number){
       if(data){
            let self =this;
            POOL.getPrefabFromPool(NewBulletItem.NewBulletPath+index,(colorMode:cc.Node)=>{
                colorMode.parent = self.baseNode;
                colorMode.setLocalZOrder(-index);
            })
       }
    }

    private cleanBullet(){
        let d = this.childNode.childrenCount;
        for(let i =d-1;i>=0;i--){
            POOL.putPrefabToPool(this.childNode.children[i]);
        }
        d = this.baseNode.childrenCount;
        for(let i =d-1;i>=0;i--){
            POOL.putPrefabToPool(this.baseNode.children[i]);
        }
    }


    public onlaunch(endPos:cc.Vec2,actor:IActor) {
        this._actor = actor;
        this.node.setScale(0.2);
        this.node.runAction( cc.sequence(cc.spawn(cc.scaleTo(0.15,1,1),cc.moveTo(0.6, endPos)),cc.callFunc(()=>{
            this.onRemove();
        }) ) );

        BM.bullets.push(this);
    }

    


    public onRemove()
    {
        //this.node.destroy();
        POOL.putPrefabToPool(this.node);

        var index = BM.bullets.indexOf(this);
        if (index != -1) BM.bullets.splice(index, 1);
    }
    public onCollisionEnter (other:cc.Collider, self:cc.Collider) {
        if(other.node.group =="bound")
        {
            this.onRemove();
        }
        // if(other.node)
        // if (self.node.y > other.node.y) {
        //     this._zorderState = false;
        // }
        // else {
        //     this._zorderState = true;
        // }
        // self.node.zIndex = 10000 - self.node.y
    }
    /**
     * 怪物与子弹相撞
     */
    private isUsed:boolean =false;
    
    public onCollisionMonster(item:MonsterBase)
    {
        if(this.isUsed)
        {
            //避免打多个 如果能穿透这里不要返回
            return;
        }

        this.isUsed = true;
        if(item)
        {
            SOUND.playBulletHiteMonsterSound();
            let hurt = this._actor.ActorAttr.attack;
            item.applyDamage(this.node.position, hurt);
        }
        //todo 播放特效
        POOL.putPrefabToPool(this.node);
    }

    public reuse()
    {
        this.node.stopAllActions();
        this.isUsed =false;
        this.node.active= true;
    }
    public unuse()
    {
        super.unuse();
        this.isUsed =false;
        this.node.active=false;
    }
}