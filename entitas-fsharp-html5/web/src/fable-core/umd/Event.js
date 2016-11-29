(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Util", "./Seq", "./Observable"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Util"), require("./Seq"), require("./Observable"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Util, global.Seq, global.Observable);
        global.Event = mod.exports;
    }
})(this, function (exports, _Util, _Seq, _Observable) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.add = add;
    exports.choose = choose;
    exports.filter = filter;
    exports.map = map;
    exports.merge = merge;
    exports.pairwise = pairwise;
    exports.partition = partition;
    exports.scan = scan;
    exports.split = split;

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

    var Event = function () {
        function Event(_subscriber, delegates) {
            _classCallCheck(this, Event);

            this._subscriber = _subscriber;
            this.delegates = delegates || new Array();
        }

        _createClass(Event, [{
            key: "Add",
            value: function Add(f) {
                this._addHandler(f);
            }
        }, {
            key: "Trigger",
            value: function Trigger(value) {
                (0, _Seq.iterate)(function (f) {
                    return f(value);
                }, this.delegates);
            }
        }, {
            key: "_addHandler",
            value: function _addHandler(f) {
                this.delegates.push(f);
            }
        }, {
            key: "_removeHandler",
            value: function _removeHandler(f) {
                var index = this.delegates.findIndex(function (el) {
                    return "" + el == "" + f;
                }); // Special dedication to Chet Husk.
                if (index > -1) this.delegates.splice(index, 1);
            }
        }, {
            key: "AddHandler",
            value: function AddHandler(handler) {
                this._addHandler(function (x) {
                    return handler(undefined, x);
                });
            }
        }, {
            key: "RemoveHandler",
            value: function RemoveHandler(handler) {
                this._removeHandler(function (x) {
                    return handler(undefined, x);
                });
            }
        }, {
            key: "_subscribeFromObserver",
            value: function _subscribeFromObserver(observer) {
                var _this = this;

                if (this._subscriber) return this._subscriber(observer);
                var callback = observer.OnNext;
                this._addHandler(callback);
                return (0, _Util.createDisposable)(function () {
                    return _this._removeHandler(callback);
                });
            }
        }, {
            key: "_subscribeFromCallback",
            value: function _subscribeFromCallback(callback) {
                var _this2 = this;

                this._addHandler(callback);
                return (0, _Util.createDisposable)(function () {
                    return _this2._removeHandler(callback);
                });
            }
        }, {
            key: "Subscribe",
            value: function Subscribe(arg) {
                return typeof arg == "function" ? this._subscribeFromCallback(arg) : this._subscribeFromObserver(arg);
            }
        }, {
            key: "Publish",
            get: function get() {
                return this;
            }
        }]);

        return Event;
    }();

    exports.default = Event;
    function add(callback, sourceEvent) {
        sourceEvent.Subscribe(new _Observable.Observer(callback));
    }
    function choose(chooser, sourceEvent) {
        var source = sourceEvent;
        return new Event(function (observer) {
            return source.Subscribe(new _Observable.Observer(function (t) {
                return (0, _Observable.protect)(function () {
                    return chooser(t);
                }, function (u) {
                    if (u != null) observer.OnNext(u);
                }, observer.OnError);
            }, observer.OnError, observer.OnCompleted));
        }, source.delegates);
    }
    function filter(predicate, sourceEvent) {
        return choose(function (x) {
            return predicate(x) ? x : null;
        }, sourceEvent);
    }
    function map(mapping, sourceEvent) {
        var source = sourceEvent;
        return new Event(function (observer) {
            return source.Subscribe(new _Observable.Observer(function (t) {
                return (0, _Observable.protect)(function () {
                    return mapping(t);
                }, observer.OnNext, observer.OnError);
            }, observer.OnError, observer.OnCompleted));
        }, source.delegates);
    }
    function merge(event1, event2) {
        var source1 = event1;
        var source2 = event2;
        return new Event(function (observer) {
            var stopped = false,
                completed1 = false,
                completed2 = false;
            var h1 = source1.Subscribe(new _Observable.Observer(function (v) {
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
            var h2 = source2.Subscribe(new _Observable.Observer(function (v) {
                if (!stopped) observer.OnNext(v);
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
        }, source1.delegates.concat(source2.delegates));
    }
    function pairwise(sourceEvent) {
        var source = sourceEvent;
        return new Event(function (observer) {
            var last = null;
            return source.Subscribe(new _Observable.Observer(function (next) {
                if (last != null) observer.OnNext([last, next]);
                last = next;
            }, observer.OnError, observer.OnCompleted));
        }, source.delegates);
    }
    function partition(predicate, sourceEvent) {
        return [filter(predicate, sourceEvent), filter(function (x) {
            return !predicate(x);
        }, sourceEvent)];
    }
    function scan(collector, state, sourceEvent) {
        var source = sourceEvent;
        return new Event(function (observer) {
            return source.Subscribe(new _Observable.Observer(function (t) {
                (0, _Observable.protect)(function () {
                    return collector(state, t);
                }, function (u) {
                    state = u;observer.OnNext(u);
                }, observer.OnError);
            }, observer.OnError, observer.OnCompleted));
        }, source.delegates);
    }
    function split(splitter, sourceEvent) {
        return [choose(function (v) {
            return splitter(v).valueIfChoice1;
        }, sourceEvent), choose(function (v) {
            return splitter(v).valueIfChoice2;
        }, sourceEvent)];
    }
});