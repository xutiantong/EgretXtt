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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this._time = 0;
        _this.skinName = "Load";
        return _this;
    }
    LoadingUI.prototype.childrenCreated = function () {
        DRAGONBONES.getInstance().addToFactory("loading_ske_json", "loading_tex_json", "loading_tex_png");
        this.loadAnim = DRAGONBONES.getInstance().initArmature("加载动画", "loading");
        this.gr.addChild(this.loadAnim);
        this.loadAnim.animation.play("newAnimation", 0);
        // this.loadAnim.animation.timeScale = 1
        // this.loadAnim.animation.play("in_2", 1)
        // this.loadAnim.addEventListener(dragonBones.EgretEvent.COMPLETE, this.animComplete, this)
        this.addChild(new XDFLogoComponent());
    };
    LoadingUI.prototype.animComplete = function (evt) {
        if (evt.animationName == "in_2") {
            this._time++;
            if (this._time == 1) {
                this.loadAnim.animation.timeScale = -1;
                this.loadAnim.animation.play("in_2", 1);
            }
            else {
                this._time = 0;
                this.loadAnim.animation.timeScale = 1;
                this.loadAnim.animation.play("in_1", 1);
            }
        }
        if (evt.animationName == "in_1") {
            this._time++;
            if (this._time == 1) {
                this.loadAnim.animation.timeScale = -1;
                this.loadAnim.animation.play("in_1", 1);
            }
            else {
                this._time = 0;
                this.loadAnim.animation.timeScale = 1;
                this.loadAnim.animation.play("in_2", 1);
            }
        }
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        var percent = ((current / total) * 100).toFixed(0);
        this.lab.text = percent + "%";
    };
    return LoadingUI;
}(eui.Component));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
//# sourceMappingURL=LoadingUI.js.map