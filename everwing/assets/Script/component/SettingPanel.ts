import PopupBase from "./PopupBase";
import { SOUND } from "../manager/SoundManager";
import { RES } from "../manager/ResourceManager";
import { GAME } from "../model/GameData";
import { SOCIAL } from "../modules/social/SocialAssist";

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
export default class SettingPanel extends PopupBase {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    idLabel: cc.Label = null;
    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Sprite)
    sexSpr: cc.Sprite = null;

    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Node)
    musicNode: cc.Node = null;

    @property(cc.Node)
    bgSliderNode: cc.Node = null;
    @property(cc.Node)
    musicSliderNode: cc.Node = null;

    @property(cc.Label)
    bgOpenLabel: cc.Label = null;
    @property(cc.Label)
    bgCloseLabel: cc.Label = null;
    @property(cc.Label)
    musicOpenLabel: cc.Label = null;
    @property(cc.Label)
    musicCloseLabel: cc.Label = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    public static Button_Type_OK:number = 0;
    public static Button_Type_YesNo:number = 1;


    private _btnType:number = 0;
    private _title:string;
    private _msg:string;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    public onInit(param?:any){
        super.onInit();
        this.nameLabel.string = GAME.playerData.playerName;
        this.idLabel.string = "ID:"+SOCIAL.socialData.uid;
        RES.loadHeadSpriteV1(GAME.playerData.icon,this.iconSpr,GAME.playerData.gender);
        RES.loadGenderSprite(GAME.playerData.gender,this.sexSpr);
        this.onUpdate();
    }
    private clickMaskClose:boolean =true;
    protected panelMaskTouch(e){
        // if(this.clickMaskClose){
        //     this.closePanel();
        // }
    }

    onEnable(){
        this.bgNode.on(cc.Node.EventType.TOUCH_END, this.onBtnBgMusicClick, this);
        this.musicNode.on(cc.Node.EventType.TOUCH_END, this.onBtnMusicClick, this);
        this.btnClose.node.on(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);
    }

    onDisable(){
        this.bgNode.off(cc.Node.EventType.TOUCH_END, this.onBtnBgMusicClick, this);
        this.musicNode.off(cc.Node.EventType.TOUCH_END, this.onBtnMusicClick, this);
        this.btnClose.node.off(cc.Node.EventType.TOUCH_END, this.onBtnCloseClick, this);
    }


    private onBtnBgMusicClick(evt) {
        SOUND.SetBgMuiscOpen();
        this.onUpdate();
    }

    private onBtnMusicClick(evt) {
        SOUND.SetMuiscOpen();
        this.onUpdate();
    }

    private onBtnCloseClick(evt) {
        this.closePanel();
    }

    private onUpdate() {
        if (SOUND.getBgMusicSwitch()) {
            this.bgOpenLabel.node.color = cc.color(255,255,255);
            this.bgCloseLabel.node.color = cc.color(200,200,200);
            this.bgSliderNode.setPositionX(-50);
        }else {
            this.bgCloseLabel.node.color = cc.color(255,255,255);
            this.bgOpenLabel.node.color = cc.color(200,200,200);
            this.bgSliderNode.setPositionX(50);
        }

        if (SOUND.getMusicSwitch()) {
            this.musicOpenLabel.node.color = cc.color(255,255,255);
            this.musicCloseLabel.node.color = cc.color(200,200,200);
            this.musicSliderNode.setPositionX(-50);
        }else {
            this.musicCloseLabel.node.color = cc.color(255,255,255);
            this.musicOpenLabel.node.color = cc.color(200,200,200);
            this.musicSliderNode.setPositionX(50);
        }
    }

    start () {

    }

    // update (dt) {}
}
