define(["exports", "../Components", "../Entities"], function (exports, _Components, _Entities) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TweenSystem = TweenSystem;

    function TweenSystem(delta, game, entity) {
        var matchValue = [entity.Scale, entity.Tween, entity.Active];

        var _target1 = function _target1() {
            return entity;
        };

        if (matchValue[0] != null) {
            if (matchValue[1] != null) {
                if (matchValue[2]) {
                    var sa = matchValue[1];
                    var scale = matchValue[0];
                    {
                        var x = scale.x + sa.Speed * delta;
                        var y = scale.y + sa.Speed * delta;
                        var active = sa.Active;

                        if (x > sa.Max) {
                            x = sa.Max;
                            y = sa.Max;
                            active = false;
                        } else {
                            if (x < sa.Min) {
                                x = sa.Min;
                                y = sa.Min;
                                active = false;
                            }
                        }

                        var Scale = (0, _Components.CreatePoint)(x, y);
                        var Tween = (0, _Components.CreateTween)(sa.Min, sa.Max, sa.Speed, sa.Repeat, active);
                        return new _Entities.Entity(entity.Id, entity.Name, entity.Active, entity.EntityType, entity.Layer, entity.Tint, entity.Bounds, entity.Expires, entity.Health, Tween, entity.Sprite, entity.Position, Scale, entity.Size, entity.Velocity);
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
    }
});
//# sourceMappingURL=TweenSystem.js.map