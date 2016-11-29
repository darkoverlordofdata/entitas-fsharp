(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Event", "./Symbol"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Event"), require("./Symbol"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Event, global.Symbol);
        global.Timer = mod.exports;
    }
})(this, function (exports, _Event, _Symbol) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Event2 = _interopRequireDefault(_Event);

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

    var Timer = function () {
        function Timer(interval) {
            _classCallCheck(this, Timer);

            this.Interval = interval > 0 ? interval : 100;
            this.AutoReset = true;
            this._elapsed = new _Event2.default();
        }

        _createClass(Timer, [{
            key: "Dispose",
            value: function Dispose() {
                this.Enabled = false;
                this._isDisposed = true;
            }
        }, {
            key: "Close",
            value: function Close() {
                this.Dispose();
            }
        }, {
            key: "Start",
            value: function Start() {
                this.Enabled = true;
            }
        }, {
            key: "Stop",
            value: function Stop() {
                this.Enabled = false;
            }
        }, {
            key: _Symbol2.default.reflection,
            value: function value() {
                return {
                    type: "System.Timers.Timer",
                    interfaces: ["System.IDisposable"]
                };
            }
        }, {
            key: "Elapsed",
            get: function get() {
                return this._elapsed;
            }
        }, {
            key: "Enabled",
            get: function get() {
                return this._enabled;
            },
            set: function set(x) {
                var _this = this;

                if (!this._isDisposed && this._enabled != x) {
                    if (this._enabled = x) {
                        if (this.AutoReset) {
                            this._intervalId = setInterval(function () {
                                if (!_this.AutoReset) _this.Enabled = false;
                                _this._elapsed.Trigger(new Date());
                            }, this.Interval);
                        } else {
                            this._timeoutId = setTimeout(function () {
                                _this.Enabled = false;
                                _this._timeoutId = 0;
                                if (_this.AutoReset) _this.Enabled = true;
                                _this._elapsed.Trigger(new Date());
                            }, this.Interval);
                        }
                    } else {
                        if (this._timeoutId) {
                            clearTimeout(this._timeoutId);
                            this._timeoutId = 0;
                        }
                        if (this._intervalId) {
                            clearInterval(this._intervalId);
                            this._intervalId = 0;
                        }
                    }
                }
            }
        }]);

        return Timer;
    }();

    exports.default = Timer;
});