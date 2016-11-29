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
module MovementSystemModule =
    (** Movement System *)
    let MovementSystem (delta:float) entity =

        match entity.Velocity, entity.Active with

        | Some(velocity), true ->
            let x = entity.Position.x + velocity.x * delta
            let y = entity.Position.y + velocity.y * delta
            { entity with Position = CreatePoint(float x, float y)}

        | _ -> entity

