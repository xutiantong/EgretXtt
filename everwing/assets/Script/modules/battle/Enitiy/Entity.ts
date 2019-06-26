export class Entity {    public id = "";    //位置    public x = 0;    public y = 0;    //速度    public vx = 0;    public vy = 0;    //加速度    public ax = 0;    public ay = 0;    //size    public width = 0;    public height = 0;    //碰撞盒    public minHitX = 0;    public maxHitX = 0;    public minHitY = 0;    public maxHitY = 0;    //隐藏显示    public staleView: boolean = !1;    //释放函数    public onRelease: () => void = null;    public active: boolean = !1;    public view = null;    //池    public _collection = null;    public _poolIndex: number = 0;    public reset(id: string) {        this.vx = 0;        this.vy = 0;        this.ax = 0,            this.ay = 0,            this.onRelease = null,            this.staleView = !!this.view    }    public step(t: number) {        this.move(t);    }    protected move(t: number): void {        //s = 1/2 * ( v0 + v1) * t ; v1 = v0 + at        this.x += t * this.vx / 2,            this.vx += t * this.ax,            this.x += t * this.vx / 2,            this.y += t * this.vy / 2,            this.vy += t * this.ay,            this.y += t * this.vy / 2    }    public release() {    }    public kill() {        this.release()    }    public pause() {    }    public resume() {    }}export class Timer {    public elapsed = 0;    public duration = 0;    public active = !1;    public paused = !1;    public callback: () => void = null;    public step(e: number) {        if (this.paused) return;        if (this.elapsed < this.duration) {            this.elapsed += e;            if (this.elapsed >= this.duration) {                this.active = !1;                this.elapsed = this.duration;                this.callback && this.callback();            }        }    }    public pause() {        this.paused = !0    }    public resume() {        this.paused = !1    }    public getTime() {        return this.duration - this.elapsed;    }    public getTimePercent() {        return this.duration && this.getTime() / this.duration;    }    public reset(e) {        this.elapsed = 0;        this.duration = e;        this.active = e > 0;        this.paused = !1;    }}