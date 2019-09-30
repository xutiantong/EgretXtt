//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })
        // egret.lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }
        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
    }

    countGroupError = 0;
    private onResourceLoadErr(event: RES.ResourceEvent): void {
        if (++this.countGroupError < 3) {
            RES.loadGroup(event.groupName);
            console.error(event.groupName, this.countGroupError);
        } else {
            console.error("弹出网络失去连接提示等");
        }
    }

    private onResourceLoadComplete(event: RES.ResourceEvent) {
        console.log("已加载完成组为", event.groupName)
    }

    private async loadResource() {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
        try {
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("load");
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);


            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
            var wenzi = document.getElementById("jiazaiwenti");//获取DIV 
            wenzi.style.display = "none";//隐藏DIV
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private customFilter: egret.CustomFilter;
    private props;
    private touchPoint: egret.Point
    private timeOnEnterFrame = 0;

    /**
     * 创建场景
     */
    protected createGameScene(): void {
        this.initShader();
        this.props = {
            aspect: 1.7,     //波纹长宽比
            radius: .07,     //半径
            amp: 0.4,
            band: .4,
            waves: 15,       //波数
            speed: 3,
            life: .5,
            progress: 0,
        }
        this.addChild(Hierarchy.ConfigManager.get());
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.handleClick, this)
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.timeOnEnterFrame = egret.getTimer();
    }

    private handleClick(evt: egret.TouchEvent) {
        let isTouch: boolean = false;
        isTouch = true;
        this.touchPoint = new egret.Point(evt.stageX, evt.stageY)
        let rectangle: egret.Rectangle = this.$getOriginalBounds();
        this.customFilter = new egret.CustomFilter(
            this.vertexSrc,
            this.fragmentSrc,
            {
                center: {
                    x: (this.touchPoint.x - rectangle.x) / rectangle.width,
                    y: 1 - (this.touchPoint.y - rectangle.y) / rectangle.height
                },
                lowV: {
                    x: (0 - rectangle.x) / rectangle.width,
                    y: 1 - (0 - rectangle.y) / rectangle.height
                },
                heightV: {
                    x: (this.stage.stageWidth - rectangle.x) / rectangle.width,
                    y: 1 - (this.stage.stageHeight - rectangle.y) / rectangle.height
                },
                aspect: this.props.aspect,
                radius: this.props.radius,
                amp: this.props.amp,
                band: this.props.band,
                waves: this.props.waves,
                speed: this.props.speed,
                life: this.props.life,
                time: this.props.time,
                progress: this.props.progress,
            }
        );
        this.customFilter.uniforms.progress = 0.0;
        this.filters = [this.customFilter];
    }

    /**
     * 定时器用于shader
     * @param e 
     */
    private onEnterFrame(e: egret.Event) {
        let now = egret.getTimer();
        let time = this.timeOnEnterFrame;
        let dt = (now - time) / (this.props.life * 1000);

        this.timeOnEnterFrame = egret.getTimer();

        if (!this.customFilter) return;
        this.customFilter.uniforms.progress += dt;
        //重新计算渲染位置并传入shader中
        let rectangle: egret.Rectangle = this.$getOriginalBounds();
        this.customFilter.uniforms.center = {
            x: (this.touchPoint.x - rectangle.x) / rectangle.width,
            y: 1 - (this.touchPoint.y - rectangle.y) / rectangle.height
        }
        this.customFilter.uniforms.aspect = this.stage.width / this.stage.height;

        // if (this.customFilter.uniforms.progress > 1) {
        //     this.customFilter.uniforms.progress = 0.0;
        //     this.filters = [];
        // }
    }

    private vertexSrc: string;
    private fragmentSrc: string;
    private initShader() {
        this.vertexSrc =
            `
            attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;
            attribute vec2 aColor;

            uniform vec2 projectionVector;

            varying vec2 vTextureCoord;
            varying vec4 vColor;
            varying vec2 vUv;

            const vec2 center = vec2(-1.0, 1.0);

            void main(void) {
               gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);
               vTextureCoord = aTextureCoord;
               vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);
               //0.0 - 1.0
               vUv = vTextureCoord;
            }
            `;

        this.fragmentSrc =
            `
            precision lowp float;
            const int numbers = 1;

            uniform sampler2D uSampler;
            uniform float aspect;
            uniform float radius;
            uniform float amp;
            uniform float band;
            uniform float waves;
            uniform float speed;
            uniform float progress;
            uniform vec2 center;
            uniform vec2 lowV;
            uniform vec2 heightV;
            varying vec2 vUv;
            
            
            void main() {
                vec2 tc = vUv.xy;
                vec2 uv = vec2(0.0, 0.0);
                vec2 p;
                float len;
                vec2 uv_offset;
                float wave_width = band * radius;

                p = (tc - center);
                p.x = p.x * aspect;
                len = length(p);
            
                float current_progress = progress;
                float current_radius = radius * current_progress;
                float damp_factor = 1.0;
                if (current_progress > .5) {
                    damp_factor = (1.0 - current_progress) * 2.0;
                }
            
                float cut_factor = clamp(wave_width * damp_factor - abs(current_radius - len), 0.0, 1.0);
                float waves_factor = waves * len / radius;
                uv_offset = (p / len) * cos((waves_factor - current_progress * speed) * 3.14) * amp * cut_factor;
            
                uv += uv_offset;
                // vec2 tmp = fract(tc + uv);
                vec2 tmp = tc + uv;
                if(tmp[0] < lowV.x)
                {
                    tmp[0] = vUv.x;
                }
                else if (tmp[0] > heightV.x){
                    tmp[0] = vUv.x;
                }

                if(tmp[1] > lowV.y)
                {
                    tmp[1] = vUv.y;
                }
                else if (tmp[1] < heightV.y){
                    tmp[1] = vUv.y;
                }

                vec4 t_image = texture2D(uSampler, tmp);

                gl_FragColor = t_image;
            }
        `;
    }

}
