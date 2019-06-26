var utils = require('./ever_utils');
var game = require('./ever_game.js');
/*----------用户信息相关 begin-------------*/
//获取微信用户信息 
  window.getWxUserInfo = function(cb)
  {
    // window.toBI("wx:getUserInfo");
    wx.getUserInfo({
      success: function(res) {
        // window.toBI("wx:getUserInfo_success");
          console.log('玩家信息：' + res.errMsg)
          game.checkUnionId(res);
          cb(res);
      },
      fail:function(){
        // window.toBI("wx:getUserInfo_fail");
        console.log('获取玩家信息出错');
        cb(null);
      }
    })
  }
//获取微信用户信息  带加密数据
  window.getWxUserInfoWithCredentials = function(cb){
    // window.toBI("wx:getWxUserInfoWithCredentials");
    wx.getUserInfo({
      withCredentials:true,
      success: function(res) {
        // window.toBI("wx:getUserInfo_success");
          console.log('玩家信息：' + res.errMsg)
        //   game.checkUnionId(res);
          cb(res);
      },
      fail:function(){
        // window.toBI("wx:getUserInfo_fail");
        console.log('获取玩家信息出错');
        cb(null);
      }
    })
  }

  window.userInfoBtn = function(left,top,width,height ,cb){
    let button = wx.createUserInfoButton({
      type: 'text',
      text: '',
      style: {
          left: left,
          top: top,
          width: width,
          height: height,
          lineHeight: height,
          backgroundColor: '',
          color: '#fff',
          textAlign: 'center',
          fontSize: 18,
          borderRadius: 13
      }
    })
    button.onTap((res) => {
      cb && cb(res)
    })  
    return button
  }

  window.userInfoBtnShow = function(button){
    if (button){
      button.show()
    }
  }
  window.userInfoBtnHide = function(button){
    if (button){
      button.hide()
    }
  }
  window.userInfoRemove = function(button){
    if (button){
      button.destroy()
    }
  }
/*----------用户信息相关 end-------------*/

/*----------分享 begin-------------*/

window.shareAppMessage = function (titleParam, imgUrl, queryParam, cb) {
    // for type is ShareType_WxQRShare || ShareType_WxTGShare
    // allow card to be shared directly in wechat 
    let matchResult = queryParam.match(/type=(\d+)\b/);
    let queryType = matchResult ? matchResult[1] : null;
    let withShareTicket = true;
    console.log(`*** withShareTicket: ${withShareTicket}, queryParam: ${queryParam}, queryType: ${queryType}`);
  
    wx.updateShareMenu({
      withShareTicket: withShareTicket,
      complete: function (ret) {
        console.log(`*** ${ret.errMsg}`);
  
        let shareId = window.WX_MyOpenid + Date.now();
        let shareData = {
          title: titleParam,
          imageUrl: imgUrl,
          query: "shareOpenid=" + window.WX_MyOpenid + "&shareid=" + shareId + queryParam
        }
        console.log('shareAppMessage : ')
        console.log(shareData)
        wx.shareAppMessage({
          title: shareData.title,
          imageUrl: shareData.imageUrl,
          query: shareData.query,
          success: function (res) {
            console.log('zyt=== 分享回调')
            window.onShareAppCB(res, shareId, cb);
          },
          complete: function () {
            console.log("*** reset withShareTicket to true");
            wx.updateShareMenu({
              withShareTicket: true
            });
          }
        });
      }
    });
  }

  window.shareAppMessage_v1 = function (titleParam,imgUrl,queryParam,openShareCb,completeCb){
    let matchResult = queryParam.match(/type=(\d+)\b/);
    let queryType = matchResult ? matchResult[1] : null;
    let withShareTicket = true;
    let shareId = window.WX_MyOpenid + Date.now();
    let shareData = {
      title: titleParam,
      imageUrl: imgUrl,
      query: "shareOpenid=" + window.WX_MyOpenid + "&shareid=" + shareId + queryParam
    }
    console.log('use shareAppMessage : ',shareData)
    openShareCb && openShareCb(shareData,shareId,withShareTicket == true ? 1:0);
    wx.updateShareMenu({
      withShareTicket: withShareTicket,
      complete: function (ret) {
        console.log('*** ${ret.errMsg}');
        wx.shareAppMessage({
          title: shareData.title,
          imageUrl: shareData.imageUrl,
          query: shareData.query,
          success: function (res) {
            console.log('zyt=== 分享回调')
            window.onShareAppCB(res, shareId, completeCb);
          },
          complete: function () {}
        });
      }
    });
  }

