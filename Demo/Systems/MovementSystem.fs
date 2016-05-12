namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type MovementSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Position, Component.Velocity))

    interface IExecuteSystem with
        member this.Execute() =

            for entity in group.GetEntities() do

                entity.position.x <- entity.position.x + entity.velocity.x * game.delta

                entity.position.y <- entity.position.y + entity.velocity.y * game.delta

