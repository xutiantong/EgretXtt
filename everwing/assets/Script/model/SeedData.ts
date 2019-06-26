// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SeedData{
    public unlockInfo:any = {};
    public parse(data: any) {
        if(data==null || data == undefined)
        {
            return;
        }
        if(data.userSeedsInfos==undefined)
        {
            return;
        }
        for (let k in data.userSeedsInfos) {
            let item = data.userSeedsInfos[k].seedId;//totalUnlockTime
            this.unlockInfo[item] = data.userSeedsInfos[k];
        }
    }
}
