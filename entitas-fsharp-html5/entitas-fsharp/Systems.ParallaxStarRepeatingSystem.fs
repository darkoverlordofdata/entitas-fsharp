namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas
open ShmupWarz
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Content

type ParallaxStarRepeatingSystem(world:World) =
    interface IExecuteSystem with
        member this.Execute() =
            ()
    interface IInitializeSystem with
        member this.Initialize() =
            ()