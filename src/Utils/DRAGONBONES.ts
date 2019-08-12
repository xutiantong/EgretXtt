/**
 * 龙骨类
 */
class DRAGONBONES {

    private static D: DRAGONBONES = null;
    public egretFactory: dragonBones.EgretFactory;//骨骼动画工厂类
    private armatureArr: Array<any> = new Array<any>(); //存储骨架（可重复，只要昵称不同）

    public constructor() {
        this.egretFactory = dragonBones.EgretFactory.factory;
    }

    /**
     * 通过昵称获得骨架
     * @param name 骨架昵称
     */
    public getarmature(name: string): dragonBones.EgretArmatureDisplay {
        let armature = null;
        for (let i = 0; i < this.armatureArr.length; i++) {
            let v = this.armatureArr[i];
            if (name == v.name) {
                armature = v.gujia;
                break;
            }
        }
        return armature;
    }

    /**
     * 龙骨工厂初始化
     * 将所有龙骨数据源载入工厂
     * 各个龙骨数据源所包含的骨架名称要不同
     * @param ske 龙骨数据配置
     * @param json 纹理集配置
     * @param png 纹理集
     * @param textureName 纹理集名称
     */
    public addToFactory(ske: string, json: string, png: string, textureName: string = "") {
        this.egretFactory.parseDragonBonesData(RES.getRes(ske));
        this.egretFactory.parseTextureAtlasData(RES.getRes(json), RES.getRes(png), textureName != "" ? textureName : null);
    }

    /**
     * 添加多纹理集
     * @param json 纹理集配置
     * @param png 纹理集
     * @param textureName 纹理集名称 
     */
    public addTextrueAtlas(json: string, png: string, textureName: string = "") {
        this.egretFactory.parseTextureAtlasData(RES.getRes(json), RES.getRes(png), textureName != "" ? textureName : null);
    }

    /**
     * 更换插槽
     * @param name 龙骨昵称
     * @param slotName 插槽名称
     * @param obj 显示对象
     */
    public changeSlotDisplay(name: string, slotName: string, obj: egret.DisplayObject) {
        obj.anchorOffsetX = obj.width / 2
        obj.anchorOffsetY = obj.height / 2
        DRAGONBONES.getInstance().getarmature(name).armature.getSlot(slotName).displayList = [obj]
        DRAGONBONES.getInstance().getarmature(name).armature.invalidUpdate("root", true);
    }

