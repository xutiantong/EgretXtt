
console.log("  game.js first");
var LaunchTime = new Date().getTime();

let bi_adapterInitTime =  new Date().getTime();
require('libs/weapp-adapter/index');
bi_adapterInitTime = new Date().getTime()- bi_adapterInitTime;
require('./utils/biCount')

let bi_parserInitTime =  new Date().getTime();
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
bi_parserInitTime =  new Date().getTime()- bi_parserInitTime;



let bi_downloaderInitTime =  new Date().getTime();
require('libs/wx-downloader.js');
bi_downloaderInitTime =  new Date().getTime()- bi_downloaderInitTime;

let bi_configInitTime = new Date().getTime();
var cconfig = require('./utils/deploy.js');
var version = require('./utils/gameVersion.js');
bi_configInitTime =  new Date().getTime()- bi_configInitTime;

wxDownloader.SUBCONTEXT_ROOT = "myOpenDataContext";

// game config
window.client_login_platform = 'weixin';
window.client_deviceid = '';
window.login_server_gameid = '10017001'; // 登录服appid -- 平台提供
window.login_server_gamekey = 'uRH21v8SDxfdvWbO'; // 登录签名key -- 平台提供
window.midas_offerId = '1450016794'; // 米大师-支付应用ID

//微信小程序
window.socialType = 1;

var envStr = cconfig.getCurrentEnvironment();
var farmSocketUrl = cconfig.getCurrentFarmSocketUrl();
var cdnUrl = cconfig.getCDNUrl();
var appVer =  version.getVersion();
if (envStr == 'release'){
    cdnUrl = cdnUrl + '/release_' + appVer 
    console.log('cdnUrl : ' + cdnUrl)
}
window.getVersion = appVer
window.currentEnvironment = envStr;
window.farmSocketUrl = farmSocketUrl;
window.LaunchTime = LaunchTime;
wxDownloader.REMOTE_SERVER_ROOT = cdnUrl;

console.log('当前环境:' + window.currentEnvironment)
console.log('当前Version: ' + window.getVersion)
console.log('农场Url : ' + window.farmSocketUrl)
console.log('cdn地址 : ' + wxDownloader.REMOTE_SERVER_ROOT)

window.loadingStartTime = new Date().getTime();
console.log("[loadingTime tarce]start game,",window.loadingStartTime)


require('./launch1');

let bi_settingInitTime = new Date().getTime();
require('src/settings');
bi_settingInitTime =  new Date().getTime()- bi_settingInitTime;

// window.toBI("Engine_MainBefore", null, false);
let bi_mainInitTime = new Date().getTime();
require('main');
bi_mainInitTime =  new Date().getTime()- bi_mainInitTime;
window.toBI("Engine_MainAfter", null, false);

window.emitMsg = function(msgStr){
    cc.director.emit(msgStr)
}
let bi_initParamsData = {
    'require_adapter':bi_adapterInitTime,
    'require_parser':bi_parserInitTime,
    'require_downloader':bi_downloaderInitTime,
    'require_config':bi_configInitTime,
    'require_setting':bi_settingInitTime,
    'require_main':bi_mainInitTime
}
//启动加载模块打点
window.toBI("CusRequireInit", bi_initParamsData, false);


