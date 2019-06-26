import MItemRender from "./MItemRender";
import { PANEL } from "../manager/PanelManager";
import { AssetConst, ZERO } from "../GameConst";
import { MSG } from "../message/MessageController";
import MessageConst from "../message/MessageConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MList extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    itemRender: cc.Prefab = null;

    @property([cc.Prefab])
    itemRenders: cc.Prefab[] = [];

    @property /** Item宽和列表宽保持一致 */
    fitWidth: boolean = false;

    public static AliginType = {
        ALIGN_LEFT: 0,
        ALIGN_CENTER: 1,
    };

    /** List数据源 */
    private _data: Array<any> = null;

    private _isStart: boolean = false;

    /** ItemRender内存池 */
    private _nodePool: cc.NodePool = null;

    /** 总行 */
    private _rows: number = 1;
    /** 总列 */
    private _cols: number = 1;

    /** 当前列表显示的Item */
    private _elements: Array<MItemRender> = [];

    /** MList是否开启滑动 */
    private _touchEnabled: boolean = true;

    private _alignType: number = MList.AliginType.ALIGN_LEFT;

    /** 当前渲染器索引 */
    private _currentRenderIndex: number = 0;

    private _isUpdataList:boolean;
    private _dataIndex:number;
    private _dataLen:number;

    private _itemW:number;
    private _itemH:number;

    private _offSize:cc.Size = cc.size(0, 0);

    public set currentRenderIndex(value: number) {
        if (this._currentRenderIndex != value) {
            this._currentRenderIndex = value;
            if (this._nodePool != null) {
                this._nodePool.clear();
            }
        }
    }

    public get currentRenderIndex() {
        return this._currentRenderIndex;
    }

    /**
     * MList是否开启滑动
     */
    public set touchEnabled(value: boolean) {
        if (this._touchEnabled == value) {
            return;
        }
        this._touchEnabled = value;
        this.scrollView.enabled = this._touchEnabled;
    }

    public get touchEnabled(): boolean {
        return this._touchEnabled;
    }

    public set alignType(value) {
        if (this._alignType != value) {
            this._alignType = value;
            this.updateContent();
        }
    }

    public setData(data: Array<any>, offSize = cc.size(0, 0)) {
        this._data = data;
        this._offSize = offSize;
        this.updateContent();
    }

    public set cols(value: number) {
        this._cols = value;
    }

    public set rows(value: number) {
        this._rows = value;
    }

    /** 添加Item */
    public addItem(data: any) {
        if (data == null) {
            return;
        }
        this._data.push(data);
        this.updateContent();
    }

    /** 移除Item */
    public removeItem(index: number) {
        if (index >= 0 && index <  this._dataLen) {
            this._data.splice(index, 1);
            this.updateContent();
        }
    }

    /** 获得Item */
    public getItemByIdx(idx:number): MItemRender{
        return this._elements[idx];
    }
    public getDatas(): any{
        return this._data;
    }
    /** 获得当前显示的所有列表Item */
    public getItems(): Array<MItemRender>{
        return this._elements;
    }

    /**
     * cc.ScrollView bug： 窗口动画播放完后需要调用此方法
     * 目前发现节点有动画，滑动会出现不弹出边界bug
     */
    public updatContent() {
        this.scrollView.content.height += 0.01;
    }
    public removeAllItems()
    {
        // 回收所有Item
        while(this._elements.length > 0) {
            let item = this._elements.shift();
            if(item)
            {
                this._nodePool.put(item.node);
            }
        }
    }
    
    protected updateContent() {
        if (this.enabled == false || this._isStart == false) {
            return;
        }
        if (this._data != null && this._data.length > 0) {

            this._dataIndex = 0;
            this._dataLen = this._data.length;
            this._isUpdataList = true;

            this.removeAllItems();
            this.updateContentSize();
           
            // 初始化所有Item
            // 临时初始化所有，以后需要优化
            // for (let i = 0; i < this._data.length; i++) {
            //     let item = this.getItemRender();
            //     let itemData = this._data[i];
            //     let itemRender = item.getComponent(MItemRender);
            //     if (itemRender != null) {
            //         itemRender.setData(itemData);
            //     }
            //     item.parent = this.scrollView.content;
            //     this._elements.push(itemRender);
            //     this.updateItem(item, i);
            // }

            // this.node.emit("update_content");
        }
        else{
            this.removeAllItems();
        }
    }

    /** 更新列表容器大小 */
    private updateContentSize() {
        let viewWidth = this.scrollView.node.width;
        let viewHeight = this.scrollView.node.height;
        let listWidth = viewWidth;
        let listHeight = viewHeight;

        if (this.scrollView.horizontal == true) {
            this._itemW = this.currentRender.data.width;
            if (this._rows == 1) {
                listWidth =  this._dataLen *  this._itemW;
            } else {
                this._cols = Math.ceil( this._dataLen / this._rows);
                listWidth = this._cols *  this._itemW;
            }
            if (listWidth <= viewWidth) {
                listWidth = viewWidth;
            }
        } else if (this.scrollView.vertical == true) {
            this._itemH = this.currentRender.data.height;
            if (this._cols == 1) {
                listHeight =  this._dataLen * this._itemH ;
            } else {
                this._rows = Math.ceil( this._dataLen / this._cols);
                listHeight = this._rows * this._itemH ;
            }
            if (listHeight <= viewHeight) {
                listHeight = viewHeight;
            }
        }

        this.scrollView.content.setContentSize(listWidth + this._offSize.width, listHeight + this._offSize.height);
        this.scrollView.setContentPosition(cc.v2(0, 0));
    }

    /** 更新Item坐标 */
    private updateItem(item: cc.Node, index: number) {
        if (this.scrollView.horizontal == true) { // 水平
            let offsetx = 0;
            if (this._rows == 1) {
                if ( this._dataLen < this._cols) {
                    // 处理总Item小于总列，Item居中
                    if (this._alignType == MList.AliginType.ALIGN_CENTER) {
                        let w =  this._dataLen * item.width;
                        offsetx = (this.scrollView.node.width - w) / 2;
                    }
                }
                item.x = offsetx + index * item.width + item.width * item.anchorX;
                item.y = -item.height * (1 - item.anchorY);
            } else {                
                // 水平滑动，垂直排列方式
                let col = Math.floor(index / this._rows);
                let row = index % this._rows;
                item.x = offsetx + col * item.width + item.width * item.anchorX;
                item.y = -row * item.height - item.height * (1 - item.anchorY); 
            }

        } else if (this.scrollView.vertical == true) { // 垂直
            let offsetx = (this.scrollView.node.width - this._cols * item.width) / 2;
            if (this._cols == 1) {
                item.x = offsetx + item.width * item.anchorX;
                item.y = -index * item.height - item.height * (1 - item.anchorY);
            } else {
                // 垂直滑动，水平排列方式
                let row = Math.floor(index / this._cols);
                let col = index % this._cols;
                item.x = offsetx + col * item.width + item.width * item.anchorX;
                item.y = -row * item.height - item.height * (1 - item.anchorY);
            }
        }
    }

    /** 获得对象池里的ItemRender实例，如果没有重新创建 */
    private getItemRender() {
        let item = this._nodePool.get();
        if (item == null) {
            let render = this.currentRender;
            if (render) {
                item = cc.instantiate(render);
            }
        }
        return item;
    }

    private get currentRender(): cc.Prefab {
        let render = this.itemRender;
        if (this.currentRenderIndex >= 0 && this.currentRenderIndex < this.itemRenders.length) {
            render = this.itemRenders[this.currentRenderIndex];
        }
        return render;
    }

    /** 根据ScrollView和ItemRender设置行列 */
    private autoSetRowAndCol() {
        if(this.currentRender.data==null || this.currentRender.data==undefined)
        {
            return;
        }
        if (this.fitWidth == true) {
            this.currentRender.data.width = this.scrollView.node.width;
        }
        this._rows = Math.floor(this.scrollView.node.height / this.currentRender.data.height);
        this._cols = Math.floor(this.scrollView.node.width / this.currentRender.data.width);
    }

    /** 初始化ScorllView相关节点，负责List标准 */
    private initScorllView() {
        this.scrollView.content.anchorX = 0;
        this.scrollView.content.anchorY = 1;
        let contentParent = this.scrollView.content.parent;
        if (contentParent != this.scrollView.node) {
            contentParent.anchorX = 0;
            contentParent.anchorY = 1;
            contentParent.width = this.scrollView.node.width;
            contentParent.height = this.scrollView.node.height;
            contentParent.x = -this.scrollView.node.width / 2;
            contentParent.y = this.scrollView.node.height / 2;
        }
    }

    private onViewChangedSize(evt) {
        this.initScorllView();
        this.autoSetRowAndCol();
        this.updateContent();
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._nodePool = new cc.NodePool();
        if (CC_EDITOR) {
            if (this.scrollView.horizontal && this.scrollView.vertical) {
                cc.error("MList only support horizontal or vertical!");
            }
        }
    }

    onEnable() {
        this.scrollView.node.on('size-changed', this.onViewChangedSize, this);
    }

    onDisable() {
        this.scrollView.node.off('size-changed', this.onViewChangedSize, this);
    }

    start () {
        this._isStart = true;
        this.touchEnabled = this._touchEnabled;
        this.initScorllView();
        this.autoSetRowAndCol();
        this.updateContent();
    }

   
    update (dt) {
       this.refreshList();
    }

    refreshList()
    {
        if(!this._isUpdataList)
        {
            return;
        }
        if(this._dataIndex<this._dataLen){
            let item = this.getItemRender();
            let itemData = this._data[this._dataIndex];
            let itemRender = item.getComponent(MItemRender);
            if (itemRender != null) {
                itemRender.setData(itemData);
            }
            item.parent = this.scrollView.content;
            this._elements.push(itemRender);
            this.updateItem(item, this._dataIndex);
            this._dataIndex++;
        }else
        {
            this._isUpdataList = false;
            this.node.emit("update_content");
        }
    }
    onDestroy() {
        if (this._nodePool != null) {
            this._nodePool.clear();
        }
    }
}
