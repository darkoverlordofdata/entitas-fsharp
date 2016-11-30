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

type HealthRenderSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Position, Matcher.Health, Matcher.Enemy))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                