namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open Entitas
open System
open System.Collections.Generic

type ColorAnimationSystem(world:World) =
    interface IExecuteSystem with
        member this.Execute() =
            ()