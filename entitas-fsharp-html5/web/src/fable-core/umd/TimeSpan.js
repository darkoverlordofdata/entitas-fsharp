(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Util"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Util"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Util);
        global.TimeSpan = mod.exports;
    }
})(this, function (exports, _Util) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.create = create;
    exports.fromTicks = fromTicks;
    exports.fromDays = fromDays;
    exports.fromHours = fromHours;
    exports.fromMinutes = fromMinutes;
    exports.fromSeconds = fromSeconds;
    exports.days = days;
    exports.hours = hours;
    exports.minutes = minutes;
    exports.seconds = seconds;
    exports.milliseconds = milliseconds;
    exports.ticks = ticks;
    exports.totalDays = totalDays;
    exports.totalHours = totalHours;
    exports.totalMinutes = totalMinutes;
    exports.totalSeconds = totalSeconds;
    exports.negate = negate;
    exports.add = add;
    exports.subtract = subtract;
    exports.compare = compare;
    exports.compareTo = compareTo;
    exports.duration = duration;
    function create() {
        var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var ms = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        switch (arguments.length) {
            case 1:
                // ticks
                return fromTicks(arguments[0]);
            case 3:
                // h,m,s
                d = 0, h = arguments[0], m = arguments[1], s = arguments[2], ms = 0;
                break;
            default:
                // d,h,m,s,ms
                d = arguments[0], h = arguments[1], m = arguments[2], s = arguments[3], ms = arguments[4] || 0;
                break;
        }
        return d * 86400000 + h * 3600000 + m * 60000 + s * 1000 + ms;
    }
    function fromTicks(ticks) {
        return ticks / 10000;
    }
    function fromDays(d) {
        return create(d, 0, 0, 0);
    }
    function fromHours(h) {
        return create(h, 0, 0);
    }
    function fromMinutes(m) {
        return create(0, m, 0);
    }
    function fromSeconds(s) {
        return create(0, 0, s);
    }
    function days(ts) {
        return Math.floor(ts / 86400000);
    }
    function hours(ts) {
        return Math.floor(ts % 86400000 / 3600000);
    }
    function minutes(ts) {
        return Math.floor(ts % 3600000 / 60000);
    }
    function seconds(ts) {
        return Math.floor(ts % 60000 / 1000);
    }
    function milliseconds(ts) {
        return Math.floor(ts % 1000);
    }
    function ticks(ts) {
        return ts * 10000;
    }
    function totalDays(ts) {
        return ts / 86400000;
    }
    function totalHours(ts) {
        return ts / 3600000;
    }
    function totalMinutes(ts) {
        return ts / 60000;
    }
    function totalSeconds(ts) {
        return ts / 1000;
    }
    function negate(ts) {
        return ts * -1;
    }
    function add(ts1, ts2) {
        return ts1 + ts2;
    }
    function subtract(ts1, ts2) {
        return ts1 - ts2;
    }
    function compare(x, y) {
        return (0, _Util.compare)(x, y);
    }
    function compareTo(x, y) {
        return (0, _Util.compare)(x, y);
    }
    function duration(x) {
        return Math.abs(x);
    }
});