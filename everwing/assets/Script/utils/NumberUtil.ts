export default {
    toInt: function(value, defaultValue = 0) {
        if (value === undefined) {
            return defaultValue;
        }
        if (value == Infinity) {
            return defaultValue;
        }
        let newValue = parseInt(value, 0);
        if (isNaN(newValue) === true) {
            return defaultValue;
        }
        return newValue;
    },
    toFloat: function(value, defaultValue = 0) {
        if (value == undefined) {
            return defaultValue;
        }
        if (value == Infinity) {
            return defaultValue;
        }
        let newValue = parseFloat(value);
        if (isNaN(newValue) === true) {
            return defaultValue;
        }
        return newValue;
    }
}
