namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open Bosco.ECS
open System
open System.Collections.Generic
open UnityEngine

type RenderPositionSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Position, Matcher.Resource))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                let pos = e.position
                let transform = ((e.view).gameObject:?>GameObject).transform
                transform.position <- new Vector3(pos.x, pos.y, 0.0f)
