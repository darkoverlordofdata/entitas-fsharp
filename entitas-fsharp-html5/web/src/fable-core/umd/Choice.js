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
        global.Choice = mod.exports;
    }
})(this, function (exports, _Symbol, _Util) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.choice1Of2 = choice1Of2;
    exports.choice2Of2 = choice2Of2;

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

    function choice1Of2(v) {
        return new Choice("Choice1Of2", [v]);
    }
    function choice2Of2(v) {
        return new Choice("Choice2Of2", [v]);
    }

    var Choice = function () {
        function Choice(t, d) {
            _classCallCheck(this, Choice);

            this.Case = t;
            this.Fields = d;
        }

        _createClass(Choice, [{
            key: "Equals",
            value: function Equals(other) {
                return (0, _Util.equalsUnions)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(other) {
                return (0, _Util.compareUnions)(this, other);
            }
        }, {
            key: _Symbol2.default.reflection,
            value: function value() {
                return {
                    type: "Microsoft.FSharp.Core.FSharpChoice",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"]
                };
            }
        }, {
            key: "valueIfChoice1",
            get: function get() {
                return this.Case === "Choice1Of2" ? this.Fields[0] : null;
            }
        }, {
            key: "valueIfChoice2",
            get: function get() {
                return this.Case === "Choice2Of2" ? this.Fields[0] : null;
            }
        }]);

        return Choice;
    }();

    exports.default = Choice;
});