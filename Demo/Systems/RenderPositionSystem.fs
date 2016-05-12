namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Input
open Entitas

type RenderPositionSystem(game: Game, pool:Pool) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Position, Component.View))

    let ScreenWidth = 480
    let ScreenHeight = 720
    let mutable scale1 = new ScaleComponent()
    let bgdRect = Rectangle(0, 0, ScreenWidth, ScreenHeight)
    let bgdImage = lazy( game.Content.Load<Texture2D>("images/BackdropBlackLittleSparkBlack.png") )
    let spriteBatch = lazy( new SpriteBatch(game.GraphicsDevice) )

    do
        scale1.x <- 1.0f
        scale1.y <- 1.0f

    let drawSprite(entity:Entity) = 
        let sprite = entity.view.sprite
        let scale = if entity.hasScale then entity.scale else scale1
        let w = float32(sprite.Width) * scale.x
        let h = float32(sprite.Height) * scale.y
        let x = entity.position.x - w/2.0f
        let y = entity.position.y - h/2.0f
        spriteBatch.Value.Draw(sprite, Rectangle(int(x), int(y), int(w), int(h)), Color.White)    

    interface IInitializeSystem with
        member this.Initialize() =
            spriteBatch.Force() |> ignore

    interface IExecuteSystem with
        member this.Execute() =

            game.GraphicsDevice.Clear Color.Black
            spriteBatch.Value.Begin()
            spriteBatch.Value.Draw(bgdImage.Value, bgdRect, Color.White)   
            group.GetEntities() |> Array.iter (fun entity -> drawSprite(entity)) |> ignore
            //|> Array.filter (fun entity -> entity.hasLayer)
            //|> Array.sortBy (fun entity -> entity.layer.ordinal) 
            //|> Array.iter   (fun entity -> drawSprite(entity))  
            //|> ignore
            spriteBatch.Value.End()

