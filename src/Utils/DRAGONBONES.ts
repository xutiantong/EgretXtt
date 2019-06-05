
/**
 * 对外提供龙骨动画调用功能1.0
 * 注意手动修改成不同的骨架名和动画名还有aabb里的xy修改成00
 *****************如果动画更换属性则在每次更换后输入this.dg.getarmature("剪纸").armature.invalidUpdate("root", true)
 */
class DRAGONBONES {

    /**
     * 单例存储
     */
    private static D: DRAGONBONES = null;
    public egretFactory: dragonBones.EgretFactory;//骨骼动画工厂类
    /**
     *存储骨架（可重复，只要昵称不同）;
     *比如同一套兔子骨架数据源，我提取了三次，昵称不同便可同时显示;
     */
    private dragonBones_arr: Array<any> = new Array<any>();
    /**
     * 单例工厂
     */
    public constructor() {
        this.egretFactory = dragonBones.EgretFactory.factory;
    }

    public getarmature(name: string): dragonBones.EgretArmatureDisplay {
        let a = null;
        this.dragonBones_arr.forEach((v, i) => {
            if (name == v.name) {
                a = v.gujia;
            }
        });
        return a;
    }

    /**
     * 龙骨工厂初始化
     * 将所有龙骨数据源载入工厂
     * *********注********：各个龙骨数据源所包含的骨架名称要不同
     * ske：龙骨数据配置
     * json：纹理集配置
     * png：纹理集
     * textureName: 纹理集名称
     */
    public addToFactory(ske: string, json: string, png: string, textureName: string = "") {
        this.egretFactory.parseDragonBonesData(RES.getRes(ske));
        this.egretFactory.parseTextureAtlasData(RES.getRes(json), RES.getRes(png), textureName != "" ? textureName : null);

    }
    /**
     * 更换插槽图片
     * nicheng:龙骨昵称
     * cacao：插槽名称
     * imgTex：图片
     */
    public changeSlotImg2(nicheng, cacao, imgTex) {
        let img: egret.Bitmap = new egret.Bitmap();
        img.texture = RES.getRes(imgTex);
        img.anchorOffsetX = img.width / 2
        img.anchorOffsetY = img.height / 2
        DRAGONBONES.getinstance().getarmature(nicheng).armature.getSlot(cacao).displayList = [img]
        DRAGONBONES.getinstance().getarmature(nicheng).armature.invalidUpdate("root", true);
    }
    /**
     * 初始化骨架
     * name :骨架昵称
     * armaturename:骨架名称Armature里的name
     * *********注********：有几个骨架便可以同时播放几个骨架的动画
     * 可选填该骨架的开始，结束，每帧监听（以后可用updatelistenForAmerature方法更新覆盖）
     * event: dragonBones.EgretEvent
     * 	let eventObject = event.eventObject;
		console.log(eventObject.animationState.name, event.type, eventObject.name ? eventObject.name : "");
     */
    public initArmature(name: string, armaturename: string, startcall?: any, endcall?: any, loopendcall?: any, framecall?: any): dragonBones.EgretArmatureDisplay {
        var armature: dragonBones.EgretArmatureDisplay = this.egretFactory.buildArmatureDisplay(armaturename);
        let one = null;
        let two = null;
        let three = null;
        let four = null;
        armature.anchorOffsetX = 0
        armature.anchorOffsetY = 0
        if (startcall != null) {
            armature.addEventListener(dragonBones.EventObject.FADE_IN, startcall, this);
            one = startcall;
        }
        if (endcall != null) {
            armature.addEventListener(dragonBones.EventObject.COMPLETE, endcall, this);
            two = endcall;
        }
        if (framecall != null) {
            armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, framecall, this);
            three = framecall;
        }
        if (loopendcall != null) {
            armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, loopendcall, this);
            four = loopendcall;
        }
        this.dragonBones_arr.push({ name: name, gujia: armature, startlisten: one, endlisten: two, framelisten: three, loopendlisten: four, xianyin: false });
        return armature;
    }

    /**
     * 更新某个骨架的开始监听，结束监听，每帧监听
     * 该方法会覆盖通过initArmature和本方法添加的已有监听
     * 
     */
    public updatelistenForAmerature(armaturename: string, start?: any, end?: any, loopend?: any, frame?: any) {
        this.dragonBones_arr.forEach((v, i) => {
            if (armaturename == v.name) {
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

        });
    }

    /**
     * 特定骨架的开始显示，结束隐藏
     * vis:true表示开启 false表示关闭
     * ********注意*******自行在程序初始化中隐藏
     */
    public xianyin(name: string, vis: boolean) {
        this.dragonBones_arr.forEach((v, i) => {
            if (name == v.name) {
                if (vis == true) {
                    v.gujia.addEventListener(dragonBones.EventObject.START, this.tru, this);
                    v.gujia.addEventListener(dragonBones.EventObject.COMPLETE, this.fal, this);
                } else {
                    v.gujia.removeEventListener(dragonBones.EventObject.START, this.tru, this);
                    v.gujia.removeEventListener(dragonBones.EventObject.COMPLETE, this.fal, this);
                }

            }
        });
    }
    /**
     * 播放特定骨架的特定动画
     * groupname:同一个骨架只可以同时播放一个内置的动画，若想同一个骨架同时播放里面的不同动画，要用淡入开始模式，编入不同的组,运用场景：一个骨架中有一个小人走和跑的两个动画，需要同时呈现走的动画的头和跑的动画的腿。则运用分组加遮罩实现;
     * armaturename:骨架
     * animationname：动画
     * goupname：分组
     * com：容器
     * playtime：播放次数
     * speed：播放速度
     * maskname：骨头遮罩
     * layer:渲染权重，越大越优先，用在同一个骨架同时播放多个动画(一般以一个动画为主，其余动画加遮罩，只显示部分，并调高这部分的优先级);
     * 
     */
    public playAnimation(armaturename: string, animationname: string, groupname: string, com: any, playtime: number, scaleX?: number, scaleY?: number, speed?: number, x?: number, y?: number, maskboundname?: string, layer?: number): dragonBones.AnimationState {
        this.dragonBones_arr.forEach((v, i) => {
            if (armaturename == v.name) {
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
                let sb: dragonBones.AnimationState = armature.animation.fadeIn(animationname, 0, playtime, layer, groupname);

                com.addChild(armature);
                if (speed != null) {
                    sb.timeScale = speed;
                }
                if (maskboundname != null) {
                    sb.addBoneMask(maskboundname);
                }

                return sb;
            }

        });
        return null;

    }

    /**
     * 更换特定骨架的特定slot(换皮肤)
     * bei_armaturename被提取的骨架原生名称
     * bei_slotname被提取的骨架插槽原生名称
     * bei_slotdisplayname被提取的骨架插槽图片原生名称
     * forarmaturename_nicheng 将接受皮肤的骨架昵称
     * forslotname:将接受皮肤的骨架插槽原生名称
     */
    public changeslotimg1(bei_armaturename: string, bei_slotname: string, bei_slotdisplayname: string, forarmaturename_nicheng: string, forslotname: string) {
        let b;
        this.dragonBones_arr.forEach((v, i) => {
            if (forarmaturename_nicheng == v.name) {
                b = v.gujia;
            }
        });
        this.egretFactory.replaceSlotDisplay(null, bei_armaturename, bei_slotname, bei_slotdisplayname, b.armature.getSlot(forslotname));
    }


    /**
    * 返回实例确保单例
    */
    public static getinstance(): DRAGONBONES {
        if (this.D == null) {
            this.D = new DRAGONBONES();
        }
        return this.D;
    }
    private fal(event: dragonBones.EgretEvent) {

        event.target.visible = false;
    }
    private tru(event: dragonBones.EgretEvent) {

        event.target.visible = true;
    }

    /**
     * 移除DragonBonesData及TextureAtlasData实例
     * @param name 骨架名称
     * @param textureName 图集名称
     */
    public removeArmatureAndTexture(name: string, textureName: string = "") {
        this.dragonBones_arr.forEach((v, i) => {
            if (name == v.name) {
                this.egretFactory.removeDragonBonesData(v.gujia);
                if (textureName != "") {
                    this.egretFactory.removeTextureAtlasData(textureName);
                }
                this.dragonBones_arr.splice(i, 1);
            }
        });
    }

}