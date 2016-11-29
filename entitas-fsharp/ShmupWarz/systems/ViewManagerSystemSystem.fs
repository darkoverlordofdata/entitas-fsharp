namespace ShmupWarz 

open Entitas
open System
open System.Collections.Generic

type ViewManagerSystem(pool:Pool) =

    interface IExecuteSystem with
         member  this.Execute() =
            ()

    interface IInitializeSystem with
      member this.Initialize() =
            ()

