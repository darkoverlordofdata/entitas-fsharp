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
module RemoveOffscreenShipsSystemModule =
    let RemoveOffscreenShipsSystem (game:SystemInterface, width: int, height: int) entity =
        match entity.EntityType, entity.Active with
        | EntityType.Enemy, true when int entity.Position.y > height ->
            { 
                entity with 
                    Active = false;
            }
        | _ -> entity
