define(["exports", "PIXI"], function (exports, _PIXI) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.position = exports.buttonDown = exports.down = undefined;
    exports.onTouchStart = onTouchStart;
    exports.onTouchMove = onTouchMove;
    exports.onTouchEnd = onTouchEnd;
    exports.onMouseStart = onMouseStart;
    exports.onMouseMove = onMouseMove;
    exports.onMouseEnd = onMouseEnd;
    exports.init = init;
    var down = exports.down = false;
    var buttonDown = exports.buttonDown = false;
    var position = exports.position = new _PIXI.Point(0, 0);

    function onTouchStart(e) {
        var event = e.targetTouches[0];
        exports.down = down = true;
        exports.buttonDown = buttonDown = true;
        position.x = event.clientX;
        position.y = event.clientY;
        return null;
    }

    function onTouchMove(e) {
        var event = e.targetTouches[0];
        position.x = event.clientX;
        position.y = event.clientY;
        return null;
    }

    function onTouchEnd(e) {
        exports.down = down = false;
        exports.buttonDown = buttonDown = false;
        return null;
    }

    function onMouseStart(e) {
        exports.down = down = true;
        exports.buttonDown = buttonDown = true;
        position.x = e.clientX;
        position.y = e.clientY;
        return null;
    }

    function onMouseMove(e) {
        position.x = e.clientX;
        position.y = e.clientY;
        return null;
    }

    function onMouseEnd(e) {
        exports.down = down = false;
        exports.buttonDown = buttonDown = false;
        return null;
    }

    function init() {
        document.addEventListener('touchstart', function (e) {
            return onTouchStart(e);
        });
        document.addEventListener('touchmove', function (e) {
            return onTouchMove(e);
        });
        document.addEventListener('touchend', function (e) {
            return onTouchEnd(e);
        });
        document.addEventListener('mousedown', function (e) {
            return onMouseStart(e);
        });
        document.addEventListener('mousemove', function (e) {
            return onMouseMove(e);
        });
        document.addEventListener('mouseup', function (e) {
            return onMouseEnd(e);
        });
    }
});
//# sourceMappingURL=Bosco.Mouse.js.map