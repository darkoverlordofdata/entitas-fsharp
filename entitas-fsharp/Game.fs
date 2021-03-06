﻿namespace ShmupWarz

open Entitas
open System
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Input
 
type ShmupWarz (width, height, mobile) as this =
    inherit Game()
 
    let pixelFactor = if mobile then 2.0f else 1.0f
    let graphics = new GraphicsDeviceManager(this)
    do
        graphics.IsFullScreen <- mobile
        graphics.PreferredBackBufferWidth <- width
        graphics.PreferredBackBufferHeight <- height
        graphics.ApplyChanges()

    let spriteBatch = lazy(new SpriteBatch(this.GraphicsDevice))
    let world = new World(Component.TotalComponents)
    let bgdImage = lazy(this.Content.Load<Texture2D>("images/BackdropBlackLittleSparkBlack"))
    let fntImage = lazy(this.Content.Load<Texture2D>("images/tom-thumb-white"))
    let bgdRect = Rectangle(0, 0, width, height)
    let scaleX = (float32) (width / 320) // pixelFactor
    let scaleY = (float32) (height / 480) // pixelFactor
    let matrix = Matrix.CreateScale(scaleX, scaleY, 1.0f)
    let mutable fpsRect = Rectangle(0, 0, 16, 24)

    let createSystems(world:World) =
        world.Add(new MovementSystem(world))
        world.Add(new PlayerInputSystem(world, pixelFactor))
        world.Add(new SoundEffectSystem(world))
        world.Add(new CollisionSystem(world))
        world.Add(new EntitySpawningTimerSystem(world, int((float32 width)/pixelFactor)))
        world.Add(new ColorTweenSystem(world))
        world.Add(new ScaleTweenSystem(world))
        world.Add(new RemoveOffscreenShipsSystem(world))
        world.Add(new ViewManagerSystem(world, this.Content))
        world.Add(new ExpiringSystem(world))
        world.Add(new DestroySystem(world))
        world.Add(new RenderSystem(world))
 
    let drawSprite(spriteBatch:SpriteBatch) (entity:Entity) =
        let sprite = entity.View.GameObject:?>Texture2D
        let scaleX, scaleY = 
            if entity.HasScale then
                entity.Scale.X, entity.Scale.Y
            else
                1.0f, 1.0f
        let tint = 
            if entity.HasTint then
                entity.Tint.Color:?>Color
            else 
                Color.White
        let w = int(float32 sprite.Width * scaleX)
        let h = int(float32 sprite.Height * scaleY)
        let x = int(entity.Position.X) - w/2
        let y = int(entity.Position.Y) - h/2
        spriteBatch.Draw(sprite, Rectangle(x, y, w, h), tint)   
        
    (** Draw a FPS in top left corner *)
    let drawFps(spriteBatch:SpriteBatch, fps:float32)  =
        let ms = int fps
        let d0 = ms / 10        // 9x.xx
        let d1 = ms - d0*10     // x9.xx
        let fp = int((fps - float32 ms) * 100.f)
        let d2 = fp / 10        // xx.9x
        let d3 = fp - d2*10     // xx.x9

        fpsRect.Y <- 24
        fpsRect.X <- 16*(16+d0)
        spriteBatch.Draw(fntImage.Value, Vector2(0.f, 0.f), Nullable(fpsRect), Color.White)    
        fpsRect.X <- 16*(16+d1)
        spriteBatch.Draw(fntImage.Value, Vector2(16.f, 0.f), Nullable(fpsRect), Color.White)    
        fpsRect.X <- 224
        spriteBatch.Draw(fntImage.Value, Vector2(32.f, 0.f), Nullable(fpsRect), Color.White)    
        fpsRect.X <- 16*(16+d2)
        spriteBatch.Draw(fntImage.Value, Vector2(48.f, 0.f), Nullable(fpsRect), Color.White)    
        fpsRect.X <- 16*(16+d3)
        spriteBatch.Draw(fntImage.Value, Vector2(64.f, 0.f), Nullable(fpsRect), Color.White)    
         

    override this.Initialize() =
        this.IsMouseVisible <- true
        base.Initialize()
 
    override this.LoadContent() =
        this.Content.RootDirectory <- "Content"
        createSystems(world)
        world.Initialize()
        world.CreatePlayer() |> ignore
 
    override this.Update (gameTime) =
        if GamePad.GetState(PlayerIndex.One).Buttons.Back = ButtonState.Pressed then 
            this.Exit()
        RenderSystem.Stage <- []
        world.Execute((float32)gameTime.ElapsedGameTime.Milliseconds*0.001f)
 
    override this.Draw (gameTime) =
        this.GraphicsDevice.Clear Color.Black
        if mobile then
            spriteBatch.Value.Begin(transformMatrix = Nullable matrix)
        else
            spriteBatch.Value.Begin()
        spriteBatch.Value.Draw(bgdImage.Value, bgdRect, Color.White)   
        drawFps(spriteBatch.Value, 1.f / float32 gameTime.ElapsedGameTime.TotalSeconds)
        RenderSystem.Stage
        |> List.sortBy(fun e -> e.Layer.Ordinal)
        |> List.iter(drawSprite(spriteBatch.Value))
        spriteBatch.Value.End()
