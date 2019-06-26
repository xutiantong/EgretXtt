/**
 * 打点bi
 */


window.BiQueneData = {};
window.BIRequestStart = false;


window.time = new Date().getTime();
window.WX_Launch = null;
window.uid = null;
window.WX_MyOpenid = null;
window.WX_Token = null;
window.WX_InviteOpenid = null;
window.WX_InviteType = null;
window.WX_ShareId = null;
window.login_body = null;
window.systemInfo = null;
window.userInfo = null;
window.clientIp = null;
window.AdID = null;
window.AdMaterial = null;
window.AdType = -1;
window.shareTicket = null;
window.playerLevel = null;

window.onShowInviteType = null;
window.onShowInviteParam = null;
window.LogIndex = 0;
window.TempID = "EW_" + time.toString() + "_" + Math.random().toString();
console.log('tempId: ' + window.TempID);
window.CmdRepeatList = {};
window.CumulatedHideGameTime = 0;
window.LastHideGameTime = 0;
window.GLOBAL = null;
window.isnew = -1;
window.LaunchNumber = 0; // 对于登录过程中碰到的按顺序一定会出的点，打一个自增的点
window.LaunchNumber_Login = 0; // 并行分支部分单独统计：Login部分
window.LaunchNumber_Config = 0; // 并行分支部分单独统计：Config部分
window.LaunchNumber_Scene = 0; // 并行分支部分单独统计：Scene部分
window.checkIsNew =1;

window.mpnews = -1; // 公众号文章进入参数


//即时打点列表
window.BItimelyArr = [
  'Launch',
  'LoadingStart',
  'DownLoadDataTable',
  'DownLoadDataTableRet',
  'GameServerConnect',
  'GameServerLogin',
  'GameServerLoginRet',
  'GameServerInit',
  'GameServerInitRet',
  'DownLoadGameScene',
  'DownLoadGameSceneRet',
  'LoadingFinish',
  'EnterGame',
  'Cus_FinshOneGame',
]

//异步获取设备信息
wx.getSystemInfo({
  success:(resData)=>{
    console.log('bi-getSystemInfo')
    window.systemInfo = resData
    // console.log(resData)
  }
})


window.GetGameTime = () => {
  return new Date().getTime();
};

window.getLaunchAppId = function () {
  if (window.launch !== undefined && window.launch.referrerInfo !== undefined) {
    return window.launch.referrerInfo.appId;
  }
  return null;
}
window.getLaunchExtraData = function () {
  if (window.launch !== undefined && window.launch.referrerInfo !== undefined) {
    return window.launch.referrerInfo.extraData;
  }
  return null;
};
window.getFameIndex = null;


///////////////////////////////////////////////
window.BIDoRequestCheck = function(){
    for (let biquenekey in window.BiQueneData){
      if (biquenekey){
        if (window.currentEnvironment != 'release'){
          console.log('[BI] 打点 BIDoRequestCheck biquenekey ： ' + biquenekey)
        }
        let bidata = window.BiQueneData[biquenekey]
        if (bidata.custom_index == biquenekey){
          window.BIRequest(window.BiQueneData[biquenekey])
          break;
        }
      }
    }
}
/**
 * BI 队列打点请求
 */
window.BIRequest = function (paramsData){
  let reqUrl = "https://public-bi-cn.elexapp.com/client/loading";
  wx.request({
    url: reqUrl,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: paramsData,
    method: 'post',
    success: () => {
     
      if (window.currentEnvironment != 'release'){
        console.log("[BI] 打点 发送BI成功！ actionStep = " + paramsData.step);
        //  console.log("[BI] 打点 发送BI成功！ actionStep = " + paramsData.step + '  actionData : \n' + JSON.stringify(paramsData) );
      }
      let removeKey = paramsData.custom_index;
      // console.log(BiQueneData)
      delete window.BiQueneData[removeKey];
      // console.log(BiQueneData)
      let queneDataKeyArr = Object.keys(window.BiQueneData)
      if (queneDataKeyArr.length == 0){
         window.BIRequestStart = false;
      }

      setTimeout(()=>{
        window.BIDoRequestCheck();
      }, 500);
    },
    fail: (errData) => {
      // console.error("[BI] 打点发送BI失败！type = " + type)
      // console.log("[BI] 打点发送BI失败！type = " +paramsData.type);
      setTimeout(()=>{
        window.BIDoRequestCheck();
      }, 500);
    }
  });
}
/**
 * BI即时打点请求
 */
