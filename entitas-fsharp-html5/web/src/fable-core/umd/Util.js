(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Symbol"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Symbol"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Symbol);
        global.Util = mod.exports;
    }
})(this, function (exports, _Symbol) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Array = exports.Unit = exports.Any = exports.NonDeclaredType = undefined;
    exports.Option = Option;
    exports.Tuple = Tuple;
    exports.GenericParam = GenericParam;
    exports.Interface = Interface;
    exports.declare = declare;
    exports.makeGeneric = makeGeneric;
    exports.isGeneric = isGeneric;
    exports.getDefinition = getDefinition;
    exports.extendInfo = extendInfo;
    exports.hasInterface = hasInterface;
    exports.isArray = isArray;
    exports.getRestParams = getRestParams;
    exports.toString = toString;
    exports.hash = hash;
    exports.equals = equals;
    exports.compare = compare;
    exports.equalsRecords = equalsRecords;
    exports.compareRecords = compareRecords;
    exports.equalsUnions = equalsUnions;
    exports.compareUnions = compareUnions;
    exports.createDisposable = createDisposable;
    exports.createObj = createObj;
    exports.toPlainJsObj = toPlainJsObj;
    exports.round = round;

    var _Symbol2 = _interopRequireDefault(_Symbol);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
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

    var NonDeclaredType = exports.NonDeclaredType = function () {
        function NonDeclaredType(kind, name, generics) {
            _classCallCheck(this, NonDeclaredType);

            this.kind = kind;
            this.name = name;
            this.generics = generics || [];
        }

        _createClass(NonDeclaredType, [{
            key: "Equals",
            value: function Equals(other) {
                return this.kind === other.kind && this.name === other.name && equals(this.generics, other.generics);
            }
        }]);

        return NonDeclaredType;
    }();

    var GenericNonDeclaredType = function (_NonDeclaredType) {
        _inherits(GenericNonDeclaredType, _NonDeclaredType);

        function GenericNonDeclaredType(kind, generics) {
            _classCallCheck(this, GenericNonDeclaredType);

            return _possibleConstructorReturn(this, (GenericNonDeclaredType.__proto__ || Object.getPrototypeOf(GenericNonDeclaredType)).call(this, kind, null, generics));
        }

        _createClass(GenericNonDeclaredType, [{
            key: _Symbol2.default.generics,
            value: function value() {
                return this.generics;
            }
        }]);

        return GenericNonDeclaredType;
    }(NonDeclaredType);

    var Any = exports.Any = new NonDeclaredType("Any");
    var Unit = exports.Unit = new NonDeclaredType("Unit");
    function Option(t) {
        return new GenericNonDeclaredType("Option", [t]);
    }
    function FArray(t) {
        return new GenericNonDeclaredType("Array", [t]);
    }
    exports.Array = FArray;
    function Tuple(ts) {
        return new GenericNonDeclaredType("Tuple", ts);
    }
    function GenericParam(name) {
        return new NonDeclaredType("GenericParam", name);
    }
    function Interface(name) {
        return new NonDeclaredType("Interface", name);
    }
    function declare(cons) {
        var info = cons.prototype[_Symbol2.default.reflection];
        if (typeof info === "function") {
            var type = info().type;
            if (typeof type === "string") _Symbol.fableGlobal.types.set(type, cons);
        }
    }
    function makeGeneric(typeDef, genArgs) {
        return function (_typeDef) {
            _inherits(_class, _typeDef);

            function _class() {
                _classCallCheck(this, _class);

                return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
            }

            _createClass(_class, [{
                key: _Symbol2.default.generics,
                value: function value() {
                    return genArgs;
                }
            }]);

            return _class;
        }(typeDef);
    }
    /**
     * Checks if this a function constructor extending another with generic info.
     */
    function isGeneric(typ) {
        return typeof typ === "function" && !!typ.prototype[_Symbol2.default.generics];
    }
    /**
     * Returns the parent if this is a declared generic type or the argument otherwise.
     * Attention: Unlike .NET this doesn't throw an exception if type is not generic.
    */
    function getDefinition(typ) {
        return typeof typ === "function" && typ.prototype[_Symbol2.default.generics] ? Object.getPrototypeOf(typ.prototype).constructor : typ;
    }
    function extendInfo(cons, info) {
        var parent = Object.getPrototypeOf(cons.prototype);
        if (typeof parent[_Symbol2.default.reflection] === "function") {
            var _ret = function () {
                var newInfo = {},
                    parentInfo = parent[_Symbol2.default.reflection]();
                Object.getOwnPropertyNames(info).forEach(function (k) {
                    var i = info[k];
                    if ((typeof i === "undefined" ? "undefined" : _typeof(i)) === "object") {
                        newInfo[k] = Array.isArray(i) ? (parentInfo[k] || []).concat(i) : Object.assign(parentInfo[k] || {}, i);
                    } else {
                        newInfo[k] = i;
                    }
                });
                return {
                    v: newInfo
                };
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
        return info;
    }
    function hasInterface(obj, interfaceName) {
        if (typeof obj[_Symbol2.default.reflection] === "function") {
            var interfaces = obj[_Symbol2.default.reflection]().interfaces;
            return Array.isArray(interfaces) && interfaces.indexOf(interfaceName) > -1;
        }
        return false;
    }
    function isArray(obj) {
        return Array.isArray(obj) || ArrayBuffer.isView(obj);
    }
    function getRestParams(args, idx) {
        for (var _len = args.length, restArgs = Array(_len > idx ? _len - idx : 0), _key = idx; _key < _len; _key++) {
            restArgs[_key - idx] = args[_key];
        }return restArgs;
    }
    function toString(o) {
        return o != null && typeof o.ToString == "function" ? o.ToString() : String(o);
    }
    function hash(x) {
        var s = JSON.stringify(x);
        var h = 5381,
            i = 0,
            len = s.length;
        while (i < len) {
            h = h * 33 ^ s.charCodeAt(i++);
        }
        return h;
    }
    function equals(x, y) {
        // Optimization if they are referencially equal
        if (x === y) return true;else if (x == null) return y == null;else if (y == null) return false;else if (isGeneric(x) && isGeneric(y)) return getDefinition(x) === getDefinition(y) && equalsRecords(x.prototype[_Symbol2.default.generics](), y.prototype[_Symbol2.default.generics]());else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return false;else if (typeof x.Equals === "function") return x.Equals(y);else if (Array.isArray(x)) {
            if (x.length != y.length) return false;
            for (var i = 0; i < x.length; i++) {
                if (!equals(x[i], y[i])) return false;
            }return true;
        } else if (ArrayBuffer.isView(x)) {
            if (x.byteLength !== y.byteLength) return false;
            var dv1 = new DataView(x.buffer),
                dv2 = new DataView(y.buffer);
            for (var _i = 0; _i < x.byteLength; _i++) {
                if (dv1.getUint8(_i) !== dv2.getUint8(_i)) return false;
            }return true;
        } else if (x instanceof Date) return x.getTime() == y.getTime();else return false;
    }
    function compare(x, y) {
        // Optimization if they are referencially equal
        if (x === y) return 0;
        if (x == null) return y == null ? 0 : -1;else if (y == null) return -1;else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return -1;else if (hasInterface(x, "System.IComparable")) return x.CompareTo(y);else if (Array.isArray(x)) {
            if (x.length != y.length) return x.length < y.length ? -1 : 1;
            for (var i = 0, j = 0; i < x.length; i++) {
                if ((j = compare(x[i], y[i])) !== 0) return j;
            }return 0;
        } else if (ArrayBuffer.isView(x)) {
            if (x.byteLength != y.byteLength) return x.byteLength < y.byteLength ? -1 : 1;
            var dv1 = new DataView(x.buffer),
                dv2 = new DataView(y.buffer);
            for (var _i2 = 0, b1 = 0, b2 = 0; _i2 < x.byteLength; _i2++) {
                b1 = dv1.getUint8(_i2), b2 = dv2.getUint8(_i2);
                if (b1 < b2) return -1;
                if (b1 > b2) return 1;
            }
            return 0;
        } else if (x instanceof Date) return compare(x.getTime(), y.getTime());else return x < y ? -1 : 1;
    }
    function equalsRecords(x, y) {
        // Optimization if they are referencially equal
        if (x === y) {
            return true;
        } else {
            var keys = Object.getOwnPropertyNames(x);
            for (var i = 0; i < keys.length; i++) {
                if (!equals(x[keys[i]], y[keys[i]])) return false;
            }
            return true;
        }
    }
    function compareRecords(x, y) {
        // Optimization if they are referencially equal
        if (x === y) {
            return 0;
        } else {
            var keys = Object.getOwnPropertyNames(x);
            for (var i = 0; i < keys.length; i++) {
                var res = compare(x[keys[i]], y[keys[i]]);
                if (res !== 0) return res;
            }
            return 0;
        }
    }
    function equalsUnions(x, y) {
        // Optimization if they are referencially equal
        if (x === y) {
            return true;
        } else if (x.Case !== y.Case) {
            return false;
        } else {
            for (var i = 0; i < x.Fields.length; i++) {
                if (!equals(x.Fields[i], y.Fields[i])) return false;
            }
            return true;
        }
    }
    function compareUnions(x, y) {
        // Optimization if they are referencially equal
        if (x === y) {
            return 0;
        } else {
            var res = compare(x.Case, y.Case);
            if (res !== 0) return res;
            for (var i = 0; i < x.Fields.length; i++) {
                res = compare(x.Fields[i], y.Fields[i]);
                if (res !== 0) return res;
            }
            return 0;
        }
    }
    function createDisposable(f) {
        return _defineProperty({
            Dispose: f
        }, _Symbol2.default.reflection, function () {
            return { interfaces: ["System.IDisposable"] };
        });
    }
    function createObj(fields) {
        var o = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var kv = _step.value;

                o[kv[0]] = kv[1];
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return o;
    }
    function toPlainJsObj(source) {
        if (source != null && source.constructor != Object) {
            var target = {};
            var props = Object.getOwnPropertyNames(source);
            for (var i = 0; i < props.length; i++) {
                target[props[i]] = source[props[i]];
            }
            // Copy also properties from prototype, see #192
            var proto = Object.getPrototypeOf(source);
            if (proto != null) {
                props = Object.getOwnPropertyNames(proto);
                for (var _i3 = 0; _i3 < props.length; _i3++) {
                    var prop = Object.getOwnPropertyDescriptor(proto, props[_i3]);
                    if (prop.value) {
                        target[props[_i3]] = prop.value;
                    } else if (prop.get) {
                        target[props[_i3]] = prop.get.apply(source);
                    }
                }
            }
            return target;
        } else {
            return source;
        }
    }
    function round(value) {
        var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var m = Math.pow(10, digits);
        var n = +(digits ? value * m : value).toFixed(8);
        var i = Math.floor(n),
            f = n - i;
        var e = 1e-8;
        var r = f > 0.5 - e && f < 0.5 + e ? i % 2 == 0 ? i : i + 1 : Math.round(n);
        return digits ? r / m : r;
    }
});