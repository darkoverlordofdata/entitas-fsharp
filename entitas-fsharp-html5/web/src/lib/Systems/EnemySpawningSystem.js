define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EnemySpawningSystem = EnemySpawningSystem;
    var enemyT1 = exports.enemyT1 = 2;
    var enemyT2 = exports.enemyT2 = 7;
    var enemyT3 = exports.enemyT3 = 13;

    function EnemySpawningSystem(delta, game) {
        var spawnEnemy = function spawnEnemy(tupledArg) {
            var delta_1 = tupledArg[0] - delta;

            if (delta_1 < 0) {
                game.AddEnemy(tupledArg[1]);
                var $var2 = null;

                switch (tupledArg[1]) {
                    case 0:
                        {
                            $var2 = 2;
                            break;
                        }

                    case 1:
                        {
                            $var2 = 7;
                            break;
                        }

                    case 2:
                        {
                            $var2 = 13;
                            break;
                        }

                    default:
                        {
                            $var2 = 0;
                        }
                }

                return $var2;
            } else {
                return delta_1;
            }
        };

        exports.enemyT1 = enemyT1 = spawnEnemy([enemyT1, 0]);
        exports.enemyT2 = enemyT2 = spawnEnemy([enemyT2, 1]);
        exports.enemyT3 = enemyT3 = spawnEnemy([enemyT3, 2]);
    }
});
//# sourceMappingURL=EnemySpawningSystem.js.map