var pr;
(function (pr) {
    var Point = (function () {
        function Point(x, y, id) {
            this.x = x || 0;
            this.y = y || 0;
            this.id = id;
        }
        var d = __define, c = Point, p = c.prototype;
        return Point;
    }());
    pr.Point = Point;
    egret.registerClass(Point, 'pr.Point');
    var Result = (function () {
        function Result(name, score, ms) {
            this.name = name;
            this.score = score;
            this.time = ms;
        }
        var d = __define, c = Result, p = c.prototype;
        return Result;
    }());
    pr.Result = Result;
    egret.registerClass(Result, 'pr.Result');
    var PDollarRecognizer = (function () {
        function PDollarRecognizer() {
            this.Origin = new Point(0, 0, 0);
            this.NumPoints = 32;
            this.PointClouds = [];
        }
        var d = __define, c = PDollarRecognizer, p = c.prototype;
        PDollarRecognizer.create = function () {
            return new PDollarRecognizer();
        };
        p.PointCloud = function (name, points) {
            var data = {};
            data.Name = name;
            data.Points = this.Resample(points, this.NumPoints);
            data.Points = this.Scale(data.Points);
            data.Points = this.TranslateTo(data.Points, this.Origin);
            return data;
        };
        p.recognize = function (points) {
            var t0 = Date.now();
            points = this.Resample(points, this.NumPoints);
            points = this.Scale(points);
            points = this.TranslateTo(points, this.Origin);
            var b = +Infinity;
            var u = -1;
            for (var i = 0; i < this.PointClouds.length; i++) {
                var d = this.GreedyCloudMatch(points, this.PointClouds[i]);
                if (d < b) {
                    b = d; // best (least) distance
                    u = i; // point-cloud index
                }
            }
            var t1 = Date.now();
            return (u == -1) ? new Result("No match.", 0.0, t1 - t0) : new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0), t1 - t0);
        };
        p.addGesture = function (name, points) {
            this.PointClouds[this.PointClouds.length] = this.PointCloud(name, points);
            var num = 0;
            for (var i = 0; i < this.PointClouds.length; i++) {
                if (this.PointClouds[i].Name == name)
                    num++;
            }
            return num;
        };
        p.deleteAllGestures = function () {
            this.PointClouds.length = 0;
        };
        /**
         * 通过name获取Gesture信息
         * @param name 如果不传值，则返回所有的信息
         * @returns {any}
         */
        p.getGesture = function (name) {
            var result = [];
            if (name) {
                var num = this.PointClouds.length;
                for (var i = 0; i < num; i++) {
                    if (this.PointClouds[i].Name == name)
                        result.push(this.PointClouds[i]);
                }
            }
            else {
                return this.PointClouds;
            }
            return result;
        };
        //=========================================================
        p.GreedyCloudMatch = function (points, P) {
            var e = 0.50;
            var step = Math.floor(Math.pow(points.length, 1.0 - e));
            var min = +Infinity;
            for (var i = 0; i < points.length; i += step) {
                var d1 = this.CloudDistance(points, P.Points, i);
                var d2 = this.CloudDistance(P.Points, points, i);
                min = Math.min(min, Math.min(d1, d2)); // min3
            }
            return min;
        };
        p.CloudDistance = function (pts1, pts2, start) {
            var matched = new Array(pts1.length); // pts1.length == pts2.length
            for (var k = 0; k < pts1.length; k++)
                matched[k] = false;
            var sum = 0;
            var i = start;
            do {
                var index = -1;
                var min = +Infinity;
                for (var j = 0; j < matched.length; j++) {
                    if (!matched[j]) {
                        var d = this.Distance(pts1[i], pts2[j]);
                        if (d < min) {
                            min = d;
                            index = j;
                        }
                    }
                }
                matched[index] = true;
                var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
                sum += weight * min;
                i = (i + 1) % pts1.length;
            } while (i != start);
            return sum;
        };
        p.Resample = function (points, n) {
            var I = this.PathLength(points) / (n - 1); // interval length
            var D = 0.0;
            var newpoints = new Array(points[0]);
            for (var i = 1; i < points.length; i++) {
                if (points[i].id == points[i - 1].id) {
                    var d = this.Distance(points[i - 1], points[i]);
                    if ((D + d) >= I) {
                        var qx = points[i - 1].x + ((I - D) / d) * (points[i].x - points[i - 1].x);
                        var qy = points[i - 1].y + ((I - D) / d) * (points[i].y - points[i - 1].y);
                        var q = new Point(qx, qy, points[i].id);
                        newpoints[newpoints.length] = q; // append new point 'q'
                        points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
                        D = 0.0;
                    }
                    else
                        D += d;
                }
            }
            if (newpoints.length == n - 1)
                newpoints[newpoints.length] = new Point(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].id);
            return newpoints;
        };
        p.Scale = function (points) {
            var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
            for (var i = 0; i < points.length; i++) {
                minX = Math.min(minX, points[i].x);
                minY = Math.min(minY, points[i].y);
                maxX = Math.max(maxX, points[i].x);
                maxY = Math.max(maxY, points[i].y);
            }
            var size = Math.max(maxX - minX, maxY - minY);
            var newpoints = new Array();
            for (var i = 0; i < points.length; i++) {
                var qx = (points[i].x - minX) / size;
                var qy = (points[i].y - minY) / size;
                newpoints[newpoints.length] = new Point(qx, qy, points[i].id);
            }
            return newpoints;
        };
        p.TranslateTo = function (points, pt) {
            var c = this.Centroid(points);
            var newpoints = [];
            for (var i = 0; i < points.length; i++) {
                var qx = points[i].x + pt.x - c.x;
                var qy = points[i].y + pt.y - c.y;
                newpoints[newpoints.length] = new Point(qx, qy, points[i].id);
            }
            return newpoints;
        };
        p.Centroid = function (points) {
            var x = 0.0, y = 0.0;
            for (var i = 0; i < points.length; i++) {
                x += points[i].x;
                y += points[i].y;
            }
            x /= points.length;
            y /= points.length;
            return new Point(x, y, 0);
        };
        p.PathLength = function (points) {
            var d = 0.0;
            for (var i = 1; i < points.length; i++) {
                if (points[i].id == points[i - 1].id)
                    d += this.Distance(points[i - 1], points[i]);
            }
            return d;
        };
        p.Distance = function (p1, p2) {
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            return parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(2));
        };
        return PDollarRecognizer;
    }());
    pr.PDollarRecognizer = PDollarRecognizer;
    egret.registerClass(PDollarRecognizer, 'pr.NDollarRecognizer');
})(pr || (pr = {}));
