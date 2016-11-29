
namespace Systems

#if HTML5
open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop
open Bosco
#endif
open Components
open Entities
open System.Collections.Generic

[<AutoOpen>]
module TweenSystemModule =
    let TweenSystem (delta:float, game:SystemInterface) entity =
        match (entity.Scale, entity.Tween, entity.Active) with
        | Some(scale), Some(sa), true ->        
            let mutable x = scale.x + (sa.Speed * delta)
            let mutable y =  scale.y + (sa.Speed * delta)
            let mutable active = sa.Active
            if x > sa.Max then
                x <- sa.Max
                y <- sa.Max
                active <- false
            elif x < sa.Min then
                x <- sa.Min
                y <- sa.Min
                active <- false

            {
                entity with
                    Scale = Some(CreatePoint(x, y));
                    Tween = Some(CreateTween(sa.Min, sa.Max, sa.Speed, sa.Repeat, active));
            }

        | _ -> 
            entity

