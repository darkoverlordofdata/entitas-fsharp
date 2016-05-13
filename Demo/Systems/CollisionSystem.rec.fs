namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open System
open System.Collections.Generic
open Microsoft.Xna.Framework
open Entitas


type CollisionTypesY =
    | BulletHitEnemy
    | MineHitPlayer

type CollisionSystemY(game: IGame, pool:Pool) =

    let bullets = pool.GetGroup(Matcher.AllOf(Component.Bullet))
    let enemies = pool.GetGroup(Matcher.AllOf(Component.Enemy))

    (** Return Rect defining the current bounds *)
    let BoundingRect(entity:Entity) =
        let r = int entity.bounds.radius
        let x = int entity.position.x - int r/2
        let y = int entity.position.y

        Rectangle(x,y,r,r)

    let DoCollision (enemy:Entity) (bullet:Entity) =
        if enemy.isEnemy && bullet.isBullet then

            let pos = bullet.position
            pool.CreateSmallExplosion(game:?>Game, pos.x, pos.y) |> ignore
            bullet.SetDestroy(true) |> ignore

            let mutable health = enemy.health
            health.health <- health.health-1.0f
            if health.health <= 0.0f then
                pool.score.value <- pool.score.value + int health.maximumHealth
                enemy.SetDestroy(true) |> ignore
                let position = enemy.position
                pool.CreateBigExplosion(game:?>Game, position.x, position.y) |> ignore
        enemy

    let rec CheckCollision (entity:Entity) (entities:Entity list) =
        match entities with
        | [] -> entity
        | x :: xs -> 
            let a = if (BoundingRect(entity).Intersects(BoundingRect(x))) then DoCollision entity x else entity
            CheckCollision a xs

    let rec EachCollision (fromEntity:Entity list) (toEntity:Entity list) =
        match fromEntity with
        | [] -> toEntity
        | x :: xs -> 
            let a = CheckCollision x toEntity
            EachCollision xs (a::toEntity)



    interface IExecuteSystem with
        member this.Execute() =

            let l1 = bullets.GetEntities() |> Array.toList
            let l2 = enemies.GetEntities() |> Array.toList
            EachCollision (List.append l1 l2) [] |> ignore

    interface IInitializeSystem with
        member this.Initialize() =
            pool.SetStatus(100.0f, 0.0f) |> ignore
            pool.SetScore(0) |> ignore


