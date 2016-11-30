namespace ShmupWarz 

open Entitas
open System
open System.Collections.Generic

type ParallaxStarRepeatingSystem(pool:Pool) =

    interface ISetPool with
       member this.SetPool(pool: Pool) =
            ()

    interface IExecuteSystem with
         member  this.Execute() =
            ()

    interface IInitializeSystem with
      member this.Initialize() =
            ()

