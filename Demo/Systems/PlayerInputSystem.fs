namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Bosco.ECS
open ShmupWarz
open UnityEngine

type PlayerInputSystem(world:World) =

    let group = world.GetGroup(Matcher.Player)
    let mutable timeToFire = 0.0f

    interface IExecuteSystem with
        member this.Execute() =

            let mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition)
            let mutable player = group.GetSingleEntity()
            player.position.x <- mousePosition.x
            player.position.y <- mousePosition.y

            let isFiring = Input.GetMouseButton(0) || Input.GetKey("z")
            player.isFiring <- true

            if isFiring then
                if timeToFire <= 0.0f then
                    world.CreateBullet(mousePosition.x+1.0f, mousePosition.y) |> ignore
                    world.CreateBullet(mousePosition.x-1.0f, mousePosition.y) |> ignore
                    timeToFire <- 0.1f

            if timeToFire > 0.0f then
                timeToFire <- timeToFire - Time.deltaTime
                if timeToFire < 0.0f then timeToFire <- 0.0f

