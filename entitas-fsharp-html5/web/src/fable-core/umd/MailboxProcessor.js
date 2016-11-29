(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./Async"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./Async"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Async);
        global.MailboxProcessor = mod.exports;
    }
})(this, function (exports, _Async) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.start = start;

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

    var QueueCell = function QueueCell(message) {
        _classCallCheck(this, QueueCell);

        this.value = message;
    };

    var MailboxQueue = function () {
        function MailboxQueue() {
            _classCallCheck(this, MailboxQueue);
        }

        _createClass(MailboxQueue, [{
            key: "add",
            value: function add(message) {
                var itCell = new QueueCell(message);
                if (this.firstAndLast) {
                    this.firstAndLast[1].next = itCell;
                    this.firstAndLast = [this.firstAndLast[0], itCell];
                } else this.firstAndLast = [itCell, itCell];
            }
        }, {
            key: "tryGet",
            value: function tryGet() {
                if (this.firstAndLast) {
                    var value = this.firstAndLast[0].value;
                    if (this.firstAndLast[0].next) this.firstAndLast = [this.firstAndLast[0].next, this.firstAndLast[1]];else delete this.firstAndLast;
                    return value;
                }
                return void 0;
            }
        }]);

        return MailboxQueue;
    }();

    var MailboxProcessor = function () {
        function MailboxProcessor(body, cancellationToken) {
            _classCallCheck(this, MailboxProcessor);

            this.body = body;
            this.cancellationToken = cancellationToken || _Async.defaultCancellationToken;
            this.messages = new MailboxQueue();
        }

        _createClass(MailboxProcessor, [{
            key: "__processEvents",
            value: function __processEvents() {
                if (this.continuation) {
                    var value = this.messages.tryGet();
                    if (value) {
                        var cont = this.continuation;
                        delete this.continuation;
                        cont(value);
                    }
                }
            }
        }, {
            key: "start",
            value: function start() {
                (0, _Async.startImmediate)(this.body(this), this.cancellationToken);
            }
        }, {
            key: "receive",
            value: function receive() {
                var _this = this;

                return (0, _Async.fromContinuations)(function (conts) {
                    if (_this.continuation) throw new Error("Receive can only be called once!");
                    _this.continuation = conts[0];
                    _this.__processEvents();
                });
            }
        }, {
            key: "post",
            value: function post(message) {
                this.messages.add(message);
                this.__processEvents();
            }
        }, {
            key: "postAndAsyncReply",
            value: function postAndAsyncReply(buildMessage) {
                var result = void 0;
                var continuation = void 0;
                function checkCompletion() {
                    if (result && continuation) continuation(result);
                }
                var reply = {
                    reply: function reply(res) {
                        result = res;
                        checkCompletion();
                    }
                };
                this.messages.add(buildMessage(reply));
                this.__processEvents();
                return (0, _Async.fromContinuations)(function (conts) {
                    continuation = conts[0];
                    checkCompletion();
                });
            }
        }]);

        return MailboxProcessor;
    }();

    exports.default = MailboxProcessor;
    function start(body, cancellationToken) {
        var mbox = new MailboxProcessor(body, cancellationToken);
        mbox.start();
        return mbox;
    }
});