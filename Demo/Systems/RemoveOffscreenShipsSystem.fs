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
            for e in (group.GetEntities()) do
                if e.position.y < (0.0f - e.bounds.radius*4.0f) then
                    if not e.isPlayer then e.SetDestroy(true) |> ignore