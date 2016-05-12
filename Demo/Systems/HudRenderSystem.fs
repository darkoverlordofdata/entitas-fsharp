namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type HudRenderSystem(pool:Pool) =
    interface IExecuteSystem with
        member this.Execute() =
            ()
    interface IInitializeSystem with
        member this.Initialize() =
            ()