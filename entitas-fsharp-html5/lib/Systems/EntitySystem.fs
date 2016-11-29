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
module EntitySystemModule =
    (**
    * Activate / Deactiveate Entities as needed 
    *)
    let EntitySystem (game:SystemInterface, width: int, height: int) entity =

        match entity.Active with
        | true -> 
            let mutable removed = false
            let rec removeIf l predicate =
                match l with
                | [] -> []
                | x::rest -> 
                    if predicate(x) then 
                        removed <- true
                        (removeIf rest predicate) 
                    else 
                        x::(removeIf rest predicate)

            let len = game.Deactivate.Length
            game.Deactivate <- (removeIf game.Deactivate (fun id -> id = entity.Id))
            {
                entity with 
                    Active = not removed;
            }

        | false -> 
            match entity.Layer with
            | Layer.BULLET ->
                match game.Bullets with
                | [] -> entity
                | bullet :: rest ->
                    game.Bullets <- rest
                    {            
                        entity with
                            Active = true;
                            Expires = Some(0.5);                        
                            Position = CreatePoint(bullet.X, bullet.Y);
                    }
            | Layer.ENEMY1 ->
                match game.Enemies1 with
                | [] -> entity
                | enemy :: rest ->
                game.Enemies1 <- rest
                {
                        entity with 
                            Active = true;
                            Position = CreatePoint(float(rnd.Next(width-35)), 91./2.0);
                            Health = Some(CreateHealth(10, 10));
                    }
            | Layer.ENEMY2 ->
                match game.Enemies2 with
                | [] -> entity
                | enemy :: rest ->
                    game.Enemies2 <- rest
                    {
                        entity with 
                            Active = true;
                            Position = CreatePoint(float(rnd.Next(width-86)), 172./2.);
                            Health = Some(CreateHealth(20, 20));                
                    }
            | Layer.ENEMY3 ->
                match game.Enemies3 with
                | [] -> entity
                | enemy :: rest ->
                    game.Enemies3 <- rest
                    {
                        entity with 
                            Active = true;
                            Position = CreatePoint(float(rnd.Next(width-160)), 320./2.);
                            Health = Some(CreateHealth(60, 60));                
                    }
            | Layer.EXPLOSION ->
                match game.Explosions with
                | [] -> entity
                | exp :: rest ->
                    game.Explosions <- rest
                    {
                        entity with 
                            Active = true;
                            Expires = Some(0.2);                        
                            Scale = Some(CreatePoint(exp.Scale, exp.Scale));
                            Position = CreatePoint(exp.X, exp.Y);
                    }
            | Layer.BANG ->
                match game.Bangs with
                | [] -> entity
                | exp :: rest ->
                    game.Bangs <- rest
                    {
                        entity with 
                            Active = true;
                            Expires = Some(0.2);                        
                            Scale = Some(CreatePoint(exp.Scale, exp.Scale));
                            Position = CreatePoint(exp.X, exp.Y);
                    }
            | _ -> entity

