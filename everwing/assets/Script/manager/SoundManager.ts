import Log from "../utils/log/Log";
import {MSG} from "../message/MessageController";
import MessageConst from "../message/MessageConst";
import {Loading_debug_step} from "../GameConst";

export default class SoundManager{

    private _playBg:boolean;
    private _bgId:number;
    private _bgVolume:number = 1;

    private _musicSwitch:boolean = false;
    private _bgMusicSwitch:boolean = true;
    private _rushId:number;
    private _soundMap: {[key: string]: cc.AudioClip} = {};
    private _lastBgSound:string=SoundConst.Everwing_menu;

    private static _instance: SoundManager = null;
    public static getInstance(): SoundManager {
        if (SoundManager._instance == null) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }
    
    private _effectVolume:number;

    private constructor(){
        this._effectVolume = 0.5;
    }

    public initData() {
        var bgmusic=cc.sys.localStorage.getItem("bgMusicSwitch");
        var music = cc.sys.localStorage.getItem("musicSwitch");
        if(bgmusic===0||bgmusic==="0"){
            this._bgMusicSwitch=false;
        }
        if(window["systemInfo"]==undefined||window["systemInfo"].platform=="ios"){
            if(music===0||music==="0"){
                this._musicSwitch=false;
            }else{
                this._musicSwitch=true;
            }
        }else{
            if(music===1||music==="1"){
                this._musicSwitch=true;
            }
        }
    }

    private _getAudioClip(path: string) {
        return this._soundMap[path];
    }

    /**
     * 播放按钮声音
     */
    public playBtnSound(){
        this.playEffectOnce(SoundConst.Btn_sound);
    }

    public playSoundOnce(path:string){
        var self = this;
        if (this._musicSwitch == false) {
            return;
        }

        let clip = this._getAudioClip(path);
        if (clip == undefined) {
            return;
        }
        cc.audioEngine.play(clip, false, self._bgVolume);
    }

    playEffectOnce(path:string){
        var self = this;
        if (this._musicSwitch == false) {
            return;
        }

        let clip = this._getAudioClip(path);
        if (clip == undefined) {
            console.log("sound undefined:" + path);
            return;
        }
        cc.audioEngine.playEffect(clip, false);

    }

    playEffect(path:string){
        var self = this;
        if (this._musicSwitch == false) {
            return;
        }

        let clip = this._getAudioClip(path);
        if (clip == undefined) {
            return;
        }
        cc.audioEngine.playEffect(clip,true);
    }

    public playSound(path:string){
        var self = this;
        if (this._musicSwitch == false) {
            return;
        }

        let clip = this._getAudioClip(path);
        if (clip == undefined) {
            return;
        }
        cc.audioEngine.play(clip,true,self._bgVolume);
    }

    public getBgMusicSwitch() {
        return this._bgMusicSwitch;
    }

    public getMusicSwitch() {
        return this._musicSwitch;
    }

    public SetBgMuiscOpen() {
        this._bgMusicSwitch = !this._bgMusicSwitch;
        if (this._bgMusicSwitch) {
            this.playBgSound(SoundConst.Everwing_menu);
        }else {
            this.stopBgSound();
        }
        cc.sys.localStorage.setItem("bgMusicSwitch",Number(this._bgMusicSwitch));
        // let val = this._bgMusicSwitch ? 1 : 0;
        // NET.send(NetConst.SettingMusic, {type: 0, value: val }, () => {
        // }, this);
    }

    public SetMuiscOpen() {
        this._musicSwitch = !this._musicSwitch;
        cc.sys.localStorage.setItem("musicSwitch",Number(this._musicSwitch));
        // let val = this._musicSwitch ? 1 : 0;
        // NET.send(NetConst.SettingMusic, {type: 1, value: val }, () => {
        // }, this);
    }

    /**
     * 播放背景音乐
     */
    public playBgSound(path:string)
    {
        this._lastBgSound=path;
        if ( this._bgMusicSwitch == false ) {
            return;
        }
        if(this._bgId==null||isNaN(this._bgId))
        {
            var self = this;
            let clip = this._getAudioClip(path);
            if (clip == null) {
                return;
            }
            self._bgId = cc.audioEngine.playMusic(clip,true);
        }else{
            var self = this;
            cc.audioEngine.resumeMusic();
        }
        this._playBg = true;
        
    }

    public stopBgSound()
    {
        if(!isNaN(this._bgId))
        {
            cc.audioEngine.pauseMusic();
            this._playBg = false;
        }
        
        
    }