    /**
     * 初始化骨架
     * @param name 骨架昵称
     * @param armaturename 骨架名称
     * @param fadeInCall fadeIn事件监听
     * @param completeCall complete事件监听
     * @param loopCompleteCall loopComplete事件监听
     * @param framecall frame事件监听
     */
    public initArmature(name: string, armaturename: string, fadeInCall?: any, completeCall?: any, loopCompleteCall?: any, framecall?: any): dragonBones.EgretArmatureDisplay {
        var armature: dragonBones.EgretArmatureDisplay = this.egretFactory.buildArmatureDisplay(armaturename);
        let fadeIn = null;
        let complete = null;
        let frame = null;
        let loop = null;
        armature.anchorOffsetX = 0
        armature.anchorOffsetY = 0
        if (fadeInCall != null) {
            armature.addEventListener(dragonBones.EventObject.FADE_IN, fadeInCall, this);
            fadeIn = fadeInCall;
        }
        if (completeCall != null) {
            armature.addEventListener(dragonBones.EventObject.COMPLETE, completeCall, this);
            complete = completeCall;
        }
        if (loopCompleteCall != null) {
            armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, loopCompleteCall, this);
            loop = loopCompleteCall;
        }
        if (framecall != null) {
            armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, framecall, this);
            frame = framecall;
        }
        this.armatureArr.push({ name: name, gujia: armature, startlisten: fadeIn, endlisten: complete, framelisten: frame, loopendlisten: loop, xianyin: false });
        return armature;
    }

    /**
     * 更新骨架事件监听
     * @param name 骨架昵称
     * @param start fadeIn事件监听
     * @param end complete事件监听
     * @param loopend loopComplete事件监听
     * @param frame frame事件监听
     */
    public updateListener(name: string, start?: any, end?: any, loopend?: any, frame?: any) {
        for (let i = 0; i < this.armatureArr.length; i++) {
            let v = this.armatureArr[i];
            if (name == v.name) {
                let armature: dragonBones.EgretArmatureDisplay = v.gujia;
                if (start != null) {
                    if (v.startlisten != null)
                        armature.removeEventListener(dragonBones.EventObject.COMPLETE, v.startlisten, this);
                    armature.addEventListener(dragonBones.EventObject.COMPLETE, start, this);
                    v.startlisten = start;
                }
                if (end != null) {
                    if (v.endlisten != null)
                        armature.removeEventListener(dragonBones.EventObject.COMPLETE, v.endlisten, this);
                    armature.addEventListener(dragonBones.EventObject.COMPLETE, end, this);
                    v.endlisten = end;
                }
                if (frame != null) {
                    if (v.framelisten != null)
                        armature.removeEventListener(dragonBones.EventObject.COMPLETE, v.framelisten, this);
                    armature.addEventListener(dragonBones.EventObject.COMPLETE, frame, this);
                    v.framelisten = frame;
                }
                if (loopend != null) {
                    if (v.loopendlisten != null)
                        armature.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, v.loopendlisten, this);
                    armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, loopend, this);
                    v.loopendlisten = loopend;
                }
            }
        }
    }

    /**
     * 特定骨架的开始显示，结束隐藏
     * @param name 骨架昵称
     * @param vis 添加删除
     */
    public changeVisible(name: string, vis: boolean) {
        for (let i = 0; i < this.armatureArr.length; i++) {
            let v = this.armatureArr[i];
            if (name == v.name) {
                if (vis) {
                    v.gujia.addEventListener(dragonBones.EventObject.START, this.tru, this);
                    v.gujia.addEventListener(dragonBones.EventObject.COMPLETE, this.fal, this);
                } else {
                    v.gujia.removeEventListener(dragonBones.EventObject.START, this.tru, this);
                    v.gujia.removeEventListener(dragonBones.EventObject.COMPLETE, this.fal, this);
                }
            }
        }
    }

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
    public playAnimation(name: string, animationname: string, parent: any, playtime: number, scaleX?: number, scaleY?: number, speed?: number, x?: number, y?: number, maskBoneName?: string): dragonBones.AnimationState {
        for (let i = 0; i < this.armatureArr.length; i++) {
            let v = this.armatureArr[i];
            if (name == v.name) {
                let armature: dragonBones.EgretArmatureDisplay = v.gujia;
                armature.anchorOffsetX = 0
                armature.anchorOffsetY = 0
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
                } else {
                    parent.addChild(armature);
                }

                if (playtime != -2) {
                    let db: dragonBones.AnimationState = armature.animation.gotoAndPlayByFrame(animationname, 0, playtime);
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
    }

    /**
     * 用其他骨架插槽替换当前插槽
     * @param bei_armaturename 被提取的骨架原生名称
     * @param bei_slotname 被提取的骨架插槽原生名称
     * @param bei_slotdisplayname 被提取的骨架插槽图片原生名称
     * @param forarmaturename_nicheng 将接受皮肤的骨架昵称
     * @param forslotname 将接受皮肤的骨架插槽原生名称
     */
    public changeSlotWithAnotherSlot(bei_armaturename: string, bei_slotname: string, bei_slotdisplayname: string, forarmaturename_nicheng: string, forslotname: string) {
        let bone: dragonBones.EgretArmatureDisplay;
        for (let i = 0; i < this.armatureArr.length; i++) {
            let v = this.armatureArr[i];
            if (forarmaturename_nicheng == v.name) {
                bone = v.gujia;
            }
        }
        this.egretFactory.replaceSlotDisplay(null, bei_armaturename, bei_slotname, bei_slotdisplayname, bone.armature.getSlot(forslotname));
    }

    /**
     * 隐藏
     * @param event 
     */
    private fal(event: dragonBones.EgretEvent) {
        event.target.visible = false;
    }

    /**
     * 显示
     * @param event 
     */
    private tru(event: dragonBones.EgretEvent) {
        event.target.visible = true;
    }

    /**
     * 移除DragonBonesData及TextureAtlasData实例
     * @param name 骨架名称
     * @param textureName 图集名称
     */
    public removeArmatureAndTexture(name: string, textureName: string = "") {
        for (let i = 0; i < this.armatureArr.length; i++) {
            let v = this.armatureArr[i];
            if (name == v.name) {
                this.egretFactory.removeDragonBonesData(v.gujia);
                if (textureName != "") {
                    this.egretFactory.removeTextureAtlasData(textureName);
                }
                this.armatureArr.splice(i, 1);
            }
        }
    }

    public static getInstance(): DRAGONBONES {
        if (this.D == null) {
            this.D = new DRAGONBONES();
        }
        return this.D;
    }

}