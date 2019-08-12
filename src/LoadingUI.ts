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

class LoadingUI extends eui.Component implements RES.PromiseTaskReporter {

    public lab: eui.Label;
    public gr: eui.Group;

    public constructor() {
        super();
        this.skinName = "Load"
    }

    protected childrenCreated(): void {
        DRAGONBONES.getInstance().addToFactory("winter_loading_ske_json", "winter_loading_tex_0_json", "winter_loading_tex_0_png");
        DRAGONBONES.getInstance().addTextrueAtlas("winter_loading_tex_1_json", "winter_loading_tex_1_png");
        DRAGONBONES.getInstance().addTextrueAtlas("winter_loading_tex_2_json", "winter_loading_tex_2_png");
        DRAGONBONES.getInstance().initArmature("加载动画", "loading");
        DRAGONBONES.getInstance().playAnimation("加载动画", "newAnimation", this.gr, 0, 1, 1, 1);
        this.addChild(new XDFLogoComponent());
    }

    public onProgress(current: number, total: number): void {
        let percent = ((current / total) * 100).toFixed(0)
        this.lab.text = `${percent}%`;
    }
}