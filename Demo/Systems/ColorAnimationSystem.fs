namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type ColorAnimationSystem(pool:Pool) =
    interface IExecuteSystem with
        member this.Execute() =
            ()