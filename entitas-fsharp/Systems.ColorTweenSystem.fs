namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open Entitas
open System
open System.Collections.Generic
open Microsoft.Xna.Framework

type ColorTweenSystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.ColorTween, Matcher.Tint))

    interface IExecuteSystem with
        member this.Execute() =
            let delta = 1.0f //world.deltaTime
            for entity in (group.GetEntities()) do
                let mutable tint = (entity.Tint.Color):?>Color

                if entity.ColorTween.RedAnimate then
                    tint.R <- tint.R + byte(entity.ColorTween.RedSpeed * delta)
                    if tint.R > byte(entity.ColorTween.RedMax) || tint.R < byte(entity.ColorTween.RedMin) then
                        if entity.ColorTween.Repeat then
                            entity.ColorTween.RedSpeed<- -entity.ColorTween.RedSpeed
                        else
                            entity.ColorTween.RedAnimate <- false

                if entity.ColorTween.GreenAnimate then
                    tint.G <- tint.G + byte(entity.ColorTween.GreenSpeed * delta)
                    if tint.G > byte(entity.ColorTween.GreenMax) || tint.G < byte(entity.ColorTween.GreenMin) then
                        if entity.ColorTween.Repeat then
                            entity.ColorTween.GreenSpeed<- -entity.ColorTween.GreenSpeed
                        else
                            entity.ColorTween.GreenAnimate <- false

                if entity.ColorTween.BlueAnimate then
                    tint.B <- tint.B + byte(entity.ColorTween.BlueSpeed * delta)
                    if tint.B > byte(entity.ColorTween.BlueMax) || tint.B < byte(entity.ColorTween.BlueMin) then
                        if entity.ColorTween.Repeat then
                            entity.ColorTween.BlueSpeed<- -entity.ColorTween.BlueSpeed
                        else
                            entity.ColorTween.BlueAnimate <- false

                if entity.ColorTween.AlphaAnimate then
                    tint.A <- tint.A + byte(entity.ColorTween.AlphaSpeed * delta)
                    if tint.A > byte(entity.ColorTween.AlphaMax) || tint.A < byte(entity.ColorTween.AlphaMin) then
                        if entity.ColorTween.Repeat then
                            entity.ColorTween.AlphaSpeed<- -entity.ColorTween.AlphaSpeed
                        else
                            entity.ColorTween.AlphaAnimate <- false


            ()