window.onShareAppCB = function (res, shareId, cb) {
    console.log("收到分享成功回调");
    //window.toBI("wx:shareAppMessage_success");
    if (window.systemInfo.platform == 'ios') {
      console.log("用户是IOS系统");
      if (res.shareTickets != null) {
        console.log("转发给群组");
        var tciket = res.shareTickets[0];
        wx.getShareInfo({
          shareTicket: tciket,
          success: function (res) {
            console.log("转发给群组");
            cb(res, shareId, 1, res.encryptedData);
          },
          fail: function (res) {
            console.log("转发给个人");
            cb(res, shareId, 0, null);
          },
        })
      } else {
        console.log("转发给个人");
        cb(res, shareId, 0, null);
      }
    } else {
      console.log("用户是安卓系统");
      if (res.shareTickets) {
        var tciket = res.shareTickets[0];
        wx.getShareInfo({
          shareTicket: tciket,
          success: function (res) {
            console.log("转发给群组");
            cb(res, shareId, 1, res.encryptedData);
          },
          fail: function (res) {
            console.log("转发给个人");
            cb(res, shareId, 0, null);
          },
        })
      } else {
        cb(res, shareId, 0, null);
      }
    }
  }

  window.onShareAppMsgSuccessCallback = function(shareParams,shareRes,getShareInfoRes){
    console.log('onShareAppMsgSuccessCallback');
    console.log(shareRes);
    console.log(getShareInfoRes);
    let biData1 = {
      TempID:window.TempID,
      type:'18',
    };
    let tempShareTo = 0;
    if (shareRes.shareTickets && shareRes.shareTickets[0]){
      tempShareTo = 1;
    }
    let biData2 = {
        TempID:"XXXXXX",
        type:"18",
        sharefrom:"0",
        shareto:tempShareTo,
        From:"",
        adid:"",
        admaterail:"",
        adtype:"",
        systeminfo:"",
        userinfo:"",
        ret:0,
        level:0,
        ShareID:shareParams.shareId,
      } ;

   window.toBI("WXShareAppMessage",biData1);
   window.toBI("WXShareAppMessageRet",biData2);
  }
 

  

  window.createShareImg = function (bgSrc, name, cb) {
    var canvas = wx.createCanvas();
    // canvas.id = "myCanvas";
    canvas.width = 500;
    canvas.height = 400;
  
    var context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.fill();
  
    var myImage = new Image();
    myImage.src = window.getShareUrl(bgSrc);//"fenxiang_bg.png";
    myImage.crossOrigin = 'Anonymous';
    myImage.onload = function () {
      context.drawImage(myImage, 0, 0, 500, 400);
      context.textAlign = "center";
      context.font = "32px Helvetica Bold";
      context.fillStyle = "#333";
      context.fillText(name, 250, 334);
      context.fillStyle = "#fff";
      canvas.toTempFilePath({
        x: 0,
        y: 0,
        width: 500,
        height: 400,
        fileType:"png",
        success: (res) => {
          console.log(res);
          // wx.shareAppMessage({
            
          //   imageUrl:res.tempFilePath
          //   // imageUrl: window.getShareUrl("resources/image/share/share_pic101.png")
          // });
          // console.log("uri:"+canvas.toDataURL());
          // wx.shareAppMessage({
          //   imageUrl: canvas.toDataURL()
          // });
          cb&&cb(res.tempFilePath);
          var fileManager=wx.getFileSystemManager();
          fileManager.getFileInfo({filePath:res.tempFilePath,success:()=>{
            console.log("成功获取文件信息");
          },fail:()=>{
            console.log("文件获取失败");
          }});
        },
        fail:(err)=>{
          console.log(err);
        }
      })
    }
  }

  /*----------分享 end-------------*/


  /*----------支付 start-------------*/
  window.midasPayment = function(data, successCallBack, failCallBack) {
    wx.requestMidasPayment({
      mode: data.mode,                 //购买游戏币 game
      env: window.midas_env,                       //0 正式环境，1 沙箱环境
      offerId: window.midas_offerId,        //米大师应用ID
      currentType: "CNY",           //币种（人民币）
      platform: "android",          //申请接入时的平台，platform与应用id有关
      buyQuantity: data.quantity,               //购买数量，mode=game时必填
      zoneId: "1",
      success: function (res) {
        console.log("米大师回调成功");
        console.log(res);
        // window.toBI("wx:requestMidasPayment_success");
        successCallBack();
      },
      fail: function (res) {
        console.log("米大师回调失败");
        // window.toBI("wx:requestMidasPayment_fail");
        console.log(res);
        failCallBack(res);
      }
    });
  }

  window.requestMidasPayment = function(data, successCallBack, failCallBack)
  {
    console.log("请求支付参数:"+JSON.stringify(data));
    wxCheckSession(() => {
      midasPayment(data, successCallBack, failCallBack);
    },
    () => {
      login(() => {
        midasPayment(data, successCallBack, failCallBack);
      });
    })
  }
 /*----------支付 end-------------*/

