import PrefabBase from "../component/PrefabBase";
import { PANEL } from "./PanelManager";
import PanelHolder from "../component/PanelHolder";
import Log from "../utils/log/Log";
import ImgLoader from "../component/ImgLoader";
import { ZERO } from "../GameConst";
import frameClipDisplay from "../component/frameClipDisplay";

export default class PoolManager{

    private static _instance: PoolManager = null;
    public static getInstance(): PoolManager {
        if (PoolManager._instance == null) {
            PoolManager._instance = new PoolManager();
            
        }
        return PoolManager._instance;
    }

    private _prefabPools:any ={};  
    private _nodeSpritePools:cc.NodePool =new cc.NodePool(ImgLoader);
    private _nodeLabelPools:cc.NodePool = new cc.NodePool(cc.Label);
    private _nodeClipPools:cc.NodePool = new cc.NodePool(frameClipDisplay);

    public getPrefabFromPool(path: string,callback:Function,worldPoint:cc.Vec2=null) {
        let pool:cc.NodePool = this._prefabPools[path];
        // if(pool){
        //     console.log("putPrefabToPool [get]: path:"+path+" count:"+pool.size());
        // }
        // else{
        //     console.log("putPrefabToPool [get]: path:"+path+" count:"+0);
        // }
        if (pool == null || pool.size()==0) {
            // if(path != "prefabs/FarmBaseView"){
            //     PANEL.addLoadingLayer(worldPoint);
            // }
            cc.loader.loadRes(path, (err, prefab) =>{
                if (err) {
                    cc.error(err.message || err);
                    PANEL.removeLoadingLayer();
                    return;
                }
                // console.log("putPrefabToPool [get]: path:"+path+" instantiate1");
                let node: cc.Node = cc.instantiate(prefab);
                PANEL.removeLoadingLayer();
                let inst = node.getComponent(PrefabBase);
                if (inst != null) {
                    inst.prefabPath = path;
                    inst.create();
                }
                callback(node);
            });
        }else{
            let node = pool.get();
            if(!node.isValid)
            {
                // console.log("putPrefabToPool [get]: path:"+path+" count:"+pool.size());
                // console.log("putPrefabToPool [node] isValid")
                cc.loader.loadRes(path, (err, prefab) =>{
                    if (err) {
                        cc.error(err.message || err);
                        PANEL.removeLoadingLayer();
                        return;
                    }
                    //console.log("putPrefabToPool [get]: path:"+path+" instantiate2");
                    let node: cc.Node = cc.instantiate(prefab);
                    PANEL.removeLoadingLayer();
                    let inst = node.getComponent(PrefabBase);
                    if (inst != null) {
                        inst.prefabPath = path;
                        inst.create();
                    }
                    callback(node);
                });
                return;
            }
            let prefab = node.getComponent(PrefabBase);
            if (prefab != null) {
                prefab.reuse();
            }
            callback(node);
        }
    }

    public putPrefabToPool(node:cc.Node):boolean {
        var prefab: PrefabBase = node.getComponent(PrefabBase);
        if(prefab){
            let pool: cc.NodePool = this._prefabPools[prefab.prefabPath];
            if (pool == null) {
                pool = new cc.NodePool();
                this._prefabPools[prefab.prefabPath] = pool;
            }
            prefab.unuse();
            pool.put(node);
            //console.log("putPrefabToPool [add]: path:"+prefab.prefabPath+" count:"+pool.size());
            return true;
        }
        return false;
    }

    /**
     * 获取图片节点
     */
    public getImgSpriteFromPool(){
        if(this._nodeSpritePools.size()>0){
            return this._nodeSpritePools.get();
        }else{
            var node:cc.Node=new cc.Node();
            node.addComponent(ImgLoader);
            return node;
        }
    }

    public putImgSpriteToPool(node:cc.Node,reset:boolean = true){
        if(reset){
            node.position = ZERO;
            node.scale = 1;
            node.opacity = 255;
        }
        var img:ImgLoader = node.getComponent(ImgLoader);
        if(img){
            this._nodeSpritePools.put(node);
        }
    }

    /**
     * 获取文字节点
     */
    public getLabelFromPool(){
        if(this._nodeLabelPools.size()>0){
            return this._nodeLabelPools.get();
        }else{
            var node:cc.Node=new cc.Node();
            node.addComponent(cc.Label);
            return node;
        }
    }

    public putLabelToPool(node:cc.Node){
        var labl:cc.Label = node.getComponent(cc.Label);
        if(labl){
            this._nodeLabelPools.put(node);
        }
    }

    /**
     * 获取序列帧节点
     * 
     */
    public getFrameClipFromPool(){
        if(this._nodeClipPools.size()>0){
            return this._nodeClipPools.get();
        }else{
            var node:cc.Node=new cc.Node();
            node.addComponent(frameClipDisplay);
            return node;
        }
    }

    public putFrameClipToPool(node:cc.Node,reset = true){
        if(reset){
            node.position = ZERO;
            node.scale = 1;
            node.opacity = 255;
        }
        var clip:frameClipDisplay = node.getComponent(frameClipDisplay);
        if(clip){
            clip.stop();
            this._nodeClipPools.put(node);
        }
    }
    public clearPool(path:string)
    {
        let pool:cc.NodePool = this._prefabPools[path];
        if (pool == null || pool.size()==0)
        {
            return;
        }
        pool.clear();
    }


    public LogDetail(){
        Log.debug("------------------ prefabs info -----------------");
        Log.debug("prefabs list:")
        var totalCt:number = 0;
        for(var k in this._prefabPools){
            var size = (this._prefabPools[k] as cc.NodePool).size()
            Log.debug(size+" : "+k);
            totalCt+=size;
        }
        Log.debug("Total pool count: "+totalCt)
        Log.debug("------------------ prefabs info end-----------------");
    }
    // update (dt) {}
}

export var POOL = PoolManager.getInstance();

