var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 封装声音本体和声道（声道池）
 */
var M = (function () {
    function M() {
        this.sound = null;
        this.channel = null;
    }
    return M;
}());
__reflect(M.prototype, "M");
//# sourceMappingURL=M.js.map