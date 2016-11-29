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

type RenderSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.View))

    static member val ViewContainer = List.empty<Entity> with get, set

    interface IExecuteSystem with
        member this.Execute() =
            for entity in (group.GetEntities()) do
                RenderSystem.ViewContainer <- entity :: RenderSystem.ViewContainer
