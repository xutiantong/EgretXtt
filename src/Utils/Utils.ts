namespace Utils {
    export function makeArrayRandom(arr: any[]) {
        for (let i = 0; i < arr.length; ++i) {
            let j = (arr.length * Math.random()) | 0;
            if (i != j)
                [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}