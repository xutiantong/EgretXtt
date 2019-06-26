import StringUtil from "../StringUtil";


export class LogUtils {

    static showLog(data:any){
        var logString =  'LogUtils ' ;
        logString  = logString + StringUtil.FormatDataToLong(new Date());
        logString = logString + "   " + data;
        console.log(logString)

    }
}