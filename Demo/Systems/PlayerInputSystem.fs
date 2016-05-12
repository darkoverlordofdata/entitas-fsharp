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

type PlayerInputSystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.Player)
    let mutable timeToFire = 0.0f

    interface IExecuteSystem with
        member this.Execute() =

            let player = group.GetSingleEntity()

            let rec HandleKeys keys =
                match keys with
                | [] -> 
                    0
                | x :: xs ->
                    match x with
                    | Keys.Z -> 
                        timeToFire <- timeToFire - game.delta
                        if timeToFire <= 0.0f then
                            pool.CreateBullet(player.position.x-27.f, player.position.y) |> ignore
                            pool.CreateBullet(player.position.x+27.f, player.position.y) |> ignore
                            timeToFire <- 0.1f
                        HandleKeys xs 
                    | _ -> 
                        HandleKeys xs 


            HandleKeys (Keyboard.GetState().GetPressedKeys() |> Array.toList) |> ignore
            let position = 
                let pos = (game:?>Game).Window.Position
                let x = float32(Mouse.GetState().X-pos.X)
                let y = float32(Mouse.GetState().Y-pos.Y)
                match Mouse.GetState().LeftButton with
                | ButtonState.Pressed ->
                    timeToFire <- timeToFire - game.delta
                    if timeToFire <= 0.0f then
                        pool.CreateBullet(x-27.f, y) |> ignore
                        pool.CreateBullet(x+27.f, y) |> ignore
                        timeToFire <- 0.1f
                    ()

                | ButtonState.Released ->
                    ()

                | _ ->
                    ()

            ()

