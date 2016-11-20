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

    type Pool with

        (** 
         * Create Player
         *
         * @returns new player entity
         *)
        member this.CreatePlayer() =
            //let pos = Camera.main.ScreenToWorldPoint(new Vector3(float32(Screen.width/2), 100.0f, 0.0f))
            this.CreateEntity("Player")
                .AddBounds(1.0f)
                .AddHealth(100.0f, 100.0f)
                //.AddPosition(pos.x, pos.y, pos.z)
                .SetPlayer(true)
                .AddResource("fighter")

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
                .AddVelocity(0.0f, float32(800*3), 0.0f)
                .AddPosition(x, y, 0.0f)
                .AddExpires(2.0f)
                .AddSoundEffect(float32(EFFECT_PEW))
                .SetBullet(true)
                .AddResource("bullet")

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
            //let pos = Camera.main.ScreenToWorldPoint(new Vector3(float32(x), float32(Screen.height-y), 0.0f))
            this.CreateEntity("Mine")
                .AddBounds(0.25f)
                .AddVelocity(0.0f, float32(-velocity), 0.0f)
                //.AddPosition(pos.x, pos.y, pos.z)
                .AddHealth(float32(health*10), float32(health*10))
                .SetMine(true)
                .AddResource("mine"+health.ToString())

        (** 
         * Create Life
         *
         * @param ordinal
         * @returns new life entity
         *)
        member this.CreateLife(ordinal) =
            //let x = (Screen.width/2)-((ordinal+1) * 40)+87
            //let y = 80
            //let pos = Camera.main.ScreenToWorldPoint(new Vector3(float32(x), float32(Screen.height-y), 0.0f))
            this.CreateEntity("Life")
                //.AddPosition(pos.x, pos.y, pos.z)
                .AddLife(float32(ordinal))
                .AddResource("life")

        (** 
         * Create Status
         *
         * @returns new status entity
         *)
        member this.CreateStatus() =
            //let x = (Screen.width/2)
            //let y = 120
            //let pos = Camera.main.ScreenToWorldPoint(new Vector3(float32(x), float32(Screen.height-y), 0.0f))
            this.CreateEntity("Status")
                //.AddPosition(pos.x, pos.y, pos.z)
                .AddResource("status")

        (** 
         * Create Enemy1
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy1() =
            //let x = rnd.Next(Screen.width)
            //let y = Screen.height-100
            //let pos = Camera.main.ScreenToWorldPoint(new Vector3(float32(x), float32(y), 0.0f))
            this.CreateEntity("Enemy1")
                .AddBounds(1.0f)
                //.AddPosition(pos.x, pos.y, pos.z)
                .AddVelocity(0.0f, float32(-40*3), 0.0f)
                .AddHealth(10.0f, 10.0f)
                .SetEnemy(true)
                .AddResource("enemy1")

        (** 
         * Create Enemy2
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy2() =
            //let x = rnd.Next(Screen.width)
            //let y = Screen.height-200
            //let pos = Camera.main.ScreenToWorldPoint(new Vector3(float32(x), float32(y), 0.0f))
            this.CreateEntity("Enemy2")
                .AddBounds(2.0f)
                //.AddPosition(pos.x, pos.y, pos.z)
                .AddVelocity(0.0f, float32(-30*3), 0.0f)
                .AddHealth(20.0f, 20.0f)
                .SetEnemy(true)
                .AddResource("enemy2")

        (** 
         * Create Enemy3
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy3() =
            //let x = rnd.Next(Screen.width)
            //let y = Screen.height-300
            //let pos = Camera.main.ScreenToWorldPoint(new Vector3(float32(x), float32(y), 0.0f))
            this.CreateEntity("Enemy3")
                .AddBounds(3.0f)
                //.AddPosition(pos.x, pos.y, pos.z)
                .AddVelocity(0.0f, float32(-20*3), 0.0f)
                .AddHealth(40.0f, 40.0f)
                .SetEnemy(true)
                .AddResource("enemy3")

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
                .AddPosition(x, y, 0.0f)
                .AddResource("bigExplosion")

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
                .AddPosition(x, y, 0.0f)
                .AddResource("bigExplosion")

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
                .AddPosition(x, y, 0.0f)
                .AddResource("smallExplosion")

