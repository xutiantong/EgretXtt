var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 龙骨类
 */
var DRAGONBONES = (function () {
    function DRAGONBONES() {
        this.armatureArr = new Array(); //存储骨架（可重复，只要昵称不同）
        this.egretFactory = dragonBones.EgretFactory.factory;
    }
    /**
     * 通过昵称获得骨架
     * @param name 骨架昵称
     */
    DRAGONBONES.prototype.getarmature = function (name) {
        var armature = null;
        for (var i = 0; i < this.armatureArr.length; i++) {
            var v = this.armatureArr[i];
            if (name == v.name) {
                armature = v.gujia;
                break;
            }
        }
        return armature;
    };
    /**
     * 龙骨工厂初始化
     * 将所有龙骨数据源载入工厂
     * 各个龙骨数据源所包含的骨架名称要不同
     * @param ske 龙骨数据配置
     * @param json 纹理集配置
     * @param png 纹理集
     * @param textureName 纹理集名称
     */
    DRAGONBONES.prototype.addToFactory = function (ske, json, png, textureName) {
        if (textureName === void 0) { textureName = ""; }
        this.egretFactory.parseDragonBonesData(RES.getRes(ske));
        this.egretFactory.parseTextureAtlasData(RES.getRes(json), RES.getRes(png), textureName != "" ? textureName : null);
    };
    /**
     * 添加多纹理集
     * @param json 纹理集配置
     * @param png 纹理集
     * @param textureName 纹理集名称
     */
    DRAGONBONES.prototype.addTextrueAtlas = function (json, png, textureName) {
        if (textureName === void 0) { textureName = ""; }
        this.egretFactory.parseTextureAtlasData(RES.getRes(json), RES.getRes(png), textureName != "" ? textureName : null);
    };
    /**
     * 更换插槽
     * @param name 龙骨昵称
     * @param slotName 插槽名称
     * @param obj 显示对象
     */
    DRAGONBONES.prototype.changeSlotDisplay = function (name, slotName, obj) {
        obj.anchorOffsetX = obj.width / 2;
        obj.anchorOffsetY = obj.height / 2;
        DRAGONBONES.getInstance().getarmature(name).armature.getSlot(slotName).displayList = [obj];
        DRAGONBONES.getInstance().getarmature(name).armature.invalidUpdate("root", true);
    };
    /**
     * 初始化骨架
     * @param name 骨架昵称
     * @param armaturename 骨架名称
     * @param animationName 动画名称
     * @param playTime 播放次数
     * @param parent 父节点
     * @param x x偏移
     * @param y y偏移
     * @param scaleX x缩放
     * @param scaleY y缩放
     * @param speed 播放速度
     */
    DRAGONBONES.prototype.initArmature = function (name, armaturename, animationName, playTime, parent, x, y, scaleX, scaleY, speed) {
        var armature = null;
        var isNew = false;
        for (var i = 0; i < this.armatureArr.length; i++) {
            var v = this.armatureArr[i];
            if (name == v.name) {
                armature = v.gujia;
                isNew = true;
                break;
            }
        }
        if (!isNew) {
            armature = this.egretFactory.buildArmatureDisplay(armaturename);
            this.armatureArr.push({ name: name, gujia: armature });
        }
        armature.anchorOffsetX = 0;
        armature.anchorOffsetY = 0;
        if (scaleX != null) {
            armature.scaleX = scaleX;
        }
        if (scaleY != null) {
            armature.scaleY = scaleY;
        }
        if (x != null) {
            armature.x = x;
        }
        if (y != null) {
            armature.y = y;
        }
        if (parent != null) {
            parent.addChild(armature);
        }
        if (playTime != null) {
            var db = armature.animation.play(animationName, playTime);
            if (speed != null) {
                db.timeScale = speed;
            }
        }
        return armature;
    };
    /**
    * 播放骨架动画
    * @param name 骨架昵称
    * @param animationname 动画名字
    * @param parent 父节点
    * @param playtime 播放次数
    * @param scaleX 水平缩放
    * @param scaleY 垂直缩放
    * @param speed 播放速度
    * @param x 水平偏移
    * @param y 垂直偏移
    * @param maskBoneName 骨架遮罩
    */
    DRAGONBONES.prototype.playAnimation = function (name, animationname, parent, playtime, scaleX, scaleY, speed, x, y, maskBoneName) {
        for (var i = 0; i < this.armatureArr.length; i++) {
            var v = this.armatureArr[i];
            if (name == v.name) {
                var armature = v.gujia;
                armature.anchorOffsetX = 0;
                armature.anchorOffsetY = 0;
                if (scaleX != null) {
                    armature.scaleX = scaleX;
                }
                if (scaleY != null) {
                    armature.scaleY = scaleY;
                }
                if (x != null) {
                    armature.x = x;
                }
                if (y != null) {
                    armature.y = y;
                }
                if (armature.parent) {
                }
                else {
                    parent.addChild(armature);
                }
                if (playtime != -2) {
                    var db = armature.animation.gotoAndPlayByFrame(animationname, 0, playtime);
                    if (speed != null) {
                        db.timeScale = speed;
                    }
                    if (maskBoneName != null) {
                        db.addBoneMask(maskBoneName);
                    }
                    return db;
                }
            }
        }
        return null;
    };
    /**
     * 移除DragonBonesData及TextureAtlasData实例
     * @param name 骨架名称
     * @param textureName 图集名称
     */
    DRAGONBONES.prototype.removeArmatureAndTexture = function (name, textureName) {
        if (textureName === void 0) { textureName = ""; }
        for (var i = 0; i < this.armatureArr.length; i++) {
            var v = this.armatureArr[i];
            if (name == v.name) {
                this.egretFactory.removeDragonBonesData(v.gujia);
                if (textureName != "") {
                    this.egretFactory.removeTextureAtlasData(textureName);
                }
                this.armatureArr.splice(i, 1);
            }
        }
    };
    DRAGONBONES.getInstance = function () {
        if (this.D == null) {
            this.D = new DRAGONBONES();
        }
        return this.D;
    };
    DRAGONBONES.D = null;
    return DRAGONBONES;
}());
__reflect(DRAGONBONES.prototype, "DRAGONBONES");
//# sourceMappingURL=DRAGONBONES.js.map