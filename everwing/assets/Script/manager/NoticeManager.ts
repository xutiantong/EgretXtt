import { POOL } from "./PoolManager";
import { PANEL } from "./PanelManager";
import ImgLoader from "../component/ImgLoader";

export default class NoticeManager {
    private static _instance: NoticeManager = null;
    public static getInstance(): NoticeManager {
        if (NoticeManager._instance == null) {
            NoticeManager._instance = new NoticeManager();
            
        }
        return NoticeManager._instance;
    }

    private _imgNotices:any ={};
    /**
     * 
     * @param worldPos 
     * @param stayTime 
     */
    public showImgNotice(imgRes:string,worldPos:cc.Vec2,stayTime:number = 3){
        if(this._imgNotices[imgRes]!=undefined){
            return;
        }
        console.log("showImgNotice:",imgRes)
        var node:cc.Node = POOL.getImgSpriteFromPool();
        node.getComponent(ImgLoader).load(imgRes);
        this._imgNotices[imgRes] = node;
        node.parent = PANEL.panelHolder.topLayer;
        node.position = PANEL.panelHolder.topLayer.convertToNodeSpaceAR(worldPos);
        var callback = cc.callFunc(()=>{
            console.log("removeImgNotice:",imgRes)
            POOL.putImgSpriteToPool(node);
            delete this._imgNotices[imgRes];
        });
        var seq  = cc.sequence(cc.fadeIn(0.3)
            ,cc.delayTime(stayTime)
            ,cc.spawn(cc.moveBy(0.6,cc.v2(0,50)),cc.fadeOut(0.6))
            ,callback);
        node.runAction(seq);
    }
}

export var NOTICE = NoticeManager.getInstance();