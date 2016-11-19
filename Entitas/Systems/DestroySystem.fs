namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open System
open System.Collections.Generic
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Entitas


type DestroySystem(game: IGame, pool:Pool) =

    let group = pool.GetGroup(Matcher.Destroy)

    interface IExecuteSystem with
        member this.Execute() =

            for entity in group.GetEntities() do

                pool.DestroyEntity(entity)
            


