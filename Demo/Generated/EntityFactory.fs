namespace ShmupWarz
(**
 * Entity Factory
 *
 *)
[<AutoOpen>]
module EntityFactory =

    open Entitas
    open System
    open System.Collections.Generic
    //open UnityEngine

    let EFFECT_PEW = 0
    let EFFECT_ASPLODE = 1
    let EFFECT_SMALLASPLODE = 1
    let ScreenWidth = 480
    let ScreenHeight = 720
    type Pool with

        (** 
         * Create Player
         *
         * @returns new player entity
         *)
        member this.CreatePlayer() =
            this.CreateEntity("Player")
                .AddBounds(1.0f)
                .AddHealth(100.0f, 100.0f)
                .AddPosition(float32(ScreenWidth/2), 100.0f)
                .SetPlayer(true)
                .AddResource("images/fighter.png")

        (** 
         * Create Bullet
         *
         * @param x
         * @param y
         * @returns new bullet entity
         *)
        member this.CreateBullet(x, y) =
            this.CreateEntity("Bullet")
                .AddBounds(0.1f)
                .AddVelocity(0.0f, float32(800*3))
                .AddPosition(x, y)
                .AddExpires(2.0f)
                .AddSoundEffect(float32(EFFECT_PEW))
                .SetBullet(true)
                .AddResource("images/bullet.png")

        (** 
         * Create Mine
         *
         * @param health
         * @param x
         * @param y
         * @param velocity
         * @returns new mine entity
         *)
        member this.CreateMine(health, x, y, velocity) =
            this.CreateEntity("Mine")
                .AddBounds(0.25f)
                .AddVelocity(0.0f, float32(-velocity))
                .AddPosition(x, y)
                .AddHealth(float32(health*10), float32(health*10))
                .SetMine(true)
                .AddResource(sprintf "images/mine%s.png" (health.ToString()))

        (** 
         * Create Life
         *
         * @param ordinal
         * @returns new life entity
         *)
        member this.CreateLife(ordinal) =
            let x = float32((ScreenWidth/2)-((ordinal+1) * 40)+87)
            let y = 80.0f
            this.CreateEntity("Life")
                .AddPosition(x, y)
                .AddLife(float32(ordinal))
                .AddResource("images/life.png")

        (** 
         * Create Status
         *
         * @returns new status entity
         *)
        member this.CreateStatus() =
            let x = float32(ScreenWidth/2)
            let y = 120.0f
            this.CreateEntity("Status")
                .AddPosition(x, y)
                .AddResource("images/status.png")

        (** 
         * Create Enemy1
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy1() =
            let x = float32(rnd.Next(ScreenWidth))
            let y = float32(ScreenHeight-100)
            this.CreateEntity("Enemy1")
                .AddBounds(1.0f)
                .AddPosition(x, y)
                .AddVelocity(0.0f, float32(-40*3))
                .AddHealth(10.0f, 10.0f)
                .SetEnemy(true)
                .AddResource("images/enemy1.png")

        (** 
         * Create Enemy2
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy2() =
            let x = float32(rnd.Next(ScreenWidth))
            let y = float32(ScreenHeight-200)
            this.CreateEntity("Enemy2")
                .AddBounds(2.0f)
                .AddPosition(x, y)
                .AddVelocity(0.0f, float32(-30*3))
                .AddHealth(20.0f, 20.0f)
                .SetEnemy(true)
                .AddResource("images/enemy2.png")

        (** 
         * Create Enemy3
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy3() =
            let x = float32(rnd.Next(ScreenWidth))
            let y = float32(ScreenHeight-300)
            this.CreateEntity("Enemy3")
                .AddBounds(3.0f)
                .AddPosition(x, y)
                .AddVelocity(0.0f, float32(-20*3))
                .AddHealth(40.0f, 40.0f)
                .SetEnemy(true)
                .AddResource("images/enemy3.png")

        (** 
         * Create Huge Explosion
         *
         * @param x
         * @param y
         * @returns new explosion entity
         *)
        member this.CreateHugeExplosion(x, y) =
            let scale = 1.0f
            this.CreateEntity("HugeExplosion")
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddPosition(x, y)
                .AddResource("images/bigExplosion.png")

        (** 
         * Create Big Explosion
         *
         * @param x
         * @param y
         * @returns new explosion entity
         *)
        member this.CreateBigExplosion(x, y) =
            let scale = 0.5f
            this.CreateEntity("BigExplosion")
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddPosition(x, y)
                .AddResource("images/bigExplosion.png")

        (** 
         * Create Small Explosion
         *
         * @param x
         * @param y
         * @returns new explosion entity
         *)
        member this.CreateSmallExplosion(x, y) =
            let scale = 0.1f
            this.CreateEntity("SmallExplosion")
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddPosition(x, y)
                .AddResource("images/smallExplosion.png")

