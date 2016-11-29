define(["exports", "PIXI"], function (exports, _PIXI) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CreatePoint = CreatePoint;
    exports.CreateSprite = CreateSprite;
    exports.CreateRect = CreateRect;

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
//# sourceMappingURL=Bosco.Platform.js.map