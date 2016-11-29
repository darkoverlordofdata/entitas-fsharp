(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./ListClass", "./Seq", "./Map"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./ListClass"), require("./Seq"), require("./Map"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ListClass, global.Seq, global.Map);
        global.List = mod.exports;
    }
})(this, function (exports, _ListClass, _Seq, _Map) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ofArray = undefined;
    Object.defineProperty(exports, "ofArray", {
        enumerable: true,
        get: function () {
            return _ListClass.ofArray;
        }
    });
    exports.append = append;
    exports.choose = choose;
    exports.collect = collect;
    exports.concat = concat;
    exports.filter = filter;
    exports.where = where;
    exports.initialize = initialize;
    exports.map = map;
    exports.mapIndexed = mapIndexed;
    exports.partition = partition;
    exports.replicate = replicate;
    exports.reverse = reverse;
    exports.singleton = singleton;
    exports.slice = slice;
    exports.unzip = unzip;
    exports.unzip3 = unzip3;
    exports.groupBy = groupBy;

    var _ListClass2 = _interopRequireDefault(_ListClass);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = _ListClass2.default;
    function append(xs, ys) {
        return (0, _Seq.fold)(function (acc, x) {
            return new _ListClass2.default(x, acc);
        }, ys, reverse(xs));
    }
    function choose(f, xs) {
        var r = (0, _Seq.fold)(function (acc, x) {
            var y = f(x);
            return y != null ? new _ListClass2.default(y, acc) : acc;
        }, new _ListClass2.default(), xs);
        return reverse(r);
    }
    function collect(f, xs) {
        return (0, _Seq.fold)(function (acc, x) {
            return append(acc, f(x));
        }, new _ListClass2.default(), xs);
    }
    // TODO: should be xs: Iterable<List<T>>
    function concat(xs) {
        return collect(function (x) {
            return x;
        }, xs);
    }
    function filter(f, xs) {
        return reverse((0, _Seq.fold)(function (acc, x) {
            return f(x) ? new _ListClass2.default(x, acc) : acc;
        }, new _ListClass2.default(), xs));
    }
    function where(f, xs) {
        return filter(f, xs);
    }
    function initialize(n, f) {
        if (n < 0) {
            throw new Error("List length must be non-negative");
        }
        var xs = new _ListClass2.default();
        for (var i = 1; i <= n; i++) {
            xs = new _ListClass2.default(f(n - i), xs);
        }
        return xs;
    }
    function map(f, xs) {
        return reverse((0, _Seq.fold)(function (acc, x) {
            return new _ListClass2.default(f(x), acc);
        }, new _ListClass2.default(), xs));
    }
    function mapIndexed(f, xs) {
        return reverse((0, _Seq.fold)(function (acc, x, i) {
            return new _ListClass2.default(f(i, x), acc);
        }, new _ListClass2.default(), xs));
    }
    function partition(f, xs) {
        return (0, _Seq.fold)(function (acc, x) {
            var lacc = acc[0],
                racc = acc[1];
            return f(x) ? [new _ListClass2.default(x, lacc), racc] : [lacc, new _ListClass2.default(x, racc)];
        }, [new _ListClass2.default(), new _ListClass2.default()], reverse(xs));
    }
    function replicate(n, x) {
        return initialize(n, function () {
            return x;
        });
    }
    function reverse(xs) {
        return (0, _Seq.fold)(function (acc, x) {
            return new _ListClass2.default(x, acc);
        }, new _ListClass2.default(), xs);
    }
    function singleton(x) {
        return new _ListClass2.default(x, new _ListClass2.default());
    }
    function slice(lower, upper, xs) {
        var noLower = lower == null;
        var noUpper = upper == null;
        return reverse((0, _Seq.fold)(function (acc, x, i) {
            return (noLower || lower <= i) && (noUpper || i <= upper) ? new _ListClass2.default(x, acc) : acc;
        }, new _ListClass2.default(), xs));
    }
    /* ToDo: instance unzip() */
    function unzip(xs) {
        return (0, _Seq.foldBack)(function (xy, acc) {
            return [new _ListClass2.default(xy[0], acc[0]), new _ListClass2.default(xy[1], acc[1])];
        }, xs, [new _ListClass2.default(), new _ListClass2.default()]);
    }
    /* ToDo: instance unzip3() */
    function unzip3(xs) {
        return (0, _Seq.foldBack)(function (xyz, acc) {
            return [new _ListClass2.default(xyz[0], acc[0]), new _ListClass2.default(xyz[1], acc[1]), new _ListClass2.default(xyz[2], acc[2])];
        }, xs, [new _ListClass2.default(), new _ListClass2.default(), new _ListClass2.default()]);
    }
    function groupBy(f, xs) {
        return (0, _Seq.toList)((0, _Seq.map)(function (k) {
            return [k[0], (0, _Seq.toList)(k[1])];
        }, (0, _Map.groupBy)(f, xs)));
    }
});