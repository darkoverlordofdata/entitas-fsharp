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
open System.Diagnostics

type ExpiringSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Expires))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                e.Expires.Delay <- e.Expires.Delay - world.deltaTime
                if e.Expires.Delay <= 0.0f then
                    e.SetDestroy(true) |> ignore
