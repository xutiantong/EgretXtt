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

    /**
     * 创建场景界面
     */
    protected createGameScene(): void {
        this.addChild(Hierarchy.ConfigManager.get())

    }
}
