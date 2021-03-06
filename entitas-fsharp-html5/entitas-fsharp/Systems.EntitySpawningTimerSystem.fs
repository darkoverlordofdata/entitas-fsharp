namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open System
open System.Collections.Generic
open Entitas
open ShmupWarz
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Content

type Enemies =
    | Enemy1
    | Enemy2
    | Enemy3

type Timers =
    | Timer1 = 2
    | Timer2 = 6
    | Timer3 = 12


type EntitySpawningTimerSystem(world:World, width, height) =

    let mutable t1 = 0.0f
    let mutable t2 = 0.0f
    let mutable t3 = 0.0f

    let spawnEnemy (t, enemy) =
        let delta = t - world.deltaTime

        if delta < 0.0f then
            match enemy with
            | Enemy1 -> 
                world.CreateEnemy1(width, height) |> ignore
                float32(Timers.Timer1)
            | Enemy2 ->
                world.CreateEnemy2(width, height) |> ignore
                float32(Timers.Timer2)
            | Enemy3 ->
                world.CreateEnemy3(width, height) |> ignore
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
