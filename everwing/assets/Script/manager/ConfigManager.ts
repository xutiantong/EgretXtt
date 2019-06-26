import { RES } from "./ResourceManager";
import Log from "../utils/log/Log";
import { LogUtils } from "../utils/log/LogUtils";
import { HttpManager } from "../net/core/HttpManager";
import { SOCIAL } from "../modules/social/SocialAssist";
import DottingUtil, { BIActionConst } from "../utils/DottingUtil";
import { AssetConst, ConfigConst } from "../GameConst";

export const storageConfigConst = {
    kConfigVersion: "localStorage_configVersion",
    kConfigData:"localStorage_configData",
    kConfigMd5:"localStorage_configMd5",
}

export default class ConfigManager{

    private static _instance: ConfigManager = null;
    public static getInstance(): ConfigManager {
        if (ConfigManager._instance == null) {
            ConfigManager._instance = new ConfigManager();
            
        }
        return ConfigManager._instance;
    }
    private _cfgMap:any = {};
    private _configMd5Map:any = {};
    private _configServerMap:any = {};
    private _configServerMd5:any = {};
    private _completeHandler:Function=null;
    private _configNamesArr:string[] = null;
    private _configresArr:string[];
    private _cdnPathPrefix:string = "https://ppfiles-1256721769.file.myqcloud.com/everwing/config/";
    private _cdnPath:string = "";
    private _md5Name:string = "config.md5";
    private _md5Path:string = "";
    public loadConfig(completeHandler:Function =null){
        // if(completeHandler){
        //     LogUtils.showLog("ConfigManager 配置读取成功  回调  this._completeHandler()")
        //     completeHandler();
        // }

        LogUtils.showLog('ConfigManager loadConfig()')
        SOCIAL.socialBase.toBI("DownLoadDataTable");
        this._completeHandler = completeHandler;
        this._configNamesArr=[];
        for (let prop of Object.keys(ConfigConst)){
            this._configNamesArr.push(ConfigConst[prop]);
        }
        if(CC_DEBUG)
        {
            console.debug("configNamesArr: \n"+this._configNamesArr);
        }
        var tempWindowType = Number(window['socialType'])
        if (tempWindowType == 0){
           this.loadServerConfig()
        }else if (tempWindowType == 1){
            if (window['currentEnvironment'] == 'release'){
                this.checkConfigStorage();
            }else{
                this.loadServerConfig();
            }
        }

    }
    
    //直接读取服务器配置
    private loadServerConfig(){
        let __self = this
        this.loadMD5(
            function(){
                __self.loadMD5Complete(
                    function(){
                        __self.loadConfigComplete()
                    })
            });
    }
    //检查本地缓存配置
    private checkConfigStorage(){

        LogUtils.showLog("ConfigManager checkConfigStorage()")
        DottingUtil.bi_normalFun(BIActionConst.kActName_DownLoadDataCheckUpdate,null);
        let configVersionJS = cc.sys.localStorage.getItem(storageConfigConst.kConfigVersion)
        if (configVersionJS){
            let configVersion = JSON.parse(configVersionJS)
            if (configVersion){
               if (configVersion.version == window["getVersion"]){
                   let configDataJS = cc.sys.localStorage.getItem(storageConfigConst.kConfigData);
                   if (configDataJS){
                        let configData = JSON.parse(configDataJS);
                        if (configData){
                            this._cfgMap = configData;
                            console.log('缓存配置')
                            console.log( this._cfgMap)
                            if(this._completeHandler){
                                LogUtils.showLog("ConfigManager 配置读取成功  回调  this._completeHandler()")
                                this._completeHandler();
                            }
                            let configMd5JS = cc.sys.localStorage.getItem(storageConfigConst.kConfigMd5);
                            if (configMd5JS){
                                this._configMd5Map = JSON.parse(configMd5JS)
                                if (this._configMd5Map){
                                    this.compareToCdnMd5();
                                }
                            }
                            return ;
                        }
                   }
                }
            }
        }
    
        
        //没有缓存配置，直接读取文件配置
        this.loadLocalJsonData();
         
    }

    /////////////////////////////////////////////////////
    private localLoadQuene = [];
    private loadLocalJsonData(){
        LogUtils.showLog('ConfigManager loadLocalJsonData()');
        // var tempArr =[];
        
        // let tempLoadResData = {}
        let successStatusData:Object = {};
        this._configNamesArr.forEach((value: string, index: number, array: string[]) => {
            // tempArr.push('/config/'.concat(value).concat(".json"))
           
            let tempData = {
                loadFinish:0,
                url:'/config/'.concat(value).concat(".json"),
                configKey:value
            }
            let successStatusData = {value:false};
            this.localLoadQuene.push(tempData);
            // tempArr.push(tempData);
            // tempLoadResData[value] = tempData;
            // tempLoadResData['url'] = '/config/'.concat(value).concat(".json")
        });
 
        console.log(this.localLoadQuene)
        console.log('ConfigManager startLoadLocalConfig')
        let tempJsonMap = {};
        let __self = this;
       
        this.localLoadQuene.forEach(element => {
            if (element){
                var cfg = element.url;
                cc.loader.load(cfg,function(err,res){
                    if (res){
                        tempJsonMap[element.configKey] = res[element.configKey];
                        console.log('jsonKey : ' + element.configKey);
                        // console.log(res);
                    }
                    element.loadFinish = 1;
                    __self.__checkLoadFinish();
                });
            }
        });
        this._cfgMap = tempJsonMap;
        console.log(tempJsonMap);
        console.log('ConfigManager forEach End');
    }

