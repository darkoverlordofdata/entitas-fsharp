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

    open Microsoft.Xna.Framework
    open Microsoft.Xna.Framework.Graphics

    let rnd = new System.Random()

    type IGame = 
        abstract delta: float32
        abstract height: int
        abstract width: int


    type Layer = 
        static member DEFAULT with get() = 0
        static member BACKGROUND with get() = 1
        static member ENEMY3 with get() = 2
        static member ENEMY2 with get() = 3
        static member ENEMY1 with get() = 4
        static member PLAYER with get() = 5
        static member BATTLE with get() = 6

    type Effect = 
        static member EFFECT_PEW with get() = 0
        static member EFFECT_ASPLODE with get() = 1
        static member EFFECT_SMALLASPLODE with get() = 2

    //let ScreenWidth = 480
    //let ScreenHeight = 720
    type Pool with

        (** 
         * Create Player
         *
         * @returns new player entity
         *)
        member this.CreatePlayer(game:IGame) =
            this.CreateEntity("Player")
                .AddBounds(43.0f)
                .AddHealth(100.0f, 100.0f)
                .AddPosition(float32(game.width/2), 100.0f)
                .AddLayer(Layer.PLAYER)
                .AddScore(0)
                .SetPlayer(true)
                .AddView((game:?>Game).Content.Load<Texture2D>("images/fighter.png"))

        (** 
         * Create Bullet
         *
         * @param x
         * @param y
         * @returns new bullet entity
         *)
        member this.CreateBullet(game:IGame, x, y) =
            this.CreateEntity("Bullet")
                .AddBounds(5.0f)
                .AddVelocity(0.0f, -800.0f)
                .AddPosition(x, y)
                .AddExpires(2.0f)
                .AddSoundEffect(Effect.EFFECT_PEW)
                .AddLayer(Layer.BATTLE)
                .SetBullet(true)
                .AddView((game:?>Game).Content.Load<Texture2D>("images/bullet.png"))

        (** 
         * Create Mine
         *
         * @param health
         * @param x
         * @param y
         * @param velocity
         * @returns new mine entity
         *)
        member this.CreateMine(game:Game, health, x, y, velocity) =
            this.CreateEntity("Mine")
                .AddBounds(0.25f)
                .AddVelocity(0.0f, float32(-velocity))
                .AddPosition(x, y)
                .AddLayer(Layer.BATTLE)
                .AddHealth(float32(health*10), float32(health*10))
                .SetMine(true)
                .AddView(game.Content.Load<Texture2D>(sprintf "images/mine%s.png" (health.ToString())))

        (** 
         * Create Life
         *
         * @param ordinal
         * @returns new life entity
         *)
        member this.CreateLife(game:IGame, ordinal) =
            let x = float32((game.width/2)-((ordinal+1) * 40)+87)
            let y = 80.0f
            this.CreateEntity("Life")
                .AddPosition(x, y)
                .AddLayer(Layer.DEFAULT)
                .AddLife(float32(ordinal))
                .AddView((game:?>Game).Content.Load<Texture2D>("images/life.png"))

        (** 
         * Create Status
         *
         * @returns new status entity
         *)
        member this.CreateStatus(game:IGame) =
            let x = float32(game.width/2)
            let y = 120.0f
            this.CreateEntity("Status")
                .AddLayer(Layer.DEFAULT)
                .AddPosition(x, y)
                .AddView((game:?>Game).Content.Load<Texture2D>("images/status.png"))

        (** 
         * Create Enemy1
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy1(game:IGame) =
            let x = float32(rnd.Next(game.width))
            let y = float32(0)
            this.CreateEntity("Enemy1")
                .AddBounds(23.0f)
                .AddPosition(x, y)
                .AddVelocity(0.0f, 40.0f)
                .AddHealth(10.0f, 10.0f)
                .AddLayer(Layer.ENEMY1)
                .SetEnemy(true)
                .AddView((game:?>Game).Content.Load<Texture2D>("images/enemy1.png"))

        (** 
         * Create Enemy2
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy2(game:IGame) =
            let x = float32(rnd.Next(game.width))
            let y = float32(0)
            this.CreateEntity("Enemy2")
                .AddBounds(73.0f)
                .AddPosition(x, y)
                .AddVelocity(0.0f, 30.0f)
                .AddHealth(20.0f, 20.0f)
                .AddLayer(Layer.ENEMY2)
                .SetEnemy(true)
                .AddView((game:?>Game).Content.Load<Texture2D>("images/enemy2.png"))

        (** 
         * Create Enemy3
         *
         * @returns new enemy entity
         *)
        member this.CreateEnemy3(game:IGame) =
            let x = float32(rnd.Next(game.width))
            let y = float32(0)
            this.CreateEntity("Enemy3")
                .AddBounds(140.0f)
                .AddPosition(x, y)
                .AddVelocity(0.0f, 20.0f)
                .AddHealth(40.0f, 40.0f)
                .AddLayer(Layer.ENEMY3)
                .SetEnemy(true)
                .AddView((game:?>Game).Content.Load<Texture2D>("images/enemy3.png"))

        (** 
         * Create Huge Explosion
         *
         * @param x
         * @param y
         * @returns new explosion entity
         *)
        member this.CreateHugeExplosion(game:Game, x, y) =
            let scale = 1.0f
            this.CreateEntity("HugeExplosion")
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, -3.0f, false, true)
                .AddPosition(x, y)
                .AddLayer(Layer.BATTLE)
                .AddView(game.Content.Load<Texture2D>("images/explosion.png"))

        (** 
         * Create Big Explosion
         *
         * @param x
         * @param y
         * @returns new explosion entity
         *)
        member this.CreateBigExplosion(game:Game, x, y) =
            let scale = 0.5f
            this.CreateEntity("BigExplosion")
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, -3.0f, false, true)
                .AddPosition(x, y)
                .AddLayer(Layer.BATTLE)
                .AddView(game.Content.Load<Texture2D>("images/explosion.png"))

        (** 
         * Create Small Explosion
         *
         * @param x
         * @param y
         * @returns new explosion entity
         *)
        member this.CreateSmallExplosion(game:Game, x, y) =
            let scale = 0.1f
            this.CreateEntity("SmallExplosion")
                .AddExpires(0.5f)
                .AddScale(scale, scale)
                .AddScaleAnimation(float32(scale/100.0f), scale, -3.0f, false, true)
                .AddPosition(x, y)
                .AddLayer(Layer.BATTLE)
                .AddView(game.Content.Load<Texture2D>("images/explosion.png"))

