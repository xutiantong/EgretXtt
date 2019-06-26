// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LabelEffect extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    private _playAniFinish: boolean = false;
    private _text: string = "";
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    /**
     * 文字一个一个的出来效果
     * @param text 文本
     * @param cb 回调
     */
    public typingAni (text: string, cb: Function) {
        this.label.string = "";
        this._text = text;
        var self = this;
        var html = '';
        var arr = text.split('');
        var len = arr.length;
        var step = 0;
        let func = function () {
            html += arr[step];
            this.label.string = html;
            if (++step == len) {
                self.unschedule(func);
                self._playAniFinish = true;
                cb && cb();
            }
        }
        self.schedule(func,0.15, cc.macro.REPEAT_FOREVER, 0)
    }

    public getPlayAniFinishState () {
        return this._playAniFinish;
    }
    public setPlayAniFinishState (s) {
        this._playAniFinish = s;
    }
    public judgePlayAniFinish (): boolean {
        let playFinishState = this.getPlayAniFinishState();
        if (playFinishState == false) {
            this.label.string = this._text;
            this._playAniFinish = true;
            this.unscheduleAllCallbacks();
            return false;
        }
        return true
    }
    // update (dt) {}
}
