(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.Symbol = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var fableGlobal = exports.fableGlobal = function () {
        var globalObj = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : null;
        if (typeof globalObj.__FABLE_CORE__ === "undefined") {
            globalObj.__FABLE_CORE__ = {
                types: new Map(),
                symbols: {
                    reflection: Symbol("reflection"),
                    generics: Symbol("generics")
                }
            };
        }
        return globalObj.__FABLE_CORE__;
    }();
    exports.default = fableGlobal.symbols;
});