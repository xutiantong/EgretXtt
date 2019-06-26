import Log from "../utils/log/Log";
import StringUtil from "../utils/StringUtil";

export default class ResourceManager{

    private static _instance: ResourceManager = null;
    public static getInstance(): ResourceManager {
        if (ResourceManager._instance == null) {
            ResourceManager._instance = new ResourceManager();
            
        }
        return ResourceManager._instance;
    }

    private totalDownNum:number = 0;    // 总下载数量
    private curDownNum = 0;             // 当前下载数量

    private _resMap: any = {};
    public constructor()
    {
    }


    /**
     * 检查资源链接
     * @param val 
     */
    public checkLoadUrl(val:string){
        return val;
        // return cc.url.raw(val);
    }

    /**加载一个队列 */
    public loadArr(resList:any,progress:Function,complete:Function,failed:Function){
        if(resList instanceof Array) {
            resList.forEach((value:string,idx:number,arr:string[])=>{
                if(value.indexOf("http")<0 && value.indexOf("res/raw-assets/")<0) 
                {
                    arr[idx] = this.checkLoadUrl(value);
                }
            }, this)
        }else{
            failed();
            return;
        }
        cc.loader.load(resList, (completedCount: number, totalCount: number, item: any) => {
            if(item.error) {
                Log.error("加载失败：" + "item.error.status: " + item.error.status + ", "  +item.error.errorMessage + " url: " + item.url);
            } else {
                if(CC_DEBUG)
                {
                    Log.debug("加载成功：" + item.url);
                }

                let name = StringUtil.getShortFileName(item.url)
                this._resMap[name] = item.url;

                // 进度
                this.curDownNum += 1;
                let progressval = this.curDownNum  * 100 / this.totalDownNum;
                let data = {url: item.rawUrl, type: item.type, progress: progressval};
                if(progress!=null){
                    progress(data);
                }
            }
            
        }, (errors, results) => {
            if (errors) {
                //暂时不处理
                Log.debug("加载失败："+results);
		    } else {
                Log.debug("@@ doDownload 下载完成 ---------- ")
                if(complete!=null){
                    complete();
                }
            }
        });
    }

    /**加载异步资源 */
    public loadAsync(res:any,complete:Function){

    }

    /**
     * 加载预制
     * @param prefabName 
     * @param complete 
     */
    public loadPrefab(prefabName:string,complete:Function){
       cc.loader.loadRes(prefabName, (err, prefab) =>{
            if (err) {
                cc.error(err.message || err);
                return;
            }
            let node: cc.Node = cc.instantiate(prefab);
            complete(node);
        });
    }

