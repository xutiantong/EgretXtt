var Utils;
(function (Utils) {
    function makeArrayRandom(arr) {
        for (var i = 0; i < arr.length; ++i) {
            var j = (arr.length * Math.random()) | 0;
            if (i != j)
                _a = [arr[j], arr[i]], arr[i] = _a[0], arr[j] = _a[1];
        }
        var _a;
    }
    Utils.makeArrayRandom = makeArrayRandom;
})(Utils || (Utils = {}));
//# sourceMappingURL=Utils.js.map