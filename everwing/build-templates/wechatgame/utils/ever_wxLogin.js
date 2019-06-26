var utils = require('./ever_utils')
var game = require('./ever_game.js');
window.wxlogin = function(cb, loginProgress) {
  console.log('微信登录开始')
  window.toBI("LoginStart", null, false);

  let loginInfo = game.getLoginInfo();
  if (loginInfo != null) {
    loginInfo.ret = 0;
    window.toBI("GetCacheRet", loginInfo, false);
    let rst = {
      checkSession: 0,  // 0表示还没有结果，1表示成功，10表示失败
      checkToken: 0,
    }

    let haveFail = false;
    let checkAndDoNext = function () {
      let rstCode = rst.checkSession + rst.checkToken;
      if (rstCode == 2) { // 表示两个都成功
        //game.loginGame(cb, loginProgress, "cache exist");
        login(cb, loginProgress, "CacheCheckFail" + rstCode);
      }
      else if ((rstCode == 10 || rstCode == 11) && (haveFail === false))  // 表示有且只有一个失败
      {
        haveFail = true;
        login(cb, loginProgress, "CacheCheckFail" + rstCode);
      }
    }

    wx.checkSession({
      success: function () {
        window.toBI("CheckSessionRet", { ret: 0 });
        rst.checkSession = 1;
        checkAndDoNext();
      },
      fail: function () {
        window.toBI("CheckSessionRet", { ret: 1 });
        rst.checkSession = 10;
        checkAndDoNext();
      }
    });

    game.checkToken(loginInfo, (err) => {
      if (err === null) // 成功
      {
        rst.checkToken = 1;
        window.toBI("CheckTokenRet", { ret: 0 });
      }
      else {
        rst.checkToken = 10;
        window.toBI("CheckTokenRet", { ret: 1 });
      }
      checkAndDoNext();
    });
  } else {  // when loginInfo == null
    window.toBI("GetCacheRet", { ret: 1 }, false);
    login(cb, loginProgress, "CacheEmpty");
  }
}


  var login = function(gameCallback, loginProgress) {
    console.log('wx.login start')
    loginProgress(5);
    game.clearLoginInfo();
    window.toBI("WXLogin", { ret: 0 });
    wx.login({
      success: function (res) {
        if (res.code) {
          window.toBI("WXLoginRet", { ret: 0 });
          console.log('wx.login getCode success')
          console.log(res)
          window.WX_Token = res.code;
          let reqData = {
            code: res.code,
            platform: window.client_login_platform,
            deviceid: window.client_deviceid,
            version: window["wxGetGameVersion"](),
          };
          loginProgress(10);
          //game.saveLoginInfo(resData);
          gameCallback(reqData, window["farmSocketUrl"]);
          
          //game.loginGame(gameCallback, resData, loginProgress);
          // utils.request1(
          //   'wxgamelogin',
          //   reqData,
          //   (resData,error)=>{
          //     if (!error){
          //       console.log('wxgamelogin success')
          //       game.saveLoginInfo(resData);
          //       game.loginGame(gameCallback, resData, loginProgress);
          //       window.toBI("AccountServerRet", { ret: 0 });
          //     }else{
          //       window.toBI("AccountServerRet", { ret: 1 });
          //       game.loginFail('登录服务器出错，请稍后再试！', () => {
          //         login(gameCallback, loginProgress);
          //       });
          //       console.log("'登录失败:", res);
          //     }
          //   }
          // )
        } else {
          window.toBI("WXLoginRet",{ret:1});
          game.loginFail('登录失败，请稍后再试！', () => {
            login(gameCallback, loginProgress);
          });
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function(err) {
        window.toBI("WXLoginRet",{ret:2});
        game.loginFail(err.errMsg, () => {
          login(gameCallback, loginProgress);
        });
      }
    });
  }


  window.wxCheckSession = function (success, fail) {
    wx.checkSession({
      success: success,
      fail: fail
    })
  }

