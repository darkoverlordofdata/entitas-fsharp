namespace Systems

#if HTML5
open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop
open Bosco
#endif
open Components
open Entities
open System.Collections.Generic

[<AutoOpen>]
module EnemySpawningSystemModule =
    type Timers =
        | Timer1 = 2
        | Timer2 = 7
        | Timer3 = 13

    let mutable enemyT1 = float(Timers.Timer1)
    let mutable enemyT2 = float(Timers.Timer2)
    let mutable enemyT3 = float(Timers.Timer3)

    let EnemySpawningSystem (delta:float, game:SystemInterface)  =
        let spawnEnemy (t:float, enemy) =
            let delta = t - delta

            if delta < 0.0 then
                game.AddEnemy(enemy)
                match enemy with
                | Enemies.Enemy1 -> float(Timers.Timer1)
                | Enemies.Enemy2 -> float(Timers.Timer2)
                | Enemies.Enemy3 -> float(Timers.Timer3)
                | _ -> 0.0
            else delta

        enemyT1 <- spawnEnemy(enemyT1, Enemies.Enemy1)
        enemyT2 <- spawnEnemy(enemyT2, Enemies.Enemy2)
        enemyT3 <- spawnEnemy(enemyT3, Enemies.Enemy3)
