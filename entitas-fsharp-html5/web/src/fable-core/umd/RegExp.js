(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.RegExp = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.create = create;
    exports.escape = escape;
    exports.unescape = unescape;
    exports.isMatch = isMatch;
    exports.match = match;
    exports.matches = matches;
    exports.options = options;
    exports.replace = replace;
    exports.split = split;
    function create(pattern, options) {
        var flags = "g";
        flags += options & 1 ? "i" : "";
        flags += options & 2 ? "m" : "";
        return new RegExp(pattern, flags);
    }
    // From http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    function escape(str) {
        return str.replace(/[\-\[\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    function unescape(str) {
        return str.replace(/\\([\-\[\/\{\}\(\)\*\+\?\.\\\^\$\|])/g, "$1");
    }
    function isMatch(str, pattern) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var reg = str instanceof RegExp ? (reg = str, str = pattern, reg.lastIndex = options, reg) : reg = create(pattern, options);
        return reg.test(str);
    }
    function match(str, pattern) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var reg = str instanceof RegExp ? (reg = str, str = pattern, reg.lastIndex = options, reg) : reg = create(pattern, options);
        return reg.exec(str);
    }
    function matches(str, pattern) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var reg = str instanceof RegExp ? (reg = str, str = pattern, reg.lastIndex = options, reg) : reg = create(pattern, options);
        if (!reg.global) throw new Error("Non-global RegExp"); // Prevent infinite loop
        var m = void 0;
        var matches = [];
        while ((m = reg.exec(str)) !== null) {
            matches.push(m);
        }return matches;
    }
    function options(reg) {
        var options = 256; // ECMAScript
        options |= reg.ignoreCase ? 1 : 0;
        options |= reg.multiline ? 2 : 0;
        return options;
    }
    function replace(reg, input, replacement, limit) {
        var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        function replacer() {
            var res = arguments[0];
            if (limit !== 0) {
                limit--;
                var _match = [];
                var len = arguments.length;
                for (var i = 0; i < len - 2; i++) {
                    _match.push(arguments[i]);
                }_match.index = arguments[len - 2];
                _match.input = arguments[len - 1];
                res = replacement(_match);
            }
            return res;
        }
        if (typeof reg == "string") {
            var tmp = reg;
            reg = create(input, limit);
            input = tmp;
            limit = undefined;
        }
        if (typeof replacement == "function") {
            limit = limit == null ? -1 : limit;
            return input.substring(0, offset) + input.substring(offset).replace(reg, replacer);
        } else {
            if (limit != null) {
                var m = void 0;
                var sub1 = input.substring(offset);
                var _matches = matches(reg, sub1);
                var sub2 = matches.length > limit ? (m = _matches[limit - 1], sub1.substring(0, m.index + m[0].length)) : sub1;
                return input.substring(0, offset) + sub2.replace(reg, replacement) + input.substring(offset + sub2.length);
            } else {
                return input.replace(reg, replacement);
            }
        }
    }
    function split(reg, input, limit) {
        var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        if (typeof reg == "string") {
            var tmp = reg;
            reg = create(input, limit);
            input = tmp;
            limit = undefined;
        }
        input = input.substring(offset);
        return input.split(reg, limit);
    }
});