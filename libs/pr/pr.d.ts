declare module pr {
    class Point {
        x: number;
        y: number;
        id: number;
        constructor(x?: any, y?: any, id?: any);
    }
    class Result {
        /**
         * 如果匹配到则为识别名字，否则返回'No match'
         */
        name: any;
        /**
         * 匹配度
         */
        score: any;
        constructor(name: any, score: any);
    }
    /**
     * Create by richliu1023
     * @date 2016-08-24
     * @email richliu1023@gmail.com
     * @github https://github.com/RichLiu1023
     * @description
     * @url：http://depts.washington.edu/aimgroup/proj/dollar/index.html
     * 手写单笔识别
     */
    class PDollarRecognizer {
        Origin: Point;
        NumPoints: number;
        private PointClouds;
        constructor();
        static create(): PDollarRecognizer;
        /**
         * 识别
         * @param points
         * @param useProtractor true:用量角器（快）.false:黄金分割搜索
         * @returns {Result}
         * @constructor
         */
        private PointCloud(name, points);
        recognize(points: Array<any>): Result;
        addGesture(name: string, points: Array<any>): void;
        deleteAllGestures(): void;
        /**
         * 通过name获取Gesture信息
         * @param name 如果不传值，则返回所有的信息
         * @returns {any}
         */
        getGesture(name?: string): Array<{
            Name: string;
            Points: Array<any>;
        }>;
        private Resample(points, n);
        private Scale(points);
        private TranslateTo(points, pt);
        private Centroid(points);
        private PathLength(points);
        private Distance(p1, p2);
    }
}
