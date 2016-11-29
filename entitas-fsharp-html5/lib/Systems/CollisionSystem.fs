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
module CollisionSystemModule =
    (** Return Rect defining the current bounds *)
    let BoundingRect(entity) =
        let x = entity.Position.x
        let y = entity.Position.y
        let w = entity.Size.x
        let h = entity.Size.y
        CreateRect(x - w/2., y - h/2., w, h):>PIXI.HitArea

    (** Collision Handler for Entities *)
    let CollisionSystem (game:SystemInterface) entities =

        let findCollision a b =
            match a.EntityType, a.Active, b.EntityType, b.Active with
            | EntityType.Enemy, true, EntityType.Bullet, true -> 
                game.AddBang(b.Position.x, b.Position.y, 1.0)
                game.RemoveEntity(b.Id)
                match a.Health with
                | Some(h) ->
                    let health = h.CurHealth-1
                    if health <= 0 then
                        game.AddExplosion(b.Position.x, b.Position.y, 0.5)
                        {
                            a with
                                Active = false;
                        }
                    else
                        {
                            a with 
                                Health = Some(CreateHealth(health, h.MaxHealth));
                        }

                | None -> a
            | _ -> a

        let rec figureCollisions (entity:Entity) (sortedEntities:Entity list) =
            match sortedEntities with
            | [] -> entity
            | x :: xs -> 
                let a = if (BoundingRect(entity).contains(x.Position.x, x.Position.y)) then
                            findCollision entity x
                        else
                            entity
                figureCollisions a xs

        let rec fixCollisions (toFix:Entity list) (alreadyFixed:Entity list) =
            match toFix with
            | [] -> alreadyFixed
            | x :: xs -> 
                let a = figureCollisions x alreadyFixed
                fixCollisions xs (a::alreadyFixed)

        fixCollisions entities []
