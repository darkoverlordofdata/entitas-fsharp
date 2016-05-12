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
            for e in (group.GetEntities()) do
                //if e.hasView then 
                //    let gameObject = (e.view.gameObject):?>Object
                //    Object.Destroy(gameObject)
                //    e.RemoveView() |> ignore
                pool.DestroyEntity(e)
            


type ViewManagerSystem(game: IGame, pool:Pool) =

    interface IInitializeSystem with
        member this.Initialize() =

            pool.GetGroup(Matcher.Resource).OnEntityAdded.AddHandler(fun sender args ->

                let entity = args.Entity

                entity.AddView((game:?>Game).Content.Load<Texture2D>(entity.resource.name)) |> ignore

                ()
            )


    


    
