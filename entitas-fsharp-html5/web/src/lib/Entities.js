define(["exports", "fable-core/Symbol", "fable-core/Util", "./Components", "PIXI"], function (exports, _Symbol2, _Util, _Components, _PIXI) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Entity = exports.UniqueId = exports.rnd = undefined;
    exports.NextUniqueId = NextUniqueId;
    exports.CreatePlayer = CreatePlayer;
    exports.CreateBullet = CreateBullet;
    exports.CreateEnemy1 = CreateEnemy1;
    exports.CreateEnemy2 = CreateEnemy2;
    exports.CreateEnemy3 = CreateEnemy3;
    exports.CreateExplosion = CreateExplosion;
    exports.CreateBang = CreateBang;

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

    var rnd = exports.rnd = {};
    var UniqueId = exports.UniqueId = 0;

    function NextUniqueId() {
        exports.UniqueId = UniqueId = UniqueId + 1;
        return UniqueId;
    }

    var Entity = exports.Entity = function () {
        function Entity(id, name, active, entityType, layer, tint, bounds, expires, health, tween, sprite, position, scale, size, velocity) {
            _classCallCheck(this, Entity);

            this.Id = id;
            this.Name = name;
            this.Active = active;
            this.EntityType = entityType;
            this.Layer = layer;
            this.Tint = tint;
            this.Bounds = bounds;
            this.Expires = expires;
            this.Health = health;
            this.Tween = tween;
            this.Sprite = sprite;
            this.Position = position;
            this.Scale = scale;
            this.Size = size;
            this.Velocity = velocity;
        }

        _createClass(Entity, [{
            key: _Symbol3.default.reflection,
            value: function value() {
                return {
                    type: "Entities.Entity",
                    interfaces: ["FSharpRecord", "System.IEquatable"],
                    properties: {
                        Id: "number",
                        Name: "string",
                        Active: "boolean",
                        EntityType: "number",
                        Layer: "number",
                        Tint: (0, _Util.Option)("number"),
                        Bounds: (0, _Util.Option)("number"),
                        Expires: (0, _Util.Option)("number"),
                        Health: (0, _Util.Option)(_Components.Health),
                        Tween: (0, _Util.Option)(_Components.Tween),
                        Sprite: (0, _Util.Option)(_PIXI.Sprite),
                        Position: _PIXI.Point,
                        Scale: (0, _Util.Option)(_PIXI.Point),
                        Size: _PIXI.Point,
                        Velocity: (0, _Util.Option)(_PIXI.Point)
                    }
                };
            }
        }, {
            key: "Equals",
            value: function Equals(other) {
                return (0, _Util.equalsRecords)(this, other);
            }
        }]);

        return Entity;
    }();

    (0, _Util.declare)(Entity);

    function CreatePlayer(content) {
        var sprite = (0, _Components.CreateSprite)(content.fighter.texture);
        sprite.anchor = (0, _Components.CreatePoint)(0.5, 0.5);
        var Id = NextUniqueId();
        var Name = "Player";
        var Active = true;
        var EntityType = 5;
        var Layer = 7;
        var Position = (0, _Components.CreatePoint)(0, 0);
        var Scale = null;
        var Sprite = sprite;
        var Tint = null;
        var Bounds = 43;
        var Expires = null;
        var Health = (0, _Components.CreateHealth)(100, 100);
        var Velocity = (0, _Components.CreatePoint)(0, 0);
        return new Entity(Id, Name, Active, EntityType, Layer, Tint, Bounds, Expires, Health, null, Sprite, Position, Scale, (0, _Components.CreatePoint)(sprite.width, sprite.height), Velocity);
    }

    function CreateBullet(content) {
        var sprite = (0, _Components.CreateSprite)(content.bullet.texture);
        sprite.anchor = (0, _Components.CreatePoint)(0.5, 0.5);
        var Id = NextUniqueId();
        var Name = "Bullet";
        var Active = false;
        var EntityType = 1;
        var Layer = 8;
        var Position = (0, _Components.CreatePoint)(0, 0);
        var Scale = null;
        var Sprite = sprite;
        var Tint = 11403055;
        var Bounds = 5;
        var Expires = 0.1;
        var Health = null;
        var Velocity = (0, _Components.CreatePoint)(0, -800);
        return new Entity(Id, Name, Active, EntityType, Layer, Tint, Bounds, Expires, Health, null, Sprite, Position, Scale, (0, _Components.CreatePoint)(sprite.width, sprite.height), Velocity);
    }

    function CreateEnemy1(content) {
        var sprite = (0, _Components.CreateSprite)(content.enemy1.texture);
        sprite.anchor = (0, _Components.CreatePoint)(0.5, 0.5);
        var Id = NextUniqueId();
        var Name = "Enemy1";
        var Active = false;
        var EntityType = 2;
        var Layer = 4;
        var Position = (0, _Components.CreatePoint)(0, 0);
        var Scale = null;
        var Sprite = sprite;
        var Tint = null;
        var Bounds = 20;
        var Expires = null;
        var Health = (0, _Components.CreateHealth)(10, 10);
        var Velocity = (0, _Components.CreatePoint)(0, 40);
        return new Entity(Id, Name, Active, EntityType, Layer, Tint, Bounds, Expires, Health, null, Sprite, Position, Scale, (0, _Components.CreatePoint)(sprite.width, sprite.height), Velocity);
    }

    function CreateEnemy2(content) {
        var sprite = (0, _Components.CreateSprite)(content.enemy2.texture);
        sprite.anchor = (0, _Components.CreatePoint)(0.5, 0.5);
        var Id = NextUniqueId();
        var Name = "Enemy2";
        var Active = false;
        var EntityType = 2;
        var Layer = 5;
        var Position = (0, _Components.CreatePoint)(0, 0);
        var Scale = null;
        var Sprite = sprite;
        var Tint = null;
        var Bounds = 40;
        var Expires = null;
        var Health = (0, _Components.CreateHealth)(20, 20);
        var Velocity = (0, _Components.CreatePoint)(0, 30);
        return new Entity(Id, Name, Active, EntityType, Layer, Tint, Bounds, Expires, Health, null, Sprite, Position, Scale, (0, _Components.CreatePoint)(sprite.width, sprite.height), Velocity);
    }

    function CreateEnemy3(content) {
        var sprite = (0, _Components.CreateSprite)(content.enemy3.texture);
        sprite.anchor = (0, _Components.CreatePoint)(0.5, 0.5);
        var Id = NextUniqueId();
        var Name = "Enemy3";
        var Active = false;
        var EntityType = 2;
        var Layer = 6;
        var Position = (0, _Components.CreatePoint)(0, 0);
        var Scale = null;
        var Sprite = sprite;
        var Tint = null;
        var Bounds = 70;
        var Expires = null;
        var Health = (0, _Components.CreateHealth)(60, 60);
        var Velocity = (0, _Components.CreatePoint)(0, 20);
        return new Entity(Id, Name, Active, EntityType, Layer, Tint, Bounds, Expires, Health, null, Sprite, Position, Scale, (0, _Components.CreatePoint)(sprite.width, sprite.height), Velocity);
    }

    function CreateExplosion(content) {
        var sprite = (0, _Components.CreateSprite)(content.explosion.texture);
        sprite.anchor = (0, _Components.CreatePoint)(0.5, 0.5);
        var Id = NextUniqueId();
        var Name = "Explosion";
        var Active = false;
        var EntityType = 3;
        var Layer = 9;
        var Position = (0, _Components.CreatePoint)(0, 0);
        var Scale = (0, _Components.CreatePoint)(1, 1);
        var Sprite = sprite;
        var Tint = 16448210;
        var Bounds = null;
        var Expires = 0.5;
        var Health = null;
        var Velocity = null;
        return new Entity(Id, Name, Active, EntityType, Layer, Tint, Bounds, Expires, Health, (0, _Components.CreateTween)(1 / 100, 1, -3, false, true), Sprite, Position, Scale, (0, _Components.CreatePoint)(sprite.width, sprite.height), Velocity);
    }

    function CreateBang(content) {
        var sprite = (0, _Components.CreateSprite)(content.bang.texture);
        sprite.anchor = (0, _Components.CreatePoint)(0.5, 0.5);
        var Id = NextUniqueId();
        var Name = "Bang";
        var Active = false;
        var EntityType = 3;
        var Layer = 10;
        var Position = (0, _Components.CreatePoint)(0, 0);
        var Scale = (0, _Components.CreatePoint)(1, 1);
        var Sprite = sprite;
        var Tint = 15657130;
        var Bounds = null;
        var Expires = 0.5;
        var Health = null;
        var Velocity = null;
        return new Entity(Id, Name, Active, EntityType, Layer, Tint, Bounds, Expires, Health, (0, _Components.CreateTween)(1 / 100, 1, -3, false, true), Sprite, Position, Scale, (0, _Components.CreatePoint)(sprite.width, sprite.height), Velocity);
    }
});
//# sourceMappingURL=Entities.js.map