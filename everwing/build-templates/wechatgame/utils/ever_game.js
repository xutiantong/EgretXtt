let  utils =  require('./ever_utils.js')
function getLoginInfo(){
    let data = localStorage.getItem('login_info');
    if (data == null) {
      return null;
    }
    if (!data.length) {
      return null;
    }
    try {
      data = JSON.parse(data);
    } catch (e) {
    }
    if(data && data.openid   ){
      return data;
    }

    return null;
}
 
    function clearLoginInfo() {
      localStorage.setItem('login_info', '');
    }
  
    function saveLoginInfo (data) {
      let s = JSON.stringify(data);
      localStorage.setItem('login_info', s);
    }
  
    function checkToken  (loginInfo, callback) {
      //服务器需要同步这个接口
      if (callback){
        var err = new Error('接口服务器没有实现')
        callback(err)
      }
      return ;
      let reqData = {
        serverid: loginInfo.serverid,
        platform: window.client_login_platform,
        version: window["wxGetGameVersion"](),
        token: loginInfo.token,
        uid: loginInfo.uid,
      };
      utils.request('isexptoken', reqData, (res) => {
        if (res.data && res.data.code == 0) {
            callback(null);
          } else {
            callback(res.data);
          }
        }, (err) => {
          if (callback != null) {
            callback(err);
          }
        }
      )
    }
  
    function checkUnionId  (userInfo) {
  
      return
      /**重构迁移暂时注释 */
  
      let data = localStorage.getItem('UnionIdGetted');
      console.log("UnionIdGetted:", data);
      if (data == null || !data.length) {
        let reqData = {
          platform: "weixin",
          uid: window.WX_MyOpenid,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv,
          deviceid: "111111",
        };
        utils.request('savedecodeunionid', reqData, (res) => {
          if (res.data)
          {
            console.log('savedecodeunionid success:', JSON.stringify(res.data));
            if (res.data.code == 0) {
              localStorage.setItem('UnionIdGetted', "1");
            }
          }
          }, (err) => {
            console.log("savedecodeunionid error", res);
          }
        )
      }
      
    }
  
    function loginFail  (msg, success) {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
        success: success
      })
    }
    //新版本这里不调用 链接socket后才能获取到openId
    function loginGame  (gameCallback, data, loginProgress) {
      window.toBI("CacheReady",{ret:0});
      console.log('logingame openId')
      console.log(data)
      loginProgress(15);
      window.isnew = data.newUser == true ? 0 : 1;
      window.checkIsNew = data.newUser==true?0:1;
      console.log("window.checkIsNew "+window.checkIsNew);
      window.login_body = data;
      window.WX_MyOpenid = window.login_body.openid;
      gameCallback(window.WX_MyOpenid, "wss://" + window.login_body.publicip + ":" + window.login_body.port + '/websocket');
    }
    function checkUpdate  () {
      console.log("[log] will check udpate ")
      if (typeof wx.getUpdateManager === 'function') {
        window.toBI("WXCheckUpdate");
        const updateManager = wx.getUpdateManager()
      
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log("[log] is udpate : " + res.hasUpdate)
          window.toBI("WXCheckUpdateRet", res);
        })
      
        updateManager.onUpdateReady(function () {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          window.toBI("WXVersionUpdateRet", { ret: 0 });
          wx.showModal({
            title: '更新提示',
            content: '又一个棒棒哒新版本，去瞅瞅~',
            success: function (res) {
              if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
              }
            }
          })        
        })
      
        updateManager.onUpdateFailed(function () {
          window.toBI("WXVersionUpdateRet", { ret: 1 });
          // 新的版本下载失败
        })
      }
      
    }

    module.exports = {
        getLoginInfo: getLoginInfo,
        clearLoginInfo:clearLoginInfo,
        saveLoginInfo:saveLoginInfo,
        checkToken:checkToken,
        checkUnionId:checkUnionId,
        loginFail:loginFail,
        loginGame:loginGame,
        checkUpdate:checkUpdate,

    }