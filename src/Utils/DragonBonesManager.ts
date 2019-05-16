class DragonBonesManager extends egret.DisplayObjectContainer {

    private static Instance: DragonBonesManager;
    private dragonBonesArr = new Array;
    private egretFactory = dragonBones.EgretFactory.factory;

    public static getInstance(): any {
        if (!DragonBonesManager.Instance) {
            DragonBonesManager.Instance = new DragonBonesManager();
        }
        return DragonBonesManager.Instance;
    }

    constructor() {
        super();
    }

    //多纹理集添加纹理
    public addToFactoryAtlas(textureData, texture) {
        this.egretFactory.parseTextureAtlasData(RES.getRes(textureData), RES.getRes(texture));
    }

    //添加龙骨到工厂
    public addToFactory(skeletonData, textureData, texture) {
        this.egretFactory.parseDragonBonesData(RES.getRes(skeletonData));
        this.egretFactory.parseTextureAtlasData(RES.getRes(textureData), RES.getRes(texture));
    }

    //初始化龙骨
    public initArmatureDisplay(name, armaturename) {
        this.dragonBonesArr.forEach((v, i) => {
            if (name == v.name) {
                return v.gujia;
            }
        });
        var armature: dragonBones.EgretArmatureDisplay = this.egretFactory.buildArmatureDisplay(armaturename);
        this.dragonBonesArr.push({ name: name, gujia: armature });
        return armature;
    }

    public playAnimation(name, ainName, parent, loop: number = 0, posX?: number, posY?: number) {
        this.dragonBonesArr.forEach((v, i) => {
            if (name == v.name) {
                let armature: dragonBones.EgretArmatureDisplay = v.gujia;
                armature.anchorOffsetX = 0;
                armature.anchorOffsetY = 0;
                let sb: dragonBones.AnimationState = armature.animation.fadeIn(ainName, 0, loop);
                parent.addChild(armature);
                if (posY) {
                    armature.y = posY;
                }
                if (posX) {
                    armature.x = posX;
                }
            }
        });
    }
}