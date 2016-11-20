// Learn more about F# at http://fsharp.org
// See the 'F# Tutorial' project for more help.
module EntitasFsharp

open DemoGame

[<EntryPoint>]
let main argv = 
    use g = new Demo()
    g.Run()
    0