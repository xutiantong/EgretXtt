export default class Timer {    private elapsed = 0;    private duration = 0;    private active = false;    private paused = false;    private callback: () => void = null;    public reset(d: number) {        this.elapsed = 0;        this.duration = d;        this.active = d > 0;        this.paused = !1;    }    public step(dt: number) {        if (this.paused) return        if (this.elapsed < this.duration) {            this.elapsed += dt;            if (this.elapsed >= this.duration) {                this.active = !1,                    this.elapsed = this.duration,                this.callback && this.callback()            }        }    }    public pause() {        this.paused = !0    }    public resume() {        this.paused = !1    }    public getTime() {        return this.duration - this.elapsed    }    public getElapsed(){        return this.elapsed;    }    public getTimePercent() {        return this.duration && this.getTime() / this.duration    }    public isActive() {        return this.active;    }}