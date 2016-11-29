(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.Array = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.addRangeInPlace = addRangeInPlace;
    exports.copyTo = copyTo;
    exports.partition = partition;
    exports.permute = permute;
    exports.removeInPlace = removeInPlace;
    exports.setSlice = setSlice;
    exports.sortInPlaceBy = sortInPlaceBy;
    exports.unzip = unzip;
    exports.unzip3 = unzip3;
    function addRangeInPlace(range, xs) {
        var iter = range[Symbol.iterator]();
        var cur = iter.next();
        while (!cur.done) {
            xs.push(cur.value);
            cur = iter.next();
        }
    }
    function copyTo(source, sourceIndex, target, targetIndex, count) {
        while (count--) {
            target[targetIndex++] = source[sourceIndex++];
        }
    }
    function partition(f, xs) {
        var ys = [],
            zs = [],
            j = 0,
            k = 0;
        for (var i = 0; i < xs.length; i++) {
            if (f(xs[i])) ys[j++] = xs[i];else zs[k++] = xs[i];
        }return [ys, zs];
    }
    function permute(f, xs) {
        // Keep the type of the array
        var ys = xs.map(function () {
            return null;
        });
        var checkFlags = new Array(xs.length);
        for (var i = 0; i < xs.length; i++) {
            var j = f(i);
            if (j < 0 || j >= xs.length) throw new Error("Not a valid permutation");
            ys[j] = xs[i];
            checkFlags[j] = 1;
        }
        for (var _i = 0; _i < xs.length; _i++) {
            if (checkFlags[_i] != 1) throw new Error("Not a valid permutation");
        }return ys;
    }
    function removeInPlace(item, xs) {
        var i = xs.indexOf(item);
        if (i > -1) {
            xs.splice(i, 1);
            return true;
        }
        return false;
    }
    function setSlice(target, lower, upper, source) {
        var length = (upper || target.length - 1) - lower;
        if (ArrayBuffer.isView(target) && source.length <= length) target.set(source, lower);else for (var i = lower | 0, j = 0; j <= length; i++, j++) {
            target[i] = source[j];
        }
    }
    function sortInPlaceBy(f, xs) {
        var dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        return xs.sort(function (x, y) {
            x = f(x);
            y = f(y);
            return (x < y ? -1 : x == y ? 0 : 1) * dir;
        });
    }
    function unzip(xs) {
        var bs = new Array(xs.length),
            cs = new Array(xs.length);
        for (var i = 0; i < xs.length; i++) {
            bs[i] = xs[i][0];
            cs[i] = xs[i][1];
        }
        return [bs, cs];
    }
    function unzip3(xs) {
        var bs = new Array(xs.length),
            cs = new Array(xs.length),
            ds = new Array(xs.length);
        for (var i = 0; i < xs.length; i++) {
            bs[i] = xs[i][0];
            cs[i] = xs[i][1];
            ds[i] = xs[i][2];
        }
        return [bs, cs, ds];
    }
});