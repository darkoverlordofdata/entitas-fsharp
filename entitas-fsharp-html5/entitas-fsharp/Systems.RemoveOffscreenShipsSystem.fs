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

type RemoveOffscreenShipsSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Velocity, Matcher.Position, Matcher.Health, Matcher.Bounds))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                if e.Position.Y < (0.0f - e.Bounds.Radius*4.0f) then
                    if not e.IsPlayer then e.SetDestroy(true) |> ignore