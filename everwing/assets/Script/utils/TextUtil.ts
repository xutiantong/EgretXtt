export default class TextUtil{
    public static getCurrencyStr(num:any):string{
        return String(num)+"元";
    }
    public static getQualityStr(num:number):string{
        switch(num)
        {
            case 0:
            return "普通";
            case 1:
            return "高级";
            case 2:
            return "稀有";
            case 3:
            return "超凡";
            case 4:
            return "史诗";
            case 5:
            return "传奇";
        }
        return "未知";
    }
    public static getOwnStateStr(num:number):string{
        switch(num)
        {
            case 0:
            return "未获得";
            case 1:
            return "已拥有";
        }
        return "未知";
    }

    public static getGameResName(num:number){
        switch(num)
        {
            case 2:
            return "金币";
            case 3:
            return "经验";
            case 5:
            return "红包";
        }
    }
}
