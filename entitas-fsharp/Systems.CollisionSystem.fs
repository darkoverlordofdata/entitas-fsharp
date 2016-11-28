namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open System
open System.Collections.Generic
open Entitas
open ShmupWarz
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Content


type CollisionTypes =
    | BulletHitEnemy
    | MineHitPlayer

type CollisionSystem(world:World) =

    let bullets = world.GetGroup(Matcher.Bullet)
    let enemies = world.GetGroup(Matcher.Enemy)
    let players = world.GetGroup(Matcher.Player)
    let mines = world.GetGroup(Matcher.Mine)

    let collidesWith(e1:Entity, e2:Entity) =
        let position1 = e1.position
        let position2 = e2.position

        let a = float(position1.x) - float(position2.x)
        let b = float(position1.y) - float(position2.y)
        (float32(Math.Sqrt(a * a + b * b)) - e1.bounds.radius) < e2.bounds.radius

    let collisionHandler(attack, weapon:Entity, ship:Entity) =

        match attack with 

        | BulletHitEnemy ->
            let pos = weapon.position
            world.CreateSmallExplosion(pos.x, pos.y) |> ignore
            //ShrapnelController.Spawn(pos.x, pos.y) |> ignore
            weapon.SetDestroy(true) |> ignore

            let mutable health = ship.health
            health.health <- health.health-1.0f
            if health.health <= 0.0f then
                world.score.value <- world.score.value + int health.maximumHealth
                ship.SetDestroy(true) |> ignore
                let position = ship.position
                world.CreateBigExplosion(position.x, position.y) |> ignore
            //else
                //let percentage = Math.Truncate(float(health.health / health.maximumHealth) * 100.0)
                //let text = ((ship.view).gameObject:?>GameObject).GetComponent("TextMesh")

                //(text:?>TextMesh).text <- (sprintf "%i%%" (int percentage))

        | MineHitPlayer ->
            Console.WriteLine("MineHitPlayer")
        

    interface IExecuteSystem with
        member this.Execute() =
            for bullet in bullets.GetEntities() do
                for enemy in enemies.GetEntities() do
                    if collidesWith(bullet, enemy) then
                        collisionHandler(BulletHitEnemy, bullet, enemy)

            //let player = players.GetSingleEntity()
            //for mine in mines.GetEntities() do
            //    if collidesWith(mine, player) then
            //        collisionHandler(MineHitPlayer, mine, player)


    interface IInitializeSystem with
        member this.Initialize() =
            world.SetStatus(100.0f, 0.0f) |> ignore
            world.SetScore(0) |> ignore


