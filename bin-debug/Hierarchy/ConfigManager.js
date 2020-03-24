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
            var musicArr = ["bg", "change", "dianji", "introduction1", "right", "rightTips", "show", "success", "tips1", "tips2", "wrong", "wrongTips", "wrongTips2", "bird", "book"];
            MUSIC4.get().init(musicArr);
            //2.注册层级
            this.addChildAt(Hierarchy.AbManager.get(), 0);
            this.addChildAt(Hierarchy.MenuManager.get(), 1);
            this.addChildAt(Hierarchy.MessageManager.get(), 2);
            this.addChildAt(new XDFLogoComponent(), 4);
            //3.注册组件
            Hierarchy.AbManager.get().init([
                { name: "Start", obj: new Assembly.Start() },
                { name: "Select", obj: new Assembly.Select() },
                { name: "Select2", obj: new Assembly.Select2() },
                { name: "Scene1", obj: new Assembly.Scene1() },
                { name: "CardScene", obj: new Assembly.CardScene() },
                { name: "End", obj: new Assembly.End() },
                { name: "ErrBook", obj: new Assembly.ErrBook() },
                { name: "Word", obj: new Assembly.Word() },
                { name: "MazeBg", obj: new Assembly.MazeBg() }
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
//# sourceMappingURL=ConfigManager.js.map