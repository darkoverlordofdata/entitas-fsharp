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
    let lazyPlayer = lazy ( pool.CreatePlayer(game:?>Game) )
    let mutable timeToFire = 0.0f

    interface IExecuteSystem with
        member this.Execute() =

            let player = lazyPlayer.Force()

            let shoot() =
                timeToFire <- timeToFire - game.delta
                if timeToFire <= 0.0f then
                    pool.CreateBullet(game:?>Game, player.position.x-27.f, player.position.y) |> ignore
                    pool.CreateBullet(game:?>Game, player.position.x+27.f, player.position.y) |> ignore
                    timeToFire <- 0.1f


            let rec HandleKeys keys =
                match keys with
                | [] -> ()
                | x :: xs ->
                    if x = Keys.Z then shoot()
                    HandleKeys xs 


            HandleKeys (Keyboard.GetState().GetPressedKeys() |> Array.toList) |> ignore
            let pos = (game:?>Game).Window.Position
            let x = float32(Mouse.GetState().X-pos.X)
            let y = float32(Mouse.GetState().Y-pos.Y)
            player.position.x <- x
            player.position.y <- y
            match Mouse.GetState().LeftButton with
            | ButtonState.Pressed ->
                shoot()

            | _ -> ()


