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

    let collidesWith(e1:Entity, e2:Entity) =
        let position1 = e1.position
        let position2 = e2.position

        let a = float(position1.x) - float(position2.x)
        let b = float(position1.y) - float(position2.y)
        (float32(Math.Sqrt(a * a + b * b)) - e1.bounds.radius) < e2.bounds.radius

    let collisionHandler(weapon:Entity, ship:Entity) =

        let pos = weapon.position
        pool.CreateSmallExplosion(game:?>Game, pos.x, pos.y) |> ignore
        weapon.SetDestroy(true) |> ignore

        let mutable health = ship.health
        health.health <- health.health-1.0f
        if health.health <= 0.0f then
            pool.score.value <- pool.score.value + int health.maximumHealth
            ship.SetDestroy(true) |> ignore
            let position = ship.position
            pool.CreateBigExplosion(game:?>Game, position.x, position.y) |> ignore

    interface IExecuteSystem with
        member this.Execute() =
            for bullet in bullets.GetEntities() do
                for enemy in enemies.GetEntities() do
                    if collidesWith(bullet, enemy) then
                        collisionHandler(bullet, enemy)



    interface IInitializeSystem with
        member this.Initialize() =
            pool.SetStatus(100.0f, 0.0f) |> ignore
            pool.SetScore(0) |> ignore


