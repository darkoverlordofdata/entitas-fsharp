namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas

type ScaleTweenSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Scale, Component.ScaleAnimation, Component.View))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                let scaleAnimation = e.scaleAnimation
                if scaleAnimation.active then
                    let scale = e.scale
                    scale.x <- scale.x + (scaleAnimation.speed * game.delta)
                    scale.y <- scale.x
                    printfn "%s %f %f %f" e.Name scale.x scaleAnimation.speed game.delta
                    if scale.x > scaleAnimation.max then
                        scale.x <- scaleAnimation.max
                        scale.y <- scale.x
                        scaleAnimation.active <- false
                    elif scale.x < scaleAnimation.min then
                        scale.x <- scaleAnimation.min
                        scale.y <- scale.x
                        scaleAnimation.active <- false

                    //let transform = ((e.view).gameObject:?>GameObject).transform
                    //transform.localScale <- new Vector3(scale.x, scale.y, transform.localScale.z)
