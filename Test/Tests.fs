module EntitasTest
open System    
open System.IO
open NUnit.Framework
open Entitas
open ShmupWarz


[<TestFixture>]
type Tests() =


    //1st entity - no components
    [<Test>]
    member this.Test001() =
        printfn "Hello"
        let pool = new Pool(Component.TotalComponents)
        printfn "Pool created"
        let player = pool.CreatePlayer()
        printfn "Entity created: %s" (player.ToString())
        Assert.AreEqual(0, 0)
    