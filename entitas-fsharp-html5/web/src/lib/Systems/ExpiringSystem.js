define(["exports", "../Entities"], function (exports, _Entities) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ExpiringSystem = ExpiringSystem;

    function ExpiringSystem(delta, entity) {
        var matchValue = [entity.Expires, entity.Active];

        var _target1 = function _target1() {
            return entity;
        };

        if (matchValue[0] != null) {
            if (matchValue[1]) {
                var v = matchValue[0];
                var exp = v - delta;
                var active = exp > 0 ? true : false;
                var Expires = exp;
                return new _Entities.Entity(entity.Id, entity.Name, active, entity.EntityType, entity.Layer, entity.Tint, entity.Bounds, Expires, entity.Health, entity.Tween, entity.Sprite, entity.Position, entity.Scale, entity.Size, entity.Velocity);
            } else {
                return _target1();
            }
        } else {
            return _target1();
        }
    }
});
//# sourceMappingURL=ExpiringSystem.js.map