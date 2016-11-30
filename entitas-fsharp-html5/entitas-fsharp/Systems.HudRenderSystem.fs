namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open Bosco.ECS
open System
open System.Collections.Generic

type HudRenderSystem(world:World) =
    interface IExecuteSystem with
        member this.Execute() =
            ()
    interface IInitializeSystem with
        member this.Initialize() =
            ()