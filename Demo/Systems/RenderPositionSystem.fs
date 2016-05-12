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

type RenderPositionSystem(game: IGame, pool:Pool, spriteBatch:SpriteBatch) =

    let group = pool.GetGroup(Matcher.AllOf(Component.Position, Component.View))

    let mutable scale1 = new ScaleComponent()
    do
        scale1.x <- 1.0f
        scale1.y <- 1.0f


    interface IExecuteSystem with
        member this.Execute() =
            for entity in group.GetEntities() do
                let sprite = entity.view.sprite
                let scale = if entity.hasScale then entity.scale else scale1
                let w = float32(sprite.Width) * scale.x
                let h = float32(sprite.Height) * scale.y
                let x = entity.position.x - w/2.0f
                let y = entity.position.y - h/2.0f

                spriteBatch.Draw(sprite, Rectangle(int(x), int(y), int(w), int(h)), Color.White)    

