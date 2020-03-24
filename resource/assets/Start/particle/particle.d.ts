declare module particle {
    class Particle {
        /**
         * ��ʾ Particle ʵ������ڸ������������ x ���ꡣ
         * @member {number} particle.Particle#x
         */
        x: number;
        /**
         * ��ʾ����ʵ������ڸ������������ y ���ꡣ
         * @member {number} particle.Particle#y
         */
        y: number;
        /**
         * ��ʾ��ע��㿪ʼӦ�õĶ�������ű������ٷֱȣ���
         * @member {number} particle.Particle#scale
         * @default 1
         */
        scale: number;
        /**
         * ��ʾ Particle ʵ������ԭʼ�������ת�̶ȣ��Զ�Ϊ��λ
         * @member {number} particle.Particle#rotation
         * @default 0
         */
        rotation: number;
        /**
         * ��ʾ���ӵ� Alpha ͸����ֵ
         * @member {number} particle.Particle#alpha
         * @default 1
         */
        alpha: number;
        /**
         * ��ʾ���ӵ�ǰ���ʱ�䣬�Ժ���Ϊ��λ��ȡֵ��Χ(0,Number.MAX_VALUE]����ֵ���� totalTime ʱ�����ӽ��ᱻ����
         * @member {number} particle.Particle#currentTime
         * @default 0
         */
        currentTime: number;
        /**
         * ��ʾ���ӵĴ����ʱ�䣬�Ժ���Ϊ��λ��ȡֵ��Χ(0,Number.MAX_VALUE]
         * @member {number} particle.Particle#totalTime
         * @default 1000
         */
        totalTime: number;
        /**
         * ��ʾ���ӵĻ��ģʽ
         * @member {number} particle.Particle#blendMode
         */
        blendMode: number;
        constructor();
        reset(): void;
        private matrix;
        $getMatrix(regX: number, regY: number): egret.Matrix;
    }
}
declare module particle {
    class ParticleSystem extends egret.DisplayObject {
        private _pool;
        private frameTime;
        private particles;
        private _emitterBounds;
        protected relativeContentBounds: egret.Rectangle;
        protected _emitterX: number;
        protected _emitterY: number;
        /**
         * ��ʾ���ӳ�����ʱ�䣬��λ���룬ȡֵ��Χ(0,Number.MAX_VALUE]��-1��ʾ����ʱ��
         * @member {number} particle.ParticleSystem#emissionTime
         * @default -1
         */
        emissionTime: number;
        /**
         * ��ʾ���ӳ��ּ������λ���룬ȡֵ��Χ(0,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#emissionRate
         */
        emissionRate: number;
        /**
         * ��ʾ������ʹ�õ�����
         * @member {egret.Texture} particle.ParticleSystem#texture
         */
        texture: egret.Texture;
        /**
         * ��ʾ����ϵͳ�������������������������������������ӣ�ȡֵ��Χ[1,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#maxParticles
         * @default 200
         */
        maxParticles: number;
        /**
         * ��ǰ������
         * @member {number} particle.ParticleSystem#numParticles
         */
        private numParticles;
        /**
         * ��ʾ�����࣬������ô�������ʱ����������
         * @member {number} particle.ParticleSystem#particleClass
         */
        particleClass: any;
        $particleConfig: any;
        constructor(texture: egret.Texture, emissionRate: number);
        protected createNativeDisplayObject(): void;
        initConfig(emissionRate: number, emitterX: number, emitterY: number): void;
        private getParticle();
        private removeParticle(particle);
        initParticle(particle: Particle): void;
        /**
         * ���µ�ǰ��ʾ��������ϵ�µı߿����
         * @param emitterRect {egret.Rectangle} ��Է��������ϵ�µĽ���
         */
        private updateRelativeBounds(emitterRect);
        /**
         * ��ʾ��ǰ����ϵͳ�з������ӵ���Ⱦ�߽緶Χ��ʹ���Է����Ϊ��׼������ϵ
         * @member {egret.Rectangle} particle.ParticleSystem#emitterBounds
         */
        emitterBounds: egret.Rectangle;
        onPropertyChanges(): void;
        /**
         * ��ʾ���ӳ��ֵ�X���꣬ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#emitterX
         * @default 0
         */
        emitterX: number;
        /**
         * ��ʾ���ӳ��ֵ�Y���꣬ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.ParticleSystem#emitterY
         * @default 0
         */
        emitterY: number;
        /**
         * ��ʼ��������
         * @param duration {number} ���ӳ�����ʱ��
         */
        start(duration?: number): void;
        /**
         * ֹͣ��������
         * @param clear {boolean} �Ƿ��������������
         */
        stop(clear?: boolean): void;
        private timeStamp;
        private update(timeStamp);
        private particleMeasureRect;
        private transformForMeasure;
        private lastRect;
        $measureContentBounds(bounds: egret.Rectangle): void;
        setCurrentParticles(num: number): void;
        /**
         * ������������
         * @param texture {egret.Texture} �µ�����
         */
        changeTexture(texture: egret.Texture): void;
        private clear();
        private addOneParticle();
        advanceParticle(particle: Particle, dt: number): void;
        private bitmapNodeList;
        $updateRenderNode(): void;
        private appendTransform(matrix, x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY);
    }
}
declare let regionPool: Region[];
/**
 * @private
 */
