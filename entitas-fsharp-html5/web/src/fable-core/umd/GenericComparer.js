(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Util", "./Symbol"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Util"), require("./Symbol"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Util, global.Symbol);
        global.GenericComparer = mod.exports;
    }
})(this, function (exports, _Util, _Symbol) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    var GenericComparer = function () {
        function GenericComparer(f) {
            _classCallCheck(this, GenericComparer);

            this.Compare = f || _Util.compare;
        }

        _createClass(GenericComparer, [{
            key: _Symbol2.default.reflection,
            value: function value() {
                return { interfaces: ["System.IComparer"] };
            }
        }]);

        return GenericComparer;
    }();

    exports.default = GenericComparer;
});