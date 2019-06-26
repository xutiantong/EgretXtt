import DeviceData from "../../model/DeviceData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export default class DeviceAssist {

    public static _inst:DeviceAssist;
    public static getInstance():DeviceAssist
    {
        return this._inst||(this._inst = new DeviceAssist())
    }
    public deviceData :DeviceData=null;
    constructor(){
        this.deviceData=new DeviceData();
    }
    /**
     * 获取当前的平台接口 ios 不能调用支付
     */
    public getOS()
    {
        if(this.deviceData && this.deviceData.system)
        {
            let str:string = this.deviceData.system.toLowerCase();
            if(str.indexOf("android")>-1)
            {
                return "AND";
            }else if(str.indexOf("ios")>-1)
            {
                return "IOS"
            }else{
                return "PC"
            }
            
        }
        return 0;
    }
}
export var DEVICE = DeviceAssist.getInstance();
