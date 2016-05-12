namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open System
open System.Collections.Generic
open Entitas

type Enemies =
    | Enemy1
    | Enemy2
    | Enemy3

type Timers =
    | Timer1 = 2
    | Timer2 = 6
    | Timer3 = 12


type EntitySpawningTimerSystem(game: IGame, pool:Pool) =

    let mutable t1 = 0.0f
    let mutable t2 = 0.0f
    let mutable t3 = 0.0f

    let spawnEnemy (t, enemy) =
        let delta = t - game.delta

        if delta < 0.0f then
            match enemy with
            | Enemy1 -> 
                printfn "Enemy1"
                pool.CreateEnemy1() |> ignore
                float32(Timers.Timer1)
            | Enemy2 ->
                printfn "Enemy2"
                pool.CreateEnemy2() |> ignore
                float32(Timers.Timer2)
            | Enemy3 ->
                printfn "Enemy3"
                pool.CreateEnemy3() |> ignore
                float32(Timers.Timer3)

        else
            delta


    interface IInitializeSystem with
        member this.Initialize() =
            t1 <- float32(Timers.Timer1)
            t2 <- float32(Timers.Timer2)
            t3 <- float32(Timers.Timer3)

    interface IExecuteSystem with
        member this.Execute() =
            t1 <- spawnEnemy(t1, Enemy1)
            t2 <- spawnEnemy(t2, Enemy2)
            t3 <- spawnEnemy(t3, Enemy3)
