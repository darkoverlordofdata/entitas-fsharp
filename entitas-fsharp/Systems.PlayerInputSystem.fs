namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Entitas
open ShmupWarz
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Input
open Microsoft.Xna.Framework.Input.Touch
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Content
open System.Diagnostics

type PlayerInputSystem(world:World, pixelFactor) =

    let group = world.GetGroup(Matcher.Player)
    let mutable timeToFire = 0.0f

    interface IExecuteSystem with
        member this.Execute() =

            let kbState = Keyboard.GetState()
            let mouseState = Mouse.GetState()
            let touchState = TouchPanel.GetState()
            let mutable player = group.GetSingleEntity()

            if touchState.Count > 0 then
                player.Position.X <- (float32)touchState.[0].Position.X/pixelFactor
                player.Position.Y <- (float32)touchState.[0].Position.Y/pixelFactor
            else 
                player.Position.X <- (float32)mouseState.X
                player.Position.Y <- (float32)mouseState.Y

            let isFiring = touchState.Count > 0 ||
                            kbState.IsKeyDown(Keys.Z) ||
                            mouseState.LeftButton = ButtonState.Pressed 
                            
            player.IsFiring <- true

            if isFiring then
                if timeToFire <= 0.0f then
                    world.CreateBullet(player.Position.X+27.0f, player.Position.Y) |> ignore
                    world.CreateBullet(player.Position.X-27.0f, player.Position.Y) |> ignore
                    timeToFire <- 0.1f

            if timeToFire > 0.0f then
                timeToFire <- timeToFire - world.deltaTime
                if timeToFire < 0.0f then timeToFire <- 0.0f

