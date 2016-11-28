namespace ShmupWarz
(**
 * Entity Factory
 *
 *)
[<AutoOpen>]
module EntityFactory =

    open Entitas
    open System
    open System.Collections
    open System.Collections.Generic
    open Microsoft.Xna.Framework
    open Microsoft.Xna.Framework.Graphics

    type Layer =
        | DEFAULT           = 0
        | BACKGROUND        = 1
        | TEXT              = 2
        | LIVES             = 3
        | ENEMY1            = 4
        | ENEMY2            = 5
        | ENEMY3            = 6
        | PLAYER            = 7
        | BULLET            = 8
        | EXPLOSION         = 9
        | BANG              = 10
        | PARTICLE          = 11
        | HUD               = 12

    let EFFECT_PEW = 0
    let EFFECT_ASPLODE = 1
    let EFFECT_SMALLASPLODE = 1
    let rnd = new Random()
    let mutable viewContainer = List.empty<Entity>

    type World with

        (** 
         * Create Player
         *
         * @returns new player entity
         *)
        member this.CreatePlayer() =
            let pos = new Vector2(float32(GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width/2), 100.0f)
            this.CreateEntity("Player")
                .AddLayer((float32)Layer.PLAYER)
                .AddBounds(1.0f)
                .AddHealth(100.0f, 100.0f)
                .AddPosition(pos.X, pos.Y, 0.0f)
                .SetPlayer(true)
                .AddResource("images/fighter")

        (** 
         * Create Bullet
         *
         * @param x
         * @param y
         * @returns new bullet entity
         *)
        member this.CreateBullet(x, y) =
            this.CreateEntity("Bullet")
                .AddLayer((float32)Layer.BULLET)
                .AddExpires(2.0f)
                .AddBounds(0.1f)
                .AddVelocity(0.0f, -800.0f, 0.0f)
                .AddPosition(x, y, 0.0f)
                .AddSoundEffect(float32(EFFECT_PEW))
                .SetBullet(true)
                .AddResource("images/bullet")

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
            let pos = new Vector2(float32(x), float32(GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height-y))
            this.CreateEntity("Mine")
                .AddLayer((float32)Layer.DEFAULT)
                .AddBounds(0.25f)
                .AddVelocity(0.0f, float32(-velocity), 0.0f)
                .AddPosition(pos.X, pos.Y, 0.0f)
                .AddHealth(float32(health*10), float32(health*10))
                .SetMine(true)
                .AddResource("images/mine"+health.ToString())

        (** 
         * Create Life
         *
         * @param ordinal
         * @returns new life entity
         *)
        member this.CreateLife(ordinal) =
            let x = (GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width)-((ordinal+1) * 40)+87
            let y = 80
            let pos = new Vector2(float32(x), float32(GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height-y))
            this.CreateEntity("Life")
                .AddLayer((float32)Layer.DEFAULT)
                .AddPosition(pos.X, pos.Y, 0.0f)
                .AddLife(float32(ordinal))
                .AddResource("images/life")

        (** 
         * Create Status
         *
         * @returns new status entity
         *)
        member this.CreateStatus() =
            let x = (GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width/2)
            let y = 120
            let pos = new Vector2(float32(x), float32(GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height-y))
            this.CreateEntity("Status")
                .AddLayer((float32)Layer.DEFAULT)
                .AddPosition(pos.X, pos.Y, 0.0f)
                .AddResource("images/status")

        (** 
         * Create Enemy1
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy1() =
            let x = rnd.Next(GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width-35)
            let y = 45
            let pos = new Vector2(float32(x), float32(y))
            this.CreateEntity("Enemy1")
                .AddLayer((float32)Layer.ENEMY1)
                .AddBounds(1.0f)
                .AddPosition(pos.X, pos.Y, 0.0f)
                .AddVelocity(0.0f, float32(40), 0.0f)
                .AddHealth(10.0f, 10.0f)
                .SetEnemy(true)
                .AddResource("images/enemy1")

        (** 
         * Create Enemy2
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy2() =
            let x = rnd.Next(GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width-86)
            let y = 86
            let pos = new Vector2(float32(x), float32(y))
            this.CreateEntity("Enemy2")
                .AddLayer((float32)Layer.ENEMY2)
                .AddBounds(2.0f)
                .AddPosition(pos.X, pos.Y, 0.0f)
                .AddVelocity(0.0f, float32(30), 0.0f)
                .AddHealth(20.0f, 20.0f)
                .SetEnemy(true)
                .AddResource("images/enemy2")

        (** 
         * Create Enemy3
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy3() =
            let x = rnd.Next(GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width-160)
            let y = 160
            let pos = new Vector2(float32(x), float32(y))
            this.CreateEntity("Enemy3")
                .AddLayer((float32)Layer.ENEMY3)
                .AddBounds(3.0f)
                .AddPosition(pos.X, pos.Y, 0.0f)
                .AddVelocity(0.0f, float32(20), 0.0f)
                .AddHealth(40.0f, 40.0f)
                .SetEnemy(true)
                .AddResource("images/enemy3")

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
                .AddLayer((float32)Layer.EXPLOSION)
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddPosition(x, y, 0.0f)
                .AddResource("images/explosion")

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
                .AddLayer((float32)Layer.EXPLOSION)
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddPosition(x, y, 0.0f)
                .AddResource("images/explosion")

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
                .AddLayer((float32)Layer.EXPLOSION)
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddPosition(x, y, 0.0f)
                .AddResource("images/bang")

