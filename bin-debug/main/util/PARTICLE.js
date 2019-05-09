var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 对外提供封装特效使用1.0
 * 1.先将特效进行注册
 * 2.选用播放和停止
 * 3.随时变更参数
 */
var PARTICLE = (function () {
    function PARTICLE() {
        /**
         * 已注册特效存储
         name：名称 string
         texiao：特效实体 particle.GravityParticleSystem
         play:是否处于播放状态 true 是,false不是
         */
        this.particle_arr = new Array();
    }
    /**
     * 注册特效
     *name:为该特效取的名称（供以后调用）
     png:纹理集
     json:配套json数据
     com:要将特效放入的显示容器
     index:要将特效放入显示容器的层级（选填，0是最底层，数字越大显示越靠前）
     */
    PARTICLE.prototype.init = function (name, png, json, com, index) {
        this.png = png;
        this.json = json;
        var texiao = new particle.GravityParticleSystem(RES.getRes(this.png), RES.getRes(this.json));
        index == null ? com.addChild(texiao) : com.addChildAt(texiao, index);
        texiao.anchorOffsetX = 0;
        texiao.anchorOffsetY = 0;
        this.particle_arr.push({ name: name, texiao: texiao, play: false });
    };
    /**
     * 播放特效(已注册的特效未播放完毕则不能重新播放)
     * 默认锚点为：0,0
     * name:特效名称
     * playnum:播放次数
     * x:x坐标
     * y:y坐标
     * call:结束回调
     */
    PARTICLE.prototype.play = function (name, playnum, x, y, call) {
        var _this = this;
        this.particle_arr.forEach(function (v, i) {
            if (v.name == name) {
                if (v.play == false) {
                    var particlei = v.texiao;
                    particlei.start(playnum);
                    if (x != null) {
                        particlei.x = x;
                    }
                    if (y != null) {
                        particlei.y = y;
                    }
                    v.play = true;
                    particlei.addEventListener(egret.Event.COMPLETE, function () {
                        v.play = false;
                        if (call != null) {
                            call();
                        }
                    }, _this);
                }
            }
        });
    };
    /**
     * 对外提供特效停止
     * name：特效名称
     */
    PARTICLE.prototype.stop = function (name) {
        this.particle_arr.forEach(function (v, i) {
            if (v.name == name) {
                if (v.play == true) {
                    var particlei = v.texiao;
                    particlei.stop();
                    v.play = false;
                }
            }
        });
    };
    /**
     * 改变特效的纹理图片
     * name:被改变的特效名称
     * png:要改变的新的纹理图片
     */
    PARTICLE.prototype.pngchange = function (name, png) {
        this.particle_arr.forEach(function (v, i) {
            if (v.name == name) {
                var particlei = v.texiao;
                particlei.changeTexture(RES.getRes(png));
            }
        });
    };
    /**
     * 更改特定特效的参数
     * name:特效名称
     * empoint：喷射基准点
     * rectangle:喷射区域（围绕喷射基准点变化）
     * emissionTime：喷射间隔
     * rotation:喷射角度
     * alpha:透明度
     */
    PARTICLE.prototype.config = function (name, empoint, rectangle, emissionTime, rotation, alpha) {
        this.particle_arr.forEach(function (v, i) {
            if (v.name == name) {
                var particlei = v.texiao;
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
        });
    };
    /**
     * 对内提供返回实例确保单例
     */
    PARTICLE.getinstance = function () {
        if (this.P == null) {
            this.P = new PARTICLE();
        }
        return this.P;
    };
    /**
   * 单例存储
   */
    PARTICLE.P = null;
    return PARTICLE;
}());
__reflect(PARTICLE.prototype, "PARTICLE");
//# sourceMappingURL=PARTICLE.js.map