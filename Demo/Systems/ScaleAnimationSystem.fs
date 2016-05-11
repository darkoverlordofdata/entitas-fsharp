namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open Bosco.ECS
open System
open System.Collections.Generic
open UnityEngine

type ScaleAnimationSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Scale, Matcher.ScaleAnimation, Matcher.View))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                let scaleAnimation = e.scaleAnimation
                if scaleAnimation.active then
                    let scale = e.scale
                    scale.x <- scale.x + (scaleAnimation.speed * Time.deltaTime)
                    scale.y <- scale.x
                    Debug.Log(sprintf "%s %f %f %f" e.Name scale.x scaleAnimation.speed Time.deltaTime)
                    if scale.x > scaleAnimation.max then
                        scale.x <- scaleAnimation.max
                        scale.y <- scale.x
                        scaleAnimation.active <- false
                    elif scale.x < scaleAnimation.min then
                        scale.x <- scaleAnimation.min
                        scale.y <- scale.x
                        scaleAnimation.active <- false

                    let transform = ((e.view).gameObject:?>GameObject).transform
                    transform.localScale <- new Vector3(scale.x, scale.y, transform.localScale.z)