/*----------微信授权 start-------------*/
 window.wxGetSetting=function(successCallBack,failCallBack)
 {
   wx.getSetting({
     success: (res) => {
       console.log("授权信息:"+res.authSetting["scope.userInfo"]);
       if(res.authSetting["scope.userInfo"]==undefined)
       {
         console.log("scope.userInfo undefined");
         successCallBack(0);//未授权过
         return
       }
       if (res.authSetting["scope.userInfo"] == false) {
         //未授权
         console.log("scope.userInfo false -1");
         successCallBack(-1)//未授权 拒绝过
         // wx.openSetting({
         //   success:function(res){
         //     if (!res.authSetting["scope.userInfo"]) {
         //       successCallBack(1);//拒绝过
         //     }
         //     else
         //     {
         //       console.log("曾经拒绝授权");
         //       successCallBack(2);
         //     }
         //   }
         // })
       }
       else{
         //已经授权
         successCallBack(1);
       }
     },
     fail:failCallBack
   });
 }
 window.wxOpenSetting=function(successCallBack,failCallBack)
 {
   wx.openSetting ({
     success:successCallBack,
     fail:failCallBack
   })
 }

/*----------微信授权 end-------------*/

  //客服回话
  window.openCustomerServiceConvers = function(opt){
    console.log('wx.openCustomerServiceConversation')
    console.log(opt)
    wx.openCustomerServiceConversation({
      sessionFrom:opt.sessionFrom,
      showMessageCard:opt.showMessageCard,
      sendMessageTitle:opt.sendMessageTitle,
      sendMessagePath:opt.sendMessagePath,
      sendMessageImg:opt.sendMessageImg,
      success:opt.success,
      fail:opt.fail,
      complete:opt.complete
    })
  }


  window.linkToOther = function(appid,param,successCb,failCb)
  {
    if(wx.navigateToMiniProgram == undefined){
      return false;
    }
    var data={
      appId:appid,
      path:"",
      extraData:param,
      envVersion:window.link_env,//开发版本 develop //体验版本 trial// 正式版本release
      success:function(){
        successCb&&successCb();
      },
      fail:function(err){
        failCb&&failCb()
      },
    };
    wx.navigateToMiniProgram(data);
  }


window.exitMiniProgram = function(){
  console.log('exitMiniProgram')
  if(wx.exitMiniProgram)
  {
    wx.exitMiniProgram(()=>{
      console.log("退出游戏 成功");
    },()=>{
      console.log("退出游戏 失败");
    });
  }
}

/**
 * 跳转其他小程序
 * @param {} param 
 */
window.gotoOther = function(param)
{
  if(wx.navigateToMiniProgram == undefined){
    return false;
  }
  wx.navigateToMiniProgram(param);
  return true;
}


