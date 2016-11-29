define(["exports", "fable-core/Set", "fable-core/GenericComparer"], function (exports, _Set, _GenericComparer) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.keysPressed = undefined;
    exports.reset = reset;
    exports.isPressed = isPressed;
    exports.update = update;
    exports.init = init;

    var _GenericComparer2 = _interopRequireDefault(_GenericComparer);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var keysPressed = exports.keysPressed = (0, _Set.create)(null, new _GenericComparer2.default(function (x, y) {
        return x < y ? -1 : x > y ? 1 : 0;
    }));

    function reset() {
        exports.keysPressed = keysPressed = (0, _Set.create)(null, new _GenericComparer2.default(function (x, y) {
            return x < y ? -1 : x > y ? 1 : 0;
        }));
    }

    function isPressed(keyCode) {
        return keysPressed.has(keyCode);
    }

    function update(e, pressed) {
        var keyCode = ~~e.keyCode;
        var op = pressed ? function (value) {
            return function (set) {
                return (0, _Set.add)(value, set);
            };
        } : function (value) {
            return function (set) {
                return (0, _Set.remove)(value, set);
            };
        };
        exports.keysPressed = keysPressed = op(keyCode)(keysPressed);
        return null;
    }

    function init() {
        window.addEventListener('keydown', function (e) {
            return update(e, true);
        });
        window.addEventListener('keyup', function (e) {
            return update(e, false);
        });
    }
});
//# sourceMappingURL=Bosco.Keyboard.js.map