    public loadLocalSprite(path:string,container:cc.Sprite,scale:number = 1,callback?: Function)
    {
        cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
            if (err ) {
                Log.debug('loadLocalSprite failed: ', "[" + path + "]");
            } else {
                container.spriteFrame = spriteFrame;
                container.node.scale = scale;
            }
            if(callback){
                callback();
            }
        });
    }

    /**
     * 加载图片
     * @param url   可以是远程地址，带上http，也可以是本地地址
     * @param sprite    下载成功后，要更新的sprite
     * @param callback  成功后回调 cb(err,tex)
     */
    public loadImage(url: string, sprite: cc.Sprite, callback?: Function) {
        Log.debug("utils.loadUrlImage: ", url)
        if (!url) {
            return;
        }
       if(url.indexOf("http")<0)
       {
           url = cc.url.raw(url);
       }
        // return;
        cc.loader.load({url: url, type: 'png'}, function (err, tex) {
            if (err ) {
                Log.debug('loadUrlImage failed: ', "[" + err + "]");
                return;
            } else {
                Log.debug('loadUrlImage success: ', url, tex);
                sprite.spriteFrame = new cc.SpriteFrame(tex, new cc.Rect(0, 0, tex.pixelWidth, tex.pixelHeight));
            }
            if (callback) {
                callback(err, tex);
            }
        });
    }
    public loadGenderSprite(sex:number,spr:cc.Sprite)
    {
        if(sex == 0 || sex == 2) {
          
            this.getSpriteFrameByPath('img/common/friendHeadImg.png',(error: Error, resource: cc.SpriteFrame)=>{
                if(error)
                {
                    console.error('img/common/friendHeadImg.png 加载失败');
                    return;
                }
                spr.spriteFrame = resource;
            })
        } else {
           
            this.getSpriteFrameByPath('img/common/friendHeadImg.png',(error: Error, resource: cc.SpriteFrame)=>{
                if(error)
                {
                    console.error('img/common/friendHeadImg.png 加载失败');
                    return;
                }
                spr.spriteFrame = resource;
            })
        }
    }

    public loadnpcSprite(num:string,spr:cc.Sprite)
    {
        this.getSpriteFrameByPath('img/ui/npc/npc'+num+'.png',(error: Error, resource: cc.SpriteFrame)=>{
            if(error)
            {
                console.error('img/ui/npc/npc'+num+'.png 加载失败');
                return;
            }
            spr.spriteFrame = resource;
        })
    }

    public loadHeadSprite(url:string,spr:cc.Sprite,sex:number = 0)
    {
        function setDefaultHead() {
            console.log("头像加载失败: " + url);
            if(sex == 1) {
                this.getSpriteFrameByPath('ui/avatar/icon_man.png',(error: Error, resource: cc.SpriteFrame)=>{
                    spr.spriteFrame = resource;
                })
            } else {
                this.getSpriteFrameByPath('ui/avatar/icon_man.png',(error: Error, resource: cc.SpriteFrame)=>{
                    spr.spriteFrame = resource;
                })
            }
        }

        try {
            cc.loader.load({url: url, type: 'jpg'}, function (err, texture) {
                if(err) {
                    setDefaultHead();
                } else {
                    try {
                        // Use texture to create sprite frame
                        console.log("头像加载成功: " + url);
                        spr.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        setDefaultHead();
                    }
                } 
            });
        } catch (e) {
            setDefaultHead();
        }
    }

    public loadHeadSpriteV1(url:string,spr:cc.Sprite,sex:number = 0)
    {
        function setDefaultHead(self:any) {
            if(CC_DEBUG)
            {
                console.log("头像加载失败: " + url);
            }
            if(sex == 1) {
                self.getSpriteFrameByPath('img/common/friendHeadImg.png',(error: Error, resource: cc.SpriteFrame)=>{
                    spr.spriteFrame = resource;
                })
            } else {
                self.getSpriteFrameByPath('img/common/friendHeadImg.png',(error: Error, resource: cc.SpriteFrame)=>{
                    spr.spriteFrame = resource;
                })
            }
        }

        try {
            if(url.indexOf("http") >=0 )
            {
                this.loadImage(url,spr,function(err, texture){
                    if(err) {
                        setDefaultHead(this);
                    } else {
                        try {
                            // Use texture to create sprite frame
                            console.log("头像加载成功: " + url);
                            spr.spriteFrame = new cc.SpriteFrame(texture);
                        } catch (e) {
                            setDefaultHead(this);
                        }
                    } 
                })
            }else{
                this.getSpriteFrameByPath(url,(error: Error, resource: cc.SpriteFrame)=>{
                    if(error)
                    {
                        setDefaultHead(this);
                        return;
                    }
                    spr.spriteFrame = resource;
                })
            }
        } catch (e) {
            setDefaultHead(this);
        }
    }


    /**
     * 获取资源
     * @param resname 
     */
    public get(resname:string): any {
        let res = null;
        (res = cc.loader.getRes(this._resMap[resname])) || 
        (res = cc.loader.getRes(this._resMap[StringUtil.getShortFileName(resname)])) ||
        (res = cc.loader.getRes(resname)) 
        return res;
    }


    // v1.10.1 重构新方法读取本地资源文件

    private checkUrlPath(resPath :string){
        if (resPath.indexOf("resources") >= 0) {
            resPath = resPath.replace('resources/','')
        } 
        return resPath
    }

    /**
     *  获取资源对应的spriteFrame
     * @param resPath 资源路径 resource节点之后
     * @param cb  回调方法  参数(error: Error, resource: cc.SpriteFrame)
     */
    public getSpriteFrameByPath(resPath:string,cb:Function){
        if (resPath.indexOf("http") >= 0 ){
            console.error('传入了网络资源url : ' + resPath);
        }else{
            let newPath = this.checkUrlPath(resPath)
            cc.loader.loadRes(newPath,cc.SpriteFrame,
                (error: Error, resource: cc.SpriteFrame) => {
                    if(error)
                    {
                        console.error("getSpriteFrameByPath: fail "+ resPath + "error:"+error);
                        return;
                    }
                    cb && cb(error,resource)
                }
            );
        }
   
    }
   /**
     * 预加载资源
     * @param resources 
     * @param callback 
     */
    public Preload(resources: string|string[]|{ path: string; initialCount: number }[],callback?: (err: string) => void,progressCallback?: (name:string,n: number) => void){
        let items: { path: string,initialCount: number}[] = [];
        if ((typeof resources) === "string") {
            items.push({ path: <string>resources, initialCount: 1 });
        } else if (resources instanceof Array) {
            for (let r of resources) {
                if ((typeof r) === "string")
                    items.push({ path: <string>r, initialCount: 1 });
                else
                    items.push(<{ path: string; initialCount: number }>r);
            }
        }
        let loadError="";
        let preloadCount: number = 0;
        for (let i of items) {
            let name = i.path;
            cc.loader.loadRes(i.path, function(e, prefab) {
                if (e) {
                    loadError=loadError+"\n"+e.message
                } 
                
                if (++preloadCount >= items.length && callback) {
                    callback(loadError);
                }
                else{
                    progressCallback(name,preloadCount);
                }
            });
        }
    }

    private _atlasMap:any= {};
    public getLoadedAtlas(atlas:string){
        return this._atlasMap[atlas];
    }

    public loadAtlas(atlasName:string,cb:Function){
        var loadedAtlas:any = this.getLoadedAtlas(atlasName);
        if(loadedAtlas!=undefined){
            cb(loadedAtlas);
        }else{
            cc.loader.loadRes(atlasName, cc.SpriteAtlas, (err, atlas)=> {
                if(err){
                    console.log("load spriteAtlas error!name:",atlasName);
                    cb(null);
                }
                this._atlasMap[atlasName] = atlas;
                cb(atlas);
            });
        }
    }

    public loadAtlasSprite (atlasName: string, spriteName: string, container: cc.Sprite, scale: number = 1) {
        var loadedAtlas: any = this.getLoadedAtlas(atlasName);
        if (loadedAtlas != undefined) {
            let frame = loadedAtlas.getSpriteFrame(spriteName);
            if (frame == undefined) {
                return;
            }
            container.spriteFrame = frame;
            container.node.scale = scale;
        }
        else {
            cc.loader.loadRes(atlasName, cc.SpriteAtlas, (err, atlas)=> {
                if(err){
                    console.log("load spriteAtlas error!name:",atlasName);
                    return;
                }
                this._atlasMap[atlasName] = atlas;
                let frame = atlas.getSpriteFrame(spriteName);
                if (frame == undefined) {
                    return;
                }
                container.spriteFrame = frame;
                container.node.scale = scale;    
                
            });
        }
    }

    /**
     * 粒子加载本地贴图
     */
    public lodeLocalTexture(particle:cc.ParticleSystem,url){
        try {
            cc.loader.loadRes(url,(err,res)=>{
                if(err) {
                    console.log("加载失败: " + url);
                } else {
                    try {
                        // Use texture to create sprite frame
                        console.log("加载成功: " + url);
                        particle.texture=res;
                    } catch (e) {
                        console.log("加载失败: " + url);
                    }
                } 
                
            });
        } catch (e) {
            console.log("加载失败: " + url);
        }
    }

    /**
     * 
     * @param spr1 十位显示
     * @param spr2 个位显示
     * @param num 数字
     * 发光字
     */
    public LodeTensDigitNum(spr1:cc.Sprite,spr2:cc.Sprite,num:number){
        if(num>=10){
            var num1=Math.floor(num/10);
            var num2=num%10;
            spr1.node.active=true;
            spr2.node.active=true;
            RES.loadLocalSprite("img/ui/newshuzi/"+num1,spr1);
            RES.loadLocalSprite("img/ui/newshuzi/"+num2,spr2);
        }else{
            spr1.node.active=false;
            spr2.node.active=true;
            RES.loadLocalSprite("img/ui/newshuzi/"+num,spr2);
        }
    }
}

export var RES = ResourceManager.getInstance();