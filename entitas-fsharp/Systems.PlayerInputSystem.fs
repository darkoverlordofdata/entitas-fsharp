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
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Content
open System.Diagnostics

type PlayerInputSystem(world:World) =

    let group = world.GetGroup(Matcher.Player)
    let mutable timeToFire = 0.0f

    interface IExecuteSystem with
        member this.Execute() =

            let mouseState = Mouse.GetState()
            let mutable player = group.GetSingleEntity()
            player.position.x <- (float32)mouseState.X
            player.position.y <- (float32)mouseState.Y

            //let isFiring = (mouseState.LeftButton = ButtonState.Pressed) || Keyboard.GetState().IsKeyDown(Keys.Z)
            let isFiring = Keyboard.GetState().IsKeyDown(Keys.Z)
            player.isFiring <- true

            if isFiring then
                if timeToFire <= 0.0f then
                    world.CreateBullet((float32)(mouseState.X+27), (float32)mouseState.Y) |> ignore
                    world.CreateBullet((float32)(mouseState.X-27), (float32)mouseState.Y) |> ignore
                    timeToFire <- 0.1f

            if timeToFire > 0.0f then
                timeToFire <- timeToFire - world.deltaTime
                if timeToFire < 0.0f then timeToFire <- 0.0f

