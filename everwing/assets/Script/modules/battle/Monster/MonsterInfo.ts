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
export default class MonsterInfo {
    private _monsterId: number = 0;//id
    private _monsterHp: number = 100;//血量
    private _monsterMaxHp: number = 100;//血量
    private _monsterType: number = 0;//类型
    private _monsterSkills: Array<string> = [];//技能
    private _monsterSpeed: number = 1;//移动速度
    private _monsterSprite: cc.Sprite = null;
    private _monsterName: string = "";
    private _monsterIcon:string = "";
    public set MonsterHp (hurt: number) {
        this._monsterHp += hurt;
    }

    public get MonsterHp () {
        return this._monsterHp;
    }

    public get MonsterMaxHp()
    {
        return this._monsterMaxHp;
    }
    public get MonsterType () {
        return this._monsterType;
    }

    public get MonsterSkills () {
        return this._monsterSkills;
    }

    public get MonsterLines () {
        return this._monsterHp;
    }

    public get MonsterIcon ():string {
        return this._monsterIcon;
    }

    public get MonsterHpRadio()
    {
        return this._monsterHp/this._monsterMaxHp;
    }
    public get MonsterId(){
        return this._monsterId;
    }
    public parseData(data: any) {
        if (data["monsterId"] != undefined) {
            this._monsterId = data["monsterId"];
        }
        if (data["monsterType"] != undefined) {
            this._monsterType = data["monsterType"];
        }
        if (data["monsterHp"] != undefined) {
            this._monsterHp = data["monsterHp"];
        }
        if (data["monsterMaxHp"] != undefined) {
            this._monsterMaxHp = data["monsterMaxHp"];
        }
        if (data["monsterSpeed"] != undefined) {
            this._monsterSpeed = data["monsterSpeed"];
        }
        if(data["monsterIcon"] != undefined){
            this._monsterIcon =  data["monsterIcon"]
        }
    }
}
