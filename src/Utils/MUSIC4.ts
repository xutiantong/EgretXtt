/**
 * 对外提供声音同步缓存加载方案
 * 第3版本
 */
class MUSIC4 {
    /**
     * 单例存储
     */
    private static D: MUSIC4 = null;
    private last_Arr: Array<string> = new Array<string>()
    private position_Arr: Array<number> = new Array<number>()
    /**
     * 货站
     * 存储
     * name
     * sound
     * channel
     */
    private Arr: Array<any> = new Array<any>();
    /**
     * 注册声音
     */
    init(arr: Array<any>) {
        arr.forEach((element, i) => {
            let sound: egret.Sound = RES.getRes(element + "_mp3");
            let channel: egret.SoundChannel = null;
            this.Arr.push({
                name: element,
                sound: sound,
                channel: channel,
                isplay: false
            })
        });

    }
    //继续上一个播放
    huifuLast() {
        this.last_Arr.forEach((v, i) => {
            this.play(v, 1, this.position_Arr[i])
        }

        )

    }

    //暂停上一个播放
    pauseLast() {
        this.last_Arr = []
        this.position_Arr = []
        this.Arr.forEach((v) => {
            if (v.channel != null) {
                let ch: egret.SoundChannel = v.channel;
                if (v.isplay == true) {
                    this.last_Arr.push(v.name)
                    this.position_Arr.push(ch.position)
                    this.stop(v.name)
                }
            }

            return;
        }
        )

    }



    /**
     * 根据名字播放声音
     */
    play(name: string, num = 1, start = 0) {
        this.Arr.forEach((v) => {
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                }
                v.channel = v.sound.play(start, num);
                v.isplay = true
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, () => {
                    v.isplay = false
                }, this);
                return;
            }
        })
    }





    /**
     * 根据名字停止声音
     */
    stop(name) {
        this.Arr.forEach((v) => {
            if (name == v.name) {
                if (v.channel != null) {
                    v.channel.stop();
                    v.channel = null;
                    v.isplay = false
                }
                return;
            }
        })
    }

    /**
    * 為聲音添加監聽播放完
    * @param name 
    * @param fun 
    * @param that 
    */
    addEvent(name: string, fun: Function, that) {
        this.Arr.forEach((v) => {
            if (name == v.name) {
                if (v.call != undefined && v.call != null) {
                    v.channel.removeEventListener(egret.Event.SOUND_COMPLETE, v.call, that);
                }
                v.channel.addEventListener(egret.Event.SOUND_COMPLETE, fun, that);
                v.call = fun
                return;
            }
        })
    }

    /**
    * 返回实例确保单例
    */
    public static get(): MUSIC4 {
        if (this.D == null) {
            this.D = new MUSIC4();
        }
        return this.D;
    }

}