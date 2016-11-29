(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./TimeSpan", "./Util"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./TimeSpan"), require("./Util"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.TimeSpan, global.Util);
        global.Date = mod.exports;
    }
})(this, function (exports, _TimeSpan, _Util) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.minValue = minValue;
    exports.maxValue = maxValue;
    exports.parse = parse;
    exports.tryParse = tryParse;
    exports.create = create;
    exports.now = now;
    exports.utcNow = utcNow;
    exports.today = today;
    exports.isLeapYear = isLeapYear;
    exports.daysInMonth = daysInMonth;
    exports.toUniversalTime = toUniversalTime;
    exports.toLocalTime = toLocalTime;
    exports.timeOfDay = timeOfDay;
    exports.date = date;
    exports.day = day;
    exports.hour = hour;
    exports.millisecond = millisecond;
    exports.minute = minute;
    exports.month = month;
    exports.second = second;
    exports.year = year;
    exports.ticks = ticks;
    exports.toBinary = toBinary;
    exports.dayOfWeek = dayOfWeek;
    exports.dayOfYear = dayOfYear;
    exports.add = add;
    exports.addDays = addDays;
    exports.addHours = addHours;
    exports.addMinutes = addMinutes;
    exports.addSeconds = addSeconds;
    exports.addMilliseconds = addMilliseconds;
    exports.addTicks = addTicks;
    exports.addYears = addYears;
    exports.addMonths = addMonths;
    exports.subtract = subtract;
    exports.toLongDateString = toLongDateString;
    exports.toShortDateString = toShortDateString;
    exports.toLongTimeString = toLongTimeString;
    exports.toShortTimeString = toShortTimeString;
    exports.equals = equals;
    exports.compare = compare;
    exports.compareTo = compareTo;
    exports.op_Addition = op_Addition;
    exports.op_Subtraction = op_Subtraction;

    function __changeKind(d, kind) {
        var d2 = void 0;
        return d.kind == kind ? d : (d2 = new Date(d.getTime()), d2.kind = kind, d2);
    }
    function __getValue(d, key) {
        return d[(d.kind == 1 /* UTC */ ? "getUTC" : "get") + key]();
    }
    function minValue() {
        return parse(-8640000000000000, 1);
    }
    function maxValue() {
        return parse(8640000000000000, 1);
    }
    function parse(v, kind) {
        var date = v == null ? new Date() : new Date(v);
        if (isNaN(date.getTime())) throw new Error("The string is not a valid Date.");
        date.kind = kind || (typeof v == "string" && v.slice(-1) == "Z" ? 1 /* UTC */ : 2 /* Local */);
        return date;
    }
    function tryParse(v) {
        try {
            return [true, parse(v)];
        } catch (_err) {
            return [false, minValue()];
        }
    }
    function create(year, month, day) /* Local */{
        var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var m = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var ms = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var kind = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 2;

        var date = kind === 1 /* UTC */ ? new Date(Date.UTC(year, month - 1, day, h, m, s, ms)) : new Date(year, month - 1, day, h, m, s, ms);
        if (isNaN(date.getTime())) throw new Error("The parameters describe an unrepresentable Date.");
        date.kind = kind;
        return date;
    }
    function now() {
        return parse();
    }
    function utcNow() {
        return parse(null, 1);
    }
    function today() {
        return date(now());
    }
    function isLeapYear(year) {
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    }
    function daysInMonth(year, month) {
        return month == 2 ? isLeapYear(year) ? 29 : 28 : month >= 8 ? month % 2 == 0 ? 31 : 30 : month % 2 == 0 ? 30 : 31;
    }
    function toUniversalTime(d) {
        return __changeKind(d, 1);
    }
    function toLocalTime(d) {
        return __changeKind(d, 2);
    }
    function timeOfDay(d) {
        return (0, _TimeSpan.create)(0, hour(d), minute(d), second(d), millisecond(d));
    }
    function date(d) {
        return create(year(d), month(d), day(d), 0, 0, 0, 0, d.kind);
    }
    function day(d) {
        return __getValue(d, "Date");
    }
    function hour(d) {
        return __getValue(d, "Hours");
    }
    function millisecond(d) {
        return __getValue(d, "Milliseconds");
    }
    function minute(d) {
        return __getValue(d, "Minutes");
    }
    function month(d) {
        return __getValue(d, "Month") + 1;
    }
    function second(d) {
        return __getValue(d, "Seconds");
    }
    function year(d) {
        return __getValue(d, "FullYear");
    }
    function ticks(d) {
        return (d.getTime() + 6.2135604e+13 /* millisecondsJSOffset */) * 10000;
    }
    function toBinary(d) {
        return ticks(d);
    }
    function dayOfWeek(d) {
        return __getValue(d, "Day");
    }
    function dayOfYear(d) {
        var _year = year(d);
        var _month = month(d);
        var _day = day(d);
        for (var i = 1; i < _month; i++) {
            _day += daysInMonth(_year, i);
        }return _day;
    }
    function add(d, ts) {
        return parse(d.getTime() + ts, d.kind);
    }
    function addDays(d, v) {
        return parse(d.getTime() + v * 86400000, d.kind);
    }
    function addHours(d, v) {
        return parse(d.getTime() + v * 3600000, d.kind);
    }
    function addMinutes(d, v) {
        return parse(d.getTime() + v * 60000, d.kind);
    }
    function addSeconds(d, v) {
        return parse(d.getTime() + v * 1000, d.kind);
    }
    function addMilliseconds(d, v) {
        return parse(d.getTime() + v, d.kind);
    }
    function addTicks(d, v) {
        return parse(d.getTime() + v / 10000, d.kind);
    }
    function addYears(d, v) {
        var newMonth = month(d);
        var newYear = year(d) + v;
        var _daysInMonth = daysInMonth(newYear, newMonth);
        var newDay = Math.min(_daysInMonth, day(d));
        return create(newYear, newMonth, newDay, hour(d), minute(d), second(d), millisecond(d), d.kind);
    }
    function addMonths(d, v) {
        var newMonth = month(d) + v;
        var newMonth_ = 0;
        var yearOffset = 0;
        if (newMonth > 12) {
            newMonth_ = newMonth % 12;
            yearOffset = Math.floor(newMonth / 12);
            newMonth = newMonth_;
        } else if (newMonth < 1) {
            newMonth_ = 12 + newMonth % 12;
            yearOffset = Math.floor(newMonth / 12) + (newMonth_ == 12 ? -1 : 0);
            newMonth = newMonth_;
        }
        var newYear = year(d) + yearOffset;
        var _daysInMonth = daysInMonth(newYear, newMonth);
        var newDay = Math.min(_daysInMonth, day(d));
        return create(newYear, newMonth, newDay, hour(d), minute(d), second(d), millisecond(d), d.kind);
    }
    function subtract(d, that) {
        return typeof that == "number" ? parse(d.getTime() - that, d.kind) : d.getTime() - that.getTime();
    }
    function toLongDateString(d) {
        return d.toDateString();
    }
    function toShortDateString(d) {
        return d.toLocaleDateString();
    }
    function toLongTimeString(d) {
        return d.toLocaleTimeString();
    }
    function toShortTimeString(d) {
        return d.toLocaleTimeString().replace(/:\d\d(?!:)/, "");
    }
    function equals(d1, d2) {
        return d1.getTime() == d2.getTime();
    }
    function compare(x, y) {
        return (0, _Util.compare)(x, y);
    }
    function compareTo(x, y) {
        return (0, _Util.compare)(x, y);
    }
    function op_Addition(x, y) {
        return add(x, y);
    }
    function op_Subtraction(x, y) {
        return subtract(x, y);
    }
});