window.BITimelyRequest = function (paramsData){
  let reqUrl = "https://public-bi-cn.elexapp.com/client/loading";
  wx.request({
    url: reqUrl,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: paramsData,
    method: 'post',
    success: () => {
    
      if (window.currentEnvironment != 'release'){
        console.log("[BI] 打点 即时发送BI成功！ actionStep = " + paramsData.step);
        //  console.log("[BI] 打点 发送BI成功！ actionStep = " + paramsData.step + '  actionData : \n' + JSON.stringify(paramsData) );
      }
    },
    fail: (errData) => {}
  });
}
////////////////////////////////////////////////////////
window.toBI = function (type, extValue = null, isImportant = false) {
  if (window.CmdRepeatList[type] == null) {
    window.CmdRepeatList[type] = 0;
  }else{
    let count =Number(window.CmdRepeatList[type])  + 1;
    window.CmdRepeatList[type] = count;
  }
  window.LogIndex = window.LogIndex + 1;
  let _uid = window.uid;  // 为userId
  let platformV = "default";
  let countryV = "default";
  let gameVersion = window["getVersion"]  ;
  let serverUrl = window["login_server_url"];
  if (window.systemInfo) {
    platformV = window.systemInfo.platform;
    countryV = window.systemInfo.language;
    if (countryV == 'zh_CN'){
      countryV = 'CN';
    }
  }
  let paramsData = {
    uid: _uid ? _uid : '',
    deviceId: window.WX_MyOpenid ? window.WX_MyOpenid:'',
    country: countryV,
    ip:  window.clientIp ? window.clientIp: '',
    version: gameVersion ? gameVersion:'',
    platform: platformV,
    step: type,
    connection:'1',
    networkstatus:'',
    gaid:'',
    costtime: 0,
    prod: 36,
    ext: '',
    custom_index: String(window.LogIndex)  + '_' + type
  };

  let extV = {};
  if (extValue) {
    extV = extValue;
  }
 
  extV.level = window.playerLevel? window.playerLevel:1;
  if (window.AdID != null) {
    extV.adtype = window.AdType;
    if (window.AdMaterial != null) {
      extV.admaterial = window.AdMaterial;
    }
  }
  extV.NowTime = window.GetGameTime();//打点时刻本地时间戳
  extV.From = window.From;
  extV.adid = window.channel ?window.channel :'';
  extV.Env = window.currentEnvironment;//当前打点的前端环境 
  extV.Index = window.LogIndex; // 每次加一
  extV.TempID = window.TempID;// 该次游戏过程的唯一ID
  extV.Time = window.GetGameTime() - window.LaunchTime - window.CumulatedHideGameTime;  //当前时间 - 启动时间- 减去切后台时间
  extV.HideTime = window.CumulatedHideGameTime;
  extV.Repeat = window.CmdRepeatList[type];//打点重复次数
  extV.isnew = window.isnew;//添加用户状态-是否新用户
  if (window.getFrameIndex) {
    extV.Frame = window.getFrameIndex();
  }

  if (isImportant === true) {
    extV.systeminfo = window.systemInfo;
    extV.userinfo = window.userinfo;
  }
  let extStr = JSON.stringify(extV);
  extStr = extStr.replace('\\', '/');
  paramsData.ext = extStr;

  //console.log("[BI] 打点 新增打点！ actionStep = " + paramsData.step + '  actionData : \n' + JSON.stringify(paramsData) );
  window.time = new Date().getTime();
  if(window.BItimelyArr.indexOf && typeof(window.BItimelyArr.indexOf)=='function'){
    let index = window.BItimelyArr.indexOf(paramsData.step);
    if(index >= 0){
      window.BITimelyRequest(paramsData)
      return 
    }
  }
  window.BiQueneData[paramsData.custom_index] = paramsData ;
  if (window.BIRequestStart == false){
    window.BIRequestStart = true;
    window.BIDoRequestCheck();
  }
}
