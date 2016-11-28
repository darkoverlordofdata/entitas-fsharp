namespace ShmupWarz
module ShmupWarzModule =
// Learn more about F# at http://fsharp.org
// See the 'F# Tutorial' project for more help.


    [<EntryPoint>]
    let main argv = 
        let width = (int)(320.*1.5)
        let height = (int)(480.*1.5)
        use g = new ShmupWarz(width, height)
        g.Run()
        0 // return an integer exit code
