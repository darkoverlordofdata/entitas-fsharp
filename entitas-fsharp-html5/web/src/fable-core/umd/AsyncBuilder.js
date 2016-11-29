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
        global.AsyncBuilder = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.protectedCont = protectedCont;
    exports.protectedBind = protectedBind;
    exports.protectedReturn = protectedReturn;

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

    var Trampoline = exports.Trampoline = function () {
        function Trampoline() {
            _classCallCheck(this, Trampoline);

            this.callCount = 0;
        }

        _createClass(Trampoline, [{
            key: "incrementAndCheck",
            value: function incrementAndCheck() {
                return this.callCount++ > Trampoline.maxTrampolineCallCount;
            }
        }, {
            key: "hijack",
            value: function hijack(f) {
                this.callCount = 0;
                setTimeout(f, 0);
            }
        }], [{
            key: "maxTrampolineCallCount",
            get: function get() {
                return 2000;
            }
        }]);

        return Trampoline;
    }();

    function protectedCont(f) {
        return function (ctx) {
            if (ctx.cancelToken.isCancelled) ctx.onCancel("cancelled");else if (ctx.trampoline.incrementAndCheck()) ctx.trampoline.hijack(function () {
                try {
                    f(ctx);
                } catch (err) {
                    ctx.onError(err);
                }
            });else try {
                f(ctx);
            } catch (err) {
                ctx.onError(err);
            }
        };
    }
    function protectedBind(computation, binder) {
        return protectedCont(function (ctx) {
            computation({
                onSuccess: function onSuccess(x) {
                    return binder(x)(ctx);
                },
                onError: ctx.onError,
                onCancel: ctx.onCancel,
                cancelToken: ctx.cancelToken,
                trampoline: ctx.trampoline
            });
        });
    }
    function protectedReturn(value) {
        return protectedCont(function (ctx) {
            return ctx.onSuccess(value);
        });
    }

    var AsyncBuilder = exports.AsyncBuilder = function () {
        function AsyncBuilder() {
            _classCallCheck(this, AsyncBuilder);
        }

        _createClass(AsyncBuilder, [{
            key: "Bind",
            value: function Bind(computation, binder) {
                return protectedBind(computation, binder);
            }
        }, {
            key: "Combine",
            value: function Combine(computation1, computation2) {
                return this.Bind(computation1, function () {
                    return computation2;
                });
            }
        }, {
            key: "Delay",
            value: function Delay(generator) {
                return protectedCont(function (ctx) {
                    return generator()(ctx);
                });
            }
        }, {
            key: "For",
            value: function For(sequence, body) {
                var iter = sequence[Symbol.iterator]();
                var cur = iter.next();
                return this.While(function () {
                    return !cur.done;
                }, this.Delay(function () {
                    var res = body(cur.value);
                    cur = iter.next();
                    return res;
                }));
            }
        }, {
            key: "Return",
            value: function Return(value) {
                return protectedReturn(value);
            }
        }, {
            key: "ReturnFrom",
            value: function ReturnFrom(computation) {
                return computation;
            }
        }, {
            key: "TryFinally",
            value: function TryFinally(computation, compensation) {
                return protectedCont(function (ctx) {
                    computation({
                        onSuccess: function onSuccess(x) {
                            compensation();
                            ctx.onSuccess(x);
                        },
                        onError: function onError(x) {
                            compensation();
                            ctx.onError(x);
                        },
                        onCancel: function onCancel(x) {
                            compensation();
                            ctx.onCancel(x);
                        },
                        cancelToken: ctx.cancelToken,
                        trampoline: ctx.trampoline
                    });
                });
            }
        }, {
            key: "TryWith",
            value: function TryWith(computation, catchHandler) {
                return protectedCont(function (ctx) {
                    computation({
                        onSuccess: ctx.onSuccess,
                        onCancel: ctx.onCancel,
                        cancelToken: ctx.cancelToken,
                        trampoline: ctx.trampoline,
                        onError: function onError(ex) {
                            try {
                                catchHandler(ex)(ctx);
                            } catch (ex2) {
                                ctx.onError(ex2);
                            }
                        }
                    });
                });
            }
        }, {
            key: "Using",
            value: function Using(resource, binder) {
                return this.TryFinally(binder(resource), function () {
                    return resource.Dispose();
                });
            }
        }, {
            key: "While",
            value: function While(guard, computation) {
                var _this = this;

                if (guard()) return this.Bind(computation, function () {
                    return _this.While(guard, computation);
                });else return this.Return(void 0);
            }
        }, {
            key: "Zero",
            value: function Zero() {
                return protectedCont(function (ctx) {
                    return ctx.onSuccess(void 0);
                });
            }
        }]);

        return AsyncBuilder;
    }();

    var singleton = exports.singleton = new AsyncBuilder();
});