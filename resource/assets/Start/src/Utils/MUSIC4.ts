/**
 * 对外提供声音同步缓存加载方案
 * 第3版本
 */
class MUSIC4 {

    private static D: MUSIC4 = null;
    private last_Arr: Array<string> = new Array<string>()
    private position_Arr: Array<number> = new Array<number>()
    private Arr: Array<any> = new Array<any>(); // name sound channel isPlay

    /**
     * 注册声音
     * @param arr 声音文件名称合集
     */
    init(arr: Array<any>) {
        arr.forEach((element) => {
            let sound: egret.Sound = RES.getRes(element + "_mp3");
            let channel: egret.SoundChannel = null;
            this.Arr.push({
                name: element,
                sound: sound,
                channel: channel,
                isPlay: false
            })
        });
    }

    /**
    * 继续上一个播放
    */
    continueLast() {
        for (let i = 0; i < this.last_Arr.length; i++) {
            if (this.last_Arr[i] == "bg") {
                //对背景音乐做特殊处理
                this.play(this.last_Arr[i], 0, this.position_Arr[i])
            } else {
                this.play(this.last_Arr[i], 1, this.position_Arr[i]);
            }
        }
    }

    /**
     * 暂停上一个播放
     */
    pauseLast() {
        this.last_Arr = []
        this.position_Arr = []
        for (let i = 0; i < this.Arr.length; i++) {
            let v = this.Arr[i];
            if (v.channel != null) {
                let ch: egret.SoundChannel = v.channel;
                if (v.isPlay == true) {
                    this.last_Arr.push(v.name)
                    this.position_Arr.push(ch.position)
                    this.stop(v.name)
                }
            }
        }
    }

    /**
     * 根据名字播放声音
     * @param name 文件名
     * @param num 播放次数
     * @param start 开始位置
     */
    play(name: string, num = 1, start = 0) {
        for (let i = 0; i < this.Arr.length; i++) {
            let v = this.Arr[i];
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                }
                v.channel = v.sound.play(start, num);
                v.isPlay = true
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, () => {
                    v.isPlay = false
                }, this);
                break;
            }
        }
    }

    /**
     * 根据名字停止声音
     * @param name 文件名
     */
    stop(name: string) {
        for (let i = 0; i < this.Arr.length; i++) {
            let v = this.Arr[i];
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                    v.channel = null;
                    v.isPlay = false
                }
                break;
            }
        }
    }

    /**
     * 根据名字添加声音结束回调
     * @param name 文件名
     * @param fun 方法
     * @param that 对象this
     */
    addEvent(name: string, fun: Function, that: any) {
        for (let i = 0; i < this.Arr.length; i++) {
            let v = this.Arr[i];
            if (name == v.name) {
                if (v.call != undefined && v.call != null) {
                    v.channel.removeEventListener(egret.Event.SOUND_COMPLETE, v.call, that);
                }
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, fun, that);
                v.call = fun
                break;
            }
        }
    }

    /**
     * 获得声音的长度(秒)
     * @param name 名字
     */
    getLength(name: string) {
        for (let i = 0; i < this.Arr.length; i++) {
            let v = this.Arr[i];
            if (name == v.name) {
                return v.sound.length;
            }
        }
    }
    /**
     * 调整音量
     * @param val 音量大小
     */
    changeVolume(val: number) {
        for (let i = 0; i < this.Arr.length; i++) {
            if (this.Arr[i].channel != null && this.Arr[i].isPlay) {
                this.Arr[i].channel.volume = val;
            }
        }
    }

    public static get(): MUSIC4 {
        if (this.D == null) {
            this.D = new MUSIC4();
        }
        return this.D;
    }

}