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
    let pool = new Pool(Component.TotalComponents)
    let systems = lazy( new Systems() )

    do this.Content.RootDirectory <- "Content"
    let graphics = new GraphicsDeviceManager(this)
    do 
        graphics.PreferredBackBufferWidth <- ScreenWidth
        graphics.PreferredBackBufferHeight <- ScreenHeight
        graphics.ApplyChanges()

    (** Draw the sprite for an Entity *)
    member this.CreateSystems(pool:Pool):Systems =
        (systems.Force()
        ).Add(pool.CreateSystem(new RenderPositionSystem(this, pool))
        ).Add(pool.CreateSystem(new MovementSystem(this, pool))
        ).Add(pool.CreateSystem(new PlayerInputSystem(this, pool))
        ).Add(pool.CreateSystem(new SoundEffectSystem(this, pool))
        ).Add(pool.CreateSystem(new CollisionSystem(this, pool))
        ).Add(pool.CreateSystem(new ExpiringSystem(this, pool))
        ).Add(pool.CreateSystem(new EntitySpawningTimerSystem(this, pool))
        ).Add(pool.CreateSystem(new ScaleTweenSystem(this, pool))
        ).Add(pool.CreateSystem(new RemoveOffscreenShipsSystem(this, pool))
        ).Add(pool.CreateSystem(new HealthRenderSystem(this, pool))
        ).Add(pool.CreateSystem(new ScoreSystem(this, pool))
        ).Add(pool.CreateSystem(new DestroySystem(this, pool)))


    (** Initialize MonoGame *)
    override this.Initialize() =
        this.IsMouseVisible <- true
        base.Initialize()
        this.CreateSystems(pool).Initialize()


    (** Game Loop*)
    override this.Draw(gameTime) =
        deltaTime <- float32 gameTime.ElapsedGameTime.TotalSeconds  
        systems.Value.Execute()

    interface IGame with
        member this.delta with get() = deltaTime    
        member this.height with get() = ScreenHeight    
        member this.width with get() = ScreenWidth    
