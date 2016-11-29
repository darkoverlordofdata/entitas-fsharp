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
        //world.Add(new SoundEffectSystem(world)) Replaced in prefabs
        world.Add(new CollisionSystem(world))
        world.Add(new EntitySpawningTimerSystem(world, width, height))
        //world.Add(new ParallaxStarRepeatingSystem(world)) Repaced with static background
        //world.Add(new ColorTweenSystem(world)) Replaced with particles (ShrapnelController)
        world.Add(new ScaleTweenSystem(world))
        world.Add(new RemoveOffscreenShipsSystem(world))
        world.Add(new ViewManagerSystem(world, this.Content))
        world.Add(new ExpiringSystem(world))
        world.Add(new DestroySystem(world))
        world.Add(new RenderPositionSystem(world))
 
    let drawSprite(spriteBatch:SpriteBatch) (entity:Entity) =
        let sprite = entity.view.gameObject:?>Texture2D
        let scaleX, scaleY = 
            if entity.HasScale then
                entity.scale.x, entity.scale.y
            else
                1.0f, 1.0f
        let color = 
            if entity.HasColorTween then
                Color((int)entity.colorTween.redMin, (int)entity.colorTween.greenMin, (int)entity.colorTween.blueMin)
            else 
                Color.White
        let w = int(float32 sprite.Width * scaleX)
        let h = int(float32 sprite.Height * scaleY)
        let x = int(entity.position.x) - w/2
        let y = int(entity.position.y) - h/2
        spriteBatch.Draw(sprite, Rectangle(x, y, w, h), color)    

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
        viewContainer <- []
        world.Execute((float32)gameTime.ElapsedGameTime.Milliseconds*0.001f)
 
    override this.Draw (gameTime) =
        this.GraphicsDevice.Clear Color.Black
        spriteBatch.Value.Begin()
        spriteBatch.Value.Draw(bgdImage.Value, bgdRect, Color.White)   
        viewContainer
        |> List.sortBy(fun e -> e.layer.ordinal)
        |> List.iter(drawSprite(spriteBatch.Value))
        spriteBatch.Value.End()
