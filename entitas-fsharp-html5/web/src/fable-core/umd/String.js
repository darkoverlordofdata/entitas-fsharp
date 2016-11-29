(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Util", "./RegExp", "./Date"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Util"), require("./RegExp"), require("./Date"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Util, global.RegExp, global.Date);
        global.String = mod.exports;
    }
})(this, function (exports, _Util, _RegExp, _Date) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.fsFormat = fsFormat;
    exports.format = format;
    exports.endsWith = endsWith;
    exports.initialize = initialize;
    exports.insert = insert;
    exports.isNullOrEmpty = isNullOrEmpty;
    exports.isNullOrWhiteSpace = isNullOrWhiteSpace;
    exports.join = join;
    exports.newGuid = newGuid;
    exports.padLeft = padLeft;
    exports.padRight = padRight;
    exports.remove = remove;
    exports.replace = replace;
    exports.replicate = replicate;
    exports.split = split;
    exports.trim = trim;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var fsFormatRegExp = /(^|[^%])%([0+ ]*)(-?\d+)?(?:\.(\d+))?(\w)/;
    var formatRegExp = /\{(\d+)(,-?\d+)?(?:\:(.+?))?\}/g;
    function fsFormat(str) {
        var _cont = void 0;
        function isObject(x) {
            return x !== null && (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" && !(x instanceof Number) && !(x instanceof String) && !(x instanceof Boolean);
        }
        function formatOnce(str, rep) {
            return str.replace(fsFormatRegExp, function (_, prefix, flags, pad, precision, format) {
                switch (format) {
                    case "f":
                    case "F":
                        rep = rep.toFixed(precision || 6);
                        break;
                    case "g":
                    case "G":
                        rep = rep.toPrecision(precision);
                        break;
                    case "e":
                    case "E":
                        rep = rep.toExponential(precision);
                        break;
                    case "O":
                        rep = (0, _Util.toString)(rep);
                        break;
                    case "A":
                        try {
                            rep = JSON.stringify(rep, function (k, v) {
                                return v && v[Symbol.iterator] && !Array.isArray(v) && isObject(v) ? Array.from(v) : v;
                            });
                        } catch (err) {
                            // Fallback for objects with circular references
                            rep = "{" + Object.getOwnPropertyNames(rep).map(function (k) {
                                return k + ": " + String(rep[k]);
                            }).join(", ") + "}";
                        }
                        break;
                }
                var plusPrefix = flags.indexOf("+") >= 0 && parseInt(rep) >= 0;
                if (!isNaN(pad = parseInt(pad))) {
                    var ch = pad >= 0 && flags.indexOf("0") >= 0 ? "0" : " ";
                    rep = padLeft(rep, Math.abs(pad) - (plusPrefix ? 1 : 0), ch, pad < 0);
                }
                var once = prefix + (plusPrefix ? "+" + rep : rep);
                return once.replace(/%/g, "%%");
            });
        }
        function makeFn(str) {
            return function (rep) {
                var str2 = formatOnce(str, rep);
                return fsFormatRegExp.test(str2) ? makeFn(str2) : _cont(str2.replace(/%%/g, "%"));
            };
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (args.length === 0) {
            return function (cont) {
                _cont = cont;
                return fsFormatRegExp.test(str) ? makeFn(str) : _cont(str);
            };
        } else {
            for (var i = 0; i < args.length; i++) {
                str = formatOnce(str, args[i]);
            }
            return str.replace(/%%/g, "%");
        }
    }
    function format(str) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        return str.replace(formatRegExp, function (match, idx, pad, format) {
            var rep = args[idx],
                padSymbol = " ";
            if (typeof rep === "number") {
                switch ((format || "").substring(0, 1)) {
                    case "f":
                    case "F":
                        rep = format.length > 1 ? rep.toFixed(format.substring(1)) : rep.toFixed(2);
                        break;
                    case "g":
                    case "G":
                        rep = format.length > 1 ? rep.toPrecision(format.substring(1)) : rep.toPrecision();
                        break;
                    case "e":
                    case "E":
                        rep = format.length > 1 ? rep.toExponential(format.substring(1)) : rep.toExponential();
                        break;
                    case "p":
                    case "P":
                        rep = (format.length > 1 ? (rep * 100).toFixed(format.substring(1)) : (rep * 100).toFixed(2)) + " %";
                        break;
                    default:
                        var m = /^(0+)(\.0+)?$/.exec(format);
                        if (m != null) {
                            var decs = 0;
                            if (m[2] != null) rep = rep.toFixed(decs = m[2].length - 1);
                            pad = "," + (m[1].length + (decs ? decs + 1 : 0)).toString();
                            padSymbol = "0";
                        } else if (format) {
                            rep = format;
                        }
                }
            } else if (rep instanceof Date) {
                if (format.length === 1) {
                    switch (format) {
                        case "D":
                            rep = rep.toDateString();
                            break;
                        case "T":
                            rep = rep.toLocaleTimeString();
                            break;
                        case "d":
                            rep = rep.toLocaleDateString();
                            break;
                        case "t":
                            rep = rep.toLocaleTimeString().replace(/:\d\d(?!:)/, "");
                            break;
                        case "o":
                        case "O":
                            if (rep.kind === 2 /* Local */) {
                                    var offset = rep.getTimezoneOffset() * -1;
                                    rep = format("{0:yyyy-MM-dd}T{0:HH:mm}:{1:00.000}{2}{3:00}:{4:00}", rep, (0, _Date.second)(rep), offset >= 0 ? "+" : "-", ~~(offset / 60), offset % 60);
                                } else {
                                rep = rep.toISOString();
                            }
                    }
                } else {
                    rep = format.replace(/\w+/g, function (match2) {
                        var rep2 = match2;
                        switch (match2.substring(0, 1)) {
                            case "y":
                                rep2 = match2.length < 4 ? (0, _Date.year)(rep) % 100 : (0, _Date.year)(rep);
                                break;
                            case "h":
                                rep2 = rep.getHours() > 12 ? (0, _Date.hour)(rep) % 12 : (0, _Date.hour)(rep);
                                break;
                            case "M":
                                rep2 = (0, _Date.month)(rep);
                                break;
                            case "d":
                                rep2 = (0, _Date.day)(rep);
                                break;
                            case "H":
                                rep2 = (0, _Date.hour)(rep);
                                break;
                            case "m":
                                rep2 = (0, _Date.minute)(rep);
                                break;
                            case "s":
                                rep2 = (0, _Date.second)(rep);
                                break;
                        }
                        if (rep2 !== match2 && rep2 < 10 && match2.length > 1) {
                            rep2 = "0" + rep2;
                        }
                        return rep2;
                    });
                }
            }
            if (!isNaN(pad = parseInt((pad || "").substring(1)))) {
                rep = padLeft(rep, Math.abs(pad), padSymbol, pad < 0);
            }
            return rep;
        });
    }
    function endsWith(str, search) {
        var idx = str.lastIndexOf(search);
        return idx >= 0 && idx == str.length - search.length;
    }
    function initialize(n, f) {
        if (n < 0) throw new Error("String length must be non-negative");
        var xs = new Array(n);
        for (var i = 0; i < n; i++) {
            xs[i] = f(i);
        }return xs.join("");
    }
    function insert(str, startIndex, value) {
        if (startIndex < 0 || startIndex > str.length) {
            throw new Error("startIndex is negative or greater than the length of this instance.");
        }
        return str.substring(0, startIndex) + value + str.substring(startIndex);
    }
    function isNullOrEmpty(str) {
        return typeof str !== "string" || str.length == 0;
    }
    function isNullOrWhiteSpace(str) {
        return typeof str !== "string" || /^\s*$/.test(str);
    }
    function join(delimiter, xs) {
        xs = typeof xs == "string" ? (0, _Util.getRestParams)(arguments, 1) : xs;
        return (Array.isArray(xs) ? xs : Array.from(xs)).join(delimiter);
    }
    function newGuid() {
        var uuid = "";
        for (var i = 0; i < 32; i++) {
            var random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
            uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
        }
        return uuid;
    }
    function padLeft(str, len, ch, isRight) {
        ch = ch || " ";
        str = String(str);
        len = len - str.length;
        for (var i = -1; ++i < len;) {
            str = isRight ? str + ch : ch + str;
        }return str;
    }
    function padRight(str, len, ch) {
        return padLeft(str, len, ch, true);
    }
    function remove(str, startIndex, count) {
        if (startIndex >= str.length) {
            throw new Error("startIndex must be less than length of string");
        }
        if (typeof count === "number" && startIndex + count > str.length) {
            throw new Error("Index and count must refer to a location within the string.");
        }
        return str.slice(0, startIndex) + (typeof count === "number" ? str.substr(startIndex + count) : "");
    }
    function replace(str, search, replace) {
        return str.replace(new RegExp((0, _RegExp.escape)(search), "g"), replace);
    }
    function replicate(n, x) {
        return initialize(n, function () {
            return x;
        });
    }
    function split(str, splitters, count, removeEmpty) {
        count = typeof count == "number" ? count : null;
        removeEmpty = typeof removeEmpty == "number" ? removeEmpty : null;
        if (count < 0) throw new Error("Count cannot be less than zero");
        if (count === 0) return [];
        splitters = Array.isArray(splitters) ? splitters : (0, _Util.getRestParams)(arguments, 1);
        splitters = splitters.map(function (x) {
            return (0, _RegExp.escape)(x);
        });
        splitters = splitters.length > 0 ? splitters : [" "];
        var m = void 0;
        var i = 0;
        var splits = [];
        var reg = new RegExp(splitters.join("|"), "g");
        while ((count == null || count > 1) && (m = reg.exec(str)) !== null) {
            if (!removeEmpty || m.index - i > 0) {
                count = count != null ? count - 1 : count;
                splits.push(str.substring(i, m.index));
            }
            i = reg.lastIndex;
        }
        if (!removeEmpty || str.length - i > 0) splits.push(str.substring(i));
        return splits;
    }
    function trim(str, side) {
        for (var _len3 = arguments.length, chars = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            chars[_key3 - 2] = arguments[_key3];
        }

        if (side == "both" && chars.length == 0) return str.trim();
        if (side == "start" || side == "both") {
            var reg = chars.length == 0 ? /^\s+/ : new RegExp("^[" + (0, _RegExp.escape)(chars.join("")) + "]+");
            str = str.replace(reg, "");
        }
        if (side == "end" || side == "both") {
            var _reg = chars.length == 0 ? /\s+$/ : new RegExp("[" + (0, _RegExp.escape)(chars.join("")) + "]+$");
            str = str.replace(_reg, "");
        }
        return str;
    }
});