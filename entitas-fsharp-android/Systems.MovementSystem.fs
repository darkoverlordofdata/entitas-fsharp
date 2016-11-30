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

type MovementSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Position, Matcher.Velocity))

    let mutable x = 0

    interface IExecuteSystem with
        member this.Execute() =

            let delta = world.deltaTime
            for e in (group.GetEntities()) do
                x <- x+1
                e.Position.X <- e.Position.X + (e.Velocity.X * delta)
                e.Position.Y <- e.Position.Y + (e.Velocity.Y * delta)

                //e.position.z <- e.position.z + (e.velocity.z * delta)
