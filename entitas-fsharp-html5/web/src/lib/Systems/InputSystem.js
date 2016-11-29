define(["exports", "../Bosco.Mouse", "../Bosco.Keyboard", "../Entities"], function (exports, _Bosco, _Bosco2, _Entities) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.timeToFire = undefined;
    exports.InputSystem = InputSystem;
    var timeToFire = exports.timeToFire = 0;

    function InputSystem(delta, mobile, game, entity) {
        var pf = mobile ? 2 : 1;

        if (entity.EntityType === 5) {
            var position = function () {
                var newPosition = _Bosco.position;

                if ((0, _Bosco2.isPressed)(90)) {
                    exports.timeToFire = timeToFire = timeToFire - delta;

                    if (timeToFire <= 0) {
                        game.AddBullet(newPosition.x - 27, newPosition.y);
                        game.AddBullet(newPosition.x + 27, newPosition.y);
                        exports.timeToFire = timeToFire = 0.1;
                    }

                    return newPosition;
                } else {
                    if (_Bosco.down) {
                        exports.timeToFire = timeToFire = timeToFire - delta;

                        if (timeToFire <= 0) {
                            game.AddBullet(newPosition.x - 27, newPosition.y);
                            game.AddBullet(newPosition.x + 27, newPosition.y);
                            exports.timeToFire = timeToFire = 0.1;
                        }

                        return newPosition;
                    } else {
                        return newPosition;
                    }
                }
            }();

            return new _Entities.Entity(entity.Id, entity.Name, entity.Active, entity.EntityType, entity.Layer, entity.Tint, entity.Bounds, entity.Expires, entity.Health, entity.Tween, entity.Sprite, position, entity.Scale, entity.Size, entity.Velocity);
        } else {
            return entity;
        }
    }
});
//# sourceMappingURL=InputSystem.js.map