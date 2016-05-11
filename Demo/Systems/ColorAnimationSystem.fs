namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open Bosco.ECS
open System
open System.Collections.Generic

type ColorAnimationSystem(world:World) =
    interface IExecuteSystem with
        member this.Execute() =
            ()