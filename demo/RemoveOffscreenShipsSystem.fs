namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type RemoveOffscreenShipsSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Velocity, Component.Position, Component.Health, Component.Bounds))

    interface IExecuteSystem with
        member this.Execute() =
            for entity in group.GetEntities() do
                if entity.position.y < (0.0f - entity.bounds.radius*4.0f) then
                    if not entity.isPlayer then entity.SetDestroy(true) |> ignore