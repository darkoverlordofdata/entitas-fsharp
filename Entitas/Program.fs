namespace Demo
open DemoGame
[<AutoOpen>]
module Main =

    [<EntryPoint>]
    let main argv = 
        use game = new Demo()
        game.Run()
        0
