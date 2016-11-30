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
                .AddPosition(pos.X, pos.Y)
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
            //GreenYellow = 0xadff2f
            let r = (float32) 0xad
            let g = (float32) 0xaf
            let b = (float32) 0x2f
            let m = 255.0f
            let a = 255.0f
            let s = 10.0f
            this.CreateEntity("Bullet")
                .AddLayer((float32)Layer.BULLET)
                .AddExpires(2.0f)
                .AddBounds(3.0f)
                .AddVelocity(0.0f, -800.0f)
                .AddPosition(x, y)
                .AddTint(Color.GreenYellow)
                .AddColorTween(r, m, s, g, m, s, b, m, s, a, m, s, true, true, true, true, true)
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
                .AddVelocity(0.0f, float32(-velocity))
                .AddPosition(pos.X, pos.Y)
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
                .AddPosition(pos.X, pos.Y)
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
                .AddPosition(pos.X, pos.Y)
                .AddResource("images/status")

        (** 
         * Create Enemy1
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy1(width, height) =
            let x = rnd.Next(width-35)
            let y = 45
            let pos = new Vector2(float32(x), float32(y))
            System.Diagnostics.Debug.WriteLine(sprintf "CreateEnemy1 %d %d" x width)
            this.CreateEntity("Enemy1")
                .AddLayer((float32)Layer.ENEMY1)
                .AddBounds(35.0f)
                .AddPosition(pos.X, pos.Y)
                .AddVelocity(0.0f, float32(40))
                .AddHealth(10.0f, 10.0f)
                .SetEnemy(true)
                .AddResource("images/enemy1")

        (** 
         * Create Enemy2
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy2(width, height) =
            let x = rnd.Next(width-86)
            let y = 86
            let pos = new Vector2(float32(x), float32(y))
            System.Diagnostics.Debug.WriteLine(sprintf "CreateEnemy2 %d %d" x width)
            this.CreateEntity("Enemy2")
                .AddLayer((float32)Layer.ENEMY2)
                .AddBounds(86.0f)
                .AddPosition(pos.X, pos.Y)
                .AddVelocity(0.0f, float32(30))
                .AddHealth(20.0f, 20.0f)
                .SetEnemy(true)
                .AddResource("images/enemy2")

        (** 
         * Create Enemy3
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy3(width, height) =
            let x = rnd.Next(width-320)
            let y = 160
            let pos = new Vector2(float32(x), float32(y))
            System.Diagnostics.Debug.WriteLine(sprintf "CreateEnemy3 %d %d" x width)
            this.CreateEntity("Enemy3")
                .AddLayer((float32)Layer.ENEMY3)
                .AddBounds(100.0f)
                .AddPosition(pos.X, pos.Y)
                .AddVelocity(0.0f, float32(20))
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
                .AddScaleTween(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddPosition(x, y)
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
            //LightGoldenrodYellow = 0xfafad2
            let r = (float32) 0xaa
            let g = (float32) 0xaa
            let b = (float32) 0xa2
            let m = 255.0f
            let a = 255.0f
            let s = 10.0f
            this.CreateEntity("BigExplosion")
                .AddLayer((float32)Layer.EXPLOSION)
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleTween(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddColorTween(r, m, s, g, m, s, b, m, s, a, m, s, true, true, true, true, true)
                .AddTint(Color.LightGoldenrodYellow)
                .AddPosition(x, y)
                .AddResource("images/explosion")

        (** 
         * Create Small Explosion
         *
         * @param x
         * @param y
         * @returns new explosion entity
         *)
        member this.CreateSmallExplosion(x, y) =
            let scale = 1.0f
            //PaleGoldenrod = 0xeee8aa
            let r = (float32) 0xae
            let g = (float32) 0xa8
            let b = (float32) 0xaa
            let m = 255.0f
            let a = 255.0f
            let s = -10.0f
            this.CreateEntity("SmallExplosion")
                .AddLayer((float32)Layer.EXPLOSION)
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleTween(float32(scale/100.0f), scale, float32(-3), false, true)
                .AddColorTween(r, m, s, g, m, s, b, m, s, a, m, s, true, true, true, true, true)
                .AddTint(Color.PaleGoldenrod)
                .AddPosition(x, y)
                .AddResource("images/bang")

