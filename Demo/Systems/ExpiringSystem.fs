namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type ExpiringSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.Expires)

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                e.expires.delay <- e.expires.delay - game.delta
                if e.expires.delay <= 0.0f then
                    e.SetDestroy(true) |> ignore
