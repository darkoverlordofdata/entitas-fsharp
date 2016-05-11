namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open System
open System.Collections.Generic
open Entitas


type CollisionTypes =
    | BulletHitEnemy
    | MineHitPlayer

type CollisionSystem(pool:Pool) =

    [<DefaultValue>] val mutable pool:Pool
    [<DefaultValue>] val mutable bullets:Group
    [<DefaultValue>] val mutable enemies:Group
    [<DefaultValue>] val mutable players:Group
    [<DefaultValue>] val mutable mines:Group


    let bullets = pool.GetGroup(Matcher.Bullet)
    let enemies = pool.GetGroup(Matcher.Enemy)
    let players = pool.GetGroup(Matcher.Player)
    let mines = pool.GetGroup(Matcher.Mine)

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
            pool.CreateSmallExplosion(pos.x, pos.y) |> ignore
            weapon.SetDestroy(true) |> ignore

            let mutable health = ship.health
            health.health <- health.health-1.0f
            if health.health <= 0.0f then
                pool.score.value <- pool.score.value + int health.maximumHealth
                ship.SetDestroy(true) |> ignore
                let position = ship.position
                pool.CreateBigExplosion(position.x, position.y) |> ignore
            //else
                //let percentage = Math.Truncate(float(health.health / health.maximumHealth) * 100.0)
                //let text = ((ship.view).gameObject:?>GameObject).GetComponent("TextMesh")

                //(text:?>TextMesh).text <- (sprintf "%i%%" (int percentage))

        | MineHitPlayer ->
            //Debug.Log("MineHitPlayer")
            printfn "MineHitPlayer"
        

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


    interface ISetPool with
        member this.SetPool(pool) =
            this.pool <- pool

    interface IInitializeSystem with
        member this.Initialize() =
            pool.SetStatus(100.0f, 0.0f) |> ignore
            pool.SetScore(0) |> ignore


