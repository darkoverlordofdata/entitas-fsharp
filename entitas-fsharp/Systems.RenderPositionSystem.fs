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

type RenderPositionSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.View))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                viewContainer <- e :: viewContainer
