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

type RenderPositionSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Position, Component.View))

    let mutable scale1 = new ScaleComponent()
    let bgdRect = Rectangle(0, 0, game.width, game.height)
    let bgdImage = lazy( (game:?>Game).Content.Load<Texture2D>("images/BackdropBlackLittleSparkBlack.png") )
    let spriteBatch = lazy( new SpriteBatch((game:?>Game).GraphicsDevice) )
    let mutable sprites = []

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

    let rec remove_if l predicate =
        match l with
        | [] -> []
        | x::rest -> 
            if predicate(x) then 
                //removed <- true
                (remove_if rest predicate) 
            else 
                x::(remove_if rest predicate)

    interface IInitializeSystem with
        member this.Initialize() =
            spriteBatch.Force() |> ignore

            pool.GetGroup(Matcher.View).OnEntityAdded.AddHandler(fun sender evt ->
                sprites <- (evt.Entity :: sprites) |> List.sortBy (fun e -> e.layer.ordinal) 
            )

            pool.GetGroup(Matcher.View).OnEntityRemoved.AddHandler(fun sender evt ->
                sprites <- (remove_if sprites (fun e -> e.Id = evt.Entity.Id))
            )


    interface IExecuteSystem with
        member this.Execute() =

            (game:?>Game).GraphicsDevice.Clear Color.Black
            spriteBatch.Value.Begin()
            spriteBatch.Value.Draw(bgdImage.Value, bgdRect, Color.White)   

            //group.GetEntities() |> Array.iter (fun entity -> drawSprite(entity)) |> ignore

            sprites |> List.iter (fun entity -> drawSprite(entity)) |> ignore

            //|> Array.filter (fun entity -> entity.hasLayer)
            //|> Array.sortBy (fun entity -> entity.layer.ordinal) 
            //|> Array.iter   (fun entity -> drawSprite(entity))  
            //|> ignore
            spriteBatch.Value.End()

