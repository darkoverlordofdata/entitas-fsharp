namespace ShmupWarz

open Entitas
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Input
 
type ShmupWarz (width, height) as this =
    inherit Game()
 
    let graphics = new GraphicsDeviceManager(this)
    do
        graphics.IsFullScreen <- false
        graphics.PreferredBackBufferWidth <- width
        graphics.PreferredBackBufferHeight <- height
        graphics.ApplyChanges()

    let spriteBatch = lazy(new SpriteBatch(this.GraphicsDevice))
    let world = new World(Component.TotalComponents)
    let bgdImage = lazy(this.Content.Load<Texture2D>("images/BackdropBlackLittleSparkBlack"))
    let bgdRect = Rectangle(0, 0, width, height)

    let createSystems(world:World) =
        world.Add(new MovementSystem(world))
        world.Add(new PlayerInputSystem(world))
        world.Add(new SoundEffectSystem(world))
        world.Add(new CollisionSystem(world))
        world.Add(new EntitySpawningTimerSystem(world, width, height))
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

//        let color = 
//            if entity.HasColorTween then
//                Color((int)entity.ColorTween.RedMin, (int)entity.ColorTween.GreenMin, (int)entity.ColorTween.BlueMin)
//            else 
//                Color.White
        let w = int(float32 sprite.Width * scaleX)
        let h = int(float32 sprite.Height * scaleY)
        let x = int(entity.Position.X) - w/2
        let y = int(entity.Position.Y) - h/2
        spriteBatch.Draw(sprite, Rectangle(x, y, w, h), tint)    

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
        spriteBatch.Value.Begin()
        spriteBatch.Value.Draw(bgdImage.Value, bgdRect, Color.White)   
        RenderSystem.Stage
        |> List.sortBy(fun e -> e.Layer.Ordinal)
        |> List.iter(drawSprite(spriteBatch.Value))
        spriteBatch.Value.End()
