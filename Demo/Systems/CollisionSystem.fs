namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open System
open System.Collections.Generic
open Microsoft.Xna.Framework
open Entitas


type CollisionTypes =
    | BulletHitEnemy
    | MineHitPlayer

type CollisionSystem(game: IGame, pool:Pool) =

    let bullets = pool.GetGroup(Matcher.Bullet)
    let enemies = pool.GetGroup(Matcher.Enemy)
    let players = pool.GetGroup(Matcher.Player)

    (** Return Rect defining the current bounds *)
    let BoundingRect(entity:Entity) =
        let r = int entity.bounds.radius
        let x = int entity.position.x - int r/2
        let y = int entity.position.y
        Rectangle(x,y,r,r)


    interface IExecuteSystem with
        member this.Execute() =
            let mutable inactive = []

            for enemy in enemies.GetEntities() do
                for bullet in bullets.GetEntities() do
                    if not(inactive |> List.contains enemy.Id) then

                        if (BoundingRect(bullet).Intersects(BoundingRect(enemy))) then

                            let pos = bullet.position
                            pool.CreateSmallExplosion(game:?>Game, pos.x, pos.y) |> ignore
                            bullet.SetDestroy(true) |> ignore

                            let mutable health = enemy.health
                            health.health <- health.health-1.0f
                            if health.health <= 0.0f then
                                inactive <- enemy.Id :: inactive
                                let player = players.GetSingleEntity()
                                player.score.value <- player.score.value + int health.maximumHealth
                                enemy.SetDestroy(true) |> ignore
                                let position = enemy.position
                                pool.CreateBigExplosion(game:?>Game, position.x, position.y) |> ignore


