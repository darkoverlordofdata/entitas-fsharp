define(["exports", "fable-core/Symbol", "fable-core/Util", "PIXI"], function (exports, _Symbol2, _Util, _PIXI) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BulletQueItem = exports.ExplosionQueItem = exports.EnemyQueItem = exports.Tween = exports.Health = undefined;
    exports.CreateHealth = CreateHealth;
    exports.CreateTween = CreateTween;
    exports.EnemyQue = EnemyQue;
    exports.ExplosionQue = ExplosionQue;
    exports.BulletQue = BulletQue;
    exports.CreatePoint = CreatePoint;
    exports.CreateSprite = CreateSprite;
    exports.CreateRect = CreateRect;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

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

    var Health = exports.Health = function () {
        function Health(curHealth, maxHealth) {
            _classCallCheck(this, Health);

            this.CurHealth = curHealth;
            this.MaxHealth = maxHealth;
        }

        _createClass(Health, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return {
                    type: "Components.Health",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        CurHealth: "number",
                        MaxHealth: "number"
                    }
                };
            }
        }, {
            key: "Equals",
            value: function Equals(other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return Health;
    }();

    (0, _Util.declare)(Health);

    function CreateHealth(curHealth, maxHealth) {
        return new Health(curHealth, maxHealth);
    }

    var Tween = exports.Tween = function () {
        function Tween(min, max, speed, repeat, active) {
            _classCallCheck(this, Tween);

            this.Min = min;
            this.Max = max;
            this.Speed = speed;
            this.Repeat = repeat;
            this.Active = active;
        }

        _createClass(Tween, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return {
                    type: "Components.Tween",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        Min: "number",
                        Max: "number",
                        Speed: "number",
                        Repeat: "boolean",
                        Active: "boolean"
                    }
                };
            }
        }, {
            key: "Equals",
            value: function Equals(other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return Tween;
    }();

    (0, _Util.declare)(Tween);

    function CreateTween(min, max, speed, repeat, active) {
        return new Tween(min, max, speed, repeat, active);
    }

    var EnemyQueItem = exports.EnemyQueItem = function () {
        function EnemyQueItem(enemy) {
            _classCallCheck(this, EnemyQueItem);

            this.Enemy = enemy;
        }

        _createClass(EnemyQueItem, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return {
                    type: "Components.EnemyQueItem",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        Enemy: "number"
                    }
                };
            }
        }, {
            key: "Equals",
            value: function Equals(other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return EnemyQueItem;
    }();

    (0, _Util.declare)(EnemyQueItem);

    function EnemyQue(enemy) {
        return new EnemyQueItem(enemy);
    }

    var ExplosionQueItem = exports.ExplosionQueItem = function () {
        function ExplosionQueItem(x, y, scale) {
            _classCallCheck(this, ExplosionQueItem);

            this.X = x;
            this.Y = y;
            this.Scale = scale;
        }

        _createClass(ExplosionQueItem, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return {
                    type: "Components.ExplosionQueItem",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        X: "number",
                        Y: "number",
                        Scale: "number"
                    }
                };
            }
        }, {
            key: "Equals",
            value: function Equals(other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return ExplosionQueItem;
    }();

    (0, _Util.declare)(ExplosionQueItem);

    function ExplosionQue(x, y, scale) {
        return new ExplosionQueItem(x, y, scale);
    }

    var BulletQueItem = exports.BulletQueItem = function () {
        function BulletQueItem(x, y) {
            _classCallCheck(this, BulletQueItem);

            this.X = x;
            this.Y = y;
        }

        _createClass(BulletQueItem, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return {
                    type: "Components.BulletQueItem",
                    interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                    properties: {
                        X: "number",
                        Y: "number"
                    }
                };
            }
        }, {
            key: "Equals",
            value: function Equals(other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }, {
            key: "CompareTo",
            value: function CompareTo(other) {
                return (0, _Util.compareRecords)(this, other);
            }
        }]);

        return BulletQueItem;
    }();

    (0, _Util.declare)(BulletQueItem);

    function BulletQue(x, y) {
        return new BulletQueItem(x, y);
    }

    function CreatePoint(x, y) {
        return new _PIXI.Point(x, y);
    }

    function CreateSprite(texture) {
        return new _PIXI.Sprite(texture);
    }

    function CreateRect(x, y, w, h) {
        return new _PIXI.Rectangle(x, y, w, h);
    }
});
//# sourceMappingURL=Components.js.map