    public resumeBgSound(){
        if(!isNaN(this._bgId)&&this._bgMusicSwitch)
        {
            cc.audioEngine.resumeMusic();
            this._playBg = true;
        }
    }

    public playEverwingOverMusic(){
        if(!isNaN(this._bgId))
        {
            cc.audioEngine.stopMusic();
        }
        this._bgId=null;
        this.playBgSound(SoundConst.Everwing_over);
    }

    public playEverwingMeunMusic(){
        if(!isNaN(this._bgId))
        {
            cc.audioEngine.stopMusic();
        }
        this._bgId=null;
        this.playBgSound(SoundConst.Everwing_menu);
    }

    public playEverwingGameMusic(){
        if(!isNaN(this._bgId))
        {
            cc.audioEngine.stopMusic();
        }
        this._bgId=null;
        this.playBgSound(SoundConst.Everwing_game);
    }

    /**
     * 预加载音乐音效
     * @param completeHandler 加载完成回调
     */
    public preLoadSound(completeHandler: Function) {
        let self = this;
        MSG.emit(MessageConst.Debug_loading_step , 
            {step:Loading_debug_step.Loading_debug_step_loadSoundStart});
        cc.loader.loadResArray(SoundConst.preload, cc.AudioClip, function (err: Error, resource: any[]) {
            if (err) {
                Log.error("preLoadSound: ", err);
                return;
            }

            for (let i = 0; i < resource.length; i++) {
                self._soundMap[resource[i].name] = resource[i];
            }
            MSG.emit(MessageConst.Debug_loading_step,
                {step: Loading_debug_step.Loading_debug_step_loadSoundFinish});
            completeHandler();
        });

        cc.loader.loadResDir('sound', cc.AudioClip, function (err, objects, urls) {
		    if (err) {
                Log.error("preLoadSound: ", err);
                return;
            }
            for (let i = 0; i < objects.length; i++) {
                self._soundMap[objects[i].name] = objects[i];
            }
        });
    }

    /**
     * 播放收取金币
     */
    public playCoinCollectSound(){
        this.playEffectOnce(this._getRandom(SoundConst.coin_collect));
    }

    public play(sound: SoundInfo) {
        this.playEffectOnce(this._getRandom(sound));
    }

    private _getRandom(info: SoundInfo) {
        var _sources: string[] = info.sources;
        var index = Math.random() * _sources.length | 0;
        return _sources[index]
    }

    /**
     * 播放子弹打中怪物
     */
    public playBulletHiteMonsterSound(){
        this.playEffectOnce(this._getRandom(SoundConst.enemy_hit));
    }

    /**
     * 播放进入游戏音效
     */
    public playGameIntoSound(){
        this.playEffectOnce(SoundConst.game_intro);
    }

    /**
     * 导弹音效
     */
    public playMissileSound(){
        this.playEffectOnce(SoundConst.meteor_warnSound);
    }

     /**
      * 冲刺音效
      */
     public playRushSound(){
        this.playEffectOnce(SoundConst.player_rushSound);
     }

     /**
      * 停止冲刺音效
      */
    //  public stopRushSound(){
    //      if(!isNaN(this._rushId)){
    //         cc.audioEngine.stopEffect(this._rushId);
    //      }
    //  }

     /**
      * 死亡音效
      */
     public playDeathSound(){
        this.playEffectOnce(SoundConst.deathSound);
     }

}

