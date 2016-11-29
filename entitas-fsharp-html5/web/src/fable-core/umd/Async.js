(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./AsyncBuilder", "./Choice", "./Seq"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./AsyncBuilder"), require("./Choice"), require("./Seq"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.AsyncBuilder, global.Choice, global.Seq);
        global.Async = mod.exports;
    }
})(this, function (exports, _AsyncBuilder, _Choice, _Seq) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.defaultCancellationToken = undefined;
    exports.awaitPromise = awaitPromise;
    exports.cancellationToken = cancellationToken;
    exports.catchAsync = catchAsync;
    exports.fromContinuations = fromContinuations;
    exports.ignore = ignore;
    exports.parallel = parallel;
    exports.sleep = sleep;
    exports.start = start;
    exports.startImmediate = startImmediate;
    exports.startWithContinuations = startWithContinuations;
    exports.startAsPromise = startAsPromise;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Async = function Async() {
        _classCallCheck(this, Async);
    };

    exports.default = Async;

    function emptyContinuation(x) {
        // NOP
    }
    function awaitPromise(p) {
        return fromContinuations(function (conts) {
            return p.then(conts[0]).catch(function (err) {
                return (err == "cancelled" ? conts[2] : conts[1])(err);
            });
        });
    }
    function cancellationToken() {
        return (0, _AsyncBuilder.protectedCont)(function (ctx) {
            return ctx.onSuccess(ctx.cancelToken);
        });
    }
    var defaultCancellationToken = exports.defaultCancellationToken = { isCancelled: false };
    function catchAsync(work) {
        return (0, _AsyncBuilder.protectedCont)(function (ctx) {
            work({
                onSuccess: function onSuccess(x) {
                    return ctx.onSuccess((0, _Choice.choice1Of2)(x));
                },
                onError: function onError(ex) {
                    return ctx.onSuccess((0, _Choice.choice2Of2)(ex));
                },
                onCancel: ctx.onCancel,
                cancelToken: ctx.cancelToken,
                trampoline: ctx.trampoline
            });
        });
    }
    function fromContinuations(f) {
        return (0, _AsyncBuilder.protectedCont)(function (ctx) {
            return f([ctx.onSuccess, ctx.onError, ctx.onCancel]);
        });
    }
    function ignore(computation) {
        return (0, _AsyncBuilder.protectedBind)(computation, function (x) {
            return (0, _AsyncBuilder.protectedReturn)(void 0);
        });
    }
    function parallel(computations) {
        return awaitPromise(Promise.all((0, _Seq.map)(function (w) {
            return startAsPromise(w);
        }, computations)));
    }
    function sleep(millisecondsDueTime) {
        return (0, _AsyncBuilder.protectedCont)(function (ctx) {
            setTimeout(function () {
                return ctx.cancelToken.isCancelled ? ctx.onCancel("cancelled") : ctx.onSuccess(void 0);
            }, millisecondsDueTime);
        });
    }
    function start(computation, cancellationToken) {
        return startWithContinuations(computation, cancellationToken);
    }
    function startImmediate(computation, cancellationToken) {
        return start(computation, cancellationToken);
    }
    function startWithContinuations(computation, continuation, exceptionContinuation, cancellationContinuation, cancelToken) {
        if (typeof continuation !== "function") {
            cancelToken = continuation;
            continuation = null;
        }
        var trampoline = new _AsyncBuilder.Trampoline();
        computation({
            onSuccess: continuation ? continuation : emptyContinuation,
            onError: exceptionContinuation ? exceptionContinuation : emptyContinuation,
            onCancel: cancellationContinuation ? cancellationContinuation : emptyContinuation,
            cancelToken: cancelToken ? cancelToken : defaultCancellationToken,
            trampoline: trampoline
        });
    }
    function startAsPromise(computation, cancellationToken) {
        return new Promise(function (resolve, reject) {
            return startWithContinuations(computation, resolve, reject, reject, cancellationToken ? cancellationToken : defaultCancellationToken);
        });
    }
});