    private __checkLoadFinish(){
        console.log('__checkLoadFinish')
        for (let i in  this.localLoadQuene){
            // console.log(this.localLoadQuene[i])
            if ( this.localLoadQuene[i].loadFinish == 0){
                return ;
            }
        }
        if(this._completeHandler){
            this._completeHandler();
        }
        //读取本地配置md5文件，检查更新
        this.loadLocalConfigMd5();
    }


    ////////////////////////////////////////////
    //加载程序包配置
    private jsArr = [];
    private loadLocalMD5(){
        LogUtils.showLog('ConfigManager loadLocalMD5()')
        var tempArr =[]
        
        this._configNamesArr.forEach((value: string, index: number, array: string[]) => {
            tempArr.push('/config/'
                .concat(value)
                .concat(".json"))
        });
        this.jsArr = tempArr;
        console.log(tempArr)
        this.loadConfigData(0)
    }
    private loadConfigData(index ) {
        var count =  this.jsArr .length;
    
            if (index < count){
                var cfg =  this.jsArr [index]
                var __self = this
                cc.loader.load(cfg ,function(err,res){
                    // console.log(err)
                    // console.log(res)
                    if (!err){
                         //     console.log('configManger  load config finish : index' + index );
                        __self.parseCfg(res);
                        var newIndex  = index + 1;
                        __self.loadConfigData(newIndex)
                    }else{
                        console.error('ConfigManger  load config error : cfg' + cfg );
                    }
   
                })
            }else{
                //递归结束
                console.log('递归结束 配置表数据:')
                if (CC_DEBUG){
                    // console.log( this._cfgMap);
                }
                if(this._completeHandler){
                    this._completeHandler();
                }
                // this.loadLocalConfigMd5()
            }
    }
    ////////////////////////////////////////////////////////////
    //读取代码包内部的配置md5
    private loadLocalConfigMd5(){
      LogUtils.showLog('ConfigManager loadLocalConfigMd5()')
        let cfgMd5 = "/config/md5.json";
        let __self = this;
        cc.loader.load(cfgMd5 ,function(err,res){
            // console.log('/config/md5.json')
            // console.log(res)
            for (let key in res) {
                __self._configMd5Map[key] = res[key];
            }
            // console.log( __self._configMd5Map)
            __self.compareToCdnMd5();
        })
    }
    private compareToCdnMd5(){
        LogUtils.showLog('ConfigManager compareToCdnMd5()')
        let __self = this;
        this.loadMD5(
            function (){
                console.log('serverMd5回调')
                let md5Info = JSON.parse(RES.get(this._md5Path));
                // console.log(md5Info);
                this._configServerMd5 = md5Info;
                let isChanged:boolean = false;
                // console.log('cacheMd5')
                // console.log(this._configMd5Map)
                // console.log('serverMd5')
                // console.log(md5Info)
                for (let key in md5Info){
                    let serverMd5 = md5Info[key]
                    let localMd5 = this._configMd5Map[key]
                    if (serverMd5 != localMd5){
                        isChanged = true;
                        break;
                    }
                }
                if (isChanged){
                    __self.loadMD5Complete(
                        function(){
                            __self.saveServerConfig()
                        }
                    )
                }
            }
        )
    }

    private saveServerConfig(){
        for (var k in this._configresArr) {
            let urlkey:any = this._configresArr[k];
            let config = RES.get(urlkey);
            for (let key in config) {
                this._configServerMap[key] = config[key];
            }    
        }
        console.log(this._configServerMap)
        this._cfgMap = this._configServerMap;
        this._configMd5Map = this._configServerMd5;
        let versionData = {
            version:window["getVersion"]
        }
        cc.sys.localStorage.setItem(storageConfigConst.kConfigVersion, JSON.stringify(versionData));
        cc.sys.localStorage.setItem(storageConfigConst.kConfigData, JSON.stringify(this._configServerMap));
        cc.sys.localStorage.setItem(storageConfigConst.kConfigMd5 , JSON.stringify(this._configServerMd5));
    }
    ////////////////////////////////////////////////
    private loadMD5(cb:Function) {
        let string = 'ConfigManager loadMD5()  ' ;
        if (cb){
            string =  string + '有 cb 回调';
        }
        LogUtils.showLog(string)
        console.log(window['currentEnvironment'])
        console.log(window['getVersion'])
        this._cdnPath = this._cdnPathPrefix.concat(window['currentEnvironment'] === 'release' ? 
            'release/'.concat(window['getVersion']).concat('/') : 
            'dev/')
        this._md5Path = this._cdnPath.concat(this._md5Name)
            .concat("?time=")
            .concat(String(new Date().getTime()))
        var md5Array = [
            this._md5Path,
        ];
        if(CC_DEBUG)
        {
            console.log(md5Array)
        }
        RES.loadArr(md5Array,null,cb.bind(this),this.loadMD5Failed.bind(this));
    }

