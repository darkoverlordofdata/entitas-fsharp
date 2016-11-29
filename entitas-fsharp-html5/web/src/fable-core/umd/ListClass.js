(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Symbol", "./Util"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Symbol"), require("./Util"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Symbol, global.Util);
        global.ListClass = mod.exports;
    }
})(this, function (exports, _Symbol, _Util) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ofArray = ofArray;

    var _Symbol2 = _interopRequireDefault(_Symbol);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    // This module is split from List.ts to prevent cyclic dependencies
    function ofArray(args, base) {
        var acc = base || new List();
        for (var i = args.length - 1; i >= 0; i--) {
            acc = new List(args[i], acc);
        }
        return acc;
    }

    var List = function () {
        function List(head, tail) {
            _classCallCheck(this, List);

            this.head = head;
            this.tail = tail;
        }

        _createClass(List, [{
            key: "ToString",
            value: function ToString() {
                return "[" + Array.from(this).map(_Util.toString).join("; ") + "]";
            }
        }, {
            key: "Equals",
            value: function Equals(x) {
                // Optimization if they are referencially equal
                if (this === x) {
                    return true;
                } else {
                    var iter1 = this[Symbol.iterator](),
                        iter2 = x[Symbol.iterator]();
                    for (;;) {
                        var cur1 = iter1.next(),
                            cur2 = iter2.next();
                        if (cur1.done) return cur2.done ? true : false;else if (cur2.done) return false;else if (!(0, _Util.equals)(cur1.value, cur2.value)) return false;
                    }
                }
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(x) {
                // Optimization if they are referencially equal
                if (this === x) {
                    return 0;
                } else {
                    var acc = 0;
                    var iter1 = this[Symbol.iterator](),
                        iter2 = x[Symbol.iterator]();
                    for (;;) {
                        var cur1 = iter1.next(),
                            cur2 = iter2.next();
                        if (cur1.done) return cur2.done ? acc : -1;else if (cur2.done) return 1;else {
                            acc = (0, _Util.compare)(cur1.value, cur2.value);
                            if (acc != 0) return acc;
                        }
                    }
                }
            }
        }, {
            key: Symbol.iterator,
            value: function value() {
                var cur = this;
                return {
                    next: function next() {
                        var tmp = cur;
                        cur = cur.tail;
                        return { done: tmp.tail == null, value: tmp.head };
                    }
                };
            }
        }, {
            key: _Symbol2.default.reflection,
            value: function value() {
                return {
                    type: "Microsoft.FSharp.Collections.FSharpList",
                    interfaces: ["System.IEquatable", "System.IComparable"]
                };
            }
        }, {
            key: "length",
            get: function get() {
                var cur = this,
                    acc = 0;
                while (cur.tail != null) {
                    cur = cur.tail;
                    acc++;
                }
                return acc;
            }
        }]);

        return List;
    }();

    exports.default = List;
});