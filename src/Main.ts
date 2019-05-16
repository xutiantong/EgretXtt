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

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("loading");
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    // private txt: string = "<font color=\"#ff0000\"><a href = 'event:hello'>只是有些麻烦</a>，点击句子后。</font>";
    // private correct: string = "只是有些麻烦";
    // private textfield: egret.TextField;
    // private label: egret.TextField;
    // private loopTime: number = 0;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        this.addChild(GlobalManager.getInstance());
        // let sky = this.createBitmapByName("bg_jpg");
        // this.addChild(sky);
        // let stageW = this.stage.stageWidth;
        // let stageH = this.stage.stageHeight;
        // sky.width = stageW;
        // sky.height = stageH;

        // let colorLabel = new egret.TextField();
        // colorLabel.textColor = 0xffffff;
        // colorLabel.width = stageW - 172;
        // colorLabel.textAlign = "center";
        // colorLabel.textFlow = (new egret.HtmlTextParser).parser(this.txt);
        // colorLabel.addEventListener(egret.TextEvent.LINK, this.onTextClick, this);
        // colorLabel.touchEnabled = true;
        // colorLabel.size = 80;
        // colorLabel.x = 172;
        // colorLabel.y = 500;
        // this.addChild(colorLabel);
        // this.textfield = colorLabel;

        // var label: egret.TextField = new egret.TextField();
        // this.addChild(label);
        // label.text = "♦";
        // label.size = 80;
        // label.textAlign = egret.HorizontalAlign.CENTER;
        // label.fontFamily = "微软雅黑";
        // label.textColor = 0x00ff00;
        // label.x = 0;
        // label.y = 0;
        // this.label = label;
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }

    // private onTextClick(evt: egret.TextEvent) {
    //     var pos = this.txt.search(this.correct);
    //     var length = this.correct.length;
    //     var dd = evt.target.textNode.drawData;
    //     var width = 0;
    //     var endPosX = 0;
    //     for (let i = 0; i < dd.length; i++) {
    //         if (dd[Number(i)] == this.correct) {
    //             width = dd[Number(i) + 2] - dd[Number(i) - 2];
    //             this.label.x = dd[Number(i) - 2] + this.textfield.x;
    //             this.label.y = dd[Number(i) - 1] + this.textfield.y - 40;
    //         }
    //     }
    //     egret.Tween.get(this.label).wait(500).to({ x: this.label.x + width }, length * 1000);
    //     egret.Tween.get(this, { loop: true }).to({}, 1000).call(() => {
    //         this.txt = this.txt.replace(this.correct.substring(this.loopTime, this.loopTime + 1), "    ");
    //         console.log(this.correct.substr(this.loopTime, 1))
    //         console.log(this.txt)
    //         this.textfield.textFlow = (new egret.HtmlTextParser).parser(this.txt);
    //         this.loopTime += 1;
    //         if (this.loopTime == length) {
    //             egret.Tween.removeTweens(this);
    //         }
    //     });
    // }
}
