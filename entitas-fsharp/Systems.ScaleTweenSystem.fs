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

type ScaleTweenSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Scale, Matcher.ScaleTween, Matcher.View))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                let scaleTween = e.scaleTween
                if scaleTween.active then
                    let scale = e.scale
                    scale.x <- scale.x + (scaleTween.speed * world.deltaTime)
                    scale.y <- scale.x
                    Console.WriteLine(sprintf "%s %f %f %f" e.Name scale.x scaleTween.speed world.deltaTime)
                    if scale.x > scaleTween.max then
                        scale.x <- scaleTween.max
                        scale.y <- scale.x
                        scaleTween.active <- false
                    elif scale.x < scaleTween.min then
                        scale.x <- scaleTween.min
                        scale.y <- scale.x
                        scaleTween.active <- false

                    //let transform = ((e.view).gameObject:?>GameObject).transform
                    //transform.localScale <- new Vector3(scale.x, scale.y, transform.localScale.z)
