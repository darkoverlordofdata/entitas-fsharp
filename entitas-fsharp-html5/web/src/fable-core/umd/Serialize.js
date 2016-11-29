(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Symbol", "./List", "./Set", "./Map", "./Util", "./Seq", "./Reflection", "./Date"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Symbol"), require("./List"), require("./Set"), require("./Map"), require("./Util"), require("./Seq"), require("./Reflection"), require("./Date"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Symbol, global.List, global.Set, global.Map, global.Util, global.Seq, global.Reflection, global.Date);
        global.Serialize = mod.exports;
    }
})(this, function (exports, _Symbol, _List, _Set, _Map, _Util, _Seq, _Reflection, _Date) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.inflate = undefined;
    exports.toJson = toJson;
    exports.ofJson = ofJson;
    exports.toJsonWithTypeInfo = toJsonWithTypeInfo;
    exports.ofJsonWithTypeInfo = ofJsonWithTypeInfo;

    var _Symbol2 = _interopRequireDefault(_Symbol);

    var _List2 = _interopRequireDefault(_List);

    var _Set2 = _interopRequireDefault(_Set);

    var _Map2 = _interopRequireDefault(_Map);

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

    function toJson(o) {
        return JSON.stringify(o, function (k, v) {
            if (ArrayBuffer.isView(v)) {
                return Array.from(v);
            } else if (v != null && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                var properties = typeof v[_Symbol2.default.reflection] === "function" ? v[_Symbol2.default.reflection]().properties : null;
                if (v instanceof _List2.default || v instanceof _Set2.default || v instanceof Set) {
                    return Array.from(v);
                } else if (v instanceof _Map2.default || v instanceof Map) {
                    return (0, _Seq.fold)(function (o, kv) {
                        return o[toJson(kv[0])] = kv[1], o;
                    }, {}, v);
                } else if (!(0, _Util.hasInterface)(v, "FSharpRecord") && properties) {
                    return (0, _Seq.fold)(function (o, prop) {
                        return o[prop] = v[prop], o;
                    }, {}, Object.getOwnPropertyNames(properties));
                } else if ((0, _Util.hasInterface)(v, "FSharpUnion")) {
                    if (!v.Fields || !v.Fields.length) {
                        return v.Case;
                    } else if (v.Fields.length === 1) {
                        return _defineProperty({}, v.Case, v.Fields[0]);
                    } else {
                        return _defineProperty({}, v.Case, v.Fields);
                    }
                }
            }
            return v;
        });
    }
    function inflate(val, typ) {
        function needsInflate(enclosing) {
            var typ = enclosing.head;
            if (typeof typ === "string") {
                return false;
            }
            if (typ instanceof _Util.NonDeclaredType) {
                switch (typ.kind) {
                    case "Option":
                    case "Array":
                        return needsInflate(new _List2.default(typ.generics[0], enclosing));
                    case "Tuple":
                        return typ.generics.some(function (x) {
                            return needsInflate(new _List2.default(x, enclosing));
                        });
                    case "GenericParam":
                        return needsInflate((0, _Reflection.resolveGeneric)(typ.name, enclosing.tail));
                    default:
                        return false;
                }
            }
            return true;
        }
        function inflateArray(arr, enclosing) {
            return Array.isArray(arr) && needsInflate(enclosing) ? arr.map(function (x) {
                return inflate(x, enclosing);
            }) : arr;
        }
        function inflateMap(obj, keyEnclosing, valEnclosing) {
            var inflateKey = keyEnclosing.head !== "string";
            var inflateVal = needsInflate(valEnclosing);
            return Object.getOwnPropertyNames(obj).map(function (k) {
                var key = inflateKey ? inflate(JSON.parse(k), keyEnclosing) : k;
                var val = inflateVal ? inflate(obj[k], valEnclosing) : obj[k];
                return [key, val];
            });
        }
        var enclosing = null;
        if (typ instanceof _List2.default) {
            enclosing = typ;
            typ = typ.head;
        } else {
            enclosing = new _List2.default(typ, new _List2.default());
        }
        if (val == null || typeof typ === "string") {
            return val;
        } else if (typ instanceof _Util.NonDeclaredType) {
            switch (typ.kind) {
                case "Unit":
                    return null;
                case "Option":
                    return inflate(val, new _List2.default(typ.generics[0], enclosing));
                case "Array":
                    return inflateArray(val, new _List2.default(typ.generics[0], enclosing));
                case "Tuple":
                    return typ.generics.map(function (x, i) {
                        return inflate(val[i], new _List2.default(x, enclosing));
                    });
                case "GenericParam":
                    return inflate(val, (0, _Reflection.resolveGeneric)(typ.name, enclosing.tail));
                // case "Interface": // case "Any":
                default:
                    return val;
            }
        } else if (typeof typ === "function") {
            var proto = typ.prototype;
            if (typ === Date) {
                return (0, _Date.parse)(val);
            }
            if (proto instanceof _List2.default) {
                return (0, _List.ofArray)(inflateArray(val, (0, _Reflection.resolveGeneric)(0, enclosing)));
            }
            if (proto instanceof _Set2.default) {
                return (0, _Set.create)(inflateArray(val, (0, _Reflection.resolveGeneric)(0, enclosing)));
            }
            if (proto instanceof Set) {
                return new Set(inflateArray(val, (0, _Reflection.resolveGeneric)(0, enclosing)));
            }
            if (proto instanceof _Map2.default) {
                return (0, _Map.create)(inflateMap(val, (0, _Reflection.resolveGeneric)(0, enclosing), (0, _Reflection.resolveGeneric)(1, enclosing)));
            }
            if (proto instanceof Map) {
                return new Map(inflateMap(val, (0, _Reflection.resolveGeneric)(0, enclosing), (0, _Reflection.resolveGeneric)(1, enclosing)));
            }
            // Union types
            var info = typeof proto[_Symbol2.default.reflection] === "function" ? proto[_Symbol2.default.reflection]() : {};
            if (info.cases) {
                var u = { Fields: [] };
                if (typeof val === "string") {
                    u.Case = val;
                } else {
                    var caseName = Object.getOwnPropertyNames(val)[0];
                    var fieldTypes = info.cases[caseName];
                    var fields = fieldTypes.length > 1 ? val[caseName] : [val[caseName]];
                    u.Case = caseName;
                    for (var i = 0; i < fieldTypes.length; i++) {
                        u.Fields.push(inflate(fields[i], new _List2.default(fieldTypes[i], enclosing)));
                    }
                }
                return Object.assign(new typ(), u);
            }
            if (info.properties) {
                var properties = info.properties;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.getOwnPropertyNames(properties)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var k = _step.value;

                        val[k] = inflate(val[k], new _List2.default(properties[k], enclosing));
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

                return Object.assign(new typ(), val);
            }
            return val;
        }
        throw new Error("Unexpected type when deserializing JSON: " + typ);
    }
    function inflatePublic(val, genArgs) {
        return inflate(val, genArgs ? genArgs.T : null);
    }
    exports.inflate = inflatePublic;
    function ofJson(json, genArgs) {
        return inflate(JSON.parse(json), genArgs ? genArgs.T : null);
    }
    function toJsonWithTypeInfo(o) {
        return JSON.stringify(o, function (k, v) {
            if (ArrayBuffer.isView(v)) {
                return Array.from(v);
            } else if (v != null && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                var typeName = typeof v[_Symbol2.default.reflection] === "function" ? v[_Symbol2.default.reflection]().type : null;
                if (v instanceof _List2.default || v instanceof _Set2.default || v instanceof Set) {
                    return {
                        $type: typeName || "System.Collections.Generic.HashSet",
                        $values: Array.from(v) };
                } else if (v instanceof _Map2.default || v instanceof Map) {
                    return (0, _Seq.fold)(function (o, kv) {
                        o[kv[0]] = kv[1];return o;
                    }, { $type: typeName || "System.Collections.Generic.Dictionary" }, v);
                } else if (typeName) {
                    if ((0, _Util.hasInterface)(v, "FSharpUnion") || (0, _Util.hasInterface)(v, "FSharpRecord")) {
                        return Object.assign({ $type: typeName }, v);
                    } else {
                        var proto = Object.getPrototypeOf(v),
                            props = Object.getOwnPropertyNames(proto),
                            _o = { $type: typeName };
                        for (var i = 0; i < props.length; i++) {
                            var prop = Object.getOwnPropertyDescriptor(proto, props[i]);
                            if (prop.get) _o[props[i]] = prop.get.apply(v);
                        }
                        return _o;
                    }
                }
            }
            return v;
        });
    }
    function ofJsonWithTypeInfo(json, genArgs) {
        var parsed = JSON.parse(json, function (k, v) {
            if (v == null) return v;else if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && typeof v.$type === "string") {
                // Remove generic args and assembly info added by Newtonsoft.Json
                var type = v.$type.replace('+', '.'),
                    i = type.indexOf('`');
                if (i > -1) {
                    type = type.substr(0, i);
                } else {
                    i = type.indexOf(',');
                    type = i > -1 ? type.substr(0, i) : type;
                }
                if (type === "System.Collections.Generic.List" || type.indexOf("[]") === type.length - 2) {
                    return v.$values;
                }
                if (type === "Microsoft.FSharp.Collections.FSharpList") {
                    return (0, _List.ofArray)(v.$values);
                } else if (type == "Microsoft.FSharp.Collections.FSharpSet") {
                    return (0, _Set.create)(v.$values);
                } else if (type == "System.Collections.Generic.HashSet") {
                    return new Set(v.$values);
                } else if (type == "Microsoft.FSharp.Collections.FSharpMap") {
                    delete v.$type;
                    return (0, _Map.create)(Object.getOwnPropertyNames(v).map(function (k) {
                        return [k, v[k]];
                    }));
                } else if (type == "System.Collections.Generic.Dictionary") {
                    delete v.$type;
                    return new Map(Object.getOwnPropertyNames(v).map(function (k) {
                        return [k, v[k]];
                    }));
                } else {
                    var T = _Symbol.fableGlobal.types.get(type);
                    if (T) {
                        delete v.$type;
                        return Object.assign(new T(), v);
                    }
                }
            } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[+-]\d{2}:\d{2}|Z)$/.test(v)) return (0, _Date.parse)(v);else return v;
        });
        var expected = genArgs ? genArgs.T : null;
        if (parsed != null && typeof expected === "function" && !(parsed instanceof (0, _Util.getDefinition)(expected))) {
            throw new Error("JSON is not of type " + expected.name + ": " + json);
        }
        return parsed;
    }
});