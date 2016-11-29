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
module InputSystemModule =
    let mutable timeToFire = 0.0
    (** Get Player Input *)
    let InputSystem (delta:float, mobile:bool, game:SystemInterface) entity =
        let pf = if mobile then 2.0 else 1.0
        match entity.EntityType with
        | EntityType.Player -> 

            let position =
                let newPosition = Mouse.position
                if Keyboard.isPressed 90 then
                    timeToFire <- timeToFire - delta
                    if timeToFire <= 0.0 then
                        game.AddBullet(newPosition.x-27.0, newPosition.y)
                        game.AddBullet(newPosition.x+27.0, newPosition.y)
                        timeToFire <- 0.1
                    newPosition
                else
                    if Mouse.down then
                        timeToFire <- timeToFire - delta
                        if timeToFire <= 0.0 then
                            game.AddBullet(newPosition.x-27.0, newPosition.y)
                            game.AddBullet(newPosition.x+27.0, newPosition.y)
                            timeToFire <- 0.1
                        newPosition
                    else
                        newPosition

            (* Set Player Position *)
            { entity with Position = position;  }
        | _ ->
            entity