declare class Region {
    /**
     * @private
     * �ͷ�һ��Regionʵ���������
     */
    static release(region: Region): void;
    /**
     * @private
     * �Ӷ������ȡ���򴴽�һ���µ�Region����
     * �������һ����ʹ�õĶ��󣬾�ʹ�ô˷���������������ֱ��newһ����
     * ʹ�������ö�Ӧ��release()��̬�������ն�������Ч���ٶ��󴴽�������ɵ����ܿ�����
     */
    static create(): Region;
    /**
     * @private
     */
    minX: number;
    /**
     * @private
     */
    minY: number;
    /**
     * @private
     */
    maxX: number;
    /**
     * @private
     */
    maxY: number;
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @private
     */
    area: number;
    /**
     * @private
     */
    private setEmpty();
    /**
     * @private
     */
    updateRegion(bounds: egret.Rectangle, matrix: egret.Matrix): void;
}
declare module particle {
    class GravityParticle extends Particle {
        startX: number;
        startY: number;
        velocityX: number;
        velocityY: number;
        radialAcceleration: number;
        tangentialAcceleration: number;
        rotationDelta: number;
        scaleDelta: number;
        alphaDelta: number;
        reset(): void;
    }
}
declare module particle {
    class GravityParticleSystem extends ParticleSystem {
        /**
         * ��ʾ���ӳ�ʼ���� x ��ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitterXVariance
         */
        private emitterXVariance;
        /**
         * ��ʾ���ӳ�ʼ���� y ��ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitterYVariance
         */
        private emitterYVariance;
        /**
         * ��ʾ���Ӵ��ʱ�䣬��λ���룬ȡֵ��Χ(0,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#lifespan
         */
        private lifespan;
        /**
         * ��ʾ���Ӵ��ʱ���ֵ����λ���룬ȡֵ��Χ(0,Number.MAX_VALUE]�Ҳ����� lifespan
         * @member {number} particle.GravityParticleSystem#lifespanVariance
         */
        private lifespanVariance;
        /**
         * ��ʾ���ӳ���ʱ��С��ȡֵ��Χ(0,Number.MAX_VALUE]�����ӽ����ڴ��ʱ������ startSize ������Ϊ endSize
         * @member {number} particle.GravityParticleSystem#startSize
         */
        private startSize;
        /**
         * ��ʾ���ӳ���ʱ��С��ֵ��ȡֵ��Χ(0,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#startSizeVariance
         */
        private startSizeVariance;
        /**
         * ��ʾ������ʧʱ��С��ȡֵ��Χ(0,Number.MAX_VALUE]�����ӽ����ڴ��ʱ������ startSize������Ϊ endSize
         * @member {number} particle.GravityParticleSystem#endSize
         */
        private endSize;
        /**
         * ��ʾ������ʧʱ��С��ֵ��ȡֵ��Χ(0,Number.MAX_VALUE]���Ҳ�����endSize
         * @member {number} particle.GravityParticleSystem#endSizeVariance
         */
        private endSizeVariance;
        /**
         * ��ʾ���ӳ���ʱ�ĽǶȣ�ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitAngle
         */
        private emitAngle;
        /**
         * ��ʾ���ӳ���ʱ�ĽǶȲ�ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#emitAngleVariance
         */
        private emitAngleVariance;
        /**
         * ��ʾ���ӳ���ʱ��תֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]�����ӽ����ڴ��ʱ������ startRotation ������Ϊ endRotation
         * @member {number} particle.GravityParticleSystem#startRotation
         */
        private startRotation;
        /**
         * ��ʾ���ӳ���ʱ��תֵ��ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#startRotationVariance
         */
        private startRotationVariance;
        /**
         * ��ʾ������ʧʱ��תֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]�����ӽ����ڴ��ʱ������ startRotation ������Ϊ endRotation
         * @member {number} particle.GravityParticleSystem#endRotation
         */
        private endRotation;
        /**
         * ��ʾ������ʧʱ��תֵ��ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#endRotationVariance
         */
        private endRotationVariance;
        /**
         * ��ʾ���ӳ���ʱ�ٶȣ�ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#speed
         */
        private speed;
        /**
         * ��ʾ���ӳ���ʱ�ٶȲ�ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#speedVariance
         */
        private speedVariance;
        /**
         * ��ʾ����ˮƽ������ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#gravityX
         */
        private gravityX;
        /**
         * ��ʾ���Ӵ�ֱ������ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#gravityX
         */
        private gravityY;
        /**
         * ��ʾ���Ӿ�����ٶȣ�ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#radialAcceleration
         */
        private radialAcceleration;
        /**
         * ��ʾ���Ӿ�����ٶȲ�ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#radialAccelerationVariance
         */
        private radialAccelerationVariance;
        /**
         * ��ʾ����������ٶȣ�ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#tangentialAcceleration
         */
        private tangentialAcceleration;
        /**
         * ��ʾ����������ٶȲ�ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#tangentialAccelerationVariance
         */
        private tangentialAccelerationVariance;
        /**
         * ��ʾ���ӳ���ʱ�� Alpha ͸����ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]�����ӽ����ڴ��ʱ������ startAlpha ������Ϊ endAlpha
         * @member {number} particle.GravityParticleSystem#startAlpha
         */
        private startAlpha;
        /**
         * ��ʾ���ӳ���ʱ�� Alpha ͸���Ȳ�ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#startAlphaVariance
         */
        private startAlphaVariance;
        /**
         * ��ʾ������ʧʱ�� Alpha ͸����ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]�����ӽ����ڴ��ʱ������ startAlpha ������Ϊ endAlpha
         * @member {number} particle.GravityParticleSystem#endAlpha
         */
        private endAlpha;
        /**
         * ��ʾ������ʧʱ�� Alpha ͸���Ȳ�ֵ��ȡֵ��Χ[-Number.MAX_VALUE,Number.MAX_VALUE]
         * @member {number} particle.GravityParticleSystem#endAlphaVariance
         */
        private endAlphaVariance;
        /**
         * ��ʾ����ʹ�õĻ��ģʽ
         * @member {number} particle.GravityParticleSystem#blendMode
         */
        private particleBlendMode;
        /**
         * �Ƿ���ɽ���json����
         */
        private $init;
        constructor(texture: egret.Texture, config: any);
        start(duration?: number): void;
        setCurrentParticles(num: number): void;
        onPropertyChanges(): void;
        private parseConfig(config);
        initParticle(particle: Particle): void;
        private static getValue(base, variance);
        advanceParticle(particle: Particle, dt: number): void;
    }
}