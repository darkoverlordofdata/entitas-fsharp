(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Util", "./List", "./Symbol"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Util"), require("./List"), require("./Symbol"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Util, global.List, global.Symbol);
        global.Reflection = mod.exports;
    }
})(this, function (exports, _Util, _List, _Symbol) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.resolveGeneric = resolveGeneric;
    exports.getType = getType;
    exports.getTypeFullName = getTypeFullName;

    var _List2 = _interopRequireDefault(_List);

    var _Symbol2 = _interopRequireDefault(_Symbol);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function resolveGeneric(idx, enclosing) {
        var name = null;
        try {
            var t = enclosing.head;
            var generics = t.prototype[_Symbol2.default.generics]();
            name = typeof idx === "string" ? idx : Object.getOwnPropertyNames(generics)[idx];
            var resolved = generics[name];
            return resolved instanceof _Util.NonDeclaredType && resolved.kind === "GenericParam" ? resolveGeneric(resolved.name, enclosing.tail) : new _List2.default(resolved, enclosing);
        } catch (err) {
            throw new Error("Cannot resolve generic argument " + name + ": " + err);
        }
    }
    function getType(obj) {
        var t = typeof obj === "undefined" ? "undefined" : _typeof(obj);
        switch (t) {
            case "boolean":
            case "number":
            case "string":
            case "function":
                return t;
            default:
                return Object.getPrototypeOf(obj).constructor;
        }
    }
    // TODO: This needs improvement, check namespace for non-custom types?
    function getTypeFullName(typ, option) {
        function trim(fullName, option) {
            if (typeof fullName !== "string") {
                return "unknown";
            }
            if (option === "name") {
                var i = fullName.lastIndexOf('.');
                return fullName.substr(i + 1);
            }
            if (option === "namespace") {
                var _i = fullName.lastIndexOf('.');
                return _i > -1 ? fullName.substr(0, _i) : "";
            }
            return fullName;
        }
        if (typeof typ === "string") {
            return typ;
        } else if (typ instanceof _Util.NonDeclaredType) {
            switch (typ.kind) {
                case "Unit":
                    return "unit";
                case "Option":
                    return getTypeFullName(typ.generics[0], option) + " option";
                case "Array":
                    return getTypeFullName(typ.generics[0], option) + "[]";
                case "Tuple":
                    return typ.generics.map(function (x) {
                        return getTypeFullName(x, option);
                    }).join(" * ");
                case "GenericParam":
                case "Interface":
                    return typ.name;
                case "Any":
                default:
                    return "unknown";
            }
        } else {
            var proto = Object.getPrototypeOf(typ);
            return trim(typeof proto[_Symbol2.default.reflection] === "function" ? proto[_Symbol2.default.reflection]().type : null, option);
        }
    }
});