export class SoundConst {
    public static Btn_sound: string = "effect_click";
    public static Everwing_over: string = "game_over";
    public static Everwing_menu: string = "menu";
    public static Everwing_game: string = "game";
    public static game_intro: string = "game_intro";
    public static meteor_warnSound: string = "meteor_warn";
    public static player_rushSound: string = "player_rush";
    public static deathSound: string = "vfx_alice_death_1";
    public static coin_collect: SoundInfo = {
        volume: .8,
        sources: ["coin_collect_1", "coin_collect_2", "coin_collect_3"],
        desc: "金币收集"
    };
    public static enemy_hit: SoundInfo = {
        volume: .3,
        sources: ["enemy_hit_1", "enemy_hit_2", "enemy_hit_3"],
        desc: "小怪-被击"
    };
    public static enemy_death_bomb: SoundInfo = {volume: .8, sources: ["enemy_death_bomb"], desc: "bomb-死亡"};
    public static enemy_death_treasure: SoundInfo = {
        volume: .8,
        sources: ["enemy_death_treasure"],
        desc: "treasure-死亡"
    };
    public static enemy_death: SoundInfo = {
        volume: .3,
        sources: ["enemy_death_groan_1", "enemy_death_groan_2", "enemy_death_groan_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3", "enemy_death_impact_1", "enemy_death_impact_2", "enemy_death_impact_3"]
        , desc: "敌人死亡"
    };
    public static gem_collect: SoundInfo = {volume: .7, sources: ["gem_collect"], desc: "宝石-收集"};
    public static item_collect_clover: SoundInfo = {volume: .7, sources: ["item_collect_clover"], desc: "道具-收集-武器升级"};
    public static item_collect_double_shot: SoundInfo = {
        volume: .7,
        sources: ["item_collect_double_shot"],
        desc: "道具-收集-双倍子弹"
    };
    public static item_collect_energy: SoundInfo = {volume: .8, sources: ["item_collect_energy"], desc: "道具-收集-能量"};
    public static item_collect_magnet: SoundInfo = {volume: .7, sources: ["item_collect_magnet"], desc: "道具-收集-磁铁"};
    public static item_collect_rush: SoundInfo = {volume: .7, sources: ["item_collect_rush"], desc: "道具-收集-冲刺"};
    public static trophy_collect: SoundInfo = {volume: .4, sources: ["trophy_collect"], desc: "奖杯-收集"};
    public static boss_tree_attack_1: SoundInfo = {volume: .8, sources: ["boss_tree_attack_1"], desc: "树王-攻击1"};
    public static boss_tree_attack_2: SoundInfo = {volume: .8, sources: ["boss_tree_attack_2"], desc: "树王-攻击2"};
    public static boss_tree_death: SoundInfo = {volume: .8, sources: ["boss_tree_death"], desc: "树王-死亡"};
    public static boss_queen_death: SoundInfo = {volume: 1, sources: ["boss_queen_death"], desc: "女王-死亡"};
    public static boss_queen_fire_appear: SoundInfo = {volume: 1, sources: ["boss_queen_fire_appear"], desc: "火-出现"};
    public static boss_queen_fire_attack: SoundInfo = {
        volume: .8,
        sources: ["boss_queen_fire_attack_1", "boss_queen_fire_attack_2"],
        desc: "火-攻击"
    };
    public static boss_queen_ice_appear: SoundInfo = {volume: 1, sources: ["boss_queen_ice_appear"], desc: "冰-出现"};
    public static boss_queen_ice_attack: SoundInfo = {volume: .5, sources: ["boss_queen_ice_attack"], desc: "冰-攻击"};
    public static boss_queen_laugh: SoundInfo = {volume: 1, sources: ["boss_queen_laugh"], desc: "女王-大笑-出现"};
    public static boss_queen_vortex: SoundInfo = {volume: 1, sources: ["boss_queen_vortex"], desc: "女王-攻击"};
    public static boss_queen_water_appear: SoundInfo = {volume: 1, sources: ["boss_queen_water_appear"], desc: "水-出现"};
    public static boss_queen_water_attack: SoundInfo = {
        volume: .15,
        sources: ["boss_queen_water_attack"],
        desc: "水-攻击"
    };
    public static boss_queen_wind_appear: SoundInfo = {volume: 1, sources: ["boss_queen_wind_appear"], desc: "风-出现"};
    public static boss_queen_wind_attack: SoundInfo = {volume: .8, sources: ["boss_queen_wind_attack"], desc: "风-攻击"};
    public static boss_king_attack: SoundInfo = {volume: .3, sources: ["boss_king_attack"], desc: "魔王-攻击"};
    public static boss_king_burp: SoundInfo = {volume: .5, sources: ["boss_king_burp"], desc: "魔王-打嗝攻击"};
    public static boss_king_death: SoundInfo = {volume: .8, sources: ["boss_king_death"], desc: "魔王-死亡"};
    public static boss_blob_death: SoundInfo = {volume: .6, sources: ["boss_blob_death"], desc: "分裂怪-死亡"};
    public static boss_blob_split: SoundInfo = {volume: .6, sources: ["boss_blob_split"], desc: "分裂怪-分裂"};
    public static boss_alarm: SoundInfo = {volume: .75, sources: ["boss_alarm"], desc: "boss-警报"};
    public static booster_laser: SoundInfo = {volume: 1, sources: ["booster_laser"], desc: "激光"};
    public static preload: string[] = [
        "sound/menu",
        "sound/game",
        "sound/enemy_hit_1", "sound/enemy_hit_2", "sound/enemy_hit_3",
        "sound/coin_collect_1", "sound/coin_collect_2", "sound/coin_collect_3"
    ]
}

class SoundInfo {
    volume: number;
    sources: string[];
    desc: string
}

export var SOUND = SoundManager.getInstance();