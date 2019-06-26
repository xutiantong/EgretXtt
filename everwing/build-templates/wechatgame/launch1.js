
// require('./utils/md5');
var utils = require('./utils/ever_utils.js');

var game = require('./utils/ever_game.js');

require('./utils/ever_wxLogin')
require('./utils/ever_wxAPI');




let onshowFunc = function(res){
    console.log("OnShow Info:" + JSON.stringify(res));
    window.emitMsg("appOnShow");
   
    if(window.LastHideGameTime != 0)
    {
      window.CumulatedHideGameTime += (window.GetGameTime() - window.LastHideGameTime);
    }
    if (window.adId == 0)
    {
      if (res.hasOwnProperty("scene"))
      {
        window.From = res.scene;
      }
      if (res.hasOwnProperty("query"))
      {
        var query = res.query;
        if (query.hasOwnProperty("scene"))
        {

          var n=String(query.scene).split("_");
          window.adId = n[0];
          if (n.length >1)
          {
            window.adMaterial = n[1];
          }
          window.AdType = 2;
        }
        if(query.hasOwnProperty("weixinadinfo"))
        {
          let weixinadinfo = query.weixinadinfo;
          if (weixinadinfo) {
            let weixinadinfoArr = weixinadinfo.split('.');
            window.adId  = weixinadinfoArr[0];
          }
        }
        if(query.hasOwnProperty("type")){
          if(query.type == "14"){
            window.adId = "quntui";
          }
        }
      }      
      
      if (window.adMaterial == null && res.hasOwnProperty("referrerInfo"))
      {
        window.adMaterial = res.referrerInfo.appId;
      }
      console.log("adId: ", window.adId);
      console.log("adMaterial: ", window.adMaterial);
    }

    window["wxOnShow"](res);

    let biData = {};
    biData.From = res.scene;
    biData.ShareTicket = res.shareTicket;
    biData.Param = res;
    biData.InviterID = window.WX_InviteOpenid;
    biData.InviteType = window.WX_InviteType;
    biData.ShareID = window.WX_ShareId;
    window.toBI("OnShow", biData, true);
}
let onHideFunc = function(res){
   window.emitMsg("appOnHide");
  
    window.LastHideGameTime = window.GetGameTime();

    window["wxOnHide"](res);

    window.toBI("OnHide", null, false);
}

let shareCallbackFunc = function(){
    let share_Id = window.WX_MyOpenid + Date.now();
    let rData = {
      title: '我不是针对谁，我是说群里的各位都坚持不到10秒！',
      imageUrl: "https://ppfiles-1256721769.file.myqcloud.com/everwing/shareImg/share_pic140.png",
      query: "shareOpenid="+window.WX_MyOpenid + "&shareid=" + share_Id ,
      shareId : share_Id
    }
    console.log('shareData :' );
    console.log(rData);
    return {
      title:rData.title,
      imageUrl:rData.imageUrl,
      query:rData.query,
      success:function(res){
        if (res.shareTickets)
          {
            var tciket = res.shareTickets[0];
            let tempData = rData
            // console.log("右上角分享成功");
            // console.log(res)
            wx.getShareInfo({
              shareTicket: tciket,
              success: function (getShareInfoRes) {
                // console.log('加密数据')
                // console.log(getShareInfoRes)
                window.onShareAppMsgSuccessCallback( tempData,res,getShareInfoRes)
              },
              fail: function (errorRes) {
                // console.log("错误信息：" + res.errMsg);
                // console.log("加密数据：" + res.encryptedData);
                // console.log("加密初始向量" + res.iv);
              }
            })
          }
      }
    }
}



let appOnLaunch = function()
{
  var launch = wx.getLaunchOptionsSync();
  window.WX_InviteOpenid = launch.query["shareOpenid"];
  window.WX_InviteType = launch.query["type"];
  window.WX_ShareId = launch.query["shareid"];
  if(launch.query["channel"]!=undefined){
    window.channel = launch.query["channel"];
  }
  window.From = launch.scene;
  let tempAdmaterail  = "";
  if (launch.referrerInfo && launch.referrerInfo.appid){
    tempAdmaterail =  launch.referrerInfo.appid;
  }

  console.log("取得渠道：",window.channel);

  console.log(launch.query);
  console.log("邀请者的OpenId是"+window.WX_InviteOpenid);
  ///// bi[Launch]

  let biData = {}
  biData.Query = launch.query;
  biData.IsSticky = launch.isSticky;
  biData.ShareTicket = launch.shareTicket;
  biData.ReferrerInfo = launch.referrerInfo;
  biData.AdapterTime = window.AdapterTime;
  biData.ParserTime = window.ParserTime;
  biData.DownloaderTime = window.DownloaderTime;
  biData.SettingTime = window.SettingTime;
  biData.CocosInitTime = window.CocosInitTime;

  if(launch.query["channel"]!=undefined){
    window.channel = launch.query["channel"];
  }
  biData.From = window.From;
  biData.adid = window.channel;
  biData.admaterail = tempAdmaterail;
  biData.ShareID = window.WX_ShareId;

  biData.adtype= '';
  biData.InviterID = window.WX_InviteOpenid ?window.WX_InviteOpenid:'';
  biData.InviteType = window.WX_InviteType ?window.WX_InviteType:'';
  window.toBI("Launch", biData, true);
 
  //尝试清除缓存资源
  // window.toBI("L2");
  wx.onHide(onHideFunc);
  wx.onShow(onshowFunc)
  // window.toBI("L3");

  game.checkUpdate();
  // window.toBI("L4");

     // 设置分享需要带shareTicket
  wx.updateShareMenu({
        withShareTicket: true
  });
  // window.toBI("L5"); 
   // 注册用户点击右上角转发侦听
  wx.onShareAppMessage(shareCallbackFunc)
//   window.getShareCanvas = sharedCanvas;
  // window.toBI("L6");
        // 设置右上角显示转发
  wx.showShareMenu();
  window.toBI("LaunchEnd");
}


appOnLaunch();
