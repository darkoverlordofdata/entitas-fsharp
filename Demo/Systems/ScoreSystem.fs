namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type ScoreSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Score))

    interface IInitializeSystem with
        member this.Initialize() =
            //pool.SetScore(0)
            ()

    interface IExecuteSystem with
        member this.Execute() =
            ()
