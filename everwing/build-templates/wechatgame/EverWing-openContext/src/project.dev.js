__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  WxOpenFrame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4c85af6sIVL3ruWiLiPZGnK", "WxOpenFrame");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WxOpenRankManager_1 = require("./WxOpenRankManager");
    var WxOpenSceneBase_1 = require("./WxOpenSceneBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WxOpenRankScene = function(_super) {
      __extends(WxOpenRankScene, _super);
      function WxOpenRankScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._currScene = null;
        _this._sceneLoaded = "";
        _this._sceneLoading = false;
        return _this;
      }
      WxOpenRankScene.prototype.start = function() {
        var _this = this;
        WxOpenRankManager_1.RM.onMessage(function(res) {
          var sceneName = "";
          switch (res.action) {
           case WxOpenRankManager_1.ActionType_WxOpen.FriendRank:
           case WxOpenRankManager_1.ActionType_WxOpen.GroupRank:
            sceneName = "RankScene";
            break;

           case WxOpenRankManager_1.ActionType_WxOpen.Surpass:
            sceneName = "SurpassScene";
            break;

           case WxOpenRankManager_1.ActionType_WxOpen.RestartRank:
            sceneName = "restartRankScene";
          }
          _this.switchWxOpenScene(sceneName, res);
        });
      };
      WxOpenRankScene.prototype.switchWxOpenScene = function(sceneName, res) {
        var _this = this;
        console.log("openscence");
        if (this._sceneLoaded == sceneName) {
          this._currScene.updateData(res.data);
          return;
        }
        if (this._sceneLoading) return;
        this._sceneLoading = true;
        cc.director.preloadScene(sceneName, function() {
          cc.director.loadScene(sceneName, function() {
            var node = cc.director.getScene().getChildByName("Canvas");
            var scene = node.getComponent(WxOpenSceneBase_1.default);
            _this._currScene = scene;
            _this._sceneLoading = false;
            _this._sceneLoaded = sceneName;
            _this._currScene.initData(res.action, res.data);
            _this._currScene.updateData(res.data);
          });
        });
      };
      WxOpenRankScene = __decorate([ ccclass ], WxOpenRankScene);
      return WxOpenRankScene;
    }(cc.Component);
    exports.default = WxOpenRankScene;
    cc._RF.pop();
  }, {
    "./WxOpenRankManager": "WxOpenRankManager",
    "./WxOpenSceneBase": "WxOpenSceneBase"
  } ],
  WxOpenRankItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "20d3b2TbHROBaiq0npq2IIH", "WxOpenRankItem");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WxOpenRankManager_1 = require("./WxOpenRankManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WxOpenRankItem = function(_super) {
      __extends(WxOpenRankItem, _super);
      function WxOpenRankItem() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.avatarImgSprite = null;
        _this.rankLabel = null;
        _this.nameLabel = null;
        _this.scoreLabel = null;
        _this.bgImg = null;
        _this.chartImg = null;
        return _this;
      }
      WxOpenRankItem.prototype.start = function() {};
      WxOpenRankItem.prototype.init = function(rank, data, isSelf) {
        var avatarUrl = data.avatarUrl;
        var nick = data.nickname;
        var grade = 0 != data.KVDataList.length ? data.KVDataList[0].value : 0;
        this.rankLabel.string = WxOpenRankManager_1.RM.getScore(rank + 1);
        WxOpenRankManager_1.RM.createImage(avatarUrl, this.avatarImgSprite);
        this.nameLabel.string = nick;
        this.scoreLabel.string = grade.toString();
        isSelf && WxOpenRankManager_1.RM.lodeLocalSprite("ui/charts/zikuai", this.bgImg);
        if (0 == rank) {
          this.chartImg.node.active = true;
          this.rankLabel.node.active = false;
          this.nameLabel.node.color = cc.color(255, 198, 0);
          this.scoreLabel.node.color = cc.color(255, 198, 0);
          WxOpenRankManager_1.RM.lodeLocalSprite("ui/charts/di1", this.chartImg);
        } else if (1 == rank) {
          this.chartImg.node.active = true;
          this.rankLabel.node.active = false;
          this.nameLabel.node.color = cc.color(255, 198, 0);
          this.scoreLabel.node.color = cc.color(255, 198, 0);
          WxOpenRankManager_1.RM.lodeLocalSprite("ui/charts/di2", this.chartImg);
        } else if (2 == rank) {
          this.chartImg.node.active = true;
          this.rankLabel.node.active = false;
          this.nameLabel.node.color = cc.color(255, 198, 0);
          this.scoreLabel.node.color = cc.color(255, 198, 0);
          WxOpenRankManager_1.RM.lodeLocalSprite("ui/charts/di3", this.chartImg);
        }
      };
      __decorate([ property(cc.Sprite) ], WxOpenRankItem.prototype, "avatarImgSprite", void 0);
      __decorate([ property(cc.Label) ], WxOpenRankItem.prototype, "rankLabel", void 0);
      __decorate([ property(cc.Label) ], WxOpenRankItem.prototype, "nameLabel", void 0);
      __decorate([ property(cc.Label) ], WxOpenRankItem.prototype, "scoreLabel", void 0);
      __decorate([ property(cc.Sprite) ], WxOpenRankItem.prototype, "bgImg", void 0);
      __decorate([ property(cc.Sprite) ], WxOpenRankItem.prototype, "chartImg", void 0);
      WxOpenRankItem = __decorate([ ccclass ], WxOpenRankItem);
      return WxOpenRankItem;
    }(cc.Component);
    exports.default = WxOpenRankItem;
    cc._RF.pop();
  }, {
    "./WxOpenRankManager": "WxOpenRankManager"
  } ],
  WxOpenRankManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d7444iKuT9MYIX8sv3mn/X4", "WxOpenRankManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DataKeys_WxOpen;
    (function(DataKeys_WxOpen) {
      DataKeys_WxOpen["Score"] = "score";
    })(DataKeys_WxOpen = exports.DataKeys_WxOpen || (exports.DataKeys_WxOpen = {}));
    var ActionType_WxOpen;
    (function(ActionType_WxOpen) {
      ActionType_WxOpen[ActionType_WxOpen["FriendRank"] = 1] = "FriendRank";
      ActionType_WxOpen[ActionType_WxOpen["GroupRank"] = 2] = "GroupRank";
      ActionType_WxOpen[ActionType_WxOpen["Surpass"] = 3] = "Surpass";
      ActionType_WxOpen[ActionType_WxOpen["RestartRank"] = 4] = "RestartRank";
    })(ActionType_WxOpen = exports.ActionType_WxOpen || (exports.ActionType_WxOpen = {}));
    var RankManager = function() {
      function RankManager() {}
      RankManager.prototype.onMessage = function(callback) {
        wx.onMessage(function(data) {
          callback(data);
        });
      };
      RankManager.prototype.getFriendData = function(keyList, success, fail) {
        wx.getFriendCloudStorage({
          keyList: keyList,
          success: function(res) {
            console.log("%cget friend cloud storage success", "color:green");
            success(res);
          },
          fail: function(res) {
            console.error("get friend cloud storage fail");
            fail(res);
          }
        });
      };
      RankManager.prototype.getGroupCloudStorage = function(shareTicket, keyList, success, fail) {
        wx.getGroupCloudStorage({
          shareTicket: shareTicket,
          keyList: keyList,
          success: function(res) {
            console.log("%cget group cloud storage success", "color:green");
            success(res);
          },
          fail: function(res) {
            console.error("get group cloud storage fail");
            fail(res);
          }
        });
      };
      RankManager.prototype.getUserCloudStorage = function(keyList, success, fail) {
        wx.getUserCloudStorage({
          keyList: keyList,
          success: function(res) {
            console.log("%cget user cloud storage success", "color:green");
            success(res);
          },
          fail: function(res) {
            console.error("get user cloud storage fail");
            fail(res);
          }
        });
      };
      RankManager.prototype.getUserInfo = function(openIdList, success) {
        wx.getUserInfo({
          openIdList: openIdList,
          success: function(res) {
            console.log("%cget friend cloud storage success", "color:green");
            success(res);
          }
        });
      };
      RankManager.prototype.createImage = function(avatarUrl, content) {
        try {
          var image_1 = wx.createImage();
          image_1.onload = function() {
            try {
              var texture = new cc.Texture2D();
              texture.initWithElement(image_1);
              texture.handleLoadedTexture();
              content.spriteFrame = new cc.SpriteFrame(texture);
            } catch (e) {
              cc.log(e);
              content.node.active = false;
            }
          };
          image_1.src = avatarUrl;
        } catch (e) {
          cc.log(e);
          content.node.active = false;
        }
      };
      RankManager.prototype.getScore = function(num) {
        if (num >= 1e6) {
          var num1 = Math.floor(num / 1e6);
          var num2 = Math.floor(num % 1e6 / 1e3);
          var num3 = num % 1e3;
          var str2 = num2.toString();
          var str3 = num3.toString();
          num2 < 10 ? str2 = "00" + num2 : num2 < 100 && (str2 = "0" + num2);
          num3 < 10 ? str3 = "00" + num3 : num3 < 100 && (str3 = "0" + num3);
          return num1 + "," + str2 + "," + str3;
        }
        if (num >= 1e3) {
          var num1 = Math.floor(num / 1e3);
          var num2 = num % 1e3;
          var str2 = num2.toString();
          num2 < 10 ? str2 = "00" + num2 : num2 < 100 && (str2 = "0" + num2);
          return num1 + "," + str2;
        }
        return num.toString();
      };
      RankManager.prototype.lodeLocalSprite = function(localurl, container) {
        cc.loader.loadRes(localurl, cc.SpriteFrame, function(err, spriteFrame) {
          err ? console.log("loadLocalSprite failed: ", "[" + localurl + "]") : container.spriteFrame = spriteFrame;
        });
      };
      return RankManager;
    }();
    exports.RM = new RankManager();
    cc._RF.pop();
  }, {} ],
  WxOpenRankScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68e57GJZDtPubcF4yaNwbCc", "WxOpenRankScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WxOpenRankManager_1 = require("./WxOpenRankManager");
    var WxOpenSceneBase_1 = require("./WxOpenSceneBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WxOpenRankScene = function(_super) {
      __extends(WxOpenRankScene, _super);
      function WxOpenRankScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scrollView = null;
        _this.contentNode = null;
        _this.itemPrefab = null;
        _this.avatarImgSprite = null;
        _this.rankLabel = null;
        _this.nameLabel = null;
        _this.scoreLabel = null;
        _this.rankNode = null;
        _this._rankData = null;
        _this._selfInfo = null;
        return _this;
      }
      WxOpenRankScene.prototype.start = function() {};
      WxOpenRankScene.prototype.initData = function(actionType, data) {
        switch (actionType) {
         case WxOpenRankManager_1.ActionType_WxOpen.FriendRank:
          WxOpenRankManager_1.RM.getFriendData([ data.key ], this.onGetFriendDataSuccess.bind(this), this.onFail.bind(this));
          break;

         case WxOpenRankManager_1.ActionType_WxOpen.GroupRank:
          WxOpenRankManager_1.RM.getGroupCloudStorage(data.shareTicket, [ data.key ], this.onGetGroupDataSuccess.bind(this), this.onFail.bind(this));
        }
      };
      WxOpenRankScene.prototype.onEnable = function() {
        this.node.on("initSelfData", this.initself, this);
      };
      WxOpenRankScene.prototype.onDisable = function() {
        this.node.off("initSelfData", this.initself, this);
      };
      WxOpenRankScene.prototype.draw = function() {
        this.contentNode.removeAllChildren();
        this._rankData.sort(function(a, b) {
          if (0 == a.KVDataList.length && 0 == b.KVDataList.length) return 0;
          if (0 == a.KVDataList.length) return 1;
          if (0 == b.KVDataList.length) return -1;
          return Number(b.KVDataList[0].value) - Number(a.KVDataList[0].value);
        });
        var size = this._rankData.length;
        var haveself = false;
        for (var i = 0; i < size; i++) {
          var isSelf = false;
          var element = this._rankData[i];
          if (this._selfInfo.avatarUrl == element.avatarUrl) {
            isSelf = true;
            haveself = true;
            this.initself({
              rank: i,
              data: element
            });
          }
          if (i >= 10) {
            if (haveself) break;
            continue;
          }
          var item = cc.instantiate(this.itemPrefab);
          item.getComponent("WxOpenRankItem").init(i, element, isSelf);
          this.contentNode.addChild(item);
        }
      };
      WxOpenRankScene.prototype.initself = function(mydata) {
        false == this.rankNode.active && (this.rankNode.active = true);
        this.rankLabel.string = mydata.rank + 1;
        this.nameLabel.string = mydata.data.nickname;
        var score = 0 != mydata.data.KVDataList.length ? mydata.data.KVDataList[0].value : 0;
        this.scoreLabel.string = WxOpenRankManager_1.RM.getScore(score);
        WxOpenRankManager_1.RM.createImage(mydata.data.avatarUrl, this.avatarImgSprite);
      };
      WxOpenRankScene.prototype.onFail = function(res) {
        console.error(res);
      };
      WxOpenRankScene.prototype.onGetGroupDataSuccess = function(res) {
        this._rankData = res.data;
        this.draw();
      };
      WxOpenRankScene.prototype.onGetFriendDataSuccess = function(res) {
        this._rankData = res.data;
        WxOpenRankManager_1.RM.getUserInfo([ "selfOpenId" ], this.onGetUserInfoSuccess.bind(this));
      };
      WxOpenRankScene.prototype.onGetUserInfoSuccess = function(res) {
        this._selfInfo = res.data[0];
        this.draw();
      };
      __decorate([ property(cc.ScrollView) ], WxOpenRankScene.prototype, "scrollView", void 0);
      __decorate([ property(cc.Node) ], WxOpenRankScene.prototype, "contentNode", void 0);
      __decorate([ property(cc.Prefab) ], WxOpenRankScene.prototype, "itemPrefab", void 0);
      __decorate([ property(cc.Sprite) ], WxOpenRankScene.prototype, "avatarImgSprite", void 0);
      __decorate([ property(cc.Label) ], WxOpenRankScene.prototype, "rankLabel", void 0);
      __decorate([ property(cc.Label) ], WxOpenRankScene.prototype, "nameLabel", void 0);
      __decorate([ property(cc.Label) ], WxOpenRankScene.prototype, "scoreLabel", void 0);
      __decorate([ property(cc.Node) ], WxOpenRankScene.prototype, "rankNode", void 0);
      WxOpenRankScene = __decorate([ ccclass ], WxOpenRankScene);
      return WxOpenRankScene;
    }(WxOpenSceneBase_1.default);
    exports.default = WxOpenRankScene;
    cc._RF.pop();
  }, {
    "./WxOpenRankManager": "WxOpenRankManager",
    "./WxOpenSceneBase": "WxOpenSceneBase"
  } ],
  WxOpenRestartRank: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "363a1iW6nREqq9mo6yHu94d", "WxOpenRestartRank");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WxOpenRankManager_1 = require("./WxOpenRankManager");
    var WxOpenSceneBase_1 = require("./WxOpenSceneBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WxOpenRestartRank = function(_super) {
      __extends(WxOpenRestartRank, _super);
      function WxOpenRestartRank() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scrollView = null;
        _this.contentNode = null;
        _this.itemPrefab = null;
        _this._rankData = null;
        _this._selfInfo = null;
        _this._littlenum = 1;
        return _this;
      }
      WxOpenRestartRank.prototype.start = function() {};
      WxOpenRestartRank.prototype.initData = function(actionType, data) {
        WxOpenRankManager_1.RM.getFriendData([ data.key ], this.onGetFriendDataSuccess.bind(this), this.onFail.bind(this));
      };
      WxOpenRestartRank.prototype.onGetFriendDataSuccess = function(res) {
        this._rankData = res.data;
        WxOpenRankManager_1.RM.getUserInfo([ "selfOpenId" ], this.onGetUserInfoSuccess.bind(this));
      };
      WxOpenRestartRank.prototype.onGetUserInfoSuccess = function(res) {
        this._selfInfo = res.data[0];
        var rankdatas = this.getDatas();
        this.draw(rankdatas);
      };
      WxOpenRestartRank.prototype.getDatas = function() {
        var rankdatas = [];
        this._rankData.sort(function(a, b) {
          if (0 == a.KVDataList.length && 0 == b.KVDataList.length) return 0;
          if (0 == a.KVDataList.length) return 1;
          if (0 == b.KVDataList.length) return -1;
          return Number(b.KVDataList[0].value) - Number(a.KVDataList[0].value);
        });
        var size = this._rankData.length;
        var isSelf = false;
        for (var i = 0; i < size; i++) {
          var element = this._rankData[i];
          if (this._selfInfo.avatarUrl == element.avatarUrl) {
            isSelf = true;
            if (0 == i) {
              this._littlenum = i;
              rankdatas.push(this._rankData[i]);
              this._rankData[i + 1] && rankdatas.push(this._rankData[i + 1]);
              this._rankData[i + 2] && rankdatas.push(this._rankData[i + 2]);
              return rankdatas;
            }
            if (i == size - 1) {
              this._littlenum = i - 2;
              this._rankData[i - 2] && rankdatas.push(this._rankData[i - 2]);
              this._rankData[i - 1] && rankdatas.push(this._rankData[i - 1]);
              rankdatas.push(this._rankData[i]);
              return rankdatas;
            }
            this._littlenum = i - 1;
            this._rankData[i - 1] && rankdatas.push(this._rankData[i - 1]);
            rankdatas.push(this._rankData[i]);
            this._rankData[i + 1] && rankdatas.push(this._rankData[i + 1]);
            return rankdatas;
          }
        }
      };
      WxOpenRestartRank.prototype.draw = function(rankdatas) {
        this.contentNode.removeAllChildren();
        var size = rankdatas.length;
        for (var i = 0; i < size; i++) {
          var isSelf = false;
          var element = rankdatas[i];
          this._selfInfo.avatarUrl == element.avatarUrl && (isSelf = true);
          var item = cc.instantiate(this.itemPrefab);
          item.getComponent("WxOpenRankItem").init(this._littlenum, element, isSelf);
          this.contentNode.addChild(item);
          this._littlenum++;
        }
      };
      WxOpenRestartRank.prototype.onFail = function(res) {
        console.error(res);
      };
      __decorate([ property(cc.ScrollView) ], WxOpenRestartRank.prototype, "scrollView", void 0);
      __decorate([ property(cc.Node) ], WxOpenRestartRank.prototype, "contentNode", void 0);
      __decorate([ property(cc.Prefab) ], WxOpenRestartRank.prototype, "itemPrefab", void 0);
      WxOpenRestartRank = __decorate([ ccclass ], WxOpenRestartRank);
      return WxOpenRestartRank;
    }(WxOpenSceneBase_1.default);
    exports.default = WxOpenRestartRank;
    cc._RF.pop();
  }, {
    "./WxOpenRankManager": "WxOpenRankManager",
    "./WxOpenSceneBase": "WxOpenSceneBase"
  } ],
  WxOpenSceneBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9e8bamxY+9N5YQPq6cmuz/B", "WxOpenSceneBase");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WxOpenSceneBase = function(_super) {
      __extends(WxOpenSceneBase, _super);
      function WxOpenSceneBase() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      WxOpenSceneBase.prototype.initData = function(actionType, data) {};
      WxOpenSceneBase.prototype.updateData = function(data) {};
      WxOpenSceneBase = __decorate([ ccclass ], WxOpenSceneBase);
      return WxOpenSceneBase;
    }(cc.Component);
    exports.default = WxOpenSceneBase;
    cc._RF.pop();
  }, {} ],
  WxOpenSurpassScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e16d9PWJ75PrpCTmt9hjNHz", "WxOpenSurpassScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WxOpenRankManager_1 = require("./WxOpenRankManager");
    var WxOpenSceneBase_1 = require("./WxOpenSceneBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WxOpenSurpassScene = function(_super) {
      __extends(WxOpenSurpassScene, _super);
      function WxOpenSurpassScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.avatarImgSprite = null;
        _this._rankData = null;
        _this._selfTop = false;
        return _this;
      }
      WxOpenSurpassScene.prototype.start = function() {};
      WxOpenSurpassScene.prototype.refresh = function(currScore) {
        if (this._selfTop) return;
        for (var i = this._rankData.length - 1; i >= 0; i--) {
          var element = this._rankData[i];
          var score = 0 != element.KVDataList.length ? element.KVDataList[0].value : 0;
          if (currScore < score && i == this._rankData.length - 1) {
            var avatarUrl = element.avatarUrl;
            this.node.active = true;
            WxOpenRankManager_1.RM.createImage(avatarUrl, this.avatarImgSprite);
            break;
          }
          if (currScore > score && 0 == i) {
            this._selfTop = true;
            this.node.active = false;
            break;
          }
          if (currScore > score) continue;
          var avatarUrl = element.avatarUrl;
          this.node.active = true;
          WxOpenRankManager_1.RM.createImage(avatarUrl, this.avatarImgSprite);
          break;
        }
      };
      WxOpenSurpassScene.prototype.initData = function(actionType, data) {
        this.node.active = false;
        if (null == this._rankData) {
          WxOpenRankManager_1.RM.getFriendData([ data.key ], this.onGetFriendDataSuccess.bind(this), this.onFail.bind(this));
          return;
        }
      };
      WxOpenSurpassScene.prototype.updateData = function(data) {
        if (null == this._rankData) return;
        this.refresh(data.currScore);
      };
      WxOpenSurpassScene.prototype.onFail = function(res) {
        console.error(res);
      };
      WxOpenSurpassScene.prototype.onGetFriendDataSuccess = function(res) {
        this._rankData = res.data;
        this._rankData.sort(function(a, b) {
          if (0 == a.KVDataList.length && 0 == b.KVDataList.length) return 0;
          if (0 == a.KVDataList.length) return 1;
          if (0 == b.KVDataList.length) return -1;
          return Number(b.KVDataList[0].value) - Number(a.KVDataList[0].value);
        });
        this.refresh(0);
      };
      __decorate([ property(cc.Sprite) ], WxOpenSurpassScene.prototype, "avatarImgSprite", void 0);
      WxOpenSurpassScene = __decorate([ ccclass ], WxOpenSurpassScene);
      return WxOpenSurpassScene;
    }(WxOpenSceneBase_1.default);
    exports.default = WxOpenSurpassScene;
    cc._RF.pop();
  }, {
    "./WxOpenRankManager": "WxOpenRankManager",
    "./WxOpenSceneBase": "WxOpenSceneBase"
  } ]
}, {}, [ "WxOpenFrame", "WxOpenRankItem", "WxOpenRankManager", "WxOpenRankScene", "WxOpenRestartRank", "WxOpenSceneBase", "WxOpenSurpassScene" ]);