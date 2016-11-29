define(["exports", "./Bosco.Game", "fable-core/Symbol", "fable-core/Util", "fable-core/List", "./Components"], function (exports, _Bosco, _Symbol2, _Util, _List, _Components) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SystemInterface = undefined;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    var _List2 = _interopRequireDefault(_List);

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

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
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

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var SystemInterface = exports.SystemInterface = function (_Game) {
        _inherits(SystemInterface, _Game);

        _createClass(SystemInterface, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return (0, _Util.extendInfo)(SystemInterface, {
                    type: "Systems.SystemInterface",
                    interfaces: [],
                    properties: {
                        Bangs: (0, _Util.makeGeneric)(_List2.default, {
                            T: _Components.ExplosionQueItem
                        }),
                        Bullets: (0, _Util.makeGeneric)(_List2.default, {
                            T: _Components.BulletQueItem
                        }),
                        Deactivate: (0, _Util.makeGeneric)(_List2.default, {
                            T: "number"
                        }),
                        Enemies1: (0, _Util.makeGeneric)(_List2.default, {
                            T: _Components.EnemyQueItem
                        }),
                        Enemies2: (0, _Util.makeGeneric)(_List2.default, {
                            T: _Components.EnemyQueItem
                        }),
                        Enemies3: (0, _Util.makeGeneric)(_List2.default, {
                            T: _Components.EnemyQueItem
                        }),
                        Explosions: (0, _Util.makeGeneric)(_List2.default, {
                            T: _Components.ExplosionQueItem
                        })
                    }
                });
            }
        }]);

        function SystemInterface(height, width, images) {
            _classCallCheck(this, SystemInterface);

            var _this = _possibleConstructorReturn(this, (SystemInterface.__proto__ || Object.getPrototypeOf(SystemInterface)).call(this, height, width, images));

            _this["Bullets@"] = new _List2.default();
            _this["Deactivate@"] = new _List2.default();
            _this["Enemies1@"] = new _List2.default();
            _this["Enemies2@"] = new _List2.default();
            _this["Enemies3@"] = new _List2.default();
            _this["Explosions@"] = new _List2.default();
            _this["Bangs@"] = new _List2.default();
            _this["init@17-1"] = 1;
            return _this;
        }

        _createClass(SystemInterface, [{
            key: "Bullets",
            get: function get() {
                return this["Bullets@"];
            },
            set: function set(v) {
                this["Bullets@"] = v;
            }
        }, {
            key: "Deactivate",
            get: function get() {
                return this["Deactivate@"];
            },
            set: function set(v) {
                this["Deactivate@"] = v;
            }
        }, {
            key: "Enemies1",
            get: function get() {
                return this["Enemies1@"];
            },
            set: function set(v) {
                this["Enemies1@"] = v;
            }
        }, {
            key: "Enemies2",
            get: function get() {
                return this["Enemies2@"];
            },
            set: function set(v) {
                this["Enemies2@"] = v;
            }
        }, {
            key: "Enemies3",
            get: function get() {
                return this["Enemies3@"];
            },
            set: function set(v) {
                this["Enemies3@"] = v;
            }
        }, {
            key: "Explosions",
            get: function get() {
                return this["Explosions@"];
            },
            set: function set(v) {
                this["Explosions@"] = v;
            }
        }, {
            key: "Bangs",
            get: function get() {
                return this["Bangs@"];
            },
            set: function set(v) {
                this["Bangs@"] = v;
            }
        }]);

        return SystemInterface;
    }(_Bosco.Game);

    (0, _Util.declare)(SystemInterface);
});
//# sourceMappingURL=SystemInterface.js.map