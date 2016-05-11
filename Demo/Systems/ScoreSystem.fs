namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open Bosco.ECS
open System
open System.Collections.Generic
open UnityEngine

type ScoreSystem(world:World) =

    interface IInitializeSystem with
        member this.Initialize() =
            world.SetScore(0)

    interface IExecuteSystem with
        member this.Execute() =

            let delta = Time.deltaTime/100.0f

            for e in (group.GetEntities()) do
                e.position.x <- e.position.x + (e.velocity.x * delta)
                e.position.y <- e.position.y + (e.velocity.y * delta)
                e.position.z <- e.position.z + (e.velocity.z * delta)
