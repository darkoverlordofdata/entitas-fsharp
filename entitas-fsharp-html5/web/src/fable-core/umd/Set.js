(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./List", "./Util", "./GenericComparer", "./Symbol", "./Seq"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./List"), require("./Util"), require("./GenericComparer"), require("./Symbol"), require("./Seq"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.List, global.Util, global.GenericComparer, global.Symbol, global.Seq);
        global.Set = mod.exports;
    }
})(this, function (exports, _List, _Util, _GenericComparer, _Symbol, _Seq) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SetTree = exports.distinct = undefined;
    exports.distinctBy = distinctBy;
    exports.create = create;
    exports.isEmpty = isEmpty;
    exports.add = add;
    exports.addInPlace = addInPlace;
    exports.remove = remove;
    exports.union = union;
    exports.op_Addition = op_Addition;
    exports.unionInPlace = unionInPlace;
    exports.unionMany = unionMany;
    exports.difference = difference;
    exports.op_Subtraction = op_Subtraction;
    exports.differenceInPlace = differenceInPlace;
    exports.intersect = intersect;
    exports.intersectInPlace = intersectInPlace;
    exports.intersectMany = intersectMany;
    exports.isProperSubsetOf = isProperSubsetOf;
    exports.isProperSubset = isProperSubset;
    exports.isSubsetOf = isSubsetOf;
    exports.isSubset = isSubset;
    exports.isProperSupersetOf = isProperSupersetOf;
    exports.isProperSuperset = isProperSuperset;
    exports.isSupersetOf = isSupersetOf;
    exports.isSuperset = isSuperset;
    exports.copyTo = copyTo;
    exports.partition = partition;
    exports.filter = filter;
    exports.map = map;
    exports.exists = exists;
    exports.forAll = forAll;
    exports.fold = fold;
    exports.foldBack = foldBack;
    exports.iterate = iterate;
    exports.minimumElement = minimumElement;
    exports.minElement = minElement;
    exports.maximumElement = maximumElement;
    exports.maxElement = maxElement;

    var _List2 = _interopRequireDefault(_List);

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
    function distinctBy(f, xs) {
        var iter = xs[Symbol.iterator]();
        var acc = create(),
            cur = iter.next();
        while (!cur.done) {
            var k = f(cur.value);
            acc = add(k, acc);
            cur = iter.next();
        }
        return acc;
    }
    exports.distinct = create;

    var SetTree = exports.SetTree = function SetTree(caseName, fields) {
        _classCallCheck(this, SetTree);

        this.Case = caseName;
        this.Fields = fields;
    };

    var tree_tolerance = 2;
    function tree_countAux(s, acc) {
        return s.Case === "SetOne" ? acc + 1 : s.Case === "SetEmpty" ? acc : tree_countAux(s.Fields[1], tree_countAux(s.Fields[2], acc + 1));
    }
    function tree_count(s) {
        return tree_countAux(s, 0);
    }
    function tree_SetOne(n) {
        return new SetTree("SetOne", [n]);
    }
    function tree_SetNode(x, l, r, h) {
        return new SetTree("SetNode", [x, l, r, h]);
    }
    function tree_height(t) {
        return t.Case === "SetOne" ? 1 : t.Case === "SetNode" ? t.Fields[3] : 0;
    }
    function tree_mk(l, k, r) {
        var matchValue = [l, r];
        var $target1 = function $target1() {
            var hl = tree_height(l);
            var hr = tree_height(r);
            var m = hl < hr ? hr : hl;
            return tree_SetNode(k, l, r, m + 1);
        };
        if (matchValue[0].Case === "SetEmpty") {
            if (matchValue[1].Case === "SetEmpty") {
                return tree_SetOne(k);
            } else {
                return $target1();
            }
        } else {
            return $target1();
        }
    }
    function tree_rebalance(t1, k, t2) {
        var t1h = tree_height(t1);
        var t2h = tree_height(t2);
        if (t2h > t1h + tree_tolerance) {
            if (t2.Case === "SetNode") {
                if (tree_height(t2.Fields[1]) > t1h + 1) {
                    if (t2.Fields[1].Case === "SetNode") {
                        return tree_mk(tree_mk(t1, k, t2.Fields[1].Fields[1]), t2.Fields[1].Fields[0], tree_mk(t2.Fields[1].Fields[2], t2.Fields[0], t2.Fields[2]));
                    } else {
                        throw new Error("rebalance");
                    }
                } else {
                    return tree_mk(tree_mk(t1, k, t2.Fields[1]), t2.Fields[0], t2.Fields[2]);
                }
            } else {
                throw new Error("rebalance");
            }
        } else {
            if (t1h > t2h + tree_tolerance) {
                if (t1.Case === "SetNode") {
                    if (tree_height(t1.Fields[2]) > t2h + 1) {
                        if (t1.Fields[2].Case === "SetNode") {
                            return tree_mk(tree_mk(t1.Fields[1], t1.Fields[0], t1.Fields[2].Fields[1]), t1.Fields[2].Fields[0], tree_mk(t1.Fields[2].Fields[2], k, t2));
                        } else {
                            throw new Error("rebalance");
                        }
                    } else {
                        return tree_mk(t1.Fields[1], t1.Fields[0], tree_mk(t1.Fields[2], k, t2));
                    }
                } else {
                    throw new Error("rebalance");
                }
            } else {
                return tree_mk(t1, k, t2);
            }
        }
    }
    function tree_add(comparer, k, t) {
        return t.Case === "SetOne" ? function () {
            var c = comparer.Compare(k, t.Fields[0]);
            if (c < 0) {
                return tree_SetNode(k, new SetTree("SetEmpty", []), t, 2);
            } else {
                if (c === 0) {
                    return t;
                } else {
                    return tree_SetNode(k, t, new SetTree("SetEmpty", []), 2);
                }
            }
        }() : t.Case === "SetEmpty" ? tree_SetOne(k) : function () {
            var c = comparer.Compare(k, t.Fields[0]);
            if (c < 0) {
                return tree_rebalance(tree_add(comparer, k, t.Fields[1]), t.Fields[0], t.Fields[2]);
            } else {
                if (c === 0) {
                    return t;
                } else {
                    return tree_rebalance(t.Fields[1], t.Fields[0], tree_add(comparer, k, t.Fields[2]));
                }
            }
        }();
    }
    function tree_balance(comparer, t1, k, t2) {
        var matchValue = [t1, t2];
        var $target1 = function $target1(t1_1) {
            return tree_add(comparer, k, t1_1);
        };
        var $target2 = function $target2(k1, t2_1) {
            return tree_add(comparer, k, tree_add(comparer, k1, t2_1));
        };
        if (matchValue[0].Case === "SetOne") {
            if (matchValue[1].Case === "SetEmpty") {
                return $target1(matchValue[0]);
            } else {
                if (matchValue[1].Case === "SetOne") {
                    return $target2(matchValue[0].Fields[0], matchValue[1]);
                } else {
                    return $target2(matchValue[0].Fields[0], matchValue[1]);
                }
            }
        } else {
            if (matchValue[0].Case === "SetNode") {
                if (matchValue[1].Case === "SetOne") {
                    var k2 = matchValue[1].Fields[0];
                    var t1_1 = matchValue[0];
                    return tree_add(comparer, k, tree_add(comparer, k2, t1_1));
                } else {
                    if (matchValue[1].Case === "SetNode") {
                        var h1 = matchValue[0].Fields[3];
                        var h2 = matchValue[1].Fields[3];
                        var k1 = matchValue[0].Fields[0];
                        var k2 = matchValue[1].Fields[0];
                        var t11 = matchValue[0].Fields[1];
                        var t12 = matchValue[0].Fields[2];
                        var t21 = matchValue[1].Fields[1];
                        var t22 = matchValue[1].Fields[2];
                        if (h1 + tree_tolerance < h2) {
                            return tree_rebalance(tree_balance(comparer, t1, k, t21), k2, t22);
                        } else {
                            if (h2 + tree_tolerance < h1) {
                                return tree_rebalance(t11, k1, tree_balance(comparer, t12, k, t2));
                            } else {
                                return tree_mk(t1, k, t2);
                            }
                        }
                    } else {
                        return $target1(matchValue[0]);
                    }
                }
            } else {
                var t2_1 = matchValue[1];
                return tree_add(comparer, k, t2_1);
            }
        }
    }
    function tree_split(comparer, pivot, t) {
        return t.Case === "SetOne" ? function () {
            var c = comparer.Compare(t.Fields[0], pivot);
            if (c < 0) {
                return [t, false, new SetTree("SetEmpty", [])];
            } else {
                if (c === 0) {
                    return [new SetTree("SetEmpty", []), true, new SetTree("SetEmpty", [])];
                } else {
                    return [new SetTree("SetEmpty", []), false, t];
                }
            }
        }() : t.Case === "SetEmpty" ? [new SetTree("SetEmpty", []), false, new SetTree("SetEmpty", [])] : function () {
            var c = comparer.Compare(pivot, t.Fields[0]);
            if (c < 0) {
                var patternInput = tree_split(comparer, pivot, t.Fields[1]);
                var t11Lo = patternInput[0];
                var t11Hi = patternInput[2];
                var havePivot = patternInput[1];
                return [t11Lo, havePivot, tree_balance(comparer, t11Hi, t.Fields[0], t.Fields[2])];
            } else {
                if (c === 0) {
                    return [t.Fields[1], true, t.Fields[2]];
                } else {
                    var patternInput = tree_split(comparer, pivot, t.Fields[2]);
                    var t12Lo = patternInput[0];
                    var t12Hi = patternInput[2];
                    var havePivot = patternInput[1];
                    return [tree_balance(comparer, t.Fields[1], t.Fields[0], t12Lo), havePivot, t12Hi];
                }
            }
        }();
    }
    function tree_spliceOutSuccessor(t) {
        return t.Case === "SetOne" ? [t.Fields[0], new SetTree("SetEmpty", [])] : t.Case === "SetNode" ? t.Fields[1].Case === "SetEmpty" ? [t.Fields[0], t.Fields[2]] : function () {
            var patternInput = tree_spliceOutSuccessor(t.Fields[1]);
            var l_ = patternInput[1];
            var k3 = patternInput[0];
            return [k3, tree_mk(l_, t.Fields[0], t.Fields[2])];
        }() : function () {
            throw new Error("internal error: Map.spliceOutSuccessor");
        }();
    }
    function tree_remove(comparer, k, t) {
        return t.Case === "SetOne" ? function () {
            var c = comparer.Compare(k, t.Fields[0]);
            if (c === 0) {
                return new SetTree("SetEmpty", []);
            } else {
                return t;
            }
        }() : t.Case === "SetNode" ? function () {
            var c = comparer.Compare(k, t.Fields[0]);
            if (c < 0) {
                return tree_rebalance(tree_remove(comparer, k, t.Fields[1]), t.Fields[0], t.Fields[2]);
            } else {
                if (c === 0) {
                    var matchValue = [t.Fields[1], t.Fields[2]];
                    if (matchValue[0].Case === "SetEmpty") {
                        return t.Fields[2];
                    } else {
                        if (matchValue[1].Case === "SetEmpty") {
                            return t.Fields[1];
                        } else {
                            var patternInput = tree_spliceOutSuccessor(t.Fields[2]);
                            var sk = patternInput[0];
                            var r_ = patternInput[1];
                            return tree_mk(t.Fields[1], sk, r_);
                        }
                    }
                } else {
                    return tree_rebalance(t.Fields[1], t.Fields[0], tree_remove(comparer, k, t.Fields[2]));
                }
            }
        }() : t;
    }
    function tree_mem(comparer, k, t) {
        return t.Case === "SetOne" ? comparer.Compare(k, t.Fields[0]) === 0 : t.Case === "SetEmpty" ? false : function () {
            var c = comparer.Compare(k, t.Fields[0]);
            if (c < 0) {
                return tree_mem(comparer, k, t.Fields[1]);
            } else {
                if (c === 0) {
                    return true;
                } else {
                    return tree_mem(comparer, k, t.Fields[2]);
                }
            }
        }();
    }
    function tree_iter(f, t) {
        if (t.Case === "SetOne") {
            f(t.Fields[0]);
        } else {
            if (t.Case === "SetEmpty") {} else {
                tree_iter(f, t.Fields[1]);
                f(t.Fields[0]);
                tree_iter(f, t.Fields[2]);
            }
        }
    }
    function tree_foldBack(f, m, x) {
        return m.Case === "SetOne" ? f(m.Fields[0], x) : m.Case === "SetEmpty" ? x : tree_foldBack(f, m.Fields[1], f(m.Fields[0], tree_foldBack(f, m.Fields[2], x)));
    }
    function tree_fold(f, x, m) {
        return m.Case === "SetOne" ? f(x, m.Fields[0]) : m.Case === "SetEmpty" ? x : function () {
            var x_1 = tree_fold(f, x, m.Fields[1]);
            var x_2 = f(x_1, m.Fields[0]);
            return tree_fold(f, x_2, m.Fields[2]);
        }();
    }
    function tree_forall(f, m) {
        return m.Case === "SetOne" ? f(m.Fields[0]) : m.Case === "SetEmpty" ? true : (f(m.Fields[0]) ? tree_forall(f, m.Fields[1]) : false) ? tree_forall(f, m.Fields[2]) : false;
    }
    function tree_exists(f, m) {
        return m.Case === "SetOne" ? f(m.Fields[0]) : m.Case === "SetEmpty" ? false : (f(m.Fields[0]) ? true : tree_exists(f, m.Fields[1])) ? true : tree_exists(f, m.Fields[2]);
    }
    function tree_isEmpty(m) {
        return m.Case === "SetEmpty" ? true : false;
    }
    function tree_subset(comparer, a, b) {
        return tree_forall(function (x) {
            return tree_mem(comparer, x, b);
        }, a);
    }
    function tree_psubset(comparer, a, b) {
        return tree_forall(function (x) {
            return tree_mem(comparer, x, b);
        }, a) ? tree_exists(function (x) {
            return !tree_mem(comparer, x, a);
        }, b) : false;
    }
    function tree_filterAux(comparer, f, s, acc) {
        return s.Case === "SetOne" ? f(s.Fields[0]) ? tree_add(comparer, s.Fields[0], acc) : acc : s.Case === "SetEmpty" ? acc : function () {
            var acc_1 = f(s.Fields[0]) ? tree_add(comparer, s.Fields[0], acc) : acc;
            return tree_filterAux(comparer, f, s.Fields[1], tree_filterAux(comparer, f, s.Fields[2], acc_1));
        }();
    }
    function tree_filter(comparer, f, s) {
        return tree_filterAux(comparer, f, s, new SetTree("SetEmpty", []));
    }
    function tree_diffAux(comparer, m, acc) {
        return m.Case === "SetOne" ? tree_remove(comparer, m.Fields[0], acc) : m.Case === "SetEmpty" ? acc : tree_diffAux(comparer, m.Fields[1], tree_diffAux(comparer, m.Fields[2], tree_remove(comparer, m.Fields[0], acc)));
    }
    function tree_diff(comparer, a, b) {
        return tree_diffAux(comparer, b, a);
    }
    function tree_union(comparer, t1, t2) {
        var matchValue = [t1, t2];
        var $target2 = function $target2(t) {
            return t;
        };
        var $target3 = function $target3(k1, t2_1) {
            return tree_add(comparer, k1, t2_1);
        };
        if (matchValue[0].Case === "SetEmpty") {
            var t = matchValue[1];
            return t;
        } else {
            if (matchValue[0].Case === "SetOne") {
                if (matchValue[1].Case === "SetEmpty") {
                    return $target2(matchValue[0]);
                } else {
                    if (matchValue[1].Case === "SetOne") {
                        return $target3(matchValue[0].Fields[0], matchValue[1]);
                    } else {
                        return $target3(matchValue[0].Fields[0], matchValue[1]);
                    }
                }
            } else {
                if (matchValue[1].Case === "SetEmpty") {
                    return $target2(matchValue[0]);
                } else {
                    if (matchValue[1].Case === "SetOne") {
                        var k2 = matchValue[1].Fields[0];
                        var t1_1 = matchValue[0];
                        return tree_add(comparer, k2, t1_1);
                    } else {
                        var h1 = matchValue[0].Fields[3];
                        var h2 = matchValue[1].Fields[3];
                        var k1 = matchValue[0].Fields[0];
                        var k2 = matchValue[1].Fields[0];
                        var t11 = matchValue[0].Fields[1];
                        var t12 = matchValue[0].Fields[2];
                        var t21 = matchValue[1].Fields[1];
                        var t22 = matchValue[1].Fields[2];
                        if (h1 > h2) {
                            var patternInput = tree_split(comparer, k1, t2);
                            var lo = patternInput[0];
                            var hi = patternInput[2];
                            return tree_balance(comparer, tree_union(comparer, t11, lo), k1, tree_union(comparer, t12, hi));
                        } else {
                            var patternInput = tree_split(comparer, k2, t1);
                            var lo = patternInput[0];
                            var hi = patternInput[2];
                            return tree_balance(comparer, tree_union(comparer, t21, lo), k2, tree_union(comparer, t22, hi));
                        }
                    }
                }
            }
        }
    }
    function tree_intersectionAux(comparer, b, m, acc) {
        return m.Case === "SetOne" ? tree_mem(comparer, m.Fields[0], b) ? tree_add(comparer, m.Fields[0], acc) : acc : m.Case === "SetEmpty" ? acc : function () {
            var acc_1 = tree_intersectionAux(comparer, b, m.Fields[2], acc);
            var acc_2 = tree_mem(comparer, m.Fields[0], b) ? tree_add(comparer, m.Fields[0], acc_1) : acc_1;
            return tree_intersectionAux(comparer, b, m.Fields[1], acc_2);
        }();
    }
    function tree_intersection(comparer, a, b) {
        return tree_intersectionAux(comparer, b, a, new SetTree("SetEmpty", []));
    }
    function tree_partition1(comparer, f, k, acc1, acc2) {
        return f(k) ? [tree_add(comparer, k, acc1), acc2] : [acc1, tree_add(comparer, k, acc2)];
    }
    function tree_partitionAux(comparer, f, s, acc_0, acc_1) {
        var acc = [acc_0, acc_1];
        if (s.Case === "SetOne") {
            var acc1 = acc[0];
            var acc2 = acc[1];
            return tree_partition1(comparer, f, s.Fields[0], acc1, acc2);
        } else {
            if (s.Case === "SetEmpty") {
                return acc;
            } else {
                var acc_2 = function () {
                    var arg30_ = acc[0];
                    var arg31_ = acc[1];
                    return tree_partitionAux(comparer, f, s.Fields[2], arg30_, arg31_);
                }();
                var acc_3 = function () {
                    var acc1 = acc_2[0];
                    var acc2 = acc_2[1];
                    return tree_partition1(comparer, f, s.Fields[0], acc1, acc2);
                }();
                var arg30_ = acc_3[0];
                var arg31_ = acc_3[1];
                return tree_partitionAux(comparer, f, s.Fields[1], arg30_, arg31_);
            }
        }
    }
    function tree_partition(comparer, f, s) {
        var seed = [new SetTree("SetEmpty", []), new SetTree("SetEmpty", [])];
        var arg30_ = seed[0];
        var arg31_ = seed[1];
        return tree_partitionAux(comparer, f, s, arg30_, arg31_);
    }
    // function tree_$MatchSetNode$MatchSetEmpty$(s: SetTree) {
    //   return s.Case === "SetOne" ? new Choice("Choice1Of2", [[s.Fields[0], new SetTree("SetEmpty", []), new SetTree("SetEmpty", [])]]) : s.Case === "SetEmpty" ? new Choice("Choice2Of2", [null]) : new Choice("Choice1Of2", [[s.Fields[0], s.Fields[1], s.Fields[2]]]);
    // }
    function tree_minimumElementAux(s, n) {
        return s.Case === "SetOne" ? s.Fields[0] : s.Case === "SetEmpty" ? n : tree_minimumElementAux(s.Fields[1], s.Fields[0]);
    }
    function tree_minimumElementOpt(s) {
        return s.Case === "SetOne" ? s.Fields[0] : s.Case === "SetEmpty" ? null : tree_minimumElementAux(s.Fields[1], s.Fields[0]);
    }
    function tree_maximumElementAux(s, n) {
        return s.Case === "SetOne" ? s.Fields[0] : s.Case === "SetEmpty" ? n : tree_maximumElementAux(s.Fields[2], s.Fields[0]);
    }
    function tree_maximumElementOpt(s) {
        return s.Case === "SetOne" ? s.Fields[0] : s.Case === "SetEmpty" ? null : tree_maximumElementAux(s.Fields[2], s.Fields[0]);
    }
    function tree_minimumElement(s) {
        var matchValue = tree_minimumElementOpt(s);
        if (matchValue == null) {
            throw new Error("Set contains no elements");
        } else {
            return matchValue;
        }
    }
    function tree_maximumElement(s) {
        var matchValue = tree_maximumElementOpt(s);
        if (matchValue == null) {
            throw new Error("Set contains no elements");
        } else {
            return matchValue;
        }
    }
    function tree_collapseLHS(stack) {
        return stack.tail != null ? stack.head.Case === "SetOne" ? stack : stack.head.Case === "SetNode" ? tree_collapseLHS((0, _List.ofArray)([stack.head.Fields[1], tree_SetOne(stack.head.Fields[0]), stack.head.Fields[2]], stack.tail)) : tree_collapseLHS(stack.tail) : new _List2.default();
    }
    function tree_mkIterator(s) {
        return { stack: tree_collapseLHS(new _List2.default(s, new _List2.default())), started: false };
    }
    ;
    // function tree_notStarted() {
    //   throw new Error("Enumeration not started");
    // };
    // var alreadyFinished = $exports.alreadyFinished = function () {
    //   throw new Error("Enumeration already started");
    // };
    function tree_moveNext(i) {
        function current(i) {
            if (i.stack.tail == null) {
                return null;
            } else if (i.stack.head.Case === "SetOne") {
                return i.stack.head.Fields[0];
            }
            throw new Error("Please report error: Set iterator, unexpected stack for current");
        }
        if (i.started) {
            if (i.stack.tail == null) {
                return { done: true, value: null };
            } else {
                if (i.stack.head.Case === "SetOne") {
                    i.stack = tree_collapseLHS(i.stack.tail);
                    return {
                        done: i.stack.tail == null,
                        value: current(i)
                    };
                } else {
                    throw new Error("Please report error: Set iterator, unexpected stack for moveNext");
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
    function tree_compareStacks(comparer, l1, l2) {
        var $target8 = function $target8(n1k, t1) {
            return tree_compareStacks(comparer, (0, _List.ofArray)([new SetTree("SetEmpty", []), tree_SetOne(n1k)], t1), l2);
        };
        var $target9 = function $target9(n1k, n1l, n1r, t1) {
            return tree_compareStacks(comparer, (0, _List.ofArray)([n1l, tree_SetNode(n1k, new SetTree("SetEmpty", []), n1r, 0)], t1), l2);
        };
        var $target11 = function $target11(n2k, n2l, n2r, t2) {
            return tree_compareStacks(comparer, l1, (0, _List.ofArray)([n2l, tree_SetNode(n2k, new SetTree("SetEmpty", []), n2r, 0)], t2));
        };
        if (l1.tail != null) {
            if (l2.tail != null) {
                if (l2.head.Case === "SetOne") {
                    if (l1.head.Case === "SetOne") {
                        var n1k = l1.head.Fields[0],
                            n2k = l2.head.Fields[0],
                            t1 = l1.tail,
                            t2 = l2.tail,
                            c = comparer.Compare(n1k, n2k);
                        if (c !== 0) {
                            return c;
                        } else {
                            return tree_compareStacks(comparer, t1, t2);
                        }
                    } else {
                        if (l1.head.Case === "SetNode") {
                            if (l1.head.Fields[1].Case === "SetEmpty") {
                                var emp = l1.head.Fields[1],
                                    _n1k = l1.head.Fields[0],
                                    n1r = l1.head.Fields[2],
                                    _n2k = l2.head.Fields[0],
                                    _t = l1.tail,
                                    _t2 = l2.tail,
                                    _c = comparer.Compare(_n1k, _n2k);
                                if (_c !== 0) {
                                    return _c;
                                } else {
                                    return tree_compareStacks(comparer, (0, _List.ofArray)([n1r], _t), (0, _List.ofArray)([emp], _t2));
                                }
                            } else {
                                return $target9(l1.head.Fields[0], l1.head.Fields[1], l1.head.Fields[2], l1.tail);
                            }
                        } else {
                            var _n2k2 = l2.head.Fields[0],
                                _t3 = l2.tail;
                            return tree_compareStacks(comparer, l1, (0, _List.ofArray)([new SetTree("SetEmpty", []), tree_SetOne(_n2k2)], _t3));
                        }
                    }
                } else {
                    if (l2.head.Case === "SetNode") {
                        if (l2.head.Fields[1].Case === "SetEmpty") {
                            if (l1.head.Case === "SetOne") {
                                var _n1k2 = l1.head.Fields[0],
                                    _n2k3 = l2.head.Fields[0],
                                    n2r = l2.head.Fields[2],
                                    _t4 = l1.tail,
                                    _t5 = l2.tail,
                                    _c2 = comparer.Compare(_n1k2, _n2k3);
                                if (_c2 !== 0) {
                                    return _c2;
                                } else {
                                    return tree_compareStacks(comparer, (0, _List.ofArray)([new SetTree("SetEmpty", [])], _t4), (0, _List.ofArray)([n2r], _t5));
                                }
                            } else {
                                if (l1.head.Case === "SetNode") {
                                    if (l1.head.Fields[1].Case === "SetEmpty") {
                                        var _n1k3 = l1.head.Fields[0],
                                            _n1r = l1.head.Fields[2],
                                            _n2k4 = l2.head.Fields[0],
                                            _n2r = l2.head.Fields[2],
                                            _t6 = l1.tail,
                                            _t7 = l2.tail,
                                            _c3 = comparer.Compare(_n1k3, _n2k4);
                                        if (_c3 !== 0) {
                                            return _c3;
                                        } else {
                                            return tree_compareStacks(comparer, (0, _List.ofArray)([_n1r], _t6), (0, _List.ofArray)([_n2r], _t7));
                                        }
                                    } else {
                                        return $target9(l1.head.Fields[0], l1.head.Fields[1], l1.head.Fields[2], l1.tail);
                                    }
                                } else {
                                    return $target11(l2.head.Fields[0], l2.head.Fields[1], l2.head.Fields[2], l2.tail);
                                }
                            }
                        } else {
                            if (l1.head.Case === "SetOne") {
                                return $target8(l1.head.Fields[0], l1.tail);
                            } else {
                                if (l1.head.Case === "SetNode") {
                                    return $target9(l1.head.Fields[0], l1.head.Fields[1], l1.head.Fields[2], l1.tail);
                                } else {
                                    return $target11(l2.head.Fields[0], l2.head.Fields[1], l2.head.Fields[2], l2.tail);
                                }
                            }
                        }
                    } else {
                        if (l1.head.Case === "SetOne") {
                            return $target8(l1.head.Fields[0], l1.tail);
                        } else {
                            if (l1.head.Case === "SetNode") {
                                return $target9(l1.head.Fields[0], l1.head.Fields[1], l1.head.Fields[2], l1.tail);
                            } else {
                                return tree_compareStacks(comparer, l1.tail, l2.tail);
                            }
                        }
                    }
                }
            } else {
                return 1;
            }
        } else {
            if (l2.tail != null) {
                return -1;
            } else {
                return 0;
            }
        }
    }
    function tree_compare(comparer, s1, s2) {
        if (s1.Case === "SetEmpty") {
            if (s2.Case === "SetEmpty") {
                return 0;
            } else {
                return -1;
            }
        } else {
            if (s2.Case === "SetEmpty") {
                return 1;
            } else {
                return tree_compareStacks(comparer, (0, _List.ofArray)([s1]), (0, _List.ofArray)([s2]));
            }
        }
    }
    function tree_mkFromEnumerator(comparer, acc, e) {
        var cur = e.next();
        while (!cur.done) {
            acc = tree_add(comparer, cur.value, acc);
            cur = e.next();
        }
        return acc;
    }
    function tree_ofSeq(comparer, c) {
        var ie = c[Symbol.iterator]();
        return tree_mkFromEnumerator(comparer, new SetTree("SetEmpty", []), ie);
    }

    var FSet = function () {
        /** Do not call, use Set.create instead. */
        function FSet() {
            _classCallCheck(this, FSet);
        }

        _createClass(FSet, [{
            key: "ToString",
            value: function ToString() {
                return "set [" + Array.from(this).map(_Util.toString).join("; ") + "]";
            }
        }, {
            key: "Equals",
            value: function Equals(s2) {
                return this.CompareTo(s2) === 0;
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(s2) {
                return this === s2 ? 0 : tree_compare(this.comparer, this.tree, s2.tree);
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
            key: "values",
            value: function values() {
                return this[Symbol.iterator]();
            }
        }, {
            key: "has",
            value: function has(v) {
                return tree_mem(this.comparer, v, this.tree);
            }
        }, {
            key: "add",
            value: function add(v) {
                throw new Error("not supported");
            }
        }, {
            key: "delete",
            value: function _delete(v) {
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
                    type: "Microsoft.FSharp.Collections.FSharpSet",
                    interfaces: ["System.IEquatable", "System.IComparable"]
                };
            }
        }, {
            key: "size",
            get: function get() {
                return tree_count(this.tree);
            }
        }]);

        return FSet;
    }();

    exports.default = FSet;

    function from(comparer, tree) {
        var s = new FSet();
        s.tree = tree;
        s.comparer = comparer || new _GenericComparer2.default();
        return s;
    }
    function create(ie, comparer) {
        comparer = comparer || new _GenericComparer2.default();
        return from(comparer, ie ? tree_ofSeq(comparer, ie) : new SetTree("SetEmpty", []));
    }
    function isEmpty(s) {
        return tree_isEmpty(s.tree);
    }
    function add(item, s) {
        return from(s.comparer, tree_add(s.comparer, item, s.tree));
    }
    function addInPlace(item, s) {
        return s.has(item) ? false : (s.add(item), true);
    }
    function remove(item, s) {
        return from(s.comparer, tree_remove(s.comparer, item, s.tree));
    }
    function union(set1, set2) {
        return set2.tree.Case === "SetEmpty" ? set1 : set1.tree.Case === "SetEmpty" ? set2 : from(set1.comparer, tree_union(set1.comparer, set1.tree, set2.tree));
    }
    function op_Addition(set1, set2) {
        return union(set1, set2);
    }
    function unionInPlace(set1, set2) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = set2[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var x = _step.value;

                set1.add(x);
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
    }
    function unionMany(sets) {
        // Pass args as union(s, acc) instead of union(acc, s)
        // to discard the comparer of the first empty set
        return (0, _Seq.fold)(function (acc, s) {
            return union(s, acc);
        }, create(), sets);
    }
    function difference(set1, set2) {
        return set1.tree.Case === "SetEmpty" ? set1 : set2.tree.Case === "SetEmpty" ? set1 : from(set1.comparer, tree_diff(set1.comparer, set1.tree, set2.tree));
    }
    function op_Subtraction(set1, set2) {
        return difference(set1, set2);
    }
    function differenceInPlace(set1, set2) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = set2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var x = _step2.value;

                set1.delete(x);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }
    function intersect(set1, set2) {
        return set2.tree.Case === "SetEmpty" ? set2 : set1.tree.Case === "SetEmpty" ? set1 : from(set1.comparer, tree_intersection(set1.comparer, set1.tree, set2.tree));
    }
    function intersectInPlace(set1, set2) {
        var set2_ = set2 instanceof Set ? set2 : new Set(set2);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = set1[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var x = _step3.value;

                if (!set2_.has(x)) {
                    set1.delete(x);
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }
    function intersectMany(sets) {
        return (0, _Seq.reduce)(function (s1, s2) {
            return intersect(s1, s2);
        }, sets);
    }
    function isProperSubsetOf(set1, set2) {
        if (set1 instanceof FSet && set2 instanceof FSet) {
            return tree_psubset(set1.comparer, set1.tree, set2.tree);
        } else {
            set2 = set2 instanceof Set ? set2 : new Set(set2);
            return (0, _Seq.forAll)(function (x) {
                return set2.has(x);
            }, set1) && (0, _Seq.exists)(function (x) {
                return !set1.has(x);
            }, set2);
        }
    }
    function isProperSubset(set1, set2) {
        return isProperSubsetOf(set1, set2);
    }
    function isSubsetOf(set1, set2) {
        if (set1 instanceof FSet && set2 instanceof FSet) {
            return tree_subset(set1.comparer, set1.tree, set2.tree);
        } else {
            set2 = set2 instanceof Set ? set2 : new Set(set2);
            return (0, _Seq.forAll)(function (x) {
                return set2.has(x);
            }, set1);
        }
    }
    function isSubset(set1, set2) {
        return isSubsetOf(set1, set2);
    }
    function isProperSupersetOf(set1, set2) {
        if (set1 instanceof FSet && set2 instanceof FSet) {
            return tree_psubset(set1.comparer, set2.tree, set1.tree);
        } else {
            return isProperSubset(set2 instanceof Set ? set2 : new Set(set2), set1);
        }
    }
    function isProperSuperset(set1, set2) {
        return isProperSupersetOf(set1, set2);
    }
    function isSupersetOf(set1, set2) {
        if (set1 instanceof FSet && set2 instanceof FSet) {
            return tree_subset(set1.comparer, set2.tree, set1.tree);
        } else {
            return isSubset(set2 instanceof Set ? set2 : new Set(set2), set1);
        }
    }
    function isSuperset(set1, set2) {
        return isSupersetOf(set1, set2);
    }
    function copyTo(xs, arr, arrayIndex, count) {
        if (!Array.isArray(arr) && !ArrayBuffer.isView(arr)) throw new Error("Array is invalid");
        count = count || arr.length;
        var i = arrayIndex || 0;
        var iter = xs[Symbol.iterator]();
        while (count--) {
            var el = iter.next();
            if (el.done) break;
            arr[i++] = el.value;
        }
    }
    function partition(f, s) {
        if (s.tree.Case === "SetEmpty") {
            return [s, s];
        } else {
            var tuple = tree_partition(s.comparer, f, s.tree);
            return [from(s.comparer, tuple[0]), from(s.comparer, tuple[1])];
        }
    }
    function filter(f, s) {
        if (s.tree.Case === "SetEmpty") {
            return s;
        } else {
            return from(s.comparer, tree_filter(s.comparer, f, s.tree));
        }
    }
    function map(f, s) {
        var comparer = new _GenericComparer2.default();
        return from(comparer, tree_fold(function (acc, k) {
            return tree_add(comparer, f(k), acc);
        }, new SetTree("SetEmpty", []), s.tree));
    }
    function exists(f, s) {
        return tree_exists(f, s.tree);
    }
    function forAll(f, s) {
        return tree_forall(f, s.tree);
    }
    function fold(f, seed, s) {
        return tree_fold(f, seed, s.tree);
    }
    function foldBack(f, s, seed) {
        return tree_foldBack(f, s.tree, seed);
    }
    function iterate(f, s) {
        tree_iter(f, s.tree);
    }
    function minimumElement(s) {
        return tree_minimumElement(s.tree);
    }
    function minElement(s) {
        return tree_minimumElement(s.tree);
    }
    function maximumElement(s) {
        return tree_maximumElement(s.tree);
    }
    function maxElement(s) {
        return tree_maximumElement(s.tree);
    }
});