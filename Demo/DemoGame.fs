module DemoGame

open System
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Input
open System.Collections.Generic


type Demo () as this =
    inherit Game()

    let ScreenWidth = 480
    let ScreenHeight = 720
    let mutable first = true
    let mutable spriteBatch = Unchecked.defaultof<SpriteBatch>
    do this.Content.RootDirectory <- "Content"
    let graphics = new GraphicsDeviceManager(this)
    do 
        graphics.PreferredBackBufferWidth <- ScreenWidth
        graphics.PreferredBackBufferHeight <- ScreenHeight
        graphics.ApplyChanges()

    (** Define Entities *)
    let bgdImage = lazy(this.Content.Load<Texture2D>("images/BackdropBlackLittleSparkBlack.png"))
    let mutable fpsRect = Rectangle(0, 0, 16, 24)

    let fntImage = lazy(this.Content.Load<Texture2D>("tom-thumb-white.png"))
    let bgdRect = Rectangle(0, 0, ScreenWidth, ScreenHeight)

    (** Draw a FPS in top left corner *)
    let DrawFps(spriteBatch:SpriteBatch, fps:float32)  =
        let ms = int fps
        let d0 = ms / 10        // 9x.xx
        let d1 = ms - d0*10     // x9.xx
        let fp = int((fps - float32 ms) * 100.f)
        let d2 = fp / 10        // xx.9x
        let d3 = fp - d2*10     // xx.x9

        fpsRect.Y <- 24
        fpsRect.X <- 16*(16+d0)
        spriteBatch.Draw(fntImage.Value, Vector2(0.f, 0.f), System.Nullable(fpsRect), Color.White)    
        fpsRect.X <- 16*(16+d1)
        spriteBatch.Draw(fntImage.Value, Vector2(16.f, 0.f), System.Nullable(fpsRect), Color.White)    
        fpsRect.X <- 224
        spriteBatch.Draw(fntImage.Value, Vector2(32.f, 0.f), System.Nullable(fpsRect), Color.White)    
        fpsRect.X <- 16*(16+d2)
        spriteBatch.Draw(fntImage.Value, Vector2(48.f, 0.f), System.Nullable(fpsRect), Color.White)    
        fpsRect.X <- 16*(16+d3)
        spriteBatch.Draw(fntImage.Value, Vector2(64.f, 0.f), System.Nullable(fpsRect), Color.White)    



    (** Initialize MonoGame *)
    override this.Initialize() =
        spriteBatch <- new SpriteBatch(this.GraphicsDevice)
        this.IsMouseVisible <- true
        base.Initialize()


    (** Load Resources *)
    override this.LoadContent() =
        first = false |> ignore

    (** Game Logic Loop *)
    override this.Update (gameTime) =
        //let delta = float32 gameTime.ElapsedGameTime.TotalSeconds  
        first = false |> ignore



    (** Game Graphic Loop *)
    override this.Draw(gameTime) =
        this.GraphicsDevice.Clear Color.Black
        spriteBatch.Begin()
        spriteBatch.Draw(bgdImage.Value, bgdRect, Color.White)   
        DrawFps(spriteBatch, 1.f / float32 gameTime.ElapsedGameTime.TotalSeconds)
        spriteBatch.End()
