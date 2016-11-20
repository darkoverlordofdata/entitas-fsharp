namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type HealthRenderSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Position, Component.Health, Component.Enemy))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
               () 