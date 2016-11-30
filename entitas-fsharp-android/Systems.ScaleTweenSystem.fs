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
                let scaleTween = e.ScaleTween
                if scaleTween.Active then
                    let scale = e.Scale
                    scale.X <- scale.X + (scaleTween.Speed * world.deltaTime)
                    scale.Y <- scale.X
                    if scale.X > scaleTween.Max then
                        scale.X <- scaleTween.Max
                        scale.Y <- scale.X
                        scaleTween.Active <- false
                    elif scale.X < scaleTween.Min then
                        scale.X <- scaleTween.Min
                        scale.Y <- scale.X
                        scaleTween.Active <- false

                    //let transform = ((e.view).gameObject:?>GameObject).transform
                    //transform.localScale <- new Vector3(scale.X, scale.Y, transform.localScale.z)
