var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var DragonBonesManager = (function (_super) {
    __extends(DragonBonesManager, _super);
    function DragonBonesManager() {
        var _this = _super.call(this) || this;
        _this.dragonBonesArr = new Array;
        _this.egretFactory = dragonBones.EgretFactory.factory;
        return _this;
    }
    DragonBonesManager.getInstance = function () {
        if (!DragonBonesManager.Instance) {
            DragonBonesManager.Instance = new DragonBonesManager();
        }
        return DragonBonesManager.Instance;
    };
    //多纹理集添加纹理
    DragonBonesManager.prototype.addToFactoryAtlas = function (textureData, texture) {
        this.egretFactory.parseTextureAtlasData(RES.getRes(textureData), RES.getRes(texture));
    };
    //添加龙骨到工厂
    DragonBonesManager.prototype.addToFactory = function (skeletonData, textureData, texture) {
        this.egretFactory.parseDragonBonesData(RES.getRes(skeletonData));
        this.egretFactory.parseTextureAtlasData(RES.getRes(textureData), RES.getRes(texture));
    };
    //初始化龙骨
    DragonBonesManager.prototype.initArmatureDisplay = function (name, armaturename) {
        this.dragonBonesArr.forEach(function (v, i) {
            if (name == v.name) {
                return v.gujia;
            }
        });
        var armature = this.egretFactory.buildArmatureDisplay(armaturename);
        this.dragonBonesArr.push({ name: name, gujia: armature });
        return armature;
    };
    DragonBonesManager.prototype.playAnimation = function (name, ainName, parent, loop, posX, posY) {
        if (loop === void 0) { loop = 0; }
        this.dragonBonesArr.forEach(function (v, i) {
            if (name == v.name) {
                var armature = v.gujia;
                armature.anchorOffsetX = 0;
                armature.anchorOffsetY = 0;
                var sb = armature.animation.fadeIn(ainName, 0, loop);
                parent.addChild(armature);
                if (posY) {
                    armature.y = posY;
                }
                if (posX) {
                    armature.x = posX;
                }
            }
        });
    };
    return DragonBonesManager;
}(egret.DisplayObjectContainer));
__reflect(DragonBonesManager.prototype, "DragonBonesManager");
//# sourceMappingURL=DragonBonesManager.js.map