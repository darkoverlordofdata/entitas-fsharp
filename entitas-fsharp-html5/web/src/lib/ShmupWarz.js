define(["exports", "fable-core/List", "./Entities", "./Systems/SystemInterface", "fable-core/Symbol", "fable-core/Util", "fable-core/Lazy", "./Components", "./Bosco.Keyboard", "./Bosco.Mouse", "fable-core/Seq", "./Systems/EnemySpawningSystem", "./Systems/CollisionSystem", "./Systems/RemoveOffscreenShipsSystem", "./Systems/TweenSystem", "./Systems/ExpiringSystem", "./Systems/MovementSystem", "./Systems/EntitySystem", "./Systems/InputSystem"], function (exports, _List, _Entities, _SystemInterface2, _Symbol2, _Util, _Lazy, _Components, _Bosco, _Bosco2, _Seq, _EnemySpawningSystem, _CollisionSystem, _RemoveOffscreenShipsSystem, _TweenSystem, _ExpiringSystem, _MovementSystem, _EntitySystem, _InputSystem) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.game = exports.ShmupWarz = exports.ASSETS = undefined;
    exports.CreateEntityDB = CreateEntityDB;

    var _List2 = _interopRequireDefault(_List);

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    var _Lazy2 = _interopRequireDefault(_Lazy);

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

    var _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);

            if (parent === null) {
                return undefined;
            } else {
                return get(parent, property, receiver);
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;

            if (getter === undefined) {
                return undefined;
            }

            return getter.call(receiver);
        }
    };

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

    function CreateEntityDB(content) {
        return (0, _List.ofArray)([(0, _Entities.CreatePlayer)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateBang)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateExplosion)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateBullet)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy1)(content), (0, _Entities.CreateEnemy2)(content), (0, _Entities.CreateEnemy2)(content), (0, _Entities.CreateEnemy2)(content), (0, _Entities.CreateEnemy2)(content), (0, _Entities.CreateEnemy2)(content), (0, _Entities.CreateEnemy2)(content), (0, _Entities.CreateEnemy3)(content), (0, _Entities.CreateEnemy3)(content), (0, _Entities.CreateEnemy3)(content), (0, _Entities.CreateEnemy3)(content)]);
    }

    var ASSETS = exports.ASSETS = new Map((0, _List.ofArray)([["background", "images/BackdropBlackLittleSparkBlack.png"], ["bang", "images/bang.png"], ["bullet", "images/bullet.png"], ["enemy1", "images/enemy1.png"], ["enemy2", "images/enemy2.png"], ["enemy3", "images/enemy3.png"], ["explosion", "images/explosion.png"], ["fighter", "images/fighter.png"], ["font", "images/tom-thumb-white.png"]]));

    var ShmupWarz = exports.ShmupWarz = function (_SystemInterface) {
        _inherits(ShmupWarz, _SystemInterface);

        _createClass(ShmupWarz, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return (0, _Util.extendInfo)(ShmupWarz, {
                    type: "ShmupWarz.ShmupWarz",
                    interfaces: [],
                    properties: {}
                });
            }
        }]);

        function ShmupWarz(height, width0, mobile) {
            _classCallCheck(this, ShmupWarz);

            var _this2 = _possibleConstructorReturn(this, (ShmupWarz.__proto__ || Object.getPrototypeOf(ShmupWarz)).call(this, height, width0, new Map(ASSETS)));

            var _this = {
                contents: null
            };
            var _this_1 = _this2;
            _this2.height = height;
            _this2.mobile = mobile;
            _this2.contents = _this2;
            var pixelFactor = _this2.mobile ? 2 : 1;
            _this2.width = width0 / pixelFactor;
            _this2.entities = new _Lazy2.default(function () {
                return CreateEntityDB(_this2.contents.Content);
            });
            var fntImage = new _Lazy2.default(function () {
                return (0, _Components.CreateSprite)(_this2.contents.Content.font.texture);
            });
            _this2.bgdImage = new _Lazy2.default(function () {
                return (0, _Components.CreateSprite)(_this2.contents.Content.background.texture);
            });
            var bgdRect = (0, _Components.CreateRect)(0, 0, _this2.width, _this2.height);
            var scaleX = _this2.width / 320;
            var scaleY = _this2.height / 480;
            _this2["init@101-2"] = 1;
            return _this2;
        }

        _createClass(ShmupWarz, [{
            key: "Initialize",
            value: function Initialize() {
                (0, _Bosco.init)();
                (0, _Bosco2.init)();

                _get(ShmupWarz.prototype.__proto__ || Object.getPrototypeOf(ShmupWarz.prototype), "Initialize", this).call(this);
            }
        }, {
            key: "LoadContent",
            value: function LoadContent() {
                this.entities.value;
            }
        }, {
            key: "Draw",
            value: function Draw(gameTime) {
                var _this3 = this;

                this.spriteBatch.children.length = 0;
                this.spriteBatch.addChild(this.bgdImage.value);
                (0, _Seq.iterate)(function (spriteBatch) {
                    return function (entity) {
                        _this3.drawSprite(spriteBatch, entity);
                    };
                }(this.spriteBatch), (0, _Seq.toList)((0, _Seq.sortWith)(function (x, y) {
                    return (0, _Util.compare)(function (e) {
                        return e.Layer;
                    }(x), function (e) {
                        return e.Layer;
                    }(y));
                }, function () {
                    var input = _this3.entities.value;
                    return _this3.activeEntities(input);
                }())));
            }
        }, {
            key: "Update",
            value: function Update(gameTime) {
                var _this4 = this;

                var current = this.entities.value;
                (0, _EnemySpawningSystem.EnemySpawningSystem)(gameTime, this);
                this.entities = new _Lazy2.default(function () {
                    return function (entities) {
                        return (0, _CollisionSystem.CollisionSystem)(_this4, entities);
                    }((0, _List.map)(function () {
                        var arg = [_this4, ~~_this4.width, ~~_this4.height];
                        return function (entity) {
                            return (0, _RemoveOffscreenShipsSystem.RemoveOffscreenShipsSystem)(arg[0], arg[1], arg[2], entity);
                        };
                    }(), (0, _List.map)(function () {
                        var arg = [gameTime, _this4];
                        return function (entity) {
                            return (0, _TweenSystem.TweenSystem)(arg[0], arg[1], entity);
                        };
                    }(), (0, _List.map)(function (entity) {
                        return (0, _ExpiringSystem.ExpiringSystem)(gameTime, entity);
                    }, (0, _List.map)(function (entity) {
                        return (0, _MovementSystem.MovementSystem)(gameTime, entity);
                    }, (0, _List.map)(function () {
                        var arg = [_this4, ~~_this4.width, ~~_this4.height];
                        return function (entity) {
                            return (0, _EntitySystem.EntitySystem)(arg[0], arg[1], arg[2], entity);
                        };
                    }(), (0, _List.map)(function () {
                        var arg = [gameTime, _this4.mobile, _this4];
                        return function (entity) {
                            return (0, _InputSystem.InputSystem)(arg[0], arg[1], arg[2], entity);
                        };
                    }(), current)))))));
                });
            }
        }, {
            key: "RemoveEntity",
            value: function RemoveEntity(id) {
                this.Deactivate = new _List2.default(id, this.Deactivate);
            }
        }, {
            key: "AddBullet",
            value: function AddBullet(x, y) {
                this.Bullets = new _List2.default((0, _Components.BulletQue)(x, y), this.Bullets);
            }
        }, {
            key: "AddEnemy",
            value: function AddEnemy(enemy) {
                switch (enemy) {
                    case 0:
                        {
                            this.Enemies1 = new _List2.default((0, _Components.EnemyQue)(enemy), this.Enemies1);
                            break;
                        }

                    case 1:
                        {
                            this.Enemies2 = new _List2.default((0, _Components.EnemyQue)(enemy), this.Enemies2);
                            break;
                        }

                    case 2:
                        {
                            this.Enemies3 = new _List2.default((0, _Components.EnemyQue)(enemy), this.Enemies3);
                            break;
                        }

                    default:
                        {}
                }
            }
        }, {
            key: "AddExplosion",
            value: function AddExplosion(x, y, scale) {
                this.Explosions = new _List2.default((0, _Components.ExplosionQue)(x, y, scale), this.Explosions);
            }
        }, {
            key: "AddBang",
            value: function AddBang(x, y, scale) {
                this.Bangs = new _List2.default((0, _Components.ExplosionQue)(x, y, scale), this.Bangs);
            }
        }, {
            key: "activeEntities",
            value: function activeEntities(input) {
                var _activeEntities = function _activeEntities(input_1) {
                    return function (output) {
                        var _target1 = function _target1() {
                            return input_1.tail == null ? output : _activeEntities(input_1.tail)(output);
                        };

                        if (input_1.tail != null) {
                            if (input_1.head.Active) {
                                var x = input_1.head;
                                var xs = input_1.tail;
                                return _activeEntities(xs)(new _List2.default(x, output));
                            } else {
                                return _target1();
                            }
                        } else {
                            return _target1();
                        }
                    };
                };

                return _activeEntities(input)(new _List2.default());
            }
        }, {
            key: "drawSprite",
            value: function drawSprite(spriteBatch, entity) {
                if (entity.Sprite == null) {} else {
                    var scale = entity.Scale == null ? (0, _Components.CreatePoint)(1, 1) : entity.Scale;
                    var color = entity.Tint == null ? 16777215 : entity.Tint;
                    entity.Sprite.x = entity.Position.x;
                    entity.Sprite.y = entity.Position.y;
                    entity.Sprite.scale = scale;
                    entity.Sprite.tint = color;
                    spriteBatch.addChild(entity.Sprite);
                }
            }
        }]);

        return ShmupWarz;
    }(_SystemInterface2.SystemInterface);

    (0, _Util.declare)(ShmupWarz);
    var game = exports.game = new ShmupWarz(320 * 1.5, 480 * 1.5, false);
    game.Run();
});
//# sourceMappingURL=ShmupWarz.js.map