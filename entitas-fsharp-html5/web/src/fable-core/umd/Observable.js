(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Util", "./Symbol"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Util"), require("./Symbol"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Util, global.Symbol);
        global.Observable = mod.exports;
    }
})(this, function (exports, _Util, _Symbol) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Observer = undefined;
    exports.protect = protect;
    exports.add = add;
    exports.choose = choose;
    exports.filter = filter;
    exports.map = map;
    exports.merge = merge;
    exports.pairwise = pairwise;
    exports.partition = partition;
    exports.scan = scan;
    exports.split = split;
    exports.subscribe = subscribe;

    var _Symbol2 = _interopRequireDefault(_Symbol);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
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

    var Observer = exports.Observer = function () {
        function Observer(onNext, onError, onCompleted) {
            _classCallCheck(this, Observer);

            this.OnNext = onNext;
            this.OnError = onError || function (e) {};
            this.OnCompleted = onCompleted || function () {};
        }

        _createClass(Observer, [{
            key: _Symbol2.default.reflection,
            value: function value() {
                return { interfaces: ["System.IObserver"] };
            }
        }]);

        return Observer;
    }();

    var Observable = function () {
        function Observable(subscribe) {
            _classCallCheck(this, Observable);

            this.Subscribe = subscribe;
        }

        _createClass(Observable, [{
            key: _Symbol2.default.reflection,
            value: function value() {
                return { interfaces: ["System.IObservable"] };
            }
        }]);

        return Observable;
    }();

    function protect(f, succeed, fail) {
        try {
            return succeed(f());
        } catch (e) {
            fail(e);
        }
    }
    function add(callback, source) {
        source.Subscribe(new Observer(callback));
    }
    function choose(chooser, source) {
        return new Observable(function (observer) {
            return source.Subscribe(new Observer(function (t) {
                return protect(function () {
                    return chooser(t);
                }, function (u) {
                    if (u != null) observer.OnNext(u);
                }, observer.OnError);
            }, observer.OnError, observer.OnCompleted));
        });
    }
    function filter(predicate, source) {
        return choose(function (x) {
            return predicate(x) ? x : null;
        }, source);
    }
    function map(mapping, source) {
        return new Observable(function (observer) {
            return source.Subscribe(new Observer(function (t) {
                protect(function () {
                    return mapping(t);
                }, observer.OnNext, observer.OnError);
            }, observer.OnError, observer.OnCompleted));
        });
    }
    function merge(source1, source2) {
        return new Observable(function (observer) {
            var stopped = false,
                completed1 = false,
                completed2 = false;
            var h1 = source1.Subscribe(new Observer(function (v) {
                if (!stopped) observer.OnNext(v);
            }, function (e) {
                if (!stopped) {
                    stopped = true;
                    observer.OnError(e);
                }
            }, function () {
                if (!stopped) {
                    completed1 = true;
                    if (completed2) {
                        stopped = true;
                        observer.OnCompleted();
                    }
                }
            }));
            var h2 = source2.Subscribe(new Observer(function (v) {
                if (!stopped) {
                    observer.OnNext(v);
                }
            }, function (e) {
                if (!stopped) {
                    stopped = true;
                    observer.OnError(e);
                }
            }, function () {
                if (!stopped) {
                    completed2 = true;
                    if (completed1) {
                        stopped = true;
                        observer.OnCompleted();
                    }
                }
            }));
            return (0, _Util.createDisposable)(function () {
                h1.Dispose();
                h2.Dispose();
            });
        });
    }
    function pairwise(source) {
        return new Observable(function (observer) {
            var last = null;
            return source.Subscribe(new Observer(function (next) {
                if (last != null) observer.OnNext([last, next]);
                last = next;
            }, observer.OnError, observer.OnCompleted));
        });
    }
    function partition(predicate, source) {
        return [filter(predicate, source), filter(function (x) {
            return !predicate(x);
        }, source)];
    }
    function scan(collector, state, source) {
        return new Observable(function (observer) {
            return source.Subscribe(new Observer(function (t) {
                protect(function () {
                    return collector(state, t);
                }, function (u) {
                    state = u;observer.OnNext(u);
                }, observer.OnError);
            }, observer.OnError, observer.OnCompleted));
        });
    }
    function split(splitter, source) {
        return [choose(function (v) {
            return splitter(v).valueIfChoice1;
        }, source), choose(function (v) {
            return splitter(v).valueIfChoice2;
        }, source)];
    }
    function subscribe(callback, source) {
        return source.Subscribe(new Observer(callback));
    }
});