    private loadMD5Complete(cb:Function) {
        let string = 'ConfigManager loadMD5Complete()   ' ;
        if (cb){
            string =  string + '有 cb 回调';
        }
        LogUtils.showLog(string)
        this._configresArr = []
        let md5Info = JSON.parse(RES.get(this._md5Path));
        console.log(md5Info)
        this._configServerMd5 = md5Info;
        for (let key in md5Info) {
            if (key != "md5"){
                this._configresArr.push(this._cdnPath
                    .concat(key)
                    .concat(".")
                    .concat(md5Info[key])
                    .concat(".json"));
            }
        }
        if(CC_DEBUG)
        {
            console.log(this._configresArr)
        }
        RES.loadArr(this._configresArr,null,cb.bind(this),this.loadConfigFailed.bind(this));
    }
    
    private loadMD5Failed() {
        this._configresArr = []
        this._configNamesArr.forEach((value: string, index: number, array: string[]) => {
            this._configresArr.push(this._cdnPath
                .concat(value)
                .concat(".json"))
        });
        console.log(this._configresArr)
        RES.loadArr(this._configresArr,null,this.loadConfigComplete.bind(this),this.loadConfigFailed.bind(this));
    }

    private loadConfigComplete(){
        LogUtils.showLog('ConfigManager loadConfigComplete()')
        SOCIAL.socialBase.toBI("DownLoadDataTableRet", { ret: 0 });
        for (var k in this._configresArr) {
            var key:any = this._configresArr[k];
            let config = RES.get(key);
            this.parseCfg(config);
        }
        console.log('配置表数据:')
        console.log( this._cfgMap)
        if(this._completeHandler){
            this._completeHandler();
        }
    }
    private loadConfigFailed(){
        Log.error("config loader error!");
        SOCIAL.socialBase.toBI("DownLoadDataTableRet", { ret: 1 });
    }

    public parseCfg(config: any) {
        for (let key in config) {
            this._cfgMap[key] = config[key];
        }
    }
    
    /**
     * 
     * @param cfgName 配置表名
     * @returns 配置表json对象
     */
    public getCfgGroup(cfgName:string):any{
        return this._cfgMap[cfgName];
    }

    /**
     * 
     * @param cfgName 配置表名
     * @param id 数据id
     * @returns 数据项
     */
    public getCfgDataById(cfgName:string,id:string):any{
        var data:any = this.getCfgGroup(cfgName);
        return data[id];
    }

    /**
     * 根据属性对应的值取数据
     * @param cfgName  表名
     * @param args  key,value,key,value....
     */
    public getCfgByKey(cfgName:string,...args):any
    {
        let len = args.length
        if(len%2!=0)
        {
            Log.debug("cfg.getCfgByKey所需参数不是完整的key-value")
            return;
        }
        let dic:any = this.getCfgGroup(cfgName);
        let obj:any;
        let arr:Array<any> =[];
        for(let key in dic){
            obj = dic[key];
            let ret:boolean = true;
            for(let i = 0;i<len;i++)
            {
                if(obj[args[i]]!=args[++i])
                {
                    ret = false;
                    break;
                }
            }
            if(ret)
            {
                arr.push(obj);
            }
         }
         return arr;
    }
    /**
     * 根据属性对应的值取数据
     * @param cfgName  表名
     * @param args  key,value,key,value....
     */
    public getArrayCfgByKey<T>(cfgName:string,...args):Array<T>
    {
        let len = args.length
        if(len%2!=0)
        {
            Log.debug("cfg.getCfgByKey所需参数不是完整的key-value")
            return;
        }
        let dic:any = this.getCfgGroup(cfgName);
        let obj:any;
        let arr:Array<T> =[];
        for(let key in dic){
            obj = dic[key];
            let ret:boolean = true;
            for(let i = 0;i<len;i++)
            {
                if(obj[args[i]]!=args[++i])
                {
                    ret = false;
                    break;
                }
            }
            if(ret)
            {
                arr.push(<T>obj);
            }
         }
         return arr;
    }
    public getText(id:any,...args: string[]):string
    {
        return String(id);
    }



}


export var CFG = ConfigManager.getInstance();