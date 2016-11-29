(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Util", "./Array", "./ListClass"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Util"), require("./Array"), require("./ListClass"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Util, global.Array, global.ListClass);
        global.Seq = mod.exports;
    }
})(this, function (exports, _Util, _Array, _ListClass) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.toList = toList;
    exports.ofList = ofList;
    exports.ofArray = ofArray;
    exports.append = append;
    exports.average = average;
    exports.averageBy = averageBy;
    exports.concat = concat;
    exports.collect = collect;
    exports.choose = choose;
    exports.compareWith = compareWith;
    exports.delay = delay;
    exports.empty = empty;
    exports.enumerateWhile = enumerateWhile;
    exports.enumerateThenFinally = enumerateThenFinally;
    exports.enumerateUsing = enumerateUsing;
    exports.exactlyOne = exactlyOne;
    exports.except = except;
    exports.exists = exists;
    exports.exists2 = exists2;
    exports.filter = filter;
    exports.where = where;
    exports.fold = fold;
    exports.foldBack = foldBack;
    exports.fold2 = fold2;
    exports.foldBack2 = foldBack2;
    exports.forAll = forAll;
    exports.forAll2 = forAll2;
    exports.tryHead = tryHead;
    exports.head = head;
    exports.initialize = initialize;
    exports.initializeInfinite = initializeInfinite;
    exports.tryItem = tryItem;
    exports.item = item;
    exports.iterate = iterate;
    exports.iterate2 = iterate2;
    exports.iterateIndexed = iterateIndexed;
    exports.iterateIndexed2 = iterateIndexed2;
    exports.isEmpty = isEmpty;
    exports.tryLast = tryLast;
    exports.last = last;
    exports.count = count;
    exports.map = map;
    exports.mapIndexed = mapIndexed;
    exports.map2 = map2;
    exports.mapIndexed2 = mapIndexed2;
    exports.map3 = map3;
    exports.mapFold = mapFold;
    exports.mapFoldBack = mapFoldBack;
    exports.max = max;
    exports.maxBy = maxBy;
    exports.min = min;
    exports.minBy = minBy;
    exports.pairwise = pairwise;
    exports.permute = permute;
    exports.rangeStep = rangeStep;
    exports.rangeChar = rangeChar;
    exports.range = range;
    exports.readOnly = readOnly;
    exports.reduce = reduce;
    exports.reduceBack = reduceBack;
    exports.replicate = replicate;
    exports.reverse = reverse;
    exports.scan = scan;
    exports.scanBack = scanBack;
    exports.singleton = singleton;
    exports.skip = skip;
    exports.skipWhile = skipWhile;
    exports.sortWith = sortWith;
    exports.sum = sum;
    exports.sumBy = sumBy;
    exports.tail = tail;
    exports.take = take;
    exports.truncate = truncate;
    exports.takeWhile = takeWhile;
    exports.tryFind = tryFind;
    exports.find = find;
    exports.tryFindBack = tryFindBack;
    exports.findBack = findBack;
    exports.tryFindIndex = tryFindIndex;
    exports.findIndex = findIndex;
    exports.tryFindIndexBack = tryFindIndexBack;
    exports.findIndexBack = findIndexBack;
    exports.tryPick = tryPick;
    exports.pick = pick;
    exports.unfold = unfold;
    exports.zip = zip;
    exports.zip3 = zip3;

    var _ListClass2 = _interopRequireDefault(_ListClass);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

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

    function __failIfNone(res) {
        if (res == null) throw new Error("Seq did not contain any matching element");
        return res;
    }
    function toList(xs) {
        return foldBack(function (x, acc) {
            return new _ListClass2.default(x, acc);
        }, xs, new _ListClass2.default());
    }
    function ofList(xs) {
        return delay(function () {
            return unfold(function (x) {
                return x.tail != null ? [x.head, x.tail] : null;
            }, xs);
        });
    }
    function ofArray(xs) {
        return delay(function () {
            return unfold(function (i) {
                return i < xs.length ? [xs[i], i + 1] : null;
            }, 0);
        });
    }
    function append(xs, ys) {
        return delay(function () {
            var firstDone = false;
            var i = xs[Symbol.iterator]();
            var iters = [i, null];
            return unfold(function () {
                var cur = void 0;
                if (!firstDone) {
                    cur = iters[0].next();
                    if (!cur.done) {
                        return [cur.value, iters];
                    } else {
                        firstDone = true;
                        iters = [null, ys[Symbol.iterator]()];
                    }
                }
                cur = iters[1].next();
                return !cur.done ? [cur.value, iters] : null;
            }, iters);
        });
    }
    function average(xs) {
        var count = 1;
        var sum = reduce(function (acc, x) {
            count++;
            return acc + x;
        }, xs);
        return sum / count;
    }
    function averageBy(f, xs) {
        var count = 1;
        var sum = reduce(function (acc, x) {
            count++;
            return (count === 2 ? f(acc) : acc) + f(x);
        }, xs);
        return sum / count;
    }
    function concat(xs) {
        return delay(function () {
            var iter = xs[Symbol.iterator]();
            var output = null;
            return unfold(function (innerIter) {
                var hasFinished = false;
                while (!hasFinished) {
                    if (innerIter == null) {
                        var cur = iter.next();
                        if (!cur.done) {
                            innerIter = cur.value[Symbol.iterator]();
                        } else {
                            hasFinished = true;
                        }
                    } else {
                        var _cur = innerIter.next();
                        if (!_cur.done) {
                            output = _cur.value;
                            hasFinished = true;
                        } else {
                            innerIter = null;
                        }
                    }
                }
                return innerIter != null && output != null ? [output, innerIter] : null;
            }, null);
        });
    }
    function collect(f, xs) {
        return concat(map(f, xs));
    }
    function choose(f, xs) {
        var trySkipToNext = function trySkipToNext(iter) {
            var cur = iter.next();
            if (!cur.done) {
                var y = f(cur.value);
                return y != null ? [y, iter] : trySkipToNext(iter);
            }
            return void 0;
        };
        return delay(function () {
            return unfold(function (iter) {
                return trySkipToNext(iter);
            }, xs[Symbol.iterator]());
        });
    }
    function compareWith(f, xs, ys) {
        var nonZero = tryFind(function (i) {
            return i != 0;
        }, map2(function (x, y) {
            return f(x, y);
        }, xs, ys));
        return nonZero != null ? nonZero : count(xs) - count(ys);
    }
    function delay(f) {
        return _defineProperty({}, Symbol.iterator, function () {
            return f()[Symbol.iterator]();
        });
    }
    function empty() {
        return unfold(function () {
            return void 0;
        });
    }
    function enumerateWhile(cond, xs) {
        return concat(unfold(function () {
            return cond() ? [xs, true] : null;
        }));
    }
    function enumerateThenFinally(xs, finalFn) {
        return delay(function () {
            var iter = void 0;
            try {
                iter = xs[Symbol.iterator]();
            } catch (err) {
                return void 0;
            } finally {
                finalFn();
            }
            return unfold(function (iter) {
                try {
                    var cur = iter.next();
                    return !cur.done ? [cur.value, iter] : null;
                } catch (err) {
                    return void 0;
                } finally {
                    finalFn();
                }
            }, iter);
        });
    }
    function enumerateUsing(disp, work) {
        var isDisposed = false;
        var disposeOnce = function disposeOnce() {
            if (!isDisposed) {
                isDisposed = true;
                disp.Dispose();
            }
        };
        try {
            return enumerateThenFinally(work(disp), disposeOnce);
        } catch (err) {
            return void 0;
        } finally {
            disposeOnce();
        }
    }
    function exactlyOne(xs) {
        var iter = xs[Symbol.iterator]();
        var fst = iter.next();
        if (fst.done) throw new Error("Seq was empty");
        var snd = iter.next();
        if (!snd.done) throw new Error("Seq had multiple items");
        return fst.value;
    }
    function except(itemsToExclude, source) {
        var exclusionItems = Array.from(itemsToExclude);
        var testIsNotInExclusionItems = function testIsNotInExclusionItems(element) {
            return !exclusionItems.some(function (excludedItem) {
                return (0, _Util.equals)(excludedItem, element);
            });
        };
        return filter(testIsNotInExclusionItems, source);
    }
    function exists(f, xs) {
        function aux(iter) {
            var cur = iter.next();
            return !cur.done && (f(cur.value) || aux(iter));
        }
        return aux(xs[Symbol.iterator]());
    }
    function exists2(f, xs, ys) {
        function aux(iter1, iter2) {
            var cur1 = iter1.next(),
                cur2 = iter2.next();
            return !cur1.done && !cur2.done && (f(cur1.value, cur2.value) || aux(iter1, iter2));
        }
        return aux(xs[Symbol.iterator](), ys[Symbol.iterator]());
    }
    function filter(f, xs) {
        function trySkipToNext(iter) {
            var cur = iter.next();
            while (!cur.done) {
                if (f(cur.value)) {
                    return [cur.value, iter];
                }
                cur = iter.next();
            }
            return void 0;
        }
        return delay(function () {
            return unfold(trySkipToNext, xs[Symbol.iterator]());
        });
    }
    function where(f, xs) {
        return filter(f, xs);
    }
    function fold(f, acc, xs) {
        if (Array.isArray(xs) || ArrayBuffer.isView(xs)) {
            return xs.reduce(f, acc);
        } else {
            var cur = void 0;
            for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
                cur = iter.next();
                if (cur.done) break;
                acc = f(acc, cur.value, i);
            }
            return acc;
        }
    }
    function foldBack(f, xs, acc) {
        var arr = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
        for (var i = arr.length - 1; i >= 0; i--) {
            acc = f(arr[i], acc, i);
        }
        return acc;
    }
    function fold2(f, acc, xs, ys) {
        var iter1 = xs[Symbol.iterator](),
            iter2 = ys[Symbol.iterator]();
        var cur1 = void 0,
            cur2 = void 0;
        for (var i = 0;; i++) {
            cur1 = iter1.next();
            cur2 = iter2.next();
            if (cur1.done || cur2.done) {
                break;
            }
            acc = f(acc, cur1.value, cur2.value, i);
        }
        return acc;
    }
    function foldBack2(f, xs, ys, acc) {
        var ar1 = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
        var ar2 = Array.isArray(ys) || ArrayBuffer.isView(ys) ? ys : Array.from(ys);
        for (var i = ar1.length - 1; i >= 0; i--) {
            acc = f(ar1[i], ar2[i], acc, i);
        }
        return acc;
    }
    function forAll(f, xs) {
        return fold(function (acc, x) {
            return acc && f(x);
        }, true, xs);
    }
    function forAll2(f, xs, ys) {
        return fold2(function (acc, x, y) {
            return acc && f(x, y);
        }, true, xs, ys);
    }
    function tryHead(xs) {
        var iter = xs[Symbol.iterator]();
        var cur = iter.next();
        return cur.done ? null : cur.value;
    }
    function head(xs) {
        return __failIfNone(tryHead(xs));
    }
    function initialize(n, f) {
        return delay(function () {
            return unfold(function (i) {
                return i < n ? [f(i), i + 1] : null;
            }, 0);
        });
    }
    function initializeInfinite(f) {
        return delay(function () {
            return unfold(function (i) {
                return [f(i), i + 1];
            }, 0);
        });
    }
    function tryItem(i, xs) {
        if (i < 0) return null;
        if (Array.isArray(xs) || ArrayBuffer.isView(xs)) return i < xs.length ? xs[i] : null;
        for (var j = 0, iter = xs[Symbol.iterator]();; j++) {
            var cur = iter.next();
            if (cur.done) return null;
            if (j === i) return cur.value;
        }
    }
    function item(i, xs) {
        return __failIfNone(tryItem(i, xs));
    }
    function iterate(f, xs) {
        fold(function (_, x) {
            return f(x);
        }, null, xs);
    }
    function iterate2(f, xs, ys) {
        fold2(function (_, x, y) {
            return f(x, y);
        }, null, xs, ys);
    }
    function iterateIndexed(f, xs) {
        fold(function (_, x, i) {
            return f(i, x);
        }, null, xs);
    }
    function iterateIndexed2(f, xs, ys) {
        fold2(function (_, x, y, i) {
            return f(i, x, y);
        }, null, xs, ys);
    }
    function isEmpty(xs) {
        var i = xs[Symbol.iterator]();
        return i.next().done;
    }
    function tryLast(xs) {
        try {
            return reduce(function (_, x) {
                return x;
            }, xs);
        } catch (err) {
            return null;
        }
    }
    function last(xs) {
        return __failIfNone(tryLast(xs));
    }
    // A export function 'length' method causes problems in JavaScript -- https://github.com/Microsoft/TypeScript/issues/442
    function count(xs) {
        return Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs.length : fold(function (acc, x) {
            return acc + 1;
        }, 0, xs);
    }
    function map(f, xs) {
        return delay(function () {
            return unfold(function (iter) {
                var cur = iter.next();
                return !cur.done ? [f(cur.value), iter] : null;
            }, xs[Symbol.iterator]());
        });
    }
    function mapIndexed(f, xs) {
        return delay(function () {
            var i = 0;
            return unfold(function (iter) {
                var cur = iter.next();
                return !cur.done ? [f(i++, cur.value), iter] : null;
            }, xs[Symbol.iterator]());
        });
    }
    function map2(f, xs, ys) {
        return delay(function () {
            var iter1 = xs[Symbol.iterator]();
            var iter2 = ys[Symbol.iterator]();
            return unfold(function () {
                var cur1 = iter1.next(),
                    cur2 = iter2.next();
                return !cur1.done && !cur2.done ? [f(cur1.value, cur2.value), null] : null;
            });
        });
    }
    function mapIndexed2(f, xs, ys) {
        return delay(function () {
            var i = 0;
            var iter1 = xs[Symbol.iterator]();
            var iter2 = ys[Symbol.iterator]();
            return unfold(function () {
                var cur1 = iter1.next(),
                    cur2 = iter2.next();
                return !cur1.done && !cur2.done ? [f(i++, cur1.value, cur2.value), null] : null;
            });
        });
    }
    function map3(f, xs, ys, zs) {
        return delay(function () {
            var iter1 = xs[Symbol.iterator]();
            var iter2 = ys[Symbol.iterator]();
            var iter3 = zs[Symbol.iterator]();
            return unfold(function () {
                var cur1 = iter1.next(),
                    cur2 = iter2.next(),
                    cur3 = iter3.next();
                return !cur1.done && !cur2.done && !cur3.done ? [f(cur1.value, cur2.value, cur3.value), null] : null;
            });
        });
    }
    function mapFold(f, acc, xs) {
        var result = [];
        var r = void 0;
        var cur = void 0;
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            cur = iter.next();
            if (cur.done) break;

            var _f = f(acc, cur.value);

            var _f2 = _slicedToArray(_f, 2);

            r = _f2[0];
            acc = _f2[1];

            result.push(r);
        }
        return [result, acc];
    }
    function mapFoldBack(f, xs, acc) {
        var arr = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
        var result = [];
        var r = void 0;
        for (var i = arr.length - 1; i >= 0; i--) {
            var _f3 = f(arr[i], acc);

            var _f4 = _slicedToArray(_f3, 2);

            r = _f4[0];
            acc = _f4[1];

            result.push(r);
        }
        return [result, acc];
    }
    function max(xs) {
        return reduce(function (acc, x) {
            return (0, _Util.compare)(acc, x) === 1 ? acc : x;
        }, xs);
    }
    function maxBy(f, xs) {
        return reduce(function (acc, x) {
            return (0, _Util.compare)(f(acc), f(x)) === 1 ? acc : x;
        }, xs);
    }
    function min(xs) {
        return reduce(function (acc, x) {
            return (0, _Util.compare)(acc, x) === -1 ? acc : x;
        }, xs);
    }
    function minBy(f, xs) {
        return reduce(function (acc, x) {
            return (0, _Util.compare)(f(acc), f(x)) === -1 ? acc : x;
        }, xs);
    }
    function pairwise(xs) {
        return skip(2, scan(function (last, next) {
            return [last[1], next];
        }, [0, 0], xs));
    }
    function permute(f, xs) {
        return ofArray((0, _Array.permute)(f, Array.from(xs)));
    }
    function rangeStep(first, step, last) {
        if (step === 0) throw new Error("Step cannot be 0");
        return delay(function () {
            return unfold(function (x) {
                return step > 0 && x <= last || step < 0 && x >= last ? [x, x + step] : null;
            }, first);
        });
    }
    function rangeChar(first, last) {
        return delay(function () {
            return unfold(function (x) {
                return x <= last ? [x, String.fromCharCode(x.charCodeAt(0) + 1)] : null;
            }, first);
        });
    }
    function range(first, last) {
        return rangeStep(first, 1, last);
    }
    function readOnly(xs) {
        return map(function (x) {
            return x;
        }, xs);
    }
    function reduce(f, xs) {
        if (Array.isArray(xs) || ArrayBuffer.isView(xs)) return xs.reduce(f);
        var iter = xs[Symbol.iterator]();
        var cur = iter.next();
        if (cur.done) throw new Error("Seq was empty");
        var acc = cur.value;
        for (;;) {
            cur = iter.next();
            if (cur.done) break;
            acc = f(acc, cur.value);
        }
        return acc;
    }
    function reduceBack(f, xs) {
        var ar = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
        if (ar.length === 0) throw new Error("Seq was empty");
        var acc = ar[ar.length - 1];
        for (var i = ar.length - 2; i >= 0; i--) {
            acc = f(ar[i], acc, i);
        }return acc;
    }
    function replicate(n, x) {
        return initialize(n, function () {
            return x;
        });
    }
    function reverse(xs) {
        var ar = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs.slice(0) : Array.from(xs);
        return ofArray(ar.reverse());
    }
    function scan(f, seed, xs) {
        return delay(function () {
            var iter = xs[Symbol.iterator]();
            return unfold(function (acc) {
                if (acc == null) return [seed, seed];
                var cur = iter.next();
                if (!cur.done) {
                    acc = f(acc, cur.value);
                    return [acc, acc];
                }
                return void 0;
            }, null);
        });
    }
    function scanBack(f, xs, seed) {
        return reverse(scan(function (acc, x) {
            return f(x, acc);
        }, seed, reverse(xs)));
    }
    function singleton(x) {
        return unfold(function (x) {
            return x != null ? [x, null] : null;
        }, x);
    }
    function skip(n, xs) {
        return _defineProperty({}, Symbol.iterator, function () {
            var iter = xs[Symbol.iterator]();
            for (var i = 1; i <= n; i++) {
                if (iter.next().done) throw new Error("Seq has not enough elements");
            }return iter;
        });
    }
    function skipWhile(f, xs) {
        return delay(function () {
            var hasPassed = false;
            return filter(function (x) {
                return hasPassed || (hasPassed = !f(x));
            }, xs);
        });
    }
    function sortWith(f, xs) {
        var ys = Array.from(xs);
        return ofArray(ys.sort(f));
    }
    function sum(xs) {
        return fold(function (acc, x) {
            return acc + x;
        }, 0, xs);
    }
    function sumBy(f, xs) {
        return fold(function (acc, x) {
            return acc + f(x);
        }, 0, xs);
    }
    function tail(xs) {
        var iter = xs[Symbol.iterator]();
        var cur = iter.next();
        if (cur.done) throw new Error("Seq was empty");
        return _defineProperty({}, Symbol.iterator, function () {
            return iter;
        });
    }
    function take(n, xs) {
        var truncate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        return delay(function () {
            var iter = xs[Symbol.iterator]();
            return unfold(function (i) {
                if (i < n) {
                    var cur = iter.next();
                    if (!cur.done) return [cur.value, i + 1];
                    if (!truncate) throw new Error("Seq has not enough elements");
                }
                return void 0;
            }, 0);
        });
    }
    function truncate(n, xs) {
        return take(n, xs, true);
    }
    function takeWhile(f, xs) {
        return delay(function () {
            var iter = xs[Symbol.iterator]();
            return unfold(function (i) {
                var cur = iter.next();
                if (!cur.done && f(cur.value)) return [cur.value, null];
                return void 0;
            }, 0);
        });
    }
    function tryFind(f, xs, defaultValue) {
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            var cur = iter.next();
            if (cur.done) return defaultValue === void 0 ? null : defaultValue;
            if (f(cur.value, i)) return cur.value;
        }
    }
    function find(f, xs) {
        return __failIfNone(tryFind(f, xs));
    }
    function tryFindBack(f, xs, defaultValue) {
        var match = null;
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            var cur = iter.next();
            if (cur.done) return match === null ? defaultValue === void 0 ? null : defaultValue : match;
            if (f(cur.value, i)) match = cur.value;
        }
    }
    function findBack(f, xs) {
        return __failIfNone(tryFindBack(f, xs));
    }
    function tryFindIndex(f, xs) {
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            var cur = iter.next();
            if (cur.done) return null;
            if (f(cur.value, i)) return i;
        }
    }
    function findIndex(f, xs) {
        return __failIfNone(tryFindIndex(f, xs));
    }
    function tryFindIndexBack(f, xs) {
        var match = -1;
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            var cur = iter.next();
            if (cur.done) return match === -1 ? null : match;
            if (f(cur.value, i)) match = i;
        }
    }
    function findIndexBack(f, xs) {
        return __failIfNone(tryFindIndexBack(f, xs));
    }
    function tryPick(f, xs) {
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            var cur = iter.next();
            if (cur.done) break;
            var y = f(cur.value, i);
            if (y != null) return y;
        }
        return void 0;
    }
    function pick(f, xs) {
        return __failIfNone(tryPick(f, xs));
    }
    function unfold(f, acc) {
        return _defineProperty({}, Symbol.iterator, function () {
            return {
                next: function next() {
                    var res = f(acc);
                    if (res != null) {
                        acc = res[1];
                        return { done: false, value: res[0] };
                    }
                    return { done: true };
                }
            };
        });
    }
    function zip(xs, ys) {
        return map2(function (x, y) {
            return [x, y];
        }, xs, ys);
    }
    function zip3(xs, ys, zs) {
        return map3(function (x, y, z) {
            return [x, y, z];
        }, xs, ys, zs);
    }
});