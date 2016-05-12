module DemoGame

open System
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Input
open System.Collections.Generic
open Entitas
open ShmupWarz


type Demo () as this =
    inherit Game()

    let ScreenWidth = 480
    let ScreenHeight = 720
    let mutable deltaTime = 0.0f
    let mutable first = true
    let mutable spriteBatch = Unchecked.defaultof<SpriteBatch>
    let mutable systems = Unchecked.defaultof<Systems>
    let pool = new Pool(Component.TotalComponents)
    do this.Content.RootDirectory <- "Content"
    let graphics = new GraphicsDeviceManager(this)
    do 
        graphics.PreferredBackBufferWidth <- ScreenWidth
        graphics.PreferredBackBufferHeight <- ScreenHeight
        graphics.ApplyChanges()



    (** Define Entities *)
    let bgdImage = lazy(this.Content.Load<Texture2D>("images/BackdropBlackLittleSparkBlack.png"))
    let bgdRect = Rectangle(0, 0, ScreenWidth, ScreenHeight)


    (** Draw the sprite for an Entity *)
    member this.CreateSystems(pool:Pool):Systems =
        (new Systems()
        ).Add(pool.CreateSystem(new ViewManagerSystem(this, pool))
        ).Add(pool.CreateSystem(new MovementSystem(this, pool))
        //).Add(pool.CreateSystem(new PlayerInputSystem(this, pool))
        //).Add(pool.CreateSystem(new SoundEffectSystem(this, pool))
        //).Add(pool.CreateSystem(new CollisionSystem(this, pool))
        ).Add(pool.CreateSystem(new ExpiringSystem(this, pool))
        ).Add(pool.CreateSystem(new EntitySpawningTimerSystem(this, pool))
        //).Add(pool.CreateSystem(new ScaleTweenSystem(this, pool))
        ).Add(pool.CreateSystem(new RemoveOffscreenShipsSystem(this, pool))
        ).Add(pool.CreateSystem(new RenderPositionSystem(this, pool, spriteBatch))
        //).Add(pool.CreateSystem(new HealthRenderSystem(this, pool))
        //).Add(pool.CreateSystem(new ScoreSystem(this, pool))
        ).Add(pool.CreateSystem(new DestroySystem(this, pool)))


    (** Initialize MonoGame *)
    override this.Initialize() =
        spriteBatch <- new SpriteBatch(this.GraphicsDevice)
        this.IsMouseVisible <- true
        base.Initialize()
        systems <- this.CreateSystems(pool)
        systems.Initialize()


    (** Load Resources *)
    override this.LoadContent() =
        first = false |> ignore

    (** Game Logic Loop *)
    //override this.Update (gameTime) =


    (** Game Graphic Loop *)
    override this.Draw(gameTime) =
        this.GraphicsDevice.Clear Color.Black
        spriteBatch.Begin()
        spriteBatch.Draw(bgdImage.Value, bgdRect, Color.White)   
        deltaTime <- float32 gameTime.ElapsedGameTime.TotalSeconds  
        systems.Execute()
        //sprites
        //|> List.sortBy(fun e -> e.layer.ordinal) 
        //|> List.iter(fun e -> DrawSprite(e))
        spriteBatch.End()

    member this.delta with get() = deltaTime

    interface IGame with
        member this.delta with get() = deltaTime    
