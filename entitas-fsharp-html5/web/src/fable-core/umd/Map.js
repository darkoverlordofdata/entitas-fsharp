(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./ListClass", "./Util", "./GenericComparer", "./Symbol", "./Seq"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./ListClass"), require("./Util"), require("./GenericComparer"), require("./Symbol"), require("./Seq"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ListClass, global.Util, global.GenericComparer, global.Symbol, global.Seq);
        global.Map = mod.exports;
    }
})(this, function (exports, _ListClass, _Util, _GenericComparer, _Symbol, _Seq) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MapTree = undefined;
    exports.groupBy = groupBy;
    exports.countBy = countBy;
    exports.create = create;
    exports.add = add;
    exports.remove = remove;
    exports.containsValue = containsValue;
    exports.tryGetValue = tryGetValue;
    exports.exists = exists;
    exports.find = find;
    exports.tryFind = tryFind;
    exports.filter = filter;
    exports.fold = fold;
    exports.foldBack = foldBack;
    exports.forAll = forAll;
    exports.isEmpty = isEmpty;
    exports.iterate = iterate;
    exports.map = map;
    exports.partition = partition;
    exports.findKey = findKey;
    exports.tryFindKey = tryFindKey;
    exports.pick = pick;
    exports.tryPick = tryPick;

    var _ListClass2 = _interopRequireDefault(_ListClass);

    var _GenericComparer2 = _interopRequireDefault(_GenericComparer);

    var _Symbol2 = _interopRequireDefault(_Symbol);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
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

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    // ----------------------------------------------
    // These functions belong to Seq.ts but are
    // implemented here to prevent cyclic dependencies
    function groupBy(f, xs) {
        var keys = [],
            iter = xs[Symbol.iterator]();
        var acc = create(),
            cur = iter.next();
        while (!cur.done) {
            var k = f(cur.value),
                vs = tryFind(k, acc);
            if (vs == null) {
                keys.push(k);
                acc = add(k, [cur.value], acc);
            } else {
                vs.push(cur.value);
            }
            cur = iter.next();
        }
        return keys.map(function (k) {
            return [k, acc.get(k)];
        });
    }
    function countBy(f, xs) {
        return groupBy(f, xs).map(function (kv) {
            return [kv[0], kv[1].length];
        });
    }

    var MapTree = exports.MapTree = function MapTree(caseName, fields) {
        _classCallCheck(this, MapTree);

        this.Case = caseName;
        this.Fields = fields;
    };

    function tree_sizeAux(acc, m) {
        return m.Case === "MapOne" ? acc + 1 : m.Case === "MapNode" ? tree_sizeAux(tree_sizeAux(acc + 1, m.Fields[2]), m.Fields[3]) : acc;
    }
    function tree_size(x) {
        return tree_sizeAux(0, x);
    }
    function tree_empty() {
        return new MapTree("MapEmpty", []);
    }
    function tree_height(_arg1) {
        return _arg1.Case === "MapOne" ? 1 : _arg1.Case === "MapNode" ? _arg1.Fields[4] : 0;
    }
    function tree_isEmpty(m) {
        return m.Case === "MapEmpty" ? true : false;
    }
    function tree_mk(l, k, v, r) {
        var matchValue = [l, r];
        var $target1 = function $target1() {
            var hl = tree_height(l);
            var hr = tree_height(r);
            var m = hl < hr ? hr : hl;
            return new MapTree("MapNode", [k, v, l, r, m + 1]);
        };
        if (matchValue[0].Case === "MapEmpty") {
            if (matchValue[1].Case === "MapEmpty") {
                return new MapTree("MapOne", [k, v]);
            } else {
                return $target1();
            }
        } else {
            return $target1();
        }
    }
    ;
    function tree_rebalance(t1, k, v, t2) {
        var t1h = tree_height(t1);
        var t2h = tree_height(t2);
        if (t2h > t1h + 2) {
            if (t2.Case === "MapNode") {
                if (tree_height(t2.Fields[2]) > t1h + 1) {
                    if (t2.Fields[2].Case === "MapNode") {
                        return tree_mk(tree_mk(t1, k, v, t2.Fields[2].Fields[2]), t2.Fields[2].Fields[0], t2.Fields[2].Fields[1], tree_mk(t2.Fields[2].Fields[3], t2.Fields[0], t2.Fields[1], t2.Fields[3]));
                    } else {
                        throw new Error("rebalance");
                    }
                } else {
                    return tree_mk(tree_mk(t1, k, v, t2.Fields[2]), t2.Fields[0], t2.Fields[1], t2.Fields[3]);
                }
            } else {
                throw new Error("rebalance");
            }
        } else {
            if (t1h > t2h + 2) {
                if (t1.Case === "MapNode") {
                    if (tree_height(t1.Fields[3]) > t2h + 1) {
                        if (t1.Fields[3].Case === "MapNode") {
                            return tree_mk(tree_mk(t1.Fields[2], t1.Fields[0], t1.Fields[1], t1.Fields[3].Fields[2]), t1.Fields[3].Fields[0], t1.Fields[3].Fields[1], tree_mk(t1.Fields[3].Fields[3], k, v, t2));
                        } else {
                            throw new Error("rebalance");
                        }
                    } else {
                        return tree_mk(t1.Fields[2], t1.Fields[0], t1.Fields[1], tree_mk(t1.Fields[3], k, v, t2));
                    }
                } else {
                    throw new Error("rebalance");
                }
            } else {
                return tree_mk(t1, k, v, t2);
            }
        }
    }
    function tree_add(comparer, k, v, m) {
        if (m.Case === "MapOne") {
            var c = comparer.Compare(k, m.Fields[0]);
            if (c < 0) {
                return new MapTree("MapNode", [k, v, new MapTree("MapEmpty", []), m, 2]);
            } else if (c === 0) {
                return new MapTree("MapOne", [k, v]);
            }
            return new MapTree("MapNode", [k, v, m, new MapTree("MapEmpty", []), 2]);
        } else if (m.Case === "MapNode") {
            var c = comparer.Compare(k, m.Fields[0]);
            if (c < 0) {
                return tree_rebalance(tree_add(comparer, k, v, m.Fields[2]), m.Fields[0], m.Fields[1], m.Fields[3]);
            } else if (c === 0) {
                return new MapTree("MapNode", [k, v, m.Fields[2], m.Fields[3], m.Fields[4]]);
            }
            return tree_rebalance(m.Fields[2], m.Fields[0], m.Fields[1], tree_add(comparer, k, v, m.Fields[3]));
        }
        return new MapTree("MapOne", [k, v]);
    }
    function tree_find(comparer, k, m) {
        var res = tree_tryFind(comparer, k, m);
        if (res != null) return res;
        throw new Error("key not found");
    }
    function tree_tryFind(comparer, k, m) {
        if (m.Case === "MapOne") {
            var c = comparer.Compare(k, m.Fields[0]);
            return c === 0 ? m.Fields[1] : null;
        } else if (m.Case === "MapNode") {
            var c = comparer.Compare(k, m.Fields[0]);
            if (c < 0) {
                return tree_tryFind(comparer, k, m.Fields[2]);
            } else {
                if (c === 0) {
                    return m.Fields[1];
                } else {
                    return tree_tryFind(comparer, k, m.Fields[3]);
                }
            }
        }
        return null;
    }
    function tree_partition1(comparer, f, k, v, acc1, acc2) {
        return f(k, v) ? [tree_add(comparer, k, v, acc1), acc2] : [acc1, tree_add(comparer, k, v, acc2)];
    }
    function tree_partitionAux(comparer, f, s, acc_0, acc_1) {
        var acc = [acc_0, acc_1];
        if (s.Case === "MapOne") {
            return tree_partition1(comparer, f, s.Fields[0], s.Fields[1], acc[0], acc[1]);
        } else if (s.Case === "MapNode") {
            var acc_2 = tree_partitionAux(comparer, f, s.Fields[3], acc[0], acc[1]);
            var acc_3 = tree_partition1(comparer, f, s.Fields[0], s.Fields[1], acc_2[0], acc_2[1]);
            return tree_partitionAux(comparer, f, s.Fields[2], acc_3[0], acc_3[1]);
        }
        return acc;
    }
    function tree_partition(comparer, f, s) {
        return tree_partitionAux(comparer, f, s, tree_empty(), tree_empty());
    }
    function tree_filter1(comparer, f, k, v, acc) {
        return f(k, v) ? tree_add(comparer, k, v, acc) : acc;
    }
    function tree_filterAux(comparer, f, s, acc) {
        return s.Case === "MapOne" ? tree_filter1(comparer, f, s.Fields[0], s.Fields[1], acc) : s.Case === "MapNode" ? function () {
            var acc_1 = tree_filterAux(comparer, f, s.Fields[2], acc);
            var acc_2 = tree_filter1(comparer, f, s.Fields[0], s.Fields[1], acc_1);
            return tree_filterAux(comparer, f, s.Fields[3], acc_2);
        }() : acc;
    }
    function tree_filter(comparer, f, s) {
        return tree_filterAux(comparer, f, s, tree_empty());
    }
    function tree_spliceOutSuccessor(m) {
        if (m.Case === "MapOne") {
            return [m.Fields[0], m.Fields[1], new MapTree("MapEmpty", [])];
        } else if (m.Case === "MapNode") {
            if (m.Fields[2].Case === "MapEmpty") {
                return [m.Fields[0], m.Fields[1], m.Fields[3]];
            } else {
                var kvl = tree_spliceOutSuccessor(m.Fields[2]);
                return [kvl[0], kvl[1], tree_mk(kvl[2], m.Fields[0], m.Fields[1], m.Fields[3])];
            }
        }
        throw new Error("internal error: Map.spliceOutSuccessor");
    }
    function tree_remove(comparer, k, m) {
        if (m.Case === "MapOne") {
            var c = comparer.Compare(k, m.Fields[0]);
            if (c === 0) {
                return new MapTree("MapEmpty", []);
            } else {
                return m;
            }
        } else if (m.Case === "MapNode") {
            var c = comparer.Compare(k, m.Fields[0]);
            if (c < 0) {
                return tree_rebalance(tree_remove(comparer, k, m.Fields[2]), m.Fields[0], m.Fields[1], m.Fields[3]);
            } else {
                if (c === 0) {
                    var matchValue = [m.Fields[2], m.Fields[3]];
                    if (matchValue[0].Case === "MapEmpty") {
                        return m.Fields[3];
                    } else {
                        if (matchValue[1].Case === "MapEmpty") {
                            return m.Fields[2];
                        } else {
                            var patternInput = tree_spliceOutSuccessor(m.Fields[3]);
                            var sv = patternInput[1];
                            var sk = patternInput[0];
                            var r_ = patternInput[2];
                            return tree_mk(m.Fields[2], sk, sv, r_);
                        }
                    }
                } else {
                    return tree_rebalance(m.Fields[2], m.Fields[0], m.Fields[1], tree_remove(comparer, k, m.Fields[3]));
                }
            }
        } else {
            return tree_empty();
        }
    }
    function tree_mem(comparer, k, m) {
        return m.Case === "MapOne" ? comparer.Compare(k, m.Fields[0]) === 0 : m.Case === "MapNode" ? function () {
            var c = comparer.Compare(k, m.Fields[0]);
            if (c < 0) {
                return tree_mem(comparer, k, m.Fields[2]);
            } else {
                if (c === 0) {
                    return true;
                } else {
                    return tree_mem(comparer, k, m.Fields[3]);
                }
            }
        }() : false;
    }
    function tree_iter(f, m) {
        if (m.Case === "MapOne") {
            f(m.Fields[0], m.Fields[1]);
        } else if (m.Case === "MapNode") {
            tree_iter(f, m.Fields[2]);
            f(m.Fields[0], m.Fields[1]);
            tree_iter(f, m.Fields[3]);
        }
    }
    function tree_tryPick(f, m) {
        return m.Case === "MapOne" ? f(m.Fields[0], m.Fields[1]) : m.Case === "MapNode" ? function () {
            var matchValue = tree_tryPick(f, m.Fields[2]);
            if (matchValue == null) {
                var matchValue_1 = f(m.Fields[0], m.Fields[1]);
                if (matchValue_1 == null) {
                    return tree_tryPick(f, m.Fields[3]);
                } else {
                    var res = matchValue_1;
                    return res;
                }
            } else {
                var res = matchValue;
                return res;
            }
        }() : null;
    }
    function tree_exists(f, m) {
        return m.Case === "MapOne" ? f(m.Fields[0], m.Fields[1]) : m.Case === "MapNode" ? (tree_exists(f, m.Fields[2]) ? true : f(m.Fields[0], m.Fields[1])) ? true : tree_exists(f, m.Fields[3]) : false;
    }
    function tree_forall(f, m) {
        return m.Case === "MapOne" ? f(m.Fields[0], m.Fields[1]) : m.Case === "MapNode" ? (tree_forall(f, m.Fields[2]) ? f(m.Fields[0], m.Fields[1]) : false) ? tree_forall(f, m.Fields[3]) : false : true;
    }
    // function tree_map(f: (v:any) => any, m: MapTree): MapTree {
    //   return m.Case === "MapOne" ? new MapTree("MapOne", [m.Fields[0], f(m.Fields[1])]) : m.Case === "MapNode" ? (() => {
    //     var l2 = tree_map(f, m.Fields[2]);
    //     var v2 = f(m.Fields[1]);
    //     var r2 = tree_map(f, m.Fields[3]);
    //     return new MapTree("MapNode", [m.Fields[0], v2, l2, r2, m.Fields[4]]);
    //   })() : tree_empty();
    // }
    function tree_mapi(f, m) {
        return m.Case === "MapOne" ? new MapTree("MapOne", [m.Fields[0], f(m.Fields[0], m.Fields[1])]) : m.Case === "MapNode" ? function () {
            var l2 = tree_mapi(f, m.Fields[2]);
            var v2 = f(m.Fields[0], m.Fields[1]);
            var r2 = tree_mapi(f, m.Fields[3]);
            return new MapTree("MapNode", [m.Fields[0], v2, l2, r2, m.Fields[4]]);
        }() : tree_empty();
    }
    function tree_foldBack(f, m, x) {
        return m.Case === "MapOne" ? f(m.Fields[0], m.Fields[1], x) : m.Case === "MapNode" ? function () {
            var x_1 = tree_foldBack(f, m.Fields[3], x);
            var x_2 = f(m.Fields[0], m.Fields[1], x_1);
            return tree_foldBack(f, m.Fields[2], x_2);
        }() : x;
    }
    function tree_fold(f, x, m) {
        return m.Case === "MapOne" ? f(x, m.Fields[0], m.Fields[1]) : m.Case === "MapNode" ? function () {
            var x_1 = tree_fold(f, x, m.Fields[2]);
            var x_2 = f(x_1, m.Fields[0], m.Fields[1]);
            return tree_fold(f, x_2, m.Fields[3]);
        }() : x;
    }
    // function tree_foldFromTo(comparer: IComparer<any>, lo: any, hi: any, f: (k:any, v:any, acc: any) => any, m: MapTree, x: any): any {
    //   if (m.Case === "MapOne") {
    //     var cLoKey = comparer.Compare(lo, m.Fields[0]);
    //     var cKeyHi = comparer.Compare(m.Fields[0], hi);
    //     var x_1 = (cLoKey <= 0 ? cKeyHi <= 0 : false) ? f(m.Fields[0], m.Fields[1], x) : x;
    //     return x_1;
    //   }
    //   else if (m.Case === "MapNode") {
    //     var cLoKey = comparer.Compare(lo, m.Fields[0]);
    //     var cKeyHi = comparer.Compare(m.Fields[0], hi);
    //     var x_1 = cLoKey < 0 ? tree_foldFromTo(comparer, lo, hi, f, m.Fields[2], x) : x;
    //     var x_2 = (cLoKey <= 0 ? cKeyHi <= 0 : false) ? f(m.Fields[0], m.Fields[1], x_1) : x_1;
    //     var x_3 = cKeyHi < 0 ? tree_foldFromTo(comparer, lo, hi, f, m.Fields[3], x_2) : x_2;
    //     return x_3;
    //   }
    //   return x;
    // }
    // function tree_foldSection(comparer: IComparer<any>, lo: any, hi: any, f: (k:any, v:any, acc: any) => any, m: MapTree, x: any) {
    //   return comparer.Compare(lo, hi) === 1 ? x : tree_foldFromTo(comparer, lo, hi, f, m, x);
    // }
    // function tree_loop(m: MapTree, acc: any): List<[any,any]> {
    //   return m.Case === "MapOne"
    //     ? new List([m.Fields[0], m.Fields[1]], acc)
    //     : m.Case === "MapNode"
    //       ? tree_loop(m.Fields[2], new List([m.Fields[0], m.Fields[1]], tree_loop(m.Fields[3], acc)))
    //       : acc;
    // }
    // function tree_toList(m: MapTree) {
    //   return tree_loop(m, new List());
    // }
    // function tree_toArray(m: MapTree) {
    //   return Array.from(tree_toList(m));
    // }
    // function tree_ofList(comparer: IComparer<any>, l: List<[any,any]>) {
    //   return Seq.fold((acc: MapTree, tupledArg: [any, any]) => {
    //     return tree_add(comparer, tupledArg[0], tupledArg[1], acc);
    //   }, tree_empty(), l);
    // }
    function tree_mkFromEnumerator(comparer, acc, e) {
        var cur = e.next();
        while (!cur.done) {
            acc = tree_add(comparer, cur.value[0], cur.value[1], acc);
            cur = e.next();
        }
        return acc;
    }
    // function tree_ofArray(comparer: IComparer<any>, arr: ArrayLike<[any,any]>) {
    //   var res = tree_empty();
    //   for (var i = 0; i <= arr.length - 1; i++) {
    //     res = tree_add(comparer, arr[i][0], arr[i][1], res);
    //   }
    //   return res;
    // }
    function tree_ofSeq(comparer, c) {
        var ie = c[Symbol.iterator]();
        return tree_mkFromEnumerator(comparer, tree_empty(), ie);
    }
    // function tree_copyToArray(s: MapTree, arr: ArrayLike<any>, i: number) {
    //   tree_iter((x, y) => { arr[i++] = [x, y]; }, s);
    // }
    function tree_collapseLHS(stack) {
        if (stack.tail != null) {
            if (stack.head.Case === "MapOne") {
                return stack;
            } else if (stack.head.Case === "MapNode") {
                return tree_collapseLHS((0, _ListClass.ofArray)([stack.head.Fields[2], new MapTree("MapOne", [stack.head.Fields[0], stack.head.Fields[1]]), stack.head.Fields[3]], stack.tail));
            } else {
                return tree_collapseLHS(stack.tail);
            }
        } else {
            return new _ListClass2.default();
        }
    }
    function tree_mkIterator(s) {
        return { stack: tree_collapseLHS(new _ListClass2.default(s, new _ListClass2.default())), started: false };
    }
    function tree_moveNext(i) {
        function current(i) {
            if (i.stack.tail == null) {
                return null;
            } else if (i.stack.head.Case === "MapOne") {
                return [i.stack.head.Fields[0], i.stack.head.Fields[1]];
            }
            throw new Error("Please report error: Map iterator, unexpected stack for current");
        }
        if (i.started) {
            if (i.stack.tail == null) {
                return { done: true, value: null };
            } else {
                if (i.stack.head.Case === "MapOne") {
                    i.stack = tree_collapseLHS(i.stack.tail);
                    return {
                        done: i.stack.tail == null,
                        value: current(i)
                    };
                } else {
                    throw new Error("Please report error: Map iterator, unexpected stack for moveNext");
                }
            }
        } else {
            i.started = true;
            return {
                done: i.stack.tail == null,
                value: current(i)
            };
        }
        ;
    }

    var FMap = function () {
        /** Do not call, use Map.create instead. */
        function FMap() {
            _classCallCheck(this, FMap);
        }

        _createClass(FMap, [{
            key: "ToString",
            value: function ToString() {
                return "map [" + Array.from(this).map(_Util.toString).join("; ") + "]";
            }
        }, {
            key: "Equals",
            value: function Equals(m2) {
                return this.CompareTo(m2) === 0;
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(m2) {
                var _this = this;

                return this === m2 ? 0 : (0, _Seq.compareWith)(function (kvp1, kvp2) {
                    var c = _this.comparer.Compare(kvp1[0], kvp2[0]);
                    return c !== 0 ? c : (0, _Util.compare)(kvp1[1], kvp2[1]);
                }, this, m2);
            }
        }, {
            key: Symbol.iterator,
            value: function value() {
                var i = tree_mkIterator(this.tree);
                return {
                    next: function next() {
                        return tree_moveNext(i);
                    }
                };
            }
        }, {
            key: "entries",
            value: function entries() {
                return this[Symbol.iterator]();
            }
        }, {
            key: "keys",
            value: function keys() {
                return (0, _Seq.map)(function (kv) {
                    return kv[0];
                }, this);
            }
        }, {
            key: "values",
            value: function values() {
                return (0, _Seq.map)(function (kv) {
                    return kv[1];
                }, this);
            }
        }, {
            key: "get",
            value: function get(k) {
                return tree_find(this.comparer, k, this.tree);
            }
        }, {
            key: "has",
            value: function has(k) {
                return tree_mem(this.comparer, k, this.tree);
            }
        }, {
            key: "set",
            value: function set(k, v) {
                throw new Error("not supported");
            }
        }, {
            key: "delete",
            value: function _delete(k) {
                throw new Error("not supported");
            }
        }, {
            key: "clear",
            value: function clear() {
                throw new Error("not supported");
            }
        }, {
            key: _Symbol2.default.reflection,
            value: function value() {
                return {
                    type: "Microsoft.FSharp.Collections.FSharpMap",
                    interfaces: ["System.IEquatable", "System.IComparable"]
                };
            }
        }, {
            key: "size",
            get: function get() {
                return tree_size(this.tree);
            }
        }]);

        return FMap;
    }();

    exports.default = FMap;

    function from(comparer, tree) {
        var map = new FMap();
        map.tree = tree;
        map.comparer = comparer || new _GenericComparer2.default();
        return map;
    }
    function create(ie, comparer) {
        comparer = comparer || new _GenericComparer2.default();
        return from(comparer, ie ? tree_ofSeq(comparer, ie) : tree_empty());
    }
    function add(k, v, map) {
        return from(map.comparer, tree_add(map.comparer, k, v, map.tree));
    }
    function remove(item, map) {
        return from(map.comparer, tree_remove(map.comparer, item, map.tree));
    }
    function containsValue(v, map) {
        return (0, _Seq.fold)(function (acc, k) {
            return acc || (0, _Util.equals)(map.get(k), v);
        }, false, map.keys());
    }
    function tryGetValue(map, key, defaultValue) {
        return map.has(key) ? [true, map.get(key)] : [false, defaultValue];
    }
    function exists(f, map) {
        return tree_exists(f, map.tree);
    }
    function find(k, map) {
        return tree_find(map.comparer, k, map.tree);
    }
    function tryFind(k, map) {
        return tree_tryFind(map.comparer, k, map.tree);
    }
    function filter(f, map) {
        return from(map.comparer, tree_filter(map.comparer, f, map.tree));
    }
    function fold(f, seed, map) {
        return tree_fold(f, seed, map.tree);
    }
    function foldBack(f, map, seed) {
        return tree_foldBack(f, map.tree, seed);
    }
    function forAll(f, map) {
        return tree_forall(f, map.tree);
    }
    function isEmpty(map) {
        return tree_isEmpty(map.tree);
    }
    function iterate(f, map) {
        tree_iter(f, map.tree);
    }
    function map(f, map) {
        return from(map.comparer, tree_mapi(f, map.tree));
    }
    function partition(f, map) {
        var rs = tree_partition(map.comparer, f, map.tree);
        return [from(map.comparer, rs[0]), from(map.comparer, rs[1])];
    }
    function findKey(f, map) {
        return (0, _Seq.pick)(function (kv) {
            return f(kv[0], kv[1]) ? kv[0] : null;
        }, map);
    }
    function tryFindKey(f, map) {
        return (0, _Seq.tryPick)(function (kv) {
            return f(kv[0], kv[1]) ? kv[0] : null;
        }, map);
    }
    function pick(f, map) {
        var res = tryPick(f, map);
        if (res != null) return res;
        throw new Error("key not found");
    }
    function tryPick(f, map) {
        return tree_tryPick(f, map.tree);
    }
});