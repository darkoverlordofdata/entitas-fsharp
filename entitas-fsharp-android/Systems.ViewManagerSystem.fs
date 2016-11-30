namespace ShmupWarz
(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)
open Entitas
open System
open System.Collections.Generic
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Content


type DestroySystem(world:World) =

    let group = world.GetGroup(Matcher.AllOf(Matcher.Destroy))

    interface IExecuteSystem with
        member this.Execute() =
            for e in (group.GetEntities()) do
                world.DestroyEntity(e)
            


type ViewManagerSystem(world:World, content:ContentManager) =

    interface IInitializeSystem with
        member this.Initialize() =

            world.GetGroup(Matcher.Resource).OnEntityAdded.AddHandler(fun sender args ->

                let e = args.entity
                e.AddView(content.Load<Texture2D>(e.Resource.Name)) |> ignore
            )


    


    
