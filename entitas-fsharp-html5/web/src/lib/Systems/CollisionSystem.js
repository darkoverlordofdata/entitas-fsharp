define(["exports", "../Components", "../Entities", "fable-core/List"], function (exports, _Components, _Entities, _List) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BoundingRect = BoundingRect;
    exports.CollisionSystem = CollisionSystem;

    var _List2 = _interopRequireDefault(_List);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function BoundingRect(entity) {
        var x = entity.Position.x;
        var y = entity.Position.y;
        var w = entity.Size.x;
        var h = entity.Size.y;
        return (0, _Components.CreateRect)(x - w / 2, y - h / 2, w, h);
    }

    function CollisionSystem(game, entities) {
        var findCollision = function findCollision(a) {
            return function (b) {
                var matchValue = [a.EntityType, a.Active, b.EntityType, b.Active];

                var _target1 = function _target1() {
                    return a;
                };

                if (matchValue[0] === 2) {
                    if (matchValue[1]) {
                        if (matchValue[2] === 1) {
                            if (matchValue[3]) {
                                game.AddBang(b.Position.x, b.Position.y, 1);
                                game.RemoveEntity(b.Id);

                                if (a.Health == null) {
                                    return a;
                                } else {
                                    var health = a.Health.CurHealth - 1;

                                    if (health <= 0) {
                                        game.AddExplosion(b.Position.x, b.Position.y, 0.5);
                                        var Active = false;
                                        return new _Entities.Entity(a.Id, a.Name, Active, a.EntityType, a.Layer, a.Tint, a.Bounds, a.Expires, a.Health, a.Tween, a.Sprite, a.Position, a.Scale, a.Size, a.Velocity);
                                    } else {
                                        var Health = (0, _Components.CreateHealth)(health, a.Health.MaxHealth);
                                        return new _Entities.Entity(a.Id, a.Name, a.Active, a.EntityType, a.Layer, a.Tint, a.Bounds, a.Expires, Health, a.Tween, a.Sprite, a.Position, a.Scale, a.Size, a.Velocity);
                                    }
                                }
                            } else {
                                return _target1();
                            }
                        } else {
                            return _target1();
                        }
                    } else {
                        return _target1();
                    }
                } else {
                    return _target1();
                }
            };
        };

        var figureCollisions = function figureCollisions(entity) {
            return function (sortedEntities) {
                return sortedEntities.tail != null ? function () {
                    var a = BoundingRect(entity).contains(sortedEntities.head.Position.x, sortedEntities.head.Position.y) ? findCollision(entity)(sortedEntities.head) : entity;
                    return figureCollisions(a)(sortedEntities.tail);
                }() : entity;
            };
        };

        var fixCollisions = function fixCollisions(toFix) {
            return function (alreadyFixed) {
                return toFix.tail != null ? function () {
                    var a = figureCollisions(toFix.head)(alreadyFixed);
                    return fixCollisions(toFix.tail)(new _List2.default(a, alreadyFixed));
                }() : alreadyFixed;
            };
        };

        return fixCollisions(entities)(new _List2.default());
    }
});
//# sourceMappingURL=CollisionSystem.js.map