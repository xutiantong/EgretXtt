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
var Hierarchy;
(function (Hierarchy) {
    /**
     * 配置管理器
     */
    var ConfigManager = (function (_super) {
        __extends(ConfigManager, _super);
        function ConfigManager() {
            return _super.call(this) || this;
        }
        ConfigManager.prototype.childrenCreated = function () {
            this.config();
        };
        //配置
        ConfigManager.prototype.config = function () {
            //1.注册声音
            var musicArr = ["bg", "dianji", "err", "introduction1", "introduction2", "correct", "wrong", "finish"];
            MUSIC4.get().init(musicArr);
            //2.注册层级
            this.addChildAt(Hierarchy.BottomManager.get(), 0);
            this.addChildAt(Hierarchy.AbManager.get(), 1);
            this.addChildAt(Hierarchy.MenuManager.get(), 2);
            this.addChildAt(Hierarchy.MessageManager.get(), 3);
            this.addChildAt(Hierarchy.GuideManager.get(), 4);
            this.addChildAt(new XDFLogoComponent(), 5);
            //3.注册组件
            Hierarchy.AbManager.get().init([
                { name: "Start", obj: new Assembly.Start() },
                { name: "Scene1", obj: new Assembly.Scene1() },
                { name: "End", obj: new Assembly.End() },
                { name: "CuoTiBen", obj: new Assembly.CuoTiBen() }
            ]);
            //4.注册消息提示
            Hierarchy.MessageManager.get().init([
                { name: "Introduction", obj: new Assembly.Introduction() }
            ]);
            //5.初始化全局变量
            Manager.GlobalManager.get();
            //6.默认起始组件
            Hierarchy.AbManager.get().show("Start");
            MUSIC4.get().play("bg", -1);
        };
        //单例
        ConfigManager.get = function () {
            if (this.D == null) {
                this.D = new ConfigManager();
            }
            return this.D;
        };
        ConfigManager.D = null;
        return ConfigManager;
    }(eui.Component));
    Hierarchy.ConfigManager = ConfigManager;
    __reflect(ConfigManager.prototype, "Hierarchy.ConfigManager", ["eui.UIComponent", "egret.DisplayObject"]);
})(Hierarchy || (Hierarchy = {}));
