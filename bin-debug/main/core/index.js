var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var z;
(function (z) {
    //主页
    var index = (function (_super) {
        __extends(index, _super);
        function index() {
            var _this = _super.call(this) || this;
            //声音---------------------
            _this.cangjieen_sound = RES.getRes("cangjieen_mp3");
            _this.yutupaopao_sound = RES.getRes("yutupaopao_mp3");
            _this.jianxiao_sound = RES.getRes("jianxiao_mp3");
            _this.luoxia_sound = RES.getRes("luoxia_mp3");
            _this.qipao_sound = RES.getRes("qipao_mp3");
            _this.ba_sound = RES.getRes("mba_mp3");
            _this.bu_sound = RES.getRes("mbu_mp3");
            _this.da_sound = RES.getRes("mda_mp3");
            _this.feng_sound = RES.getRes("mfeng_mp3");
            _this.ge_sound = RES.getRes("mge_mp3");
            _this.guan_sound = RES.getRes("mguan_mp3");
            _this.jin_sound = RES.getRes("mjin_mp3");
            _this.kai_sound = RES.getRes("mkai_mp3");
            _this.liao_sound = RES.getRes("mliao_mp3");
            _this.ma_sound = RES.getRes("mma_mp3");
            _this.peng_sound = RES.getRes("mpeng_mp3");
            _this.qi_sound = RES.getRes("mqi_mp3");
            _this.qu_sound = RES.getRes("mqu_mp3");
            _this.shang_sound = RES.getRes("mshang_mp3");
            _this.sheng_sound = RES.getRes("msheng_mp3");
            _this.xia_sound = RES.getRes("mxia_mp3");
            _this.xiao_sound = RES.getRes("mxiao_mp3");
            _this.ye_sound = RES.getRes("mye_mp3");
            _this.you3_sound = RES.getRes("myou3_mp3");
            _this.you4_sound = RES.getRes("myou4_mp3");
            _this.zhang_sound = RES.getRes("mzhang_mp3");
            _this.zhu_sound = RES.getRes("mzhu_mp3");
            _this.zuo_sound = RES.getRes("mzuo_mp3");
            _this.hanzi_sound = RES.getRes("hanzi_mp3");
            _this.bg_sound = RES.getRes("bg_mp3");
            _this.again_sound = RES.getRes("again_mp3");
            _this.dianji_sound = RES.getRes("dianji_mp3");
            _this.err_sound = RES.getRes("err_mp3");
            _this.tiaozhan_sound = RES.getRes("tiaozhan_mp3");
            _this.xiezi_sound = RES.getRes("xiezi_mp3");
            _this.laoyu_sound = RES.getRes("laoyu_mp3");
            _this.jinchang_sound = RES.getRes("jinchang_mp3");
            _this.xiaoshi_sound = RES.getRes("xiaoshi_mp3");
            _this.guanka_sound = RES.getRes("guanka_mp3");
            _this.jiaobu_sound = RES.getRes("jiaobu_mp3");
            return _this;
        }
        index.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        index.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.onceInit(); //全局唯一加载
            this.init(); //即时初始化
        };
        index.prototype.onceInit = function () {
            this.loadDR(); //初次唯一加载动画资源
            this.listen(); //初次唯一监听
            this.oneTime(); //初次唯一操作
            this.music2.play(this.bg_sound, -1);
        };
        /**
         * 多次初始化时调用
         */
        index.prototype.init = function () {
            this.successGroup.visible = false;
            this.shibaiGroup.visible = false;
        };
        //去往关卡
        index.prototype.GO_guanka = function () {
            //去往关卡前重置所有
            if (cores.getinstatic().index.guanka.guanka_now != null) {
                cores.getinstatic().index.guanka.guanka_now.duti.last != null ? cores.getinstatic().index.guanka.guanka_now.duti.last.stop() : 1 + 1 == 2;
            }
            this.guankaGroup.visible = true;
            this.guanka.welcome();
        };
        //去成功界面
        index.prototype.GO_success = function (page) {
            cores.getinstatic().index.music2.play(cores.getinstatic().index.tiaozhan_sound);
            this.successGroup.visible = true;
            this.success.init(page);
        };
        //去失败界面
        index.prototype.GO_shibai = function () {
            cores.getinstatic().index.music2.play(cores.getinstatic().index.again_sound);
            this.shibaiGroup.visible = true;
            this.shibai.init();
        };
        //点击监听
        index.prototype.touch = function (e) {
            this.music2.play(this.dianji_sound);
            switch (e.target) {
                case this.start:
                    this.startGroup.visible = false;
                    this.GO_guanka(); //去往关卡页面
                    break;
                default:
                    break;
            }
        };
        //唯一监听
        index.prototype.listen = function () {
            this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        };
        //唯一操作
        index.prototype.oneTime = function () {
            this.music2 = new music2(this.jiaobu_sound, this.cangjieen_sound, this.guanka_sound, this.yutupaopao_sound, this.laoyu_sound, this.jinchang_sound, this.xiaoshi_sound, this.jianxiao_sound, this.luoxia_sound, this.qipao_sound, this.hanzi_sound, this.bg_sound, this.again_sound, this.dianji_sound, this.err_sound, this.tiaozhan_sound, this.xiezi_sound, this.ba_sound, this.bu_sound, this.da_sound, this.feng_sound, this.ge_sound, this.guan_sound, this.jin_sound, this.kai_sound, this.liao_sound, this.liao_sound, this.ma_sound, this.peng_sound, this.qi_sound, this.qu_sound, this.shang_sound, this.sheng_sound, this.xia_sound, this.xiao_sound, this.ye_sound, this.you3_sound, this.you4_sound, this.zhang_sound, this.zhu_sound, this.zuo_sound);
            DRAGONBONES.getinstance().playAnimation("开始动画", "startanimation", "开始动画分组", this.startAnimGroup, 1);
            this.main = new yuwen.main(this.mainGroup);
            this.guanka = new z.guanka(this.guankaGroup);
            this.page1 = new z.page1(this.pageGroup1);
            this.success = new z.success(this.successGroup);
            this.shibai = new z.shibai(this.shibaiGroup);
        };
        //唯一加载动画
        index.prototype.loadDR = function () {
            //木板动画-----------
            DRAGONBONES.getinstance().addToFactory("mubandonghua_ske_json", "mubandonghua_tex_json", "mubandonghua_tex_png");
            DRAGONBONES.getinstance().initArmature("木板动画", "mubandonghua");
            //开始动画-----------
            DRAGONBONES.getinstance().addToFactory("startgame_ske_json", "startgame_tex_json", "startgame_tex_png");
            DRAGONBONES.getinstance().initArmature("开始动画", "startgame");
            //第一关背景动画-----------
            DRAGONBONES.getinstance().addToFactory("bgdonghua_ske_json", "bgdonghua_tex_json", "bgdonghua_tex_png");
            DRAGONBONES.getinstance().initArmature("关卡1背景动画", "bgdonghua");
            //第一关牌子动画-----------
            DRAGONBONES.getinstance().addToFactory("paizi_ske_json", "paizi_tex_json", "paizi_tex_png");
            //仓颉动画-----------
            DRAGONBONES.getinstance().addToFactory("cangjiBodyAnimtaion_ske_json", "cangjiBodyAnimtaion_tex_json", "cangjiBodyAnimtaion_tex_png");
            DRAGONBONES.getinstance().initArmature("仓颉正面", "cangjiBodyAnimtaion");
            DRAGONBONES.getinstance().initArmature("仓颉写字", "xiezi", null, function () {
                DRAGONBONES.getinstance().getarmature("仓颉写字").visible = false;
                DRAGONBONES.getinstance().getarmature("仓颉正面").visible = true;
                DRAGONBONES.getinstance().getarmature("仓颉正面").x = 248;
                DRAGONBONES.getinstance().getarmature("仓颉正面").y = 980;
                DRAGONBONES.getinstance().getarmature("仓颉写字").x = 248;
                DRAGONBONES.getinstance().getarmature("仓颉写字").y = 980;
                DRAGONBONES.getinstance().getarmature("仓颉正面").animation.play("zhanli", 0);
            });
        };
        return index;
    }(eui.Component));
    z.index = index;
    __reflect(index.prototype, "z.index", ["eui.UIComponent", "egret.DisplayObject"]);
})(z || (z = {}));
//# sourceMappingURL=index.js.map