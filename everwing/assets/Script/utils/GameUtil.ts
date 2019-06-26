import { ResourceConst } from "../GameConst";
import { GAME } from "../model/GameData";

export default class GameUtil{
    /**
     * 资源是否满足条件
     * @param resType 资源类型
     * @param num 数量
     */
    public static checkResEnough(resType:number, num:any):boolean{
        let ret:boolean = false;
        switch(Number(resType))
        {
            case ResourceConst.Gold:
                ret  = Number(GAME.playerData.gold) >= Number(num)
            break;
            case ResourceConst.Diamond:
                ret  = GAME.playerData.diamond >= Number(num)
            break;
            case ResourceConst.Exp:
                ret  = GAME.playerData.exp >= Number(num)
            break;
            case ResourceConst.DogHomeMaterial:
                ret  = GAME.playerData.materials.dogHomeMaterial >= Number(num)
            break;
            default:
            break;
        }
        return ret;
    } 

    /**
     * 获取资源图标
     * @param resType 
     */
    public static getResIconPath(itemId:number){
        var path:string;
        if(itemId == ResourceConst.Gold){
            path = "img/battle/drop/jin.png";
        }else if(itemId == ResourceConst.Trophy){
            path = "img/battle/drop/jbei2.png";
        }else {
            path = "ui/jinbi_xiao.png";
        }
        return path;
    }


    public static getRawResourcePath(resName:string) {
        if (resName == null) {
            return '';
        }
        return cc.url.raw("resources/" + resName);
    }

    /**
     * 获取资源数量
     * @param resType 
     */
    public static getResNum(itemId:number){
        var num:number;
        if(itemId == ResourceConst.RedPacket){
            num = GAME.playerData.redPacket;
        }else if(itemId == ResourceConst.Gold){
            num = GAME.playerData.gold;
        }else if(itemId == ResourceConst.Exp){
            num = GAME.playerData.exp;
        }else if(itemId == ResourceConst.Diamond){
            num = GAME.playerData.diamond;
        }else if(itemId == ResourceConst.DogHomeMaterial){
            num = GAME.playerData.materials.dogHomeMaterial;
        }else {
            num = 0;
        }
        return num;
    }
    /**
     * 转换乱七八糟的服务器数据
     * @param data 
     */
    public static convertServerDataToClient(data:any):any{
        var ret:any ={};
        if(data["resInfo"]!=undefined){
            data["resInfo"].forEach(res => {
                if(res["gold"]!=undefined){
                    ret.gold = res["gold"];
                }
                if(res["redPacket"]!=undefined){
                    ret.redPacket = res["redPacket"];
                }
            });
        }

        if(data["expInfo"]!=undefined){
            if(data["expInfo"]["exp"]!=undefined){
                ret.exp = data["expInfo"]["exp"];
            }
            if(data["expInfo"]["level"]!=undefined){
                ret.level = data["expInfo"]["level"];
            }
        }

        return ret;
    }

    /**
     * 转换秒为HH:MM:SS格式时间
     * @param time 
     */
    public static secondToHMS(time:number){
        let s = Math.round(time);
        let hours = Math.round((s - 30 * 60) / (60 * 60));
        let hourStr = String(hours);
        if(hours<10){
            hourStr = "0" + String(hours);
        }
        let minutes = Math.round((s - 30) / 60) % 60;
        let minuteStr = String(minutes);
        if(minutes<10){
            minuteStr = "0" + String(minutes);
        }
        let seconds = s % 60;
        let secondStr = String(seconds);
        if(seconds<10){
            secondStr = "0" + String(seconds);
        }
        var HMSTime = hourStr + ":" + minuteStr + ":" + secondStr;
        return HMSTime;
    }
    /**
     * 获得分享URL地址
     * @param resName resources下面的图片路径
     */
    public static getShareUrl(resName: string) {
        if (resName == null) {
            return "";
        }
        let baseUrl = "";
        let wxDownloader = window['wxDownloader'];
        if (wxDownloader != null) {
            baseUrl = wxDownloader.REMOTE_SERVER_ROOT;
        }
        if (resName.indexOf("resources") < 0) {
            resName = 'resources/' + resName;
        }

        if (baseUrl.length > 0 && baseUrl[baseUrl.length - 1] !== "/") {
            baseUrl += "/";
        }
        
        let md5Pipe = cc.loader['md5Pipe'];
        if (md5Pipe != undefined && md5Pipe.transformURL instanceof Function) {
            return baseUrl + '/' + md5Pipe.transformURL(cc.url.raw(resName));
        }
        return baseUrl + '/' + cc.url.raw(resName);
    }

    /**
     * 判断是否点击在图片的透明区域
     * @param img 点击的图片
     * @param x 点击坐标x
     * @param y 点击坐标y
     */
    public static onLucencyTouch(img,x,y){
    	var cvs=document.createElement("canvas");
    	var ctx=cvs.getContext('2d');
    	cvs.width=1;
    	cvs.height=1;
    	ctx.drawImage(img,x,y,1,1,0,0,1,1);
    	var imgdata=ctx.getImageData(0,0,1,1);
        return imgdata.data[3];
    }

    /**
     * 遍历节点
     * @param parent 
     * @param cb 
     */
    public static enumNode (parent: cc.Node, cb: Function) {
        if (parent == null) {
            return;
        }

        let childrenList: cc.Node[] = parent.children;
        for (let i = 0; i < childrenList.length; i++) {
            const element = childrenList[i];
            this.enumNode(element, cb);
        }

        cb && cb(parent);
    }
}
window["getShareUrl"] = GameUtil.getShareUrl;