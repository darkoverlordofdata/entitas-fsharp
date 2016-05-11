namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Bosco.ECS
open ShmupWarz
open UnityEngine

type ExpiringSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Expires))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                e.expires.delay <- e.expires.delay - Time.deltaTime
                if e.expires.delay <= 0.0f then
                    e.SetDestroy(true) |> ignore
