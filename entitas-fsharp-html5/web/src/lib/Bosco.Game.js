define(["exports", "fable-core/Symbol", "PIXI", "fable-core/Util"], function (exports, _Symbol2, _PIXI, _Util) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Game = undefined;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    var PIXI = _interopRequireWildcard(_PIXI);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

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

    var Game = exports.Game = function () {
        _createClass(Game, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return {
                    type: "Bosco.Game",
                    properties: {
                        fps: "number",
                        spriteBatch: _PIXI.Container
                    }
                };
            }
        }]);

        function Game(width, height, images) {
            _classCallCheck(this, Game);

            this.this = {
                contents: null
            };
            {
                var _this = this.this;
                ({});
            }
            this.images = images;
            this.this.contents = this;
            this.previousTime = 0;
            this.elapsedTime = 0;
            this.totalFrames = 0;
            this.renderer = new _PIXI.WebGLRenderer(width, height);
            document.body.appendChild(this.renderer.view);
            this["spriteBatch@"] = new _PIXI.Container();
            this["fps@"] = 0;
            this["init@10"] = 1;
        }

        _createClass(Game, [{
            key: "Initialize",
            value: function Initialize() {
                this.LoadContent();
            }
        }, {
            key: "Run",
            value: function Run() {
                var _this2 = this;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var image = _step.value;
                        PIXI.loader.add(image[0], image[1]);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return PIXI.loader.load(function (loader, resources) {
                    _this2.Content = resources;

                    _this2.Initialize();

                    {
                        var timeStamp = 0;

                        _this2.animate(timeStamp);
                    }
                });
            }
        }, {
            key: "animate",
            value: function animate(timeStamp) {
                var _this3 = this;

                var t = this.previousTime > 0 ? this.previousTime : timeStamp;
                this.previousTime = timeStamp;
                var delta = (timeStamp - t) * 0.001;
                this.totalFrames = this.totalFrames + 1;
                this.elapsedTime = this.elapsedTime + delta;

                if (this.elapsedTime > 1) {
                    this.this.contents.fps = this.totalFrames;
                    this.totalFrames = 0;
                    this.elapsedTime = 0;
                }

                window.requestAnimationFrame(function (delegateArg0) {
                    (function (timeStamp_1) {
                        _this3.animate(timeStamp_1);
                    })(delegateArg0);
                });
                this.this.contents.Update(delta);
                this.this.contents.Draw(delta);
                this.renderer.render(this.this.contents.spriteBatch);
            }
        }, {
            key: "spriteBatch",
            get: function get() {
                return this["spriteBatch@"];
            }
        }, {
            key: "fps",
            get: function get() {
                return this["fps@"];
            },
            set: function set(v) {
                this["fps@"] = v;
            }
        }]);

        return Game;
    }();

    (0, _Util.declare)(Game);
});
//# sourceMappingURL=Bosco.Game.js.map