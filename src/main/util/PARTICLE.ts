
/**
 * 对外提供封装特效使用1.0
 * 1.先将特效进行注册
 * 2.选用播放和停止
 * 3.随时变更参数
 */
class PARTICLE {
    /**
   * 单例存储
   */
    private static P: PARTICLE = null;
    /**
     * 已注册特效存储
     name：名称 string
     texiao：特效实体 particle.GravityParticleSystem
     play:是否处于播放状态 true 是,false不是
     */
    private particle_arr: Array<any> = new Array<any>();
    private png;
    private json;
    /**
     * 注册特效
     *name:为该特效取的名称（供以后调用）
     png:纹理集
     json:配套json数据
     com:要将特效放入的显示容器
     index:要将特效放入显示容器的层级（选填，0是最底层，数字越大显示越靠前）
     */
    public init(name: string, png: string, json: string, com: any, index?: number) {
        this.png = png;
        this.json = json;
        let texiao = new particle.GravityParticleSystem(RES.getRes(this.png), RES.getRes(this.json));
        index == null ? com.addChild(texiao) : com.addChildAt(texiao, index);
        texiao.anchorOffsetX = 0;
        texiao.anchorOffsetY = 0;
        this.particle_arr.push({ name: name, texiao: texiao, play: false });
    }
    /**
     * 播放特效(已注册的特效未播放完毕则不能重新播放)
     * 默认锚点为：0,0
     * name:特效名称
     * playnum:播放次数
     * x:x坐标
     * y:y坐标
     * call:结束回调
     */
    public play(name: string, playnum: number, x?: number, y?: number, call?: any) {
        this.particle_arr.forEach((v, i) => {
            if (v.name == name) {
                if (v.play == false) {
                    let particlei: particle.GravityParticleSystem = v.texiao;
                    particlei.start(playnum);
                    if (x != null) {
                        particlei.x = x;
                    }
                    if (y != null) {
                        particlei.y = y;
                    }
                    v.play = true;
                    particlei.addEventListener(egret.Event.COMPLETE, () => {
                        v.play = false;
                        if (call != null) {
                            call();
                        }
                    }, this);
                }
            }
        })
    }
    /**
     * 对外提供特效停止
     * name：特效名称
     */
    public stop(name: string) {
        this.particle_arr.forEach((v, i) => {
            if (v.name == name) {
                if (v.play == true) {
                    let particlei: particle.GravityParticleSystem = v.texiao;
                    particlei.stop();
                    v.play = false;
                }
            }
        })
    }
    /**
     * 改变特效的纹理图片
     * name:被改变的特效名称
     * png:要改变的新的纹理图片
     */
    public pngchange(name: string, png: string) {

        this.particle_arr.forEach((v, i) => {
            if (v.name == name) {
                let particlei: particle.GravityParticleSystem = v.texiao;
                particlei.changeTexture(RES.getRes(png))
            }
        })
    }
    /**
     * 更改特定特效的参数
     * name:特效名称
     * empoint：喷射基准点
     * rectangle:喷射区域（围绕喷射基准点变化）
     * emissionTime：喷射间隔
     * rotation:喷射角度
     * alpha:透明度
     */
    public config(name: string, empoint?: egret.Point, rectangle?: egret.Rectangle, emissionTime?: number, rotation?: number, alpha?: number) {
        this.particle_arr.forEach((v, i) => {
            if (v.name == name) {
                let particlei: particle.GravityParticleSystem = v.texiao;
                if (rotation != null) {
                    particlei.emissionRate = rotation;
                }
                if (emissionTime != null) {
                    particlei.emissionTime = emissionTime;
                }
                if (rectangle != null) {
                    particlei.emitterBounds = rectangle;
                }
                if (alpha != null) {
                    particlei.alpha = alpha;
                }
                if (empoint != null) {
                    particlei.emitterX = empoint.x;
                    particlei.emitterY = empoint.y;
                }
            }
        })
    }
    /**
     * 对内提供返回实例确保单例
     */
    public static getinstance() {
        if (this.P == null) {
            this.P = new PARTICLE();
        }
        return this.P;
    }
}