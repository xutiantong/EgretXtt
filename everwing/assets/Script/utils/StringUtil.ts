
export default class StringUtil{

    public static getFileName(url:string):string{
        return url.substring(url.lastIndexOf('/')+1);
    }

    public static getShortFileName(url:string):string{
        var fName:string = StringUtil.getFileName(url);
        return fName.substring(0,fName.lastIndexOf("."));
    }

    public static getFileExt(url:string):string{
        var fName:string = StringUtil.getFileName(url);
        return fName.substring(fName.lastIndexOf(".") + 1, fName.length);
    }
    /**
     * 取红包的显示
     * @param num 
     */
    public static formatRedPacket(num:number){
        return num.toFixed(2);
    }
    /**
     * 格式化时间 dd 00:00:00
     * @param seconds 秒
     * @param len 长度 4:天：小时：分：秒，3：小时：分：秒,2:分：秒,1: 秒
     */
    public static formatTimers(seconds: number,len:number=3): string {
        var result: string = "";
        var hour: number = 0;
        hour = Math.floor(seconds / 3600);
        var hourTotal: number = hour;
        var day: number = 0;
        if (hour >= 24) {
            day = Math.floor(Math.floor(hour / 24));
            hour -= day * 24;
        }
        var minute: number = 0;
        minute = Math.floor((seconds - hourTotal * 3600) / 60);
        var second: any = Number(seconds - hourTotal * 3600 - minute * 60);
        if (day > 0)
            result += day + "d ";
        else if(len>3)
            result += "0d:"
        if (hour > 0)
            result += StringUtil.padNumber(hour) + ":";
        else if(len>2)
            result += "00:";
        if (minute > 0)
            result += StringUtil.padNumber(minute) + ":";
        else if(len>1)
            result += "00:";
        result += StringUtil.padNumber(second);
        return result;
    }
    public static padNumber(num: number, length: number = 2): string {
        return StringUtil.leftPad(String(num), length, '0');
    }
    public static leftPad(source: string, targetLength: number, padChar: string = " "): string {
        if (source.length < targetLength) {
            var padding: string = "";
            while (padding.length + source.length < targetLength)
                padding += padChar;
            return padding + source;
        }
        return source;
    }
    /**
     * 多余1天的显示**天**小时**分， 多余一小时的显示**小时**分，少于一小时的显示**分**秒 
     * 时分秒不为0的显示
     * @param time 
     */
    public static formatTimeSecondsToSimplify(time: number): string {
        var str: string = "";
        var _minite: number;
        var day: number = 0;
        var hour: number = 0;
        var minite: number = 0;
        var second: number = 0;

        second = Math.floor(time % 60);
        _minite = Math.floor((time - second) / 60);
        minite = Math.floor(_minite % 60);
        hour = Math.floor((_minite - minite) / 60);
        day = Math.floor(hour / 24);

        if (second < 10) {
            var secondString: String;
            secondString = "0" + second.toString();
        }
        else {
            secondString = second.toString();
        }
        if (minite < 10) {
            var miniteString: String;
            miniteString = "0" + minite.toString();
        }
        else {
            miniteString = minite.toString();
        }
        if (hour % 24 < 10) {
            var hourString: String;
            hourString = "0" + (hour % 24).toString();
        }
        else {
            hourString = (hour % 24).toString();
        }
        if (hour >= 24) {
            str = day.toString() + "天"
                + (hour!=0?(hourString + "小时"):"")
                + (minite!=0?(miniteString + "分"):"")
                + (second!=0?(secondString + "秒"):"");
        }
        else {
            if (hour > 0) {
                str = hourString + "小时"
                    + (minite!=0?(miniteString + "分"):"")
                    + (second!=0?(secondString + "秒"):"");
            }
            else {
                str = miniteString + "分"
                    + (second!=0?(secondString + "秒"):"");
            }
        }
        return str;
    }
    /**
     * 提示性质的时间用这个转换
     * 多余1天的显示**天**小时**分， 多余一小时的显示**小时**分，少于一小时的显示**分**秒 
     * 时分秒不为0的显示 
     * @param time 
     */
    public static formatTimeSecondsToTips(time: number): string {
        var str: string = "";
        var _minite: number;
        var day: number = 0;
        var hour: number = 0;
        var minite: number = 0;
        var second: number = 0;

        second = Math.floor(time % 60);
        _minite = Math.floor((time - second) / 60);
        minite = Math.floor(_minite % 60);
        hour = Math.floor((_minite - minite) / 60);
        day = Math.floor(hour / 24);
        let secondString = second.toString();
        let miniteString = minite.toString();
        let hourString = (hour % 24).toString();
        if (hour >= 24) {
            str = day.toString() + "天"
                + (hour!=0?(hourString + "小时"):"")
                + (minite!=0?(miniteString + "分钟"):"")
                + (second!=0?(secondString + "秒"):"");
        }
        else {
            if (hour > 0) {
                str = hourString + "小时"
                    + (minite!=0?(miniteString + "分钟"):"")
                    + (second!=0?(secondString + "秒"):"");
            }
            else {
                str = miniteString + "分钟"
                    + (second!=0?(secondString + "秒"):"");
            }
        }
        return str;
    }
    /**
     * return 2018-08-11 12:49:30
     * @param date 
     * @param format 
     */
    public static FormatDateToShort(date,format:string="yyyy-MM-dd hh:mm:ss"):string
    {
        return this.FormatDate(format,date);
    }
    public static FormatDataToLong(date,format:string="yyyy-MM-dd hh:mm:ss.S"):string{
        return this.FormatDate(format,date);
    }
    /**************************************时间格式化处理************************************/
    public static FormatDate(fmt:string,date:Date)   
    { 
        var o = {   
            "M+" : date.getMonth()+1,                 //月份   
            "d+" : date.getDate(),                    //日   
            "h+" : date.getHours(),                   //小时   
            "m+" : date.getMinutes(),                 //分   
            "s+" : date.getSeconds(),                 //秒   
            "q+" : Math.floor((date.getMonth()+3)/3), //季度   
            "S"  : date.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return fmt;   
    } 
    /**
     * 获取  X 金币，X 现金描述
     * @param gold 
     * @param cash 
     */
    public static GetGoldAndCashDesc(gold:number,cash:number):string
    {
        var tip:string="";
        if(gold>0)
        {
            tip = tip+ String(gold)+"金币"
            if(cash>0)
            {
                tip = tip+ String(cash)+"现金";
            }
        }
        else 
        {
            if(cash>0)
            {
                tip = tip+String(gold)+"金币";
            }
        }
        return tip;
    }
}