// 视频广告
window.isPlayVideoAd = false;
window.showVideoAd = function (cb,VideoAd_type,VideoAd_id) {
  if (wx.createRewardedVideoAd == undefined) {
    return false;
  }

  if (window.isPlayVideoAd == false) {
    window.isPlayVideoAd = true;
    if(VideoAd_id != "") {
      
      window.rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: VideoAd_id //'adunit-89d8c5ca85c9cfc5'
      })
    }

    window.rewardedVideoAd.onLoad(() => {
      console.log('激励视频 广告加载成功');
      window.toBI("SeeVideo", { type: VideoAd_type, time: 0 });
      window.rewardedVideoAd.offLoad();

    })
    window.rewardedVideoAd.onError(err => {
      console.log(err, "激励视频 广告加载失败");
      window.rewardedVideoAd.offError();
      cb(2);
      window.toBI("SeeVideoRet", { ret: 2, time: 0, type: VideoAd_type, }, true);

    })


    window.rewardedVideoAd.onClose(res => {
      window.isPlayVideoAd = false;

      let retCode = 0;
      if (res && res.isEnded || res === undefined) {
        // 正常播放结束，可以下发游戏奖励
        if (cb != null) {
          console.log("发奖励，", res);
          cb(1);
        }
        retCode = 0;
      }
      else {
        // 播放中途退出，不下发游戏奖励
        retCode = 1;
        cb(0);
      }
      window.toBI("SeeVideoRet", { ret: retCode, time: 0,type: VideoAd_type },true);

      window.rewardedVideoAd.offClose();

    })
    // window.rewardedVideoAd.show()
    // .catch(err => {
    //   window.rewardedVideoAd.load()
    //     .then(() =>  window.rewardedVideoAd.show())
    // })
    window.rewardedVideoAd.load()
      .then(() => window.rewardedVideoAd.show())
      .catch(err => {
        console.log(err.errMsg)
        window.isPlayVideoAd = false;
      })

  }
}

// 给子域发送消息
window.wxPostMessage = function(data)
{
  wx.postMessage(data);
}

window.judgeIsFollow = function(cb)
{
  let reqUrl = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+window.WX_Token+"&openid="+window.WX_MyOpenid+"&lang=zh_CN";
  wx.request({
    url: reqUrl,
    method: 'get',
    success: (res) => {
      if(res.subscribe != undefined && res.subscribe==1)
      {
        cb(true);
      }else
      {
        cb(false);
      }
    }
  });
}

// window.setWXUserCloudStorage = function(data)
// {
//   // 把玩家数据发送到微信服务起托管
//   if(wx.setUserCloudStorage instanceof Function)
//   {
//       wx.setUserCloudStorage({KVDataList: [{key: "level", value: data["level"].toString()}]});
//   }
// }

window.wechatShowModel = function(msg,success,fail){
  let opt = {
    content:msg,
    success:success,
    fail:fail
  }
  wx.showModal(opt)
}

window.setWXUserCloudStorage = function (data) {
  // 把玩家数据发送到微信服务起托管
  if (wx.setUserCloudStorage instanceof Function) {

    let onSucess = function () {
      console.log("[d]  setWXUserCloudStorage sucess.");
    };
    let onFail = function () {
      console.log("[d]  setWXUserCloudStorage fail");
    }
    // wx.setUserCloudStorage({KVDataList: [{key: "level", value: data["level"].toString()}]});

    wx.setUserCloudStorage({
      KVDataList:
        [{ key: "uid", value: data["uid"].toString() },
        { key: "level", value: data["level"].toString() }],
      success: onSucess,
      fail: onFail
    });
  }
  
}

window.customAdBanner = null;
window.customGameClub = null;
window.showBanner  =function(){
	if (window.customAdBanner == null) {
		let height;
		let width;
		let bannerHight;
		wx.getSystemInfo({
			success:function(res){
			height=res.windowHeight
			width=res.windowWidth
			}
			});
		let bannerAd = wx.createBannerAd({
			adUnitId: 'adunit-9b7d07b1157d79ee',
			style:{
				left: 0,
				top: height-120,
				width: 320
			}
		});
		bannerAd.style.width = width
		bannerAd.onResize(res => {
			console.log("2",res.width, res.height)
			console.log("1",bannerAd.style.realWidth, bannerAd.style.realHeight)
			bannerAd.style.top = height - bannerAd.style.realHeight;
		})
		window.customAdBanner = bannerAd;
	}
	
	window.customAdBanner.show();
}

window.dissmisBanner = function(){
  	if (window.customAdBanner == null) {
		return;
	}

	window.customAdBanner.hide();
}

window.gameClub = function(){
  	if (window.customGameClub == null) {
		let button = wx.createGameClubButton({
			icon: 'green',
			style: {
				left: 10,
				top: 110,
				width: 30,
				height: 30
			}
		});
		window.customGameClub = button;
	}
	window.customGameClub.show();
}

window.dissmisGameClub = function(){
  	if (window.customGameClub == null) {
		  return;
	  }
    window.customGameClub.hide();
}


